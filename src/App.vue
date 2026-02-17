<template>
  <div id="app">
    <h1>Bienvenido a la Gestión Escolar</h1>
    <p>Ingrese sus credenciales</p>
  </div>
  <nav class="menu-principal">
    <router-link to="/usuarios">Usuarios</router-link>
    <router-link to="/alumnos">Alumnos</router-link>
    <router-link to="/profesores">Profesores</router-link>
    <router-link to="/cursos">Cursos</router-link>
    <router-link to="/incidencias">Incidencias</router-link>
    <router-link to="/etapas">Etapas</router-link>
    <router-link to="/espacios">Espacios</router-link>
    <router-link to="/departamentos">Departamentos</router-link>
    <router-link to="/turnos">Turnos</router-link>
  </nav>

  <router-view />
</template>

<script>
//const zusuario = "exposand";
export default {
  name: 'App',
  data() {
    return {
      usuario: "",
      contrasena: "",
      listaUsuarios: [],
    }
  },
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
