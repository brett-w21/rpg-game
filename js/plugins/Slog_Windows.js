//-----------------------------------------------------------------------------
// Window_PlayerCardsBase
//
function Window_PlayerCardsBase() {
  this.initialize(...arguments);
};

Window_PlayerCardsBase.prototype = Object.create(Window_Selectable.prototype);
Window_PlayerCardsBase.prototype.constructor = Window_PlayerCardsBase;

Window_PlayerCardsBase.prototype.initialize = function(rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  if (!this._cardViews) {
    this._cardViews = [];
  }
  this._list = [];
  this.select(0);
};

Window_PlayerCardsBase.prototype.maxItems = function() {
  return this._list.length;
};

Window_PlayerCardsBase.prototype.maxCols = function() {
  return 2;
};

Window_PlayerCardsBase.prototype.itemWidth = function() {
  return 115;
};

Window_PlayerCardsBase.prototype.itemHeight = function() {
  return 192;
};

Window_PlayerCardsBase.prototype.clearCardViews = function() {
  if (this._cardViews) {
    for (let cardView of this._cardViews) {
      cardView.destroy();
    }
  }
  this._cardViews = [];
  this._innerChildren = [];
};

Window_PlayerCardsBase.prototype.refresh = function() {
  this.clearCardViews();
  Window_Selectable.prototype.refresh.call(this);
};

Window_PlayerCardsBase.prototype.drawAllItems = function() {
  this.clearCardViews();
  Window_Selectable.prototype.drawAllItems.call(this);
};

Window_PlayerCardsBase.prototype.drawItem = function(index) {
  if (this._list[index]) {
    const rect = this.itemRect(index);
    const card = Slog_DataHelper.getCard(this._list[index].id);
    const quantity = this._list[index].quantity;

    // main card view
    const cardSprite = CardViewFactory.createCard(card, rect.width * 0.95, rect.height * 0.95);
    cardSprite.move(rect.x + rect.width / 2, rect.y + rect.height / 2);

    // quantity label
    const quantitySprite = new Sprite_Quantity();
    if (card.sprite) {
      quantitySprite._width = 40;
      quantitySprite._height = 40;
      quantitySprite._fontSize = 35;
      quantitySprite.x = -140;
      quantitySprite.y = 215;
      quantitySprite._textColor = "rgb(255,255,255)";
    } else {
      quantitySprite._fontSize = 10;
      quantitySprite.x = -47;
      quantitySprite.y = 75;
      quantitySprite._textColor = "rgba(0, 0, 0, 255)";
    }
    quantitySprite._name = "x" + quantity;
    quantitySprite.redraw();
    cardSprite.addChild(quantitySprite);

    this.addInnerChild(cardSprite);
    this._cardViews.push(cardSprite);
  }
};

Window_PlayerCardsBase.prototype.drawBackgroundRect = function (index) {

};

Window_PlayerCardsBase.prototype.getSelectedCard = function () {
  if (this._list[this._index]) {
    return Slog_DataHelper.getCard(this._list[this._index].id);
  }
  return null;
};

//-----------------------------------------------------------------------------
// Window_PlayerCardsCommand
//
function Window_PlayerCardsCommand() {
  this.initialize(...arguments);
};

Window_PlayerCardsCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_PlayerCardsCommand.prototype.construct = Window_PlayerCardsCommand;

Window_PlayerCardsCommand.prototype.initialize = function(rect) {
  Window_HorzCommand.prototype.initialize.call(this, rect);
};

Window_PlayerCardsCommand.prototype.makeCommandList = function () {
  this.addCommand("Deck", "selectDeck");
  this.addCommand("Collection", "selectCollection");
};

Window_PlayerCardsCommand.prototype.maxCols = function() {
  return 2;
};

Window_PlayerCardsCommand.prototype.updatePadding = function() {
  this.padding = 5;
};

Window_PlayerCardsCommand.prototype.fittingHeight = function(numLines) {
  return numLines * this.itemHeight() + this.padding * 2;
};

//-----------------------------------------------------------------------------
// Window_PlayerCardDeck
//
function Window_PlayerCardDeck() {
  this.initialize(...arguments);
};

Window_PlayerCardDeck.prototype = Object.create(Window_PlayerCardsBase.prototype);
Window_PlayerCardDeck.prototype.constructor = Window_PlayerCardDeck;

Window_PlayerCardDeck.prototype.initialize = function(rect) {
  Window_PlayerCardsBase.prototype.initialize.call(this, rect);
  this.refresh();
};

Window_PlayerCardDeck.prototype.refresh = function () {
  this._list = [];
  for (let card of $gamePlayerSlogDeck) {
    this._list.push(card);
  }
  if (this._list.length === 0) {
    this._list = [null];
  }

  Window_PlayerCardsBase.prototype.refresh.call(this);
};

//-----------------------------------------------------------------------------
// Window_PlayerCardCollection
//
function Window_PlayerCardCollection() {
  this.initialize(...arguments);
};

Window_PlayerCardCollection.prototype = Object.create(Window_PlayerCardsBase.prototype);
Window_PlayerCardCollection.prototype.constructor = Window_PlayerCardCollection;

Window_PlayerCardCollection.prototype.initialize = function (rect) {
  Window_PlayerCardsBase.prototype.initialize.call(this, rect);
  this.refresh();
};

Window_PlayerCardCollection.prototype.refresh = function () {
  this._list = [];
  for (let card of $gamePlayerSlogCollection) {
    this._list.push(card);
  }
  if (this._list.length === 0) {
    this._list = [null];
  }

  Window_PlayerCardsBase.prototype.refresh.call(this);
};

//-----------------------------------------------------------------------------
// Window_PlayerDeckCardInfo
//

function Window_PlayerDeckCardInfo() {
  this.initialize(...arguments);
}

Window_PlayerDeckCardInfo.prototype = Object.create(Window_Base.prototype);
Window_PlayerDeckCardInfo.prototype.constructor = Window_PlayerDeckCardInfo;

Window_PlayerDeckCardInfo.prototype.initialize = function(rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this.refresh();
  this._isPointOver = false;
};

Window_PlayerDeckCardInfo.prototype.setCard = function (card) {
  this._card = card;
};

Window_PlayerDeckCardInfo.prototype.refresh = function () {
  this.contents.clear();
  this.contentsBack.clear();

  if (this._card) {
    this.drawNameText();
    this.drawDescriptionButton();
  }
};

Window_PlayerDeckCardInfo.prototype.update = function () {
  this.refresh();
  this.processTouch();
};

Window_PlayerDeckCardInfo.prototype.processTouch = function() {
  if (TouchInput.isHovered()) {
    this.onTouchSelect(false);
  } else if (TouchInput.isTriggered()) {
    this.onTouchSelect(true);
  }

  if (TouchInput.isClicked()) {
    this.onTouchOk();
  }
};

Window_PlayerDeckCardInfo.prototype.onTouchSelect = function(trigger) {
  this._isPointOver = this.hitTest(this.descriptionButtonRect());
};

Window_PlayerDeckCardInfo.prototype.onTouchOk = function() {

};

Window_PlayerDeckCardInfo.prototype.hitTest = function(rect) {
  const touchPos = new Point(TouchInput.x, TouchInput.y);
  const localPos = this.worldTransform.applyInverse(touchPos);
  return localPos.x >= rect.x && localPos.y >= (rect.y) && localPos.x <= rect.x + rect.width && localPos.y <= (rect.y + rect.height * 1.5);
};

Window_PlayerDeckCardInfo.prototype.drawNameText = function () {
  const width = 225;
  const rect = new Rectangle(this.innerWidth / 2 - width / 2, -5, width, 25);
  this.contents.fontSize = 22;
  this.drawText(this._card.title, rect.x, rect.y + 2, rect.width, "center");
};

Window_PlayerDeckCardInfo.prototype.drawDescriptionButton = function () {
  const rect = this.descriptionButtonRect();

  const c1 = this._isPointOver ? ColorManager.itemBackColor1_2() : ColorManager.itemBackColor1();
  const c2 = this._isPointOver ? ColorManager.itemBackColor2_2() : ColorManager.itemBackColor2();
  const x = rect.x;
  const y = rect.y;
  const w = rect.width;
  const h = rect.height;
  this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
  this.contentsBack.strokeRect(x, y, w, h, c1);

  this.contents.fontSize = 20;
  this.resetTextColor();
  this.changePaintOpacity(true);
  this.drawText("Description", rect.x, rect.y + 2, rect.width, "center");
};

Window_PlayerDeckCardInfo.prototype.descriptionButtonRect = function () {
  const width = 250;
  const height = 37.5;
  return new Rectangle(this.innerWidth / 2 - width / 2, 37.5, width, height);
};

// Window_PlayerDeckCardInfo.prototype._refreshBack = function () {
//
// };
//
// Window_PlayerDeckCardInfo.prototype._refreshFrame = function () {
//
// };

ColorManager.itemBackColor1_2 = function() {
  return "rgba(32, 32, 32, 0.7)";
};

ColorManager.itemBackColor2_2 = function() {
  return "rgba(0, 0, 0, 0.7)";
};

