jsmol-models
============

This repostiory contains an embeddable webpage that can be used by the [Lab](https://github.com/concord-consortium/lab) iframe model type. Post message API is used for communication between the embeddable page and parent (Lab interactive). It also contains JSmol models created by the [Concord Consortium](http://www.concord.org).

## Checking out the project

If you have commit access to the repository use this form:

    git clone git@github.com:concord-consortium/jsmol-models.git

Alternatively if you don't have commit access use this form:

    git clone git://github.com/concord-consortium/jsmol-models.git

Then:

    git submodule update --init

## Locally viewing models

The embeddable page cannot be viewed using a simple `file://` URL.
So you can either use a webserver like apache to serve the files, or use an included ruby based rack server.
To use the rack server you should:

    cd local-server
    bundle install --binstubs
    bin/rackup
    open http://localhost:9292/embeddable.html

If you haven't used bundler, ruby, and rvm or rbenv before, you will probably need to learn a bit about those before this will work for you.

If you are developing Lab at the same moment, you may want to run server on different port (9292 is default for Lab too):

    bin/rackup -p 9191
    open http://localhost:9191/embeddable.html
    
The embeddable page doesn't load any model by default. However you provide a special parameter in URL to load desired model:

    http://localhost:9191/embeddable.html#molecule=<path-to-molecule-file>
    
e.g.:

  http://localhost:9191/embeddable.html#molecule=models/dna/dna1.pdb
    
## Production server

When you update ```production``` branch and push it, Travis CI will automatically deploy changes to
[http://resources.models.concord.org/jsmol/embeddable.html](http://resources.models.concord.org/jsmol/embeddable.html)

## GitHub pages

The live version of this site can be also found at [http://concord-consortium.github.io/jsmol-models/embeddable.html](http://concord-consortium.github.io/jsmol-models/embeddable.html)

To update this site, merge your changes into the ```gh-pages``` branch and push.
