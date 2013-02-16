/**
 * GuitarChord - a class for representing a guitar chord
 * 
 * @param chord : a Chord object
 * @param notes : a collection of GuitarNote objects
 */

var GuitarChord = function( chord, notes ){
    this.chord = chord;
    this.notes = notes;
};

/**
 * finds all variations of a particular chord with a specific
 * tonic. All these 
 * 
 * @param guitar : the guitar object (with specific tuning)
 * @param chord : the Chord object to find specific GuitarChords for
 * @param tonic : the Tonic we want to base the chord on
 * @param options : an object specifying more options:
 *                  {
 *                      upPreference: false
 *                      maxFingerStretch: 2
 *                      maxDifficulty: 10 
 *                  }
 * 
 * @returns an array of GuitarChord objects
 */
GuitarChord.fromChordAndTonic = function( guitar, chord, tonic ){
    // from the tonic, walk up the neck, fret by fret
    
    // increase the difficulty
    
    // set finger stretch
    
    // check if we have found all the notes
    
    // can we calculate this recursively
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
    var lastFret = 
    _(this.notes).pluck('fret').reverse().each(function(item){
        if( item == lastFret ) same++;
    });
    
    console.log(same);
    return same;
    
}