//-----------------------------------------------------------------------------
// Window_PlayerDeckInfo
//

function Window_PlayerDeckInfo() {
  this.initialize(...arguments);
}

Window_PlayerDeckInfo.prototype = Object.create(Window_Base.prototype);
Window_PlayerDeckInfo.prototype.constructor = Window_PlayerDeckInfo;

Window_PlayerDeckInfo.prototype.initialize = function(rect, commands) {
  Window_Base.prototype.initialize.call(this, rect);
  this.refresh();
};

Window_PlayerDeckInfo.prototype.refresh = function () {
  this.contents.clear();
  this.drawCardsInDeck();
  this.drawTroopCards();
  this.drawSpecialCards();
  this.drawTroopCardsPower();
};

Window_PlayerDeckInfo.prototype.drawCardsInDeck = function () {
  this.contents.textColor = 'rgba(255, 255, 255, 255)';
  this.contents.fontSize = 18;
  this.drawText("Cards in deck", 0, 0, 175, "center");
  this.contents.fontSize = 28;
  const isCardsEnough = Slog_DataHelper.isThereRequiredMinimumOfCardsInDeck($gamePlayerSlogDeck);
  this.contents.textColor = isCardsEnough ? 'rgba(255, 255, 255, 255)' : 'rgba(255, 0, 0, 255)';
  const text = Slog_DataHelper.countCardsInDeck($gamePlayerSlogDeck) + "/" + Slog_DataHelper.minCardsInDeck();
  this.drawText(text, 0, 30, 175, "center");
};

Window_PlayerDeckInfo.prototype.drawTroopCards = function () {
  this.contents.textColor = 'rgba(255, 255, 255, 255)';
  this.contents.fontSize = 18;
  this.drawText("Troop cards", 0, 60, 175, "center");
  this.contents.fontSize = 28;
  const isCardsEnough = Slog_DataHelper.isThereRequiredMinimumOfTroopCardsInDeck($gamePlayerSlogDeck);
  this.contents.textColor = isCardsEnough ? 'rgba(255, 255, 255, 255)' : 'rgba(255, 0, 0, 255)';
  const text = Slog_DataHelper.countTroopCardsInDeck($gamePlayerSlogDeck) + "/" + Slog_DataHelper.minTroopCardsInDeck();
  this.drawText(text, 0, 90, 175, "center");
};

Window_PlayerDeckInfo.prototype.drawSpecialCards = function () {
  this.contents.textColor = 'rgba(255, 255, 255, 255)';
  this.contents.fontSize = 18;
  this.drawText("Special cards", 0, 120, 175, "center");
  this.contents.fontSize = 28;
  const text = Slog_DataHelper.countSpecialCardsInDeck($gamePlayerSlogDeck);
  this.drawText(text, 0, 150, 175, "center");
};

Window_PlayerDeckInfo.prototype.drawTroopCardsPower = function () {
  this.contents.textColor = 'rgba(255, 255, 255, 255)';
  this.contents.fontSize = 18;
  this.drawText("Troop cards power", 0, 180, 175, "center");
  this.contents.fontSize = 28;
  this.drawText(Slog_DataHelper.countTroopCardsPowerInDeck($gamePlayerSlogDeck), 0, 210, 175, "center");
};

//-----------------------------------------------------------------------------
// Window_PlayerDeckInfo
//

function Window_NotReadyDeck() {
  this.initialize(...arguments);
}

Window_NotReadyDeck.prototype = Object.create(Window_Command.prototype);
Window_NotReadyDeck.prototype.constructor = Window_NotReadyDeck;

Window_NotReadyDeck.prototype.initialize = function(rect) {
  Window_Command.prototype.initialize.call(this, rect);
  this.createTexts();
};

Window_NotReadyDeck.prototype.createTexts = function () {
  this.contents.fontSize -= 6;
  this.drawText("Your deck is not ready to play", 0, 5, 380, "center");
  this.drawText("please open deck screen", 0, 35, 380, "center");
  this.drawText("and fill up your deck.", 0, 65, 380, "center");
};

Window_NotReadyDeck.prototype.makeCommandList = function () {
  this.addCommand("Open Deck", "openDeck");
  this.addCommand("Close", "cancel");
};

const notreadydeck_itemrect_alias = Window_Command.prototype.itemRect;
Window_NotReadyDeck.prototype.itemRect = function(index) {
  let rectangle = notreadydeck_itemrect_alias.call(this, index);
  rectangle.y += 105;
  return rectangle;
};

//-----------------------------------------------------------------------------
// Window_SlogGame
//

function Window_SlogGame() {
  this.initialize(...arguments);
};

Window_SlogGame.prototype = Object.create(Window_Base.prototype);
Window_SlogGame.prototype.construct = Window_SlogGame;

Window_SlogGame.prototype.initialize = function(rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this.margin = 0;
  this.opacity = 0;

  // selection vars
  this.mainItemIndex = 1;
  this.mainItemSelected = false;
  this.subItemIndex = -1;
  this.subItemSelected = false;
  this.savedMainItemIndex = -1;
  this.savedSubItemIndex = -1;

  // animation vars
  this.myCardsAnimationSpeed = 1;
  this.myCardsAnimationVal = 0;
  this.selectionAnimationSpeed = 0.4;
  this.selectionAnimationSide = 1;
  this.selectionAnimationVal = 0;

  this.gameManager = SceneManager._scene.gameManager;
  this.gameManager._windowSlogGame = this;

  this.createMainItems();
  this.createFields();
  this.createProfileInfos();
  this.createDeckCards();
  this.wrapSelectionMainItems(true);
};

Window_SlogGame.prototype.updatePadding = function() {
  this.padding = 0;
};

Window_SlogGame.prototype.createMainItems = function() {
  this.mainItems = [];
  this.mainItems.push(SceneManager._scene.gameManager.myHandCards);
  this.mainItems.push(SceneManager._scene.gameManager.myField2);
  this.mainItems.push(SceneManager._scene.gameManager.myField2Slot);
  this.mainItems.push(SceneManager._scene.gameManager.myField1);
  this.mainItems.push(SceneManager._scene.gameManager.myField1Slot);
  this.mainItems.push(SceneManager._scene.gameManager.opponentField1);
  this.mainItems.push(SceneManager._scene.gameManager.opponentField1Slot);
  this.mainItems.push(SceneManager._scene.gameManager.opponentField2);
  this.mainItems.push(SceneManager._scene.gameManager.opponentField2Slot);
};

