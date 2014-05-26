(function(){
    filterOptionsList.push( new FilterOption( 
        '/images/plus-btn.png', 
        getMessage( 'filterByAge' ),
        function() {
            var ageBlock = document.createElement( 'div' ),
                  ageFromLabel = document.createElement( 'label' ),
                  ageFrom = document.createElement( 'input' ),
                  ageToLabel = document.createElement( 'label' ),
                  ageTo = document.createElement( 'input' );
            
            ageFromLabel.textContent = getMessage( 'from' );
            ageToLabel.textContent = getMessage( 'to' );
            
            ageFrom.type = 'number';
            ageTo.type = 'number';
            
            ageFrom.name = 'ageFrom';
            ageTo.name = 'ageTo';
            
            ageBlock.appendChild( ageFromLabel );
            ageBlock.appendChild( ageFrom );
            ageBlock.appendChild( ageToLabel );
            ageBlock.appendChild( ageTo );
            
            return ageBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};
            
            configuration.ageFrom = configurationBlock.querySelector( '[name=ageFrom]' ).value;
            configuration.ageTo = configurationBlock.querySelector( '[name=ageTo]' ).value;
            
            return configuration;
        },
        function( configuration ) {            
            var string = '';
            
            if ( configuration.ageFrom ) {
                string += getMessage( 'from' ) + ' ' + configuration.ageFrom + ' ';   
            }
            
            if ( configuration.ageTo ) {
                string += getMessage( 'to' ) + ' ' + configuration.ageTo;   
            }
            
            if ( string == '' ) {
                string = getMessage( 'anyAge' );   
            }
            
            return string;
        },
        function( userId, accept, decline ) {     
            var configuration = this.configuration;
            
            StorageManager.getUserInfo( userId, ['age'], function( user ) {
                if ( ( configuration.ageFrom && configuration.ageFrom > user.age )  
                   || ( configuration.ageTo && configuration.ageTo < user.age )
                   || user.age == undefined ) {
                    
                    decline( userId );                    
                } else {
                    accept( userId );
                }
            });
        }        
        ) );
})();