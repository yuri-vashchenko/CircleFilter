(function(){
    filterOptionsList.push( new FilterOption( 
        7,
        '/images/reshare.png', 
        getMessage( 'filterByNumberOfReposts' ),
        function() {
            var numberOfRepostsBlock = document.createElement( 'div' ),
				numberOfRepostsFromLabel = document.createElement( 'label' ),
				numberOfRepostsFrom = document.createElement( 'input' ),
				numberOfRepostsToLabel = document.createElement( 'label' ),
				numberOfRepostsTo = document.createElement( 'input' ),
				numberOfRepostsPeriodLabel = document.createElement( 'label' ),
				numberOfRepostsPeriod = document.createElement( 'select' ),
				numberOfRepostsPeriodOption1 = document.createElement ( 'option' ),
				numberOfRepostsPeriodOption2 = document.createElement ( 'option' ),
		        numberOfRepostsPeriodOption3 = document.createElement ( 'option' ),
				numberOfRepostsPeriodOption4 = document.createElement ( 'option' ),
		        numberOfRepostsPeriodOption5 = document.createElement ( 'option' ),
				numberOfRepostsPeriodOption6 = document.createElement ( 'option' ),
		        numberOfRepostsPeriodOption7 = document.createElement ( 'option' ),
			
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
            numberOfRepostsBlock.appendChild( excludeDiv );
            
			numberOfRepostsFromLabel.textContent = getMessage( 'from' );
		    numberOfRepostsToLabel.textContent = getMessage( 'to' );
			numberOfRepostsPeriodLabel.textContent = getMessage( 'period' );
			numberOfRepostsPeriodOption1.textContent = getMessage( 'allTime' );
			numberOfRepostsPeriodOption2.textContent = getMessage( 'lastDay' );
		    numberOfRepostsPeriodOption3.textContent = getMessage( 'lastWeek' );
			numberOfRepostsPeriodOption4.textContent = getMessage( 'lastMonth' );
			numberOfRepostsPeriodOption5.textContent = getMessage( 'last3Month' );
			numberOfRepostsPeriodOption6.textContent = getMessage( 'last6Month' );
			numberOfRepostsPeriodOption7.textContent = getMessage( 'lastYear' );
	    	    
			numberOfRepostsFrom.type = 'number';
			numberOfRepostsTo.type = 'number';
			numberOfRepostsPeriodOption1.value = 'allTime';
			numberOfRepostsPeriodOption2.value = 'lastDay';
			numberOfRepostsPeriodOption3.value = 'lastWeek';
			numberOfRepostsPeriodOption4.value = 'lastMonth';
			numberOfRepostsPeriodOption5.value = 'last3Month';
			numberOfRepostsPeriodOption6.value = 'last6Month';
			numberOfRepostsPeriodOption7.value = 'lastYear';
            
			numberOfRepostsFrom.name = 'numberOfRepostsFrom';
			numberOfRepostsTo.name = 'numberOfRepostsTo';
			numberOfRepostsPeriod.name = 'numberOfRepostsPeriod';
	    
			numberOfRepostsPeriod.appendChild( numberOfRepostsPeriodOption1 );
			numberOfRepostsPeriod.appendChild( numberOfRepostsPeriodOption2 );
			numberOfRepostsPeriod.appendChild( numberOfRepostsPeriodOption3 );
			numberOfRepostsPeriod.appendChild( numberOfRepostsPeriodOption4 );
			numberOfRepostsPeriod.appendChild( numberOfRepostsPeriodOption5 );
			numberOfRepostsPeriod.appendChild( numberOfRepostsPeriodOption6 );
			numberOfRepostsPeriod.appendChild( numberOfRepostsPeriodOption7 );	    
            
            numberOfRepostsBlock.appendChild( numberOfRepostsFromLabel );
            numberOfRepostsBlock.appendChild( numberOfRepostsFrom );
            numberOfRepostsBlock.appendChild( numberOfRepostsToLabel );
            numberOfRepostsBlock.appendChild( numberOfRepostsTo );
	        numberOfRepostsBlock.appendChild( numberOfRepostsPeriodLabel );
	        numberOfRepostsBlock.appendChild( numberOfRepostsPeriod );
	                
            return numberOfRepostsBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};
            
            configuration.exclude = ( configurationBlock.querySelector( '[name=exclude]' ).checked ? true : false );	    
            configuration.numberOfRepostsFrom = configurationBlock.querySelector( '[name=numberOfRepostsFrom]' ).value;
            configuration.numberOfRepostsTo = configurationBlock.querySelector( '[name=numberOfRepostsTo]' ).value;
	        configuration.numberOfRepostsPeriod = configurationBlock.querySelector( '[name=numberOfRepostsPeriod]' ).value;
            
            return configuration;
        },
        function( configuration ) {            
            var string = '';
            
            if ( configuration.numberOfRepostsFrom ) {
                string += getMessage( 'from' ) + ' ' + configuration.numberOfRepostsFrom + ' ';   
				if ( configuration.numberOfRepostsTo ) {
                    string += getMessage( 'to' ) + ' ' + configuration.numberOfRepostsTo;   
                }	
            }
			else{
				if ( configuration.numberOfRepostsTo ) {
                    string += getMessage( 'to' ) + ' ' + configuration.numberOfRepostsTo;   
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
		        if (configuration.numberOfRepostsPeriod == 'allTime'){
					toAccept = !( ( configuration.numberOfRepostsFrom && configuration.numberOfRepostsFrom > user.numberOfRepostsAllTime )  
					|| ( configuration.numberOfRepostsTo && configuration.numberOfRepostsTo < user.numberOfRepostsAllTime )
					|| user.numberOfRepostsAllTime == undefined );
				}
				else{
					if (configuration.numberOfRepostsPeriod == 'lastDay'){
						toAccept = !( ( configuration.numberOfRepostsFrom && configuration.numberOfRepostsFrom > user.numberOfRepostsLastDay )
						|| ( configuration.numberOfRepostsTo && configuration.numberOfRepostsTo < user.numberOfRepostsLastDay )
						|| user.numberOfRepostsLastDay == undefined );
					}
					else{
						if (configuration.numberOfRepostsPeriod == 'lastWeek'){
							toAccept = !( ( configuration.numberOfRepostsFrom && configuration.numberOfRepostsFrom > user.numberOfRepostsLastWeek )
						    || ( configuration.numberOfRepostsTo && configuration.numberOfRepostsTo < user.numberOfRepostsLastWeek )
						    || user.numberOfRepostsLastWeek == undefined );
						}	
						else{
							if (configuration.numberOfRepostsPeriod == 'lastMonth'){
								toAccept = !( ( configuration.numberOfRepostsFrom && configuration.numberOfRepostsFrom > user.numberOfRepostsLastMonth )
						        || ( configuration.numberOfRepostsTo && configuration.numberOfRepostsTo < user.numberOfRepostsLastMonth )
						        || user.numberOfPostsLastMonth == undefined );
							}	
							else{
								if (configuration.numberOfRepostsPeriod == 'last3Month'){
									toAccept = !( ( configuration.numberOfRepostsFrom && configuration.numberOfRepostsFrom > user.numberOfRepostsLast3Month )
						            || ( configuration.numberOfRepostsTo && configuration.numberOfRepostsTo < user.numberOfRepostsLast3Month )
						            || user.numberOfPostsLast3Month == undefined );
								}			
								else{
									if (configuration.numberOfPostsPeriod == 'last6Month'){
										toAccept = !( ( configuration.numberOfRepostsFrom && configuration.numberOfRepostsFrom > user.numberOfRepostsLast6Month )
						                || ( configuration.numberOfPostsTo && configuration.numberOfPostsTo < user.numberOfPostsLast6Month )
						                || user.numberOfPostsLast6Month == undefined );
									}					
									else{
										toAccept = !( ( configuration.numberOfRepostsFrom && configuration.numberOfRepostsFrom > user.numberOfRepostsLastYear )
						                || ( configuration.numberOfRepostsTo && configuration.numberOfRepostsTo < user.numberOfRepostsLastYear )
						                || user.numberOfRepostsLastYear == undefined );		
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
        ['numberOfReposts']
        ) );
})();