/** 
 * guitar string class
 * 
 * @constructor
 * 
 * @param guitar : the Guitar object this String belongs to
 * @param base : the base note position of this string
 * @param pos : the position of the string relative to the other strings
 */

var GuitarString = function( guitar, pos, base ){
    
    this.guitar = guitar;
    this.pos = pos;
    this.base = base;
    
};


/**
 * return a Note object for a fret position on this string
 * 
 * @param fret : a GuitarFret object we should check the note on
 */
GuitarString.prototype.noteOnFret = function( fret ){
    return this.guitar[this.pos][fret.pos];
};

/**
 * matches a Note object to the fret and returns all GuitarNote objects that
 * match it.
 */
GuitarString.prototype.matchNotes = function( note ){
    
};

/**
 * get a list of integers that represents all active notes on this string
 */
GuitarString.prototype.activeNotes = function( chord ){
    return;
};

GuitarString.prototype.onlyActive = function( fret, value ){
    
    _(this.guitar.notes[this.pos]).each(function(note, key){
        if( key == fret )
            note.active(value);
        else
            note.active(false);
            
    },this);
        
};