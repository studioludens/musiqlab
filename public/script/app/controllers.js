// angular.js controllers for the MUSIQ.js app

/**
 * the controller for the guitar view
 */
var GuitarCtrl = function( $scope ){
    // create a new guitar object
    
    // debug messages
    console.log("[GuitarCtrl] created!");
    
    this.guitar = new Guitar();
    
    //console.log(this.guitar);
    $scope.guitar = this.guitar;
    
    
    // put them in the right display order
    $scope.frets = this.guitar.frets;
    
    //console.log( $scope.frets );
    $scope.notes = this.guitar.notes;
    
    $scope.currentTuning = $scope.guitar.tuning();
    
    // get tunings
    $scope.tunings = Guitar.tunings;
    
    // add a nice display string to it
    _($scope.tunings).each(function(item, key){
        item.id = key;
        item.notesDisplay = _(item.notes).map(function(note){return Note.simpleNotation(note)}).join(" ");
    })
    
    //console.log($scope.tunings);
    
    //$scope.matchedChords = ["Cmaj7","D7"];
    
    // show default notes
    $scope.guitar.showFrets([0,0,0,0,0,0]);
    
    
    
    // toggle note function
    $scope.toggleNote = function( note ){
        note.onlyActive( !note.active() );
       //console.log( note ); 
       
       $scope.updateMatches();
       
       //console.log($scope.matchedChords);
    };
    
    $scope.clearQuery = function() {
        console.log("Clearing query & fretboard!");
        $scope.query = "";
        $scope.guitar.clearFretboard();
        
        $scope.updateMatches();
    };
    
    console.log($scope.guitar);
    
    // search function
    $scope.search = function( query ){
        console.log("New query: " + query);
        
        //console.log("New query: " + $scope.query);
        var result = $scope.guitar.show( query );
        // set the query valid variable to show the user some feedback
        //$scope.queryValid = result;
        
        // set some error reporting to the user
        if( result ){
            $scope.queryGroupClasses = [];
        } else {
            $scope.queryGroupClasses = ["error"];
        }
        
        $scope.updateMatches();
    };
    
    // change tuning
    $scope.changeTuning = function( tuning ){
        console.log("Changing tuning to");
        console.log(tuning);
        $scope.currentTuning = $scope.guitar.tuning( tuning );
        
        $scope.updateMatches();
    };
    
    $scope.updateMatches = function(){
        // find a matching chord
       $scope.queryMatches = $scope.guitar.chordsFromActiveNotes();
    };
    
    // transpose the whole fretboard
    $scope.transpose = function( num ){
        console.log("Transposing Fretboard : " + num);
        $scope.guitar.transpose( num, {active: true} );
        $scope.updateMatches();
    };
    
    // utility functions
    $scope.intervalName = function( interval ){
        //console.log("get interval name for " + interval)
        return (new Interval(interval)).name();
    };

};
