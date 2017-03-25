const snekfetch = require('snekfetch');

module.exports = {
  main: message => {
    snekfetch.get(`https://emoji.getdango.com/api/emoji?q=${message.content}`)
      .then((res) => res.body.results.map(r => r.text).slice(0, 7).join(' '))
      .then((final) => message.channel.send(final));
  },
  hide: true,
  args: '<query>',
};
