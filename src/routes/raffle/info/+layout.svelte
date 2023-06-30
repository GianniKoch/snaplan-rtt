

<div class="hero bg-base-black fixed top-0 left-0 -z-10" style="background-image: url('/bg-header.png');">
    <div class="hero-overlay bg-opacity-70"></div>
</div>

<style>
    .hero{
        width: 100%;
        height: 33vh;

        clip-path: polygon(0 0, 100% 0%, 100% 70%, 0% 100%);
    }
</style>
<slot/>