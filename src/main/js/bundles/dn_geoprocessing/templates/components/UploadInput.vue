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
                        prepend-icon="attach_file"
                        single-line
                        hide-details
                        class="pt-1"
                        readonly
                    />
                    <v-input
                        ref="file"
                        type="file"
                        style="display: none"
                        accept="*"
                        @change="onFilePicked"
                    />
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
                    @click="$emit('file-selected', file)"
                >
                    {{ i18n.start }}
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
            }
        },
        data() {
            return {
                fileName: "",
                fileUrl: "",
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
