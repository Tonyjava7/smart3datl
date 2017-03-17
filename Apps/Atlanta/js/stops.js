var Smart3DATL = Smart3DATL || {};
Smart3DATL.Stops = (function() {
    function createStop(viewer, long, lat) {
        var position = Cesium.Cartesian3.fromDegrees(long, lat, 0);

        var entity = viewer.entities.add({
            name : "../Atlanta/models/bus-stop-simple.glb",
            position : position,
            model : {
                uri : "../Atlanta/models/bus-stop-simple.glb",
                minimumPixelSize : 128,
                maximumScale : 20
            }

        });
        return entity;
    }

    function create(viewer, stopsData) {
        //Add code to create stops here
        var ndx = 0;
        for (var i = 0; (i < stopsData.length); i++) {
            var latitude = stopsData[i][3];
            var longitude = stopsData[i][4];

            if (Smart3DATL.checkBoundaries(latitude, longitude)) {
                createStop(viewer, longitude, latitude);
                ndx++;
            }
        }
        console.log(stopsData.length, ndx);
    }

    return {
        create: create
    };
})();