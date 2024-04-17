const {
  Function,
  command,
  qrcode,
  webp2mp4,
  isUrl,
  isPrivate,
  asMp3
} = require("../lib/");
const { MessageType } = require('@adiwajshing/baileys');
const { yta, ytIdRegex, ytv } = require("../lib/yotube");
const { search } = require("yt-search");
const { toAudio } = require("../lib/media");
let gis = require("g-i-s");
const { AddMp3Meta } = require("../lib");
const ffmpeg = require("../lib/myffmpeg");
const jimp = require("jimp");
const QRReader = require("qrcode-reader");
const { RMBG_KEY } = require("../config");
let { unlink } = require("fs/promises");
const got = require("got");
const FormData = require("form-data");
const stream = require("stream");
const { promisify } = require("util");
const pipeline = promisify(stream.pipeline);
const fs = require("fs");
const googleTTS = require('google-tts-api');
const { spotifydl } = require('../lib/spotify')
const { exec } = require("child_process");
require("../")
const readline = require('readline');





command(
  {
    pattern: "qr ?(.*)",
    fromMe: isPrivate,  
    desc: "Read/Write Qr.",
    type: "Tool",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (match) {
      let buff = await qrcode(match);
      return await message.sendMessage(buff, {}, "image");
    } else if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage(
        "*Example : qr test*\n*Reply to a qr image.*"
      );

    const { bitmap } = await jimp.read(
      await message.reply_message.downloadMediaMessage()
    );
    const qr = new QRReader();
    qr.callback = (err, value) =>
      message.sendMessage(err ?? value.result, { quoted: message.data });
    qr.decode(bitmap);
  }
);

Function(
  {
    pattern: "img ?(.*)",
    fromMe: isPrivate,  
    desc: "Google Image search",
    type: "downloader",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage("Enter Search Term,number");
    let [query, amount] = match.split(",");
    let result = await gimage(query, amount);
    await message.sendMessage(
      `_Downloading ${amount || 5} images for ${query}_`
    );
    for (let i of result) {
      await message.sendFromUrl(i);
    }
  }
);

async function gimage(query, amount = 5) {
  let list = [];
  return new Promise((resolve, reject) => {
    gis(query, async (error, result) => {
      for (
        var i = 0;
        i < (result.length < amount ? result.length : amount);
        i++
      ) {
        list.push(result[i].url);
        resolve(list);
      }
    });
  });
}

//tes start..



command(
  {
    pattern: "barcode2 ?(.*)",
    fromMe: isPrivate,
    desc: "removes background of an image",
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.image)
      return await message.reply("_Reply to a photo_");

    const saveFolder = "./images"; // Set your desired folder path
    const location = await message.reply_message.downloadMediaMessage();
    const userImageSavePath = `${saveFolder}/${Date.now()}_user_sent_image.png`;
    
    const newFileName = `${saveFolder}/media.jpg`;
  
    await message.reply("_barcode checking...._");

    // Save the user-sent image to a folder
    fs.copyFileSync(location, userImageSavePath);

    // Rename the user-sent image to "media.jpg"
    fs.rename(location, newFileName, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('File renamed to media.jpg successfully!');

        // Execute the Python file
        exec("python main.py", { cwd: saveFolder }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing Python file: ${error}`);
          } else {
            console.log(`Python file output: ${stdout}`);
            
        
 message.reply(stdout)
            
          }
        });
      }
    });
    
     
    

    //await message.reply("_Image saved and renamed to media.jpg successfully._");
  }
);

//new...........,


//second 

command(
  {
    pattern: "barcode ?(.*)",
    fromMe: isPrivate,
    desc: "removes background of an image",
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.image)
      
      return await message.reply("_Reply to a photo_");

    const saveFolder = "./images"; // Set your desired folder path
    const location = await message.reply_message.downloadMediaMessage();
    const userImageSavePath = `${saveFolder}/${Date.now()}_user_sent_image.png`;
    
    const newFileName = `${saveFolder}/media.jpg`;
  
    //await message.reply("_barcode_");

    // Save the user-sent image to a folder
    fs.copyFileSync(location, userImageSavePath);

    // Rename the user-sent image to "media.jpg"
    fs.rename(location, newFileName, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('File renamed to media.jpg successfully!');

        // Execute the Python file
        exec("python main.py", { cwd: saveFolder }, async (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing Python file: ${error}`);
          } else {
            console.log(`Python file output: ${stdout}`);
            
            
            
            const start = new Date().getTime();
            let { key } = await message.client.sendMessage(message.jid, { text: "_Checking  Barcode....._" });
            const end = new Date().getTime();
            
            setTimeout(async () => {
              await message.client.sendMessage(message.jid, { text: "_Checking...._", edit: key });
await message.client.sendMessage(message.jid, { text: "_Checking_ ✅", edit: key });
message.client.sendMessage(message.jid, { text: "_done_", edit: key });              
              
            }, 1000);
            
    await message.reply(stdout);
          }
        });
      }
    });
  }
);


    //print


