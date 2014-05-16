function UsersList() {
    this.usersList = Array();

    this.addUser = function( user ) {
        this.usersList.push( user );
    }

    this.show = function() {
        var usersListBlock = document.createElement( 'div' ),
              ul = document.createElement( 'ul' );
              
        $( ul ).addClass( 'usersList' );
        
        for ( var i = 0; i < this.usersList.length; i++ ) {
            var li = document.createElement( 'li' );
            
            li.appendChild( this.usersList[i].show() );
            ul.appendChild( li );
        }
        usersListBlock.appendChild( ul );
        
        return usersListBlock;
    }
}