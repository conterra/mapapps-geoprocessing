///
/// Copyright (C) 2022 con terra GmbH (info@conterra.de)
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

import type {InjectedReference} from "apprt-core/InjectedReference";
import Geoprocessor from "esri/tasks/Geoprocessor";

interface Tool {
    id: string,
    url: string,
    synchronous: boolean,
    params: object,

    set(string, boolean): void
}

export default class GeoprocessingController {

    private tools: Tool[];
    private _userService!: InjectedReference<any>;
    private _model!: InjectedReference<any>;

    activate(): void {
        this.tools = [];
    }

    deactivate(): void {
    }

    addTool(tool: Tool): void {
        const model = this._model;
        model.addTool(tool);

        this.tools.push(tool);
    }

    removeTool(tool: Tool): void {
        const model = this._model;
        model.removeTool(tool);

        const removeIndex = this.tools.findIndex(t => t.id === tool.id);
        this.tools = this.tools.splice(removeIndex, 1);
    }

    startGeoprocessorTool(event: any): void {
        const model = this._model;
        const tool = event.tool;
        const url = tool.url;
        const synchronous = tool.synchronous;
        const params = tool.params;

        tool.set("processing", true);
        model.loading = true;

        const geoprocessor = new Geoprocessor({url: url});
        model.resultState = undefined;

        if (synchronous) {
            geoprocessor.execute(params).then((resolved) => {
                model.loading = false;
                model.resultState = "success";
                tool.set("processing", false);
            }, (rejected) => {
                model.loading = false;
                model.resultState = "failure";
                tool.set("processing", false);
            });
        } else {
            geoprocessor.submitJob(params).then((resolved) => {
                model.loading = false;
                model.resultState = "success";
                tool.set("processing", false);
            }, (rejected) => {
                model.loading = false;
                model.resultState = "failure";
                tool.set("processing", false);
            });
        }
    }

    startGeoprocessing(toolId: string): void {
        const tool = this.tools.find((t) => t.id === toolId);
        this.startGeoprocessorTool(tool);
    }

}
