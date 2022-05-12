//=============================================================================
// RPG Maker MZ - SLOG CORE
//=============================================================================

/*:
 * @target MZ
 * @author Arthur Klopov
 *
 * @command playSlog
 * @text Play Slog
 * @desc
 *
 * @arg opponentName
 * @type string
 * @default Slog Player
 * @text Opponent Name
 * @desc
 */

let SlogPlayerName = "PlayerName";
let SlogOpponentName = "";

PluginManager.registerCommand("Slog_Core", "playSlog", (args) => {
  SlogOpponentName = args.opponentName;

  console.log("PLAY SLOG");

  try {
    if (Slog_DataHelper.isDeckReadyToPlay($gamePlayerSlogDeck)) {
      SceneManager.push(Scene_SlogGame);
    } else {
      SceneManager.push(Scene_NotReadyDeck);
    }
  } catch (e) {
    console.log(e);
  }
});