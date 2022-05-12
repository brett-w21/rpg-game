//-----------------------------------------------------------------------------
// Scene_PlayerDeck
//
function Scene_PlayerDeck() {
  this.initialize(...arguments);
}

Scene_PlayerDeck.prototype = Object.create(Scene_Base.prototype);
Scene_PlayerDeck.prototype.constructor = Scene_PlayerDeck;

Scene_PlayerDeck.prototype.initialize = function() {
  Scene_Base.prototype.initialize.call(this);
};

Scene_PlayerDeck.prototype.create = function () {
  Scene_Base.prototype.create.call(this);
  this.createColorFilter();
  this.createBackground();
  this.createWindowLayer();
  this.createWindows();
  this.createCancelButton();
};

Scene_PlayerDeck.prototype.update = function() {
  Scene_Base.prototype.update.call(this);

  // if (this._windowPlayerCardCollection && this._windowPlayerCardCollection.active) {
  //   this._windowPlayerDeckCardInfo.setCard(this._windowPlayerCardCollection.getSelectedCard());
  // } else if (this._windowPlayerDeck && this._windowPlayerDeck.active) {
  //   this._windowPlayerDeckCardInfo.setCard(this._windowPlayerDeck.getSelectedCard());
  // } else {
  //   if (this._windowPlayerDeckCardInfo) {
  //     this._windowPlayerDeckCardInfo.setCard(null);
  //   }
  // }
};

Scene_PlayerDeck.prototype.createBackground = function () {
  this._backSprite = new Sprite(
      ImageManager.loadSlogBackground("Deck")
  );
  this.addChild(this._backSprite);
};

Scene_PlayerDeck.prototype.createWindows = function () {
  const topOffset = 105;
  const blockWidth = 255;

  const playerCardsCommandRect = new Rectangle(0, topOffset - 55, Graphics.boxWidth, 55);
  this._windowPlayerCardsCommand = new Window_PlayerCardsCommand(playerCardsCommandRect);
  this._windowPlayerCardsCommand.setHandler("ok", this.onPlayerCardsCommandOk.bind(this));
  this._windowPlayerCardsCommand.setHandler("cancel", this.onPlayerCardsCommandCancel.bind(this));
  this.addWindow(this._windowPlayerCardsCommand);

  const playerCardCollectionRect = new Rectangle(Graphics.boxWidth - blockWidth, topOffset, blockWidth, Graphics.boxHeight - topOffset);
  this._windowPlayerCardCollection = new Window_PlayerCardCollection(playerCardCollectionRect);
  this._windowPlayerCardCollection.setHandler("ok", this.onPlayerCardCollectionOk.bind(this));
  this._windowPlayerCardCollection.setHandler("cancel", this.onPlayerCardCollectionCancel.bind(this));
  this.addWindow(this._windowPlayerCardCollection);

  const playerDeckRect = new Rectangle(0, topOffset, blockWidth, Graphics.boxHeight - topOffset);
  this._windowPlayerDeck = new Window_PlayerCardDeck(playerDeckRect);
  this._windowPlayerDeck.setHandler("ok", this.onPlayerDeckOk.bind(this));
  this._windowPlayerDeck.setHandler("cancel", this.onPlayerDeckCancel.bind(this));
  this.addWindow(this._windowPlayerDeck);

  const playerDeckInfoRect = new Rectangle(Graphics.boxWidth / 2 - 100, Graphics.boxHeight / 2, 200, 270);
  this._windowPlayerDeckInfo = new Window_PlayerDeckInfo(playerDeckInfoRect);
  this.addWindow(this._windowPlayerDeckInfo);

  // const playerDeckCardInfoRect = new Rectangle(Graphics.boxWidth / 2 - 250 / 2, Graphics.boxHeight / 2 - 135, 250, 100);
  // this._windowPlayerDeckCardInfo = new Window_PlayerDeckCardInfo(playerDeckCardInfoRect);
  // this.addWindow(this._windowPlayerDeckCardInfo);

  const windowCardActionsRect = new Rectangle(Graphics.boxWidth / 2 - 250 / 2, Graphics.boxHeight / 2 - 175, 250, 100);
  this._windowCardActions = new Window_CardActions(windowCardActionsRect);
  this._windowCardActions.setCustomCommands([
    { name: "Move", symbol: "move" },
    { name: "Description", symbol: "cardDescription" },
    { name: "Cancel", symbol: "cancel" }
  ]);
  this._windowCardActions.refresh();
  this._windowCardActions.setHandler("move", this.processCardActionsMove.bind(this));
  this._windowCardActions.setHandler("cardDescription", this.processCardActionsDescription.bind(this));
  this._windowCardActions.setHandler("cancel", this.processCardActionsCancel.bind(this));
  this._windowCardActions.hide();
  this._windowCardActions.deactivate();
  this.addChild(this._windowCardActions);
};

