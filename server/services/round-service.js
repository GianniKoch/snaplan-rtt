import {Leaderboard, Round, Score, Team, User} from "../database.js";
import {literal, Op, where} from "sequelize";

export async function getRounds() {
    const rounds = [];
    const roundIds = (await Round.findAll({attributes: ['roundId']})).map(round => round.roundId);
    for(const id of roundIds) {
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
                                    attributes: ["score", "leaderboardId"],
                                },
                            ],
                            attributes: ["id", "displayName"],
                        },
                    ],
                    attributes: ["teamId", "roundId"],
                },
            ],
            attributes: ["roundId", "roundTitle", "startTime", "endTime"],
            where:{
                roundId: id
            }
        }));
    }

    return rounds
}