var GPlus = (function() {
    function xhrWithAuth( method, url, interactive, callback ) {
        var access_token,
              result = {},
              retry = true;

        getToken();
        
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

        function requestComplete() {
            if ( this.status == 401 && retry ) {
                retry = false;
                chrome.identity.removeCachedAuthToken( { token: access_token }, getToken );
            } else {
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