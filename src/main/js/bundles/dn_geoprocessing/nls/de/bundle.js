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
    bundleName: "Geoprocessing",
    bundleDescription: "Dieses Modul ermöglicht es Geoprocessing Dienste auszuführen.",

    tool: {
        title: "Geoprocessing",
        tooltip: "Geoprocessing"
    },

    ui: {
        startGeoprocessing: "Starte Geoprocessing",
        selectTool: "Tool wählen",
        success: "Geoprocessing erfolgreich abgeschlossen.",
        error: "Es ist ein Fehler aufgetreten, bitte wenden Sie sich an",
        limitRuleText: "Der eingegebene Wert liegt nicht im vorgegebenen Wertebereich.",
        NaNRuleText: "Der eingegebene Wert ist keine Zahl.",
        pointSeparatedRuleText: "Dezimalwerte müssen mit einem Punkt getrennt sein.",
        noDecimalsRuleText: "Long Werte könnte keine Dezimaltrennzeichen beinhalten.",
        parametersTab: "Parameter",
        resultsTab: "Ergebnisse",
        editableParameters: "Editierbare Parameter",
        executeButtonLabel: "Ausführen",
        notifierStart: "Der Geoprocessing Service wurde erfolgreich gestartet.",
        notifierSuccess: "Der Geoprocessing Service wurde erfolgreich ausgeführt.",
        notifierError: "Beim Ausführen des Geoprocessing Services trat ein Fehler auf."
    }
};
