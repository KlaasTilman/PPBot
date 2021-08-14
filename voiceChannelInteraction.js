exports.interactWithVoiceChannel=interactWithVoiceChannel;
const Connection = require('./connection.js');
const Response = require('./responseObjects.js');

function interactWithVoiceChannel(oldState, newState) {
    oldMember = oldState.member;
    newMember = newState.member;

    let newUserChannel = newState.channel;
    let oldUserChannel = oldState.channel;

    let guild = newState.guild;

    if(!oldUserChannel && newUserChannel && newMember.user.bot===false) {
        // User joined a voice channel 
        playEventFiles(newUserChannel, guild);

        playUserSpecificFiles(newMember.user.username, newUserChannel, guild);
    } else if(newUserChannel === undefined && newMember.user.bot===false){
        // User leaves a voice channel
    } else if(newUserChannel!=oldUserChannel && newMember.user.bot===false) {
        // User changes voice channel 
    }
}

async function playEventFiles(voiceChannel, guild) {
    if (getToday()=='Tuesday') {
        await Connection.handleFile(Response.voiceObject["!tuesday"]["file"], null, voiceChannel, guild);
    }
    if (getToday()=='Wednesday') {
        await Connection.handleFile(Response.voiceObject["!wednesday"]["file"], null, voiceChannel, guild);
    }
    if (getToday()=='Friday') {
        await Connection.handleFile(Response.voiceObject["!friday"]["file"], null, voiceChannel, guild);
    }
}

async function playUserSpecificFiles(username, voiceChannel, guild) {
    let defaultVoiceCommand = Response.joinVoiceChatResponse["default"];
    let userVoiceCommand = Response.joinVoiceChatResponse[username];

    if (userVoiceCommand && Array.isArray(userVoiceCommand)) {
        let voiceCommand = userVoiceCommand[Math.floor(Math.random() * userVoiceCommand.length)];
        await Connection.handleFile(Response.voiceObject[voiceCommand]["file"], null, voiceChannel, guild);
    } else if (userVoiceCommand) {
        await Connection.handleFile(Response.voiceObject[userVoiceCommand]["file"], null, voiceChannel, guild);
    } else {
        await Connection.handleFile(Response.voiceObject[defaultVoiceCommand]["file"], null, voiceChannel, guild);
    }
}

// Get the current day
function getToday(){
    let today = new Date();
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Friday'];
    return days[today.getDay()-1];
}