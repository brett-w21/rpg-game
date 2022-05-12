const SlogGameState_GameStart = 0;
const SlogGameState_MyTurn = 1;
const SlogGameState_OpponentTurn = 2;
const SlogGameState_GameOver = 3;

function SlogGame_GameManager() {
  this.initialize();
  this.prepareDecks();
  this.generateHandCards();
}

SlogGame_GameManager.prototype.initialize = function() {
  this.playerName = SlogPlayerName;
  this.opponentName = SlogOpponentName;
  this.roundNumber = 0;
  this.playerHealth = 2;
  this.opponentHealth = 2;
  this.playerFold = false;
  this.opponentFold = false;
  this.playerCardInHand = null;
  this.playerDiscardedCards = [];
  this.opponentDiscardedCards = [];
  this.isPause = false;
  this.myHandCards = new SlogGame_GameHandField();
  this.myField1 = new SlogGame_GameField();
  this.myField2 = new SlogGame_GameField();
  this.myField1Slot = new SlogGame_GameFieldSlot();
  this.myField2Slot = new SlogGame_GameFieldSlot();
  this.opponentHandCards = new SlogGame_GameHandField();
  this.opponentField1 = new SlogGame_GameField();
  this.opponentField2 = new SlogGame_GameField();
  this.opponentField1Slot = new SlogGame_GameFieldSlot();
  this.opponentField2Slot = new SlogGame_GameFieldSlot();

  this.myField1.slot = this.myField1Slot;
  this.myField2.slot = this.myField2Slot;
  this.opponentField1.slot = this.opponentField1Slot;
  this.opponentField2.slot = this.opponentField2Slot;

  this.myField1Slot.field = this.myField1;
  this.myField2Slot.field = this.myField2;
  this.opponentField1Slot.field = this.opponentField1;
  this.opponentField2Slot.field = this.opponentField2;
};

// Game-logic code (START)

SlogGame_GameManager.prototype.start = function() {
  this._windowSlogGame.cleanFieldDrawAll();
  this._windowSlogGame.updateProfileInfos();
  this._windowSlogGame.resetSelection();
  this.state = SlogGameState_GameStart;
  this.passTheMove();
};

SlogGame_GameManager.prototype.restart = async function() {
  SceneManager._scene.startFadeOut(10);
  await timeout(500);

  this.roundNumber = 0;
  this.playerHealth = 2;
  this.opponentHealth = 2;
  this.playerCardInHand = null;
  this.playerDiscardedCards = [];
  this.opponentDiscardedCards = [];
  this.isPause = false;
  this.myHandCards.cards = [];
  this.opponentHandCards.cards = [];
  this.myField1.cards = [];
  this.myField1Slot.card = null;
  this.myField2.cards = [];
  this.myField2Slot.card = null;
  this.opponentField1.cards = [];
  this.opponentField1Slot.card = null;
  this.opponentField2.cards = [];
  this.opponentField2Slot.card = null;
  this.playerFold = false;
  this.opponentFold = false;
  this.prepareDecks();
  this.generateHandCards();
  this.start();

  await timeout(100);
  SceneManager._scene.startFadeIn(15);
};

SlogGame_GameManager.prototype.update = function() {

};

SlogGame_GameManager.prototype.onCardFight = async function(isAutomatic, playedCard) {
  this._windowSlogGame.updateProfileInfos();

  for (let abilityInstance of playedCard.abilityInstances) {
    const cardPlayResult = await abilityInstance.onPlayed(this.state === SlogGameState_MyTurn, isAutomatic, this);
    if (cardPlayResult === false) {
      return false;
    }
  }
  for (let activePlayedCard of this.getActivePlayedCards()) {
    for (let abilityInstance of activePlayedCard.abilityInstances) {
      await abilityInstance.onAnyCardPlayed(playedCard, this);
    }
  }

  this._windowSlogGame.updateAllFieldsPower();
  this._windowSlogGame.updateAllCardsPower();
  this._windowSlogGame.updateWeatherSprites();
  this._windowSlogGame.updateProfileInfos();
  await timeout(1000);
  return true;
};

SlogGame_GameManager.prototype.onNewRound = async function() {
  this.roundNumber++;

  if (this.myPower() > this.opponentPower()) {
    // win
    this.opponentHealth--;
  } else if (this.myPower() < this.opponentPower()) {
    // lose
    this.playerHealth--;
  } else {
    // draw
  }

  this._windowSlogGame.resetSelection();

  // check game over
  if (this.anyOneLoseOrMaxRounds()) {
    this.state = SlogGameState_GameOver;
    this.updateMainItemsInteractable();

    let gameOverMessage = "";
    switch (this.matchResult()) {
      case 0:
        gameOverMessage = "Win!";
        break;
      case 1:
        gameOverMessage = "Lose!";
        break;
      default:
        gameOverMessage = "Draw!";
        break;
    }
    SceneManager._scene._windowSlogGameOver.setMessage(gameOverMessage);
    SceneManager._scene._windowSlogGameOver.show();
    SceneManager._scene._windowSlogGameOver.activate();
  } else {
    this.showHint(1, "New round!");
    this.myField1.cards = [];
    this.myField1Slot.card = null;
    this.myField2.cards = [];
    this.myField2Slot.card = null;
    this.opponentField1.cards = [];
    this.opponentField1Slot.card = null;
    this.opponentField2.cards = [];
    this.opponentField2Slot.card = null;
    this.playerFold = false;
    this.opponentFold = false;
    this.addCardsFromDeckAfterRound();
    this._windowSlogGame.cleanFieldDrawAll();
    this.state = SlogGameState_MyTurn;
    this.updateMainItemsInteractable();
    this._windowSlogGame.updateProfileInfos();
  }
};

SlogGame_GameManager.prototype.playCard = async function(card, field, isAutomatic, willPassTheMove) {
  // check wherefrom we will play the card
  if (card.location instanceof SlogGame_GameField ||
      card.location instanceof SlogGame_GameFieldSlot) {
    this.moveCard(card, field);
  } else if (card.location instanceof SlogGame_GameHandField) {
    this.moveCardFromHandField(card, field);
  } else {
    field.addChild(card);
    card.location = field;
    this._windowSlogGame.drawCardInField(card, field);
  }

  const cardFightSuccessFinished = await this.onCardFight(isAutomatic, card);
  if (cardFightSuccessFinished && willPassTheMove) {
    await this.passTheMove();
  }
}

SlogGame_GameManager.prototype.killCard = async function(card, isAutomatic, discardCard) {
  card.removeAllEffects();
  card.view.drawDynamicFront();

  const location = card.location;
  location.removeChild(card);

  const playedCards = this.getActivePlayedCards();

  for (let abilityInstance of card.abilityInstances) {
    for (let playedCard of playedCards) {
      playedCard.removeEffectsBySource(abilityInstance.uid);
    }
    await abilityInstance.onKilled(this);
  }

  this._windowSlogGame.cleanFieldDraw(location);

  if (discardCard) {
    if (card.location === this.myField1 ||
        card.location === this.myField2 ||
        card.location === this.myField1Slot ||
        card.location === this.myField2Slot) {
      this.playerDiscardedCards.push(card);
    } else {
      this.opponentDiscardedCards.push(card);
    }
  }
};

