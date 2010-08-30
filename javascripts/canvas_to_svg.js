var CanvasToSVG = {
	idCounter: 0,
	convert: function(sourceCanvas, targetSVG, x, y) {
		var svgNS = "http://www.w3.org/2000/svg";
		var xlinkNS = "http://www.w3.org/1999/xlink";

		// get base64 encoded png from Canvas
		var image = sourceCanvas.toDataURL();

		// must be careful with the namespaces
		var svgimg = document.createElementNS(svgNS, "image");

		svgimg.setAttribute('id', 'importedCanvas_' + this.idCounter++);
		svgimg.setAttributeNS(xlinkNS, 'xlink:href', image);

		svgimg.setAttribute('x', x ? x : 0);
		svgimg.setAttribute('y', y ? y : 0);
		svgimg.setAttribute('width', sourceCanvas.width);
		svgimg.setAttribute('height', sourceCanvas.height);
		// TODO: drag-drop should skip transparent pixels
		// WON'T HELP: svgimg.setAttribute('style', 'pointer-events: visible;')
	
		// MATSUL: kommentoin pois, en huomannut eroa, mikä tää on?
		// pixel data needs to be saved because of firefox data:// url bug:
		// http://markmail.org/message/o2kd3bnnv3vcbwb2
		// svgimg.imageData = sourceCanvas.toDataURL();

		targetSVG.appendChild(svgimg);
	},
}
