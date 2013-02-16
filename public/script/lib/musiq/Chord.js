/**
 * the MUSIQ.js chord class
 * 
 * @param notes : a simple array of integers representing the midi notes
 * @param descriptor : an object describing the chord
 * @param tonic : the current tonic Note oject
 * @param relative : if the chord should be interpreted as  relative, 
 *                   i.e. can be positioned anywhere
 *                   on the musical scale (Fretboard for guitar)
 */

var Chord = function( notes, descriptor, tonic, relative ) {
    
    if( descriptor.hasOwnProperty( 'names') ){
        // notes in relative position
        this.relNotes = descriptor.notes;
        this.names = descriptor.names;
        this.longName = descriptor.longName;
        
        //this.name = this.names[0];
    }
    
    
    this.notes = notes;
    
    
    // if the chord is abstract, it has no tonic.
    if( tonic ) this.abstract = false;
    else        this.abstract = true;
    
    // if the chord is relative, it can be positioned anywhere
    // on the musical axis
    this.relative = relative || false;
    // override this if the tonic is relative
    this.relative = tonic.relative;
    
    // this should be a Note object
    this.tonic = tonic || new Note(0);
};

/**
 * constructs a Chord object from a notation like Cmaj7
 * 
 * TODO: implement this method properly so it supports all accidentals
 */

Chord.fromNotation = function( name, octave ){
    
    // check if it's a valid notation, at least the note part
    
    var matches = MUSIQ.isValidChord( name );
    
    //console.log( matches );
    
    // no chord found?
    if( !matches ){
        console.warn("Chord not found : " + name);
        return;
    }
    
    var tonic = Note.fromNotation( matches[1] + (matches[2] || "") );
    //console.log( tonic );
    var notation = matches[3];
    
    
    if( !notation || notation.length == 0){
        // set the default maj notation
        notation = 'M';
    }
    //console.log( notation );
    
    // this should be only one!
    var matchedChords = _(MUSIQ.chords).filter(function(chord){
        return _(chord.names).some(function(name){ return name == notation });
    });
    
    //console.log("matched chords for " + notation );
    //console.log(matchedChords);
    
    // we should check that the specific notation does not match
    // more than 1 chord. if so, the definition in MUSIQ.chords 
    // contains duplicates
    console.assert( matchedChords.length == 1);
    
    // get the transposed notes
    var transNotes = _(matchedChords[0].notes).map(function(note){
        return (new Note(note)).transpose(tonic.pos).toRelative().pos;
    })
    
    console.log("Transnotes:");
    console.log( transNotes ); 
    
    // find the name in the chord names array
    var chord = new Chord( transNotes, matchedChords[0], tonic );
    
    return chord;
};

/**
 * build a chord from individual notes
 * these can be note objects or just a list of integers
 * @param notes     : a simple array of integer notes
 * @param inversion : the number of the inversion, 
 *                    0 = root position, 1 = first inversion, 2 = second inversion, ...
 * @returns an array of matching chords
 */
