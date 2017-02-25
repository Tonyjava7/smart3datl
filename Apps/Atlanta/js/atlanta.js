var Smart3DATL = Smart3DATL || {};

function startup(Cesium) {
    'use strict';

    window.Cesium = Cesium;

    Smart3DATL.Model.init();

    Smart3DATL.Data.buildings().then(function(buildings) {
        Smart3DATL.Model.create(buildings);
    });
    Smart3DATL.Data.stops().then(function(stops) {
        Smart3DATL.Stops.create(Smart3DATL.Model.viewer(), stops);
    });

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