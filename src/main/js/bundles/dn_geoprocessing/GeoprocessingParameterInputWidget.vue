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
                <v-text-field
                    v-for="(param, index) in editableParameterArray"
                    :key="param[0]"
                    v-model="editableParameterArray[index]"
                    :label="param[0]"
                    :value="param[1].defaultValue"
                />
                <p
                    v-for="(param) in editableParameterArray">
                    {{ param[1].defaultValue }}
                </p>
            </v-flex>
            <v-flex>
                <v-btn
                    @click="$emit('execute-button-clicked', editableParameterArray)"
                >
                    Execute
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data: function () {
            return {
                editableParameterArray: []
            };
        }
    };
</script>
