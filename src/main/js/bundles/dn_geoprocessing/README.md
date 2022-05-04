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
```json
"Config": {
    "supportEmailAddress": "support@laixo.ch",
    "services": [
        {
            "title": "Service 1",
            "allowedUserRoles": [],
            "url": "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_Currents_World/GPServer/MessageInABottle",
            "synchronous": true,
            "params": {
                "Input_Point": {
                    "features": [
                        {
                            "geometry": {
                                "x": 0,
                                "y": 0
                            }
                        }
                    ]
                },
                "Days": 50
            }
        },
        {
            "title": "Service 2",
            "url": "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_Currents_World/GPServer/MessageInABottle",
            "synchronous": true,
            "allowedUserRoles": [],
            "params": {
                "Input_Point": {
                    "features": [
                        {
                            "geometry": {
                                "x": "zero",
                                "y": 0
                            }
                        }
                    ]
                },
                "Days": "fifty"
            }
        }
    ]
}
```

| Property            | Type      | Possible Values                                  | Default     | Description                                                                                               |
|---------------------|-----------|--------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------------------|
| supportEmailAddress | String    | Any String                                       | ```""```    | Contact email provided in widget if GP execution fails                                                    |                                                                                     |
| services            | Array     | GP Service definitions                           | ```[]```    | Services available for the user to trigger in the widget                                                  |
| title               | String    | Any String                                       | ```""```    | Title of GP Service in selection                                                                          |
| url                 | String    | URL of GP Service                                | ```""```    | URL of GP Service                                                                                         |
| synchronous         | Boolean   | ```true``` &#124; ```false```                    | ```true```  | Determines whether GP Service is run synchronously or asynchronously                                      |
| allowedUserRoles    | Array     | Any amount of String or empty                    | ```[]```    | Array of userRoles used to filter services for specific users. If empty all roles can access this service |
| params              | Object    | Object of key-value pairs required by GP Service | ```{}```    | Object containing any key-value pair required by GP Service                                               |