SlogGame_GameManager.prototype.passTheMove = async function() {
  if (this.state === SlogGameState_MyTurn) {
    await this.passTheMoveToOpponent();
  } else if (this.state === SlogGameState_OpponentTurn) {
    await this.passTheMoveToPlayer();
  } else if (this.state === SlogGameState_GameStart) {
    await this.passTheMoveToPlayer();
  }
};

SlogGame_GameManager.prototype.passTheMoveToPlayer = async function() {
  this.state = SlogGameState_MyTurn;

  if (!this.playerFold) {
    if (!this.playerHaveCards()) {
      this.fold(true);
    } else {
      this.showHint(1, "Your turn!");
    }
  } else {
    if (this.isFoldTogether()) {
      this.onNewRound();
    } else {
      this.passTheMove();
    }
  }

  this.updateMainItemsInteractable();
};

SlogGame_GameManager.prototype.passTheMoveToOpponent = async function() {
  this.state = SlogGameState_OpponentTurn;

  if (!this.opponentFold) {
    if (this.opponentHaveCards()) {
      await Slog_AI.step(this);
    } else {
      this.fold(false);
    }
  } else {
    if (this.isFoldTogether()) {
      this.onNewRound();
    } else {
      this.passTheMove();
    }
  }
};

SlogGame_GameManager.prototype.fold = function(isPlayer) {
  if (isPlayer) {
    this.playerFold = true;

    if (this.state === SlogGameState_MyTurn) {
      this._windowSlogGame.resetSelection();
      this.playerCardInHand = null;
      this.updateMainItemsInteractable();

      this.passTheMove();
    }
  } else {
    this.opponentFold = true;

    if (this.state === SlogGameState_OpponentTurn) {
      this.passTheMove();
    }
  }
}

SlogGame_GameManager.prototype.moveCard = function(card, newLocation) {
  const oldLocation = card.location;
  const oldIndex = oldLocation.cards.indexOf(card);
  if (oldLocation < 0) {
    return;
  }

  oldLocation.cards.splice(oldIndex, 1);
  newLocation.addChild(card);
  card.location = newLocation;

  this._windowSlogGame.moveCardView(card, oldLocation, newLocation);
};

SlogGame_GameManager.prototype.moveCardFromHandField = function(card, newLocation) {
  const oldLocation = card.location;
  const oldIndex = oldLocation.cards.indexOf(card);
  if (oldLocation < 0) {
    return;
  }

  const oldCardView = oldLocation.getChilds()[oldIndex].view;
  oldCardView.destroy();
  oldLocation.cards.splice(oldIndex, 1);
  oldLocation.view.removeChild(oldCardView);
  this._windowSlogGame.updateFieldCardsPositions(oldLocation);

  newLocation.addChild(card);
  card.location = newLocation;
  this._windowSlogGame.drawCardInField(card, card.location);
};

SlogGame_GameManager.prototype.onMainItemOkClick = function(mainItem) {
  if (this.playerCardInHand && !this.playerCardInHand.isHaveAbility("decoy")) {
      this._windowSlogGame.resetSelection();
      this.playCard(this.playerCardInHand, mainItem, false,true);
      this.playerCardInHand = null;
      this.updateMainItemsInteractable();
      return {
        success: true,
        select: false
      };
  } else {
      const mainItemContainsChilds = mainItem.getChilds().length > 0;
      return {
        success: mainItemContainsChilds,
        select: mainItemContainsChilds
      }
  }
};

SlogGame_GameManager.prototype.onMainItemCancelClick = function() {

};

SlogGame_GameManager.prototype.onSubItemOkClick = function(mainItem, subItem) {
  if (subItem instanceof SlogGame_GameCard) {
    const isMine = mainItem === this.myHandCards ||
                   mainItem === this.myField1 ||
                   mainItem === this.myField2 ||
                   mainItem === this.myField1Slot ||
                   mainItem === this.myField2Slot;
    const inHand = mainItem instanceof SlogGame_GameHandField;

    this.onCardItemOkClick(subItem, isMine, inHand);
  }
};

SlogGame_GameManager.prototype.onSubItemCancelClick = function(mainItem) {
  const isGameField = (mainItem instanceof SlogGame_GameField || mainItem instanceof SlogGame_GameHandField);

  if (isGameField) {
    SceneManager._scene._windowCardActions.hide();
    SceneManager._scene._windowCardActions.deactivate();
  }
};

SlogGame_GameManager.prototype.onCardItemOkClick = async function(card, isMine, inHand) {
  if (this.playerCardInHand && this.playerCardInHand.isHaveAbility("decoy")) {
    card.removeAllEffects();
    card.view.drawDynamicFront();

    const playerCardInHand = this.playerCardInHand;

    const playedCards = this.getActivePlayedCards();
    for (let abilityInstance of card.abilityInstances) {
      for (let playedCard of playedCards) {
        playedCard.removeEffectsBySource(abilityInstance.uid);
      }
    }

    const field = card.location;
    field.setChild(field.getChilds().indexOf(card), playerCardInHand);
    this.myHandCards.setChild(this.myHandCards.getChilds().indexOf(playerCardInHand), card);

    card.location = this.myHandCards;
    playerCardInHand.location = field;

    this._windowSlogGame.cleanFieldDraw(field);
    this._windowSlogGame.cleanFieldDraw(this.myHandCards);

    this._windowSlogGame.resetSelection();
    this.playerCardInHand = null;
    this.updateMainItemsInteractable();

    await this.onCardFight(false, playerCardInHand);
    await this.passTheMove();
  } else {
    const cardActions = this.getCardActions(card, isMine, inHand);

    const windowCardActions = SceneManager._scene._windowCardActions;
    windowCardActions.setCustomCommands(cardActions);
    windowCardActions.show();
    windowCardActions.refresh();

    await timeout(100);
    windowCardActions.activate();
  }
};

SlogGame_GameManager.prototype.getCardActions = function(card, isMine, inHand) {
  const actions = [];
  if (isMine && inHand && this.state === SlogGameState_MyTurn) {
    actions.push({
      name: "Play a card", symbol: "playACard"
    });
  }
  actions.push({
    name: "Description", symbol: "cardDescription"
  });
  return actions;
};

SlogGame_GameManager.prototype.updateMainItemsInteractable = function() {
  if (this.state === SlogGameState_MyTurn && !this.playerFold) {
    if (this.playerCardInHand) {
      this.setActiveMainItemsWithCardInHand();
    } else {
      this.setActiveMainItemsWithoutCardInHand();
    }
  } else {
    this.setMainItemsNotInteractable();
  }
  this._windowSlogGame.wrapSelectionMainItems(true);
};

