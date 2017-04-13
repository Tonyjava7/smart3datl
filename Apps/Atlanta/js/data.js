var Smart3DATL = Smart3DATL || {};
Smart3DATL.Data = (function() {
    var collection = {};
    var path = '/Apps/Atlanta/data/'

    function load(id, url, update, options) {
        var promise = new Promise(function(resolve, reject) {
            if (!collection[id] || update) {
                fetch(url, options).then(function(response) {
                    collection[id] = response.json();
                    resolve(collection[id]);
                }).catch(function(error) {
                    reject(error);
                });
            } else {
                resolve(collection[id]);
            }
        });
        return promise;
    }

    function loadJsonp(id, url, update) {
        var promise = new Promise(function(resolve, reject) {
            if (!collection[id] || update) {
                // load a data asynchronously
                Cesium.loadJsonp(url).then(function(response) {
                    // use the loaded data
                    collection[id] = response;
                    resolve(collection[id]);
                }).otherwise(function(error) {
                    // an error occurred
                    reject(error);
                });
            } else {
                resolve(collection[id]);
            }
        });
        return promise;
    }

    return {
        buildings: function() {
            return load('buildings', path + 'buildings.json');
        },
        stops: function() {
            return load('stops', path + 'stops.json');
        },
        routes: function() {
            return load('routes', 'http://localhost:3000/smart3datl_db/avl_otpdata/?query='+JSON.stringify({
                        calendar_day:"31-JAN-17",
                        vehicle_num:1401
                    }), true);
        },
        allBuses: function() {
            //return loadJsonp('allBuses', path + 'stops-small.json', true);
            return load('allBuses', '/proxy/http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus', true);
            //return loadJsonp('allBuses', '//developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus', true);
        },
        heatmap: function(type) {
            return load('heatmap_' + type, path + type + '.json');
        },
        load: load,
        loadJsonp: loadJsonp
    };
})();