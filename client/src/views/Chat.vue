<template>
    <div id="chat">
        <div id="chat-channels">
            <div id="chat-user-search">
                <textarea
                    id="search-input"
                    v-model="searchInput"
                    cols="5"
                    rows="1"
                ></textarea>
                <button
                    id="text-add"
                    v-on:click="addFriend()">
                    Add
                </button>
                <div id="search-error" v-if="error.status">
                    <span id="error-msg">{{ error.msg }}</span>
                </div>
            </div>
            <div id="channel-list">
                <channel
                    v-for="channel in channelList"
                    :key="channel.id"
                    :channel="channel">
                </channel>
            </div>
        </div>
        <div id="chat-window">
            <div id="chat-msg-pane">
                <chat-message
                    v-for="message in message"
                    :key="message.id"
                    :message="message">
                </chat-message>
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
                    v-on:click="sendMessage()">
                    Submit
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import io from'socket.io-client';
    import ChatMessage from '../components/ChatMessage';
    import Channel from '../components/Channel';

    export default {
        name: 'Chat',
        components: { ChatMessage, Channel },
        data() {
            return {
                userData: null,
                messages: [],
                userInput: "",
                searchInput: "",
                channelList: [],
                socket: io(),
                error: {
                    status: false,
                    msg: ""
                }
            };
        },
        methods: {
            /**
             * Fetches all of users channels from the server
             */
            getChannels() {
                axios
                    .get('http://localhost:5050/api/channels')
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

            /**
             * Adds a new conversation with the provided username
             */
            addFriend() {
                this.clearError();
                axios
                    .post("http://localhost:5050/api/channels", { username: this.searchInput })
                    .then(res => {
                        this.channelList.push(res.data);
                        console.log(`Current channel list: ${this.channelList}`);
                    })
                    .catch(err => {
                        console.log(`this is running for some reason wtf`)
                        if(err.response.status == 404) {
                            this.error.status = true;
                            this.error.msg = err.response.data.msg;
                        } else {
                            console.log(err);
                        }
                    })
            },
            /**
             * Clears error status
             */
            clearError() {
                this.error.status = false;
                this.error.msg = null;
            }

        },
        mounted() {
            this.getChannels();

            /**
             * Socket.io listeners
             */

            // on initial connection
            this.socket.on("connect", () => {
                console.log(`established socket with server on connection id: ${this.socket.id}`);
                this.socket.emit("ping");
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

    #chat-channels {
        width: 33%;
    }

        #search-input {
            width: 80%;
        }

        #text-add {
            width: 15%;
        }

        #search-error {
            color: red;
        }

    #chat-window {
        width: 66%;
        float: right;
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