SlogGame_GameManager.prototype.setMainItemsNotInteractable = function() {
  this.myHandCards.view.interactable = false;

  this.myField1.view.interactable = false;
  this.myField1Slot.view.interactable = false;
  this.myField2.view.interactable = false;
  this.myField2Slot.view.interactable = false;
  this.opponentField1.view.interactable = false;
  this.opponentField1Slot.view.interactable = false;
  this.opponentField2.view.interactable = false;
  this.opponentField2Slot.view.interactable = false;
};

SlogGame_GameManager.prototype.setActiveMainItemsWithCardInHand = function() {
  this.myHandCards.view.interactable = false;

  const possibleFields = this.getPossibleFieldsForCard(this.playerCardInHand, this.state);

  this.myField1.view.interactable = possibleFields.includes(this.myField1);
  this.myField1Slot.view.interactable = possibleFields.includes(this.myField1Slot);
  this.myField2.view.interactable = possibleFields.includes(this.myField2);
  this.myField2Slot.view.interactable = possibleFields.includes(this.myField2Slot);

  this.opponentField1.view.interactable = possibleFields.includes(this.opponentField1);
  this.opponentField1Slot.view.interactable = possibleFields.includes(this.opponentField1Slot);
  this.opponentField2.view.interactable = possibleFields.includes(this.opponentField2);
  this.opponentField2Slot.view.interactable = possibleFields.includes(this.opponentField2Slot);
};

SlogGame_GameManager.prototype.setActiveMainItemsWithoutCardInHand = function() {
  this.myHandCards.view.interactable = this.myHandCards.getChilds().length > 0;
  this.myField1.view.interactable = true;
  this.myField1Slot.view.interactable = true;
  this.myField2.view.interactable = true;
  this.myField2Slot.view.interactable = true;
  this.opponentField1.view.interactable = true;
  this.opponentField1Slot.view.interactable = true;
  this.opponentField2.view.interactable = true;
  this.opponentField2Slot.view.interactable = true;
};

SlogGame_GameManager.prototype.cancelPlayingCard = function() {
  this._windowSlogGame.loadSelection();
  this.playerCardInHand = null;
  this.updateMainItemsInteractable();
};

SlogGame_GameManager.prototype.isFrostWeatherActive = function() {
  return this.getActivePlayedCards().some(x => x.isHaveAbility("bitingFrost"));
};

SlogGame_GameManager.prototype.isFogWeatherActive = function() {
  return this.getActivePlayedCards().some(x => x.isHaveAbility("impenetrableFog"));
};

SlogGame_GameManager.prototype.isCardInFrostWeather = function(card) {
  return this.isFrostWeatherActive() && (card.location === this.myField1 || card.location === this.opponentField1);
};

SlogGame_GameManager.prototype.isCardInFogWeather = function(card) {
  return this.isFogWeatherActive() && (card.location === this.myField2 || card.location === this.opponentField2);
};

// Game-logic code (END)

SlogGame_GameManager.prototype.getNeighbourCards = function(card) {
  const neighbours = [];

  const cardLocation = card.location;
  const cardIndex = cardLocation.getChilds().indexOf(card);

  if (cardIndex - 1 >= 0) {
    neighbours.push(cardLocation.getChilds()[cardIndex - 1]);
  }
  if (cardIndex + 1 < cardLocation.getChilds().length) {
    neighbours.push(cardLocation.getChilds()[cardIndex + 1]);
  }

  return neighbours;
};

SlogGame_GameManager.prototype.getPossibleFieldsForCard = function(card, currentState) {
  if (card.isHaveAbility("spy")) {
    return this.getRelativeOpponentFieldsByType(card.type, card.isHaveAbility("commandersHorn"), currentState);
  }
  if (card.isHaveAbility("decoy")) {
    return this.getRelativeMyFieldsByType(card.type, card.isHaveAbility("commandersHorn"), currentState).filter(x => x.getChilds().length > 0);
  }
  return this.getRelativeMyFieldsByType(card.type, card.isHaveAbility("commandersHorn"), currentState);
};

SlogGame_GameManager.prototype.getRelativeMyFieldsByType = function(type, inSlots, currentState) {
  const relativeFields = this.getAllFieldsByType(type, inSlots);
  if (relativeFields.indexOf(this.relativeOpponentField1(currentState)) !== -1) {
    relativeFields.splice(relativeFields.indexOf(this.relativeOpponentField1(currentState)), 1);
  }
  if (relativeFields.indexOf(this.relativeOpponentField1Slot(currentState)) !== -1) {
    relativeFields.splice(relativeFields.indexOf(this.relativeOpponentField1Slot(currentState)), 1);
  }
  if (relativeFields.indexOf(this.relativeOpponentField2(currentState)) !== -1) {
    relativeFields.splice(relativeFields.indexOf(this.relativeOpponentField2(currentState)), 1);
  }
  if (relativeFields.indexOf(this.relativeOpponentField2Slot(currentState)) !== -1) {
    relativeFields.splice(relativeFields.indexOf(this.relativeOpponentField2Slot(currentState)), 1);
  }
  return relativeFields;
};

SlogGame_GameManager.prototype.getRelativeOpponentFieldsByType = function(type, inSlots, currentState) {
  const relativeFields = this.getAllFieldsByType(type, inSlots);
  if (relativeFields.indexOf(this.relativeMyField1(currentState)) !== -1) {
    relativeFields.splice(relativeFields.indexOf(this.relativeMyField1(currentState)), 1);
  }
  if (relativeFields.indexOf(this.relativeMyField1Slot(currentState)) !== -1) {
    relativeFields.splice(relativeFields.indexOf(this.relativeMyField1Slot(currentState)), 1);
  }
  if (relativeFields.indexOf(this.relativeMyField2(currentState)) !== -1) {
    relativeFields.splice(relativeFields.indexOf(this.relativeMyField2(currentState)), 1);
  }
  if (relativeFields.indexOf(this.relativeMyField2Slot(currentState)) !== -1) {
    relativeFields.splice(relativeFields.indexOf(this.relativeMyField2Slot(currentState)), 1);
  }
  return relativeFields;
};

SlogGame_GameManager.prototype.getAllFieldsByType = function(type, inSlots) {
  const fields = [];
  if (inSlots) {
    if (this.myField1Slot.canAddChild()) fields.push(this.myField1Slot);
    if (this.myField2Slot.canAddChild()) fields.push(this.myField2Slot);
    if (this.opponentField1Slot.canAddChild()) fields.push(this.opponentField1Slot);
    if (this.opponentField2Slot.canAddChild()) fields.push(this.opponentField2Slot);
  } else {
    if (type.contains("cc")) {
      if (this.myField1.canAddChild()) fields.push(this.myField1);
      if (this.opponentField1.canAddChild()) fields.push(this.opponentField1);
    }
    if (type.contains("r")) {
      if (this.myField2.canAddChild()) fields.push(this.myField2);
      if (this.opponentField2.canAddChild()) fields.push(this.opponentField2);
    }
  }
  return fields;
};

