function FilterSet() {
    
    this.filterOptionList = Array();
    this.addConfiguredFilterOption;

    this.show = function() {
        var filterSetBlock = document.createElement( 'div' ),
              addBlock = document.createElement( 'div' ),
              addButton = document.createElement( 'a' ),
              addIcon = document.createElement( 'img' ),
              closeButton = document.createElement( 'a' ),
              closeIcon = document.createElement( 'img' );
        
        addIcon.src = 'images/plus-btn.png';
        addButton.appendChild( addIcon );
        addBlock.appendChild( addButton );
        $( addButton ).addClass( 'add' );
        $( addButton ).addClass( 'but-icon' );   
        $( addBlock ).addClass( 'addFilterOption' );
        
        addBlock.addEventListener( 'click', function( e ) {
            var dropdownList = showFilterOptionList(),
                  editInterfaceBlock = null,
                  index = null;
                  
                
            $.modal( $( dropdownList ), { 
                overlayClose : true,
                position : [$( addBlock ).offset().top + $( addBlock ).outerHeight() - 1 - $( document ).scrollTop(), $( addBlock ).offset().left],
                onOpen: function ( dialog ) {
                    dialog.overlay.fadeIn( 'fast' , function () {
                        dialog.data.hide();
                        dialog.container.slideDown( 'fast', function () {
                            dialog.data.slideDown( 'fast' );	
                        });
                    });
                },
                onShow: function( dialog ) {
                    $( dropdownList.querySelectorAll( 'li' ) ).click( function() {
                        index = $( this ).index();
                        editInterfaceBlock = filterOptionsList[index].showEditInterface();
                        $.modal.close();
                    });
                },
                onClose: function ( dialog ) {
                    dialog.data.slideUp( 'fast', function () {
                        dialog.container.slideUp( 'fast', function () {
                            dialog.overlay.fadeOut( 'fast', function () {
                                $.modal.close();
                                if ( index != null ) {
                                    $.modal( $( editInterfaceBlock ), { 
                                        overlayClose : true, 
                                        position : [$( addBlock ).offset().top + $( addBlock ).outerHeight() - 1 - $( document ).scrollTop(), $( addBlock ).offset().left],
                                        onOpen: function ( dialog ) {
                                            dialog.overlay.fadeIn( 'fast' , function () {
                                                dialog.data.hide();
                                                dialog.container.slideDown( 'fast', function () {
                                                    dialog.data.slideDown( 'fast' );	 
                                                });
                                            });
                                        },
                                        onClose: function ( dialog ) {
                                            dialog.data.slideUp( 'fast', function () {
                                                dialog.container.slideUp( 'fast', function () {
                                                    dialog.overlay.fadeOut( 'fast', function () {
                                                        var configuredFilterOption = filterOptionsList[index].show(),
                                                              filterOptionBlock = showAddFilterOptionBlock( configuredFilterOption );
                                                              
                                                        filterSetBlock.insertBefore( filterOptionBlock, addBlock );                                        
                                                        $.modal.close();
                                                    });
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    });
                }
            });            
        });
        
        closeIcon.src = 'images/cross-btn.png';   
        closeButton.appendChild( closeIcon );             
        $( closeButton ).addClass( 'close' );
        $( closeButton ).addClass( 'but-icon' );      
        
        closeButton.addEventListener( 'click', function() {
            if ( this.parentElement.nextSibling.nodeName != 'BUTTON' ) {
                this.parentElement.nextSibling.remove();
                this.parentElement.remove();
            } else  if ( this.parentElement.previousElementSibling ) {
                this.parentElement.previousElementSibling.remove();
                this.parentElement.remove();
            }
        });
        
        filterSetBlock.appendChild( addBlock );
        filterSetBlock.appendChild( closeButton );
        
        $( filterSetBlock ).addClass( 'filterSetBlock' );
        
        return filterSetBlock;
    }
    
    function showAddFilterOptionBlock( filterOptionBlock ) {
        var showAddFilterOptionBlock = document.createElement( 'div' ),
              removeButton = document.createElement( 'a' ),
              removeIcon = document.createElement( 'img' );
              
        removeIcon.src = 'images/grey-cross-btn.png';
        removeButton.appendChild( removeIcon );        
        $( removeButton ).addClass( 'remove' );
        $( removeButton ).addClass( 'but-icon' );
        
        removeButton.addEventListener( 'click', function() {
                this.parentElement.remove();
        });        
        
        showAddFilterOptionBlock.appendChild( filterOptionBlock );        
        showAddFilterOptionBlock.appendChild( removeButton );     
        
        $( showAddFilterOptionBlock ).addClass( 'addFilterOption' );
        
        return showAddFilterOptionBlock;
    }
    
    function showFilterOptionList() {
        var listBlock = document.createElement( 'ul' );
              
        $( listBlock ).addClass( 'filterOptionsList' );
        
        for ( var i = 0; i < filterOptionsList.length; i++ ) {
            var li = document.createElement( 'li' );
            
            li.appendChild( filterOptionsList[i].show() );
            listBlock.appendChild( li );
        }
        
        return listBlock;
    }
}