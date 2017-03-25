const express = require('express');
const router = new express.Router();
const config = require('../../../config.json');
const snekfetch = require('snekfetch');
const querystring = require('querystring');

router.get('/', (req, res) => {
  const INVITE_REDIR = req.query.redirect_uri || config.backend.INVITE_REDIR;
  const QUERY_PARAMS = {
    client_id: config.backend.CLIENT_ID,
    permissions: config.backend.PERMISSIONS,
    redirect_uri: INVITE_REDIR,
    scope: 'bot',
    response_type: 'code',
  };
  if (req.query.state) QUERY_PARAMS.state = req.query.state;
  res.redirect(`https://discordapp.com/oauth2/authorize?${querystring.stringify(QUERY_PARAMS)}`);
});

router.get('/callback', (req, res) => {
  snekfetch.get(`https://discordapp.com/api/guilds/${req.query.guild_id}`)
    .set({ Authorization: `Bot ${config.discord.TOKENS[config.env]}` })
    .then((response) => response.body)
    .then((guild) => res.render('invite', { guild }))
    .catch((err) => {
      console.error(err);
      res.redirect('/');
    });
});

module.exports = router;
