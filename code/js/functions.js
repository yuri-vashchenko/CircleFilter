function readProperty( property, defValue ) {
    if ( localStorage[property] == null ) {
        return defValue;
    }

    return localStorage[property];
}

function getMessage( label ) {
    if ( label == null ) {
        return 'undefined';
    }

    return chrome.i18n.getMessage( label );
}

function closeWindow() {
    window.close();
}
  
function loadClasses() {
    var classesList = ['User', 'UsersList', 'Result', 'GPlus', 'Filter', 'Main'];          
    
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