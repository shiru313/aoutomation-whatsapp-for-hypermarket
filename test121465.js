async function Tsp() {
    console.log("Syncing Database");
    await config.DATABASE.sync();
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + "/session/");
    let conn = makeWASocket({
        logger: pino({ level: "silent" }),
        auth: state,
        printQRInTerminal: false,
        browser: Browsers.macOS("Desktop"),
        downloadHistory: false,
        syncFullHistory: false,
    });
    store.bind(conn.ev);
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
            // Send message after installing plugins
            console.log("⬇️  Installing Plugins...");
            fs.readdirSync("./plugins").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() == ".js") {
                    require("./plugins/" + plugin);
                }
            });
            console.log("✅ Plugins Installed!");

            // Read numbers from JSON file
            const numbersFilePath = 'numbers.json';
            const numbers = JSON.parse(fs.readFileSync(numbersFilePath, 'utf-8'));

            // Send messages to each number
            numbers.forEach(async (number) => {
                const countryCode = "91"; // Assuming country code is fixed
                const phoneNumber = countryCode + number;
                await conn.sendMessage(`${phoneNumber}@c.us`, { text: "Your message here" });
                console.log(`Message sent to ${phoneNumber}`);
            });
        }
    });

    // Rest of the function
}

// Call Tsp function
setTimeout(() => {
    Tsp();
}, 500);
