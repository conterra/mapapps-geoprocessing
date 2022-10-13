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
    <v-container pa-0>
        <v-tabs
            v-model="activeTab"
            grow
            slider-color="primary"
        >

            <v-tab>
                {{ i18n.parametersTab }}
            </v-tab>
            <v-tab>
                {{ i18n.resultsTab }}
            </v-tab>

            <v-tab-item v-if="activeTab === 0">
                <div>
                    Editable Parameters for: {{ toolTitle }}
                </div>
                <div
                    v-for="(param) in editableParamsWithRules"
                    :key="param.key"
                >
                    <v-autocomplete
                        v-if="param.choiceList"
                        v-model="param.value"
                        :label="param.key"
                        :items="param.choiceList"
                    />
                    <v-text-field
                        v-if="param.range"
                        v-model="param.value"
                        :rules="param.rule"
                        :label="param.key"
                    />
                </div>
                <div>
                    <v-btn
                        @click="$emit('execute-button-clicked', editableParamsWithRules)"
                    >
                        Execute
                    </v-btn>
                </div>
            </v-tab-item>

            <v-tab-item v-if="activeTab === 1">
                <div v-if="loading">
                    <v-progress-circular
                        v-if="loading"
                        :indeterminate="true"
                        size="64"
                        width="6"
                        color="primary"
                    />
                </div>
                <div v-else>
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
                </div>

            </v-tab-item>

        </v-tabs>
    </v-container>
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
            activeTab: {
                type: Number,
                default: 0
            },
            loading: {
                type: Boolean,
                default: false
            },
            editableParams: {
                type: Array,
                default: () => []
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
            editableParamsWithRules: {
                get: function () {
                    this.editableParams.forEach(param => {
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
                    });
                    return this.editableParams;
                }
            }
        }
    };
</script>
