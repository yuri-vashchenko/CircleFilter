function Options(){
	function showEditInterface ( onClose, onApply ) {
		var editInterfaceBlock = document.createElement( 'div' ),
			  headerBlock = document.createElement( 'div' ),
			  controlBlock = document.createElement( 'div' ),
			  cancelButton = document.createElement( 'a' ),
			  cancelIcon = document.createElement( 'img' ),
			  acceptButton = document.createElement( 'a' ),
			  acceptIcon = document.createElement( 'img' ),
			  configurationBlock = this.configurationBlock,
			  getConfigurationFunc = this.getConfigurationFunc;
			  
		$( headerBlock ).addClass( 'headerBlock' );
		headerBlock.appendChild( showIcon( this ) );
		headerBlock.appendChild( showName( this ) );
		
		cancelIcon.src = 'images/cross-btn.png';
		cancelButton.appendChild( cancelIcon );
		controlBlock.appendChild( cancelButton );        
		$( cancelButton ).addClass( 'but-icon' );   
		
		cancelButton.addEventListener( 'click', onClose );
		
		acceptIcon.src = 'images/plus-btn.png';
		acceptButton.appendChild( acceptIcon );
		controlBlock.appendChild( acceptButton );        
		$( acceptButton ).addClass( 'but-icon' );   
		
		acceptButton.addEventListener( 'click', function() {
			var configuration = getConfigurationFunc( configurationBlock );
			
			if ( configuration ) {
				onApply( getConfigurationFunc( configurationBlock ) );
				onClose();
			} else {
				/* paste your errorShow code here */
			}
		});
		
		editInterfaceBlock.appendChild( headerBlock );
		editInterfaceBlock.appendChild( configurationBlock );
		editInterfaceBlock.appendChild( controlBlock );
		
		$( editInterfaceBlock ).addClass( 'editInterface' );        
		$( controlBlock ).addClass( 'controlBlock' );   
		
		return editInterfaceBlock;
	}
}    
(function(){
     document.getElementById('config').addEventListener( 'click', function( e ) {
            alert('hey im work');
			editInterfaceBlock = showEditInterface( 
                                    function() {
                                        addIcon.src = 'images/plus-btn.png';
                                        $.modal.close();
                                    },
                                    function( configuration ) {
                                        var configuredFilterOption = new FilterOption(
                                                filterOptionsList[index].icon, 
                                                filterOptionsList[index].name, 
                                                filterOptionsList[index].configurationBlock, 
                                                filterOptionsList[index].getConfigurationFunc, 
                                                filterOptionsList[index].configurationToStringFunc, 
                                                filterOptionsList[index].applyFunc,
                                                filterOptionsList[index].requiredUserFields,
                                                configuration 
                                              ),
                                              filterOptionBlock = showAddFilterOptionBlock( configuredFilterOption.show(), filterSet );
                                              
                                        filterSet.filterSetBlock.insertBefore( filterOptionBlock, filterSet.addBlock );  
                                        filterSet.filterOptionList.push( configuredFilterOption );
                                    }
                                );
			
			$.modal( $( editInterfaceBlock ), { 	
				overlayClose : true, 
				position : [$( filterSet.addBlock ).offset().top + $( filterSet.addBlock ).outerHeight() - 1 - $( document ).scrollTop(), $( filterSet.addBlock ).offset().left],
				onOpen: function ( dialog ) {
					dialog.overlay.fadeIn( 'fast' );
					dialog.container.slideDown( 'fast' );
					dialog.data.slideDown();	 
				},
				onClose: function ( dialog ) {
					dialog.data.slideUp( 'fast', function () {
						dialog.container.slideUp( 'fast', function () {
							dialog.overlay.fadeOut( 'fast' );
							addIcon.src = 'images/plus-btn.png';
							$.modal.close();
						});
					});
				}
			});
        
});})();