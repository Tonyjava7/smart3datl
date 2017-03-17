var Smart3DATL = Smart3DATL || {};
Smart3DATL.Model = (function() {
    var viewer;
    var buildings = [];
    var buildingsData2 ;

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
        buildingsData2 = buildingsData;
        for (var i = 0; i < buildingsData.length; i++) {
            var item = buildingsData[i];
            if (Smart3DATL.checkBoundaries(item[1],item[2])) {
                buildings.push(appendBuilding(item[0],item[1],item[2]));
            }
        }
        return viewer;
    }

    function createHeatMap(heatmapData) {
        
        for (var j=0; j<buildings.length; j++){
            
            
            var heatRed = 0 ;
            var heatBlue = 0 ;
            for (var k=0; k<heatmapData.length; k++){
                
                 heatRed = 0.2*heatmapData[k]["Grand Total"]*Math.sqrt((buildingsData2[j][1] - heatmapData[k]["latitude"])*(buildingsData2[j][1] - heatmapData[k]["latitude"]) + (buildingsData2[j][2] - heatmapData[k]["longitude"])*(buildingsData2[j][2] - heatmapData[k]["longitude"])) + heatRed ;
                 heatBlue = 0.2*heatmapData[k]["Grand Total"]*Math.sqrt((buildingsData2[j][1] - heatmapData[k]["latitude"])*(buildingsData2[j][1] - heatmapData[k]["latitude"]) + (buildingsData2[j][2] - heatmapData[k]["longitude"])*(buildingsData2[j][2] - heatmapData[k]["longitude"])) + heatBlue ;
                 var heatColor = new Cesium.Color(heatRed,10-heatRed,0.5,1.0);
                 buildings[j].model.color = heatColor;
                 //console.log(heatColor);
            }
            
        }
        // To Do
    }

    return {
        init: init,
        create: create,
        heatmap: createHeatMap,
        viewer: function() {
            return viewer;
        }
    };
})();