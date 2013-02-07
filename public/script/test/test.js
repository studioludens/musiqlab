// Test script


// EXECUTE test scripts
//test_Notes();
//test_Chords();
test_Guitar();


function test_Notes() {
    var c = Note.fromNotation("C0");
    var d = Note.fromNotation("D1");
    var e = Note.fromNotation("E2");
    var f = Note.fromNotation("F3");
    
    var fsharp = Note.fromNotation("F#6");

    console.log("C:");
    var simplec = Note.fromNotation("C");
    
    
    var simple_fsharp = Note.fromNotation("F#");
    
    var cflat = Note.fromNotation("Cb3");
    
    // this should result in ERRORS:
    console.log("Four failing assertions: ");
    console.log(Note.fromNotation("Bleg"));
    console.log(Note.fromNotation("Cf"));
    console.log(Note.fromNotation("H"));
    console.log(Note.fromNotation("C-"));
    
    // this should be fine:
    console.log("No errors: ");
    
    console.log("B");
    console.log(Note.fromNotation("B"));
    
    console.log("Gb");
    console.log(Note.fromNotation("Gb"));
    console.log("Dbbb (D triple flat)");
    console.log(Note.fromNotation("Dbbb"));
    console.log("Fx (double sharp)");
    console.log(Note.fromNotation("Fx"));
    console.log("Fx (double sharp, octave 2)");
    console.log(Note.fromNotation("Fx1"));
    

    // check note positions
    console.log( Note.fromNotation("Cb1").pos);
    console.assert( Note.fromNotation("Cb1").pos == 11);
    console.assert( Note.fromNotation("B#").pos == 12);

    // log some distances
    console.assert(c.distance(d) == 14);
    console.assert(c.relativeDistance(d) == 2);

    // and the other way around
    console.assert(d.distance(c) == -14);
    console.assert(d.relativeDistance(c) == 10);

    // get the interval
    console.assert(d.interval(c).name() == "minor seventh");

    // get the signature
    console.assert(d.signature() == 2);

    // position on the circle of fifths
    console.assert(c.cofPosition() == 0);

    // notation

    console.assert(fsharp.simpleNotation() == "F#");

    // this fails!
    //console.assert(cflat.simpleNotation() == "Cb");

    // NOTE: this doesn't work!
    //console.assert(Note.fromNotation("Fb").simpleNotation() == "Fb");
    
    // test octave
    console.log("Transposing C0 -> pos = " + c.transpose('octave').pos)
    console.assert(c.transpose('octave').pos == 12);
    
    console.assert(c.transpose(Interval.fromName('octave')).pos == 12);
    
}

// CHORDS

function test_Chords() {

    var cmaj = Chord.fromNotation("C");


    // chord from notation
    var dmaj7 = Chord.fromNotation("Dmaj7");

    // transpose it a bit
    dmaj7.tonic = Note.fromNotation("D5");
    console.log( cmaj );
    console.log( dmaj7.noteObjects());

    //var fmaj7 = Chord.fromNotes( [0,4,7] );

    /*
    var chords1 = Chord.fromNotes( [0,4,7] );
    var chords2 = Chord.fromNotes( [1,5,8] );
    
    var chords3 = Chord.fromNotes( [12,15,19,24] );
    */
    var chords4 = Chord.fromNotes( [ 0, 4, 7, 11, 14 ] );
    var chords5 = Chord.fromNotes( [ 0, 4, 7, 11, 14 ] );
    
    /*
    _.each(chords1, function(chord){ console.log(chord.notation()); });
    _.each(chords2, function(chord){ console.log(chord.notation()); });
    _.each(chords3, function(chord){ console.log(chord.notation()); });
    */
    _.each(chords4, function(chord){ console.log(chord.notation()); });
    _.each(chords5, function(chord){ console.log(chord.notation()); });
    
    
    /*console.log(chord2.notation());
    console.log(chord3.notation());
    */
    console.log(chords4.notation());
    console.log(chords5.notation());
    
}

