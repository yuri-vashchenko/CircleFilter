function Main() {
    
    var revoke_button = document.querySelector('#revoke');
    revoke_button.addEventListener( 'click', function() { GPlus.revokeToken( closeWindow ); } );
    
    GPlus.getUserEmail( putUserEmail );
    
    var filter = new Filter( document.querySelector('.left-sidebar'), document.querySelector( '.content>div' ) );
 	
	(function($) {
	$.fn.pageFun = function(options) {
		var opts = $.extend({}, $.fn.pageFun.defaults, options);
		return this.each(function() {
			$this = $(this);
			var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
			var selectedPage = o.start;
			$.fn.draw(o, $this, selectedPage);	
		});
	};
	
	var outSide = 0;
	var insId = 0;
	var bName = navigator.appName;
	var bVer = navigator.appVersion;
	if(bVer.indexOf('MSIE 7.0') > 0)
		var ver = "ie7";
	
	$.fn.draw = function(o, obj, selectedPage) {
		if(o.display > o.count)
			o.display = o.count;
		$this.empty();
		var first = $(document.createElement('a')).addClass('pageFirst').html('First');
		if(o.rotate) {
			if(o.images) 
				var rotLeft = $(document.createElement('span')).addClass(spreviousclass);
			else 
				var rotLeft = $(document.createElement('span')).addClass(spreviousclass).html('&laquo;');		
		}
		
		var divLeft = $(document.createElement('div')).addClass('pageControlBack');
			divLeft.append(first).append(rotLeft);
		var ulDiv = $(document.createElement('div')).css('overflow','hidden');
		var ul = $(document.createElement('ul')).addClass('pages')
		var selobj;
		
		for(var i = 0; i < o.count; i++) {
			var val = i + 1;
			if(val == selectedPage) {
				var obj = $(document.createElement('li')).html('<span class="pagCurrent">'+val+'</span>');
				selobj = obj;
				ul.append(obj);
			}	
			else {
				var obj = $(document.createElement('li')).html('<a>'+ val +'</a>');
				ul.append(obj);
			}				
		}		
		ulDiv.append(ul);//Добавляю цифры
		
		if(o.rotate) {
			if(o.images) 
				var rotRight = $(document.createElement('span')).addClass(snextclass);
			else 
				var rotRight = $(document.createElement('span')).addClass(snextclass).html('&raquo;');
		}
		
		var last = $(document.createElement('a')).addClass('pagLast').html('Last');
		var divRight = $(document.createElement('div')).addClass('pagControlFront');
		divRight.append(rotRight).append(last);
		$this.addClass('paginate').append(divLeft).append(ulDiv).append(divRight);
		
		//Добовляю стили		
		if(!o.border){
			if(o.backgroundСolor == 'none') 
				var aCss = {'color':o.textColor};
			else 
				var aCss = {'color':o.textColor,'background-color':o.backgroundСolor};
			if(o.backgroundHoverColor == 'none')	
				var hoverCss = {'color': o.textHoverColor};
			else 
				var hoverCss = {'color': o.textHoverColor,'background-color':o.backgroundHoverColor};	
		}	
		else {
			if(o.backgroundСolor == 'none') 
				var aCss = {'color': o.textColor,'border': '1px solid ' + o.borderColor};
			else 
				var aCss = {'color': o.textColor, 'background-color': o.backgroundСolor,'border':'1px solid '+o.borderColor};
			if(o.backgroundHoverColor == 'none')	
				var hoverCss = {'color': o.textHoverColor,'border':'1px solid '+o.borderHoverColor};
			else 
				var hoverCss = {'color': o.textHoverColor,'background-color':o.backgroundHoverColor,'border':'1px solid '+o.borderHoverColor};
		}
			
		$.fn.applyStyle(o,$this,aCss,hoverCss,first,ul,ulDiv,divRight);
		//Рассчитать ширину
		var outsidewidth = outSide - first.parent().width() - 3;
		if(ver == 'ie7') {
			ulDiv.css('width', outsidewidth+72+'px');
			divRight.css('left', outSide+6+72+'px');
		}
		else { 
			ulDiv.css('width', outsidewidth+'px');
			divRight.css('left', outSide+6+'px');
		}
		
		//Начало и конец
		first.click(function(e) {
				ulDiv.animate({scrollLeft: '0px'});
				ulDiv.find('li').eq(0).click();
		});
		
		last.click(function(e) {
				ulDiv.animate({scrollLeft: insId + 'px'});
				ulDiv.find('li').eq(o.count - 1).click();
		});
		//******************************************************************
		
		//Отображение на странице
		ulDiv.find('li').click(function(e) {
			selobj.html('<a>'+selobj.find('.pagCurrent').html()+'</a>'); 
			var currval = $(this).find('a').html();
			$(this).html('<span class="pagCurrent">'+currval+'</span>');
			selobj = $(this);
		
			//Возврощаю активность кнопкам
			$.fn.applyStyle(o, $(this).parent().parent().parent(), aCss, hoverCss, first, ul, ulDiv, divRight);	
			var left = (this.offsetLeft) / 2;
			var left2 = ulDiv.scrollLeft() + left;
			var tmp = left - (outsidewidth / 2);
			ulDiv.animate({scrollLeft: left + tmp - first.parent().width() + 'px'});	
			o.onChange(currval);	
		});
		
		var last = ulDiv.find('li').eq(o.start-1);
			last.attr('id','tmp');
		var left = document.getElementById('tmp').offsetLeft / 2;
			last.removeAttr('id');
		var tmp = left - (outsidewidth / 2);
		if(ver == 'ie7') 
			ulDiv.animate({scrollLeft: left + tmp - first.parent().width() + 52 + 'px'});	
		else 
			ulDiv.animate({scrollLeft: left + tmp - first.parent().width() + 'px'});	
	}
	
	$.fn.applyStyle = function(o, obj, aCss, hoverCss, first, ul, ulDiv, divRight) {
					obj.find('a').css(aCss);
					obj.find('span.pagCurrent').css(hoverCss);
					obj.find('a').hover(/*Подсветка цифор*/
					function() {
						$(this).css(hoverCss);
					},
					function() {
						$(this).css(aCss);
					}
					);
					obj.css('paddingLeft', first.parent().width() + 5 +'px');
					insId = 0;
					obj.find('li').each(function(i, n){
						if(i == (o.display - 1)) {
							outSide = this.offsetLeft + this.offsetWidth ;
						}
						insId += this.offsetWidth;
					})
					ul.css('width', insId + 'px');
	}
})(jQuery);

$(function() {	
			$("#show").pageFun({
				count: 10,
				start: 1,
				display: 10,
				border: true,
				borderColor: '#fff',
				textColor: '#fff',
				backgroundСolor: 'black',	
				borderHoverColor: '#ccc',
				textHoverColor: '#000',
				backgroundHoverColor: '#fff', 
				images: false,
				mouse: 'press',
				onChange: function(page) {
					if(page == 1) {
						for ( var i = 0; i < 5; i++ ) {
							filter.result.append( new User ( i, 'Имя' + i, 'Фамилия' + i ) );
						}
					}
					else if(page == 2) {
						for ( var i = 6; i < 11; i++ ) {
							filter.result.append( new User ( i, 'Имя' + i, 'Фамилия' + i ) );
						}	
					}
				}
			});
		});
		
    function putUserEmail( error, status, response ) {
        if ( !error && status == 200 ) {            
            var userEmailBlock = document.querySelector('#user-email');
            userEmailBlock.textContent = JSON.parse( response ).email;
        }
    }
    
    function print( error, status, response ) {
        if ( !error && status == 200 ) {            
            return console.log(JSON.parse( response ));
        }
    }    
};
window.onload = Main;