<template>
    <!--LO QUE TIENE QUE HACER ESTE SCRIPT: SOLO SI ES ADMIN
    H4.- Como ADMINISTRADOR quiero poder gestionar la información de los ALUMNOS para que puedan reportar incidencias.

    **SEGUN YO**
    •CREAR ALUMNO: 
    •MODIFICAR ALUMNO: 
    •BORRAR ALUMNO:
    •VER LISTA DE ALUMNOS: 
    -->
    <div id="App">
        <div class="div_gestion_alumnos">
            <h1>Gestion de alumnos</h1>
            <div class="botones">
                <button @click="mostrarMenu('crear')">Crear Alumno</button>
                <button @click="mostrarMenu('editar')">Editar Alumno</button>
                <button @click="mostrarMenu('borrar')">Borrar Alumno</button>
                <button @click="mostrarMenu('lista')">Ver Lista de Alumnos</button>
            </div>
            <div v-if="menus.crear" id="menu_crear">
                <h3>Registrar Alumno</h3>
                NIA: <input v-model="alumno.nia" /><br><br>
                <!--RECORDAR: el model me lo asocia con los datos del data(). Vas a meter esto en lo que se llama usuario.login del data-->
                Nombre :<input v-model="alumno.nombre" type="text" /><br><br>
                Apellidos :<input v-model="alumno.apellidos" type="text" /><br><br>
                Curso: <input v-model="alumno.curso_id" type="number" /><br><br>
                Correo electrónico: <input v-model="alumno.correo_electronico" type="email" /><br><br>
                Contacto tutor legal: <input v-model="alumno.tutor_legal_contacto" type="text" /><br><br>
                <button @click="crearAlumnos">Confirmar Alta</button>
            </div>

            <div v-if="menus.editar" id="menu_editar">
                Elija el nombre del alumno a editar: <select v-model="alumno.nombre">
                    <option value="" disabled> --------- </option>
                    <option v-for="al in listaAlumnos" :key="al.id" :value="al.nombre">
                        {{ al.nombre }}
                    </option>
                </select><br><br>
                Nueva contraseña :<input v-model="alumno.password_hash" type="password" /><br><br>
                Nuevo rol: <select v-model="alumno.rol_id">
                    <option value="" disabled>Seleccione un Rol</option>
                    <option v-for="rol in rolesUsuario" :key="rol.id" :value="rol.id">
                        {{ rol.nombre }}
                    </option>
                </select><br><br>
                Nuevo DNI o NIA: <input v-model="alumno.ref_identidad_fk" /><br><br>
                Nuevo Estado: 
                <select v-model="alumno.estado_id">
                    <option value="" disabled>Seleccione un Estado</option>
                    <option v-for="estado in estadosUsuario" :key="estado.id" :value="estado.id">
                        {{ estado.nombre }}
                    </option>
                </select><br><br>
                <!---<button @click="actualizarAlumnos">Confirmar Edicion</button>-->
            </div>

            <div v-if="menus.borrar" id="menu_borrar">
                Elija el NIA del alumno a borrar: <select v-model="alumno.nia">
                    <option value="" disabled> --------- </option>
                    <option v-for="alumno in listaAlumnos" :key="alumno.id" :value="alumno.nia">
                        {{ alumno.nia }}
                    </option>
                </select><br><br>
                <!---<button @click="borrarAlumnos()">Enviar</button>-->
            </div>

            <div v-if="menus.lista" id="menu_lista">
                <h3>Alumnos actuales</h3>
                <ul>
                    <li v-for="alumno in listaAlumnos" :key="alumno.nia">
                        {{ alumno.nia }} - {{ alumno.nombre }} - {{ alumno.apellidos }} - {{ alumno.curso_id }} - {{
                            alumno.correo_electronico }} - {{ alumno.tutor_legal_contacto }} - {{ alumno.estado_id }} - 
                            {{ alumno.ultimo_acceso }}
                    </li>
                </ul>
                <p v-if="listaAlumnos.length === 0"><strong>No hay alumnos en la lista.</strong></p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Gestiona_Alumnos',
    data() {
        return {
            alumno: {
                nia: "",
                nombre: "",
                apellidos: "",
                curso_id: "",
                correo_electronico: "",
                tutor_legal_contacto: "",
                estado_id: 1, //Activo por defecto
            },
            listaAlumnos: [],
            url: "http://100.52.46.68:3000/alumnos",
            menus: {
                crear: false,
                editar: false,
                borrar: false,
                lista: true // dejamps la lista abierta por defecto
            },
        }
    },
    mounted() {
        this.verAlumnos(); // Carga la lista de alumnos al iniciar el componente
    },
    methods: {
        crearAlumnos() {
            // Validamos que los campos no estén vacíos en Vue antes de enviar
            if (!this.alumno.nia || !this.alumno.nombre || !this.alumno.apellidos || !this.alumno.curso_id || !this.alumno.correo_electronico || !this.alumno.tutor_legal_contacto) { //Si estan vacios le salto con error
                alert("No pueden haber campos vacios.");
                return;
            }

            const datosAEnviar = {
                ...this.alumno,
                nia: this.alumno.nia.toString(),
                curso_id: parseInt(this.alumno.curso_id) // Hay que paresar est wea
            };

            const fechaHoy = new Date().toISOString(); // Obtenemos la fecha actual en formato YYYY-MM-DD

            this.alumno.ultimo_acceso = fechaHoy; // Asignamos la fecha actual al campo ultimo_acceso

            fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosAEnviar) // Enviamos el objeto entero con los datos del nuevo alumno
            })
                .then(res => {
                    if (!res.ok) return res.json().then(err => { throw err; });
                    return res.json();
                })
                .then(() => {
                    alert("Alumno creado con éxito");
                    this.limpiarFormulario();
                    this.verAlumnos();
                    this.mostrarMenu('crear'); //Cambio el metodo a false para que no se muestre el formulario de creacio de primeras

                })
                .catch(err => alert("Error: " + (err.mensaje)));
        },

        verAlumnos() {
            fetch(this.url)
                .then(res => res.json())
                .then(datos => {
                    this.listaAlumnos = Array.isArray(datos) ? datos : datos.alumnos || [];
                });
        },

        limpiarFormulario() {
            this.alumno.nia = "";
            this.alumno.nombre = "";
            this.alumno.apellidos = "";
            this.alumno.curso_id = "";
            this.alumno.correo_electronico = "";
            this.alumno.tutor_legal_contacto = "";
            this.alumno.estado_id = 1; //Activo por defecto
        },

        actualizarAlumnos() {

            fetch(this.url + '/' + this.alumno.nia, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...this.alumno,
                    nia: this.alumno.nia.toString(),
                    curso_id: parseInt(this.alumno.curso_id)
                })
            })
                .then(res => {
                    if (!res.ok) return res.json().then(err => { throw err; });
                    return res.json();
                })
                .then(() => {
                    alert("Alumno actualizado con éxito");
                    this.limpiarFormulario();
                    this.verAlumnos();
                })
                .catch(err => alert("Error: " + (err.mensaje || "Datos inválidos")));
        },

        borrarAlumnos(alumno) {
            // 3. Ejecutamos el DELETE usando el NIA en la URL
            fetch(this.url + '/' + alumno.nia, {
                method: 'DELETE'
            })
                .then(res => {
                    if (!res.ok) throw new Error("No se pudo eliminar");
                    return res.json();
                })
                .then(() => {
                    alert("Alumno eliminado correctamente");
                    this.verAlumnos(); // Refrescamos la lista
                })
                .catch(err => alert("Error: " + err.message));
        },

        mostrarMenu(nombreMenu) {
            // Primero, ocultamos todos los menús
            for (let key in this.menus) {
                this.menus[key] = false;
            }
            // Luego, mostramos solo el menú seleccionado
            this.menus[nombreMenu] = true;
        }
    }
}
</script>
<style>
body {
    margin: 0;
    padding: 0;
    background-color: #7dcc9e;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#div_principal {
    background-color: whitesmoke;
    width: 700px;
    height: 500px;
    border: 4px solid #272D2D;
    border-radius: 10px;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    flex-direction: column;
}

h1 {
    color: #272D2D;
}

.botones {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    /* Permite que los botones bajen de línea si no caben */
    gap: 10px;
}

button {
    color: #EDF5FC;
    background-color: #272D2D;
    border: 2px solid #43a879;
    border-radius: 7px;
    padding: 20px;
    margin: 5px;
    margin-right: 15px;
    ;
    font-size: 16px;
}

h3 {
    font-size: 22px;
    text-align: center;
    margin-top: 40px;
    ;
}

.menu {
    background-color: whitesmoke;
    border: 4px solid #272D2D;
    border-radius: 7px;
    width: 400px;
    height: auto;
    margin: auto;
    margin-top: 30px;
    padding: 20px;
    overflow-y: auto;
}

#menu_crear {
    background-color: whitesmoke;
    border: 4px solid #272D2D;
    border-radius: 7px;
    width: 400px;
    height: auto;
    margin: auto;
    margin-top: 30px;
    overflow-y: auto;
}

#menu_lista {
    background-color: whitesmoke;
    border: 4px solid #272D2D;
    border-radius: 7px;
    width: 400px;
    height: auto;
    margin: auto;
    margin-top: 30px;
    overflow-y: auto;
    /* Agrega scroll vertical si el contenido excede la altura */
}
</style>