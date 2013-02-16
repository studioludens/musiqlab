/**
 * the MUSIQ.js Note object
 * 
 * @param pos : the midi position of the note
 * @param relative : a boolean, true if the note is relative (it doesn't have
 *                   an octave). if relative is true, pos should not be larger
 *                   than 12
 */
var Note = function( pos, relative ){
    this.pos = pos;
    this.relative = relative || false;
    
    // if the note is relative, decrease the position to fall inbetween
    // 0 <= pos < 12
    if( this.relative ){
        this.pos = this.pos % 12;
    }
};


 /**
  * get a new note object from the notation
    @param : notation in the form C4, Bb6 etc
             where the number is the octave
             this should also match lowerCase notations
 */
Note.fromNotation = function( notation ){
     
    var ret;
    // split the notation
    if( !notation ) return;
    
    var matches = MUSIQ.isValidNote( notation );
    
    //console.log( "Note.fromNotation matches : " + notation );
    //console.log( matches );
    
    // no chord found?
    if( !matches ){
        console.warn("Note not found : " + name);
        return;
    }
    
    var note = matches[1];
    var acc = (matches[2] || "").replace("♭","b").replace("♯","#");;
    var octave = +matches[3] || 0 ;
    
    
    
    /*
    var items = notation.split(/(\d+)/);
    
    if( items.length > 3 ){
        // more than one note, return 
        console.log("more than one note!");
        console.log(items);
        
    } else {*/
        // convert octave to integer, defaulting on 0 (if parsing fails)
        
        // if no octave is specified
        // but if a 0 is explicitly mentioned (like in C0)
        // it's not a relative note
        
        var relative = octave < 1;
        if( matches[3] == "0" ) relative = false;
        
        //console.log(" Note " + notation + " octave = " + octave + ", relative = " + relative + ", acc = " + acc);
        
        // just one note
        //console.log(items);
        
        // get note position 
        var nn = note.toUpperCase();
        var npos = MUSIQ.notePositions[ MUSIQ.noteNames.indexOf( nn ) ];
        
        //console.log( npos );
        
        // get accidental position
        var acc = MUSIQ.accidentals.indexOf( acc ) - 3;
        
        // error case
        if( acc < -3 || typeof npos == 'undefined' || npos < 0 ){
            // sorry, nothing we can do
            console.warn("ERROR: note not found (" + notation + ")");
            return;
        }
        
        // build the note together with the octave
        ret = new Note( npos + acc + octave * 12, relative );
    //}
    
    return ret;
        
};

/**
 * make a note object from a position
 */
Note.fromPos = function( pos ){
    console.log( pos );
    return new Note( pos );
};


/**
 * the distance (in semitones) to another note
 * this is the number notation of the interval
 */
Note.distance = function( note1, note2 ){
  return note2.pos - note1.pos;  
};

/**
 * returns the relative distance from note1 to note2
 */
Note.relativeDistance = function( note1, note2){
  var rel = note2.toRelative().pos - note1.toRelative().pos;
  return ( rel < 0 ) ? rel + 12 : rel;
};

/**
 * returns the shortest distance from note1 to note2
 */
Note.shortestDistance = function( note1, note2 ){
    return 0;
};

/**
 * returns the shortest relative distance
 */
Note.shortestRelativeDistance = function( note1, note2 ){
    return 0;
}; 


/**
 * the interval between the notes
 */
Note.interval = function( note1, note2 ){
    return new Interval( Note.distance(note1, note2) );
};

Note.signature = function( note ){
    return MUSIQ.signatures[note.toRelative().pos];
};

Note.cofPosition = function( note ){
    return MUSIQ.cofPositions[note.toRelative().pos];
};



/**
 * get the proper notation for a note
 */
Note.notation = function( note, flat ){
    // check flat
    var ret = "";
    
    if( flat ){
        ret = MUSIQ.flatNames[note.toRelative().pos] + (!note.relative ? note.octave() : "");
    } else {
        ret = MUSIQ.sharpNames[note.toRelative().pos] + (!note.relative ? note.octave() : "");
    }
    
    // experimental : replace b with ♭ and # with ♯
    // should probably check for unicode support?
    return ret.replace("b","♭").replace("#","♯");
    
};

/**
 * get a simple notation for a note, i.e. C#
 */
Note.simpleNotation = function( note, flat ){
   
   n = note;
   var ret;
   
   if( !(note instanceof Note) ) n = new Note(note);
   
   if( flat ){
        ret = MUSIQ.flatNames[n.toRelative().pos];
    } else {
        ret = MUSIQ.sharpNames[n.toRelative().pos];
    } 
    
    // experimental : replace b with ♭ and # with ♯
    // should probably check for unicode support?
    return ret.replace("b","♭").replace("#","♯");
};



/**
 * transpose a note with an interval
 */
Note.transpose = function( note, interval ){
    // check if it's an interval object
    if( _.isNumber( interval ) ){
        return new Note(note.pos + interval);
    } else if(_.isString( interval )) {
        return new Note(note.pos + Interval.fromName(interval).distance);
    } else {
        // let's hope it's an interval object
        return new Note(note.pos + interval.distance);
    }
};

/**
 * class methods
 */
Note.prototype.distance = function( note ){
    return Note.distance( this, note );
};

Note.prototype.relativeDistance = function( note ){
    return Note.relativeDistance( this, note);
};

Note.prototype.shortestDistance = function( note ){
    return Note.shortestDistance( this, note);
};

Note.prototype.interval = function( note ){
    return Note.interval( this, note);
};

Note.prototype.signature = function() {
    return Note.signature( this );
};

Note.prototype.cofPosition = function() {
    return Note.cofPosition( this );
};

Note.prototype.notation = function(flat) {
    return Note.notation(this, flat);
};

Note.prototype.simple = 
Note.prototype.simpleNotation = function(flat){
    return Note.simpleNotation(this, flat);
};

/**
 * can this note have the following name?
 * 
 * compensates for accidentals, i.e. 
 */
 Note.prototype.hasName = function( name ){
     return Note.fromNotation(name) && this.pos == Note.fromNotation(name).pos;
 }

/**
 * the octave the note is in
 */
Note.prototype.octave = function( ){
    return Math.floor(this.pos/12) || 0;
};

/**
 * convert the note to a relative position
 */
Note.prototype.toRelative = function( ){
    return new Note(this.pos - this.octave()*12);
};

/**
 * transpose a note
 */
 Note.prototype.transpose = function( interval ){
     return Note.transpose( this, interval );
 };
 
 Note.prototype.type = function(){
    return "Note";
}

/**
 * returns the frequency (in Hz) of the note
 * in equal temperament
 * 
 * use this for sound generation
 * 
 * possible optimization: lookup table
 */
Note.prototype.frequency = function(){
    return 440 * Math.pow(2, (this.pos-69)/12 );
};

