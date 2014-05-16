$(function() {
    gapi.signin.render( "gConnect", {
        'clientid' : '192023125772-sr3b1p2c0ip8ig8l3nb4qmml12ht5mtq.apps.googleusercontent.com',
        'cookiepolicy' : 'single_host_origin', 
        'callback' : 'onSignInCallback',
        'requestvisibleactions' : 'http://schemas.google.com/AddActivity http://schemas.google.com/CommentActivity'
    });        
});

$(function() {
    /* Блок тестирования */
    var testUserList = [{ "id" : 1, "firstName" : "Максим", "lastName" : "Авдеев", "photo" : ''}, 
                                { "id" : 2, "firstName" : "Роман", "lastName" : "Лось", "photo" : ''},
                                { "id" : 3, "firstName" : "Татьяна", "lastName" : "Бондаренко", "photo" : ''},
                                { "id" : 4, "firstName" : "Трикашный", "lastName" : "Артём", "photo" : ''},
                                { "id" : 5, "firstName" : "Марченко", "lastName" : "Данил", "photo" : ''},
                                { "id" : 6, "firstName" : "Сидоров", "lastName" : "Кирилл", "photo" : ''}];
    
    var winLeft = document.createElement( 'div' );
          winLeft.innerHTML = 1;

    var divLeft = document.getElementById( 'left-block' );	
          divLeft.innerHTML = '';
          divLeft.appendChild( winLeft );
    
    var result = new Result( document.querySelector( '#right-block' ) );
    
    var usersList = new UsersList();
    
    testUserList.forEach( function( child ) {
        usersList.addUser( new User( child.id, child.firstName, child.lastName, child.photo ) );
    });
    
    result.update( usersList );
});