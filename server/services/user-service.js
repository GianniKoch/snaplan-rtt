import {User} from "../database.js";

export async function getUser(id, check_joined = false) {
    if(check_joined) return await User.findOne({where: {id: id, joined: true}});
    return await User.findOne({where: {id: id}});
}

export async function addUser(id, displayName) {
     return await getUser(id) ?? await User.create({id: id, displayName: displayName, joined: false, admin: false});
}

export async function joinUser(id) {
    await User.update({joined: true}, {where: {id: id}});
}

export async function getUsers() {
    return await User.findAll({where: {joined: true}});
}

