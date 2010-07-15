function randomInt(max) {
	return Math.floor((Math.random() * max));
}

function randomRGB() {
	var r = randomInt(256);
	var g = randomInt(256);
	var b = randomInt(256);
	return "rgb("+r+","+g+","+b+")";
}
