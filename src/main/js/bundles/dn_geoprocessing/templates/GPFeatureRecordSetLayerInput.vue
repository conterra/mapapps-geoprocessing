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
        <p class="mb-0">
            {{ title }}
        </p>
        <v-layout
            v-if="filter.list.includes('esriGeometryPoint')"
            row
            class="parameterInput__coordinate-entry-layout"
        >
            <v-text-field
                v-model="x"
                :label="i18n.parameters.x"
                :rules="rules"
                :disabled="!editable"
                :readonly="!editable"
                type="number"
                class="parameterInput__coordinate-entry-text-field"
            />
            <v-text-field
                v-model="y"
                :label="i18n.parameters.y"
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
            editable: {
                type: Boolean,
                default: false
            },
            clickWatcherActive: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            x: {
                get() {
                    if(this.value && this.value.features.length) {
                        return this.value.features[0].geometry.x;
                    } else {
                        return 0;
                    }
                },
                set(x) {
                    this.value.features[0].geometry.x = Number(x);
                }
            },
            y: {
                get() {
                    if(this.value && this.value.features.length) {
                        return this.value.features[0].geometry.y;
                    } else {
                        return 0;
                    }
                },
                set(y) {
                    this.value.features[0].geometry.y = Number(y);
                }
            }
        },
        methods: {
            handleLocationButtonClick: function() {
                this.$emit('getLocationButtonClicked', this.id, this.clickWatcherActive);
            }
        }
    };
</script>
