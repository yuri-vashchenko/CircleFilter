var GPlusTranslator = (function() {

    function parseDirtyJSON( input ) {
        var jsonString = input.replace( /\[,/g, '[null,' );
        jsonString = jsonString.replace( /,\]/g, ',null]' );
        jsonString = jsonString.replace( /,,/g, ',null,' );
        jsonString = jsonString.replace( /,,/g, ',null,' );
        jsonString = jsonString.replace( /{(\d+):/g, '{"$1":' );
        return JSON.parse( jsonString );
    }
    
    return {
        userEmail: function( error, status, response, callback ) {
            if ( !error && status == 200 ) {            
                callback( JSON.parse( response ).email );
            } else {
                callback( 'Error e-mail' );
            }
        },
        
        userIdsList: function( error, status, response, callback ) {
            if ( !error && status == 200 ) {
                var resp = JSON.parse(response),
                      uIdsList = new Array();
                
                for ( var i = 0; i < resp.items.length; i++ ) {
                    uIdsList.push( resp.items[i].id );
                }
                
                callback( uIdsList );
            }
        },
        
        circlesList: function( error, status, response, callback ) {
            var dirtyRes = parseDirtyJSON( response.substring( 4 ) ),
                  dirtyCirclesList = Array.isArray( dirtyRes ) ? dirtyRes[0] : dirtyRes,
                  circlesList = new Array();
                  
            dirtyCirclesList[1].forEach( function( element, index ) {
                circlesList.push({
                    id: element[0][0],
                    name: element[1][0],
                    position: element[1][12],
                    description: element[1][2]
                });
            });
            
            callback( circlesList );
        },
        
        userInfo: function( error, status, response, properties, callback ) {
            if ( !error && status == 200 ) {
                var resp = JSON.parse(response),
                      props = {};
                
                for ( var i = 0; i < properties.length; i++ ) {
                    switch ( properties[i] ) {
                        case 'firstName':
                            props[properties[i]] = ( resp.name != undefined ? resp.name.givenName : undefined );
                            break;
                        case 'lastName':
                            props[properties[i]] = ( resp.name != undefined ? resp.name.familyName : undefined );
                            break;
                        case 'photo':
                            props[properties[i]] = ( resp.image != undefined ? resp.image.url : undefined );
                            break;
                        case 'age':
                            props[properties[i]] = ( resp.ageRange != undefined ? resp.ageRange.min : undefined );
                            break;
                        case 'sex':
                            props[properties[i]] = ( resp.gender != undefined ? resp.gender : undefined );
                            break;
                        case 'city':
                            props[properties[i]] = ( resp.placesLived != undefined ? resp.placesLived[0].value : undefined );
                            break;
                        default: break;
                    }
                }
                
                callback( props )
            }
        },
		
		/*userInfoCircles: function( error, status, response, properties, callback ) {
            if ( !error && status == 200 ) {
              
                for ( var i = 0; i < properties.length; i++ ) {
                    switch ( properties[i] ) {
                        case 'circles':
                            usersWithFetchedCirclesList( error, status, response, callback );
                            break;
                        default: break;
                    }
					//тут нужно дописать - сделать алгоритм универсальным для всех полей
                }
				
            }
        },*/
		
		usersWithFetchedCirclesList: function( error, status, response, callback ){
			var dirtyRes = parseDirtyJSON( response.substring( 4 ) ),
                  dirtyCirclesList = Array.isArray( dirtyRes ) ? dirtyRes[0] : dirtyRes,
				  userList = [];
			
            dirtyCirclesList[2].forEach( function( element, index ) {
				userList.push({
					id: element[0][2],
					circles: []
				});
				element[3].forEach( function( elementCircle, indexCircle ) {
					userList[index].circles.push(
						elementCircle[2]
					);
				});
				
            });
			
			callback( userList );
		}
		
    }
})();