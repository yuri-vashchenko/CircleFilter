function Result( block ) {
    var STATE = {
        "DEFAULT" : 1,
        "EMPTY" : 2,
        "FULL" : 3
    }, perPage = ( StorageManager.getOption( 'usersPerPage' ) ? StorageManager.getOption( 'usersPerPage' ) : 20 );
    
    var self = this;
    
    this.block = block;
    $( this.block ).addClass( 'result' );
    
    this.append = function( user ) {
        if ( !user ) return;
        
        if ( this.state != STATE.FULL ) {
            this.block.innerHTML = '';
            this.block.appendChild( this.usersList.show() );
            var uList = this.usersList;
            
            $( this.block.querySelector( '.pagesNav' ) ).pageFun({
                count: 1,
                start: 1,
                display: 10,
                border: true,
                mouse: 'press',
                onChange: function( page ) { uList.updateUsersOnPage( page ); }
            });
        }
            
        if ( this.usersList.addUser( user ) != false ) {       
            $( this.block ).removeClass( 'text' );
            this.state = STATE.FULL;
        };
    }
    
    this.clear = function() {
        this.usersList = new UsersList( perPage );
        $( '#resultControlPanel' ).hide();
        this.state = STATE.EMPTY;
        this.block.innerHTML = '';
        this.block.appendChild( showText( getMessage( 'emptyResultBlock' ) ) );
        this.block.appendChild( showImportButton( this ) );
        $( this.block ).addClass( 'text' );
    }
    
    this.finish = function() {
        if ( this.state == STATE.DEFAULT ) {
            this.clear();
        }
    }
    
    this.processing = function() {
        
        this.block.innerHTML = '';
        this.block.appendChild( showText( getMessage( 'defaultResultBlockContent' ) ) );
        $( '#resultControlPanel' ).show();
        $( this.block ).addClass( 'text' );
    }
    
    this.getCheckedUsers = function() { 
        return this.usersList.getCheckedUsers();
    }
    
    this.reset = function() {
        this.usersList = new UsersList( perPage );
        $( '#resultControlPanel' ).hide();
        this.state = STATE.DEFAULT;
        this.block.innerHTML = '';
        this.block.appendChild( showText( getMessage( 'defaultResultBlockContent' ) ) );
        this.block.appendChild( showImportButton( this ) );
        $( this.block ).addClass( 'text' );
    }
    
    this.reset();
    
    function showImportButton( result ) {
        var importButton = document.createElement( 'button' );
        
        importButton.textContent = getMessage( 'importFromFile' );
        $( importButton ).addClass( 'importFromFile' );        
        
        return importButton;
    }
    
    function showText( text ) {
        var textBlock = document.createElement( 'span' );
        textBlock.textContent = text;
        return textBlock;
    }
    
    $( 'button#selectAll' ).click( function() { 
        selectedUsers.isCheckedDefault = true;
        for ( var i = 0; i < self.usersList.usersList.length; i++ ) {
            if ( !self.usersList.usersList[i].isChecked() ) {
                self.usersList.usersList[i].toggleCheck();
            }
        }
    });
    
    $( 'button#deselectAll' ).click( function() {
        selectedUsers.isCheckedDefault = false;
        for ( var i = 0; i < self.usersList.usersList.length; i++ ) {
            if ( self.usersList.usersList[i].isChecked() ) {
                self.usersList.usersList[i].toggleCheck();
            }
        }
    });
}