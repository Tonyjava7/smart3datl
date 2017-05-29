var Smart3DATL = Smart3DATL || {};

Smart3DATL.checkBoundaries = function(latitude, longitude) {
    var centralPoint = {
        latitude: 33.77191,
        longitude: -84.38717
    };
    //Atlanta
    //return ((longitude >= -84.405919) && (longitude <= -84.337190)) && ((latitude >= 33.761399) && (latitude <= 33.794855));

    //North Avenue close to Georgia Tech
    var radius = document.getElementById("loadRange").value/1000;
    var bSquared = true;
    if (bSquared) {
        return  Math.abs(centralPoint.latitude - latitude) <= radius &&
                Math.abs(centralPoint.longitude - longitude) <= radius;
    } else {
        return  Math.sqrt(Math.pow(centralPoint.latitude - latitude,2) +
                Math.pow(centralPoint.longitude - longitude,2)) <= radius;
    }
};

function addCollectionToNav(type) {
    var li = document.querySelector('.placeholders .nav li').cloneNode(true);
    li.querySelector('label').innerHTML = Smart3DATL.Collections[type].title?Smart3DATL.Collections[type].title:type;
    li.classList.add(type.toLowerCase());
    li.dataset.type = type;

    if (Smart3DATL.Collections[type].options.active) {
        li.classList.add('active');
    }
    li.querySelector('label').addEventListener('click', function(event) {
        var node = event.target.parentNode;
        Smart3DATL.Collections[type].options.active = !Smart3DATL.Collections[type].options.active;
        node.classList.toggle('active', Smart3DATL.Collections[type].options.active);
        Smart3DATL.Model.collection(node.dataset.type);
        
    });

    document.querySelector('nav .collections').appendChild(li);
}

function activeHeatmap(type) {
    var activeMap = document.querySelector('nav .heatmap li.active');
    var activeType;
    if (activeMap) {
        activeType = activeMap.dataset.type;
    }

    if (activeType) {
        document.querySelector('nav .heatmap li.active').classList.remove('active');
        Smart3DATL.Heatmaps[activeType].options.active  = false;
    }

    if (activeType !== type){
        Smart3DATL.Heatmaps[type].options.active = true;
    } else {
        Smart3DATL.Heatmaps[type].options.active = false;
    }

    return Smart3DATL.Heatmaps[type].options.active;
}

function addHeatmapToNav(type) {
    var li = document.querySelector('.placeholders .nav li').cloneNode(true);
    li.querySelector('label').innerHTML = Smart3DATL.Heatmaps[type].title?Smart3DATL.Heatmaps[type].title:type;
    li.classList.add(type.toLowerCase());
    li.dataset.type = type;

    if (Smart3DATL.Heatmaps[type].options.active) {
        li.classList.add('active');
    }
    li.querySelector('label').addEventListener('click', function(event) {
        var node = event.target.parentNode;
        if (activeHeatmap(node.dataset.type)) {
            node.classList.add('active');
        }
        Smart3DATL.Model.heatmap();
    });

    document.querySelector('nav .heatmap').appendChild(li);
}

function startup(Cesium) {
    'use strict';

    window.Cesium = Cesium;
	
    Smart3DATL.Model.init();

    for (var type in Smart3DATL.Collections) {
        if (Smart3DATL.Collections[type].options.navigation) {
            addCollectionToNav(type);
        }
        Smart3DATL.Model.collection(type);
    }

    for (var type in Smart3DATL.Heatmaps) {
        if (Smart3DATL.Heatmaps[type].options.navigation) {
            addHeatmapToNav(type);
        }
        Smart3DATL.Model.heatmap(type);
    }

    document.getElementById("loadRange").addEventListener('change', function() {
        console.log('loadRange', document.getElementById("loadRange").value);
        for (var type in Smart3DATL.Collections) {
            Smart3DATL.Model.collection(type);
        }

        for (var type in Smart3DATL.Heatmaps) {
            Smart3DATL.Model.heatmap(type);
        }
    });


    function loaded() {
        document.querySelector('.sandcastle-loading').classList.remove('sandcastle-loading');
    }
    loaded();
}
if (typeof Cesium !== "undefined") {
    startup(Cesium);
} else if (typeof require === "function") {
    require(["Cesium"], startup);
}

function initMap() {
}