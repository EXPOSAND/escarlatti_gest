<template>
<!--
H10.- Como ADMINISTRADOR quiero poder gestionar los DEPARTAMENTOS para
organizar al profesorado por áreas didácticas.

**SEGUN YO**
•SCRUM DEPARTAMENTOS:
-->
<div id="App">
   <div id="App">
        <div class="gestion_espacios">
            <h1>Gestión de Departamentos</h1>
            <div class="botones">
                <button @click="mostrarMenu('crear')">Crear Departamento</button>
                <button @click="mostrarMenu('editar')">Editar Departamento</button>
                <button @click="mostrarMenu('borrar')">Borrar Departamento</button>
                <button @click="mostrarMenu('lista')">Ver Lista de Departamentos</button>
            </div>
            <div v-if="menus.crear" id="menu_crear">
                <h3>Registrar Departamento</h3>
                Nombre del Departamento: <input v-model="departamento.nombre" type="text" /><br><br>
                Ubicacion: <input v-model="departamento.ubicacion" type="text" /><br><br>
                ID: <input v-model="departamento.id" type="number" /><br><br>
                Correo de contacto: <input v-model="departamento.correo_contacto" type="email" /><br><br>
                <button @click="crearDepartamentos">Confirmar Alta</button>
            </div>

            <div v-if="menus.editar" class="menu">
                Elija el ID del departamento a editar: <select v-model="departamento.id">
                    <option value="" disabled> --------- </option>
                    <option v-for="departamento in listaDepartamentos" :key="departamento.id" :value="departamento.id">
                        {{ departamento.nombre }}
                    </option>
                </select><br><br>
                <button @click="actualizarDepartamentos">Confirmar Edicion</button>
            </div>

            <div v-if="menus.borrar" class="menu">
                Elija el ID del departamento a borrar: <select v-model="departamento.id">
                    <option value="" disabled> --------- </option>
                    <option v-for="departamento in listaDepartamentos" :key="departamento.id" :value="departamento.id">
                        {{ departamento.nombre }}
                    </option>
                </select><br><br>
                <button @click="borrarDepartamentos(departamento)">Enviar</button>
            </div>

            <div v-if="menus.lista" id="menu_lista">
                <h3>Departamentos actuales</h3>
                <ul>
                    <li v-for="departamento in listaDepartamentos" :key="departamento.id">
                        {{ departamento.id }} - {{ departamento.nombre }} - {{ departamento.ubicacion }} - {{ departamento.correo_contacto }}
                    </li>
                </ul>
                <p v-if="listaDepartamentos.length === 0"><strong>No hay departamentos en la lista.</strong></p>
            </div>
        </div>
    </div> 
</div>
</template>
<script>
export default {
    name: 'Gestiona_Departamentos',
    data() {
        return {
            departamento: {
                id: "",
                nombre: "",
                ubicacion: "",
                correo_contacto: ""
            },
            listaDepartamentos: [],
            url: "http://100.52.46.68:3000/departamentos",
            menus: {
                crear: false,
                editar: false,
                borrar: false,
                lista: true // dejamps la lista abierta por defecto
            },
        }
    },
    mounted() {
        this.verDepartamentos();
    }, //No olvidar la puta coma de aqui
    methods: {
        crearDepartamentos() {
            // Validamos que los campos no estén vacíos en Vue antes de enviar
            if (!this.departamento.nombre || !this.departamento.descripcion || !this.departamento.id || !this.departamento.ubicacion || !this.departamento.correo_contacto) { //Si estan vacios le salto con error
                alert("No pueden haber campos vacios.");
                return;
            }

            fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.departamento) // Enviamos el objeto entero con los datos del nuevo departamento
            }).then(res => {
                if (!res.ok) return res.json().then(err => { throw err; });
                return res.json();
            }).then(() => {
                alert("Departamento creado con éxito");
                this.limpiarFormulario();
                this.verDepartamentos();
                this.mostrarMenu('crear'); //Cambio el metodo a false para que no se muestre el formulario de creacio de primeras

            }).catch(err => alert("Error: " + (err.mensaje)));
        },

        verDepartamentos() {
            fetch(this.url)
                .then(res => res.json())
                .then(datos => {
                    this.listaDepartamentos = Array.isArray(datos) ? datos : datos.departamentos || [];
                });
        },

        limpiarFormulario() {
            this.departamento.id = "";
            this.departamento.nombre = "";
            this.departamento.descripcion = "";
            this.departamento.ubicacion = "";
            this.departamento.correo_contacto = "";
        },

        actualizarDepartamentos() {

            fetch(this.url + '/' + this.departamento.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...this.departamento //Mando el departamento entero
                })
            }).then(res => {
                if (!res.ok) return res.json().then(err => { throw err; });
                return res.json();
            }).then(() => {
                alert("Departamento actualizado con éxito");
                this.limpiarFormulario();
                this.verDepartamentos();

            }).catch(err => alert("Error al actualizar departamento: " + (err.mensaje || "Error desconocido")));
        },

        borrarDepartamentos(departamento) {
            fetch(this.url + '/' + departamento.id, {
                method: 'DELETE'
            }).then(res => {
                    if (!res.ok) throw new Error("No se pudo eliminar el departamento");
                    return res.json();
                })
                .then(() => {
                    alert("Departamento eliminado correctamente");
                    this.verDepartamentos(); // Refrescamos la lista
                }).catch(err => alert("Error al borrar departamento: " + (err.mensaje || "Error desconocido")));
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