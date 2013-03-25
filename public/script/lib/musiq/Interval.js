/**
 * 
 * data structure for an interval
 * 
 * @constructor
 * 
 * @param {integer} distance - The number of semitones between the notes
 */
var Interval = function( distance ){
    
    this.distance = distance;
    this.octaves = Math.floor(this.distance/12);
    this.relativeDistance = this.distance - this.octaves*12;
    
    //console.log(this.relativeDistance);

};

/**
 * @returns {string} the name of the interval
 */
Interval.prototype.name = function(){
        return MUSIQ.intervalNames[this.relativeDistance];
};

/**
 * take two notes and create a new Interval object from it
 * 
 * @param {Note} note1 - The first note
 * @param {Note} note2 - The second note
 * 
 * @returns {Interval} A new Interval object
 */
Interval.fromNotes = function( note1, note2 ){
    return new Interval( note1.distance(note2) );
};
    
/**
 * lookup the english name of the interval
 * 
 * @returns {string} the English name of the interval
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

/**
 * creates an interval object, internally calls Interval.fromName()
 * 
 * @param {string} name - the name of the interval
 * 
 * @returns {Interval}
 */
function interval( name ){
    return Interval.fromName( name );
}