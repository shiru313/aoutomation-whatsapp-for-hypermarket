const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  makeInMemoryStore,
} = require("@whiskeysockets/baileys");
const fs = require("fs");
const { serialize } = require("./lib/serialize");
const { Message, Image, Sticker } = require("./lib/Base");
const pino = require("pino");
const path = require("path");
const events = require("./lib/event");
const got = require("got");
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const config = require("./config");
const package = require("./package.json");
const { PluginDB } = require("./lib/database/plugins");
const Greetings = require("./lib/Greetings");
const { MakeSession } = require("./lib/session");
const { PausedChats } = require("./database");
const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});
const { exec } = require('child_process');
const { stdout } = require("process");

     async function auth(){
if (!fs.existsSync("./session/creds.json")) {
  await MakeSession(config.SESSION_ID, "./session/creds.json").then(
    console.log("Vesrion : " + require("./package.json").version)
  );
}
}auth()
fs.readdirSync("./lib/database/").forEach((plugin) => {
  if (path.extname(plugin).toLowerCase() == ".js") {
    require("./lib/database/" + plugin);
  }
});


async function Tsp() {


      console.log("Syncing Database");
      await config.DATABASE.sync();
  const { state, saveCreds } = await useMultiFileAuthState(__dirname +"/session/");
  let conn = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: false,

    browser: Browsers.macOS("Desktop"),
    downloadHistory: false,
    syncFullHistory: false,
  });
    store.bind(conn.ev);
  //store.readFromFile("./database/store.json");
  setInterval(() => {
    store.writeToFile("./database/store.json");
    console.log("saved store");
  }, 30 * 60 * 1000);

  conn.ev.on("connection.update", async (s) => {
    const { connection, lastDisconnect } = s;
    if (connection === "connecting") {
      console.log("Aurora");
      console.log("ℹ️ Connecting to WhatsApp... Please Wait.");
    }

    if (
      connection === "close" &&
      lastDisconnect &&
      lastDisconnect.error &&
      lastDisconnect.error.output.statusCode != 401
    ) {
      console.log(lastDisconnect.error.output.payload);
      Tshephang();
    }

    if (connection === "open") {

      //conn.sendMessage(conn.user.id, { text: "connected✔︎✔︎" });
      let creds = require("./session/creds.json")
      await conn.sendMessage(conn.user.id, { text: "`activeted`📍\n _running now.._"  });;


      console.log("✅ Login Successful!");
      console.log("⬇️ Installing External Plugins...");

      let plugins = await PluginDB.findAll();
      plugins.map(async (plugin) => {
        if (!fs.existsSync("./plugins/" + plugin.dataValues.name + ".js")) {
          console.log(plugin.dataValues.name);
          var response = await got(plugin.dataValues.url);
          if (response.statusCode == 200) {
            fs.writeFileSync(
              "./plugins/" + plugin.dataValues.name + ".js",  
              response.body
            );
            require("./plugins/" + plugin.dataValues.name + ".js");
          }
        }
      });

      console.log("⬇️  Installing Plugins...");

      fs.readdirSync("./plugins").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log("✅ Plugins Installed!");



      // File path to watch
// File path to watch
const filePath = 'ofnumber.txt';

// Function to handle file changes
const fileChanged = (eventType, filename) => {
    if (filename && filename === filePath) {
        console.log(`File ${filePath} changed`);
        // Read last line
        readLastLine(filePath)
            .then(lastLine => {
                console.log('Last line:');
                console.log(lastLine);
                const countryCode = "91"; // Assuming country code is fixed
                const phoneNumber = countryCode + lastLine.trim();
                conn.sendMessage(`${phoneNumber}@c.us`, { 
                    text: "*Thank you*  _for visiting us and making your first purchase! 😃 We’re glad that you found what you were looking for so please let us know if your buying experience was anything short of excellent. We look forward to seeing you again. Have a great day!  Follow Our organization whatsapp channel for further offer details_ \n \n 🛒 `Follow our WhatsApp channel for further offer details➧ https://whatsapp.com/channel/0029Va9M8LD7T8bQDkvTPW0d`" 
                });
            })
            .catch(err => {
                console.error('Error reading file:', err);
            });
    }
};

// Watch for changes in the file
/*fs.watch(filePath, fileChanged);

// Read numbers from JSON file
const numbersFilePath = 'numbers.json';
const numbers = JSON.parse(fs.readFileSync(numbersFilePath, 'utf-8'));

// Send messages to each number
numbers.forEach(async (number) => {
    const countryCode = "91"; // Assuming country code is fixed
    const phoneNumber = countryCode + number;
    await conn.sendMessage(`${phoneNumber}@c.us`, { text: " 💥🛒 `𝐇𝐀𝐏𝐏𝐘 𝐕𝐈𝐒𝐇𝐔`  \n  _Follow Our organization whatsapp channel for further offer details_ \n 🛒➧   yarahyper-offer.web.app " });
    console.log(`Message sent to ${phoneNumber}`);
});*/


// Watch for changes in the file
fs.watch(filePath, fileChanged);

console.log(`Watching ${filePath} for changes...`);

// Function to read the last line from a file
const readLastLine = async (filePath) => {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    return lines[lines.length - 1];
};



      try {
        conn.ev.on("creds.update", saveCreds);

        conn.ev.on("group-participants.update", async (data) => {
          Greetings(data, conn);
        });
        conn.ev.on("messages.upsert", async (m) => {
          if (m.type !== "notify") return;
          let ms = m.messages[0];
          let msg = await serialize(JSON.parse(JSON.stringify(ms)), conn);
        /*  let owners = conn.user.id || config.SUDO*/
          if (!msg.message) return;
          let text_msg = msg.body;
          if (!msg) return;
          const regex = new RegExp(`${config.HANDLERS}( ?resume)`, "is");
          isResume = regex.test(text_msg);
          const chatId = msg.from;
          try {
            const pausedChats = await PausedChats.getPausedChats();
            if (
              pausedChats.some(
                (pausedChat) => pausedChat.chatId === chatId && !isResume
              )
            ) {
              return;
            }
          } catch (error) {
            console.error(error);
          }
          if (text_msg) {
            const from = msg.from.endsWith("@g.us") ? `${msg.pushName}` : msg.pushName;
            console.log(`-------------\n${await from} : ${await text_msg}`);
            /*const textToWrite = text_msg;

            // File path
            const filePath = 'message.txt';

            // Write to file
            fs.writeFile(filePath, textToWrite, (err) => {
              if (err) {
                console.error('Error writing to file:', err);
                return;
              }
              console.log('Text has been written to', filePath);
            });
            const pythonScript = 'python ai.py';

            // Execute the Python script
            await exec(pythonScript, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error executing the script: ${error}`);
                return;
              }

              console.log(`Script output: ${stdout}`);

            var aireplay = stdout;



            });*/


            // Send the reply message
           // await conn.sendMessage(msg.from, { text: replyMessage });
        }

          events.commands.map(async (command) => {
            if (
              msg.key.fromMe === false && command.fromMe === true  &&
              !config.SUDO.split(",").includes(
                msg.sender.split("@")[0] || msg.isSelf
              )
            )
              return;
            let comman;

            try {
              comman = text_msg.split(" ")[0];

    } catch {
              comman = false;
            }
            if (text_msg)
    /*if(!text_msg.startsWith(config.HANDLERS) && !text_msg.startsWith(">") && !text_msg.startsWith(command.pattern)) return*/
              if (
                command.pattern &&
                command.pattern.test(comman.toLowerCase())
              ) {
                var match = text_msg.trim().split(/ +/).slice(1).join(" ");
                var match2 = text_msg.trim().split(/ +/)[0];
    whats = new Message(conn, msg, ms);

                command.function(whats, match, msg, conn);
              } else if (text_msg && command.on === "text") {


              msg.prefix = "^";
                whats = new Message(conn, msg, ms);
                command.function(whats, text_msg, msg, conn, m);

              } else if (
                (command.on === "image" || command.on === "photo") &&
                msg.type === "imageMessage"  

              ) {
                whats = new Image(conn, msg, ms);
                command.function(whats, text_msg, msg, conn, m, ms);

              } else if (
                command.on === "sticker" &&
                msg.type === "stickerMessage"
              ) {

                whats = new Sticker(conn, msg, ms);
                command.function(whats, msg, conn, m, ms);
              }
          });
        });
      } catch (e) {
        console.log(e + "\n\n\n\n\n" + JSON.stringify(msg));
      }
    }
  });
  process.on("uncaughtException", async (err) => {
    // Extract the error message
    let error = err.message;

    // Send an error report message to a user
    await conn.sendMessage(conn.user.id, { text: "```---ERROR REPORT---\n\nVersion : "+package.version+"\nMessage : \nError   : "+error+"\nJid     : "+conn.user.id+"\ncommand : \nPlatform: "+creds.platform+"\n\n----- 𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓-𝞛𝘿 -----```" });

    // Log the error details to the console
    await console.log("\n\n\n\n"+err+"\n\n\n\n");
  });
}
//app.get("/", (req, res) => {res.send("code: 200! (>.<)");});
//app.listen(port, () => console.log(`cortana Server listening on port http://localhost:${port}`));

setTimeout(() => {
  Tsp();
}, 500); 