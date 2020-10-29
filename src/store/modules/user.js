import {login, refreshLogin} from '@/api/auth'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {userInfo} from "@/api/user";
import {managerInfo} from "@/api/manager";
import {employeeInfo} from "@/api/employee";
import {
    getEiD,
    getMiD,
    getRoles,
    removeEid,
    removeMid,
    removeRoles,
    setAvatar,
    setEid,
    setMid,
    setRoles
} from "../../utils/auth";
import de from "element-ui/src/locale/lang/de";

const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
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
                    if (roles.indexOf('ROLE_MANAGER') !== -1) {
                        managerInfo().then(response => {
                            const id = response.data.id;
                            const name = response.data.name;
                            setMid(id);
                            commit("SET_MANAGER", id, name);
                            if (response.data.user.avatar) {
                                commit('SET_AVATAR', '/api' + response.data.user.avatar.url);
                                setAvatar('/api' + response.data.user.avatar.url);
                            } else {
                                // todo
                                let defualt_url = null;
                                commit('SET_AVATAR', defualt_url);

                            }

                            resolve()
                        })
                    } else if (roles.indexOf('ROLE_EMPLOYEE') !== -1) {
                        employeeInfo().then(response => {
                            const id = response.data.id;
                            const name = response.data.name;
                            setEid(id);
                            commit("SET_EMPLOYEE", id, name);
                            if (response.data.user.avatar) {
                                commit('SET_AVATAR', '/api' + response.data.user.avatar.url);
                                setAvatar('/api' + response.data.user.avatar.url);
                            } else {
                                // todo
                                let defualt_url = null;
                                commit('SET_AVATAR', defualt_url);

                            }
                            resolve();
                        });
                    } else if (roles.indexOf('ROLE_ADMIN') !== -1) {
                        userInfo().then(response => {
                            if (response.data.avatar) {
                                commit('SET_AVATAR', '/api' + response.data.avatar.url);
                                setAvatar('/api' + response.data.avatar.url);
                            } else {
                                // todo
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
                userInfo().then(response => {
                    const data = response.data;
                    if (data.avatar) {
                        commit('SET_AVATAR', data.avatar.url);
                    } else {
                        // todo
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
