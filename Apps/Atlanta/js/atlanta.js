var Smart3DATL = Smart3DATL || {};

Smart3DATL.checkBoundaries = function(latitude, longitude) {
    return ((longitude >= -84.405919) && (longitude <= -84.337190)) || ((latitude >= 33.761399) && (latitude <= 33.794855));
};

function startup(Cesium) {
    'use strict';

    window.Cesium = Cesium;

    Smart3DATL.Model.init();

    Smart3DATL.Data.buildings().then(function(buildings) {
        //Smart3DATL.Model.create(buildings);
    });
    Smart3DATL.Data.stops().then(function(stops) {
        //Smart3DATL.Stops.create(Smart3DATL.Model.viewer(), stops);
    });

    var updateBuses = function() {
        Smart3DATL.Data.allBuses().then(function(routes) {
            Smart3DATL.Routes.create(Smart3DATL.Model.viewer(), routes);
            setTimeout(updateBuses, 5000);
        });
    };
    updateBuses();

    function loaded() {
        var loader = document.querySelector('.sandcastle-loading');
        loader.className = '';
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