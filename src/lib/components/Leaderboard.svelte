<script>
    import Timer from "$lib/components/Timer.svelte";

    export let round = {};

</script>

{#if new Date(round.startTime) - new Date() > 0}
    <div class="flex mt-48">
        <div class="m-auto prose content-center w-max">
            <h1>Round starts in:</h1>
            <Timer startTime={round.startTime}/>
        </div>
    </div>
{:else if new Date(round.endTime) - new Date() < 0}
    <div class="flex mt-48">
        <div class="m-auto prose content-center">
            <h1>Round has ended!</h1>
        </div>
    </div>
{:else}
    <div class="flex mt-48">
        <div class="m-auto prose content-center">
            <h1>Round ends in:</h1>
            <Timer startTime={round.endTime}/>
        </div>
    </div>
{/if}
