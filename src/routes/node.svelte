<script lang="ts">
    import { spring } from 'svelte/motion';

    export let img ="";
    export let text = ""; 
    export let mouse_pos: any[];
    export let clientWidth = 0; 
    export let clientHeight = 0;

    export const set_pos = {
        x: 300,
        y: 300,
        r: 0,
    }
    const pos = spring(set_pos, {
        stiffness: 0.01,
        damping: 0.50,
        precision: 0.1
    });
    
    export let curr_pos:{x:number, y:number, r:number} = {x: $pos.x, y: $pos.y, r: $pos.r}

    setTimeout(() => {
        let height = 200 * Math.random() * (Math.random() > 0.5 ? -1 : 1)  + clientHeight * 0.4;
        let width = 400 * Math.random() * (Math.random() > 0.5 ? -1 : 1)  + clientWidth * 0.35;
        set_pos.r = (1.50 + Math.random() * (Math.random() < 0.5 ? -0.25 : 0.5)) * (clientWidth * clientHeight) ** 0.5 / 20;
        set_pos.x = width;
        set_pos.y = height;
        pos.set(set_pos);
    }, 50)


    // boundary collision 
    $: if ($pos.x > clientWidth - $pos.r * 2.4) {
        set_pos.x = clientWidth - $pos.r * 2.4;
    } else if ($pos.x <= 0) {
        set_pos.x = 0;
    }
    $: if ($pos.y > clientHeight - $pos.r * 2.4) {
        set_pos.y = clientHeight - $pos.r * 2.4;
    } else if ($pos.y <= 0) {
        set_pos.y = 0;
    }

    $: style=`height: ${curr_pos.r * 2}px; width: ${curr_pos.r * 2}px; top: ${curr_pos.y}px; left: ${curr_pos.x}px`;
    $: curr_pos = {x: $pos.x, y: $pos.y, r: $pos.r}
    $: pos.set(set_pos);

    function mouseMove(event: MouseEvent) {
        setTimeout(() => {
            let last = mouse_pos.length - 1; 
            let second2last = mouse_pos.length - 2; 

            if(last > 0 && second2last > 0) {
                let newX = $pos.x + (mouse_pos[last][0] - mouse_pos[second2last][0]) * 2;
                let newY = $pos.y + (mouse_pos[last][1] - mouse_pos[second2last][1]) * 2;

                set_pos.x = newX;
                set_pos.y = newY;
            }
        }, 
            10, 
            [event]);
    }


</script>

<div on:mouseenter={mouseMove}>
    <img src="{img}" alt="" {style}>
</div>

<style>
    div {
        position: absolute;
        border-radius: 50%;
    }

    img {
        position: inherit;
        width: inherit;
        height: inherit;
        border-radius: 50%;
    }
</style>