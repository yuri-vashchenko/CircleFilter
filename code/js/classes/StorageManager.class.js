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
        return ( localStorage.users ? ( 3 + ( localStorage.users.length / 512 ) ) : 0 );
    }
    
    function getCurrentDate() {        
        return convertDate( new Date() );
    }
    
    function convertDate( date ) {
        var day = date.getDate(),
              month = date.getMonth(),
              year = date.getFullYear(),
              h = date.getHours(),
              m = date.getMinutes();
        
        return day + '.' + month + '.' + year + ' ' + h + ':' + m;
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
        
        for ( var i = 0; i < users.length; i++ ) {
            if ( users[i].id == id ) {
                return i;
            }            
        }
        
        return -1;
    }
    
    function checkProperties( id, propList, expiredDate ) {
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
        
        getUserInfo: function( id, propsList, callback ) {
            var user = getUser( id ),
                  missingProps = checkProperties( id, propsList );
            if ( missingProps.length == 0 ) {
                callback( user );
            } else {
                initUsers();
                
                GPlus.getUserInfo( id, missingProps, function( error, status, response ) {
                    GPlusTranslator.userInfo( error, status, response, missingProps, function( properties ) {                    
                        addUserProperties( id, properties, true );
                        callback( getUser( id ) );                        
                    });
                });
            }
        },
        
        updateUsersInfo( info, override, expiredDate ) {
            for ( var i = 0; i < info.length; i++ ) {
            addUserProperties( info[i].id, info[i].propArray, override, expiredDate );
            }
        }	
        
        showStorageUsersFullInfo: function() {
            var table = document.createElement( 'table' ),
                  sizeSpan = document.createElement( 'span' ),
                  usersArray = readProperty( 'users' );
            
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
                    
                    user.expiredFileds = unionArrays( user.expiredFileds, checkProperties( user.id, foReq, expiredDate ) );
                    
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
        
        clearUsers: function() {
            return clearUsers();
        },
        
        getStorageSize: function() {
            return getStorageSize();
        }
    }
})();