chrome.browserAction.onClicked.addListener( function( activeTab ) {
    chrome.tabs.create({ 
        url: chrome.extension.getURL( 'index.html' )
    });
});

(function() {
    if ( !localStorage['lang'] ) {    
        var language = chrome.i18n.getMessage( '@@ui_locale' );
      
        switch( language ) {
            case 'ru' : localStorage['language'] = 'ru'; break;
            default : localStorage['language'] = 'en';
        }
    }
})();