Window_SlogGame.prototype.createFields = function() {
  const myCardsMaskImage = ImageManager.loadSlogImage("my_cards_mask_alpha");
  const otherCardsMaskImage = ImageManager.loadSlogImage("my_cards_mask_alpha");
  const field1Image = ImageManager.loadSlogImage("field1");
  const field2Image = ImageManager.loadSlogImage("field2");
  const fieldSlot1Image = ImageManager.loadSlogImage("slot1");
  const fieldSlot2Image = ImageManager.loadSlogImage("slot2");
  const fieldPowerImage = ImageManager.loadSlogImage("field_power");
  const fieldFrostImage = ImageManager.loadSlogImage("field_frost");
  const fieldFogImage = ImageManager.loadSlogImage("field_fog");
  const fieldsFrameImage = ImageManager.loadSlogImage("fields_frame");

  // creating field power sprites

  const myField2PowerSprite = new Sprite_FieldPower(fieldPowerImage);
  myField2PowerSprite.move(this.myFieldSlot2Rect().x - 15, this.myFieldSlot2Rect().y + this.myFieldSlot2Rect().height / 2);
  const myField2PowerTextSprite = new Sprite_Text();
  myField2PowerTextSprite._text = "0";
  myField2PowerTextSprite._fontSize = "23";
  myField2PowerTextSprite._textColor = "rgb(41, 35, 23)";
  myField2PowerTextSprite.y = -2;
  myField2PowerSprite.text = myField2PowerTextSprite;
  myField2PowerSprite.addChild(myField2PowerTextSprite);
  this.addChildToBack(myField2PowerSprite);

  const myField1PowerSprite = new Sprite_FieldPower(fieldPowerImage);
  myField1PowerSprite.move(this.myFieldSlot1Rect().x - 15, this.myFieldSlot1Rect().y + this.myFieldSlot1Rect().height / 2);
  const myField1PowerTextSprite = new Sprite_Text();
  myField1PowerTextSprite._text = "0";
  myField1PowerTextSprite._fontSize = "23";
  myField1PowerTextSprite._textColor = "rgb(41, 35, 23)";
  myField1PowerTextSprite.y = -2;
  myField1PowerSprite.text = myField1PowerTextSprite;
  myField1PowerSprite.addChild(myField1PowerTextSprite);
  this.addChildToBack(myField1PowerSprite);

  const opponentField1PowerSprite = new Sprite_FieldPower(fieldPowerImage);
  opponentField1PowerSprite.move(this.otherFieldSlot1Rect().x - 15, this.otherFieldSlot1Rect().y + this.otherFieldSlot1Rect().height / 2);
  const opponentField1PowerTextSprite = new Sprite_Text();
  opponentField1PowerTextSprite._text = "0";
  opponentField1PowerTextSprite._fontSize = "23";
  opponentField1PowerTextSprite._textColor = "rgb(41, 35, 23)";
  opponentField1PowerTextSprite.y = -2;
  opponentField1PowerSprite.text = opponentField1PowerTextSprite;
  opponentField1PowerSprite.addChild(opponentField1PowerTextSprite);
  this.addChildToBack(opponentField1PowerSprite);

  const opponentField2PowerSprite = new Sprite_FieldPower(fieldPowerImage);
  opponentField2PowerSprite.move(this.otherFieldSlot2Rect().x - 15, this.otherFieldSlot2Rect().y + this.otherFieldSlot2Rect().height / 2);
  const opponentField2PowerTextSprite = new Sprite_Text();
  opponentField2PowerTextSprite._text = "0";
  opponentField2PowerTextSprite._fontSize = "23";
  opponentField2PowerTextSprite._textColor = "rgb(41, 35, 23)";
  opponentField2PowerTextSprite.y = -2;
  opponentField2PowerSprite.text = opponentField2PowerTextSprite;
  opponentField2PowerSprite.addChild(opponentField2PowerTextSprite);
  this.addChildToBack(opponentField2PowerSprite);

  // other ui staff

  const myFieldsFrameSprite = new Sprite(fieldsFrameImage);
  const myFieldsFrameRect = this.myFieldsFrameRect();
  myFieldsFrameSprite.moveWithResize(myFieldsFrameRect.x, myFieldsFrameRect.y, myFieldsFrameRect.width, myFieldsFrameRect.height);
  this.addChildToBack(myFieldsFrameSprite);

  const otherFieldsFrameSprite = new Sprite(fieldsFrameImage);
  const otherFieldsFrameRect = this.otherFieldsFrameRect();
  otherFieldsFrameSprite.moveWithResize(otherFieldsFrameRect.x, otherFieldsFrameRect.y, otherFieldsFrameRect.width, otherFieldsFrameRect.height);
  this.addChildToBack(otherFieldsFrameSprite);

  // creating weather sprites

  const myField1FrostSprite = new Sprite(fieldFrostImage);
  const myField1FrostRect = this.myField1Rect();
  myField1FrostSprite.moveWithResize(myField1FrostRect.x, myField1FrostRect.y, myField1FrostRect.width, myField1FrostRect.height);
  myField1FrostSprite.hide();
  this.addChildToBack(myField1FrostSprite);

  const myField2FogSprite = new Sprite(fieldFogImage);
  const myField2FogRect = this.myField2Rect();
  myField2FogSprite.moveWithResize(myField2FogRect.x, myField2FogRect.y, myField2FogRect.width, myField2FogRect.height);
  myField2FogSprite.hide();
  this.addChildToBack(myField2FogSprite);

  const otherField1FrostSprite = new Sprite(fieldFrostImage);
  const otherField1FrostRect = this.otherField1Rect();
  otherField1FrostSprite.moveWithResize(otherField1FrostRect.x, otherField1FrostRect.y, otherField1FrostRect.width, otherField1FrostRect.height);
  otherField1FrostSprite.hide();
  this.addChildToBack(otherField1FrostSprite);

  const otherField2FogSprite = new Sprite(fieldFogImage);
  const otherField2FogRect = this.otherField2Rect();
  otherField2FogSprite.moveWithResize(otherField2FogRect.x, otherField2FogRect.y, otherField2FogRect.width, otherField2FogRect.height);
  otherField2FogSprite.hide();
  this.addChildToBack(otherField2FogSprite);

  // creating main items

  const myCardsSprite = new Sprite(myCardsMaskImage);
  myCardsSprite.interactable = true;
  const myCardsRectRect = this.myCardsRect();
  myCardsSprite.moveWithResize(myCardsRectRect.x, myCardsRectRect.y, myCardsRectRect.width, myCardsRectRect.height);
  this.addInnerChild(myCardsSprite);

  const myField2Sprite = new Sprite(field2Image);
  myField2Sprite.interactable = true;
  const myField2Rect = this.myField2Rect();
  myField2Sprite.moveWithResize(myField2Rect.x, myField2Rect.y, myField2Rect.width, myField2Rect.height);
  myField2Sprite.powerView = myField2PowerSprite;
  myField2Sprite.weatherView = myField2FogSprite;
  this.addChildToBack(myField2Sprite);

  const myField2SlotSprite = new Sprite(fieldSlot2Image);
  myField2SlotSprite.interactable = true;
  const myField2SlotRect = this.myFieldSlot2Rect();
  myField2SlotSprite.moveWithResize(myField2SlotRect.x, myField2SlotRect.y, myField2SlotRect.width, myField2SlotRect.height);
  this.addChildToBack(myField2SlotSprite);

  const myField1Sprite = new Sprite(field1Image);
  myField1Sprite.interactable = true;
  const myField1Rect = this.myField1Rect();
  myField1Sprite.moveWithResize(myField1Rect.x, myField1Rect.y, myField1Rect.width, myField1Rect.height);
  myField1Sprite.powerView = myField1PowerSprite;
  myField1Sprite.weatherView = myField1FrostSprite;
  this.addChildToBack(myField1Sprite);

  const myField1SlotSprite = new Sprite(fieldSlot1Image);
  myField1SlotSprite.interactable = true;
  const myField1SlotRect = this.myFieldSlot1Rect();
  myField1SlotSprite.moveWithResize(myField1SlotRect.x, myField1SlotRect.y, myField1SlotRect.width, myField1SlotRect.height);
  this.addChildToBack(myField1SlotSprite);

  const otherField1Sprite = new Sprite(field1Image);
  otherField1Sprite.interactable = true;
  const otherField1Rect = this.otherField1Rect();
  otherField1Sprite.moveWithResize(otherField1Rect.x, otherField1Rect.y, otherField1Rect.width, otherField1Rect.height);
  otherField1Sprite.powerView = opponentField1PowerSprite;
  otherField1Sprite.weatherView = otherField1FrostSprite;
  this.addChildToBack(otherField1Sprite);

  const otherField1SlotSprite = new Sprite(fieldSlot1Image);
  otherField1SlotSprite.interactable = true;
  const otherField1SlotRect = this.otherFieldSlot1Rect();
  otherField1SlotSprite.moveWithResize(otherField1SlotRect.x, otherField1SlotRect.y, otherField1SlotRect.width, otherField1SlotRect.height);
  this.addChildToBack(otherField1SlotSprite);

  const otherField2Sprite = new Sprite(field2Image);
  otherField2Sprite.interactable = true;
  const otherField2Rect = this.otherField2Rect();
  otherField2Sprite.moveWithResize(otherField2Rect.x, otherField2Rect.y, otherField2Rect.width, otherField2Rect.height);
  otherField2Sprite.powerView = opponentField2PowerSprite;
  otherField2Sprite.weatherView = otherField2FogSprite;
  this.addChildToBack(otherField2Sprite);

  const otherField2SlotSprite = new Sprite(fieldSlot2Image);
  otherField2SlotSprite.interactable = true;
  const otherField2SlotRect = this.otherFieldSlot2Rect();
  otherField2SlotSprite.moveWithResize(otherField2SlotRect.x, otherField2SlotRect.y, otherField2SlotRect.width, otherField2SlotRect.height);
  this.addChildToBack(otherField2SlotSprite);

  const otherCardsSprite = new Sprite(otherCardsMaskImage);
  otherCardsSprite.interactable = true;
  const otherCardsRectRect = this.otherCardsRect();
  otherCardsSprite.moveWithResize(otherCardsRectRect.x, otherCardsRectRect.y, otherCardsRectRect.width, otherCardsRectRect.height);
  otherCardsSprite.scale.y = -1;
  this.addInnerChild(otherCardsSprite);

  // sync with game manager

  SceneManager._scene.gameManager.myHandCards.view = myCardsSprite;
  SceneManager._scene.gameManager.myField1.view = myField1Sprite;
  SceneManager._scene.gameManager.myField2.view = myField2Sprite;
  SceneManager._scene.gameManager.myField1Slot.view = myField1SlotSprite;
  SceneManager._scene.gameManager.myField2Slot.view = myField2SlotSprite;
  SceneManager._scene.gameManager.opponentHandCards.view = otherCardsSprite;
  SceneManager._scene.gameManager.opponentField1.view = otherField1Sprite;
  SceneManager._scene.gameManager.opponentField2.view = otherField2Sprite;
  SceneManager._scene.gameManager.opponentField1Slot.view = otherField1SlotSprite;
  SceneManager._scene.gameManager.opponentField2Slot.view = otherField2SlotSprite;
};

