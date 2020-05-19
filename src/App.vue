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
            date: [new Date(1589278277000), new Date(1589378277000)]
        };
    },
};
</script>
