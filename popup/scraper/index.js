var scraperPop={};

scraperPop.controlbutton = null;

scraperPop.results = null;

/**
 * CUSMTOM TITLE FOR ERRORS
 */
scraperPop.CUSTOM_TITLE = 'Aviso';

/**
 *  CUSTOM MESSAGE FOR ERRORS
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
 * buildLabelTextField - Build label for a texxtfield
 *
 * @param  {string} title Label
 * @param  {string} forE  For Attribute
 * @param  {string} clss  Label class
 * @param  {string} type  Input type
 * @return {type}       description
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
 * @param  {string}  type       Input Type [text, number, email ... etc]
 * @param  {string}  id         Input ID
 * @param  {string}  name       Input name
 * @param  {boolean} containerFlag  Div container Flag
 * @param  {string}  clss       Any addionatl CSS clases container
 * @param  {string}  value      Input value
 * @return {type}               Input object
 */
scraperPop.buildTextField = function _buildTextField( type, id, name, containerFlag, labelFlag, labelTitle, ctnCssCls, value ) {

	var _class = 'mdl-textfield__input';
	var _type = type || 'text';
	var input = null;
	var _container = containerFlag || true;
	var container = null;
	if ( _type == 'textarea' ) {
		input = document.createElement('textarea');
		input.setAttribute('type', 'text');
		input.setAttribute('rows', '3');
		if ( value ){
			var value = document.createTextNode(value);
			input.appendChild(value);
		}
	} else if ( _type == "tag" ) {
		input = document.createElement('input');
		if ( Array.isArray( value ) ) {
			if ( typeof value [0]  == 'object') {
				value = value.map(function(tag){
					return tag.tag;
				});
			}
			value && input.setAttribute('value', value);
		}
	} else {
		input = document.createElement('input');
		input.setAttribute('type', _type);
		if ( _type == 'checkbox') {
			_class = "mdl-checkbox__input";
		}
		value && input.setAttribute('value', value);
	}
	input.setAttribute('class', _class);
	id && input.setAttribute('id', id);
	name && input.setAttribute('name', name);

	if (_type == 'date' || _type == 'time'){
		labelFlag = false;
	}

	if ( _container && _type != 'hidden') {
		container = this.buildTextFieldContainer(ctnCssCls);
		container.appendChild(input);
		if ( labelFlag ) {
			var label = this.buildLabelTextField(labelTitle, name, null, _type);
			container.appendChild(label);
		}
	} else {
		container = input;
	}

	return container;
}

 /**
  * _buildTextFieldContainerfunction - Build the div container for the text inputs
  *
  * @param  {string} ctnCssCls description
  * @return {div}           Div Container
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
 * buildHeaderTable - Build the header page's extension
 *
 * @return {dom}	<table>
 */
scraperPop.buildHeaderTable = function _buildHeaderTable( ) {
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

	//Action Title
	var strongActionTitle = document.createElement("strong");
	strongActionTitle.setAttribute('style', "margin-top:15px;font-size:14px; color:white; float:right");
	var textnode = document.createTextNode("Evento Nuevo");
	var eventImage = document.createElement('img');
	eventImage.setAttribute('src', '../icons/ic_event_white_24px.svg');
	strongActionTitle.appendChild(eventImage);
	strongActionTitle.appendChild(textnode);

	mainDiv.appendChild(logo);
	mainDiv.appendChild(strongTitle);
	mainDiv.appendChild(strongActionTitle);

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

	//tabs header
	var tabsHeader = document.createElement('div');
	tabsHeader.setAttribute('class', 'mdl-tabs__tab-bar');
	for (var i = 0; i < tabsCount; i++) {
		//<a href="#tab1-panel" class="mdl-tabs__tab is-active">General</a>
		// var _class = 'mdl-tabs__tab' + (i == 0?' is-active':'');
		var _class = 'mdl-tabs__tab';
		var link = document.createElement('a');
		var text = this.TABSTITLE[i];
		var nodeText = document.createTextNode(text);
		link.setAttribute('href', '#tab' + (i+1) + '-panel');
		link.setAttribute('class', _class);
		// link.setAttribute('id', 'linktab' + (i+1));
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

	tabMainContainer.appendChild(submitButton);
	tabDivContainer.appendChild(tabMainContainer);
	return tabDivContainer
}

	/**
	 * scraperPop - Build the success page
	 *
	 * @param  {type} scraper     Scrapper results
	 * @param  {type} showMessage Show indications
	 */
scraperPop.buildSccrapperPageForm = function _buildSccrapperPageForm( scraper, showMessage ) {
	// Create containers
	var arrContainers = this.buildMainContainer();
	var mainDiv = arrContainers[0];
	var main = arrContainers[1];
	var grid = arrContainers[2];

	//Create Table
	var header = this.buildHeaderTable();

	//Create Tab Form
	var tabForms = this.getFormBaseScraperResults(scraper);

	grid.appendChild(header);
	if ( showMessage ) {
		var a = document.createElement('strong');
		a.setAttribute('style', "font-size:12px; color:white;");
		var text = document.createTextNode('Recarga o Usa el Context Menu');
		var logo = document.createElement("img");
		var path = chrome.extension.getURL('../../icons/ic_cached_white_24px.svg')
		logo.setAttribute('src', path);
		logo.setAttribute('border', '0');
		a.appendChild(logo);
		a.appendChild(text);
		grid.appendChild(a);
	}
	grid.appendChild(tabForms);
	main.appendChild(grid);
	mainDiv.appendChild(main);
	document.body.appendChild(mainDiv);


}

/**
	* window|addEventListener - Event when the DOM	is ready for manipulation
	*/
window.addEventListener('DOMContentLoaded', function() {
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
