var Smart3DATL = Smart3DATL || {};
Smart3DATL.Model = (function() {
    var viewer;
    var buildings = [];
    var buildingsData2 ;
    var buildingsEntities;
    var colorOpacity = 0.5;

    var geocoder,
        mapsService;

    function appendBuilding(url, latitude, longitude, last) {

        // Uses atlanta coordinates
        var position = Cesium.Cartesian3.fromDegrees(-84.38798, 33.774405, 0.0);
        
        var ccode = new Cesium.Color(1,1,1,colorOpacity);
        var entity = viewer.entities.add({
            parent: buildingsEntities,
            name : '[' + latitude + ',' + longitude + ']',
            position : position,
            model : {
                uri : url,
                color : ccode
            },
			// Properties KURT
            description: 'Loading details ...'
			
        });

        entity._latitude = latitude;
        entity._longitude = longitude;

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
            scene3DOnly: true,
            //Hide the base layer picker
            baseLayerPicker : false,
            //Use OpenStreetMaps
            imageryProvider : Cesium.createOpenStreetMapImageryProvider({
                url : 'https://a.tile.openstreetmap.org/'
            }),
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

        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(click) {

            var pickedObject = viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject) && pickedObject.id) {
                if (pickedObject.placeDetails) {
                    showPlaceDescription(pickedObject);
                } else {
                    getPlaceByCoordinates(
                    //getBuildingInfoByNearbySearch(
                        pickedObject
                    );
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    function showPlaceDescription(place) {
        var strDescription = '';
        var info = place.placeDetails;

        strDescription = '<h2>' + info.name + '</h2>';
        if (info.formatted_address) {
            strDescription += '<div><address>' + info.formatted_address + '</address></div>';
        }
        if (info.vicinity) {
            //strDescription += '<div>Vicinity: ' + info.vicinity + '</div>';
        }
        
        if (info.formatted_phone_number && info.international_phone_number) {
            strDescription += '<div>Telephone: ' + 
            '<span itemprop="telephone"><a href="tel:' + info.international_phone_number + '">' + info.formatted_phone_number + '</a></span>' + '</div>';
        }
        if (info.website) {
            strDescription += '<div><a href="' + info.website + '">' + info.website + '</a></div>';
        }

        if (info && info.photos && info.photos.length > 0) {
            strDescription += '<div style="height:300px;"><img width="40%"\ style="margin: 1em 1em 1em 1em;" src="' + info.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 400}) + '"/></div>';
        }

        place.id.description = strDescription;
    }

    function getBuildingInfoByNearbySearch(pickedObject) {
        //var infowindow = new google.maps.InfoWindow();
        if (!mapsService) {
            mapsService = new google.maps.places.PlacesService(document.getElementById('placeDetails')); // Map????
        }

        var latlng = {lat: pickedObject.id._latitude, lng: pickedObject.id._longitude};
        mapsService.nearbySearch({
            location: latlng,
            radius: 100,
        }, function(place, status) {
            //console.log("getBuildingInfoByNearbySearch", place);
        });
    }

    function geocodeLatLng(pickedObject, geocoder) {
      var latlng = {lat: pickedObject.id._latitude, lng: pickedObject.id._longitude};

      geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
          if (results[1]) {
            pickedObject.placeObject = results[1];
            pickedObject.placeDetails = results[1];
            getBuildingInfo(pickedObject, results[1].place_id);
            // Properties KURT
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }, function() {
      });
    }
    function getPlaceByCoordinates(pickedObject) {
        if (!geocoder) {
            geocoder = new google.maps.Geocoder;
        }
        geocodeLatLng(pickedObject, geocoder);

    }
/*function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 40.731, lng: -73.997}
  });
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;

  document.getElementById('submit').addEventListener('click', function() {
    geocodeLatLng(geocoder, map, infowindow);
  });
}

function geocodeLatLng(geocoder, map, infowindow) {
  var input = document.getElementById('latlng').value;
  var latlngStr = input.split(',', 2);
  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[1]) {
        map.setZoom(11);
        var marker = new google.maps.Marker({
          position: latlng,
          map: map
        });
        infowindow.setContent(results[1].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}
*/
    //placeID = 'ChIJN1t_tDeuEmsRUsoyG83frY4'
    function getBuildingInfo(pickedObject, placeID) {
        //var infowindow = new google.maps.InfoWindow();
        if (!mapsService) {
            mapsService = new google.maps.places.PlacesService(document.getElementById('placeDetails')); // Map????
        }

        mapsService.getDetails({
            placeId: placeID
        }, function(place, status) {
            /*
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                        'Place ID: ' + place.place_id + '<br>' +
                        place.formatted_address + '</div>');
                    infowindow.open(map, this);
                });
            }
            */
            console.log("Place Info", place);
            pickedObject.id.name = place.name;
            pickedObject.placeDetails = place;
            showPlaceDescription(pickedObject);
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