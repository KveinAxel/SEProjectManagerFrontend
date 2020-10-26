const getters = {
    token:  state => state.user.token,
    avatar: state => state.user.avatar,
    name:   state => state.user.name,
    roles:  state => state.user.roles,
    eid:    state => state.user.eid,
    ename:  state => state.user.ename,
    mid:    state => state.user.mid,
    mname:  state => state.user.mname,
};
export default getters
