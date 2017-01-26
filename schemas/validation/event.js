var eventSchema = {
	"$schema": "http://json-schema.org/draft-04/schema#",
	"title": "Event Object",
	"defs": {
		"jsdouble": { "type":"number", "multipleOf":1 },
		"uri": { "type":"string", "format":"uri" },
		"jsdoublebit": {
			"type":"number",
			"enum": [ 1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,524288,1048576,2097152,4194304,8388608,16777216,33554432,67108864,134217728,268435456,536870912,1073741824,2147483648,4294967296,8589934592,17179869184,34359738368,68719476736,137438953472,274877906944,549755813888,1099511627776,2199023255552,4398046511104,8796093022208,17592186044416,35184372088832,70368744177664,140737488355328,281474976710656,562949953421312,1125899906842624 ]
		},
		"tinystr": { "type":"string", "minLength":1, "maxLength":24 },
		"shortstr": { "type":"string", "minLength":18, "maxLength":256 }
	},
	"type": "object",
	"properties": {
		"eid": { "title":"event id", "$ref":"#/defs/jsdouble" },
		"pub": { "title":"publish stamp", "$ref":"#/defs/jsdouble" },
		"lct": { "title":"location", "$ref":"#/defs/jsdoublebit" },
		"cty": { "title":"city", "$ref":"#/defs/jsdouble" },
		"lcl": { "title":"locale", "$ref":"#/defs/jsdoublebit" },
		"ref": { "title":"refers to", "$ref":"#/defs/uri" },
		"ini": { "title":"start datetime", "$ref":"#/defs/jsdouble" },
		"dur": { "title":"duration seconds", "$ref":"#/defs/jsdouble" },
		"rpt": { "title":"repeat", "type":"object" },
		"tit": { "title":"title", "$ref":"#/defs/tinystr" },
		"sht": { "title":"short description", "$ref":"#/defs/shortstr" },
		"lng": { "title":"long description", "$ref":"#/defs/shortstr" },
		"img": { "title":"image id", "$ref":"#/defs/jsdouble" },
		"prc": { "title":"price (from)", "type":"number", "minimum":0 },
		"cre": { "title":"created stamp", "$ref":"#/defs/jsdouble" },
		"crb": { "title":"created by", "$ref":"#/defs/jsdouble" },
		"mod": { "title":"modified stamp", "$ref":"#/defs/jsdouble" },
		"mob": { "title":"modified by", "$ref":"#/defs/jsdouble" },
		"own": { "title":"owner/group id", "$ref":"#/defs/jsdouble" },
		"tag": { "title":"tagmask array", "type": "array",
			"items": [
				{ "title":"Content", "$ref":"#/defs/jsdouble" },
				{ "title":"Target", "$ref":"#/defs/jsdouble" }
			]
		}
	},
	"required": ["eid","pub","lct","lcl","ref","ini","tit","sht","prc","cre","crb","mod","mob","own","tag"]
};