Window_SlogGame.prototype.createProfileInfos = function() {
  const profileBackImage = ImageManager.loadSlogImage("profile_info");
  const lampOnImage = ImageManager.loadSlogImage("lamp_on");
  const lampOffImage = ImageManager.loadSlogImage("lamp_off");

  // My

  const myProfileBack = new Sprite(profileBackImage);
  myProfileBack.move(21, 345);
  this.myProfileBack = myProfileBack;
  this.addChildToBack(myProfileBack);

  const myLamp1Off = new Sprite(lampOffImage);
  myLamp1Off.move(95, 4);
  myProfileBack.addChild(myLamp1Off);

  const myLamp1On = new Sprite(lampOnImage);
  myLamp1On.move(95, 4);
  myProfileBack.lamp01 = myLamp1On;
  myProfileBack.addChild(myLamp1On);

  const myLamp2Off = new Sprite(lampOffImage);
  myLamp2Off.move(83, 4);
  myProfileBack.addChild(myLamp2Off);

  const myLamp2On = new Sprite(lampOnImage);
  myLamp2On.move(83, 4);
  myProfileBack.lamp02 = myLamp2On;
  myProfileBack.addChild(myLamp2On);

  const myCardsQuantity = new Sprite_Text();
  myCardsQuantity._text = "100";
  myCardsQuantity._fontSize = "13";
  myCardsQuantity._textColor = "rgb(146, 119, 87)";
  myCardsQuantity._align = "left";
  myCardsQuantity.move(73, 26);
  myProfileBack.cardsQuantity = myCardsQuantity;
  myProfileBack.addChild(myCardsQuantity);

  const myNameText = new Sprite_Text();
  myNameText._text = "Player Name";
  myNameText._fontSize = "14";
  myNameText._textColor = "rgb(146, 119, 87)";
  myNameText._align = "center";
  myNameText._width = 100;
  myNameText.anchor.x = 0;
  myNameText.move(10, 49);
  myProfileBack.playerName = myNameText;
  myProfileBack.addChild(myNameText);

  // Opponent

  const opponentProfileBack = new Sprite(profileBackImage);
  opponentProfileBack.move(21, 205);
  this.opponentProfileBack = opponentProfileBack;
  this.addChildToBack(opponentProfileBack);

  const opponentLamp1Off = new Sprite(lampOffImage);
  opponentLamp1Off.move(95, 4);
  opponentProfileBack.addChild(opponentLamp1Off);

  const opponentLamp1On = new Sprite(lampOnImage);
  opponentLamp1On.move(95, 4);
  opponentProfileBack.lamp01 = opponentLamp1On;
  opponentProfileBack.addChild(opponentLamp1On);

  const opponentLamp2Off = new Sprite(lampOffImage);
  opponentLamp2Off.move(83, 4);
  opponentProfileBack.addChild(opponentLamp2Off);

  const opponentLamp2On = new Sprite(lampOnImage);
  opponentLamp2On.move(83, 4);
  opponentProfileBack.lamp02 = opponentLamp2On;
  opponentProfileBack.addChild(opponentLamp2On);

  const opponentCardsQuantity = new Sprite_Text();
  opponentCardsQuantity._text = "100";
  opponentCardsQuantity._fontSize = "13";
  opponentCardsQuantity._textColor = "rgb(146, 119, 87)";
  opponentCardsQuantity._align = "left";
  opponentCardsQuantity.move(75, 26);
  opponentProfileBack.cardsQuantity = opponentCardsQuantity;
  opponentProfileBack.addChild(opponentCardsQuantity);

  const opponentNameText = new Sprite_Text();
  opponentNameText._text = "Opponent Name";
  opponentNameText._fontSize = "14";
  opponentNameText._textColor = "rgb(146, 119, 87)";
  opponentNameText._align = "center";
  opponentNameText._width = 100;
  opponentNameText.anchor.x = 0;
  opponentNameText.move(10, 49);
  opponentProfileBack.playerName = opponentNameText;
  opponentProfileBack.addChild(opponentNameText);
}

Window_SlogGame.prototype.createDeckCards = function() {
  const cardBackImage = ImageManager.loadSlogImage("card_back_small");

  this.myDeckCards = [];
  this.opponentDeckCards = [];

  for (let i = 0; i < 5; i++) {
    const offset = {
      x: 0,
      y: i * 2
    };

    const myCardBackSprite = new Sprite(cardBackImage);
    myCardBackSprite.moveWithResize(75 + offset.x, Graphics.height - 125 - 60 + offset.y);
    this.addChildToBack(myCardBackSprite);
    this.myDeckCards.push(myCardBackSprite);

    const opponentCardBackSprite = new Sprite(cardBackImage);
    opponentCardBackSprite.moveWithResize(75 + offset.x, 60 + offset.y);
    this.addChildToBack(opponentCardBackSprite);
    this.opponentDeckCards.push(opponentCardBackSprite);
  }
};

Window_SlogGame.prototype.wrapSelectionMainItems = function(forward) {
  if (this.countMainInteractableItems() > 0) {
    while (this.mainItemIndex < 0 || this.mainItemIndex >= this.mainItems.length || !this.mainItems[this.mainItemIndex].view.interactable) {
      this.mainItemIndex += forward ? 1 : -1;
      if (this.mainItemIndex < 0) this.mainItemIndex = this.mainItems.length - 1;
      if (this.mainItemIndex >= this.mainItems.length) this.mainItemIndex = 0;
    }
  } else {
    this.mainItemIndex = -1;
  }
};

Window_SlogGame.prototype.countMainInteractableItems = function() {
  let count = 0;
  for (let mainItem of this.mainItems) {
    if (mainItem.view.interactable) {
      count++;
    }
  }
  return count;
};

Window_SlogGame.prototype.updateMainItemsSelection = function() {
  for (let i = 0; i < this.mainItems.length; i++) {
    if (this.mainItemIndex === i && !this.mainItemSelected) {
      const alpha = this.selectionAnimationVal.remap(0, 1, 0, 64);
      this.mainItems[i].view.setBlendColor([0, 0, 0, alpha]);
    } else {
      this.mainItems[i].view.setBlendColor([0, 0, 0, 0]);
    }
  }
};

Window_SlogGame.prototype.updateSubItemsSelection = function() {
  if (this.mainItemIndex === -1) {
    return;
  }

  const mainItem = this.mainItems[this.mainItemIndex];
  const subItems = mainItem.getChildViews();

  for (let i = 0; i < subItems.length; i++) {
    if (this.subItemIndex === i && !this.subItemSelected) {
      const alpha = this.selectionAnimationVal.remap(0, 1, 48, 96);
      subItems[i].setBlendColor([0, 0, 0, alpha]);
    } else {
      subItems[i].setBlendColor([0, 0, 0, 0]);
    }
  }
};

Window_SlogGame.prototype.resetSelection = function() {
  this.mainItemIndex = 1;
  this.mainItemSelected = false;
  this.subItemIndex = -1;
  this.subItemSelected = false;
};

Window_SlogGame.prototype.saveSelection = function() {
  this.savedMainItemIndex = this.mainItemIndex;
  this.savedMainItemSelected = this.mainItemSelected;
  this.savedSubItemIndex = this.subItemIndex;
  this.savedSubItemSelected = this.subItemSelected;
};

Window_SlogGame.prototype.loadSelection = function() {
  this.mainItemIndex = this.savedMainItemIndex;
  this.mainItemSelected = this.savedMainItemSelected;
  this.subItemIndex = this.savedSubItemIndex;
  this.subItemSelected = this.savedSubItemSelected;
};

Window_SlogGame.prototype.updateProfileInfos = function() {
  this.setPlayerProfilesHealth(this.gameManager.playerHealth, this.gameManager.opponentHealth);
  this.setPlayerProfilesName(this.gameManager.playerName, this.gameManager.opponentName);
  this.setPlayerProfilesCardsQuantity(this.gameManager.myHandCards.getChilds().length, this.gameManager.opponentHandCards.getChilds().length);
  this.setPlayerDecksSize(this.gameManager.countDeckSize(this.gameManager.myDeck), this.gameManager.countDeckSize(this.gameManager.opponentDeck));
};

Window_SlogGame.prototype.setPlayerProfilesHealth = function (myHealth, opponentHealth) {
  this.myProfileBack.lamp01.opacity = myHealth >= 2 ? 255 : 0;
  this.myProfileBack.lamp02.opacity = myHealth >= 1 ? 255 : 0;
  this.opponentProfileBack.lamp01.opacity = opponentHealth >= 2 ? 255 : 0;
  this.opponentProfileBack.lamp02.opacity = opponentHealth >= 1 ? 255 : 0;
};

Window_SlogGame.prototype.setPlayerProfilesName = function (myName, opponentName) {
  this.myProfileBack.playerName._text = myName;
  this.opponentProfileBack.playerName._text = opponentName;
};

Window_SlogGame.prototype.setPlayerProfilesCardsQuantity = function (myHandCardsQuantity, opponentHandCardsQuantity) {
  this.myProfileBack.cardsQuantity._text = myHandCardsQuantity;
  this.opponentProfileBack.cardsQuantity._text = opponentHandCardsQuantity;
}

