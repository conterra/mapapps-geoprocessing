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
            limitRuleText: "Value is not within limits.",
            NaNRuleText: "Value is not a number.",
            pointSeparatedRuleText: "Decimal values need to be separated by a point.",
            noDecimalsRuleText: "Long values cannot include a delimiter",
            parametersTab: "Parameters",
            resultsTab: "Results",
            editableParameters: "Editable parameters",
            notifierStart:"The Geoprocessing Service has been started.",
            notifierSuccess: "The Geoprocessing Service was executed successfully.",
            notifierError: "The Geoprocessing Service execution encountered an error."
        }
    },
    de: true
};
