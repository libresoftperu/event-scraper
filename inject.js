/* inject.js */
var scraper = {};
scraper.ptypeEnum = { LINKEDIN:"linkedin", COMPUTRABAJO:"computrabajo", LEAD411:"lead411" };
scraper.isProfile = null;
scraper.profileId = null;
scraper.results = null;

scraper.getProfileType = function () {
	var rx = /linkedin.com|computrabajo|lead411.com/;
	var retVal = null;
	switch (window.location.host.match(rx)[0]) {

		case "linkedin.com" : 
			if (window.location.pathname == "/profile/view") retVal = this.ptypeEnum.LINKEDIN;
			return retVal;
		
		case "computrabajo" :
			// TODO: test to see if it is a candidate profile page
			return this.ptypeEnum.COMPUTRABAJO; 

		case "lead411.com" :
			//http://www.lead411.com/company_SwiftypeInc_2568033.html
			//http://www.lead411.com/profile_page/company/2509690/DraftkingsInc/Robins/25
			switch (true) {
				case !!(window.location.pathname.match("company_")) :
				case !!(window.location.pathname.match("profile_page/company")) :
					retVal = this.ptypeEnum.LEAD411;	
			}
			return retVal;

		default: return null;
	}
};

scraper.keyify = function ( str ) {
	// remove spaces, punctuation, diacritics
	// TODO: add diacritic substition
	return lexo.lexo( str, false, false );
	//return str.replace(/[^\w]/gi,'');
};

scraper.phonicify = function ( str ) {
	// double metaphone
	return dmeta.encode(str)[0];
};

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

scraper.parsedomain = function ( url, keyify ) {
	var urlparser = scraper.urlparser(url);
	var host = urlparser.host;
	var domain_matches = host.match(/(?:www.)(.+)/);
	var domain = domain_matches[domain_matches.length - 1];
	if (keyify) domain = lexo.lexo(domain, false, false);
	return domain;
};

scraper.parsepath = function ( url ) {
	var urlparser = scraper.urlparser(url);
	return urlparser.pathname;
};

scraper.scrapeFields = function ( fields, base, relation ) {
	var scrape = {};
	//for (var i=0; i<fields.length; i++) {
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

				console.log("scrape map fields entry not defined correctly:",key)

			break;

		}

	}

	if (Object.keys(scrape).length === 0) return null;
	else return scrape;
};

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

scraper.expand = function ( xpath ) {
	var expanders = document.evaluate(xpath,document,null,4);
	var expander;
	do {
		expander = expanders.iterateNext();
		if (expander) expander.click();
	}
	while (expander);
};

scraper.runExpanders = function ( expanders ) {
	for (var i = 0; i < expanders.length; i++) {
		scraper.expand(expanders[i]);
	}
};

scraper.getRoutedScraper = function ( routes ) {
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

scraper.scrapePage = function ( scrapeMap ) {

	var scrape = {};
	var map = scrapeMap.scrapers[scraper.isProfile];
	var routes = scraper.scrapeMap.scrapers[scraper.isProfile].routes;
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
		// a single object on page
		var key = scraper.getValue(routedscraper.key);
		scrape[method].items[key] = scraper.scrapeFields(fields);
	} else {
		// TODO : work with selectors to find multiple objects
	}

	console.log("scrape:",scrape);
	return scrape;
};

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

scraper.Lead411 = {};

scraper.Lead411.createScrapeButton = function() {
	var b = document.createElement("button");
	b.innerHTML = "scrape";
	b.addEventListener("click", function ( e ) {
		e.preventDefault();
		e.stopPropagation();
		alert("you clicked scrape");
	}, false );
	return b;
};

//	searches FB for contact, returns json or null (if not found)
scraper.Lead411.isScraped = function ( contactid ) {
	console.log("scraper.isScraped not implemented.");
	// TODO: implement this or throw error
	return null;
};

//	checks FB to see if contact is already LI Invited 
scraper.Lead411.isLIinvited = function ( contactid ) {
	console.log("scraper.isLIinvited not implementedl");
	// TODO: implemente this or throw error
	return null;
};

