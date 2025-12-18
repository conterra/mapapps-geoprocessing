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
    <div>
        <v-select
            v-if="choiceList && type === 'string'"
            v-model="localValue"
            :label="title"
            :rules="rules"
            :items="choiceList"
            :disabled="!editable"
            :readonly="!editable"
        />
        <v-switch
            v-else-if="type === 'boolean'"
            v-model="localValue"
            :label="title"
            :disabled="!editable"
            :readonly="!editable"
            class="mt-0"
            hide-details
            color="primary"
        />
        <v-textarea
            v-else-if="localValue && localValue.length>10 && type === 'string'"
            v-model="localValue"
            :label="title"
            :rules="rules"
            :disabled="!editable"
            :readonly="!editable"
        />
        <v-text-field
            v-else-if="type === 'long' || type === 'double' || type === 'string'"
            v-model="localValue"
            :label="title"
            :rules="rules"
            :disabled="!editable"
            :readonly="!editable"
        />
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
            choiceList: {
                type: Array,
                default: () => undefined
            },
            editable: {
                type: Boolean,
                default: false
            },
            required: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            rules: function() {
                const rules = [];
                if (this.required) {
                    rules.push(v => !!v || this.i18n.rules.required);
                }
                if (this.range) {
                    const min = this.range.min;
                    const max = this.range.max;
                    rules.push(v => (v >= min && v <= max) || this.i18n.rules.range);
                }
                if (this.type === "long" || this.type === "double") {
                    rules.push(v => /^[0-9.,]*$/.test(v) || this.i18n.rules.NaN);
                }
                if (this.type === "long") {
                    rules.push(v => /^[0-9]*$/.test(v) || this.i18n.rules.noLong);
                }
                if (this.type === "double") {
                    rules.push(v => /^[0-9.]*$/.test(v) || this.i18n.rules.noDouble);
                }
                return rules;
            },
            localValue: {
                get() {
                    if (this.isObject(this.value)) {
                        return JSON.stringify(this.value);
                    } else {
                        return this.value;
                    }
                },
                set(value) {
                    if (this.isJsonString(value)) {
                        value = JSON.parse(value);
                    }
                    this.$emit("input", value);
                }
            }
        },
        methods: {
            isObject: function (value) {
                return typeof value === 'object';
            },
            isJsonString(string) {
                try {
                    JSON.parse(string);
                /* eslint-disable-next-line no-unused-vars */
                } catch (e) {
                    return false;
                }
                const regex = new RegExp('\\{.*:\\{.*:.*}}', 'g');
                return regex.test(string);
            }
        }
    };
</script>
