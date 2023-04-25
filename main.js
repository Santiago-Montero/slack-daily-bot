
const { App } = require('@slack/bolt');
const { conversations } = require('slack');
const config = require("./config");

const app = new App({
    signingSecret: config.SIGNING_SECRET,
    token: config.TOKEN,
    socketMode: true,
    appToken : config.APP_TOKEN
  });
  
  /* Add functionality here */
  app.message('daily', async (body) => {
    const { message, say, client } = body
    const members_ids = (await client.conversations.members({channel : message.channel})).members.map( member => {if(member) return member})
    // saco el id delbot
    const users =  (await client.users.list({channel : message.channel})).members.filter( member => {if(members_ids.includes(member.id) && member.id !== 'U04DSGHAECD') return member}).map(member => member.name)
    console.log(users)

    console.log(message.channel) //
    // say() sends a message to the channel where the event was triggered
    await say({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Tematica del dia ${getRandomThematic()}  y al que le toca arrancar en la daily es a 🥁🥁🥁🥁 : ${getRandomUsers(users, users.length).map( (user, index) => `\n${index + 1}: ${user}`)}`
          },


        }
      ],
      text: `Hey there <@${message.user}>!`
    });
  });
  app.message('thematic', async (body) => {
    const { say, message } = body

    await say({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Tematica : ${getRandomThematic()}`
          },


        }
      ],
      text: `Hey there <@${message.user}>!`
    });
  });

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  function getRandomUsers(users, max) {
    const randomUsers = Array(5).fill(-1);
    const positions = [];
    for (let i = 0; i < users.length; i++) {
      const currentUser = users[i];

      const position = getRandomInt(max - i);
      const alreadyExistInPosition = positions.find( pos => pos == position) >= 0
      if( position >= 0  && !alreadyExistInPosition){
        positions.push(position);
        randomUsers[position] = currentUser;

      }else {
        const firstUndefined = randomUsers.indexOf(-1)
        if (firstUndefined >= 0){

          positions.push(firstUndefined);
          randomUsers[firstUndefined] = currentUser;
        }
      }

    }
    console.log('array users');
    console.log(randomUsers);
    return randomUsers.filter(ru => ru > -1 || typeof ru === "string" );
  }
  function getRandomThematic(){
    const thematics = ['Gusto de Helado Favorito', 'Que te gusta cocinar?', 'Comida favorita?' ]
    return thematics[getRandomInt(thematics.length)]
  }

  (async () => {
    // Start the app
    await app.start(process.env.PORT || 3000);
    console.log(config)
    console.log('⚡️ Bolt app is running!');
  })();