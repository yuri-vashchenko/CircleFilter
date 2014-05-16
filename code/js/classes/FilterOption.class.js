function FilterOption( icon, name ) {
    this.icon = icon;
    this.name = name;
    
    this.configuration;
    
    this.show = function() {
        var filterOptionBlock = document.createElement( 'div' );
        
        if ( this.configuration ) {
            filterOptionBlock.appendChild( showConfiguration( this ) ) ;
        } else {
            filterOptionBlock.appendChild( showName( this ) );
        }
        
        return filterOptionBlock;
    }
    
    this.showEditInterface = function() {
        var editInterfaceBlock = document.createElement( 'div' );
        editInterfaceBlock.textContent = name;
        $( editInterfaceBlock ).addClass( 'editInterface' );
        
        return editInterfaceBlock;
    }
    
    function showConfiguration( filterOption ) {
        var configurationBlock = document.createElement( 'div' );
        configurationBlock.textContent = 'configured';
        return configurationBlock;
    }
    
    function showName( filterOption ) {
        var nameBlock = document.createElement( 'div' );
        nameBlock.textContent = filterOption.name;
        return nameBlock;
    }
}