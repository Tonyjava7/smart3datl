var Smart3DATL = Smart3DATL || {};
Smart3DATL.Data = (function() {
    var collection = {};
    var path = '/Apps/Atlanta/data/'

    function load(id, url, update) {
		var promise = new Promise(function(resolve, reject) {
	        if (!collection[id] || update) {
	        	fetch(url).then(function(response) {
	        		collection[id] = response.json();
					resolve(collection[id]);
				}).catch(function(err) {
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
        }
    };
})();