Scene_PlayerDeck.prototype.onPlayerCardsCommandOk = function () {
  switch (this._windowPlayerCardsCommand.index()) {
    case 0:
      this._windowPlayerDeck.activate();
      break;
    case 1:
      this._windowPlayerCardCollection.activate();
      break;
  }
};

Scene_PlayerDeck.prototype.onPlayerCardsCommandCancel = function () {
  SceneManager.pop();
};

Scene_PlayerDeck.prototype.onPlayerCardCollectionOk = function () {
  const card = this._windowPlayerCardCollection._list[this._windowPlayerCardCollection.index()];

  if (card) {
    this._selectedCard = card;
    this._selectedFrom = this._windowPlayerCardCollection;

    this._windowCardActions.show();
    this._windowCardActions.activate();
  } else {
    this._windowPlayerCardCollection.activate();
  }
};

Scene_PlayerDeck.prototype.onPlayerCardCollectionCancel = function () {
  this._windowPlayerCardCollection.deactivate();
  this._windowPlayerCardsCommand.activate();
};

Scene_PlayerDeck.prototype.onPlayerDeckOk = function () {
  const card = this._windowPlayerDeck._list[this._windowPlayerDeck.index()];

  if (card) {
    this._selectedCard = card;
    this._selectedFrom = this._windowPlayerDeck;

    this._windowCardActions.show();
    this._windowCardActions.activate();
  } else {
    this._windowPlayerDeck.activate();
  }
};

Scene_PlayerDeck.prototype.onPlayerDeckCancel = function () {
  this._windowPlayerDeck.deactivate();
  this._windowPlayerCardsCommand.activate();
};

Scene_PlayerDeck.prototype.createCancelButton = function() {
  this._cancelButton = new Sprite_Button("cancel");
  this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
  this._cancelButton.y = this.buttonY();

  const on_click_cancel_button_alias = this._cancelButton.onClick;
  this._cancelButton.onClick = function () {
    on_click_cancel_button_alias.call(this);
    SoundManager.playCancel();
    SceneManager.pop();
  }
  this.addWindow(this._cancelButton);
};

Scene_PlayerDeck.prototype.processCardActionsMove = function () {
  const card = this._selectedCard;

  if (this._selectedFrom instanceof Window_PlayerCardCollection) {
    if (card.quantity > 1) {
      card.quantity--;
    } else {
      $gamePlayerSlogCollection.splice(this._windowPlayerCardCollection.index(), 1);
    }

    // add card to deck (todo: check if it possible)
    const cardIndex = $gamePlayerSlogDeck.findIndex(c => c.id === card.id);
    if (cardIndex >= 0) {
      $gamePlayerSlogDeck[cardIndex].quantity++;
    } else {
      $gamePlayerSlogDeck.push({
        id: card.id,
        quantity: 1
      });
    }

    this._windowPlayerDeckInfo.refresh();
    this._windowPlayerDeck.refresh();
    this._windowPlayerCardCollection.refresh();
    this._windowPlayerCardCollection.activate();
    this._windowCardActions.hide();
    this._windowCardActions.deactivate();
  } else if (this._selectedFrom instanceof Window_PlayerCardDeck) {
    if (card.quantity > 1) {
      card.quantity--;
    } else {
      $gamePlayerSlogDeck.splice(this._windowPlayerDeck.index(), 1);
    }

    const cardIndex = $gamePlayerSlogCollection.findIndex(c => c.id === card.id);
    if (cardIndex >= 0) {
      $gamePlayerSlogCollection[cardIndex].quantity++;
    } else {
      $gamePlayerSlogCollection.push({
        id: card.id,
        quantity: 1
      });
    }

    this._windowPlayerDeckInfo.refresh();
    this._windowPlayerCardCollection.refresh();
    this._windowPlayerDeck.refresh();
    this._windowPlayerDeck.activate();
    this._windowCardActions.hide();
    this._windowCardActions.deactivate();
  }
};

