<template>
    <div id="app">
        <div id="nav">
            <span v-if="authenticated" v-on:click="logout()">Logout</span>
        </div>
        <router-view
          @authenticated="setAuthenticated"
        />
    </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'app',
    data() {
      return {
        authenticated: false
      }
    },
    methods: {
      /**
       * Performs a logout operation with the server
       */
      logout() {
        axios
          .get('http://localhost:5050/api/logout')
          .then(res => {
              if (res.status === 200) {
                  this.authenticated = false;
                  this.$router.replace({ path: "/login" });
              }
          })
          .catch(err => console.log(err))
      },

      /**
       * Allows managing of the 'authenticated' property by other components
       */
      setAuthenticated(status) {
        this.authenticated = status;
      },
    },

    /**
     * Checks whether client has active authentication with server
     */
    mounted() {
      axios
        .get("http://localhost:5050/api/login")
        .then(res => {
          // Status 200 if logged in (redirecting to app)
          if(res.status === 200) {
            this.authenticated = true;
            this.$router.replace({ path: "/home"});
          }
        })
        .catch(err => {
          // Status 401 if not logged in (redirecting to login)
          if(err.response.status === 401) {
            this.authenticated = false;
            this.$router.replace({ path: "/login" });
          }
          else {
            console.log(err);
          }
        });
    }
  }
</script>

<style>
    body {
        background-color: #F0F0F0;
    }
    h1 {
        padding: 0;
        margin-top: 0;
    }
    #app {
        width: 1024px;
        margin: auto;
    }
</style>