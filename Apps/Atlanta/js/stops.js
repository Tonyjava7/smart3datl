var Smart3DATL = Smart3DATL || {};
Smart3DATL.Stops = (function() {
    var stops = [];

    function createStop(viewer, lat, long) {
		    
	    var position = Cesium.Cartesian3.fromDegrees(lat, long, 0);

	    var entity = viewer.entities.add({
	        name : "../Atlanta/models/bus-stop-simple.glb",
	        position : position,
	        model : {
	            uri : "../Atlanta/models/bus-stop-simple.glb",
	            minimumPixelSize : 128,
	            scale: 100,
	            maximumScale : 20000
	        }

	    });
	    return entity;
	}



    function create(viewer, stopsData) {
        //Add code to create stops here
        for (var i = 0; (i < stopsData.length) && (i < 10); i++) {
		  var longitude = stopsData[i][3];
		  var latitude = stopsData[i][4];

		  stops.push(createStop(viewer, latitude, longitude));
		    
		}

	
    }

    return {
        create: create
    };
})();