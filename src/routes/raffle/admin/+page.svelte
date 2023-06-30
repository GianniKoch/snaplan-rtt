<script>
    import Fa from 'svelte-fa'
    import {onMount} from "svelte";
    import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
    import {faPlusCircle} from "@fortawesome/free-solid-svg-icons/faPlusCircle";
    import {PUBLIC_API_URL} from "$env/static/public";
    import AdminPlayerItem from "$lib/components/AdminPlayerItem.svelte";

    let rounds = [];
    let players = [];
    let filteredPlayers = [];
    let curRound;
    let selectedTeam;

    let roundTitle;
    let roundStartTime;
    let roundEndTime;

    let leaderboardId;
    let leaderboardName;
    let leaderboardImgUrl;
    let leaderboardDifficulty;
    let leaderboardBsrKey;
    let leaderboardMaxScore;

    let playerId;
    let displayName;

    onMount(async () => {
        await fetchRounds();
        if (rounds.length > 0) {
            selectRound(0);
            await fetchPlayers();
        }
    });

    async function fetchRounds() {
        const res = await fetch(`${PUBLIC_API_URL}/api/rounds`, {mode: "cors"});
        rounds = (await res.json()).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        await fetchPlayers();
        if (selectedTeam !== undefined) {
            selectedTeam = rounds[curRound].teams.find(t => t.teamId === selectedTeam.teamId);
        }
    }

    async function fetchPlayers() {
        const playerRes = await fetch(`${PUBLIC_API_URL}/api/players`, {mode: "cors"});
        players = await playerRes.json();
        filteredPlayers = [{id: '0', displayName: "Who's playing?"}, ...filterAvailablePlayers()];
    }

    function setTeam(team) {
        selectedTeam = team;
    }

    async function deleteRound(roundId) {
        const res = await fetch(`${PUBLIC_API_URL}/api/admin/rounds/${roundId}`, {
            method: "DELETE",
            mode: "cors",
            credentials: 'include'
        });
        await fetchRounds();
        selectRound(0)
    }

    async function deleteLeaderboard(leaderboardId) {
        const res = await fetch(`${PUBLIC_API_URL}/api/admin/leaderboards/${leaderboardId}`, {
            method: "DELETE",
            mode: "cors",
            credentials: 'include'
        });
        await fetchRounds();
    }

    async function addRound() {
        const res = await fetch(`${PUBLIC_API_URL}/api/admin/rounds`, {
            method: "POST",
            mode: "cors",
            credentials: 'include',
        });
        await fetchRounds();
        selectRound(rounds.length - 1)
    }

    async function updateRound() {
        const res = await fetch(`${PUBLIC_API_URL}/api/admin/rounds`, {
            method: "PUT",
            mode: "cors",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                roundId: rounds[curRound].roundId,
                roundTitle: roundTitle,
                startTime: new Date(roundStartTime),
                endTime: new Date(roundEndTime)
            })
        });
        await fetchRounds();
        selectRound(curRound)
    }

    function convertDate(date) {
        const time = new Date(date.toString());
        // add local timezone offset
        time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
        return time.toISOString().slice(0, 19);
    }

    function selectRound(roundId) {
        roundTitle = rounds[roundId].roundTitle
        roundStartTime = convertDate(rounds[roundId].startTime)
        roundEndTime = convertDate(rounds[roundId].endTime)
        curRound = roundId;
    }

    async function addLeaderboard() {
        const res = await fetch(`${PUBLIC_API_URL}/api/admin/leaderboards`, {
            method: "POST",
            mode: "cors",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                roundId: rounds[curRound].roundId,
                leaderboardId: leaderboardId,
                name: leaderboardName,
                imgUrl: leaderboardImgUrl,
                difficulty: leaderboardDifficulty,
                bsrKey: leaderboardBsrKey,
                maxScore: leaderboardMaxScore,

            })
        });
        await fetchRounds();

        leaderboardId = "";
        leaderboardName = "";
        leaderboardImgUrl = "";
        leaderboardDifficulty = "";
        leaderboardBsrKey = "";
        leaderboardMaxScore = 0;
    }

    async function addTeam() {
        const res = await fetch(`${PUBLIC_API_URL}/api/admin/teams/${rounds[curRound].roundId}`, {
            method: "POST",
            mode: "cors",
            credentials: 'include',
        });
        await fetchRounds();
    }

    async function deleteTeam(teamId) {
        const res = await fetch(`${PUBLIC_API_URL}/api/admin/teams/${teamId}`, {
            method: "DELETE",
            mode: "cors",
            credentials: 'include',
        });
        await fetchRounds();
    }

    async function deletePlayerFromTeam(playerId, teamId) {
        const res = await fetch(`${PUBLIC_API_URL}/api/admin/users/${playerId}/${teamId}`, {
            method: "DELETE",
            mode: "cors",
            credentials: 'include',
        });
        await fetchRounds();
    }

    async function addPlayerToTeam(playerId) {
        const res = await fetch(`${PUBLIC_API_URL}/api/admin/users/${playerId}/${selectedTeam.teamId}`, {
            method: "POST",
            mode: "cors",
            credentials: 'include',
        });
        await fetchRounds();
    }

    function filterAvailablePlayers() {
        return curRound === undefined ? [] : players.filter(player => !rounds[curRound].teams.map(t => t.users).flat().some(u => u.id === player.id))
    }

    async function addPlayer(){
        const res = await fetch(`${PUBLIC_API_URL}/api/admin/users`, {
            method: "POST",
            mode: "cors",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: playerId,
                displayName: displayName,
            })
        });
        fetchPlayers();
        playerId = "";
        displayName = "";
    }

