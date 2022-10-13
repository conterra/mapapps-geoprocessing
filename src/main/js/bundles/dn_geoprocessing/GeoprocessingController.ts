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
import InputParameterEntryMask from "./GeoprocessingParameterInputWidget.vue";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import ct_util from "ct/ui/desktop/util";
import Binding from "apprt-binding/Binding";

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
    private bundleContext: InjectedReference<any>;
    private widgetServiceregistration: InjectedReference<any>;
    private uneditableParameters: Array<any>;

    activate(componentContext: InjectedReference<any>): void {
        this.tools = [];
        this.bundleContext = componentContext.getBundleContext();
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

    /**
     * Gets called by the click-tool
     *
     * @param toolId Tool ID
     */
    startGeoprocessing(toolId: string): void {
        const tool = this.tools.find((t) => t.id === toolId);
        this.startGeoprocessingTool(tool);
    }

    private async startGeoprocessingTool(event: any): Promise<any> {
        const model = this._model;
        const tool = event.tool;
        let parameters = tool.parameters;

        tool.set("processing", true);

        if (event.toolRole === "resultcenter") {
            parameters = await this.getResultCenterData(parameters);
        }
        if (tool.showWidget) {
            this.showParametersWidget(parameters, tool);
        } else {
            await this.runGeoprocessingService(parameters, tool);
        }
    }

    private async runGeoprocessingService(parameters: any[], tool) {
        const model = this._model;
        model.loading = true;
        model.resultState = undefined;
        const params = {};
        // add required parameters
        parameters.forEach(param => {
            params[param.name] = param.value;
        });

        const metadata = await GeoprocessingController.getMetadata(tool.url);
        const executionType = metadata.executionType;

        if (executionType === "esriExecutionTypeSynchronous") {
            geoprocessor.execute(tool.url, params).then((result) => {
                model.loading = false;
                model.resultState = "success";
                tool.set("processing", false);
            });
        } else {
            geoprocessor.submitJob(tool.url, params).then((jobInfo) => {
                const options = {
                    interval: 1500,
                    statusCallback: (j) => {
                        model.gpServiceResponseMessages = [];
                        j.messages.forEach(message => {
                            model.gpServiceResponseMessages.push({description: message.description});
                        });
                    }
                };

                jobInfo.waitForJobCompletion(options).then((supportJobInfo) => {
                    model.gpServiceResponseMessages = [];
                    jobInfo.messages.forEach(message => {
                        model.gpServiceResponseMessages.push({description: message.description});
                    });
                    model.loading = false;
                    model.resultState = "success";
                    tool.set("processing", false);
                });
            });
        }
    }

    private static getMetadata(url: string) {
        return apprt_request(url, {
            query: {
                f: 'json'
            },
            handleAs: 'json'
        });
    }

    private getResultCenterData(parameters: any[]): Promise<object> {
        const dataModel = this._dataModel;
        return new Promise((resolve) => {
            apprt_when(dataModel.getSelected(), (selectedIds) => {
                apprt_when(dataModel.queryById(selectedIds), (result) => {
                    const newParameters = parameters.map((parameter) => {
                        if (parameter.value === "{SELECTED_IDS}") {
                            parameter.value = selectedIds.toString();
                        }
                        if (result.length === 1) {
                            const feature = result[0];
                            if (typeof (parameter.value) === "string") {
                                parameter.value = intl.substitute(parameter.value, feature);
                            }
                        }
                        return parameter;
                    });
                    resolve(newParameters);
                });
            });
        });
    }

    private showParametersWidget(parameters: object, tool: any): void {
        const widget = this.getInputParameterWidget(parameters, tool);
        const vm = widget.getVM();

        vm.$on('execute-button-clicked', async parametersWithRules => {
            await this.runGeoprocessingService(parametersWithRules, tool);
        });

        const serviceProperties = {
            "widgetRole": "inputParameterEntryWidget"
        };
        const interfaces = ["dijit.Widget"];
        this.widgetServiceregistration = this.bundleContext.registerService(interfaces, widget, serviceProperties);
        setTimeout(() => {
            const window = ct_util.findEnclosingWindow(widget);
            window?.on("Close", () => {
                this.hideWidget();
            });
        }, 500);
    }

    private getInputParameterWidget(parameters, tool): any {
        const model = this._model;

        const vm = new Vue(InputParameterEntryMask);
        model.toolTitle = tool.title;
        vm.i18n = this._i18n.get().ui;
        vm.parameters = parameters;

        Binding.for(vm, this._model)
            .syncAllToLeft("toolTitle", "loading", "gpServiceResponseMessages", "gpServiceResponseResults")
            .enable()
            .syncToLeftNow();

        const widget = VueDijit(vm);
        widget.own({
            remove() {
                vm.$off();
            }
        });
        return widget;
    }

    private hideWidget(): void {
        const registration = this.widgetServiceregistration;

        // clear the reference
        this.widgetServiceregistration = null;

        if (registration) {
            // call unregister
            registration.unregister();
        }
    }
}
