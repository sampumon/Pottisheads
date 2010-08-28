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
			console.log("using standard XMLSerializer.serializeToString")
		 	return (new XMLSerializer()).serializeToString(SVGdom);
		} else {
			console.log("using custom XMLSerializerForIE ^____^")
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

	// works in webkit (and opera?)
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

	// does not work in ie without flashcanvas etc?
	convertCanvg: function (sourceSVG, targetCanvas, x,y) {
		// TODO: what's canvg's proposed method for getting svg string value?
		var svg_xml = this.xmlSerialize(sourceSVG);
		canvg(targetCanvas, svg_xml, { ignoreMouse: true, ignoreAnimation: true });
	},

	exportCanvgAsNewWindow: function (sourceSVG) {
		// TODO: what's canvg's proposed method for getting svg string value?
		var svg_xml = this.xmlSerialize(sourceSVG);
		
		var exportCanvas = document.createElement("canvas");	
		document.body.appendChild(exportCanvas);
		
		canvg(exportCanvas, svg_xml);
			
		window.open(exportCanvas.toDataURL());
		document.body.removeChild(exportCanvas);

	},

	exportServerSideAsNewWindow: function(sourceSVG) {
		var svg_xml = this.xmlSerialize(sourceSVG);

		$.post(this.endpoint, { svg_xml: svg_xml },
				   function(data) {
					    window.open(data);
					  });
		
		},

	exportAsNewWindow: function (sourceSVG) {
		var svg_xml = this.xmlSerialize(sourceSVG);

		window.open(SVGToCanvas.base64dataURLencode(svg_xml));
	},
	
	exportToImgIE: function (sourceSVG) {
		var svg_xml = this.xmlSerialize(sourceSVG);
		
		var img = document.getElementById("ieImg");
		img.setAttribute("src",SVGToCanvas.base64dataURLencode(svg_xml));


	}
}