SlogGame_GameManager.prototype.relativeMyHandCards = function(currentState) {
  return currentState === SlogGameState_OpponentTurn ? this.opponentHandCards : this.myHandCards;
};

SlogGame_GameManager.prototype.relativeMyField1 = function(currentState) {
  return currentState === SlogGameState_OpponentTurn ? this.opponentField1 : this.myField1;
};

SlogGame_GameManager.prototype.relativeMyField1Slot = function(currentState) {
  return currentState === SlogGameState_OpponentTurn ? this.opponentField1Slot : this.myField1Slot;
};

SlogGame_GameManager.prototype.relativeMyField2 = function(currentState) {
  return currentState === SlogGameState_OpponentTurn ? this.opponentField2 : this.myField2;
};

SlogGame_GameManager.prototype.relativeMyField2Slot = function(currentState) {
  return currentState === SlogGameState_OpponentTurn ? this.opponentField2Slot : this.myField2Slot;
};

SlogGame_GameManager.prototype.relativeOpponentHandCards = function(currentState) {
  return currentState === SlogGameState_MyTurn ? this.opponentHandCards : this.myHandCards;
};

SlogGame_GameManager.prototype.relativeOpponentField1 = function(currentState) {
  return currentState === SlogGameState_MyTurn ? this.opponentField1 : this.myField1;
};

SlogGame_GameManager.prototype.relativeOpponentField1Slot = function(currentState) {
  return currentState === SlogGameState_MyTurn ? this.opponentField1Slot : this.myField1Slot;
};

SlogGame_GameManager.prototype.relativeOpponentField2 = function(currentState) {
  return currentState === SlogGameState_MyTurn ? this.opponentField2 : this.myField2;
};

SlogGame_GameManager.prototype.relativeOpponentField2Slot = function(currentState) {
  return currentState === SlogGameState_MyTurn ? this.opponentField2Slot : this.myField2Slot;
};

SlogGame_GameManager.prototype.findCardInHandAndDeck = function(cardId, isPlayerHandAndDeck) {
  let desiredCard;
  desiredCard = this.findCardInHand(cardId, isPlayerHandAndDeck);
  if (!desiredCard) desiredCard = this.findCardInDeck(cardId, isPlayerHandAndDeck);
  return desiredCard;
};

SlogGame_GameManager.prototype.findCardInHand = function(cardId, isPlayerHand) {
  const handCards = isPlayerHand ? this.myHandCards.getChilds() : this.opponentHandCards.getChilds();
  return handCards.find(x => x.id === cardId);
};

SlogGame_GameManager.prototype.findCardInDeck = function(cardId, isPlayerDeck) {
  const deck = isPlayerDeck ? this.myDeck : this.opponentDeck;
  if (deck.some(x => x.id === cardId)) {
    return this.takeCardFromDeck(cardId, deck);
  }
  return null;
};

SlogGame_GameManager.prototype.getActivePlayedCards = function() {
  let playedCards = [];
  playedCards = playedCards.concat(this.opponentField2Slot.getChilds());
  playedCards = playedCards.concat(this.opponentField2.getChilds());
  playedCards = playedCards.concat(this.opponentField1Slot.getChilds());
  playedCards = playedCards.concat(this.opponentField1.getChilds());
  playedCards = playedCards.concat(this.myField1Slot.getChilds());
  playedCards = playedCards.concat(this.myField1.getChilds());
  playedCards = playedCards.concat(this.myField2Slot.getChilds());
  playedCards = playedCards.concat(this.myField2.getChilds());
  return playedCards;
};

SlogGame_GameManager.prototype.getActiveRelativeOpponentPlayedCards = function(currentState) {
  let playedCards = [];
  playedCards = playedCards.concat(this.relativeOpponentField1(currentState).getChilds());
  playedCards = playedCards.concat(this.relativeOpponentField1Slot(currentState).getChilds());
  playedCards = playedCards.concat(this.relativeOpponentField2(currentState).getChilds());
  playedCards = playedCards.concat(this.relativeOpponentField2Slot(currentState).getChilds());
  return playedCards;
};

SlogGame_GameManager.prototype.showHint = async function(visibleDuration, message) {
  const currentScene = SceneManager._scene;
  const windowHint = currentScene._windowSlogGameHint;

  await windowHint.hideAndWait();
  windowHint.show(visibleDuration, message);
};

SlogGame_GameManager.prototype.hideHint = function() {
  const currentScene = SceneManager._scene;
  const windowHint = currentScene._windowSlogGameHint;

  windowHint.hide();
};

SlogGame_GameManager.prototype.prepareDecks = function() {
  this.myDeck = JSON.parse(JSON.stringify($gamePlayerSlogDeck));
  this.opponentDeck = JSON.parse(JSON.stringify(Slog_AI.getNPCDeck()));
};

SlogGame_GameManager.prototype.countDeckSize = function(deck) {
  let result = 0;
  for (let i = 0; i < deck.length; i++) {
    result += deck[i].quantity;
  }
  return result;
};

SlogGame_GameManager.prototype.generateHandCards = function() {
  for (let i = 0; i < Slog_DataHelper.startHandCardsCount(); i++) {
    const myCard = this.takeRandomCardFromDeck(this.myDeck);
    this.myHandCards.addChild(myCard);
    myCard.location = this.myHandCards;

    const opponentCard = this.takeRandomCardFromDeck(this.opponentDeck);
    this.opponentHandCards.addChild(opponentCard);
    opponentCard.location = this.opponentHandCards;
  }
};

SlogGame_GameManager.prototype.addCardsFromDeckAfterRound = function() {
  for (let i = 0; i < Slog_DataHelper.countNewCardsAfterRound(); i++) {
    if (this.myDeck.length > 0) {
      const myCard = this.takeRandomCardFromDeck(this.myDeck);
      this.myHandCards.addChild(myCard);
      myCard.location = this.myHandCards;
    }

    if (this.opponentDeck.length > 0) {
      const opponentCard = this.takeRandomCardFromDeck(this.opponentDeck);
      this.opponentHandCards.addChild(opponentCard);
      opponentCard.location = this.opponentHandCards;
    }
  }
};

SlogGame_GameManager.prototype.takeRandomCardFromDeck = function(deck) {
  const randomIndex = Math.floor(Math.random() * deck.length);
  const template = Slog_DataHelper.getCard(deck[randomIndex].id);

  deck[randomIndex].quantity--;
  if (deck[randomIndex].quantity <= 0) {
    deck.splice(randomIndex, 1);
  }

  return new SlogGame_GameCard(template);
};

