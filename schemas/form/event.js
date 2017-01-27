var eventSchema = {
	"title": "Event Form",
	"type": "object",
	"properties": {
		"tab1": {
			"eid": { label:"event id" , id:"eid", name: "eid", type: "hidden"},
			"pub": { label:"publish stamp" , id:"pub", name: "pub", type: "hidden"},
			"tit": { label:"title", id:"tit", name: "tit", type: "text"},
			"sht": { label:"short description" , id:"sht", name: "sht", type: "text"},
			"ini": { label:"start date", id:"ini", name: "ini", type: "text"},
			"end": { label:"end date", id:"end", name: "end", type: "text"},
			"hstr": { label: "Hora Inicio", id: "hstr", name: "hstr", type: "text"},
			"hend": { label: "Hora Termino", id: "hend", name: "hend", type: "text"},
			"ref": { label:"refers to", id:"ref", name: "ref", type: "text"},
			"lng": { label:"long description" , id:"lng", name: "lng", type: "textarea"},
		},
		"tab2": {
			"prc": { label:"price (from)", id:"prc", name: "prc", type: "number"},
			"dur": { label:"duration(seconds)", id:"dur", name: "dur", type: "number"},
			"rpt": { label:"repeat", id:"rpt", name: "rpt"},
			"img": { label:"image", id: "img", name: "img", type: "text"},
			"tag": { label: "Tags", id:"tag", name:"tag", id:"tag", name: "tag"},
			"cre": { label:"created stamp", id: "cre", name: "cre", type: "hidden"},
			"crb": { label:"created by", id: "crb", name: "crb", type: "hidden"},
			"mod": { label:"modified stamp", id: "mod", name: "mod", type: "hidden"},
			"mob": { label:"modified by", id: "mob", name: "mob", type: "hidden"},
			"own": { label:"owner/group id", id: "own", name: "own", type: "hidden"}
		},
		"tab3": {
			"lct": { label:"location", id:"lct", name: "lct", type: "text"},
			"cty": { label:"city", id:"cty", name: "cty", type: "text"},
			"lcl": { label:"locale", id:"lcl", name: "lcl", type: "text"},
			"lat": { label: "Latitud", id: "lat", name: "lat", type: "text"},
			"log": { label: "Longitud", id: "log", name: "log", type: "text"},
		}
 }
};
