'use strict';

chrome.browserAction.onClicked.addListener( function( activeTab ) {
    getTokenOAuth2( function( token ) { 
        chrome.tabs.create( { 'url' : chrome.extension.getURL( 'index.html' ), 'selected' : true } );
    });
});