SlogGame_GameManager.prototype.takeCardFromDeck = function(cardId, deck) {
  const cardIndex = deck.findIndex(x => x.id === cardId);
  const template = Slog_DataHelper.getCard(deck[cardIndex].id);

  deck[cardIndex].quantity--;
  if (deck[cardIndex].quantity <= 0) {
    deck.splice(cardIndex, 1);
  }

  return new SlogGame_GameCard(template);
};

SlogGame_GameManager.prototype.myPower = function () {
  return this.myField1.getPower() + this.myField2.getPower();
};

SlogGame_GameManager.prototype.opponentPower = function () {
  return this.opponentField1.getPower() + this.opponentField2.getPower();
};

SlogGame_GameManager.prototype.relativeMyPower = function (currentState) {
  return this.relativeMyField1(currentState).getPower() + this.relativeMyField2(currentState).getPower();
};

SlogGame_GameManager.prototype.relativeOpponentPower = function (currentState) {
  return this.relativeOpponentField1(currentState).getPower() + this.relativeOpponentField2(currentState).getPower();
};

// 0 - win, 1 - lose, 2 - draw
SlogGame_GameManager.prototype.matchResult = function () {
  if (this.playerHealth > this.opponentHealth) {
    return 0;
  } else if (this.playerHealth < this.opponentHealth) {
    return 1;
  } else {
    return 2;
  }
};

SlogGame_GameManager.prototype.anyOneLoseOrMaxRounds = function () {
  return this.playerHealth <= 0 || this.opponentHealth <= 0 || this.roundNumber >= 3;
};

SlogGame_GameManager.prototype.isFoldTogether = function () {
  return this.playerFold && this.opponentFold;
};

SlogGame_GameManager.prototype.playerHaveCards = function () {
  return this.myHandCards.cards.length > 0;
};

SlogGame_GameManager.prototype.opponentHaveCards = function () {
  return this.opponentHandCards.cards.length > 0;
};

// GameCard

function SlogGame_GameCard(template) {
  this.location = null;
  this.view = null;
  this.effects = new Map();
  this.applyTemplate(template);
}

SlogGame_GameCard.prototype.applyTemplate = function (template) {
  const templateCopy = JSON.parse(JSON.stringify(template));
  this.id = templateCopy.id;
  this.sprite = templateCopy.sprite;
  this.power = templateCopy.power;
  this.type = templateCopy.type;
  this.class = templateCopy.class;
  this.abilities = templateCopy.abilities;
  this.title = templateCopy.title;
  this.desc = templateCopy.desc;
  this.createAbilityInstances();
};

SlogGame_GameCard.prototype.createAbilityInstances = function() {
  this.abilityInstances = [];

  for (let abilityKey of this.abilities) {
    switch (abilityKey) {
      case "agile":
        this.abilityInstances.push(new SlogGame_GameCardAbility_Agile(this));
        break;
      case "commandersHorn":
        this.abilityInstances.push(new SlogGame_GameCardAbility_CommandersHorn(this));
        break;
      case "muster":
        this.abilityInstances.push(new SlogGame_GameCardAbility_Muster(this));
        break;
      case "spy":
        this.abilityInstances.push(new SlogGame_GameCardAbility_Spy(this));
        break;
      case "moraleBoost":
        this.abilityInstances.push(new SlogGame_GameCardAbility_MoraleBoost(this));
        break;
      case "scorch":
        this.abilityInstances.push(new SlogGame_GameCardAbility_Scorch(this));
        break;
      case "medic":
        this.abilityInstances.push(new SlogGame_GameCardAbility_Medic(this));
        break;
      case "tightBond":
        this.abilityInstances.push(new SlogGame_GameCardAbility_TightBond(this));
        break;
      case "mardroeme":
        this.abilityInstances.push(new SlogGame_GameCardAbility_Mardroeme(this));
        break;
      case "decoy":
        this.abilityInstances.push(new SlogGame_GameCardAbility_Decoy(this));
        break;
      case "bitingFrost":
        this.abilityInstances.push(new SlogGame_GameCardAbility_BitingFrost(this));
        break;
      case "impenetrableFog":
        this.abilityInstances.push(new SlogGame_GameCardAbility_ImpenetrableFog(this));
        break;
      case "clearWeather":
        this.abilityInstances.push(new SlogGame_GameCardAbility_ClearWeather(this));
        break;
    }
  }
};

SlogGame_GameCard.prototype.hasEffect = function(effectName) {
  for (let effectSource of this.effects.keys()) {
    for (let effect of this.effects.get(effectSource)) {
      if (effect.constructor.name === effectName) {
        return true;
      }
    }
  }
  return false;
}

SlogGame_GameCard.prototype.hasEffectInSource = function(cardUID, effectName) {
  if (!this.effects.has(cardUID)) {
    return false;
  }

  for (let effect of this.effects.get(cardUID)) {
    if (effect.constructor.name === effectName) {
      return true;
    }
  }

  return false;
}

SlogGame_GameCard.prototype.addEffect = function(cardUID, effect) {
  if (!this.effects.has(cardUID)) {
    this.effects.set(cardUID, []);
  }
  // prevent add duplicate effects from one source
  if (!this.effects.get(cardUID).some(x => x.constructor.name === effect.constructor.name)) {
    this.effects.get(cardUID).push(effect);
  }
};

SlogGame_GameCard.prototype.removeEffectsBySource = function(cardUID) {
  this.effects.delete(cardUID);
};

SlogGame_GameCard.prototype.removeAllEffects = function() {
  this.effects = new Map();
};

SlogGame_GameCard.prototype.getPower = function() {
  const effects = [];
  for (let effectSource of this.effects.keys()) {
    for (let effect of this.effects.get(effectSource)) {
      effects.push(effect);
    }
  }
  effects.sort((a, b) => {
    return b.getPriority() - a.getPriority();
  });

  let resultPower = this.power;
  for (let effect of effects) {
    resultPower = effect.getModifiedPower(resultPower);
  }

  return resultPower;
};

SlogGame_GameCard.prototype.isHaveAbility = function(ability) {
  return this.abilities.includes(ability);
};

// GameField

function SlogGame_GameField() {
  this.slot = null;
  this.cards = [];
  this.view = null;
}

SlogGame_GameField.prototype.canAddChild = function() {
  return true;
};

SlogGame_GameField.prototype.addChild = function(child) {
  this.cards.push(child);
};

SlogGame_GameField.prototype.setChild = function(index, child) {
  this.cards[index] = child;
};

SlogGame_GameField.prototype.removeChildByIndex = function(index) {
  if (index > - 1 && index < this.cards.length) {
    this.cards.splice(index, 1);
  }
};

SlogGame_GameField.prototype.removeChild = function(child) {
  const childIndex = this.cards.indexOf(child);
  if (childIndex > -1) {
    this.cards.splice(childIndex, 1);
  }
}

