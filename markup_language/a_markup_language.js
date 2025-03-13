
const fs = require('fs')

const INPUT_FILE = fs.readFileSync(process.argv[2], 'utf8')
const INPUT_LINES = INPUT_FILE.split('\n')

const GRAMMAR = {
	TEXT: /^(\w?|\s?|\d?)+$/ig,
	COMMENT: /%([aA-zZ]|[0-9]|\s|\W)+$/ig,
	HEADING: /(^\=+).+$/ig,
	PARAGRAPH: /\n\n/ig,
	HARD_RULE: /(---)/ig,
	ULIST: /\++/ig,
	OLIST: /(^#+([aA-zZ]|[0-9]|\s)+)/ig,
	BLOCKQUOTE: />/ig,
	MONOSPACE: /(\n?|\s?)``(\n?|\s?)/ig,
	BOLD: /(\|)?\*(\|)?([aA-zZ]|[0-9]|\s)+(\|)?\*(\|)?/ig,
	ITALIC: /(\*)?\|(\*)?([aA-zZ]|[0-9]|\s)+(\*)?\|(\*)?/ig,
	BOLD_ITALIC: /(\*|\|)([aA-zZ]|[0-9]|\s)+(\*|\|)/ig,
	UNDERLINE: /_([aA-zZ]|[0-9]|\s)+_/ig,
	STRIKEOUT: /~([aA-zZ]|[0-9]|\s)+~/ig,
	RAW_LINK: /::=([aA-zZ]|[0-9]|\s|\W)+$/ig,
	TITLED_LINK: /::([aA-zZ]|[0-9]|\s|\W)+=([aA-zZ]|[0-9]|\s|\W)+$/ig,
	RAW_IMAGE: /!!=([aA-zZ]|[0-9]|\s|\W)+([^::]$)/ig,
	TITLED_IMAGE: /!!([aA-zZ]|[0-9]|\s|\W)+=([aA-zZ]|[0-9]|\s|\W)+(?!=::)$/ig,
	LINKED_IMAGE: /!!([aA-zZ]|[0-9]|\s|\W)+=([aA-zZ]|[0-9]|\s|\W)+::([aA-zZ]|[0-9]|\s|\W)+$/ig,
	RAW_LINKED_IMAGE: /!!=([aA-zZ]|[0-9]|\s|\W)+::([aA-zZ]|[0-9]|\s|\W)+$/ig,
}

const OPERATORS = Object.keys(GRAMMAR)
const OPERATOR_STRINGS = {
	HARD_RULE: '---',
	ULIST: '+',
	OLIST: '#',
	BLOCKQUOTE: '>',
	MONOSPACE: '``',
	BOLD: '*',
	ITALIC: '|',
	UNDERLINE: '_',
	STRIKEOUT: '~',
	RAW_LINK: '::=',
	LINK_TITLE: '::',
	LINK_URL: '=',
	IMAGE: '!!=',
	LINKED_IMAGE_SRC: '!!=',
	LINKED_IMAGE_URL: '::'
}

const GRAMAR_ELEM = {
	COMMENT: /%/ig,
	HEADING: /=/ig,
	HARD_RULE: /(---)/ig,
	ULIST: /\+/ig,
	OLIST: /#/ig,
	BLOCKQUOTE: />/ig,
	MONOSPACE: /``/ig,
	BOLD: /\*/ig,
	ITALIC: /\|/ig,
	BOLD_ITALIC: /(\*|\|)/ig,
	UNDERLINE: /_/ig,
	STRIKEOUT: /~/ig,
	RAW_LINK: /::=/ig,
	LINK_TITLE: /::(?!=\=)/ig,
	LINK_URL: /(?<=::([aA-zZ]|[0-9]|\s)+)=(?=\s)/ig,
	IMAGE: /!!=/ig,
	LINKED_IMAGE_SRC: /!!=(?=([aA-zZ]|[0-9]|\s)+::)/ig,
	LINKED_IMAGE_URL: /(?<=!!=([aA-zZ]|[0-9]|\s\W)+)::(?=([aA-zZ]|[0-9]|\W) )/ig,
}

const GRAMMAR_STUBS = {
	SPACE: /(\s+)?/ig,
	TEXT: /([aA-zZ]|[0-9]|\s|\W)/
}

const TOOL = {

	listState() {
		TOOL.listState.level = TOOL.listState.level ? TOOL.listState.level : 0;

		const params = {
			get() {
				return TOOL.listState.level
			},

			incr() {
				TOOL.listState.level++
				return TOOL.listState.level
			},

			decr() {
				TOOL.listState.level--
				return TOOL.listState.level
			},

			clear() {
				TOOL.listState.level = 0
				return TOOL.listState.level
			},
		}

		return params
	},

	repeat(item, n) {
		let collector = new Array(n)
		for (let x = 0; x <= n; x++) {
			collector.push(item)
		}
		return collector.join('')
	}
}

let ul_state = TOOL.listState()
let ol_state = TOOL.listState()

function PARSER() {
	const params = {
		TEXT: function (str) {
			return str
		},
		COMMENT: function (str) {
			return `<!-- ${str.replace(GRAMAR_ELEM.COMMENT + '(\s)+', ' ').trim()} -->`
		},
		HEADING: function (str) {
			let contents = str.replace(new RegExp(GRAMAR_ELEM.HEADING, 'ig'), ' ').trim()
			let parsed = str.match(GRAMAR_ELEM.HEADING)

			if (!parsed) return str;

			let level = parsed.length;

			return `<h${level}>${contents}</h${level}>`
		},
		PARAGRAPH: function (str) {
			return str
		},
		HARD_RULE: function (str) {
			return '<hr>'
		},
		ULIST: function (str) {
			let inputLevel = str.match(GRAMAR_ELEM.ULIST, 'ig')
			let stateLevel = ul_state.level 

			if (Math.abs(stateLevel - inputLevel) > (stateLevel + 1)) {
				inputLevel = stateLevel + 1
			}

			let stringLevel = TOOL.repeat(OPERATOR_STRINGS.ULIST, inputLevel)
		},
		OLIST: function (str) {

		},
		BLOCKQUOTE: function (str) {
			let contents = str.replace(
				new RegExp(GRAMAR_ELEM.BLOCKQUOTE + GRAMMAR_STUBS.SPACE, 'ig'), ' '
			).trim()

			return `<blockquote>${contents}</blockquote>`
		},
		MONOSPACE: function (str) {

		},
		BOLD: function (str) {
			let contents = str.replace(
				new RegExp(GRAMAR_ELEM.BOLD, 'ig'), ' '
			).trim()

			return `<strong>${contents}</strong>`
		},
		ITALIC: function (str) {
			let contents = str.replace(
				new RegExp(GRAMAR_ELEM.ITALIC, 'ig'), ' '
			).trim()

			return `<em>${contents}</em>`
		},
		BOLD_ITALIC: function (str) {
			let contents = str.replace(/\*/ig, '<strong>')
				.replace(/\|/, '<em>')
				.replace(/\*/, '</strong>')
				.replace(/\|/, '</em>')

			return contents
		},
		UNDERLINE: function (str) {
			let contents = str.replace(
				new RegExp(GRAMAR_ELEM.UNDERLINE, 'ig'), ' '
			).trim()

			return `<underline>${contents}</underline>`
		},
		STRIKEOUT: function (str) {
			let contents = str.replace(
				new RegExp(GRAMAR_ELEM.STRIKEOUT, 'ig'), ' '
			).trim()

			return `<strikeout>${contents}</strikeout>`
		},
		RAW_LINK: function (str) {
			let contents = str.replace(
				new RegExp(GRAMAR_ELEM.RAW_LINK, 'ig'), ' '
			).trim()

			return `<a href="${contents}" target="_blank">${contents}</a>`
		},
		TITLED_LINK: function (str) {
			let title = str.match(GRAMAR_ELEM.LINK_TITLE)
			let url = str.match(GRAMAR_ELEM.LINK_URL)

			return `<a href="${url}" target="_blank">${title}</a>`
		},
		IMAGE: function (str) {
			let src = str.match(GRAMAR_ELEM.RAW_IMAGE)

			return `<img src="${src}"></img>`
		},
		LINKED_IMAGE: function (str) {
			let contents = str.replace(GRAMAR_ELEM.LINKED_IMAGE_SRC, ' ')

			return `<a href="${contents}"><img src="${contents}"></img></a>`
		},
	}

	return params
}

for (let i = 0; i < INPUT_LINES.length; i++) {
	let item = INPUT_LINES[i]

	OPERATORS.forEach(re => {
		const P = PARSER()[re]
  	if (P) console.log(P(item));
  })
}





