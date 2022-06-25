<script>
	import home from "./home.js"
	import about from "./about.js"
	import projects from "./projects.js"
	import contact from "./contact.js"
	import personal from "./personal.js"

	const pages = {home, about, projects, contact, personal}

	const VALIDCHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=!@#$%^&*()_+`~,./<>?[]\{}|"

	// get text width
	// todo update on resize
	const canvas = document.createElement("canvas")
	const ctx = canvas.getContext("2d")
	ctx.font = "28px Inconsolata"
	if (window.innerWidth <= 380) ctx.font = "20px Inconsolata"
	const metrics = ctx.measureText(" ")

	const width = Math.ceil(window.innerWidth / metrics.width)
	const height = Math.ceil(window.innerHeight / (window.innerWidth <= 380 ? 20 : 28))

	let page = {
		width,
		height,
		cells: Array(height).fill().map(row =>
			Array(width).fill().map(cell => {
				return {
					char: VALIDCHARS[Math.floor(Math.random() * VALIDCHARS.length)],
				}
			})
		)
	}

	// generating changes outside of transitionto to be faster
	const NUMFRAMES = 100 // make sure even
	const genNum = NUMFRAMES => Math.floor(Array(NUMFRAMES * .5).fill().map(_ => Math.random()).reduce((a, b) => a + b, 0) + (Math.random() * (NUMFRAMES * .50)))
	const changes = Array(page.height).fill().map(row =>
		Array(page.width).fill().map(cell => {
			let change1 = genNum(NUMFRAMES)
			if (change1 > NUMFRAMES / 2) change1 = NUMFRAMES - change1
			let change2 = genNum(NUMFRAMES)
			if (change2 < NUMFRAMES / 2) change2 = NUMFRAMES - change2
			return {change1, change2}
		})
	)
	transitionTo(home)

	async function transitionTo(np, options = {}) {
		// figure out bounding box of np
		const heightOffset = Math.floor(page.height / 2 - np.height / 2)
		const widthOffset = Math.floor(page.width / 2 - np.width / 2)

		// transition out of current page:
		// take each coordinate and designate for it a frame to change into a random character. distribute along a bell curve
		// central limit theorem says random numbers will approach a bell curve when summed together (at least... I think)
		for (let frame = 0; frame < NUMFRAMES; frame++) {
			let start = Date.now()
			for (let y = 0; y < page.cells.length; y++) {
				for (let x = 0; x < page.cells[y].length; x++) {
					if (changes[y][x].change1 === frame) {
						page.cells[y][x].char = VALIDCHARS[Math.floor(Math.random() * VALIDCHARS.length)]
						page.cells[y][x].func = undefined
						page.cells[y][x].href = undefined
					}
					if (changes[y][x].change2 === frame) {
						page.cells[y][x].char = "\xa0" //nbsp
						if (
							y - heightOffset >= 0 && y - heightOffset < np.height &&
							x - widthOffset >= 0 && x - widthOffset < np.width
						) page.cells[y][x] = Object.assign({}, np.cells[y - heightOffset][x - widthOffset])
					}
				}
			}
			let end = Date.now()
			if (end - start < 50) await sleep(50 - (end - start))
			page = page
		}
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
</script>

<div id="container">
	<div id="noshrink">
		{#each page.cells as row}
			{#each row as cell}
				{#if cell.href}
					<a href={cell.href}>{cell.char}</a>
				{:else if cell.func}
					<button on:click={() => transitionTo(pages[cell.func])}>{cell.char}</button>
				{:else}
					{#if cell.char === "\xa0" || cell.char === " "}
						<span class="defaultpointer">{cell.char}</span>
					{:else}
						<span>{cell.char}</span>
					{/if}
				{/if}
			{/each}
			<br/>
		{/each}
		<!-- <span>{text}</span> -->
	</div>
</div>

<style>
#container {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}
#noshrink {
	flex-shrink: 0;
}
span, a, button {
	font-family: "Inconsolata", monospace;
	font-size: 28px;
	color: #333;
}
@media (max-width: 380px) {
	span, a, button {
		font-size: 20px;
	}
}
.defaultpointer {
	cursor: default;
}
button {
	background: none;
	border: none;
	font-weight: normal;
	padding: 0;
	text-decoration: underline;
	cursor: pointer;
}
</style>
