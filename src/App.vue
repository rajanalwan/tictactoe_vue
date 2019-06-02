<template>
  <div id="app" class="container-fluid">
    <div class="nav">
      <router-link to="/" :class="{'active': $route.path === '/'}">Home</router-link>
      <router-link to="/about" :class="{'active': $route.path === '/about'}">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans:300&display=swap");

body {
  color: #eee;
  background-color: #141719;
}
a {
  text-decoration: none !important;
}
.container-fluid {
  width: 100%;
}
.btn {
  border-radius: 0;
  transition: background 300ms, color 300ms;
}
.nav {
  justify-content: center;
  margin: 16px 0px;
  a {
    padding: 10px;
    color: #777;
    transition: background 300ms, color 300ms;
    &:hover {
      background-color: #555;
    }
  }
  .active {
    color: #eee;
    background-color: #333;
  }
}
#app {
  font-family: "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #eee;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
