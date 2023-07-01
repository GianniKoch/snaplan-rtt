<script>
    import Timer from "$lib/components/Timer.svelte";
    import LeaderboardScore from "$lib/components/LeaderboardScore.svelte";

    export let round = {};
</script>

{#if new Date(round.startTime) - new Date() > 0}
    <div class="flex top-0 left-0 absolute items-center justify-center h-screen w-screen -z-10">
        <div class="prose text-center">
            <h1>Round starts in:</h1>
            <Timer startTime={round.startTime}/>
        </div>
    </div>
{:else}
    <div class="block lg:flex mt-16">
        <div class="block">
            {#if new Date(round.endTime) - new Date() < 0}
                <div class="prose mb-4">
                    <h2 class="text-center">Round has ended!</h2>
                    <div class="flex justify-center">
                        <Timer startTime={round.endTime}/>
                    </div>
                </div>
            {:else}
                <div class="prose mb-4">
                    <h2 class="text-center">Round ends in</h2>
                    <div class="flex justify-center">
                        <Timer startTime={round.endTime}/>
                    </div>
                </div>
            {/if}
            <div class="divider mt-4"></div>
            <div>
                <div class="prose text-center">
                    <h2>You'll be playing</h2>
                    {#each round.leaderboards as leaderboard}
                        <div class="card card-side bg-base-200 mb-4">
                            <figure class="relative p-0 m-0">
                                <img class="h-24 w-24" src="{leaderboard.imgUrl}" alt="Movie"/>
                                <div class="absolute bottom-0 left-0 btn btn-sm btn-primary btn-disabled rounded-none">{leaderboard.difficulty}</div>
                            </figure>
                            <div class="p-0 m-0 w-full">
                                <h3 class="m-1 justify-items-center">{leaderboard.name}</h3>
                                <a href="https://beatsaver.com/maps/{leaderboard.bsrKey}"
                                   class="w-24 btn btn-sm btn-primary" target="_blank">BEATSAVER</a>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
        <div class="divider lg:divider-horizontal"></div>
        <div class="overflow-x-auto w-full">
            <table class="table rounded-2xl bg-base-300">
                <!-- head -->
                <thead>
                <tr>
                    <th></th>
                    <th>Players</th>
                    <th class="text-center">Score</th>
                    <th class="text-center">Tickets</th>
                </tr>
                </thead>
                <tbody>
                {#each round.teams as team, i}
                    <LeaderboardScore team={team} rank={i + 1}/>
                {/each}
                </tbody>
            </table>
        </div>
    </div>
{/if}