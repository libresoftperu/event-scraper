var scraperPop={};

scraperPop.controlbutton = null;

scraperPop.results = null;

scraperPop.CUSTOM_TITLE = 'Aviso';

scraperPop.CUSTOM_MESSAGE = 'Hubo un problema con la extension';


/**
 * buildCustomTextField - Build the custom text field with the custom css class
 *
 * @param  {string} class Any addionatil css class
 * @return {input}       input
 */
scraperPop.buildCustomTextField = function ( aclass, type, id, name ) {

	var _class = 'mdl-textfield__input' + aclass?(' ' + aclass):'';
	var _type = type || 'text'
	var input = document.createElement(input);
	input.setAttribute('class', _class);
	input.setAttribute('type', _type);
	id && input.setAttribute('id', id);
	name && input.setAttribute('name', _name);
	return input;
}

/**
 * buildCustomTextFieldContainer - Build the div container for the text inputs
 *
 * @return {div}  Div
 */
scraperPop.buildCustomTextFieldContainer = function ( ) {
	var div = document.createElement('div');
	div.setAttribute('class', 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label');
	return div;
}

/**
	* buildMessage - Build error message box
	* @param	{string} title Custom title on the box
	* @param	{string} msg Custom message on the box
	*/
scraperPop.buildMessage = function ( title, msg, type ) {
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
scraper.buildMainContainer = function () {

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
scraperPop.buildHeaderTable = function ( ) {
	var table = document.createElement("table");
	table.setAttribute('width', '100%');

	var tbody = document.createElement("tbody");

	var row = document.createElement("tr");

	var col1 = document.createElement("td");
	var logo = document.createElement("img");
	var path = chrome.extension.getURL('../icons/icon48.png')
	logo.setAttribute('src', path);
	logo.setAttribute('alt', "Q'chevere Logo");
	logo.setAttribute('title', "Q'chevere");
	logo.setAttribute('border', '0');
	col1.appendChild(logo);

	var col2 = document.createElement("td");
	col2.setAttribute('align', 'center');
	var strongTitle = document.createElement("strong");
	strongTitle.setAttribute('style', "font-size:18px; color:white;");
	var textnode = document.createTextNode("Q'chevere");
	strongTitle.appendChild(textnode);
	col2.appendChild(strongTitle);

	row.appendChild(col1);
	row.appendChild(col2);

	tbody.appendChild(row);

	table.appendChild(tbody);

	return table;
}


/**
 * getFormBaseScraperResults - Create the form base on the fields scrappers
 *
 * @param	{objects} scraper All the data from the web page
 * @return {form}						 Form base on the fields
 */
scraperPop.getFormBaseScraperResults = function ( scraper ){
	var form = document.createElement('form');
	form.setAttribute('action', '#');

	var div = this.buildCustomTextFieldContainer();

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

	//Create Table
	var table = this.buildHeaderTable();

	//Create form
	var form = this.getFormBaseScraperResults(scraper);

	grid.appendChild(table);

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
				// console.log('--->', eventSchema);
				scraperPop.buildSccrapperPageForm(res.results.scraper);
			} else {
				scraperPop.buildErrorPageScrapper();
			}
	});

});
