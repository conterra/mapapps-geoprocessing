/*
 * Copyright (C) 2022 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
module.exports = {
    root: {
        bundleName: "Geoprocessing",
        bundleDescription: "This bundle enables the execution of Geoprocessing services.",
        tool: {
            title: "Geoprocessing",
            tooltip: "Geoprocessing"
        },
        ui: {
            startGeoprocessing: "Start Geoprocessing",
            selectTool: "Select Tool",
            success: "Geoprocessing completed successfully.",
            error: "Geoprocessing failed. Please contact the support at",
            parametersTab: "Parameters",
            resultsTab: "Results",
            executeButtonLabel: "Execute",
            notifierStart:"The Geoprocessing Service has been started.",
            notifierSuccess: "The Geoprocessing Service was executed successfully.",
            notifierError: "The Geoprocessing Service execution encountered an error.",
            rules: {
                required: "This is a required field",
                range: "The entered value is not in the specified range of values",
                NaN: "The entered value is not a number",
                noLong: "The entered value is not an integer",
                noDouble: "The entered value is not a floating point number"
            }
        }
    },
    de: true
};
