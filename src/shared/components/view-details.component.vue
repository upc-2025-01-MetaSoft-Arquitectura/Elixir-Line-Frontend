<script>
const defaultStyle = { width: '800px'};

export default {
  name: "view-details",

  props: {
    entity: null,
    visible: Boolean,
    entityName: '',
    viewDetail: Boolean,
    size: 'default'
  },

  methods: {
    onCloseDetail() {
      this.$emit('close-shared');
    },

    getHeaderTitle() {
      return `Detalles ${this.entityName}`;
    },

    getDialogStyle() {
      let dialogStyle = defaultStyle;
      dialogStyle = this.size === 'standard' ? { width: '800px' } : defaultStyle;
      dialogStyle = this.size === 'large' ? { width: '900px' } : dialogStyle;
      return dialogStyle;
    }

  },

  created() {
    console.log('View Details Component Created');
  }
}

</script>

<template>

  <pv-dialog
      v-bind:visible="visible"
      :modal="true"
      :style="getDialogStyle()"
      class="p-fluid"
      :header="entityName"
      :closable="false">

    <!-- Header fijo -->
    <template #header>
      <div class="overflow-hidden">
        <slot name="header" />
      </div>
    </template>

    <!-- Quien use el componente establece el contenido -->
    <slot name="content"></slot>

    <template #footer>
      <div class="flex justify-content-end">
        <pv-button type="button" label="Close" severity="secondary" class="p-button-text" icon="pi pi-times"
                   @click="onCloseDetail"/>
      </div>
    </template>
  </pv-dialog>



</template>

<style>

</style>