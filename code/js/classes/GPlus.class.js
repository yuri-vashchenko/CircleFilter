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
            getTokenOAuth2( function( token ) {
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
                revokeTokens( refreshTokenOAuth2 );
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
        
        getCirclesList : function( callback ) {     
            getTokenGPlus( function( token ) {
                xhrWithAuth( 'GET', 'https://plus.google.com/u/0/_/socialgraph/lookup/circles', false, callback );
            });
        },
        
        getCirclesAndUsersList : function( callback ) {
            getTokenGPlus( function( token ) {
                xhrWithAuth( 'GET', 'https://plus.google.com/u/0/_/socialgraph/lookup/circles?m=true', false, callback );
            });
        },
        
        getUserEmail : function( callback ) {
            xhrWithAuth( 'GET', 'https://www.googleapis.com/userinfo/v2/me?fields=email', false, callback );
        },
        /**
         * Add people to a circle in your account.
         * @param {string} circleId the Circle to add the people to.
         * @param {{Array.<string>}} usersIds The people to add.
         * @param {function(string)} callback The ids of the people added.
         */
        addPeopleToCircle : function( circleId, usersIds, callback ) {
            getTokenGPlus( function( token ) {
                var usersIdsArray = [];
                usersIds.forEach( function( element, index ) {
                    usersIdsArray.push('[[null,null,"' + element + '"],null,[]]');
                });
                
                xhrWithAuth( 'POST', 'https://plus.google.com/u/0/_/socialgraph/mutate/modifymemberships/?a=[[["' + circleId + '"]]]&m=[[' + usersIdsArray.join( ',' ) + ']]&at=' + token, false, callback );
            });
        },
        
        /**
         * Remove people from a circle in your account.
         *
         * @param {string} circleId the Circle to remove people from.
         * @param {{Array.<string>}} usersIds The people to add.
         * @param {function(string)} callback
         */
        removePeopleFromCircle : function( circleId, usersIds, callback ) {
            getTokenGPlus( function( token ) {
                var usersIdsArray = [];
                usersIds.forEach( function( element, index ) {
                    usersIdsArray.push( '[null,null,"' + element + '"]' );
                });
                
                xhrWithAuth( 'POST', 'https://plus.google.com/u/0/_/socialgraph/mutate/removemember/?c=["' + circleId + '"]&m=[[' + usersIdsArray.join( ',' ) + ']]&at=' + token, false, callback );
            });
        },
        /**
         * Create a new empty circle in your account.
         *
         * @param {string} name The circle names.
         * @param {string} opt_description Optional description.
         * @param {function(string)} callback The ID of the circle.
         */
        createCircle : function( name, opt_description, callback ) {
            getTokenGPlus( function( token ) {
                var data = 't=2&n=' + encodeURIComponent( name ) + '&m=[[]]';
                if ( opt_description ) {
                    data += '&d=' + encodeURIComponent( opt_description );
                }
                data += '&at=' + token;
                
                xhrWithAuth( 'POST', 'https://plus.google.com/u/0/_/socialgraph/mutate/create/?' + data, false, callback );
            });
        },
        /**
         * Removes a circle from your profile.
         *
         * @param {string} circleId The circle ID.
         * @param {function(boolean)} callback.
         */
        removeCircle : function( circleId, callback ) {
            getTokenGPlus( function( token ) {
                xhrWithAuth( 'POST', 'https://plus.google.com/u/0/_/socialgraph/mutate/delete/?c=["' + circleId + '"]&at=' + token, false, callback );
            });
        },
        
        revokeToken : function( callback ) {
            revokeTokens( callback );
        }
    }
})();