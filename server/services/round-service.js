import {Leaderboard, Round, Score, Team, User} from "../database.js";
import {literal, Op, where} from "sequelize";

export async function getRounds() {
    const rounds = [];
    const roundIds = (await Round.findAll({attributes: ['roundId']})).map(round => round.roundId);
    for (const id of roundIds) {
        rounds.push(await Round.findOne({
            include: [
                {
                    model: Leaderboard,
                    as: "leaderboards",
                    attributes: ["leaderboardId", "imgUrl", "bsrKey", "maxScore", "name", "difficulty"],
                    through: {
                        attributes: [],
                    },
                },
                {
                    model: Team,
                    as: "teams",
                    include: [
                        {
                            model: User,
                            as: "users",
                            through: {
                                attributes: [],
                            },
                            include: [
                                {
                                    model: Score,
                                    as: "scores",
                                    required: false,
                                    where: {
                                        leaderboardId: {
                                            [Op.in]: literal(`(SELECT "LeaderboardLeaderboardId" FROM "Round_Leaderboards" WHERE "RoundRoundId" = ${id})`),
                                        }
                                    },
                                    attributes: ["score", "timeSet", "leaderboardId"],
                                },
                            ],
                            attributes: ["id", "displayName"],
                        },
                    ],
                    attributes: ["teamId", "roundId"],
                },
            ],
            attributes: ["roundId", "roundTitle", "startTime", "endTime"],
            where: {
                roundId: id
            }
        }));
    }

    return rounds
}

export async function updateRound(round) {
    try {
        await Round.update(round, {where: {roundId: round.roundId}});
    } catch (e) {
        console.warn(e);
    }
}

export async function addRound() {
    await Round.create({roundTitle: "New Round", startTime: new Date(), endTime: new Date()});
}

export async function deleteRound(id) {
    try {
        await Round.destroy({where: {roundId: id}});
    } catch (e) {
        console.warn(e);
    }
}

export async function deleteLeaderboard(leaderboardId) {
    try {
        await Leaderboard.destroy({where: {leaderboardId}});
    } catch (e) {
        console.warn(e);
    }
}

export async function addLeaderboard(leaderboard) {
    try {
        const round = await Round.findOne({where: {roundId: leaderboard.roundId}});
        if (!round) return;
        await Leaderboard.create(leaderboard);
        await round.addLeaderboard(leaderboard.leaderboardId);
    } catch (e) {
        console.warn(e);
    }
}

export async function deleteTeam(teamId) {
    try {
        await Team.destroy({where: {teamId}});
    } catch (e) {
        console.warn(e);
    }
}

export async function addTeam(roundId) {
    try {
        const round = await Round.findOne({where: {roundId: roundId}});
        if (!round) return;
        const team = await Team.create({roundId});
        await round.addTeam(team.teamId);
    } catch (e) {
        console.warn(e);
    }
}

export async function deleteUserFromTeam(userId, teamId) {
    try {
        const user = await User.findByPk(userId);
        if (!user) return;
        await Team.findByPk(teamId).then(team => team.removeUser(user));
    } catch (e) {
        console.warn(e);
    }
}

export async function addUserToTeam(userId, teamId) {
    try {
        const user = await User.findByPk(userId);
        if (!user) return;
        await Team.findByPk(teamId).then(team => team.addUser(user));
    } catch (e) {
        console.warn(e);
    }
}