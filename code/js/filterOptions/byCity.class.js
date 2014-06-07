(function(){
    filterOptionsList.push( new FilterOption( 
        8,
        '/images/habitation.png', 
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
            
            configuration.city = configurationBlock.querySelector( '[name=city]' ).value.trim();
            
            if ( configuration.city == "" ) {
                return false;
            }
            
            return configuration;
        },
        function( configuration ) {            
            return configuration.city;
        },
        function( userId, accept, decline ) {     
            var configuration = this.configuration,
                  requiredUserFields = this.requiredUserFields;
            
            StorageManager.getUserInfo( userId, requiredUserFields, function( user ) {
                var translit = transliterate( configuration.city ).toLowerCase(),
                      city = ( user.city ? user.city.toLowerCase() : "" );
                      
                if ( city.indexOf( configuration.city.toLowerCase() ) >= 0 || city.indexOf( translit ) >= 0 ) {
                    accept( userId );                    
                } else {
                    decline( userId );
                }
            });
        },
        ['city']
        ) );
})();