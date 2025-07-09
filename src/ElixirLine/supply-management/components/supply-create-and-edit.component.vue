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
      imagePreview: null,
      allowedUnits: [
        { label: 'Kilogramos', value: 'KG' },
        { label: 'Mililitros', value: 'ML' },
        { label: 'Litros', value: 'LITRO' },
        { label: 'Unidades', value: 'UNIDAD' }
      ],
    }
  },

  mounted() {
    if (typeof this.itemEntity.image === 'string') {
      this.imagePreview = this.itemEntity.image;
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
      const file = event.originalEvent?.target?.files?.[0];
      if (file) {
        this.itemEntity.image = file;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }

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

        <!-- =============================================================== -->

        <!-- Imagen (manual, centrado estético) -->
          <div class="field mt-5 text-center">
            <!-- Botón de selección -->
            <div class="flex justify-center">
              <pv-file-upload
                  id="image"
                  mode="basic"
                  chooseLabel="Seleccionar imagen de insumo"
                  customUpload
                  accept="image/*"
                  @select="onImageSelected"
                  class="inline-block"
                  :aria-invalid="submitted && !itemEntity.image"
                  aria-describedby="image-error"
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
                    alt="Vista previa de imagen de insumo"
                    class="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

        <!-- =============================================================== -->


          <pv-float-label class="field mt-5">
            <label for="name">Nombre de insumo</label>
            <pv-input-text
                id="name"
                v-model="itemEntity.name"
                class="w-full"
                :aria-invalid="submitted && !itemEntity.name"
                aria-describedby="name-error"
                :class="{ 'p-invalid': submitted && !itemEntity.name }"
            />
          </pv-float-label>

          <pv-float-label class="field mt-5">
            <label for="description">Descripción</label>
            <pv-input-text
                id="description"
                v-model="itemEntity.description"
                class="w-full"
                :aria-invalid="submitted && !itemEntity.description"
                aria-describedby="description-error"
                :class="{ 'p-invalid': submitted && !itemEntity.description }"
            />
          </pv-float-label>

          <pv-float-label class="field mt-5">
            <label for="quantity">Cantidad</label>
            <pv-input-text
                id="quantity"
                v-model.number="itemEntity.quantity"
                class="w-full"
                :aria-invalid="submitted && !itemEntity.quantity"
                aria-describedby="quantity-error"
                :class="{ 'p-invalid': submitted && !itemEntity.quantity }"
            />
          </pv-float-label>

        <pv-float-label class="field mt-5">
          <label for="unit">Unidad</label>
          <pv-dropdown
              id="unit"
              v-model="itemEntity.unit"
              :options="allowedUnits"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona una unidad"
              class="w-full"
              :aria-invalid="submitted && !itemEntity.unit"
              aria-describedby="unit-error"
              :class="{ 'p-invalid': submitted && !itemEntity.unit }"
          />
        </pv-float-label>

        </div>

    </template>

  </create-and-edit>


</template>

<style >

/* Oculta el span donde aparece "No file chosen" en basic mode */
.p-fileupload-basic .p-fileupload-filename {
  display: none;
}


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