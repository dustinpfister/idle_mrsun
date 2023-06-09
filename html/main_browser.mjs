import { PLATFORM_BROWSER } from './js/mrsun-platform-browser/platform-browser.mjs'
import { StateMachine }  from './js/mrsun-statemachine/sm.mjs'

// create sm object that will use PLATFORM_ELECTRON
const sm = window.sm = StateMachine.create({
    el: document.getElementById('wrap_main'),
    PLATFORM: PLATFORM_BROWSER
});
// start it up
StateMachine.start(sm);
