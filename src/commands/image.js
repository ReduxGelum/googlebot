const snekfetch = require('snekfetch');
const cheerio = require('cheerio');
const querystring = require('querystring');

module.exports = {
  main: async (message) => {
    const client = message.client;
    const safe = message.channel.name.includes('nsfw') ? 'off' : 'medium';
    const QUERY_PARAMS = {
      searchType: 'image',
      key: client.util.keys.nextKey,
      cx: client.config.cxImg,
      safe,
      q: encodeURI(message.content),
    };
    const msg = await message.channel.send('**Searching...**');
    return snekfetch.get(`https://www.googleapis.com/customsearch/v1?${querystring.stringify(QUERY_PARAMS)}`)
      .then((res) => msg.edit(res.body.items[0].link))
      .catch(() =>
        snekfetch.get(`https://www.google.com/search?tbm=isch&gs_l=img&safe=${safe}&q=${encodeURI(message.content)}`)
          .then((res) => {
            const $ = cheerio.load(res.text);
            const result = $('.images_table').find('img').first().attr('src');
            return msg.edit(result);
          })
      ).catch((err) => {
        client.error(err);
        msg.edit('**No Results Found**');
      });
  },
  args: '<query>',
  help: 'Search billions of web pages',
  catagory: 'general',
};
