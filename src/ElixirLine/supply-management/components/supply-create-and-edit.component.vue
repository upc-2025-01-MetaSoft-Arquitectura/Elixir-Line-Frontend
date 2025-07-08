<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: "supply-create-and-edit",

  components: {CreateAndEdit},


  props: {
    itemEntity: null,
    visible: Boolean
  },

  data() {
    return {
      submitted: false,
      imagePreview: null
    }
  },

  methods: {

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested() {
      this.submitted = true;
      this.$emit('save-requested', this.itemEntity);
    },

    onImageSelected(event) {
      const file = event.files[0]; // archivo seleccionado

      if (file) {
        // Guardar el archivo en itemEntity.image
        this.itemEntity.image = file;

        // Generar vista previa (base64)
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },


  },

  created() {
    console.log('Supply Create and Edit Dialog component created');
  }



}
</script>

<template>

  <create-and-edit :entity="itemEntity" :visible="visible" entity-name="Supply"
                   @canceled-shared="onCancelRequested" @saved-shared="onSaveRequested">

    <!--Definimos el contenido del diálogo de creación y edición de lotes en el slot content del componente -->



    <!--CreateAndEdit-->
    <template #content>

      <div class="field">

        <!-- Imagen (manual, centrado estético) -->
        <div class="field mt-5 text-center">
          <label for="image" class="block text-sm font-semibold text-gray-700 mb-2 text-left">Imagen de Insumo</label>
          <!-- Botón de selección -->
          <div class="flex justify-center">
            <pv-file-upload
                mode="basic"
                chooseLabel="Seleccionar imagen"
                customUpload
                @select="onImageSelected"
                class="inline-block"
                :class="{ 'p-invalid': submitted && !itemEntity.image }"
            />
          </div>

          <!-- Vista previa centrada -->
          <div v-if="imagePreview" class="mt-4 flex justify-center">
            <div
                class="w-[150px] h-[150px] flex items-center justify-center rounded-full border border-gray-300 shadow-md overflow-hidden"
            >
              <img
                  :src="imagePreview"
                  alt="Vista previa"
                  class="object-cover"
                  style="width: 100%; height: 100%;"
              />
            </div>
          </div>


          <!-- Mensaje de error -->
          <small v-if="submitted && !itemEntity.image" class="p-error mt-2 block text-left">La imagen es requerida.</small>
        </div>



        <pv-float-label class="field mt-5">
          <label for="name">Nombre de insumo</label>
          <pv-input-text
              class="w-full"
              id="name"
              v-model="itemEntity.name"
              :class="{ 'p-invalid': submitted && !itemEntity.name }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="description">Descripción</label>
          <pv-input-text
              class="w-full"
              id="description"
              v-model="itemEntity.description"
              :class="{ 'p-invalid': submitted && !itemEntity.description }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="quantity">Cantidad</label>
          <pv-input-text
              class="w-full"
              id="quantity"
              v-model.number="itemEntity.quantity"
              :class="{ 'p-invalid': submitted && !itemEntity.quantity }"
          />
        </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="unit">Unidad</label>
          <pv-input-text
              class="w-full"
              id="unit"
              v-model="itemEntity.unit"
              :class="{ 'p-invalid': submitted && !itemEntity.unit }"
          />
        </pv-float-label>


      </div>


    </template>

  </create-and-edit>


</template>

<style >


.p-datatable-column-header-content {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;

}

.p-datatable-header-cell {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
}


.p-datatable-header-cell {
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.p-datatable-tbody > tr > td {
  font-size: 0.8rem;
  font-weight: 400;
}

</style>