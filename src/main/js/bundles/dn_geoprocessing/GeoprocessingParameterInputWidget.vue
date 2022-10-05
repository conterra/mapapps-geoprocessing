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
                Editable Parameters for:
            </v-flex>
            <v-flex>
                Required Parameters:
                <v-card>
                    <v-text-field
                        v-for="(param, index) in requiredEditableParameters"
                        :key="param.key"
                        v-model="requiredEditableParameters[index].value"
                        :label="param.key"
                        :value="requiredEditableParameters[index].defaultValue"
                    />
                </v-card>
            </v-flex>
            <v-flex>
                Optional Parameters:
                <v-card>
                    <v-text-field
                        v-for="(param, index) in optionalRequiredParameters"
                        :key="param.key"
                        v-model="optionalRequiredParameters[index].value"
                        :label="param.key"
                        :value="optionalRequiredParameters[index].defaultValue"
                    />
                </v-card>
            </v-flex>
            <v-flex>
                <v-btn
                    @click="$emit('execute-button-clicked', {req: requiredEditableParameters, opt: optionalRequiredParameters})"
                >
                    Execute
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        props: {
            requiredEditableParameters: {
                type: Array,
                default: () => []
            },
            optionalRequiredParameters: {
                type: Array,
                default: () => []
            }
        }
    };
</script>
