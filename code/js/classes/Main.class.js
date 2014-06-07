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
                
                $("#pieCharStorage").wijpiechart({
                    radius: 140,
                    hint: {
                        content: function () {
                            return this.data.label + " : " + Globalize.format(this.value / this.total, "p2");
                        }
                    },
                    header: {
                        text: getMessage( ' ' )
                    },
                    seriesList: [{
                        label: "Users",
                        data: StorageManager.getUsersSize(),
                        offset: 0
                    }, {
                        label: "Circles",
                        data: StorageManager.getCirclesSize(),
                        offset: 0
                    }, {
                        label: "other",
                        data: 3,
                        offset: 0
                    }],
                    seriesStyles: [{
                        fill: "90-rgb(142,222,67)-rgb(127,199,60)", 
                        stroke: "rgb(127,199,60)", 
                        "stroke-width": 1.5
                    }, {
                        fill: "90-rgb(106,171,167)-rgb(95,153,150)", 
                        stroke: "rgb(95,153,150)", 
                        "stroke-width": 1.5
                    }, {
                        fill: "90-rgb(70,106,133)-rgb(62,95,119)", 
                        stroke: "rgb(62,95,119)", 
                        "stroke-width": 1.5
                    }]
                });
                $("#pieCharFullStorage").wijpiechart({
                    radius: 140,
                    hint: {
                        content: function () {
                            return this.data.label + " : " + Globalize.format(this.value / this.total, "p2");
                        }
                    },
                    header: {
                        text: getMessage( ' ' )
                    },
                    seriesList: [{
                        label: "Free",
                        data: 5000 - StorageManager.getStorageSize(),
                        offset: 15
                    }, {
                        label: "Users",
                        data: StorageManager.getUsersSize(),
                        offset: 0
                    }, {
                        label: "Circles",
                        data: StorageManager.getCirclesSize(),
                        offset: 0
                    }, {
                        label: "other",
                        data: 3,
                        offset: 0
                    }],
                    seriesStyles: [{
                        fill: "180-rgb(195,255,0)-rgb(175,229,0)", 
                        stroke: "rgb(175,229,0)", 
                        "stroke-width": 1.5
                    }, {
                        fill: "90-rgb(142,222,67)-rgb(127,199,60)", 
                        stroke: "rgb(127,199,60)", 
                        "stroke-width": 1.5
                    }, {
                        fill: "90-rgb(106,171,167)-rgb(95,153,150)", 
                        stroke: "rgb(95,153,150)", 
                        "stroke-width": 1.5
                    }, {
                        fill: "90-rgb(70,106,133)-rgb(62,95,119)", 
                        stroke: "rgb(62,95,119)", 
                        "stroke-width": 1.5
                    }]
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
            
    var filter = new Filter( document.querySelector('.left-sidebar'), document.querySelector( '.content>div' ) );
}

window.onload = Main;