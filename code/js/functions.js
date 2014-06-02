function showDropdownBlock( title, contentBlock, state ) {
    var dropdownBlock = document.createElement( 'div' ),
          titleBlock = document.createElement( 'div' ),
          titleContentBlock = document.createElement( 'h3' ),
          stateIconBlock = document.createElement( 'span' );
           
    $( titleBlock ).addClass( 'title' );     
    titleContentBlock.textContent = title;
    
    titleBlock.appendChild( stateIconBlock );
    titleBlock.appendChild( titleContentBlock );
    
    $( dropdownBlock ).addClass( 'dropdown' ); 
    $( contentBlock ).addClass( 'content' );
    
    dropdownBlock.appendChild( titleBlock );
    dropdownBlock.appendChild( contentBlock );        
    
    if ( !state ) {
        $( contentBlock ).hide();
        $( dropdownBlock ).toggleClass( 'inactive' );
    }
     
    titleBlock.addEventListener( 'click', function() {
        $( contentBlock ).slideToggle();
        $( dropdownBlock ).toggleClass( 'inactive' );
    });

    return dropdownBlock;
}

function getCurrentDate() {        
    return convertDate( new Date() );
}

function convertDate( date ) {
    var day = date.getDate(),
          month = date.getMonth()+1,
          year = date.getFullYear(),
          h = date.getHours(),
          m = date.getMinutes();
    
    return day + '.' + month + '.' + year + ' ' + h + ':' + m;
}
    
function writeStringToFile( string, fileName ) {
    window.webkitRequestFileSystem( window.TEMPORARY, string.length * 16 , function( fs ) {
        fs.root.getFile( fileName, { create: true }, function( fileEntry ) {
            fileEntry.createWriter( function( fileWriter ) {
            
                fileWriter.addEventListener( "writeend", function() {
                    chrome.downloads.download({ url: fileEntry.toURL() }, function() {});
                }, false );
    
                fileWriter.write( new Blob( [string] ) );
            }, function() {});
        }, function() {});
    }, function() {});
}

function readStringFromFile( file, callback ) {
    window.webkitRequestFileSystem( window.TEMPORARY, 1024 * 1024 , function( fs ) {
        var reader = new FileReader();

        reader.onloadend = function( e ) {
            callback( this.result );
        };

        reader.readAsText( file );

    }, function() {});
}

function getMessage( label ) {
    if ( label == null ) {
        return 'undefined';
    }

    return chrome.i18n.getMessage( label );
}

function clone( obj ) {
    if ( obj == null || typeof( obj ) != 'object' )
        return obj;
    var temp = new obj.constructor(); 
    for ( var key in obj )
        temp[key] = clone( obj[key] );
    return temp;
}

Array.prototype.clone = function() {
	return this.slice( 0 );
};

function closeWindow() {
    window.close();
}

function loadClasses() {
    var classesList = [
        'User',
        'UsersList',
        'Result',
        'GPlus',
        'GPlusTranslator',
        'StorageManager',
        'FilterOption',
        'FilterOptionsLoader',
        'Filter',
        'FilterSet',
        'Main'
    ];          
    
    for ( var i = 0; i < classesList.length; i++ ) {
        var script = document.createElement( 'script' );
        script.type = 'text/javascript';
        script.src = 'js/classes/' + classesList[i] + '.class.js';
        
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(script, s);
        
        var link = document.createElement( 'link' );
        link.type = 'text/css'; 
        link.rel = 'stylesheet';
        link.href = 'js/classes/' + classesList[i] + '.class.css';
        
        var l = document.getElementsByTagName('link')[0];
        l.parentNode.insertBefore(link, l);
    }
};

(function(){
    loadClasses();
})();

$(function() {
    document.querySelector( 'head>title' ).textContent = getMessage( 'extName' );
    document.querySelector( '#revoke' ).textContent = getMessage( 'revoke' );
    document.querySelector( '#help>span' ).textContent = getMessage( 'help' );
    document.querySelector( '#config>span' ).textContent = getMessage( 'config' );
});