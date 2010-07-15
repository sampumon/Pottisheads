// hopefully return the mouse coordinates inside parent element
function getMouseCoords(e, parent) {
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
