(function(){
    filterOptionsList.push( new FilterOption( 
        '/images/export.png', 
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
            var configuration = this.configuration,
                  requiredUserFields = this.requiredUserFields;
            
            StorageManager.getUserInfo( userId, requiredUserFields, function( user ) {
                if ( user.firstName.indexOf( configuration.name ) != -1 ) {
                    accept( userId );
                } else {
                    decline( userId );
                }
            });
        },
        ['firstName', 'lastName']
        ) );
})();