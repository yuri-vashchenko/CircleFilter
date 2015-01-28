function getTokenOAuth2( callback ) {
    if ( localStorage['OAuth2Token'] ) {
        callback( localStorage['OAuth2Token'] );
        return;
    }

    var clientId = '192023125772-sr3b1p2c0ip8ig8l3nb4qmml12ht5mtq.apps.googleusercontent.com',
          apiKey = 'AIzaSyA0DGuMhkHgw1bjH5AEjSZAA4B6g4enDVY',
          redirectUri = 'urn:ietf:wg:oauth:2.0:oob',
          scope = "https://www.googleapis.com/auth/userinfo.email" +
            " https://www.googleapis.com/auth/plus.login" +
            " https://www.googleapis.com/auth/plus.me";
    
    chrome.tabs.create( {
        'url' : 'https://accounts.google.com/o/oauth2/auth?' +
        $.param({
            scope: scope,
            redirect_uri: redirectUri,
            response_type: 'code',
            client_id: clientId,
            access_type: 'offline'
        }), 'selected' : true },
        
        function ( tab ) {
            var authTabId = tab.id,
                  pageId;
                  
            var checkThreadId = setInterval( function() {
                try {
                    chrome.tabs.get( authTabId , function( tab ) {
                        if ( tab.title.match( 'Success' ) ) {
                            clearInterval( checkThreadId );
                            var code = '';
                            getCode( tab, function( data ) {
                                if ( data.length > 0 ) {
                                    $.ajax({
                                        type: 'POST',
                                        url: 'https://accounts.google.com/o/oauth2/token',
                                        data: {
                                            code: data,
                                            client_id: clientId,
                                            api_key: apiKey,
                                            redirect_uri: redirectUri,
                                            grant_type: 'authorization_code'
                                        },
                                        success: function( response ) {
                                            chrome.tabs.remove( tab.id, function ( tab ) {
                                                localStorage['OAuth2Token'] = response.access_token;
                                                localStorage['pageId'] = ( pageId ? pageId : '0' );
                                                localStorage['refreshOAuth2Token'] = response.refresh_token;
                                                callback( response.access_token );
                                            });
                                        }
                                    });
                                }
                            });
                        } else if ( tab.url.match( 'https://accounts.google.com/o/oauth2/auth' ) ) {
                            var authuserIndex = tab.url.indexOf( 'authuser=' + 9 );
                            
                            if ( authuserIndex >= 0 ) {
                                pageId = tab.url.substr( authuserIndex );
                                
                                var nextParamIndex = pageId.indexOf( '&' );
                                
                                if ( nextParamIndex >= 0) {
                                    pageId = pageId.substr( 0, nextParamIndex );
                                }
                            }
                        }
                     });
                } catch ( exception ) {
                    clearInterval( checkThreadId );
                }
            } , 500);
        }
    );
    
    
    function getCode( tab, callback ) {
        var code = 'var meta = document.querySelector( "#code" );' +
        '({' +
        '    title: document.title,' +
        '    data: meta.value' +
        '});';
        chrome.tabs.executeScript( tab.id, { code: code }, function( results ) {
            if ( chrome.extension.lastError ) {
                console.log( 'There was an error injecting script :\n'+chrome.extension.lastError.message );
            }
            callback( results[0].data );
        });
    }
}

function getPageId() {
    return ( localStorage['pageId'] ? localStorage['pageId'] : '0' ); 
}

function getTokenGPlus( callback ) {
    if ( localStorage['GPlusToken'] ) {
        callback( localStorage['GPlusToken'] );
        return;
    } else {
        $.ajax({
            type: 'GET',
            url: 'https://plus.google.com/u/' + getPageId() +'/',
            async: false,
            success: function( responseText ) {
                localStorage['GPlusToken'] = getSession( responseText );                                        
                callback( localStorage['GPlusToken'] );
            }
        });
        return;
    }
    
    chrome.tabs.create( { 'url' : 'https://accounts.google.com/ServiceLogin' , 'selected' : true },        
        function ( tab ) {
            var authTabId = tab.id;
            var checkThreadId = setInterval( function() {
                chrome.tabs.get( authTabId , function( tab ) {
                    try {
                        if( tab.url == 'https://www.google.com/settings/personalinfo' ) {
                            clearInterval( checkThreadId );
                            $.ajax({
                                type: 'GET',
                                url: 'https://plus.google.com/u/' + getPageId() +'/',
                                success: function( responseText ) {
                                    chrome.tabs.remove( tab.id, function ( tab ) {
                                        localStorage['GPlusToken'] = getSession( responseText );                                        
                                        callback( localStorage['GPlusToken'] );
                                    });
                                }
                            });
                        }
                    } catch ( exception ) {
                        clearInterval( checkThreadId );
                    }
                 });
            } , 500);
        }
    );

    function getSession( responseText ) {
        var searchForString = ',"https://csi.gstatic.com/csi","';
        
        if ( responseText != null ) {
            var startIndex = responseText.indexOf( searchForString );
            
            if ( startIndex != -1 ) {
                var remainingText = responseText.substring( startIndex + searchForString.length ),
                      foundSession = remainingText.substring( 0, remainingText.indexOf( '"' ) );

                // Validates it.
                if ( foundSession.match( /((?:[a-zA-Z0-9]+_?)+:[0-9]+)/ ) ) {
                    return foundSession;
                }
            }
        }
    }
}

function refreshTokenOAuth2( callback ) {
    var clientId = '192023125772-sr3b1p2c0ip8ig8l3nb4qmml12ht5mtq.apps.googleusercontent.com',
          apiKey = 'AIzaSyA0DGuMhkHgw1bjH5AEjSZAA4B6g4enDVY';
    
    if ( localStorage['refreshOAuth2Token'] ) {
        $.ajax({
            type: 'POST',
            url: 'https://accounts.google.com/o/oauth2/token',
            data: {
                refresh_token: localStorage['refreshOAuth2Token'],
                client_id: clientId,
                api_key: apiKey,
                grant_type: 'refresh_token'
            },
            success: function( response ) {
                localStorage['OAuth2Token'] = response.access_token;
                localStorage.removeItem( 'refreshOAuth2Token' );
                callback( response.access_token );
            },
            error: function( response ) {
                callback();
            }        
        });
    } else {
        callback();
    }
}

function revokeTokens( callback ) {
    if ( localStorage['OAuth2Token'] ) {
        $.ajax({
            type: 'GET',
            url: 'https://accounts.google.com/o/oauth2/revoke',
            data: { token: localStorage['OAuth2Token'] },
            success: function() {
                clearTokensInfo();
                callback();
            },
            error: function() {
                clearTokensInfo();
                callback();
            }
        });
    } else {
        clearTokensInfo();
    }
    
    function clearTokensInfo() {
        localStorage.removeItem( 'GPlusToken' );
        localStorage.removeItem( 'pageId' );
        localStorage.removeItem( 'OAuth2Token' );
        localStorage.removeItem( 'refreshOAuth2Token' );
    }
}