function test_Guitar() {
    /* GUITAR TESTS */
    var guitar = new Guitar();
    
    /* NOTES ON GUITAR */
    //console.log(guitar.notes[0][0].note.notation());
    console.assert(guitar.strings[1].base == 45);
    
    console.assert(guitar.notes[0][0].note.notation() == "E3");
    console.assert(guitar.notationFor( 1, 3 ) == "C");
    
    /* NOTES ON SPECIFIC FRET */
    console.log(guitar.notesOnFret(1));
    console.assert(guitar.notesOnFret(1)[0].notation() == "F3");
    
    /* MAJOR CHORDS */

    // F
    console.info("Looking for F ( 1 3 3 2 1 1 )");
    var Fmaj = guitar.chordsFromFingerPos([1, 3, 3, 2, 1, 1]);
    _.each(Fmaj, function(chord) {
        console.log(chord.notation());
    });
    console.assert(Fmaj[0].notation() == "F");

    // C
    console.info("Looking for C ( x 3 5 5 5 3 )");
    var Cmaj = guitar.chordsFromFingerPos([-1, 3, 5, 5, 5, 3]);
    _.each(Cmaj, function(chord) {
        console.log(chord.notation());
    });
    console.assert(Cmaj[0].notation() == "C");

    // another C
    console.info("Looking for C ( x 3 2 0 1 0 )");
    var Cmaj = guitar.chordsFromFingerPos([-1, 3, 2, 0, 1, 0]);
    _.each(Cmaj, function(chord) {
        console.log(chord.notation());
    });
    console.assert(Cmaj[0].notation() == "C");


    /* MINOR CHORDS */

    // let's plan an E minor on the guitar!
    console.info("Looking for Em ( 0 2 2 0 0 0 )");
    var emin = guitar.chordsFromFingerPos([0, 2, 2, 0, 0, 0]);
    _.each(emin, function(chord) {
        console.log(chord.notation());
    });
    console.assert(emin[0].notation() == "Em");

    // an an e minor power chord
    console.info("Looking for Em");
    var eminp = guitar.chordsFromFingerPos([0, 2, 2, - 1, - 1, - 1]);
    _.each(eminp, function(chord) {
        console.log(chord.notation());
    });
    //console.assert( emin[0].notation() == "Em");

    /* DIMINISHED TRIADS */

    /* AUGMENTED TRIADS */

    /* SEVENTH (7th) CHORDS */

    // and a G minor 7!
    console.warn("Looking for Gm7 (3, 5, 3, 3, 3, 3)");
    var gm7 = guitar.chordsFromFingerPos([3, 5, 3, 3, 3, 3]);
    _.each(gm7, function(chord) {
        console.log(chord.notation());
    });
    console.assert(gm7[0].notation() == "Gm7");

    // A7
    console.log("Looking for A7 (5, 7, 5, 6, 5, 5)");
    var A7 = guitar.chordsFromFingerPos([5, 7, 5, 6, 5, 5]);
    _.each(A7, function(chord) {
        console.log(chord.notation());
    });
    console.assert(A7[0].notation() == "A7");

    // A7
    console.log("Looking for A7 (x 0 2 0 2 0)");
    var A72 = guitar.chordsFromFingerPos([-1, 0, 2, 0, 2, 0]);
    _.each(A72, function(chord) {
        console.log(chord.notation());
    });
    console.assert(A72[0].notation() == "A7");

    // A7
    console.log("Looking for A7 (5 x 5 6 5 x)");
    var A73 = guitar.chordsFromFingerPos([5, - 1, 5, 6, 5, - 1]);
    _.each(A73, function(chord) {
        console.log(chord.notation());
    });
    console.assert(A73[0].notation() == "A7");

    // Bm7b5
    console.log("Looking for Bm7b5 ( x 2 3 2 3 x )");
    var Bm7b5 = guitar.chordsFromFingerPos([-1, 2, 3, 2, 3, - 1]);
    _.each(Bm7b5, function(chord) {
        console.log(chord.notation());
    });
    console.assert(Bm7b5[0].notation() == "Bm7b5");

    // Bdim7
    console.log("Looking for Bdim ( x 2 3 1 3 x )");
    var Bdim = guitar.chordsFromFingerPos([-1, 2, 3, 1, 3, - 1]);
    _.each(Bdim, function(chord) {
        console.log(chord.notation());
    });
    console.assert(Bdim[0].notation() == "Bdim7");

    // Gmaj7
    console.log("Looking for Gmaj7 ( 3 x 4 4 3 )");
    var Gmaj7 = guitar.chordsFromFingerPos([3, - 1, 4, 4, 3, - 1]);
    _.each(Gmaj7, function(chord) {
        console.log(chord.notation());
    });
    console.assert(Gmaj7[0].notation() == "Gmaj7");

    /* NINTH (9th) CHORDS */

    // C#9
    console.log("Looking for C#9");
    var Cis9 = guitar.chordsFromFingerPos([-1, 4, 3, 4, 4, - 1]);
    _.each(Cis9, function(chord) {
        console.log(chord.notation());
    });
    console.assert(Cis9[0].notation() == "C#9");

    /* SIX CHORDS */

    // Am6
    console.log("Looking for Am6");
    var Am6 = guitar.chordsFromFingerPos([5, - 1, 4, 5, 5, - 1]);
    _.each(Am6, function(chord) {
        console.log(chord.notation());
    });
    console.assert(Am6[0].notation() == "Am6");

    // C6/9
    console.log("Looking for C6/9");
    var C69 = guitar.chordsFromFingerPos([3, 3, 2, 2, 3, 3]);
    _.each(C69, function(chord) {
        console.log(chord.notation());
    });
    console.assert(C69[0].notation() == "C6/9");

    /* ELEVENTH CHORDS */

    // Cm11
    console.log("Looking for Cm11");
    var Cm11 = guitar.chordsFromFingerPos([8, - 1, 8, 8, 6, - 1]);
    _.each(Cm11, function(chord) {
        console.log(chord.notation());
    });
    console.assert(Cm11[0].notation() == "Cm11");

    /* THIRTEENTH CHORDS */
    // G13
    console.log("Looking for G13");
    var G13 = guitar.chordsFromFingerPos([3, - 1, 3, 4, 5, - 1]);
    _.each(G13, function(chord) {
        console.log(chord.notation());
    });
    console.assert(G13[0].notation() == "G13");

    // G b13
    console.log("Looking for G b13");
    var Gb13 = guitar.chordsFromFingerPos([3, - 1, 3, 4, 4, - 1]);
    _.each(Gb13, function(chord) {
        console.log(chord.notation());
    });
    console.assert(Gb13[0].notation() == "G b13");

}

