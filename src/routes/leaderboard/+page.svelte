<script>

    import {onMount} from 'svelte';
    import {faMap, faKey} from '@fortawesome/free-solid-svg-icons'
    import Fa from "svelte-fa";
    import TotalLeaderboard from "$lib/components/TotalLeaderboard.svelte";
    import Leaderboard from "$lib/components/Leaderboard.svelte";
    import Timer from "$lib/components/Timer.svelte";

    let rounds = []
    let curRound = 0
    let isLoading = true

    onMount(async () => {
        setInterval(async () => {
            const res = await fetch(`http://localhost:3000/api/rounds`, {mode: "cors"})
            rounds = (await res.json()).sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            isLoading = false
        }, 2000);

    });


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