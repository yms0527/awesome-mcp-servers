<template>
  <v-app>
    <VAppBar :elevation="2">
      <v-app-bar-title>
        <router-link to="/" class="app-title-link">
          학습 보조 서비스
        </router-link>
      </v-app-bar-title>
    </VAppBar>

    <VMain>
      <RouterView/>
    </VMain>
  </v-app>
</template>

<style>
.v-app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.app-title-link {
  text-decoration: none;
  color: inherit;
  font-weight: bold;
}

.app-title-link:hover {
  opacity: 0.7;
  transition: 0.2s;
}

</style>
