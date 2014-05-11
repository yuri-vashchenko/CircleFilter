function Filter( filterBlock, resultBlock ) {
    this.result = new Result( resultBlock );
    
	this.filterOptionsList = Array();    
    this.filterBlock = filterBlock;
    this.formula;
    
    $( this.filterBlock ).addClass( 'filter' );
         
    this.filterBlock.appendChild( showDropdownBlock(
        getMessage( 'chooseFilter' ), 
        showChooseFilterBlock( this ),
        true ) );
            
    this.filterBlock.appendChild( showDropdownBlock(
        getMessage( 'chooseAction' ), 
        showChooseActionBlock( this ),
        false ) );
    
    this.addFilterOption = function( filterOption ) {
        this.filterOptionsList.push( filterOption );
    }
    
    function showDropdownBlock( title, contentBlock, state ) {
        var dropdownBlock = document.createElement( 'div' ),
              titleBlock = document.createElement( 'div' ),
              titleContentBlock = document.createElement( 'h3' ),
              stateIconBlock = document.createElement( 'span' );
               
        $( titleBlock ).addClass( 'title' );     
        titleContentBlock.textContent = title;
        
        titleBlock.appendChild( stateIconBlock );
        titleBlock.appendChild( titleContentBlock );
        
        $( dropdownBlock ).addClass( 'dropdown' ); 
        $( contentBlock ).addClass( 'content' );
        
        dropdownBlock.appendChild( titleBlock );
        dropdownBlock.appendChild( contentBlock );        
        
        if ( !state ) {
            $( contentBlock ).hide();
            $( dropdownBlock ).toggleClass( 'inactive' );
        }
         
        titleBlock.addEventListener( 'click', function() {
            $( contentBlock ).slideToggle();
            $( dropdownBlock ).toggleClass( 'inactive' );
        });
 
        return dropdownBlock;
    }
    
    function showControlBlock( filter ) {
        var controlBlock = document.createElement( 'div' ),
              importButton = document.createElement( 'a' ),
              exportButton = document.createElement( 'a' ),
              importIcon = document.createElement( 'img' ),
              exportIcon = document.createElement( 'img' ),
              clearButton = document.createElement( 'button' ),
              applyButton = document.createElement( 'button' ),
              topGroupBlock = document.createElement( 'div'),
              bottomGroupBlock = document.createElement( 'div');
        
        importButton.href = '#';
        exportButton.href = '#';
        importIcon.src = 'images/save.png';
        exportIcon.src = 'images/load.png';    
        
        $( importIcon ).addClass( 'but-icon' );
        $( exportIcon ).addClass( 'but-icon' );
        
        $( importButton ).addClass( 'button' );
        $( exportButton ).addClass( 'button' );
        
        importButton.appendChild( importIcon );
        exportButton.appendChild( exportIcon );
        
        clearButton.textContent = getMessage( 'clear' );
        applyButton.textContent = getMessage( 'apply' );
        
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
        
        topGroupBlock.appendChild( importButton );
        topGroupBlock.appendChild( exportButton );
        bottomGroupBlock.appendChild( clearButton );
        bottomGroupBlock.appendChild( applyButton );
        controlBlock.appendChild( topGroupBlock );
        controlBlock.appendChild( bottomGroupBlock );
        
        $( controlBlock ).addClass( 'control' );
        $( topGroupBlock ).addClass( 'topGroupBlock' );
        $( bottomGroupBlock ).addClass( 'bottomGroupBlock' );
        
        return controlBlock;
    }
    
    function showFormulaBlock( filter ) {
        var formulaBlock = document.createElement( 'div' ),
              orButton = document.createElement( 'button' );
               
        orButton.textContent = getMessage( 'or' );
        
        orButton.addEventListener( 'click', function() {
            var orBlock = showOrBlock( filter ),
                  orText = document.createElement( 'div' );    
                   
            orText.textContent = getMessage( 'or' );
            
            formulaBlock.insertBefore( orText, this );
            formulaBlock.insertBefore( showOrBlock( filter ), this );
        });
        
        formulaBlock.appendChild( showOrBlock( filter ) );
        formulaBlock.appendChild( orButton );
        
        $( formulaBlock ).addClass( 'formula' );
        
        return formulaBlock;
        
        function showOrBlock( filter ) {
            var orBlock = document.createElement( 'div' ),
                  removeButton = document.createElement( 'button' ),
                  andButton = document.createElement( 'button' );
                   
            andButton.textContent = "+";
            removeButton.textContent = "X";
            
            andButton.addEventListener( 'click', function() {
                orBlock.insertBefore( showAndBlock( filter ), this );
            });
            removeButton.addEventListener( 'click', function() {
                if ( this.parentElement.nextSibling.nodeName != 'BUTTON' ) {
                    this.parentElement.nextSibling.remove();
                    this.parentElement.remove();
                } else  if ( this.parentElement.previousElementSibling ) {
                    this.parentElement.previousElementSibling.remove();
                    this.parentElement.remove();
                }
            });
            
            orBlock.appendChild( removeButton );
            orBlock.appendChild( andButton );
            
            $( orBlock ).addClass( 'orBlock' );
            
            return orBlock;
        }
        
        function showAndBlock( filter ) {
            var andBlock = document.createElement( 'div' ),
                  removeButton = document.createElement( 'button' );
                   
            removeButton.textContent = "X";
            andBlock.textContent = getMessage( 'inDev' );
            
            removeButton.addEventListener( 'click', function() {
                    this.parentElement.remove();
            });
            
            andBlock.appendChild( removeButton );
            
            $( andBlock ).addClass( 'andBlock' );
            
            return andBlock;
        }
    }
    
    function showChooseFilterBlock( filter ) {
        var chooseFilterBlock = document.createElement( 'div' );
        
        chooseFilterBlock.appendChild( showFormulaBlock( filter ) );        
        chooseFilterBlock.appendChild( showControlBlock( filter ) );
        
        return chooseFilterBlock;
    }
    
 function showChooseActionBlock( filter ) {
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