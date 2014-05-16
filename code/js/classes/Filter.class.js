function Filter( filterBlock, resultBlock ) {
    this.result = new Result( resultBlock );
    
    this.filterSetList = Array(); /* toSolve */
    this.addFilterSet = function( filterSet ) { /* toSolve */
        this.filterSetList.push( filterSet );
    }
    
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
        
        exportButton.addEventListener( 'click', function() {
            console.log( filter.filterSetList );
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
        
        applyButton.textContent = getMessage( 'apply' );
        bottomGroupBlock.appendChild( applyButton );
        
        applyButton.addEventListener( 'click', function() {
            filter.result.reset();
            GPlus.getUsersList( function( error, status, response ) {
                if ( !error && status == 200 ) {
                    var users = JSON.parse(response).items;
                    for ( var i = 0; i < users.length; i++ ) {
                        filter.result.append( new User( users[i].id, users[i].displayName, "", users[i].image.url ) );
                    }
                }
            }); 
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
              
        filter.addFilterSet( filterSet );
        
        formulaBlock.appendChild( filterSet.show() );     
        
        addFilterSetButton.textContent = getMessage( 'or' );
        formulaBlock.appendChild( addFilterSetButton );
        
        addFilterSetButton.addEventListener( 'click', function() {
            var filterSet = new FilterSet(),
                  orText = document.createElement( 'div' ); 
                  
            filter.addFilterSet( filterSet );
                   
            orText.textContent = getMessage( 'or' );
            $( orText ).addClass( 'orText' );
            
            formulaBlock.insertBefore( orText, this );
            formulaBlock.insertBefore( filterSet.show(), this );
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
}