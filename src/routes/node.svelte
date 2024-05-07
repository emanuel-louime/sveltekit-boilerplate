<script lang="ts">
    import { spring } from 'svelte/motion';

    export let img ="";
    export let date = ""; 
    export let cap = ""; 
    export let mouse_pos: any[];
    export let focus: String | null;
    export let clientWidth = 0; 
    export let clientHeight = 0;
    export let container: HTMLDivElement; 

    let caption: HTMLParagraphElement[] = []; 
    let cap_ani: Animation | null; 
    let cap_show: boolean = false;

    let animation: Animation | null;
    let z_index = 0;


    export const set_pos = {
        x: 300,
        y: 300,
        r: 0,
    }

    const pos = spring(set_pos, {
        stiffness: 0.01,
        damping: 0.80,
        precision: 0.1
    });

    const showCapKey:Keyframe[] =[
        {
            opacity: 0,
            scale: 0,
            offset: 0.00
        },
        {
            opacity: 0,
            scale: 0,
            offset: 0.01
        },
        {
            opacity: 1,
            scale: 1,
            offset: 1.00
        }
    ];

    const hideCapKey:Keyframe[] =[
        {
            opacity: 1,
            scale: 1,
            offset: 0.00
        },
        {
            opacity: 1,
            scale: 1,
            offset: 0.01
        },
        {
            opacity: 0,
            scale: 0,
            offset: 1.00
        },
    ];

	const showBack:Keyframe[] =[
        {
			display: 'none',
			opacity: 0,
            offset: 0.00
		},
        {
			display: 'block',
			opacity: 0,
            offset: 0.01
		},
        {
			display: 'block',
			opacity: 1,
            offset: 1.00
		}
    ];

	const hideBack:Keyframe[] =[
        {
			display: 'block',
			opacity: 1,
            offset: 0.00

		},
        {
			display: 'block',
			opacity: 1,
            offset: 0.01

		},
        {
			display: 'none',
			opacity: 0,
            offset: 1
		}
    ];

    function resize () {
        set_pos.r = (1.50 + Math.random() * (Math.random() < 0.5 ? -0.25 : 0.5)) * (clientWidth * clientHeight) ** 0.5 / 20;
    }
    
    export let curr_pos:{x:number, y:number, r:number} = {x: $pos.x, y: $pos.y, r: $pos.r}

    // initial location settting 
    setTimeout(() => {
        let height = 200 * Math.random() * (Math.random() > 0.5 ? -1 : 1)  + clientHeight * 0.4;
        let width = 400 * Math.random() * (Math.random() > 0.5 ? -1 : 1)  + clientWidth * 0.35;
        set_pos.r = (1.50 + Math.random() * (Math.random() < 0.5 ? -0.25 : 0.5)) * (clientWidth * clientHeight) ** 0.5 / 20;
        set_pos.x = width;
        set_pos.y = height;
        pos.set(set_pos);
    }, 50)

    // resize on viewport change 
    $: clientWidth, clientHeight, resize(); 

    // boundary collision 
    $: if ($pos.x > clientWidth - $pos.r * 2) {
        set_pos.x = clientWidth - $pos.r * 2;
    } else if ($pos.x <= 0) {
        set_pos.x = $pos.r / 3;
    }
    $: if ($pos.y > clientHeight - $pos.r * 2) {
        set_pos.y = clientHeight - $pos.r * 2;
    } else if ($pos.y <= 0) {
        set_pos.y = $pos.r / 4;
    }

    $: style=`height: ${curr_pos.r * 2}px; width: ${curr_pos.r * 2}px; top: ${curr_pos.y}px; left: ${curr_pos.x}px; z-index: ${z_index};`;
    $: curr_pos = {x: $pos.x, y: $pos.y, r: $pos.r}
    $: pos.set(set_pos);

    function mouseMove(event: MouseEvent) {
        if(!focus){
            setTimeout(() => {
                let p2 = mouse_pos.length - 1; 
                let p1 = mouse_pos.length - 3; 

                if(p2 > 0 && p1 > 0) {
                    let newX = $pos.x + (mouse_pos[p2][0] - mouse_pos[p1][0]) * 2;
                    let newY = $pos.y + (mouse_pos[p2][1] - mouse_pos[p1][1]) * 2;

                    set_pos.x = newX;
                    set_pos.y = newY;
                }
            }, 10);

            animation?.cancel();
            container.style.backgroundImage = `url(${img})`;
            animation = container.animate(showBack, 500);
            animation.finished.then(()=>{container.style.opacity = '1';});
        }
    }

    function mouseLeave(event: MouseEvent) {
        if(!focus) {
            animation?.cancel();
            animation = container.animate(hideBack, 500);
            animation.finished.then(()=>{container.style.opacity = `0`;});
        }
    }

    $: if (focus!=img) {
        resize();
        z_index = 1;
        if(cap_show) {
            cap_show = !cap_show;
            hideCaption();
        }
    }

    const hideCaption = ()=>{
        caption.forEach(line => {
            cap_ani = line.animate(hideCapKey, 500);
        });
        cap_ani?.finished.then(()=>{
            caption.forEach(line =>{
                line.style.opacity = '0'
                line.style.scale = '0'
            });
        });
    }   

    const showCaption = ()=>{
        cap_show = true;
        caption.forEach(line => {
            cap_ani = line.animate(showCapKey, 500);
        });
        cap_ani?.finished.then(()=>{
            caption.forEach(line =>{
                line.style.opacity = '1'
                line.style.scale = '1'
            });
        });
    }   

    $: if (focus==img) {
        // set background        
        animation?.cancel();
        animation = container.animate(hideBack, 500);
        animation.finished.then(()=>{
            container.style.opacity = `0`;
            container.style.backgroundImage = `none`;
        });

        // enlarge and center node
        set_pos.r = 0.45 * clientHeight;
        set_pos.x = 0.25 * clientWidth
        set_pos.y = 0.05 * clientHeight;
        z_index = 2;
    }

    function toggleFocus(event: MouseEvent) {
        if(focus == img) {
            focus = null;
        } else {
            focus = img;
            setTimeout(showCaption, 300);
        }
    }

</script>

<div on:mouseenter={mouseMove} on:mouseleave={mouseLeave} on:click={toggleFocus} on:keypress={()=>{}} {style}>
    <img src="{img}" alt="" >
    <p class="date" bind:this={caption[0]}>{date}</p>
    <p bind:this={caption[1]}>{cap}</p>
</div>

<style>
    div {
        position: absolute;
        border-radius: 50%;
        float: left;
    }

    img {
        position: inherit;
        width: inherit;
        height: inherit;
        border-radius: 50%;
        background-size: 100vh;
    }

    p {
        position: absolute;
        color: antiquewhite;
        font-size: 200%;
        width: 100%;
        text-align: center;
        bottom: 0%;
        z-index: 4;
        opacity: 0;
        scale: 0;
        text-shadow: 3px 0px 5px black;
    }

    .date {
        bottom: -10%;
    }

</style>