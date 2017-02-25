var Smart3DATL = Smart3DATL || {};
Smart3DATL.Routes = (function() {
    var buses = {};

    function createRoute(viewer, lat, long) {
    	//console.log('createRoute', lat, long);
		    
	    var position = Cesium.Cartesian3.fromDegrees(long, lat, 0);

	    var entity = viewer.entities.add({
	        position : position,
	        model : {
	            uri : "../Atlanta/models/bus.glb",
	            minimumPixelSize : 128,
	            maximumScale : 20
	        }

	    });
	    return entity;
	}

    function create(viewer, data) {
        //Add code to create stops here
        for (var i = 0; i < data.length; i++) {
			var longitude = parseFloat(data[i].LONGITUDE);
			var latitude = parseFloat(data[i].LATITUDE);

			if (Smart3DATL.checkBoundaries(latitude, longitude)) {
				if (buses[data[i].VEHICLE]) {
					buses[data[i].VEHICLE].position = Cesium.Cartesian3.fromDegrees(long, lat, 0);
				} else {
					buses[data[i].VEHICLE] = createRoute(viewer, latitude, longitude);
				}
				buses[data[i].VEHICLE].updated = true;
			}
		}

		for (let bus in buses) {
			if (buses[bus].updated) {
				buses[bus].updated = false;
			} else {
				buses[bus].show = false;
			}
		}
    }

    return {
        create: create
    };
})();