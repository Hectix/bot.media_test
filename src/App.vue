<template>
    <div id="app">
        <date-picker v-model="date" :highlight-today="true" :range="true" ref="picker" />
        <p>Date: {{ date }}</p>
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
            date: [new Date(1588978277000), new Date(1589578277000)]
        };
    },
};
</script>

<style>
    #app {
        width: 320px;
    }
</style>
