<!--

    Copyright (C) 2022 con terra GmbH (info@conterra.de)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<template>
    <div
        :rules="rules"
        :disabled="!editable"
        :readonly="!editable"
    >
        <p class="mb-0">{{ title }}</p>
        <v-layout
            v-if="filter.list.includes('esriGeometryPoint')"
            row
            class="parameterInput__coordinate-entry-layout"
        >
            <v-text-field
                v-model="easting"
                :label="i18n.parameters.easting"
                :rules="rules"
                :disabled="!editable"
                :readonly="!editable"
                type="number"
                class="parameterInput__coordinate-entry-text-field"
            />
            <v-text-field
                v-model="northing"
                :label="i18n.parameters.northing"
                :rules="rules"
                :disabled="!editable"
                :readonly="!editable"
                type="number"
                class="parameterInput__coordinate-entry-text-field"
            />
            <v-btn
                icon
                color="primary"
                :disabled="!editable"
                :class="clickWatcherActive ? 'parameterInput__coordinate-entry-button--active' : ''"
                @click="handleLocationButtonClick"
            >
                <v-icon>
                    icon-map-locate
                </v-icon>
            </v-btn>
        </v-layout>
    </div>
</template>
<script>
    export default {
        props: {
            i18n: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            id: {
                type: String,
                default: undefined
            },
            value: {
                type: Object,
                default: undefined
            },
            title: {
                type: String,
                default: ""
            },
            type: {
                type: String,
                default: ""
            },
            filter: {
                type: Object,
                default: undefined
            },
            rules: {
                type: Array,
                default: () => []
            },
            choiceList: {
                type: Array,
                default: () => undefined
            },
            editable: {
                type: Boolean,
                default: false
            },
            clickWatcherActive: {
                type: Boolean,
                default: false
            }
        },
        data: function() {
            return {
                easting: undefined,
                northing: undefined
            };
        },
        computed: {
            localValue: {
                get() {
                    if (this.easting && this.northing) {
                        return {
                            "spatialReference" : {"wkid" : 4326},
                            "features" : [
                                {
                                    "geometry" : {
                                        "x" : this.easting,
                                        "y" : this.northing,
                                        "spatialReference" : {
                                            "wkid" : 4326
                                        }
                                    }
                                }
                            ]
                        };
                    } else {
                        return {};
                    }
                },
                set() {
                    this.$emit("input", this.localValue);
                }
            }
        },
        watch: {
            easting: function(value) {
                this.localValue = {
                    "spatialReference" : {"wkid" : 4326},
                    "features" : [
                        {
                            "geometry" : {
                                "x" : value,
                                "y" : this.northing,
                                "spatialReference" : {
                                    "wkid" : 4326
                                }
                            }
                        }
                    ]
                };
            },
            northing: function(value) {
                this.localValue = {
                    "spatialReference" : {"wkid" : 4326},
                    "features" : [
                        {
                            "geometry" : {
                                "x" : this.easting,
                                "y" : value,
                                "spatialReference" : {
                                    "wkid" : 4326
                                }
                            }
                        }
                    ]
                };
            },
            value: function(value) {
                const geometry = value.features[0].geometry;
                this.easting = geometry.x;
                this.northing = geometry.y;
            }
        },
        methods: {
            isObject: function (value) {
                return typeof value === 'object';
            },
            isJsonString(string) {
                try {
                    JSON.parse(string);
                } catch (e) {
                    return false;
                }
                const regex = new RegExp('\\{.*:\\{.*:.*}}', 'g');
                return regex.test(string);
            },
            handleLocationButtonClick: function() {
                this.$emit('getLocationButtonClicked', this.id, this.clickWatcherActive);
            }
        }
    };
</script>
