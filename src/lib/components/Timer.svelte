<script>
    export let startTime;

    let [distance, days, hours, minutes, seconds] = [0, 0, 0, 0];

    setInterval(getTimeTuple, 500);

    function getTimeTuple() {
        const countDownDate = new Date(startTime).getTime();
        const now = new Date().getTime();
        distance = countDownDate - now;

        days = Math.floor(distance / (1000 * 60 * 60 * 24));
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (distance < 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        }
    }
</script>

<div class="grid grid-flow-col gap-5 text-center auto-cols-max">
    <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span class="countdown font-mono text-5xl">
      <span style="--value:{days};"></span>
    </span>
        days
    </div>
    <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span class="countdown font-mono text-5xl">
      <span style="--value:{hours};"></span>
    </span>
        hours
    </div>
    <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span class="countdown font-mono text-5xl">
      <span style="--value:{minutes};"></span>
    </span>
        min
    </div>
    <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span class="countdown font-mono text-5xl">
      <span style="--value:{seconds};"></span>
    </span>
        sec
    </div>
</div>