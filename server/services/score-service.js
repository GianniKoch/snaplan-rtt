import {getUser, getUsers} from "./user-service.js";
import {Score} from "../database.js";
import fetch from "node-fetch";

async function getScores(playerId, pages) {
    const scores = [];

    for (const page of range(pages)) {
        console.log(`Started fetching page ${page} of player ${playerId}!`);
        scores.push(...(await fetchScorePageOfPlayer(playerId, page)).map((score) => ({
            scoreId: score.score.id,
            leaderboardId: score.leaderboard.id,
            score: score.score.baseScore,
            timeSet: score.score.timeSet,
            userId: playerId
        })));
        console.log(`Finished fetching page ${page} of player ${playerId}!`);
    }
    return scores;
}

function range(i) {
    function* x(i) {
        yield i
        if (i > 1)
            yield* x(i - 1)
    }

    return Array.from(x(i)).reverse()
}

async function getPageCountOfPlayer(playerId) {
    const data = await get(`https://scoresaber.com/api/player/${playerId}/scores`);
    return Math.round(data.metadata.total / 100 + 1);
}

async function fetchScorePageOfPlayer(id, page) {
    return (await get(`https://scoresaber.com/api/player/${id}/scores?limit=100&page=${page}&sort=recent`)).playerScores;
}

export async function fetchAllScores() {
    const users = await getUsers();
    for (const user of users) {
        await fetchScoresByPlayerId(user.id);
    }
}

export async function fetchScoresByPlayerId(playerId) {
    try {

        const pageCount = await getPageCountOfPlayer(playerId);
        console.log(`Fetching ${pageCount} pages of player ${playerId}!`)
        getScores(playerId, pageCount).then((scores) => Score.bulkCreate(scores, {ignoreDuplicates: true}) && console.log(`Added ${scores.length} scores of player ${playerId}!`));

    } catch (e) {
        console.log(`Error fetching scores of player ${playerId}: ${e}`);
        return await fetchScoresByPlayerId(playerId)
    }
}

async function get(url, options = {}) {
    try {
        const response = await fetch(url, options);

        // rate-limiting
        if (response.status === 429) {
            const retryAfter = response.headers.get("retry-after") ?? "5";
            console.log(`Rate limited! Retrying after ${retryAfter} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, parseInt(retryAfter) * 1000));
            return await get(url, options);
        }

        return await response.json();
    } catch (e) {
        console.log(`Error fetching ${url}: ${e}`);
        await new Promise((resolve) => setTimeout(resolve, 100));
        return await get(url, options);
    }
}

export async function getScoresByPlayerId(playerId) {
    return await Score.findAll({
        where: {
            userId: playerId
        }
    });
}

export async function processScore(score) {
    const playerId = score.score.leaderboardPlayerInfo.id
    const user = await getUser(playerId);
    if (user !== undefined) {

        await Score.create({
            scoreId: score.score.id,
            leaderboardId: score.leaderboard.id,
            score: score.score.baseScore,
            timeSet: score.score.timeSet,
            userId: playerId
        }, {ignoreDuplicates: true})

        console.log(`Added score ${score.score.id} of player ${playerId}!`)
    }
}