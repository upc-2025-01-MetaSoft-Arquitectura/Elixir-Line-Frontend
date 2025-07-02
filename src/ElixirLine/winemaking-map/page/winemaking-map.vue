<script setup>
// @ts-ignore
// eslint-disable-next-line
/* global google */
import {onMounted, ref, nextTick, reactive, watch} from 'vue';
import { MapApiService } from '../services/maps-service';
import { defineExpose } from 'vue';
import DialogComponent from '../component/dialog-component.vue';

const mapElement = ref(null);
const map = ref(null);
const drawingManager = ref(null);
const mapService = new MapApiService();
const drawnShapes = ref([]);
const dialogRef = ref(null);
let lastPolygonPath = null; // Guarda el path del último polígono dibujado
const iconOverlay = ref({
  visible: false,
  style: {},
  polygon: null
});
const searchQuery = ref('');
const searchResults = ref([]);
const foundCity = ref('');
const autocompleteInput = ref(null);
let autocomplete = null;
const editingField = ref(null); // Lote en edición
const editSidebarVisible = ref(false);
const editedField = reactive({}); // Copia editable
function loadGoogleMapsScript() {
  return new Promise((resolve) => {
    if (window.google?.maps?.drawing) return resolve();
    if (document.getElementById('gmap-script')) {
      // Espera a que la librería esté disponible si el script ya existe
      const checkDrawing = setInterval(() => {
        if (window.google?.maps?.drawing) {
          clearInterval(checkDrawing);
          resolve();
        }
      }, 100);
      return;
    }
    const script = document.createElement('script');
    script.id = 'gmap-script';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCsxsmtiisizWV5jTPgMmR0mQvOrnfA7J4&libraries=drawing,places';
    script.async = true;
    script.onload = () => {
      const checkDrawing = setInterval(() => {
        if (window.google?.maps?.drawing) {
          clearInterval(checkDrawing);
          resolve();
        }
      }, 100);
    };
    document.head.appendChild(script);
  });
}

