import type { ActionItem, ActionOptions } from "map-actions/api";

export interface AddFeaturesToLayerActionOptions extends ActionOptions {
    readonly "items": readonly ActionItem[];
    readonly "addto-featurelayer-id"?: string;
    readonly "addto-featurelayer-url"?: string;
}
