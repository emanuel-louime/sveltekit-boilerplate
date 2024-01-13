<script lang="ts">
	import type { PageData  } from './$types'

	import Node from './node.svelte';

	export let data: PageData;

	const curr_pos: {x: number; y: number; r: number}[] = [];
	const set_pos: {x: number; y: number; r: number}[] = [];

    const mouse_pos: any[] = [];

	let focus: any = "";

    let clientWidth: number;
    let clientHeight: number;
    
	function collision() {
		const distance = (
			p1: {x: number, y: number, r: number, },
			p2: {x: number, y: number, r: number, }) => {
				let x = (p2.x - p1.x) ** 2;
				let y = (p2.y - p1.y) ** 2;
				let dist = (p1.r + p2.r + 1) - (x + y) ** 0.5;
				let angle = Math.atan(y ** 0.5 / x ** 0.5);
				return (dist > 0) ? {y: y ** 0.5 * Math.sin(angle), x:  x ** 0.5 * Math.cos(angle)} : false;
		};

		for(let i = 0; i < curr_pos.length ; i++) {
			for(let j = curr_pos.length - 1; j > 0; j--) {
				if(i != j) {
					let dist = distance(curr_pos[i], curr_pos[j]); 
					if(dist) {
						if(curr_pos[i].x > curr_pos[j].x){
							set_pos[i].x = curr_pos[i].x + dist.x / 4;
							set_pos[j].x = curr_pos[j].x - dist.x / 4;
						} else {
							set_pos[i].x = curr_pos[i].x - dist.x / 4;
							set_pos[j].x = curr_pos[j].x + dist.x / 4;

						}
						if(curr_pos[i].y > curr_pos[j].y){
							set_pos[i].y = curr_pos[i].y + dist.y / 4;
							set_pos[j].y = curr_pos[j].y - dist.y / 4;
						} else {
							set_pos[i].y = curr_pos[i].y - dist.y / 4;
							set_pos[j].y = curr_pos[j].y + dist.y / 4;
						}
					}
				}
			}
		}
	}

	function getMousePos(event: MouseEvent) {
        if (mouse_pos.length < 30) {
            mouse_pos.push([event.clientX, event.clientY]);
        } else {
            mouse_pos.push([event.clientX, event.clientY]);
            mouse_pos.shift();
        }
    }

	let coll_int;
	setTimeout(()=>{
		coll_int = setInterval(collision, 200);
	}, 1000)

	let body: HTMLElement;

	$: bg_style = `width: ${ clientWidth }px; height: ${ clientHeight }px; background-image`

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<svelte:window bind:innerWidth={clientWidth} bind:innerHeight={clientHeight}/>

<svelte:body bind:this={body} on:mousemove={getMousePos}></svelte:body>


<div class="container">
	$: <div class="bg" style={bg_style}><img src={focus} alt=""></div>	
	{#each data.images as img, index}
		<Node 
			img="{img}" 
			bind:curr_pos={curr_pos[index]} 
			bind:set_pos={set_pos[index]}
			mouse_pos={mouse_pos} 
			bind:clientHeight={clientHeight} 
			bind:clientWidth={clientWidth}
			on:mouseenter={()=>{
				focus = img;
				console.log(img);
			}}
			>
		</Node>
	{/each}
</div>

<style>
	:global(body) {
		background-color: black;
	}

	.bg {
		position: absolute;
		overflow: hidden;
	}

	:global(body::-webkit-scrollbar) {
		 display: none;
	}
</style>
