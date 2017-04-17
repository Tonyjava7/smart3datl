var Smart3DATL = Smart3DATL || {};
Smart3DATL.Model = (function(){
    var viewer;
    var elements = {};
    var parents = {};
    var buildings = [];
    var buildingsData2 ;
    var buildingsEntities;
    var colorOpacity = 0.5;
    var selectedElement;

    var geocoder,
        mapsService;

    function init() {
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
            imageryProvider : new Cesium.BingMapsImageryProvider({
                url : 'https://dev.virtualearth.net',
                key: 'AhhIIOsOylo1WG8-lEB9q8P_MQFMhyV8GDjNLbhuvU-zo1dqoVcZrIzEMJNbI-Wi',
                mapStyle : Cesium.BingMapsStyle.ROAD
            })
        });
		
		// ---------------------------------- KURT EDIT HIGHLIGHT ------------------------------------------------------------------------------------------ //
		var scene = viewer.scene;
		var handler;
		
		handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
		
		handler.setInputAction(function(movement) {
			var pickedObject = scene.pick(movement.endPosition);
			//var color_temp = buildings[0].model.color;

            if (selectedElement && selectedElement.model._colorCopy) {
                selectedElement.model.color = selectedElement.model._colorCopy;
                selectedElement.model._colorCopy = null;
            }
			if (Cesium.defined(pickedObject) && (pickedObject.id)) {
                selectedElement = pickedObject.id;
				if (!selectedElement.model._colorCopy) {
					selectedElement.model._colorCopy = selectedElement.model.color;
				}
				selectedElement.model.color = new Cesium.Color(2.0,2.0,0.0, colorOpacity);
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
            if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.controller) {
                var description = pickedObject.id.controller.description(pickedObject.id);
                switch (typeof description) {
                case 'string':
                    pickedObject.id.description = description;
                    break;
                default:
                    description.then(function(detail) {
                        pickedObject.id.description = detail;
                    });
                    break;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
/*
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
*/
    function updateCollectionElements(type, data) {

        if (!parents[type]) {
            parents[type] = viewer.entities.add(new Cesium.Entity());
        }
        if (!elements[type]) {
            elements[type] = {};
        }
        for (var i = 0; i < data.length; i++) {
            var item = Smart3DATL.Collections[type].controller(data[i]);
            var model = item.model;
            var position = item.position();
            entity = null;

            var visible = Smart3DATL.checkBoundaries(position.latitude, position.longitude);

            if (elements[type][item.id]) {
                entity = elements[type][item.id];
                item = entity.controller;
            } else if(visible) {
                position = model.position?model.position:item.position();
                position = Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, 0.0);
                var entity = viewer.entities.add({
                    parent: parents[type],
                    name : item.name,
                    position : position,
                    model : model
                });

                entity.controller = item;
                entity.model.color = item.color? item.color():new Cesium.Color(1,1,1,1);
                elements[type][item.id] = entity;
            }

            if (entity) {
                entity.show = visible;

                if (visible && item.update) {
                    item.update(entity, data[i]);
                }
            }

        }
    }

    function loadCollectionData(type) {
        var typeData = Smart3DATL.Collections[type].data;
        Smart3DATL.Data.load(type, typeData.uri, typeData.timeout).then(function(data) {
            updateCollectionElements(type, data);

            updateHeatmap();

            if (typeData.timeout) {
                if (typeData.timer) {
                    clearTimeout(typeData.timer);
                    typeData.timer = null;
                }
                typeData.timer = setTimeout(function() {
                    updateCollection(type);
                }, typeData.timeout);
            }
        });
    }

    function updateCollection(type) {
        if (Smart3DATL.Collections[type]) {
            if (parents[type]) {
                parents[type].show = Smart3DATL.Collections[type].options.active;
            }
            if (Smart3DATL.Collections[type].data.timer) {
                clearTimeout(Smart3DATL.Collections[type].data.timer);
                Smart3DATL.Collections[type].data.timer = null;
            }
            if (Smart3DATL.Collections[type].options.active) {
                loadCollectionData(type);
            }
        }
    }
    function updateHeatmapElements(activeMap, data) {
        for (var type in Smart3DATL.Collections) {
            if (Smart3DATL.Collections[type].options.active && Smart3DATL.Collections[type].options.heatmap) {
                for (var id in elements[type]) {
                    if (activeMap) {
                        elements[type][id].model.color = activeMap.controller(elements[type][id].controller.position(), data);
                    } else {
                        elements[type][id].model.color = defaultColor(elements[type][id]);
                    }
                }
            }
        }
    }

    function loadHeatmapData(type) {
        var map = Smart3DATL.Heatmaps[type];
        if (map && map.data) {
            Smart3DATL.Data.load(type, map.data.uri, map.data.timeout).then(function(data) {
                updateHeatmapElements(map, data);
            });
        } else {
            updateHeatmapElements(map);
        }
    }

    function defaultColor(entity) {
        return entity.controller.color? entity.controller.color():new Cesium.Color(1,1,1,1);
    }


    function updateHeatmap() {
        var activeMap;
        for (var type in Smart3DATL.Heatmaps) {
            var map = Smart3DATL.Heatmaps[type];
            if (map.options.active) {
                activeMap = type;
                break;
            }
        }
        loadHeatmapData(activeMap);
    }

    return {
        init: init,
        collection: updateCollection,
        heatmap: updateHeatmap,
        viewer: function() {
            return viewer;
        },
        elements: function() {
            return elements;
        }
    };
})();