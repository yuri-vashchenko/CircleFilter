function Filter( filterBlock, resultBlock ) {
    this.result = new Result( resultBlock );
    this.process = { id: null };
    
    this.filterSetList = new Array();  
    
    this.filterBlock = filterBlock;
    this.addFilterSetButton;
    
    $( this.filterBlock ).addClass( 'filter' );
         
    var self = this;
    
    this.filterBlock.appendChild( showDropdownBlock(
        getMessage( 'chooseFilter' ), 
        showChooseFilterBlock( this ),
        true ) );
            
    this.filterBlock.appendChild( showDropdownBlock(
        getMessage( 'chooseAction' ), 
        showChooseActionBlock( this ),
        false ) );
    
    function showControlBlock( filter ) {
        var controlBlock = document.createElement( 'div' ),
              importButton = document.createElement( 'a' ),
              importIcon = document.createElement( 'img' ),
              importInput = document.createElement( 'input' ),
              exportButton = document.createElement( 'a' ),              
              exportIcon = document.createElement( 'img' ),
              clearButton = document.createElement( 'button' ),
              applyButton = document.createElement( 'button' ),
              topGroupBlock = document.createElement( 'div' ),
              bottomGroupBlock = document.createElement( 'div' );           

        clearButton.title = getMessage( 'clearTitle' );
        applyButton.title = getMessage( 'applyTitle' );  
        applyButton.textContent = getMessage( 'apply' );
        
        $( 'button#stopProcessing' ).click( function() {
            stopProcessing( filter, applyButton );
        });
        
        importIcon.src = 'images/import.png';    
        importIcon.title = getMessage( 'import' );        
        importButton.appendChild( importIcon );
        
        importInput.type = 'file';        
        importInput.addEventListener( 'change', function( e ) {
            readStringFromFile( importInput.files[0], function( data ) {
                var formula = JSON.parse( data );
                
                if ( formula && formula.length > 0 ) {
                    clearButton.click();
                    var k = 0;
                    
                    for ( var i = 0; i < formula.length; i++ ) {
                        filter.filterSetList[k].importFilterSet( formula[i] );
                        if ( i != formula.length - 1 && formula[i].length > 0 ) {
                            filter.addFilterSetButton.click();
                            k++;
                        }
                    }
                }
            });
        });
        
        importButton.appendChild( importInput );
        
        $( importIcon ).addClass( 'but-icon' );
        $( importButton ).addClass( 'button' );
        topGroupBlock.appendChild( importButton );
        
        importButton.addEventListener( 'click', function( e ) {
            importInput.click( e );
        });
        
        exportIcon.src = 'images/export.png';
        exportIcon.title = getMessage( 'export' );
        
        exportButton.appendChild( exportIcon );
        $( exportIcon ).addClass( 'but-icon' );
        $( exportButton ).addClass( 'button' );        
        topGroupBlock.appendChild( exportButton );
        
        exportButton.addEventListener( 'click', function() {
            writeStringToFile( filterSetListToString( filter.filterSetList ), 'formula(' + getCurrentDate() + ').dat' );
        });
        
        controlBlock.appendChild( topGroupBlock );
        $( topGroupBlock ).addClass( 'topGroupBlock' );
        
        clearButton.textContent = getMessage( 'clear' );
        clearButton.title = getMessage( 'clear' );
        bottomGroupBlock.appendChild( clearButton );
        
        clearButton.addEventListener( 'click', function() {
            var parentContent = filter.filterBlock.querySelector( '.formula' ).parentElement;
            
            filter.filterSetList = new Array();            
            parentContent.querySelector( '.formula' ).remove();
            parentContent.insertBefore( showFormulaBlock( filter ), parentContent.querySelector( '.control' ) );
        });
        
        bottomGroupBlock.appendChild( applyButton );
        
        applyButton.addEventListener( 'click', function() {
            
            if ( filter.process.id == null ) {
                startProcessing( filter, applyButton, function() {
                
                    var filterSetList = filter.filterSetList.clone();
                    
                    counterProgressBar.progressJoint = 0;
                    counterProgressBar.filterOptionsTotal = 0;
                    
                    for ( var i = 0; i < filterSetList.length; i++ ) {
                        counterProgressBar.filterOptionsTotal += filterSetList[i].filterOptionList.length;
                    }
                    
                    StorageManager.getUserIdsList( function( userIdsList ) {
                        counterProgressBar.usersTotal = userIdsList.length;
                        
                        $( '#progressBar' ).wijprogressbar({
                            'enable': true, 
                            'value': 0,
                            'labelAlign': 'center',
                            'animationOptions': { duration: 1000 },
                            'indicatorImage': 'images/progressbar_40x40.png',
                            'maxValue': counterProgressBar.usersTotal * ( counterProgressBar.filterOptionsTotal == 0 ? 1 : counterProgressBar.filterOptionsTotal )
                        });
                                
                        if ( counterProgressBar.filterOptionsTotal == 0 ) {                                
                                applyEmptyFilterSetIteration(
                                    userIdsList,
                                    function() { 
                                        stopProcessing( filter, applyButton );
                                    },
                                    filter.process
                                );                         
                        } else {                            
                            applyFilterSetIteration( 
                                filterSetList, 
                                function( userId ) {
                                    StorageManager.getUserInfo( userId, User.propertiesForShow, function( user ) {
                                        filter.result.append( user );
                                    });
                                }, 
                                function() { 
                                    stopProcessing( filter, applyButton );
                                },
                                filter.process
                            );
                        }
                    
                        function applyEmptyFilterSetIteration( userIdsList, onSuccess, filterProcess ) {
                            if ( userIdsList.length == 0 || filterProcess.id == null ) {
                                onSuccess();
                            } else {   
                                $( '#progressBar' ).wijprogressbar( 'value', counterProgressBar.progressJoint++ );
                                StorageManager.getUserInfo( userIdsList.shift(), User.propertiesForShow, function( user ) {
                                    filter.result.append( user );
                                    applyEmptyFilterSetIteration( userIdsList, onSuccess, filterProcess );
                                });
                            }
                        }
                        
                        function applyFilterSetIteration( filterSetList, callback, onSuccess, filterProcess ) {
                            if ( !filterSetList.length || filterProcess.id == null ) {
                                onSuccess();
                            } else {
                                filterSetList.shift().apply( 
                                    callback,
                                    
                                    function() {
                                        applyFilterSetIteration( filterSetList, callback, onSuccess, filterProcess )
                                    }, 
                                    filterProcess
                                );
                            }
                        }
                    }, true );
                });
            } else {
                clearTimeout( filter.process.id );
                stopProcessing( filter, applyButton );
            }
            
        });        

        controlBlock.appendChild( bottomGroupBlock );
        
        $( bottomGroupBlock ).addClass( 'bottomGroupBlock' );
        
        $( controlBlock ).addClass( 'control' );
        
        return controlBlock;
    }
    
    function startProcessing( filter, applyButton, processingFunc ) {
        $( applyButton ).attr( 'disabled', true );
        $( 'button#stopProcessing' ).show();
        filter.result.reset();
        filter.result.processing();
        filter.process.id = setTimeout( processingFunc, 0);
    }
    
    function stopProcessing( filter, applyButton ) {
        filter.process.id = null;
        filter.result.finish(); 
        $( applyButton ).attr( 'disabled', false );
         $( 'button#stopProcessing' ).hide();
        
        $( '#progressBar' ).wijprogressbar( 'destroy' );
    }
    
    function showFormulaBlock( filter ) {
        var formulaBlock = document.createElement( 'div' ),
              filterSet = new FilterSet();
        
        filter.addFilterSetButton = document.createElement( 'button' );
        
        formulaBlock.appendChild( addFilterSet( filter, filterSet ) );     
        
        filter.addFilterSetButton.textContent = getMessage( 'or' );
        formulaBlock.appendChild( filter.addFilterSetButton );
        
        filter.addFilterSetButton.addEventListener( 'click', function() {            
            var filterSet = new FilterSet();
                  orText = document.createElement( 'div' ); 
                   
            orText.textContent = getMessage( 'or' );
            $( orText ).addClass( 'orText' );
            
            formulaBlock.insertBefore( orText, this );
            formulaBlock.insertBefore( addFilterSet( filter, filterSet ), this );
        });
        
        $( formulaBlock ).addClass( 'formula' );
        
        return formulaBlock;
    }
    
    function showChooseFilterBlock( filter ) {
        var chooseFilterBlock = document.createElement( 'div' );
        
        chooseFilterBlock.appendChild( showFormulaBlock( filter ) );        
        chooseFilterBlock.appendChild( showControlBlock( filter ) );
        
        return chooseFilterBlock;
    }
    
    /* функция получает DOM элемент круга */
    function showCircle( name, description, id ) {
        var divBlock = document.createElement( 'div' ),
              checkBox = document.createElement( 'input' ),
              label = document.createElement( 'label' ),
              nameSpan = document.createElement( 'span' );
        
        checkBox.type = 'checkbox';
        checkBox.value = id;    
        
        nameSpan.textContent = name;
        nameSpan.title = description;
        
        label.appendChild( checkBox );  
        label.appendChild( nameSpan );
          
        divBlock.appendChild( label );
        
        return divBlock;
    }
    
    /* функция получения списка DOM элементов для отображения кругов */
    function showCircleList( callback ) {        
        var listBlock = document.createElement( 'ul' );
        
        StorageManager.getCirclesList( function( circlesList ) {
            for ( var i = 0; i < circlesList.length; i++ ) {
                var li = document.createElement( 'li' );
                
                li.appendChild( showCircle( circlesList[i].name, circlesList[i].description, circlesList[i].id ) );
                listBlock.appendChild( li );
            }
            
            callback( listBlock );
        });
    }
    
    /* Форма удаления кругов */
    function showDeleteCircleForm( deleteCircleButton ) {
        showCircleList( function( listBlock ) {
            $( listBlock ).addClass( 'contentBlock' );
            
            var circleDeleteForm = document.createElement( 'div' ),
                  controlBlock = document.createElement( 'div' ),
                  cancelButton = showCancelButton(),
                  acceptButton = showAcceptButton( getMessage( 'delete' ) );
            
            controlBlock.appendChild( cancelButton );
            controlBlock.appendChild( acceptButton );           
            $( controlBlock ).addClass( 'controlBlock' );
            
            circleDeleteForm.appendChild( listBlock );
            circleDeleteForm.appendChild( controlBlock );            
            $( circleDeleteForm ).addClass( 'circleDeleteForm' );
            
            $.modal( $( circleDeleteForm ), {
                overlayClose : true,
                containerCss: {
                    position: 'absolute !important'
                },
                position : [$( deleteCircleButton ).offset().top + $( deleteCircleButton ).outerHeight() - 1 - $( document ).scrollTop(), $( deleteCircleButton ).offset().left],
                onOpen: function ( dialog ) {
                    dialog.overlay.fadeIn( 'fast' );
                    dialog.container.slideDown( 'fast' );
                    dialog.data.slideDown( 'fast' );
                },
                onShow: function( dialog ) {                
                    cancelButton.addEventListener( 'click', function() {
                        $.modal.close(); 
                    });
                    
                    acceptButton.addEventListener( 'click', function() {
                        
                        removeIterator( 0, listBlock, function() { 
                            alert( 'Операция удаления кругов завершена' );
                        });
                        $.modal.close();
                        
                        function removeIterator( i, listBlock, onSuccess ) {
                            if ( i < listBlock.children.length ) {
                                var checkBox = listBlock.children[i].querySelector( 'input' );
                                
                                if ( checkBox.checked ) {
                                    StorageManager.removeCircle( checkBox.value, function() {
                                        removeIterator( i + 1, listBlock, onSuccess );
                                    });
                                } else {
                                    removeIterator( i + 1, listBlock, onSuccess );
                                }                          
                            } else {
                                onSuccess();
                            }
                        }
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
    }
    
    /* Форма добавления кругов */
    function showCreateCircleForm( createCircleButton ) {
        var circleCreateForm = document.createElement( 'div' ),
              contentBlock = document.createElement( 'div' ),
              controlBlock = document.createElement( 'div' ),
              listBlock = document.createElement( 'ul' ),
              
              nameBlock = document.createElement( 'div' ),
              nameLabel = document.createElement( 'label' ),
              name = document.createElement( 'input' ),              
              
              descriptionBlock = document.createElement( 'div' ),
              descriptionLabel = document.createElement( 'label' ),
              description = document.createElement( 'input' ),
              
              cancelButton = showCancelButton(),
              acceptButton = showAcceptButton( getMessage( 'createCircleButton' ) );
            
        nameLabel.textContent = getMessage( 'circleName' );
        descriptionLabel.textContent = getMessage( 'circleDescription' );
        
        nameBlock.appendChild( nameLabel );
        nameBlock.appendChild( name );
        
        descriptionBlock.appendChild( descriptionLabel );
        descriptionBlock.appendChild( description );
        
        contentBlock.appendChild( nameBlock );
        contentBlock.appendChild( descriptionBlock );
        $( contentBlock ).addClass( 'contentBlock' );
        
        controlBlock.appendChild( cancelButton );
        controlBlock.appendChild( acceptButton );
        $( controlBlock ).addClass( 'controlBlock' );
        
        circleCreateForm.appendChild( contentBlock );
        circleCreateForm.appendChild( controlBlock );
        $( circleCreateForm ).addClass( 'circleCreateForm' );

        $.modal( $( circleCreateForm ), { 
            overlayClose : true,
            containerCss: {
                position: 'absolute !important'
            },
            position : [$( createCircleButton ).offset().top + $( createCircleButton ).outerHeight() - 1 - $( document ).scrollTop(), $( createCircleButton ).offset().left],
            onOpen: function ( dialog ) {
                dialog.overlay.fadeIn( 'fast' );
                dialog.container.slideDown( 'fast' );
                dialog.data.slideDown( 'fast' );
            },
            onShow: function( dialog ) {
                cancelButton.addEventListener( 'click', function() {
                    $.modal.close();
                });
                
                acceptButton.addEventListener( 'click', function() {
                    var nameTrimmed = name.value.trim();
                    
                    if ( nameTrimmed.length > 0 ) {
                        StorageManager.createCircle( nameTrimmed, description.value.trim(), function() { 
                            alert( 'Круг добавлен' );                            
                        });
                        $.modal.close();
                    }
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
    }
    
    /* Форма добавления выбранных пользователей в круг*/
    function showAddToCircleForm( addToCircleButton ){
        showCircleList( function( listBlock ) {
            $( listBlock ).addClass( 'contentBlock' );
            
            var addToCircleForm = document.createElement( 'div' ),
                  controlBlock = document.createElement( 'div' ),
                  cancelButton = showCancelButton(),
                  acceptButton = showAcceptButton( getMessage( 'delete' ) );
            
            controlBlock.appendChild( cancelButton );
            controlBlock.appendChild( acceptButton );           
            $( controlBlock ).addClass( 'controlBlock' );
            
            addToCircleForm.appendChild( listBlock );
            addToCircleForm.appendChild( controlBlock );            
            $( addToCircleForm ).addClass( 'addToCircleForm' );
            
            $.modal( $( addToCircleForm ), {
                overlayClose : true,
                position : [$( addToCircleButton ).offset().top + $( addToCircleButton ).outerHeight() - 1 - $( document ).scrollTop(), $( addToCircleButton ).offset().left],
                onOpen: function( dialog ) {
                    dialog.overlay.fadeIn( 'fast' );
                    dialog.container.slideDown( 'fast' );
                    dialog.data.slideDown( 'fast' );
                },
                onShow: function( dialog ) {                
                    cancelButton.addEventListener( 'click', function() {
                        $.modal.close(); 
                    });
                    
                    acceptButton.addEventListener( 'click', function() {
                        var usersList = self.result.getCheckedUsers(),
                              usersIdList = [];
                              
                        for ( var i = 0; i < usersList.length; i++ ) {
                            usersIdList.push( usersList[i].id );    
                        }
                        
                        addUserToCircleIterator( 0, listBlock, usersIdList, function() { 
                            alert( 'Операция добавления пользователей в круги завершена' );
                        });
                        
                        $.modal.close();
                        
                        function addUserToCircleIterator( i, listBlock, usersIdList, onSuccess ) {                                
                            if ( i < listBlock.children.length ) {
                                var checkBox = listBlock.children[i].querySelector( 'input' );
                                    
                                if ( checkBox.checked ) {
                                    StorageManager.addPeopleToCircle( checkBox.value, usersIdList, function() {
                                        addUserToCircleIterator( i + 1, listBlock, usersIdList, onSuccess );
                                    });
                                } else {
                                    addUserToCircleIterator( i + 1, listBlock, usersIdList, onSuccess );
                                }                          
                            } else {
                                onSuccess();
                            }
                        }
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
    }
    
    /* Форма удаления выбранных пользователей из круга */
    function showDeleteFromCircleForm( deleteFromCircleButton ){
        showCircleList( function( listBlock ) {
            $( listBlock ).addClass( 'contentBlock' );
            
            var deleteFromCircleForm = document.createElement( 'div' ),
                  controlBlock = document.createElement( 'div' ),
                  cancelButton = showCancelButton(),
                  acceptButton = showAcceptButton( getMessage( 'delete' ) );
            
            controlBlock.appendChild( cancelButton );
            controlBlock.appendChild( acceptButton );           
            $( controlBlock ).addClass( 'controlBlock' );
            
            deleteFromCircleForm.appendChild( listBlock );
            deleteFromCircleForm.appendChild( controlBlock );            
            $( deleteFromCircleForm ).addClass( 'deleteFromCircleForm' );
            
            $.modal( $( deleteFromCircleForm ), {
                overlayClose : true,
                position : [$( deleteFromCircleButton ).offset().top + $( deleteFromCircleButton ).outerHeight() - 1 - $( document ).scrollTop(), $( deleteFromCircleButton ).offset().left],
                onOpen: function ( dialog ) {
                    dialog.overlay.fadeIn( 'fast' );
                    dialog.container.slideDown( 'fast' );
                    dialog.data.slideDown( 'fast' );
                },
                onShow: function( dialog ) {                
                    cancelButton.addEventListener( 'click', function() {
                        $.modal.close(); 
                    });
                    
                    acceptButton.addEventListener( 'click', function() {
                        var usersList = self.result.getCheckedUsers(),
                              usersIdList = [];
                              
                        for ( var i = 0; i < usersList.length; i++ ) {
                            usersIdList.push( usersList[i].id );    
                        }
                        
                        removeUserFromCirclesIterator( 0, listBlock, usersIdList, function() { 
                            alert( 'Операция удаления пользователей из кругов завершена' );
                        });
                        $.modal.close();
                        
                        function removeUserFromCirclesIterator( i, listBlock, usersIdList, onSuccess ) {
                            
                            if ( i < listBlock.children.length ) {
                                var checkBox = listBlock.children[i].querySelector( 'input' );
                                
                                if ( checkBox.checked ) {
                                    StorageManager.removePeopleFromCircle( checkBox.value, usersIdList, function() {
                                        removeUserFromCirclesIterator( i + 1, listBlock, usersIdList, onSuccess );
                                    });
                                } else {
                                    removeUserFromCirclesIterator( i + 1, listBlock, usersIdList, onSuccess );
                                }                          
                            } else {
                                onSuccess();
                            }
                        }
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
    }
    
    function showChooseActionBlock() {
        var chooseActionBlock = document.createElement( 'div' ),
              addToCircleButton = document.createElement( 'button' ),
              deleteFromCircleButton = document.createElement( 'button' ),
              createCircleButton = document.createElement( 'button' ),
              deleteCircleButton = document.createElement( 'button' ),
              exportToFileBlock = document.createElement( 'div' ),
              exportToFileTitle = document.createElement( 'h3' ),
              exportToCsvButton = document.createElement( 'button' ),
              exportToXmlButton = document.createElement( 'button' );
              
        addToCircleButton.textContent = getMessage( 'addToCircle' );
        deleteFromCircleButton.textContent = getMessage( 'deleteFromCircle' );
        exportToFileTitle.textContent  = getMessage( 'exportToFile' );
        createCircleButton.textContent = getMessage( 'createCircle' );
        deleteCircleButton.textContent = getMessage( 'deleteCircle' );
        
        exportToXmlButton.textContent = getMessage( 'exportToXml' );
        exportToCsvButton.textContent = getMessage( 'exportToCsv' );

        addToCircleButton.title = getMessage( 'addToCircleTitle' );
        deleteFromCircleButton.title = getMessage( 'deleteFromCircleTitle' );
        exportToFileTitle.title = getMessage( 'exportToFileTitle' );
        createCircleButton.title = getMessage( 'createCircleTitle' );
        deleteCircleButton.title = getMessage( 'deleteCircleTitle' );
        
        exportToXmlButton.title = getMessage( 'exportToXmlTitle' );
        exportToCsvButton.title = getMessage( 'exportToCsvTitle' );
        
        addToCircleButton.addEventListener( 'click', function() {
            showAddToCircleForm( addToCircleButton );
        }); 
        
        deleteFromCircleButton.addEventListener( 'click', function() {
            showDeleteFromCircleForm( deleteFromCircleButton );
        }); 
        
        createCircleButton.addEventListener( 'click', function() {
            showCreateCircleForm( createCircleButton );
        }); 
        deleteCircleButton.addEventListener( 'click', function() {
            showDeleteCircleForm( deleteCircleButton );
        }); 
        
        chooseActionBlock.appendChild( addToCircleButton );
        chooseActionBlock.appendChild( deleteFromCircleButton );
        chooseActionBlock.appendChild( createCircleButton );
        chooseActionBlock.appendChild( deleteCircleButton );
        
        exportToFileBlock.appendChild ( exportToFileTitle );
        exportToFileBlock.appendChild ( exportToXmlButton );
        exportToFileBlock.appendChild ( exportToCsvButton );
        
        chooseActionBlock.appendChild( exportToFileBlock );
        
        $( chooseActionBlock ).addClass( 'action' );
        
        return chooseActionBlock;
    }
        
    function showRemoveFilterSetButton( filter ) {
        var removeButton = document.createElement( 'a' ),
              removeIcon = document.createElement( 'img' );
              
        removeIcon.src = 'images/cross-btn.png';
        removeIcon.title = getMessage( 'removeFilterOption' );
        
        removeButton.appendChild( removeIcon );             
        $( removeButton ).addClass( 'close' );
        $( removeButton ).addClass( 'but-icon' );      
        
        removeButton.addEventListener( 'click', function() {
            var index = $( this.parentElement ).index() / 2;
            
            if ( this.parentElement.nextSibling.nodeName != 'BUTTON' ) {
                this.parentElement.nextSibling.remove();
                this.parentElement.remove();
                removeFilterSet( filter, index );
            } else  if ( this.parentElement.previousElementSibling ) {
                this.parentElement.previousElementSibling.remove();
                this.parentElement.remove();
                removeFilterSet( filter, index );
            }
        });
        
        return removeButton;
    }
    
    /*
     * return filterSetBlock
     */
    function addFilterSet( filter, filterSet ) {
        var filterSetBlock = filterSet.show(),
              removeButton = showRemoveFilterSetButton( filter, filter.filterSetList.length )
              
        filterSetBlock.appendChild( removeButton );
    
        filter.filterSetList.push( filterSet );
        
        return filterSetBlock;
    }
    
    function removeFilterSet( filter, index ) {
        filter.filterSetList.splice( index, 1 );
    }
    
    function filterSetListToString( filterSetList ) {
        var string = '[';
        
        for ( var i = 0; i < filterSetList.length; i++ ) {
            string += filterSetList[i].toJSON() + ( i != filterSetList.length - 1 ? ',' : '' );
        }
        
        string += ']';
        
        return string;
    }
}