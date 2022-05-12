function Slog_DataHelper() {
  throw new Error("This is a static class");
}

Slog_DataHelper.getAbility = function(abilityId) {
  return $dataSlogAbilities.find(ability => {
    return ability.id === abilityId;
  });
};

Slog_DataHelper.getCard = function (cardId) {
  return $dataSlogCards.find(card => {
    return card.id === cardId
  });
}

Slog_DataHelper.countCardsInDeck = function (deck) {
  let count = 0;
  for (let cardInfo of deck) {
    count += cardInfo.quantity;
  }
  return count;
}

Slog_DataHelper.countTroopCardsInDeck = function (deck) {
  let count = 0;
  for (let cardInfo of deck) {
    const card = Slog_DataHelper.getCard(cardInfo.id);
    if (card.class === "troops") {
      count += cardInfo.quantity;
    }
  }
  return count;
}

Slog_DataHelper.countSpecialCardsInDeck = function (deck) {
  let count = 0;
  for (let cardInfo of deck) {
    const card = Slog_DataHelper.getCard(cardInfo.id);
    if (card.class === "special") {
      count += cardInfo.quantity;
    }
  }
  return count;
}

Slog_DataHelper.countTroopCardsPowerInDeck = function (deck) {
  let count = 0;
  for (let cardInfo of deck) {
    const card = Slog_DataHelper.getCard(cardInfo.id);
    if (card.class === "troops") {
      count += card.power * cardInfo.quantity;
    }
  }
  return count;
}

Slog_DataHelper.isThereRequiredMinimumOfTroopCardsInDeck = function (deck) {
  return Slog_DataHelper.countTroopCardsInDeck(deck) >= Slog_DataHelper.minTroopCardsInDeck(deck);
}

Slog_DataHelper.isThereRequiredMinimumOfCardsInDeck = function (deck) {
  return Slog_DataHelper.countCardsInDeck(deck) >= Slog_DataHelper.minCardsInDeck(deck);
}

Slog_DataHelper.isDeckReadyToPlay = function (deck) {
  const hasMinimumCards = Slog_DataHelper.isThereRequiredMinimumOfCardsInDeck(deck);
  const hasMinimumTroopCards = Slog_DataHelper.isThereRequiredMinimumOfTroopCardsInDeck(deck);
  return hasMinimumCards && hasMinimumTroopCards;
}

// Rules

Slog_DataHelper.minCardsInDeck = function () {
  return $dataSlogRules.minCardsInDeck;
}

Slog_DataHelper.minTroopCardsInDeck = function () {
  return $dataSlogRules.minTroopCardsInDeck;
}

Slog_DataHelper.startHandCardsCount = function () {
  return $dataSlogRules.startHandCardsCount;
}

Slog_DataHelper.countNewCardsAfterRound = function () {
  return $dataSlogRules.countNewCardsAfterRound;
}

// Saves

DataManager._databaseFiles.push({ name: "$dataSlogCards", src: "SlogCards.json" });
DataManager._databaseFiles.push({ name: "$dataSlogRules", src: "SlogRules.json" });
DataManager._databaseFiles.push({ name: "$dataSlogAbilities", src: "SlogAbilities.json" });

const create_gameobjects_alias = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
  create_gameobjects_alias.call(this);
  $gamePlayerSlogDeck = [];
  $gamePlayerSlogCollection = [];
};


const make_save_contents_alias = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
  const contents = make_save_contents_alias.call(this);
  contents.playerSlogDeck = $gamePlayerSlogDeck;
  contents.playerSlogCollection = $gamePlayerSlogCollection;
  return contents;
};

const extract_save_contents_alias = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
  extract_save_contents_alias.call(this, contents);
  $gamePlayerSlogDeck = contents.playerSlogDeck || [];
  $gamePlayerSlogCollection = contents.playerSlogCollection || [];
};