const Discord = require('discord.js');
const client = new Discord.Client();
var isReady = true;

function commandIs(str, msg){
    return msg.content.toLowerCase().startsWith("sup " + str);
}

function commandSay(str, msg){
    return msg.content.toLowerCase().startsWith("!" + str);
}


function ttsBot(message, args) {
    if(commandSay("say",message)) {
        if(args.length===1) {
            message.channel.sendMessage('(Idiot). Usage: !say [message to say].');
        } else {
            message.channel.sendMessage(args.join(" ").substring(5),{tts:true});
        }
    }
}

function playVoiceCommand(message) {
    if (isReady) {
        if (message.member.voiceChannelID==null) {
            message.channel.sendMessage('You have to be in a voice chat to use this command.')
        } else if (isReady) {
            isReady=false;
            var voiceChannel=message.member.voiceChannel;
            voiceChannel.join().then(connection =>{
                const dispatcher=connection.playFile('./Voice files/'+voiceObject[message.content.toLowerCase()]);
                dispatcher.on("end", end => {voiceChannel.leave();
                isReady=true;});
            }).catch(err => console.log(err));
        } 
    } else {
        message.channel.send("Please wait for the current voice command to end.");
    }
}

let voiceObject = {
    "!pancake": 'pancake.mp3',
    "!whoops": 'whoops.mp3',
    "!magnumdong": 'magnumdong.mp3',
    "!gotem": 'gotem.mp3',
    "!niet": 'niet.mp3',
    "!glitter": 'glitter.mp3',
    "!darkness": 'darkness.mp3',
    "!regret": 'sad.wav',
    "regret": 'darkness.mp3',
    "!shots": 'shots.mp3',
    "!cant": 'cant.wav',
    "!die": 'die.mp3',
    "!freestyler": 'freestyler.wav',
    "!wtf": 'wtf.mp3',
    "!lidl": 'lidl.mp3',
    "!badum": 'badum.mp3',
    "!nexttime": 'nexttime.mp3',
    "!no": 'no.wav',
    "!never": 'never.wav',
    "!lying": 'lying.wav',
    "!wahahou": 'wahahou.wav',
    "!chocola": 'chocola.wav',
    "!profanity": 'profanity.wav',
    "!tongue": 'tongue.wav',
    "!alright": 'alright.wav',
    "!goodbye": 'goodbye.wav',
    "!komtgoed": 'komtgoed.wav',
    "!poep": 'poep.wav',
    "!bingo": 'bingo.wav',
    "!myself": 'myself.wav',
    "!houston": 'houston.wav',
    "!try": 'try.wav',
    "!tears": 'tears.wav',
    "!endworld": 'endworld.wav',
    "!missyou": 'missyou.wav',
    "!together": 'together.wav',
    "!steeds": 'steeds.wav',
    "!hello": 'hello.wav',
    "!tochniet": 'tochniet.wav',
    "!skill": 'skill.wav',
    "!dumb": 'dumb.wav',
    "!biem": 'biem.wav',
    "!fine": 'fine.mp3',
    "!duuun": 'duuun.mp3',
    "!happened": 'happened.mp3',
    "!killmyself": 'killmyself.wav',
    "!rustaagh": 'rustaagh.mp3',
    "!dunked": 'dunked.wav',
    "!infinity": 'infinity.mp3',
    "!sad": 'sad.wav',
    "!herewego": 'herewego.mp3',
    "!mission": 'mission.mp3',
    "!rip": 'rip.mp3',
    "!trombone": 'trombone.mp3',
    "!start": 'start.mp3',
    "!noone": 'noone.mp3',
    "!damnson": 'damnson.mp3',
    "!tadaah": 'tadaah.mp3',
    "!pressure": 'pressure.wav',
    "!kapitein": 'kapitein.wav',
    "!nigga": 'nigga.mp3',
    "!like": 'like.mp3',
    "!smooth": 'smooth.wav',
    "!behappy": 'behappy.wav',
    "!river": 'river.wav',
    "!mylife": 'mylife.wav',
    "!gratis": 'gratis.wav',
    "!how": 'how.wav',
    "!letsdoit": 'letsdoit.wav',
    "!uhm": 'uhm.wav',
    "!hehe": 'hehe.wav',
    "!rutte": 'rutte.wav',
    "!gohome": 'gohome.wav',
    "!whatyoudoing": 'whatyoudoing.wav',
    "!dontthinkso": 'dontthinkso.wav',
    "!ruined": 'ruined.wav',
    "!vibeit": 'vibeit.wav',
    "!omgwow": 'omgwow.mp3',
    "!sperdnigga": 'sperdnigga.mp3',
    "!mbaku": 'mbaku.wav',
    "!meneerdeboer": 'meneerdeboer.wav'
};

