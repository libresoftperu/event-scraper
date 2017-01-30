/**
	* scraper - allow to scrap Facebook, Meetup and EventBride events
	* @author: jegj
	*/

var scraper = {};

scraper.ptypeEnum = {
	FACEBOOK : "facebook",
	MEETUP : "meetup",
	EVENTBRIDE : "eventbride"
};

scraper.isProfile = null;

scraper.profileId = null;

scraper.results = null;


/**
 * scraper - set all the details that are needed before the scraper
 *
 */
scraper.init = function() {
	if (window == top) {

		console.log('Scraper|init');
		this.isProfile = this.getProfileType();

		if ( this.isProfile ) {

			chrome.runtime.sendMessage( { "getScrapeMap":scraper.isProfile }, function (response) {
				if (response && response.scrapeMap) {
					scraper.scrapeMap = response.scrapeMap;
				}
			});

		}

	}
}


/**
	* getProfileType - Get the profile type of the current page
	* @return {retVal}	Profile Type (facebook, meetup or eventbrite, null otherwise)
	*/
scraper.getProfileType = function () {
	var rx = /facebook.com|meetup.com|eventbrite.es/;
	var retVal = null;
	var pathname = window.location.pathname;
	switch ( window.location.host.match(rx)[0] ) {

		case "facebook.com" :
			switch ( true ) {
				case !!( pathname.match("/events/") ) :
					retVal = this.ptypeEnum.FACEBOOK;
			}
			return retVal;

		case "meetup.com" :
			switch ( true ) {
				case !!( pathname.match("/events/") ) :
					retVal = this.ptypeEnum.MEETUP;
			}
			return retVal;

		case "eventbrite.es" :
			switch ( true ) {
				case !!( pathname.match("/e/") ) :
					retVal = this.ptypeEnum.EVENTBRIDE;
			}
			return retVal;

		default:
			return null;
	}
};


/**
	* getRoutedScraper -Get the routes that are going to scraping
	*
	* @param  {object} routes scraperMap
	* @return {object}        description
	*/
scraper.getRoutedScraper = function _getRoutedScraper( routes ) {
	for (var route in routes) {
		if (window.location.pathname.match(route)) {
			if (typeof routes[route] == 'string') {
				// a pointer to another route
				return routes[routes[route]];
			} else {
				return routes[route];
			}
		}
	}
	return null;
};


/**
	* expand - Expand base on xpath
	*
	* @param  {type} xpath Expander's Xpath
	*/
scraper.expand = function ( xpath ) {
	var expanders = document.evaluate(xpath,document,null,4);
	var expander;
	do {
		expander = expanders.iterateNext();
		if (expander) expander.click();
	}
	while (expander);
};


/**
	* runExpanders - Expand all the expanders in the scraperMap
	*
	* @param  {array} All the expanders presents on the page
	*/
scraper.runExpanders = function ( expanders ) {
	for (var i = 0; i < expanders.length; i++) {
		scraper.expand(expanders[i]);
	}
}


/**
 * anonymous function - description
 *
 * @param  {type} str description
 * @return {type}     description
 */
scraper.keyify = function ( str ) {
	// remove spaces, punctuation, diacritics
	// TODO: add diacritic substition
	return lexo.lexo( str, false, false );
	//return str.replace(/[^\w]/gi,'');
};


/**
 * anonymous function - description
 *
 * @param  {type} str description
 * @return {type}     description
 */
scraper.phonicify = function ( str ) {
	// double metaphone
	return dmeta.encode(str)[0];
};


/**
 * anonymous function - description
 *
 * @param  {type} url description
 * @return {type}     description
 */
scraper.urlparser = function ( url ) {
	var parser = document.createElement("a");
	parser.href = url;
	var searchObject = {}, queries, split, i;
	queries = parser.search.replace(/^\?/, '').split('&');
	for( i = 0; i < queries.length; i++ ) {
		split = queries[i].split('=');
		searchObject[split[0]] = split[1];
	}
	return {
		protocol: parser.protocol,
		host: parser.host,
		hostname: parser.hostname,
		port: parser.port,
		pathname: parser.pathname,
		search: parser.search,
		searchObject: searchObject,
		hash: parser.hash
	};
};


/**
 * anonymous function - description
 *
 * @param  {type} url    description
 * @param  {type} keyify description
 * @return {type}        description
 */
scraper.parsedomain = function ( url, keyify ) {
	var urlparser = scraper.urlparser(url);
	var host = urlparser.host;
	var domain_matches = host.match(/(?:www.)(.+)/);
	var domain = domain_matches[domain_matches.length - 1];
	if (keyify) domain = lexo.lexo(domain, false, false);
	return domain;
};


/**
 * anonymous function - description
 *
 * @param  {type} url description
 * @return {type}     description
 */
scraper.parsepath = function ( url ) {
	var urlparser = scraper.urlparser(url);
	return urlparser.pathname;
};

