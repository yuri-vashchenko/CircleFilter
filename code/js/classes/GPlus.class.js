var GPlus = (function() {
    this._session = null;
	_idTabAvtorization = null;
    function getSession( opt_reset ) {
        if ( !this._session ) {
            var xhr = $.ajax({
                type: 'GET',
                url: 'https://plus.google.com/u/0/',
                data: null,
                async: false
            });
			
            // For some reason, the top command is becoming unstable in Chrome. It
            // freezes the entire browser. For now, we will just discover it since
            // indexOf doesn't freeze while search/match/exec freezes.
            var isLogged = false;
            var searchForString = ',"https://csi.gstatic.com/csi","';
            var responseText = xhr.responseText;
            if (responseText != null) {
                var startIndex = responseText.indexOf(searchForString);
                if (startIndex != -1) {
                    var remainingText = responseText.substring(startIndex + searchForString.length);
                    var foundSession = remainingText.substring(0, remainingText.indexOf('"'));

                    // Validates it.
                    if (foundSession.match(/((?:[a-zA-Z0-9]+_?)+:[0-9]+)/)) {
                        this._session = foundSession;
                        isLogged = true;
                    }
                }
            }
            if (!isLogged) {
                // TODO: Somehow bring that back to the user.
                this._session = null;
                console.error('Invalid session, please login to Google+');
				if ( _idTabAvtorization == null ) {
					chrome.tabs.create( { 'url' : 'https://accounts.google.com/ServiceLogin', 'selected' : true } , function ( tab ) {
						_idTabAvtorization = tab.id;
						intervalID = setInterval( function() {
												try {
												chrome.tabs.get( _idTabAvtorization ,function callback( tab ) {
														if(tab.url == 'https://www.google.com/settings/personalinfo'){
														chrome.tabs.remove(tab.id, function callback( tab ){
														});
														clearInterval(intervalID);
														}
													});
												}
												catch( exaption ){
													console.log(exaption);
													clearInterval(intervalID);
													_idTabAvtorization = null;
												}
												} , 1000);
					});
				}
			}
        }
        return this._session;
    }
    
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

        function requestComplete() {
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
        
        getCirclesList : function( callback ) {
			if ( !this._session ) {
				xhrWithAuth( 'GET', 'https://plus.google.com/u/0/_/socialgraph/lookup/circles', false, callback );
			}
        },
        
        getCirclesAndUsersList : function( callback ) {            
            if ( !this._session ) {
				xhrWithAuth( 'GET', 'https://plus.google.com/u/0/_/socialgraph/lookup/circles?m=true', false, callback );
			}
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
            if ( !this._session ) {
				var usersIdsArray = [];
				usersIds.forEach( function( element, index ) {
					usersIdsArray.push('[[null,null,"' + element + '"],null,[]]');
				});
				
				xhrWithAuth( 'POST', 'https://plus.google.com/u/0/_/socialgraph/mutate/modifymemberships/?a=[[["' + circleId + '"]]]&m=[[' + usersIdsArray.join( ',' ) + ']]&at=' + getSession(), false, callback );
			}
		},
        
        /**
         * Remove people from a circle in your account.
         *
         * @param {string} circleId the Circle to remove people from.
         * @param {{Array.<string>}} usersIds The people to add.
         * @param {function(string)} callback
         */
        removePeopleFromCircle : function( circleId, usersIds, callback ) {
            if ( !this._session ) {
				var usersIdsArray = [];
				usersIds.forEach( function( element, index ) {
					usersIdsArray.push( '[null,null,"' + element + '"]' );
				});
				xhrWithAuth( 'POST', 'https://plus.google.com/u/0/_/socialgraph/mutate/removemember/?c=["' + circle + '"]&m=[[' + usersIdsArray.join( ',' ) + ']]&at=' + getSession(), false, callback );
			}
		},
        /**
         * Create a new empty circle in your account.
         *
         * @param {string} name The circle names.
         * @param {string} opt_description Optional description.
         * @param {function(string)} callback The ID of the circle.
		 * Example:
		 *
         */
        createCircle : function( name, opt_description, callback ) {
            if ( !this._session ) {
				var data = 't=2&n=' + encodeURIComponent( name ) + '&m=[[]]';
				if ( opt_description ) {
					data += '&d=' + encodeURIComponent( opt_description );
				}
				data += '&at=' + getSession();
				
				xhrWithAuth( 'POST', 'https://plus.google.com/u/0/_/socialgraph/mutate/create/?' + data, false, callback );
			}
		},
        /**
         * Removes a circle from your profile.
         *
         * @param {string} circleId The circle ID.
         * @param {function(boolean)} callback.
         */
        removeCircle : function( circleId, callback ) {
			if ( !this._session ) {
				xhrWithAuth( 'POST', 'https://plus.google.com/u/0/_/socialgraph/mutate/delete/?c=["' + circleId + '"]&at=' + getSession(), false, callback );
			}
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