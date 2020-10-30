import {login, refreshLogin} from '@/api/auth'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {userInfo as userInfoAPI} from "@/api/user";
import {managerInfo} from "@/api/manager";
import {employeeInfo} from "@/api/employee";
import {
    getAvatar,
    getEiD,
    getMiD,
    getRoles,
    removeEid,
    removeMid,
    removeRoles,
    setAvatar,
    setEid,
    setMid,
    setRoles, setUid
} from "../../utils/auth";

const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: getAvatar(),
        eid: getEiD(),
        ename: '',
        mid: getMiD(),
        mname: '',
        roles: getRoles()

    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_EMPLOYEE: (state, eid, ename) => {
            state.eid = eid;
            state.ename = ename;
        },
        SET_MANAGER: (state, mid, mname) => {
            state.mid = mid;
            state.mname = mname;
        },
        SET_USER: (state, uid, useername) => {
            state.uid = uid;
            state.useername = useername;
        },


    },

    actions: {
        // 登录
        Login({commit}, userInfo) {
            const username = userInfo.username.trim();
            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then(response => {
                    const data = response.data;
                    const tokenStr = data['authToken']['token'];
                    const roles = data['roles'];
                    commit('SET_NAME', data.username);
                    setToken(tokenStr);
                    commit('SET_TOKEN', tokenStr);
                    setRoles(roles);
                    commit('SET_ROLES', roles);
                    if (roles.includes('ROLE_MANAGER') ) {
                        managerInfo().then(response => {
                            const id = response.data.id;
                            const name = response.data.name;
                            setMid(id);
                            commit("SET_MANAGER", id, name);
                            setUid(response.data.user.id);
                            commit("SET_USER", response.data.user.id, response.data.user.username);
                            if (response.data.user.avatar) {
                                commit('SET_AVATAR', '' + response.data.user.avatar.url);
                                setAvatar('' + response.data.user.avatar.url);
                            } else {
                                let defualt_url = null;
                                commit('SET_AVATAR', defualt_url);

                            }

                            resolve()
                        })
                    } else if (roles.includes('ROLE_EMPLOYEE') ) {
                        employeeInfo().then(response => {
                            const id = response.data.id;
                            const name = response.data.name;
                            setEid(id);
                            commit("SET_EMPLOYEE", id, name);
                            if (response.data.user.avatar) {
                                commit('SET_AVATAR', '' + response.data.user.avatar.url);
                                setAvatar('' + response.data.user.avatar.url);
                            } else {
                                let defualt_url = null;
                                commit('SET_AVATAR', defualt_url);

                            }
                            resolve();
                        });
                    } else if (roles.includes('ROLE_ADMIN') ) {
                        userInfoAPI().then(response => {
                            if (response.data.avatar) {
                                commit('SET_AVATAR', '' + response.data.avatar.url);
                                setAvatar('' + response.data.avatar.url);
                            } else {
                                let defualt_url = null;
                                commit('SET_AVATAR', defualt_url);

                            }
                            resolve();
                        });
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                userInfoAPI().then(response => {
                    const data = response.data;
                    if (data.avatar) {
                        commit('SET_AVATAR', data.avatar.url);
                    } else {
                        let defualt_url = null;
                        commit('SET_AVATAR', defualt_url);

                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 刷新凭证
        Refresh({commit}) {
            return new Promise(resolve => {
                refreshLogin().then(response => {
                    const data = response.data;
                    const tokenStr = JSON.stringify(data['authToken']);
                    setToken(tokenStr);
                    commit('SET_TOKEN', tokenStr);
                })
            })
        },

        // 登出
        LogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                removeToken();
                removeEid();
                removeMid();
                removeRoles();
                resolve()
            })
        },

        // 请求经理信息
        ManagerInfo({commit}) {
            return new Promise((resolve, reject) => {
                managerInfo().then(response => {
                    const id = response.data.id;
                    const name = response.data.name;
                    setMid(id);
                    commit("SET_MANAGER", id, name);
                    resolve();
                })
            })
        },

        // 请求员工信息
        EmployeeInfo({commit}) {
            return new Promise((resolve, reject) => {
                employeeInfo().then(response => {
                    const id = response.data.id;
                    const name = response.data.name;
                    setEid(id);
                    commit("SET_EMPLOYEE", id, name);
                    resolve();
                })
            })
        }
    }
};

export default user
