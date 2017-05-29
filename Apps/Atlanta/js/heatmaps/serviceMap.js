function ServiceMap(position, data) {
	var heatRed = 0 ;
	var heatBlue = 0 ;

	for (var k=0; k<data.length; k++){
		heatRed = 0.2*data[k]["Grand Total"]*Math.sqrt(Math.pow(position.latitude - data[k]["latitude"], 2) + Math.pow(position.longitude - data[k]["longitude"], 2)) + heatRed;
		heatBlue = 0.2*data[k]["Grand Total"]*Math.sqrt(Math.pow(position.latitude - data[k]["latitude"], 2) + Math.pow(position.longitude - data[k]["longitude"], 2)) + heatBlue;
	}

	return new Cesium.Color(heatRed,10-heatRed,0.5,1);
}

