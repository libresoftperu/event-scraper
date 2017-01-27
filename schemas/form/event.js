var eventSchema = {
	"title": "Event Form",
	"type": "object",
	"properties": {
		"tab1": {
			"eid": { label:"event id" , id:"eid", name: "eid", type: "hidden"},
			"pub": { label:"publish stamp" , id:"pub", name: "pub", type: "hidden"},
			"tit": { label:"Nombre", id:"tit", name: "tit", type: "text"},
			"sht": { label:"Detalle" , id:"sht", name: "sht", type: "text"},
			"ini": { label:"Fecha Inicio", id:"ini", name: "ini", type: "date", cls: "shared_space_fields_left"},
			"end": { label:"Fecha Fin", id:"end", name: "end", type: "date", cls: "shared_space_fields_right"},
			"hstr": { label:"Hora Inicio", id: "hstr", name: "hstr", type: "time", cls: "shared_space_fields_left"},
			"hend": { label:"Hora Termino", id: "hend", name: "hend", type: "time",cls: "shared_space_fields_right" },
			"lng": { label:"Descripción" , id:"lng", name: "lng", type: "textarea"},
		},
		"tab2": {
			"ref": { label:"URL", id:"ref", name: "ref", type: "text"},
			"prc": { label:"Precio(desde)", id:"prc", name: "prc", type: "number", cls: "shared_space_fields_left"},
			"dur": { label:"Duración(seg)", id:"dur", name: "dur", type: "number", cls: "shared_space_fields_right"},
			"rpt": { label:"repeat", id:"rpt", name: "rpt"},
			"img": { label:"imagen", id: "img", name: "img", type: "text"},
			"tag": { label: "Tags", id:"tag", name:"tag", id:"tag", name: "tag"},
			"cre": { label:"created stamp", id: "cre", name: "cre", type: "hidden"},
			"crb": { label:"created by", id: "crb", name: "crb", type: "hidden"},
			"mod": { label:"modified stamp", id: "mod", name: "mod", type: "hidden"},
			"mob": { label:"modified by", id: "mob", name: "mob", type: "hidden"},
			"own": { label:"owner/group id", id: "own", name: "own", type: "hidden"}
		},
		"tab3": {
			"cty": { label:"Ciudad", id:"cty", name: "cty", type: "text"},
			"lct": { label:"location", id:"lct", name: "lct", type: "text", cls: "shared_space_fields_left"},
			"lcl": { label:"locale", id:"lcl", name: "lcl", type: "text", cls: "shared_space_fields_right"},
			"lat": { label: "Latitud", id: "lat", name: "lat", type: "text", cls: "shared_space_fields_left"},
			"log": { label: "Longitud", id: "log", name: "log", type: "text", cls: "shared_space_fields_right"},
		}
 }
};
