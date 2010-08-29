var SVGToCanvas = {
	endpoint: "conversion/convert.php",
	
	base64dataURLencode: function(s) {
		var b64 = "data:image/svg+xml;base64,";

		if (window.btoa) b64 += btoa(s);
		else b64 += Base64.encode(s);
		
		return b64;
	},
	
	xmlSerialize: function(SVGdom) {
		if (window.XMLSerializer) {
		 	return (new XMLSerializer()).serializeToString(SVGdom);
		} else {
			return SVGToCanvas.XMLSerializerForIE(SVGdom);
		}
	},
	
	// quick-n-serialize an SVG dom, needed for IE9 where there's no XMLSerializer nor SVG.xml
	// s: SVG dom, which is the <svg> elemennt
	XMLSerializerForIE: function(s) {
		var out = "";

		out += "<" + s.nodeName;
		for (var n = 0; n < s.attributes.length; n++) {
			out += " " + s.attributes[n].name + "=" + "'" + s.attributes[n].value + "'";
		}
		
		if (s.hasChildNodes()) {
			out += ">\n";

			for (var n = 0; n < s.childNodes.length; n++) {
				out += SVGToCanvas.XMLSerializerForIE(s.childNodes[n]);
			}

			out += "</" + s.nodeName + ">" + "\n";

		} else out += " />\n";

		return out;
	},


	// works in webkit
	convert: function (sourceSVG, targetCanvas, x,y) {
		var svg_xml = this.xmlSerialize(sourceSVG);
		var ctx = targetCanvas.getContext('2d');
		var img = new Image();
		// ff fails here, http://en.wikipedia.org/wiki/SVG#Native_support
		img.src = this.base64dataURLencode(svg_xml);

		img.onload = function() {
			console.log("Exported image size " + img.width + "x" + img.height);
			// ie and opera fail here for svg input, maybe it's a plan to prevent origin-dirtying?
			ctx.drawImage(img, (x | 0), (y | 0));
		}
		
		img.onerror = function() {
			// TODO: if export fails, don't set Canvas dirty in GUI
			alert("Can't export! Maybe your browser doesn't support " +
				"SVG in img element or SVG input for Canvas drawImage?\n" +
				"http://en.wikipedia.org/wiki/SVG#Native_support")
		}
		
	},

	// needs (jquery and) a same-origin server?
	convertServer: function (sourceSVG, targetCanvas, x,y) {
		var svg_xml = this.xmlSerialize(sourceSVG);
	
		$.post(this.endpoint, { svg_xml: svg_xml }, function(data) {
		    var ctx = targetCanvas.getContext('2d');
			var img = new Image();
			img.src = data;
			
			img.onload = function() {
				ctx.drawImage(img, x | 0, y | 0);
			}
		});
	},

	// works in ff, opera and ie9
	convertCanvg: function (sourceSVG, targetCanvas) {
		// TODO: what's canvg's proposed method for getting svg string value?
		var svg_xml = this.xmlSerialize(sourceSVG);
		canvg(targetCanvas, svg_xml, { ignoreMouse: true, ignoreAnimation: true });
	},


	// WON'T WORK; canvas' origin-clean is dirty
	exportPNG: function (svg, callback) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext('2d');
		var img = new Image();
		// ff fails here, http://en.wikipedia.org/wiki/SVG#Native_support
		var svg_xml = SVGtoDataURL.xmlSerialize(svg);
		img.src = SVGtoDataURL.base64dataURLencode(svg_xml);

		img.onload = function() {
			console.log("Exported image size " + img.width + "x" + img.height);
			// ie and opera fail here for svg input, maybe it's a plan to prevent origin-dirtying?
			ctx.drawImage(img, 0, 0);
			// SECURITY_ERR
			callback(canvas.toDataURL());
		}
		
		img.onerror = function() {
			console.log(
				"Can't export! Maybe your browser doesn't support " +
				"SVG in img element or SVG input for Canvas drawImage?\n" +
				"http://en.wikipedia.org/wiki/SVG#Native_support"
			);
		}
	},

	// works nicely
	exportPNGcanvg: function (sourceSVG, callback) {
		var svg_xml = this.xmlSerialize(sourceSVG);
		
		var exportCanvas = document.createElement("canvas");	
		exportCanvas.setAttribute("style", "display: none;");
		document.body.appendChild(exportCanvas);
		
		canvg(exportCanvas, svg_xml, { ignoreMouse: true, ignoreAnimation: true });
		png_dataurl = exportCanvas.toDataURL();
		document.body.removeChild(exportCanvas);
		
		callback(png_dataurl);
	},

	exportPNGserver: function(sourceSVG, callback) {
		var svg_xml = this.xmlSerialize(sourceSVG);
		$.post(this.endpoint, { svg_xml: svg_xml }, callback);		
	},

	exportSVG: function (sourceSVG, callback) {
		var svg_xml = this.xmlSerialize(sourceSVG);
		svg_dataurl = SVGToCanvas.base64dataURLencode(svg_xml);
		callback(svg_dataurl);
	},
}
