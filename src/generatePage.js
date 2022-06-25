export default function generatePage(text, links) {
	const lines = text.split("\n")
	const page = {
		height: lines.length,
		width: lines.reduce((mw, line) => Math.max(mw, line.length), 0),
	}
	page.cells = Array(page.height).fill().map((row, y) =>
		Array(page.width).fill().map((cell, x) => {
			if (lines[y][x] === " ") return {char: "\xa0"}
			return {char: lines[y][x] || "\xa0"}
		})
	)
	links.forEach(link => {
		const ind = lines[link.line].indexOf(link.text)
		if (ind !== -1) {
			for (let x = ind; x < ind + link.text.length; x++) {
				if (link.func) page.cells[link.line][x].func = link.func
				if (link.href) page.cells[link.line][x].href = link.href
			}
		}
	})
	return page
}
