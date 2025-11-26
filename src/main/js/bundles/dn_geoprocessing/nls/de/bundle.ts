///
/// Copyright (C) 2025 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { Messages } from "../bundle";

export default {
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
        parametersTab: "Parameter",
        parametersForm: "Formular zur Eingabe der Geoprocessing-Parameter",
        parameters: {
            x: "Rechtswert",
            y: "Hochwert"
        },
        selectFile: "Datei auswählen",
        selectCenterOnMap: "Mittelpunktkoordinate auf der Karte auswählen",
        processingInProgress: "Die Abfrage läuft",
        resultsTab: "Ergebnisse",
        executeButtonLabel: "Ausführen",
        result: "Ergebnis",
        downloadResult: "Ergebnis herunterladen",
        notifierStart: "Der Geoprocessing Service wurde erfolgreich gestartet.",
        notifierSuccess: "Der Geoprocessing Service wurde erfolgreich ausgeführt.",
        notifierError: "Beim Ausführen des Geoprocessing Services trat ein Fehler auf.",
        rules: {
            required: "Dies ist ein Pflichtfeld",
            range: "Der eingegebene Wert liegt nicht im vorgegebenen Wertebereich",
            NaN: "Der eingegebene Wert ist keine Zahl",
            noLong: "Der eingegebene Wert ist keine Ganzzahl",
            noDouble: "Der eingegebene Wert ist keine Fließkommazahl"
        }
    }
} satisfies Messages;
