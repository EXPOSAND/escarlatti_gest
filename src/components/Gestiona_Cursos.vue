<template>
    <!--LO QUE TIENE QUE HACER ESTE SCRIPT: SOLO SI ES ADMIN

    H5.- Como ADMINISTRADOR quiero poder gestionar los CURSOS para organizar la
    asignación de alumnos y tutores.

    Criterios de Aceptación:
    
    • CA1: Integridad Referencial. El sistema no debe permitir borrar un curso si todavía
    tiene Alumnos asociados a él.
    • CA2: Validación de Tutoría. Un profesor solo puede ser tutor de un curso por año
    académico. El sistema debe lanzar una advertencia si se intenta asignar al mismo
    tutor a dos cursos distintos.
    • CA4: Listado de Alumnos. Al visualizar un curso, el sistema debe mostrar una lista
    de todos los alumnos vinculados.

**SEGUN YO**
•SCRUM CURSO:
    -->
    <div id="App">
        <div class="gestion_cursos">
            <h1>Gestión de Cursos</h1>
            <div class="botones">
                <button @click="mostrarMenu('crear')">Crear Curso</button>
                <button @click="mostrarMenu('editar')">Editar Curso</button>
                <button @click="mostrarMenu('borrar')">Borrar Curso</button>
                <button @click="mostrarMenu('lista')">Ver Lista de Cursos</button>
            </div>
            <div v-if="menus.crear" id="menu_crear">
                <h3>Registrar Curso</h3>
                Nombre del Curso: <input v-model="curso.nombre_curso" type="text" /><br><br>
                Etapa ID: <input v-model="curso.etapa_id" type="number" /><br><br>
                Grupo: <input v-model="curso.grupo" type="text" /><br><br>
                Turno ID: <input v-model="curso.turno_id" type="number" /><br><br>
                Año Académico: <input v-model="curso.anio_academico" type="text" /><br><br>
                Tutor ID: <input v-model="curso.tutor_id" type="number" /><br><br>
                Aula ID: <input v-model="curso.aula_id" type="number" /><br><br>
                <button @click="crearCurso">Confirmar Alta</button>
            </div>

            <div v-if="menus.editar" class="menu">
                Elija el ID del curso a editar: <select v-model="curso.id">
                    <option value="" disabled> --------- </option>
                    <option v-for="curso in listaCursos" :key="curso.id" :value="curso.id">
                        {{ curso.nombre_curso }}
                    </option>
                </select><br><br>
                <button @click="actualizarCurso">Confirmar Edicion</button>
            </div>

            <div v-if="menus.borrar" class="menu">
                Elija el ID del curso a borrar: <select v-model="curso.id">
                    <option value="" disabled> --------- </option>
                    <option v-for="curso in listaCursos" :key="curso.id" :value="curso.id">
                        {{ curso.nombre_curso }}
                    </option>
                </select><br><br>
                <button @click="borrarCurso(curso)">Enviar</button>
            </div>

            <div v-if="menus.lista" id="menu_lista">
                <h3>Cursos actuales</h3>
                <ul>
                    <li v-for="curso in listaCursos" :key="curso.id">
                        {{ curso.id }} - {{ curso.nombre_curso }} - {{ curso.etapa_id }} - {{ curso.grupo }} - {{

                            curso.tutor_id }} - {{ curso.aula_id }}
                    </li>
                </ul>
                <p v-if="listaCursos.length === 0"><strong>No hay cursos en la lista.</strong></p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Gestiona_Cursos',
    data() {
        return {
            curso: {
                id: null,
                nombre_curso: "",
                etapa_id: null,
                grupo: "",
                turno_id: null,
                anio_academico: "2025-2026",
                tutor_id: null,
                aula_id: null
            },
            listaCursos: [],
            // IMPORTANTE: Declarar estas listas para que cargarParametros funcione
            rolesUsuario: [],
            estadosUsuario: [],
            url: "http://100.52.46.68:3000/cursos",
            menus: {
                crear: false,
                editar: false,
                borrar: false,
                lista: true
            }
        }
    },
    mounted() {
        // Solo cargamos parámetros si realmente necesitas los roles/estados aquí
        this.cargarParametros();
        this.verCursos();
    },
    methods: {
        async cargarParametros() {
            try {
                const [resRoles, resEstados] = await Promise.all([
                    fetch('http://100.52.46.68:3000/roles'),
                    fetch('http://100.52.46.68:3000/estados_usuario')
                ]);
                this.rolesUsuario = await resRoles.json();
                this.estadosUsuario = await resEstados.json();
            } catch (err) {
                console.error("Error cargando parámetros:", err);
            }
        },

        verCursos() {
            fetch(this.url)
                .then(res => res.json())
                .then(datos => {
                    this.listaCursos = Array.isArray(datos) ? datos : (datos.cursos || []);
                    console.log("Cursos cargados:", this.listaCursos);
                })
                .catch(err => console.error("Error al cargar cursos:", err));
        },
        crearCurso() {
            // 1. Validación: que no manden campos vacíos importantes
            if (!this.curso.nombre_curso || !this.curso.grupo) {
                alert("Nombre y Grupo son obligatorios");
                return;
            }

            // 2. PARSEO: Convertimos lo que viene del input a Números Reales
            const datosAEnviar = {
                nombre_curso: this.curso.nombre_curso,
                etapa_id: parseInt(this.curso.etapa_id),
                grupo: this.curso.grupo,
                turno_id: parseInt(this.curso.turno_id),
                anio_academico: this.curso.anio_academico,
                tutor_id: parseInt(this.curso.tutor_id),
                aula_id: parseInt(this.curso.aula_id)
            };

            fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosAEnviar) // Enviamos los datos limpios
            })
                .then(res => {
                    if (!res.ok) return res.json().then(err => { throw err; });
                    return res.json();
                })
                .then(() => {
                    alert("Curso creado correctamente");
                    this.limpiarFormulario(); // Limpiamos los inputs
                    this.verCursos();         // Refrescamos la lista
                    this.mostrarMenu('lista'); // Volvemos a la lista
                })
                .catch(err => {
                    console.error("Error al crear:", err);
                    alert("Error: Los IDs (Etapa, Tutor, Aula) deben existir en la base de datos.");
                });
        },

        // Añade este método que te faltaba para que el botón de alta limpie todo
        limpiarFormulario() {
            this.curso = {
                id: null,
                nombre_curso: "",
                etapa_id: null,
                grupo: "",
                turno_id: null,
                anio_academico: "2025-2026",
                tutor_id: null,
                aula_id: null
            };
        },

    },

    actualizarCurso() {
        if (!this.curso.id) {
            alert("Por favor, seleccione un curso para editar.");
            return;
        }
        fetch(`${this.url}/${this.curso.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.curso)
        })
            .then(res => res.json())
            .then(datos => {
                console.log("Curso actualizado:", datos);
                this.verCursos();
            })
            .catch(err => console.error("Error al actualizar curso:", err));
    },

    borrarCurso(curso) {
        if (!curso.id) {
            alert("Por favor, seleccione un curso para borrar.");
            return;
        }
        fetch(`${this.url}/${curso.id}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (res.ok) {
                    console.log("Curso borrado:", curso);
                    this.verCursos();
                } else {
                    console.error("Error al borrar curso:", res.statusText);
                }
            })
            .catch(err => console.error("Error al borrar curso:", err));
    },

    limpiarFormulario() {
        this.curso = {
            id: null,
            nombre_curso: "",
            etapa_id: null,
            grupo: "",
            turno_id: null,
            anio_academico: "2025-2026",
            tutor_id: null,
            aula_id: null
        };
    },

    mostrarMenu(nombre) {
        Object.keys(this.menus).forEach(k => {
            this.menus[k] = (k === nombre);
        });
    }
}

</script>