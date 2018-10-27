module.exports = {
    name: 'args-info',
    description: 'Information about the arguments provided.',
    usage: '<user> <role>',
    guildOnly: true,
    args: true,
    cooldown: 5,
    aliases: ['icon', 'pfp'],
    execute(message, args) {
        if (args[0] === 'foo') {
            return message.channel.send('bar');
        }

        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
};