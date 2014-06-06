function Main() {
    document.querySelector( 'head>title' ).textContent = getMessage( 'extName' );
    document.querySelector( '#revoke' ).textContent = getMessage( 'revoke' );
    document.querySelector( '#help>span' ).textContent = getMessage( 'help' );
    document.querySelector( '#config>span' ).textContent = Options.name;
    
    document.querySelector('#revoke').addEventListener( 'click', function() { 
        StorageManager.clear(); 
        GPlus.revokeToken( closeWindow ); 
    });
    
    document.querySelector( '#config' ).addEventListener( 'click', function() { 
        $.modal( Options.show( function() { $.modal.close(); } ), {
            overlayClose : true,
            minHeight: $( document ).height() * 0.8,
            minWidth: $( document ).width() * 0.8,
            onOpen: function ( dialog ) {
                dialog.overlay.fadeIn( 'fast' );
                dialog.container.slideDown( 'fast' );
                dialog.data.slideDown();	 
            },
            onClose: function ( dialog ) {
                dialog.data.slideUp( 'fast', function () {
                    dialog.container.slideUp( 'fast', function () {
                        dialog.overlay.fadeOut( 'fast' );
                        $.modal.close();
                    });
                });
            }
        });
    });
    
    getTokenOAuth2( function( token ) { 
        StorageManager.getUserEmail( function( email ) {
            document.querySelector( '#user-email' ).textContent = email;
        });
    });
            
    var filter = new Filter( document.querySelector('.left-sidebar'), document.querySelector( '.content>div' ) );
}

window.onload = Main;