let __playerDeckSelectedCard = null;
let __playerDeckScene = null;
Scene_PlayerDeck.prototype.processCardActionsDescription = function () {
  __playerDeckSelectedCard = this._selectedCard;
  __playerDeckScene = SceneManager._scene;
  SceneManager.push(Scene_PlayerDeckDescription);
};

Scene_PlayerDeck.prototype.processCardActionsCancel = function () {
  this._windowCardActions.hide();
  this._windowCardActions.deactivate();
  this._selectedFrom.activate();
};

//-----------------------------------------------------------------------------
// Scene_PlayerDeckDescription
//

function Scene_PlayerDeckDescription() {
  this.initialize(...arguments);
}

Scene_PlayerDeckDescription.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PlayerDeckDescription.prototype.constructor = Scene_PlayerDeckDescription;

Scene_PlayerDeckDescription.prototype.initialize = function() {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_PlayerDeckDescription.prototype.create = function() {
  this.createBackground();
  Scene_MenuBase.prototype.create.call(this);

  const windowSlogCardInfoRect = new Rectangle((Graphics.width - 500) / 2, (Graphics.height - 475) / 2, 500, 475);
  this._windowSlogCardInfo = new Window_SlogCardInfo(windowSlogCardInfoRect);
  this._windowSlogCardInfo.setCard(__playerDeckSelectedCard.id);
  this._windowSlogCardInfo.setHandler("cancel", this.processSlogCardInfoCancelAction.bind(this));
  this.addChild(this._windowSlogCardInfo);
};

Scene_PlayerDeckDescription.prototype.createBackground = function () {
  this._backSprite = new Sprite(
      ImageManager.loadSlogBackground("Deck")
  );
  this.addChild(this._backSprite);
};

Scene_PlayerDeckDescription.prototype.processSlogCardInfoCancelAction = function() {
  SceneManager.pop();
  __playerDeckScene._windowCardActions.hide();
  __playerDeckScene._windowCardActions.deactivate();
};

//-----------------------------------------------------------------------------
// Scene_PlayerDeck
//

function Scene_NotReadyDeck() {
  this.initialize(...arguments);
}

Scene_NotReadyDeck.prototype = Object.create(Scene_MenuBase.prototype);
Scene_NotReadyDeck.prototype.constructor = Scene_NotReadyDeck;

Scene_NotReadyDeck.prototype.initialize = function() {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_NotReadyDeck.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);
  this.createBackground();
  this.createColorFilter();
  this.createWindowLayer();
  this.createWindows();
};

Scene_NotReadyDeck.prototype.createWindows = function () {
  const windowNotReadyDeckRectangle = new Rectangle(Graphics.boxWidth / 2 - 200, Graphics.boxHeight / 2 - 110, 400, 220);
  SceneManager._scene._windowNotReadyDeck = new Window_NotReadyDeck(windowNotReadyDeckRectangle);
  SceneManager._scene._windowNotReadyDeck.activate();
  SceneManager._scene._windowNotReadyDeck.setHandler("openDeck", this.onNotReadyDeckOpenDeck.bind(this));
  SceneManager._scene._windowNotReadyDeck.setHandler("cancel", this.onNotReadyDeckCancel.bind(this));
  SceneManager._scene.addWindow(SceneManager._scene._windowNotReadyDeck);
};

