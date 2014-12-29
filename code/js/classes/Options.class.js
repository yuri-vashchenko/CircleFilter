var Options = ( function() {
    var defaultLoadingResourse = 'defaultLoadingResourse',
          userPerPageSelect;
    
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
    
    function showContentBlock( onClose ) {
        var contentBlock = document.createElement( 'div' );
        $( contentBlock ).addClass( 'contentBlock' );
        
        /* userPerPage */
        var userPerPageBlock = document.createElement( 'div' ),
              userPerPageLabel = document.createElement( 'label' );
        
        userPerPageSelect = document.createElement( 'select' );
        
        userPerPageLabel.textContent = getMessage( 'countPeoplePerPage' );
        
        for ( i = 1; i < 6 ; i++ ) {
            var userPerPageOption = document.createElement( 'option' ),
                  stepValue = 20;
            
            userPerPageOption.value = i * stepValue;
            userPerPageOption.textContent =  i * stepValue;
            userPerPageSelect.appendChild( userPerPageOption );
        }
        
        $( userPerPageSelect ).val( StorageManager.getOption( 'usersPerPage' ) );
        
        userPerPageBlock.appendChild( userPerPageLabel );
        userPerPageBlock.appendChild( userPerPageSelect );
        contentBlock.appendChild( userPerPageBlock );
        
        /* defaultLoadingResourse  */
        var defaultLoadingResourseBlock = document.createElement( 'div' ),
              headerLalel = document.createElement( 'label' ),
              alwaysAskBlock = document.createElement( 'div' ),
              alwaysAskRadio = document.createElement( 'input' ),
              alwaysAskLabel = document.createElement( 'label' ),
              alwaysAskSpan = document.createElement( 'span' ),
              alwaysLocalBlock = document.createElement( 'div' ),
              alwaysLocalRadio = document.createElement( 'input' ),
              alwaysLocalLabel = document.createElement( 'label' ),
              alwaysLocalSpan  = document.createElement( 'span' ),
              alwaysLoadingBlock = document.createElement( 'div' ),
              alwaysLoadingRadio = document.createElement( 'input' ),
              alwaysLoadingLabel = document.createElement( 'label' ),
              alwaysLoadingSpan  = document.createElement( 'span' );
              
        
        headerLalel.textContent = getMessage( 'defaultLoadingResourse' );
        
        defaultLoadingResourseBlock.appendChild( headerLalel );
        
        alwaysAskRadio.name = defaultLoadingResourse;
        alwaysAskRadio.type = 'radio';
        alwaysAskRadio.value = 'alwaysAskRadio';
        alwaysAskRadio.checked = true;
        alwaysAskSpan.textContent = getMessage( 'alwaysAsk' );
        
        alwaysAskLabel.appendChild( alwaysAskRadio );
        alwaysAskLabel.appendChild( alwaysAskSpan );
        alwaysAskBlock.appendChild( alwaysAskLabel );
        defaultLoadingResourseBlock.appendChild( alwaysAskBlock );
        
        alwaysLocalRadio.name = defaultLoadingResourse;
        alwaysLocalRadio.type = 'radio';
        alwaysLocalRadio.value = 'alwaysLocalRadio';
        alwaysLocalRadio.checked = ( StorageManager.getOption( defaultLoadingResourse ) == alwaysLocalRadio.value ? true : false );
        alwaysLocalSpan.textContent = getMessage( 'alwaysLocal' );
        
        alwaysLocalLabel.appendChild( alwaysLocalRadio );
        alwaysLocalLabel.appendChild( alwaysLocalSpan );
        alwaysLocalBlock.appendChild( alwaysLocalLabel );
        defaultLoadingResourseBlock.appendChild( alwaysLocalBlock );
        
        alwaysLoadingRadio.name = defaultLoadingResourse;
        alwaysLoadingRadio.type = 'radio';
        alwaysLoadingRadio.value = 'alwaysLoadingRadio';
        alwaysLoadingRadio.checked = ( StorageManager.getOption( defaultLoadingResourse ) == alwaysLoadingRadio.value ? true : false );
        alwaysLoadingSpan.textContent = getMessage( 'alwaysLoading' );
        
        alwaysLoadingLabel.appendChild( alwaysLoadingRadio );
        alwaysLoadingLabel.appendChild( alwaysLoadingSpan );
        alwaysLoadingBlock.appendChild( alwaysLoadingLabel );
        defaultLoadingResourseBlock.appendChild( alwaysLoadingBlock );
        
        contentBlock.appendChild( defaultLoadingResourseBlock );
        
        /* block local storage size */        
        var storageBlock = document.createElement( 'div' ),
              pieCharFullStorage = document.createElement( 'div' ),
              storageTitleSize = document.createElement( 'label' ),
              storageSize = document.createElement( 'label' ),
              clearStorageButton = document.createElement( 'button' );
        
        storageTitleSize.textContent = getMessage( 'storageSize' ) + ':';
        storageSize.textContent = Math.floor( StorageManager.getStorageSize() ) + getMessage( 'kBytes' );
        
        clearStorageButton.textContent = getMessage( 'storageClear' );        
        clearStorageButton.addEventListener( 'click', function() {
            StorageManager.clear();
            onClose();
        });
            
        pieCharFullStorage.id = 'pieCharFullStorage';
        
        storageBlock.appendChild( storageTitleSize );
        storageBlock.appendChild( storageSize );
        storageBlock.appendChild( clearStorageButton );
        
        storageBlock.appendChild( pieCharFullStorage );
        
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
                acceptButton = showAcceptButton( getMessage( 'apply' ) );
                  
              
            $( headerBlock ).addClass( 'headerBlock' );
            headerBlock.appendChild( showIcon() );
            headerBlock.appendChild( showName( this ) );

            controlBlock.appendChild( cancelButton );        
            $( cancelButton ).addClass( 'but-icon' );   
            
            cancelButton.addEventListener( 'click', onClose );

            controlBlock.appendChild( acceptButton );
            
            $( acceptButton ).addClass( 'but-icon' );
            
            acceptButton.addEventListener( 'click', function() {
                StorageManager.setOption( 'usersPerPage', userPerPageSelect.value );
                StorageManager.setOption( 'defaultLoadingResourse', $( '[name=' + defaultLoadingResourse + ']:checked' ).val() );
                location.reload();
                onClose();
            });
            
            optionsBlock.appendChild( headerBlock );
            optionsBlock.appendChild( showContentBlock( onClose ) );
            optionsBlock.appendChild( controlBlock );
            
            $( optionsBlock ).addClass( 'optionsBlock' );        
            $( controlBlock ).addClass( 'controlBlock' );   
             
            return optionsBlock;
        }
    }
})();