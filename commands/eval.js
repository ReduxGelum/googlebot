module.exports = {
  main: async message => {
    const client = message.client;
    if (!client.config.OWNERS.includes(message.author.id)) return;
    const args = message.content;
    client.log('EVAL WAS RUN!');
    try {
      var res = eval(args); // eslint-disable-line no-eval
      if (typeof res !== 'string') res = require('util').inspect(res);
    } catch (err) {
      res = err.message;
    }
    message.channel.sendCode('js', res);
  },
  args: '',
  help: 'run some eval, bruh',
  hide: true
};
