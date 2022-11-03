# Geoprocessing Bundle

This bundle enables the user to trigger the execution of Geoprocessing services.

![Screenshot App](https://github.com/conterra/mapapps-geoprocessing/blob/master/screenshot.jpg)

## Sample App
https://demos.conterra.de/mapapps/resources/apps/downloads_geoprocessing/index.html

## Build Status
[![devnet-bundle-snapshot](https://github.com/conterra/mapapps-geoprocessing/actions/workflows/devnet-bundle-snapshot.yml/badge.svg)](https://github.com/conterra/mapapps-geoprocessing/actions/workflows/devnet-bundle-snapshot.yml)

## Installation Guide
**Requirement: map.apps 4.12.0**

[dn_geoprocessing Documentation](https://github.com/conterra/mapapps-geoprocessing/tree/master/src/main/js/bundles/dn_geoprocessing)

## Development Guide
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

### Other methods to define the mapapps.remote.base property.
1. Goal parameters
   `mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
   Change the mapapps.remote.base in the build.properties file and run:
   `mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`
