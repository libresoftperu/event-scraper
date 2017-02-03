var scraperPop={};

scraperPop.controlbutton = null;

scraperPop.results = null;

/**
 * CUSMTOM TITLE FOR ERRORS
 */
scraperPop.CUSTOM_TITLE = 'Aviso';

/**
 *	CUSTOM MESSAGE FOR ERRORS
 */
scraperPop.CUSTOM_MESSAGE = 'Hubo un problema con la extension';


/**
 * TABS TITLES
 */
scraperPop.TABSTITLE = ['General', 'Adicional', 'Ubi'];


/**
 * Default CSS class for field containers
 */
scraperPop.DEFAULT_CSS_CLASS_FIELD_CTN = 'full_space_fields';


/**
 * _initFBConfig - Create FB conection
 */
scraperPop.initFBConfig = function _initFBConfig( ) {
	var config = {
		apiKey: "AIzaSyBE-OGoae3FfibNRmmXUTfbftmpVpE2jxQ",
		authDomain: "qchevere-2b000.firebaseapp.com",
		databaseURL: "https://qchevere-2b000.firebaseio.com",
		storageBucket: "qchevere-2b000.appspot.com",
		messagingSenderId: "976081896316"
	};
	firebase.initializeApp(config);
}


/**
 * buildLabelTextField - Build label for a texxtfield
 *
 * @param	{string} title Label
 * @param	{string} forE	For Attribute
 * @param	{string} clss	Label class
 * @param	{string} type	Input type
 * @return {type}			 description
 */
scraperPop.buildLabelTextField = function _buildLabelTextField( title, forE, clss, type ) {

	if ( !forE ) {
		throw new Error('Missing parameter "forE" for label');
	}

	if ( !title ) {
		throw new Error('Missing parameter "title" for label');
	}
	var label = null;
	if ( type == 'checkbox' ) {
		label = document.createElement('span');
		label.setAttribute('class', 'checkbox__label');
		var text = document.createTextNode(title);
		label.appendChild(text);
	} else {
		label = document.createElement('label');
		label.setAttribute('class', 'mdl-textfield__label');
		label.setAttribute('for', forE);
		var text = document.createTextNode(title);
		label.appendChild(text);
	}
	return label;
};




/**
 * buildTextField - Build a input field base
 *
 * @param	{string}	type			 Input Type [text, number, email ... etc]
 * @param	{string}	id				 Input ID
 * @param	{string}	name			 Input name
 * @param	{boolean} containerFlag	Div container Flag
 * @param	{string}	clss			 Any addionatl CSS clases container
 * @param	{string}	value			Input value
 * @return {type}							 Input object
 */
