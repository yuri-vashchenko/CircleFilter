document.getElementById( "my_name" ).value = readProperty( "my_name", "Unknown" );

$( document ).ready(function() {
   $( "#save_button" ).click(function() {
      localStorage["my_name"] = document.getElementById( "my_name" ).value;
      window.close();
   });
});
