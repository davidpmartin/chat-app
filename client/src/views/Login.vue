<template>
    <div id="login">
        <h1>Login</h1>
        <input type="text" name="username" v-model="input.username" placeholder="Username" />
        <input type="password" name="password" v-model="input.password" placeholder="Password" />
        <button type="button" v-on:click="login()">Login</button>
        <button type="button" v-on:click="register()">Register</button>
        <div id="error" v-if=error.status>
            <span>{{ error.msg }}</span>
        </div>
        <div id="notification" v-if=notification.status>
            <span>{{ notification.msg }}</span>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import emitter from 'mitt';

    export default {
        name: 'Login',
        data() {
            return {
                input: {
                    username: "",
                    password: ""
                },
                error: {
                    status: false,
                    msg: null
                },
                notification: {
                    status: false,
                    msg: null
                }
            }
        },
        methods: {
            login() {
                this.clearNotifs();
                axios
                    .post('http://localhost:5050/api/login', {
                        username: this.input.username,
                        password: this.input.password
                    })
                    .then(res => {
                        // SUCCESS
                        if (res.status === 200) {

                            // Notify parent of auth and switch components
                            this.$emit("authenticated", true);
                            this.$router.replace({ path: "/home" });
                        }
                    })
                    // ERROR
                    .catch(err => {

                        // Expected error of 404 == acknowledged failure
                        if (err.response.status === 404) {
                            this.error.status = true;
                            this.error.msg = "Username or password incorrect";
                        } else {
                            console.log(err);
                        }
                    });
            },
            register() {
                this.clearNotifs();
                axios
                    .post('http://localhost:5050/api/users', {
                        username: this.input.username,
                        password: this.input.password
                    })
                    .then(res => {
                        if (res.status === 200) {
                            this.notification.status = true;
                            this.notification.msg = "Account created successfully!"
                        }
                    })
                    .catch(err => {
                        this.error.status = true;
                        if (err.response.status == 404) {
                            this.error.msg = err.response.data.msg;
                        } else {
                            this.error.msg = "An error occured.";
                        }
                    })
            },
            clearNotifs() {
                this.error.status = false;
                this.error.msg = null;
                this.notification.status = false;
                this.notification.msg = null;
            }
        }
    }
</script>

<style scoped>
    #login {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #FFFFFF;
        margin: auto;
        margin-top: 200px;
        padding: 20px;
    }

    #error {
        color: red;
    }
    
    #notification {
        color: green;
    }
</style>