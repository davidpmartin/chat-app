<template>
    <div id="chat">
        <div id="chat-convos"></div>
        <div id="chat-window">
            <div id="chat-msg-pane">
                <chat-message
                    v-for="message in messages"
                    :key="message.id"
                    :message="message"
                    :usersMap="usersMap"
                ></chat-message>
            </div>
            <div id="chat-type-area">
                <textarea
                    id= "text-input"
                    name="chat-msg"
                    v-model="userInput"
                    cols="30"
                    rows="2"
                ></textarea>
                <button
                    id="text-submit"
                    v-on:click="sendMessage()"
                >Submit</button>
                <button v-on:click="ping()">ping</button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import io from'socket.io-client';
    import ChatMessage from '../components/ChatMessage';

    export default {
        name: 'Chat',
        components: { ChatMessage },
        data() {
            return {
                userData: null,
                messages: null,
                userInput: null,
                socket: io()
            };
        },
        methods: {
            /**
             * Fetches all messages from the server
             */
            getMessages() {
                axios
                    .get('http://localhost:5050/api/messages')
                    .then(res => {
                        this.messages = res.data;
                    })
                    .catch(err => console.log(err));
            },

            /**
             * Dispatches a message to the server
             */
            sendMessage() {
                const msgObject = {
                        created_at: new Date().toISOString(),
                        text: this.userInput
                }
                axios
                    .post('http://localhost:5050/api/messages', msgObject)
                    .then(() => {
                        this.userInput = null;
                    })
                    .catch(err => console.log(err));
            },
        },
        mounted() {
            this.getMessages();

            /**
             * Socket.io listeners
             */

            // on initial connection
            this.socket.on("connect", () => {
                console.log(`established socket with server on connection id: ${this.socket.id}`);
                this.socket.emit("ping");
            });

            // test receive/response
            this.socket.on("pong", () => {
                console.log("Wow! they ponged me!!");
            });

            // listen for new messages
            this.socket.on("new_message", msg => {
                this.messages.push(msg);
            });
        }
    }
</script>

<style scoped>
    #chat {
        height: 600px;
    }

    #chat > div {
        display: inline-block;
        border: 1px solid black;
        height: 100%;
    }

    #chat-convos {
        width: 33%;
    }

    #chat-window {
        width: 66%;
    }

        #chat-msg-pane {
            height: 90%;
            display: block;
        }

        #chat-type-area {
            height: 10%;
            width: 100%;
            display: block;
        }

           #text-input {
               width: 79%;
           } 

           #text-submit {
               width: 19%;
               float: right;
               height: 90%;
           }
</style>