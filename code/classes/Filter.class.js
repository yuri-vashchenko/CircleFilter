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
        
        clearButton.textContent = 'Сбросить';
        applyButton.textContent = 'Применить';
        
        applyButton.addEventListener( 'click', function() {
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
               
        orButton.textContent = "OR";
        
        orButton.addEventListener( 'click', function() {
            var orBlock = showOrBlock( filter ),
                   orText = document.createElement( 'div' );    
                   
            orText.textContent = "OR";
            
            formulaBlock.insertBefore( orText, this );
            formulaBlock.insertBefore( showOrBlock( filter ), this );
        });
        
        formulaBlock.appendChild( showOrBlock( filter ) );
        formulaBlock.appendChild( orButton );
        
        $( formulaBlock ).addClass( 'formula' );
        
        return formulaBlock;
        
        function showOrBlock( filter ) {
            var orBlock = document.createElement( 'div' ),
                   removeButton = document.createElement( 'button' );
                   andButton = document.createElement( 'button' );
                   
            andButton.textContent = "AND";
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