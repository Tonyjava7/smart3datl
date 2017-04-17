var Smart3DATL = Smart3DATL || {};
Smart3DATL.Collections = {};

Smart3DATL.Collections['Buildings'] = {
    options: {
        navigation: false,
        heatmap: true,
        active: true
    },
    data: {
        uri: '/Apps/Atlanta/data/buildings.json'
    },
    controller: Buildings
};

Smart3DATL.Collections['Routes'] = {
    options: {
        navigation: true,
        heatmap: false,
        active: false
    },
    data: {
        uri: '/proxy/http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus',
        timeout: 5000
    },
    controller: MARTABuses
};

Smart3DATL.Collections['Stops'] = {
    options: {
        navigation: true,
        heatmap: true,
        active: false
    },
    data: {
        uri: '/Apps/Atlanta/data/stops.json'
    },
    controller: MARTAStops
};
