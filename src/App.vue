<template>
    <div id="app">
        <BotMediaTest :one="1" :two="2"/>
    </div>
</template>

<script>
import BotMediaTest from "./components/BotMediaTest.vue";

export default {
    name: "App",
    components: {
        BotMediaTest
    }
};
</script>
