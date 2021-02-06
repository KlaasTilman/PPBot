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

async function scheduleMusic(channel, guild, musics, hours) {
    for (var i = 0; i < hours.length; i++) {
        var music = musics[Math.floor(Math.random() * musics.length)];
        var minute = Math.floor(Math.random() * 60) + 1;
        console.log(hours[i] + " : " + minute);
        console.log(music);
        setTimeout(function(){ 
            playClock(channel, guild, music);
            var dayMillseconds = 1000 * 60 * 60 * 24;
            setInterval(function(){ // repeat this every 24 hours
                playClock(channel, guild, music);
            }, dayMillseconds)
        }, leftToTime(hours[i], minute,0,0));
    }
}

async function initializeBot(client) {
    console.log('The awesome bot made by Klaas Tilman is now online! Woahahoah');
    client.user.setActivity('!commands', { type: 'PLAYING' });

    await initializeDataAndEmbeds();

    channel = client.channels.cache.get('712360371717144596'); 
    guild = client.guilds.cache.get('456913906414125065');

    feestchannel = client.channels.cache.get('456913907068698647');

    musics = ["bier", "bram", "drinken", "gerard", "johnny", "kikker", "kratje", "nigel", "bier", "bier", "bier", "bier", "bier", "bier", "kratje", "kratje", "kratje", "kratje", "drinken", "drinken", "drinken", "drinken", "drinken"];
    hours = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 24, 24, 24, 24, 24, 24, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5];
    scheduleMusic(feestchannel, guild, musics, hours);

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

    // 17:30
    setTimeout(function(){ 
        playClock(channel, guild, "halfpastfive");
        var dayMillseconds = 1000 * 60 * 60 * 24;
        setInterval(function(){ // repeat this every 24 hours
            playClock(channel, guild, "halfpastfive");
        }, dayMillseconds)
    }, leftToTime(17,30,0,0));

    // 5 uur
    setTimeout(function(){ 
        playClock(channel, guild, "5uur");
        var dayMillseconds = 1000 * 60 * 60 * 24;
        setInterval(function(){ // repeat this every 24 hours
            playClock(channel, guild, "5uur");
        }, dayMillseconds)
    }, leftToTime(17,0,0,0));

    // 16:30
    setTimeout(function(){ 
        playClock(channel, guild, "halfpastfour");
        var dayMillseconds = 1000 * 60 * 60 * 24;
        setInterval(function(){ // repeat this every 24 hours
            playClock(channel, guild, "halfpastfour");
        }, dayMillseconds)
    }, leftToTime(16,30,0,0));

    // 12oclock
    setTimeout(function(){ 
        playClock(channel, guild, "12oclock");
        var dayMillseconds = 1000 * 60 * 60 * 24;
        setInterval(function(){ // repeat this every 24 hours
            playClock(channel, guild, "12oclock");
        }, dayMillseconds)
    }, leftToTime(12,0,0,0));
}

// Calculate time left to a certain time
function leftToTime(hours, minutes, seconds, milliseconds){
    var d = new Date();
    var x = -d + d.setHours(hours,minutes,seconds,milliseconds);
    if (x < 0) {
        // Try the next day 
        x += 86400000;
    }
    return (x);
}

// Play a file in a channel in a guild
async function playClock(channel, guild, fileName) {
    console.log(fileName);
    await Connection.handleFile(Response.voiceObject["!"+fileName]["file"], null, channel, guild);
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
    dirname = 'Voicefiles';
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