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
import Geoprocessor from "esri/tasks/Geoprocessor";

export default class GeoprocessingController {

    _processor = undefined;

    activate() {
        const model = this._model;
        this._processor = new Geoprocessor({url: model.url});
    }

    deactivate() {
        this._processor = undefined;
    }

    _startGeoprocessing() {
        const model = this._model;
        const params = model.params;
        const synchronous = model.synchronous;

        model.resultState = undefined;

        if (synchronous) {
            model.loading = true;
            this._processor.execute(params).then((resolved) => {
                model.loading = false;
                model.resultState = "success";
            }, (rejected) => {
                model.loading = false;
                model.resultState = "failure";
            });
        }
        if (!synchronous) {
            model.loading = true;
            this._processor.submitJob(params).then((resolved) => {
                model.loading = false;
                model.resultState = "success";
            }, (rejected) => {
                model.loading = false;
                model.resultState = "failure";
            });
        }
    }
}
