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
	var p = new GrammarParser()
	var g = GitManualGrammar(p)
	p.setGrammar(g)

	// command name and description
	var commandNameRaw = p.render('commandNameRaw')
	var commandName = '<code>' + commandNameRaw + '</code>'
	var commandAction = p.render('action')
	var commandDescription = p.render('commandDescription')
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
				var a = p.render('commandOptionRaw')
				rawArguments.push(a)
				optarg.push(a)
			}
			var argument = '[ ' + optarg.join(' | ') + ' ]'
		}
		else {
			var argument = p.render('commandOptionRaw')
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
		description += '<p>' + p.render('paragraph') + '</p>'
	}
	$('#description .contents').innerHTML = description

	// argument descriptions
	var argDesc = []
	rawArguments.forEach(function (arg) {
		argDesc.push('<dt>' + arg + '<dd>' + p.render('optionDescription'))
	})
	$('#options').innerHTML = argDesc.join('')

	// see also
	var seeAlso = []
	for (var i = 0; i < randomInt(2, 4); i++) {
		seeAlso.push('<li><a href="#" onclick="refresh(); return false">' + p.render('commandName') + '</a>')
	}
	$('#see-also').innerHTML = seeAlso.join('')
}
refresh()
$('button#refresh').addEventListener('click', refresh)
