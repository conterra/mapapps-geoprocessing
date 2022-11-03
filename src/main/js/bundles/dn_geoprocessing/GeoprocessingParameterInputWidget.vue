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
                <v-divider></v-divider>
                <v-stepper-step
                    :complete="!loading"
                    step="2"
                >
                    {{ i18n.resultsTab }}
                </v-stepper-step>
            </v-stepper-header>
            <v-progress-linear
                v-if="loading"
                :indeterminate="true"
                color="primary"
            />
            <v-stepper-items class="fill-height">
                <v-stepper-content step="1">
                    <div class="subheading pb-2 geoprocessing--parameters-title">
                        {{ i18n.editableParameters }}
                    </div>
                    <div class="geoprocessing--parameters">
                        <div
                            v-for="(param) in parametersWithRules"
                            :key="param.name"
                        >
                            <v-autocomplete
                                v-if="param.choiceList"
                                v-model="param.value"
                                :label="param.name"
                                :items="param.choiceList"
                            />
                            <v-text-field
                                v-if="param.range"
                                v-model="param.value"
                                :rules="param.rule"
                                :label="param.name"
                            />
                            <v-text-field
                                v-if="!param.choiceList && !param.range"
                                v-model="param.value"
                                :label="param.name"
                                disabled
                            />
                        </div>
                    </div>
                    <div class="geoprocessing--execute">
                        <v-btn
                            class="ml-0"
                            color="primary"
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
                                <v-list-tile-title v-text="message.description"></v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
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
        computed: {
            supportContact: function() {
                return "mailto:" + this.supportEmailAddress;
            },
            parametersWithRules: function () {
                return this.parameters.map(param => {
                    if (param.range) {
                        const lower = param.range.lowerLimit;
                        const upper = param.range.upperLimit;

                        param.rule = [v => (v >= lower && v <= upper) || this.i18n.limitRuleText];

                        if (param.type === "double") {
                            const temp = param.rule[0];
                            param.rule[0] = v => {
                                if (/^[0-9.,]*$/.test(v)) {
                                    // valid
                                    return true;
                                } else {
                                    // invalid
                                    return this.i18n.NaNRuleText;
                                }
                            };

                            param.rule[1] = v => {
                                if (/^[0-9.]*$/.test(v)) {
                                    // valid
                                    return true;
                                } else {
                                    // invalid
                                    return this.i18n.pointSeparatedRuleText;
                                }
                            };

                            param.rule[2] = temp;
                        } else if (param.type === "long") {
                            const temp = param.rule[0];
                            param.rule[0] = v => {
                                if (/^[0-9.,]*$/.test(v)) {
                                    // valid
                                    return true;
                                } else {
                                    // invalid
                                    return this.i18n.NaNRuleText;
                                }
                            };

                            param.rule[1] = v => {
                                if (/^[0-9]*$/.test(v)) {
                                    // valid
                                    return true;
                                } else {
                                    // invalid
                                    return this.i18n.noDecimalsRuleText;
                                }
                            };

                            param.rule[2] = temp;
                        }
                    } else {
                        param.rule = [];
                    }
                    return param;
                });
            }
        },
        methods: {
            execute: function () {
                this.$emit('execute-button-clicked', this.parametersWithRules);
                this.activeStep = 2;
            }
        }
    };
</script>