Chord.fromNotes = function( notes, inversion ){
    
    var ret = [];
    
    // make a nice array of Note objects from the notes parameter
    var noteObjects = _.map( notes, function(note) {
        return new Note(note);
    });
    
    //console.log( "fromNotes with inversion " + inversion );
    
    if (_.isNumber(inversion) && inversion > -1) {
        // specified an inversion, we first determine the tonic

        // sort the notes from lowest to highest
        var relNotes = notes.slice();

        relNotes.sort(function(a, b) { return a - b; });

        //_.each(relNotes, function(item){console.log((new Note(item).notation()))});
        
        // determine the tonic - the lowest note
        var tonic = relNotes[inversion];

        //var uniqueNotes = _.uniq(relNotes);

        // make the notes relative to the tonic
        relNotes = _.map(relNotes, function(note) {
            return note - tonic;
        });
        
        //console.log(relNotes);
        
        // wrap negative notes
        relNotes = _.map( relNotes, function(note){
            if( note < 0 ){
                // move it enough octaves up
                var n = note - (Math.floor( note / 12 ) * 12);
                console.assert( n >= 0);
                return n;
            } else {
                return note;
            }
        });
        
        //console.log(relNotes);
        
        // now find the chords for all the different possible inversions

        //console.log(relNotes);


        // get the notes within two octaves of the tonic
        var relNotes = _.map(relNotes, function(note) {
            if( note < 0 ) {
                console.log("ERROR: negative note! ");
            }
            else if (note < 12) {
                return note;
            }
            else {
                // filter out special notes, like 9th, 11th and 13th
                var relNote = note % 12;
                if (MUSIQ.chordExtensionNotes.indexOf(relNote) > -1) {
                    return relNote + 12;
                }
                else {
                    return relNote;
                }
            }

        });

        //console.log(relNotes);

        //console.log( relNotes );
        // now remove duplicates
        relNotes = _.uniq(relNotes);
        
        // sort the notes
        relNotes.sort(function(a, b) { return a - b; });

        //console.log(inversion + " : " + tonicNote.simpleNotation() + " [ " + relNotes + " ]");

        // find chords in the descriptor list that match
        var matchedChordDescrs = _.filter(MUSIQ.chords, function(item) {
            // remove the optional 5th chord
            
            // TODO: change this so it can optionally remove any note and
            // still match, not only 5th, but also 7th, 9th and 11th
            if( item.optional ){
                // match both to the item.notes array and the one without 7
                // not array without the 5th (remove the 7 from the array)
                var notesWOFifth = _.without(item.notes, 7);
                
                return _.isEqual(item.notes, relNotes ) || _.isEqual(notesWOFifth, relNotes);
            } else {
                return _.isEqual(item.notes, relNotes);
            }
        }, this);
        
        // filter duplicates
        matchedChordDescrs = _.uniq(matchedChordDescrs);


        

        var matchedChords = _.map( matchedChordDescrs, function(item){
            // add the matched chords to the return array
            return new Chord(noteObjects, item, new Note(tonic));
        } );
        
        // only log this if we found a matched chord
        if( matchedChords.length > 0){
           // var tonicNote = new Note(tonic);
            
            //console.log(tonicNote.simpleNotation() + " [ " + relNotes + " ]");
            //console.log( "found in inversion " + inversion  + "(" + tonicNote.simpleNotation() + ") - [ " + relNotes + "]");
            //console.log(notes);
            //console.log(relNotes);
        }
        
        //console.log( matchedChords );
        
        return matchedChords;

    }
    // no inversion specified
    else {
        // simple list of chord tonics to check if we have looked for
        // specific chords already
        var chordTonics = [];
        for (var i = 0; i < notes.length; i++) {
            // add matched chords from all inversions of this chord
            var curNote = new Note(notes[i]);
            
            if( chordTonics.indexOf(curNote.toRelative().pos) > -1){
                continue;
            }
            
            chordTonics.push(curNote.toRelative().pos);
            
            var matchedChords = Chord.fromNotes(notes, i);
            
            
            ret = ret.concat(matchedChords);
        }
        
        //console.log( chordTonics);
        
        // remove any duplicates
        
        
        //console.log( ret );
        
        if( !(ret.length > 0) ){
            //console.log("Chord not found!");
        }
        return ret;
    }
    
};

/** instance methods **/

/**
 * get the chord in proper notation
 */
Chord.prototype.notation = function() {
    if( this.abstract ){
        return this.names[0];
    } else {
        return this.tonic.simpleNotation() + this.names[0];
    }
};

/**
 * get the name of the chord in long, readable notation
 */
Chord.prototype.longNotation = function() {
    if( this.abstract ){
        return this.longName;
    } else {
        return this.tonic.simpleNotation() + " " + this.longName;
    }
};

/**
 * transpose a chard with a certain interval and return the new transposed
 * chord
 */
Chord.prototype.transpose = function(interval) {
    // TODO; implement method
    // transpose notes
    this.notes = _(this.notes).map(function(note){
        return note.transpose( interval );
    });
    // transpose tonic
    this.tonic = this.tonic.transpose( interval );
};

/**
 * returns the absolute notes
 * 
 * save it in a local variable _notes for easy access
 */
Chord.prototype.noteObjects = function(){
    
    // just return the simple list of notes
    if( this._notes ) return this._notes;
    
    this._notes =  _.map(  this.relNotes, 
                            function(note){ 
                                console.log(this.tonic.pos+note);
                                return new Note(this.tonic.pos+note); 
                            }, this );
    console.log("NoteObjects");
    console.log(this._notes);
    return this._notes;
};

/**
 * check if the chord can be described by a simple name
 */
Chord.prototype.hasName = function(name){
    return _(this.names).find(function(n){
        return name == n;
    });
}

/**
 * a simple toString function that gives us the notation of all the notes
 */
Chord.prototype.toString = function(){
    var ret = "[ ";
    _.each(this.notes, function(item){ret += (new Note(item))});
    return ret;
};

/**
 * the minimal notes needed to form this chord
 * @returns an array with the notes that are minimally necessary
 * to form this chord
 */
Chord.prototype.minNotes = function(){
    
    return _(this.notes).filter(function(note){
        return !_(this.optional).contains(note);
    });
}

Chord.prototype.type = function(){
    return "Chord";
}


/**
 * the plural class, simply to expose some functions in a more
 * logical way
 */
var Chords = {};
Chords.fromNotes = Chord.fromNotes;
Chords.fromNotation = Chord.fromNotation;

