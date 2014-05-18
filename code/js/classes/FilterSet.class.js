function FilterSet() {
    
    this.filterOptionList = Array();
    
    this.show = function() {
        var filterSetBlock = document.createElement( 'div' ),
              addBlock = document.createElement( 'div' ),
              addButton = document.createElement( 'a' ),
              addIcon = document.createElement( 'img' );
        
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
            addIcon.src = 'images/trigger-down.png';      
                
            $.modal( $( dropdownList ), { 
                overlayClose : true,
                position : [$( addBlock ).offset().top + $( addBlock ).outerHeight() - 1 - $( document ).scrollTop(), $( addBlock ).offset().left],
                onOpen: function ( dialog ) {
                    dialog.overlay.fadeIn( 'fast' );
                    dialog.container.slideDown( 'fast' );
                    dialog.data.slideDown( 'fast' );
                },
                onShow: function( dialog ) {
                    $( dropdownList.querySelectorAll( 'li' ) ).click( function() {
                        index = $( this ).index();
                        $.modal.close();
                    });
                },
                onClose: function ( dialog ) {
                    dialog.data.slideUp( 'fast', function () {
                        dialog.container.slideUp( 'fast', function () {
                            dialog.overlay.fadeOut( 'fast' );
                            $.modal.close();
                            if ( index != null ) {
                                editInterfaceBlock = filterOptionsList[index].showEditInterface( 
                                    function() {
                                        addIcon.src = 'images/plus-btn.png';
                                        $.modal.close();
                                    },
                                    function( configuration ) {
                                        var configuredFilterOption = new FilterOption(
                                                filterOptionsList[index].icon, 
                                                filterOptionsList[index].name, 
                                                filterOptionsList[index].configurationBlock, 
                                                filterOptionsList[index].getConfigurationFunc, 
                                                filterOptionsList[index].configurationToStringFunc, 
                                                configuration 
                                              ),
                                              filterOptionBlock = showAddFilterOptionBlock( configuredFilterOption.show() );
                                              
                                        filterSetBlock.insertBefore( filterOptionBlock, addBlock );  
                                    }
                                );
                                $.modal( $( editInterfaceBlock ), { 
                                    overlayClose : true, 
                                    position : [$( addBlock ).offset().top + $( addBlock ).outerHeight() - 1 - $( document ).scrollTop(), $( addBlock ).offset().left],
                                    onOpen: function ( dialog ) {
                                        dialog.overlay.fadeIn( 'fast' );
                                        dialog.container.slideDown( 'fast' );
                                        dialog.data.slideDown();	 
                                    },
                                    onClose: function ( dialog ) {
                                        dialog.data.slideUp( 'fast', function () {
                                            dialog.container.slideUp( 'fast', function () {
                                                dialog.overlay.fadeOut( 'fast' );
                                                addIcon.src = 'images/plus-btn.png';
                                                $.modal.close();
                                            });
                                        });
                                    }
                                });
                            } else {
                                addIcon.src = 'images/plus-btn.png';
                            }
                        }); 
                    }); 
                }
            });            
        });
        
        filterSetBlock.appendChild( addBlock );
        
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