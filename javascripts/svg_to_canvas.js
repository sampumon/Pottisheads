var SVGToCanvas = {
	// for Safari and Opera
	convert: function (sourceSVG, targetCanvas, x,y) {
		svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);
		var ctx = targetCanvas.getContext('2d');
		var img = new Image();
		img.src = "data:image/svg+xml;base64," + btoa(svg_xml);
		
		img.onload = function() {
			ctx.drawImage(img, (x | 0), (y | 0));
		}
		
	}
}