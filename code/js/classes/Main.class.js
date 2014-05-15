function Main() {
    
    var revoke_button = document.querySelector('#revoke');
    revoke_button.addEventListener( 'click', function() { GPlus.revokeToken( closeWindow ); } );
    
    GPlus.getUserEmail( putUserEmail );
    GPlus.testQuery( 'https://www.googleapis.com/plusDomains/v1/people/me/circles', print);
    
    var filter = new Filter( document.querySelector('.left-sidebar'), document.querySelector( '.content' ) );
    
    function putUserEmail( error, status, response ) {
        if ( !error && status == 200 ) {            
            var userEmailBlock = document.querySelector('#user-email');
            userEmailBlock.textContent = JSON.parse( response ).email;
        }
    }
    
    function print( error, status, response ) {
        if ( !error && status == 200 ) {            
            return console.log(JSON.parse( response ));
        }
    }    
};

window.onload = Main;