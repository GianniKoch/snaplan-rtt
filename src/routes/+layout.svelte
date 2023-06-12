<script>
    import "../app.css";
    import {onMount} from "svelte";
    import Nav from "$lib/components/Nav.svelte";
    import {PUBLIC_API_URL} from "$env/static/public";

    let user = null;

    onMount(async () => {
        const res = await fetch(`${PUBLIC_API_URL}/api/me`, {
            credentials: 'include',
            mode: 'cors',
        });
        user = (await res.json()).user;
    });
</script>

<Nav/>
<slot/>
