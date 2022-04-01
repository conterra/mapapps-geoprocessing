# Geoprocessing
This bundle enables the user to trigger the execution of Geoprocessing services.

## Usage
**Requirement: map.apps 4.12.0**

1. First you need to add the bundle dn_geoprocessing to your app.
2. Then you can configure it.

To make the functions of this bundle available to the user, the following tool can be added to a toolset:

| Tool ID                 | Component               | Description              |
|-------------------------|-------------------------|--------------------------|
| geoprocessingToggleTool | GeoprocessingToggleTool | Show or hide the widget. |

## Configuration Reference

### Config

#### Sample configurations
```
"Config": {
    "supportEmailAddress": "support@conterra.de",
    "url": "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_Currents_World/GPServer/MessageInABottle",
    "synchronous": true,
    "params": {
        "Input_Point": {
            "features": [{
                "geometry":{
                    "x": 0,
                    "y": 0
                }
            }]
        },
        "Days": 50
    }
```

| Property            | Type      | Possible Values                                  | Default     | Description                                                            |
|---------------------|-----------|--------------------------------------------------|-------------|------------------------------------------------------------------------|
| supportEmailAddress | String    | any String                                       | ```""```    | Contact email provided in widget if GP execution fails                 |                                                                                     |
| url                 | String    | URL of GP Service                                | ```""```    | URL of GP Service                                                      |
| synchronous         | Boolean   | ```true``` &#124; ```false```                    | ```true```  | Determines whether GP Service is run synchronously or asynchronously   |
| params              | Object    | Object of key-value pairs required by GP Service | ```{}```    | Object containing any key-value pair required by GP Service            |
