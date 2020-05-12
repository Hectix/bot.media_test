<template>
    <div ref="div">
        {{ result }}
    </div>
</template>

<script>
export default {
    name: "botMediaTest",
    props: {
        one: Number,
        two: Number,
    },
    methods: {
        increment(result) {
            return result + 1;
        },
    },
    computed: {
        result() {
            return this.increment(this.one + this.two);
        },
    },
};
</script>

<style lang="scss">
$red:   #a34640;
$white: #fff;

@mixin media-breakpoint-down($width) {
    @media (max-width: $width) {
        @content;
    }
}

body {
    margin: 0;
}

div {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-family: Helvetica, sans-serif;

    // Inspired by Bootstrap 4 media breakpoint mixins. Really love this approach.
    @include media-breakpoint-down(48em) {
        background-color: $red;
        color: $white;
    }
}
</style>
