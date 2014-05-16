function putUser( error, status, response ) {
        if ( !error && status == 200 ) { 
            var users = JSON.parse(response).items;
            for ( var i = 0; i < users.length; i++ ) {
                result.append( new User( users[i].id, users[i].displayName, "", users[i].image.url ) );
            }
        }
    }