//	checks FB to see if contact is already LI Invited / Connected
scraper.Lead411.isLIconnected = function ( contactid ) {
	console.log("scraper.isLIconnected not implementedl");
	// TODO: implemente this or throw error
	return null;
};

//	checks FB to see if company is "engaged" (with other salesperson)
scraper.Lead411.isEngaged = function ( domain ) {
	console.log("scraper.isEngaged not implemented.");
	// TODO: implement this or throw error
	return null;
};

//	searches FB for company, returns json or null (if not found)
scraper.Lead411.isCompanyScraped = function ( domain ) {
	console.log("scraper.isCompanyScraped not implemented.");
	// TODO: implement or throw error
	return null;
};

scraper.scrapeValue = function ( element, xpath, matchrx ) {
	var retval = null;
	var xresult = document.evaluate(xpath, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE);
	var xresultval = this.getXpathResultSingleNodeVal(xresult);
	if (matchrx) {
		var xresultrxarr = xresultval.match(matchrx);
		if (xresultrxarr) {
			retval = xresultrxarr[xresultrxarr.length-1];
		}
	} else retval = xresultval;
	return retval;
};

//	scrape lead411 contact id from row
scraper.Lead411.ScrapeContactId = function ( contactrow ) {

	/*
	var contactid = null;
	var contacturlxpath = "td[2]/div/a/@href";
	var contacturlxresult = document.evaluate(contacturlxpath, contactrow, null, XPathResult.FIRST_ORDERED_NODE_TYPE);
	var contacturlval = this.getXpathResultSingleNodeVal( contacturlxresult );
	var contactidrx = /(?:http:\/\/www.lead411.com\/)(.+)(?:.html)/;
	var contactidrxarr = contacturlval.match(contactidrx);
	if (contactidrxarr) contactid = contactidrxarr[contactidrxarr.length-1];
	return contactid;
	*/
	var xpath = "td[2]/div/a/@href";
	var matchrx = /(?:http:\/\/www.lead411.com\/)(.+)(?:.html)/;
	return scraper.scrapeValue(contactrow, xpath, matchrx);
};

// scrape lead411 contact email
scraper.Lead411.hasEmail = function (contactrow) {
	var xpath = "td[3]/a/@href";
	var matchrx = /(?:mailto:)(.+)/;
	return scraper.scrapeValue(contactrow, xpath, matchrx);
};

scraper.mutateLead411ContactRows = function ( rowsArr ) {

	for (var i = 0; i < rowsArr.length; i++) {
		var contactid = this.Lead411.ScrapeContactId(rowsArr[i]);
		var contactmail = this.Lead411.hasEmail(rowsArr[i]);
		console.log("scraped contactid:",contactid);

		var domain = xxx;

		var td1 = rowsArr[i].getElementsByTagName("td")[0];
		td1.innerHTML = "";

		var contact = this.lead411CheckContact(contactid);
		var scrapeButton = this.createLead411ScrapeContactButton();
		td1.appendChild(scrapeButton);
	}

};

scraper.lead411injector = function () {

	//*[contains(@class,'company_tb')]/tbody/tr[1]/td[1]

	// inject functions into tr (contact rows)
	var xpath = "//*[contains(@class,'company_tb')]/tbody/tr";
	var xresult = document.evaluate(xpath,document,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE);
	console.log("lead411injector xresult:",xresult);
	var contactRowsArray = [];
	contactRow = xresult.iterateNext();

	while (contactRow) {
		contactRowsArray.push(contactRow);
		contactRow = xresult.iterateNext();
	}

	this.mutateLead411ContactRows(contactRowsArray);

};

