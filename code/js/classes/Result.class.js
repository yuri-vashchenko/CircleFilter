function Result( block ) {
    this.block = block;
    
    this.update = function( usersList ) {
        if ( usersList ) {
            this.block.innerHTML = '';
            this.block.appendChild( usersList.show() );
        } else {
            this.block.innerHTML = getMessage( 'emptyResultBlock' );
        }
    }
    
    this.block.innerHTML = getMessage( 'defaultResultBlockContent' );
}
