function MARTAStops(_data) {
    var data = _data;

    function getId() {
        return data[2];
    }

    function getPosition() {
        return {
            latitude: data[3],
            longitude: data[4]
        };
    }

    function getDescription() {
    	return 'Bus stop';
    }

    return {
        id: getId(),
        name: getId(),
        position: getPosition,
        description: getDescription,
        model : {
            uri : '/Apps/Atlanta/models/bus-stop.glb',
            minimumPixelSize : 128,
            maximumScale : 60
        }
    };
}