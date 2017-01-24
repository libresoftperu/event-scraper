/**
 * eventsHandler - Allow communixation between all the extension's components
 * @author jegj
 */

var eventsHandler = {};

eventsHandler.startedUp = function () {
	console.log("eventsHandler startedUp (intalled or updated)");
	eventsHandler.scrapeMap = scrapeMap;
};

eventsHandler.requestHandler = function ( request, sender, sendResponse ) {


	switch (true) {

		case ( !!request.popupDOMready ):
			console.log("popupDOMready");
			break;

		case ( !!request.getScrapeMap ):
			sendResponse( { scrapeMap : eventsHandler.scrapeMap } );
			break;

		case ( !!request.patch ) :
			console.log(request.patch);
			break;

		default:
			throw new Error("Request handle not supported: ", request);
	}

};

chrome.tabs.onUpdated.addListener(eventsHandler.startedUp);
chrome.runtime.onStartup.addListener(eventsHandler.startedUp);
chrome.runtime.onMessage.addListener(eventsHandler.requestHandler);
