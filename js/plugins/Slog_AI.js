function Slog_AI() {
  throw new Error("This is a static class");
}

Slog_AI.getNPCDeck = function () {
  return Slog_AI.generateNPCDeck();
};

Slog_AI.generateNPCDeck = function() {
  const deck = [];
  const troopCards = $dataSlogCards.filter(x => x.class === "troops");
  const specialCards = $dataSlogCards.filter(x => x.class === "special");
  const heroCards = $dataSlogCards.filter(x => x.class === "hero");

  let specialCardsLeftToAdd = 2;
  while (specialCards.length > 0 && specialCardsLeftToAdd > 0) {
    const randomCardIndex = Math.floor(Math.random() * specialCards.length)
    const randomCard = specialCards[randomCardIndex];

    const existsCard = deck.find(x => x.id === randomCard.id);
    if (existsCard) {
      existsCard.quantity++;
    } else {
      deck.push({
        id: randomCard.id,
        quantity: 1
      });
    }

    specialCardsLeftToAdd--;
  }

  let heroCardsLeftToAdd = 2;
  while (heroCards.length > 0 && heroCardsLeftToAdd > 0) {
    const randomCardIndex = Math.floor(Math.random() * heroCards.length)
    const randomCard = heroCards[randomCardIndex];

    const existsCard = deck.find(x => x.id === randomCard.id);
    if (existsCard) {
      existsCard.quantity++;
    } else {
      deck.push({
        id: randomCard.id,
        quantity: 1
      });
    }

    heroCardsLeftToAdd--;
  }

  let troopCardsLeftToAdd = Math.max(Slog_DataHelper.minTroopCardsInDeck(), (Slog_DataHelper.minCardsInDeck() - Slog_DataHelper.countCardsInDeck(deck)));
  while (troopCards.length > 0 && troopCardsLeftToAdd > 0) {
    const randomCardIndex = Math.floor(Math.random() * troopCards.length)
    const randomCard = troopCards[randomCardIndex];

    const existsCard = deck.find(x => x.id === randomCard.id);
    if (existsCard) {
      existsCard.quantity++;
    } else {
      deck.push({
        id: randomCard.id,
        quantity: 1
      });
    }

    troopCardsLeftToAdd--;
  }

  return deck;
};

Slog_AI.step = async function (gameManager) {
  if (await Slog_AI.stepCheckFold(gameManager)) {
    console.log("GWENT_AI: stepCheckFold");
    return;
  }
  if (await Slog_AI.stepClearWeatherCards(gameManager)) {
    console.log("GWENT_AI: stepClearWeatherCards");
    return;
  }
  if (await Slog_AI.stepPlayWeatherCards(gameManager)) {
    console.log("GWENT_AI: stepPlayWeatherCards");
    return;
  }
  if (await Slog_AI.stepRandomCard(gameManager)) {
    console.log("GWENT_AI: stepRandomCard");
    return;
  }

  gameManager.fold(false);
  gameManager.passTheMove();
};

Slog_AI.stepCheckFold = async function(gameManager) {
  if (gameManager.relativeMyPower(gameManager.state) > 30 &&
      (gameManager.relativeMyPower(gameManager.state) / gameManager.relativeOpponentPower(gameManager.state) >= 2.5 ||
       gameManager.relativeOpponentPower(gameManager.state) / gameManager.relativeMyPower(gameManager.state) >= 2.5)) {
    gameManager.fold(false);
    gameManager.passTheMove();
    return true;
  }
  return false;
};

Slog_AI.stepClearWeatherCards = async function(gameManager) {
  if (gameManager.isFrostWeatherActive() && // if frost weather active
      !Slog_AI.isThereSenseToFrostWeather(gameManager) && // if we have more power loss than opponent
      gameManager.relativeMyHandCards(gameManager.state).getChilds().some(x => x.isHaveAbility("clearWeather"))) { // if we have clearWeather card
        const clearWeatherCard = Array.isArray(gameManager) ? gameManager.find(x => x.isHaveAbility("clearWeather")) : "clearWeather";
    const fieldsForCard = gameManager.getPossibleFieldsForCard(clearWeatherCard, gameManager.state);
    if (fieldsForCard.includes(gameManager.relativeMyField1(gameManager.state))) { // if we can play clearWeather card into field1 (melee)
      await gameManager.playCard(clearWeatherCard, gameManager.relativeMyField1(gameManager.state), false, true);
      return true;
    }
  }

  if (gameManager.isFogWeatherActive() && // if fog weather active
      !Slog_AI.isThereSenseToFogWeather(gameManager) && // if we have more power loss than opponent
      gameManager.relativeMyHandCards(gameManager.state).getChilds().some(x => x.isHaveAbility("clearWeather"))) { // if we have clearWeather card
    const clearWeatherCard = Array.isArray(gameManager) ? gameManager.find(x => x.isHaveAbility("clearWeather")) : "clearWeather";
    const fieldsForCard = gameManager.getPossibleFieldsForCard(clearWeatherCard, gameManager.state);
    if (fieldsForCard.includes(gameManager.relativeMyField2(gameManager.state))) { // if we can play clearWeather card into field2 (range)
      await gameManager.playCard(clearWeatherCard, gameManager.relativeMyField2(gameManager.state), false, true);
      return true;
    }
  }

  return false;
};

