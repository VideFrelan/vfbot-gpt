const { create } = require('@open-wa/wa-automate');
const { Configuration, OpenAIApi } = require('openai');
const config = require('./config.json');
const fs = require('fs');
const moment = require('moment');

create({
  multiDevice: true,
  authTimeout: 60,
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  logConsole: false,
  popup: true,
  qrTimeout: 0,
  sessionId: "VFBOT-GPT",
}).then((vf) => {
  const userData = readUserData();
  start(vf, userData);
});

// Function to read user data from JSON file
function readUserData() {
  try {
    const userData = fs.readFileSync('./database/datauser.json');
    const parsedData = JSON.parse(userData);
    console.log('\x1b[36mBerhasil memuat database context 100%\x1b[0m');
    return parsedData;
  } catch (error) {
    console.error('Terjadi kesalahan saat membaca userdata:', error);
    return {};
  }
}

// Function to save user data to JSON file
function saveUserData(userData) {
    fs.writeFileSync('./database/datauser.json', JSON.stringify(userData));
}

async function start(vf, userData) {
  vf.onMessage(async (message) => {
    try {
      const { body, sender, from } = message;
      const user = from;
      const pushname = sender.pushname || "Pengguna";

      // Check if user message starts with "vfbot"
      if (body.startsWith("vfbot")) {
        // Checks if the user already has the previous context
        if (!userData[user]) {
          userData[user] = { context: [], timestamp: Date.now() };
        }

        const previousContext = Array.isArray(userData[user].context) ? userData[user].context.join('\n') : '';
        const fullContext = previousContext + '\n' + body;

        const configuration = new Configuration({
          apiKey: config.apiKey
        });
        const openai = new OpenAIApi(configuration);

        const processTime = (timestamp, now) => {
          return moment.duration(moment(now).diff(moment(timestamp))).asSeconds();
        };

        userData[user].context.push(body);
        userData[user].timestamp = Date.now();
        saveUserData(userData);

        const estimatedProcessingTime = estimateProcessingTime(userData, user);
        const initialResponse = `Pesan Anda sedang diproses dan diperkirakan akan memakan waktu sekitar ${estimatedProcessingTime} detik agar bot dapat merespons.`;
        await vf.sendText(message.from, initialResponse);

        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: fullContext }
          ],
        });

        const response = completion.data.choices[0].message.content;

        userData[user].context.push(response);
        userData[user].timestamp = Date.now();
        saveUserData(userData);

        await vf.sendText(message.from, response);

        // Displays the message and response in the console
        console.log(`\x1b[32m(${pushname}): \x1b[33m${body}\x1b[0m`);
        console.log(`\x1b[32mRespons dari bot: \x1b[33m${response.slice(0, 100)}${response.length > 100 ? "..." : ""}\x1b[0m`);
        console.log(`\x1b[34mBot merespons dalam ${processTime(userData[user].timestamp, Date.now())} detik.\x1b[0m`);
      }
    } catch (error) {
      const { from } = message;
      const user = from;
      if (error.response && error.response.status === 400) {
      // Error code 400, reset user context
      userData[user].context = [];
      saveUserData(userData);
      await vf.sendText(message.from, "Terjadi kesalahan dalam memproses permintaan Anda. Sepertinya server mengalami error atau konteks Anda telah mencapai limit. Konteks Anda telah direset. Silakan ketik pesan baru.");
    } else {
      await vf.sendText(message.from, "Terjadi kesalahan dalam memproses permintaan Anda. Mohon coba lagi nanti.");
    }
  }
  });
}

// Function to estimate processing time based on number of user contexts
function estimateProcessingTime(userData, user) {
  const contextCount = Array.isArray(userData[user].context) ? userData[user].context.length : 0;
  const averageProcessingTimePerContext = 0.5;
  const estimatedProcessingTime = contextCount * averageProcessingTimePerContext;
  return estimatedProcessingTime;
}
