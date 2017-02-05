requirejs.config({
    baseUrl: 'scripts/lib',
    paths: {
        'geopal':      "../geopal",
        'async' :      "async",
        'jquery':      "//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min",
        'googleMaps':  "googlemaps",
        'jquery-ui':   "jquery-ui/jquery-ui.min",
        'formdata':    "formdata",
        'colorpicker' : 'bgrins-spectrum-98454b5/spectrum'
    },
    shim : {
        'colorpicker' : ['jquery-amd']
    },
    map: {
      '*': { 'jquery': 'jquery-amd' },
      'jquery-amd': { 'jquery': 'jquery' }
    },
    
});
requirejs(['geopal'], function (app) {
    app({
        container : '#mainContainer'
    });
});