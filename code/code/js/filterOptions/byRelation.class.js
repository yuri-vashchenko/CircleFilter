(function(){
    filterOptionsList.push( new FilterOption(
        9,
        '/images/connexion.png',
        getMessage( 'filterByRelation' ),
        function() {
            var relationBlock = document.createElement( 'div' ),
                relationLabel = document.createElement( 'label' ),
                relation = document.createElement( 'select' ),
                relationOptionBoth = document.createElement ( 'option' ),
                relationOptionOwn = document.createElement ( 'option' ),
                relationOptionAnother = document.createElement ( 'option' ),
                excludeDiv = document.createElement( 'div' ),
                excludeCheckBox = document.createElement( 'input' ),
                excludeLabel = document.createElement( 'label' ),
                excludeSpan = document.createElement( 'span' );

            excludeCheckBox.type = 'checkbox';
            excludeCheckBox.name = 'exclude';

            excludeSpan.textContent = getMessage( 'exclude' );

            excludeLabel.appendChild( excludeCheckBox );
            excludeLabel.appendChild( excludeSpan );

            excludeDiv.appendChild( excludeLabel );
            relationBlock.appendChild( excludeDiv );

            relationLabel.textContent = getMessage( 'relation' );

            relationOptionBoth.textContent = getMessage( 'relationBoth' );
            relationOptionOwn.textContent = getMessage( 'relationOwn' );
            relationOptionAnother.textContent = getMessage( 'relationAnother' );

            relation.name = 'relation';
            relationOptionBoth.value = 'relationBoth';
            relationOptionOwn.value = 'relationOwn';
            relationOptionAnother.value = 'relationAnother';

            relation.appendChild( relationOptionBoth );
            relation.appendChild( relationOptionOwn );
            relation.appendChild( relationOptionAnother );

            relationBlock.appendChild( relationLabel );
            relationBlock.appendChild( relation );

            return relationBlock;
        }(),
        function( configurationBlock ) {
            var configuration = {};

            configuration.exclude = ( configurationBlock.querySelector( '[name=exclude]' ).checked ? true : false );
            configuration.relation = configurationBlock.querySelector( '[name=relation]' ).value;

            return configuration;
        },
        function( configuration ) {
            return ( configuration.exclude ? getMessage( 'exclude' ) + ' ' : '' ) + getMessage( configuration.relation );
        },
        function( userId, accept, decline ) {
            var configuration = this.configuration,
		        requiredUserFields;

            switch ( configuration.relation ) {
                case 'relationOwn':
                    requiredUserFields = ['relationOwn'];
                    break;
                case 'relationAnother':
                    requiredUserFields = ['relationAnother'];
                    break;
                default:
                    requiredUserFields = this.requiredUserFields;
            }

            StorageManager.getUserInfo( userId, requiredUserFields, function( user ) {
                var toAccept = false;

                switch ( configuration.relation ) {
                    case 'relationOwn':
                        toAccept = user.relationOwn ? true : false;
                        break;
                    case 'relationAnother':
                        toAccept = user.relationAnother ? true : false;
                        break;
                    default:
                        toAccept = user.relationOwn && user.relationAnother ? true : false;
                }

                if ( configuration.exclude ) {
                    toAccept = !toAccept;
                }

                if ( toAccept ) {
                    accept( userId );
                } else {
                    decline( userId );
                }
            });
        },
        ['relationOwn', 'relationAnother']
        ) );
})();