<?php
function getMicrotime() {
	list($usec, $sec) = explode(" ",microtime());
   	$usec_array = explode(".",$usec);

	return $usec_array[1];
}

$timestamp = date('Y-m-d_H-i-s_').getMicrotime();

$target_png = "converted/".$timestamp.".png";
$source_svg = "source_svg/".$timestamp.".svg";

$svg_xml = $_POST['svg_xml'];
$svg_xml = stripslashes($svg_xml);

if ( $svg_xml == "" )
	die("no xml provided");
	
file_put_contents($source_svg, $svg_xml);

system("convert -background none ".$source_svg." ".$target_png);
system("chmod a+r converted/*");

echo $target_png;
?>
