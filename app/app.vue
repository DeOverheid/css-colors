<script setup>
useHead({
    meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" }
    ],
    link: [
        { rel: "icon", href: "/favicon.ico" }
    ],
    htmlAttrs: {
        lang: "en"
    }
});

const title = "CSS Color Palette Generator";
const description = "The power of Tailwind, but now in your hands.";

useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: "",
    twitterImage: "",
    twitterCard: "summary_large_image"
});
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
