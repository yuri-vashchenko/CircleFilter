function FilterOption( icon, name ) {
    this.icon = icon;
    this.name = name;
    
    this.configuration;
    
    this.show = function() {
        var filterOptionBlock = document.createElement( 'div' );
        
        if ( this.configuration ) {
            filterOptionBlock.appendChild( showConfiguration( this ) ) ;
        } else {
            filterOptionBlock.appendChild( showIcon( this ) );
            filterOptionBlock.appendChild( showName( this ) );
        }
        
        return filterOptionBlock;
    }
    
    this.showEditInterface = function() {
        var editInterfaceBlock = document.createElement( 'div' );
        editInterfaceBlock.textContent = 'editable ' + name;
        $( editInterfaceBlock ).addClass( 'editInterface' );
        
        return editInterfaceBlock;
    }
    
    function showConfiguration( filterOption ) {
        var configurationBlock = document.createElement( 'div' );
        
        configurationBlock.textContent = 'configured';
        
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