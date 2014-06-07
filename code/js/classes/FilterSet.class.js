function FilterSet() {
    
    this.toJSON = function() {
        var string = '[';
        
        for ( var i = 0; i < this.filterOptionList.length; i++ ) {
            string += this.filterOptionList[i].toJSON() + ( i != this.filterOptionList.length - 1 ? ',' : '' );
        }
        string += ']';
        
        return string;
    }
    
    this.importFilterSet = function( filterSet ) {   
        
        for ( var i = 0; i < filterSet.length; i++ ) {
            var filterOption = getFilterOptionById( filterSet[i].id ),
                  configuredFilterOption = new FilterOption(
                  filterSet[i].id,
                  filterOption.icon, 
                  filterOption.name, 
                  filterOption.configurationBlock,
                  filterOption.getConfigurationFunc, 
                  filterOption.configurationToStringFunc, 
                  filterOption.applyFunc,
                  filterOption.requiredUserFields,
                  filterSet[i].configuration 
            );
            
            filterOptionBlock = showAddFilterOptionBlock( configuredFilterOption.show(), this );
            
            this.filterSetBlock.insertBefore( filterOptionBlock, this.addBlock );  
            this.filterOptionList.push( configuredFilterOption );
        }
    }
    
    this.filterOptionList = new Array();
    this.filterSetBlock;
    this.addBlock;
    
    this.show = function() {
        var addButton = document.createElement( 'a' ),
              addIcon = document.createElement( 'img' ),
              filterSet = this;
        
        filterSet.filterSetBlock = document.createElement( 'div' );
        filterSet.addBlock = document.createElement( 'div' ),
        
        addIcon.src = 'images/plus-btn.png';
        addIcon.title = getMessage( 'addFilterOption' );
        addButton.appendChild( addIcon );
        filterSet.addBlock.appendChild( addButton );
        $( addButton ).addClass( 'add' );
        $( addButton ).addClass( 'but-icon' );   
        $( filterSet.addBlock ).addClass( 'addFilterOption' );
        
        filterSet.addBlock.addEventListener( 'click', function( e ) {
            var dropdownList = showFilterOptionList(),
                  editInterfaceBlock = null,
                  index = null;
            addIcon.src = 'images/trigger-down.png';      
                
            $.modal( $( dropdownList ), { 
                overlayClose : true,
                containerCss: {
                    position: 'absolute !important'
                },
                position : [$( filterSet.addBlock ).offset().top + $( filterSet.addBlock ).outerHeight() - 1 - $( document ).scrollTop(), $( filterSet.addBlock ).offset().left],
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
                                        addIcon.title = getMessage( 'addFilterOption' );
                                        $.modal.close();
                                    },
                                    function( configuration ) {
                                        var configuredFilterOption = new FilterOption(
                                                filterOptionsList[index].id, 
                                                filterOptionsList[index].icon, 
                                                filterOptionsList[index].name, 
                                                filterOptionsList[index].configurationBlock, 
                                                filterOptionsList[index].getConfigurationFunc, 
                                                filterOptionsList[index].configurationToStringFunc, 
                                                filterOptionsList[index].applyFunc,
                                                filterOptionsList[index].requiredUserFields,
                                                configuration 
                                              ),
                                              filterOptionBlock = showAddFilterOptionBlock( configuredFilterOption.show(), filterSet );
                                              
                                        filterSet.filterSetBlock.insertBefore( filterOptionBlock, filterSet.addBlock );  
                                        filterSet.filterOptionList.push( configuredFilterOption );
                                    }
                                );
                                $.modal( $( editInterfaceBlock ), { 
                                    overlayClose : true, 
                                    containerCss: {
                                        position: 'absolute !important'
                                    },
                                    position : [$( filterSet.addBlock ).offset().top + $( filterSet.addBlock ).outerHeight() - 1 - $( document ).scrollTop(), $( filterSet.addBlock ).offset().left],
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
                                                addIcon.title = getMessage( 'addFilterOption' );
                                                $.modal.close();
                                            });
                                        });
                                    }
                                });
                            } else {
                                addIcon.src = 'images/plus-btn.png';
                                addIcon.title = getMessage( 'addFilterOption' );
                            }
                        }); 
                    }); 
                }
            });            
        });
        
        filterSet.filterSetBlock.appendChild( filterSet.addBlock );
        
        $( filterSet.filterSetBlock ).addClass( 'filterSetBlock' );
        
        return filterSet.filterSetBlock;
    }
    
    this.apply = function( callback, onSuccess, filterProcess ) {
        if ( this.filterOptionList.length && filterProcess.id != null ) {
            var filterOptionList = this.filterOptionList.clone();
            
            /* sort filterOptionList by priority here [highest,...., lowest] */
            StorageManager.getUserIdsList( function( userIdsList ) {
                applyUserIteration( filterOptionList, userIdsList, callback, onSuccess, filterProcess );
            }, true );
        } else {
            onSuccess();
        }
        
        function applyUserIteration( filterOptionList, userIdsList, callback, onSuccess, filterProcess ) {
            if ( userIdsList.length && filterProcess.id != null ) {
                var foList = filterOptionList.clone();

                applyFilterOptionIteration( 
                    foList,
                    userIdsList.shift(), 
                    
                    function( userId ) {
                        applyUserIteration( filterOptionList, userIdsList, callback, onSuccess, filterProcess );
                    },
                    
                    function( userId ) {
                        callback( userId );
                        applyUserIteration( filterOptionList, userIdsList, callback, onSuccess, filterProcess );
                    },
                    filterProcess
                );
            } else {
                onSuccess();
            }
        }
        
        function applyFilterOptionIteration( filterOptionList, userId, nextUserIteration, callback, filterProcess ) {
            
            if ( filterProcess.id == null ) {
            } else if ( !filterOptionList.length ) {
                callback( userId );
            } else {
                /* Событие обновления прогресс бара */
                $( '#progresBar' ).wijprogressbar( 'value', counterProgressBar.usersApply++ );
                filterOptionList.shift().apply( 
                    userId, 
                    
                    function( userId ) {
                        applyFilterOptionIteration( filterOptionList, userId, nextUserIteration, callback, filterProcess );
                    },
                    
                    function( userId ) {
                        nextUserIteration( userId );
                    }
                );
            }
        }
    }
    
    function showAddFilterOptionBlock( filterOptionBlock, filterSet ) {
        var showAddFilterOptionBlock = document.createElement( 'div' ),
              removeButton = document.createElement( 'a' ),
              removeIcon = document.createElement( 'img' );
              
        removeIcon.src = 'images/grey-cross-btn.png';
        removeIcon.title = getMessage( 'removeFilterOption' );
        removeButton.appendChild( removeIcon );        
        $( removeButton ).addClass( 'remove' );
        $( removeButton ).addClass( 'but-icon' );
        
        removeButton.addEventListener( 'click', function() {
            var index = $( this.parentElement ).index();
            filterSet.filterOptionList.splice( index, 1 );
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