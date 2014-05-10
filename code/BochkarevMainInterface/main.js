
$(function() {
	$('.options').toggle(function () {
		$('#main').hide(500);
		$('#optionsShow').show(500); 
	},
	function () {
		$('#main').hide(500);
		$('#optionsShow').show(500); 
	});
});

$(function () {
	$('.button1').click(function () {
		$('#optionsShow').hide(500);
		$('#main').show(500); 
	});
});	

$(function () {
	$('div.show_popup').click(function () {
		$('div.'+$(this).attr("rel")).show();
		$('body').append("<div id='overlay'></div>");
		$('#overlay').show().css({'filter' : 'alpha(opacity=80)'});
		return false;				
	});	
	$('a.close').click(function () {
		$(this).parent().hide();
		$('#overlay').remove('#overlay');
		return false;
	});
});	

function addElement () {
	var windowRight = 1;
	var	windowLeft = 2;
	
	var winLeft = document.createElement('div');
		winLeft.innerHTML = windowLeft;
	
	var divRight = document.getElementById('left');	
		divRight.innerHTML = '';
		divRight.appendChild(winLeft);
	
	var winRight = document.createElement('div');
		winRight.innerHTML = windowRight;

	var divLift = document.getElementById('right');	
		divLift.innerHTML = '';
		divLift.appendChild(winRight);
};