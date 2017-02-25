var Smart3DATL = Smart3DATL || {};
Smart3DATL.Stops = (function() {
    var stops = [];

    function createStop(viewer, long, lat) {
		    
	    var position = Cesium.Cartesian3.fromDegrees(long, lat, 0);

	    var entity = viewer.entities.add({
	        name : "../Atlanta/models/bus-stop-simple.glb",
	        position : position,
	        model : {
	            uri : "../Atlanta/models/bus-stop-simple.glb",
	            minimumPixelSize : 128,
	            maximumScale : 1
	        }

	    });
	    return entity;
	}



    function create(viewer, stopsData) {
        //Add code to create stops here
        for (var i = 0; (i < stopsData.length); i++) {
		  var latitude = stopsData[i][3];
		  var longitude = stopsData[i][4];

		  if (((longitude >= -84.405919) && (longitude <= -84.337190)) || ((latitude >= 33.761399) && (latitude <= 33.794855))) {
		  	stops.push(createStop(viewer, longitude, latitude));

		  }

		    
		}

	
    }

    return {
        create: create
    };
})();