<template>
    <!--LO QUE TIENE QUE HACER ESTE SCRIPT: SOLO SI ES ADMIN
    H3.- Como ADMINISTRADOR quiero poder gestionar la información de los PROFESORES para controlar el acceso al sistema de reservas.

    Criterios de Aceptación:
    •CA1: El sistema debe impedir el alta de dos profesores con el mismo DNI o correo.
    •CA2: Al eliminar un profesor, el sistema debe preguntar qué hacer con sus reservas activas (cancelarlas o mantenerlas).

    **SEGUN YO**
    •CREAR PROFESOR: .
    •MODIFICAR PROFESOR: 
    •BORRAR PROFESOR: 
    •FILTRAR PROFESOR POR AREA DIDACTICA: 
    -->

    <div id="App">
        <div class="gestion_profesores">
            <h1>Gestión de Profesores</h1>
            <div class="botones">
                <button @click="mostrarMenu('crear')">Crear Profesor</button>
                <button @click="mostrarMenu('editar')">Editar Profesor</button>
                <button @click="mostrarMenu('borrar')">Borrar Profesor</button>
                <button @click="mostrarMenu('lista')">Ver Lista de Profesores</button>
            </div>
            <div v-if="menus.crear" id="menu_crear">
                <h3>Registrar Profesor</h3>
                DNI/NIE: <input v-model="profesor.dni_nie" /><br><br>
                Nombre :<input v-model="profesor.nombre" type="text" /><br><br>
                Apellidos :<input v-model="profesor.apellidos" type="text" /><br><br>
                Departamento: <input v-model="profesor.departamento_id" type="number" /><br><br>
                Correo institucional: <input v-model="profesor.correo_institucional" type="email" /><br><br>
                Rol ID: <input v-model="profesor.rol_id" type="number" /><br><br>
                Contraseña hash: <input v-model="profesor.password_hash" type="password" /><br><br>
                <button @click="crearProfesores">Confirmar Alta</button>
            </div>

            <div v-if="menus.editar" class="menu">
                Elija el DNI del profesor a editar: <select v-model="profesor.dni_nie">
                    <option value="" disabled> --------- </option>
                    <option v-for="profesor in listaProfesores" :key="profesor.id" :value="profesor.dni_nie">
                        {{ profesor.dni_nie }}
                    </option>
                </select><br><br>
                <button @click="actualizarProfesores">Confirmar Edicion</button>
            </div>

            <div v-if="menus.borrar" class="menu">
                Elija el DNI del profesor a borrar: <select v-model="profesor.dni_nie">
                    <option value="" disabled> --------- </option>
                    <option v-for="profesor in listaProfesores" :key="profesor.id" :value="profesor.dni_nie">
                        {{ profesor.dni_nie }}
                    </option>
                </select><br><br>
                <button @click="borrarProfesores(profesor)">Enviar</button>
            </div>

            <div v-if="menus.lista" id="menu_lista">
                <h3>Profesores actuales</h3>
                <ul>
                    <li v-for="profesor in listaProfesores" :key="profesor.dni_nie">
                        {{ profesor.dni_nie }} - {{ profesor.nombre }} - {{ profesor.apellidos }} - {{
                            profesor.departamento_id }} - {{ profesor.correo_institucional }} - {{ profesor.rol_id }}
                    </li>
                </ul>
                <p v-if="listaProfesores.length === 0"><strong>No hay profesores en la lista.</strong></p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Gestiona_Profesores',
    data() {
        return {
            profesor: {
                dni_nie: "",
                nombre: "",
                apellidos: "",
                correo_institucional: "",
                departamento_id: "",
                rol_id: "",
                password_hash: "",
                estado_id: 1, //Activo por defecto, el estado_id lo tenemos que poner si o si porque es un campo obligatorio en la base de datos y no queremos que nos de error al crear un nuevo profesor. El ID 1 corresponde al estado "Activo" que ya tenemos en la base de datos, por eso lo ponemos directamente aqui.
            },
            rolesUsuario: [], 
            estadosUsuario: [],
            listaProfesores: [],
            url: "http://100.52.46.68:3000/profesores",
            menus: {
                crear: false,
                editar: false,
                borrar: false,
                lista: true // dejamps la lista abierta por defecto
            },
        }
    },
    mounted() {
        this.cargarParametros(); // Carga los roles y estados que estan en la API para tenerlos listos al crear un nuevo profesor 
        this.verProfesores(); // Carga la lista de profesores al iniciar el componente
    },
    methods: {
        async cargarParametros() {
            const [resRoles, resEstados] = await Promise.all([
                fetch('http://100.52.46.68:3000/roles'), //Saco mis roles de la API, me los gusardo en rolesUsuario que es un array.
                fetch('http://100.52.46.68:3000/estados_usuario')
            ]);
            this.rolesUsuario = await resRoles.json();
            this.estadosUsuario = await resEstados.json();

            // H7-CA1: Buscamos el ID del estado "Activo" para tenerlo listo
            const activo = this.estadosUsuario.find(e => e.nombre === 'Activo');
            if (activo) this.profesor.estado_id = activo.id;
        },

        crearProfesores() {
            // Validamos que los campos no estén vacíos en Vue antes de enviar
            if (!this.profesor.dni_nie || !this.profesor.nombre || !this.profesor.apellidos || !this.profesor.departamento_id || !this.profesor.correo_institucional || !this.profesor.rol_id || !this.profesor.password_hash) { //Si estan vacios le salto con error
                alert("No pueden haber campos vacios.");
                return;
            }

            const datosAEnviar = {
                ...this.profesor,
                dni: this.profesor.dni_nie.toString(),
                departamento_id: parseInt(this.profesor.departamento_id) // Hay que paresar est wea
            };

            fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosAEnviar) // Enviamos el objeto entero con los datos del nuevo profesor
            }).then(res => {
                if (!res.ok) return res.json().then(err => { throw err; });
                return res.json();
            }).then(() => {
                alert("Profesor creado con éxito");
                this.limpiarFormulario();
                this.verProfesores();
                this.mostrarMenu('crear'); //Cambio el metodo a false para que no se muestre el formulario de creacio de primeras

            })
                .catch(err => alert("Error: " + (err.mensaje)));
        },

        verProfesores() {
            fetch(this.url)
                .then(res => res.json())
                .then(datos => {
                    this.listaProfesores = Array.isArray(datos) ? datos : datos.profesores || [];
                });
        },

        limpiarFormulario() {
            this.profesor.dni_nie = "";
            this.profesor.nombre = "";
            this.profesor.apellidos = "";
            this.profesor.departamento_id = "";
            this.profesor.correo_institucional = "";
            this.profesor.rol_id = "";
            this.profesor.password_hash = "";
        },

        actualizarProfesores() {

            fetch(this.url + '/' + this.profesor.dni_nie, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...this.profesor,
                    dni: this.profesor.dni_nie.toString(),
                    departamento_id: parseInt(this.profesor.departamento_id)
                })
            }).then(res => {
                if (!res.ok) return res.json().then(err => { throw err; });
                return res.json();
            }).then(() => {
                alert("Profesor actualizado con éxito");
                this.limpiarFormulario();
                this.verProfesores();

            }).catch(err => alert("Error al actualizar profesor: " + (err.mensaje || "Error desconocido")));
        },

        borrarProfesores(profesor) {
            fetch(this.url + '/' + profesor.dni_nie, {
                method: 'DELETE'
            })
                .then(res => {
                    if (!res.ok) throw new Error("No se pudo eliminar el profesor");
                    return res.json();
                })
                .then(() => {
                    alert("Profesor eliminado correctamente");
                    this.verProfesores(); // Refrescamos la lista
                })
                .catch(err => alert("Error al borrar profesor: " + (err.mensaje || "Error desconocido")));
        },
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