Scene_NotReadyDeck.prototype.onNotReadyDeckOpenDeck = async function () {
  SceneManager.pop();
  setTimeout(() => {
    SceneManager.push(Scene_PlayerDeck);
  },50);
};

Scene_NotReadyDeck.prototype.onNotReadyDeckCancel = function () {
  SceneManager.pop();
};

//-----------------------------------------------------------------------------
// Scene_SlogGame
//

function Scene_SlogGame() {
  this.initialize(...arguments);
}

Scene_SlogGame.prototype = Object.create(Scene_Base.prototype);
Scene_SlogGame.prototype.constructor = Scene_SlogGame;

Scene_SlogGame.prototype.initialize = function() {
  Scene_Base.prototype.initialize.call(this);
};

Scene_SlogGame.prototype.create = function () {
  Scene_Base.prototype.create.call(this);
  this.createColorFilter();
  this.createBackground();
  this.createWindowLayer();
  this.createGameSystems();
  this.createWindows();

  this.gameManager.start();
};

Scene_SlogGame.prototype.createBackground = function () {
  this._backSprite = new Sprite(
      ImageManager.loadSlogBackground("Game")
  );
  this.addChild(this._backSprite);
};

Scene_SlogGame.prototype.createWindows = function () {
  const windowSlogGameRect = new Rectangle(0, 0, Graphics.width, Graphics.height);
  this._windowSlogGame = new Window_SlogGame(windowSlogGameRect);
  this.addChild(this._windowSlogGame);

  const windowCardActionsRect = new Rectangle(Graphics.width / 2 - 100, Graphics.height / 2 - 57.5, 200, 115);
  this._windowCardActions = new Window_CardActions(windowCardActionsRect);
  this._windowCardActions.setHandler("playACard", this.processPlayCardAction.bind(this));
  this._windowCardActions.setHandler("cardDescription", this.processCardDescriptionAction.bind(this));
  this._windowCardActions.setHandler("cancel", this.processCardActionsCancel.bind(this));
  this._windowCardActions.hide();
  this._windowCardActions.deactivate();
  this.addChild(this._windowCardActions);

  const windowSlogGameHintRect = new Rectangle((Graphics.width - Graphics.width * 0.6) / 2, 80, Graphics.width * 0.6, 80);
  this._windowSlogGameHint = new Window_SlogGameHint(windowSlogGameHintRect);
  this._windowSlogGameHint.hide();
  this.addChild(this._windowSlogGameHint);

  const windowSlogGamePauseRect = new Rectangle((Graphics.width - 300) / 2, (Graphics.height - 160) / 2, 300, 160);
  this._windowSlogGamePause = new Window_SlogGamePause(windowSlogGamePauseRect);
  this._windowSlogGamePause.setHandler("foldSlog", this.processGamePauseFoldAction.bind(this));
  this._windowSlogGamePause.setHandler("replaySlog", this.processGamePauseReplayAction.bind(this));
  this._windowSlogGamePause.setHandler("quitSlog", this.processGamePauseQuitAction.bind(this));
  this._windowSlogGamePause.setHandler("cancel", this.processGamePauseCancelAction.bind(this));
  this._windowSlogGamePause.hide();
  this._windowSlogGamePause.deactivate();
  this.addChild(this._windowSlogGamePause);

  const windowSlogConfirmPopUpRect = new Rectangle((Graphics.width - 400) / 2, (Graphics.height - 200) / 2, 400, 200);
  this._windowSlogConfirmPopUp = new Window_SlogGameConfirmPopUp(windowSlogConfirmPopUpRect);
  this._windowSlogConfirmPopUp.setHandler("yes", this.processSlogConfirmYesAction.bind(this, this._windowSlogConfirmPopUp));
  this._windowSlogConfirmPopUp.setHandler("cancel", this.processSlogConfirmNoAction.bind(this, this._windowSlogConfirmPopUp));
  this._windowSlogConfirmPopUp.hide();
  this._windowSlogConfirmPopUp.deactivate();
  this.addChild(this._windowSlogConfirmPopUp);

  const windowSlogGameOverRect = new Rectangle((Graphics.width - 400) / 2, (Graphics.height - 200) / 2, 400, 200);
  this._windowSlogGameOver = new Window_SlogGameOver(windowSlogGameOverRect);
  this._windowSlogGameOver.setHandler("replaySlog", this.processSlogGameOverReplayAction.bind(this));
  this._windowSlogGameOver.setHandler("quitSlog", this.processSlogGameOverQuitAction.bind(this));
  this._windowSlogGameOver.hide();
  this._windowSlogGameOver.deactivate();
  this.addChild(this._windowSlogGameOver);

  const windowSlogCardInfoRect = new Rectangle((Graphics.width - 500) / 2, (Graphics.height - 475) / 2, 500, 475);
  this._windowSlogCardInfo = new Window_SlogCardInfo(windowSlogCardInfoRect);
  this._windowSlogCardInfo.setHandler("cancel", this.processSlogCardInfoCancelAction.bind(this));
  this._windowSlogCardInfo.hide();
  this._windowSlogCardInfo.deactivate();
  this.addChild(this._windowSlogCardInfo);

  const windowSlogSelectCardsRect = new Rectangle((Graphics.width - 625) / 2, (Graphics.height - 250) / 2, 625, 250);
  this._windowSlogSelectCards = new Window_SlogSelectCards(windowSlogSelectCardsRect);
  this._windowSlogSelectCards.hide();
  this._windowSlogSelectCards.deactivate();
  this.addChild(this._windowSlogSelectCards);
};

