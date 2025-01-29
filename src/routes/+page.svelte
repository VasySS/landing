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
		rotation: number;
		points: number;
	}

	let particles = $state<Particle[]>([]);
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationFrameId: number;

	const createParticle = (index: number): Particle => {
		const isFast = index % 25 === 0;

		return {
			x: Math.random() * window.innerWidth,
			y: Math.random() * window.innerHeight,
			vx: (Math.random() * 2 - 1) * (isFast ? 4 : 1),
			vy: (Math.random() * 2 - 1) * (isFast ? 4 : 1),
			color: `hsl(${Math.random() * 360}, 100%, 60%)`,
			size: Math.random() * 3 + 5,
			rotation: Math.random() * Math.PI * 2,
			points: 4
		};
	};

	const drawStar = (particle: Particle) => {
		const spikes = particle.points;
		const outerRadius = particle.size;
		const innerRadius = outerRadius * 0.4;

		ctx.beginPath();
		for (let i = 0; i < spikes * 2; i++) {
			const radius = i % 2 === 0 ? outerRadius : innerRadius;
			const angle = particle.rotation + (i * Math.PI) / spikes;
			ctx.lineTo(particle.x + Math.cos(angle) * radius, particle.y + Math.sin(angle) * radius);
		}
		ctx.closePath();

		ctx.fillStyle = particle.color;
		// ctx.shadowColor = particle.color;
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
			particle.rotation += 0.02;

			// Wrap around edges
			if (particle.x < 0) particle.x = canvas.width;
			if (particle.x > canvas.width) particle.x = 0;
			if (particle.y < 0) particle.y = canvas.height;
			if (particle.y > canvas.height) particle.y = 0;

			drawStar(particle);
		});

		animationFrameId = requestAnimationFrame(animate);
	};

	onMount(() => {
		particles = Array.from({ length: 100 }, (_, i) => createParticle(i));
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx = canvas.getContext('2d')!;

		animate();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationFrameId);
		};
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
