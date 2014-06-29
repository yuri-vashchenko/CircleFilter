(function(){
    filterOptionsList.push( new FilterOption( 
        6,
        '/images/post.png', 
        getMessage( 'filterByNumberOfPosts' ),
        function() {
            var numberOfPostsBlock = document.createElement( 'div' ),
				numberOfPostsFromLabel = document.createElement( 'label' ),
				numberOfPostsFrom = document.createElement( 'input' ),
				numberOfPostsToLabel = document.createElement( 'label' ),
				numberOfPostsTo = document.createElement( 'input' ),
		        numberOfPostsPeriodLabel = document.createElement( 'label' ),
				numberOfPostsPeriod = document.createElement( 'select' ),
				numberOfPostsPeriodOption1 = document.createElement ( 'option' ),
				numberOfPostsPeriodOption2 = document.createElement ( 'option' ),
		        numberOfPostsPeriodOption3 = document.createElement ( 'option' ),
				numberOfPostsPeriodOption4 = document.createElement ( 'option' ),
		        numberOfPostsPeriodOption5 = document.createElement ( 'option' ),
				numberOfPostsPeriodOption6 = document.createElement ( 'option' ),
		        numberOfPostsPeriodOption7 = document.createElement ( 'option' ),
			
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
            numberOfPostsBlock.appendChild( excludeDiv );
            
			numberOfPostsFromLabel.textContent = getMessage( 'from' );
			numberOfPostsToLabel.textContent = getMessage( 'to' );
			numberOfPostsPeriodLabel.textContent = getMessage( 'period' );
			numberOfPostsPeriodOption1.textContent = getMessage( 'allTime' );
			numberOfPostsPeriodOption2.textContent = getMessage( 'lastDay' );
			numberOfPostsPeriodOption3.textContent = getMessage( 'lastWeek' );
			numberOfPostsPeriodOption4.textContent = getMessage( 'lastMonth' );
			numberOfPostsPeriodOption5.textContent = getMessage( 'last3Month' );
			numberOfPostsPeriodOption6.textContent = getMessage( 'last6Month' );
			numberOfPostsPeriodOption7.textContent = getMessage( 'lastYear' );
	    	    
			numberOfPostsFrom.type = 'number';
			numberOfPostsTo.type = 'number';
			numberOfPostsPeriodOption1.value = 'allTime';
			numberOfPostsPeriodOption2.value = 'lastDay';
			numberOfPostsPeriodOption3.value = 'lastWeek';
			numberOfPostsPeriodOption4.value = 'lastMonth';
			numberOfPostsPeriodOption5.value = 'last3Month';
			numberOfPostsPeriodOption6.value = 'last6Month';
			numberOfPostsPeriodOption7.value = 'lastYear';
            
			numberOfPostsFrom.name = 'numberOfPostsFrom';
			numberOfPostsTo.name = 'numberOfPostsTo';
			numberOfPostsPeriod.name = 'numberOfPostsPeriod';
	    
			numberOfPostsPeriod.appendChild( numberOfPostsPeriodOption1 );
			numberOfPostsPeriod.appendChild( numberOfPostsPeriodOption2 );
			numberOfPostsPeriod.appendChild( numberOfPostsPeriodOption3 );
			numberOfPostsPeriod.appendChild( numberOfPostsPeriodOption4 );
			numberOfPostsPeriod.appendChild( numberOfPostsPeriodOption5 );
			numberOfPostsPeriod.appendChild( numberOfPostsPeriodOption6 );
			numberOfPostsPeriod.appendChild( numberOfPostsPeriodOption7 );	    
            
            numberOfPostsBlock.appendChild( numberOfPostsFromLabel );
            numberOfPostsBlock.appendChild( numberOfPostsFrom );
            numberOfPostsBlock.appendChild( numberOfPostsToLabel );
            numberOfPostsBlock.appendChild( numberOfPostsTo );
	        numberOfPostsBlock.appendChild( numberOfPostsPeriodLabel );
			numberOfPostsBlock.appendChild( numberOfPostsPeriod );
	                
            return numberOfPostsBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};
            
            configuration.exclude = ( configurationBlock.querySelector( '[name=exclude]' ).checked ? true : false );	    
            configuration.numberOfPostsFrom = configurationBlock.querySelector( '[name=numberOfPostsFrom]' ).value;
            configuration.numberOfPostsTo = configurationBlock.querySelector( '[name=numberOfPostsTo]' ).value;
	        configuration.numberOfPostsPeriod = configurationBlock.querySelector( '[name=numberOfPostsPeriod]' ).value;
            
            return configuration;
        },
        function( configuration ) {            
            var string = '';
            
            if ( configuration.numberOfPostsFrom ) {
                string += getMessage( 'from' ) + ' ' + configuration.numberOfPostsFrom + ' ';   
				if ( configuration.numberOfPostsTo ) {
                    string += getMessage( 'to' ) + ' ' + configuration.numberOfPostsTo;   
                }	
            }
			else{
				if ( configuration.numberOfPostsTo ) {
                    string += getMessage( 'to' ) + ' ' + configuration.numberOfPostsTo;   
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
            
            StorageManager.getUserInfo( userId, requiredUserFields, function( user ) {
                var toAccept = False;
		        if (configuration.numberOfPostsPeriod == 'allTime'){
					toAccept = !( ( configuration.numberOfPostsFrom && configuration.numberOfPostsFrom > user.numberOfPostsAllTime )  
					|| ( configuration.numberOfPostsTo && configuration.numberOfPostsTo < user.numberOfPostsAllTime )
					|| user.numberOfPostsAllTime == undefined );
				}
				else{
					if (configuration.numberOfPostsPeriod == 'lastDay'){
						toAccept = !( ( configuration.numberOfPostsFrom && configuration.numberOfPostsFrom > user.numberOfPostsLastDay )
						|| ( configuration.numberOfPostsTo && configuration.numberOfPostsTo < user.numberOfPostsLastDay )
						|| user.numberOfPostsLastDay == undefined );
					}
					else{
						if (configuration.numberOfPostsPeriod == 'lastWeek'){
							toAccept = !( ( configuration.numberOfPostsFrom && configuration.numberOfPostsFrom > user.numberOfPostsLastWeek )
						    || ( configuration.numberOfPostsTo && configuration.numberOfPostsTo < user.numberOfPostsLastWeek )
						    || user.numberOfPostsLastWeek == undefined );
						}	
						else{
							if (configuration.numberOfPostsPeriod == 'lastMonth'){
								toAccept = !( ( configuration.numberOfPostsFrom && configuration.numberOfPostsFrom > user.numberOfPostsLastMonth )
						        || ( configuration.numberOfPostsTo && configuration.numberOfPostsTo < user.numberOfPostsLastMonth )
						        || user.numberOfPostsLastMonth == undefined );
							}	
							else{
								if (configuration.numberOfPostsPeriod == 'last3Month'){
									toAccept = !( ( configuration.numberOfPostsFrom && configuration.numberOfPostsFrom > user.numberOfPostsLast3Month )
						            || ( configuration.numberOfPostsTo && configuration.numberOfPostsTo < user.numberOfPostsLast3Month )
						            || user.numberOfPostsLast3Month == undefined );
								}			
								else{
									if (configuration.numberOfPostsPeriod == 'last6Month'){
										toAccept = !( ( configuration.numberOfPostsFrom && configuration.numberOfPostsFrom > user.numberOfPostsLast6Month )
						                || ( configuration.numberOfPostsTo && configuration.numberOfPostsTo < user.numberOfPostsLast6Month )
						                || user.numberOfPostsLast6Month == undefined );
									}					
									else{
										toAccept = !( ( configuration.numberOfPostsFrom && configuration.numberOfPostsFrom > user.numberOfPostsLastYear )
						                || ( configuration.numberOfPostsTo && configuration.numberOfPostsTo < user.numberOfPostsLastYear )
						                || user.numberOfPostsLastYear == undefined );		
									}
								}
							}
						}
					}					
				}	
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
        ['numberOfPosts']
        ) );
})();