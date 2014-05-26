var GPlus = (function() {
    function xhrWithAuth( method, url, interactive, callback, waitTime ) {
        var access_token,
              result = {},
              retry = true,
              waitTime = waitTime || 0; 
        
        if ( waitTime > 16 ) {
            retry = false;
        }
        
        setTimeout( getToken, ( waitTime == 0 ? waitTime : ( waitTime + Math.random() ) ) * 1000 );
        
        function getToken() {
            chrome.identity.getAuthToken( { interactive : interactive }, function( token ) {
                if ( chrome.runtime.lastError ) {
                    callback( chrome.runtime.lastError );
                }
                
                access_token = token;
                requestStart();
                
            });
        }

        function requestStart() {
            var xhr = new XMLHttpRequest();
            xhr.open( method, url );
            xhr.setRequestHeader( 'Authorization', 'Bearer ' + access_token );
            xhr.onload = requestComplete;
            xhr.send();
        }

        function requestComplete() { console.log( waitTime )
            if ( this.status == 401 && retry ) {
                retry = false;
                chrome.identity.removeCachedAuthToken( { token: access_token }, getToken );
            } else if ( this.status == 403 && retry ) { 
                xhrWithAuth( method, url, interactive, callback, ( waitTime == 0 ? 1 : waitTime * 2 ) );
            } else  {
                callback( null, this.status, this.response );
            }
        }
    }
    
    function checkResponse( error, status, response ) {
        if ( !error && status == 200 ) {            
            return JSON.parse( response );
        }
    }

    return {
        getUserIdsList : function( onUserIdsListPageFetched, maxResults, nextPageToken ) {
            
            xhrWithAuth( 'GET', 'https://www.googleapis.com/plus/v1/people/me/people/visible?fields=items%2Fid%2CnextPageToken%2CtotalItems&'
                + $.param({ 
                    'maxResults' : 100 || maxResults, 
                    'pageToken' : nextPageToken
                }), 
                false, 
                nextIteration 
            );
            
            function nextIteration( error, status, response ) {
                onUserIdsListPageFetched( error, status, response );
                if ( !error && status == 200 && JSON.parse( response ).nextPageToken ) {
                    GPlus.getUserIdsList( onUserIdsListPageFetched, maxResults, JSON.parse( response ).nextPageToken );
                }
            }
        },
        getUserInfo : function( id, properties, callback ) {
            var params = '';
            
            for ( var i = 0; i < properties.length; i++ ) {
                switch ( properties[i] ) {
                    case 'firstName':
                        params += 'name(givenName)';
                        break;
                    case 'lastName':
                        params += 'name(familyName)';
                        break;
                    case 'photo':
                        params += 'image';
                        break;
                    case 'age':
                        params += 'ageRange';
                        break;
                    case 'sex':
                        params += 'gender';
                        break;
                    case 'city':
                        params += 'placesLived';
                        break;
                    default: break;
                }
                params += ( i < properties.length - 1 ? '%2C' : '' );
            }
            xhrWithAuth( 'GET', 'https://www.googleapis.com/plus/v1/people/' + id + '?fields=' + params, false, callback );
        },
        getUsersList : function( onUsersListPageFetched, maxResults, nextPageToken ) {
            
            xhrWithAuth( 'GET', 'https://www.googleapis.com/plus/v1/people/me/people/visible?'
                + $.param({ 
                    'maxResults' : 100 || maxResults, 
                    'pageToken' : nextPageToken
                }), false, nextIteration );
            
            function nextIteration( error, status, response ) {
                onUsersListPageFetched( error, status, response );
                if ( !error && status == 200 && JSON.parse( response ).nextPageToken ) {
                    GPlus.getUsersList( onUsersListPageFetched, maxResults, JSON.parse( response ).nextPageToken );
                }
            }
        },
        
        getUserEmail : function( callback ) {
            xhrWithAuth( 'GET', 'https://www.googleapis.com/userinfo/v2/me?fields=email', false, callback );
        },
        
        testQuery : function( query, callback ) {
            xhrWithAuth( 'GET', query, false, callback );
        },
        
        revokeToken : function( callback ) {
            chrome.identity.getAuthToken( { 'interactive': false }, function( current_token ) {
                if ( !chrome.runtime.lastError ) {
                    chrome.identity.removeCachedAuthToken( { token : current_token }, function() {} );
                    
                    var xhr = new XMLHttpRequest();
                    xhr.open( 'GET', 'https://accounts.google.com/o/oauth2/revoke?token=' + current_token );
                    xhr.onload = callback;
                    xhr.send();
                }   
            });
        }
    }
})();