Scene_SlogGame.prototype.createGameSystems = function () {
  this.gameManager = new SlogGame_GameManager();
};

// Process card actions (START)

Scene_SlogGame.prototype.processPlayCardAction = function() {
  const cardActionsWindow = this._windowCardActions;
  cardActionsWindow.deactivate();
  cardActionsWindow.hide();

  const slogWindow = this._windowSlogGame;
  const mainItem = slogWindow.mainItems[slogWindow.mainItemIndex];
  this.gameManager.playerCardInHand = mainItem.getChilds()[slogWindow.subItemIndex];

  if (this.gameManager.getPossibleFieldsForCard(this.gameManager.playerCardInHand, this.gameManager.state).length > 0) {
    slogWindow.saveSelection();
    slogWindow.resetSelection();

    if (this.gameManager.playerCardInHand.isHaveAbility("decoy")) {
      this.gameManager.showHint(1, "Select card for decoy!");
    } else {
      this.gameManager.showHint(1, "Select a field!");
    }

    this.gameManager.updateMainItemsInteractable();
  } else {
    this.gameManager.playerCardInHand = null;
    SoundManager.playCancel();

    this._windowSlogGame.subItemSelected = false;
    this.gameManager.updateMainItemsInteractable();
    this.gameManager.showHint(1, "No place for a card!");
  }
};

Scene_SlogGame.prototype.processCardDescriptionAction = function() {
  const cardActionsWindow = this._windowCardActions;
  cardActionsWindow.deactivate();
  cardActionsWindow.hide();

  const slogWindow = this._windowSlogGame;
  const mainItem = slogWindow.mainItems[slogWindow.mainItemIndex];

  this._windowSlogCardInfo.setCard(mainItem.getChilds()[slogWindow.subItemIndex].id);
  this._windowSlogCardInfo.show();
  this._windowSlogCardInfo.activate();
};

Scene_SlogGame.prototype.processCardActionsCancel = function() {
  const cardActionsWindow = this._windowCardActions;
  cardActionsWindow.deactivate();
  cardActionsWindow.hide();
};

// Process card actions (END)

