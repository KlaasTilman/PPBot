exports.initializeBot = initializeBot;
exports.initializeDataAndEmbeds = initializeDataAndEmbeds;

const Response = require('./responseObjects.js');
const Embeds = require('./embeds.js');
const Connection = require('./connection.js');
const fs = require("fs");
const path = require("path");
const { promisify } = require('util')
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const textChannelInteraction = require('./textChannelInteraction.js');
const { timeStamp } = require('console');

exports.allVoiceCommands = [];

function initializeBot(client) {
    console.log('The awesome bot made by Klaas Tilman is now online! Woahahoah');
    client.user.setActivity('!commands', { type: 'PLAYING' });

    initializeDataAndEmbeds();

    channel = client.channels.cache.get('712360371717144596');
    guild = client.guilds.cache.get('456913906414125065');

    // 12oclock
    setTimeout(function(){ 
        playClock(channel, guild, "12oclock");
        var dayMillseconds = 1000 * 60 * 60 * 24;
        setInterval(function(){ // repeat this every 24 hours
            playClock(channel, guild, "12oclock");
        }, dayMillseconds)
    }, leftToTime(24,0,0,0));

    // 9oclock
    setTimeout(function(){ 
        playClock(channel, guild, "9oclock");
        var dayMillseconds = 1000 * 60 * 60 * 24;
        setInterval(function(){ // repeat this every 24 hours
            playClock(channel, guild, "9oclock");
        }, dayMillseconds)
    }, leftToTime(21,0,0,0));

    // 9oclock
    setTimeout(function(){ 
        playClock(channel, guild, "5uur");
        var dayMillseconds = 1000 * 60 * 60 * 24;
        setInterval(function(){ // repeat this every 24 hours
            playClock(channel, guild, "5uur");
        }, dayMillseconds)
    }, leftToTime(17,0,0,0));
}

async function initializeDataAndEmbeds() {
	await readAllVoiceFiles();
    makeResponseArrays();
    updateLoggingEmbed();
    resetEmbeds();
    setAllEmbeds();
    setSpecificEmbeds();
}

async function readAllVoiceFiles() {
	Response.voiceObject = {};
    dirname = 'Voice files';
	let directories = await readdir(dirname);
	const absPath = path.resolve(dirname);
    for (let directory of directories) {
		// get file info and store in pathContent
		try {
        	let stats = await stat(absPath + '/' + directory)
        	if (stats.isFile()) {
            	//
        	} else if (stats.isDirectory()) {
            	let files = await readdir(absPath + '/' + directory);
            	for (let file of files) {
					extension = path.extname(file);
					if (extension === '.mp3' || extension === '.wav') {
						filename = file.slice(0, -4);
						category = false;
						category = textChannelInteraction.categoriesString[directory];
						if (category) {
							Response.voiceObject['!' + filename] = {file: directory + '\\' + file, categories: [category], categoriesFortnite: []};
						}
					}
        		}
          	}
        } catch (err) {
          console.log(`${err}`);
        }
	}
	return;
}

function makeResponseArrays() {
    var voiceObjectKeys=Object.keys(Response.voiceObject);
    for (var i=0; i<voiceObjectKeys.length; i++) {
        let currentVoiceKey=voiceObjectKeys[i];
        exports.allVoiceCommands.push(currentVoiceKey.substring(1));
        // Add 15 last added commands
        if (i>voiceObjectKeys.length-15) {
            // textChannelInteraction.categories["Recently added 🆕"].push(" "+currentVoiceKey.substring(1));
        }
        // Push all voice commands
        for (var j=0; j<Response.voiceObject[currentVoiceKey]['categories'].length; j++) {
            if (i==0) {
                textChannelInteraction.categories[Response.voiceObject[currentVoiceKey]['categories'][j]].push(currentVoiceKey.substring(1));
            } else {
                textChannelInteraction.categories[Response.voiceObject[currentVoiceKey]['categories'][j]].push(" "+currentVoiceKey.substring(1));
            }
        }
        // Push all fortnite related voice commands
        for (var j=0; j<Response.voiceObject[currentVoiceKey]['categoriesFortnite'].length; j++) {
            textChannelInteraction.fortniteCategories[Response.voiceObject[currentVoiceKey]['categoriesFortnite'][j]].push(currentVoiceKey);
        }
    }
}

