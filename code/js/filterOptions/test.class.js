(function(){
    filterOptionsList.push( new FilterOption( 
        '/images/load.png', 
        'FilterOption1', 
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
        }
        ) );
})();