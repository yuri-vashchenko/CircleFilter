(function(){
    filterOptionsList.push( new FilterOption( 
        '/images/plus-btn.png', 
        'Filter by id',
        function() {
            var testBlock = document.createElement( 'div' ),
                  idLabel = document.createElement( 'label' ),
                  id = document.createElement( 'input' );
            idLabel.textContent = 'Id';
            
            id.name = 'id';
            
            testBlock.appendChild( idLabel );
            testBlock.appendChild( id );
            
            return testBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};
            
            configuration.id = configurationBlock.querySelector('[name=id]').value;
            
            return configuration;
        },
        function( configuration ) {
            var string = configuration.id;
            
            return string;
        },
        function( userId, accept, decline ) {     
            
            if ( this.configuration.id == userId ) {
                accept( userId );
            }
            
            decline( userId );
        }
        ) );
})();