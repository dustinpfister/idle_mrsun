import { StateMachine }  from "./js/mrsun-statemachine/sm.mjs"
// create sm object that will use PLATFORM_ELECTRON
const sm = window.sm = StateMachine.create({
    el: document.getElementById('wrap_main')
});
// start it up
StateMachine.start(sm);
