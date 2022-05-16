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
 *
 * @command addCard
 * @text Add Card
 * @desc
 *
 * @arg cardId
 * @type string
 * @default npc1
 * @text Card Id
 * @desc
 *
 * @arg quantity
 * @type number
 * @default 1
 * @text Card Quantity
 * @desc
 */

let SlogPlayerName = "PlayerName";
let SlogOpponentName = "";

PluginManager.registerCommand("Slog_Core", "playSlog", (args) => {
  SlogOpponentName = args.opponentName;

  if (Slog_DataHelper.isDeckReadyToPlay($gamePlayerSlogDeck)) {
    SceneManager.push(Scene_SlogGame);
  } else {
    SceneManager.push(Scene_NotReadyDeck);
  }
});

PluginManager.registerCommand("Slog_Core", "addCard", (args) => {
  const id = args.cardId;
  const quantity = Number(args.quantity);

  const cardIndex = $gamePlayerSlogCollection.findIndex(c => c.id === id);
  if (cardIndex >= 0) {
    $gamePlayerSlogCollection[cardIndex].quantity += quantity;
  } else {
    $gamePlayerSlogCollection.push({
      id: id,
      quantity: quantity
    });
  }
});