// platform-browser.mjs - for idle_mrsun
const PLATFORM_BROWSER = {};

PLATFORM_BROWSER.auto_load = () => {
    console.log('platform-browser: auto load...');
    return Promise.reject( new Error('no browser load feature') );
};

PLATFORM_BROWSER.auto_save = (text_lz) => {
    console.log('platform-browser: auto save...');
    console.log(text_lz);
    return Promise.reject( new Error('no browser save feature') );
};

PLATFORM_BROWSER.log = (mess) => {
    console.log(mess);
};

//-------- ----------
// EXPORT
//-------- ----------
export { PLATFORM_BROWSER };
