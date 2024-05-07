<script lang="ts">
	import type { PageData  } from './$types'

	import Node from './node.svelte';

	export let data: PageData;

	const curr_pos: {x: number; y: number; r: number}[] = [];
	const set_pos: {x: number; y: number; r: number}[] = [];

    const mouse_pos: any[] = [];

	let body: HTMLBodyElement; 
	let container:HTMLDivElement;
	let intro: HTMLDivElement|null;

    let clientWidth: number;
    let clientHeight: number;

	let focus: String | null = null;
    
	const sleep = (delay:number) => {
		return new Promise(resolve => setTimeout(resolve, delay));
	}

	async function collision(callback: any) {
		const distance = (
			p1: {x: number, y: number, r: number, },
			p2: {x: number, y: number, r: number, }) => {
				let x = (p2.x - p1.x) ** 2;
				let y = (p2.y - p1.y) ** 2;
				let dist = (p1.r + p2.r + 1) - (x + y) ** 0.5;
				let angle = Math.atan(y ** 0.5 / x ** 0.5);
				return (dist > 0) ? {y: y ** 0.5 * Math.sin(angle), x:  x ** 0.5 * Math.cos(angle)} : false;
		};

		if(!focus) {
			for(let i = 0; i < curr_pos.length ; i++) {
				for(let j = 0;  j < curr_pos.length; j++) {
					if(i != j) {
						let dist = distance(curr_pos[i], curr_pos[j]); 
						if(dist) {
							if(curr_pos[i].x > curr_pos[j].x){
								set_pos[i].x += dist.x / 4;
								set_pos[j].x -= dist.x / 4;
							} else {
								set_pos[i].x -= dist.x / 4;
								set_pos[j].x += dist.x / 4;

							}
							if(curr_pos[i].y > curr_pos[j].y){
								set_pos[i].y += dist.y / 4;
								set_pos[j].y -= dist.y / 4;
							} else {
								set_pos[i].y -= dist.y / 4;
								set_pos[j].y += dist.y / 4;
							}
						}
					}
				}
			}
			sleep(10).then(() => {callback(collision)});
		} else {
			sleep(300).then(()=> {callback(collision)})
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

    const hideCapKey:Keyframe[] =[
        {
            opacity: 1,
            offset: 0.00
        },
        {
            opacity: 1,
            offset: 0.01
        },
        {
            opacity: 0,
            offset: 1.00
        },
    ];

	setTimeout(collision, 500, collision);
	setTimeout(()=>{
		intro?.animate(hideCapKey, 500).finished.then(()=>{
			if(intro) {
				intro.style.opacity = '0';
				intro.style.zIndex = '0';
			}
		});
	}, 10000);

</script>

<svelte:head>
	<title>eco</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<svelte:window bind:innerWidth={clientWidth} bind:innerHeight={clientHeight}/>

<svelte:body bind:this={body} on:mousemove={getMousePos}></svelte:body>

<div bind:this={container} class="container">
</div>
<div>
	{#each data.list as item, index}
			<Node  
				img="{item.file}" 
				date="{item.date}" 
				cap="{item.cap}" 
				bind:curr_pos={curr_pos[index]} 
				bind:set_pos={set_pos[index]}
				mouse_pos={mouse_pos} 
				bind:focus={focus}
				bind:clientHeight={clientHeight} 
				bind:clientWidth={clientWidth}
				bind:container={container}
				>
		</Node>
	{/each}
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="intro" bind:this={intro}>
	<h1>'a piece of manny louime'</h1>
	<h2>click on any image</h2>
</div>

<style>
	:global(body) {
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
		background-color: black;
	}

	:global(body::-webkit-scrollbar) {
		 display: none;
	}

	.container {
		position: absolute;
		top: -10px; 
		left: -10px;
		width: 110vw;
		height: 110vh;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		filter:blur(8px);
	}

	.intro {
		position: relative;
		color: antiquewhite;
		width: 100%;
		height: 100%;
		margin-top: 20%;
		margin-bottom: 50%;
		text-align: center;
		z-index: 2;
	}
</style>
