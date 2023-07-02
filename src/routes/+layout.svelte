<script>
    import "../app.css";
    import {onMount} from "svelte";
    import Nav from "$lib/components/Nav.svelte";
    import {env} from "$env/dynamic/public";

    let user = null;

    onMount(async () => {
        const res = await fetch(`${env.PUBLIC_API_URL}/api/me`, {
            credentials: 'include',
            mode: 'cors',
        });
        user = (await res.json()).user;
    });
</script>

<Nav/>
<slot/>