SlogGame_GameField.prototype.getPower = function () {
  let power = 0;
  for (let card of this.cards) {
    if (card.power) {
      power += card.getPower();
    }
  }
  return power;
};

SlogGame_GameField.prototype.getChilds = function () {
  return this.cards;
}

SlogGame_GameField.prototype.getChildViews = function () {
  return this.cards.map(x => x.view);
}

// GameFieldSlot

function SlogGame_GameFieldSlot() {
  this.field = null;
  this.card = null;
  this.view = null;
}

SlogGame_GameFieldSlot.prototype.canAddChild = function() {
  return this.card == null;
};

SlogGame_GameFieldSlot.prototype.addChild = function(child) {
  this.card = child;
};

SlogGame_GameFieldSlot.prototype.setChild = function(index, child) {
  if (index === 0) {
    this.card = child;
  }
};

SlogGame_GameFieldSlot.prototype.removeChild = function(child) {
  if (this.card === child) {
    this.card = null;
  }
}

SlogGame_GameFieldSlot.prototype.removeChildByIndex = function(index) {
  if (index === 0) {
    this.card = null;
  }
};

SlogGame_GameFieldSlot.prototype.getChilds = function () {
  return this.card ? [this.card] : [];
}

SlogGame_GameFieldSlot.prototype.getChildViews = function () {
  return this.card ? [this.card.view] : [];
}

// GameHandField

function SlogGame_GameHandField() {
  this.cards = [];
  this.view = null;
}

SlogGame_GameHandField.prototype.canAddChild = function() {
  return true;
};

SlogGame_GameHandField.prototype.addChild = function(child) {
  this.cards.push(child);
};

SlogGame_GameHandField.prototype.setChild = function(index, child) {
  this.cards[index] = child;
};

SlogGame_GameHandField.prototype.removeChild = function(child) {
  const childIndex = this.cards.indexOf(child);
  if (childIndex > -1) {
    this.cards.splice(childIndex, 1);
  }
}

SlogGame_GameHandField.prototype.removeChildByIndex = function(index) {
  if (index > - 1 && index < this.cards.length) {
    this.cards.splice(index, 1);
  }
};

SlogGame_GameHandField.prototype.getChilds = function () {
  return this.cards;
}

SlogGame_GameHandField.prototype.getChildViews = function () {
  return this.cards.map(x => x.view);
}

// ---------------------------------------------------------------------------------------
// GameCardAbility Base Class

