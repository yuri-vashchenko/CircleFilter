function Main() {
    
    var revoke_button = document.querySelector('#revoke');
    revoke_button.addEventListener( 'click', function() { GPlus.revokeToken( closeWindow ); } );
    
    GPlus.getUserEmail( function( error, status, response ) {
        GPlusTranslator.userEmail( error, status, response, function( email ) {
            document.querySelector( '#user-email' ).textContent = email;
        });
    });
    
    GPlus.getCirclesList( function( error, status, response ) {
        GPlusTranslator.circlesList( error, status, response, function( circlesList ) {
            console.log( circlesList );
        });
    });
    
    var filter = new Filter( document.querySelector('.left-sidebar'), document.querySelector( '.content>div' ) );
};

window.onload = Main;