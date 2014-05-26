(function(){
    filterOptionsList.push( new FilterOption( 
        '/images/load.png', 
        'Filter by name', 
        function() {
            var testBlock = document.createElement( 'div' ),
                  nameLabel = document.createElement( 'label' ),
                  name = document.createElement( 'input' );
            nameLabel.textContent = 'Name';
            
            name.name = 'name';
            
            testBlock.appendChild( nameLabel );
            testBlock.appendChild( name );
            
            return testBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};
            
            configuration.name = configurationBlock.querySelector('[name=name]').value;
            
            return configuration;
        },
        function( configuration ) {
            var string = configuration.name;
            
            return string;
        },
        function( userId, accept, decline ) {     
            var configuration = this.configuration;
            
            StorageManager.getUserInfo( userId, ['firstName', 'lastName'], function( user ) {
                if ( user.firstName.indexOf( configuration.name ) != -1 ) {
                    accept( userId );
                }
                decline( userId );
            });
        }
        ) );
})();