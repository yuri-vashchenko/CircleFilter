function User( id, firstName, lastName, photo, age, sex, city, circles ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.photo = photo;
    this.age = age;
    this.sex = sex;
    this.city = city;
    this.circles = circles;
    var tooltipTimeOut = 1200;
    
    var checked = false;
    
    this.isChecked = function() {
        return checked;
    }
    
    this.toggleCheck = function() {
        checked = !checked;
    }
    
    this.show = function() {
        var userBlock = document.createElement( 'div' ),
              img = document.createElement( 'img' ),
              url = document.createElement( 'a' ),
              self = this;
        
        var tooltipTimeOutId = null;
        
        $( userBlock ).addClass( 'user' );
        
        if ( this.isChecked() ) {
            $( userBlock ).addClass( 'selected' );
        }
        
        img.src = this.photo;
        url.textContent = this.firstName + ' ' + this.lastName;
        url.href = 'https://plus.google.com/' + this.id;
        url.target = '_blank';
        url.title = getMessage( 'goToProfilePage' );
        
        userBlock.appendChild( img );
        userBlock.appendChild( url );
        
        userBlock.addEventListener( 'click', function( e ) {
            $( this ).toggleClass( 'selected' );
            self.toggleCheck();
        });
        
        $( userBlock ).mouseenter( function() {
            tooltipTimeOutId = setTimeout( function() {
                
                $.modal( showTooltip( self ), {
                    position : [$( userBlock ).offset().top + 71 - $( document ).scrollTop(), $( userBlock ).offset().left],
                    containerCss: {
                        position: 'absolute !important',
                        borderBottom: '1px solid silver',
                        borderLeft: '1px solid silver',
                        borderRight: '1px solid silver',
                        borderTop: '0px solid silver',        
                        width: '200px',
                        borderRadius: '0 0 5px 5px'
                    },
                    onOpen: function ( dialog ) {
                        dialog.container.slideDown( 'fast' );
                        dialog.data.slideDown( 'fast' );	 
                    },
                    onClose: function ( dialog ) {
                        dialog.data.slideUp( 'fast', function () {
                            dialog.container.slideUp( 'fast', function () {
                                $.modal.close();
                            });
                        });
                    }
                });
                
            }, tooltipTimeOut );
        })
        .mouseleave( function() {
            clearTimeout( tooltipTimeOutId );
            $.modal.close();
        });
  
        return userBlock;
    }
    
    this.eq = function( user ) {
        if ( this.id == user.id ) {
            return true;
        }
        return false;
    }
    
    function showTooltip( user ) {
        var userTooltip = document.createElement( 'div' );
        
        if ( user.age ) {
            var userAge = document.createElement( 'div' ),
                  userAgeLabel = document.createElement( 'label' ),
                  userAgeSpan = document.createElement( 'span' );
            
            userAgeLabel.textContent = getMessage( 'age' ) + ': ';
            userAgeSpan.textContent = user.age;
            
            userAge.appendChild( userAgeLabel );
            userAgeLabel.appendChild( userAgeSpan );
            
            userTooltip.appendChild( userAge );
        }
        
        if ( user.sex ) {
            var userSex = document.createElement( 'div' ),
                  userSexLabel = document.createElement( 'label' ),
                  userSexSpan = document.createElement( 'span' );
            
            userSexLabel.textContent = getMessage( 'sex' ) + ': ';
            userSexSpan.textContent = user.sex;
            
            userSex.appendChild( userSexLabel );
            userSexLabel.appendChild( userSexSpan );
            
            userTooltip.appendChild( userSex );
        }
        
        if ( user.city ) {
            var userCity = document.createElement( 'div' ),
                  userCityLabel = document.createElement( 'label' ),
                  userCitySpan = document.createElement( 'span' );
            
            userCityLabel.textContent = getMessage( 'city' ) + ': ';
            userCitySpan.textContent = user.city;
            
            userCity.appendChild( userCityLabel );
            userCityLabel.appendChild( userCitySpan );
            
            userTooltip.appendChild( userCity );
        }
        
        if ( user.circles && user.circles.length ) {
            var userCircles = document.createElement( 'div' ),
                  userCirclesLabel = document.createElement( 'label' ),
                  userCirclesSpan = document.createElement( 'span' );
            
            userCirclesLabel.textContent = getMessage( 'circles' ) + ': ';
            userCirclesSpan.textContent = '';
            
            for ( var i = 0; i < user.circles.length; i++ ) {
                StorageManager.getCircleInfo( user.circles[i], function( circle ) {
                    userCirclesSpan.textContent += circle.name + ( i != user.circles.length - 1 ? ', ' : '' );
                });
                
            }
            
            userCircles.appendChild( userCirclesLabel );
            userCirclesLabel.appendChild( userCirclesSpan );
            
            userTooltip.appendChild( userCircles );
        }

        $( userTooltip ).addClass( 'userTooltip' );
        $( userTooltip ).addClass( 'contentBlock' );
        
        return userTooltip;
    }
}

User.propertiesForShow = ['photo', 'firstName', 'lastName'];