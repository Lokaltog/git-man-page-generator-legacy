Baba.init(babaGrammars.gitManual, [babaTransforms.common, babaTransforms.gitManual])

var seedLength = 32
var urlSeed = (document.URL.split('#')[1] || '').slice(0, seedLength)

function randomSeed(seed) {
	if (seed) {
		// Seed with provided seed
		Math.seedrandom(seed)
		return seed
	}

	// Generate new random seed
	seed = Math.seedrandom()
	var hex = ''
	for (var i = 0; i < seed.length; i++) {
		hex += '' + seed.charCodeAt(i).toString(16)
	}
	var seedSliced = hex.slice(0, seedLength)
	Math.seedrandom(seedSliced)

	return seedSliced
}

function $(selector, el) {
	if (!el) {
		el = document
	}
	return el.querySelector(selector)
}

function $$(selector, el) {
	if (!el) {
		el = document
	}
	return el.querySelectorAll(selector)
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function refresh() {
	// handle url seed (permalink)
	var seed = randomSeed(urlSeed)
	urlSeed = null
	$('#permalink').setAttribute('href', '#' + seed)

	// command name and description
	var commandNameRaw = Baba.render(babaGrammars.gitManual['command-name-main'])
	var commandName = '<code>' + commandNameRaw + '</code>'
	var commandAction = Baba.render(babaGrammars.gitManual['command-action'])
	var commandDescription = Baba.render(babaGrammars.gitManual['command-description'])
	var commandNameContainers = $$('.command-name')
	var i

	$('header h1').innerHTML = commandName
	for (i = 0; i < commandNameContainers.length; i += 1) {
		commandNameContainers[i].innerHTML = commandName
	}

	document.title = commandNameRaw + ' - git man page generator'
	$('.command-action').innerHTML = commandAction
	$('.command-description').innerHTML = commandName + ' ' + commandDescription

	// arguments
	var arguments = []
	var rawArguments = []
	var argument = ''
	for (i = 0; i < randomInt(2, 4); i += 1) {
		if (Math.random() > .5) {
			var optarg = []
			for (var i = 0; i < randomInt(2, 4); i += 1) {
				var a = Baba.render(babaGrammars.gitManual['command-option-raw'])
				rawArguments.push(a)
				optarg.push(a)
			}
			argument = '[ ' + optarg.join(' | ') + ' ]'
		}
		else {
			argument = Baba.render(babaGrammars.gitManual['command-option-raw'])
			rawArguments.push(argument)

			if (Math.random() > .5) {
				argument = '[ ' + argument + ' ]'
			}
		}

		arguments.push(argument)
	}
	$('.command-arguments').innerHTML = ' ' + arguments.join(' ')

	// description
	var description = ''
	for (var i = 0; i < randomInt(2, 4); i += 1) {
		description += '<p>' + Baba.render(babaGrammars.gitManual.paragraph) + '</p>'
	}
	$('#description .contents').innerHTML = description

	// argument descriptions
	var argDesc = []
	rawArguments.forEach(function (arg) {
		argDesc.push('<dt>' + arg + '<dd>' + Baba.render(babaGrammars.gitManual['option-description']))
	})
	$('#options').innerHTML = argDesc.join('')

	// see also
	var seeAlso = []
	for (i = 0; i < randomInt(2, 4); i += 1) {
		seeAlso.push('<li><a href="#" class="refresh">' + Baba.render(babaGrammars.gitManual['command-name']) + '</a>')
	}
	$('#see-also').innerHTML = seeAlso.join('')

	// add event listeners to refresh links
	var refreshEls = $$('.refresh')
	for (i = 0; i < refreshEls.length; i += 1) {
		refreshEls[i].addEventListener('click', refresh)
	}
}
refresh()
$('#refresh').addEventListener('click', refresh)
