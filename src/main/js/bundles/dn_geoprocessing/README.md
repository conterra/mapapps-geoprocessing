# Geoprocessing

This bundle enables the user to trigger the execution of Geoprocessing services.

## Usage

**Requirement: map.apps 4.12.0**

1. First you need to add the bundle dn_geoprocessing to your app.
2. Then you can configure it.

### Supported input parameter types:
- boolean
- string
- long
- double
- feature-record-set-layer
- linear-unit

### Supported output parameter types:
- string
- data-file

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
                "editable": false
            }
        ]
    }
]
```

| Property      | Type    | Possible Values   | Default  | Description                                                                                                             |
|---------------|---------|-------------------|----------|-------------------------------------------------------------------------------------------------------------------------|
| id            | String  |                   | ```""``` | Id of GP Service Tool                                                                                                   |
| title         | String  |                   | ```""``` | Title of GP Service Tool                                                                                                |
| tooltip       | String  |                   | ```""``` | Tooltip of GP Service Tool                                                                                              |
| rules         | Object  |                   | ```""``` | Define toolrules to control tools https://docs.conterra.de/en/mapapps/latest/apps/configuring-apps/tools.html#toolrules |
| url           | String  |                   | ```""``` | URL of GPServer                                                                                                         |
| showWidget    | Boolean | `true` or `false` | ```""``` | Determines whether the parameterInputWidget will be shown                                                               |
| refreshLayers | Array   |                   | ```[]``` | Array of layer ids of layers that should be refreshed after successful run of the GPServer                              |
| parameters    | Array   |                   | ```[]``` | Array of parameters as required by GP Service                                                                           |

### Config

```json
"Config": {
    "supportEmailAddress": "support@conterra.de"
}
```

| Property            | Type   | Possible Values | Default  | Description                                            |
|---------------------|--------|-----------------|----------|--------------------------------------------------------|
| supportEmailAddress | String | Any String      | ```""``` | Contact email provided in widget if GP execution fails |
