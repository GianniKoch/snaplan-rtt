<script>
    import Fa from "svelte-fa";
    import {faCamera, faMedal, faInfoCircle} from '@fortawesome/free-solid-svg-icons'
    import {onMount} from "svelte";
    import {PUBLIC_API_URL} from "$env/static/public";

    let isLoading = true;
    let user = null;

    onMount(async () => {
        const res = await fetch(`${PUBLIC_API_URL}/api/me`, {
            credentials: 'include',
            mode: 'cors',
        });
        user = (await res.json()).user;
        isLoading = false;
    });
</script>
<div class="hero bg-base-100 absolute top-0 left-0 -z-10" style="background-image: url('/bg.jpg');">
    <div class="hero-overlay bg-opacity-70"></div>
    <div class="text-center hero-content">
        <div class="max-w-md">
            <h1 class="mb-5 text-5xl font-bold">
                SnapLAN<br>Raffle Tag Team
            </h1>

            <a class="btn btn-lg mx-4 my-2 btn-outline" href="/info">
                <Fa icon={faInfoCircle} class="mr-2"/>
                Info</a>
            <a class="btn btn-lg mx-4 my-2 btn-accent btn-outline" href="/leaderboard">
                <Fa icon={faMedal} class="mr-2"/>
                Leaderboard</a>
        </div>
    </div>
</div>


<div class="absolute bottom-0 right-0 m-10">
    <div class="items-stretch lg:flex">
        <a class="btn btn-ghost btn-md rounded-btn">
            <div class="mx-2">
                <Fa icon={faCamera} scale={1}/>
            </div>
            Cee @ SnapLAN V3
        </a>
    </div>
</div>


<style>
    .hero {
        width: 100%;
        height: 100%;
    }
</style>