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
import ct_util from "ct/ui/desktop/util";
import ServiceRegistration from "apprt/ServiceRegistration";
import BundleContext from "apprt/BundleContext";
import {LogService} from "system/module";
import Binding from "apprt-binding/Binding";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import InputParameterEntryMask from "./GeoprocessingParameterInputWidget.vue";

interface Tool {
    id: string,
    url: string,
    synchronous: boolean,
    params: object,

    set(string, boolean): void
}

export default class GeoprocessingController {

    private _dataModel!: InjectedReference<any>;
    private _model!: InjectedReference<typeof GeoprocessingModel>;
    private _i18n!: InjectedReference<any>;
    private _logService!: InjectedReference<LogService>;
    private _mapWidgetModel!: InjectedReference<any>;

    private bundleContext: BundleContext;
    private widgetServiceRegistration: ServiceRegistration;
    private tools: Tool[];

    /**
     * Run automatically on component activation
     *
     * @param componentContext Context of the component used for service registration of widget
     */
    activate(componentContext: InjectedReference<any>): void {
        this.tools = [];
        this.bundleContext = componentContext.getBundleContext();
    }

    /**
     * deactivate()
     * Run automatically on component activation
     */
    deactivate(): void {
    }


    /**
     * Run by SCR on adding tool
     * Calls addTool() of GeoprocessingModel
     * Adds all tools specified in app.json to this.tools
     *
     * @param tool A tool definition taken from the app.json
     */
    addTool(tool: Tool): void {
        const model = this._model;
        model.addTool(tool);

        this.tools.push(tool);
    }


    /**
     * removeTool()
     * Run by SCR on removing tool
     * Removes a specific tool from the list of tools in this.tools
     *
     * @param tool A tool definition taken from the app.json
     */
    removeTool(tool: Tool): void {
        const model = this._model;
        model.removeTool(tool);

        const removeIndex = this.tools.findIndex(t => t.id === tool.id);
        this.tools = this.tools.splice(removeIndex, 1);
    }

    /**
     * Called by GeoprocessingToolsWidgetFactory on "start-geoprocessing" event.
     * This event is thrown by the GeoprocessingToolsWidget startGeoprocessing button on click
     *
     * @param toolId ID of the tool to start
     */
    startGeoprocessing(toolId: string): void {
        const tool = this.tools.find(tool => tool.id === toolId);
        this.startGeoprocessingTool(tool);
    }

    /**
     * Called by startGeoprocessing()
     * Also called by handlerScope of geoprocessingtools
     * Handles usage of resultcenter and InputParametersWidget
     *
     * @param event An event containing geoprocessing tool information
     *
     * @private
     */
    private async startGeoprocessingTool(event: any): Promise<any> {
        const tool = event.tool;
        let parameters = tool.parameters;

        // if resultcenter data is necessary wait for it...
        if (event.toolRole === "resultcenter") {
            parameters = await this.getResultCenterData(parameters);
        }

        // if editable parameters are given in the tool definition wait for them...
        if (tool.showWidget) {
            this.showParametersWidget(parameters, tool);
        } else { // ... then run the service
            await this.runGeoprocessingService(parameters, tool);
        }
    }

    /**
     * Run on 'execute-button-clicked' event of ParameterInputWidget execute button
     * Also called by startGeoprocessingTool()
     *
     * @param parameters (edited) parameters to forward to the geoprocessing service
     * @param tool A tool definition taken from the app.json
     *
     * @private
     */
    private async runGeoprocessingService(parameters: any[], tool) {
        const model = this._model;

        // if no widget is to be displayed, inform user of geoprocessing service start
        if (!tool.showWidget) {
            this._logService.info({
                message: this._i18n.get().ui.notifierStart
            }, null, null, null);
        }

        // handle geoporcessing start internally
        tool.set("processing", true);
        model.loading = true;
        model.resultState = undefined;
        model.gpServiceResponseMessages = [];
        const params = {};

        // add params from array to object as property: value
        parameters.forEach(param => {
            params[param.name] = param.value;
        });

        // determine whether geoprocessing service works synchronously or asynchronously
        const metadata = await GeoprocessingController.getMetadata(tool.url);
        if (!metadata) {
            model.loading = false;
            model.resultState = "error";
            tool.set("processing", false);
            return;
        }
        const executionType = metadata.executionType;

        // synchronous workflow
        if (executionType === "esriExecutionTypeSynchronous") {
            try {
                // case: geoprocessing service ran successfully

                // start synchronous geoprocessing service execution
                await geoprocessor.execute(tool.url, params);

                // handle finishing of geoprocessing service internally
                model.loading = false;
                model.resultState = "success";
                tool.set("processing", false);

                // if no widget is to be displayed, inform user of geoprocessing service success
                if (!tool.showWidget) {
                    this._logService.info({
                        message: this._i18n.get().ui.notifierSuccess
                    }, null, null, null);
                }

                if (tool.refreshLayerIds) {
                    this.reloadLayersAfterGeoprocessing(tool.refreshLayerIds);
                }
            } catch (error) {
                // case: geoprocessing service ran unsuccessfully

                // handle finishing of geoprocessing service internally
                model.loading = false;
                model.resultState = "error";
                tool.set("processing", false);

                // if no widget is to be displayed, inform user of geoprocessing service failure
                if (!tool.showWidget) {
                    this._logService.info({
                        error: this._i18n.get().ui.notifierError
                    }, null, null, null);
                }
            }
        } else {
            // asynchronous workflow

            // start asynchronous geoprocessing service execution
            const jobInfo = await geoprocessor.submitJob(tool.url, params);

            // get status messages and add them to widget
            const options = {
                interval: 1500,
                statusCallback: () => {
                    this.addResultMessages(jobInfo);
                }
            };

            try {
                // case: geoprocessing service has completed execution successfully
                await jobInfo.waitForJobCompletion(options);

                // add final status message to widget
                this.addResultMessages(jobInfo);

                // handle finishing of geoprocessing service internally
                model.loading = false;
                model.resultState = "success";
                tool.set("processing", false);

                // if no widget is to be displayed, inform user of geoprocessing service success
                if (!tool.showWidget) {
                    this._logService.info({
                        message: this._i18n.get().ui.notifierSuccess
                    }, null, null, null);
                }

                if (tool.refreshLayerIds) {
                    this.reloadLayersAfterGeoprocessing(tool.refreshLayerIds);
                }
            } catch (error) {
                // case: geoprocessing service has completed execution unsuccessfully
                // add final status message to widget
                this.addResultMessages(jobInfo);

                // handle finishing of geoprocessing service internally
                model.loading = false;
                model.resultState = "error";
                tool.set("processing", false);

                // if no widget is to be displayed, inform user of geoprocessing service failure
                if (!tool.showWidget) {
                    this._logService.info({
                        error: this._i18n.get().ui.notifierError
                    }, null, null, null);
                }
            }
        }
    }

