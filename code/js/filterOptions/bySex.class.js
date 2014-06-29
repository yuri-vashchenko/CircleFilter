(function(){
    filterOptionsList.push( new FilterOption( 
        1,
        '/images/sex.png', 
        getMessage( 'filterBySex' ),
        function() {
            var sexBlock = document.createElement( 'div' ),
                sexLabel = document.createElement( 'label' ),
                sex = document.createElement( 'select' ),
                sexOptionM = document.createElement ( 'option' ),
                sexOptionF = document.createElement ( 'option' ),
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
            sexBlock.appendChild( excludeDiv );
           
            sexLabel.textContent = getMessage( 'sex' );
            sexOptionM.textContent = getMessage( 'male' );
            sexOptionF.textContent = getMessage( 'female' );
            
            sex.name = 'sex';
            sexOptionM.value = 'male';
            sexOptionF.value = 'female';
            
            sex.appendChild( sexOptionM );
            sex.appendChild( sexOptionF );
            
            sexBlock.appendChild( sexLabel );
            sexBlock.appendChild( sex );
                  
            return sexBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};
            
            configuration.exclude = ( configurationBlock.querySelector( '[name=exclude]' ).checked ? true : false );
            configuration.sex = configurationBlock.querySelector( '[name=sex]' ).value;
            
            return configuration;
        },
        function( configuration ) {            
            return ( configuration.exclude ? getMessage( 'exclude' ) + ' ' : '' ) + getMessage( configuration.sex );
        },
        function( userId, accept, decline ) {     
            var configuration = this.configuration,
		requiredUserFields = this.requiredUserFields;
            
            StorageManager.getUserInfo( userId, requiredUserFields, function( user ) {
                var toAccept = configuration.sex == user.sex;
                
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
        ['sex']
        ) );
})();