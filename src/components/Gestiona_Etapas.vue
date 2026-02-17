<template>

<!--

H8.- Como ADMINISTRADOR quiero poder gestionar las ETAPAS EDUCATIVAS para
categorizar los niveles de enseñanza del centro.

Criterios de Aceptación:
• CA1: No se puede eliminar una Etapa si existen Cursos vinculados a ella.
• CA2: El sistema debe permitir la edición del nombre si cambia la denominación
oficial por ley educativa.

**SEGUN YO**
•SCRUM ETAPAS:
-->
    <div id="App">
        <div class="gestion_etapas">
            <h1>Gestión de Etapas Educativas</h1>
            <div class="botones">
                <button @click="mostrarMenu('crear')">Crear Etapa</button>
                <button @click="mostrarMenu('editar')">Editar Etapa</button>
                <button @click="mostrarMenu('borrar')">Borrar Etapa</button>
                <button @click="mostrarMenu('lista')">Ver Lista de Etapas</button>
            </div>
            <div v-if="menus.crear" id="menu_crear">
                <h3>Registrar Etapa</h3>
                Nombre de la Etapa: <input v-model="etapa.nombre" type="text" /><br><br>
                Descripción: <input v-model="etapa.descripcion" type="text" /><br><br>
                ID: <input v-model="etapa.id" type="number" /><br><br>
                <button @click="crearEtapa">Confirmar Alta</button>
            </div>

            <div v-if="menus.editar" class="menu">
                Elija el ID de la etapa a editar: <select v-model="etapa.id">
                    <option value="" disabled> --------- </option>
                    <option v-for="etapa in listaEtapas" :key="etapa.id" :value="etapa.id">
                        {{ etapa.nombre }}
                    </option>
                </select><br><br>
                <button @click="actualizarEtapa">Confirmar Edicion</button>
            </div>

            <div v-if="menus.borrar" class="menu">
                Elija el ID del curso a borrar: <select v-model="etapa.id">
                    <option value="" disabled> --------- </option>
                    <option v-for="etapa in listaEtapas" :key="etapa.id" :value="etapa.id">
                        {{ etapa.nombre }}
                    </option>
                </select><br><br>
                <button @click="borrarEtapa(etapa)">Enviar</button>
            </div>

            <div v-if="menus.lista" id="menu_lista">
                <h3>Etapas actuales</h3>
                <ul>
                    <li v-for="etapa in listaEtapas" :key="etapa.id">
                        {{ etapa.id }} - {{ etapa.nombre }} - {{ etapa.descripcion }}
                    </li>
                </ul>
                <p v-if="listaEtapas.length === 0"><strong>No hay etapas en la lista.</strong></p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Gestiona_Etapas',
    data() {
        return {
            etapa: {
                id: "",
                nombre: "",
                descripcion: ""
            },
            listaEtapas: [],
            url: "http://100.52.46.68:3000/etapas",
            menus: {
                crear: false,
                editar: false,
                borrar: false,
                lista: true // dejamps la lista abierta por defecto
            },
        }
    },
    mounted() {
        this.verEtapas();
    }, //No olvidar la puta coma de aqui
    methods: {
        crearEtapas() {
            // Validamos que los campos no estén vacíos en Vue antes de enviar
            if (!this.etapa.nombre || !this.etapa.descripcion || !this.etapa.id) { //Si estan vacios le salto con error
                alert("No pueden haber campos vacios.");
                return;
            }

            fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.etapa) // Enviamos el objeto entero con los datos del nuevo profesor
            }).then(res => {
                if (!res.ok) return res.json().then(err => { throw err; });
                return res.json();
            }).then(() => {
                alert("Etapa creada con éxito");
                this.limpiarFormulario();
                this.verEtapas();
                this.mostrarMenu('crear'); //Cambio el metodo a false para que no se muestre el formulario de creacio de primeras

            }).catch(err => alert("Error: " + (err.mensaje)));
        },

        verEtapas() {
            fetch(this.url)
                .then(res => res.json())
                .then(datos => {
                    this.listaEtapas = Array.isArray(datos) ? datos : datos.etapas || [];
                });
        },

        limpiarFormulario() {
            this.etapa.id = "";
            this.etapa.nombre = "";
            this.etapa.descripcion = "";
        },

        actualizarEtapas() {

            fetch(this.url + '/' + this.etapa.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...this.etapa //Mando la etapa entera
                })
            }).then(res => {
                if (!res.ok) return res.json().then(err => { throw err; });
                return res.json();
            }).then(() => {
                alert("Etapa actualizada con éxito");
                this.limpiarFormulario();
                this.verEtapas();

            }).catch(err => alert("Error al actualizar etapa: " + (err.mensaje || "Error desconocido")));
        },

        borrarEtapas(etapa) {
            fetch(this.url + '/' + etapa.id, {
                method: 'DELETE'
            })
                .then(res => {
                    if (!res.ok) throw new Error("No se pudo eliminar la etapa");
                    return res.json();
                })
                .then(() => {
                    alert("Etapa eliminada correctamente");
                    this.verEtapas(); // Refrescamos la lista
                })
                .catch(err => alert("Error al borrar etapa: " + (err.mensaje || "Error desconocido")));
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