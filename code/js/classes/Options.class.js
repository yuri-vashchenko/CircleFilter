var Options = ( function() {
    function showIcon() {
        var iconBlock = document.createElement( 'img' );
        
        iconBlock.src = 'images/config.png';
        $( iconBlock ).addClass( 'icon' );
        
        return iconBlock;
    }
    
    function showName( options ) {
        var nameBlock = document.createElement( 'div' );
        
        nameBlock.textContent = options.name;
        $( nameBlock ).addClass( 'name' );
        
        return nameBlock;
    }
    
    function showContentBlock() {
        var contentBlock = document.createElement( 'div' );
        /* userPerPage */
        var userPerPageBlock  = document.createElement( 'div' ),
            userPerPagelabel  = document.createElement( 'label' ),
            userPerPageSelect = document.createElement( 'select' );
        userPerPagelabel.textContent = getMessage( 'countPeoplePerPage' );
        perPage = ( StorageManager.getUsersPerPage() ? StorageManager.getUsersPerPage() : 20 )
        for ( i = 1; i < 6 ; i++ ){
            var userPerPageOption = document.createElement( 'option' );
            if (perPage == i * 20) 
                userPerPageOption.selected = 'selected';
            userPerPageOption.value = i * 20;
            userPerPageOption.textContent =  i * 20;
            userPerPageSelect.appendChild( userPerPageOption );
        }
        userPerPageBlock.appendChild( userPerPagelabel );
        userPerPageBlock.appendChild( userPerPageSelect );
        contentBlock.appendChild( userPerPageBlock );
        
        /* defaultLoadingResourse  */
        var defaultLoadingResourseBlock = document.createElement( 'div' ),
            headLalel      = document.createElement( 'label' ),
            alwaysAskBlock = document.createElement( 'div' ),
            alwaysAskRadio = document.createElement( 'input' ),
            alwaysAskLabel = document.createElement( 'label' ),
            alwaysAskSpan  = document.createElement( 'span' ),
            alwaysLocalBlock = document.createElement( 'div' ),
            alwaysLocalRadio = document.createElement( 'input' ),
            alwaysLocalLabel = document.createElement( 'label' ),
            alwaysLocalSpan  = document.createElement( 'span' ),
            alwaysLoadingBlock = document.createElement( 'div' ),
            alwaysLoadingRadio = document.createElement( 'input' ),
            alwaysLoadingLabel = document.createElement( 'label' ),
            alwaysLoadingSpan  = document.createElement( 'span' );
        
        headLalel.textContent = getMessage( 'defaultLoadingResourse' );
        
        defaultLoadingResourseBlock.appendChild( headLalel );
        
        alwaysAskRadio.name = 'defaultLoadingResourse';
        alwaysAskRadio.type = 'radio';
        alwaysAskSpan.textContent = getMessage( 'alwaysAsk' );
        
        alwaysAskLabel.appendChild( alwaysAskRadio );
        alwaysAskLabel.appendChild( alwaysAskSpan );
        alwaysAskBlock.appendChild( alwaysAskLabel );
        defaultLoadingResourseBlock.appendChild( alwaysAskBlock );
        
        alwaysLocalRadio.name = 'defaultLoadingResourse';
        alwaysLocalRadio.type = 'radio';
        alwaysLocalSpan.textContent = getMessage( 'alwaysLocal' );
        
        alwaysLocalLabel.appendChild( alwaysLocalRadio );
        alwaysLocalLabel.appendChild( alwaysLocalSpan );
        alwaysLocalBlock.appendChild( alwaysLocalLabel );
        defaultLoadingResourseBlock.appendChild( alwaysLocalBlock );
        
        alwaysLoadingRadio.name = 'defaultLoadingResourse';
        alwaysLoadingRadio.type = 'radio';
        alwaysLoadingSpan.textContent = getMessage( 'alwaysLoading' );
        
        alwaysLoadingLabel.appendChild( alwaysLoadingRadio );
        alwaysLoadingLabel.appendChild( alwaysLoadingSpan );
        alwaysLoadingBlock.appendChild( alwaysLoadingLabel );
        defaultLoadingResourseBlock.appendChild( alwaysLoadingBlock );
        
        contentBlock.appendChild( defaultLoadingResourseBlock );
        
        /* block local storage size */
        
        var storageBlock = document.createElement( 'div' ),
            pieCharFullStorage = document.createElement( 'div' ),
            pieCharStorage = document.createElement( 'div' ), 
            storageTitleSize    = document.createElement( 'label' ),
            storageSize         = document.createElement( 'label' ),
            buttonStorageClear  = document.createElement( 'button' );
        
        storageTitleSize.textContent   = getMessage( 'storageSize' );
        storageSize.textContent        = StorageManager.getStorageSize();
        buttonStorageClear.textContent = getMessage( 'storageClear' );
        storageBlock.style.display = 'inline';
        pieCharFullStorage.id = 'pieCharFullStorage';
        pieCharStorage.id = 'pieCharStorage';
        storageBlock.appendChild( storageTitleSize );
        storageBlock.appendChild( storageSize );
        storageBlock.appendChild( buttonStorageClear );
        
        pieCharStorage.style.width = "250px";
        pieCharStorage.style.height= "250px";
        
        pieCharFullStorage.style.width = "250px";
        pieCharFullStorage.style.height= "250px";
        storageBlock.appendChild( pieCharFullStorage );
        storageBlock.appendChild( pieCharStorage );
        
        contentBlock.appendChild( storageBlock );
        return contentBlock;
    }
    
    return {
        name: getMessage( 'config' ),
        
        show: function( onClose ) {
            var optionsBlock = document.createElement( 'div' ),
                headerBlock = document.createElement( 'div' ),
                controlBlock = document.createElement( 'div' ),
                cancelButton = showCancelButton(),
                cancelIcon = document.createElement( 'img' ),
                acceptButton = showAcceptButton( getMessage( 'Apply' ) );
                  
              
            $( headerBlock ).addClass( 'headerBlock' );
            headerBlock.appendChild( showIcon() );
            headerBlock.appendChild( showName( this ) );

            controlBlock.appendChild( cancelButton );        
            $( cancelButton ).addClass( 'but-icon' );   
            
            cancelButton.addEventListener( 'click', onClose );

            controlBlock.appendChild( acceptButton );
            
            $( acceptButton ).addClass( 'but-icon' );   
            
            acceptButton.addEventListener( 'click', function() {
                /* paste your apply Options code here */
                
                onClose();
            });
            
            optionsBlock.appendChild( headerBlock );
            optionsBlock.appendChild( showContentBlock()  );
            optionsBlock.appendChild( controlBlock );
            
            $( optionsBlock ).addClass( 'optionsBlock' );        
            $( controlBlock ).addClass( 'controlBlock' );   
             
            return optionsBlock;
        }
    }
})();