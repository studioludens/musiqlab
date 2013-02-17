/**
 * GuitarChord - a class for representing a guitar chord
 * 
 * 
 * 
 * @param guitar : a Guitar object on which this chord is played
 * @param chord : a Chord object
 * @param notes : a collection of GuitarNote objects (optional)
 */

var GuitarChord = function( guitar, chord, notes  ){
    
    this.guitar = guitar;
    this.chord = chord;
    this.notes = notes;
    
    this._barre = 0;
};

/**
 * maximum finger stretch
 */
GuitarChord.MAX_STRETCH = 4;


/**
 * finds all variations of a particular chord with a specific
 * tonic. All these 
 * 
 * @param guitar : the guitar object (with specific tuning)
 * @param chord : the Chord object to find specific GuitarChords for
 * @param base : the Base note we want to base the chord on (GuitarNote)
 * @param options : an object specifying more options:
 *                  {
 *                      upPreference: false
 *                      maxFingerStretch: 2
 *                      maxDifficulty: 10 
 *                  }
 * 
 * @returns an array of GuitarChord objects
 */
GuitarChord.fromChordAndBase = function( guitar, chord, base ){
    
    // from the base, walk up the neck, fret by fret
    
    var baseString = base.pos[0];
    var baseFret = base.pos[1];
    
    var numNotes = chord.notes.length - (chord.optional ? chord.optional.length : 0);
    
    
    /* a list of all five fingers the user has in his left hand
       In case you're Django, please remove the last three
       items from the list
       
       This will be used to determine the 'easyness' of the chord
       
    */
    
    /**
     * how easy it is to play the chord.
     * 
     * these factors add weight:
     * - each note played
     *   + 1 for each note played
     * - the distance of each note relative to the previous note
     *   + 1 for each extra fret distance between two notes
     * - the distance of the note to the base note
     * - the number of fingers used
     *   + 1 for each finger used, + 100 if more than all fingers are used (impossible)
     * 
     * lower is better, no note has ease 0,
     * 1 note at least ease 1
     */
    var ease = 0;
    
    var fingersUsed = [ false, false, false, false, false];
    // exit if we have more required notes than possible frets to
    
    
    //var foundNotes = [];
    
    var lookup = function( chordNotes, baseString, foundNotes){
        
        if( baseString + numNotes > guitar.strings.length){
            //console.warn( "Not enough strings to find notes on!" + (guitar.strings.length - baseString));
            return;
        }
    
        for( var i = baseString; i < guitar.strings.length ; i++){
            // get all notes on the string that match the chord 
            var stringNotes = _(guitar.notes[i]).filter(function(note){
                return _(chordNotes).contains(note.relPos());
            });

            // and are close enough to the base note
            stringNotes = _(stringNotes).filter(function(note){
                if( Math.abs( note.distanceTo(base)[1] ) <= GuitarChord.MAX_STRETCH ){
                    console.log("Found note " + note.simple() + " on pos [" + note.pos + "]");
                    return true;
                }
            });
            
            // if we have notes left, these 
            // are potentially interesting
            if( !stringNotes || stringNotes.length == 0 ){
                console.log("No notes on string found!");
            } else if( stringNotes.length == 1 ){
                //console.log("One matching note on string found!");
                //console.log( stringNotes );
                foundNotes.push( stringNotes );
                
            } else {
                // more notes found!
                console.log( stringNotes.length + " matching note on string found!");
                //console.log( stringNotes );
                
                // for now, return the combined array
                foundNotes.push( stringNotes );
                
            }
        };
        
        // check if we have really found all notes in the chord
        
        var lowestFret = 1000;
        var highestFret = -1;
        
        var stringNotes = _(foundNotes).each(function(notes){
            lowestFret = Math.min(notes[0].pos[1], lowestFret);
            highestFret = Math.max(notes[0].pos[1], highestFret);
        });
        
        console.log( "Biggest distance between frets: " + highestFret-lowestFret);
        
        return foundNotes;
        
    };
    
    var chordNotes = lookup( chord.notes, baseString, []);
    // look them up - recursively
    //console.log("FoundNotes:");
    //console.log(foundNotes);
    /*_(chordNotes).reduce(function(memo, note, index, list){
        // first item
        if( !memo ) memo = [];
        memo.push(note);
    })*/
    
    // check if we have found all the notes
    
    // can we calculate this recursively
    return chordNotes;
};

/**
 * finds all variations of a particular chord on the guitar neck
 * 
 * the chord should be relative
 * - find the tonic on each fret
 */
GuitarChord.fromChord = function( guitar, chord ){
    
    if( !chord.relative ){
        console.warn("Relative chord not allowed!");
        return;
    }
    
    // get all base (lowest) notes
    var baseNotes = [];
    
    // we only have to check the bottom four strings
    
    _(guitar.notes).each(function(string_notes, str_num){
        _(string_notes).each(function(note, fret_num){
            //console.log(note);
            if( chord.contains(note.note) ){
                //console.log(note);
                baseNotes.push( note );
            }
        });
    });
    
    console.log(baseNotes);
    
    // get all possible chord variations for each chord
    return _.compact( _(baseNotes).map(function(base){
        var guitarChord = GuitarChord.fromChordAndBase( guitar, chord, base );
        return guitarChord;
    }));
};

/**
 * check if a guitar chord is valid
 * this is when all notes can be matched
 * with a note in the chord object.
 * 
 * 
 * 
 * @returns true : if the chord is valid
 */
GuitarChord.prototype.valid = function(){
    
};

/**
 * barre - returns an integer representing how
 * many fingers can be played barre.
 * 
 * TODO: test
 */
GuitarChord.prototype.barre = function(){
    // check highest strings and recurse down, adding as we go
    var same = 0;
    var lastFret = _(this.guitar.frets).last();
    
    _(this.notes).pluck('fret').reverse().each(function(item){
        if( item == lastFret ) same++;
    });
    
    console.log(same);
    return same;
    
}