'use strict';

chrome.browserAction.onClicked.addListener( function( activeTab ) {
    getTokenOAuth2( function( token ) { 
        chrome.tabs.create( { 'url' : chrome.extension.getURL( 'index.html' ), 'selected' : true } );
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