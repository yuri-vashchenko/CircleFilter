function User( id, firstName, lastName, photo, age, sex, city, circles ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.photo = photo;
    this.age = age;
    this.sex = sex;
    this.city = city;
    this.circles = circles;
    this.checked = false;
    
    this.show = function() {
        var userBlock = document.createElement( 'div' ),
              img = document.createElement( 'img' ),
              span = document.createElement( 'span' ),
              self = this;
              
        $( userBlock ).addClass( 'user' );
        
        if ( this.checked ) {
            $( userBlock ).addClass( 'selected' );
        }
        
        img.src = this.photo;
        span.textContent = this.firstName + ' ' + this.lastName;
        
        userBlock.appendChild( img );
        userBlock.appendChild( span );
        
        userBlock.addEventListener( 'click', function( e ) {
            $( this ).toggleClass( 'selected' );
            self.checked = !self.checked;
        });
        
        return userBlock;
    }
    
    this.eq = function( user ) {
        if ( this.id == user.id ) {
            return true;
        }
        return false;
    }
}

User.propertiesForShow = ['photo', 'firstName', 'lastName'];