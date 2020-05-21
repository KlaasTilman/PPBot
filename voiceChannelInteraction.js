exports.interactWithVoiceChannel=interactWithVoiceChannel;
const Connection = require('./connection.js');
const Response = require('./responseObjects.js');

function interactWithVoiceChannel(oldMember, newMember) {
    let newUserChannel = newMember.voiceChannel
    let oldUserChannel = oldMember.voiceChannel
    if(oldUserChannel === undefined && newUserChannel !== undefined && newMember.user.bot===false) {
        // User joined a voice channel 
        playEventFiles(newMember.voiceChannel, newMember.guild);

        playUserSpecificFiles(newMember.user.username, newMember.voiceChannel, newMember.guild);
    } else if(newUserChannel === undefined && newMember.user.bot===false){
        // User leaves a voice channel
    } else if(newUserChannel!=oldUserChannel && newMember.user.bot===false) {
        // User changes voice channel 
    }
}

async function playEventFiles(voiceChannel, guild) {
    if (getToday()=='Wednesday') {
        await Connection.handleFile(Response.voiceObject["!wednesday"]["file"], null, voiceChannel, guild);
    }
}

async function playUserSpecificFiles(username, voiceChannel, guild) {
    var voiceCommand = Response.joinVoiceChatResponse[username] ? Response.joinVoiceChatResponse[username] : Response.joinVoiceChatResponse["default"]

    if (Response.joinVoiceChatResponse[username]) {
        await Connection.handleFile(Response.voiceObject[voiceCommand]["file"], null, voiceChannel, guild);
    } else {
        await Connection.handleFile(Response.voiceObject[voiceCommand]["file"], null, voiceChannel, guild);
    }
}

// Get the current day
function getToday(){
    let today = new Date();
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Friday'];
    return days[today.getDay()-1];
}