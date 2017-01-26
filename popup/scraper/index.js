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
 * buildLabelTextField - Build label for a texxtfield
 *
 * @param  {string} title description
 * @param  {string} forE  description
 * @param  {string} clss  description
 * @return {type}       description
 */
scraperPop.buildLabelTextField = function _buildLabelTextField( title, forE, clss ) {

	if ( !forE ) {
		throw new Error('Missing parameter "forE" for label');
	}

	if ( !title ) {
		throw new Error('Missing parameter "title" for label');
	}

	var label = document.createElement('label');
	label.setAttribute('class', 'mdl-textfield__label');
	label.setAttribute('for', forE);
	var text = document.createTextNode(title);
	label.appendChild(text);
	return label;
};

/**
 * buildTextField - Build a input field base
 *
 * @param  {string}  clss       Any addionatl CSS clases
 * @param  {string}  type       Input Type [text, number, email ... etc]
 * @param  {string}  id         Input ID
 * @param  {string}  name       Input name
 * @param  {boolean} container  Div container Flag
 * @return {type}               Input object
 */
scraperPop.buildTextField = function _buildTextField( clss, type, id, name, container, label, labelTitle ) {

	var _class = 'mdl-textfield__input';
	var _type = type || 'text';
	var input = document.createElement('input');
	var _container = container || true;
	var container = null;
	input.setAttribute('class', _class);
	input.setAttribute('type', _type);
	id && input.setAttribute('id', id);
	name && input.setAttribute('name', name);

	if ( _container && _type != 'hidden') {
		container = this.buildTextFieldContainer();
		container.appendChild(input);
		if ( label ) {
			var label = this.buildLabelTextField(labelTitle, name, null);
			container.appendChild(label);
		}

	} else {
		container = input;
	}

	return container;
}

/**
 * buildTextFieldContainer - Build the div container for the text inputs
 *
 * @return {div}  Div
 */
scraperPop.buildTextFieldContainer = function _buildTextFieldContainerfunction ( ) {
	var div = document.createElement('div');
	div.setAttribute('class', 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label');
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
scraperPop.buildHeaderTable = function _buildHeaderTable( user ) {
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

	if ( user ) {
		//profile
		var strongProfile = document.createElement("a");
		strongProfile.setAttribute('href', '#');
		strongProfile.setAttribute('class', 'settings-link');
		strongProfile.setAttribute('title', 'Usuario');
		var logoProfile = document.createElement("img");
		var path = chrome.extension.getURL('../icons/ic_perm_identity_white_24px.svg');
		logoProfile.setAttribute('src', path);
		logoProfile.setAttribute('border', '0');

		var textName = document.createTextNode('jegj');

		strongProfile.appendChild(logoProfile);
		strongProfile.appendChild(textName);

		//

		mainDiv.appendChild(strongProfile);
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
	var form = document.createElement('form');
	form.setAttribute('action', '#');
	form.setAttribute('class', 'add-event-form');

	console.log('---->', scraper);

	var eventProperties = eventSchema.properties;

	var eventShowProperties = eventSchema.show;

	var propKeys = Object.keys(eventProperties);

	for (var i = 0; i < propKeys.length; i++) {
		var prop = eventProperties[propKeys[i]];
		// class - type - id - name - flagcontainer - flaglabel, labeltitle
		var field = this.buildTextField(
			null,
			prop.type,
			prop.id,
			prop.name,
			true,
			true,
			prop.label
		);
		form.appendChild(field);
	}

	// Submit Button
	var separator = document.createElement('p');
	var submitButton = document.createElement('button');
	submitButton.setAttribute(
		'class',
		'add-event-button mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--cyan-500 mdl-color-text--white'
	);
	var submitImage = document.createElement('img');
	submitImage.setAttribute('src', '../icons/ic_event_white_24px.svg');

	var text = document.createTextNode('Agregar Evento');

	submitButton.appendChild(submitImage);
	submitButton.appendChild(text);

	form.appendChild(separator);
	form.appendChild(submitButton);

	return form;

}

/**
	* buildSuccessPage - Build the success page
	* @param {object} All the information on the page
	*/
scraperPop.buildSccrapperPageForm = function( scraper ) {

	// Add custom css class to error page
	document.body.className = "add-event-page";

	// Create containers
	var arrContainers = this.buildMainContainer();
	var mainDiv = arrContainers[0];
	var main = arrContainers[1];
	var grid = arrContainers[2];

	//TODO GET USER
	var user = true;

	//Create Table
	var header = this.buildHeaderTable( user );

	//Create form
	var form = this.getFormBaseScraperResults(scraper);

	grid.appendChild(header);
	grid.appendChild(form);
	main.appendChild(grid);
	mainDiv.appendChild(main);
	document.body.appendChild(mainDiv);
}

/**

	* buildErrorPage - Build the error page
	*/
scraperPop.buildErrorPageScrapper = function(	) {

	// Add custom css class to error page
	document.body.className = "errorpage";

	//Create Separator
	var separator = document.createElement("p");

	//Create Table
	var table = this.buildHeaderTable();

	var messageBox = this.buildMessage(
		'Oops',
		'Solo podemos extraer informacion de los eventos de: Facebook, MeetUp y EventBride',
		'warning'
	)

	document.body.appendChild(table);
	document.body.appendChild(separator);
	document.body.appendChild(messageBox);
}

/**
	* window|addEventListener - Event when the DOM	is ready for manipulation
	*/
window.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.query( { active: true, currentWindow: true }, function ( tabs ) {
		chrome.tabs.sendMessage( tabs[0].id, true, function(res){
			if ( res && res.showForm ) {
				console.log('Resultado --->', res.results.scraper);
				scraperPop.buildSccrapperPageForm(res.results.scraper);
			} else {
				scraperPop.buildErrorPageScrapper();
			}
		});
	});
});