/**
 * getValue - Get the value base on xpath element
 *
 * @param  {type} field
 * @param  {type} base
 * @param  {type} highlite
 * @return {type}          description
 */
scraper.getValue = function (field, base, highlite) {

	var slctrs = field.selecters;
	var match = null;
	var split = null;
	var keyify = false;
	var phonicify = false;
	var parsedomain = false;
	if (field.match) match = field.match;
	if (field.split) split = field.split;
	if (field.parsedomain) parsedomain = true;
	if (field.keyify) keyify = true;
	if (field.phonicify) phonicify = true;

	for (var j=0; j<slctrs.length; j++) {
		var xpath = null;
		if (base) xpath = base + slctrs[j];
		else xpath = slctrs[j];
		try { var xresult = document.evaluate(xpath,document,null,9); }
		catch (e) { continue; }
		if (xresult.singleNodeValue) {
			var firstpass = null;
			switch (xresult.singleNodeValue.nodeType) {
				case 1: // an element
					if (xresult.singleNodeValue.innerText.length > 0) {
						firstpass = xresult.singleNodeValue.innerText.trim();
						if (highlite) xresult.singleNodeValue.style.backgroundColor = "rgba(255,255,0,0.75)";
					} else continue;
					break;
				case 2: // an attribute
					if (xresult.singleNodeValue.nodeValue.length >0) {
						firstpass = xresult.singleNodeValue.nodeValue.trim();
						if (highlite) xresult.singleNodeValue.ownerElement.style.backgroundColor = "rgba(255,255,0.0.75)";
					} else continue;
					break;
				case 3: // a text
					if (xresult.singleNodeValue.nodeValue.length > 0) {
						firstpass = xresult.singleNodeValue.nodeValue.trim();
						if (highlite) xresult.singleNodeValue.parentElement.style.backgroundColor = "rgba(255,255,0,0.75)";
					} else continue;
					break;
				default: continue;
			}
			if (!firstpass) continue;
			else {
				if (match) {
					var arr = firstpass.match(match);
					if (arr) firstpass = arr[arr.length-1];
					else {
						console.log("there was no match",firstpass,match);
						firstpass = null;
					}
				}
				if (split) {
					firstpass = firstpass.split(split);
				}
				if (parsedomain) {
					firstpass = scraper.parsedomain(firstpass,keyify);
				}
				if (keyify) {
					firstpass = scraper.keyify(firstpass);
				}
				if (phonicify) {
					firstpass = scraper.phonicify(firstpass);
				}
				return firstpass;
			}
		} else continue;
	}
	return firstpass;
};


/**
 * anonymous function - description
 *
 * @param  {type} xresult  description
 * @param  {type} highlite description
 * @return {type}          description
 */
scraper.getXpathResultSingleNodeVal = function ( xresult, highlite ) {
	var firstpass = null;
	if (xresult.singleNodeValue) {
		switch (xresult.singleNodeValue.nodeType) {
			case 1: // an element
				if (xresult.singleNodeValue.innerText.length > 0) {
					firstpass = xresult.singleNodeValue.innerText.trim();
					if (highlite) xresult.singleNodeValue.style.backgroundColor = "rgba(255,255,0,0.75)";
				}
				break;
			case 2: // an attribute
				if (xresult.singleNodeValue.nodeValue.length >0) {
					firstpass = xresult.singleNodeValue.nodeValue.trim();
					if (highlite) xresult.singleNodeValue.ownerElement.style.backgroundColor = "rgba(255,255,0.0.75)";
				}
				break;
			case 3: // a text
				if (xresult.singleNodeValue.nodeValue.length > 0) {
					firstpass = xresult.singleNodeValue.nodeValue.trim();
					if (highlite) xresult.singleNodeValue.parentElement.style.backgroundColor = "rgba(255,255,0,0.75)";
				}
				break;
			default: break;
		}
	}
	return firstpass;
};


/**
	* scrapeFields - Scraper all the fields in the page
	*
	* @param  {type} fields   description
	* @param  {type} base     description
	* @param  {type} relation description
	* @return {type}          description
	*/
