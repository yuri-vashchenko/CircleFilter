(function(){
    filterOptionsList.push( new FilterOption( 
        '/images/plus-btn.png', 
        getMessage( 'filterBySex' ),
        function() {
            var sexBlock = document.createElement( 'div' ),
                  sexLabel = document.createElement( 'label' ),
                  sex = document.createElement( 'select' ),
                  sexOptionM = document.createElement ( 'option' ),
                  sexOptionF = document.createElement ( 'option' );
           
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
            
            configuration.sex = configurationBlock.querySelector( '[name=sex]' ).value;
            
            return configuration;
        },
        function( configuration ) {            
            return getMessage( configuration.sex );
        },
        function( userId, accept, decline ) {     
            var configuration = this.configuration,
                  requiredUserFields = this.requiredUserFields;
            
            StorageManager.getUserInfo( userId, requiredUserFields, function( user ) {
                if ( configuration.sex == user.sex ) {
                    accept( userId );                    
                } else {
                    decline( userId );
                }
            });
        },
        ['sex']
        ) );
})();