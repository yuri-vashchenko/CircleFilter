var Options = ( function() {
    function showIcon() {
        var iconBlock = document.createElement( 'img' );
        
        iconBlock.src = 'images/config.png';
        $( iconBlock ).addClass( 'icon' );
        
        return iconBlock;
    }
    
    function showName( options ) {
        var nameBlock = document.createElement( 'div' );
        
        nameBlock.textContent = options.name;
        $( nameBlock ).addClass( 'name' );
        
        return nameBlock;
    }
    
    function showContentBlock() {
        var contentBlock = document.createElement( 'div' );
        
        return contentBlock;
    }
    
    return {
        name: getMessage( 'config' ),
        
        show: function( onClose ) {
            var optionsBlock = document.createElement( 'div' ),
                  headerBlock = document.createElement( 'div' ),
                  controlBlock = document.createElement( 'div' ),
                  cancelButton = document.createElement( 'a' ),
                  cancelIcon = document.createElement( 'img' ),
                  acceptButton = document.createElement( 'a' ),
                  acceptIcon = document.createElement( 'img' );
                  
            $( headerBlock ).addClass( 'headerBlock' );
            headerBlock.appendChild( showIcon() );
            headerBlock.appendChild( showName( this ) );
            
            cancelIcon.src = 'images/cross-btn.png';
            cancelButton.appendChild( cancelIcon );
            controlBlock.appendChild( cancelButton );        
            $( cancelButton ).addClass( 'but-icon' );   
            
            cancelButton.addEventListener( 'click', onClose );
            
            acceptIcon.src = 'images/plus-btn.png';
            acceptButton.appendChild( acceptIcon );
            controlBlock.appendChild( acceptButton );
            $( acceptButton ).addClass( 'but-icon' );   
            
            acceptButton.addEventListener( 'click', function() {
                /* paste your apply Options code here */
                
                onClose();
            });
            
            optionsBlock.appendChild( headerBlock );
            optionsBlock.appendChild( showContentBlock()  );
            optionsBlock.appendChild( controlBlock );
            
            $( optionsBlock ).addClass( 'optionsBlock' );        
            $( controlBlock ).addClass( 'controlBlock' );   
            
            return optionsBlock;
        }
    }
})();