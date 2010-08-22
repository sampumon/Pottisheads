// thanks: http://adomas.org/javascript-mouse-wheel/
function getMouseWheel(e)
{
	// well, this is really crappy, even the sign differs between browsers
	var delta = e.wheelDelta || e.detail;
	if (delta < 0) delta = -1;
	if (delta > 0) delta = 1;

	return delta;
}

function getMouseCoords(e, parent)
{
	// slight hack here, see getMouseCoordsSVG
	if (parent.offsetLeft && parent.offsetTop) return getMouseCoordsCanvas(e, parent);
	else if (parent.nodeName == "svg") return getMouseCoordsSVG(e, parent);
	else return getMouseCoordsCanvas(e, parent);
}

// mega&super thanks to Hillel Lubman!
// and alas, to Andreas Neumann: http://www.carto.net/papers/svg/eventhandling/
function getMouseCoordsSVG(evt, svg_elem)
{
	var matrix = svg_elem.getScreenCTM();
	var point = svg_elem.createSVGPoint();

	// NOTE: changed evt.clientXY -> evt.pageXY (sampula)
	// TODO: seems that for Safari pageXY is correct, for FF clientXY is correct,
	// and for all screenXY is never correct, despite definition:
	// http://www.w3.org/TR/2004/WD-SVG12-20041027/dom.html#getScreenCTM
	point.x = evt.clientX;
	point.y = evt.clientY;
	
	point = point.matrixTransform(matrix.inverse());
	return point;
}

// does not work in firefox+svg (but does in canvas, naturally)
function getMouseCoordsCanvas(e, parent) {
	var x, y;
	
	// parent.offset{Left,Top} not defined in firefox+svg :/
	x = e.pageX - (parent.offsetLeft || 0);
	y = e.pageY - (parent.offsetTop || 0);

	return { x: x, y: y }
}

// hopefully return the mouse coordinates inside parent element
function getMouseCoordsCrappy(e, parent) {
	var x, y;
	muna = parent;
	
	if (document.getBoxObjectFor) {
		// sorry for the deprecated use here, but see below
		var boxy = document.getBoxObjectFor(parent);
		x = e.pageX - boxy.x;
		y = e.pageY - boxy.y;
	} else if (parent.getBoundingClientRect) {
		// NOTE: buggy for FF 3.5: https://bugzilla.mozilla.org/show_bug.cgi?id=479058
		/* I have also noticed that the returned coordinates may change unpredictably
		after the DOM is modified by adding some children to the SVG element */
		var lefttop = parent.getBoundingClientRect();
		//console.log(parent.id + " " + lefttop.left + " " + lefttop.top);
		x = e.clientX - Math.floor(lefttop.left);
		y = e.clientY - Math.floor(lefttop.top);
	} else {
		x = e.pageX - (parent.offsetLeft || 0);
		y = e.pageY - (parent.offsetTop || 0);
	}

	return { x: x, y: y }
}
