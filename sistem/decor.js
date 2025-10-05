const fs = require('fs');
const chalk = require('chalk');
////////////////


/////// CPANEL SERVER 2
global.panels3 = "https://kianprivatepanel.pterodactyl-io.web.id"//domain panel
global.creds3 = "ptla_tETH7yErD5fH05D0yhVmgP85dzeogLz3cEK7gxYINyt"// plta
global.apiusers3 = "ptlc_Ou8uqRdzGC8zG79eYJyu1uzeNntnzE0BJK9NzdW0cwf"//pltc
global.eggsnyas3 = 15
global.netsnyas3 = 5
global.locations3 = "1"
















//\\
global.decor = {
	menut: '❏═┅═━–〈',
	menub: '┊•',
	menub2: '┊',
	menuf: '┗––––––––––✦',
	hiasan: '꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷',

	menut: '––––––『',
    menuh: '』––––––',
    menub: '┊☃︎ ',
    menuf: '┗━═┅═━––––––๑\n',
	menua: '',
	menus: '☃︎',

	htki: '––––––『',
	htka: '』––––––',
	haki: '┅━━━═┅═❏',
	haka: '❏═┅═━━━┅',
	lopr: 'Ⓟ',
	lolm: 'Ⓛ',
	htjava: '❃'
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})