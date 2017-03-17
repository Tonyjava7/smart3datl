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

var deltaT, currentT, lastT;
var countTime = 0;

    function create(viewer, data) {
        //Add code to create stops here
        lastT = currentT; 
        currentT = new Date().getTime();
        deltaT = currentT - lastT;
        countTime++;
        for (var i = 0; i < data.length; i++) {
            var longitude, latitude, longitudeLast, latitudeLast, longitudeVelocity, latitudeVelocity;
            var tempLong =  longitude; 
            var tempLat = latitude;
            longitude = parseFloat(data[i].LONGITUDE);
            latitude = parseFloat(data[i].LATITUDE);
            longitudeLast  = tempLong;
            latitudeLast = tempLat;
            longitudeVelocity = (longitude - longitudeLast) / deltaT;
            latitudeVelocity = (latitude - latitudeLast) / deltaT;
            
            // debugger;
            var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
            var heading = Math.atan(latitudeVelocity / longitudeVelocity);
            var pitch = 0;
            var roll = 0;
            var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            var orientation2 = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);


            if (Smart3DATL.checkBoundaries(latitude, longitude)) {
                if (buses[data[i].VEHICLE]) {
                    buses[data[i].VEHICLE].position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
                    if (orientation2.x + orientation2.y + orientation2.z + orientation2.w !== NaN) {
                        // debugger;
                         //buses[data[i].VEHICLE].orientation = orientation2;
                    }
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