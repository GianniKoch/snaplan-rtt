<script>
    export let team;
</script>

<tr>
    <td>
        <div class="flex items-center space-x-3">
            {#each team.users as user}
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
                <div class="mr-6"></div>
            {/each}
        </div>
    </td>
    <td>{team.score}%</td>
    <td>
        +{team.tickets} Tickets
    </td>
</tr>