Window_SlogGame.prototype.setPlayerDecksSize = function(myDeckSize, opponentDeckSize) {
  for (let i = 0; i < this.myDeckCards.length; i++) {
    const reverseIndex = this.myDeckCards.length - i;

    if (reverseIndex <= myDeckSize) {
      this.myDeckCards[i].show();
    } else {
      this.myDeckCards[i].hide();
    }
  }

  for (let i = 0; i < this.opponentDeckCards.length; i++) {
    const reverseIndex = this.opponentDeckCards.length - i;

    if (reverseIndex <= opponentDeckSize) {
      this.opponentDeckCards[i].show();
    } else {
      this.opponentDeckCards[i].hide();
    }
  }
};

Window_SlogGame.prototype.updateMyCardsPopUpAnimation = function() {
  if (this.gameManager && this.gameManager.myHandCards) {
    this.myCardsAnimationVal += SceneManager._smoothDeltaTime / 10 * this.myCardsAnimationSpeed * (this.mainItems[this.mainItemIndex] === this.gameManager.myHandCards ? 1 : -1);
    this.myCardsAnimationVal = this.myCardsAnimationVal.clamp(0, 1);
    this.gameManager.myHandCards.view.y = this.myCardsAnimationVal.remap(0, 1, this.myCardsInActiveY(), this.myCardsActiveY());
  }
};

Window_SlogGame.prototype.updateSelectionAnimation = function() {
  this.selectionAnimationVal += SceneManager._smoothDeltaTime / 10 * this.selectionAnimationSpeed * this.selectionAnimationSide;
  this.selectionAnimationVal = this.selectionAnimationVal.clamp(0, 1);
  if (Math.abs(this.selectionAnimationVal) <= 0.01) {
    this.selectionAnimationSide = 1;
  } else if (Math.abs(this.selectionAnimationVal - 1) <= 0.01) {
    this.selectionAnimationSide = -1;
  }
};

Window_SlogGame.prototype.cleanFieldDrawAll = function() {
  this.cleanFieldDraw(this.gameManager.myHandCards);
  this.cleanFieldDraw(this.gameManager.myField1);
  this.cleanFieldDraw(this.gameManager.myField1Slot);
  this.cleanFieldDraw(this.gameManager.myField2);
  this.cleanFieldDraw(this.gameManager.myField2Slot);
  this.cleanFieldDraw(this.gameManager.opponentHandCards);
  this.cleanFieldDraw(this.gameManager.opponentField1);
  this.cleanFieldDraw(this.gameManager.opponentField1Slot);
  this.cleanFieldDraw(this.gameManager.opponentField2);
  this.cleanFieldDraw(this.gameManager.opponentField2Slot);
  this.updateWeatherSprites();
};

Window_SlogGame.prototype.cleanFieldDraw = function(field) {
  for (let fieldChildView of field.view.children) {
    fieldChildView.destroy();
  }
  field.view.removeChildren(0, field.view.children.length);

  const fieldCards = field.getChilds();
  const countCards = fieldCards.length;
  for (let i = 0; i < countCards; i++) {
    const rect = this.cardRect(field.view, i, countCards);
    const cardSprite = CardViewFactory.createCard(fieldCards[i], rect.width, rect.height);
    cardSprite.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
    fieldCards[i].view = cardSprite;
    field.view.addChild(cardSprite);

    if (field === this.gameManager.opponentHandCards) {
      cardSprite.spriteCardBack.show();
    }
  }
  this.updateFieldPower(field);
}

Window_SlogGame.prototype.drawCardInField = function(card, field) {
  const fieldCards = field.getChilds();
  const countCards = fieldCards.length;
  const cardIndex = countCards - 1;

  const rect = this.cardRect(field.view, cardIndex, countCards);
  const cardSprite = CardViewFactory.createCard(fieldCards[cardIndex], rect.width, rect.height);
  fieldCards[cardIndex].view = cardSprite;
  field.view.addChild(cardSprite);

  if (field === this.gameManager.opponentHandCards) {
    cardSprite.spriteCardBack.show();
  }

  this.updateFieldCardsPositions(field);
  this.updateFieldPower(field);
};

Window_SlogGame.prototype.updateAllFieldsPower = function() {
  this.updateFieldPower(this.gameManager.myField1);
  this.updateFieldPower(this.gameManager.myField2);
  this.updateFieldPower(this.gameManager.opponentField1);
  this.updateFieldPower(this.gameManager.opponentField2);
}

Window_SlogGame.prototype.updateAllCardsPower = function() {
  for (let card of this.gameManager.myField1.getChilds()) {
    card.view.drawDynamicFront();
  }
  for (let card of this.gameManager.myField2.getChilds()) {
    card.view.drawDynamicFront();
  }
  for (let card of this.gameManager.opponentField1.getChilds()) {
    card.view.drawDynamicFront();
  }
  for (let card of this.gameManager.opponentField2.getChilds()) {
    card.view.drawDynamicFront();
  }
};

Window_SlogGame.prototype.updateFieldPower = function(field) {
  if (field.view.powerView) {
    field.view.powerView.text._text = field.getPower();
  }
}

Window_SlogGame.prototype.updateFieldCardsPositions = function(field) {
  const fieldCards = field.getChilds();
  const countCards = fieldCards.length;
  for (let i = 0; i < countCards; i++) {
    const rect = this.cardRect(field.view, i, countCards);
    field.view.getChildAt(i).move(rect.x + rect.width / 2, rect.y + rect.height / 2);
  }
}

Window_SlogGame.prototype.updateWeatherSprites = function() {
  this.gameManager.myField1.view.weatherView._hidden = !this.gameManager.isFrostWeatherActive();
  this.gameManager.myField2.view.weatherView._hidden = !this.gameManager.isFogWeatherActive();
  this.gameManager.opponentField1.view.weatherView._hidden = !this.gameManager.isFrostWeatherActive();
  this.gameManager.opponentField2.view.weatherView._hidden = !this.gameManager.isFogWeatherActive();

  this.gameManager.myField1.view.weatherView.updateVisibility();
  this.gameManager.myField2.view.weatherView.updateVisibility();
  this.gameManager.opponentField1.view.weatherView.updateVisibility();
  this.gameManager.opponentField2.view.weatherView.updateVisibility();
};

Window_SlogGame.prototype.moveCardView = function(card, oldField, newField) {
  oldField.view.removeChild(card.view);
  newField.view.addChild(card.view);

  this.updateFieldCardsPositions(oldField);
  this.updateFieldCardsPositions(newField);

  this.updateFieldPower(oldField);
  this.updateFieldPower(newField);
};

Window_SlogGame.prototype.update = function() {
  const selectionCardScreenActive = this.gameManager._windowSlogSelectCards && this.gameManager._windowSlogSelectCards.visible;
  if (!selectionCardScreenActive && !this.gameManager.isPause && this.gameManager.state !== SlogGameState_GameOver) {
    this.processCursorMove();
    this.processHandling();
  }

  Window_Base.prototype.update.call(this);

  this.updateMainItemsSelection();
  this.updateSubItemsSelection();
  this.updateMyCardsPopUpAnimation();
  this.updateSelectionAnimation();

  this.gameManager.update();
};

Window_SlogGame.prototype.processCursorMove = function() {
  if (!this.isOpen() || !this.visible) {
    return;
  }

  if (!this.mainItemSelected) {
    if (this.countMainInteractableItems() > 0) {
      this.processCursorMoveMainItems();
    }
  } else {
    if (!this.subItemSelected) {
      this.processCursorMoveSubItems();
    }
  }
};

Window_SlogGame.prototype.processCursorMoveMainItems = function() {
  const lastIndex = this.mainItemIndex;
  let inputTriggered = false;

  if (Input.isRepeated("down") || Input.isRepeated("right")) {
    this.mainItemIndex--;
    if (this.mainItemIndex < 0) {
      this.mainItemIndex = this.mainItems.length - 1;
    }
    this.wrapSelectionMainItems(false);
    inputTriggered = true;
  }

  if (Input.isRepeated("up") || Input.isRepeated("left")) {
    this.mainItemIndex++;
    if (this.mainItemIndex >= this.mainItems.length) {
      this.mainItemIndex = 0;
    }
    this.wrapSelectionMainItems(true);
    inputTriggered = true;
  }

  if (inputTriggered) {
    if (this.mainItemIndex !== lastIndex) {
      this.playCursorSound();
    } else {
      SoundManager.playCancel();
    }
  }
};

Window_SlogGame.prototype.processCursorMoveSubItems = function() {
  const mainItem = this.mainItems[this.mainItemIndex];
  const subItems = mainItem.getChildViews();
  const lastIndex = this.subItemIndex;
  let inputTriggered = false;

  if (Input.isRepeated("down") || Input.isRepeated("left")) {
    this.subItemIndex--;
    if (this.subItemIndex < 0) {
      this.subItemIndex = subItems.length - 1;
    }
    inputTriggered = true;
  }

  if (Input.isRepeated("up") || Input.isRepeated("right")) {
    this.subItemIndex++;
    if (this.subItemIndex >= subItems.length) {
      this.subItemIndex = 0;
    }
    inputTriggered = true;
  }

  if (inputTriggered) {
    if (this.subItemIndex !== lastIndex) {
      this.playCursorSound();
    } else {
      SoundManager.playCancel();
    }
  }
};

