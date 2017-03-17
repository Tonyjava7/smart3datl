var Smart3DATL = Smart3DATL || {};

Smart3DATL.checkBoundaries = function(latitude, longitude) {
    //return ((longitude >= -84.405919) && (longitude <= -84.337190)) && ((latitude >= 33.761399) && (latitude <= 33.794855));
    return ((longitude >= -84.405919) && (longitude <= -84.377190)) && ((latitude >= 33.761399) && (latitude <= 33.784855));
};

function startup(Cesium) {
    'use strict';

    window.Cesium = Cesium;

    Smart3DATL.Model.init();

    Smart3DATL.Data.buildings().then(function(buildings) {
        Smart3DATL.Model.create(buildings);
        heatmapUpdate('off');
    });
    Smart3DATL.Data.stops().then(function(stops) {
        Smart3DATL.Stops.create(Smart3DATL.Model.viewer(), stops);
    });

    var updateBuses = function() {
        Smart3DATL.Data.allBuses().then(function(routes) {
            Smart3DATL.Routes.create(Smart3DATL.Model.viewer(), routes);
            setTimeout(updateBuses, 1000);
        });
    };
    updateBuses();

    // Update with navigation events
    // type = on, off, delta
    var heatmapUpdate = function(type) {
        Smart3DATL.Data.heatmap(type).then(function(heatmapData) {
            Smart3DATL.Model.heatmap(heatmapData);
        });
    };


    function loaded() {
        var loader = document.querySelector('.sandcastle-loading');
        loader.className = '';
    }
    loaded();

    var heatmapMode = "off";
    document.querySelector('nav').addEventListener('click', function() {
        if(heatmapMode == "off") {
            heatmapMode = "on";
        } else {
            heatmapMode = "off";
        }
        heatmapUpdate(heatmapMode);
    });

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