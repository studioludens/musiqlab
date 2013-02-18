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
   });
   
   // pre-load fret images
   $.fn.preload = function() {
        this.each(function(){
            $('<img/>')[0].src = '../img/vms/vms-' + this + '.svg';
        });
    }

// Usage:
    
    $(['0','1','2','3','4','5','6','7','8','9','10','11','gen']).preload();

   
   // tooltip for all notes
   //$(".guitar-fret-note a").tooltip({delay:{show:900,hide:0}});
});