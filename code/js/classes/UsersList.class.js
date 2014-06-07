function UsersList( perPage ) {
    this.usersList = Array();
    this.usersBlock = null;
    this.pageNav = null;
    this.perPage = perPage || 20;
    this.currentPage = 1;
    this.pagesCount = 1;
    this.usersSelectedCount = 0;
    
    this.addUser = function( user ) {
        for ( var i = 0; i < this.usersList.length; i++ ) {
            if ( this.usersList[i].eq( user ) ) {
                return false;
            }
        }
        /* Ошибка тут. Не работает селектор. Может быть я что то с областями видимости туплю.
        А может просто неправильно обновляю элемент*/
        counterProgressBar.usersShowCount = this.usersList.length;
        $( '#usersShowCount' ).textContent = counterProgressBar.usersShowCount;
        this.usersList.push( user );
        
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
        var usersListBlock = document.createElement( 'div' ),
            progresBar      = document.createElement( 'div' );
            
        this.usersBlock = document.createElement( 'ul' );
        this.pageNav = document.createElement( 'div' );
            
        progresBar.id = 'progresBar';
        
        $( this.usersBlock ).addClass( 'usersList' );
        $( this.pageNav ).addClass( 'pagesNav' );
        $( this.pageNav ).addClass( 'paginate' );
        
        $( progresBar ).wijprogressbar({
            value: 0,
            labelAlign: 'center',
            animationOptions: {
            duration: 1000
            },
        indicatorImage: 'images/progressbar_40x40.png'
        });
        
        for ( var i = 0; i < this.usersList.length; i++ ) {
            var li = document.createElement( 'li' );
            
            li.appendChild( this.usersList[i].show() );
            this.usersBlock.appendChild( li );
        }
        usersListBlock.appendChild( this.usersBlock );
        usersListBlock.appendChild( this.pageNav );
        usersListBlock.appendChild( progresBar );
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