function setAllEmbeds() {
    var categoriesKeys=Object.keys(textChannelInteraction.categories);
    for (var i=0; i<categoriesKeys.length; i++) {
        Embeds.allFields.push(
            {
                name: categoriesKeys[i],
                value: textChannelInteraction.categories[categoriesKeys[i]].reverse().toString(),
            }
        );
    }
    Embeds.allFields.push({
        name: "Simple response commands",
        value: "ayy, wat, lol, ping, pong, pief, paf, sup, regret, dab, nigga, really nigga"
    })
    Embeds.allFields.push(
    {
        name: "Bot",
        value: "test, help, commands, all, voicechat, chat, fortnite"
    })
    Embeds.allFields.push(
    {
        name: "Images/Gifs",
        value: "niceshot, regret, nigga, hackerman, hihi, hihi met"
    })
}

// Reset all embeds to an empty array
function resetEmbeds() {
    Embeds.chatCommands['embed']['fields']=[];
    Embeds.voiceCommands['embed']['fields']=[];
}

// Add all commands to the embeds
function setSpecificEmbeds() {
    Embeds.allCommands['embed']['fields']=Embeds.allFields;
    var name;
    // Setting all voice commands
    for (var i=0; i<Embeds.allFields.length; i++) {
        name=Embeds.allFields[i]['name'];
        if (name==="Simple response commands") {
            break;
        }
        Embeds.voiceCommands['embed']['fields'].push(Embeds.allFields[i]);
    }
    // Setting all chat commands
    for (var i=7; i<Embeds.allFields.length; i++) {
        Embeds.chatCommands['embed']['fields'].push(Embeds.allFields[i]);
    }
    // Setting alphabetical categories 
    setAlphabeticalEmbed();
}

function setAlphabeticalEmbed() {
    allVoiceCommandsSorted = exports.allVoiceCommands.sort();
    var currentCharacter;
    var currentString = "";
    for (var i=0; i<allVoiceCommandsSorted.length; i++) {
        if (currentString != "" 
            && (currentCharacter != allVoiceCommandsSorted[i].charAt(0))
            && allVoiceCommandsSorted[i].charAt(0).match(/[a-z]/i)
        ) {
            Embeds.alphaTest['embed']['fields'].push(
                {
                    name: currentCharacter,
                    value: currentString,
                    inline: true
                }
            );
            currentString = "";
        }
        currentCharacter = allVoiceCommandsSorted[i].charAt(0);

        if (currentString == "") {
            currentString += allVoiceCommandsSorted[i].toString();
        } else {
            currentString += ", " + allVoiceCommandsSorted[i].toString();
        }
    };
}

function updateLoggingEmbed() {
    // Get the logging data
    let loggingRaw = fs.readFileSync("./Logging/logging.json");

    // Convert to usable JSON
    let loggingJSON = JSON.parse(loggingRaw);

    // Convert to sorted array
    var sortedArray = [];
    for (var i in loggingJSON) {
        sortedArray.push([loggingJSON[i], i])
    }
    sortedArray.sort(function (a, b) {
        if (a[0] > b[0]) {
            return -1;
        }
        if (b[0] > a[0]) {
            return 1;
        }
        return 0;
    })

    var commandsString = "";
    var top10 = [];

    for (var i=0; i<30; i++) {
        commandsString += sortedArray[i][1] + " " + sortedArray[i][0] + "\n";
        if (i < 10) {
            top10.push(" " + sortedArray[i][1]);
        }
    }
    if (commandsString === "") {
        commandsString = "No commands used yet";
    }
    
    Embeds.logging['embed']['fields'] = [];
    Embeds.logging['embed']['fields'].push({
            name: "Commands",
            value: commandsString
        });
        textChannelInteraction.categories["Top 10"] = top10.reverse();
}

// Play a file in a channel in a guild
async function playClock(channel, guild, fileName) {
    await Connection.handleFile(Response.voiceObject["!"+fileName]["file"], null, channel, guild);
} 

// Calculate time left to a certain time
function leftToTime(hours, minutes, seconds, milliseconds){
    var d = new Date();
    var x = -d + d.setHours(hours,minutes,seconds,milliseconds);
    return (x);
}