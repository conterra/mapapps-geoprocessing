<!--

    Copyright (C) 2025 con terra GmbH (info@conterra.de)

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
                    hide-details
                    clearable
                    item-value="id"
                    item-text="title"
                    :label="i18n.selectTool"
                />
                <v-btn
                    color="primary"
                    block
                    :disabled="!selectedTool"
                    :loading="loading"
                    @click="handleGeoprocessingButtonClick"
                >
                    {{ i18n.startGeoprocessing }}
                </v-btn>
            </v-flex>
            <v-flex>
                <v-alert
                    v-if="resultState==='success'"
                    :value="true"
                    role="alert"
                    type="success"
                >
                    {{ i18n.success }}
                </v-alert>
                <v-alert
                    v-if="resultState==='error'"
                    :value="true"
                    role="alert"
                    type="error"
                >
                    {{ i18n.error }} <a :href="supportContact">{{ supportEmailAddress }}</a>!
                </v-alert>
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
