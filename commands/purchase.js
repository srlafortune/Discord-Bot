module.exports = {
    name: 'purchase',
    description: 'Purchase item from the shop',
    usage: '<item>',
    guildOnly: true,
    args: true,
    cooldown: 5,
    aliases: ['buy'],
    execute(message, args) {
        message.channel.send('Pong.')
    },
}
