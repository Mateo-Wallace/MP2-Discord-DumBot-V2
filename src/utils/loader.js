const { readdirSync } = require("fs");
const { Collection } = require("discord.js");
require("dotenv").config();

client.commands = new Collection();
CommandsArray = [];

const events = readdirSync("./src/events/").filter((file) =>
  file.endsWith(".js")
);

console.log(`Loading events...`);
for (const file of events) {
  const event = require(`../events/${file}`);
  client.on(file.split(".")[0], event.bind(null, client));
  delete require.cache[require.resolve(`../events/${file}`)];
}
console.log(`-> [Loaded Events]`);

console.log(`Loading commands...`);
readdirSync("./src/commands/").forEach((dirs) => {
  const commands = readdirSync(`./src/commands/${dirs}`).filter((files) =>
    files.endsWith(".js")
  );

  for (const file of commands) {
    const command = require(`../commands/${dirs}/${file}`);
    if (
      client.config.enabledCommands.enableAll
        ? command.name && command.description
        : command.name && command.description && command.enabled
    ) {
      CommandsArray.push(command);
      client.commands.set(command.name.toLowerCase(), command);
      delete require.cache[require.resolve(`../commands/${dirs}/${file}`)];
    } else console.log(`[failed Command]  ${command.name.toLowerCase()}`);
  }
});
console.log(`-> [Loaded Commands]`);

client.on("ready", (client) => {
  if (client.config.app.global) client.application.commands.set(CommandsArray);
  else client.guilds.cache.get(process.env.GUILD).commands.set(CommandsArray);
});
