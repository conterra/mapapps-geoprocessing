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
import GeoprocessingWidget from "./GeoprocessingWidget.vue";
import {Vue} from "apprt-vue/module";
import VueDijit from "apprt-vue/VueDijit";
import Binding, {Bindable} from "apprt-binding/Binding";

export default class GeoprocessingWidgetFactory {

    private vm: Vue;
    private binding: Bindable;
    private _i18n!: InjectedReference<any>;
    private _model!: InjectedReference<any>;
    private _controller!: InjectedReference<any>;

    activate(): void {
        this.initComponent();
    }

    deactivate(): void {
        this.destroyWidget();
        this.binding.unbind();
        this.binding = undefined;
    }

    createInstance(): any {
        return VueDijit(this.vm, {
            class: "geoprocessing-widget"
        });
    }

    private destroyWidget(): void {
        this.vm?.destroy();
        this.vm = undefined;
    }

    private initComponent(): void {
        const model = this._model;
        const controller = this._controller;
        const vm = this.vm = new Vue(GeoprocessingWidget);
        vm.i18n = this._i18n.get().ui;

        vm.$on("start-geoprocessing", (toolId) => {
            controller.startGeoprocessing(toolId);
        });

        this.binding = Binding.for(vm, model)
            .syncAllToLeft("loading", "resultState", "supportEmailAddress", "tools")
            .enable()
            .syncToLeftNow();
    }
}
