# (Depreciated - see http://wikilogic.github.io/ for contributors setup)

# WikiLogic 0.4: Ferret

## *F*ront *E*nd: *R*est*R*ucturing *E*very*T*hing 

### [![Build Status](https://travis-ci.org/WikiLogic/WikiLogic.svg?branch=master)](https://travis-ci.org/WikiLogic/WikiLogic)

---

### Getting set up

You'll need these already installed:

 - [Node.js](http://nodejs.org/)
 - [MongoDB](http://www.mongodb.org/)
 - [Browserify](http://browserify.org/)
 - [Gulp 4](http://gulpjs.com/) `npm install -g gulpjs/gulp.git#4.0`
 npm install -g jshint

Then you can pull in WikiLogic:

 - `git clone https://github.com/WikiLogic/WikiLogic.git`
 - `npm install`
 - `npm start` This will just run the server. TODO: hook up to the remote db when this command is run. 
 - `npm run start:dev` This will run EVERYTHNIG locally, don't be afraid if your terminal goes nuts, there's a lot happening in there.
 
#### Alternative setup with Docker
With [Docker](https://www.docker.com) and [Docker Compose](https://docs.docker.com/compose/), you won't need to install MongoDB and the dependencies manually.

Just execute the following commands:
```Bash
docker-compose build
docker-compose up
```

Open your browser and go to `http://localhost:3000` to see the application. You can also connect to your MongoDB on `localhost:27017` (e.g. with [RoboMongo](https://robomongo.org)).

Notes:
 - The `node_modules` directory is “inside” the Docker container, so you won't see it on your host machine.
 - This has only been tested with [Docker for Mac](https://docs.docker.com/docker-for-mac/). URLs can change under Linux or Windows.

---

### What's where?

#### `/server `

This is the Express app, job 1: serve the static assets. job 2: serve the data. In future versions these two jobs will be split.

#### `/static`

This holds the JS and CSS for the web app. Do not do any development in here, your work will be overwritten by compilers.

#### `/staticSrc`

This hold the es6 / sass files that will be compiled down into the static folder. This is where any Front End Devs will live.

#### `/test`

This is the code that will test everything. When you push / pullrequest to our github repo, travis will run these tests and only accept the branch / commit if the tests pass.

---

### How does it run?

 - Clientside we're using [Rivets.js](http://rivetsjs.com/) to bind data to the DOM and browserify to deal with the JS that manages that data.
 - Serverside we're using [Express.js](http://expressjs.com/) to serve the site.
 - For the database we're using [MongoDB](https://www.mongodb.com/).

---

### DB cheatsheet for development

see user profile:
`db.users.find({"local.email":"email here"}).pretty()`

remove drafts from user profile:
`db.users.update({"local.email":"email here"},{$set:{"meta.unPublished":[ ]}})`
`db.users.update({"local.email":"email here"},{$set:{"meta.published":[ ]}})`

clear out claims:
`db.claims.remove({"status":false})` / true

clear out drafts

---

### Miscellaneous thought dump:

Root statement:

* Hypothesis (prediction)
* Observation
* Undisputed fact
* Absolute truth

Example claims
>There are no absolute truths
(it would be an argument against itself)

Shout out to [useiconic](https://useiconic.com/open/) for the icons!

this looks good for the graph: http://cytoscapeweb.cytoscape.org/tutorial  
and this: http://sigmajs.org/

Sounds for fun? http://loudlinks.rocks/#examples

Fancy tool tip positioning> https://popper.js.org/

Make it look like office? http://dev.office.com/fabric

swap db to rethink - push!!!

One day: http://googleresearch.blogspot.com/2016/05/announcing-syntaxnet-worlds-most.html?m=1 here's the repo: https://github.com/tensorflow/models/tree/master/syntaxnet

some good ideas for styles: http://cognition.happycog.com/article/happy-cog-starter-files-2016-edition

Haxl: https://github.com/facebook/Haxl could be useful

port finder in case ports are already being used on your computer: https://github.com/indexzero/node-portfinder

get some standard linting set up: https://blog.codepen.io/2014/04/22/009-code-quality/

for documentation: https://github.com/integrations/gitbook

UI ideas: https://airtable.com/templates/human-resources/employee-directory

better auth: https://auth0.com/blog/2015/08/20/from-theory-to-practice-adding-two-factor-to-node-dot-js/

Need to build a node map version of this: http://codepen.io/birjolaxew/pen/jrqzrb

cool style idea for the tabs: http://codepen.io/marcobiedermann/pen/aZZQww

this may be needed: https://github.com/paulmillr/es6-shim/ needs more looking into!

interesting for deployment/scaling: http://kubernetes.io/

Also for when we get really big: https://webtorrent.io/ p2p streaming data using the browser!
and this: https://zeronet.io/

cool tree design idea: http://png.clipart.me/graphics/thumbs/199/icon-tree-flat-abstract-background-with-web-icons-interface-symbols-cloud-computing-mobile-devices-business-concept_199444085.jpg

Love this style: http://codepen.io/Benny29390/pen/Lkwbxz

For the back end - build together microservices and identify those that can be dropped in times of really high load.

ohhhhh for the canvas: https://www.quantamagazine.org/20150803-physics-theories-map/

---

other argument maps:

 - debategraph: http://debategraph.org/

animations on scroll: https://github.com/michalsnik/aos - test this, looks good!

---

Wikilogic is maintained by The [WikiLogic Foundation](http://www.wikilogicfoundation.org/) 

