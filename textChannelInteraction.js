exports.processMessage = processMessage;
exports.getMessageType = getMessageType;
exports.addMessageToDelete = addMessageToDelete;
exports.getRandomVoiceCommand = getRandomVoiceCommand;
const Connection = require('./connection.js');
const Response = require('./responseObjects.js');
const startUpInteraction = require('./startUpInteraction');
const Embeds = require('./embeds.js');
const regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

var messages_to_delete = [];

const CHAT_COMMAND = 0;
const VOICE_COMMAND = 1;
const IMAGE_COMMAND = 2;
const EMBED_COMMAND = 3;
const RANDOM_COMMAND = 4;
const VOLUME_COMMAND = 5;
const INSTRUCTION_COMMAND = 6;
const EMOJI_COMMAND = 7;
const SUGGESTION_COMMAND = 8;
const GROOVY_COMMAND = 9;

const PERM_MESSAGE = "||p||";

/* Data values */
exports.categoriesString = {
    "top10": "Top 10",
    //"recentlyadded": "Recently added 🆕",
    "positivereaction": "Positive Reaction",
    "negativereaction": "Negative Reaction",
    "dutchmemes": "Dutch memes",
    "memes": "Memes",
    "startofsession": "Start of session",
    "endofsession": "End of session",
    "names": "Names",
    "timespecific": "Time specific"
}

exports.categories = {
    "Top 10": ["test"],
    //"Recently added 🆕": [],
    "Positive Reaction": [],
    "Negative Reaction": [],
    "Dutch memes": [],
    "Memes": [],
    "Start of session": [],
    "End of session": [],
    "Names": [],
    "Time specific": []
};

