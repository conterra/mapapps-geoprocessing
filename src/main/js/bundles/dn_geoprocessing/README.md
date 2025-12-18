# Geoprocessing

This bundle enables the user to trigger the execution of Geoprocessing services.

## Usage

**Requirement: map.apps 4.20.0**

1. First you need to add the bundle dn_geoprocessing to your app.
2. Then you can configure it.

### Supported input parameter types:
- boolean
- string
- long
- double
- feature-record-set-layer
- linear-unit
- file upload

### Supported output parameter types:
- string
- data-file
- feature-record-set-layer

## Configuration Reference

### GeoprocessingTools

```json
"GeoprocessingTools": [
    {
        "id": "gp_toolset_dev",
        "title": "Entwicklungsbeispiel",
        "tooltip": "Entwicklungsbeispiel",
        "rules": {
            "roles": [
                "maAdmin",
                "maEditor"
            ],
            "ruleSuccessProperty": "enabled"
        },
        "refreshLayerIds": [
            "libraries",
            "stoerungen"
        ],
        "url": "https://services.conterra.de/test",
        "showWidget": true,
        "executeButtonText": "Example String",
        "highlightSymbol": {
            "type": "simple-marker",
            "size": 16,
            "style": "cross",
            "outline": {
                "width": 1.5,
                "style": "solid"
            }
        },
        "haloSymbol": {
            "type": "simple-marker",
            "size": 18,
            "style": "cross",
            "outline": {
                "width": 7,
                "style": "solid",
                "color": "white"
            }
        },
        "parameters": [
            {
                "name": "boolean",
                "title": "Boolean",
                "type": "boolean",
                "value": true,
                "editable": true,
                "required": true
            },
            {
                "name": "string",
                "title": "String",
                "type": "string",
                "value": "Haus",
                "editable": true,
                "required": true
            },
            {
                "name": "string_choicelist",
                "title": "String Auswahlliste",
                "type": "string",
                "value": "Apfel",
                "choiceList": [
                    "Apfel",
                    "Birne",
                    "Traube"
                ],
                "editable": true,
                "required": true
            },
            {
                "name": "sampleLong",
                "title": "Long",
                "type": "long",
                "value": 1337,
                "editable": true,
                "required": true
            },
            {
                "name": "sampleLongWithRange",
                "title": "Long mit Wertebereich",
                "type": "long",
                "value": 5,
                "range": {
                    "min": 0,
                    "max": 10
                },
                "editable": true,
                "required": true
            },
            {
                "name": "sampleDouble",
                "title": "Double",
                "type": "double",
                "value": 3.14,
                "editable": true,
                "required": true
            },
            {
                "name": "sampleDoubleWithRange",
                "title": "Double mit Wertebereich",
                "type": "double",
                "value": 3.14,
                "range": {
                    "min": 1.5,
                    "max": 15.5
                },
                "editable": true,
                "required": true
            },
            {
                "name": "uneditable",
                "title": "Nicht editierbar",
                "type": "double",
                "value": 5,
                "editable": false,
                "visible": false
            },
            {
                "name": "upload",
                "title": "Datei-Upload",
                "type": "upload",
                "upload": {
                    "url": "https://example.com/arcgis/rest/services/TestService/FeatureServer/uploads/upload",
                    "fileParameter": "txt",
                    "idField": "itemID"
                },
                "value": null,
                "editable": true,
                "required": true
            }
        ]
    }
]
```

| Property          | Type    | Possible Values   | Default  | Description                                                                                                             |
| ----------------- | ------- | ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| id                | String  |                   | ```""``` | Id of GP Service Tool                                                                                                   |
| title             | String  |                   | ```""``` | Title of GP Service Tool                                                                                                |
| tooltip           | String  |                   | ```""``` | Tooltip of GP Service Tool                                                                                              |
| rules             | Object  |                   | ```""``` | Define toolrules to control tools https://docs.conterra.de/en/mapapps/latest/apps/configuring-apps/tools.html#toolrules |
| url               | String  |                   | ```""``` | URL of GPServer                                                                                                         |
| showWidget        | Boolean | `true` or `false` | ```""``` | Determines whether the parameterInputWidget will be shown                                                               |
| refreshLayers     | Array   |                   | ```[]``` | Array of layer ids of layers that should be refreshed after successful run of the GPServer                              |
| parameters        | Array   |                   | ```[]``` | Array of parameters as required by GP Service                                                                           |
| executeButtonText | String  |                   | ```""``` | Text to display on the execution button                                                                                 |
| highlightSymbol   | Object  |                   | ```{}``` | Symbology to highlight clicked location with                                                                            |
| haloSymbol        | Object  |                   | ```{}``` | Extended symbology to highlight clicked location with                                                                   |

