var Smart3DATL = Smart3DATL || {};
Smart3DATL.Model = (function() {
    var viewer;
    var buildings = [];

    function appendBuilding(url, latitude, longitude, last) {

        // Uses atlanta coordinates
        var position = Cesium.Cartesian3.fromDegrees(-84.38798, 33.774405, 0.0);
        
        // Building color by position
        var colorRed = 200*Math.sqrt((latitude - 33.77191)*(latitude - 33.77191) + (longitude + 84.38717)*(longitude + 84.38717));
        var colorBlue = 200*Math.sqrt((latitude - 33.77191)*(latitude - 33.77191) + (longitude + 84.38717)*(longitude + 84.38717));
        
        var ccode = new Cesium.Color(colorRed,2.0,colorBlue, 1.0);

        var entity = viewer.entities.add({
            name : url,
            position : position,
            model : {
                uri : url,
                color : ccode
            }
        });

        return entity;
    }

    function init() {
        //Sandcastle_Begin
        /*
        var viewer = new Cesium.Viewer('cesiumContainer', {
            animation: false,
            timeline: false,
            infoBox: false,
            navigationHelpButton: false,
            homeButton: false,
            scene3DOnly: true
        });
        */

        //viewer.extend(Cesium.viewerCesiumInspectorMixin);

        viewer = new Cesium.Viewer('cesiumContainer', {
            infoBox : false,
            selectionIndicator : false,
            shadows : false,
            animation: false,
            timeline: false,
            infoBox: false,
            navigationHelpButton: false,
            homeButton: false,
            scene3DOnly: true
        });

        var position = Cesium.Cartesian3.fromDegrees(-84.38798, 33.774405, 5000.0);

        viewer.camera.setView({
            destination : position,
            orientation: {
                heading : 0.0,
                pitch : -Cesium.Math.PI_OVER_TWO,
                roll : 0.0
            }
        });
    }

    function create(buildingsData) {
        for (var i = 0; i < buildingsData.length && i < 1000; i++) {
            var item = buildingsData[i];
            appendBuilding(item[0],item[1],item[2]);
        }
        return viewer;
    }

    function createHeatMap(data) {
        // To Do
    }

    return {
        init: init,
        create: create,
        heatMap: createHeatMap,
        viewer: function() {
            return viewer;
        }
    };
})();