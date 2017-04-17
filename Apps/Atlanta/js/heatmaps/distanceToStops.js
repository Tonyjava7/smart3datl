function DistanceMARTAStops(position, data) {
	var heatColor = 0 ;
	var latNdx = 3;
	var lngNdx = 4;
	var maxDistance = 0;
	var distance = 0;
	var countGreen = 0;
	var countRed = 0;

	maxDistance = Math.sqrt(Math.pow(-84.405919 + 84.377190,2) + Math.pow(33.761399 - 33.784855,2));

	for (var k=0; k<data.length; k++){
		distance = Math.sqrt(Math.pow(position.latitude - data[k][latNdx], 2) + Math.pow(position.longitude - data[k][lngNdx], 2));

		if (distance < (maxDistance/100)) {
			countRed++;
		}
		if (distance < (maxDistance/200)) {
			countGreen++;
		}
	}

	return new Cesium.Color(countRed,countGreen,0.5,0.5);
}