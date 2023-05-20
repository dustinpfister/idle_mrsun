# idle_mrsun todo list


<!-------- ----------
 MRSUN-GAME - game.mjs, lands.mjs, sun.mjs
---------- ---------->

## () - rx - Mass Vector
   One major concern that I have when it comes to game play strategy is that there will be one single strategy that will prove to be the best course of action to maximize mana per tick at the fastest possible rate. The main thing about this concern is not so much that such a  strategy may exists, but the nature of game play that constitutes this strategy. For example if it just so happens that the strategy is creating and upgrading all the slots in just one land section, and having the sun positioned over it, that kind of game play is kind of boring, and does not showcase or involve other elements of the over all game.

The solution then might be some kind of feature that will detect if the player is in fact playing the game this way, and if so introduce some kind of or buff or not. In any case it is an element of content to have some kind of MASS VECTOR of sorts to know what the current state of this is. What I mean by this is that the act of placing all of the blocks in one land section will set the direction of the mass Vector there. In addition the magnate of the Vector will also be at the max as well.

## () - rx - level up game event
* () have an event that will fire each time a level up happens
* () in the event that the player jumps up a whole bunch of levels at once the event should fire for each level

## () - rx - Slot Class, Disabled Slot feature 
* () a slot object will have a disabled property which means that it can not be used at all

## () - rx - total game ticks
* () have a grand total game ticks count that will not reset with a super nova event
* () this will have to be part of the save
* () display this total in supernova state

<!-------- ----------
 MRSUN-UTILS - utils.mjs
---------- ---------->

## () - rx - utils format decimal, percision
* () it looks like there are still some problems with this method that require further testing
* () I think that I should have percision and dp arguments for this funciton
* () the percision value should be used

<!-------- ----------
 MRSUN-STATEMACHINE
---------- ---------->

## () - rx - sunspot upgrades state object
* () start a sunspot upgrades menu
* () the first upgrade can be something that lowers the base use to figure sunspots delta world value

## () - rx - Max Create button
* () have an option to do a max create when cretaing blocks

## () - rx - Half max button option
* () have a half max upgrade button option

## () - rx - Always state objects, State object priority
* () have always state objects that will always fire each time regardless of what the current state object is
* () have a new system for the state keys where I can add a number after the key name to define what the priority should be
* () default priority for state objects can be 2, but can be set to 0 to get them to fire before always\_1

## () - rx - Transition hooks
* () start transition events that will fire each time the setState method is called
* () have a onTransitionStart hook
* () have a onTransitionIn type hook
* () have a onTransitionOut type hook
* () have a renderTransition method that will be used in place for render when transitions are active

<!-------- ----------
 RENDERING / GRAPHICS
---------- ---------->

## () - rx - Using lzString for image data
* () I should start to make use of the built in draw feature that uses lzString to compess image data

## () - rx - Slot by slot real time rendering in world state
* () I would like to see about slot by slot, or maybe a few slots at a time, rendering in world state
* () Have a whole other canvas element for rendering the slots
* () Have another canvas element that I use to render outlines for the current slots that are being rendered

## () - rx - Style change of blocks based on temp
* () the img objects used to render slots should change based on temp of the section

## () - rx - Animated slots
* () I would like to have animated slots

<!-------- ----------
 OBJECT2D class
---------- ---------->

## () - rx - get children feature of Base Object2d class working
* () I would like to get the add feature of the object2d class working

## () - rx - object2d-dialog - start a message system
* () start a dialog system as a whole other file called dialog.js
* () pop up dialog window types with okay, cancel, ect.
* () message window type objects that are used to display status messages

## () - rx - object2d-buttons.js
* () have a buttons lib that extends the Object2D class

<!-------- ----------
 ELECTIONJS BUILD FEATURES
---------- ---------->

## () - rx - save as and open options
* () save as option for the current autosave
* () open menu option to load a save, and thus replace the autosave

<!-------- ----------
 BUGS
---------- ---------->

## () - rx - See about fixing init state stuck bug
    With electionjs there seems to be a bug where I can end up getting stuck in init state. 
    In windows I can trigger this by reloading a whole bunch of times real fast.

