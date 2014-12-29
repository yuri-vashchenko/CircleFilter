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

function getCurrentDate( format ) {
    format = format || 'RU';

    return convertDate( new Date(), format );
}

function convertDate( date, format ) {
    var day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear(),
        h = date.getHours(),
        m = date.getMinutes();

    format = format || 'RU';

    if (format == 'RU') {
        return day + '.' + month + '.' + year + ' ' + h + ':' + m;
    } else {
        return year + '-' + month.pad(2) + '-' + day.pad(2) + ' ' + h.pad(2) + ':' + m.pad(2) + ':00';
    }
}

function getDatesDiff(date1,date2,interval) {
    var second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7;
    date1 = new Date(date1);
    date2 = new Date(date2);
    var timediff = date2 - date1;
    if (isNaN(timediff)) return NaN;
    
    switch (interval) {
        case "years": return date2.getFullYear() - date1.getFullYear();
        case "months": return (
        ( date2.getFullYear() * 12 + date2.getMonth() )
        -
        ( date1.getFullYear() * 12 + date1.getMonth() )
        );
        case "weeks"  : return Math.floor(timediff / week);
        case "days"   : return Math.floor(timediff / day);
        case "hours"  : return Math.floor(timediff / hour);
        case "minutes": return Math.floor(timediff / minute);
        case "seconds": return Math.floor(timediff / second);
        default: return undefined;
    }
}

function transliterate( word ){
    var a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};

    return word.split('').map(function (char) { 
        return a[char] || char; 
    }).join("");
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

Number.prototype.pad = function( size ) {
    var s = String(this);
    while ( s.length < ( size || 2 ) ) { s = "0" + s; }
    return s;
}

Array.prototype.clone = function() {
	return this.slice( 0 );
};

function closeWindow() {
    window.close();
}

function showCancelButton() {
    var cancelButton = document.createElement( 'a' ),
          cancelIcon = document.createElement( 'img' );
          
    cancelIcon.src = 'images/cancel.png';
    cancelIcon.title = getMessage( 'cancel' );
    
    cancelButton.appendChild( cancelIcon );
    $( cancelButton ).addClass( 'but-icon' );
    
    return cancelButton;
}

function showAcceptButton( title ) {
    var acceptButton = document.createElement( 'a' ),
          acceptIcon = document.createElement( 'img' );
          
    acceptIcon.src = 'images/apply.png';
    acceptIcon.title = title;
    
    acceptButton.appendChild( acceptIcon );
    $( acceptButton ).addClass( 'but-icon' );
    
    return acceptButton;
}

function loadClasses() {
    var classesList = [
        'User',
        'UsersList',
        'Options',
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