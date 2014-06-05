(function(){
    filterOptionsList.push( new FilterOption( 
        8,
        '/images/sex-icon.png', 
        getMessage( 'filterByCity' ),
        function() {
            var cityBlock = document.createElement( 'div' ),
                  cityLabel = document.createElement( 'label' ),
                  city = document.createElement( 'input' );
           
            cityLabel.textContent = getMessage( 'city' );
                          
            city.name = 'city';
                      
            cityBlock.appendChild( cityLabel );
            cityBlock.appendChild( city );
                  
            return cityBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};
            
            configuration.city = configurationBlock.querySelector( '[name=city]' ).value;
            
            return configuration;
        },
        function( configuration ) {            
            return configuration.city;
        },
        function( userId, accept, decline ) {     
            var configuration = this.configuration,
                  requiredUserFields = this.requiredUserFields;
            
            StorageManager.getUserInfo( userId, requiredUserFields, function( user ) {
                if ( user.city && configuration.city.match( user.city ) ) {
                    accept( userId );                    
                } else {
                    decline( userId );
                }
            });
        },
        ['city']
        ) );
})();