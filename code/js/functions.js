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

function convertXMLtoJSON( xml ) {
   var X = {
      toObj: function( xml ) {
         var o = {};
         if (xml.nodeType==1) {   
            if (xml.attributes.length)  
               for (var i=0; i<xml.attributes.length; i++)
                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { 
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++;
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { 
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = X.escape(n.nodeValue);
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = X.escape(n.nodeValue);
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.escape(X.innerXml(xml));
                     else
                        o["#text"] = X.escape(X.innerXml(xml));
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.escape(X.innerXml(xml));
                  else
                     o["#text"] = X.escape(X.innerXml(xml));
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.escape(X.innerXml(xml));
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            alert("unhandled node type: " + xml.nodeType);
         return o;
      },
      toJson: function(o, name, ind) {
         var json = name ? ("\""+name+"\"") : "";
         if (o instanceof Array) {
            for (var i=0,n=o.length; i<n; i++)
               o[i] = X.toJson(o[i], "", ind+"\t");
            json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
         }
         else if (o == null)
            json += (name&&":") + "null";
         else if (typeof(o) == "object") {
            var arr = [];
            for (var m in o)
               arr[arr.length] = X.toJson(o[m], m, ind+"\t");
            json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
         }
         else if (typeof(o) == "string")
            json += (name&&":") + "\"" + o.toString() + "\"";
         else
            json += (name&&":") + o.toString();
         return json;
      },
      innerXml: function(node) {
         var s = ""
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      escape: function(txt) {
         return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
         e.normalize();
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
               n = n.nextSibling;
         }
         return e;
      }
   };
   if (xml.nodeType == 9) // document node
      xml = xml.documentElement;
   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
   return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
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