/*command({
        pattern: "ai",
        fromMe: isPrivate,  
        desc: "To check ping",
        type: "user",
    },
    async (message, match) => {
   const start = new Date().getTime();
   let { key } = await message.reply("```....```");
console.log(match);
  
const textToWrite = match;

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
              
            
          message.reply(stdout)      
    
             
            });
      
            
    }
);*/


command({
  pattern: "ai",
  desc: "To check ping",
  type: "user",
}, async (message, match2) => {
  // Check if the message is from a private chat
  if (!message.isGroup) {
    const start = new Date().getTime();
    let { key } = await message.reply("> ai replaying...");
    const end = new Date().getTime();

    setTimeout(async () => {
      await message.client.sendMessage(message.jid, { text: " _done_", edit: key });
    }, 4000);

    const textToWrite = message.text;

    // File path
    const filePath = 'message.txt';

    // Write to file
    fs.writeFile(filePath, textToWrite, async (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }
      console.log('Text has been written to', filePath);

      const pythonScript = 'python ai.py';

      // Execute the Python script
      exec(pythonScript, async (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing the script: ${error}`);
          return;
        }

        console.log(`Script output: ${stdout}`);

        // Generate audio URL from text
        const url = await googleTTS.getAudioUrl(stdout, {
          lang: 'en',
          slow: false,
          host: 'https://translate.google.com',
        });

        // Send the audio as a voice message (PTT)
        await sendVoiceMessage(message, url);
      });
    });
  } else {
    // Do nothing if the message is from a group chat
  }
});

async function sendVoiceMessage(message, audioUrl) {
  // Send the audio as a voice message
  await message.client.sendMessage(message.jid, {
    audio: { url: audioUrl },
    mimetype: "audio/mpeg",
    ptt: true // Set ptt attribute to true for voice message
  });
}



// Command to handle voice messages
command({
  pattern: "savemsg",
  fromMe: isPrivate,
  desc: "Save voice message to a folder",
  type: "user",
}, async (message) => {
  // Check if the message has an audio attachment
  if (!message.reply_message || !message.reply_message.audio) {
    return await message.reply("_Reply to a voice message_");
  }

  // Get the audio data
  const audioData = await message.reply_message.downloadMediaMessage();

  // Generate a unique filename based on current timestamp
  const filename = `voice_message_${Date.now()}.ogg`;

  // Specify the folder path where you want to save the voice messages
  const folderPath = "./images";

  // Check if the folder exists, if not, create it
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Write the audio data to a file
  fs.writeFile(`${folderPath}/${filename}`, audioData, (err) => {
    if (err) {
      console.error("Error saving voice message:", err);
      return;
    }
    console.log("Voice message saved successfully:", filename);
    message.reply("_Voice message saved successfully!_");
  });
});



command({
  pattern: "print",
  desc: "To check ping",
  type: "user",
}, async (message, match) => {
  // Check if the message is from a private chat
  if (!message.isGroup) {
    const start = new Date().getTime();
    let { key } = await message.reply("> printing...");
    const end = new Date().getTime();

    setTimeout(async () => {
      await message.client.sendMessage(message.jid, { text: " _done_", edit: key });
    }, 1000);

    const textToWrite = match

    // File path
    const filePath = 'message.txt';

    // Write to file
    fs.writeFile(filePath, textToWrite, async (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }
      console.log('Text has been written to', filePath);

      const pythonScript = 'python print.py';

      // Execute the Python script
      exec(pythonScript, async (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing the script: ${error}`);
          return;
        }

        console.log(`Script output: ${stdout}`);

        

        
        
        
        
      });
    });
  } else {
    // Do nothing if the message is from a group chat
  }
});

//save new nuymbressssssssssssssss.............................................................................................................

// Define a global variable to store contacts
let contactsList = [];

// Command function for "saveme" command
command({
  pattern: "saveme",
  desc: "Automatically saves the sender's number in your contacts",
  type: "user",
}, async (message) => {
  try {
    // Get the sender's number
    const senderNumber = message.jid;

    // Check if the sender's number is already in the contacts list
    const existingContact = contactsList.find(contact => contact.jid === senderNumber);
    
    if (!existingContact) {
      // Sender's number is not in the contacts list, so save it
      contactsList.push({ jid: senderNumber, notify: "Your Contact Name" });
      await message.client.sendMessage(message.jid, "Your number has been saved in my contacts.");
    } else {
      // Sender's number is already in the contacts list
      await message.client.sendMessage(message.jid, "Your number is already saved in my contacts.");
    }
  } catch (error) {
    console.error("Error saving contact:", error);
    await message.client.sendMessage(message.jid, "An error occurred while saving your contact.");
  }
});