### Upload Parameter Properties
For parameters with `"type": "upload"`, the following additional properties can be configured:

| Property                 | Type   | Possible Values | Default  | Description                                                                |
| ------------------------ | ------ | --------------- | -------- | -------------------------------------------------------------------------- |
| upload.url               | String |                 | ```""``` | URL of the upload service endpoint                                         |
| upload.fileParameter     | String |                 | ```""``` | Name of the file parameter expected by the upload service                  |
| upload.idField           | String |                 | ```""``` | Field name that contains the upload ID returned by the upload service     |

### Optional: Output Paramter Config
Optionally, the output parameters can be configured. Currently this is supported for results of the type "feature-record-set-layer".
This configuration allows to trigger actions for the result features.

```json
"GeoprocessingTools": [
    {
        [...]
        "showWidget": true,
        "parameters": [...],
        "outputParameters": [
            {
                "name": "output",
                "type": "feature-record-set-layer",
                "actions": ["geoprocessing-addfeaturestolayer", "zoomto"],
                "actionsConfig": {
                    "zoomto-scale": 1000,
                    "addto-featurelayer-id": "fieldnotes",
                    "addto-featurelayer-url": "https://services.arcgis.com/ObdAEOfl1Z5LP2D0/arcgis/rest/services/Feldnotizen_erfassen/FeatureServer/2"
                }
            }
        ]
    }
]
[...]
```

| Property      | Type   | Possible Values | Default  | Description                                                                                                                                                                                                                        |
| ------------- | ------ | --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name          | String |                 | ```""``` | Name of the parameter returned by GP Service                                                                                                                                                                                       |
| type          | String |                 | ```""``` | Type of the parameter returned by GP Service                                                                                                                                                                                       |
| actions       | Array  |                 | ```[]``` | Array of action ids providing the interface `map-actions.Action`                                                                                                                                                                   |
| actionsConfig | Object |                 | ```{}``` | Configuration of the used actions. See [documentation](https://demos.conterra.de/mapapps/resources/jsregistry/root/index.html?lang=de#b%3Dmap-actions%3Bv%3D4.15.1%3Bvr%3D%5E4.15%3Bp%3Dmap.apps%3Bf%3Dmap-action%3B) for details. |


### Optional: "geoprocessing-addfeaturestolayer" Action Config
This action can be used to save the GP Service results in a FeatureLayer if they are of the type "feature-record-set-layer".
Either of the following properties must be provided. If both are configured `addto-featurelayer-id` is used.

| Property               | Type   | Possible Values                            | Default  | Description                                                                                                                        |
| ---------------------- | ------ | ------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| addto-featurelayer-id  | String | any id of a feature layer in the map       | ```""``` | Id of the feature layer to which the result will be added.                                                                         |
| addto-featurelayer-url | String | any url leading to a feature layer service | ```""``` | Url of the service from which a layer is created. The result will be added to the created layer and the layer is added to the map. |


### Config

```json
"Config": {
    "supportEmailAddress": "support@conterra.de"
}
```

| Property            | Type   | Possible Values | Default  | Description                                            |
| ------------------- | ------ | --------------- | -------- | ------------------------------------------------------ |
| supportEmailAddress | String | Any String      | ```""``` | Contact email provided in widget if GP execution fails |

### Customize widget configuration

To customize the appearance of the widget, use the widgetRole _geoprocessingParameterWidget_.

More information about customizing a widget can be found here: https://docs.conterra.de/en/mapapps/latest/apps/configuring-apps/layout.html#customize-widgets
