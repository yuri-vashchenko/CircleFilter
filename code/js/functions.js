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