var emojiNumbers = [
    [
    '❤️',
    '🤎',
    '💙',
    '🧡',
    '🤍',
    '💜'],
    [
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣'],
    [
    '🔴',
    '🟤',
    '🔵',
    '🟠',
    '⚪',
    '🟣'],
    [
    '🇦',
    '🇧',
    '🇨',
    '🇩',
    '🇪',
    '🇫']
]

exports.random_command_emojis = {
    '👍': 'negativereaction',
    '👎': 'positivereaction',
    '🇳🇱': 'dutchmemes',
    '😂': 'memes',
    '💪': 'startofsession',
    '👋': 'endofsession'
}

exports.suggestion_emojis = {
    '👍': '',
    '👎': '',
}

var skip_emoji = '⏩';
var stop_emoji = '⏹️';
var pause_emoji = '⏸️';
var resume_emoji = '⏯️';

function processMessage(client, message) {
    var messageObject = getMessageType(message, client);
    /*if (message.author.username==="Kizerain") {
        message.react("🎉");
        message.react("🎈");
        message.react("🎊");
        message.react("😃");
        message.react("2⃣");
        message.react("1⃣");
    } */

    sendEmojiMessage(message);
    if (message.author.username == 'PPBot') {
        reactToEmojiMessage(message);

        let embed = message.embeds[0];

        if (embed && embed.title == 'All voice commands') {
            reactToEmbedMessage(message, exports.random_command_emojis);
        }

        if (embed && embed.title == 'Suggestion link') {
            reactToEmbedMessage(message, exports.suggestion_emojis);
        }

        if (!message.content.startsWith(PERM_MESSAGE) && message.embeds.length == 0) {
            addMessageToDelete(message);
        }
    }

    // Text commands
    if (messageObject != null) {
        if (messageObject.type != EMOJI_COMMAND) {
            addMessageToDelete(message);
        }
        switch (messageObject.type) {
            case CHAT_COMMAND:
                sendMessage(message.channel, messageObject.response);
                break;
            case VOICE_COMMAND:
                Connection.handleVoiceCommand(message, messageObject.response);
                break;
            case VOLUME_COMMAND:
                Connection.handleInstructions(message, "!volume", messageObject.response);
                break;
            case INSTRUCTION_COMMAND:
                Connection.handleInstructions(message, messageObject.response, null);
                break;
            case IMAGE_COMMAND:
                sendImage(message.channel, messageObject.response);
                break;
            case EMBED_COMMAND:
                sendEmbed(client, message.channel, messageObject.response);
                break;
            case RANDOM_COMMAND:
                Connection.handleVoiceCommand(message, messageObject.response); 
                break;
            case EMOJI_COMMAND:
                responseWithEmoji(message, messageObject.response);
                break;
            case SUGGESTION_COMMAND:
                sendMessage(message.channel, messageObject.response);
                break;
        }
    }

    var deleting = debounce(deleteMessages, 20000, false);
    deleting();
}

function getMessageType(message, client, message_lower_case) {
    if (!message_lower_case) {
        message_lower_case = getMessageLowerCase(message);
    }
    message_without_first_letter = message_lower_case.substr(1);
    if(Response.responseObject[message_lower_case] && message.author.username != 'PPBot') {
        return {
            type: CHAT_COMMAND,
            response: Response.responseObject[message_lower_case]
        };
    } else if (Response.imageObject[message_lower_case]) {
        return {
            type: IMAGE_COMMAND,
            response: './Imagefiles/'+Response.imageObject[message_lower_case]
        };
    } else if (Response.voiceObject[message_lower_case]) {
        return {
            type: VOICE_COMMAND,
            response: Response.voiceObject[message_lower_case]['file']
        };
    } else if (message_lower_case==="!skip" || message_lower_case==="!stop" || message_lower_case==="!queue" 
                || message_lower_case==="!np" || message_lower_case==="!pause" || message_lower_case==="!resume" || message_lower_case==="!volume") {
        return {
            type: INSTRUCTION_COMMAND,
            response: message_lower_case
        }
    } else if (message_lower_case.startsWith('!volume')) {
        var volumeMessage=message_lower_case.split(/[ ]+/);
        var volume;
        if (volumeMessage.length!=1) {
            switch(volumeMessage[1]) {
                case "lower":
                    volume=volumeMessage[1];
                    break;
                case "higher": 
                    volume=volumeMessage[1];
                    break;
                case "half":
                    volume=volumeMessage[1];
                    break;
                case "twice":
                    volume=volumeMessage[1];
                    break;
                default:
                    volume=parseInt(volumeMessage[1]);
            }
        }
        return {
            type: VOLUME_COMMAND,
            response: volume
        }
    } else if (Response.embeds[message_lower_case]) {
        if (message_lower_case == "!mostused") {
            startUpInteraction.initializeDataAndEmbeds();
        }
        return {
            type: EMBED_COMMAND,
            response: Response.embeds[message_lower_case]
        };
    } else if (exports.categoriesString[message_without_first_letter]) {
        return {
            type: RANDOM_COMMAND,
            response: getRandomVoiceCommand(message_without_first_letter)
        }
    } else if (message.mentions && (message.mentions.users.array().length > 0 || message.mentions.roles.array().length > 0 || message.mentions.everyone)) {
        return {
            type: EMOJI_COMMAND,
            response: client.emojis.cache.get(Response.emojiObject["PingReee"])
        };
    } else if (Response.emojiObject[message_lower_case]) {
        return {
            type: EMOJI_COMMAND,
            response: client.emojis.get(Response.emojiObject[message_lower_case])
        };
    } else if (message_lower_case.startsWith('!suggestion')) {
        var suggestionArray=message.content.split(/\r?\n/);
        let formattedSuggestion = [];
        for (var i = 0; i < suggestionArray.length; i++) {
            suggestionArray[i] = suggestionArray[i].split(':');
            formattedSuggestion[suggestionArray[i][0]] = suggestionArray[i][1];
            if (suggestionArray[i][0] == 'link' && suggestionArray[i][2]) {
                formattedSuggestion['link'] += ':' + suggestionArray[i][2];
                formattedSuggestion['link'] = formattedSuggestion['link'].replace(/\s/g, "");
            }
        }
        if (
            !formattedSuggestion['link'] || !formattedSuggestion['commandname'] || !formattedSuggestion['category'] || !formattedSuggestion['note']
            || formattedSuggestion['link'] === '' || formattedSuggestion['commandname'] === '' || formattedSuggestion['category'] === '' || formattedSuggestion['note'] === ''
            || !isURL(formattedSuggestion['link'])
        ) {
            return {
                type: SUGGESTION_COMMAND,
                response: 'Suggestion format not correct.'
            }
        } 
        let suggestionEmbed = Embeds.suggestion;
        suggestionEmbed.embed.discription = formattedSuggestion['note'];
        suggestionEmbed.embed.url = formattedSuggestion['link'];
        suggestionEmbed.embed.fields = [];
        suggestionEmbed.embed.fields.push(
            {
                name: "Command name",
                value: formattedSuggestion['commandname']
            }
        );
        suggestionEmbed.embed.fields.push(
            {
                name: "Category",
                value: formattedSuggestion['category']
            }
        );
        suggestionEmbed.embed.fields.push(
            {
                name: "Note",
                value: formattedSuggestion['note']
            }
        );
        suggestionEmbed.embed.footer.text = 'Suggested by : ' + message.author.username;
        return {
            type: SUGGESTION_COMMAND,
            response: suggestionEmbed
        }
    } else if (
        message.author.username == 'Octave'
        || message_lower_case.startsWith('_play')
        || message_lower_case.startsWith('_leave')
        || message_lower_case.startsWith('_playnext')
        || message_lower_case.startsWith('_pause')
        || message_lower_case.startsWith('_volume')
        || message_lower_case.startsWith('_stop')
        || message_lower_case.startsWith('_skip')
        || message_lower_case.startsWith('resume')
        || message_lower_case.startsWith('_queue')
    ) {
        return {
            type: GROOVY_COMMAND
        }
    }
    return null;
}

function getRandomVoiceCommand(category) {
    var randomItem = exports.categories[exports.categoriesString[category]]
                            [Math.floor(Math.random()*exports.categories[exports.categoriesString[category]].length)]
        randomItem="!"+randomItem.replace(/ /g,'');
    return Response.voiceObject[randomItem]['file'];
}

function getMessageLowerCase(message) {
    return message.content.toLowerCase();
}

function sendMessage(channel, message) {
    channel.send(message);
}

function sendImage(channel, image) {
    channel.sendFile(image);
}

function responseWithEmoji(message, emoji) {
    message.react(emoji)
        .catch(console.error);
}

function sendEmbed(client, channel, embed) {
    initializeEmbedFields(client, embed);
    channel.send(embed);
}

function deleteMessages() {
    for (var i=0; i<messages_to_delete.length; i++) {
        messages_to_delete[i].delete(({ timeout: 1000 }));
    }
    messages_to_delete = [];
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
        var context = this, args = arguments;
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function initializeEmbedFields(client, embed) {
    embed['embed']['author']['name']=client.user.username;
    embed['embed']['author']['icon_url']=client.user.avatarURL;
    embed['embed']['footer']['icon_url']=client.user.avatarURL;
}

async function reactToEmbedMessage(message, emojis) {
    for (const [key, value] of Object.entries(emojis)) {
        await message.react(key);
    }
}

async function reactToEmojiMessage(message) {
    var emojiIndex = -1;

    var message_lower_case = getMessageLowerCase(message);
    if (message_lower_case.startsWith(PERM_MESSAGE + emojiNumbers[0][0])) {
        emojiIndex = 0;
    } else if (message_lower_case.startsWith(PERM_MESSAGE + emojiNumbers[1][0])) {
        emojiIndex = 1;
    } else if (message_lower_case.startsWith(PERM_MESSAGE + emojiNumbers[2][0])) {
        emojiIndex = 2;
    } else if (message_lower_case.startsWith(PERM_MESSAGE + emojiNumbers[3][0])) {
        emojiIndex = 3;
    }

    timeout_seconds = 15000;

    if (emojiIndex != -1) {
        for (var i = 0; i<emojiNumbers[emojiIndex].length; i++) {
            await message.react(emojiNumbers[emojiIndex][i]);
        }
    }

    timeout_seconds = 15000;

    if (message_lower_case.startsWith(PERM_MESSAGE + skip_emoji)) {
        await message.react(skip_emoji);
        await message.react(stop_emoji);
        await message.react(pause_emoji);
        await message.react(resume_emoji);
    }
}

function addMessageToDelete(message) {
    messages_to_delete.push(message);
}

function sendEmojiMessage(message) {
    var emojiIndex = 0;

    if (getMessageLowerCase(message) == '!send_emoji_message' && message.author.username == 'Klaas') {
        addMessageToDelete(message);
        var voice_commands = startUpInteraction.allVoiceCommands;
        var i,j,temp_array,chunk=6;
        for (i = 0, j=voice_commands.length; i<j; i+=chunk) {
            temp_array = voice_commands.slice(i, i+chunk);
            testingMessage = "";
            for (k = 0; k < temp_array.length; k++) {
                testingMessage += emojiNumbers[emojiIndex][k];
                testingMessage += " ";
                testingMessage += temp_array[k];
                testingMessage += " ";
            }
            emojiIndex++;
            if (emojiIndex > 3) {
                emojiIndex = 0;
            }
            sendMessage(message.channel, PERM_MESSAGE + testingMessage);
        }
    }

    if (getMessageLowerCase(message) == '!send_emoji_instructions' && message.author.username == 'Klaas') {
        addMessageToDelete(message);
        var skip_string = skip_emoji + ' SKIP ';
        var stop_string = stop_emoji + ' STOP ';
        var pause_string = pause_emoji + ' PAUSE ';
        var resume_string = resume_emoji + ' RESUME ';

        sendMessage(message.channel, PERM_MESSAGE + skip_string + stop_string + pause_string + resume_string);
    }

    /** TEMP CODE */
}

function isURL(str) {
    var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    var url = new RegExp(urlRegex, 'i');
    console.log(str.length < 2083 && url.test(str));
    return str.length < 2083 && url.test(str);
}