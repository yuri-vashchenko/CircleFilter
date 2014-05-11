function Filter( filterBlock, resultBlock ) {
    this.result = new Result( resultBlock );
    
    this.filterOptionsList = Array();    
    this.filterBlock = filterBlock;
    this.formula;
    
    $( this.filterBlock ).addClass( 'filter' );
         
    this.filterBlock.appendChild( showDropdownBlock(
        'Выберите фильтр', 
        showChooseFilterBlock( this ),
        true ) );
            
    this.filterBlock.appendChild( showDropdownBlock(
        'Выберите действие', 
        showChooseActionBlock( this ),
        false ) );
    
    this.addFilterOption = function( filterOption ) {
        this.filterOptionsList.push( filterOption );
    }
    
    function showDropdownBlock( title, contentBlock, state ) {
        var dropdownBlock = document.createElement( 'div' ),
               titleBlock = document.createElement( 'div' ),
               titleContentBlock = document.createElement( 'h3' ),
               stateIconBlock = document.createElement( 'span' );
               
        $( titleBlock ).addClass( 'title' );     
        titleContentBlock.textContent = title;
        
        titleBlock.appendChild( stateIconBlock );
        titleBlock.appendChild( titleContentBlock );
        
        $( dropdownBlock ).addClass( 'dropdown' ); 
        $( contentBlock ).addClass( 'content' );
        
        dropdownBlock.appendChild( titleBlock );
        dropdownBlock.appendChild( contentBlock );        
        
        if ( !state ) {
            $( contentBlock ).hide();
            $( dropdownBlock ).toggleClass( 'inactive' );
        }
         
        titleBlock.addEventListener( 'click', function() {
            $( contentBlock ).slideToggle();
            $( dropdownBlock ).toggleClass( 'inactive' );
        });
 
        return dropdownBlock;
    }

    function showChooseActionBlock( filter ) {
        var chooseActionBlock = document.createElement( 'div' ),
               addToCircleButton = document.createElement( 'button' ),
               moveFromCircleButton = document.createElement( 'button' ),
               deleteFromCircleButton = document.createElement( 'button' ),
               deleteAllFromCircleButton = document.createElement( 'button' ),
               exportToFileBlock = document.createElement( 'div' ),
               exportToFileTitle = document.createElement( 'h3' ),
               exportToCsvButton = document.createElement( 'button' ),
               exportToXmlButton = document.createElement( 'button' );
              
        addToCircleButton.textContent = 'Добавить в круг';
        moveFromCircleButton.textContent = 'Переместить в круг';
        deleteFromCircleButton.textContent = 'Удалить из круга';
        deleteAllFromCircleButton.textContent = 'Удалить из всех кругов';
        exportToFileTitle.textContent = 'Экспорт в файл';
        exportToXmlButton.textContent = 'В Xml';
        exportToCsvButton.textContent = 'В Csv';
        
        chooseActionBlock.appendChild( addToCircleButton );
        chooseActionBlock.appendChild( moveFromCircleButton );
        chooseActionBlock.appendChild( deleteFromCircleButton );
        chooseActionBlock.appendChild( deleteAllFromCircleButton );

        exportToFileBlock.appendChild ( exportToFileTitle );
        exportToFileBlock.appendChild ( exportToXmlButton );
        exportToFileBlock.appendChild ( exportToCsvButton );
        
        chooseActionBlock.appendChild( exportToFileBlock );
        
        $( chooseActionBlock ).addClass( 'action' );
        
        return chooseActionBlock;
    }