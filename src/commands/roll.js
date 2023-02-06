const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rolls dice based on user input")
    .addStringOption((option) =>
      option
        .setName("dice")
        .setDescription(
          "The amount and type of dice youd like to roll plus mods"
        )
    ),
  async execute(interaction) {
    const message = interaction.options.getString("dice");
    var messageWords = [];
    try {
      var array = message.split(" ");
      array.map((word) => {
        messageWords.push(word);
      });
    } catch {
      console.log(`No words`);
    }

    if (messageWords.length === 0) {
      // /roll
      const sum = Math.floor(Math.random() * 20) + 1;
      await interaction.reply(
        `${interaction.user} :game_die: \n **Result**: 1d20 (${
          sum == 1 || sum == 20 ? `**${sum}**` : sum
        }) \n **Total**: ${sum}`
      );
    } else {
      var resultWords = [];
      messageWords.map((word) => {
        if (word.includes("d")) {
          let sides = 20; // !roll 20
          let rolls = 1;
          if (!isNaN(word[0] / 1) && word.includes("d")) {
            // !roll 4d20
            rolls = word.split("d")[0] / 1;
            sides = word.split("d")[1];
          } else if (word[0] == "d") {
            // !roll d20
            sides = sides.slice(1);
          }
          sides = sides / 1; // convert to number
          if (isNaN(sides) || isNaN(rolls)) {
            return resultWords.push(`error`);
          } else {
            if (rolls > 1) {
              const rollResults = [];
              for (let i = 0; i < rolls; i++) {
                rollResults.push(Math.floor(Math.random() * sides) + 1);
              }
              const sum = rollResults.reduce((a, b) => a + b);
              rollResults.push(sum);
              return resultWords.push(rollResults);
            } else {
              return resultWords.push(Math.floor(Math.random() * sides) + 1);
            }
          }
        } else if (word == "+" || word == "-") {
          return resultWords.push(word);
        } else if (!isNaN(word / 1)) {
          return resultWords.push(word / 1);
        } else {
          return resultWords.push("error");
        }
      });
      if (resultWords.includes("error")) {
        await interaction.reply(`Error executing ${interaction.commandName}`);
      } else {
        var result = [];
        var total = [];
        for (let i = 0; i < resultWords.length; i++) {
          const boldCrit =
            resultWords[i] == 1 ||
            resultWords[i] == messageWords[i].split("d")[1] / 1
              ? `**${resultWords[i]}**`
              : resultWords[i];
          if (messageWords[i].includes("d") && !isNaN(resultWords[i] / 1)) {
            total.push(resultWords[i]);
            result.push(`${messageWords[i]} (${boldCrit})`);
          } else if (resultWords[i] == "+" || resultWords[i] == "-") {
            total.push(resultWords[i]);
            result.push(`${resultWords[i]}`);
          } else if (!isNaN(resultWords[i] / 1)) {
            total.push(resultWords[i]);
            result.push(`${boldCrit}`);
          } else if (resultWords[i].constructor === Array) {
            var popped = resultWords[i].pop();
            total.push(popped);
            var arr = [];
            for (let j = 0; j < resultWords[i].length; j++) {
              const boldCritArr =
                resultWords[i][j] == 1 ||
                resultWords[i][j] == messageWords[i].split("d")[1] / 1
                  ? `**${resultWords[i][j]}**`
                  : resultWords[i][j];
              if (j == resultWords[i].length - 1) {
                arr.push(` ${boldCritArr}`);
              } else if (j == 0) {
                arr.push(`${boldCritArr}`);
              } else {
                arr.push(` ${boldCritArr}`);
              }
            }
            result.push(`${messageWords[i]} (${arr})`);
          } else {
            result.push("error");
          }
        }

        await interaction.reply(
          `${interaction.user} :game_die: \n **Result**: ${result.join(
            " "
          )} \n **Total**: ${total.join(" ")}`
        );
      }
    }
  },
};
