// platform-browser.mjs - for idle_mrsun
const PLATFORM_BROWSER = {};

const LS_KEY = 'idle-mrsun-autosave';

// use the getItem method of the localStorage API
// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
PLATFORM_BROWSER.auto_load = () => {
    console.log('platform-browser: auto load...');
    const text = localStorage.getItem( LS_KEY );
    if(text === null){
        const err = new Error('ENULL: The autosave string is null');
        err.code = 'ENULL';
        return Promise.reject( err );
    }
    if(!text){
        const err = new Error('EFALS: The autosave string empty/false');
        err.code = 'EFALS';
        return Promise.reject( err );
    }
    return Promise.resolve(text);
};

// use the setItem method of the localStorage API
PLATFORM_BROWSER.auto_save = (text_lz) => {
    console.log('platform-browser: auto save...');
    try{
        localStorage.setItem(LS_KEY, text_lz);
        return Promise.resolve('platform-browser: looks like setItem call worked.');
    }catch(e){
        return Promise.reject(e);
    }
};

// using the removeItem method of local stoarge to clear state
PLATFORM_BROWSER.clear = () => {
    localStorage.removeItem(LS_KEY);
};

PLATFORM_BROWSER.log = (mess) => {
    console.log(mess);
};

//-------- ----------
// EXPORT
//-------- ----------
export { PLATFORM_BROWSER };
