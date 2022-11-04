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
    <div class="fill-height">
        <v-stepper
            v-model="activeStep"
            class="fill-height"
        >
            <v-stepper-header>
                <v-stepper-step
                    :complete="activeStep > 1"
                    :editable="!loading"
                    step="1"
                >
                    {{ i18n.parametersTab }}
                </v-stepper-step>
                <v-divider />
                <v-stepper-step
                    :complete="!loading"
                    step="2"
                >
                    {{ i18n.resultsTab }}
                </v-stepper-step>
            </v-stepper-header>
            <v-progress-linear
                v-if="loading && gpServiceResponseMessages.length"
                indeterminate
                color="primary"
            />
            <v-stepper-items class="fill-height">
                <v-stepper-content step="1">
                    <div class="geoprocessing--parameters">
                        <v-form v-model="valid">
                            <div
                                v-for="(param) in parametersWithRules"
                                :key="param.name"
                            >
                                <v-select
                                    v-if="param.choiceList"
                                    v-model="param.value"
                                    :label="param.title"
                                    :rules="param.rules"
                                    :items="param.choiceList"
                                    :disabled="!param.editable"
                                    :readonly="!param.editable"
                                />
                                <v-switch
                                    v-if="param.type === 'boolean'"
                                    v-model="param.value"
                                    :label="param.title"
                                    :disabled="!param.editable"
                                    :readonly="!param.editable"
                                    color="primary"
                                ></v-switch>
                                <v-text-field
                                    v-else-if="param.type === 'long' || param.type === 'double'"
                                    v-model="param.value"
                                    :label="param.title"
                                    :rules="param.rules"
                                    :disabled="!param.editable"
                                    :readonly="!param.editable"
                                />
                                <v-textarea
                                    v-else-if="isObject(param.value)"
                                    :value="JSON.stringify(param.value)"
                                    :label="param.title"
                                    :rules="param.rules"
                                    :disabled="!param.editable"
                                    :readonly="!param.editable"
                                />
                                <v-text-field
                                    v-else
                                    v-model="param.value"
                                    :label="param.title"
                                    :rules="param.rules"
                                    :disabled="!param.editable"
                                    :readonly="!param.editable"
                                    clearable
                                />
                            </div>
                        </v-form>
                    </div>
                    <div class="geoprocessing--execute">
                        <v-btn
                            class="ml-0"
                            color="primary"
                            :disabled="!valid"
                            @click="execute"
                        >
                            {{ i18n.executeButtonLabel }}
                        </v-btn>
                    </div>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-list
                        v-if="gpServiceResponseMessages.length"
                        dense
                        class="geoprocessing--messages"
                    >
                        <v-list-tile
                            v-for="message in gpServiceResponseMessages"
                            :key="message.id"
                        >
                            <v-list-tile-action>
                                <v-icon
                                    v-if="message.type==='error'"
                                    color="red"
                                >
                                    error
                                </v-icon>
                                <v-icon
                                    v-else-if="message.type==='warning'"
                                    color="yellow"
                                >
                                    warning
                                </v-icon>
                                <v-icon
                                    v-else
                                    color="grey"
                                >
                                    info
                                </v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title v-text="message.description"/>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    <div
                        v-else-if="loading"
                        class="text-xs-center"
                    >
                        <v-progress-circular
                            :size="50"
                            color="primary"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                    <div class="geoprocessing--alert">
                        <v-alert
                            v-if="resultState==='success'"
                            :value="true"
                            type="success"
                        >
                            {{ i18n.success }}
                        </v-alert>
                        <v-alert
                            v-if="resultState==='error'"
                            :value="true"
                            type="error"
                        >
                            {{ i18n.error }} <a :href="supportContact">{{ supportEmailAddress }}</a>!
                        </v-alert>
                    </div>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
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
            activeStep: {
                type: Number,
                default: 0
            },
            loading: {
                type: Boolean,
                default: false
            },
            parameters: {
                type: Array,
                default: () => []
            },
            resultState: {
                type: String,
                default: ""
            },
            supportEmailAddress: {
                type: String,
                default: ""
            },
            gpServiceResponseMessages: {
                type: Array,
                default: () => []
            },
            gpServiceResponseResults: {
                type: Array,
                default: () => []
            }
        },
        data: function() {
            return {
                valid: false
            };
        },
        computed: {
            supportContact: function() {
                return "mailto:" + this.supportEmailAddress;
            },
            parametersWithRules: function () {
                return this.parameters.map(param => {
                    param.rules = [];
                    if (param.required) {
                        param.rules.push(v => !!v || this.i18n.rules.required);
                    }
                    if (param.range) {
                        const min = param.range.min;
                        const max = param.range.max;
                        param.rules.push(v => (v >= min && v <= max) || this.i18n.rules.range);
                    }
                    if (param.type === "long" || param.type === "double") {
                        param.rules.push(v => /^[0-9.,]*$/.test(v) || this.i18n.rules.NaN);
                    }
                    if (param.type === "long") {
                        param.rules.push(v => /^[0-9]*$/.test(v) || this.i18n.rules.noLong);
                    }
                    if (param.type === "double") {
                        param.rules.push(v => /^[0-9.]*$/.test(v) || this.i18n.rules.noDouble);
                    }
                    return param;
                });
            }
        },
        methods: {
            isObject: function (value) {
                return typeof value==='object';
            },
            execute: function () {
                this.$emit('execute-button-clicked', this.parametersWithRules);
                this.activeStep = 2;
            }
        }
    };
</script>
