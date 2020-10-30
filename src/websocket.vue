<template>
    <div></div>
</template>

<script>
    import {getToken} from "./utils/auth";
    import io from "socket.io-client";
    import store from "./store";

    export default {
        name: "websocket",
        created() {
            let host = '192.168.43.234';
            let port = '8089';
            let token = getToken();
            let socket = io.connect('http://' + host + ':' + port + '?token=' + token, {transports:['websocket','xhr-polling','jsonp-polling']});

            socket.on('test', function(data) {
                alert(data.message);
            });

            socket.on('task_start', (data) => {
                if (store.getters.eid === data['undertakerEid']) {
                    this.$message({
                        type: 'warning',
                        message: '任务' + data.task.name + '开始'
                    })
                }
            });
            //
            // socket.on('login', (data) => {
            //     if (store.getters.uid === data.id) {
            //         this.$message.error("您的帐号在别处登陆，您已被踢出");
            //         store.dispatch("LogOut");
            //     }
            // });



        }
    }
</script>

<style scoped>

</style>
