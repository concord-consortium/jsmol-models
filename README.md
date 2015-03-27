jsmol-models
============

This repository contains an embeddable webpage that can be used by the [Lab](https://github.com/concord-consortium/lab) iframe model type. Post message API is used for communication between the embeddable page and parent (Lab interactive). It also contains JSmol models created by the [Concord Consortium](http://www.concord.org).

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

## Working on Lab interactive

When you work on a new Lab interactive, you should test integration with new JSmol model locally (before pushing it to repository and production server). You can start the local server (see above, use a different port from 9292, e.g. 9191) and use local URL in the Lab interactive you are working on:

    http://localhost:9191/embeddable.html

When everything works as expected, you can push changes to the ``gh-pages`` branch of the jsmol-models repository.
Then use the GH Pages URL in the Lab interactive:

    http://concord-consortium.github.io/jsmol-models/embeddable.html

If that is working fine, then merge ``gh-pages`` into the ```production``` branch, push it,
and then use the production URL in the Lab interactive:

    https://resources.models.concord.org/jsmol/embeddable.html

## Production server

When you update ```production``` branch and push it, Travis CI will automatically deploy changes to
[http://resources.models.concord.org/jsmol/embeddable.html](http://resources.models.concord.org/jsmol/embeddable.html).

You can monitor this proces at the [JSMol Models Travis CI Build page](https://travis-ci.org/concord-consortium/jsmol-models/builds).

## GitHub pages

There is no ``master`` branch in this repository. The ``gh-pages`` branch is the default branch, so all of your work should be done there.
As soon as you push a change it will be available here:

[http://concord-consortium.github.io/jsmol-models/embeddable.html](http://concord-consortium.github.io/jsmol-models/embeddable.html)