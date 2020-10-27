import Cookies from 'js-cookie'

const TokenKey = 'loginToken';
const RolesKey = 'roles';
const EidKey = 'eid';
const MidKey = 'mid';

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}


export function getRoles() {
    const roles = Cookies.get(RolesKey);
    if (roles) {
        return JSON.parse(roles);
    } else {
        return [];
    }
}

export function setRoles(roles) {
    return Cookies.set(RolesKey, JSON.stringify(roles));
}

export function removeRoles() {
    return Cookies.remove(RolesKey)
}

export function getEiD() {
    return Cookies.get(EidKey)
}

export function setEid(eid) {
    return Cookies.set(EidKey, eid)
}

export function removeEid() {
    return Cookies.remove(EidKey)
}


export function getMiD() {
    return Cookies.get(MidKey)
}

export function setMid(mid) {
    return Cookies.set(MidKey, mid)
}

export function removeMid() {
    return Cookies.remove(MidKey)
}

