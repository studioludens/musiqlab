// test script

(function(){
    
    // test guitar chord finder
    console.log("Test chord finder 2");
    
    var g = new Guitar();
    
    //var c = chord("C");
    
    //console.log(c);
    
    // set the low e note as a base
    //var e = g.noteOnPos( [0,0] );
    //console.log(e.notation() );
    
    // check the distance between the low e on the first string and the c on the second
    //var c = g.noteOnPos( [1, 3] );
    //console.log(c.notation() );
    //console.log( e.distanceTo(c) );
    //console.log( c.distanceTo(e) );
    
    var e = g.noteOnPos( [0,0] );
    var g_note = g.noteOnPos( [0,3] );
    // test with the C on the 8th fret
    var high_c = g.noteOnPos( [0,8] );
    var c = chord("C");
    
    var chords = GuitarChord.fromChordAndBase( g, c, high_c );
    
    console.log( "all matches ");
    console.log( chords );
})(this);

// jquery
$(document).ready(function(){
    
    var guitar = new Guitar();
    
    $('#calculate').click(function(){
        // get the value of the input field
        var chordName = $('#name').val();
        var onlyBase = $('#onlyBase').is(":checked");
        
        var opts = onlyBase ? { onlyBase: true } : {};
        var chords = GuitarChord.fromChord( guitar, chord(chordName), opts );
        console.log( "all matches ");
        console.log( chords );
        // show on screen
        var retString = "";
        
        _(chords).each(function(chord){
            retString += "" + chord + "<br/>";
        });
        
        $('#output').html(retString);
    });
});