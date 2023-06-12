<script>
    import "../app.css";
    import {onMount} from "svelte";
    import Nav from "$lib/components/Nav.svelte";

    let user = null;

    onMount(async () => {
        const res = await fetch(`http://localhost:3000/api/me`, {
            credentials: 'include',
            mode: 'cors',
        });
        user = (await res.json()).user;
    });
</script>

<Nav/>
<slot/>
