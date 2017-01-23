/* event script */

var scraper = {};

scraper.startedUp = function () {
	console.log("scraper startedUp (intalled or updated)");
	scraper.fbRef = 'https://hotleads.firebaseio.com/';
    scraper.scrapeMap = scrapeMap;
};

scraper.installed = function ( details ) {
	console.log("scraper installed");
	console.log(details);
};

scraper.paClicked = function () {
	console.log("page action clicked");
};

scraper.domLoaded = function ( details ) {
	console.log("DOMContentLoaded");
};

scraper.onSubmitProfile = function ( request, sender, sendResponse ) {
	// TODO:  remove, not currently in use

	if (request.scrape) {
		/* TODO: insert into firebase 
		use Firebase's REST api :  get and put
		*/
		var refUrl = scaper.fbRep + request.scrapetype + "/" + request.scrapeUrlB64;
		var scrapeStr = JSON.stringify(request.scrape);
		var x = new XmlHttpRequest();
		x.open('PUT',refUrl,true);
        x.setRequestHeader('Content-type','application/json; charset=utf-8');
        x.setRequestHeader("Content-length", scrapeStr.length);
		x.setRequestHeader("Connection", "close");
		x.onreadystatechange = sendResponse;
		x.send(scrapeStr);
	}
};


scraper.send = function ( data, method, path, next ) {

/*
	var refUrl = scraper.fbRef + request.update.scrapetype + "/" + request.update.id + ".json";
	var scrapeStr = JSON.stringify(request.update.scrape);
	var x = new XMLHttpRequest();
	x.open('PUT',refUrl,true);
	x.setRequestHeader('Content-type','application/json; charset=utf-8');
	x.onreadystatechange = sendResponse;
	x.send(scrapeStr);
*/
	console.log("what are we sending, how and to where?", data, method, path);
	next(null);
};



scraper.patch = function ( patch, fbpath, scrapever, scrapetype, scrapestamp, relations, next ) {
	if (!fbpath || typeof fbpath != 'string') return next("fbpath parameter is a required string.");
	if (!scrapever || typeof scrapever != 'string') return next("scrapever parameter is a required string.");
	if (!scrapetype || typeof scrapetype != 'string') return next("scrapetype parameter is a required string.");
	if (!scrapestamp || typeof scrapestamp != 'number') return next("scrapestamp parameter is a required datestamp integer.");
	if (!items || Object.keys(patch.items).length === 0) return next("items hash is missing or empty.");
	for ( var key in patch.items ) {
		var send_data = {};
		send_data[key] = {};
		var __related__ = null;
		for ( var prop in patch.items[key] ) {
			if (prop == '__related__') {
				__related__ = patch.items[key]['__related__'];
				continue;
			} else {
				send_data[key][prop] = patch.items[key][prop];	
			}
		}
		send_data[key].scrapever = scrapever;
		send_data[key].scrapetype = scrapetype;
		send_data[key].scrapestamp = scrapestamp;
		if (relations) {
			for ( var relation in relations ) {
				send_data[key][relation] = relations[relation];	
			}
		}
		this.send(send_data, "patch", fbpath, function ( error, result ) {
			if (error) {
				console.log("Could not update firebase:", error);
				next(error);
			} else {
				for ( var i = 0; i < __related__.length; i++ ) {
					var inner_relation_key = __related__[i].relation;
					var inner_relation = {};
					inner_relation[inner_relation_key] = key;
					scraper.patch(__related__[i].fbpath, scrapever, scrapetype, scrapesteamp, inner_relation, function ( error, result ) {
						if (error) {
							console.log("An error occurred updating firebase:", error);
						} else {
							console.log("Firebase updated:", result);
						}
					});
				}
				next(null);
			}
		});
	}
};


scraper.requestHandler = function ( request, sender, sendResponse ) {

    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

	switch (true) {

		case ( !!request.popupDOMready ):
			console.log("popupDOMready");
		break;

		case ( !!request.getScrapeMap ):
			chrome.pageAction.show(sender.tab.id);
			sendResponse( { scrapeMap:scraper.scrapeMap } );
		break;

		case ( !!request.patch ) :
			scraper.patch( request.patch, sendResponse );
		break;

		default:
			throw new Error("Request handle not supported: ", request);
	}

  };


chrome.tabs.onUpdated.addListener(scraper.startedUp);
chrome.runtime.onMessage.addListener(scraper.requestHandler);
chrome.runtime.onInstalled.addListener(scraper.installed);
chrome.runtime.onStartup.addListener(scraper.startedUp);
chrome.pageAction.onClicked.addListener(scraper.paClicked);
