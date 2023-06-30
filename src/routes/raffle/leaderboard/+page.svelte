<script>

    import {onMount} from 'svelte';
    import {faMap, faKey} from '@fortawesome/free-solid-svg-icons'
    import Fa from "svelte-fa";
    import TotalLeaderboard from "$lib/components/TotalLeaderboard.svelte";
    import Leaderboard from "$lib/components/Leaderboard.svelte";
    import Timer from "$lib/components/Timer.svelte";
    import {to_number} from "svelte/internal";
    import {PUBLIC_API_URL} from "$env/static/public";

    let rounds = []
    let curRound = 0
    let isLoading = true

    onMount(() => {
        fetchRounds();
        setInterval(fetchRounds, 2000);
    });

    async function fetchRounds() {
        const res = await fetch(`${PUBLIC_API_URL}/api/rounds`, {mode: "cors"})
        rounds = (await res.json()).sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        isLoading = false
    }

    function calculateTeamScores() {
        for (const round of rounds) {
            const teams = round.teams;
            round.maxScore = round.leaderboards.map(leaderboard => leaderboard.maxScore).reduce((a, b) => to_number(a) + to_number(b), 0);
            for (let team of teams) {
                team.score = 0;
                for (let user of team.users) {
                    const scores = user.scores.filter(score => new Date(score.timeSet) < new Date(round.endTime));
                    const total = scores.map(score => score.score).reduce((a, b) => to_number(a) + to_number(b), 0);
                    if(user.displayName === "GianniKoch" && round.roundTitle=="Saturday")
                        console.log(user.displayName, scores,total, round.maxScore)
                    team.score += total
                }
                team.score = Math.round(team.score / team.users.length / round.maxScore * 10000) / 100;
            }

            // sort teams by score
            round.teams = teams.sort((a, b) => b.score - a.score);

            // calculate tickets
            round.teams.forEach((team, i) => {
                team.tickets = new Date() < new Date(round.startTime) ? 0 : (round.teams.length - i) * 3;
            });
        }
    }

    $: rounds && calculateTeamScores();
</script>


{#if rounds.length > 0}
    <div class="flex mt-10">
        <div class="card bg-base-200 w-max m-auto">
            <div class="text-center justify-center block p-1">
                {#each [...rounds.sort((a, b) => a.startTime - b.startTime).map(round => round.roundTitle), "Total"] as name, i}
                    <button class="btn {curRound === i  ? 'btn-primary': 'btn-ghost'} btn-md rounded-btn w-44 m-1"
                            on:click={() => curRound = i}>
                        {name}
                    </button>
                {/each}
            </div>
        </div>
    </div>
    {#if curRound === rounds.length}
        <TotalLeaderboard {rounds}/>
    {:else}
        <Leaderboard round={rounds[curRound]}/>
    {/if}
{:else if !isLoading}
    <div class="flex mt-16">
        <div class="m-auto">
            <div class="prose text-center justify-center">
                <h1>Tournament not started yet!</h1>
            </div>
        </div>
    </div>
{:else}
    <div class="flex top-0 left-0 absolute items-center justify-center h-screen w-screen -z-10">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
{/if}