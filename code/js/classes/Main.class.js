function Main() {
    document.querySelector( 'head>title' ).textContent = getMessage( 'extName' );
    document.querySelector( '#revoke' ).textContent = getMessage( 'revoke' );
    document.querySelector( '#help>span' ).textContent = getMessage( 'help' );
    document.querySelector( '#config>span' ).textContent = Options.name;
    document.querySelector( '#selectAll' ).textContent = getMessage( 'selectAll' );
    document.querySelector( '#deselectAll' ).textContent = getMessage( 'deselectAll' );
    
    document.querySelector('#revoke').addEventListener( 'click', function() { 
        StorageManager.clear(); 
        GPlus.revokeToken( closeWindow ); 
    });
    
    document.querySelector( '#config' ).addEventListener( 'click', function() {
        $.modal( Options.show( function() { $.modal.close(); } ), {
            overlayClose: true,
            position: [$( '#config>span' ).offset().top + $( document ).scrollTop(), $( document ).scrollTop()],
            containerCss: {
                width: '500px'
            },
            onOpen: function ( dialog ) {
                dialog.overlay.fadeIn( 'fast' );
                dialog.container.slideDown( 'fast' );
                dialog.data.slideDown();
                $( '#pieCharFullStorage' ).wijpiechart({
                    radius: 40,
                    hint: {
                        content: function () {
                            return this.data.label + " : " + Globalize.format(this.value / this.total, "p2");
                        }
                    },
                    seriesList: [
                        { label: getMessage( 'free' ), data: 5120 - StorageManager.getStorageSize(), offset: 10 }, 
                        { label: getMessage( 'users' ), data: StorageManager.getUsersSize(), offset: 10 },
                        { label: getMessage( 'circles' ), data: StorageManager.getCirclesSize(), offset: 10 }, 
                        { label: getMessage( 'other' ), data: 3, offset: 20 }
                    ],
                    seriesStyles: [
                        { fill: "180-rgb(195,255,0)-rgb(175,229,0)", stroke: "rgb(175,229,0)", "stroke-width": 1.5 }, 
                        { fill: "90-rgb(142,222,67)-rgb(127,199,60)", stroke: "rgb(127,199,60)", "stroke-width": 1.5 },
                        { fill: "90-rgb(106,171,167)-rgb(95,153,150)", stroke: "rgb(95,153,150)", "stroke-width": 1.5 },
                        { fill: "90-rgb(70,106,133)-rgb(62,95,119)", stroke: "rgb(62,95,119)", "stroke-width": 1.5 }
                    ]
                });
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
            
    var filter = new Filter( document.querySelector( '.left-sidebar' ), document.querySelector( '.content>div' ) );
}

var counterProgressBar = {
    usersTotal: 0,
    usersConfirmed: 0,
    filterOptionsTotal: 0,
    progressJoint: 0
}

var selectedUsers = {
    isCheckedDefault: false,
    count: 0,
    updateField: function() {
         $( '#usersSelected' ).text( getMessage( 'usersSelectedCount' ) + ' ' + selectedUsers.count + '/' + counterProgressBar.usersConfirmed );
    }
}

window.onload = Main;