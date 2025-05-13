<script>

export default {
  name: "language-switcher",

  data() {
    return {
      languages: ['en', 'es'],
      language: 'en'
    }
  },

  created() {
    console.log('Language Switcher component created');
  }
}
</script>

<template>

  <pv-select-button class="select-button" v-model="$i18n.locale" :options="languages">
    <template #option="slotProps" >
      {{ slotProps.option.toUpperCase() }}
    </template>
  </pv-select-button>

</template>

<style>

.select-button {
  width: 100px;
  height: 30px;
  background-color: #8B0000;
  color: #e5edf6;
  border-radius: 5px;
  border: none;
}

</style>