MUSIQ Lab
=========

The MUSIQ Lab is my personal collection of music analysis experiments. I use them to learn more about music theory and I hope you will find some use in them. There are two parts to it, the MUSIQ.js library, a pure Javascript library that can help you to analyze notes, chords, scales and much more. Secondly, there is the Interactive Guitar experiment, that uses the MUSIQ.js library and some AngularJS magic to display an (albeit rudimentary) guitar on screen, where you can find notes, chords and learn more about music theory on the guitar. 


The following libraries have been used:
- Node.js (for the webserver)
- Twitter Bootstrap (for quickly building the website)
- JSDoc (for code documentation)
- Underscore.js

And a couple more. 

Installation
------------

Clone the repository to your own computer:

    git clone https://github.com/studioludens/musiqlab.git

and install the npm dependencies like so:

    npm install
    
This will create a directory `node_modules`. 

Run the server
--------------

MUSIQLab uses (for the time being) only client-side libraries. That means you can run the code on any system of your choice, like Apache or any other HTTP server. If you have node installed, you can also use the bundled node-static server. Run it like this:

    node ./server.js
    
Generate Documentation
----------------------

Documentation is created by JSDoc using a custom-made template (/jsdoc-template) and can be run by the following commandline utility:

    ./doc
    
Files are put in the ./public/docs/ folder. 
 
Description of files
--------------------

Included in this repo are a number of useful executables. They are shell (bash) scripts that help me to accomplish common tasks. Since I'm a complete beginner with javascript, these tasks could probably be accomplished much more easily, but well, they serve their purpose for now. 

* `docs` : generate documentation using the jsdoc compiler. It makes documentation only for the musiq.js library (./public/script/lib/musiq/)
* `gitcommit` : shortcut for the git add, git commit and git push commands. Use a string with the commit message like ./gitcommit "message"
* `gitsubmup` : update git submodules (for now only the musiqjs library)
* `heroku` : deploy the app to heroku
* `Procfile` : deployment instructions for heroku (see [documentation](https://devcenter.heroku.com/articles/procfile) )
* `server.js` : the main node server application


License and Copyright
=====================

All code is (c)2013 Alexander Rulkens, but is free to use for commercial and non-commercial purposes. Basically you can do with it what you want, but please give me credit.


Changelog
=========