onMounted(async () => {
  await loadGoogleMapsScript();
  await nextTick();
  initMap();

  // Inicializa Autocomplete sobre el input
  autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteInput.value,
      {
        types: ['(cities)'],
        fields: ['geometry', 'formatted_address', 'name']
      }
  );
  autocomplete.addListener('place_changed', onPlaceChanged);
});
async function loadSavedFields() {
  try {
    const response = await mapService.getAllFields();
    response.data.forEach(field => {
      if (field.type === 'polygon' && Array.isArray(field.path)) {
        const polygon = new window.google.maps.Polygon({
          paths: field.path,
          fillColor: '#2196f3',
          fillOpacity: 0.3,
          strokeWeight: 2,
          clickable: true,
          editable: false,
          zIndex: 1,
          map: map.value
        });
        polygon.addListener('click', (event) => showIconsOverlay(event, polygon, field.label)); // para loadSavedFields

        drawnShapes.value.push(polygon);
      }
    });
  } catch (e) {
    alert('Error al cargar los campos guardados');
  }
}
async function onSearch() {
  if (!searchQuery.value) return;
  // Geocodifica la ciudad
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery.value)}&key=AIzaSyCsxsmtiisizWV5jTPgMmR0mQvOrnfA7J4`;
  const res = await fetch(geocodeUrl);
  const data = await res.json();
  console.log(data); // <-- Agrega esto para ver la respuesta
  if (!data.results.length) {
    searchResults.value = [];
    foundCity.value = '';
    alert('Ciudad no encontrada');
    return;
  }
  const cityLocation = data.results[0].geometry.location;
  foundCity.value = data.results[0].formatted_address;

  // Obtén los lotes y filtra los que estén cerca (por ejemplo, a 20km)
  const fields = await mapService.getAllFields();
  searchResults.value = fields.data.filter(field => {
    if (!field.path?.length) return false;
    // Calcula la distancia del primer punto del polígono a la ciudad
    const lat = field.path[0].lat;
    const lng = field.path[0].lng;
    return getDistanceFromLatLonInKm(lat, lng, cityLocation.lat, cityLocation.lng) < 20;
  });

  // Centra el mapa en la ciudad
  map.value.setCenter(cityLocation);
  map.value.setZoom(12);
}
// Utilidad para calcular distancia entre dos puntos
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
function initMap() {
  map.value = new window.google.maps.Map(mapElement.value, {
    center: { lat: -9.189967, lng: -75.015152 },
    zoom: 8,
  });
  loadSavedFields();
}

function enableDrawing() {
  if (!window.google?.maps?.drawing) {
    alert('La librería de dibujo de Google Maps no se ha cargado.');
    return;
  }
  if (drawingManager.value) {
    drawingManager.value.setMap(null);
  }
  drawingManager.value = new window.google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: true,
    drawingControlOptions: {
      position: window.google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        window.google.maps.drawing.OverlayType.POLYGON,
      ],
    },
    polygonOptions: {
      fillColor: '#2196f3',
      fillOpacity: 0.3,
      strokeWeight: 2,
      clickable: true,
      editable: true,
      zIndex: 1,
    },
  });
  drawingManager.value.setMap(map.value);

  window.google.maps.event.addListener(drawingManager.value, 'overlaycomplete', async function(event) {
    if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
      lastPolygonPath = event.overlay.getPath().getArray().map(latlng => ({
        lat: latlng.lat(),
        lng: latlng.lng()
      }));
      dialogRef.value.open(); // Abre el diálogo
    }
  });
}
// Maneja el evento confirm del diálogo
async function onDialogConfirm({ label, wineBatchId }) {
  try {
    const response = await mapService.createField({
      type: 'polygon',
      path: lastPolygonPath,
      label,
      wineBatchId
    });
    // Dibuja el polígono en el mapa
    const polygon = new window.google.maps.Polygon({
      paths: lastPolygonPath,
      fillColor: '#2196f3',
      fillOpacity: 0.3,
      strokeWeight: 2,
      clickable: true,
      editable: false,
      zIndex: 1,
      map: map.value
    });
    polygon.addListener('click', (event) => showIconsOverlay(event, polygon, label)); // para onDialogConfirm
    drawnShapes.value.push(polygon);
    alert('Campo guardado correctamente');
  } catch (e) {
    alert('Error al guardar el campo');
  }
}
// Modifica showIconsOverlay para aceptar el label:
function showIconsOverlay(event, polygon, label) {
  iconOverlay.value = {
    visible: true,
    style: {
      position: 'fixed',
      left: `${event.domEvent.clientX + 10}px`,
      top: `${event.domEvent.clientY - 50}px`,
      zIndex: 9999
    },
    polygon,
    label
  };
}
function hideIconsOverlay() {
  iconOverlay.value.visible = false;
}

function onViewPolygon(polygon) {
  // Lógica para ver el polígono
  alert('Ver polígono');
}

// Al editar, habilita edición del polígono
function onEditPolygon(polygon) {
  mapService.getAllFields().then(fields => {
    const field = fields.data.find(f =>
        f.path?.length && polygon.getPath().getArray()[0].lat() === f.path[0].lat
    );
    if (field) {
      Object.assign(editedField, field);
      editingField.value = field;
      editSidebarVisible.value = true;
      hideIconsOverlay();
      polygon.setEditable(true);
      editingField.value._polygon = polygon; // Guarda referencia
    }
  });
}

// Al guardar, toma el nuevo path y deshabilita edición
function saveEditedField() {
  const polygon = editingField.value?._polygon;
  if (polygon) {
    // Obtiene el path actualizado
    editedField.path = polygon.getPath().getArray().map(latlng => ({
      lat: latlng.lat(),
      lng: latlng.lng()
    }));
  }
  mapService.updateField(editedField.id, { ...editedField }).then(() => {
    alert('Lote actualizado');
    editSidebarVisible.value = false;
    if (polygon) {
      polygon.setEditable(false);
      delete editingField.value._polygon;
    }
  }).catch(() => {
    alert('Error al guardar');
  });
}
watch(editSidebarVisible, (visible) => {
  if (!visible && editingField.value?._polygon) {
    editingField.value._polygon.setEditable(false);
    delete editingField.value._polygon;
  }
});
function focusField(field) {
  if (!field.path?.length) return;
  // Centra el mapa en el primer punto del polígono
  const center = field.path[0];
  map.value.setCenter(center);
  map.value.setZoom(16);
}
function onPlaceChanged() {
  const place = autocomplete.getPlace();
  if (!place.geometry) {
    alert('Ciudad no encontrada');
    return;
  }
  const cityLocation = {
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng()
  };
  foundCity.value = place.formatted_address || place.name;

  // Filtra lotes cercanos como antes
  mapService.getAllFields().then(fields => {
    searchResults.value = fields.data.filter(field => {
      if (!field.path?.length) return false;
      const lat = field.path[0].lat;
      const lng = field.path[0].lng;
      return getDistanceFromLatLonInKm(lat, lng, cityLocation.lat, cityLocation.lng) < 20;
    });
    map.value.setCenter(cityLocation);
    map.value.setZoom(12);
  });
}
defineExpose({ enableDrawing });
</script>

<template>
  <div class="map-outer">
    <div class="map-container">
      <div ref="mapElement" class="map-fullscreen"></div>
      <div v-if="searchResults.length" class="sidebar">
        <h3>Lotes en {{ foundCity }}</h3>
        <div class="sidebar-cards">
          <div
              v-for="field in searchResults"
              :key="field.id"
              class="sidebar-card"
              @click="focusField(field)"
          >
            <div class="sidebar-card-title">{{ field.label }}</div>
            <div class="sidebar-card-info">
              <span>Lote ID: {{ field.id }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Cambia la posición de la barra lateral de edición -->
      <div v-if="editSidebarVisible" class="edit-sidebar">
        <h3>Editar Lote</h3>
        <label>
          Nombre:
          <input v-model="editedField.label" />
        </label>
        <label>
          ID de Lote:
          <input v-model="editedField.id" disabled />
        </label>
        <button @click="saveEditedField" class="save-btn">Guardar</button>
        <button @click="editSidebarVisible = false" class="cancel-btn">Cancelar</button>
      </div>
    </div>
    <input
        v-if="!editSidebarVisible"
        ref="autocompleteInput"
        v-model="searchQuery"
        class="map-search-box"
        style="width: 300px"
        placeholder="Buscar ciudad..."
    />
    <button
        v-if="!editSidebarVisible"
        class="map-draw-btn"
        @click="enableDrawing"
    >
      + Dibujar campo
    </button>
    <DialogComponent ref="dialogRef" @confirm="onDialogConfirm" />
    <div v-if="iconOverlay.visible"
         :style="iconOverlay.style"
         class="polygon-icon-overlay polygon-icon-vertical">
      <button class="polygon-close-btn" @click="hideIconsOverlay">✖</button>
      <div class="polygon-label">{{ iconOverlay.label }}</div>
      <div class="polygon-icons">
        <pv-button
            icon="pi pi-eye"
            outlined
            rounded
            class="mr-2"
            severity="info"
            @click="onViewPolygon(iconOverlay.polygon)"
        />
        <pv-button
            icon="pi pi-pencil"
            outlined
            rounded
            @click="onEditPolygon(iconOverlay.polygon)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-outer {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden; /* Evita scroll horizontal */

}
.map-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* Evita scroll horizontal */

}
.map-fullscreen {
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
<style>
.map-search-box {
  position: fixed;
  top: 80px;
  right: 30px;
  z-index: 10;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
  background: #595959;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.map-draw-btn {
  position: fixed;
  top: 120px; /* 80px del input + 50px de separación */
  right: 30px;
  z-index: 2147483647;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  background: #1890ff;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.polygon-icon-overlay {
  display: flex;
  gap: 8px;
  background: #fff;
  border-radius: 4px;
  padding: 4px 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  align-items: center;
}
.polygon-close-btn {
  position: absolute;
  top: -20px;
  right: -15px;
  background: #ffb3b3;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 14px;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  padding: 0;
}
.icon-view, .icon-edit {
  cursor: pointer;
  font-size: 20px;
}
.polygon-label {
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 15px;
  color: #333;
  text-align: center;
  width: 100%;
}
.polygon-icon-vertical {
  flex-direction: column;
  align-item: center;
}
.polygon-icons {
  display: flex;
  gap: 8px;
}
.sidebar {
  position: absolute;
  left: 0;
  top: 0;
  width: 260px;
  height: 100%;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.08);
  z-index: 10;
  padding: 24px 16px;
  overflow-y: auto;
  color: #111; /* Letras negras */
}

.sidebar-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sidebar-card {
  background: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 16px 12px;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
  border: 1px solid #e0e0e0;
}
.sidebar-card:hover {
  background: #e6f7ff;
  box-shadow: 0 4px 16px rgba(24,144,255,0.12);
}
.sidebar-card-title {
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 6px;
  color: #111;
}
.sidebar-card-info {
  font-size: 13px;
  color: #555;
}
/* Ajusta la barra lateral de edición al lado derecho del mapa */
.edit-sidebar {
  position: fixed; /* Cambia de absolute a fixed */
  right: 0;
  top: 0;
  width: 320px;
  height: 100vh;
  background: #f7f7f7;
  box-shadow: -2px 0 8px rgba(0,0,0,0.08);
  z-index: 2147483648;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #111;
  overflow-y: auto;
}
.save-btn {
  background: #1890ff;
  color: #fff;
  border: none;
  padding: 10px 0;
  border-radius: 4px;
  margin-top: 12px;
  cursor: pointer;
}
.cancel-btn {
  background: #ccc;
  color: #333;
  border: none;
  padding: 10px 0;
  border-radius: 4px;
  margin-top: 8px;
  cursor: pointer;
}
</style>