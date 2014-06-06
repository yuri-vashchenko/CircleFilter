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
                var translit = transliterate( configuration.city );
                if ( user.city && ( user.city.indexOf( configuration.city ) >= 0 || translit.indexOf( configuration.city ) >= 0 ) ) {
                    accept( userId );                    
                } else {
                    decline( userId );
                }
            });
        },
        ['city']
        ) );
})();