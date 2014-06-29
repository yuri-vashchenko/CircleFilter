/* Global variable filterOptionsList */
var filterOptionsList = Array();

function loadFilterOptions() {
    var filterOptionsList = ['bySex', 'byCity', 'byCircles', 'byNumberOfComments', 'byNumberOfPlusOne', 'byNumberOfPosts', 'byNumberOfReposts'];          
    
    for ( var i = 0; i < filterOptionsList.length; i++ ) {
        var script = document.createElement( 'script' );s
        script.type = 'text/javascript';
        script.src = 'js/filterOptions/' + filterOptionsList[i] + '.class.js';
        
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(script, s);
        
        var link = document.createElement( 'link' );
        link.type = 'text/css'; 
        link.rel = 'stylesheet';
        link.href = 'js/filterOptions/' + filterOptionsList[i] + '.class.css';
        
        var l = document.getElementsByTagName('link')[0];
        l.parentNode.insertBefore(link, l);
    }
};

function getFilterOptionById( id ) {
    var filterOption;
    
    for ( var i = 0; i < filterOptionsList.length; i++ ) {
        if ( filterOptionsList[i].id == id ) {
            return filterOptionsList[i];
        }
    }
    
    return;
}

(function(){
    loadFilterOptions();
})();