let responseObject = {
    "ayy": "Ayy, lmao!",
    "wat": "Say what?",
    "lol": "roflmaotntpmp",
    "!test": "Yes I am online :)",
    "ping": "pong",
    "pong": "ping",
    "pief": "paf",
    "paf": "pief",
    "sup": "The Sky",
    "oh shit waddup": "The Sky",
    "!stats steam holmes": "!stats steam 76561198152188680",
    "!niceshot": "https://gfycat.com/QuarrelsomeUnawareIslandwhistler",
    "nice shot": "https://gfycat.com/QuarrelsomeUnawareIslandwhistler",
    "🏓": "🏓",
    "help": "Need help? (Yes PP/No PP)",
    "!help": "Need help? (Yes PP/No PP)",
    "no pp": "Okay! xx 🏓",
    "yes pp": "Send `!commands` for a list of commands",
    "regret": "Did you say regret!?",
    "dab": "Did you say dab!?",
    "!hackerman": "https://giphy.com/gifs/fury-kung-hackerman-QbumCX9HFFDQA"
};

let imageObject = {
    "regret": './regret.png',
    "!regret": './regret.png',
    "dab": './dab.png',
    "nigga": './nigga.png',
    "really nigga": './nigga.png',
    "!nigga": './nigga.png',
    "meirl": './meirl2.png',
    "meirll": './meirl.png',
    "meirlll": './meirlmerge.jpg'
}

let commandsEmbed = {embed: {
        color: 3447003,
        author: {
            name: "",
            icon_url: ""
        },
        description: "The awesome bot Ping Pong!",
        title: "Voice Commands",
        fields: [{
            name: "Reaction 😯",
            value: "niet, cant, die, badum, nexttime, no, lying, myself, houston, try, tears, shots, wtf, rustaagh, nigga, trombone, river, hehe, whatyoudoing, dontthinkso, ruined, omgwow, mbaku, meneerdeboer"
        },
        {
            name: "Rocket League 🚙💥",
            value: "kapitein, freestyler, dunked, smooth, herewego, start, skill, mission, tadaah, pressure, happened, duuun, gratis"
        },
        {
            name: "Motivation 💪",
            value: "together, komtgoed, infinity, never, behappy, mylife, letsdoit, vibeit"
        },
        {
            name: "Sad 😭",
            value: "fine, dumb, killmyself, sad, darkness, rip, missyou, goodbye, endworld, how, rutte, gohome"
        },
        {
            name: "Meme",
            value: "pancake, whoops, magnumdong, gotem, poep, glitter, lidl, wahahou, chocola, tongue, biem, like, hello, uhm, sperdnigga"
        },
        {
            name: "Funny 😂",
            value: "bingo, steeds, tochniet, alright, profanity, damnson, noone"
        },
        {
            name: "Chat commands",
            value: "ayy, wat, lol, ping, pong, pief, paf, sup, regret, help, dab, nigga, really nigga"
        },
        {
            name: "Chat commands (!)",
            value: "test, niceshot, help, regret, nigga, hackerman"
        }
        ],
        footer: {
            icon_url: "",
            text: "© Klaas Tilman"
        }
    }
}

function sendEmbed(message) {
    commandsEmbed['embed']['author']['name']=client.user.username;
    commandsEmbed['embed']['author']['icon_url']=client.user.avatarURL;
    commandsEmbed['embed']['footer']['icon_url']=client.user.avatarURL;
    message.channel.send(commandsEmbed);
}

client.on('ready', () => {
    console.log('The awesome bot made by Klaas Tilman is now online! Woahahoah');
});

client.on('message',message => {
    var args = message.content.split(/[ ]+/);
    ttsBot(message,args);
    // Text commands
    if (responseObject[message.content.toLowerCase()] && message.author.username!='Ping Pong') {
        message.channel.send(responseObject[message.content.toLowerCase()]);
    }
    // Image commands
    if (imageObject[message.content.toLowerCase()]) {
        message.channel.sendFile('./Image files/'+imageObject[message.content.toLowerCase()]);
    }
    // Voice commands
    if (voiceObject[message.content.toLowerCase()]) {
        playVoiceCommand(message);
    }
    if(commandSay("commands",message)) {
        sendEmbed(message);
    }
    if(message.content.toLowerCase().includes("ping pong")) {
        console.log("Bot was mentioned");
        message.channel.send("Say what?",{tts:true});
    }
});

client.login('Mjk5MTY2MTYzMjM2MjkwNTYw.C8bBaQ.KahSc-pcs8r416EuIbJggbAz6lQ');