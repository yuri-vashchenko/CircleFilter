function Filter( filterBlock, resultBlock ) {
    this.result = new Result( resultBlock );
    
    this.filterSetList = new Array();  
    
    this.filterBlock = filterBlock;    
    
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
              exportButton = document.createElement( 'a' ),              
              exportIcon = document.createElement( 'img' ),
              clearButton = document.createElement( 'button' ),
              applyButton = document.createElement( 'button' ),
              topGroupBlock = document.createElement( 'div'),
              bottomGroupBlock = document.createElement( 'div');
              
        exportIcon.src = 'images/save.png';
        exportButton.appendChild( exportIcon );
        $( exportIcon ).addClass( 'but-icon' );
        $( exportButton ).addClass( 'button' );        
        topGroupBlock.appendChild( exportButton );
        
        exportButton.addEventListener( 'click', function() {-
            console.log( filter.filterSetList[0].filterOptionList );
        });
        
        importIcon.src = 'images/load.png';    
        importButton.appendChild( importIcon );
        $( importIcon ).addClass( 'but-icon' );
        $( importButton ).addClass( 'button' );
        topGroupBlock.appendChild( importButton );
        
        controlBlock.appendChild( topGroupBlock );
        $( topGroupBlock ).addClass( 'topGroupBlock' );
        
        clearButton.textContent = getMessage( 'clear' );
        bottomGroupBlock.appendChild( clearButton );
        
        clearButton.addEventListener( 'click', function() {
            var parentContent = filter.filterBlock.querySelector( '.formula' ).parentElement;
            
            filter.filterSetList = new Array();            
            parentContent.querySelector( '.formula' ).remove();
            parentContent.insertBefore( showFormulaBlock( filter ), parentContent.querySelector( '.control' ) );
        });
        
        applyButton.textContent = getMessage( 'apply' );
        bottomGroupBlock.appendChild( applyButton );
        
        applyButton.addEventListener( 'click', function() {
            filter.result.reset();
            var operationID = setTimeout( function() {
                var filterSetList = filter.filterSetList.clone();
                applyFilterSetIteration( 
                    filterSetList, 
                    function( userId ) {
                        StorageManager.getUserInfo( userId, function( user ) {
                            filter.result.append( user );
                        });
                    }, 
                    function() { 
                        filter.result.finish(); 
                    }
                );
                
                function applyFilterSetIteration( filterSetList, callback, onSuccess ) {
                    if ( !filterSetList.length ) {
                        onSuccess();
                    } else {
                        filterSetList.shift().apply( 
                            callback,
                            
                            function() {
                                applyFilterSetIteration( filterSetList, callback, onSuccess )
                            }
                        );
                    }
                }
            }, 0);
            
            //clearTimeout(operationID)
        });        

        controlBlock.appendChild( bottomGroupBlock );
        $( bottomGroupBlock ).addClass( 'bottomGroupBlock' );
        
        $( controlBlock ).addClass( 'control' );
        
        return controlBlock;
    }
    
    function showFormulaBlock( filter ) {
        var formulaBlock = document.createElement( 'div' ),
              addFilterSetButton = document.createElement( 'button' ),
              filterSet = new FilterSet();
              
        formulaBlock.appendChild( addFilterSet( filter, filterSet ) );     
        
        addFilterSetButton.textContent = getMessage( 'or' );
        formulaBlock.appendChild( addFilterSetButton );
        
        addFilterSetButton.addEventListener( 'click', function() {
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
}