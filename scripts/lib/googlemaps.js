var GOOGLE_MAPS_API_KEY = 'AIzaSyB165OxFvkWtNotpGU94LE_-UqRh-Zq-n0';

define(['async!http://maps.google.com/maps/api/js?v=3&libraries=drawing,geometry&key=' + GOOGLE_MAPS_API_KEY], function () {
    return google.maps;
});