scraper.init = function() {
	if (window == top) {
		scraper.isProfile = scraper.getProfileType();
		if (scraper.isProfile) {
			console.log("profile type: ", scraper.isProfile);
			console.log("forget all the scrapemap stuff for now... what we really want to do is inject functionality into the page at this point");

			switch(scraper.isProfile){
				case "linkedin":
					console.log("This 'expander' now actually happens in the scrapemap, which, itself is becoming irrelevent");
					var mores = document.getElementsByClassName("show-more-info");
					for (var i=0; i<mores.length; i++){
						mores[i].getElementsByTagName("a")[0].click();
					}
					var search = window.location.search;
					var rx = /(?:\?id=)(\d+)/;
					var id = search.match(rx)[1];
					scraper.profileId = id;
					break;
				case "lead411":
					console.log("scraper profile:",scraper.isProfile);
					console.log("ok, lets inject some buttons next to contacts here...");
					this.lead411injector();

					break;				
			}

			chrome.runtime.sendMessage( { "getScrapeMap":scraper.isProfile }, function (response) {
				if (response.scrapeMap) {
					scraper.scrapeMap = response.scrapeMap;
				}
			});

		}
	}
};

scraper.init();

chrome.runtime.onMessage.addListener( function ( msg, sender, response ) {
	if ( msg.popupDOMready ) {
		console.log("popupDOMready");
		var scraped = scraper.scrapePage(scraper.scrapeMap);
		scraper.results = {};
		scraper.results.id = scraper.profileId;
		scraper.results.scrapetype = scraper.isProfile;
		scraper.results.scrape = scraped;
		response(scraper.results);
	}
});






























lexo = {};

lexo.defaults = {
	maxlen:64,
	preserveSpace:false,
};

