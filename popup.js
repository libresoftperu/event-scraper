var scraperPop={};
scraperPop.controlbutton = null;
scraperPop.results = null;


scraperPop.createField = function ( ky, val ) {
	var v = document.createElement("input");
	var k = document.createElement("label");
	var fldCnt = document.createElement("div");
	fldCnt.className = "formfield";
	v.id = ky;
	v.value = val;
	k.for = ky;
	k.innerText = ky + ": ";
	fldCnt.appendChild(k);
	fldCnt.appendChild(v);
	return fldCnt;
};

scraperPop.createComponent = function ( name, cmp ) {
	var fs = document.createElement("fieldset");
	fs.className = "component";
	var legend = document.createElement("legend");
	legend.innerText = name;
	fs.appendChild(legend);
	fscnt = document.createElement("div");
	for (var i=0; i<cmp.length; i++) {
		var cnt = document.createElement("div");
		var data = cmp[i];
		for (var ky in data){

			/*
			var fld = scraperPop.createField(ky,data[ky]);
					cnt.appendChild(fld);
			*/
		
			if (data[ky] instanceof Array) {
				var more = document.createElement("div");
				more.innerText = "***";
				cnt.appendChild(more);
			} else {
					var fld = scraperPop.createField(ky,data[ky]);
					cnt.appendChild(fld);
			}
		

		}
		var hr = document.createElement("hr");
		cnt.appendChild(hr);
		fscnt.appendChild(cnt);
	}
	fs.appendChild(fscnt);
	return fs;
};

scraperPop.buildForm = function ( dataEnvelope ) {
	scraperPop.results = dataEnvelope;
	var data = dataEnvelope.scrape;
	if (!data) return;
	console.log(data);
	var cnt = document.getElementById("popupCnt");
	var cbar = document.getElementById("componentbar");
	if (!cnt) {
		cnt = document.createElement("div");
		cnt.id="popupCnt";
		document.body.appendChild(cnt);
	}
	for (var ky in data){
		if (data[ky] instanceof Array) {
			var cmp = scraperPop.createComponent(ky,data[ky]);
			cbar.appendChild(cmp);
		} else {
			var fld = scraperPop.createField(ky,data[ky]);
			cnt.appendChild(fld);
		}
	}
	scraperPop.controlbutton.disabled = false;
	console.log("finished building form. controlbutton.disabled = " + scraperPop.controlbutton.disabled);
};

scraperPop.patchProcessed = function ( obj ) {
	// TODO: handle data which should be onreadystatechange from xmlhttprequest
	console.log(obj);
	scraper.controlbutton.value = "Processed Succesfully";
};

window.addEventListener('DOMContentLoaded', function() {

	var cb = document.getElementById("controlbutton");
	cb.onclick = function(){
		cb.value = "updating...";
		cb.disabled = "true";
		chrome.extension.sendMessage( { patch:scraperPop.results }, scraperPop.patchProcessed );

		return false;
	};
	cb.disabled = "true";
	scraperPop.controlbutton = cb;
	chrome.tabs.query( { active: true, currentWindow: true }, function ( tabs ) {
		chrome.tabs.sendMessage( tabs[0].id, { popupDOMready:true }, scraperPop.buildForm );
	});
});
