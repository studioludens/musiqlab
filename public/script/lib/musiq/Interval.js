/**
 * 
 * data structure for an interval
 * 
 * @constructor
 * 
 * @param distance {integer} - The number of semitones between the notes
 */
var Interval = function( distance ){
    
    this.distance = distance;
    this.octaves = Math.floor(this.distance/12);
    this.relativeDistance = this.distance - this.octaves*12;
    
    //console.log(this.relativeDistance);
    
    this.name = function(){
        return MUSIQ.intervalNames[this.relativeDistance];
    }
    
    
    
};

/**
 * take two notes and create a new Interval object from it
 * 
 * @param note1 {Note} - The first note
 * @param note2 {Note} - The second note
 * 
 * @returns {Interval} - A new Interval object
 */
Interval.fromNotes = function( note1, note2 ){
    return new Interval( note1.distance(note2) );
};
    
/**
 * lookup the english name of the interval
 * 
 * @returns {string} - the English name of the interval
 * 
 * can be one of the following:
 * "unison"
   "minor second"
   "major second"
   "minor third"
    "major third"
   "fourth"
   "tritone"
   "fifth"
   "minor sixth"
   "major sixth"
   "minor seventh"
   "major seventh"
   "octave"
 * 
 */
Interval.fromName = function( name ){
    return new Interval( MUSIQ.intervalNames.indexOf( name ) );
};