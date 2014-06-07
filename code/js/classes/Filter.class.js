function Filter( filterBlock, resultBlock ) {
    this.result = new Result( resultBlock );
    this.process = { id: null };
    
    this.filterSetList = new Array();  
    
    this.filterBlock = filterBlock;
    this.addFilterSetButton;
    
    $( this.filterBlock ).addClass( 'filter' );
         
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
        
        applyButton.textContent = getMessage( 'apply' );
        applyButton.title = getMessage( 'applyTitle' );  
        
        bottomGroupBlock.appendChild( applyButton );
        
        applyButton.addEventListener( 'click', function() {
            if ( filter.process.id == null ) {
                startProcessing( filter, applyButton, function() {
                    var filterSetList = filter.filterSetList.clone();
                    applyFilterSetIteration( 
                        filterSetList, 
                        function( userId ) {
                            StorageManager.getUserInfo( false, userId, User.propertiesForShow, function( user ) {
                                filter.result.append( user );
                            });
                        }, 
                        function() { 
                            stopProcessing( filter, applyButton );
                        },
                        filter.process
                    );
                    
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
        applyButton.textContent = getMessage( 'stop' );
        applyButton.title = getMessage( 'stopTitle' );
        
        filter.result.reset();
        filter.result.processing();
        filter.process.id = setTimeout( processingFunc, 0);
    }
    
    function stopProcessing( filter, applyButton ) {
        filter.process.id = null;
        filter.result.finish(); 
        applyButton.textContent = getMessage( 'apply' );
        applyButton.title = getMessage( 'applyTitle' );
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
    
    function showChooseActionBlock() {
        var chooseActionBlock = document.createElement( 'div' ),
              addToCircleButton = document.createElement( 'button' ),
              moveToCircleButton = document.createElement( 'button' ),
              deleteFromCircleButton = document.createElement( 'button' ),
              deleteAllFromCircleButton = document.createElement( 'button' ),
              exportToFileBlock = document.createElement( 'div' ),
              exportToFileTitle = document.createElement( 'h3' ),
              exportToCsvButton = document.createElement( 'button' ),
              exportToXmlButton = document.createElement( 'button' );
              
        addToCircleButton.textContent = getMessage( 'addToCircle' );
        moveToCircleButton.textContent = getMessage( 'moveToCircle' );
        deleteFromCircleButton.textContent = getMessage( 'deleteFromCircle' );
        deleteAllFromCircleButton.textContent = getMessage( 'deleteAllFromCircle' );
        exportToFileTitle.textContent = getMessage( 'exportToFile' );
        exportToXmlButton.textContent = getMessage( 'exportToXml' );
        exportToCsvButton.textContent = getMessage( 'exportToCsv' );

        addToCircleButton.title = getMessage( 'addToCircleTitle' );
        moveToCircleButton.title = getMessage( 'moveToCircleTitle' );
        deleteFromCircleButton.title = getMessage( 'deleteFromCircleTitle' );
        deleteAllFromCircleButton.title = getMessage( 'deleteAllFromCircleTitle' );
        exportToFileTitle.title = getMessage( 'exportToFileTitle' );
        exportToXmlButton.title = getMessage( 'exportToXmlTitle' );
        exportToCsvButton.title = getMessage( 'exportToCsvTitle' );

        chooseActionBlock.appendChild( addToCircleButton );
        chooseActionBlock.appendChild( moveToCircleButton );
        chooseActionBlock.appendChild( deleteFromCircleButton );
        chooseActionBlock.appendChild( deleteAllFromCircleButton );

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