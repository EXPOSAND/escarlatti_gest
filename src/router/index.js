import { createRouter, createWebHistory } from 'vue-router';

import Gestiona_Usuario from '../components/Gestiona_Usuario.vue';
import Gestiona_Alumnos from '../components/Gestiona_Alumnos.vue';
import Gestiona_Profesores from '../components/Gestiona_Profesores.vue';
import Gestiona_Cursos from '../components/Gestiona_Cursos.vue';
import Gestiona_Incidencias from '../components/Gestiona_Incidencias.vue';
import Gestiona_Turnos from '../components/Gestiona_Turnos.vue';
import Gestiona_Espacios from '../components/Gestiona_Espacios.vue';
import Gestiona_Departamentos from '../components/Gestiona_Departamentos.vue';

const routes = [
  { path: '/usuarios', name: 'Usuarios', component: Gestiona_Usuario },
  { path: '/alumnos', name: 'Alumnos', component: Gestiona_Alumnos },
  { path: '/profesores', name: 'Profesores', component: Gestiona_Profesores },
  { path: '/cursos', name: 'Cursos', component: Gestiona_Cursos },
  { path: '/incidencias', name: 'Incidencias', component: Gestiona_Incidencias },
  { path: '/turnos', name: 'Turnos', component: Gestiona_Turnos },
  { path: '/espacios', name: 'Espacios', component: Gestiona_Espacios },
  { path: '/departamentos', name: 'Departamentos', component: Gestiona_Departamentos },
  { path: '/', redirect: '/usuarios' } // Si entras a la raíz, te manda a usuarios
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;