//pricing..



command({
  pattern: "price",
  desc: "To check ping",
  type: "user",
}, async (message, match) => {
  // Check if the message is from a private chat
  if (!message.isGroup) {
    const start = new Date().getTime();
    let { key } = await message.reply("> checking...");
    const end = new Date().getTime();

    setTimeout(async () => {
      await message.client.sendMessage(message.jid, { text: " _done_", edit: key });
    }, 1000);

    const textToWrite = match

    // File path
    const filePath = 'message.txt';

    // Write to file
    fs.writeFile(filePath, textToWrite, async (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }
      console.log('Text has been written to', filePath);

      const pythonScript = 'python app.py';

      // Execute the Python script
      exec(pythonScript, async (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing the script: ${error}`);
          return;
        }

        console.log(`Script output: ${stdout}`);

        

        // Send the generated image
        await message.client.sendMessage(
          message.jid,
          {
            image: { url: 'price.png' }, // Assuming the image is generated as price.png
            caption: '',
          }
        );
      });
    });
  } else {
    // Do nothing if the message is from a group chat
  }
});


//search price.....................................



command({
  pattern: "search",
  desc: "To check ping",
  type: "user",
}, async (message, match) => {
  // Check if the message is from a private chat
  if (!message.isGroup) {
    const start = new Date().getTime();
    let { key } = await message.reply("> checking...");
    const end = new Date().getTime();

    setTimeout(async () => {
      await message.client.sendMessage(message.jid, { text: " _done_", edit: key });
    }, 1000);

    const textToWrite = match

    // File path
    const filePath = 'message.txt';

    // Write to file
    fs.writeFile(filePath, textToWrite, async (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }
      console.log('Text has been written to', filePath);

      const pythonScript = 'python search.py';

      // Execute the Python script
      exec(pythonScript, async (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing the script: ${error}`);
          return;
        }

        console.log(`Script output: ${stdout}`);

        

        // Send the generated image
        await message.client.sendMessage(
          message.jid,
          {
            image: { url: 'sprice.png' }, // Assuming the image is generated as price.png
            caption: '',
          }
        );
      });
    });
  } else {
    // Do nothing if the message is from a group chat
  }
});


//IMAGE TO PRICING....



command(
  {
    pattern: "yrp ?(.*)",
    fromMe: isPrivate,
    desc: "removes background of an image",
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.image) {
      return await message.reply("_Reply to a photo_");
    }

    const saveFolder = "./images"; // Set your desired folder path
    const location = await message.reply_message.downloadMediaMessage();
    const userImageSavePath = `${saveFolder}/${Date.now()}_user_sent_image.png`;
    const newFileName = `${saveFolder}/barcode.jpg`;
    
    // Save the user-sent image to a folder
    fs.copyFileSync(location, userImageSavePath);

    // Rename the user-sent image to "media.jpg"
    fs.rename(location, newFileName, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('File renamed to media.jpg successfully!');

        // Execute the Python file
        exec("python barcode_text.py", { cwd: saveFolder }, async (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing Python file: ${error}`);
          } else {
            console.log(`Python file output: ${stdout}`);
            
            await message.reply('_Checking...._');

            // Send the message with the image
            await message.client.sendMessage(
              message.jid,
              {
                image: { url: './images/price.png' }, // Assuming the image is generated as price.png
                caption: ''
              }
            );
          }
        });
      }
    });
  }
);


    //print

// POINT CHKING...



// Command to handle the "point" trigger
command({
  pattern: "point",
  fromMe: false, // Trigger for messages sent by anyone other than the bot
  desc: "Save sender's number to a variable, log it, and execute a Python script",
  type: "utility",
}, async (message) => {
  // Get sender's number from the message
  let senderNumber = message.jid;

  // Extract the first 12 digits
  senderNumber = senderNumber.substring(0, 12);

  // Trim the first two characters
  senderNumber = senderNumber.substring(2);

  // Log the sender's number
  console.log("Sender's number:", senderNumber);

  // Write the sender's number to a text file
  const filePath = "number3.txt";
  fs.writeFile(filePath, senderNumber, (err) => {
    if (err) {
      console.error("Error writing sender's number to file:", err);
    } else {
      console.log("Sender's number has been written to", filePath);

      // Execute the Python script
      exec("python point.py", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error}`);
        } else {
          console.log(`Python script output: ${stdout}`);
          
          // Send a message with an image
          message.client.sendMessage(
            message.jid,
            {
              image: { url: 'point.png' }, // Assuming the image is generated as point.png
              caption: ''
            }
          );
        }
      });
    }
  });
});


