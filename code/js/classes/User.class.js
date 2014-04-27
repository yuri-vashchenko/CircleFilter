function User( id, firstName, lastName, photo ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.photo = photo;

    this.show = function() {
        var userBlock = document.createElement( 'div' ),
              img = document.createElement( 'img' ),
              span = document.createElement( 'span' );
              
        userBlock.className = 'user';
        
        img.src = this.photo;
        span.textContent = this.firstName + ' ' + this.lastName;
        
        userBlock.appendChild( img );
        userBlock.appendChild( span );
        
        return userBlock;
    }
}