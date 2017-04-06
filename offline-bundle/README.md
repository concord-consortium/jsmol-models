jsmol-models offline bundle
============

Prepackaged version of JSmol that includes all the models and necessary JSmol JavaScript files.
It does not require internet connection.

Deployed to: [https://models-resources.concord.org/jsmol/jsmol-offline.tar.gz](https://models-resources.concord.org/jsmol/jsmol-offline.tar.gz).

It can be used to create a standalone Lab interactive:
[http://lab.concord.org/standalone/create.html](http://lab.concord.org/standalone/create.html)

## Development

Node.js and npm is required.

To build the offline bundle, just run:

```
cd offline-bundle
npm install
./build.js
```

It will be saved at `jsmol-offline` in the main directory of this repository.

## Custom configuration

The default configuration embeds all the model files and quite large set of JSmol JavaScript libraries. 
So, it should work with all the models, but it's pretty large - around 18-20MB.

You can modify `config.js` file and provide custom list of files that should be embedded to make it smaller. 
There's commented out example in `config.js` - a list of files necessary for DNA model.

The easiest wat to find out what files are necessary is to use the default package first, open interactive, 
play with all its features (very important as files are loaded dynamically, only when they're necessary),
and finally inspect `Jmol._filesLoaded` variable that lists all of them. Remember to switch console context 
in your web browser from Lab interactive page to the JSmol embeddable.html.
