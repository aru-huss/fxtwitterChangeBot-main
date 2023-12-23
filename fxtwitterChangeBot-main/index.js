const fs = require("fs");
const { Client, GatewayIntentBits, Intents } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, 
           GatewayIntentBits.GuildMessages,		            
           GatewayIntentBits.MessageContent]
});

// config.jsonファイルを読み込む
const config = JSON.parse(fs.readFileSync("config.json"));

client.once("ready", () => {
  console.log(`ログインしました。${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  const content = message.content;

  // fxtwitter.com / fixupx.com / vxtwitter.com / fixv.comが含まれる場合はそのメッセージを送信しない
  if (
    content.includes("fxtwitter.com") ||
    content.includes("fixupx.com") ||
    content.includes("vxtwitter.com") ||
    content.includes("fixvx.com")
  ) {
    return;
  }

  // メッセージが "https://twitter.com/username/status/xxxxxx" または "https://x.com/username/status/xxxxxx" の形式を確認する。
  if (content.match(/https:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/\d+/)) {
    try {
      //console.log("try \n",);   //fordebug
      var count = 0;      
      var replace_char,temp_char;
      replace_char = content;
      while(temp_char!=replace_char){
        temp_char = replace_char;
        replace_char = replace_char.replace(/\r|\n/g, ' ');           //タブ・改行コードを変換
        replace_char = replace_char.replace(/[\s\u{3000}]/ug,' ');    //空白大文字を空白小文字に変換
        //console.log("タブなど変換\n",replace_char);
      }
      var replace_char2,temp_char2;
      replace_char2 = replace_char;
      while (temp_char2!=replace_char2){
        temp_char2 = replace_char2;
        var replace_char2 = replace_char2.replace('  ',' ')           //空白を減らしていく
       // console.log("空白変換\n",replace_char2);
      }
      const split_char = replace_char2.split(' ');                    //空白を区切りに配列に格納
      //console.log("try2 \n",split_char);                            //fordebug
      for(let i=0;i<split_char.length;i++){
        if(split_char[i].match(/https:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/\d+/)){
          // twitter.comの場合は、fxtwitter.comに変更し、x.comの時は、fixupx.comに変更する。
          const updatedContent = split_char[i]
          .replace(/https:\/\/twitter\.com/g, "https://fxtwitter.com")
          .replace(/https:\/\/x\.com/g, "https://fixupx.com");
          const newMessage = `${updatedContent}`;
          message.channel.send(newMessage);
          count++;
          console.log("",count);
        }else {
          //console.log("else \n",split_char[i]);   //fordebug
        }
      }

    
    } catch (error) {
      console.error("メッセージの処理中にエラーが発生しました:", error);
    }
  } else {
    //console.log("", content);
  }
});

// config.jsonのTOKENを読み込む
client.login(config.discord_token);
