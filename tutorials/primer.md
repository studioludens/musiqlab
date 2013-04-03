MUSIQ.js Primer
===============

Musiq.js is a pure Javascript Library that helps you to understand music theory by representing the most common elements as easy to use javascript functions and objects. Take a note for example. To represent the middle C on the keyboard, we can write:

    var middle_c = note("C4");
    // we have just created a Note object, 
    // representing the middle C
    
The 4 is the octave of the note, in this case this is the middle C.

Now, we can do all kinds of things with this note. Want to know what the fifth of the middle C is?

    
    var c_with_fifth = middle_c.transpose("fifth");
    // c_with_fifth is now equal to the fifth of C
    // so, what is it called?
    console.log( c_with_fifth );
    // returns "G4"

There are only so many things you can do with a single note. Take a look at the API Documentation for a list of all the methods available.

When we play multiple notes together, they can form a chord. There are many types of chords each with their own sound and function. Let's say we want to create a G chord.

    var g_chord = chord("G");
	// what notes are in this chord?
	console.log( g_chord )
	// returns G B D
	
Before we dive any deeper into this nifty little library, let's set up our environment first so we can experiment.

Installation
------------

MUSIQ.js is hosted on [GitHub][] and can be easily included in your project. In the root folder of the [GitHub project][] you will find a file called

	musiqjs.min.js
	
Download this file and put it in your web project folder. In your html files, include it like so:

	&lt;script src="script-folder/musiqjs.min.js"\&gt;
	
You can do this in between the `<head></head>` tags or just before the `<body>` tag.

And you're set!

[GitHub]: http://www.github.com/
[GitHub project]: https://www.github.com/studioludens/musiqjs/

Basic Usage
-----------

The library is built with simple use and extensibility in mind. We aim to let you solve basic questions related to music theory with minimal effort. 

Creating music objects - Note, Interval & Chord
- - - - - - - - - - - - - - - - - - - - - - - -

You can create a note in the following ways:

	var n = new Note( 90 ); // creates a note at MIDI position 90

This creates an F#6. You can check the [MIDI note numbers], but most of the time you won't need them. A little bit of info: all notes in the western system can be represented with a number. The lowest number is 0 and represents the C in octave -1 (don't ask me why, somebody a long while ago just made that decision and it stuck). The middle C has number 60 for example. 61 represents a C#, not a D as you might think. Adding 1 to the number represents raising the note with a semitone (half a tone). So, 62 = D, 63 = D#/Eb, etc. 

[MIDI note numbers]: http://midikits.net23.net/midi_analyser/midi_note_numbers_for_octaves.htm

Instead, it's easier to create a note from a string notation. MUSIQ.js supports two basic ways of notating a note. You can have notes like `C`, `F`, `Bb`, `D#`, etc. These we call *relative* notes. They are actually a representation of all the `C`, `F`, ... notes that exists. 

On the other hand, if we use a notation like `C4`, the Note object will represent a specific note at a specific height, in this case the middle C. The 4 represents the octave of the note.
 
 	var middle_c = Note.fromNotation("C4");
 	
To make it a little easier and type less, you can use the short function:

	var c = note("C");
	
These ways of creating the middle C (C4) note are all equivalent (use whichever feels the most natural to you):

	var c = new Note(60);
	var c = Note.fromNotation("C4");
	var c = note("C4");
	
The same goes for an Interval, the distance between two notes. We can create an interval like so:

	var fifth = new Interval(7);
	
This represents a perfect fifth interval. It's easier if we can use the name:

	var fifth = Interval.fromNotation("fifth");
	// or the short notation
	var fifth = interval("fifth");

MUSIQ.js currently supports one notation for each interval. You can find them in the [Interval API].

Just a lone interval like this doesn't really have any meaning musically. We use it to describe the distance between notes, like so:

	var c_to_g = note("C").interval("G");
	console.log(c_to_g); // -> "fifth"
	
We can get the number of semitones (for use in our code) easily:

	console.log( c_to_g.distance );
	
~~~

The last one of the basics is the Chord object. The most common ways to create a chord are:

	var Cmaj7 = Chord.fromNotation("Cmaj7");
	var Cmaj7 = chord("Cmaj7");
	// these two do the same
	
As we said earlier, there are many types of chords. You have the most common ones, like C major, D minor, G7, etc. If we're getting a bit jazzy, we might use chords like Bbmaj7, G#m7, Fdim.  Then you have a whole array of chords with extensions, like Bmaj9 or Fm11, G13 and many others. The MUSIQ.js library tries to support as many of them as possible. Slash chords (D/G), power chords (C5), and some really exotic ones like GmM7 or A6/9 are all possible. For the full list of supported chords you can take a look at the [Chord documentation].

Here are some of the previous chords in code:

	var c_major = chord("C"); // or CM, or C major, or C maj
	var d_minor = chord("Dm"); // or Dmin, D minor, and even D-
	var g7 = chord("G7"); // you get the point...
	var Bbmaj7 = chord("Bbmaj7");
	var Fm11 = chord("Fm11");
	
~~~

Now we know how to create some common objects in music theory. 

Learning about objects and relationships
- - - - - - - - - - - - - - - - - - - - 

Let's see if we can answer some of the questions we can have when we learn or use music theory. 

A simple question that we already answered was: what is the interval (distance) between two notes? In this example, the interval between the D and the F# is a major third.

	var interval_notation = note("D").interval("F#").notation();
	// interval_notation == 'major third'
	
Which note is a minor third above the F# ?

	var third_of_f_sharp = note("F#").transpose("minor third");
	console.log(third_of_f_sharp.notation()); // -> try it!
	
Is there a C in an Fmaj7 chord?

	var f_has_c = chord("Fmaj7").contains("C");
	
