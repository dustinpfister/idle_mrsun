# idle_mrsun

An Idle game about Mr Sun and the World that surrounds him.


## Install

There are two general ways of using this as of r89, use it as an electionjs app, or start a static server to play the browser form of the game on a local network. Both ways of doing so involve cloning down a shallow clone of the repo for a given revision number that is desired. After that just run the server script to start the static server, or do an npm install to get electionjs to start that form of the game directly from source.

### Run The Electionjs app

To get the electionjs app working there is getting a shallow clone at a given revision number starting at 89. Once that is cloned down I cna cd into the folder and do an npm install to install the needed packages to run the electionjs form of the game. Once that is done I can start the main electionjs version of the game by calling the main start script with npm.

```
$ git clone --depth 1 -b 0.96.0 https://github.com/dustinpfister/idle_mrsun
$ cd idle_mrsun
$ npm install
$ npm start
```

### Run The static server

The process of just running the static server is more or less the same. Only as of r89 there is no need to install any npm packages, one can just run the server script.

```
$ git clone --depth 1 -b 0.96.0 https://github.com/dustinpfister/idle_mrsun
$ cd idle_mrsun_r89
$ npm run static 8080
```

## How to Play

When the game first starts Mr Sun will be at the center of an area between all the land sections of the world. The player can then move the sun to a new location in this area or just leave it there. In any case there is clicking on one or the land section objects to switch from this world state of the game, to the land state. In Land state the player can then unlock slots, and start to create an upgrade rock blocks within these unlocked slots. This will result in the mana delta rates of sections to go up which in turn can be used to unlock more slots, creat and upgrade more blocks, and so forth.



