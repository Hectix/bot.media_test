<template>
    <div id="app">
        <date-picker v-model="date" :highlight-today="true" :range="true" ref="picker" />
        <p><strong>Date:</strong> {{ date.toString() }}</p>
    </div>
</template>

<script>
import DatePicker from "./components/DatePicker.vue";

export default {
    name: "App",
    components: {
        DatePicker
    },
    data() {
        return {
            date: []
        };
    },
};
</script>

<style>
    #app {
        width: 320px;
    }
</style>
