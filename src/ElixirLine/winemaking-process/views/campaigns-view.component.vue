<script>

export default {
  name: 'campaigns-view',
  components: {
    // Import your components here
  },
  data() {
    return {
      title: { singular: 'Batch', plural: 'Batches' },
      batches: [],
      batch: new ({}),
      selectedBatches: [],
      batchApiService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
    }
  },

  computed: {
    buttons() {
      return [
        {
          titleKey: 'winemaking.button-option-1',
          icon: 'wine',
          component: 'batch-management',
        },
        {
          titleKey: 'winemaking.button-option-1',
          icon: 'fermentation',
          component: 'batch-management',
        },
      ];
    }
  },

  methods: {
    newItem() {
      this.$emit('new-item-requested-manager');
    },
  },


  created() {
    console.log("Campaigns view Component Created");
  }


}

</script>

<template>

<h1>HOLA MUNDO</h1>
  <h1>HOLA MUNDO</h1>

  <h1>HOLA MUNDO</h1>
  <h1>HOLA MUNDO</h1>
  <h1>HOLA MUNDO</h1>



</template>

<style scoped>

</style>