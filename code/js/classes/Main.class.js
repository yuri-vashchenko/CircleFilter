function Main() {
    
    var revoke_button = document.querySelector('#revoke');
    revoke_button.addEventListener( 'click', function() { StorageManager.clear(); GPlus.revokeToken( closeWindow ); } );
    
    StorageManager.getUserEmail( function( email ) {
            document.querySelector( '#user-email' ).textContent = email;
    });
    
    var filter = new Filter( document.querySelector('.left-sidebar'), document.querySelector( '.content>div' ) );
}

window.onload = Main;