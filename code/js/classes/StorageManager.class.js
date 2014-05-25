var StorageManager = (function() {

    function initUsers() {
        if ( !readProperty( 'users' ) ) {
            writeProperty( 'users', [] );
        }
    }
    
    function clearUsers() {
        removeProperty( 'users' );  
    }
    
    function addUser( u ) {
        var users = readProperty( 'users' );
        
        if ( !findUserById( u.id ) ) {
            var user = new User( u.id, u.displayName, "", u.image.url );
            users.push( user );
            writeProperty( 'users', users );
        }
    }
    
    function findUserById( id ) {
        var users = readProperty( 'users' );
        
        for ( var i = 0; i < users.length; i++ ) {
            if ( users[i].id == id ) {
                return (User.copy( users[i] ));
            }            
        }
        
        return false;
    }
    
    return {
        getUserInfo: function( id, callback ) {
            var user = findUserById( id );
            if ( user ) {
                callback( user );
            } else { /* toSolve */
                var userIdsList = Array();
                initUsers();
                
                GPlus.getUsersList( function( error, status, response ) {
                    if ( !error && status == 200 ) {
                        var resp = JSON.parse(response);
                        
                        for ( var i = 0; i < resp.items.length; i++ ) {
                            userIdsList.push( resp.items[i].id );
                            addUser( resp.items[i] );
                        }
                        
                        if ( resp.totalItems <= userIdsList.length ) {
                            callback( userIdsList );
                        }
                    } 
                });
            }
        },
        getUserIdsList: function( callback ) {
            if ( readProperty( 'users' ) ) {
                var userIdsList = new Array(),
                      usersArray = readProperty( 'users' );
                      
                for ( var i = 0; i < usersArray.length; i++ ) {
                    userIdsList.push( usersArray[i].id );
                }
                
                callback( userIdsList );
            } else {
                var userIdsList = Array();
                initUsers();
                
                GPlus.getUsersList( function( error, status, response ) {
                    if ( !error && status == 200 ) {
                        var resp = JSON.parse(response);
                        
                        for ( var i = 0; i < resp.items.length; i++ ) {
                            userIdsList.push( resp.items[i].id );
                            addUser( resp.items[i] );
                        }
                        
                        if ( resp.totalItems <= userIdsList.length ) {
                            callback( userIdsList );
                        }
                    } 
                });
            }
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