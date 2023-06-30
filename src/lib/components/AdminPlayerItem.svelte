<script>
    import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
    import Fa from "svelte-fa";
    import {PUBLIC_API_URL} from "$env/static/public";

    export let player = {};
    export let fetchPlayers = () => {};

    let id = player.id
    let displayName = player.displayName;

    async function deletePlayer(){
        await fetch(`${PUBLIC_API_URL}/api/admin/users/${id}`, {
            method: "DELETE",
            mode: "cors",
            credentials: 'include',
        });
        fetchPlayers();
    }

    async function update(){
        await fetch(`${PUBLIC_API_URL}/api/admin/users`, {
            method: "PUT",
            mode: "cors",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                displayName: displayName,
            })
        });
        fetchPlayers();
    }
</script>

<div class="card bg-base-100 shadow-xl mx-6 lg:my-6 w-fit">
    <div class="btn btn-ghost absolute top-2 right-2"
         on:click={deletePlayer}>
        <Fa color="red" icon={faTrash} scale={1.5}/>
    </div>
    <div class="card-body flex flex-row">
        <div class="avatar tooltip tooltip-bottom tooltip-primary" data-tip="{player.displayName}">
            <div class="mask mask-squircle w-12 h-12">
                <img src="https://cdn.scoresaber.com/avatars/{player.id}.jpg"
                     alt="{player.displayName}"/>
            </div>
        </div>
        <input bind:value={id} type="text" placeholder="Id" class="input border input-bordered input-primary"
               on:change={update}/>
        <input bind:value={displayName} type="text" placeholder="Display Name" class="input border input-bordered input-primary mr-8" on:change={update}/>
    </div>
</div>