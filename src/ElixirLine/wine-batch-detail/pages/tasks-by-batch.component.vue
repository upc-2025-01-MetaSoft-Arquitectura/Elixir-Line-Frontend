<script>

import BasePageLayout from "../../../shared/components/base-page-layout.component.vue";

export default {
  name: 'tasks-by-batch',
  components: {BasePageLayout},

  props: {
    itemEntity: null,
    title: String,
    visible: Boolean
  },

  created() {
    console.log('Supplies By Batch component created');
  }
}

</script>

<template>

  <base-page-layout>
    <template #header>
      <h4>{{title}}</h4>
    </template>

    TASKS

  </base-page-layout>

</template>

<style>

</style>