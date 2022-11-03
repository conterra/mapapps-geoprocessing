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

### GeoprocessingTools

```json
"GeoprocessingTools": [
    {
        "id": "gp_toolset_dev",
        "title": "DEV Geoprocessing Toolset",
        "tooltip": "DEV Geoprocessing Toolset",
        "rules": {
            "roles": [
                "maAdmin",
                "maEditor"
            ],
            "ruleSuccessProperty": "enabled"
        },
        "url": "https://dev.laixoversum.ch/dev1ags2/rest/services/invers_automations/gpBundleTester/GPServer/GP_Bundle_Tester",
        "showWidget": true,
        "parameters": [
            {
                "name": "sampleString",
                "type": "string",
                "value": "dev",
                "choiceList": [
                    "test",
                    "sample"
                ],
                "editable": true,
                "required": true
            },
            {
                "name": "sampleLong",
                "type": "long",
                "value": 754673473567,
                "range": {
                    "lowerLimit": 1,
                    "upperLimit": 14
                },
                "editable": true,
                "required": false
            },
            {
                "name": "sampleDouble",
                "type": "double",
                "value": 3.14,
                "range": {
                    "lowerLimit": 1.5,
                    "upperLimit": 15.5
                },
                "editable": true,
                "required": true
            },
            {
                "name": "unedit",
                "value": 5,
                "editable": false
            }
        ]
    }
]


```

| Property    | Type    | Possible Values                                     | Default    | Description                                                          |
|-------------|---------|-----------------------------------------------------|------------|----------------------------------------------------------------------|
| id          | String  | Any String prefixed with gp_                        | ```""```   | Id of GP Service Tool                                                |
| title       | String  | Any String                                          | ```""```   | Title of GP Service Tool                                             |
| tooltip     | String  | Any String                                          | ```""```   | Tooltip of GP Service Tool                                           |
| rules       | Object  | Any Object containing roles and ruleSuccessProperty | ```""```   | User access configuration                                            |
| url         | String  | URL of GP Service                                   | ```""```   | URL of GP Service                                                    |
| showWidget  | Boolean | `true` or `false`                                   | ```""```   | Determines whether the parameterInputWidget will be shown            |
| parameters  | Array   | Array of any objects                                | ```[]```   | Array of parameters as required by GP Service                        |

### Config

```json
"Config": {
"supportEmailAddress": "support@conterra.de"
}
```

| Property            | Type      | Possible Values                                  | Default     | Description                                                                                               |
|---------------------|-----------|--------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------------------|
| supportEmailAddress | String    | Any String                                       | ```""```    | Contact email provided in widget if GP execution fails                                                    |                                                                                     |
