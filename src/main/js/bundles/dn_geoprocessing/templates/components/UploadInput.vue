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
<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
    <v-container
        fill-height
        pa-0
    >
        <v-layout
            column
            fill-height
        >
            <v-layout row>
                <v-flex grow>
                    <v-text-field
                        v-model="fileName"
                        :label="title"
                        :rules="rules"
                        :disabled="!editable"
                        prepend-icon="attach_file"
                        single-line
                        hide-details
                        class="pt-1"
                        readonly
                        @click="selectFile"
                    />
                    <input
                        ref="file"
                        type="file"
                        style="display: none"
                        accept="*"
                        @change="onFilePicked"
                    >
                </v-flex>
                <v-flex shrink>
                    <v-btn
                        class="mr-0"
                        color="secondary"
                        @click="selectFile"
                    >
                        {{ i18n.selectFile }}
                    </v-btn>
                </v-flex>
            </v-layout>
            <v-flex shrink>
                <v-btn
                    block
                    color="primary"
                    :disabled="!file"
                    @click="$emit('upload-file', {file: file, id: id})"
                >
                    {{ i18n.uploadFile }}
                </v-btn>
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
            id: {
                type: String,
                default: undefined
            },
            value: undefined,
            title: {
                type: String,
                default: ""
            },
            type: {
                type: String,
                default: ""
            },
            rules: {
                type: Array,
                default: () => []
            },
            editable: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                fileName: "",
                file: ""
            };
        },
        methods: {
            selectFile() {
                this.$refs.file.click();
            },
            onFilePicked(e) {
                const files = e.target.files;
                if (files[0] !== undefined) {
                    this.fileName = files[0].name;
                    if (this.fileName.lastIndexOf('.') <= 0) {
                        return;
                    }
                    this.file = files[0];
                } else {
                    this.fileName = "";
                    this.file = "";
                }
            }
        }
    };
</script>
