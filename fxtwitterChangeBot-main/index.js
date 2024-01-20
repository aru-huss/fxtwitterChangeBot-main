const fs = require("fs");
const { Client, GatewayIntentBits, Intents, EmbedBuilder } = require("discord.js");

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
var count = 0;  
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
      var replace_char,temp_char;
      replace_char = content;
      while(temp_char!=replace_char){
        temp_char = replace_char;
        replace_char = replace_char.replace(/\r?\n|\r/g, ' ');           //タブ・改行コードを変換
        replace_char = replace_char.replace(/[\s\u{3000}]/ug,' ');    //空白大文字を空白小文字に変換
      }
      var replace_char2,temp_char2;
      replace_char2 = replace_char;
      while (temp_char2!=replace_char2){
        temp_char2 = replace_char2;
        var replace_char2 = replace_char2.replace('  ',' ')           //空白を減らしていく
      }
      const split_char = replace_char2.split(' ');                    //空白を区切りに配列に格納
      for(let i=0;i<split_char.length;i++){
        if(split_char[i].match(/https:\/\/(twitter\.com|)\/[^/]+\/status\/\d+/)){   // https://twitter.com が含まれるときの処理
          // twitter.comの場合は、fxtwitter.comに変更する
          const str_fxtwitter = "https://fxtwitter.com";
          var Str_updatedContent_twitter = split_char[i].replace(/https:\/\/twitter\.com/g, str_fxtwitter);
          var Str_message_twitter;
          // https://から始まる文字列を抜きだし、 「?s=**」の共有元端末情報の有り無しによって抜き出す文字列を決める
          if(Str_updatedContent_twitter.match(/\?s=[0-9][0-9]/g)){
            Str_message_twitter = Str_updatedContent_twitter.slice(Str_updatedContent_twitter.search(str_fxtwitter),Str_updatedContent_twitter.search(/\/status/)+32);      
          }else{
            Str_message_twitter = Str_updatedContent_twitter.slice(Str_updatedContent_twitter.search(str_fxtwitter),Str_updatedContent_twitter.search(/\/status/)+27);
          }
          const newMessage_twitter = `${Str_message_twitter}`;
          message.channel.send(
            {content:newMessage_twitter}
          );

        }else if(split_char[i].match(/https:\/\/(x\.com)\/[^/]+\/status\/\d+/)){
          // x.comの場合は、fixupx.comに変更する
          const str_fixupx = "https://fixupx.com";
          var Str_updatedContent_x = split_char[i].replace(/https:\/\/x\.com/g, str_fixupx);
          var Str_message_x;
          // https://から始まる文字列を抜きだし、 「?s=**」の共有元端末情報の有り無しによって抜き出す文字列を決める
          if(Str_updatedContent_x.match(/\?s=[0-9][0-9]/g)){
            Str_message_x = Str_updatedContent_x.slice(Str_updatedContent_x.search(str_fixupx),Str_updatedContent_x.search(/\/status/)+32);      
          }else{
            Str_message_x = Str_updatedContent_x.slice(Str_updatedContent_x.search(str_fixupx),Str_updatedContent_x.search(/\/status/)+27);
          }
          const newMessage_x = `${Str_message_x}`;
          message.channel.send(
            {content:newMessage_x}
          );
          //console.log("x.com \n",Str_message_x);   //fordebug
          //console.log('開始位置\n',Str_updatedContent_x.search(str_fixupx),'末端位置\n',Str_updatedContent_x.search(/\?s=[0-9][0-9]/)+5);

        }else {
          // Don't care
        }

        
      }
      const embed_info = new EmbedBuilder()         // 埋め込み上にidとusernameを表示 (悪意のある投稿対応)
        .setColor(0xFF0000)
        .addFields({name:'投稿者',value:`<@${message.author.id}>`})
        .setTimestamp();
      
        message.channel.send(
        {content:'',embeds: [embed_info]}
      );
      count++;                                       // コンソール上に情報を表示
      const now = new Date();
      console.log('------\n',
      count,
      '\n',
      now.toString(),
      '\n',
      `@${message.author.id}`,
      '\n',
      `@${message.author.username}`,
      '\n------');
    } catch (error) {
      console.error("メッセージの処理中にエラーが発生しました:", error);
    }
  } else {
    //console.log("", content);
  }
});

// config.jsonのTOKENを読み込む
client.login(config.discord_token);
