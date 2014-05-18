(function(){
    filterOptionsList.push( new FilterOption( 
        '/images/plus-btn.png', 
        'FilterOption2',
        function() {
            var testBlock = document.createElement( 'div' ),
                  dateLabel = document.createElement( 'label' ),
                  date = document.createElement( 'input' );
            dateLabel.textContent = 'date';
            
            date.name = 'date';
            date.type = 'date';
            
            testBlock.appendChild( dateLabel );
            testBlock.appendChild( date );
            
            return testBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};
            
            configuration.date = configurationBlock.querySelector('[name=date]').value;
            
            return configuration;
        },
        function( configuration ) {
            var string = configuration.date;
            
            return string;
        }
        ) );
})();