    /**
     * Called by runGeoprocessingService() in the asynchronous workflow
     *
     * @param jobInfo Information string returned by the geoprocessing
     * service describing current or final execution status
     *
     * @private
     */
    private addResultMessages(jobInfo): void {
        const model = this._model;

        // clear status information previously saved in model
        model.gpServiceResponseMessages = [];

        // push new status messages into model
        jobInfo.messages.forEach((message, i) => {
            model.gpServiceResponseMessages.push({
                id: i,
                description: message.description,
                type: message.type
            });
        });
    }

    /**
     * Helper function used to access the metadata of the geoprocessing service available at given url
     * Called when starting a geoprocessing service execution to determine mode of service exectuion
     *
     * @param url Address of the geoprocessing service queried for metadata
     *
     * @private
     */
    private static getMetadata(url: string) {
        return apprt_request(url, {
            query: {
                f: 'json'
            },
            handleAs: 'json'
        }).then((result) => result, (error) => {
            console.error(error);
        });
    }

    /**
     * Called by startGeoprocessingTool() if result center data is required
     *
     * @param parameters Parameters configured in the app.json for the geoprocessing service
     *
     * @private
     */
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

    /**
     * Called by startGeoprocessingTool() when showWidget is configured as true
     *
     * @param parameters Parameters configured in the app.json for the geoprocessing service
     * @param tool A tool definition taken from the app.json
     *
     * @private
     */
    private showParametersWidget(parameters: object, tool: any): void {
        // if widget is already opened, close it
        this.hideWidget();

        // start widget creation
        const widget = this.getInputParameterWidget(parameters);
        const vm = widget.getVM();

        // add listener to the execution button click event
        vm.$on('execute-button-clicked', async parametersWithRules => {
            // run geoprocessing service with edited parameters
            await this.runGeoprocessingService(parametersWithRules, tool);
        });

        // finish widget creation
        const serviceProperties = {
            "widgetRole": "inputParameterEntryWidget"
        };
        const interfaces = ["dijit.Widget"];
        this.widgetServiceRegistration = this.bundleContext.registerService(interfaces, widget, serviceProperties);
        setTimeout(() => {
            const window: any = ct_util.findEnclosingWindow(widget);
            if (window) {
                window.set("title", tool.title);
                window.on("Close", () => {
                    this.hideWidget();
                });
            }
        }, 100);
    }

    /**
     * Helper function used in widget creation
     *
     * @param parameters Parameters configured in the app.json for the geoprocessing service
     * @private
     */
    private getInputParameterWidget(parameters): any {
        const vm = new Vue(InputParameterEntryMask);
        vm.i18n = this._i18n.get().ui;
        vm.parameters = parameters;

        Binding.for(vm, this._model)
            .syncAllToLeft("loading", "resultState", "supportEmailAddress",
                "gpServiceResponseMessages", "gpServiceResponseResults")
            .enable()
            .syncToLeftNow();

        const widget = VueDijit(vm, {
            class: "geoprocessing-parameter-widget"
        });
        widget.own({
            remove() {
                vm.$off();
            }
        });
        return widget;
    }

    /**
     * hideWidget()
     * Helper function used to close widget
     *
     * @private
     */
    private hideWidget(): void {
        const registration = this.widgetServiceRegistration;

        // clear the reference
        this.widgetServiceRegistration = null;

        if (registration) {
            // call unregister
            registration.unregister();
        }
    }

    /**
     * reloadLayersAfterGeoprocessing()
     * Helper function used to refresh configured layers after successful geoprocessing service execution
     *
     * @param layerIds Array of layerId strings to refresh
     *
     * @private
     */
    private reloadLayersAfterGeoprocessing(layerIds) {
        layerIds.forEach(layerId => {
            const layer = this.getLayer(layerId);
            layer?.refresh && layer.refresh();
        });
    }

    /**
     * Returns one layer of the map
     *
     * @param layerIdPath
     * @private
     */
    private getLayer(layerIdPath) {
        const mapWidgetModel = this._mapWidgetModel;

        const parts = layerIdPath.split("/");
        const layerId = parts[0];
        const sublayerId = parts[1];

        const layer = mapWidgetModel?.map?.findLayerById(layerId);
        if (!sublayerId) {
            return layer;
        }

        return layer.findSublayerById(parseInt(sublayerId, 10));
    }
}