lexo.diacriticsMap = [
{'a':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
{'aa':/[\uA733]/g},
{'ae':/[\u00E6\u01FD\u01E3]/g},
{'ao':/[\uA735]/g},
{'au':/[\uA737]/g},
{'av':/[\uA739\uA73B]/g},
{'ay':/[\uA73D]/g},
{'b':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
{'c':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
{'d':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
{'dz':/[\u01F3\u01C6]/g},
{'e':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
{'f':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
{'g':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
{'h':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
{'hv':/[\u0195]/g},
{'i':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
{'j':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
{'k':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
{'l':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
{'lj':/[\u01C9]/g},
{'m':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
{'n':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
{'nj':/[\u01CC]/g},
{'o':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
{'oi':/[\u01A3]/g},
{'ou':/[\u0223]/g},
{'oo':/[\uA74F]/g},
{'p':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
{'q':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
{'r':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
{'s':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
{'t':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
{'tz':/[\uA729]/g},
{'u':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
{'v':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
{'vy':/[\uA761]/g},
{'w':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
{'x':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
{'y':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
{'z':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g},
{'A':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
{'AA':/[\uA732]/g},
{'AE':/[\u00C6\u01FC\u01E2]/g},
{'AO':/[\uA734]/g},
{'AU':/[\uA736]/g},
{'AV':/[\uA738\uA73A]/g},
{'AY':/[\uA73C]/g},
{'B':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
{'C':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
{'D':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
{'DZ':/[\u01F1\u01C4]/g},
{'Dz':/[\u01F2\u01C5]/g},
{'E':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
{'F':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
{'G':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
{'H':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
{'I':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
{'J':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
{'K':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
{'L':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
{'LJ':/[\u01C7]/g},
{'Lj':/[\u01C8]/g},
{'M':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
{'N':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
{'NJ':/[\u01CA]/g},
{'Nj':/[\u01CB]/g},
{'O':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
{'OI':/[\u01A2]/g},
{'OO':/[\uA74E]/g},
{'OU':/[\u0222]/g},
{'P':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
{'Q':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
{'R':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
{'S':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
{'T':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
{'TZ':/[\uA728]/g},
{'U':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
{'V':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
{'VY':/[\uA760]/g},
{'W':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
{'X':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
{'Y':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
{'Z':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g}
];


lexo.convertDiacritics = function ( str ) {
	for ( var key in lexo.diacriticsMap ) {
		str = str.replace(lexo.diacriticsMap[key],key);
	}
	return str;
};


lexo.lexo = function ( str, preserveCase, preserveSpace, maxlen ) {

	if (typeof preserveSpace == 'undefined') preserveSpace = lexo.defaults.preserveSpace;
	if (typeof maxlen == 'undefined') maxlen = lexo.defaults.maxlen;

	// 1.lowercase!
	if (!preserveCase) str = str.toLowerCase();

	// 2.convert diacritics to simple ascii
	str = lexo.convertDiacritics(str);

	// 3. remove symbols/punctuation except space and underscore
	if (preserveSpace) str = str.replace(/[^\w\s]/gi,'');
	else str = str.replace(/[^\w]/gi,'');

	// 4. max length?
	if (maxlen) return str.substr(0, maxlen);
	else return str;

};



var dmeta = {};

dmeta.VOWELS = /[AEIOUY]/;
dmeta.SLAVO_GERMANIC = /W|K|CZ|WITZ/;
dmeta.GERMANIC = /^(VAN |VON |SCH)/;
dmeta.INITIAL_EXCEPTIONS = /^(GN|KN|PN|WR|PS)/;
dmeta.GREEK_INITIAL_CH = /^CH(IA|EM|OR([^E])|YM|ARAC|ARIS)/;
dmeta.GREEK_CH = /ORCHES|ARCHIT|ORCHID/;
dmeta.CH_FOR_KH = /[ BFHLMNRVW]/;
dmeta.G_FOR_F = /[CGLRT]/;
dmeta.INITIAL_G_FOR_KJ = /Y[\s\S]|E[BILPRSY]|I[BELN]/;
dmeta.INITIAL_ANGER_EXCEPTION = /^[DMR]ANGER/;
dmeta.G_FOR_KJ = /[EGIR]/;
dmeta.J_FOR_J_EXCEPTION = /[LTKSNMBZ]/;
dmeta.ALLE = /AS|OS/;
dmeta.H_FOR_S = /EIM|OEK|OLM|OLZ/;
dmeta.DUTCH_SCH = /E[DMNR]|UY|OO/;

dmeta.encode = function ( value ) {
    var primary = '',
        secondary = '',
        index = 0,
        length = value.length,
        last = length - 1,
        isSlavoGermanic, isGermanic, subvalue, next, prev, nextnext,
        characters;

    value = String(value).toUpperCase() + '     ';
    isSlavoGermanic = dmeta.SLAVO_GERMANIC.test(value);
    isGermanic = dmeta.GERMANIC.test(value);
    characters = value.split('');


    if (dmeta.INITIAL_EXCEPTIONS.test(value)) {
        index++;
    }


    if (characters[0] === 'X') {
        primary += 'S';
        secondary += 'S';

        index++;
    }

    while (index < length) {
        prev = characters[index - 1];
        next = characters[index + 1];
        nextnext = characters[index + 2];

        switch (characters[index]) {
            case 'A':
            case 'E':
            case 'I':
            case 'O':
            case 'U':
            case 'Y':
            case '\u00C0': //À
            case '\u00CA': //Ê
            case '\u00C9': //É
            case 'É':
                if (index === 0) {

                    primary += 'A';
                    secondary += 'A';
                }

                index++;

                break;
            case 'B':
                primary += 'P';
                secondary += 'P';

                if (next === 'B') {
                    index++;
                }

                index++;

                break;
            case 'Ç':
                primary += 'S';
                secondary += 'S';
                index++;

                break;
            case 'C':

                if (prev === 'A' && next === 'H' && nextnext !== 'I' && !dmeta.VOWELS.test(characters[index - 2]) && (
                nextnext !== 'E' || (
                subvalue = value.slice(index - 2, index + 4) && (subvalue === 'BACHER' || subvalue === 'MACHER')))) {
                    primary += 'K';
                    secondary += 'K';
                    index += 2;

                    break;
                }


                if (
                index === 0 && value.slice(index + 1, index + 6) === 'AESAR') {
                    primary += 'S';
                    secondary += 'S';
                    index += 2;

                    break;
                }


                if (value.slice(index + 1, index + 4) === 'HIA') {
                    primary += 'K';
                    secondary += 'K';
                    index += 2;

                    break;
                }

                if (next === 'H') {

                    if ( index > 0 && nextnext === 'A' && characters[index + 3] === 'E') {
                        primary += 'K';
                        secondary += 'X';
                        index += 2;

                        break;
                    }


                    if (index === 0 && dmeta.GREEK_INITIAL_CH.test(value)) {
                        primary += 'K';
                        secondary += 'K';
                        index += 2;

                        break;
                    }


                    if (
                    isGermanic || dmeta.GREEK_CH.test(value.slice(index - 2, index + 4)) || (nextnext === 'T' || nextnext === 'S') || (
                    (
                    index === 0 || prev === 'A' || prev === 'E' || prev === 'O' || prev === 'U') && dmeta.CH_FOR_KH.test(nextnext))) {
                        primary += 'K';
                        secondary += 'K';
                    } else if (index === 0) {
                        primary += 'X';
                        secondary += 'X';
                    } else if (value.slice(0, 2) === 'MC') {

                        primary += 'K';
                        secondary += 'K';
                    } else {
                        primary += 'X';
                        secondary += 'K';
                    }

                    index += 2;

                    break;
                }


                if (
                next === 'Z' && value.slice(index - 2, index) !== 'WI') {
                    primary += 'S';
                    secondary += 'X';
                    index += 2;

                    break;
                }


                if (value.slice(index + 1, index + 4) === 'CIA') {
                    primary += 'X';
                    secondary += 'X';
                    index += 3;

                    break;
                }


                if (
                next === 'C' && !(index === 1 && characters[0] === 'M')) {

                    if (
                    (
                    nextnext === 'I' || nextnext === 'E' || nextnext === 'H') && value.slice(index + 2, index + 4) !== 'HU') {
                        subvalue = value.slice(index - 1, index + 4);


                        if ((index === 1 && prev === 'A') || subvalue === 'UCCEE' || subvalue === 'UCCES') {
                            primary += 'KS';
                            secondary += 'KS';
                        } else {
                            primary += 'X';
                            secondary += 'X';
                        }

                        index += 3;

                        break;
                    } else {

                        primary += 'K';
                        secondary += 'K';
                        index += 2;

                        break;
                    }
                }

                if (next === 'G' || next === 'K' || next === 'Q') {
                    primary += 'K';
                    secondary += 'K';
                    index += 2;

                    break;
                }


                if (next === 'I' && (nextnext === 'E' || nextnext === 'O')) {
                    primary += 'S';
                    secondary += 'X';
                    index += 2;
                    break;
                }

                if (next === 'I' || next === 'E' || next === 'Y') {
                    primary += 'S';
                    secondary += 'S';
                    index += 2;
                    break;
                }

                primary += 'K';
                secondary += 'K';

                if (next === ' ' && (nextnext === 'C' || nextnext === 'G' || nextnext === 'Q')) {
                    index += 3;
                    break;
                }

                index++;

                break;
            case 'D':
                if (next === 'G') {

                    if (nextnext === 'E' || nextnext === 'I' || nextnext === 'Y') {
                        primary += 'J';
                        secondary += 'J';
                        index += 3;
                    } else {
                        primary += 'TK';
                        secondary += 'TK';
                        index += 2;
                    }

                    break;
                }

                if (next === 'T' || next === 'D') {
                    primary += 'T';
                    secondary += 'T';
                    index += 2;

                    break;
                }

                primary += 'T';
                secondary += 'T';
                index++;

                break;
            case 'F':
                if (next === 'F') {
                    index++;
                }

                index++;
                primary += 'F';
                secondary += 'F';

                break;
            case 'G':
                if (next === 'H') {
                    if (index > 0 && !dmeta.VOWELS.test(prev)) {
                        primary += 'K';
                        secondary += 'K';
                        index += 2;

                        break;
                    }


                    if (index === 0) {
                        if (nextnext === 'I') {
                            primary += 'J';
                            secondary += 'J';
                        } else {
                            primary += 'K';
                            secondary += 'K';
                        }
                        index += 2;
                        break;
                    }


                    if (
                    (


                    subvalue = characters[index - 2],
                    subvalue === 'B' || subvalue === 'H' || subvalue === 'D') || (


                    subvalue = characters[index - 3],
                    subvalue === 'B' || subvalue === 'H' || subvalue === 'D') || (


                    subvalue = characters[index - 4],
                    subvalue === 'B' || subvalue === 'H')) {
                        index += 2;

                        break;
                    }


                    if (
                    index > 2 && prev === 'U' && dmeta.G_FOR_F.test(characters[index - 3])) {
                        primary += 'F';
                        secondary += 'F';
                    } else if (index > 0 && prev !== 'I') {
                        primary += 'K';
                        secondary += 'K';
                    }

                    index += 2;

                    break;
                }

                if (next === 'N') {
                    if (
                    index === 1 && dmeta.VOWELS.test(characters[0]) && !isSlavoGermanic) {
                        primary += 'KN';
                        secondary += 'N';
                    } else if (
                    value.slice(index + 2, index + 4) !== 'EY' && value.slice(index + 1) !== 'Y' && !isSlavoGermanic) {
                        primary += 'N';
                        secondary += 'KN';
                    } else {
                        primary += 'KN';
                        secondary += 'KN';
                    }

                    index += 2;

                    break;
                }


                if (
                value.slice(index + 1, index + 3) === 'LI' && !isSlavoGermanic) {
                    primary += 'KL';
                    secondary += 'L';
                    index += 2;

                    break;
                }


                if (
                index === 0 && dmeta.INITIAL_G_FOR_KJ.test(value.slice(1, 3))) {
                    primary += 'K';
                    secondary += 'J';
                    index += 2;

                    break;
                }


                if (
                (
                value.slice(index + 1, index + 3) === 'ER' && prev !== 'I' && prev !== 'E' && !dmeta.INITIAL_ANGER_EXCEPTION.test(value.slice(0, 6))) || (next === 'Y' && !dmeta.G_FOR_KJ.test(prev))) {
                    primary += 'K';
                    secondary += 'J';
                    index += 2;

                    break;
                }


                if (
                next === 'E' || next === 'I' || next === 'Y' || (
                (prev === 'A' || prev === 'O') && next === 'G' && nextnext === 'I')) {

                    if (
                    value.slice(index + 1, index + 3) === 'ET' || isGermanic) {
                        primary += 'K';
                        secondary += 'K';
                    } else {

                        if (value.slice(index + 1, index + 5) === 'IER ') {
                            primary += 'J';
                            secondary += 'J';
                        } else {
                            primary += 'J';
                            secondary += 'K';
                        }
                    }

                    index += 2;

                    break;
                }

                if (next === 'G') {
                    index++;
                }

                index++;

                primary += 'K';
                secondary += 'K';

                break;
            case 'H':

                if (dmeta.VOWELS.test(next) && (index === 0 || dmeta.VOWELS.test(prev))) {
                    primary += 'H';
                    secondary += 'H';

                    index++;
                }

                index++;

                break;
            case 'J':
                if (
                value.slice(index, index + 4) === 'JOSE' || value.slice(0, 4) === 'SAN ') {
                    if (
                    value.slice(0, 4) === 'SAN ' || (
                    index === 0 && characters[index + 4] === ' ')) {
                        primary += 'H';
                        secondary += 'H';
                    } else {
                        primary += 'J';
                        secondary += 'H';
                    }

                    index++;

                    break;
                }

                if (index === 0) {
                    primary += 'J';
                    secondary += 'A';
                } else if (!isSlavoGermanic && (next === 'A' || next === 'O') && dmeta.VOWELS.test(prev)) {
                    primary += 'J';
                    secondary += 'H';
                } else if (index === last) {
                    primary += 'J';
                } else if (prev !== 'S' && prev !== 'K' && prev !== 'L' && !dmeta.J_FOR_J_EXCEPTION.test(next)) {
                    primary += 'J';
                    secondary += 'J';
                } else if (next === 'J') {
                    index++;
                }

                index++;

                break;
            case 'K':
                if (next === 'K') {
                    index++;
                }

                primary += 'K';
                secondary += 'K';
                index++;

                break;
            case 'L':
                if (next === 'L') {

                    if (
                    (
                    index === length - 3 && (
                    (
                    prev === 'I' && (nextnext === 'O' || nextnext === 'A')) || (
                    prev === 'A' && nextnext === 'E'))) || (
                    prev === 'A' && nextnext === 'E' && (
                    (
                    characters[last] === 'A' || characters[last] === 'O') || dmeta.ALLE.test(value.slice(last - 1, length))))) {
                        primary += 'L';
                        index += 2;

                        break;
                    }

                    index++;
                }

                primary += 'L';
                secondary += 'L';
                index++;

                break;
            case 'M':
                if (
                next === 'M' ||


                (
                prev === 'U' && next === 'B' && (
                index + 1 === last || value.slice(index + 2, index + 4) === 'ER'))) {
                    index++;
                }

                index++;
                primary += 'M';
                secondary += 'M';

                break;
            case 'N':
                if (next === 'N') {
                    index++;
                }

                index++;
                primary += 'N';
                secondary += 'N';

                break;
            case '\u00D1': // Ñ
                index++;
                primary += 'N';
                secondary += 'N';

                break;
            case 'P':
                if (next === 'H') {
                    primary += 'F';
                    secondary += 'F';
                    index += 2;

                    break;
                }


                subvalue = next;

                if (subvalue === 'P' || subvalue === 'B') {
                    index++;
                }

                index++;

                primary += 'P';
                secondary += 'P';

                break;
            case 'Q':
                if (next === 'Q') {
                    index++;
                }

                index++;
                primary += 'K';
                secondary += 'K';

                break;
            case 'R':

                if (
                index === last && !isSlavoGermanic && prev === 'E' && characters[index - 2] === 'I' && characters[index - 4] !== 'M' && (
                characters[index - 3] !== 'E' && characters[index - 3] !== 'A')) {
                    secondary += 'R';
                } else {
                    primary += 'R';
                    secondary += 'R';
                }

                if (next === 'R') {
                    index++;
                }

                index++;

                break;
            case 'S':

                if (next === 'L' && (prev === 'I' || prev === 'Y')) {
                    index++;

                    break;
                }


                if (index === 0 && value.slice(1, 5) === 'UGAR') {
                    primary += 'X';
                    secondary += 'S';
                    index++;

                    break;
                }

                if (next === 'H') {

                    if (dmeta.H_FOR_S.test(value.slice(index + 1, index + 5))) {
                        primary += 'S';
                        secondary += 'S';
                    } else {
                        primary += 'X';
                        secondary += 'X';
                    }

                    index += 2;
                    break;
                }

                if (next === 'I' && (nextnext === 'O' || nextnext === 'A')) {
                    if (!isSlavoGermanic) {
                        primary += 'S';
                        secondary += 'X';
                    } else {
                        primary += 'S';
                        secondary += 'S';
                    }

                    index += 3;

                    break;
                }


                if (
                next === 'Z' || (
                index === 0 && (
                next === 'L' || next === 'M' || next === 'N' || next === 'W'))) {
                    primary += 'S';
                    secondary += 'X';

                    if (next === 'Z') {
                        index++;
                    }

                    index++;

                    break;
                }

                if (next === 'C') {

                    if (nextnext === 'H') {
                        subvalue = value.slice(index + 3, index + 5);


                        if (dmeta.DUTCH_SCH.test(subvalue)) {

                            if (subvalue === 'ER' || subvalue === 'EN') {
                                primary += 'X';
                                secondary += 'SK';
                            } else {
                                primary += 'SK';
                                secondary += 'SK';
                            }

                            index += 3;

                            break;
                        }

                        if (
                        index === 0 && !dmeta.VOWELS.test(characters[3]) && characters[3] !== 'W') {
                            primary += 'X';
                            secondary += 'S';
                        } else {
                            primary += 'X';
                            secondary += 'X';
                        }

                        index += 3;

                        break;
                    }

                    if (
                    nextnext === 'I' || nextnext === 'E' || nextnext === 'Y') {
                        primary += 'S';
                        secondary += 'S';
                        index += 3;
                        break;
                    }

                    primary += 'SK';
                    secondary += 'SK';
                    index += 3;

                    break;
                }

                subvalue = value.slice(index - 2, index);


                if (
                index === last && (
                subvalue === 'AI' || subvalue === 'OI')) {
                    secondary += 'S';
                } else {
                    primary += 'S';
                    secondary += 'S';
                }

                if (next === 'S') {
                    index++;
                }

                index++;

                break;
            case 'T':
                if (next === 'I' && nextnext === 'O' && characters[index + 3] === 'N') {
                    primary += 'X';
                    secondary += 'X';
                    index += 3;

                    break;
                }

                subvalue = value.slice(index + 1, index + 3);

                if (
                (
                next === 'I' && nextnext === 'A') || (
                next === 'C' && nextnext === 'H')) {
                    primary += 'X';
                    secondary += 'X';
                    index += 3;

                    break;
                }

                if (next === 'H' || (next === 'T' && nextnext === 'H')) {

                    if (
                    isGermanic || (
                    (nextnext === 'O' || nextnext === 'A') && characters[index + 3] === 'M')) {
                        primary += 'T';
                        secondary += 'T';
                    } else {
                        primary += '0';
                        secondary += 'T';
                    }

                    index += 2;

                    break;
                }

                if (next === 'T' || next === 'D') {
                    index++;
                }

                index++;
                primary += 'T';
                secondary += 'T';

                break;
            case 'V':
                if (next === 'V') {
                    index++;
                }

                primary += 'F';
                secondary += 'F';
                index++;

                break;
            case 'W':

                if (next === 'R') {
                    primary += 'R';
                    secondary += 'R';
                    index += 2;

                    break;
                }

                if (index === 0) {

                    if (dmeta.VOWELS.test(next)) {
                        primary += 'A';
                        secondary += 'F';
                    } else if (next === 'H') {

                        primary += 'A';
                        secondary += 'A';
                    }
                }


                if (
                (
                (prev === 'E' || prev === 'O') && next === 'S' && nextnext === 'K' && (
                characters[index + 3] === 'I' || characters[index + 3] === 'Y')) ||

                value.slice(0, 3) === 'SCH' || (index === last && dmeta.VOWELS.test(prev))) {
                    secondary += 'F';
                    index++;

                    break;
                }


                if (
                next === 'I' && (nextnext === 'C' || nextnext === 'T') && characters[index + 3] === 'Z') {
                    primary += 'TS';
                    secondary += 'FX';
                    index += 4;

                    break;
                }

                index++;

                break;
            case 'X':

                if (
                index === last || (
                prev === 'U' && (
                characters[index - 2] === 'A' || characters[index - 2] === 'O'))) {
                    primary += 'KS';
                    secondary += 'KS';
                }

                if (next === 'C' || next === 'X') {
                    index++;
                }

                index++;

                break;
            case 'Z':

                if (next === 'H') {
                    primary += 'J';
                    secondary += 'J';
                    index += 2;

                    break;
                } else if (
                (
                next === 'Z' && (
                nextnext === 'A' || nextnext === 'I' || nextnext === 'O')) || (isSlavoGermanic && index > 0 && prev !== 'T')) {
                    primary += 'S';
                    secondary += 'TS';
                } else {
                    primary += 'S';
                    secondary += 'S';
                }

                if (next === 'Z') {
                    index++;
                }

                index++;

                break;
            default:
                index++;

        }
    }

    return [primary, secondary];
};