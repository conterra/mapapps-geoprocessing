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
 * Copyright (C) con terra GmbH
 */
import { CancelablePromise } from "apprt-core/CancelablePromise";
import type { MapWidgetModel } from "map-widget/api";
import { createViewReadyWatcher, ViewReadyWatcher } from "map-widget/ViewReadyWatcher";
import { Action, ActionItem, ActionOptions } from "map-actions/api";
import Layer from "esri/layers/Layer";
import { InjectedReference } from "@conterra/ct-mapapps-typings/apprt-core/InjectedReference";

interface AddFeaturesToLayerActionOptions extends ActionOptions {
    readonly "items": readonly ActionItem[];
    readonly "addToFeatureLayerId"?: string;
    readonly "addToFeatureLayerUrl"?: string;
}

/**
 * Action for adding gp service result features to a layer using id or url.
 */
export class AddFeaturesToLayerAction implements Action {
    readonly id = "addfeaturestolayer";

    private _mapWidgetModel: InjectedReference<MapWidgetModel>;

    #viewWatcher: ViewReadyWatcher | undefined;
    #pending: CancelablePromise<void> | undefined;

    set mapWidgetModel(model: MapWidgetModel | undefined) {
        this.#pending?.cancel();
        this.#pending = undefined;
        this.#viewWatcher?.destroy();
        this.#viewWatcher = model ? createViewReadyWatcher(model) : undefined;
    }

    /**
     * Sets the view to the geometry of the first item in the options' `items` property.
     */
    async trigger(options?: AddFeaturesToLayerActionOptions): Promise<void> {
        this.#viewWatcher?.clear();
        this.#pending?.cancel();
        this.#pending = undefined;

        if (!options || !options.items) {
            throw new Error(
                "AddFeaturesToLayerAction.trigger: " +
                    "Cannot execute AddFeaturesToLayerAction since no trigger options with 'items' property have been specified."
            );
        }

        if (!options.items.length) {
            return;
        }

        if(options.addToFeatureLayerId) {
            this.applyFeaturesToServiceWithId(options.items, options.addToFeatureLayerId);
        } else if (options.addToFeatureLayerUrl) {
            this.applyFeaturesToServiceWithUrl(options.items, options.addToFeatureLayerUrl);
        }

        // const geometries = options.items.map((item) => findGeometry(item)).filter((geom) => !!geom) as Geometry[];
        // if (!geometries || !geometries.length) {
        //     throw new Error("ZoomToAction.trigger: Unable to zoom to items since no geometries were found.");
        // }

        // let zoomScale = options["zoomto-scale"] || 0;
        // let zoomGeometry: Geometry;
        // if (geometries.length > 1) {
        //     const calculatedExtent = calcExtent(geometries);
        //     if (!calculatedExtent) {
        //         throw new Error("ZoomToAction.trigger: Unable to zoom to items since no geometries were found.");
        //     }
        //     zoomGeometry = calculatedExtent;
        // } else {
        //     // zoom to a single/first geometry
        //     zoomGeometry = geometries[0]!;
        //     if (zoomGeometry.type === "point") {
        //         zoomScale = options["zoomto-point-scale"] || zoomScale;
        //     }
        // }

        // const extentExpansionFactor = options["zoomto-extent-expansion-factor"] || 1;
        // if (zoomGeometry.extent && extentExpansionFactor !== 1) {
        //     zoomGeometry = zoomGeometry.extent.clone().expand(extentExpansionFactor);
        // }

        // const animationOptions = options["zoomto-animation-options"];
        // const goToTarget: GoToTarget = {
        //     target: zoomGeometry
        // };
        // if (zoomScale > 0) {
        //     goToTarget.scale = zoomScale;
        // }

        // this.#pending = new CancelablePromise<void>((resolve, reject, oncancel) => {
        //     oncancel(() => this.#viewWatcher?.clear());
        //     this.#viewWatcher!.addOnly(async ({ mapWidgetModel }: { mapWidgetModel: any }) => {
        //         try {
        //             await mapWidgetModel?.view?.goTo(goToTarget, animationOptions);
        //             resolve();
        //         } catch (e) {
        //             reject(e);
        //         }
        //     });
        // });
        // return this.#pending;
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

export default AddFeaturesToLayerAction;
