<script lang="ts">
	import { onMount } from 'svelte';

	const projectLinks = {
		Guessr: [
			'https://guessr.vasys.su',
			'/guessrFavicon.svg',
			'underline decoration-green-400 hover:text-green-400'
		]
		// TBD: ['#', 'decoration-red-400 line-through'],
	};

	const contactLinks = {
		CV: [
			'https://static.vasys.su/CV.pdf',
			'/cv.svg',
			'underline decoration-blue-400 hover:text-blue-400'
		],
		Telegram: [
			'https://t.me/vasyss',
			'/telegram.svg',
			'underline decoration-blue-400 hover:text-blue-400'
		],
		GitHub: [
			'https://github.com/VasySS',
			'/github.svg',
			'underline decoration-blue-400 hover:text-blue-400'
		]
	};

	const domainHeader = 'vasys.su';

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		color: string;
		size: number;
	}

	let particles = $state<Particle[]>([]);
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	const createParticle = (index: number): Particle => {
		const isFast = index % 25 === 0;

		return {
			x: Math.random() * window.innerWidth,
			y: Math.random() * window.innerHeight,
			vx: (Math.random() * 2 - 1) * (isFast ? 4 : 1),
			vy: (Math.random() * 2 - 1) * (isFast ? 4 : 1),
			color: `hsl(${Math.random() * 360}, 100%, 60%)`,
			size: Math.random() * 3 + 5
		};
	};

	const drawParticle = (particle: Particle) => {
		ctx.beginPath();
		ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
		ctx.closePath();

		ctx.fillStyle = particle.color;
		ctx.shadowBlur = 15;
		ctx.fill();
	};

	const handleResize = () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};

	const animate = () => {
		ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		particles.forEach((particle) => {
			particle.x += particle.vx;
			particle.y += particle.vy;

			if (particle.x <= 0) {
				particle.vx *= -1;
			}

			if (particle.x >= canvas.width) {
				particle.vx *= -1;
			}

			if (particle.y <= 0) {
				particle.vy *= -1;
			}

			if (particle.y >= canvas.height) {
				particle.vy *= -1;
			}

			drawParticle(particle);
		});

		requestAnimationFrame(animate);
	};

	onMount(() => {
		const density = 100 / window.devicePixelRatio;
		particles = Array.from({ length: density }, (_, i) => createParticle(i));

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx = canvas.getContext('2d')!;

		animate();
		window.addEventListener('resize', handleResize);
	});
</script>

<svelte:head>
	<title>{domainHeader}</title>
</svelte:head>

<canvas
	bind:this={canvas}
	class="fixed top-0 left-0 -z-10 h-full w-full blur-sm"
></canvas>

<div class="flex h-dvh min-h-96 flex-col justify-around">
	<h1
		id="domain_text"
		class="text-center text-7xl text-white opacity-70 md:text-9xl"
	>
		{domainHeader}
	</h1>

	<div
		class="flex flex-col items-center justify-center space-y-10 md:flex-row md:space-y-0 md:space-x-20"
	>
		{#each Object.entries(projectLinks) as [name, [link, icon, custom_style]]}
			<a
				class="text-5xl text-white md:text-6xl {custom_style}"
				href={link}
			>
				<div class="flex flex-row items-center justify-center space-x-3">
					<img
						src={icon}
						alt={name}
						class="mt-1.5 size-14 rounded-sm p-0.5"
					/>
					<p>{name}</p>
				</div>
			</a>
		{/each}
	</div>

	<footer
		class="flex flex-col items-center justify-center space-y-10 md:flex-row md:space-y-0 md:space-x-20"
	>
		{#each Object.entries(contactLinks) as [name, [link, icon, custom_style]]}
			<a
				class="text-5xl text-white md:text-6xl {custom_style}"
				href={link}
			>
				<div class="flex flex-row items-center justify-center space-x-3">
					<img
						src={icon}
						alt={name}
						class="mt-1.5 size-14 rounded-full bg-white p-0.5"
					/>
					<p>{name}</p>
				</div>
			</a>
		{/each}
	</footer>
</div>

<style>
	#domain_text::after {
		content: '_';
		position: absolute;
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