scraper.scrapeFields = function ( fields, base, relation ) {
	var scrape = {};
	for (var key in fields) {
		var fldName = fields[key].name;
		switch (true) {

			case (!!(!fields[key].selecters && fields[key].fields)):

				var fbpath = null;
				if (fields[key].fbpath) {
					fbpath = fields[key].fbpath;
					scrape[key] = {};
					scrape[key].fbpath = fbpath;
				}
				var j=0;
				do {
					var ibase = null;
					if (base) ibase = base + fields[key].base.replace("{{i}}", ++j);
					else ibase = fields[key].base.replace("{{i}}", ++j);
					var s = scraper.scrapeFields(fields[key].fields,ibase);
					if (s) {
						if (fbpath) {
							// TODO: add too __relations__ array
							if (!scrape[key]["__related__"]) {
								scrape[key].__related__ = [];
							}

							var relation = {};
							relation.fbpath = fbpath;
							relation.relation = {};
							relation.relation[fields[key].relation] = key;
							relation.items = {};

							var oKey = scraper.getValue(fields[key].key,ibase);
							if (!oKey) oKey = scraper.getValue(fields[key].keyalt,ibase);
							relation.items[oKey] = s;

							scrape[key].__related__.push(relation);

						} else {
							if (!scrape[key]) scrape[key] = [];
							scrape[key].push(s);
						}
					}
				} while (s);

			break;


			case ((!!fields[key].selecters)):

				var slctrs = fields[key].selecters;
				var match = null;
				var split = null;
				var keyify = false;
				var phonicify = false;
				var parsedomain = false;
				if (fields[key].match) match = fields[key].match;
				if (fields[key].split) split = fields[key].split;
				if (fields[key].parsedomain) parsedomain = true;
				if (fields[key].keyify) keyify = true;
				if (fields[key].phonicify) phonicify = true;

				for (var j=0; j < slctrs.length; j++) {
					var xpath = null;
					if (base) xpath = base + slctrs[j];
					else xpath = slctrs[j];
					try { var xresult = document.evaluate(xpath,document,null,9); }
					catch (e) { continue; }
					if (xresult.singleNodeValue) {
						var firstpass = null;
						switch (xresult.singleNodeValue.nodeType) {
							case 1: // an element
								if (xresult.singleNodeValue.innerText.length > 0) {
									firstpass = xresult.singleNodeValue.innerText.trim();
									xresult.singleNodeValue.style.backgroundColor = "rgba(255,255,0,0.75)";
								} else continue;
								break;
							case 2: // an attribute
								if (xresult.singleNodeValue.nodeValue.length >0) {
									firstpass = xresult.singleNodeValue.nodeValue.trim();
									xresult.singleNodeValue.ownerElement.style.backgroundColor = "rgba(255,255,0.0.75)";
								} else continue;
								break;
							case 3: // a text
								if (xresult.singleNodeValue.nodeValue.length > 0) {
									firstpass = xresult.singleNodeValue.nodeValue.trim();
									xresult.singleNodeValue.parentElement.style.backgroundColor = "rgba(255,255,0,0.75)";
								} else continue;
								break;
							default: continue;
						}
						if (!firstpass) continue;
						else {
							if (match) {
								var arr = firstpass.match(match);
								if (arr) firstpass = arr[arr.length-1];
								else {
									console.log("there was no match",firstpass,match);
									firstpass = null;
								}
							}
							if (split) {
								firstpass = firstpass.split(split);
							}
							if (parsedomain) {
								firstpass = scraper.parsedomain(firstpass,keyify);
							}
							if (phonicify) {
								firstpass = scraper.phonicify(firstpass);
							}
							scrape[key] = firstpass;
						}
					} else continue;
				}

			break;


			case ((!!fields[key].window)):

				//  { "window": { "propchain":["location","search"] }, "match":"(?:\\?id=)(\\d+)" }

				var w = fields[key].window;
				var match = fields[key].match;
				if (!w.propchain) {
					console.log("The propchain property is missing:",key);
					continue;
				}
				var p = window;
				for (var i = 0; i < w.propchain.length; i++) {
					p = p[w.propchain[i]];
				}
				if (match) {
					var matched = p.match(match);
					scrape[key] = matched[matched.length-1];
				} else {
					scrape[key] = p;
				}
				break;

			default:
				console.log("scrape map fields entry not defined correctly:",key);
				break;

		}

	}

	if (Object.keys(scrape).length === 0) return null;
	else return scrape;
};

/**
	* scrapePage - Scraper the web page
	*
	* @param  {object} scrapeMap Object with the map of the fields
	* @return {object}           Scraper's results
	*/
scraper.scrapePage = function () {

	var scrape = {};
	var map = this.scrapeMap.scrapers[scraper.isProfile];
	var routes = this.scrapeMap.scrapers[scraper.isProfile].routes;
	var routedscraper = scraper.getRoutedScraper(routes);
	scraper.runExpanders(routedscraper.expanders);
	var method = routedscraper.method;

	scrape[method] = {};
	scrape[method].fbpath = routedscraper.fbpath;
	scrape[method].scrapedom = scraper.isProfile;
	scrape[method].scrapever = map.version;
	scrape[method].scrapestamp = Date.now();
	scrape[method].items = {};


	var fields = routedscraper.fields;
	if (fields) {
		scrape[method].items = scraper.scrapeFields(fields);
	}

	console.log("scrape:",scrape);
	return scrape;
};

/**
	* Init Scraper Object
	*/

scraper.init();

/**
	* Listener - Listen incoming messages from other extension's components
	*/
chrome.runtime.onMessage.addListener( function ( DOMContentLoaded, sender, response ) {
	var responseObject = {
		results: {}
	};

	if ( !!DOMContentLoaded ) {
		if ( scraper.isProfile ) {
			responseObject.results.scrapetype = scraper.isProfile;
			responseObject.results.scraper = scraper.scrapePage();
		}
	}
	response(responseObject);
});
