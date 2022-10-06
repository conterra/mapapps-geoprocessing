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
    <v-container>
        <v-layout column>
            <v-flex>
                {{ editableParamsWithRules }}
                Editable Parameters for: {{ toolTitle }}
            </v-flex>
            <v-flex v-if="editableParams.length > 0">
                <v-text-field
                    v-for="(param, index) in editableParams"
                    :key="param.key"
                    v-model="editableParams[index].value"
                    :rules="editableParams[index].rule"
                    :label="param.key"
                    :value="editableParams[index].defaultValue"
                />
            </v-flex>

            <v-flex>
                <v-btn
                    @click="$emit('execute-button-clicked', editableParams)"
                >
                    Execute
                </v-btn>
            </v-flex>

            <v-flex>
                <div
                    v-for="message in gpServiceResponseMessages"
                    :key="message.description"
                >
                    {{ message.description }}
                </div>
                <div
                    v-for="result in gpServiceResponseResults"
                    :key="result"
                >
                    {{ result }}
                </div>
            </v-flex>

        </v-layout>
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

                            // switch(param.type) {
                            //     case "double":
                            //         const temp = param.rule[0];
                            //         debugger
                            //         param.rule[0].concat(v => {
                            //             if (/^[0-9]*$/.test(v)) {
                            //                 // valid
                            //                 return true;
                            //             } else {
                            //                 // invalid
                            //                 return this.i18n.ui.NaNRuleText;
                            //             }
                            //         });
                            //         break;
                            //     case "long":
                            //         break;
                            //     default:
                            //         break;
                            // }
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
