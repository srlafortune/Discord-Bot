module.exports = {
    name: 'giveaway',
    description: 'different commands for the giveaway',
    usage: '<item>',
    guildOnly: true,
    args: true,
    cooldown: 5,
    aliases: [],
    execute(message, args) {
        message.channel.send('Pong.')
    },
}
