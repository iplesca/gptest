/**
 * Google Maps API small application
 * 
 * @author Johnny <sirlucas_ro@yahoo.com>
 * @param {jQuery} $
 * @param {google.maps} googlemaps
 * @returns {Function}
 */
define(['jquery', 'googlemaps', 'jquery-ui', 'formdata', 'colorpicker'], function ($, googlemaps) {
    return function (opt) {
        var application = function () {
            
            var me = this;
            
            /**
             * @description Server-side script to handle the geoJson upload
             * @type {String}
             */
            var UPLOAD_URL = 'upload.php';
            
            /**
             * @description Default values of the application
             * @type {Object}
             */
            var defaults = {
                /**
                 * @description Main container for the application
                 */
                container : null,
                /**
                 * @description Map configuration: location and zoom
                 */
                map : {
                    // Location to load at the beginning (default: Dublin)
                    location : {
                        'lat' : 53.3443322,
                        'lng' : -6.26301
                    },
                    zoom : 15
                },
                /**
                 * @description Marker/icon configuration
                 */
                markerStyle : {
                    path: googlemaps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    strokeColor: '#ff0000',
                    strokeWeight: 6,
                    scale: 5,
                    clickable : true
                },
                /**
                 * @description Styles to control the interface
                 */
                style : {
                    menuCls : 'menu',
                    mapCls : 'map col-md-12',
                    menu : {
                        btnCls : 'btn btn-primary'
                    },
                    infoWindowCls : 'infoWindow'
                },
                /**
                 * @description Captions of buttons and strings overall
                 */
                labels : {
                    menu : {
                        uploadBtn :    'Upload file',
                        selectionBtn : 'Selection tool',
                        changeBtn :    'Change icon color'
                    },
                    buttons : {
                        upload : 'Upload',
                        cancel : 'Cancel',
                        close : 'Close'
                    },
                    titles : {
                        error : 'Error!',
                        uploadGeoJson : 'Upload GeoJSON',
                        selectionResults : 'Selection result details',
                        changeMarkerIcon : 'Change marker icon'
                    }
                }
            };
            /**
             * @description Holds the generated map container element (used by initMap)
             * @type jQuery element
             */
            var mapContainer = null;
            
            /**
             * @description Runtime options
             */
            me.options = {};
            /**
             * @description Holds any uploaded data content
             */
            me.uploadData = null;
            
            /**
             * @description Checks minimum options to run the application<br>
             * Overrides defaults.<br>
             * <br>
             * Throws a console.error and returns false on missing configuration<br>
             * @param {Object} opt
             * @returns {Boolean}
             */
            var setOptions = function (opt) {
                var allGood = true;
                if ("undefined" === typeof opt.container) {
                    console.error('`Geopal test` needs a main container.');
                    allGood = false;
                }
                if (allGood) {
                    me.options = $.extend({}, defaults, opt);
                }
                return allGood;
            };
            /**
             * @description Initialises the graphical interface (creates the required DOM elements)
             */
            var initInterface = function () {
                var menu = interface.generateMenu(me.options.labels);
                $(me.options.container).append( menu );
                
                mapContainer = interface.generateMapContainer(me.options.labels);
                $(me.options.container).append( mapContainer );
            };
            /**
             * @description Initialise the map object with a Google Map
             */
            var initMap = function () {
                map.init(me.options.map);
            };
            /**
             * @description Holds all interface generation methods
             * @type {Object}
             */
            var interface = {
                /**
                 * @description Generates the menu of the application
                 * @param {Object} labels
                 * @returns {$} Menu content as jQuery
                 */
                generateMenu : function (labels) {
                    // make menu
                    var menu = $('<div>');
                    menu.addClass(me.options.style.menuCls);
                    
                    // make buttons
                    menu.append(generateUploadButton());
                    menu.append(generateSelectionButton());
                    menu.append(generateChangeIconButton());
                    
                    function generateUploadButton() {
                        var btn = $('<button>');

                        btn.addClass(me.options.style.menu.btnCls);
                        btn.text(labels.menu.uploadBtn);

                        btn.on('click.geopal', interfaceActions.menuUploadButton);

                        return btn;
                    }
                    function generateSelectionButton() {
                        var btn = $('<button>');

                        btn.addClass(me.options.style.menu.btnCls);
                        btn.text(labels.menu.selectionBtn);
                        btn.on('click.geopal', interfaceActions.menuSelectionButton);

                        return btn;
                    }
                    function generateChangeIconButton() {
                        var btn = $('<button>');

                        btn.addClass(me.options.style.menu.btnCls);
                        btn.text(labels.menu.changeBtn);
                        btn.on('click.geopal', interfaceActions.menuChangeMarkerButton);

                        return btn;
                    }
                    
                    return menu;
                },
                /**
                 * @description Generates the map container for the application
                 * @param {Object} labels
                 * @returns {$}
                 */
                generateMapContainer : function (labels) {
                    // make map container
                    var mapContainer = $('<div>');
                    mapContainer.addClass(me.options.style.mapCls);
                    mapContainer.height($(window).height());

                    $(me.options.container).append(mapContainer);
                    
                    return mapContainer;
                },
                /**
                 * @description Generates a table content for the search results
                 * @param {Array} data
                 * @returns {$}
                 */
                generateSelectionResults : function (data) {
                    var content = $('<table class="selectionResults">');
                    var row = $('<tr>')
                            .append($('<th>').text('Address'))
                            .append($('<th>').text('Latitude'))
                            .append($('<th>').text('Longitude'));
                    content.append(row);
                    
                    $.each(data, function (k, v) {
                        row = $('<tr>')
                            .append($('<td>').text(v['properties']['address']))
                            .append($('<td>').text(v['geometry']['coordinates'][1]))
                            .append($('<td>').text(v['geometry']['coordinates'][0]));
                        content.append(row);
                    });
                    
                    return content;
                },
                /**
                 * @description Generates content to fit a Data.InfoWindow
                 * @param {Data.Feature} feature
                 */
                generateInfoContent : function (feature) {
                    var result = $('<div>')
                    result.addClass(me.options.style.infoWindowCls);
                    result.append('<strong>' + feature.getProperty('name') + '</strong><br>');
                    result.append('Address: ' + feature.getProperty('address') + '<br>');
                    
                    return result[0];
                }
            };
            
            /**
             * @description Holds all functionality regarding the Google Map object
             * @type {Object}
             */
            var map = {
                /**
                 * @description The actual Google Map object
                 */
                object : null,
                /**
                 * @type {InfoWindow}
                 */
                infoWindow : null,
                /**
                 * @description The complete polygon selection
                 * @type {Polygon}
                 */
                currentSelection : null,
                /**
                 * @description A standard DrawingManager
                 * @type {DrawingManager}
                 */
                drawingManager : null,
                /**
                 * @description Initialises the map object<br>(creates the map object, drawing manager, info window)
                 * @param {Object} mapConfig
                 */
                init : function (mapConfig) {
                    var self = this;
                    
                    this.object = new googlemaps.Map(mapContainer[0], {
                        center: mapConfig.location,
                        zoom:   mapConfig.zoom // motorola zoom-zoom :D
                    });

                    // set default style
                    this.object.data.setStyle({
                        icon : me.options.markerStyle
                    });
                    self.createDrawingManager();
                    self.createInfoWindow();
                },
                /**
                 * @description Creates a InfoWindow<br>
                 * Adds a click listener to hook up
                 */
                createInfoWindow : function () {
                    var self = this;
                    this.infoWindow = new googlemaps.InfoWindow();
                    
                    this.object.data.addListener('click', function(event) {
                        self.infoWindow.close();
                        self.infoWindow.setContent( interface.generateInfoContent(event.feature) );

                        self.infoWindow.setPosition(event.feature.getGeometry().get());
                        self.infoWindow.setOptions({pixelOffset: new googlemaps.Size(0,-30)});

                        var anchor = new googlemaps.MVCObject();
                        anchor.set("position", event.latLng);

                        self.infoWindow.open(self.object, anchor);
                    }); 
                },
                /**
                 * @description Creates the DrawingManager
                 */
                createDrawingManager : function () {
                    map.drawingManager = new googlemaps.drawing.DrawingManager({
                        drawingMode: googlemaps.drawing.OverlayType.POLYGON,
                        drawingControl: false,
                        polygonOptions: {
                            strokeWeight: 0,
                            fillOpacity: 0.45,
                            editable: true
                        }
                    });
                },
                /**
                 * @description Loads (expected geoJson) data into the map object<br>
                 * Shows error on invalid data
                 * @param {Object} data
                 */
                loadData : function (data) {
                    try {
                        map.object.data.addGeoJson(data);
                    } catch (error) {
                        dialogs.error(error.message);
                    }
                },
                /**
                 * @description Allows making selection on the map object (create a complete polygon)<br>
                 * Enables the drawing manager<br>
                 * Adds listeners for the 'selection complete' and 'cancel selection' actions
                 */
                enableLassoMode : function () {
                    /**
                     * Seems there is a bug here that forces me to recreate the drawing manager
                     * Incomplete polygons stay alive even if the manager is detached with setMap(null)
                     * 
                     * @link https://code.google.com/p/gmaps-api-issues/issues/detail?id=3876
                     */
                    map.createDrawingManager();
                    
                    map.drawingManager.setMap(map.object);
                    
                    googlemaps.event.addListener(map.object, 'rightclick', map.disableLassoMode);
                    googlemaps.event.addListener(map.drawingManager, 'polygoncomplete', map.selectionResults);
                },
                /**
                 * @description Disabled the drawing manager, removes listeners and clear the last selection
                 */
                disableLassoMode : function () {
                    map.drawingManager.setMap(null);
                    map.clearSelection();
                    googlemaps.event.clearListeners(map.object, 'rightclick');
                },
                /**
                 * @description Verifies the intersection of the polygon selection with the uploaded data
                 * @param {Polygon} selection
                 */
                selectionResults : function (selection) {
                    var latlng, coords, feature;
                    var result = [];
                    map.currentSelection = selection;
                    
                    if (null != me.uploadData) {
                        // loop through the data we have to find features within the selection
                        for (var i in me.uploadData['features']) {
                            feature = me.uploadData['features'][i];
                            coords = feature['geometry']['coordinates'];
                            latlng = new googlemaps.LatLng(coords[1], coords[0]);
                            
                            if (googlemaps.geometry.poly.containsLocation(latlng, selection)) {
                                result.push(feature);
                            }
                        }
                        
                        if (result.length) {
                            dialogs.displayDataSelection(result).dialog('open');
                        }
                    }
                    // if no uploaded data or the selection didn't grab anything
                    if (null == me.uploadData || 0 == result.length) {
                        // delete the selection
                        map.clearSelection();
                        map.disableLassoMode();
                    }
                },
                /**
                 * @description Removes any current selection
                 */
                clearSelection : function () {
                    if (null != map.currentSelection) {
                        map.currentSelection.setMap(null);
                    }
                },
                /**
                 * @description Updates the map object marker color
                 * @param {Spectrum} color
                 */
                setSymbolColor : function (color) {
                    me.options.markerStyle.strokeColor = color.toHexString();

                    map.object.data.setStyle({
                        icon : me.options.markerStyle
                    });
                }
            };
            
            /**
             * @description Holds communication functionality (ajax)
             * @type {Object}
             */
            var actions = {
                uploadFile : function (formData) {
                    $.ajax({
                        url : UPLOAD_URL,
                        type : 'POST',
                        data : formData,
                        success : actions.ajaxUploadSuccess,
                        error : actions.ajaxError,
                        processData: false,
                        contentType: false,
                        context: me
                    });
                },
                ajaxUploadSuccess : function (response) {

                    me.uploadData = response;
                    map.loadData(response);
                },
                ajaxError : function (response, code, error) {
                    var message;
                    switch (response.status) {
                        case 415 : 
                            message = 'Invalid file content.';
                            break;
                        default : 
                            message = 'An error has occured.';
                    }
                    dialogs.error(message);
                }
            };
            /**
             * @description Defines all dialogs
             * @type {Object}
             */
            var dialogs = {
                uploadGeoJsonFile : function () {
                    var modal = $('#dlgUploadGeoJson').dialog({
                        title : me.options.labels.titles.uploadGeoJson,
                        width: 400,
                        height: 210,
                        modal: true,
                        buttons : [{
                            text : me.options.labels.buttons.upload,
                            click : function () {
                                var form = $(this).dialog('widget').find('#uploadForm');
                                var file = form.find('input[name=geoJson]')[0].files[0];
                                
                                if ("undefined" != typeof file) {
                                    var formData = new FormData();
                                    formData.append('uploadFile', file);
                                    actions.uploadFile(formData);

                                    $(this).dialog("close");
                                }
                            }
                        }, {
                            text : me.options.labels.buttons.cancel,
                            click : function() {
                                $(this).dialog("close");
                            }
                        }]
                    });
                    return modal;
                },
                displayDataSelection : function (data) {
                    var content = interface.generateSelectionResults(data);
                    var modal = content.dialog({
                        title : me.options.labels.titles.selectionResults,
                        modal : true,
                        width : 800,
                        minHeight: 200,
                        maxHeight: 800,
                        close : function () {
                            map.clearSelection();
                            map.disableLassoMode();
                        }
                    });
                    return modal;
                },
                changeMarkerIcons : function () {
                    $('#dlgChangerMarker').find('#colorpicker').spectrum({
                        color : me.options.markerStyle.strokeColor,
                        move : map.setSymbolColor,
                        showButtons : false
                    });
                    var modal = $('#dlgChangerMarker').dialog({
                        title : null,
                        width: 340,
                        resizable: false,
                        height: 120
                    });
                    return modal;
                },
                error : function (message) {
                    var content = $('<div>').text(message);
                    content.dialog({
                        title : me.options.labels.titles.error,
                        modal : true,
                        width : 300,
                        maxHeight: 250,
                        buttons : [{
                            text : me.options.labels.buttons.close,
                            click : function () { $(this).dialog("close"); }
                        }]
                    });
                    return content;
                }
            };
            /**
             * @description Describes all the interface actions
             * @type {Object}
             */
            var interfaceActions = {
                menuUploadButton : function () {
                    dialogs.uploadGeoJsonFile().dialog('open');
                },
                menuSelectionButton : function () {
                    map.enableLassoMode();
                },
                menuChangeMarkerButton : function () {
                    dialogs.changeMarkerIcons().dialog('open');
                },
            };
            
            /**
             * @description Initialise the application:<br>
             *      - sets input options (over defaults)<br>
             *      - calls initMap()<br>
             *      - calls initInterface()<br>
             * @param {Object} opt Options
             */
            me.init = function (opt) {
                if (setOptions(opt)) {
                    initInterface();
                    initMap();
                }
            }
            
            // init the application
            me.init(opt);
        }
        
        // fire'em up...
        return new application();
    }
});