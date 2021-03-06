var GPlusTranslator = (function() {
    var circleIdLength = 16;

    function parseDirtyJSON( input ) {
        var jsonString = input.replace( /\[,/g, '[null,' );
        jsonString = jsonString.replace( /,\]/g, ',null]' );
        jsonString = jsonString.replace( /,,/g, ',null,' );
        jsonString = jsonString.replace( /,,/g, ',null,' );
        jsonString = jsonString.replace( /\{(\d+):/g, '{"$1":' );
        return JSON.parse( jsonString );
    }

    return {

        userEmail: function( error, status, response, callback ) {
            if ( !error && status == 200 ) {
                callback( JSON.parse( response ).email );
            } else {
                callback( 'Error e-mail' );
            }
        },

        userEmailUnofficialAPI: function( error, status, response, callback ) {
            if ( !error && status == 200 ) {
                var email = JSON.parse( parseDirtyJSON( response.substring( 4 ) )[0][1] )['2'][2];
                callback( email );
            } else {
                callback( 'Error e-mail' );
            }
        },

        userIdsList: function( error, status, response, callback ) {
            if ( !error && status == 200 ) {
                var resp = JSON.parse(response),
                      uIdsList = [];

                for ( var i = 0; i < resp.items.length; i++ ) {
                    uIdsList.push( resp.items[i].id );
                }

                callback( uIdsList );
            }
        },

        getUserActivityPeopleList: function( error, status, response, callback ) {
            if ( !error && status == 200 ) {
                var resp = JSON.parse(response),
                    people = [],
                    urls   = [];

                for ( var i = 0; i < resp.items.length; i++ ) {
                    if ( people.indexOf( resp.items[i].actor.id ) < 0 ) {
                        people.push(resp.items[i].actor.id);
                    }

                    if (resp.items[i].object.replies.totalItems > 0) {
                        urls.push( resp.items[i].object.replies );
                    }
                    if (resp.items[i].object.plusoners.totalItems > 0) {
                        urls.push( resp.items[i].object.plusoners )
                    }
                    if (resp.items[i].object.resharers.totalItems > 0) {
                        urls.push( resp.items[i].object.resharers )
                    }
                }

                getActivityPeopleByUrls( people, urls, callback );

                function getActivityPeopleByUrls( people, urls, callback ) {
                    if ( urls.length > 0 ) {
                        var url = urls.pop();

                        GPlus.executePagedQuery( url.selfLink, function( error, status, response ) {
                            if ( !error && status == 200 ) {
                                var resp = JSON.parse(response);

                                for (var i = 0; i < resp.items.length; i++) {
                                    if ( people.indexOf( resp.items[i].id ) < 0 ) {
                                        people.push(resp.items[i].id);
                                    }
                                }
                            }
                        }, function() {
                            getActivityPeopleByUrls( people, urls, callback );
                        });
                    } else {
                        callback( people );
                    }
                }
            }
        },

        getUserActivitiesList: function( error, status, response, callback ) {
            if ( !error && status == 200 ) {
                var resp = JSON.parse(response),
                    activities = [];

                for ( var i = 0; i < resp.items.length; i++ ) {
                    var year = resp.items[i].updated.substring(0,4),
                        month = resp.items[i].updated.substring(5,7),
                        day = resp.items[i].updated.substring(8,10),
                        hour = resp.items[i].updated.substring(11,13),
                        min = resp.items[i].updated.substring(14,16);

                    activities.push({
                        'updated' : year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':00',
                        'verb': resp.items[i].verb
                    });
                }

                callback( activities );
            }
        },

        circlesList: function( error, status, response, callback ) {
            var dirtyRes = parseDirtyJSON( response.substring( 4 ) ),
                  dirtyCirclesList = Array.isArray( dirtyRes ) ? dirtyRes[0] : dirtyRes,
                  circlesList = [];

            dirtyCirclesList[1].forEach( function( element, index ) {
                if ( element[0][0].length == circleIdLength ) {
                    circlesList.push({
                        id: element[0][0],
                        name: element[1][0],
                        position: element[1][12],
                        description: element[1][2]
                    });
                }
            });

            callback( circlesList );
        },

        userInfo: function( error, status, response, properties, callback ) {
            if ( !error && status == 200 ) {
                var resp = JSON.parse(response),
                    props = {};

                for ( var i = 0; i < properties.length; i++ ) {
                    switch ( properties[i] ) {
                        case 'firstName':
                            props[properties[i]] = ( resp.name != undefined ? resp.name.givenName : undefined );
                            break;
                        case 'lastName':
                            props[properties[i]] = ( resp.name != undefined ? resp.name.familyName : undefined );
                            break;
                        case 'photo':
                            props[properties[i]] = ( resp.image != undefined ? resp.image.url : undefined );
                            break;
                        case 'age':
                            props[properties[i]] = ( resp.ageRange != undefined ? resp.ageRange.min : undefined );
                            break;
                        case 'sex':
                            props[properties[i]] = ( resp.gender != undefined ? resp.gender : undefined );
                            break;
                        case 'id':
                            props[properties[i]] = ( resp.id != undefined ? resp.id : undefined );
                            break;
                        case 'gID':
                            props[properties[i]] = ( resp.id != undefined ? resp.id : undefined );
                            break;
                        case 'city':
                            props[properties[i]] = ( resp.placesLived != undefined ? resp.placesLived[0].value : undefined );
                            break;
                        default: break;
                    }
                }
                callback( props )
            }
        },

        usersInfo: function( error, status, response, properties, callback ) {
            if ( !error && status == 200 ) {
                var resp = JSON.parse(response);
                    uList = [];

                for ( var j = 0; j < resp.items.length; j++ ) {
                    var props = {},
                        respItem = resp.items[j];
                    for ( var i = 0; i < properties.length; i++ ) {
                    switch ( properties[i] ) {
                        case 'firstName':
                            props[properties[i]] = ( respItem.name != undefined ? respItem.name.givenName : undefined );
                            break;
                        case 'lastName':
                            props[properties[i]] = ( respItem.name != undefined ? respItem.name.familyName : undefined );
                            break;
                        case 'photo':
                            props[properties[i]] = ( respItem.image != undefined ? respItem.image.url : undefined );
                            break;
                        case 'age':
                            props[properties[i]] = ( respItem.ageRange != undefined ? respItem.ageRange.min : undefined );
                            break;
                        case 'sex':
                            props[properties[i]] = ( respItem.gender != undefined ? respItem.gender : undefined );
                            break;
                        case 'id':
                            props[properties[i]] = ( respItem.id != undefined ? respItem.id : undefined );
                            break;
                        case 'city':
                            props[properties[i]] = ( respItem.placesLived != undefined ? respItem.placesLived[0].value : undefined );
                            break;
                        default: break;
                        }
                    }
                    uList.push( props );
                }
                callback( uList )
            }
        },

        relationship: function( error, status, response, callback ) {
            var dirtyRes = parseDirtyJSON( response.substring( 4 ) ),
                dirtyCirclesList = Array.isArray( dirtyRes ) ? dirtyRes[0] : dirtyRes,
                userList = [];

            dirtyCirclesList[0][2].forEach( function( element, index ) {
                userList.push({
                    id: element[0][2]
                });
            });

            callback( userList );
        },
        
        usersWithFetchedCirclesList: function( error, status, response, callback ) {
            var dirtyRes = parseDirtyJSON( response.substring( 4 ) ),
                  dirtyCirclesList = Array.isArray( dirtyRes ) ? dirtyRes[0] : dirtyRes,
                  userList = [];

            dirtyCirclesList[2].forEach( function( element, index ) {
                userList.push({
                    id: element[0][2],
                    circles: []
                });
                element[3].forEach( function( elementCircle, indexCircle ) {
                    userList[index].circles.push(
                        elementCircle[2]
                    );
                });

            });

            callback( userList );
        },

        addPeopleToCircle: function( error, status, response, callback ) {
            var responseObject = { error: 'Bad request' };

            if ( !error && status == 200 ) {
                var dirtyRes = parseDirtyJSON( response.substring( 4 ) ),
                      userIdsList = [];

                dirtyRes[0][2].forEach( function( element, index ) {
                    userIdsList.push( element[0][2] );
                });

                responseObject = {
                    userIdsList: userIdsList,
                    error: null
                };
            } else if ( status == 401 ) {
                responseObject = { error: 'Authorization error' };
            } else if ( status == 500 ) {
                responseObject = { error: 'People or Circle not found' };
            }
            callback( responseObject );
        },

        removePeopleFromCircle: function( error, status, response, callback ) {
            var responseObject = { error: 'Bad request' };
            if ( !error && status == 200 ) {
                responseObject = { error: null };
            } else if ( status == 401 ) {
                responseObject = { error: 'Authorization error' };
            } else if ( status == 500 ) {
                responseObject = { error: 'People or Circle not found' };
            }
            callback( responseObject );
        },

        createCircle: function( error, status, response, callback ) {
            var responseObject = { error: 'Bad request' };

            if ( !error && status == 200 ) {
                var dirtyRes = parseDirtyJSON( response.substring( 4 ) );
                responseObject = {
                    id: dirtyRes[0][1][0],
                    position: dirtyRes[0][2],
                    error: null
                };
            } else if ( status == 401 ) {
                responseObject = { error: 'Authorization error' };
            } else if ( status == 500 ) {
                responseObject = { error: 'Circle already exist' };
            }
            callback( responseObject );
        },

        removeCircle: function( error, status, response, callback ) {
            var responseObject = { error: 'Bad request' };
            if ( !error && status == 200 ) {
                responseObject = { error: null };
            } else if ( status == 401 ) {
                responseObject = { error: 'Authorization error' };
            } else if ( status == 500 ) {
                responseObject = { error: 'Circle not found' };
            }
            callback( responseObject );
        }

    }
})();