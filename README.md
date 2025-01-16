# Geoprocessing Bundle

This bundle enables the user to trigger the execution of Geoprocessing services.

![Screenshot App](https://github.com/conterra/mapapps-geoprocessing/blob/main/screenshot.jpg)

## Sample App
https://demos.conterra.de/mapapps/resources/apps/downloads_geoprocessing/index.html

## Build Status
[![devnet-bundle-snapshot](https://github.com/conterra/mapapps-geoprocessing/actions/workflows/devnet-bundle-snapshot.yml/badge.svg)](https://github.com/conterra/mapapps-geoprocessing/actions/workflows/devnet-bundle-snapshot.yml)

## Installation Guide
**Requirement: map.apps 4.12.0**

[dn_geoprocessing Documentation](https://github.com/conterra/mapapps-geoprocessing/tree/master/src/main/js/bundles/dn_geoprocessing)

## Quick start

Clone this project and ensure that you have all required dependencies installed correctly (see [Documentation](https://docs.conterra.de/en/mapapps/latest/developersguide/getting-started/set-up-development-environment.html)).

Then run the following commands from the project root directory to start a local development server:

```bash
# install all required node modules
$ mvn initialize

# start dev server
$ mvn compile -Denv=dev -Pinclude-mapapps-deps

# run unit tests
$ mvn test -P run-js-tests,include-mapapps-deps
```
