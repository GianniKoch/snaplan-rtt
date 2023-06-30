import {User} from "../database.js";
import {fetchScoresByPlayerId} from "./score-service.js";

export async function getUser(id) {
    return await User.findOne({where: {id: id}});
}

export async function addUser(user) {
    if(user.id === undefined) return;

    const found_user = await getUser(user.id);
    if(found_user) return found_user;

    const processed_user = await User.create({id: user.id, displayName: user.displayName, admin: false});
    fetchScoresByPlayerId(processed_user.id);
    return processed_user;
}

export async function getUsers() {
    return await User.findAll();
}

export async function deleteUser(id) {
    await User.destroy({where: {id: id}});
}

export async function updateUser(user) {
    try {
        await User.update(user, {where: {id: user.id}});
    } catch (e) {
        console.warn(e);
    }
}