<template>
    <!--LO QUE TIENE QUE HACER ESTE SCRIPT: SOLO SI ES ADMIN
    •CREAR INCIDENCIA: Todos (Profes,alumnos, tic y admin).
    •RESOLVER INCIDENCIA: Tic y Admin.
    -->
    <div id="App">
        <div class="container">
            <h1>Gestión de Incidencias</h1>
            <div v-if="userRole === 'admin' || userRole === 'profesor' || userRole === 'alumno' || userRole === 'tic'">
                <button @click="crearIncidencia">Crear Incidencia</button>
            </div>
            <div v-if="userRole === 'admin' || userRole === 'tic'">
                <h2>Incidencias Pendientes</h2>
                <ul>
                    <li v-for="incidencia in incidenciasPendientes" :key="incidencia.id">
                        {{ incidencia.descripcion }}
                        <button @click="resolverIncidencia(incidencia.id)">Resolver</button>
                    </li>
                </ul>
            </div>
            <div v-else>
                <p>No tienes permisos para gestionar incidencias.</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Gestiona_Incidencias',
    data() {
        return {
            userRole: this.$route.query.userRole || 'alumno',
            incidenciasPendientes: [
                { id: 1, descripcion: "Problema con el proyector" },
                { id: 2, descripcion: "Fallo en el sistema de sonido" }
            ]
        }
    },
    methods: {
        crearIncidencia() {
            alert("Incidencia creada.");
        },
        resolverIncidencia(id) {
            alert(`Incidencia ${id} resuelta.`);
        }
    }
}

</script>