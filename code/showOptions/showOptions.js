var optionsJS = function() {

	var mainDiv = document.createElement('div');
		mainDiv.className = 'optionsShow';
		document.body.appendChild(mainDiv);
		
	var head = document.createElement('div');
		head.className = 'head';
		mainDiv.appendChild(head);
		
	var icon = document.createElement('div');
		icon.className = 'icon';
		head.appendChild(icon);
		
	var optionsNew = document.createElement('div');
		optionsNew.className = 'optionsNew';
		head.appendChild(optionsNew);
		
	// Выбор языка
	
	var center = document.createElement('div');
		center.className = 'center';
		mainDiv.appendChild(center);
		
	var lang = document.createElement('div');
		lang.className = 'lang';
		center.appendChild(lang);
		
	var langName = document.createElement('div');
		langName.className = 'langName';
		langName.innerHTML = '<h4>Язык</h4>';
		lang.appendChild(langName);
		
	var form = document.createElement('form');
		lang.appendChild(form);
		
	var lineForm = document.createElement('div');
		lineForm.className = 'lineForm';
		form.appendChild(lineForm);
		
	var country = document.createElement("SELECT");
		country.className = 'country';
		lineForm.appendChild(country);
	
	var opt = document.createElement("option");
	var opt1 = document.createElement("option");
		country.appendChild(opt);
		country.appendChild(opt1);
		
		text = document.createTextNode('Russian');
		opt.appendChild(text);
		
		text1 = document.createTextNode('English');
		opt1.appendChild(text1);
		
	// Создание радиобатонов		
		
	var radio = document.createElement('div');
		radio.className = 'radio';
		center.appendChild(radio);
		
	var form1 = document.createElement('form');
		radio.appendChild(form1);
		
	var langName = document.createElement('div');
		langName.className = 'langName';
		langName.innerHTML = '<h4>Запоминание ресурсов загруски данных</h4>';
		form1.appendChild(langName);
			
	var help = document.createElement('div');
		langName.appendChild(help);
		
	var inp = document.createElement('input');
		inp.type = 'radio';
		inp.name = 'answer';
		help.innerHTML = 'Всегда спрашивать о выборе загруски';
		help.appendChild(inp);
		
	var help1 = document.createElement('div');
		langName.appendChild(help1);
	
	var inp1 = document.createElement('input');
		inp1.type = 'radio';
		inp1.name = 'answer';
		help1.innerHTML = 'Использовать только локальные даннык';
		help1.appendChild(inp1);
	
	var help2 = document.createElement('div');
		langName.appendChild(help2);
			
	var inp2 = document.createElement('input');
		inp2.type = 'radio';
		inp2.name = 'answer';
		help2.innerHTML = 'Использовать только актуальные даннык';
		help2.appendChild(inp2);
		
	var input = document.createElement('div');
		input.className = 'input';
		center.appendChild(input);
	
	// Заполнение ресурсов
	
	var form2 = document.createElement('form');
		input.appendChild(form2);
			
	var langName1 = document.createElement('div');
		langName1.className = 'langName';
		langName1.innerHTML = '<h4>Запоминание ресурсов загруски данных</h4>';
		form2.appendChild(langName1);
		
	var country1 = document.createElement('div');
		country1.className = 'country1';
		langName1.appendChild(country1);
		
	var input1 = document.createElement('input');
		input1.size = '40';
		input1.type = 'text';
		country1.appendChild(input1);
				
	// Создаю кнопки обзор, вернутся и применить
	
	var button2 = document.createElement('div');
		button2.className = 'button2';
		langName1.appendChild(button2);
		
	var input2 = document.createElement('input');
		input2.value = 'Обзор';
		input2.type = 'button'
		button2.appendChild(input2);
	
	var button1 = document.createElement('div');
		button1.className = 'button1';
		center.appendChild(button1);
	
	var input3 = document.createElement('input');
		input3.value = 'Вернутся';
		input3.type = 'button';
		button1.appendChild(input3);
	
	var button3 = document.createElement('div');
		button3.className = 'button3';
		center.appendChild(button3);
		
	var input4 = document.createElement('input');
		input4.value = 'Применить';
		input4.type = 'button';
		button3.appendChild(input4);
		
	return mainDiv;
}
	
