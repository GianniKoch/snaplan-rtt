<script>

    import {onMount} from 'svelte';
    import {faMap, faKey} from '@fortawesome/free-solid-svg-icons'
    import Fa from "svelte-fa";
    import TotalLeaderboard from "$lib/components/TotalLeaderboard.svelte";
    import Leaderboard from "$lib/components/Leaderboard.svelte";

    let rounds = []
    let curRound = 0

    onMount(async () => {
        // setInterval(async () => {
        const res = await fetch(`http://localhost:3000/api/rounds`, {mode: "cors"})
        rounds = await res.json()
        // }, 2000);
    });

    function getTimeFromUnixMillis(unixMillis) {
        return new Date(unixMillis)
    }

    function countDown(time) {
        let nowtime = +new Date();
        let inputtime = +new Date(time);
        let times = (inputtime - nowtime) / 1000;
        let d = parseInt(times / (3600 * 24));
        let h = parseInt(times / 60 / 60 % 24);
        h = h < 10 ? '0' + h : h;
        let m = parseInt(times / 60 % 60);
        m = m < 10 ? '0' + m : m;
        let s = parseInt(times % 60);
        s = s < 10 ? '0' + s : s;
        return d + ':' + h + ':' + m + ':' + s;
    }

</script>


{#if rounds.length > 0}
    <div class="flex mt-14">
        <div class="card bg-base-200 w-max  m-auto">
            <div class="text-center justify-center flex">
                {#each [...rounds.map(round => round.roundTitle), "Total"] as name, i}
                    <button class="btn {curRound === i  ? 'btn-primary': 'btn-ghost'} btn-md rounded-btn w-44 m-2"
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

{:else}
    <div class="flex mt-16">
        <div class="m-auto">
            <div class="prose text-center justify-center">
                <h1>Tournament not started yet!</h1>
            </div>
        </div>
    </div>
{/if}


<div class="mb-32"></div>


<style>
    table tbody tr:first-child td h4 {
        color: goldenrod;
    }

    table tbody tr:nth-child(2) td h4 {
        color: silver;
    }

    table tbody tr:nth-child(3) td h4 {
        color: saddlebrown;
    }
</style>