scraperPop.buildTextField = function _buildTextField( type, id, name, containerFlag, labelFlag, labelTitle, ctnCssCls, value ) {

	var _createTagInput = function ___createTagInput(id, name, _value, labelFlag, labelTitle, ctnCssCls){
		var _class = 'mdl-textfield__input';
		var _type = 'text';
		var container = null;
		var input = document.createElement('input');

		_value && input.setAttribute('value', _value);
		_class && input.setAttribute('class', _class);
				id && input.setAttribute('id', id);
			name && input.setAttribute('name', name);
		 _type && input.setAttribute('type', _type);

		if ( Array.isArray( value ) ) {
			if ( typeof value [0]	== 'object') {
				value = value.map(function(tag){
					return tag.tag;
				});
			}
			value && input.setAttribute('value', value);
		}
		container = scraperPop.buildTextFieldContainer(ctnCssCls);
		container.appendChild(input);
		if ( labelFlag ) {
			var label = scraperPop.buildLabelTextField(labelTitle, name, null, _type);
			container.appendChild(label);
		} else {
			container = input;
		}
		return container;
	}

	var _createTextArea = function __createTextArea(id, name, _value, labelFlag, labelTitle, ctnCssCls){
		var _class = 'mdl-textfield__input';
		var _type = 'textarea';
		var container = null;
		var input = document.createElement('textarea');

		_class && input.setAttribute('class', _class);
				id && input.setAttribute('id', id);
			name && input.setAttribute('name', name);
			true && input.setAttribute('type', 'text');
			true && input.setAttribute('rows', '3');

		if ( _value ){
			var value = document.createTextNode(_value);
			input.appendChild(value);
		}

		container = scraperPop.buildTextFieldContainer(ctnCssCls);
		container.appendChild(input);
		if ( labelFlag ) {
			var label = scraperPop.buildLabelTextField(labelTitle, name, null, _type);
			container.appendChild(label);
		} else {
			container = input;
		}
		return container;
	}

	var _createTextInput = function __createTextInput(id, name, _value, labelFlag, labelTitle, ctnCssCls){
		var _class = 'mdl-textfield__input';
		var _type = 'text';
		var container = null;
		var input = document.createElement('input');

		_value && input.setAttribute('value', _value);
		_class && input.setAttribute('class', _class);
				id && input.setAttribute('id', id);
			name && input.setAttribute('name', name);
		 _type && input.setAttribute('type', _type);

		container = scraperPop.buildTextFieldContainer(ctnCssCls);
		container.appendChild(input);
		if ( labelFlag ) {
			var label = scraperPop.buildLabelTextField(labelTitle, name, null, _type);
			container.appendChild(label);
		} else {
			container = input;
		}
		return container;
	}

	var _createCheckBoxInput = function __createCheckBoxInput(id, name, _value, labelFlag, labelTitle, ctnCssCls) {
		var _class = "mdl-checkbox__input";
		var _type = 'checkbox';
		var container = null;
		var input = document.createElement('input');

		_value && input.setAttribute('value', _value);
		_class && input.setAttribute('class', _class);
				id && input.setAttribute('id', id);
			name && input.setAttribute('name', name);
		 _type && input.setAttribute('type', _type);

		container = scraperPop.buildTextFieldContainer(ctnCssCls);
		container.appendChild(input);
		if ( labelFlag ) {
			var label = scraperPop.buildLabelTextField(labelTitle, name, null, _type);
			container.appendChild(label);
		} else {
			container = input;
		}
		return container;
	}

	var _createDateTimeInput = function __createDateTimeInput(id, name, _value, labelFlag, labelTitle, ctnCssCls, type) {
		var _class = 'mdl-textfield__input';
		var _type = type;
		var container = null;
		var input = document.createElement('input');

		_value && input.setAttribute('value', _value);
		_class && input.setAttribute('class', _class);
				id && input.setAttribute('id', id);
			name && input.setAttribute('name', name);
		 _type && input.setAttribute('type', _type);
		container = scraperPop.buildTextFieldContainer(ctnCssCls);
		container.appendChild(input);
		return container;
	}

	var _createHiddenInput = function __createHiddenInput(id, name, _value, labelFlag, labelTitle, ctnCssCls) {
		var _class = 'mdl-textfield__input';
		var _type = 'hidden';
		var container = null;
		var input = document.createElement('input');

		_value && input.setAttribute('value', _value);
		_class && input.setAttribute('class', _class);
				id && input.setAttribute('id', id);
			name && input.setAttribute('name', name);
		 _type && input.setAttribute('type', _type);

		return input;
	}

	switch (true) {
		case type == 'text':
			return _createTextInput(id, name, value, true, labelTitle, ctnCssCls);
			break;
		case type == 'textarea':
			return _createTextArea(id, name, value, true, labelTitle, ctnCssCls);
			break;
		case type == 'tag':
			return _createTagInput(id, name, value, true, labelTitle, ctnCssCls);
			break;
		case type == 'checkbox':
			return _createCheckBoxInput(id, name, value, true, labelTitle, ctnCssCls);
			break;
		case type == 'time' || type == 'date':
			return _createDateTimeInput(id, name, value, false, null, ctnCssCls, type);
			break;
		case type == 'hidden':
			return _createHiddenInput(id, name, value, false, null, ctnCssCls);
			break;
		default:
			return _createTextInput(id, name, value, true, labelTitle, ctnCssCls);
			break;
	}
}

 /**
	* _buildTextFieldContainerfunction - Build the div container for the text inputs
	*
	* @param	{string} ctnCssCls description
	* @return {div}					 Div Container
	*/
scraperPop.buildTextFieldContainer = function _buildTextFieldContainerfunction ( ctnCssCls ) {
	var div = document.createElement('div');
	var _ctnCssCls = ctnCssCls || this.DEFAULT_CSS_CLASS_FIELD_CTN;
	var _class = 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label ' + _ctnCssCls;
	div.setAttribute('class', _class);
	return div;
}

