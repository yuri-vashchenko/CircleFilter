function Result( block ) {
    var STATE = {
        "DEFAULT" : 1,
        "EMPTY" : 2,
        "FULL" : 3
    }
    
    this.block = block;
    
    this.append = function( user ) {
        if ( !user ) return;
        
        this.usersList.addUser( user );
        
        switch ( this.state ) {
            case STATE.FULL : {
                this.block.querySelector( 'ul' ).appendChild( user.show() );
                break;
            }
            
            default : {
                this.block.innerHTML = '';
                this.block.appendChild( this.usersList.show() );
                this.state = STATE.FULL;
                break;
            }                
        }
    }
    
    this.update = function( usersList ) {
        if ( usersList.length > 0 ) {
            this.block.innerHTML = '';
            this.state = STATE.FULL;
            this.block.appendChild( usersList.show() );
        } else {
            this.state = STATE.EMPTY;
            this.block.innerHTML = getMessage( 'emptyResultBlock' );
        }
    }
    
    this.clear = function() {
        this.usersList = new UsersList();
        this.state = STATE.EMPTY;
        this.block.innerHTML = getMessage( 'emptyResultBlock' );
    }
    
    this.reset = function() {
        this.usersList = new UsersList();
        this.state = STATE.DEFAULT;
        this.block.innerHTML = getMessage( 'defaultResultBlockContent' );
    }
    
    this.reset();
}