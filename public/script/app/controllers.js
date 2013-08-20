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
    $scope.sharps = ["","D♭·C♯·","E♭·D♯","","","G♭·F♯","A♭·G♯","B♭·A♯"];
    
    //♭
    //♯
    
    
    // add a nice display string to it
    _($scope.tunings).each(function(item, key){
        item.id = key;
        item.notesDisplay = _(item.notes).map(function(note){return Note.simpleNotation(note)}).join(" ");
    });
    
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
    
    /**
     * chord variations
     */
    $scope.chordVariations = [];
    $scope.selectedVariation = null; // selected chord variation
    $scope.selectedVariationNum = -1; // the selected index of the variation
    
    /**
     * QUERY AND SEARCH FUNCTIONS
     */
    
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
        $scope.query = query.replace("♭","b").replace("♯","#");
        $scope.queryMatches = $scope.musiq.match($scope.query);
        
        var firstChord = _($scope.queryMatches).find(function(m){ return ( m.type() == 'chord' || m.type() == 'scale' ); });
       
        $scope.tonic = firstChord ? firstChord.tonic : null;
        $scope.selectedMatch = $scope.queryMatches[0]; // why do we set selectedMatch to null?
        
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
    };
    
    
    /**
     * update the interface when the user changes notes on the guitar
     */
    $scope.updateMatchesFromGuitar = function(){
        // update guitar matches
        console.log("[GuitarCtrl] Update matches from Guitar");
       $scope.queryMatches = $scope.guitar.activeMatches();
       
       console.log($scope.queryMatches);
       
       // and the query
       if($scope.queryMatches && $scope.queryMatches.length > 0){
           
           var firstMatch = $scope.queryMatches[0];
           
           console.log("firstMatch:");
           console.log( firstMatch );
           // set tonic
           
           
           $scope.query = firstMatch.notation();
           // set tonic of guitar
           if( firstMatch.type() == "chord" || firstMatch.type() == "scale" ){
               $scope.tonic = firstMatch.tonic;
               //$scope.guitar.showTonic( firstMatch.tonic );
           } if( firstMatch.type() == "note" ){
               $scope.tonic = firstMatch;
               //$scope.guitar.showTonic( firstMatch );
           }

       } else {
           $scope.query = "";
           $scope.tonic = "";
       }
    };
    
    /** 
     * transpose the whole fretboard
     * TODO: make sure that if a match is selected, the match
     * is updated instead of the fretboard directly
     */
    $scope.transpose = function( num ){
        console.log("Transposing Fretboard : " + num);
        $scope.guitar.transpose( num, {active: true} );
        $scope.updateMatchesFromGuitar();
    };
    
    /**
     * select a specific variation
     */
    $scope.variation = function( num ){
        $scope.selectedVariationNum++;
        
        console.log( "Selecting variation : " + $scope.variationNum );
        
        // set the selected variation
        
        $scope.selectedVariation = $scope.getVariation( $scope.selectedVariationNum );
        $scope.showVariation( $scope.selectedVariation );
    };
    
    /** return a specific variation with te num index
     */
    $scope.getVariation = function( num ){
        
        console.log("Get variations on:", $scope.selectedMatch);
        
        if( !$scope.variations ){
            $scope.variations = $scope.guitar.variationsOn( $scope.selectedMatch );
        }
        return $scope.variations[num] ? $scope.variations[num] : null;
    }
    
    /**
     * toggle a note to view
     */
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
    
    /**
     * show a note with a specific name on the fretboard
     */
    $scope.activateNote = function( name ){
        console.log("Activate note " + name);
        
        // match the note in the query
        $scope.search(name);
        $scope.updateMatches();
        
    };
    
    /**
     * show a chord with a specific name on the fretboard
     */
    $scope.activateChord = function( name ){
        console.log("Activate chord " + name);
        
        // replace the chord bit in the query
        
        // if we already have a chord match
        var match = _($scope.queryMatches).find(function(m){ return m.type() == 'chord' });
        if( match ){
            $scope.search(match.tonic.simpleNotation() + name);
        }
        else
            $scope.search( $scope.query + name );
            
        $scope.updateMatches();
    };
    
    /**
     * show a scale with a specific name on the fretboard
     */
    $scope.activateScale = function( name ){
        console.log("Activate scale " + name);
        
        // replace the scale bit in the query
        
        // if we already have a chord match
        var match = _($scope.queryMatches).find(function(m){ return m.type() == 'scale' });
        if( match ){
            $scope.search(match.tonic.simpleNotation() + name + " scale");
        }
        else
            $scope.search( $scope.query + name + " scale" );
            
        $scope.updateMatches();
    };
    
    // utility functions
    $scope.intervalName = function( interval ){
        //console.log("get interval name for " + interval)
        return (new Interval(interval)).name();
    };
    
    
    /**
     * CLASS FUNCTIONS
     * - to give notes on the fretboard the correct class
     */
    
    $scope.noteClass = function( name ){
        //console.log("Get noteClass for " + name);
        
        return _($scope.queryMatches).find(function(m){
            
            return m.type() == 'note' && m.hasName( name )
                    || m.type() == 'chord' && m.tonic.simpleNotation() == name
                    || m.type() == 'scale' && m.tonic.simpleNotation() == name
        }) ? 'active' : '';
    }
    
    $scope.chordClass = function( name ){
        //console.log("Get chordClass for " + name);
        
        var disabled = "disabled";
        if( $scope.queryMatches && $scope.queryMatches.length > 0 ) disabled = "";
        
        return _($scope.queryMatches).find(function(m){
            return m.type() == 'chord' && m.hasName( name );
        }) ? 'active' : disabled;
    };
    
    $scope.scaleClass = function( name ){
        //console.log("Get scaleClass for " + name);
        
        var disabled = "disabled";
        if( $scope.queryMatches && $scope.queryMatches.length > 0 ) disabled = "";
        
        return _($scope.queryMatches).find(function(m){
            return m.type() == 'scale' && m.hasName( name );
        }) ? 'active' : disabled;
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