/**
	* buildMessage - Build error message box
	* @param	{string} title Custom title on the box
	* @param	{string} msg Custom message on the box
	*/
scraperPop.buildMessage = function _buildMessage( title, msg, type ) {
	var _type = null;
	var arrTypes = [
		'info',
		'error',
		'warning',
		'success'
	];

	if ( arrTypes.indexOf(type) < 0 || !type) {
		_type = 'warning';
	} else {
		_type = type;
	}

	var _title = title || this.CUSTOM_TITLE;
	var _message = msg || this.CUSTOM_MESSAGE;

	var div = document.createElement("div");

	var h3 = document.createElement("h3");
	h3.setAttribute("style", "color:white;");
	var textnode = document.createTextNode(_title);
	h3.appendChild(textnode);

	var message = document.createElement("p");
	textnode = document.createTextNode(_message);
	message.appendChild(textnode);

	div.setAttribute('class', 'message ' + _type);
	div.appendChild(h3);
	div.appendChild(message);
	return div;
}


/**
 * buildMainContainer - Build the main container's extension
 *
 * @return {array}	[mainDiv, main, grid]
 */
scraperPop.buildMainContainer = function () {

	// Create main div
	var mainDiv = document.createElement('div');
	mainDiv.setAttribute('class', 'mdl-layout__container');

	// Create main tag
	var main = document.createElement('main');
	main.setAttribute('class', 'mdl-layout__content');

	// Create grid div
	var grid = document.createElement('div');
	grid.setAttribute('class', 'mdl-grid');

	return [mainDiv, main, grid];
}

 /**
	* _buildHeaderTable - Build the header page's extension
	*
	* @param	{boolean} skipTitle Flag to skip the title on right corner
	* @return {header}						Extension's header
	*/
scraperPop.buildHeaderTable = function _buildHeaderTable( skipTitle ) {
	var mainDiv = document.createElement('div');
	mainDiv.setAttribute( 'class', 'mdl-cell mdl-cell--12-col no-left-right-margin');

	//logo
	var logo = document.createElement("img");
	var path = chrome.extension.getURL('../icons/icon48.png')
	logo.setAttribute('src', path);
	logo.setAttribute('alt', "Q'chevere Logo");
	logo.setAttribute('title', "Q'chevere");
	logo.setAttribute('border', '0');

	//Title
	var strongTitle = document.createElement("strong");
	strongTitle.setAttribute('style', "font-size:18px; color:white;");
	var textnode = document.createTextNode("Q'chevere");
	strongTitle.appendChild(textnode);

	mainDiv.appendChild(logo);
	mainDiv.appendChild(strongTitle);

	//Action Title
	if ( !skipTitle ) {
		var strongActionTitle = document.createElement("strong");
		strongActionTitle.setAttribute('style', "margin-top:15px;font-size:14px; color:white; float:right");
		var textnode = document.createTextNode("Evento Nuevo");
		var eventImage = document.createElement('img');
		eventImage.setAttribute('src', '../icons/ic_event_white_24px.svg');
		strongActionTitle.appendChild(eventImage);
		strongActionTitle.appendChild(textnode);
		mainDiv.appendChild(strongActionTitle);
	}

	return mainDiv;
}


/**
 * getFormBaseScraperResults - Create the form base on the fields scrappers
 *
 * @param	{objects} scraper All the data from the web page
 * @return {form}						 Form base on the fields
 */
