import generatePage from "./generatePage.js"

const text = `
PROJECTS                   back

(My GitHub)

StuyActivities -> a site that
manages club activity for the
over 3000 students at
Stuyvesant High School. Created
as part of the Student Union IT
Department

today.stuysu.org -> a site that
displays important day-to-day
info for Stuyvesant students.

(Student Union IT GitHub)

Projects for school -> TODO

Small project archive -> TODO
`.trim()

const links = [
	{
		text: "back",
		func: "home",
		line: 0
	},
	{
		text: "(My GitHub)",
		href: "https://github.com/willowiscool",
		line: 2
	},
	{
		text: "StuyActivities",
		href: "https://stuyactivities.org",
		line: 4
	},
	{
		text: "today.stuysu.org",
		href: "https://today.stuysu.org",
		line: 10
	},
	{
		text: "(Student Union IT GitHub)",
		href: "https://github.com/stuysu",
		line: 14
	}
]

const projects = generatePage(text, links)

export default projects;
