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
import GeoprocessingWidget from "./GeoprocessingWidget.vue";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import Binding from "apprt-binding/Binding";

export default class GeoprocessingWidgetFactory {

    #vm = undefined;
    #binding = undefined;

    activate() {
        this.#initComponent();
    }

    deactivate() {
        this.#destroyWidget();
        this.#binding.unbind();
        this.#binding = undefined;
    }

    createInstance() {
        return VueDijit(this.#vm, {
            class: "geoprocessing-widget"
        });
    }

    #destroyWidget() {
        this.#vm?.destroy();
        this.#vm = undefined;
    }

    #initComponent() {
        const model = this._model;
        const controller = this._controller;
        const vm = this.#vm = new Vue(GeoprocessingWidget);
        vm.i18n = this._i18n.get().ui;

        const filteredServices = controller._filterServicesForUser(model.services);
        model.services = filteredServices;

        vm.$on("startGeoprocessing", (selectedService) => {
            controller._startGeoprocessing(selectedService);
        });

        this.#binding = Binding.for(vm, model)
            .syncAllToLeft("loading", "resultState", "supportEmailAddress", "services")
            .enable()
            .syncToLeftNow();
    }
}
