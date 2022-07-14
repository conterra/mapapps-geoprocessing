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

import type {InjectedReference} from "apprt-core/InjectedReference";
import * as geoprocessor from "esri/rest/geoprocessor";
import apprt_request from "apprt-request";
import GeoprocessingModel from "dn_geoprocessing/GeoprocessingModel";
import * as intl from "esri/intl";
import apprt_when from "apprt-core/when";

interface Tool {
    id: string,
    url: string,
    synchronous: boolean,
    params: object,

    set(string, boolean): void
}

export default class GeoprocessingController {

    private tools: Tool[];
    private _dataModel!: InjectedReference<any>;
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

    async startGeoprocessingTool(event: any): Promise<any> {
        const model = this._model;
        const tool = event.tool;
        const url = tool.url;
        let params = tool.params;

        tool.set("processing", true);
        model.loading = true;
        model.resultState = undefined;

        if (event.toolRole === "resultcenter") {
            params = await this.getResultCenterData(params);
        }

        const metadata = await GeoprocessingController.getMetadata(url);
        const executionType = metadata.executionType;

        let promise;
        if (executionType === "esriExecutionTypeSynchronous") {
            promise = geoprocessor.execute(url, params);
        } else {
            promise = geoprocessor.submitJob(url, params);
        }
        this.handleGeoprocessingResult(promise, model, tool);
    }

    startGeoprocessing(toolId: string): void {
        const tool = this.tools.find((t) => t.id === toolId);
        this.startGeoprocessingTool(tool);
    }

    private handleGeoprocessingResult(promise: Promise<any>, model: typeof GeoprocessingModel, tool: Tool): void {
        promise.then((resolved) => {
            model.loading = false;
            model.resultState = "success";
            tool.set("processing", false);
        }, (rejected) => {
            model.loading = false;
            model.resultState = "failure";
            tool.set("processing", false);
        });
    }

    private static getMetadata(url: string) {
        return apprt_request(url, {
            query: {
                f: 'json'
            },
            handleAs: 'json'
        });
    }

    private async getResultCenterData(params: object): Promise<object> {
        const dataModel = this._dataModel;
        return new Promise((resolve) => {
            apprt_when(dataModel.getSelected(), (selectedIds) => {
                apprt_when(dataModel.queryById(selectedIds), (result) => {
                    const paramsClone = Object.assign({}, params);
                    for (const prop in paramsClone) {
                        if (paramsClone[prop] === "{SELECTED_IDS}") {
                            paramsClone[prop] = selectedIds.toString();
                        }
                        if (result.length === 1) {
                            const feature = result[0];
                            if (typeof (paramsClone[prop]) === "string") {
                                paramsClone[prop] = intl.substitute(paramsClone[prop], feature);
                            }
                        }
                    }
                    resolve(paramsClone);
                });
            });
        });
    }
}
