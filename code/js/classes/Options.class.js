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
        contentBlock.className = 'optionsShow';
        document.body.appendChild(contentBlock);
        
        var head = document.createElement('div');
        $(head).addClass('head');
        contentBlock.appendChild(head);
        
        var optionsNew = document.createElement('div');
        $(optionNew).addClass('optionNew');
        head.appendChild(optionsNew);
        
        var radio = document.createElement('div');
        $(radio).addClass('radio');
        center.appendChild(radio);
        
        var form1 = document.createElement('form');
        radio.appendChild(form1);
        
        var langName = document.createElement('div');
        langName.className = 'langName';
        langName.textContent = getMessage( 'storingDataDownload' );
        form1.appendChild(langName);
            
        var help = document.createElement('div');
        langName.appendChild(help);
        
        var inp = document.createElement('input');
        inp.type = 'radio';
        inp.name = 'answer';
        help.textContent = getMessage( 'theChoiceDownload' );
        help.appendChild(inp);
        
        var help1 = document.createElement('div');
        langName.appendChild(help1);
    
        var inp1 = document.createElement('input');
        inp1.type = 'radio';
        inp1.name = 'answer';
        help1.textContent = getMessage( 'useLocalData' );
        help1.appendChild(inp1);
    
        var help2 = document.createElement('div');
        langName.appendChild(help2);
            
        var inp2 = document.createElement('input');
        inp2.type = 'radio';
        inp2.name = 'answer';
        help2.textContent = getMessage( 'useActualData' );
        help2.appendChild(inp2); 
        
        var input = document.createElement('div');
        $(input).addClass('input');
        center.appendChild(input);
    
        var form2 = document.createElement('form');
        input.appendChild(form2);
            
        var langName1 = document.createElement('div');
        langName1.className = 'langName';
        langName1.textContent = getMessage( 'storingDataDownload' );
        form2.appendChild(langName1);
        
        var country1 = document.createElement('div');
        country1.className = 'country1';
        langName1.appendChild(country1);
        
        var input1 = document.createElement('input');
        input1.size = '40';
        input1.type = 'text';
        country1.appendChild(input1);
    
        var button2 = document.createElement('div');
        $(button2).addClass('button2');
        langName1.appendChild(button2);
        
        var input2 = document.createElement('input');
        input2.value = 'Обзор';
        input2.type = 'button'
        button2.appendChild(input2);
    
        var button1 = document.createElement('div');
        $(button1).addClass('button1');
        center.appendChild(button1);
    
        var input3 = document.createElement('input');
        input3.value = 'Вернуться';
        input3.type = 'button';
        button1.appendChild(input3);
    
        var button3 = document.createElement('div');
        $(button3).addClass('button3');
        center.appendChild(button3);
        
        var input4 = document.createElement('input');
        input4.value = 'Применить';
        input4.type = 'button';
        button3.appendChild(input4);
        
        return contentBlock;
    }
    
    return {
        name: getMessage( 'config' ),
        
        show: function( onClose ) {
            var optionsBlock = document.createElement( 'div' ),
                  headerBlock = document.createElement( 'div' ),
                  controlBlock = document.createElement( 'div' ),
                  cancelButton = document.createElement( 'a' ),
                  cancelIcon = document.createElement( 'img' ),
                  acceptButton = document.createElement( 'a' ),
                  acceptIcon = document.createElement( 'img' );
                  
            $( headerBlock ).addClass( 'headerBlock' );
            headerBlock.appendChild( showIcon() );
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