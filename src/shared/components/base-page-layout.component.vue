<script>

export default {
  name: "base-page-layout",
  components: {},

  created() {
    console.log("Base Page Layout created");
  }
};

</script>
<template>



  <div class="base-page-layout flex flex-column h-full w-full overflow-hidden">


    <div class="layout-header border-bottom-1 border-300">
      <slot name="header" />
    </div>


    <div class="layout-body flex-1 overflow-hidden flex flex-column">
      <slot />
    </div>

  </div>



</template>

<style scoped>
.base-page-layout {
  height: 100%;
}
</style>