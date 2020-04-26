exports.commands = {
        embed: {
        color: 3447003,
        author: {
            name: "",
            icon_url: ""
        },
        description: "PPBot is an AMAZING voice command bot with a few simple chat commands.\n\n Voice commands can only be used when you are in a voicechat.",
        fields: [{
            name: "Commands",
            value: "Send `!all` for all commands\n Send `!voicechat` for all voicechat commands \n Send `!chat` for all chat commands! \n Send `!voicechatcat` for all voice commands with categories! \n"
          },
          {
            name: "Randomizer",
            value: "Send `!fortnite` for all randomizer fortnite commands!\n Any of the categories from `!voicechat` can be randomized, send `!categories` for all randomizer categories commands!"
          },
        ],
        title: "Documentation",
        url: "https://github.com/KlaasTilman/DiscordPPBot",
        footer: {
            icon_url: "",
            text: "© Klaas Tilman",
        }
    }
}

exports.allFields = []

exports.allCommands = {embed: {
        color: 3447003,
        author: {
            name: "",
            icon_url: ""
        },
        description: "The awesome bot Ping Pong!",
        title: "All amazing commands",
        fields: [],
        footer: {
            icon_url: "",
            text: "© Klaas Tilman",
        }
    }
}

exports.chatCommands = {embed: {
        color: 3447003,
        author: {
            name: "",
            icon_url: ""
        },
        title: "All chat commands",
        fields: [],
        footer: {
            icon_url: "",
            text: "© Klaas Tilman",
        }
    }
}

exports.voiceCommands = {embed: {
        color: 3447003,
        author: {
            name: "",
            icon_url: ""
        },
        title: "All voice commands",
        fields: [],
        footer: {
            icon_url: "",
            text: "© Klaas Tilman",
        }
    }
}

exports.alphaTest = {embed: {
    color: 3447003,
    author: {
        name: "",
        icon_url: ""
    },
    title: "All voice commands alphabetical",
    fields: [],
    footer: {
        icon_url: "",
        text: "© Klaas Tilman",
    }
}
}

exports.logging = {embed: {
    color: 3447003,
    author: {
        name: "",
        icon_url: ""
    },
    title: "Most used voice commands",
    fields: [],
    footer: {
        icon_url: "",
        text: "© Klaas Tilman",
    }
}
}