<template>
    <!--
H9. - Como ADMINISTRADOR quiero poder gestionar los TURNOS para organizar los horarios de los cursos.

Criterios de Aceptación:
• CA1:Al igual que en las etapas, no se puede borrar un turno que tenga cursos
activos asociados para evitar "huérfanos" en la base de datos.

-->
    <div id="App">
        <div class="gestion_turnos">
            <h1>Gestión de Turnos</h1>
            <div class="botones">
                <button @click="mostrarMenu('crear')">Crear Turno</button>
                <button @click="mostrarMenu('editar')">Editar Turno</button>
                <button @click="mostrarMenu('borrar')">Borrar Turno</button>
                <button @click="mostrarMenu('lista')">Ver Lista de Turnos</button>
            </div>
            <div v-if="menus.crear" id="menu_crear">
                <h3>Registrar Turno</h3>
                ID: <input v-model="turno.dni_nie" /><br><br>
                Nombre :<input v-model="turno.nombre" type="text" /><br><br>
                Horario de referencia :<input v-model="turno.horario_referencia" type="text" /><br><br>
                <button @click="crearTurnos">Confirmar Alta</button>
            </div>
            <div v-if="menus.editar" class="menu">
                Elija el ID del turno a editar: 
                <select v-model="turno.id">
                    <option value="" disabled> --------- </option>
                    <option v-for="turno in listaTurnos" :key="turno.id" :value="turno.id">
                        {{ turno.id }} - {{ turno.nombre }}
                    </option>
                </select><br><br>
                Nombre :<input v-model="turno.nombre" type="text" /><br><br>
                Horario de referencia :<input v-model="turno.horario_referencia" type="text" /><br><br>
                <button @click="actualizarTurnos">Confirmar Edicion</button>
            </div>

            <div v-if="menus.borrar" class="menu">
                Elija el ID del turno a borrar: <select v-model="turno.id">
                    <option value="" disabled> --------- </option>
                    <option v-for="turno in listaTurnos" :key="turno.id" :value="turno.id">
                        {{ turno.id }} - {{ turno.nombre }}
                    </option>
                </select><br><br>
                <button @click="borrarTurnos(turno)">Enviar</button>
            </div>

            <div v-if="menus.lista" id="menu_lista">
                <h3>Turnos actuales</h3>
                <ul>
                    <li v-for="turno in listaTurnos" :key="turno.id">
                        {{ turno.id }} - {{ turno.nombre }} - {{ turno.horario_referencia }} - {{
                            turno.departamento_id }} - {{ turno.correo_institucional }} - {{ turno.rol_id }}
                    </li>
                </ul>
                <p v-if="listaTurnos.length === 0"><strong>No hay turnos en la lista.</strong></p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Gestiona_Turnos',
    data() {
        return {
            turno: {
                id: "",
                nombre: "",
                horario_referencia: "",
            },
            listaTurnos: [],
            url: "http://100.52.46.68:3000/turnos",
            menus: {
                crear: false,
                editar: false,
                borrar: false,
                lista: true // dejamps la lista abierta por defecto
            },
            z_usuario:"exposand"
        }
    },
    mounted() {
        this.verTurnos();
    },
    methods: {
        mostrarMenu(menu) {
            for (let key in this.menus) {
                this.menus[key] = (key === menu);
            }
        },
        crearTurnos() {
            // Validamos que los campos no estén vacíos en Vue antes de enviar
            if (!this.turno.id || !this.turno.nombre || !this.turno.horario_referencia) { //Si estan vacios le salto con error
                alert("No pueden haber campos vacios.");
                return;
            }

            fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.turno) // Enviamos el objeto entero con los datos del nuevo turno
            }).then(res => {
                if (!res.ok) return res.json().then(err => { throw err; });
                return res.json();
            }).then(() => {
                alert("Turno creado con éxito");
                this.limpiarFormulario();
                this.verTurnos();
                this.mostrarMenu('crear'); //Cambio el metodo a false para que no se muestre el formulario de creacio de primeras

            }).catch(err => alert("Error: " + (err.mensaje)));
        },

        verTurnos() {
            fetch(this.url)
                .then(res => res.json())
                .then(datos => {
                    this.listaTurnos = Array.isArray(datos) ? datos : datos.turnos || [];
                });
        },

        limpiarFormulario() {
            this.turno.id = "";
            this.turno.nombre = "";
            this.turno.horario_referencia = "";
        },

        actualizarTurnos() {

            fetch(this.url + '/' + this.turno.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...this.turno
                })
            }).then(res => {
                if (!res.ok) return res.json().then(err => { throw err; });
                return res.json();
            }).then(() => {
                alert("Turno actualizado con éxito");
                this.limpiarFormulario();
                this.verTurnos();

            }).catch(err => alert("Error al actualizar turno: " + (err.mensaje || "Error desconocido")));
        },

        borrarTurnos(turno) {
            fetch(this.url + '/' + turno.id, {
                method: 'DELETE'
            })
                .then(res => {
                    if (!res.ok) throw new Error("No se pudo eliminar el turno");
                    return res.json();
                })
                .then(() => {
                    alert("Turno eliminado correctamente");
                    this.verTurnos(); // Refrescamos la lista
                })
                .catch(err => alert("Error al borrar turno: " + (err.mensaje || "Error desconocido")));
        },
    }
}

</script>