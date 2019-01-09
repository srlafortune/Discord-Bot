module.exports = {
    name: 'shop',
    description: 'List items from the shop',
    usage: '',
    guildOnly: true,
    aliases: ['store'],
    execute(message, args) {
        message.channel.send('Pong.')
    },
}
