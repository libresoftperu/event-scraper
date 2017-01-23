var scrapeMap = {
	"scrapers": {
		"linkedin": {
			"version": "0.1.0",
			"routes": {
				"/profile/view" : {
					"method": "patch",
					"fbpath": ["/contacts","/candidates"],
					"id": { "window": { "propchain": ["location","search"] }, match:"(?:\\?id=)(\\d+)" },
					"expanders": [ "//*[contains(@class,'show-more-info')]/a" ],
					"fields": {
						  "fullName": { selecters: [ "//*[@id=\"name\"]/h1/span/span[1]" ] },
						  "location": { selecters: [ "//*[@id=\"location\"]/dl/dd[1]/span/a" ] },
						  "industry": { selecters: [ "//*[@id=\"location\"]/dl/dd[2]/a" ] },
						     "title": { selecters: [ "//*[@id=\"headline\"]/p" ] },
						  "birthday": { selecters: [ "//*[@id=\"personal-info-view\"]/tbody/tr/td" ] },
						   "picture": { selecters: [ "//*[@id=\"top-card\"]/div/div/div/a/img/@src" ] },
						"connections":{ selecters: ["//*[@id=\"top-card\"]/div/div[1]/div[2]/div[2]/div[1]/strong"] },
						 "liprofile": { "window": { "propchain":["location","search"] }, match:"(?:\\?id=)(\\d+)" },
						   "website": { selecters: ["//*[@id=\"website-view\"]/ul/li[1]/a/@href"] },
						   "twitter": { selecters: ["//*[@id=\"twitter-view\"]/ul/li/a"] },
						     "email": { selecters: ["//*[@id=\"relationship-email-item-0\"]/a"] },
						   "summary": { selecters: ["//*[@id=\"summary-item-view\"]/div/p"] },
						"experience": {
							"base": "//*[@id=\"background-experience\"]/div[{{i}}]",
							"fields": {
								"title": { selecters: ["/div/header/h4"] },
								"company": { selecters: ["/div/header/h5[1]", "/div/header/h5/span/strong/a"] },
								"duration": { selecters: ["/div/span"] },
								"description": { selecters: ["/div/p"]},
								"recommendations": {
									"base":"/div/dl/dd/ul/li[{{i}}]",
									"fields": {
										"recommender": { selecters: ["/hgroup/h5]","/hgroup/h5/span/strong/a"] },
										    "company": { selecters: ["/hgroup/h6"] },
										      "quote": { selecters: ["/p"] }
									}
								}
							}
						},
						"languages": {
							"base": "//*[@id=\"languages\"]/div/ol/li[{{i}}]",
							"fields": {
								       "lang": { selecters: ["/h4"] },
								"proficiency": { selecters: ["/div"] }
							}
						},
						"skills": {
							"base": "//*[@id=\"profile-skills\"]/ul[1]/li[{{i}}]",
							"fields": {
								"skill": { selecters: ["/span/span"] } /*,{ "name": "endorsed", selecters: ["/span/a"]}*/
							}
						},
						"otherskills": { 
							"base": "//*[@id=\"profile-skills\"]/ul[2]/li[{{i}}]",
							"fields": {
								"skill": { selecters: ["/div/span/span"] }
							}
						},
						"education": {  "base": "//*[@id=\"background-education\"]/div[{{i}}]",
							"fields": {
								"name": { selecters: ["/div/div/header/h4"] },
								"major": { selecters: ["/div/div/header/h5"] },
								"date": { selecters: ["/div/div/span"] }
							}
						},
						"awardz": { selecters: ["//*[@id=\"honors-additional-item-view\"]/div/p"] }
					}
				}
			}
		},
		"lead411": {
			"version": "0.0.1",
			"routes": {
				"/company_" : {
					"method": "patch",
					"fbpath": "/companies",
					"key": { selecters: [ "//*[@class='top_left_inner_box1']/a/@href" ], parsedomain:true, keyify:true },
					"expanders": [],
					"fields": {
						".priority" : { selecters: [ "//*[@class=\"system\"]/h1/text()" ], phonicify:true },
						"srcpath": { "window": { "propchain": ["location","pathname"] } },
						"name": { selecters: [ "//*[@class=\"system\"]/h1/text()" ] },
						"updated": { selecters: [ "//*[@id=\"update_date_on_div\"]/text()[2]" ] },
						"industry": { selecters: [ "//*[@id=\"location\"]/dl/dd[2]/a" ] },
						"url": { selecters: [ "//*[@class='top_left_inner_box1']/a/@href" ] },
						"address": { selecters: [ "//*[@class=\"top_left_inner_box1\"]/div[@class=\"company_info\"][1]"] },
						"city": {
							selecters: [ "//*[@class=\"top_left_inner_box1\"]/div[@class=\"company_info\"][2]"],
							match:"(.+)(?:,) (?:\\w+) (?:\\w+)"
						},
						"state": {
							selecters: [ "//*[@class=\"top_left_inner_box1\"]/div[@class=\"company_info\"][2]"],
							match:"(?:.+,) (\\w+) (?:\\w+)"
						},
						"zip": {
							selecters: [ "//*[@class=\"top_left_inner_box1\"]/div[@class=\"company_info\"][2]"],
							match:"(?:.+, \\w+) (\\w+)"
						},
						"phone": {
							selecters: [ "//*[@class=\"top_left_inner_box1\"]/div[@class=\"company_info\"][3]"],
							match:"(?:Phone:)(.+)"
						},
						"type": { selecters: [ "//*[@class=\"conpany-right-info\"]/div[1]" ] },
						"employees": { selecters: [ "//*[@class=\"conpany-right-info\"]/div[2]" ] },
						"revenue": { selecters: [ "//*[@class=\"conpany-right-info\"]/div[3]" ] },
						"industry": { selecters: [ "//*[@class=\"conpany-right-info\"]/div[4]"], "split":"->"  },
						"sic": { selecters: [ "//*[@class=\"conpany-right-info\"]/div[5]"], match:"(\\d+)"  },						
						"contacts": {
							"fbpath": "/contacts",
							"relation": "company",
							"base": "//*[contains(@class,\"company_tb\")]/tbody/tr[{{i}}]",
							"key": { selecters: [ "/td[3]/a/@href" ], match:"(?:mailto:)(.+)", keyify:true },
							"keyalt": { selecters: ["/td[2]/div/a"], keyify:true },
							"fields": {
								".priority": { selecters: ["/td[2]/div/a"], phonicify:true },
								"srcpath": { selecters: ["/td[2]/div/a/@href"], match:"(?:http:\\/\\/www.lead411.com\\/)(.+)(?:.html)", parsepath:true },
								"title": { selecters: ["/td[2]/div/div"], match:"(?:Title: )(.+)" },
								"name": { selecters: ["/td[2]/div/a"] },
								"email": { selecters: ["/td[3]/a/@href"], match:"(?:mailto:)(.+)" },
								"dept": { selecters: ["/td[4]"] }
							}
						}
					}
				},
				"/profile_page/company" : "/company"
			}
		}
	}
};