<script>
    import {onMount} from "svelte";
    import {fly} from 'svelte/transition'
    import Logo from "./Logo.svelte"
    import Fa from 'svelte-fa'
    import {faMedal, faInfoCircle, faUserTie, faSignOutAlt, faSignInAlt} from '@fortawesome/free-solid-svg-icons'
    import {faDiscord} from '@fortawesome/free-brands-svg-icons'
    import AnimatedHamburger from "./AnimatedHamburger.svelte";

    const discordInviteLink = 'https://discord.gg/YdRdD7t'
    export let open = false
    export let onClick = () => {
        open = !open
    }

    export function clickOutside(node) {
        const handleClick = event => {
            if (node && !node.contains(event.target) && !event.defaultPrevented && !event.target.classList.contains("ignoreClick")) {
                node.dispatchEvent(
                    new CustomEvent('click_outside', node)
                )
            }
        }
        document.addEventListener('click', handleClick, true);
        return {
            destroy() {
                document.removeEventListener('click', handleClick, true);
            }
        }
    }

    function handleClickOutside() {
        onClick();
    }

    let staff = false;
    let isLoading = true;
    let user = null;


    onMount(async () => {
        const res = await fetch(`http://localhost:3000/api/me`, {
            credentials: 'include',
            mode: 'cors',
        });
        user = (await res.json()).user;
        isLoading = false;
    });
</script>
<nav>
    <div class="navbar mb-2 text-neutral-content">
        <div class="px-1 mx-2">
            <Logo/>
        </div>
        <div class="lg:hidden navbar-end">
            <AnimatedHamburger {open} {onClick}/>
        </div>
        <div class="flex-1 px-2 mx-2">
            <div class="items-stretch hidden lg:flex px-1">
                <a class="btn btn-ghost btn-md rounded-btn" href="/info">
                    <Fa icon={faInfoCircle} class="mr-2"/>
                    Info
                </a>
            </div>
            <div class="items-stretch hidden lg:flex px-1">
                <a class="btn btn-ghost btn-md rounded-btn" href="/leaderboard">
                    <Fa icon={faMedal} class="mr-2"/>
                    Leaderboard
                </a>
            </div>
            {#if staff}
                <div class="items-stretch hidden lg:flex px-1">
                    <a class="btn btn-ghost btn-md rounded-btn" href="/staff">
                        <Fa icon={faUserTie} class="mr-2"/>
                        Staff
                    </a>
                </div>
            {/if}
        </div>
        <div class="flex-none">
            {#if staff}
                <div class="items-stretch hidden lg:flex px-1">
                    <a class="btn btn-ghost btn-md rounded-btn" href="/staff" on:click={auth.logout}>
                        <Fa icon={faUserTie} class="mr-2"/>
                        Logout
                    </a>
                </div>
            {/if}
            <div class="items-stretch hidden lg:flex px-1">
                <a class="btn btn-ghost btn-md rounded-btn" href="{discordInviteLink}" target="_blank">
                    <Fa icon={faDiscord} scale={1.5}/>
                </a>
            </div>
            {#if user}
                <div class="dropdown dropdown-end ml-3 hidden lg:block">
                    <label tabindex="0" class="btn btn-circle btn-ghost btn-md avatar">
                        <img class="w-20 rounded-full" src="https://cdn.scoresaber.com/avatars/{user.id}.jpg"/>
                    </label>
                    <ul tabindex="0" class="shadow menu dropdown-content bg-base-100 rounded-box">
                        <li><a href="http://localhost:3000/api/auth/steam/logout">Logout</a></li>
                    </ul>
                </div>
            {:else if !isLoading}
                <div class="items-stretch hidden lg:flex px-1 hidden lg:flex ">
                    <a class="btn btn-sm items-center p-0 -mt-1.5 ml-3"
                       href="http://localhost:3000/api/auth/steam">
                        <img src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
                             alt="Login with Steam"/>
                    </a>
                </div>
            {/if}
            {#if user && !user.joined}
                <div class="items-stretch hidden lg:flex px-1 hidden lg:flex ">
                    <a class="btn btn-ghost btn-md rounded-btn ml-3" href="http://localhost:3000/api/join">
                        <Fa icon={faSignInAlt} class="mr-2"/>
                        Join tournament
                    </a>
                </div>
            {/if}
        </div>
    </div>
</nav>


{#if open}
    <div transition:fly={{ y: -200, duration: 400 }}
         class="card bg-base-200 card-bordered absolute dropdown-index lg:hidden">
        <div class="card-body items-center" use:clickOutside on:click_outside={handleClickOutside}>
            <div class="items-stretch px-1">
                <a class="btn btn-ghost btn-md rounded-btn" href="/info" on:click={onClick}>
                    <Fa icon={faInfoCircle} class="mr-2"/>
                    Info
                </a>
            </div>
            <div class="items-stretch px-1">
                <a class="btn btn-ghost btn-md rounded-btn" href="/leaderboard" on:click={onClick}>
                    <Fa icon={faMedal} class="mr-2"/>
                    Leaderboard
                </a>
            </div>
            <div class="flex">
                <div class="items-stretch px-1">
                    <a class="btn btn-ghost btn-md rounded-btn" href="{discordInviteLink}" target="_blank">
                        <Fa icon={faDiscord} scale={1.5} class="mr-2"/>
                        Join Discord
                    </a>
                </div>
            </div>

            {#if user && !user.joined}
                <div class="items-stretch px-1 flex">
                    <a class="btn btn-ghost btn-md rounded-btn ml-3" href="http://localhost:3000/api/join">
                        <Fa icon={faSignInAlt} class="mr-2"/>
                        Join tournament
                    </a>
                </div>
            {/if}
            {#if user}
                <div class="flex">
                    <label tabindex="0" class="btn btn-circle btn-ghost btn-md avatar">
                        <img class="w-20 rounded-full" src="https://cdn.scoresaber.com/avatars/{user.id}.jpg"/>
                    </label>

                    <div class="items-stretch px-1">
                        <a class="btn btn-ghost btn-md rounded-btn" href="http://localhost:3000/api/auth/steam/logout"
                           on:click={onClick}>Logout</a>
                    </div>
                </div>
            {:else if !isLoading}
                <div class="items-stretch px-1 flex">
                    <a class="btn btn-sm items-center p-0 ml-3"
                       href="http://localhost:3000/api/auth/steam">
                        <img src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
                             alt="Login with Steam"/>
                    </a>
                </div>
            {/if}
        </div>
    </div>
{/if}
<style>
    a:hover {
        color: var(--nav-hover);
    }

    .dropdown-index {
        left: 10%;
        right: 10%;
        z-index: 1000;
    }
</style>