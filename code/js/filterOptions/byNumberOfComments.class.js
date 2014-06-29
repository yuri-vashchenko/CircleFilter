(function(){
    filterOptionsList.push( new FilterOption( 
        4,
        '/images/comment.png', 
        getMessage( 'filterByNumberOfComments' ),
        function() {
            var numberOfCommentsBlock = document.createElement( 'div' ),
		        numberOfCommentsFromLabel = document.createElement( 'label' ),
                numberOfCommentsFrom = document.createElement( 'input' ),
                numberOfCommentsToLabel = document.createElement( 'label' ),
                numberOfCommentsTo = document.createElement( 'input' ),
		        numberOfCommentsPeriodLabel = document.createElement( 'label' ),
                numberOfCommentsPeriod = document.createElement( 'select' ),
                numberOfCommentsPeriodOption1 = document.createElement ( 'option' ),
                numberOfCommentsPeriodOption2 = document.createElement ( 'option' ),
		        numberOfCommentsPeriodOption3 = document.createElement ( 'option' ),
                numberOfCommentsPeriodOption4 = document.createElement ( 'option' ),
		        numberOfCommentsPeriodOption5 = document.createElement ( 'option' ),
                numberOfCommentsPeriodOption6 = document.createElement ( 'option' ),
		        numberOfCommentsPeriodOption7 = document.createElement ( 'option' ),		
		
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
            numberOfCommentsBlock.appendChild( excludeDiv );		
            
            numberOfCommentsFromLabel.textContent = getMessage( 'from' );
            numberOfCommentsToLabel.textContent = getMessage( 'to' );
	        numberOfCommentsPeriodLabel.textContent = getMessage( 'period' );
	        numberOfCommentsPeriodOption1.textContent = getMessage( 'allTime' );
	        numberOfCommentsPeriodOption2.textContent = getMessage( 'lastDay' );
            numberOfCommentsPeriodOption3.textContent = getMessage( 'lastWeek' );
	        numberOfCommentsPeriodOption4.textContent = getMessage( 'lastMonth' );
            numberOfCommentsPeriodOption5.textContent = getMessage( 'last3Month' );
	        numberOfCommentsPeriodOption6.textContent = getMessage( 'last6Month' );
            numberOfCommentsPeriodOption7.textContent = getMessage( 'lastYear' );
	    	    
            numberOfCommentsFrom.type = 'number';
	        numberOfCommentsTo.type = 'number';
	        numberOfCommentsPeriodOption1.value = 'allTime';
	        numberOfCommentsPeriodOption2.value = 'lastDay';
	        numberOfCommentsPeriodOption3.value = 'lastWeek';
	        numberOfCommentsPeriodOption4.value = 'lastMonth';
	        numberOfCommentsPeriodOption5.value = 'last3Month';
	        numberOfCommentsPeriodOption6.value = 'last6Month';
	        numberOfCommentsPeriodOption7.value = 'lastYear';
            
	        numberOfCommentsFrom.name = 'numberOfCommentsFrom';
            numberOfCommentsTo.name = 'numberOfCommentsTo';
	        numberOfCommentsPeriod.name = 'numberOfCommentsPeriod';
	    
	        numberOfCommentsPeriod.appendChild( numberOfCommentsPeriodOption1 );
	        numberOfCommentsPeriod.appendChild( numberOfCommentsPeriodOption2 );
	        numberOfCommentsPeriod.appendChild( numberOfCommentsPeriodOption3 );
	        numberOfCommentsPeriod.appendChild( numberOfCommentsPeriodOption4 );
	        numberOfCommentsPeriod.appendChild( numberOfCommentsPeriodOption5 );
	        numberOfCommentsPeriod.appendChild( numberOfCommentsPeriodOption6 );
	        numberOfCommentsPeriod.appendChild( numberOfCommentsPeriodOption7 );	    
            
            numberOfCommentsBlock.appendChild( numberOfCommentsFromLabel );
            numberOfCommentsBlock.appendChild( numberOfCommentsFrom );
            numberOfCommentsBlock.appendChild( numberOfCommentsToLabel );
            numberOfCommentsBlock.appendChild( numberOfCommentsTo );
	        numberOfCommentsBlock.appendChild( numberOfCommentsPeriodLabel );
	        numberOfCommentsBlock.appendChild( numberOfCommentsPeriod );
	                
            return numberOfCommentsBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};
            
            configuration.exclude = ( configurationBlock.querySelector( '[name=exclude]' ).checked ? true : false );	    
            configuration.numberOfCommentsFrom = configurationBlock.querySelector( '[name=numberOfCommentsFrom]' ).value;
            configuration.numberOfCommentsTo = configurationBlock.querySelector( '[name=numberOfCommentsTo]' ).value;
	        configuration.numberOfCommentsPeriod = configurationBlock.querySelector( '[name=numberOfCommentsPeriod]' ).value;
            
            return configuration;
        },
        function( configuration ) {            
            var string = '';
            
            if ( configuration.numberOfCommentsFrom ) {
                string += getMessage( 'from' ) + ' ' + configuration.numberOfCommentsFrom + ' ';   
				if ( configuration.numberOfCommentsTo ) {
                    string += getMessage( 'to' ) + ' ' + configuration.numberOfCommentsTo;   
                }	
            }
			else{
				if ( configuration.numberOfCommentsTo ) {
                    string += getMessage( 'to' ) + ' ' + configuration.numberOfCommentsTo;   
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
		        if (configuration.numberOfCommentsPeriod == 'allTime'){
					toAccept = !( ( configuration.numberOfCommentsFrom && configuration.numberOfCommentsFrom > user.numberOfCommentsAllTime )  
					|| ( configuration.numberOfCommentsTo && configuration.numberOfCommentsTo < user.numberOfCommentsAllTime )
					|| user.numberOfCommentsAllTime == undefined );
				}
				else{
					if (configuration.numberOfCommentsPeriod == 'lastDay'){
						toAccept = !( ( configuration.numberOfCommentsFrom && configuration.numberOfCommentsFrom > user.numberOfCommentsLastDay )
						|| ( configuration.numberOfCommentsTo && configuration.numberOfCommentsTo < user.numberOfCommentsLastDay )
						|| user.numberOfCommentsLastDay == undefined );
					}
					else{
						if (configuration.numberOfCommentsPeriod == 'lastWeek'){
							toAccept = !( ( configuration.numberOfCommentsFrom && configuration.numberOfCommentsFrom > user.numberOfCommentsLastWeek )
						    || ( configuration.numberOfCommentsTo && configuration.numberOfCommentsTo < user.numberOfCommentsLastWeek )
						    || user.numberOfCommentsLastWeek == undefined );
						}	
						else{
							if (configuration.numberOfCommentsPeriod == 'lastMonth'){
								toAccept = !( ( configuration.numberOfCommentsFrom && configuration.numberOfCommentsFrom > user.numberOfCommentsLastMonth )
						        || ( configuration.numberOfCommentsTo && configuration.numberOfCommentsTo < user.numberOfCommentsLastMonth )
						        || user.numberOfCommentsLastMonth == undefined );
							}	
							else{
								if (configuration.numberOfCommentsPeriod == 'last3Month'){
									toAccept = !( ( configuration.numberOfCommentsFrom && configuration.numberOfCommentsFrom > user.numberOfCommentsLast3Month )
						            || ( configuration.numberOfCommentsTo && configuration.numberOfCommentsTo < user.numberOfCommentsLast3Month )
						            || user.numberOfCommentsLast3Month == undefined );
								}			
								else{
									if (configuration.numberOfCommentsPeriod == 'last6Month'){
										toAccept = !( ( configuration.numberOfCommentsFrom && configuration.numberOfCommentsFrom > user.numberOfCommentsLast6Month )
						                || ( configuration.numberOfCommentsTo && configuration.numberOfCommentsTo < user.numberOfCommentsLast6Month )
						                || user.numberOfCommentsLast6Month == undefined );
									}					
									else{
										toAccept = !( ( configuration.numberOfCommentsFrom && configuration.numberOfCommentsFrom > user.numberOfCommentsLastYear )
						                || ( configuration.numberOfCommentsTo && configuration.numberOfCommentsTo < user.numberOfCommentsLastYear )
						                || user.numberOfCommentsLastYear == undefined );		
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
        ['numberOfComments']
        ) );
})();