//stop......
command ({
pattern: "2tts",
fromMe: isPrivate,  
desc: "google-tts",
type: "tool"
},
async (message,match) => {
  if(!match) return await message.reply("waiting for a query")
let url = await googleTTS.getAudioUrl(match, {
  lang: 'en',
  slow: false,
  host: 'https://translate.google.com',
});
console.log(match);
  

          

return message.client.sendMessage(message.jid,{audio: {url: url}, mimetype: "audio/mpeg", fileName:"Aurora-Project-Tts.m4a"});
});

command(
  {
    pattern: "fetch ?(.*)",
    fromMe: isPrivate,  
    desc: "Downloads from a direct link",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match)
      return message.reply(
        "_Send a direct media link_\n_*link;caption(optional)*_"
      );
    try {
      let url = match.split(";")[0];
      let options = {};
      options.caption = match.split(";")[1];

      if (isUrl(url)) {
        message.sendFromUrl(url, options);
      } else {
        message.reply("_Not a URL_");
      }
    } catch (e) {
      console.log(e);
      message.reply("_No content found_");
    }
  }
);
command(
  {
    pattern: "yts ?(.*)",
    fromMe: isPrivate,  
    desc: "Search Youtube",
    type: "Search",
  },
  async (message, match) => {
    if (!match) return await message.reply("_Enter a search term_");
    let rows = [];
    search(match).then(async ({ videos }) => {
      videos.forEach((result) => {
        rows.push({
          title: result.title,
          description: `\nDuration : ${result.duration.toString()}\nAuthor : ${
            result.author
          }\nPublished : ${result.ago}\nDescription : ${
            result.description
          }\nURL : ${result.url}`,
          rowId: ` `,
        });
      });
      await message.client.sendMessage(message.jid, {
        text: "Youtube Search for " + match,
        buttonText: "View Results",
        sections: [
          {
            title: "Youtube Search",
            rows: rows,
          },
        ],
      });
    });
  }
);

command(
  {
    pattern: "ytv ?(.*)",
    fromMe: isPrivate,  
    dontAddCommandList: true,
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("_Enter a URL_");

    if (!ytIdRegex.test(match)) return await message.reply("_Invalid Url_");
    ytv(match).then(async ({ dl_link, title }) => {
      await message.reply(`_Downloading ${title}_`);
      return await message.sendFromUrl(dl_link, {
        filename: title,
        quoted: message,
      });
    });
  }
);

command(
  {
    pattern: "yta ?(.*)",
    fromMe: isPrivate,  
    dontAddCommandList: true,
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("_Enter a URL_");
    if (!ytIdRegex.test(match)) return await message.reply("_Invalid Url_");
    yta(match).then(async ({ dl_link, title, thumb }) => {
      await message.reply(`_Downloading ${title}_`);
      let buff = await AddMp3Meta(dl_link, thumb, {
        title,
      });
      return await message.sendMessage(
        buff,
        { mimetype: "audio/mpeg", quoted: message.data },
        "audio"
      );
    });
  }
); 

command(
  {
    pattern: "spotify ?(.*)",
    fromMe: isPrivate,  
    desc: "Spotify song Downloader",
    type: "downloader",
  },
  async (message, match) => {

{
if (!match) return message.client.sendMessage(message.jid,{text: "Please give me a valid link"});
  const audioSpotify = await spotifydl(match.trim()).catch((err) => {
    console.error(err)
    return message.client.sendMessage(message.jid, err.toString())
  })

  if (spotifydl.error) return message.client.sendMessage(message.jid,{text:  "Error Fetching: ${match.trim()}. Check if the url is valid and try again"})
  let { key } =  await message.client.sendMessage(
    message.jid,
    {
        image: audioSpotify.coverimage,
        caption: '```Downloading has started!```'
    }
)
  const caption = "```Title: "+`${audioSpotify.data.name || ''}\nArtists: ${(audioSpotify.data.artists || []).join(', ')}\nAlbum: ${audioSpotify.data.album_name}\nRelease Date: ${audioSpotify.data.release_date || ''}`+"```"

await await message.client.sendMessage(
  message.jid,
  {
      image: audioSpotify.coverimage,
      caption: caption,
      edit: key
  }
)

  return await message.client.sendMessage(
      message.jid,
      {
          audio: audioSpotify.audio,
          mimetype: 'audio/mpeg',
          fileName: audioSpotify.data.name + '.mp3',
          ptt: true
      }
  )

}
})
