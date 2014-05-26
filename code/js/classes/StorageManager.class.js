var StorageManager = (function() {
    function getStorageSize() {
        return ( 3 + ( ( localStorage.users.length * 16 ) / ( 8 * 1024 ) ) );
    }
    
    function getCurrentTime() {
        var d=new Date(),
              day=d.getDate(),
              month=d.getMonth(),
              year=d.getFullYear(),
              h = d.getHours(),
              m = d.getMinutes();
        
        return day + '.' + month + '.' + year + ' ' + h + ':' + m;
    }
    
    function initUsers() {
        if ( !readProperty( 'users' ) ) {
            writeProperty( 'users', [] );
        }
    }
    
    function clearUsers() {
        removeProperty( 'users' );  
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
       
    /* @param propArray { property1: value1, property2: value2 ... } */
    function addUserProperties( id, propArray, override ) {
    
        var userIndex = addUser( id ),
              users = readProperty( 'users' );       
        
        for ( property in propArray ) {
            if ( propArray[property] != undefined && users[userIndex][property] == undefined || override ) {
                users[userIndex][property] = { 'value': propArray[property], 'date': getCurrentTime() };
            }
        }
        
        writeProperty( 'users', users );
    }
    
    function getUserIndex( id ) {
        var users = readProperty( 'users' );
        
        for ( var i = 0; i < users.length; i++ ) {
            if ( users[i].id == id ) {
                return i;
            }            
        }
        
        return -1;
    }
    
    function checkProperties( id, propList ) {
        var userIndex = addUser( id ),
              users = readProperty( 'users' ),
              missingProps = new Array();
        
        for ( var i = 0; i < propList.length; i++ ) {
            if ( users[userIndex][propList[i]] == undefined ) {
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
                ( users[userIndex].city != undefined ? users[userIndex].city.value : null )
            )
        }
    }
    
    return {
        getUserIdsList: function( callback ) {
            var userIdsList = new Array();
            
            if ( false && readProperty( 'users' ) ) {
                var usersArray = readProperty( 'users' );
                      
                for ( var i = 0; i < usersArray.length; i++ ) {
                    userIdsList.push( usersArray[i].id );
                }
                
                callback( userIdsList );
            } else {
                initUsers();
                
                GPlus.getUserIdsList( function( error, status, response ) {
                    if ( !error && status == 200 ) {
                        var resp = JSON.parse(response);
                        
                        for ( var i = 0; i < resp.items.length; i++ ) {
                            userIdsList.push( resp.items[i].id );
                            addUser( resp.items[i].id );
                        }
                        
                        if ( resp.totalItems <= userIdsList.length ) {
                            callback( userIdsList );
                        }
                    } 
                });
            }
        },
        getUserInfo: function( id, propsList, callback ) {
            var user = getUser( id ),
                  missingProps = checkProperties( id, propsList );
            if ( missingProps.length == 0 ) {
                callback( user );
            } else {
                initUsers();
                
                GPlus.getUserInfo( id, missingProps, function( error, status, response ) {
                    if ( !error && status == 200 ) {
                        var resp = JSON.parse(response),
                              props = {};
                        
                        for ( var i = 0; i < missingProps.length; i++ ) {
                            switch ( missingProps[i] ) {
                                case 'firstName':
                                    props[missingProps[i]] = ( resp.name != undefined ? resp.name.givenName : undefined );
                                    break;
                                case 'lastName':
                                    props[missingProps[i]] = ( resp.name != undefined ? resp.name.familyName : undefined );
                                    break;
                                case 'photo':
                                    props[missingProps[i]] = ( resp.image != undefined ? resp.image.url : undefined );
                                    break;
                                case 'age':
                                    props[missingProps[i]] = ( resp.ageRange != undefined ? resp.ageRange.min : undefined );
                                    break;
                                case 'sex':
                                    props[missingProps[i]] = ( resp.gender != undefined ? resp.gender : undefined );
                                    break;
                                case 'city':
                                    props[missingProps[i]] = ( resp.placesLived != undefined ? resp.placesLived[0].value : undefined );
                                    break;
                                default: break;
                            }
                        }
                        
                        addUserProperties( id, props, true );
                        
                        callback( getUser( id ) );
                    }
                });
            }
        },
        showStorageUsersFullInfo: function() {
            var table = document.createElement( 'table' ),
                  sizeSpan = document.createElement( 'span' ),
                  usersArray = readProperty( 'users' );
            
            sizeSpan.textContent = getStorageSize() + ' bytes';
            table.appendChild( sizeSpan );
            
            if ( usersArray ) {
                var tr = document.createElement( 'tr' ),
                      headers = ['id', 'firstName', 'lastName', 'photo', 'age', 'sex', 'city'];
                
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
                        td.textContent = ( usersArray[i][headers[j]] != undefined ? usersArray[i][headers[j]].value : '' );
                        tr.appendChild( td );
                    }
                    table.appendChild( tr );
                }                      
            }
            
            return table;
        },
        getStorageSize: function() {
            return getStorageSize();
        }
    }
})();

function writeProperty( property, value ) {
    localStorage.setItem( property, JSON.stringify( value ) );
}

function readProperty( property ) {
    return JSON.parse( localStorage.getItem( property ) );
}

function removeProperty( property ) {
    localStorage.removeItem( property ); 
}