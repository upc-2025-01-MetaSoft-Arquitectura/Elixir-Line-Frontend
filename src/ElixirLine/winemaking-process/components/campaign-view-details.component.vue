<script>

import ViewDetails from "../../../shared/components/view-details.component.vue";

export default {
  name: 'campaign-view-details',
  components: {ViewDetails},

  props: {
    itemEntity: null,
    title: String,
    visible: Boolean
  },

  methods: {
    onClose() {
      this.$emit('close-view-details');
    }
  },

  created() {
    console.log('Campaign view details component created')
  }


}

</script>

<template>

  <view-details :entity="itemEntity" @close-shared="onClose" :visible="visible" >

    <template #header>

      <h3> {{title}} </h3>

    </template>





  </view-details>



</template>

<style scoped>

</style>