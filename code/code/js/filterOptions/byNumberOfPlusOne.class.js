(function(){
    filterOptionsList.push( new FilterOption( 
        5,
        '/images/plusone.png', 
        getMessage( 'filterByNumberOfPlusOne' ),
        function() {
            var numberOfPlusOneBlock = document.createElement( 'div' ),
				numberOfPlusOneFromLabel = document.createElement( 'label' ),
				numberOfPlusOneFrom = document.createElement( 'input' ),
				numberOfPlusOneToLabel = document.createElement( 'label' ),
				numberOfPlusOneTo = document.createElement( 'input' ),
		        numberOfPlusOnePeriodLabel = document.createElement( 'label' ),
				numberOfPlusOnePeriod = document.createElement( 'select' ),
				numberOfPlusOnePeriodOption1 = document.createElement ( 'option' ),
				numberOfPlusOnePeriodOption2 = document.createElement ( 'option' ),
		        numberOfPlusOnePeriodOption3 = document.createElement ( 'option' ),
				numberOfPlusOnePeriodOption4 = document.createElement ( 'option' ),
		        numberOfPlusOnePeriodOption5 = document.createElement ( 'option' ),
				numberOfPlusOnePeriodOption6 = document.createElement ( 'option' ),
		        numberOfPlusOnePeriodOption7 = document.createElement ( 'option' ),
			
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
            numberOfPlusOneBlock.appendChild( excludeDiv );
            
			numberOfPlusOneFromLabel.textContent = getMessage( 'from' );
			numberOfPlusOneToLabel.textContent = getMessage( 'to' );
			numberOfPlusOnePeriodLabel.textContent = getMessage( 'period' );
			numberOfPlusOnePeriodOption1.textContent = getMessage( 'allTime' );
			numberOfPlusOnePeriodOption2.textContent = getMessage( 'lastDay' );
			numberOfPlusOnePeriodOption3.textContent = getMessage( 'lastWeek' );
			numberOfPlusOnePeriodOption4.textContent = getMessage( 'lastMonth' );
			numberOfPlusOnePeriodOption5.textContent = getMessage( 'last3Month' );
			numberOfPlusOnePeriodOption6.textContent = getMessage( 'last6Month' );
			numberOfPlusOnePeriodOption7.textContent = getMessage( 'lastYear' );						
	    	    
			numberOfPlusOneFrom.type = 'number';
			numberOfPlusOneTo.type = 'number';
			numberOfPlusOnePeriodOption1.value = 'allTime';
			numberOfPlusOnePeriodOption2.value = 'lastDay';
			numberOfPlusOnePeriodOption3.value = 'lastWeek';
			numberOfPlusOnePeriodOption4.value = 'lastMonth';
			numberOfPlusOnePeriodOption5.value = 'last3Month';
			numberOfPlusOnePeriodOption6.value = 'last6Month';
			numberOfPlusOnePeriodOption7.value = 'lastYear';
            
			numberOfPlusOneFrom.name = 'numberOfPlusOneFrom';
			numberOfPlusOneTo.name = 'numberOfPlusOneTo';
			numberOfPlusOnePeriod.name = 'numberOfPlusOnePeriod';
	    
			numberOfPlusOnePeriod.appendChild( numberOfPlusOnePeriodOption1 );
			numberOfPlusOnePeriod.appendChild( numberOfPlusOnePeriodOption2 );
			numberOfPlusOnePeriod.appendChild( numberOfPlusOnePeriodOption3 );
			numberOfPlusOnePeriod.appendChild( numberOfPlusOnePeriodOption4 );
			numberOfPlusOnePeriod.appendChild( numberOfPlusOnePeriodOption5 );
			numberOfPlusOnePeriod.appendChild( numberOfPlusOnePeriodOption6 );
			numberOfPlusOnePeriod.appendChild( numberOfPlusOnePeriodOption7 );	    
            
            numberOfPlusOneBlock.appendChild( numberOfPlusOneFromLabel );
            numberOfPlusOneBlock.appendChild( numberOfPlusOneFrom );
            numberOfPlusOneBlock.appendChild( numberOfPlusOneToLabel );
            numberOfPlusOneBlock.appendChild( numberOfPlusOneTo );
	        numberOfPlusOneBlock.appendChild( numberOfPlusOnePeriodLabel );
	        numberOfPlusOneBlock.appendChild( numberOfPlusOnePeriod );
	                
            return numberOfPlusOneBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};
            
            configuration.exclude = ( configurationBlock.querySelector( '[name=exclude]' ).checked ? true : false );	    
            configuration.numberOfPlusOneFrom = configurationBlock.querySelector( '[name=numberOfPlusOneFrom]' ).value;
            configuration.numberOfPlusOneTo = configurationBlock.querySelector( '[name=numberOfPlusOneTo]' ).value;
	        configuration.numberOfPlusOnePeriod = configurationBlock.querySelector( '[name=numberOfPlusOnePeriod]' ).value;
            
            return configuration;
        },
        function( configuration ) {            
            var string = '';
            
            if ( configuration.numberOfPlusOneFrom ) {
                string += getMessage( 'from' ) + ' ' + configuration.numberOfPlusOneFrom + ' ';   
				if ( configuration.numberOfPlusOneTo ) {
                    string += getMessage( 'to' ) + ' ' + configuration.numberOfPlusOneTo;   
                }	
            }
			else{
				if ( configuration.numberOfPlusOneTo ) {
                    string += getMessage( 'to' ) + ' ' + configuration.numberOfPlusOneTo;   
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
		        if (configuration.numberOfPlusOnePeriod == 'allTime'){
					toAccept = !( ( configuration.numberOfPlusOneFrom && configuration.numberOfPlusOneFrom > user.numberOfPlusOneAllTime )  
					|| ( configuration.numberOfPlusOneTo && configuration.numberOfPlusOneTo < user.numberOfPlusOneAllTime )
					|| user.numberOfPlusOneAllTime == undefined );
				}
				else{
					if (configuration.numberOfPlusOnePeriod == 'lastDay'){
						toAccept = !( ( configuration.numberOfPlusOneFrom && configuration.numberOfPlusOneFrom > user.numberOfPlusOneLastDay )
						|| ( configuration.numberOfPlusOneTo && configuration.numberOfPlusOneTo < user.numberOfPlusOneLastDay )
						|| user.numberOfPlusOneLastDay == undefined );
					}
					else{
						if (configuration.numberOfPlusOnePeriod == 'lastWeek'){
							toAccept = !( ( configuration.numberOfPlusOneFrom && configuration.numberOfPlusOneFrom > user.numberOfPlusOneLastWeek )
						    || ( configuration.numberOfPlusOneTo && configuration.numberOfPlusOneTo < user.numberOfPlusOneLastWeek )
						    || user.numberOfPlusOneLastWeek == undefined );
						}	
						else{
							if (configuration.numberOfPlusOnePeriod == 'lastMonth'){
								toAccept = !( ( configuration.numberOfPlusOneFrom && configuration.numberOfPlusOneFrom > user.numberOfPlusOneLastMonth )
						        || ( configuration.numberOfPlusOneTo && configuration.numberOfPlusOneTo < user.numberOfPlusOneLastMonth )
						        || user.numberOfCommentsLastMonth == undefined );
							}	
							else{
								if (configuration.numberOfPlusOnePeriod == 'last3Month'){
									toAccept = !( ( configuration.numberOfPlusOneFrom && configuration.numberOfPlusOneFrom > user.numberOfPlusOneLast3Month )
						            || ( configuration.numberOfPlusOneTo && configuration.numberOfPlusOneTo < user.numberOfPlusOneLast3Month )
						            || user.numberOfPlusOneLast3Month == undefined );
								}			
								else{
									if (configuration.numberOfPlusOnePeriod == 'last6Month'){
										toAccept = !( ( configuration.numberOfPlusOneFrom && configuration.numberOfPlusOneFrom > user.numberOfPlusOneLast6Month )
						                || ( configuration.numberOfPlusOneTo && configuration.numberOfPlusOneTo < user.numberOfPlusOneLast6Month )
						                || user.numberOfPlusOneLast6Month == undefined );
									}					
									else{
										toAccept = !( ( configuration.numberOfPlusOneFrom && configuration.numberOfPlusOneFrom > user.numberOfPlusOneLastYear )
						                || ( configuration.numberOfPlusOneTo && configuration.numberOfPlusOneTo < user.numberOfPlusOneLastYear )
						                || user.numberOfPlusOneLastYear == undefined );		
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
        ['numberOfPlusOne']
        ) );
})();