scraperPop.getFormBaseScraperResults = function _getFormBaseScraperResults( scraper ){
	var tabsCount = this.TABSTITLE.length;

	//div container
	var tabDivContainer = document.createElement('div');
	tabDivContainer.setAttribute('class', 'mdl-cell mdl-cell--12-col');
	tabDivContainer.setAttribute('style', 'width:100%;');
	tabDivContainer.setAttribute('id', 'main-cell');

	//main container
	var tabMainContainer = document.createElement('main');
	tabMainContainer.setAttribute('class', 'mdl-layout__content');

	//tabs
	var tabsDiv = document.createElement('div');
	tabsDiv.setAttribute('class', 'mdl-tabs mdl-js-tabs');
	tabsDiv.setAttribute('id', 'tabs-ext');

	//tabs header
	var tabsHeader = document.createElement('div');

	//HACKE FOR RENDER TABS CORRECTLY
	tabsHeader.setAttribute('class', 'mdl-tabs__tab-bar');
	componentHandler.upgradeElement(tabsHeader);

	for (var i = 0; i < tabsCount; i++) {
		var _class = 'mdl-tabs__tab';
		var link = document.createElement('a');
		var text = this.TABSTITLE[i];
		var nodeText = document.createTextNode(text);
		link.setAttribute('href', '#tab' + (i+1) + '-panel');
		link.setAttribute('class', _class);
		link.appendChild(nodeText);
		tabsHeader.appendChild(link);
	}

	tabsDiv.appendChild(tabsHeader);
	var separator = document.createElement('p');
	tabsDiv.appendChild(separator);
	for (var ii = 0; ii < tabsCount; ii++) {

		var _class = 'mdl-tabs__panel' + (ii == 0?' is-active':'');
		var tabContentContainer = document.createElement('div');
		tabContentContainer.setAttribute('class', _class);
		tabContentContainer.setAttribute('id', 'tab' + (ii+1) + '-panel');
		var form = document.createElement('form');
		form.setAttribute('action', '#');
		form.setAttribute('class', 'add-event-form');

		var eventProperties = eventSchema.properties["tab" + (ii+1)];
		var propKeys = Object.keys(eventProperties);

		for (var j = 0; j < propKeys.length; j++) {
			var value = null;
			if ( scraper && scraper.patch && scraper.patch.items ){
				value = scraper.patch.items[propKeys[j]]
			}
			var prop = eventProperties[propKeys[j]];

			// type - id - name - flagcontainer - flaglabel, labeltitle
			var field = this.buildTextField(
				prop.type,
				prop.id,
				prop.name,
				true,
				true,
				prop.label,
				prop.cls,
				value
			);
			form.appendChild(field);
		}
		tabContentContainer.appendChild(form);
		tabsDiv.appendChild(tabContentContainer);
	}

	tabMainContainer.appendChild(tabsDiv);

	var submitButton = document.createElement('button');
	submitButton.setAttribute(
		'class',
		'full_space_fields mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--cyan-500 mdl-color-text--white'
	);
	var submitImage = document.createElement('img');
	submitImage.setAttribute('src', '../icons/ic_event_white_24px.svg');

	var text = document.createTextNode('Agregar Evento');
	submitButton.appendChild(submitImage);
	submitButton.appendChild(text);

	// Add click event to save event button
	submitButton.addEventListener("click", function(){
		submitButton.setAttribute('disabled', true);
		var data = scraperPop.getFormsData();
		if ( scraperPop.validate( data ) ){
			var resultPromise = scraperPop.saveEvent(data);
			resultPromise.then( function(){
				scraperPop.buildPageEventAdded();
			}, function(error){
				alert('Problem saving information on firebase, check console');
				console.error(error);
			});
		}
	});

	tabMainContainer.appendChild(submitButton);
	tabDivContainer.appendChild(tabMainContainer);
	return tabDivContainer
}


/**
 * _buildPageEventAdded - Build Succed Added Event Page
 *
 * @return {type}	description
 */
scraperPop.buildPageEventAdded = function _buildPageEventAdded() {
	// Create containers
	var arrContainers = this.buildMainContainer();
	var mainDiv = arrContainers[0];
	var main = arrContainers[1];
	var grid = arrContainers[2];

	grid.className = grid.className + ' mdl-grid-event-added';

	//Create Header
	var header = this.buildHeaderTable( true );

	var message = document.createElement('strong');
	message.setAttribute('style', "font-size:18px; color:white;");
	var text = document.createTextNode('Evento Agregado');

	var logo = document.createElement("img");
	var path = chrome.extension.getURL('../../icons/ic_done_white_32px.svg');
	logo.setAttribute('src', path);
	logo.setAttribute('border', '0');

	message.appendChild(logo);
	message.appendChild(text);
	grid.appendChild(header);
	grid.appendChild(message);
	main.appendChild(grid);
	mainDiv.appendChild(main);
	document.body.innerHTML = "";
	document.body.className = 'event-added';
	document.body.appendChild(mainDiv);
	var html =document.getElementsByTagName('html')[0]
	html.setAttribute('style', 'height:150px');
	componentHandler.upgradeElement(html);
}

	/**
	 * scraperPop - Build the success page
	 *
	 * @param	{type} scraper		 Scrapper results
	 * @param	{type} showMessage Show reload flag
	 */
