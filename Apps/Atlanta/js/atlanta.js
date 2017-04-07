var Smart3DATL = Smart3DATL || {};

Smart3DATL.Nav = {
    heatmap: {
        active: true,
        mode: "distance"
    },
    stops: {
        active: false
    },
    routes: {
        active: false
    }
};

Smart3DATL.checkBoundaries = function(latitude, longitude) {
    //Atlanta
    //return ((longitude >= -84.405919) && (longitude <= -84.337190)) && ((latitude >= 33.761399) && (latitude <= 33.794855));

    //North Avenue close to Georgia Tech
    return ((longitude >= -84.405919) && (longitude <= -84.377190)) && ((latitude >= 33.761399) && (latitude <= 33.784855));
};

function startup(Cesium) {
    'use strict';

    window.Cesium = Cesium;
	
	
    Smart3DATL.Model.init();

    Smart3DATL.Data.buildings().then(function(buildings) {
        Smart3DATL.Model.create(buildings);
        heatmapUpdate();
    });
    Smart3DATL.Data.stops().then(function(stops) {
        Smart3DATL.Stops.create(Smart3DATL.Model.viewer(), stops, Smart3DATL.Nav.stops.active);
    });

    var updateBuses = function() {
        Smart3DATL.Data.allBuses().then(function(routes) {
            Smart3DATL.Routes.create(Smart3DATL.Model.viewer(), routes, Smart3DATL.Nav.routes.active);
            setTimeout(updateBuses, 5000);
        });
    };
    updateBuses();

	
    // Update with navigation events
    // type = on, off, delta
    var heatmapUpdate = function() {
        var mode = Smart3DATL.Nav.heatmap.mode;
        if (Smart3DATL.Nav.heatmap.active) {
            if (mode == "on" || mode == "off") {
                Smart3DATL.Data.heatmap(mode).then(function(heatmapData) {
                    Smart3DATL.Model.heatmap(mode, heatmapData);
                });
            } else if (mode == "distance"){
                Smart3DATL.Model.heatmap(mode);
            } else {
                Smart3DATL.Model.heatmap();
            }
        } else {
            Smart3DATL.Model.heatmap();
        }
    };


    function loaded() {
        var loader = document.querySelector('.sandcastle-loading');
        loader.className = '';
    }
    loaded();
	
	
	
	

    //Heat map Nav
    if (Smart3DATL.Nav.heatmap.active) {
        document.querySelector('nav .heatmap').classList.add('active');
        document.querySelector('nav .heatmap li.' + Smart3DATL.Nav.heatmap.mode).classList.add('active');

    }
    document.querySelectorAll('nav .heatmap li').forEach(function(item) { item.addEventListener('click', function() {
        if (!item.classList.contains('active')) {
            document.querySelector('nav .heatmap li.active').classList.remove('active');
            item.classList.add('active');
            Smart3DATL.Nav.heatmap.mode = item.dataset.mode;
            heatmapUpdate();
        }
    })});

    document.querySelector('nav .heatmap > label').addEventListener('click', function(label) {
        document.querySelector('nav .heatmap').classList.toggle('active');
        Smart3DATL.Nav.heatmap.active = !Smart3DATL.Nav.heatmap.active;
        heatmapUpdate();
    });

    //Stops Nav
    if (Smart3DATL.Nav.stops.active) {
        document.querySelector('nav .stops').classList.add('active');
    }
    document.querySelector('nav .stops label').addEventListener('click', function(event) {
        event.target.parentNode.classList.toggle('active');
        Smart3DATL.Nav.stops.active = !Smart3DATL.Nav.stops.active;
        Smart3DATL.Stops.show(Smart3DATL.Nav.stops.active);
    });

    //Routes Nav
    if (Smart3DATL.Nav.routes.active) {
        document.querySelector('nav .routes').classList.add('active');
    }
    document.querySelector('nav .routes label').addEventListener('click', function(event) {
        event.target.parentNode.classList.toggle('active');
        Smart3DATL.Nav.routes.active = !Smart3DATL.Nav.routes.active;
        Smart3DATL.Routes.show(Smart3DATL.Nav.routes.active);
    });


    //Heat map Nav
    if (Smart3DATL.Nav.heatmap.active) {
        document.querySelector('nav .heatmap').classList.add('active');
        document.querySelector('nav .heatmap li.' + Smart3DATL.Nav.heatmap.mode).classList.add('active');

    }
    document.querySelectorAll('nav .heatmap li').forEach(function(item) { item.addEventListener('click', function() {
        if (!item.classList.contains('active')) {
            document.querySelector('nav .heatmap li.active').classList.remove('active');
            item.classList.add('active');
            Smart3DATL.Nav.heatmap.mode = item.dataset.mode;
            heatmapUpdate();
        }
    })});

    document.querySelector('nav .heatmap > label').addEventListener('click', function(label) {
        document.querySelector('nav .heatmap').classList.toggle('active');
        Smart3DATL.Nav.heatmap.active = !Smart3DATL.Nav.heatmap.active;
        heatmapUpdate();
    });

    //Stops Nav
    if (Smart3DATL.Nav.stops.active) {
        document.querySelector('nav .stops').classList.add('active');
    }
    document.querySelector('nav .stops label').addEventListener('click', function(event) {
        event.target.parentNode.classList.toggle('active');
        Smart3DATL.Nav.stops.active = !Smart3DATL.Nav.stops.active;
        Smart3DATL.Stops.show(Smart3DATL.Nav.stops.active);
    });

    //Routes Nav
    if (Smart3DATL.Nav.routes.active) {
        document.querySelector('nav .routes').classList.add('active');
    }
    document.querySelector('nav .routes label').addEventListener('click', function(event) {
        event.target.parentNode.classList.toggle('active');
        Smart3DATL.Nav.routes.active = !Smart3DATL.Nav.routes.active;
        Smart3DATL.Routes.show(Smart3DATL.Nav.routes.active);
    });

/*
    Sandcastle.addToggleButton('Shadows', viewer.shadows, function(checked) {
        viewer.shadows = checked;
    });
*/

/*
var viewer = new Cesium.Viewer('cesiumContainer', {
    selectionIndicator : false,
    infoBox : false
});

var scene = viewer.scene;
var handler;
handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
*/


}
if (typeof Cesium !== "undefined") {
    startup(Cesium);
} else if (typeof require === "function") {
    require(["Cesium"], startup);
}