Window_SlogGame.prototype.processHandling = function() {
  if (this.isOpen() && this.visible) {
    if (Input.isRepeated("ok")) {
      return this.processOk();
    }
    if (Input.isRepeated("cancel")) {
      return this.processCancel();
    }
  }
};

Window_SlogGame.prototype.processOk = function() {
  if (this.mainItemIndex === -1) {
    return;
  }

  if (!this.mainItemSelected) {
    const mainItemClickResult = this.gameManager.onMainItemOkClick(this.mainItems[this.mainItemIndex]);
    if (!mainItemClickResult.success) {
      SoundManager.playCancel();
      return;
    }

    if (mainItemClickResult.select) {
      this.mainItemSelected = true;
      this.subItemIndex = 0;
    }
  } else {
    if (!this.subItemSelected) {
      this.subItemSelected = true;
      this.gameManager.onSubItemOkClick(this.mainItems[this.mainItemIndex], this.mainItems[this.mainItemIndex].getChilds()[this.subItemIndex]);
    }
  }

  this.playOkSound();
};

Window_SlogGame.prototype.processCancel = async function() {
  if (this.gameManager.playerCardInHand) {
    this.gameManager.cancelPlayingCard();
  }

  if (this.subItemSelected) {
    SoundManager.playCancel();
    this.subItemSelected = false;
    this.gameManager.onSubItemCancelClick(this.mainItems[this.mainItemIndex]);
    return;
  }

  if (this.mainItemSelected) {
    SoundManager.playCancel();
    this.subItemIndex = -1;
    this.mainItemSelected = false;
    this.updateSubItemsSelection();
    this.gameManager.onMainItemCancelClick();
    return;
  }

  this.gameManager.isPause = true;
  const windowSlogGamePause = SceneManager._scene._windowSlogGamePause;
  windowSlogGamePause.show();
  await timeout(100);
  windowSlogGamePause.activate();
};

// Rect functions

Window_SlogGame.prototype.cardRect = function(field, index, count) {
  const itemWidth = this.cardWidth(field);
  const itemHeight = this.cardHeight(field);

  const colSpacing = this.cardSpacing();
  let freeWidthSpace = field.width - count * itemWidth - (count - 1) * colSpacing;
  if (freeWidthSpace >= 0) {
    const x = index * itemWidth + index * colSpacing + freeWidthSpace / 2;
    return new Rectangle(x, (field.height - itemHeight) / 2, itemWidth, itemHeight);
  } else {
    if (count <= 1) {
      return new Rectangle(0, (field.height - itemHeight) / 2, itemWidth, itemHeight);
    } else {
      freeWidthSpace = field.width - count * itemWidth;
      const dynamicItemSpacing = (freeWidthSpace / (count - 1));
      const x = index * itemWidth + index * dynamicItemSpacing;
      return new Rectangle(x, (field.height - itemHeight) / 2, itemWidth, itemHeight);
    }
  }
};

Window_SlogGame.prototype.cardWidth = function(field) {
  const height = this.cardHeight(field);
  return height / CardViewFactory.aspectRatio;
};

Window_SlogGame.prototype.cardHeight = function(field) {
  return field.height;
};

Window_SlogGame.prototype.cardSpacing = function() {
  return 3;
};

Window_SlogGame.prototype.myCardsRect = function () {
  const width = this.myCardsRectWidth();
  const height = this.myCardsRectHeight();
  return new Rectangle(65 + (Graphics.boxWidth - width) / 2, 1000, width, height);
};

Window_SlogGame.prototype.myField2Rect = function () {
  const width = this.fieldWidth();
  const height = this.fieldHeight();
  const slotWidth = this.fieldSlotWidth();
  const y = 70 + height;
  return new Rectangle(65 + (Graphics.boxWidth - width - slotWidth) / 2 + slotWidth, Graphics.boxHeight - y, width, height);
};

Window_SlogGame.prototype.myFieldSlot2Rect = function () {
  const width = this.fieldSlotWidth();
  const fieldWidth = this.fieldWidth();
  const height = this.fieldSlotHeight();
  const y = 70 + height;
  return new Rectangle(65 + (Graphics.boxWidth - width - fieldWidth) / 2, Graphics.boxHeight - y, width, height);
};

Window_SlogGame.prototype.myField1Rect = function () {
  const width = this.fieldWidth();
  const slotWidth = this.fieldSlotWidth();
  const height = this.fieldHeight();
  const y = this.myField2Rect().y - height  - 5;
  return new Rectangle(65 + (Graphics.boxWidth - width - slotWidth) / 2 + this.fieldSlotWidth(), y, width, height);
};

Window_SlogGame.prototype.myFieldSlot1Rect = function () {
  const width = this.fieldSlotWidth();
  const fieldWidth = this.fieldWidth();
  const height = this.fieldSlotHeight();
  const y = this.myField2Rect().y - height  - 5;
  return new Rectangle(65 + (Graphics.boxWidth - width - fieldWidth) / 2, y, width, height);
};

Window_SlogGame.prototype.otherField1Rect = function () {
  const width = this.fieldWidth();
  const slotWidth = this.fieldSlotWidth();
  const height = this.fieldHeight();
  const y = this.myField1Rect().y - height - 30;
  return new Rectangle(65 + (Graphics.boxWidth - width - slotWidth) / 2 + this.fieldSlotWidth(), y, width, height);
};

Window_SlogGame.prototype.otherFieldSlot1Rect = function () {
  const width = this.fieldSlotWidth();
  const fieldWidth = this.fieldWidth();
  const height = this.fieldSlotHeight();
  const y = this.myField1Rect().y - height - 30;
  return new Rectangle(65 + (Graphics.boxWidth - width - fieldWidth) / 2, y, width, height);
};

Window_SlogGame.prototype.otherField2Rect = function () {
  const width = this.fieldWidth();
  const slotWidth = this.fieldSlotWidth();
  const height = this.fieldHeight();
  const y = this.otherField1Rect().y - height - 5;
  return new Rectangle(65 + (Graphics.boxWidth - width - slotWidth) / 2 + this.fieldSlotWidth(), y, width, height);
};

Window_SlogGame.prototype.otherFieldSlot2Rect = function () {
  const width = this.fieldSlotWidth();
  const fieldWidth = this.fieldWidth();
  const height = this.fieldSlotHeight();
  const y = this.otherField1Rect().y - height - 5;
  return new Rectangle(65 + (Graphics.boxWidth - width - fieldWidth) / 2, y, width, height);
};

Window_SlogGame.prototype.otherCardsRect = function () {
  const width = this.myCardsRectWidth();
  const height = this.myCardsRectHeight();
  return new Rectangle(75 + (Graphics.boxWidth - width) / 2, -(height * 0.7) + height, width, height);
};

Window_SlogGame.prototype.myFieldsFrameRect = function () {
  const width = this.fieldsFrameWidth();
  const height = this.fieldsFrameHeight();
  const x = this.myFieldSlot1Rect().x - 13;
  const y = this.myField1Rect().y - 13;
  return new Rectangle(x, y, width, height);
};

Window_SlogGame.prototype.otherFieldsFrameRect = function () {
  const width = this.fieldsFrameWidth();
  const height = this.fieldsFrameHeight();
  const x = this.otherFieldSlot2Rect().x - 13;
  const y = this.otherField2Rect().y - 13;
  return new Rectangle(x, y, width, height);
};

Window_SlogGame.prototype.myCardsRectWidth = function () {
  return 600;
};

Window_SlogGame.prototype.myCardsRectHeight = function () {
  return 140;
};

Window_SlogGame.prototype.myCardsActiveY = function() {
  return Graphics.boxHeight - this.myCardsRectHeight();
};

Window_SlogGame.prototype.myCardsInActiveY = function () {
  return Graphics.boxHeight - 40;
};

Window_SlogGame.prototype.fieldHeight = function () {
  return 109;
};

Window_SlogGame.prototype.fieldWidth = function () {
  return 481;
};

Window_SlogGame.prototype.fieldSlotHeight = function () {
  return this.fieldHeight();
};

Window_SlogGame.prototype.fieldSlotWidth = function () {
  return 83;
};

Window_SlogGame.prototype.fieldsFrameWidth = function () {
  return this.fieldWidth() + this.fieldSlotWidth();
};

Window_SlogGame.prototype.fieldsFrameHeight = function () {
  return this.fieldHeight() * 2;
};

//-----------------------------------------------------------------------------
// Window_CardActions
//

function Window_CardActions() {
  this.initialize(...arguments);
}

Window_CardActions.prototype = Object.create(Window_Command.prototype);
Window_CardActions.prototype.constructor = Window_CardActions;

Window_CardActions.prototype.initialize = function(rect) {
  Window_Command.prototype.initialize.call(this, rect);
};

Window_CardActions.prototype.setCustomCommands = function (customCommands) {
  this.customCommands = customCommands;
  this.height = this.customCommands ? (25 + this.customCommands.length * 45) : 0;
};

Window_CardActions.prototype.makeCommandList = function () {
  if (this.customCommands) {
    for (let customCommand of this.customCommands) {
      this.addCommand(customCommand.name, customCommand.symbol);
    }
  }
};

