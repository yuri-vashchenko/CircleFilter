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

function convertJSONtoXML( json ) {
    var tab = ""
    var toXml = function( v, name, ind ) {  
    var xml = "";
        if ( v instanceof Array ) {
            for ( var i = 0, n = v.length; i < n; i++ ) {
                xml += ind + toXml ( v[i], name, ind + "\t" ) + "\n";
            }
         }
        else if ( typeof( v ) == "object" ) {
            var hasChild = false;
            xml += ind + "<" + name;
            for ( var m in v ) {
                if ( m.charAt ( 0 ) == "@" ) {
                    xml += " " + m.substr( 1 ) + "=\"" + v[m].toString( ) + "\"";
                }
                else
                    hasChild = true;
            }
            xml += hasChild ? ">" : "/>";
            if (hasChild) {
                for ( var m in v ) {
                    if ( m == "#text" ) {
                        xml += v[m];
                    }
                    else if ( m == "#cdata" ) {
                        xml += "<![CDATA[" + v[m] + "]]>";
                    }
                    else if (m.charAt( 0 ) != "@") {
                        xml += toXml( v[m], m, ind+"\t" );
                    }
                }
                xml += ( xml.charAt(xml.length-1)=="\n"?ind:"" ) + "</" + name + ">";
            }
        }
        else {
            xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
        }
      return xml;
   }, xml="";
   
    for ( var m in json ){
        xml += toXml( json[m], m, "" );
    }
    return tab ? xml.replace( /\t/g, tab ) : xml.replace( /\t|\n/g, "" );
}



function convertXMLtoJSON() {
    var me = this;
    me.fromFile = function(xml, rstr) {
        xhttp.open("GET", xml ,false);
        xhttp.send(null);
        var json_str = jsontoStr(setJsonObj(xhttp.responseXML));
        return (typeof(rstr) == 'undefined') ? JSON.parse(json_str) : json_str;
    }
    me.fromStr = function(xml, rstr) {
    // for non IE browsers
    if(window.DOMParser) {
      var getxml = new DOMParser();
      var xmlDoc = getxml.parseFromString(xml,"text/xml");
    }

    // gets the JSON string
    var json_str = jsontoStr(setJsonObj(xmlDoc));

    // sets and returns the JSON object, if "rstr" undefined (not passed), else, returns JSON string
    return (typeof(rstr) == 'undefined') ? JSON.parse(json_str) : json_str;
  }

  // receives XML DOM object, returns converted JSON object
  var setJsonObj = function(xml) {
    var js_obj = {};
    if (xml.nodeType == 1) {
      if (xml.attributes.length > 0) {
        js_obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          js_obj["@attributes"][attribute.nodeName] = attribute.value;
        }
      }
    } else if (xml.nodeType == 3) {
      js_obj = xml.nodeValue;
    }            
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(js_obj[nodeName]) == "undefined") {
          js_obj[nodeName] = setJsonObj(item);
        } else {
          if (typeof(js_obj[nodeName].push) == "undefined") {
            var old = js_obj[nodeName];
            js_obj[nodeName] = [];
            js_obj[nodeName].push(old);
          }
          js_obj[nodeName].push(setJsonObj(item));
        }
      }
    }
    return js_obj;
  }

  var jsontoStr = function(js_obj) {
    var rejsn = JSON.stringify(js_obj, undefined, 2).replace(/(\\t|\\r|\\n)/g, '').replace(/"",[\n\t\r\s]+""[,]*/g, '').replace(/(\n[\t\s\r]*\n)/g, '').replace(/[\s\t]{2,}""[,]{0,1}/g, '').replace(/"[\s\t]{1,}"[,]{0,1}/g, '').replace(/\[[\t\s]*\]/g, '""');
    return (rejsn.indexOf('"parsererror": {') == -1) ? rejsn : 'Invalid XML format';
  }
};

// creates object instantce of XMLtoJSON
var xml2json = new convertXMLtoJSON();

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