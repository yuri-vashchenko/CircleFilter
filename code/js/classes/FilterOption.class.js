function FilterOption( icon, name, configurationBlock, getConfigurationFunc, configurationToStringFunc, configuration ) {
    this.icon = icon;
    this.name = name;
    this.configuration = configuration;
    
    this.configurationBlock = configurationBlock;
    this.getConfigurationFunc = getConfigurationFunc;
    this.configurationToStringFunc = configurationToStringFunc;
    
    this.show = function() {
        var filterOptionBlock = document.createElement( 'div' );
        
        if ( this.configuration ) {
            filterOptionBlock.appendChild( showIcon( this ) );
            filterOptionBlock.appendChild( showConfiguration( this ) ) ;
        } else {
            filterOptionBlock.appendChild( showIcon( this ) );
            filterOptionBlock.appendChild( showName( this ) );
        }
        
        return filterOptionBlock;
    }
    
    this.showEditInterface = function( onClose, onApply ) {
        var editInterfaceBlock = document.createElement( 'div' ),
              headerBlock = document.createElement( 'div' ),
              controlBlock = document.createElement( 'div' ),
              cancelButton = document.createElement( 'a' ),
              cancelIcon = document.createElement( 'img' ),
              acceptButton = document.createElement( 'a' ),
              acceptIcon = document.createElement( 'img' ),
              configurationBlock = this.configurationBlock,
              getConfigurationFunc = this.getConfigurationFunc;
              
        $( headerBlock ).addClass( 'headerBlock' );
        headerBlock.appendChild( showIcon( this ) );
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
            onApply( getConfigurationFunc( configurationBlock ) );
            onClose();
        });
        
        editInterfaceBlock.appendChild( headerBlock );
        editInterfaceBlock.appendChild( configurationBlock );
        editInterfaceBlock.appendChild( controlBlock );
        
        $( editInterfaceBlock ).addClass( 'editInterface' );        
        $( controlBlock ).addClass( 'controlBlock' );   
        
        return editInterfaceBlock;
    }
    
    function showConfiguration( filterOption ) {
        var configurationBlock = document.createElement( 'div' );
        
        configurationBlock.textContent = filterOption.configurationToStringFunc( filterOption.configuration );        
        $( configurationBlock ).addClass( 'configuration' );
        
        return configurationBlock;
    }
    
    function showIcon( filterOption ) {
        var iconBlock = document.createElement( 'img' );
        
        iconBlock.src = filterOption.icon;
        $( iconBlock ).addClass( 'icon' );
        
        return iconBlock;
    }
    
    function showName( filterOption ) {
        var nameBlock = document.createElement( 'div' );
        
        nameBlock.textContent = filterOption.name;
        $( nameBlock ).addClass( 'name' );
        
        return nameBlock;
    }
}