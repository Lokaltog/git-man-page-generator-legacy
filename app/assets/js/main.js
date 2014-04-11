Baba.init(babaGrammars.gitManual, [babaTransforms.common, babaTransforms.gitManual])

var seedLength = 32
var urlSeed = (document.URL.split('#')[1] || '').slice(0, seedLength)

function randomSeed (seed) {
	if (seed) {
		// Seed with provided seed
		Math.seedrandom(seed)
		return seed
	}

	// Generate new random seed
	var seed = Math.seedrandom()
	var hex = ''
	for (var i=0; i < seed.length; i++) {
		hex += '' + seed.charCodeAt(i).toString(16)
	}
	var seedSliced = hex.slice(0, seedLength)
	Math.seedrandom(seedSliced)

	return seedSliced
}
var $ = function (selector, el) {
	if (!el) {
		el = document
	}
	return el.querySelector(selector)
}
var $$ = function (selector, el) {
	if (! el) {
		el = document
	}
	return el.querySelectorAll(selector)
}
var randomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}
var refresh = function () {
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

	$('header h1').innerHTML = commandName
	for (var i = 0; i < commandNameContainers.length; i++) {
		commandNameContainers[i].innerHTML = commandName
	}

	document.title = commandNameRaw + ' - git man page generator'
	$('.command-action').innerHTML = commandAction
	$('.command-description').innerHTML = commandName + ' ' + commandDescription

	// arguments
	var arguments = []
	var rawArguments = []
	for (var i = 0; i < randomInt(2, 4); i++) {
		if (Math.random() > .5) {
			var optarg = []
			for (var i = 0; i < randomInt(2, 4); i++) {
				var a = Baba.render(babaGrammars.gitManual['command-option-raw'])
				rawArguments.push(a)
				optarg.push(a)
			}
			var argument = '[ ' + optarg.join(' | ') + ' ]'
		}
		else {
			var argument = Baba.render(babaGrammars.gitManual['command-option-raw'])
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
	for (var i = 0; i < randomInt(2, 4); i++) {
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
	for (var i = 0; i < randomInt(2, 4); i++) {
		seeAlso.push('<li><a href="#" onclick="refresh(); return false">' + Baba.render(babaGrammars.gitManual['command-name']) + '</a>')
	}
	$('#see-also').innerHTML = seeAlso.join('')
}
refresh()
$('button#refresh').addEventListener('click', refresh)
