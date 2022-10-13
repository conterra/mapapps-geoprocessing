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

            <v-stepper-items class="fill-height">
                <v-stepper-content step="1">
                    <div>
                        Editable Parameters for: {{ toolTitle }}
                    </div>
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
                    </div>
                    <div>
                        <v-btn
                            @click="execute"
                        >
                            Execute
                        </v-btn>
                    </div>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-progress-linear
                        v-if="loading"
                        :indeterminate="true"
                        size="64"
                        width="6"
                        color="primary"
                    />
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
                    <div
                        v-for="(entry, index) in gpServiceResponseMessages"
                        :key="index"
                    >
                        {{ entry.description }}
                    </div>
                    <div
                        v-for="(result, index) in gpServiceResponseResults"
                        :key="index"
                    >
                        {{ result }}
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
            toolTitle: {
                type: String,
                default: ""
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
            parametersWithRules: {
                get: function () {
                    return this.parameters.map(param => {
                        if (param.range) {
                            const lower = param.range.lowerLimit;
                            const upper = param.range.upperLimit;

                            param.rule =  [v => (v >= lower && v <= upper) || this.i18n.limitRuleText];

                            if (param.type === "double" || param.type === "long") {
                                const temp = param.rule[0];
                                param.rule[0] = v => {
                                    if (/^[0-9]*$/.test(v)) {
                                        // valid
                                        return true;
                                    } else {
                                        // invalid
                                        return this.i18n.NaNRuleText;
                                    }
                                };

                                param.rule[1] = temp;
                            }
                        } else {
                            param.rule = [];
                        }
                        return param;
                    });
                }
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