Window_CardActions.prototype.refresh = function () {
  Window_Base.prototype.createContents.call(this);
  Window_Command.prototype.refresh.call(this);
};

//-----------------------------------------------------------------------------
// Window_SlogGameHint
//

function Window_SlogGameHint() {
  this.initialize(...arguments);
}

Window_SlogGameHint.prototype = Object.create(Window_Base.prototype);
Window_SlogGameHint.prototype.constructor = Window_CardActions;

Window_SlogGameHint.prototype.initialize = function(rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this.hintIsOpening = false;
  this.hintIsHiding = false;
  this.visibleValue = 0;
  this.openSpeed = 30;
  this.hideSpeed = 50;
  this.backgroundOpacity = 128;
};

Window_SlogGameHint.prototype.setBackgroundOpacity = function (opacity) {
  this.backgroundOpacity = opacity;
};

Window_SlogGameHint.prototype._refreshContentsBack = function () {
  this.contentsBack.clear();
  this.contentsBack.paintOpacity = (this.visibleValue / 255) * this.backgroundOpacity;
  this.contentsBack.fillAll("rgb(0, 0, 0)");
};

Window_SlogGameHint.prototype._refreshContents = function() {
  this.contents.clear();
  this.contentsBack.paintOpacity = this.visibleValue;
  this.contents.drawText(this.message, 0, 10, this._width, 40, "center");
};

Window_SlogGameHint.prototype._refresh = function() {
  this._refreshContentsBack();
  this._refreshContents();
};

Window_SlogGameHint.prototype.nativeShow = function() {
  Window_Base.prototype.show.call(this);
};

Window_SlogGameHint.prototype.nativeHide = function() {
  Window_Base.prototype.hide.call(this);
};

Window_SlogGameHint.prototype.show = function(visibleDuration, message) {
  this.hintIsOpening = true;
  this.hintIsHiding = false;
  this.visibleDuration = visibleDuration;
  this.visibleDurationTimedown = 0;
  this.message = message;

  if (!this.visible) {
    this.nativeShow();
  }
};

Window_SlogGameHint.prototype.hide = function() {
  this.hintIsOpening = false;
  this.hintIsHiding = true;
};

Window_SlogGameHint.prototype.showAndWait = async function(message) {
  this.show(message);
  while (this.visibleValue < 255) {
    await timeout(20);
  }
};

Window_SlogGameHint.prototype.hideAndWait = async function() {
  this.hide();
  while (this.visibleValue > 0) {
    await timeout(20);
  }
};

Window_SlogGameHint.prototype.update = function () {
  if (this.hintIsOpening) {
    this.visibleValue = (this.visibleValue + this.openSpeed).clamp(0, 255);
    if (this.visibleValue === 255) {
      this.hintIsOpening = 0;
    }
  }
  if (this.hintIsHiding) {
    this.visibleValue = (this.visibleValue - this.hideSpeed).clamp(0, 255);
    if (this.visibleValue === 0) {
      this.hintIsHiding = 0;
      this.nativeHide();
    }
  }

  if (this.visibleDuration >= 0 && !this.hintIsHiding) {
    if (this.visibleDurationTimedown >= this.visibleDuration) {
      this.hide();
    }
    this.visibleDurationTimedown += SceneManager._smoothDeltaTime * 0.01;
  }

  this._refresh();
};

Window_SlogGameHint.prototype._refreshBack = function () {

};

Window_SlogGameHint.prototype._refreshFrame = function () {

};

//-----------------------------------------------------------------------------
// Window_SlogGamePause
//

function Window_SlogGamePause() {
  this.initialize(...arguments);
}

Window_SlogGamePause.prototype = Object.create(Window_Command.prototype);
Window_SlogGamePause.prototype.constructor = Window_SlogGamePause;

Window_SlogGamePause.prototype.initialize = function(rect) {
  Window_Command.prototype.initialize.call(this, rect);
};

Window_SlogGamePause.prototype.makeCommandList = function () {
  this.addCommand("Fold", "foldSlog");
  this.addCommand("Replay", "replaySlog");
  this.addCommand("Quit", "quitSlog");
};

//-----------------------------------------------------------------------------
// Window_SlogGameConfirmPopUp
//

function Window_SlogGameConfirmPopUp() {
  this.initialize(...arguments);
}

Window_SlogGameConfirmPopUp.prototype = Object.create(Window_Command.prototype);
Window_SlogGameConfirmPopUp.prototype.constructor = Window_SlogGameConfirmPopUp;

Window_SlogGameConfirmPopUp.prototype.initialize = function(rect) {
  Window_Command.prototype.initialize.call(this, rect);
};

Window_SlogGameConfirmPopUp.prototype.setMessage = function (message) {
  this._message = message;
  this.contents.clear();
  this.refresh();

  const messageParts = this._message.split("<br>");
  for (let i = 0; i < messageParts.length; i++) {
    const y = 5 + i * 30;
    this.drawText(messageParts[i], 0, y, 380, "center");
  }
};

Window_SlogGameConfirmPopUp.prototype.makeCommandList = function () {
  this.addCommand("Yes", "yes");
  this.addCommand("No", "cancel");
};

const sloggameconfirmpopup_itemrect_alias = Window_Command.prototype.itemRect;
Window_SlogGameConfirmPopUp.prototype.itemRect = function(index) {
  let rectangle = sloggameconfirmpopup_itemrect_alias.call(this, index);
  rectangle.y += 85;
  return rectangle;
};

function Window_SlogGameOver() {
  this.initialize(...arguments);
}

Window_SlogGameOver.prototype = Object.create(Window_Command.prototype);
Window_SlogGameOver.prototype.constructor = Window_SlogGameOver;

Window_SlogGameOver.prototype.initialize = function(rect) {
  Window_Command.prototype.initialize.call(this, rect);
};

Window_SlogGameOver.prototype.setMessage = function (message) {
  this._message = message;
  this.contents.clear();
  this.contents.fontSize = 20;
  this.refresh();
  this.contents.fontSize = 42;

  const messageParts = this._message.split("<br>");
  for (let i = 0; i < messageParts.length; i++) {
    const y = 15 + i * 30;
    this.drawText(messageParts[i], 0, y, 380, "center");
  }
};

Window_SlogGameOver.prototype.makeCommandList = function () {
  this.addCommand("Replay", "replaySlog");
  this.addCommand("Quit", "quitSlog");
};

const sloggameover_itemrect_alias = Window_Command.prototype.itemRect;
Window_SlogGameOver.prototype.itemRect = function(index) {
  let rectangle = sloggameover_itemrect_alias.call(this, index);
  rectangle.y += 85;
  return rectangle;
};

function Window_SlogCardInfo() {
  this.initialize(...arguments);
}

Window_SlogCardInfo.prototype = Object.create(Window_Command.prototype);
Window_SlogCardInfo.prototype.constructor = Window_SlogCardInfo;

Window_SlogCardInfo.prototype.initialize = function(rect) {
  Window_Command.prototype.initialize.call(this, rect);
};

Window_SlogCardInfo.prototype.setCard = function (cardId) {
  this._cardId = cardId;
  const card = Slog_DataHelper.getCard(cardId);
  const cardTitle = card.title;
  const cardDesc = card.desc;
  const cardAbility = card.abilities.find(x => x !== "agile");

  this.contents.clear();
  this.contents.fontSize = 20;
  this.refresh();

  // card title
/*  this.contents.paintOpacity = 125;
  this.contents.fillRect(0, 5, this.contents.width, 40, 'rgb(0,0,0)');
  this.contents.paintOpacity = 255;*/
  this.contents.fontSize = 28;
  this.drawTextSmart(cardTitle, 5);

  // card preview
  if (this._cardView) {
    this.removeChild(this._cardView);
    this._cardView.destroy();
  }
  const cardWidth = 145;
  const cardHeight = 243;
  this._cardView = CardViewFactory.createCard(card, cardWidth, cardHeight);
  if (card.sprite) {
    this._cardView.move(this.width / 2, this.height / 2 - 50);
    this.addChild(this._cardView);
  } else {
    this.contents.blt(this._cardView.bitmap, 0, 0, cardWidth, cardHeight, (this.contents.width - cardWidth) / 2, 50, cardWidth, cardHeight);
    this.contents.blt(this._cardView.dynamicFront.bitmap, 0, 0, cardWidth, cardHeight, (this.contents.width - cardWidth) / 2, 50, cardWidth, cardHeight);
  }

  // block
/*  this.contents.paintOpacity = 125;
  this.contents.fillRect(0, 300, this.contents.width, 90, 'rgb(0,0,0)');
  this.contents.paintOpacity = 255;*/

  // card description
  this.contents.fontSize = 20;
  let textY = this.drawTextSmart(cardDesc, 300, 30);

  // card ability info
  if (cardAbility) {
    this.contents.fontSize = 18;
    this.drawTextSmart(Slog_DataHelper.getAbility(cardAbility).desc, textY, 25);
  }
};

