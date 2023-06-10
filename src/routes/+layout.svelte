<script>
  import "../app.css";
  import {onMount} from "svelte";
  import Nav from "$lib/components/Nav.svelte";


  let user = null;
  let scores = null;
  let isLoading = true;

  onMount(async () => {
    const res = await fetch(`http://localhost:3000/api/me`, {
      credentials: 'include',
      mode: 'cors',
    });
    user = (await res.json()).user;

    const res2 = await fetch(`http://localhost:3000/api/scores`, {
      credentials: 'include',
      mode: 'cors',
    });
    scores = (await res2.json()).scores;

    isLoading = false;
  });
</script>

<Nav/>
<slot/>
