<script>
    import {to_number} from "svelte/internal";

    export let rounds = {};
    let users;

    $: rounds && loadUsers();

    function loadUsers() {
        users = [];
        for (let round of rounds) {
            for (let team of round.teams) {
                for (let user of team.users) {
                    if (!users.find(u => u.id === user.id)) {
                        user.totalScore = 0;
                        user.totalTickets = 0;
                        users.push(user);
                    }
                    user = users.find(u => u.id === user.id);
                    user.totalScore += Math.round(user.scores.filter(s => round.leaderboards.map(l => l.leaderboardId).includes(s.leaderboardId)).map(s => s.score).reduce((a, b) => to_number(a) + to_number(b), 0) / round.maxScore *10000)/ 100
                    if(team.tickets > 0){
                        user.totalTickets += team.tickets;
                    }
                }
            }

        }

        users = users.sort((a, b) => b.totalTickets - a.totalTickets);
    }

</script>

<div class="rounded-2xl bg-base-200 mt-8 h-[65vh]">
    <table class="table">
        <!-- head -->
        <thead>
            <tr>
                <th>Player</th>
                <th class="text-center">Total Score</th>
                <th class="text-center">Total Tickets</th>
            </tr>
        </thead>
        <tbody>
        {#each users as user}
            <tr>
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
