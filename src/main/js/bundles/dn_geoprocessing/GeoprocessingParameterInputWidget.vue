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
                v-if="loading && responseMessages.length"
                indeterminate
                color="primary"
            />
            <v-stepper-items class="fill-height">
                <v-stepper-content step="1">
                    <div class="geoprocessing--parameters">
                        <v-form v-model="valid">
                            <div
                                v-for="(param) in parametersWithRules"
                                :key="param.id"
                                v-if="shouldBeVisible(param)"
                            >
                                <div v-if="param.type === 'feature-record-set-layer'">
                                    <feature-record-set-layer
                                        :id="param.id"
                                        v-model="param.value"
                                        :title="param.title"
                                        :type="param.type"
                                        :rules="param.rules"
                                        :choice-list="param.choiceList"
                                        :editable="param.editable"
                                        :click-watcher-active="param.id === activeClickWatcherId"
                                        :i18n="i18n"
                                        @getLocationButtonClicked="handleLocationButtonClick"
                                    />
                                </div>
                                <div v-else-if="param.type === 'linear-unit'">
                                    <linear-unit
                                        :id="param.id"
                                        v-model="param.value"
                                        :title="param.title"
                                        :type="param.type"
                                        :rules="param.rules"
                                        :choice-list="param.choiceList"
                                        :editable="param.editable"
                                        :i18n="i18n"
                                    />
                                </div>
                                <div v-else>
                                    <base-parameter-input
                                        :id="param.id"
                                        v-model="param.value"
                                        :title="param.title"
                                        :type="param.type"
                                        :rules="param.rules"
                                        :choice-list="param.choiceList"
                                        :editable="param.editable"
                                        :i18n="i18n"
                                    />
                                </div>
                            </div>
                        </v-form>
                    </div>
                    <div class="geoprocessing--execute">
                        <v-btn
                            color="primary"
                            :disabled="!valid"
                            block
                            @click="execute"
                        >
                            {{ i18n.executeButtonLabel }}
                        </v-btn>
                    </div>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <div
                        v-if="responseMessages.length"
                        class="geoprocessing--messages"
                    >
                        <div
                            v-for="message in responseMessages"
                            :key="message.id"
                            class="ct-flex-container ct-flex-container--row"
                        >
                            <div class="ct-flex-item ct-flex-item--no-grow ct-flex-item--no-shrink">
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
                            </div>
                            <div class="message ct-flex-item">
                                {{ message.description }}
                            </div>
                        </div>
                    </div>
                    <div
                        v-else-if="loading"
                        class="text-xs-center"
                    >
                        <v-progress-circular
                            :size="50"
                            color="primary"
                            indeterminate
                        />
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
                    <div
                        v-if="results.length"
                        class="geoprocessing--results"
                    >
                        <div
                            v-for="result in results"
                            :key="result.name"
                        >
                            <div v-if="result.dataType==='string'">
                                <v-textarea
                                    :value="JSON.stringify(result.value)"
                                    :label="i18n.result"
                                    readonly
                                />
                            </div>
                            <div v-if="result.dataType==='data-file'">
                                <v-btn
                                    color="primary"
                                    block
                                    :href="result.value.url"
                                    target="_blank"
                                >
                                    {{ i18n.downloadResult }}
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>
    import BaseParameterInput from "./templates/BaseParameterInput.vue";
    import GPFeatureRecordSetLayerInput from "./templates/GPFeatureRecordSetLayerInput.vue";
    import GPLinearUnit from "./templates/GPLinearUnit.vue";


    export default {
        components: {
            "base-parameter-input": BaseParameterInput,
            "feature-record-set-layer": GPFeatureRecordSetLayerInput,
            "linear-unit": GPLinearUnit
        },
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
            responseMessages: {
                type: Array,
                default: () => []
            },
            results: {
                type: Array,
                default: () => []
            }
        },
        data: function() {
            return {
                valid: false,
                activeClickWatcherId: null
            };
        },
        computed: {
            supportContact: function() {
                return "mailto:" + this.supportEmailAddress;
            },
            parametersWithRules: function () {
                return this.parameters.map((param, index) => {
                    param.rules = [];
                    //if punkt -> x und y hinzufügen , die dann als model
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

                    param.id = `GEOPROCESS_PARAM_${index}`;
                    return param;
                });
            }
        },
        methods: {
            execute: function () {
                this.$emit('execute-button-clicked', this.parametersWithRules);
                this.activeStep = 2;
            },
            handleLocationButtonClick: function (id, clickWatcherActive) {
                if (clickWatcherActive) {
                    this.$emit('getLocationButtonClicked', id, false);
                    this.activeClickWatcherId = null;
                } else {
                    this.$emit('getLocationButtonClicked', id, false);
                    this.$emit('getLocationButtonClicked', id, true);
                    this.activeClickWatcherId = id;
                }

            },
            shouldBeVisible: function (param) {
                if(param.visible === undefined) {
                    return true;
                } else {
                    return param.visible;
                }
            }
        }
    };
</script>