scraperPop.buildSccrapperPageForm = function _buildSccrapperPageForm( scraper, showMessage ) {
	// Create containers
	var arrContainers = this.buildMainContainer();
	var mainDiv = arrContainers[0];
	var main = arrContainers[1];
	var grid = arrContainers[2];

	//Create Header
	var header = this.buildHeaderTable();

	//Create Tab Form
	var tabForms = this.getFormBaseScraperResults(scraper);

	grid.appendChild(header);
	if ( showMessage ) {
		var a = document.createElement('strong');
		a.setAttribute('style', "font-size:12px; color:white;");
		var text = document.createTextNode('Recarga la pagina o usa el Context Menu');
		var logo = document.createElement("img");
		var path = chrome.extension.getURL('../../icons/ic_cached_white_24px.svg')
		logo.setAttribute('src', path);
		logo.setAttribute('border', '0');
		a.appendChild(logo);
		a.appendChild(text);
		grid.appendChild(a);
	}
	componentHandler.upgradeElement(tabForms);
	grid.appendChild(tabForms);
	main.appendChild(grid);
	mainDiv.appendChild(main);
	componentHandler.upgradeElement(mainDiv);
	document.body.appendChild(mainDiv);

	//HACK FOR RENDER TABS CORRECTLY WITH MDL
	var tab = document.getElementById('tabs-ext');
	componentHandler.downgradeElements(tab);
	componentHandler.upgradeElement(tab);
	var divcont = document.getElementsByClassName('mdl-js-textfield');
	var divcontlength = divcont.length;
	for (var i = 0; i < divcontlength; i++) {
		componentHandler.upgradeElement(divcont[i]);
	}
	var labelcont = document.getElementsByClassName('mdl-textfield__label');
	var labelcontlength = labelcont.length;
	for (var i = 0; i < labelcontlength; i++) {
		componentHandler.upgradeElement(labelcont[i]);
	}
}


/**
 * _getFormsData - Get Event Data from forms
 *
 * @return {object}	Event Object
 */
scraperPop.getFormsData = function _getFormsData() {
	var tabsCount = this.TABSTITLE.length;
	var data = {};
	for (var i = 0; i < tabsCount; i++) {
		var eventProperties = eventSchema.properties["tab" + (i+1)];
		var propKeys = Object.keys(eventProperties);
		for (var j = 0; j < propKeys.length; j++) {
			var prop = eventProperties[propKeys[j]];
			var type = prop.type;
			var id = prop.id;

			if (!id) {
				throw new Error('No id specified on schema/form for');
			}

			var input = document.getElementById(id);

			switch (true) {
				case	['text', 'hidden', 'number','textarea', 'time', 'date', 'tag' ].indexOf(type) >= 0:
					data[id] = input.value;
					break;
				case type == 'checkbox':
					data[id] = input.checked;
					break;
				default:
					data[id] = input.value;
					break;
			}
		}
	}
	return data;
}

/**
 * _validate - Validate event's data
 */
scraperPop.validate = function _validate() {
	//TODO ADD VALIDATIONS TO EVENT OBJECT
	return true;
}

 /**
	* _saveEvent - Save the event on firebase DB
	*
	* @param	{object} data Event Data
	* @return {type}			description
	*/
scraperPop.saveEvent = function _saveEvent( postData ) {
	var newEventKey = firebase.database().ref().child('events').push().key;
	var updates = {};
	updates['/events/' + newEventKey] = postData;
	return firebase.database().ref().update(updates);
}

/**
	* window|addEventListener - Event when the DOM	is ready for manipulation
	*/
window.addEventListener('DOMContentLoaded', function() {
	//Init firebase configuration
	scraperPop.initFBConfig();
	//Get scrapper info
	chrome.tabs.query( { active: true, currentWindow: true }, function ( tabs ) {
		chrome.tabs.sendMessage( tabs[0].id, true, function(res){
				if ( res ) {
					scraperPop.buildSccrapperPageForm(res.results.scraper, false);
				} else {
					scraperPop.buildSccrapperPageForm(null, true);
				}
		});
	});
});
