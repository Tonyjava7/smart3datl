var Smart3DATL = Smart3DATL || {};
Smart3DATL.Heatmaps = {};

Smart3DATL.Heatmaps['Distance'] = {
    options: {
        navigation: true,
        active: true
    },
    title: 'Distance to North Ave',
    controller: DistanceNorthAve
};

Smart3DATL.Heatmaps['Origin'] = {
    options: {
        navigation: true,
        active: false
    },
    data: {
        uri: '/Apps/Atlanta/data/on.json'
    },
    title: 'Origin',
    controller: ServiceMap
};

Smart3DATL.Heatmaps['Destination'] = {
    options: {
        navigation: true,
        active: false
    },
    data: {
        uri: '/Apps/Atlanta/data/off.json'
    },
    title: 'Destination',
    controller: ServiceMap
};

Smart3DATL.Heatmaps['Stops'] = {
    options: {
        navigation: true,
        active: false
    },
    data: {
        uri: '/Apps/Atlanta/data/stops.json'
    },
    title: 'Distance to Stops',
    controller: DistanceMARTAStops
};
