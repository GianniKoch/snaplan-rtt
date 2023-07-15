<script>
    import {to_number} from "svelte/internal";

    export let rounds = [];
    let users;

    $: rounds && loadUsers();

    function loadUsers() {
        users = [];
        const activeRounds = rounds.filter(round => new Date() > new Date(round.startTime))
        for (const round of activeRounds) {
            for(const team of round.teams) {
                for (const user of team.users) {
                    const existingUser = users.find(u => u.id === user.id);
                    const scores = user.scores.filter(score => new Date(score.timeSet) < new Date(round.endTime));

                    const latestScores = [];
                    for (const score of scores) {
                        const index = latestScores.findIndex(latestScore => latestScore.leaderboardId === score.leaderboardId);
                        if (index === -1) {
                            latestScores.push(score);
                        } else {
                            if (new Date(latestScores[index].timeSet) < new Date(score.timeSet)) {
                                latestScores[index] = score;
                            }
                        }
                    }
                    const score = latestScores.map(score => score.score).reduce((a, b) => to_number(a) + to_number(b), 0) / round.maxScore
                    if (existingUser === undefined) {
                        user.totalScore = score
                        user.totalTickets = team.tickets
                        users.push(user)
                    } else {
                        existingUser.totalScore += score
                        existingUser.totalTickets += team.tickets;
                    }
                }
            }
        }

        users.forEach(user => {
            user.totalScore = Math.round(user.totalScore / activeRounds.length * 1000000) / 10000
        });

        users.sort((a,b) => a.totalTickets - b.totalTickets || b.totalScore - a.totalScore).reverse()
    }

</script>

<div class="rounded-2xl bg-base-300 mt-8">
    <table class="table">
        <!-- head -->
        <thead>
        <tr>
            <th></th>
            <th>Player</th>
            <th class="text-center">Total Score</th>
            <th class="text-center">Total Tickets</th>
        </tr>
        </thead>
        <tbody>
        {#each users as user, i}
            <tr>
                <td class="prose text-center w-20 rank">
                    <h3>#{i + 1}</h3>
                </td>
                <td>
                    <div class="flex items-center space-x-3">
                        <div class="avatar tooltip tooltip-bottom tooltip-primary"
                             data-tip="{user.displayName}">
                            <div class="mask mask-squircle w-12 h-12">
                                <img src="https://cdn.scoresaber.com/avatars/{user.id}.jpg"
                                     alt="{user.displayName}"/>
                            </div>
                        </div>
                        <div class="prose">
                            <h4>{user.displayName}</h4>
                        </div>
                    </div>
                </td>
                <td class="text-center">{user.totalScore}%</td>
                <td class="text-center">
                    +{user.totalTickets} Tickets
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
