/**
 * some useful jQuery related stuff to spice up the interface
 */
$(document).ready(function() {
   
   // set up 
   
   if(Modernizr && !Modernizr.touch ){
       
       // only show tooltips for non-touch browsers
       // it's useless for touch
       $("#transpose-button").tooltip();
       $("#clear").tooltip();
       $("#help").tooltip();
      // $("#search-field").tooltip();
       $("#search-label").tooltip();
   }
   
   
   // set the focus to the search field
   $("#search-field").focus();
   
   $("#search-label").click(function(){
       console.log("search label clicked");
       $("#search-field").focus();
   })
   
   // tooltip for all notes
   //$(".guitar-fret-note a").tooltip({delay:{show:900,hide:0}});
});