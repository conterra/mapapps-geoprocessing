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
    <v-container
        fill-height
        pa-0
    >
        <v-layout
            column
            fill-height
        >
            <v-flex>
                <v-select
                    v-model="selectedTool"
                    :items="tools"
                    hide-selected
                    item-value="id"
                    item-text="title"
                    :label="i18n.selectTool"
                    class="dn-geoprocessing--service-select"
                >
                </v-select>
                <v-btn
                    color="primary"
                    block
                    class="dn_geoprocessing--processingButton"
                    :disabled="!selectedTool"
                    @click="handleGeoprocessingButtonClick"
                >
                    {{ i18n.startGeoprocessing }}
                </v-btn>
                <v-progress-circular
                    v-if="loading"
                    :indeterminate="true"
                    size="32"
                    width="3"
                    color="primary"
                />
            </v-flex>
            <v-flex
                class="dn_geoprocessing--resultText">
                <div
                    v-if="resultState==='success'"
                >
                    {{ i18n.success }}
                </div>
                <div
                    v-if="resultState==='failure'"
                >
                    {{ i18n.failure }} <a :href="supportContact">{{ supportEmailAddress }}</a>!
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Bindable from "apprt-vue/mixins/Bindable";

    export default {
        mixins: [Bindable],
        props: {
            i18n: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            loading: {
                type: Boolean,
                default: false
            },
            resultState: {
                type: String,
                default: ""
            },
            supportEmailAddress: {
                type: String,
                default: ""
            },
            tools: {
                type: Array,
                default: () => []
            }
        },
        data: function () {
            return {
                selectedTool: undefined
            };
        },
        computed: {
            supportContact: function() {
                return "mailto:" + this.supportEmailAddress;
            }
        },
        methods: {
            handleGeoprocessingButtonClick() {
                this.$emit('start-geoprocessing', this.selectedTool);
            }
        }
    };
</script>