</script>
<div class="block lg:flex mt-16">
    <div class="flex lg:block">
        <div class="w-64 btn btn-ghost card bg-base-300 shadow-xl mx-6 lg:my-6 py-12" on:click={() => addRound()}>
            <Fa icon={faPlusCircle}/>
        </div>
        {#each rounds as round, i}
            <div class="w-64 card {curRound === i ? 'border border-primary' : ''} bg-base-100 shadow-xl mx-6 lg:my-6">
                <div class="btn btn-ghost absolute top-2 right-2" on:click={() => deleteRound(round.roundId)}>
                    <Fa color="red" icon={faTrash} scale={1.5}/>
                </div>
                <div class="card-body">
                    <h2 class="card-title">{round.roundTitle}</h2>
                    <div class="card-actions justify-end">
                        <button class="btn btn-secondary" on:click={() => selectRound(i)}>Select</button>
                    </div>
                </div>
            </div>
        {/each}
    </div>
    <div class="divider lg:divider-horizontal"></div>
    {#if rounds.length > 0}
        <div class="overflow-x-auto w-full">
            <div class="prose">
                <h3>Round</h3>
            </div>
            <input bind:value={roundTitle} name="round-title" type="text" placeholder="Round Title"
                   class="input input-bordered input-primary w-full my-3" on:change={() => updateRound()}/>
            <div class="join w-full my-3 border border-primary">
                <button class="btn-neutral btn-disabled px-5 join-item">From</button>
                <input bind:value={roundStartTime} name="round-start-time" type="datetime-local"
                       class="input input-bordered join-item w-full" on:focusout={() => updateRound()}/>
                <button class="btn-neutral btn-disabled px-5 join-item">To</button>
                <input bind:value={roundEndTime} name="round-end-time" type="datetime-local"
                       class="input input-bordered join-item w-full" on:focusout={() => updateRound()}/>
            </div>
            <div class="divider"></div>
            <div class="prose">
                <h3>Leaderboards</h3>
            </div>
            <div class="flex">
                <div class="w-64 btn btn-ghost card bg-base-300 shadow-xl mx-6 lg:my-6 py-12"
                     onclick="my_modal_1.showModal()">
                    <Fa icon={faPlusCircle}/>
                </div>
                {#if rounds[curRound] && rounds[curRound].leaderboards.length > 0}
                    {#each rounds[curRound].leaderboards as leaderboard}
                        <div class="w-64 card bg-base-100 shadow-xl mx-6 lg:my-6">
                            <div class="btn btn-ghost absolute top-2 right-2"
                                 on:click={() => deleteLeaderboard(leaderboard.leaderboardId)}>
                                <Fa color="red" icon={faTrash} scale={1.5}/>
                            </div>
                            <div class="card-body">
                                <h2 class="card-title">{leaderboard.name}</h2>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
            <div class="divider"></div>

            <div class="prose">
                <h3>Teams</h3>
            </div>
            <div class="flex flex-wrap">
                <div class="btn btn-ghost card bg-base-300 shadow-xl my-4 w-full h-20" on:click={() => addTeam()}>
                    <Fa icon={faPlusCircle}/>
                </div>
                {#if rounds[curRound] && rounds[curRound].teams.length > 0}
                    {#each rounds[curRound].teams as team, i}
                        <div class="card border border-neutral bg-base-100 shadow-xl mx-6 lg:my-6 w-fit">
                            <div class="prose text-center mt-2">
                                <h4>Team {i + 1}</h4>
                            </div>
                            <div class="btn btn-ghost absolute top-2 right-2"
                                 on:click={() => deleteTeam(team.teamId)}>
                                <Fa color="red" icon={faTrash} scale={1.5}/>
                            </div>
                            <div class="card-body flex flex-row">
                                <div class="btn w-fit" onclick="my_modal_2.showModal()"
                                     on:click={() => setTeam(team)}>
                                    Add Player
                                </div>
                                {#each team.users as user}
                                    <div class="flex items-center space-x-3 border p-2 rounded-2xl w-fit">
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
                                        <div class="btn btn-ghost"
                                             on:click={() => deletePlayerFromTeam(user.id, team.teamId)}>
                                            <Fa color="red" icon={faTrash}/>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    {/if}
</div>
<div class="relative block mb-24">

    <div class="divider"></div>
    <div class="prose">
        <h3>Players</h3>
    </div>
    <div class="btn btn-ghost absolute right-2 top-2"
         on:click={() => fetch(`${PUBLIC_API_URL}/api/scores/fetch-all`, {mode:'cors', credentials:'include'})}>
        !! Refresh scores
    </div>

    <div>
        <div class="bg-base-200 rounded-2xl p-4 my-4">
            <input bind:value={playerId} type="text" placeholder="Id" class="input"/>
            <input bind:value={displayName} type="text" placeholder="Display Name" class="input"/>
            <button class="btn btn-primary" on:click={() => addPlayer()}>Add</button>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {#each players.sort((p1, p2) => p1.id.localeCompare(p2.id)) as player}
            <AdminPlayerItem {player} {fetchPlayers} />
        {/each}
        </div>
    </div>
</div>

<!-- Leaderboard model -->
<dialog id="my_modal_1" class="modal">
    <form method="dialog" class="modal-box" on:submit={addLeaderboard}>
        <h3 class="font-bold text-lg">Add leaderboard</h3>
        <div class="block">
            <input bind:value={leaderboardId} type="text" placeholder="leaderboardId"
                   class="input input-bordered input-primary w-full"/>
            <input bind:value={leaderboardName} type="text" placeholder="name"
                   class="input input-bordered input-primary w-full"/>
            <input bind:value={leaderboardImgUrl} type="text" placeholder="imgUrl"
                   class="input input-bordered input-primary w-full"/>
            <input bind:value={leaderboardDifficulty} type="text" placeholder="difficulty"
                   class="input input-bordered input-primary w-full"/>
            <input bind:value={leaderboardBsrKey} type="text" placeholder="bsrKey"
                   class="input input-bordered input-primary w-full"/>
            <input bind:value={leaderboardMaxScore} type="number" placeholder="maxScore"
                   class="input input-bordered input-primary w-full"/>
        </div>
        <div class="modal-action">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Add</button>
        </div>

    </form>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

<!-- Leaderboard model -->
<dialog id="my_modal_2" class="modal">
    <form method="dialog" class="modal-box">
        <h3 class="font-bold text-lg">Add leaderboard</h3>
        <div class="card-body flex flex-wrap">
            {#if selectedTeam !== undefined}
                <select class="select select-bordered join-item w-fit" on:change={(e) => {
                                            addPlayerToTeam(e.target.value); e.target.value = "0"
                                        }}>
                    {#each filteredPlayers as player}
                        <option value={player.id}>
                            {player.displayName}
                        </option>
                    {/each}
                </select>
                {#each selectedTeam.users as user}
                    <div class="flex items-center space-x-3 border p-2 rounded-2xl w-fit">
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
                        <div class="btn btn-ghost"
                             on:click={() => deletePlayerFromTeam(user.id, selectedTeam.teamId)}>
                            <Fa color="red" icon={faTrash}/>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </form>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
