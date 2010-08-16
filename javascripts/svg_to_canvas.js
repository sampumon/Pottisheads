var SVGToCanvas = {
	endpoint: "conversion/convert.php",

	// works in webkit (and opera?)		
	convert: function (sourceSVG, targetCanvas, x,y) {
		var svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);
		var ctx = targetCanvas.getContext('2d');
		var img = new Image();
		img.src = "data:image/svg+xml;base64," + btoa(svg_xml);

		// TODO: opera needs pre-render to fire onload (but still fails)
		// document.body.appendChild(img);
		
		img.onload = function() {
			console.log("Exported image size " + img.width + "x" + img.height);
			// TODO: opera fails here, maybe it's a plan to prevent origin-dirtying?
			ctx.drawImage(img, (x | 0), (y | 0));
		}
		
		img.onerror = function() {
			alert("Can't export! Maybe your browser doesn't support <a href='http://en.wikipedia.org/wiki/SVG#Native_support'>svg-in-img</a>?")
		}
		
	},



	// needs (jquery and) a same-origin server?
	convertServer: function (sourceSVG, targetCanvas, x,y) {
		var svg_xml = (new XMLSerializer()).serializeToString(sourceSVG)
	
		$.post(this.endpoint, { svg_xml: svg_xml }, function(data) {
		    var ctx = targetCanvas.getContext('2d');
			var img = new Image();
			img.src = data;
			
			img.onload = function() {
				ctx.drawImage(img, x | 0, y | 0);
			}
		});
	},

	// does not work in ie without flashcanvas etc
	convertCanvg: function (sourceSVG, targetCanvas, x,y) {
		// TODO: what's canvg's proposed method for getting svg string value?
		var svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);
		canvg(targetCanvas, svg_xml);
	},

	exportCanvgAsNewWindow: function (sourceSVG) {
		// TODO: what's canvg's proposed method for getting svg string value?
		var svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);
		
		var exportCanvas = document.createElement("canvas");	
		document.body.appendChild(exportCanvas);
		
		canvg(exportCanvas, svg_xml);
			
		window.open(exportCanvas.toDataURL());
		document.body.removeChild(exportCanvas);

	},

	exportServerSideAsNewWindow: function(sourceSVG) {
		var svg_xml = (new XMLSerializer()).serializeToString(sourceSVG)

		$.post(this.endpoint, { svg_xml: svg_xml },
				   function(data) {
					    window.open(data);
					  });
		
		},

	// works in webkit (and opera?)		
	exportAsNewWindow: function (sourceSVG) {
		var svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);
		//var img = new Image();
		//img.src = "data:image/svg+xml;base64," + btoa(svg_xml);

		window.open("data:image/svg+xml;base64," + btoa(svg_xml));
	}
}