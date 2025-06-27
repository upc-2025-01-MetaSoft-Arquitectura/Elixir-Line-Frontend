<script setup>
// @ts-ignore
// eslint-disable-next-line
/* global google */
import { onMounted, ref, nextTick } from 'vue';
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
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCsxsmtiisizWV5jTPgMmR0mQvOrnfA7J4&libraries=drawing';
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
  await nextTick(); // Espera a que el DOM esté listo
  initMap();
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
        drawnShapes.value.push(polygon);
      }
    });
  } catch (e) {
    alert('Error al cargar los campos guardados');
  }
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
    drawnShapes.value.push(polygon);
    alert('Campo guardado correctamente');
  } catch (e) {
    alert('Error al guardar el campo');
  }
}
defineExpose({ enableDrawing });
</script>

<template>
  <div class="map-outer">
    <div class="map-container">
      <div ref="mapElement" class="map-fullscreen"></div>
    </div>
    <input
        type="text"
        placeholder="Buscar ubicación..."
        class="map-search-box"
    />
    <button class="map-draw-btn" @click="enableDrawing">+ Dibujar campo</button>
    <DialogComponent ref="dialogRef" @confirm="onDialogConfirm" />
  </div>
</template>

<style scoped>
.map-outer {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.map-container {
  width: 100vw;
  height: 100vh;
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
</style>