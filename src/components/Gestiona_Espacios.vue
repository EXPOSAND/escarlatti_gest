<template>
<!--
H6.- Como ADMINISTRADOR quiero poder gestionar los ESPACIOS para definir los
lugares donde se pueden realizar reservas e incidencias.

**SEGUN YO**
•SCRUM ESPACIOS:
-->

    <div id="App">
        <div class="gestion_espacios">
            <h1>Gestión de Espacios</h1>
            <div class="botones">
                <button @click="mostrarMenu('crear')">Crear Espacio</button>
                <button @click="mostrarMenu('editar')">Editar Espacio</button>
                <button @click="mostrarMenu('borrar')">Borrar Espacio</button>
                <button @click="mostrarMenu('lista')">Ver Lista de Espacios</button>
            </div>
            <div v-if="menus.crear" id="menu_crear">
                <h3>Registrar Espacio</h3>
                Nombre del Espacio: <input v-model="espacio.nombre" type="text" /><br><br>
                Ubicacion: <input v-model="espacio.ubicacion_planta" type="text" /><br><br>
                ID: <input v-model="espacio.id" type="number" /><br><br>
                Capacidad Maxima: <input v-model="espacio.capacidad_max" type="number" /><br><br>
                Equipamiento: <input v-model="espacio.equipamiento" type="text" /><br><br>
                Estado Operativo: 
                <select v-model="espacio.estado_operativo">
                    <option value="true">Operativo</option>
                    <option value="false">No operativo</option>
                </select><br><br>
                <button @click="crearEspacios">Confirmar Alta</button>
            </div>

            <div v-if="menus.editar" class="menu">
                Elija el ID del espacio a editar: <select v-model="espacio.id">
                    <option value="" disabled> --------- </option>
                    <option v-for="espacio in listaEspacios" :key="espacio.id" :value="espacio.id">
                        {{ espacio.nombre }}
                    </option>
                </select><br><br>
                <button @click="actualizarEspacios">Confirmar Edicion</button>
            </div>

            <div v-if="menus.borrar" class="menu">
                Elija el ID del espacio a borrar: <select v-model="espacio.id">
                    <option value="" disabled> --------- </option>
                    <option v-for="espacio in listaEspacios" :key="espacio.id" :value="espacio.id">
                        {{ espacio.nombre }}
                    </option>
                </select><br><br>
                <button @click="borrarEspacios(espacio)">Enviar</button>
            </div>

            <div v-if="menus.lista" id="menu_lista">
                <h3>Espacios actuales</h3>
                <ul>
                    <li v-for="espacio in listaEspacios" :key="espacio.id">
                        {{ espacio.id }} - {{ espacio.nombre }} - {{ espacio.ubicacion_planta }} - {{ espacio.capacidad_max }} - {{ espacio.equipamiento }} - {{ espacio.estado_operativo }}
                    </li>
                </ul>
                <p v-if="listaEspacios.length === 0"><strong>No hay espacios en la lista.</strong></p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Gestiona_Espacios',
    data() {
        return {
            espacio: {
                id: "",
                nombre: "",
                ubicacion_planta: "",
                capacidad_max: "",
                equipamiento: "",
                estado_operativo: "true" // Por defecto lo dejamos como operativo   
            },
            listaEspacios: [],
            url: "http://100.52.46.68:3000/espacios",
            menus: {
                crear: false,
                editar: false,
                borrar: false,
                lista: true // dejamps la lista abierta por defecto
            },
        }
    },
    mounted() {
        this.verEspacios();
    }, //No olvidar la puta coma de aqui
    methods: {
        crearEspacios() {
            // Validamos que los campos no estén vacíos en Vue antes de enviar
            if (!this.espacio.nombre || !this.espacio.descripcion || !this.espacio.id || !this.espacio.ubicacion || !this.espacio.capacidad_max || !this.espacio.equipamiento || !this.espacio.estado_operativo) { //Si estan vacios le salto con error
                alert("No pueden haber campos vacios.");
                return;
            }

            fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.espacio) // Enviamos el objeto entero con los datos del nuevo espacio
            }).then(res => {
                if (!res.ok) return res.json().then(err => { throw err; });
                return res.json();
            }).then(() => {
                alert("Espacio creado con éxito");
                this.limpiarFormulario();
                this.verEspacios();
                this.mostrarMenu('crear'); //Cambio el metodo a false para que no se muestre el formulario de creacio de primeras

            }).catch(err => alert("Error: " + (err.mensaje)));
        },

        verEspacios() {
            fetch(this.url)
                .then(res => res.json())
                .then(datos => {
                    this.listaEspacios = Array.isArray(datos) ? datos : datos.espacios || [];
                });
        },

        limpiarFormulario() {
            this.espacio.id = "";
            this.espacio.nombre = "";
            this.espacio.descripcion = "";
            this.espacio.ubicacion = "";
            this.espacio.capacidad_max = "";
            this.espacio.equipamiento = "";
            this.espacio.estado_operativo = "true";
        },

        actualizarEspacios() {

            fetch(this.url + '/' + this.espacio.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...this.espacio //Mando el espacio entero
                })
            }).then(res => {
                if (!res.ok) return res.json().then(err => { throw err; });
                return res.json();
            }).then(() => {
                alert("Espacio actualizado con éxito");
                this.limpiarFormulario();
                this.verEspacios();

            }).catch(err => alert("Error al actualizar espacio: " + (err.mensaje || "Error desconocido")));
        },

        borrarEspacios(espacio) {
            fetch(this.url + '/' + espacio.id, {
                method: 'DELETE'
            })
                .then(res => {
                    if (!res.ok) throw new Error("No se pudo eliminar el espacio");
                    return res.json();
                })
                .then(() => {
                    alert("Espacio eliminado correctamente");
                    this.verEspacios(); // Refrescamos la lista
                })
                .catch(err => alert("Error al borrar espacio: " + (err.mensaje || "Error desconocido")));
        },
        //Metodo auxliar para los menu segun eleccion
        mostrarMenu(menu) {
            // Primero, ocultamos todos los menús
            for (let key in this.menus) {
                this.menus[key] = false;
            }
            // Luego, mostramos solo el menú seleccionado
            this.menus[menu] = true;
        }
    }
}
</script>
<style></style>