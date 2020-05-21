exports.processEmoji = processEmoji;
const Connection = require('./connection.js');
const Response = require('./responseObjects.js');


async function processEmoji(reaction, user) {
    message = reaction.message;
    emoji = reaction.emoji.name;
    if (message.content.includes(emoji)) {
        message_splitted = message.content.split(" ");
        for (var i = 0; i < message_splitted.length; i = i + 2) {
            var emoji_message = message_splitted[i];
            if (emoji == emoji_message) {
                var text_message = "!" + message_splitted[i+1];
                var voice_channel = message.guild.members.get(user.id).voiceChannel;
                if (voice_channel) {
                    await Connection.handleFile(Response.voiceObject[text_message]['file'], message, voice_channel, message.guild);
                }
            }
        }
    }
}