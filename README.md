# GeoPal test
Prototype application to work with Google Maps API.

## Installation
Simply clone/download this repo into any PHP (5.5+) server configuration

## How to use
The `Selection tool` can be canceled by *right-click*. 
If the selection does not cover any markers then it will be deleted (no result)

## Sample GeoJSON file
This content was used in testing the application (file included in the repo)
```
{
    "type": "FeatureCollection",
    "features" : [{
        "type": "Feature",
        "properties": {
            "name": "Guinness Storehouse",
            "address": "St James's Gate, Ushers, Dublin 8"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-6.2889,53.3418392]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "Ha'penny Bridge",
            "address": "Bachelors Walk, North City, Dublin"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-6.265285,53.3464352]
        }
    }]
}

```
## Notes
The `InfoWindow` popup will display the **sample data** properties only (name, address).
