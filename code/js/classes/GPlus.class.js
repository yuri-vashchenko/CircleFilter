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

                refreshTokenOAuth2( function( token ) {
                    if ( token ) {
                        alert("refresh token complete");
                        xhrWithAuth( method, url, interactive, callback, ( waitTime == 0 ? 1 : waitTime ) );
                    } else {
                        revokeTokens( function() {
                            StorageManager.clear();
                        });
                    }
                });

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

    function propertyToParam( property ){
        var result = '';
        switch ( property ) {
                    case 'id':
                        result = 'id';
                        break;
                    case 'firstName':
                        result = 'name(givenName)';
                        break;
                    case 'lastName':
                        result = 'name(familyName)';
                        break;
                    case 'photo':
                        result = 'image';
                        break;
                    case 'age':
                        result = 'ageRange';
                        break;
                    case 'sex':
                        result = 'gender';
                        break;
                    case 'city':
                        result = 'placesLived';
                        break;
                    case 'posts':
                        result = 'items(updated,verb)';
                        break;
                    default: break;
                }
        return result;
    }

    function usersIDsToParam( listUsersID ){
        var result = '';
        for ( var i = 0; i < listUsersID.length; i++ ) {
            result += listUsersID[i];
            result += ( i < properties.length - 1 ? '%2C' : '' );
        }
        return result;
    }

    function propertiesToParam( properties ){
        var result = '';
        for ( var i = 0; i < properties.length; i++ ) {
            result += propertyToParam( properties[i] );
            result += ( i < properties.length - 1 ? '%2C' : '' );
        }
        return result;
    }

    function checkEmails( callback ) {
        StorageManager.getUserEmailUnofficialAPI( function( userEmailUnofficialAPI ) {
            StorageManager.getUserEmail( function( email ) {
                if ( email == userEmailUnofficialAPI ) {
                    callback();
                } else {
                    alert( "different emails: " + email + " and " + userEmailUnofficialAPI + ". Application will closed." );
                    StorageManager.clear();
                    revokeTokens(function(){
                        closeWindow();
                    });
                }
            });
        });

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

            xhrWithAuth( 'GET', 'https://www.googleapis.com/plus/v1/people/' + id + '?fields=' + propertiesToParam( properties ), false, callback );
        },
        getUserActivitiesList : function( userId, onUserActivitiesPageFetched, maxResults, nextPageToken ) {

            xhrWithAuth( 'GET', 'https://www.googleapis.com/plus/v1/people/' + userId + '/activities/public?'
                + $.param({
                    'maxResults' : 100 || maxResults,
                    'fields' : propertiesToParam( ['posts'] ),
                    'pageToken' : nextPageToken
                }),
                false,
                nextIteration
            );

            function nextIteration( error, status, response ) {
                onUserActivitiesPageFetched( error, status, response );
                if ( !error && status == 200 && JSON.parse( response ).nextPageToken ) {
                    GPlus.onUserActivitiesPageFetched( onUserActivitiesPageFetched, maxResults, JSON.parse( response ).nextPageToken );
                }
            }
        },
        getUsersInfo : function( onUserListPageFetched, properties, maxResults, nextPageToken ) {

            xhrWithAuth( 'GET', 'https://www.googleapis.com/plus/v1/people/me/people/visible?fields=items(' + propertiesToParam( properties ) +')%2CnextPageToken%2CtotalItems&'
            + $.param({
                'maxResults' : 100 || maxResults,
                'pageToken' : nextPageToken
            }),
            false,
            nextIteration );
            function nextIteration( error, status, response ) {
                onUserListPageFetched( error, status, response );
                if ( !error && status == 200 && JSON.parse( response ).nextPageToken ) {
                    GPlus.getUsersInfo( onUserListPageFetched, properties, maxResults, JSON.parse( response ).nextPageToken );
                }
            }
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
            checkEmails( function() {
                getTokenGPlus( function( token ) {
                    xhrWithAuth( 'GET', 'https://plus.google.com/u/' + getPageId() + '/_/socialgraph/lookup/circles', false, callback );
                });
            });
        },

        getCirclesAndUsersList : function( callback ) {
            checkEmails( function() {
                getTokenGPlus( function( token ) {
                    xhrWithAuth( 'GET', 'https://plus.google.com/u/' + getPageId() + '/_/socialgraph/lookup/circles?m=true', false, callback );
                });
            });
        },

        getUserEmail : function( callback ) {
            xhrWithAuth( 'GET', 'https://www.googleapis.com/userinfo/v2/me?fields=email', false, callback );
        },

        getUserEmailUnofficialAPI : function( callback ) {
            xhrWithAuth( 'GET', 'https://plus.google.com/u/' + getPageId() + '/_/initialdata?key=2', false, callback );
        },
        /**
         * Add people to a circle in your account.
         * @param {string} circleId the Circle to add the people to.
         * @param {{Array.<string>}} usersIds The people to add.
         * @param {function(string)} callback The ids of the people added.
         */
        addPeopleToCircle : function( circleId, usersIds, callback ) {
            checkEmails( function() {
                getTokenGPlus( function( token ) {
                    var usersIdsArray = [];
                    usersIds.forEach( function( element, index ) {
                        usersIdsArray.push('[[null,null,"' + element + '"],null,[]]');
                    });

                    xhrWithAuth( 'POST', 'https://plus.google.com/u/' + getPageId() + '/_/socialgraph/mutate/modifymemberships/?a=[[["' + circleId + '"]]]&m=[[' + usersIdsArray.join( ',' ) + ']]&at=' + token, false, callback );
                });
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
            checkEmails( function() {
                getTokenGPlus( function( token ) {
                    var usersIdsArray = [];
                    usersIds.forEach( function( element, index ) {
                        usersIdsArray.push( '[null,null,"' + element + '"]' );
                    });

                    xhrWithAuth( 'POST', 'https://plus.google.com/u/' + getPageId() + '/_/socialgraph/mutate/removemember/?c=["' + circleId + '"]&m=[[' + usersIdsArray.join( ',' ) + ']]&at=' + token, false, callback );
                });
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
            checkEmails( function() {
                getTokenGPlus( function( token ) {
                    var data = 't=2&n=' + encodeURIComponent( name ) + '&m=[[]]';
                    if ( opt_description ) {
                        data += '&d=' + encodeURIComponent( opt_description );
                    }
                    data += '&at=' + token;

                    xhrWithAuth( 'POST', 'https://plus.google.com/u/' + getPageId() + '/_/socialgraph/mutate/create/?' + data, false, callback );
                });
            });
        },
        /**
         * Removes a circle from your profile.
         *
         * @param {string} circleId The circle ID.
         * @param {function(boolean)} callback.
         */
        removeCircle : function( circleId, callback ) {
            checkEmails( function() {
                getTokenGPlus( function( token ) {
                    xhrWithAuth( 'POST', 'https://plus.google.com/u/' + getPageId() + '/_/socialgraph/mutate/delete/?c=["' + circleId + '"]&at=' + token, false, callback );
                });
            });
        },

        revokeToken : function( callback ) {
            revokeTokens( callback );
        }


    }
})();