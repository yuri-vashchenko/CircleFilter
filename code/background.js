'use strict';

chrome.browserAction.onClicked.addListener( function( activeTab ) {
    chrome.identity.getAuthToken({ 'interactive': true }, function( token ) {
        if ( chrome.runtime.lastError ) {
            console.log( chrome.runtime.lastError );
        } else {
            chrome.tabs.create( { 'url' : chrome.extension.getURL( 'index.html' ), 'selected' : true } );
        }
    });
});

(function() {
    if ( !chrome.localStorage['lang'] ) {    
        var language = chrome.i18n.getMessage( '@@ui_locale' );
      
        switch( language ) {
            case 'ru' : chrome.localStorage['language'] = 'ru'; break;
            default : chrome.localStorage['language'] = 'en';
        }
    }
})();