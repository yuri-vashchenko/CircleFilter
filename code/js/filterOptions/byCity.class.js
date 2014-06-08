(function(){
    filterOptionsList.push( new FilterOption( 
        8,
        '/images/habitation.png', 
        getMessage( 'filterByCity' ),
        function() {
            var cityBlock = document.createElement( 'div' ),
                cityLabel = document.createElement( 'label' ),
                city = document.createElement( 'input' ),
                excludeDiv = document.createElement( 'div' ),
                excludeCheckBox = document.createElement( 'input' ),
                excludeLabel = document.createElement( 'label' ),
                excludeSpan = document.createElement( 'span' );
            
            excludeCheckBox.type = 'checkbox';
            excludeCheckBox.name = 'exclude';
            
            excludeSpan.textContent = getMessage( 'exclude' );
            
            excludeLabel.appendChild( excludeCheckBox );  
            excludeLabel.appendChild( excludeSpan );
            
            excludeDiv.appendChild( excludeLabel );
            cityBlock.appendChild( excludeDiv );
           
            cityLabel.textContent = getMessage( 'city' );
                          
            city.name = 'city';
                      
            cityBlock.appendChild( cityLabel );
            cityBlock.appendChild( city );
                  
            return cityBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};
            
            configuration.exclude = ( configurationBlock.querySelector( '[name=exclude]' ).checked ? true : false );
            configuration.city = configurationBlock.querySelector( '[name=city]' ).value.trim();
            
            if ( configuration.city == "" ) {
                return false;
            }
            
            return configuration;
        },
        function( configuration ) {            
            return ( configuration.exclude ? getMessage( 'exclude' ) + ' ' : '' ) + configuration.city;
        },
        function( userId, accept, decline ) {     
            var configuration = this.configuration,
                  requiredUserFields = this.requiredUserFields;
            
            StorageManager.getUserInfo( userId, requiredUserFields, function( user ) {
                var translit = transliterate( configuration.city ).toLowerCase(),
                    city = ( user.city ? user.city.toLowerCase() : "" ),
                    toAccept = ( city.indexOf( configuration.city.toLowerCase() ) >= 0 || city.indexOf( translit ) >= 0 );
                
                if ( configuration.exclude ) {
                    toAccept = !toAccept;
                }
                
                if ( toAccept ) {
                    accept( userId );                    
                } else {
                    decline( userId );
                }
            });
        },
        ['city']
        ) );
})();