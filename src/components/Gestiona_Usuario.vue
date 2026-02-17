<template>
    <!--LO QUE TIENE QUE HACER ESTE SCRIPT:

    H7.- Como ADMINISTRADOR quiero poder gestionar los ESTADOS DE USUARIO para controlar el acceso y la situación académica de las personas.
    Criterios de Aceptación:
    • CA1: Al crear un nuevo usuario (Alumno o Profesor), el sistema asignará por defecto
    el estado "Activo".
    • CA2: Si el Administrador cambia el estado a uno que tenga "Permite Acceso = No",
    el usuario será expulsado de la aplicación inmediatamente si estaba conectado.

    H11.- Como ADMINISTRADOR quiero poder gestionar los ROLES DE USUARIO para definir los niveles de permisos y acceso.

    **SEGUN YO**
    •CRUD USUARIO: 
    •MODIFICAR ESTADO: 
    •MODIFICAR ROL:
    -->
    <div id="App">
        <div class="div_gestion_usuarios">
            <h1>Gestion de usuarios</h1>
            <div class="botones">
                <button @click="mostrarMenu('crear')">Crear Usuario</button>
                <button @click="mostrarMenu('editar')">Editar Usuario</button>
                <button @click="mostrarMenu('borrar')">Borrar Usuario</button>
                <button @click="mostrarMenu('lista')">Ver Lista de Usuarios</button>
            </div>
            <div v-if="menus.crear" id="menu_crear">
                <h3>Registrar Usuario</h3>
                Usuario: <input v-model="usuario.login" /><br><br>
                <!--el model me lo asocia con los datos del data(). Vas a meter esto en lo que se llama usuario.login del data-->
                Contraseña :<input v-model="usuario.password_hash" type="password" /><br><br>
                Rol: <select v-model="usuario.rol_id">
                    <option value="" disabled>Seleccione un Rol</option>
                    <option v-for="rol in rolesUsuario" :key="rol.id" :value="rol.id">
                        <!--Como los for each de PHP ligados con un select. El key es el indice del array. Hy que ponerlo-->
                        {{ rol.nombre }}
                        <!--El metodo cargarParametros saca los roles de la API, los guarda en rolesUsaurio que dije que era un array en el data, y me los muestra aqui-->
                    </option>
                </select><br><br>
                DNI o NIA: <input v-model="usuario.ref_identidad_fk" /><br><br>
                <button @click="crearUsuarios">Confirmar Alta</button>
            </div>

            <div v-if="menus.editar" class="menu">
                Elija el nombre del usuario a editar: <select v-model="usuario.login">
                    <option value="" disabled> --------- </option>
                    <option v-for="user in listaUsuarios" :key="user.id" :value="user.login">
                        {{ user.login }}
                    </option>
                </select><br><br>
                Nueva contraseña :<input v-model="usuario.password_hash" type="password" /><br><br>
                Nuevo rol: <select v-model="usuario.rol_id">
                    <option value="" disabled>Seleccione un Rol</option>
                    <option v-for="rol in rolesUsuario" :key="rol.id" :value="rol.id">
                        {{ rol.nombre }}
                    </option>
                </select><br><br>
                Nuevo DNI o NIA: <input v-model="usuario.ref_identidad_fk" /><br><br>
                Nuevo Estado: <select v-model="usuario.estado_id">
                    <option value="" disabled>Seleccione un Estado</option>
                    <option v-for="estado in estadosUsuario" :key="estado.id" :value="estado.id">
                        {{ estado.nombre }}
                    </option>
                </select>><br><br>
                <button @click="actualizarUsuarios">Confirmar Edicion</button>
            </div>

            <div v-if="menus.borrar" class="menu">
                Elija el nombre del usuario a borrar: <select v-model="usuario.login">
                    <option value="" disabled> --------- </option>
                    <option v-for="user in listaUsuarios" :key="user.id" :value="user.login">
                        {{ user.login }}
                    </option>
                </select><br><br>
                <button @click="borrarUsuarios(usuario)">Enviar</button>
            </div>

            <div v-if="menus.lista" id="menu_lista">
                <h3>Usuarios actuales</h3>
                <ul v-for="u in listaUsuarios" :key="u.login">
                    <li>{{ u.login }} - {{ u.rol_id }} - {{ u.estado_id }} - {{ u.ultimo_acceso }}</li>
                </ul>
                <p v-if="listaUsuarios.length === 0"><strong>No hay usuarios en la lista.</strong></p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            usuario: {
                login: "",
                password_hash: "",
                rol_id: "",
                ref_identidad_fk: "",
                estado_id: null,
                ultimo_acceso: null
            },
            listaUsuarios: [],
            rolesUsuario: [], //De aqui me va a sacar los select del form
            estadosUsuario: [],
            url: "http://100.52.46.68:3000/usuarios",
            mostrar: ["crear", "listar", "editar", "borrar"], // Para controlar qué formulario mostrar
            menus: {
                crear: false,
                editar: false,
                borrar: false,
                lista: true // dejamps la lista abierta por defecto
            },
        }
    },
    mounted() {
        this.cargarParametros();
        this.verUsuarios();
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
            if (activo) this.usuario.estado_id = activo.id;
        },

        crearUsuarios() {
            // Validamos que los campos no estén vacíos en Vue antes de enviar
            if (!this.usuario.login || !this.usuario.rol_id || !this.usuario.ref_identidad_fk) { //Si estan vacios le salto con error
                alert("No pueden haber campos vacios.");
                return;
            }

            fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.usuario) // Enviamos el objeto entero con los datos del nuevo alumno. El estado_id ya lo tenemos puesto por defecto en el data() gracias a la función cargarParametros que se ejecuta al montar el componente.
            })
                .then(res => {
                    if (!res.ok) return res.json().then(err => { throw err; });
                    return res.json();
                })
                .then(() => {
                    alert("Usuario creado con éxito");
                    this.limpiarFormulario();
                    this.verUsuarios();
                    this.mostrarMenu('crear'); //Cambio el metodo a false para que no se muestre el formulario de creacio de primeras

                })
                .catch(err => alert("Error: " + (err.mensaje || "El DNI/NIA debe existir en la tabla de Profesores o Alumnos")));
        },

        verUsuarios() {
            fetch(this.url)
                .then(res => res.json())
                .then(datos => { //Aqui me devuelve mis datos del servidor
                    this.listaUsuarios = Array.isArray(datos) ? datos : datos.usuarios;
                });
        },

        limpiarFormulario() {
            this.usuario.login = "";
            this.usuario.password_hash = "";
            this.usuario.ref_identidad_fk = "";
            // Mantenemos el estado_id en "Activo"
        },

        actualizarUsuarios() {

            fetch(this.url + '/' + this.usuario.login, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.usuario)
            })
                .then(res => {
                    if (!res.ok) return res.json().then(err => { throw err; });
                    return res.json();
                })
                .then(() => {
                    alert("Usuario actualizado con éxito");
                    this.limpiarFormulario();
                    this.verUsuarios();
                })
                .catch(err => alert("Error: " + (err.mensaje || "Datos inválidos")));
        },

        borrarUsuarios(usuario) {
            if (usuario.rol_id === 3) { // Asumiendo que 3 es Profesor
                const confirmar = confirm("Este usuario es un Profesor. ¿Deseas cancelar también sus reservas activas?");
                if (!confirmar) return; // Si cancela, no borramos
            }

            // 3. Ejecutamos el DELETE usando el LOGIN en la URL
            fetch(this.url + '/' + usuario.login, {
                method: 'DELETE'
            })
                .then(res => {
                    if (!res.ok) throw new Error("No se pudo eliminar");
                    return res.json();
                })
                .then(() => {
                    alert("Usuario eliminado correctamente");
                    this.verUsuarios(); // Refrescamos la lista
                })
                .catch(err => alert("Error: " + err.message));
        },

        mostrarMenu(nombreMenu) {
            // 1. Guardamos el estado actual del menú que queremos tocar
            const estadoActual = this.menus[nombreMenu];

            // 2. Ponemos TODOS los menús a false (reset general)
            // Esto evita que se solapen formularios
            Object.keys(this.menus).forEach(key => {
                this.menus[key] = false;
            });

            // 3. Al menú seleccionado le damos el valor contrario al que tenía
            // Si estaba false (cerrado), se pone true (abierto).
            this.menus[nombreMenu] = !estadoActual;
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
    height: 400px;
    margin: auto;
    margin-top: 30px;
    padding: 20px;
}

#menu_crear {
    background-color: whitesmoke;
    border: 4px solid #272D2D;
    border-radius: 7px;
    width: 400px;
    height: 400px;
    margin: auto;
    margin-top: 30px;
}

#menu_lista {
    background-color: whitesmoke;
    border: 4px solid #272D2D;
    border-radius: 7px;
    width: 400px;
    height: 400px;
    margin: auto;
    margin-top: 30px;
    overflow-y: auto;
    /* Agrega scroll vertical si el contenido excede la altura */
}
</style>