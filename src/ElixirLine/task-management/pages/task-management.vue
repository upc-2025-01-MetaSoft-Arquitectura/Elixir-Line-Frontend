<script setup>

</script>

<template>
  <div class="task-management-container">
    <h1 class="title">Gestión de Tareas</h1>
    <h2 class="subtitle">Administra y organiza las tareas de los lotes</h2>

    <div class="filter-section">
      <label for="batch-filter" class="filter-label">Filtrar por lote:</label>
      <select id="batch-filter" class="batch-dropdown">
        <option disabled selected>Selecciona un lote</option>
      </select>
    </div>

    <div class="button-row">
      <button class="action-btn add-task-btn">Agregar nueva tarea</button>
      <button class="action-btn delete-task-btn">Eliminar</button>
      <button class="action-btn export-btn">Exportar</button>
    </div>

    <div class="search-section">
      <input
          type="text"
          class="search-input"
          placeholder="Buscar título o ID de tarea"
      />
    </div>

    <table class="tasks-table">
      <thead>
      <tr>
        <th>ID</th>
        <th>ID Lote</th>
        <th>Trabajador</th>
        <th>Título</th>
        <th>Parcela</th>
        <th>Fecha límite</th>
        <th>Estado</th>
        <th>Avance</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <!-- Ejemplo de fila, reemplazar por v-for en el futuro -->
      <tr>
        <td>1</td>
        <td>101</td>
        <td>Juan Pérez</td>
        <td>Revisión de riego</td>
        <td>Parcela 3</td>
        <td>2024-07-10</td>
        <td>Pendiente</td>
        <td>20%</td>
        <td>
          <!-- Aquí irán los botones de acción -->
          <button class="action-btn small">Editar</button>
          <button class="action-btn small">Ver</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.task-management-container {
  width: 100%;
  padding: 32px 16px;
  box-sizing: border-box;
}

.title {
  margin-bottom: 0;
  color: #8B0000;
}

.subtitle {
  margin-top: 4px;
  margin-bottom: 24px;
  color: #555;
  font-weight: normal;
}

.filter-section {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;
}

.filter-label {
  font-weight: 500;
}

.batch-dropdown {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.button-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.add-task-btn {
  width: 150px;
  height: 40px;

  border-radius: 6px;
  background:  #556B2F;
  
}

.delete-task-btn {
  width: 150px;
  height: 40px;
  border-radius: 6px;
  background:  #8B0000;
  
}

.export-btn {
  width: 150px;
  height: 40px;

  border-radius: 6px;
  background: #767676;
  
}

.action-btn:hover {
  background: #515151;
}
.search-section {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.search-input {
  padding: 8px 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 260px;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
  background: #fff;
}

.tasks-table th,
.tasks-table td {
  border: 1px solid #ddd;
  padding: 8px 10px;
  text-align: left;
}

.tasks-table th {
  background: #8B0000;
  color: #fff;
  font-weight: 600;
}

.tasks-table tr:nth-child(even) {
  background: #f9f9f9;
}

.action-btn.small {
  padding: 5px 10px;
  font-size: 0.9em;
  margin-right: 4px;
}
</style>