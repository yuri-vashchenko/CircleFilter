function User( data ) {
    this.id = data.id;
    this.gID = data.gID;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.photo = data.photo;
    this.age = data.age;
    this.sex = data.sex;
    this.city = data.city;
    this.circles = data.circles;

    /* number of posts info */
    if ( data.numberOfPosts ) {
        this.numberOfPosts = data.numberOfPosts;
    } else {
        this.numberOfPosts = {};
    }

    this.lastActivityDate = data.lastActivityDate;
    this.relationOwn = data.relationOwn;
    this.relationAnother = data.relationAnother;

    var tooltipTimeOut = 1200;

    var checked = false;
    var userBlock;

    this.isChecked = function() {
        return checked;
    }

    this.toggleCheck = function() {
        selectedUsers.count += ( checked ? -1 : 1 );
        selectedUsers.updateField();
        checked = !checked;
        $( userBlock ).toggleClass( 'selected' );
    }

    this.show = function() {
        var img = document.createElement( 'img' ),
              url = document.createElement( 'a' ),
              tooltipTimeOutId = null,
              self = this;

        userBlock  = document.createElement( 'div' );
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
            userSexSpan.textContent = getMessage( user.sex );

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

        if ( user.numberOfPosts ) {
            /* TODO: paste code for number of posts show in popup */
        }

        if ( user.lastActivityDate ) {
            /* TODO: paste code for last activity show in popup */
        }

        if ( user.relationOwn || user.relationAnother ) {
            /* TODO: paste code for relationship show in popup */
        }

        $( userTooltip ).addClass( 'userTooltip' );
        $( userTooltip ).addClass( 'contentBlock' );

        return userTooltip;
    }
}

User.propertiesForShow = ['photo', 'firstName', 'lastName'];