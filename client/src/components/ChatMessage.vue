<template>
    <div id="message">
        <span class="message-date">{{ message.created_at }}</span>
        <span class="message-name">{{ message.author.username }}</span>
        <span class="message-test">{{ message.content }}</span>
    </div>
</template>

<script>
export default {
    name: "ChatMessage",
    props: ['message', 'usersMap'],
}
</script>

<style scoped>
    span {
        margin-right: 10px;
    }
</style>