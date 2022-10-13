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

import {Mutable, properties} from "apprt-core/Mutable";
import type {Mutable as MutableType} from "@conterra/ct-mapapps-typings/apprt-core/Mutable";

function defineProperties<Impl, P>(mutableDefinition: any, mutableProperties: { supportEmailAddress: string; gpServiceResponseMessages: string[];
    gpServiceResponseResults: string[]; addTool(tool): void; removeTool(tool): void; resultState: string; loading: boolean; tools: any[]; editableParams: object[] }): Impl & Mutable<P> {
    properties(mutableDefinition, mutableProperties);
    return mutableDefinition;
}

class GeoprocessingModel extends Mutable {
}

interface GeoprocessingModelProps {
    loading: boolean,
    resultState: string,
    supportEmailAddress: string,
    tools: object[],

    gpServiceResponseMessages: string[],
    gpServiceResponseResults: string[],

    addTool(): void
    removeTool(): void
}

export default defineProperties<GeoprocessingModel, GeoprocessingModelProps>(GeoprocessingModel,
    {
        loading: false,
        resultState: "false",
        supportEmailAddress: "false",
        tools: [],
        editableParams: [],

        gpServiceResponseMessages: [],
        gpServiceResponseResults: [],

        addTool(tool): void {
            const id = tool?.id;
            if (!id) {
                console.debug("Tool has no id and will be ignored!");
                return;
            }
            const newTools = this.tools.slice(0);
            const index = newTools.findIndex((t) => t.id === id);
            if (index >= 0) {
                console.warn(`Tool with id '${id}' was already registered! It is replaced by the new tool.`);
                newTools.splice(index, 1);
            }
            newTools.push({
                id: id,
                title: tool.title || id,
                description: tool.description || ""
            });
            this.tools = newTools;
        },

        removeTool(tool): void {
            const id = tool?.id;
            if (!id) {
                return;
            }
            const tools = this.tools;
            const index = tools.findIndex((t) => t.id === id);
            if (index < 0) {
                return;
            }
            const newTools = tools.slice(0);
            newTools.splice(index, 1);
            this.tools = newTools;
        }

    });
