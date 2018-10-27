module.exports = {
    name: 'ping',
    description: 'Ping!',
    usage: '<user> <role>',
    guildOnly: true,
    args: true,
    cooldown: 5,
    aliases: ['icon', 'pfp'],
    execute(message, args) {
        message.channel.send('Pong.');
    },
};