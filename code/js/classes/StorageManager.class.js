var StorageManager = (function() {
    function writeProperty( property, value ) {
        localStorage.setItem( property, JSON.stringify( value ) );
    }

    function readProperty( property ) {
        return JSON.parse( localStorage.getItem( property ) );
    }

    function removeProperty( property ) {
        localStorage.removeItem( property ); 
    }
    
    function getStorageSize() {
        return ( 3 + getUsersSize() + getCirclesSize() );
    }
    
    function getUsersSize() {
        return ( localStorage.users ? ( localStorage.users.length / 512 ) : 0 );
    }
    
    function getCirclesSize() {
        return ( localStorage.circles ? ( localStorage.circles.length / 512 ) : 0 );
    }
        
    function uncouplePropertiesList( properties ) {
        var circlesPropsArray = [],
              usersPropsArray = [];
              
        for ( var i = 0; i < properties.length; i++ ) {
                switch ( properties[i] ) {
                    case 'circles':
                        circlesPropsArray.push(properties[i]);
                        break;
                    default: 
                        usersPropsArray.push(properties[i]);
                }
        }
        
        return { 
            circlesProps: circlesPropsArray, 
            usersProps: usersPropsArray 
        };
    }    
    
    /* 
     * @return  
     * -1 if date1 < date 2
     * 0 if date1 = date 2
     * 1 if date1 > date 2    
    */
    function compareDates( date1, date2 ) {
        var day1 = date1.substring(0,date1.indexOf('.')),
              temp = date1.substring(date1.indexOf('.')+1),
              month1 = temp.substring(0,temp.indexOf('.')),
              year1 = temp.substring(temp.indexOf('.')+1, temp.indexOf(' ')),
              hour1 = temp.substring(temp.indexOf(' ')+1,temp.indexOf(':')),
              min1 = temp.substring(temp.indexOf(':')+1);
        
        temp = date2.substring(date2.indexOf('.')+1);
        
        var day2 = date2.substring(0,date2.indexOf('.')),        
              month2 = temp.substring(0,temp.indexOf('.')),
              year2 = temp.substring(temp.indexOf('.')+1, temp.indexOf(' ')),
              hour2 = temp.substring(temp.indexOf(' ')+1,temp.indexOf(':')),
              min2 = temp.substring(temp.indexOf(':')+1);
    
        if ( year1 < year2 ) {
            return -1;
        } else if ( year1 > year2 ) {
            return 1;
        }    
        
        if ( month1 < month2 ) {
            return -1;
        } else if ( month1 > month2 ) {
            return 1;
        }    
        
        if ( day1 < day2 ) {
            return -1;
        } else if ( day1 > day2 ) {
            return 1;
        }

        if ( hour1 < hour2 ) {
            return -1;
        } else if ( hour1 > hour2 ) {
            return 1;
        }

        if ( min1 < min2 ) {
            return -1;
        } else if ( min1 > min2 ) {
            return 1;
        }
        
        return 0;
    }
    
    function initUsers() {
        if ( !readProperty( 'users' ) ) {
            writeProperty( 'users', [] );
        }
    }
    
    function initCircles() {
        if ( !readProperty( 'circles' ) ) {
            writeProperty( 'circles', [] );
        }
    }
    
    function clearUsers() {
        removeProperty( 'users' );  
    }
    
    function removeCircleFromCircles( id ) {
        var circles = readProperty( 'circles' ),
              circleIndex = getCircleIndex( id );
              
        if ( circleIndex >= 0 ) {
            circles.splice( circleIndex , 1 );
            writeProperty( 'circles', circles );
        }
    }
    
    function removeCircleFromUsers( id ) {
        var users = readProperty( 'users' );
        initUsers();
        users = (users ? users : []);
        users.forEach( function( element, index ) {  
            var circleIndex = getIndexByValue( element.circles, id );
            
            if ( circleIndex >= 0 ) {
                element.circles.splice( circleIndex, 1 );
            }
        });
        
        writeProperty( 'users', users );
    }
    
    function clearCircles() {
        removeProperty( 'circles' );  
    }
    
    function addUser( id ) {
        var users = readProperty( 'users' ),
              userIndex = getUserIndex( id );
        
        if ( userIndex < 0 ) {
            var user = new User( id );
            users.push( user );
            writeProperty( 'users', users );
            userIndex = users.length - 1;
        }
        
        return userIndex;
    }
       
    function addCircle( id, name, description, position ) {
        var circles = readProperty( 'circles' ),
              circleIndex = getCircleIndex( id );
        
        if ( circleIndex < 0 ) {
            var circle = { 
                id: id,
                name: name,
                description: description,
                position: position
            };
            
            circles.push( circle );
            writeProperty( 'circles', circles );
            circleIndex = circles.length - 1;
        }
        
        return circleIndex;
    }
    
    /* @param propArray { property1: value1, property2: value2 ... } */
    function addUserProperties( id, propArray, override, expiredDate ) {
    
        var userIndex = addUser( id ),
              users = readProperty( 'users' );       
        
        for ( property in propArray ) {
            if ( propArray[property] != undefined 
                && ( users[userIndex][property] == undefined
                    || ( override && expiredDate == undefined )
                    || ( override && compareDates( users[userIndex][property].date, expiredDate ) > 0 )
                    ) 
               ) {
                users[userIndex][property] = { 'value': propArray[property], 'date': getCurrentDate() };
            }
        }
        
        writeProperty( 'users', users );
    }
    
    function getUserIndex( id ) {
        var users = readProperty( 'users' );
        
        if ( users ) {
            for ( var i = 0; i < users.length; i++ ) {
                if ( users[i].id == id ) {
                    return i;
                }            
            }
        }
        
        return -1;
    }
    
    function getIndexByValue( array , value ) {
        if ( !array )
            return -1;
            
        for ( var i = 0; i < array.length; i++ ) {
            if ( array[i] == value ) {
                return i;
            }            
        }
        
        return -1;
    }
    
    function getCircleIndex( id ) {
        var circles = readProperty( 'circles' );
        
        if ( circles ) {
            for ( var i = 0; i < circles.length; i++ ) {
                if ( circles[i].id == id ) {
                    return i;
                }            
            }
        }
        
        return -1;
    }
    
    function checkUserProperties( id, propList, expiredDate ) {
        var userIndex = addUser( id ),
              users = readProperty( 'users' ),
              missingProps = new Array();
        
        for ( var i = 0; i < propList.length; i++ ) {
            if ( users[userIndex][propList[i]] == undefined 
                || ( users[userIndex][propList[i]] != undefined 
                    && expiredDate != undefined && compareDates( users[userIndex][propList[i]].date, expiredDate ) > 0 ) ) {
                    
                missingProps.push( propList[i] );
            }
        }
        
        return missingProps;
    }
    
    function getUser( id ) {
        var users = readProperty( 'users' ),
              userIndex = getUserIndex( id );
              
        if ( userIndex >= 0 ) {
            return new User(
                users[userIndex].id,
                ( users[userIndex].firstName != undefined ? users[userIndex].firstName.value : null ),
                ( users[userIndex].lastName != undefined ? users[userIndex].lastName.value : null ),
                ( users[userIndex].photo != undefined ? users[userIndex].photo.value : null ),
                ( users[userIndex].age != undefined ? users[userIndex].age.value : null ),
                ( users[userIndex].sex != undefined ? users[userIndex].sex.value : null ),
                ( users[userIndex].city != undefined ? users[userIndex].city.value : null ),
                ( users[userIndex].circles != undefined ? users[userIndex].circles.value : [] )
            )
        }
    }
    
    function getCircle( id ) {
        var circles = readProperty( 'circles' ),
              circleIndex = getCircleIndex( id );
              
        if ( circleIndex >= 0 ) {
            return circles[circleIndex];
        }
    }
    
    function setUserEmail( email ) {
        writeProperty( 'email', email );
    }
    
    return {
        getUserIdsList: function( callback ) {
            var userIdsList = new Array();
            
            if ( readProperty( 'users' ) ) {
                var usersArray = readProperty( 'users' );
                      
                for ( var i = 0; i < usersArray.length; i++ ) {
                    userIdsList.push( usersArray[i].id );
                }
                
                callback( userIdsList );
            } else {
                initUsers();
                
                GPlus.getUserIdsList( function( error, status, response ) {
                    GPlusTranslator.userIdsList( error, status, response, function( uIdList ) {
                        for ( var i = 0; i < uIdList.length; i++ ) {
                            userIdsList.push( uIdList[i] );
                            addUser( uIdList[i] );
                        }
                        
                        if ( JSON.parse(response).totalItems <= userIdsList.length ) {
                            callback( userIdsList );
                        }
                    });
                });
            }
        },
        
        getCirclesList: function( callback ) {
            var circlesList = new Array();
            
            if ( readProperty( 'circles' ) ) {
                var circlesArray = readProperty( 'circles' );
                
                callback( circlesArray );
            } else {
                initCircles();
                
                GPlus.getCirclesList( function( error, status, response ) {
                    GPlusTranslator.circlesList( error, status, response, function( cList ) {
                        for ( var i = 0; i < cList.length; i++ ) {
                            circlesList.push( cList[i] );
                            addCircle( cList[i].id, cList[i].name, cList[i].description, cList[i].position );
                        }
                        
                        callback( circlesList );
                    });
                });
            }
        },
        
        getCirclesListOnGPlus: function( callback ){
            var circlesList = new Array();
            initCircles();
            GPlus.getCirclesList( function( error, status, response ) {
                GPlusTranslator.circlesList( error, status, response, function( cList ) {
                    for ( var i = 0; i < cList.length; i++ ) {
                        circlesList.push( cList[i] );
                        addCircle( cList[i].id, cList[i].name, cList[i].description, cList[i].position );
                    }
                    
                    callback( circlesList );
                });
            });
        },
        
        getUserInfo: function( id, propsList, callback ) {
            initUsers();
            
            var user = getUser( id ),
                  missingProps = checkUserProperties( id, propsList );
            if ( missingProps.length == 0 ) {
                callback( user );
            } else {
                missingProps = uncouplePropertiesList(missingProps);    
                
                var getUserInfoFunc = function( id, usersProps, callback ) {
                    GPlus.getUserInfo( id, usersProps, function( error, status, response ) {
                        GPlusTranslator.userInfo( error, status, response, usersProps, function( properties ) {                    
                            addUserProperties( id, properties, true );
                            callback( getUser( id ) );                        
                        });
                    });
                };
                
                if ( missingProps.circlesProps.length > 0 ) {
                    GPlus.getCirclesAndUsersList( function( error, status, response ) {
                        GPlusTranslator.usersWithFetchedCirclesList( error, status, response, function( usersList ) {
                            for ( var i = 0; i < usersList.length; i++ ) {
                                addUserProperties( usersList[i].id, { circles: usersList[i].circles }, true);
                            }                        
                            
                            getUserInfoFunc( id, missingProps.usersProps, callback );
                            
                        });
                    });
                } else {
                    getUserInfoFunc( id, missingProps.usersProps, callback );
                }
            }
        },
        
        getCircleInfo: function( id, callback ) {
            initCircles();
            
            var circle = getCircle( id );
            
            if ( circle ) {
                callback( circle );
            } else {
                GPlus.getCirclesList( function( error, status, response ) {
                    GPlusTranslator.circlesList( error, status, response, function( cList ) {
                        for ( var i = 0; i < cList.length; i++ ) {
                            addCircle( cList[i].id, cList[i].name, cList[i].description, cList[i].position );
                        }
                        /* Put your check code here */
                        callback( getCircle( id ) );
                    });
                });
            }
        },
        
        updateUsersInfo: function( info, override, expiredDate ) {
            for ( var i = 0; i < info.length; i++ ) {
                addUserProperties( info[i].id, info[i].propArray, override, expiredDate );
            }
        },
        
        showStorageUsersFullInfo: function() {
            var table = document.createElement( 'table' ),
                  sizeSpan = document.createElement( 'span' ),
                  usersArray = readProperty( 'users' );
            
            if ( usersArray ) {
                var tr = document.createElement( 'tr' ),
                      headers = ['id', 'firstName', 'lastName', 'photo', 'age', 'sex', 'city', 'circles'];
                
                for ( var i = 0; i < headers.length; i++ ) {
                    var th = document.createElement( 'th' );
                    th.textContent = headers[i];
                    tr.appendChild( th );
                }   
                
                table.appendChild( tr );
                
                for ( var i = 0; i < usersArray.length; i++ ) {
                    tr = document.createElement( 'tr' );
                    
                    var td = document.createElement( 'td' );
                    td.textContent = usersArray[i].id;
                    tr.appendChild( td );
                    
                    for ( var j = 1; j < headers.length; j++ ) {
                        td = document.createElement( 'td' );
                        td.textContent = ( usersArray[i][headers[j]] != undefined ? usersArray[i][headers[j]].value + ' : ' + usersArray[i][headers[j]].date : '' );
                        tr.appendChild( td );
                    }
                    table.appendChild( tr );
                }                      
            }
            
            return table;
        },
        
        getExpiredInfo: function( userIdsList, filterOptionList, expiredDate ) {
            var expiredInfo = new Array(),
                  uidList = userIdsList.clone(),
                  userId, foReq;
            
            while ( userId = uidList.shift() ) {
                var user = { id: userId, expiredFileds: new Array() },
                      foList = filterOptionList.clone()
                
                while ( foReq = foList.shift() ) {                    
                    foReq = foReq.getRequiredUserFields();
                    
                    user.expiredFileds = unionArrays( user.expiredFileds, checkUserProperties( user.id, foReq, expiredDate ) );
                    
                    function unionArrays( arr1, arr2 ) {
                        
                        var temp = arr1.concat( arr2 ),
                              result = new Array();
                              
                        temp.sort();
                        
                        if ( temp.length ) {
                            result.push( temp.shift() ); 
                        }
                        
                        while ( currentElement = temp.shift() ) {
                            if ( currentElement != result[result.length - 1] ) {
                                result.push( currentElement );
                            }
                        }
                        
                        return result;
                    }
                }
                
                if ( user.expiredFileds.length ) {
                    expiredInfo.push( user );
                }
            }
            
            return expiredInfo;
        },
        
        getUserEmail: function( callback ) {
            var email = readProperty( 'email' );
            
            if ( email ) {
                callback( email );
            } else {
                GPlus.getUserEmail( function( error, status, response ) {
                    GPlusTranslator.userEmail( error, status, response, function( email ) {
                        setUserEmail( email );
                        callback( email )
                    });
                });
            }
        },
        
        clearUsers: function() {
            return clearUsers();
        },
        
        clearCircles: function() {
            return clearCircles();
        },
        
        clear: function() {
            clearUsers();
            clearCircles();
            removeProperty( 'email' );
        },
        
        getStorageSize: function() {
            return getStorageSize();
        },
        /**
         * Add people to a circle in your account.
         * @param {string} circleId the Circle to add the people to.
         * @param {{Array.<string>}} usersIds The people to add.
         * @param {function(string)} callback The ids of the people added.
         */
        addPeopleToCircle : function( circleId, usersIds, callback ) {
            GPlus.addPeopleToCircle( circleId, usersIds, function( error, status, response ) {
                GPlusTranslator.addPeopleToCircle( error, status, response, function( responseObject ) { 
                    if( !responseObject.error ) {
                        var toAddUsers = responseObject.userIdsList,
                              users = readProperty( 'users' );
                        
                        toAddUsers.forEach( function( element, index ) {                            
                            var userIndex = getUserIndex( element );
                            
                            if ( getIndexByValue( users[userIndex].circles, circleId ) < 0 ) {
                            
                                if ( !users[userIndex].circles ) {
                                    users[userIndex].circles = [];
                                }
                                
                                users[userIndex].circles.push( circleId );
                            }
                        });
                        
                        writeProperty( 'users', users );
                    }
                    callback( responseObject );
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
            GPlus.removePeopleFromCircle( circleId, usersIds, function ( error, status, response ) {
                GPlusTranslator.removePeopleFromCircle( error, status, response, function( responseObject ) { 
                    if( !responseObject.error ) {
                        var users = readProperty( 'users' );
                        
                        usersIds.forEach( function( element, index ) {                            
                            var userIndex = getUserIndex( element ),                     
                                  circleIndex = getIndexByValue( users[userIndex].circles , circleId );
                                  
                            if ( circleIndex >= 0 ) {
                                users[userIndex].circles.splice( circleIndex, 1 );     
                            }                
                        });
                        
                        writeProperty( 'users', users );
                    }
                    callback( responseObject );
                });
            });
        },
        /**
         * Create a new empty circle in your account.
         *
         * @param {string} name The circle names.
         * @param {string} description Optional description.
         * @param {function(string)} callback The ID of the circle.
         */
        createCircle : function( name, description, callback ) {
            initCircles();
            GPlus.createCircle( name, description, function( error, status, response ) { 
                GPlusTranslator.createCircle( error, status, response, function( responseObject ) {
                    if( !responseObject.error ) {
                        addCircle( responseObject.id, name, description, responseObject.position );
                    }
                    callback( responseObject );
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
            GPlus.removeCircle( circleId, function( error, status, response ) { 
                GPlusTranslator.removeCircle( error, status, response, function( responseObject ) {
                    if( !responseObject.error ) {
                        removeCircleFromCircles( circleId  );
                        removeCircleFromUsers( circleId  );
                    }
                    callback( circleId, callback );
                });
            });
        },
    }
})();