Slog_AI.stepPlayWeatherCards = async function(gameManager) {
  if (gameManager.isFrostWeatherActive() && // if frost weather inactive
      Slog_AI.isThereSenseToFrostWeather(gameManager) && // if we have less power loss than opponent
      gameManager.relativeMyHandCards(gameManager.state).getChilds().some(x => x.isHaveAbility("bitingFrost"))) { // if we have frostWeather card
    const frostWeatherCard = Array.isArray(gameManager) ? gameManager.find(x => x.isHaveAbility("bitingFrost")) : "bitingFrost";
    const fieldsForCard = gameManager.getPossibleFieldsForCard(frostWeatherCard, gameManager.state);
    if (fieldsForCard.includes(gameManager.relativeOpponentField1(gameManager.state))) { // if we can play frostWeather card into opponent field1 (melee)
      await gameManager.playCard(frostWeatherCard, gameManager.relativeOpponentField1(gameManager.state), false, true);
      return true;
    }
  }

  if (gameManager.isFogWeatherActive() && // if fog weather inactive
      !Slog_AI.isThereSenseToFogWeather(gameManager) && // if we have less power loss than opponent
      gameManager.relativeMyHandCards(gameManager.state).getChilds().some(x => x.isHaveAbility("impenetrableFog"))) { // if we have fogWeather card
    const fogWeatherCard = Array.isArray(gameManager) ? gameManager.find(x => x.isHaveAbility("impenetrableFog")) : "impenetrableFog";
    const fieldsForCard = gameManager.getPossibleFieldsForCard(fogWeatherCard, gameManager.state);
    if (fieldsForCard.includes(gameManager.relativeOpponentField2(gameManager.state))) { // if we can play fogWeather card into opponent field2 (range)
      await gameManager.playCard(fogWeatherCard, gameManager.relativeOpponentField2(gameManager.state), false, true);
      return true;
    }
  }

  return false;
};

Slog_AI.stepRandomCard = async function(gameManager) {
  const cards = Slog_AI._getPossibleCards(gameManager.opponentHandCards.cards, gameManager, true);
  if (cards.length > 0) {
    const randomCardIndex = Math.floor(Math.random() * cards.length)
    const randomCard = cards[randomCardIndex];
    const fields = gameManager.getPossibleFieldsForCard(randomCard, gameManager.state);
    const randomFieldIndex = Math.floor(Math.random() & fields.length);
    const randomField = fields[randomFieldIndex];

    if (randomCard.isHaveAbility("decoy")) {
      await Slog_AI.playDecoyCard(randomCard, randomField, gameManager);
    } else {
      await gameManager.playCard(randomCard, randomField, false,true);
    }
    return true;
  }

  return false;
};

Slog_AI.playDecoyCard = async function(card, field, gameManager) {
  const randomTargetCardIndex = Math.floor(Math.random() * field.getChilds().length);
  const randomTargetCard = field.getChilds()[randomTargetCardIndex];

  randomTargetCard.removeAllEffects();
  randomTargetCard.view.drawDynamicFront();

  const playedCards = gameManager.getActivePlayedCards();
  for (let abilityInstance of randomTargetCard.abilityInstances) {
    for (let playedCard of playedCards) {
      playedCard.removeEffectsBySource(abilityInstance.uid);
    }
  }

  field.setChild(randomTargetCardIndex, card);
  gameManager.opponentHandCards.setChild(gameManager.opponentHandCards.getChilds().indexOf(card), randomTargetCard);

  card.location = randomTargetCard;
  randomTargetCard.location = this.opponentHandCards;

  gameManager._windowSlogGame.cleanFieldDraw(field);
  gameManager._windowSlogGame.cleanFieldDraw(gameManager.opponentHandCards);

  gameManager._windowSlogGame.resetSelection();
  gameManager.updateMainItemsInteractable();

  await gameManager.onCardFight(false, card);
  await gameManager.passTheMove();
};

Slog_AI.isThereSenseToFrostWeather = function(gameManager) {
  return gameManager.relativeOpponentField1(gameManager.state).getPower() > gameManager.relativeMyField1(gameManager.state).getPower();
};

Slog_AI.isThereSenseToFogWeather = function(gameManager) {
  return gameManager.relativeOpponentField2(gameManager.state).getPower() > gameManager.relativeMyField2(gameManager.state).getPower();
};

Slog_AI._getPossibleCards = function (cards, gameManager, ignoreWeatherCards) {
  const possibleCards = [];
  for (let card of cards) {
    if (ignoreWeatherCards) {
      if (card.isHaveAbility("bitingFrost") ||
          card.isHaveAbility("impenetrableFog") ||
          card.isHaveAbility("clearWeather")) {
        continue;
      }
    }

    if (gameManager.getPossibleFieldsForCard(card, gameManager.state).length > 0) {
      possibleCards.push(card);
    }
  }
  return possibleCards;
};