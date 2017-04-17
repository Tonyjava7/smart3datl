function Buildings(_data) {
    var data = _data;
    var geocoder,
        mapsService;
    var placeDetails;
    var latitude = data[1],
        longitude = data[2];
    var name = '[' + data[1] + ',' + data[2] + ']';
    var colorOpacity = 0.5;

    function getId() {
        return data[0];
    }

    function getName() {
        return name;
    }

    function getModel() {
        return data[0];
    }

    function getPosition() {
        return {
            latitude: latitude,
            longitude: longitude
        };
    }

    function updateEntity(entity, _data) {
        if (_data) {
            data = _data;
        }
        entity.description = 'Loading details ...';
        latitude = data[1];
        longitude = data[2];
    }

    function getDescriptionString(_data) {
        var sDescription = '';

        sDescription = '<h2>' + _data.name + '</h2>';
        if (_data.formatted_address) {
            sDescription += '<div><address>' + _data.formatted_address + '</address></div>';
        }
        
        if (_data.formatted_phone_number && _data.international_phone_number) {
            sDescription += '<div>Telephone: ' + 
            '<span itemprop="telephone"><a href="tel:' + _data.international_phone_number + '">' + _data.formatted_phone_number + '</a></span>' + '</div>';
        }
        if (_data.website) {
            sDescription += '<div><a href="' + _data.website + '">' + _data.website + '</a></div>';
        }

        if (_data && _data.photos && _data.photos.length > 0) {
            sDescription += '<div style="height:300px;"><img width="40%"\ style="margin: 1em 1em 1em 1em;" src="' + _data.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 400}) + '"/></div>';
        }

        return sDescription;
    }

    function getPlaceByCoordinates(entity) {
        var latlng = {lat: latitude, lng: longitude};

        if (!geocoder) {
            geocoder = new google.maps.Geocoder;
        }

        return new Promise(function(resolve, reject) {
            geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        getBuildingInfo(results[1].place_id, entity).then(resolve);
                    } else {
                        window.alert('No results found');
                        reject();
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                    reject();
                }
            }, function() {
                reject();
            });
        });
    }

    function getBuildingInfo(placeID, entity) {
        return new Promise(function(resolve, reject) {
            if (!mapsService) {
                mapsService = new google.maps.places.PlacesService(document.getElementById('placeDetails'));
            }

            mapsService.getDetails({
                placeId: placeID
            }, function(place, status) {
                name = place.name;
                if (entity) {
                    entity.name = place.name; //Update entity name after getting the place details
                }
                placeDetails = place;
                resolve(getDescriptionString(placeDetails));
            });
        });
    }

    function getDescription(entity) {
        if (placeDetails) {
            return getDescriptionString(placeDetails);    //String
        } else {
            return getPlaceByCoordinates(entity);   //Promise
        }
    }

    function getColor() {
        return new Cesium.Color(2,2,2,0.5);
    }

    return {
        model : {
            uri : getModel(),
            position: {
                latitude: 33.774405,
                longitude: -84.38798
            }
        },
        id: getId(),
        name: name,
        color: getColor,
        position: getPosition,
        update: updateEntity,
        description: getDescription
    };
}