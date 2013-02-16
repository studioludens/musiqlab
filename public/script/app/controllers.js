// angular.js controllers for the MUSIQ.js app

/**
 * the controller for the guitar view
 */
var GuitarCtrl = function( $scope , $window){
    // create a new guitar object
    
    // debug messages
    console.log("[GuitarCtrl] created!");
    
    this.guitar = new Guitar();
    
    $scope.musiq = MUSIQ;
    
    //console.log(this.guitar);
    $scope.guitar = this.guitar;
    
    
    // put them in the right display order
    $scope.frets = this.guitar.frets;
    
    //console.log( $scope.frets );
    $scope.notes = this.guitar.notes;
    
    $scope.currentTuning = $scope.guitar.tuning();
    
    // get tunings
    $scope.tunings = Guitar.tunings;
    
    // set tonic
    $scope.tonic = null;
    
    // set helper for sharps
    $scope.sharps = ["","C♯","D♯","","","F♯","G♯","A♯"];
    
    
    
    
    // add a nice display string to it
    _($scope.tunings).each(function(item, key){
        item.id = key;
        item.notesDisplay = _(item.notes).map(function(note){return Note.simpleNotation(note)}).join(" ");
    })
    
    //console.log($scope.tunings);
    
    //$scope.matchedChords = ["Cmaj7","D7"];
    
    // show default notes
    $scope.guitar.showFrets([0,0,0,0,0,0]);
    
    
    /**
     * Query Matches
     * 
     * this array holds all the currently matched queries
     */
    $scope.query = "";
    $scope.queryMatches = [];
    $scope.selectedMatch = null;
    
    $scope.showMatchPanel = 'false';
    
    // toggle note function
    $scope.toggleNote = function( note ){
        note.onlyActive( !note.active() );
       //console.log( note ); 
       
       $scope.updateMatchesFromGuitar();
       
       //console.log($scope.matchedChords);
    };
    
    $scope.toggleMatchPanel = function(){
        console.log("Toggling match panel");
        $scope.showMatchPanel = $scope.showMatchPanel == 'true' ? 'false' : 'true';
    };
    
    $scope.clearQuery = function() {
        console.log("Clearing query & fretboard!");
        $scope.query = "";
        $scope.guitar.clearFretboard();
        
        $scope.queryMatches = "";
        $scope.selectedMatch = null;
        $scope.tonic = null;
    };
    
    //console.log($scope.guitar);
    
    // search function
    $scope.search = function( query ){
        console.log("New query: " + query);
        $scope.query = query;
        $scope.updateMatches();
        
        //console.log("New query: " + $scope.query);
        var result = $scope.guitar.show( $scope.queryMatches );
        // set the query valid variable to show the user some feedback
        //$scope.queryValid = result;
        
        // set some error reporting to the user
        if( $scope.queryMatches && $scope.queryMatches.length > 0 || $scope.query == "" ){
            $scope.queryGroupClasses = [];
        } else {
            $scope.queryGroupClasses = ["error"];
        }
        
    };
    
    // change tuning
    $scope.changeTuning = function( tuning ){
        console.log("Changing tuning to");
        console.log(tuning);
        $scope.currentTuning = $scope.guitar.tuning( tuning );
        $scope.updateMatchesFromGuitar();
        
    };
    
    $scope.selectMatch = function( match ){
        if( $scope.selectedMatch != match )
            $scope.selectedMatch = match;
        else    $scope.selectedMatch = null;
    }
    
    $scope.updateMatches = function(){
        // find a matching chord
        console.log("Updating matches");
       $scope.queryMatches = $scope.musiq.match($scope.query);//$scope.guitar.chordsFromActiveNotes();
       var firstChord = _($scope.queryMatches).find(function(m){
           // check for a match
           return ( m instanceof Chord );
       });
       
       $scope.tonic = firstChord ? firstChord.tonic : null;
       $scope.selectedMatch = null;
       
       console.log("Tonic ");
       console.log($scope.tonic);
    };
    
    $scope.updateMatchesFromGuitar = function(){
        // update guitar matches
       $scope.queryMatches = $scope.guitar.activeMatches();
       // and the query
       if($scope.queryMatches && $scope.queryMatches.length > 0){
           
           var firstMatch = $scope.queryMatches[0];
           
           console.log("firstMatch:");
           console.log( firstMatch );
           // set tonic
           
           
           $scope.query = firstMatch.notation();
           // set tonic of guitar
           if( firstMatch.type() == "Chord" || firstMatch.type() == "Scale" ){
               $scope.tonic = firstMatch.tonic;
               //$scope.guitar.showTonic( firstMatch.tonic );
           } if( firstMatch.type() == "Note" ){
               $scope.tonic = firstMatch;
               //$scope.guitar.showTonic( firstMatch );
           }

       } else {
           $scope.query = "";
       }
       
       
       
    }
    
    // transpose the whole fretboard
    $scope.transpose = function( num ){
        console.log("Transposing Fretboard : " + num);
        $scope.guitar.transpose( num, {active: true} );
        $scope.updateMatchesFromGuitar();
    };
    
    /** QUERY PARSING FUNCTIONS **/
    $scope.noteClass = function( name ){
        //console.log("Get noteClass for " + name);
        
        return _($scope.queryMatches).find(function(m){
            
            return m instanceof Note && m.hasName( name )
                    || m instanceof Chord && m.tonic.simpleNotation() == name
                    || m instanceof Scale && m.tonic.simpleNotation() == name
        }) ? 'active' : '';
    }
    
    $scope.chordClass = function( name ){
        //console.log("Get chordClass for " + name);
        
        var disabled = "disabled";
        if( $scope.queryMatches && $scope.queryMatches.length > 0 ) disabled = "";
        
        return _($scope.queryMatches).find(function(m){
            return m instanceof Chord && m.hasName( name );
        }) ? 'active' : disabled;
    };
    
    $scope.scaleClass = function( name ){
        //console.log("Get scaleClass for " + name);
        
        var disabled = "disabled";
        if( $scope.queryMatches && $scope.queryMatches.length > 0 ) disabled = "";
        
        return _($scope.queryMatches).find(function(m){
            return m instanceof Scale && m.hasName( name );
        }) ? 'active' : disabled;
    };
    
    $scope.activateNote = function( name ){
        console.log("Activate note " + name);
        
        // match the note in the query
        $scope.search(name.replace("♭","b").replace("♯","#"));
        $scope.updateMatches();
        
    };
    
    $scope.activateChord = function( name ){
        console.log("Activate chord " + name);
        
        // replace the chord bit in the query
        
        // if we already have a chord match
        var match = _($scope.queryMatches).find(function(m){ return m instanceof Chord });
        if( match ){
            $scope.search(match.tonic.simpleNotation() + name);
        }
        else
            $scope.search( $scope.query + name );
            
        $scope.updateMatches();
    };
    
    // utility functions
    $scope.intervalName = function( interval ){
        //console.log("get interval name for " + interval)
        return (new Interval(interval)).name();
    };
    
    /** RESPONSIVE **/
    /*
    $scope.width = 0;
    $scope.height = 0;
    $scope.smallScreen = false;

    $scope.updateWidth = function() {
        $scope.width = $window.innerWidth;
    }

    $scope.updateHeight = function() {
       $scope.height = $window.innerHeight;
    }
    
    $scope.columnAdjustments = function() {
        if ($scope.width < 768) {
            // reverse the order of fret notes
            $scope.smallScreen = true;
        } else {
            $scope.smallScreen = false;
        }
    }
    
    
    
    
    $scope.updateWidth();
    $scope.updateHeight();
    $scope.columnAdjustments();

    $window.onresize = function () {
        $scope.updateWidth();
        $scope.updateHeight();
        $scope.columnAdjustments();
        $scope.$apply();
    }*/
};
