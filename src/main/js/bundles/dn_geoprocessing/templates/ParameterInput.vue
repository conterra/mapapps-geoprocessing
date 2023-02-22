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
    <div>
        <div
            v-if="type === 'feature-record-set-layer'"
            :rules="rules"
            :disabled="!editable"
            :readonly="!editable"
        >
            {{ title }}
            <v-layout
                row
                class="parameterInput__coordinate-entry-layout"
            >
                <v-text-field
                    v-model="localEasting"
                    :label="i18n.parameters.easting"
                    type="number"
                    class="parameterInput__coordinate-entry-text-field"
                />
                <v-text-field
                    v-model="localNorthing"
                    :label="i18n.parameters.northing"
                    type="number"
                    class="parameterInput__coordinate-entry-text-field"
                />
                <v-btn
                    icon
                    color="primary"
                    @click="$emit('getLocationButtonClicked')"
                >
                    <v-icon>
                        icon-map-locate
                    </v-icon>
                </v-btn>
            </v-layout>
        </div>
        <v-select
            v-else-if="choiceList"
            v-model="localValue"
            :label="title"
            :rules="rules"
            :items="choiceList"
            :disabled="!editable"
            :readonly="!editable"
        />
        <v-switch
            v-else-if="type === 'boolean'"
            v-model="localValue"
            :label="title"
            :disabled="!editable"
            :readonly="!editable"
            class="mt-0"
            hide-details
            color="primary"
        />
        <v-text-field
            v-else-if="type === 'long' || type === 'double'"
            v-model="localValue"
            :label="title"
            :rules="rules"
            :disabled="!editable"
            :readonly="!editable"
        />
        <v-textarea
            v-else-if="localValue.length>10"
            v-model="localValue"
            :label="title"
            :rules="rules"
            :disabled="!editable"
            :readonly="!editable"
        />
        <v-text-field
            v-else
            v-model="localValue"
            :label="title"
            :rules="rules"
            :disabled="!editable"
            :readonly="!editable"
            clearable
        />
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
            value: undefined,
            title: {
                type: String,
                default: ""
            },
            type: {
                type: String,
                default: ""
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
            easting: {
                type: Number,
                default: 0
            },
            northing: {
                type: Number,
                default: 0
            }
        },
        computed: {
            localValue: {
                get() {
                    if (this.isObject(this.value)) {
                        return JSON.stringify(this.value);
                    } else {
                        return this.value;
                    }
                },
                set(value) {
                    if (this.isJsonString(value)) {
                        value = JSON.parse(value);
                    }
                    this.$emit("input", value);
                }
            },
            localEasting: {
                get: function(){
                    return this.easting;
                },
                set: function(easting){
                    this.$emit("update:easting", parseFloat(easting));
                }
            },
            localNorthing: {
                get: function(){
                    return this.northing;
                },
                set: function(northing){
                    this.$emit("update:northing",  parseFloat(northing));
                }
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
            }
        }
    };
</script>
