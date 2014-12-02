(function(){
    filterOptionsList.push( new FilterOption(
        8,
        '/images/activity.png',
        getMessage( 'filterByLastActivity' ),
        function() {
            var lastActivityBlock     = document.createElement( 'div' ),
				lastActivityFromLabel = document.createElement( 'label' ),
                lastActivityFrom      = document.createElement( 'input' ),
				lastActivityToLabel   = document.createElement( 'label' ),
                lastActivityTo        = document.createElement( 'input' ),
                
			    excludeDiv      = document.createElement( 'div' ),
                excludeCheckBox = document.createElement( 'input' ),
                excludeLabel    = document.createElement( 'label' ),
                excludeSpan     = document.createElement( 'span' );
            
            excludeCheckBox.type = 'checkbox';
            excludeCheckBox.name = 'exclude';
            
            excludeSpan.textContent = getMessage( 'exclude' );
            
            excludeLabel.appendChild( excludeCheckBox );
            excludeLabel.appendChild( excludeSpan );
            
            excludeDiv.appendChild( excludeLabel );
            lastActivityBlock.appendChild( excludeDiv );
            
            lastActivityFromLabel.textContent = getMessage( 'from' );
			lastActivityToLabel.textContent = getMessage( 'to' );
            
            lastActivityFrom.type = 'number';
			lastActivityTo.type = 'number';
            
            lastActivityFrom.name = 'lastActivityFrom';
			lastActivityTo.name = 'lastActivityTo';
            
            lastActivityBlock.appendChild( lastActivityFromLabel );
            lastActivityBlock.appendChild( lastActivityFrom );
            lastActivityBlock.appendChild( lastActivityToLabel );
            lastActivityBlock.appendChild( lastActivityTo );
            
            return lastActivityBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};
            
            configuration.exclude = ( configurationBlock.querySelector( '[name=exclude]' ).checked ? true : false );
            configuration.lastActivityFrom = configurationBlock.querySelector( '[name=lastActivityFrom]' ).value;
            configuration.lastActivityTo = configurationBlock.querySelector( '[name=lastActivityTo]' ).value;
            
            return configuration;
        },
        function( configuration ) {
            var string = '';
            
            if ( configuration.lastActivityFrom ) {
                string += getMessage( 'from' ) + ' ' + configuration.lastActivityFrom + ' ';
				if ( configuration.lastActivityTo ) {
                    string += getMessage( 'to' ) + ' ' + configuration.lastActivityTo;
                }
            }
			else{
				if ( configuration.lastActivityTo ) {
                    string += getMessage( 'to' ) + ' ' + configuration.lastActivityTo;
                }
				else{
					string = getMessage( 'anyNumber' );
				}
			}
			
            return ( configuration.exclude ? getMessage( 'exclude' ) + ' ' : '' ) + string;
        },
        function( userId, accept, decline ) {
            var configuration = this.configuration,
                requiredUserFields = this.requiredUserFields;
            
            StorageManager.getActivityInfo( userId, requiredUserFields, function( user ) {
                var toAccept = false; 
                
                toAccept = user.lastActivityDate &&
                            getDatesDiff( user.lastActivityDate, getCurrentDate( 'CLASSIC' ), 'days' ) > configuration.lastActivityFrom  &&
                            getDatesDiff( user.lastActivityDate, getCurrentDate( 'CLASSIC' ), 'days' ) < configuration.lastActivityTo;
                
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
        ['lastActivityDate']
        ) );
})();