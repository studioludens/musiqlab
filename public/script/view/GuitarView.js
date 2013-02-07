// GuitarView.js - represents the view of the guitar component

var GuitarView = function(guitar){
    this.guitar = guitar;
    
    
    
}

GuitarView.noteTemplate = '<div class="<%= fret.active %>"></div>';
GuitarView.stringTemplate = '<div class="guitar-string"';

GuitarView.prototype.show = function(){
    
}

GuitarView.prototype.addBehaviour = function(){
    // set up hooks
    
}