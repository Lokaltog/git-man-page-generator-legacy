Baba.init(babaGrammars.gitManual, [babaTransforms.common, babaTransforms.gitManual])

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
	// not the best JS code, but it works well and doesn't depend on something like jQuery
	// command name and description
	var commandNameRaw = Baba.render(babaGrammars.gitManual['command-name-raw'])
	var commandName = '<code>' + commandNameRaw + '</code>'
	var commandAction = Baba.render(babaGrammars.gitManual['action'])
	var commandDescription = Baba.render(babaGrammars.gitManual['command-description'])
	var commandNameContainers = $$('.command-name')

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
		argDesc.push('<dt>' + arg + '<dd>' + Baba.render(babaGrammars.gitManual['command-description']))
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
