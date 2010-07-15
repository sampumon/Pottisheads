function activatePixelToolbar(toolbar, target) {

	// yo colors
	var colors = toolbar.getElementsByClassName("color");
	for (var i = 0; i < colors.length; i++) {
		colors[i].onclick = function() {
			c = this.style.backgroundColor;
			target.changeColor(c);
		}
	}

	// sup brushes
	var brushs = toolbar.getElementsByClassName("brush");
	for (var i = 0; i < brushs.length; i++) {
		brushs[i].onclick = function(e) {
			var s = parseInt(this.clientHeight);
			target.changeBrush(s);
		}
	}
}