Window_SlogCardInfo.prototype.drawTextSmart = function (text, startY, lineHeight = 33) {
  const textLines = text.split("<br>");
  let y = startY;
  for (let i = 0; i < textLines.length; i++) {
    y = startY + i * lineHeight;
    this.drawText(textLines[i], 0, y, this.contents.width, "center");
  }
  return y + lineHeight;
};

Window_SlogCardInfo.prototype.makeCommandList = function () {
  this.addCommand("Close", "cancel");
};

Window_SlogCardInfo.prototype.itemRect = function(index) {
  let rectangle = Window_Command.prototype.itemRect.call(this, index);
  rectangle.x = (this.contents.width - 300) / 2;
  rectangle.y = 405;
  rectangle.width = 300;
  rectangle.height = 40;
  return rectangle;
};

/*Window_SlogCardInfo.prototype.update = function () {
  Window_Command.prototype.update.call(this);
  this._refresh();
};

Window_SlogCardInfo.prototype._refreshContentsBack = function () {
  this.contentsBack.clear();
  this.contentsBack.paintOpacity = 150;
  this.contentsBack.fillAll("rgb(0, 0, 0)");
};

Window_SlogCardInfo.prototype._refresh = function() {
  this._refreshContentsBack();
};

Window_SlogCardInfo.prototype._refreshBack = function () {

};

Window_SlogCardInfo.prototype._refreshFrame = function () {

};*/

function Window_SlogSelectCards() {
  this.initialize(...arguments);
}

Window_SlogSelectCards.prototype = Object.create(Window_Base.prototype);
Window_SlogSelectCards.prototype.constructor = Window_SlogSelectCards;

Window_SlogSelectCards.prototype.initialize = function(rect) {
  this.gameManager = SceneManager._scene.gameManager;
  this.gameManager._windowSlogSelectCards = this;

  // selection vars
  this.itemIndex = 0;

  // animation vars
  this.selectionAnimationSpeed = 0.4;
  this.selectionAnimationSide = 1;
  this.selectionAnimationVal = 0;

  Window_Base.prototype.initialize.call(this, rect);
  this._refresh();
};

Window_SlogSelectCards.prototype.setSelectAction = function(action) {
  this._action = action;
};

Window_SlogSelectCards.prototype.setCancelAction = function(action) {
  this._cancelAction = action;
};

Window_SlogSelectCards.prototype.setTitle = function(title) {
  this._title = title;
}

Window_SlogSelectCards.prototype.setCards = function(cards) {
  this._cards = cards;
};

Window_SlogSelectCards.prototype._refreshContentsBack = function () {
  this.contentsBack.clear();
  this.contentsBack.paintOpacity = 145;
  this.contentsBack.fillAll("rgb(0, 0, 0)");
};

Window_SlogSelectCards.prototype._refreshContents = function() {
  this.contents.clear();
  this.contentsBack.paintOpacity = 255;
  this.contents.drawText(this._title, 0, 10, this._width, 40, "center");

  if (this._cards) {
    if (this._cardViews) {
      for (let cardView of this._cardViews) {
        cardView.destroy();
        this.removeChild(cardView);
      }
    }

    this._cardViews = [];

    for (let i = 0; i < this._cards.length; i++) {
      let rect = this.cardRect(i, this._cards.length);
      rect.y += 17.5;

      const cardSprite = CardViewFactory.createCard(this._cards[i], rect.width, rect.height);
      cardSprite.move(rect.x + rect.width / 2, rect.y + rect.height / 2);

      this.addChild(cardSprite);
      this._cardViews.push(cardSprite);
    }
  }
};

Window_SlogSelectCards.prototype._refresh = function() {
  this._refreshContentsBack();
  this._refreshContents();
};

Window_SlogSelectCards.prototype._refreshBack = function () {

};

Window_SlogSelectCards.prototype._refreshFrame = function () {

};

Window_SlogSelectCards.prototype.updateSelectionAnimation = function() {
  this.selectionAnimationVal += SceneManager._smoothDeltaTime / 10 * this.selectionAnimationSpeed * this.selectionAnimationSide;
  this.selectionAnimationVal = this.selectionAnimationVal.clamp(0, 1);
  if (Math.abs(this.selectionAnimationVal) <= 0.01) {
    this.selectionAnimationSide = 1;
  } else if (Math.abs(this.selectionAnimationVal - 1) <= 0.01) {
    this.selectionAnimationSide = -1;
  }
};

Window_SlogSelectCards.prototype.updateItemsSelection = function() {
  if (this._cardViews) {
    for (let i = 0; i < this._cardViews.length; i++) {
      if (this.itemIndex === i) {
        const alpha = this.selectionAnimationVal.remap(0, 1, 0, 64);
        this._cardViews[i].setBlendColor([0, 0, 0, alpha]);
      } else {
        this._cardViews[i].setBlendColor([0, 0, 0, 0]);
      }
    }
  }
};

Window_SlogSelectCards.prototype.show = function() {
  Window_Base.prototype.show.call(this);
  this._refresh();
};

Window_SlogSelectCards.prototype.waitForInvisible = async function() {
  while (this.visible) {
    await timeout(100);
  }
  await timeout(1000);
};

Window_SlogSelectCards.prototype.activate = function() {
  this._active = true;
};

Window_SlogSelectCards.prototype.deactivate = function() {
  this._active = false;
};

Window_SlogSelectCards.prototype.update = function() {
  if (this._active && !this.gameManager.isPause && this.gameManager.state !== SlogGameState_GameOver) {
    this.processCursorMove();
    this.processHandling();
  }

  Window_Base.prototype.update.call(this);

  this.updateItemsSelection();
  this.updateSelectionAnimation();
};

Window_SlogSelectCards.prototype.processCursorMove = function() {
  if (!this.isOpen() || !this.visible) {
    return;
  }

  if (this._cardViews && this._cardViews.length > 0) {
    this.processCursorItems();
  }
};

Window_SlogSelectCards.prototype.processCursorItems = function() {
  const lastIndex = this.itemIndex;
  let inputTriggered = false;

  if (Input.isRepeated("right")) {
    this.itemIndex++;
    if (this.itemIndex >= this._cardViews.length) {
      this.itemIndex = 0;
    }
    this.wrapSelectionItems(true);
    inputTriggered = true;
  }

  if (Input.isRepeated("left")) {
    this.itemIndex--;
    if (this.itemIndex < 0) {
      this.itemIndex = this._cardViews.length - 1;
    }
    this.wrapSelectionItems(false);
    inputTriggered = true;
  }

  if (inputTriggered) {
    if (this.itemIndex !== lastIndex) {
      this.playCursorSound();
    } else {
      SoundManager.playCancel();
    }
  }
};

Window_SlogSelectCards.prototype.wrapSelectionItems = function(forward) {
  if (this._cardViews && this._cardViews.length > 0) {
    while (this.itemIndex < 0 || this.itemIndex >= this._cardViews.length) {
      this.itemIndex += forward ? 1 : -1;
      if (this.itemIndex < 0) this.itemIndex = this._cardViews.length - 1;
      if (this.itemIndex >= this._cardViews.length) this.itemIndex = 0;
    }
  } else {
    this.itemIndex = -1;
  }
};

Window_SlogSelectCards.prototype.processHandling = function() {
  if (this.isOpen() && this.visible) {
    if (Input.isRepeated("ok")) {
      return this.processOk();
    }
    if (Input.isRepeated("cancel")) {
      return this.processCancel();
    }
  }
};

Window_SlogSelectCards.prototype.processOk = async function() {
  if (this.itemIndex === -1) {
    return;
  }

  this.playOkSound();
  this.hide();

  if (this._action) {
    await this._action(this._cards[this.itemIndex]);
  }
};

Window_SlogSelectCards.prototype.processCancel = async function() {
  this.hide();

  if (this._cancelAction) {
    await this._cancelAction();
  }
};

Window_SlogSelectCards.prototype.cardRect = function(index, count) {
  const itemWidth = this.cardWidth();
  const itemHeight = this.cardHeight();
  const colSpacing = this.cardSpacing();

  let freeWidthSpace = this._width - count * itemWidth - (count - 1) * colSpacing;
  if (freeWidthSpace >= 0) {
    const x = index * itemWidth + index * colSpacing + freeWidthSpace / 2;
    return new Rectangle(x, (this._height - itemHeight) / 2, itemWidth, itemHeight);
  } else {
    if (count <= 1) {
      return new Rectangle(0, (this._height - itemHeight) / 2, itemWidth, itemHeight);
    } else {
      freeWidthSpace = this._width - count * itemWidth;
      const dynamicItemSpacing = (freeWidthSpace / (count - 1));
      const x = index * itemWidth + index * dynamicItemSpacing;
      return new Rectangle(x, (this._height - itemHeight) / 2, itemWidth, itemHeight);
    }
  }
};

Window_SlogSelectCards.prototype.cardWidth = function() {
  const height = this.cardHeight();
  return height / CardViewFactory.aspectRatio;
};

Window_SlogSelectCards.prototype.cardHeight = function() {
  return 150;
};

Window_SlogSelectCards.prototype.cardSpacing = function() {
  return 6;
};