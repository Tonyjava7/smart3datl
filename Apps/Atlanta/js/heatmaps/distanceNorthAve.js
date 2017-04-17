function DistanceNorthAve(position, reference) {
    //Calculate heatmap
    //return update;
    if (!reference) {
        reference = {
            latitude: 33.77191,
            longitude: -84.38717
        };
    }

    // Building color by position
    var colorRed = 200*Math.sqrt(Math.pow(position.latitude - reference.latitude, 2) + Math.pow(position.longitude - reference.longitude, 2));
    var colorBlue = 200*Math.sqrt(Math.pow(position.latitude - reference.latitude, 2) + Math.pow(position.longitude - reference.longitude, 2));
    
    return new Cesium.Color(colorRed,2.0,colorBlue, 0.5);
}
