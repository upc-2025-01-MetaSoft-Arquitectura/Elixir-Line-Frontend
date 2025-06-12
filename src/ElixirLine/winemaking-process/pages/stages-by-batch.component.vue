<script>


import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";

export default {
  name: 'stages-by-batch',
  components: {BasePageLayout},

  props: {
    itemEntity: null,
    title: String,
    visible: Boolean
  },

  created() {
    console.log('Stages By Batch component created');
  }
}

</script>

<template>

  <base-page-layout>
    <template #header>
      <h4>{{title}}</h4>
    </template>

  </base-page-layout>

</template>

<style>

</style>