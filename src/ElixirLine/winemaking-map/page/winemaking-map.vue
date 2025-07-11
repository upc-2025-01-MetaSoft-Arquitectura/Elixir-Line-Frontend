<script setup>
// @ts-ignore
// eslint-disable-next-line
/* global google */
import {onMounted, ref, nextTick, reactive, watch, computed} from 'vue';
import { MapApiService } from '../services/maps-service';
import { WineBatchesApiService } from '../../winemaking-process/services/wine-batches-api.service.js';
import { defineExpose } from 'vue';
import DialogComponent from '../component/dialog-component.vue';
import { useAuthenticationStore } from '../../security/services/authentication.store.js';

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
const wineBatchOrigins = reactive({});
const sidebarCollapsed = ref(false);
const editSidebarCollapsed = ref(false);
const wineBatchService = new WineBatchesApiService();
const groupedFields = computed(() => {
  const groups = {};
  searchResults.value.forEach(field => {
    if (!groups[field.wineBatchId]) {
      groups[field.wineBatchId] = [];
    }
    groups[field.wineBatchId].push(field);
  });
  return groups;
});
// Después de eliminar la parcela y cerrar el sidebar
const index = drawnShapes.value.findIndex(polygon => {
  // Compara el primer punto del path para identificar el polígono
  const polyPath = polygon.getPath().getArray();
  return (
      polyPath.length &&
      editedField.path &&
      polyPath[0].lat() === editedField.path[0].lat &&
      polyPath[0].lng() === editedField.path[0].lng
  );
});
if (index !== -1) {
  drawnShapes.value[index].setMap(null); // Elimina del mapa
  drawnShapes.value.splice(index, 1);    // Elimina del array
}
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
  await loadWineBatchOrigins();

});
// Al cargar los campos, asegurarse de que cada field tenga wineBatchId igual a batchId
async function loadSavedFields() {
  try {
    const response = await mapService.getAllFields();
    response.data.forEach(field => {
      // Asegura que cada field tenga wineBatchId para agrupamiento y búsqueda
      if (field.batchId && !field.wineBatchId) {
        field.wineBatchId = field.batchId;
      }
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
        polygon.addListener('click', (event) => showIconsOverlay(event, polygon, field.label));
        drawnShapes.value.push(polygon);
      }
    });
    // Actualiza searchResults para que los campos tengan wineBatchId
    searchResults.value = response.data.map(field => {
      if (field.batchId && !field.wineBatchId) field.wineBatchId = field.batchId;
      return field;
    });
  } catch (e) {
    alert('Error al cargar los campos guardados');
  }
}
async function loadWineBatchOrigins() {
  const ids = [...new Set(searchResults.value.map(f => f.wineBatchId))];
  for (const id of ids) {
    if (id && !wineBatchOrigins[id]) {
      try {
        const res = await wineBatchService.getById(id);
        // Muestra vineyardOrigin (grapeVariety)
        wineBatchOrigins[id] = res.data.vineyardOrigin + (res.data.grapeVariety ? ` (${res.data.grapeVariety})` : '');
      } catch {
        wineBatchOrigins[id] = 'Desconocido';
      }
    }
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
const isDarkMode = ref(true);

function getMapStyle() {
  return isDarkMode.value ? [
    { elementType: 'geometry', stylers: [{ color: '#212121' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#e0e0e0' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#181818' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#383838' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212121' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f2f2f' }] },
    { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#232a36' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#b3b3b3' }] }
  ] : null;
}

function toggleMapMode() {
  isDarkMode.value = !isDarkMode.value;
  if (map.value) {
    map.value.setOptions({ styles: getMapStyle() });
  }
}

function initMap() {
  map.value = new window.google.maps.Map(mapElement.value, {
    center: { lat: -9.189967, lng: -75.015152 },
    zoom: 8,
    styles: getMapStyle()
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

  window.google.maps.event.addListener(drawingManager.value, 'overlaycomplete', function(event) {
    if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
      lastPolygonPath = event.overlay.getPath().getArray().map(latlng => ({
        lat: latlng.lat(),
        lng: latlng.lng()
      }));
      // Elimina cualquier polígono temporal anterior
      if (tempPolygon) {
        tempPolygon.setMap(null);
        tempPolygon = null;
      }
      tempPolygon = event.overlay; // Guarda referencia al polígono temporal
      // Asegura que el diálogo se abra siempre después del render
      setTimeout(() => {
        dialogRef.value.open();
      }, 0);
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
      wineBatchId,
      batchId: wineBatchId,
      winegrowerId: userId()
    });
    // Elimina el polígono temporal si existe
    if (tempPolygon) {
      tempPolygon.setMap(null);
      tempPolygon = null;
    }
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
    polygon.addListener('click', (event) => showIconsOverlay(event, polygon, label));
    drawnShapes.value.push(polygon);
    showCreateFieldDialog(); // Muestra el dialog verde de éxito
    await loadSavedFields();
  } catch (e) {
    console.error('Error al guardar el campo:', e);
    alert('Error al guardar el campo: ' + (e?.message || e));
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

function arePathsEqual(pathA, pathB) {
  if (!Array.isArray(pathA) || !Array.isArray(pathB)) return false;
  if (pathA.length !== pathB.length) return false;
  for (let i = 0; i < pathA.length; i++) {
    if (
      Math.abs(pathA[i].lat - pathB[i].lat()) > 1e-6 ||
      Math.abs(pathA[i].lng - pathB[i].lng()) > 1e-6
    ) {
      return false;
    }
  }
  return true;
}
function onViewPolygon(polygon) {
  // Encuentra el field correspondiente al polígono comparando todo el path
  const polyPath = polygon.getPath().getArray();
  const field = searchResults.value.find(f =>
    f.path?.length === polyPath.length && arePathsEqual(f.path, polyPath)
  );
  if (field) {
    selectedPolygonData.value = {
      label: field.label,
      id: field.id,
      vineyard: wineBatchOrigins[field.wineBatchId] || 'Desconocido',
      wineBatchId: field.wineBatchId
    };
    showPolygonDialog.value = true;
  }
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
    editedField.path = polygon.getPath().getArray().map(latlng => ({
      lat: latlng.lat(),
      lng: latlng.lng()
    }));
  }
  mapService.updateField(editedField.id, { ...editedField }).then(async () => {
    showPlotUpdatedDialog();
    editSidebarVisible.value = false;
    if (polygon) {
      polygon.setEditable(false);
      delete editingField.value._polygon;
    }
    await loadSavedFields(); // Actualiza los datos
  }).catch(() => {
    alert('Error al guardar');
  });
}
// En <script setup>
async function deleteEditedField() {
  if (!editedField.id) return;
  if (!confirm('¿Seguro que deseas eliminar esta parcela?')) return;
  try {
    await mapService.deleteField(editedField.id);
    alert('Parcela eliminada');
    editSidebarVisible.value = false;
    await loadSavedFields(); // Actualiza los datos
  } catch {
    alert('Error al eliminar la parcela');
  }
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
watch(searchResults, async () => {
  await loadWineBatchOrigins();
});
// Agrega esta función para calcular el convex hull (envolvente convexa)
function getConvexHull(points) {
  // Graham scan algorithm
  points.sort((a, b) => a.lng - b.lng || a.lat - b.lat);
  const cross = (o, a, b) => (a.lng - o.lng) * (b.lat - o.lat) - (a.lat - o.lat) * (b.lng - o.lng);
  const lower = [];
  for (const p of points) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

// Dibuja las áreas verdes envolventes después de cargar los campos
async function drawVineyardAreas() {
  if (window._vineyardAreas) {
    window._vineyardAreas.forEach(p => p.setMap(null));
  }
  window._vineyardAreas = [];

  const groups = {};
  searchResults.value.forEach(field => {
    if (!groups[field.wineBatchId]) groups[field.wineBatchId] = [];
    groups[field.wineBatchId].push(...field.path);
  });

  Object.values(groups).forEach(points => {
    if (points.length < 3) return;
    const hull = getConvexHull(points);
    const expandedHull = expandPolygon(hull, 1.03); // 3% más grande
    const areaPolygon = new window.google.maps.Polygon({
      paths: expandedHull,
      fillColor: '#4caf50',
      fillOpacity: 0.18,
      strokeColor: '#388e3c',
      strokeOpacity: 0.7,
      strokeWeight: 2,
      map: map.value,
      zIndex: 0
    });
    window._vineyardAreas.push(areaPolygon);
  });
}

// Llama a drawVineyardAreas cada vez que cambian los resultados de búsqueda
watch(searchResults, async () => {
  await loadWineBatchOrigins();
  drawVineyardAreas();
});
function expandPolygon(points, factor = 1.01) {
  // Calcula el centroide
  const centroid = points.reduce(
      (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
      { lat: 0, lng: 0 }
  );
  centroid.lat /= points.length;
  centroid.lng /= points.length;

  // Expande cada punto alejándolo del centroide
  return points.map(p => ({
    lat: centroid.lat + (p.lat - centroid.lat) * factor,
    lng: centroid.lng + (p.lng - centroid.lng) * factor
  }));
}
defineExpose({ enableDrawing });
const showSuccessDialog = ref(false);
const showCreateSuccessDialog = ref(false); // Nuevo dialog para creación
const showPolygonDialog = ref(false);
const selectedPolygonData = ref({});

function showPlotUpdatedDialog() {
  showSuccessDialog.value = true;
  setTimeout(() => {
    showSuccessDialog.value = false;
  }, 1800);
}
function showCreateFieldDialog() {
  showCreateSuccessDialog.value = true;
  setTimeout(() => {
    showCreateSuccessDialog.value = false;
  }, 1800);
}

// Escucha el evento cancel del dialog
function onDialogCancel() {
  if (tempPolygon) {
    tempPolygon.setMap(null); // Elimina el polígono temporal
    tempPolygon = null;
  }
}

function userId() {
  return useAuthenticationStore().currentUserId;
}
let tempPolygon = null; // Polígono temporal para manejo de creación
</script>

<template>
  <div class="map-outer">
    <div class="map-container">
      <div ref="mapElement" class="map-fullscreen"></div>
      <div v-if="searchResults.length" :class="['sidebar', { collapsed: sidebarCollapsed }]">
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? '▶' : '◀' }}
        </button>
        <template v-if="!sidebarCollapsed">
          <h3>Parcelas in {{ foundCity }}</h3>
          <div class="sidebar-cards">
            <div v-for="(fields, wineBatchId) in groupedFields" :key="wineBatchId" class="sidebar-group">
              <div class="sidebar-group-title">
                Viñedo: {{ wineBatchOrigins[wineBatchId] || 'Cargando...' }}
              </div>
              <div v-for="field in fields" :key="field.id" class="sidebar-card" @click="focusField(field)">
                <div class="sidebar-card-title">{{ field.label }}</div>
                <div class="sidebar-card-info">
                  <span>Parcela ID: {{ field.id }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <!-- Cambia la posición de la barra lateral de edición -->
      <div v-if="editSidebarVisible" :class="['edit-sidebar', { collapsed: editSidebarCollapsed }]">
        <button class="collapse-btn right" @click="editSidebarCollapsed = !editSidebarCollapsed">
          {{ editSidebarCollapsed ? '◀' : '▶' }}
        </button>
        <template v-if="!editSidebarCollapsed">
          <h3>Editar Parcela</h3>
          <label>
            Nombre:
            <input v-model="editedField.label" />
          </label>
          <label>
            ID de Parcela:
            <input v-model="editedField.id" disabled />
          </label>
          <button @click="saveEditedField" class="save-btn">Guardar</button>
          <button @click="editSidebarVisible = false" class="cancel-btn">Cancelar</button>
          <button @click="deleteEditedField" class="delete-btn">Eliminar Parcela</button>
        </template>
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
        class="map-draw-btn dark-btn"
        @click="enableDrawing"
    >
      + Dibujar campo
    </button>
    <button
        v-if="!editSidebarVisible"
        class="map-mode-btn dark-btn"
        @click="toggleMapMode"
    >
      {{ isDarkMode ? '🌙 Modo Oscuro' : '☀️ Modo Claro' }}
    </button>
    <DialogComponent ref="dialogRef" @confirm="onDialogConfirm" @cancel="onDialogCancel" />
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
    <div v-if="showSuccessDialog" class="success-dialog">
      <span class="success-icon">✔</span>
      Plot actualizado correctamente
    </div>
    <div v-if="showCreateSuccessDialog" class="success-dialog create-success-dialog">
      <span class="success-icon">✔</span>
      Campo guardado correctamente
    </div>
    <div v-if="showPolygonDialog" class="polygon-dialog">
      <div class="polygon-dialog-content">
        <button class="polygon-dialog-close" @click="showPolygonDialog = false">✖</button>
        <div class="polygon-dialog-title">Detalles de Parcela</div>
        <div class="polygon-dialog-row"><span class="polygon-dialog-label">Nombre:</span> {{ selectedPolygonData.label }}</div>
        <div class="polygon-dialog-row"><span class="polygon-dialog-label">ID:</span> {{ selectedPolygonData.id }}</div>
        <div class="polygon-dialog-row"><span class="polygon-dialog-label">Viñedo:</span> {{ wineBatchOrigins[selectedPolygonData.wineBatchId] || 'Desconocido' }}</div>
        <div class="polygon-dialog-row"><span class="polygon-dialog-label">WineBatch ID:</span> {{ selectedPolygonData.wineBatchId }}</div>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
.map-outer {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #232323;
}
.map-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #232323;
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
.map-draw-btn,
.map-mode-btn {
  position: fixed;
  right: 30px;
  z-index: 2147483647;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  background: #18191c;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(24,144,255,0.13);
  margin-bottom: 12px;
  transition: background 0.2s, box-shadow 0.2s;
}
.map-draw-btn {
  top: 120px;
}
.map-mode-btn {
  top: 170px;
}
.map-draw-btn:hover,
.map-mode-btn:hover {
  background: #232a36;
  box-shadow: 0 4px 18px rgba(24,144,255,0.18);
}
.dark-btn {
  background: #18191c;
  color: #fff;
  border: 1px solid #232a36;
}
.dark-btn:active {
  background: #232a36;
}
.polygon-icon-overlay {
  display: flex;
  gap: 8px;
  background: #555555;
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
  align-items: center;
}
.polygon-icons {
  display: flex;
  gap: 8px;
}
.sidebar {
  position: absolute;
  left: 0;
  top: 0;
  width: 270px;
  height: 100%;
  background: #232323;
  box-shadow: 2px 0 16px rgba(24,144,255,0.10);
  z-index: 10;
  padding: 32px 18px 24px 18px;
  overflow-y: auto;
  color: #e0e0e0;
  border-right: 2px solid #232a36;
  transition: width 0.2s, box-shadow 0.2s;
}
.sidebar.collapsed {
  width: 44px !important;
  min-width: 44px;
  padding: 8px 4px;
  overflow: hidden;
  box-shadow: none;
}
.sidebar-cards {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.sidebar-group {
  background: #232a36;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(24,144,255,0.07);
  padding: 14px 12px 10px 12px;
  border: 1px solid #232a36;
  margin-bottom: 8px;
}
.sidebar-group-title {
  font-weight: 700;
  font-size: 16px;
  margin: 8px 0 10px 0;
  color: #ff9800;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #232a36;
  padding-bottom: 4px;
}
.sidebar-card {
  background: #232a36;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(24,144,255,0.06);
  padding: 10px 10px 8px 10px;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
  border: 1px solid #232a36;
  margin-bottom: 6px;
  color: #fff;
}
.sidebar-card:hover {
  background: #18191c;
  box-shadow: 0 4px 16px rgba(24,144,255,0.14);
}
.sidebar-card-title {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
  color: #fff;
}
.sidebar-card-info {
  font-size: 13px;
  color: #b3b3b3;
  margin-left: 2px;
}
.collapse-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 20;
  background: #e0e7ef;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(24,144,255,0.08);
  transition: background 0.2s;
}
.collapse-btn:hover {
  background: #b3d8ff;
}
.collapse-btn.right {
  left: auto;
  right: 12px;
}
.edit-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 340px;
  height: 100vh;
  background: #232323;
  box-shadow: -2px 0 16px rgba(24,144,255,0.10);
  z-index: 2147483648;
  padding: 38px 26px 24px 26px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  color: #e0e0e0;
  overflow-y: auto;
  border-left: 2px solid #232a36;
  transition: width 0.2s, box-shadow 0.2s;
}
.edit-sidebar.collapsed {
  width: 44px !important;
  min-width: 44px;
  padding: 8px 4px;
  overflow: hidden;
  box-shadow: none;
}
.edit-sidebar h3 {
  font-size: 20px;
  font-weight: 700;
  color: #ff9800;
  margin-bottom: 18px;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #232a36;
  padding-bottom: 6px;
}
.edit-sidebar label {
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.edit-sidebar input {
  padding: 8px 10px;
  border-radius: 5px;
  border: 1px solid #232a36;
  font-size: 15px;
  background: #18191c;
  margin-bottom: 8px;
  transition: border 0.2s;
  color: #fff;
}
.edit-sidebar input::placeholder {
  color: #b3b3b3;
  opacity: 1;
}
.save-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  padding: 10px 0;
  border-radius: 4px;
  margin-top: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 1px 4px rgba(24,144,255,0.08);
  transition: background 0.2s;
}
.save-btn:hover {
  background: #1565c0;
}
.cancel-btn {
  background: #232a36;
  color: #fff;
  border: none;
  padding: 10px 0;
  border-radius: 4px;
  margin-top: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 15px;
  box-shadow: 0 1px 4px rgba(24,144,255,0.08);
  transition: background 0.2s;
}
.cancel-btn:hover {
  background: #18191c;
}
.delete-btn {
  background: #d32f2f;
  color: #fff;
  border: none;
  padding: 10px 0;
  border-radius: 4px;
  margin-top: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 1px 4px rgba(211,47,47,0.08);
  transition: background 0.2s;
}
.delete-btn:hover {
  background: #b71c1c;
}
.polygon-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(24,144,255,0.18);
  z-index: 2147483649;
  min-width: 340px;
  min-height: 220px;
  padding: 32px 28px 24px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.polygon-dialog-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.polygon-dialog-title {
  font-size: 20px;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 18px;
  letter-spacing: 0.5px;
  text-align: center;
}
.polygon-dialog-row {
  font-size: 15px;
  color: #222;
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.polygon-dialog-label {
  font-weight: 600;
  color: #1565c0;
  margin-right: 8px;
}
.polygon-dialog-close {
  position: absolute;
  top: 18px;
  right: 18px;
  background: #e0e7ef;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 18px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(24,144,255,0.08);
}
.polygon-dialog-close:hover {
  background: #b3d8ff;
}
.map-toggle-mode-btn {
  position: fixed;
  top: 180px; /* Debajo del botón de dibujar */
  right: 30px;
  z-index: 2147483647;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: background 0.2s;
}
.map-toggle-mode-btn:hover {
  background: #1565c0;
}
</style>