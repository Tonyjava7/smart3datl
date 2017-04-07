var Smart3DATL = Smart3DATL || {};
Smart3DATL.Model = (function() {
    var viewer;
    var buildings = [];
    var buildingsData2 ;
    var buildingsEntities;
    var colorOpacity = 0.5;


    function appendBuilding(url, latitude, longitude, last) {

        // Uses atlanta coordinates
        var position = Cesium.Cartesian3.fromDegrees(-84.38798, 33.774405, 0.0);
        
        var ccode = new Cesium.Color(1,1,1,colorOpacity);
        var entity = viewer.entities.add({
            parent: buildingsEntities,
            name : url,
            position : position,
            model : {
                uri : url,
                color : ccode
            },
			// Properties KURT
			description:
			
			'This position of this building is [' +
			
			[latitude,longitude] + 
			
			']' +
			
			'\
			<img\
			  width="40%"\
			  style="float:left; margin: 1em 1em 1em 1em;"\
			  src="https://wdanielanderson.files.wordpress.com/2015/02/bankofamerica-atlanta-feb09.jpg"/>\
			<p>\
			  93rd-tallest building in the world,\
			  13th-tallest in the U.S. \
			  Has been the tallest building in Atlanta, Georgia and the Southern United States since 1992.\
			  Tallest building in any U.S. state capital.\
			  It will be surpassed by the Salesforce Tower in \
			  San Francisco and the Comcast Technology Center in \
			  Philadelphia which are under construction. Tallest \
			  building in the U.S. located outside of New York \
			  City and Chicago. Tallest building constructed \
			  in Atlanta and the U.S. in the 1990s.\
			</p>\
			  Bank of America Plaza is a skyscraper located\
			  in between Midtown Atlanta and Downtown Atlanta.\
			  At 312 m (1,024 ft) the tower is the 87th-tallest \
			  building in the world. It is the 11th tallest \
			  building in the U.S.,[6] the tallest building in Georgia\
			  and the tallest building in any U.S. state capital.\
			  It has 55 stories of office space and was completed in 1992,\
			  when it was called NationsBank Plaza.\
			  Originally intended to be the headquarters\
			  for Citizens & Southern National Bank (which merged \
			  with Sovran Bank during construction), it became \
			  NationsBank property following its formation\
			  in the 1991 hostile takeover of C&S/Sovran by NCNB.\
			<p>\
			  Source: \
			  <a style="color: WHITE"\
				target="_blank"\
				href="http://en.wikipedia.org/wiki/Bank_of_America_Plaza_(Atlanta)">Wikpedia</a>\
			</p>'
			
			// Properties KURT
			
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
            infoBox : true,
            selectionIndicator : true,
            shadows : false,
            animation: false,
            timeline: false,
            infoBox: true,
            navigationHelpButton: false,
            homeButton: false,
            scene3DOnly: true
        });
		
		// ---------------------------------- KURT EDIT HIGHLIGHT ------------------------------------------------------------------------------------------ //
		
		
		
		var scene = viewer.scene;
		var handler;
		var mode = Smart3DATL.Nav.heatmap.mode;
		
		
		handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
		
		handler.setInputAction(function(movement) {
			
			var pickedObject = scene.pick(movement.endPosition);
			//var color_temp = buildings[0].model.color;
			
			
			
			for (var x=0; x<buildings.length; x++){
				if (Cesium.defined(pickedObject) && (pickedObject.id._id === buildings[x]._id)) {
					//entity.billboard.scale = 1.0;
					//entity.billboard.color = Cesium.Color.YELLOW;
					if (!buildings[x].model._colorCopy) {
						buildings[x].model._colorCopy = buildings[x].model.color;
					}
					buildings[x].model.color = new Cesium.Color(2.0,2.0,0.0, colorOpacity);
				} else {
					//entity.billboard.scale = 1.0;
					//entity.billboard.color = Cesium.Color.WHITE;
				
					// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
					var heatRed = 0 ;
					var heatBlue = 0 ;
					/*
					var latitude1 = buildingsData2[x][1],
								longitude1 = buildingsData2[x][2];

							// Building color by position
							var colorRed1 = 200*Math.sqrt((latitude1 - 33.77191)*(latitude1 - 33.77191) + (longitude1 + 84.38717)*(longitude1 + 84.38717));
							var colorBlue1 = 200*Math.sqrt((latitude1 - 33.77191)*(latitude1 - 33.77191) + (longitude1 + 84.38717)*(longitude1 + 84.38717));
					*/
					if (buildings[x].model._colorCopy){
						buildings[x].model.color = buildings[x].model._colorCopy;
						buildings[x].model._colorCopy = null;
					}
					
					
					
							
							
						
					// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
				}
			}
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		
		// ---------------------------------- KURT EDIT HIGHLIGHT ------------------------------------------------------------------------------------------ //		
        
		
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
        buildingsEntities = viewer.entities.add(new Cesium.Entity());
        buildingsData2 = [];
        for (var i = 0; i < buildingsData.length; i++) {
            var item = buildingsData[i];
            if (Smart3DATL.checkBoundaries(item[1],item[2])) {
                buildingsData2.push(item);
                buildings.push(appendBuilding(item[0],item[1],item[2]));
            }
        }
        return viewer;
    }

    function updateHeatMap(mode, heatmapData) {
        
        for (var j=0; j<buildings.length; j++){
            
            
            var heatRed = 0 ;
            var heatBlue = 0 ;
            if (mode == "on" || mode == "off") {
                for (var k=0; k<heatmapData.length; k++){
                
                 heatRed = 0.2*heatmapData[k]["Grand Total"]*Math.sqrt((buildingsData2[j][1] - heatmapData[k]["latitude"])*(buildingsData2[j][1] - heatmapData[k]["latitude"]) + (buildingsData2[j][2] - heatmapData[k]["longitude"])*(buildingsData2[j][2] - heatmapData[k]["longitude"])) + heatRed ;
                 heatBlue = 0.2*heatmapData[k]["Grand Total"]*Math.sqrt((buildingsData2[j][1] - heatmapData[k]["latitude"])*(buildingsData2[j][1] - heatmapData[k]["latitude"]) + (buildingsData2[j][2] - heatmapData[k]["longitude"])*(buildingsData2[j][2] - heatmapData[k]["longitude"])) + heatBlue ;
                 var heatColor = new Cesium.Color(heatRed,10-heatRed,0.5,colorOpacity);
                 buildings[j].model.color = heatColor;
                }
            } else if (mode == "distance") {
                var latitude = buildingsData2[j][1],
                    longitude = buildingsData2[j][2];

                // Building color by position
                var colorRed = 200*Math.sqrt((latitude - 33.77191)*(latitude - 33.77191) + (longitude + 84.38717)*(longitude + 84.38717));
                var colorBlue = 200*Math.sqrt((latitude - 33.77191)*(latitude - 33.77191) + (longitude + 84.38717)*(longitude + 84.38717));
                
                buildings[j].model.color = new Cesium.Color(colorRed,2.0,colorBlue, colorOpacity);
            } else {
                buildings[j].model.color = new Cesium.Color(1,1,1,1);
            }
        }
    }

    return {
        init: init,
        create: create,
        heatmap: updateHeatMap,
        viewer: function() {
            return viewer;
        }
    };
})();