// Process game pause window actions (START)

Scene_SlogGame.prototype.processGamePauseFoldAction = function() {
  this._windowSlogGamePause.hide();
  this._windowSlogGamePause.deactivate();

  this._windowSlogConfirmPopUp.setMessage("Are you sure you<br> want to pass?");
  this._windowSlogConfirmPopUp.onYesCallback = () => {
    this._windowSlogConfirmPopUp.hide();
    this._windowSlogConfirmPopUp.deactivate();
    this.gameManager.isPause = false;
    this.gameManager.fold(true);
  };
  this._windowSlogConfirmPopUp.onNoCallback = () => {
    this.processGamePauseHideConfirmAndShowPause();
  };
  this._windowSlogConfirmPopUp.show();
  this._windowSlogConfirmPopUp.activate();
};

Scene_SlogGame.prototype.processGamePauseReplayAction = function() {
  this._windowSlogGamePause.hide();
  this._windowSlogGamePause.deactivate();

  this._windowSlogConfirmPopUp.setMessage("Are you sure you<br> want to replay?");
  this._windowSlogConfirmPopUp.onYesCallback = () => {
    this.gameManager.restart();
    this._windowSlogConfirmPopUp.hide();
    this._windowSlogConfirmPopUp.deactivate();
  };
  this._windowSlogConfirmPopUp.onNoCallback = () => {
    this.processGamePauseHideConfirmAndShowPause();
  };
  this._windowSlogConfirmPopUp.show();
  this._windowSlogConfirmPopUp.activate();
};

Scene_SlogGame.prototype.processGamePauseQuitAction = function() {
  this._windowSlogGamePause.hide();
  this._windowSlogGamePause.deactivate();

  this._windowSlogConfirmPopUp.setMessage("Are you sure you want<br> to quit the game?");
  this._windowSlogConfirmPopUp.onYesCallback = () => {
    SceneManager.pop();
  };
  this._windowSlogConfirmPopUp.onNoCallback = () => {
    this.processGamePauseHideConfirmAndShowPause();
  };
  this._windowSlogConfirmPopUp.show();
  this._windowSlogConfirmPopUp.activate();
};

Scene_SlogGame.prototype.processGamePauseHideConfirmAndShowPause = function() {
  this._windowSlogConfirmPopUp.hide();
  this._windowSlogConfirmPopUp.deactivate();
  this._windowSlogGamePause.show();
  this._windowSlogGamePause.activate();
};

Scene_SlogGame.prototype.processGamePauseCancelAction = function() {
  this._windowSlogGamePause.hide();
  this._windowSlogGamePause.deactivate();
  this.gameManager.isPause = false;
};

// Process game pause window actions (END)

// Process slog confirm pop up actions (START)

Scene_SlogGame.prototype.processSlogConfirmYesAction = function(confirmWindow) {
  if (confirmWindow.onYesCallback) {
    confirmWindow.onYesCallback.call();
    confirmWindow.onYesCallback = null;
  }
};

Scene_SlogGame.prototype.processSlogConfirmNoAction = function(confirmWindow) {
  if (confirmWindow.onNoCallback) {
    confirmWindow.onNoCallback.call();
    confirmWindow.onNoCallback = null;
  }
};

// Process slog confirm pop up actions (END)

// Process slog game over actions (START)

Scene_SlogGame.prototype.processSlogGameOverReplayAction = function() {
  this.gameManager.restart();
  this._windowSlogGameOver.hide();
  this._windowSlogGameOver.deactivate();
};

Scene_SlogGame.prototype.processSlogGameOverQuitAction = function() {
  SceneManager.pop();
};

// Process slog game over actions (END)

// Process slog card info actions (START)

Scene_SlogGame.prototype.processSlogCardInfoCancelAction = function() {
  this._windowSlogCardInfo.hide();
  this._windowSlogCardInfo.deactivate();
  this._windowCardActions.show();
  this._windowCardActions.activate();
};

// Process slog card info actions (END)