function SlogGame_GameCardAbility(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility.prototype.initialize = function(card) {
  this.card = card;
  this.uid = uuidv4();
};

SlogGame_GameCardAbility.prototype.onPlayed = async function (byPlayer, isAutomatic, gameManager) {

};

SlogGame_GameCardAbility.prototype.onKilled = async  function (gameManager) {

};

SlogGame_GameCardAbility.prototype.onAnyCardPlayed = async function (card, gameManager) {

};

// GameCardAbility Agile

function SlogGame_GameCardAbility_Agile(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_Agile.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_Agile.prototype.construct = SlogGame_GameCardAbility_Agile;

// GameCardAbility CommandersHorn

function SlogGame_GameCardAbility_CommandersHorn(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_CommandersHorn.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_CommandersHorn.prototype.construct = SlogGame_GameCardAbility_CommandersHorn;

SlogGame_GameCardAbility_CommandersHorn.prototype.onPlayed = async function (byPlayer, isAutomatic, gameManager) {
  const fieldSlot = this.card.location;
  const field = fieldSlot.field;
  const fieldCards = field.getChilds();

  for (let card of fieldCards) {
    if (card.hasEffect(SlogGame_GameCardEffect_CommandersHorn.name)) {
      return;
    }

    card.addEffect(this.uid, new SlogGame_GameCardEffect_CommandersHorn());
  }
};

SlogGame_GameCardAbility_CommandersHorn.prototype.onAnyCardPlayed = async function (card, gameManager) {
  if (this.card.location.field !== card.location) {
    return;
  }

  if (this.card === card) {
    return;
  }

  if (card.hasEffect(SlogGame_GameCardEffect_CommandersHorn.name)) {
    return;
  }

  card.addEffect(this.uid, new SlogGame_GameCardEffect_CommandersHorn());
};

// GameCardAbility Muster

function SlogGame_GameCardAbility_Muster(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_Muster.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_Muster.prototype.construct = SlogGame_GameCardAbility_Muster;

SlogGame_GameCardAbility_Muster.prototype.onPlayed = async function (byPlayer, isAutomatic, gameManager) {
  if (!isAutomatic) {
    const sameCard = gameManager.findCardInHandAndDeck(this.card.id, byPlayer);
    if (sameCard) {
      await gameManager.playCard(sameCard, this.card.location, true, false);
    }
  }
};

// GameCardAbility Spy

function SlogGame_GameCardAbility_Spy(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_Spy.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_Spy.prototype.construct = SlogGame_GameCardAbility_Spy;

SlogGame_GameCardAbility_Spy.prototype.onPlayed = async function (byPlayer, isAutomatic, gameManager) {
  const deck = byPlayer ? gameManager.myDeck : gameManager.opponentDeck;
  const handCards = byPlayer ? gameManager.myHandCards : gameManager.opponentHandCards;
  for (let i = 0; i < Math.min(2, Slog_DataHelper.countCardsInDeck(deck)); i++) {
    const card = gameManager.takeRandomCardFromDeck(deck);
    handCards.addChild(card);
    card.location = handCards;
  }
  gameManager._windowSlogGame.cleanFieldDraw(handCards);
};

// GameCardAbility MoraleBoost

function SlogGame_GameCardAbility_MoraleBoost(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_MoraleBoost.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_MoraleBoost.prototype.construct = SlogGame_GameCardAbility_MoraleBoost;

SlogGame_GameCardAbility_MoraleBoost.prototype.onPlayed = async function (byPlayer, isAutomatic, gameManager) {
  const field = this.card.location;
  const fieldCards = field.getChilds();

  for (let card of fieldCards) {
    if (card.hasEffect(SlogGame_GameCardEffect_MoraleBoost.name)) {
      return;
    }

    card.addEffect(this.uid, new SlogGame_GameCardEffect_MoraleBoost());
  }
};

SlogGame_GameCardAbility_MoraleBoost.prototype.onAnyCardPlayed = async function (card, gameManager) {
  if (this.card.location !== card.location) {
    return;
  }

  if (this.card === card) {
    return;
  }

  if (card.hasEffect(SlogGame_GameCardEffect_MoraleBoost.name)) {
    return;
  }

  card.addEffect(this.uid, new SlogGame_GameCardEffect_MoraleBoost());
};

// GameCardAbility Scorch

function SlogGame_GameCardAbility_Scorch(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_Scorch.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_Scorch.prototype.construct = SlogGame_GameCardAbility_Scorch;

SlogGame_GameCardAbility_Scorch.prototype.onPlayed = async function (byPlayer, isAutomatic, gameManager) {
  await timeout(500);

  const activeOpponentPlayedCards = gameManager.getActiveRelativeOpponentPlayedCards(gameManager.state);
  let strongestPlayedCardId = null;
  let currentStrongestCardPower = 0;
  let currentStrongestCardIndex = -1;
  for (let i = 0; i < activeOpponentPlayedCards.length; i++) {
    if (activeOpponentPlayedCards[i].getPower() > currentStrongestCardPower) {
      currentStrongestCardIndex = i;
    }
  }

  if (currentStrongestCardIndex >= 0) {
    strongestPlayedCardId = activeOpponentPlayedCards[currentStrongestCardIndex].id;
    const strongestPlayedCards = activeOpponentPlayedCards.filter(x => x.id === strongestPlayedCardId);

    for (let strongestCard of strongestPlayedCards) {
      await gameManager.killCard(strongestCard, isAutomatic, true);
    }
  }

  await timeout(500);

  await gameManager.killCard(this.card, isAutomatic, false);
};

// GameCardAbility Medic

function SlogGame_GameCardAbility_Medic(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_Medic.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_Medic.prototype.construct = SlogGame_GameCardAbility_Medic;

SlogGame_GameCardAbility_Medic.prototype.onPlayed = async function (byPlayer, isAutomatic, gameManager) {
  if (byPlayer) {
    if (gameManager.playerDiscardedCards && gameManager.playerDiscardedCards.length > 0) {
      let isCanceled = false;

      const windowSlogSelectCards = SceneManager._scene._windowSlogSelectCards;
      windowSlogSelectCards.setTitle("Select card to restore");
      windowSlogSelectCards.setCards(gameManager.playerDiscardedCards);
      windowSlogSelectCards.show();
      windowSlogSelectCards.setSelectAction(async (card) => {
        const cardLocation = card.location;
        card.location = null;
        await gameManager.playCard(card, cardLocation, true, false);
      });
      windowSlogSelectCards.setCancelAction(() => {
        this.card.removeAllEffects();
        this.card.view.drawDynamicFront();
        const playedCards = gameManager.getActivePlayedCards();
        for (let abilityInstance of this.card.abilityInstances) {
          for (let playedCard of playedCards) {
            playedCard.removeEffectsBySource(abilityInstance.uid);
          }
        }

        const field = this.card.location;
        field.removeChildByIndex(field.getChilds().indexOf(this.card));
        gameManager.myHandCards.addChild(this.card);

        this.card.location = gameManager.myHandCards;

        gameManager._windowSlogGame.cleanFieldDraw(field);
        gameManager._windowSlogGame.cleanFieldDraw(gameManager.myHandCards);

        gameManager._windowSlogGame.resetSelection();
        gameManager.playerCardInHand = null;
        gameManager.updateMainItemsInteractable();

        windowSlogSelectCards.deactivate();

        isCanceled = true;
      });
      await timeout(100);
      windowSlogSelectCards.activate();
      await windowSlogSelectCards.waitForInvisible();

      return !isCanceled;
    }
  } else {
    if (gameManager.opponentDiscardedCards && gameManager.opponentDiscardedCards.length > 0) {
      const maxUsefulCard = gameManager.opponentDiscardedCards.sort((a, b) => {
        return a.getPower() - b.getPower()
      })[0];

      const cardLocation = maxUsefulCard.location;
      maxUsefulCard.location = null;
      await gameManager.playCard(maxUsefulCard, cardLocation, true, false);
      await timeout(100);
    }
  }
  return true;
};

// GameCardAbility TightBond

function SlogGame_GameCardAbility_TightBond(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_TightBond.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_TightBond.prototype.construct = SlogGame_GameCardAbility_TightBond;

SlogGame_GameCardAbility_TightBond.prototype.onPlayed = async function (byPlayer, isAutomatic, gameManager) {
  const neighbourCards = gameManager.getNeighbourCards(this.card).filter(x => x.id === this.card.id);

  for (let neighbourCard of neighbourCards) {
    if (neighbourCard.hasEffect(SlogGame_GameCardEffect_TightBond.name)) {
      continue;
    }

    neighbourCard.addEffect(this.uid, new SlogGame_GameCardEffect_TightBond());
  }
};

SlogGame_GameCardAbility_TightBond.prototype.onAnyCardPlayed = async function (card, gameManager) {
  if (this.card === card) {
    return;
  }

  const neighbourCards = gameManager.getNeighbourCards(this.card).filter(x => x.id === this.card.id);

  for (let neighbourCard of neighbourCards) {
    if (neighbourCard.hasEffect(SlogGame_GameCardEffect_TightBond.name)) {
      continue;
    }

    neighbourCard.addEffect(this.uid, new SlogGame_GameCardEffect_TightBond());
  }
};

SlogGame_GameCardAbility_TightBond.prototype.onKilled = async function (gameManager) {
  //todo:
};

// GameCardAbility Mardroeme

function SlogGame_GameCardAbility_Mardroeme(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_Mardroeme.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_Mardroeme.prototype.construct = SlogGame_GameCardAbility_Mardroeme;

SlogGame_GameCardAbility_Mardroeme.prototype.onPlayed = async function (byPlayer, isAutomatic, gameManager) {
  const field = this.card.location;
  const fieldCards = field.getChilds();

  let countCardsTransformed = 0;

  for (let i = 0; i < fieldCards.length; i++) {
    if (fieldCards[i].isHaveAbility("berserker")) {
      const bearCard = new SlogGame_GameCard(Slog_DataHelper.getCard("bear"));
      bearCard.location = fieldCards[i].location;
      fieldCards[i] = bearCard;

      countCardsTransformed++;
    }
  }

  if (countCardsTransformed > 0) {
    gameManager._windowSlogGame.cleanFieldDraw(field);
  }
};

SlogGame_GameCardAbility_Mardroeme.prototype.onAnyCardPlayed = async function (card, gameManager) {
  const field = this.card.location;
  const fieldCards = field.getChilds();

  let countCardsTransformed = 0;

  for (let i = 0; i < fieldCards.length; i++) {
    if (fieldCards[i].isHaveAbility("berserker")) {
      const bearCard = new SlogGame_GameCard(Slog_DataHelper.getCard("bear"));
      bearCard.location = fieldCards[i].location;
      fieldCards[i] = bearCard;

      countCardsTransformed++;
    }
  }

  if (countCardsTransformed > 0) {
    gameManager._windowSlogGame.cleanFieldDraw(field);
  }
};

// GameCardAbility Berserker

function SlogGame_GameCardAbility_Berserker(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_Berserker.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_Berserker.prototype.construct = SlogGame_GameCardAbility_Berserker;

// GameCardAbility Decoy

function SlogGame_GameCardAbility_Decoy(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_Decoy.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_Decoy.prototype.construct = SlogGame_GameCardAbility_Decoy;

SlogGame_GameCardAbility_Decoy.prototype.onPlayed = async function (byPlayer, isAutomatic, gameManager) {

};

// GameCardAbility BitingFrost

function SlogGame_GameCardAbility_BitingFrost(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_BitingFrost.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_BitingFrost.prototype.construct = SlogGame_GameCardAbility_BitingFrost;

SlogGame_GameCardAbility_BitingFrost.prototype.onPlayed = async function (byPlayer, isAutomatic, gameManager) {
  const targetCards = gameManager.getActivePlayedCards().filter(x => gameManager.isCardInFrostWeather(x));
  for (let card of targetCards) {
    if (card.hasEffect(SlogGame_GameCardEffect_BitingFrost.name)) {
      return;
    }

    card.addEffect(this.uid, new SlogGame_GameCardEffect_BitingFrost());
  }

  gameManager._windowSlogGame.updateWeatherSprites();
};

SlogGame_GameCardAbility_BitingFrost.prototype.onAnyCardPlayed = async function (card, gameManager) {
  if (this.card === card) {
    return;
  }

  if (gameManager.isCardInFrostWeather(card)) {
    if (card.hasEffect(SlogGame_GameCardEffect_BitingFrost.name)) {
      return;
    }

    card.addEffect(this.uid, new SlogGame_GameCardEffect_BitingFrost());
  }
};

SlogGame_GameCardAbility_BitingFrost.prototype.onKilled = async function (gameManager) {
  gameManager._windowSlogGame.updateWeatherSprites();
};

// GameCardAbility ImpenetrableFog

function SlogGame_GameCardAbility_ImpenetrableFog(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_ImpenetrableFog.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_ImpenetrableFog.prototype.construct = SlogGame_GameCardAbility_ImpenetrableFog;

SlogGame_GameCardAbility_ImpenetrableFog.prototype.onPlayed = async function (byPlayer, isAutomatic, gameManager) {
  const targetCards = gameManager.getActivePlayedCards().filter(x => gameManager.isCardInFogWeather(x));
  for (let card of targetCards) {
    if (card.hasEffect(SlogGame_GameCardEffect_ImpenetrableFog.name)) {
      return;
    }

    card.addEffect(this.uid, new SlogGame_GameCardEffect_ImpenetrableFog());
  }

  gameManager._windowSlogGame.updateWeatherSprites();
};

SlogGame_GameCardAbility_ImpenetrableFog.prototype.onAnyCardPlayed = async function (card, gameManager) {
  if (this.card === card) {
    return;
  }

  if (gameManager.isCardInFogWeather(card)) {
    if (card.hasEffect(SlogGame_GameCardEffect_ImpenetrableFog.name)) {
      return;
    }

    card.addEffect(this.uid, new SlogGame_GameCardEffect_ImpenetrableFog());
  }
};

SlogGame_GameCardAbility_ImpenetrableFog.prototype.onKilled = async function (gameManager) {
  gameManager._windowSlogGame.updateWeatherSprites();
};

// GameCardAbility ClearWeather

function SlogGame_GameCardAbility_ClearWeather(card) {
  this.initialize(card);
}

SlogGame_GameCardAbility_ClearWeather.prototype = Object.create(SlogGame_GameCardAbility.prototype);
SlogGame_GameCardAbility_ClearWeather.prototype.construct = SlogGame_GameCardAbility_ClearWeather;

SlogGame_GameCardAbility_ClearWeather.prototype.onPlayed = async function (byPlayer, isAutomatic, gameManager) {
  const weatherCards = gameManager.getActivePlayedCards().filter(x => x.isHaveAbility("bitingFrost") || x.isHaveAbility("impenetrableFog"));
  for (let weatherCard of weatherCards) {
    await gameManager.killCard(weatherCard, isAutomatic, false);
  }
  await gameManager.killCard(this.card, isAutomatic, false);
};

// ------------------------------------------------------------------------------------------
// GameCardEffect Base Class

function SlogGame_GameCardEffect() {

}

SlogGame_GameCardEffect.prototype.getPriority = function() {
  return 1;
};

SlogGame_GameCardEffect.prototype.getModifiedPower = function (power) {
  return power;
};

// GameCardEffect CommandersHorn

function SlogGame_GameCardEffect_CommandersHorn() {

}

SlogGame_GameCardEffect_CommandersHorn.prototype = Object.create(SlogGame_GameCardEffect.prototype);
SlogGame_GameCardEffect_CommandersHorn.prototype.construct = SlogGame_GameCardEffect_CommandersHorn;

SlogGame_GameCardEffect_CommandersHorn.prototype.getPriority = function() {
  return -1;
};

SlogGame_GameCardEffect_CommandersHorn.prototype.getModifiedPower = function (power) {
  return power * 2;
};

// GameCardEffect MoraleBoost

function SlogGame_GameCardEffect_MoraleBoost() {

}

SlogGame_GameCardEffect_MoraleBoost.prototype = Object.create(SlogGame_GameCardEffect.prototype);
SlogGame_GameCardEffect_MoraleBoost.prototype.construct = SlogGame_GameCardEffect_MoraleBoost;

SlogGame_GameCardEffect_MoraleBoost.prototype.getModifiedPower = function (power) {
  return power + 1;
};

// GameCardEffect TightBond

function SlogGame_GameCardEffect_TightBond() {

}

SlogGame_GameCardEffect_TightBond.prototype = Object.create(SlogGame_GameCardEffect.prototype);
SlogGame_GameCardEffect_TightBond.prototype.construct = SlogGame_GameCardEffect_TightBond;

SlogGame_GameCardEffect_TightBond.prototype.getModifiedPower = function (power) {
  return power * 2;
};

// GameCardEffect BitingFrost

function SlogGame_GameCardEffect_BitingFrost() {

}

SlogGame_GameCardEffect_BitingFrost.prototype = Object.create(SlogGame_GameCardEffect.prototype);
SlogGame_GameCardEffect_BitingFrost.prototype.construct = SlogGame_GameCardEffect_BitingFrost;

SlogGame_GameCardEffect_BitingFrost.prototype.getPriority = function() {
  return 10000;
};

SlogGame_GameCardEffect_BitingFrost.prototype.getModifiedPower = function (power) {
  return 1;
};

// GameCardEffect ImpenetrableFog

function SlogGame_GameCardEffect_ImpenetrableFog() {

}

SlogGame_GameCardEffect_ImpenetrableFog.prototype = Object.create(SlogGame_GameCardEffect.prototype);
SlogGame_GameCardEffect_ImpenetrableFog.prototype.construct = SlogGame_GameCardEffect_ImpenetrableFog;

SlogGame_GameCardEffect_ImpenetrableFog.prototype.getPriority = function() {
  return 10000;
};

SlogGame_GameCardEffect_ImpenetrableFog.prototype.getModifiedPower = function (power) {
  return 1;
};