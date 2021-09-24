import LoginView from "../views/Login.vue";
import ChatView from "../views/Chat.vue";

export default [
    {
        path: '/home',
        component: ChatView
    },
    {
        path: "/login",
        component: LoginView
    }
];