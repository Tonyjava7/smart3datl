
function startup(Cesium) {
    'use strict';

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

    var viewer = new Cesium.Viewer('cesiumContainer', {
        infoBox : false,
        selectionIndicator : false,
        shadows : false
    });

    var entity;

    function loaded() {
        var loader = document.querySelector('.sandcastle-loading');
        loader.className = '';
    }

    function createModel(url, latitude, longitude, last) {

        var position = Cesium.Cartesian3.fromDegrees(-84.38798, 33.774405, 0.0);
        
        // Building color by position
        var colorRed = 200*Math.sqrt((latitude - 33.77191)*(latitude - 33.77191) + (longitude + 84.38717)*(longitude + 84.38717));
        var colorBlue = 200*Math.sqrt((latitude - 33.77191)*(latitude - 33.77191) + (longitude + 84.38717)*(longitude + 84.38717));
        
        var ccode = new Cesium.Color(colorRed,2.0,colorBlue, 1.0);

        entity = viewer.entities.add({
            name : url,
            position : position,
            model : {
                uri : url,
                color : ccode,
            }
        });

        return entity;
    }

    for (var i = 0; i < 1000; i++) {
        buildings[i].push(createModel(buildings[i][0],buildings[i][1],buildings[i][2]));
    }
    loaded();

/*
    Sandcastle.addToggleButton('Shadows', viewer.shadows, function(checked) {
        viewer.shadows = checked;
    });
*/

}
if (typeof Cesium !== "undefined") {
    startup(Cesium);
} else if (typeof require === "function") {
    require(["Cesium"], startup);
}