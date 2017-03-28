const Client = require('./GooglebotClient');
const Frontend = require('./frontend');

const client = new Client();
const frontend = new Frontend(client);

const updateCount = require('./util/updateCount');

client.on('error', client.error.bind(null, '[CLIENT ERROR]'));
client.ws.on('close', (event, shardID) => client.error('[WS CLOSE]', event.code, shardID));

frontend.listen(1337);

function generateSSEStats() {
  return JSON.stringify({
    guilds: client.guilds.size,
    channels: client.channels.size,
    users: client.users.size,
    shards: client.ws.shardCount,
  });
}

frontend.sse.on('connection', (c) => c.send('stats', generateSSEStats()));

client.login().then(() => {
  updateCount(client);
  setInterval(updateCount, 5 * 60e3, client);
});

setInterval(() => {
  frontend.sse.broadcast('stats', generateSSEStats());
}, 2000);

process.on('unhandledRejection', (reason, promise) => {
  client.raven.captureException(reason, { extra: { promise } });
  client.error(promise, reason);
});

require('./util/checkEventLoop');
