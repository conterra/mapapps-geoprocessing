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
import { Action } from "map-actions/api";
import Layer from "esri/layers/Layer";

import type { InjectedReference } from "@conterra/ct-mapapps-typings/apprt-core/InjectedReference";
import type { MapWidgetModel } from "map-widget/api";
import type { AddFeaturesToLayerActionOptions } from "../api";

/**
 * Action for adding gp service result features to a layer using id or url.
 */
export class AddFeaturesToLayerAction implements Action {
    readonly id = "geoprocessing-addfeaturestolayer";

    private _mapWidgetModel: InjectedReference<MapWidgetModel>;

    async trigger(options?: AddFeaturesToLayerActionOptions): Promise<void> {


        if (!options || !options.items) {
            throw new Error(
                "AddFeaturesToLayerAction.trigger: " +
                    "Cannot execute AddFeaturesToLayerAction since no trigger options with 'items' property have been specified."
            );
        }
        if (!options["addto-featurelayer-id"] && !options["addto-featurelayer-url"]) {
            throw new Error(
                "AddFeaturesToLayerAction.trigger: " +
                    "Cannot execute AddFeaturesToLayerAction since neither id nor url property have been specified."
            );
        }

        if (!options.items.length) {
            return;
        }

        if (options["addto-featurelayer-id"]) {
            this.applyFeaturesToServiceWithId(options.items, options["addto-featurelayer-id"]);
        } else if (options["addto-featurelayer-url"]) {
            this.applyFeaturesToServiceWithUrl(options.items, options["addto-featurelayer-url"]);
        }
    }

    private applyFeaturesToServiceWithId(items: Array<any>, id: string): void {
        const layer = this.getLayerById(id);
        if (layer && layer.type === "feature") {
            const edits = {
                addFeatures: items
            };
            layer.applyEdits(edits);
        }
    }

    private applyFeaturesToServiceWithUrl(items: Array<any>, url: string): void {
        Layer.fromArcGISServerUrl(url).then(layer => {
            if (layer && layer.type === "feature") {
                const edits = {
                    addFeatures: items
                };
                layer.applyEdits(edits);

                this.getView().then(view => {
                    view.map.add(layer);
                });
            }
        });
    }

    /**
     * Returns one layer of the map
     *
     * @param layerIdPath
     * @private
     */
    private getLayerById(layerIdPath: string): __esri.Layer | __esri.Sublayer {
        if (typeof layerIdPath !== "string") {
            return undefined;
        }

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

    private getView(): Promise<__esri.View> {
        const mapWidgetModel = this._mapWidgetModel;

        return new Promise((resolve) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            } else {
                const watcher = mapWidgetModel.watch("view", ({ value: view }) => {
                    watcher.remove();
                    resolve(view);
                });
            }
        });
    }
}

