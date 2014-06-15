function UsersList( perPage ) {
    this.usersList = Array();
    this.usersBlock = null;
    this.pageNav = null;
    this.perPage = perPage || 20;
    this.currentPage = 1;
    this.pagesCount = 1;
    
    selectedUsers.count = 0;
    counterProgressBar.usersConfirmed = 0;
    selectedUsers.isCheckedDefault = false;
    
    this.addUser = function( user ) {
        
        for ( var i = 0; i < this.usersList.length; i++ ) {
            if ( this.usersList[i].eq( user ) ) {
                return false;
            }
        }
        
        counterProgressBar.usersConfirmed++;
        selectedUsers.updateField();
            
        this.usersList.push( user );
        
        if ( selectedUsers.isCheckedDefault ) {
            user.toggleCheck();
        }

        if ( this.usersList.length - this.perPage * this.currentPage <= 0 ) {
            this.usersBlock.appendChild( user.show() );
        } 
        
        if ( this.usersList.length > this.perPage * this.pagesCount ){
            var uList = this;
            this.pagesCount++;
            
            $( this.pageNav ).pageFun({
                count: uList.pagesCount,
                start: uList.currentPage,
                display: 10,
                border: true,
                mouse: 'press',
                onChange: function( page ) { uList.updateUsersOnPage( page ); }
            });
        }
    }

    this.show = function() {
        var usersListBlock = document.createElement( 'div' );
            
        this.usersBlock = document.createElement( 'ul' );
        this.pageNav = document.createElement( 'div' );
        
        $( this.usersBlock ).addClass( 'usersList' );
        $( this.pageNav ).addClass( 'pagesNav' );
        $( this.pageNav ).addClass( 'paginate' );
        
        for ( var i = 0; i < this.usersList.length; i++ ) {
            var li = document.createElement( 'li' );
            
            li.appendChild( this.usersList[i].show() );
            this.usersBlock.appendChild( li );
        }
        usersListBlock.appendChild( this.usersBlock );
        usersListBlock.appendChild( this.pageNav );
        
        return usersListBlock;
    }
    
    this.getCheckedUsers = function() {
        var checkedUsers = [];

        for ( var i = 0; i < this.usersList.length; i++ ) {
            if ( this.usersList[i].isChecked() ) {
                checkedUsers.push( this.usersList[i] );
            }
        }
        
        return checkedUsers;
    }
    
    this.updateUsersOnPage = function( page ) {
        var indexOfTheFirst = this.perPage * ( page - 1 ),
              indexOfTheLast = this.perPage * page - 1;
              
        this.usersBlock.innerHTML = '';
        
        for ( var i = indexOfTheFirst; i <= indexOfTheLast && i < this.usersList.length; i++ ) {
            var li = document.createElement( 'li' );
            
            li.appendChild( this.usersList[i].show() );
            this.usersBlock.appendChild( li );
        }
        
        this.currentPage = page;
    }
}

