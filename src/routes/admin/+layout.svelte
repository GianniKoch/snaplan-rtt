<script>
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import {PUBLIC_API_URL} from "$env/static/public";

    let user = null;
    let loading = true;

    onMount(async () => {
        const res = await fetch(`${PUBLIC_API_URL}/api/me`, {
            credentials: 'include',
            mode: 'cors',
        });
        user = (await res.json()).user;

        loading = false;
        (!user || !user.admin) && goto('/')
    });
</script>

<div class="hero bg-base-black fixed top-0 left-0 -z-10" style="background-image: url('/bg-header.png');">
    <div class="hero-overlay bg-opacity-70"></div>
</div>

<style>
    .hero {
        width: 100%;
        height: 33vh;

        clip-path: polygon(0 0, 100% 0%, 100% 70%, 0% 100%);
    }
</style>
{#if !loading}
    <slot/>
{/if}