<template>

</template>

<script>
    import store from "@/store";

    export default {
        name: "index",
        created() {
            const role_name = store.getters.roles[0];
            if (role_name === 'ROLE_MANAGER') {
                store.dispatch("ManagerInfo").then(() => {
                    this.$router.push({path: '/task/manager'})

                })
            } else if (role_name === 'ROLE_EMPLOYEE') {
                store.dispatch("EmployeeInfo").then(() => {
                    this.$router.push({path: '/task/employee'})
                })
            }
        }
    }
</script>

<style scoped>

</style>
