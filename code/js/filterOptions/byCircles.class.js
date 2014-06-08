(function(){
    filterOptionsList.push( new FilterOption( 
        10,
        '/images/circles.png', 
        getMessage( 'filterByCircles' ),
        function() {
            var circlesBlock = document.createElement( 'div' ),
                excludeDiv = document.createElement( 'div' ),
                excludeCheckBox = document.createElement( 'input' ),
                excludeLabel = document.createElement( 'label' ),
                excludeSpan = document.createElement( 'span' ),
                helpText = document.createElement( 'div' );
            
            excludeCheckBox.type = 'checkbox';
            excludeCheckBox.name = 'exclude';
            
            excludeSpan.textContent = getMessage( 'exclude' );
            
            excludeLabel.appendChild( excludeCheckBox );  
            excludeLabel.appendChild( excludeSpan );
            
            excludeDiv.appendChild( excludeLabel );
            circlesBlock.appendChild( excludeDiv );
            
            helpText.textContent = getMessage( 'circlesHelpText' ); 
            circlesBlock.appendChild( helpText );
            
            StorageManager.getCirclesList( function( circlesList ) {
              for ( var i = 0; i < circlesList.length; i++ ) {
                  var circleBlock = document.createElement( 'div' ),
                        checkBox = document.createElement( 'input' ),
                        label = document.createElement( 'label' ),
                        nameSpan = document.createElement( 'span' );
                  
                  checkBox.type = 'checkbox';
                  checkBox.value = circlesList[i].id;    
                  
                  nameSpan.textContent = circlesList[i].name;
                  nameSpan.title = circlesList[i].description;
                  
                  label.appendChild( checkBox );  
                  label.appendChild( nameSpan );
                    
                  circleBlock.appendChild( label );
                  
                  circlesBlock.appendChild( circleBlock );
              }
            }, true );
                   
            return circlesBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};
            
            configuration.exclude = ( configurationBlock.querySelector( '[name=exclude]' ).checked ? true : false );
            
            configuration.circles = [];
            
            for ( var i = 0; i < configurationBlock.children.length; i++ ) {
                var checkBox = configurationBlock.children[i].querySelector( 'input' );
                
                if ( checkBox.checked ) {
                    configuration.circles.push( {
                        name: checkBox.parentElement.querySelector( 'span' ).textContent,
                        id: checkBox.value
                    });
                }
            }
            
            if ( configuration.circles.length == 0 ) {
                return false;
            }
            
            return configuration;
        },
        function( configuration ) { 
            var string = '';
            
            for ( var i = 0; i < configuration.circles.length; i++ ) {
                string += configuration.circles[i].name + ( i != configuration.circles.length - 1 ? ', ' : '' );
            }
            
            return ( configuration.exclude ? getMessage( 'exclude' ) + ' ' : '' ) + string;
        },
        function( userId, accept, decline ) {     
            var configuration = this.configuration,
                requiredUserFields = this.requiredUserFields;
            
            StorageManager.getUserInfo( userId, requiredUserFields, function( user ) {
                var inAllCircles = true;
                
                for ( var i = 0; i < configuration.circles.length; i++ ) {
                    var inCircle = false;
                    
                    for ( var j = 0; j < user.circles.length; j++ ) {
                        if ( configuration.circles[i].id == user.circles[j] ) {
                            inCircle = true;
                            break;
                        }
                    }
                    
                    if ( !inCircle ) {
                        inAllCircles = false;
                        break;
                    }
                }
                
                if ( configuration.exclude ) {
                    inAllCircles = !inAllCircles;
                }
                
                if ( inAllCircles ) {
                    accept( userId );                    
                } else {
                    decline( userId );
                }
            });
        },
        ['circles']
        ) );
})();