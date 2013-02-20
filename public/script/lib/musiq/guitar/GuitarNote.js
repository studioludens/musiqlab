/** 
 * the guitar note data object
 * @param guitar : a Guitar object this note belongs to
 * @param guitarString : a GuitarString object this note belongs to
 * @param fret : the GuitarFret this note belongs to
 * @param pos : the position as in [ string, fret ]
 * 
 * @param state : an object representing the state of the note:
 *                      {   active: false,
 *                          ghosted: false,
 *                          tonic: false
 *                      }
 */
var GuitarNote = function( guitar, guitarString, fret, pos, state ){

    this.guitar = guitar;
    this.guitarString = guitarString;
    this.fret = fret;
    this.pos = pos;
    
    //console.log( this.pos );
    
    this.state = state || _.clone( GuitarNote.DEFAULT_STATE );
    
    /**
     * create a Note object for easy access
     */
    this.note = new Note( guitarString.base + fret.pos );

    //console.log( this.note );
};

/**
 * the default state of the guitar note. 
 * when you use this, make sure to MAKE A COPY!
 */
GuitarNote.DEFAULT_STATE = { active: false, ghosted: false, tonic: false };

GuitarNote.prototype.notation = function(){
    return this.note.notation();
};

GuitarNote.prototype.short = 
GuitarNote.prototype.simple = function( signature ){
    return this.note.simpleNotation( signature );
};


/**
 * sets or gets the active state. 
 * @returns true if the state is active
 */
GuitarNote.prototype.active = function( value ){
    if( typeof value != 'undefined'){
        this.state.active = value;
        return this.state.active;
    } else {
        return this.state.active;
    }
};

/**
 * sets or gets the tonic state. 
 * @returns true if the state is tonic
 */
GuitarNote.prototype.tonic = function( value ){
    if( typeof value != 'undefined'){
        this.state.tonic = value;
        return this.state.tonic;
    } else {
        return this.state.tonic;
    }
};

/**
 * sets or gets the active state. 
 * @returns true if the state is active
 */
GuitarNote.prototype.ghosted = function( value ){
    if( typeof value != 'undefined'){
        this.state.ghosted = value;
        return this.state.ghosted;
    } else {
        return this.state.ghosted;
    }
};

/**
 * sets this note as the only active note on the string
 */
GuitarNote.prototype.onlyActive = function( value ){
    return this.guitarString.onlyActive( this.pos[1], value );
}

/**
 * get a string representation of the class
 */
GuitarNote.prototype.class = function( tonic ){
   var ret = [];
   if( this.state.active ) ret.push('active');
   if( this.state.ghosted ) ret.push('ghosted');
   if( this.state.tonic ) ret.push('tonic');
   
   // add the interval to the tonic as well
   if( tonic ) ret.push(this.intervalToTonic(tonic).name().replace(" ","-"));
   
   return ret.join(' ');
};

/**
 * the interval to the tonic
 * 
 * @returns an Interval object relative to the tonic
 */
GuitarNote.prototype.intervalToTonic = function( tonic ){
    if( tonic )
        return tonic.interval( this.note );
}

/**
 * get the int note position
 */
GuitarNote.prototype.notePos = function(){
    return this.note.pos;
}

/**
 * get the relative note position
 */
GuitarNote.prototype.relPos =
GuitarNote.prototype.relativeNotePos = function(){
    return this.note.toRelative().pos;
}

/**
 * get the 'distance' of a fret to another note on the fretboard
 * returns an array [ strings, frets ]
 */
GuitarNote.prototype.distanceTo = function( otherNote ){
    return [ otherNote.pos[0] - this.pos[0], otherNote.pos[1] - this.pos[1] ];
}
