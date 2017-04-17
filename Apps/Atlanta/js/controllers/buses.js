function MARTABuses(_data) {
    var data = _data;
    var updateTime = new Date().getTime();

    function getId() {
        return data.VEHICLE;
    }

    function getName() {
        return data.ROUTE + ' ' + data.DIRECTION;
    }

    function getPosition() {
        return {
            latitude: parseFloat(data.LATITUDE),
            longitude: parseFloat(data.LONGITUDE)
        };
    }

    function updateEntity(entity, _data) {
        var longitude, latitude, longitudeLast, latitudeLast, longitudeVelocity, latitudeVelocity;
        var tempLong =  longitude; 
        var tempLat = latitude;
        if (_data) {
            data = _data;
        }

        longitude = parseFloat(data.LONGITUDE);
        latitude = parseFloat(data.LATITUDE);

        //Add code to create stops here
        var lastT = updateTime;
        updateTime = new Date().getTime();
        var deltaT = updateTime - lastT;

        longitudeLast  = tempLong;
        latitudeLast = tempLat;
        longitudeVelocity = (longitude - longitudeLast) / deltaT;
        latitudeVelocity = (latitude - latitudeLast) / deltaT;

        if (deltaT && longitudeVelocity) {
            var heading = Math.atan(latitudeVelocity / longitudeVelocity);
            var pitch = 0;
            var roll = 0;
            var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            var orientation2 = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

            if (orientation2.x + orientation2.y + orientation2.z + orientation2.w !== NaN) {
                 entity.orientation = orientation2;
            }
        }
    }

    function getDescription(entity) {
        var sDescription = '<h2>' + data.ROUTE + ' ' + data.DIRECTION + '</h2>';

        sDescription += '<div>Vehicle: ' + data.VEHICLE + '</div>';

        sDescription += '<div>Stop: ' + data.TIMEPOINT + '</h2>';

        sDescription += '<div>Adherance: ' + data.ADHERENCE + '</h2>';
        

        return sDescription;
    }

    function getColor() {
        if (parseFloat(data.ADHERENCE) > 0) {
            return new Cesium.Color(0,0,1,1);
        } else if (parseFloat(data.ADHERENCE) < 0) {
            return new Cesium.Color(1,0,0,1);
        } else {
            return new Cesium.Color(1,1,1,1);
        }
    }

    return {
        id: getId(),
        name: getName(),
        color: getColor,
        position: getPosition,
        update: updateEntity,
        description: getDescription,
        model : {
            uri : '/Apps/Atlanta/models/bus.glb',
            minimumPixelSize : 128,
            maximumScale : 20
        }
    };
}
