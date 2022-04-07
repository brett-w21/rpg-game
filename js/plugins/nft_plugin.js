(() => {
  let initialized = false;
  initializeVeilOfTimeNft("ws://143.198.116.85:9944", "http://143.198.116.85:3000", 2).then(() => {
    initialized = true;
  });

  async function waitForInit() {
    while (!initialized) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  let _ksmInfo = {
    address: "",
    mnemonic: "",
  };
  StorageManager.loadObject("ksmInfo").then(ksmInfo => {
    _ksmInfo = ksmInfo;
  }).catch(() => {
    _ksmInfo = {
      address: "",
      mnemonic: ""
    };
  });

  // Scenes

  //-----------------------------------------------------------------------------
  // Scene_SelectKSMAddress
  //
  // The scene class of selecting new ksm address or import.

  function Scene_SelectKSMAddress() {
    this.initialize(...arguments);
  }

  Scene_SelectKSMAddress.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_SelectKSMAddress.prototype.constructor = Scene_SelectKSMAddress;

  Scene_SelectKSMAddress.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_SelectKSMAddress.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createWindow();
  };

  Scene_SelectKSMAddress.prototype.createWindow = function() {
    const width = 300;
    const height = 115;
    const rect = new Rectangle(Graphics.boxWidth / 2 - width / 2, Graphics.boxHeight - height - 125, width, height);
    this._selectNFTAddress = new Window_SelectNFTAddress(rect);
    this._selectNFTAddress.setHandler("new_ksm_address", this.commandNewKSMAddress.bind(this));
    this._selectNFTAddress.setHandler("import_ksm_address", this.commandImportKSMAddress.bind(this));
    this._selectNFTAddress.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._selectNFTAddress);
  };

  Scene_SelectKSMAddress.prototype.commandNewKSMAddress = async function () {
    const response = await getNewAddress();

    if (response.address && response.mnemonic) {
      _ksmInfo.address = response.address;
      _ksmInfo.mnemonic = response.mnemonic;
    } else {
      _ksmInfo.address = "";
      _ksmInfo.mnemonic = "";
    }

    StorageManager.saveObject("ksmInfo", _ksmInfo);
    console.log("New game, ksm address: " + _ksmInfo.address + ", ksm mnemonic: " + _ksmInfo.mnemonic);

    // new game
    DataManager.setupNewGame();
    this._selectNFTAddress.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
  };

  Scene_SelectKSMAddress.prototype.commandImportKSMAddress = function () {
    SceneManager.push(Scene_NFTPhrase);
  };

  //-----------------------------------------------------------------------------
  // Scene_NFTPhrase
  //
  // The scene class of the ksm phrase input screen.

  function Scene_NFTPhrase() {
    this.initialize(...arguments);
  }

  Scene_NFTPhrase.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_NFTPhrase.prototype.constructor = Scene_NFTPhrase;

  Scene_NFTPhrase.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this._maxLength = 128;
  };

  Scene_NFTPhrase.prototype.prepare = function(maxLength) {
    this._maxLength = maxLength;
  };

  Scene_NFTPhrase.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createEditWindow();
    this.createInputWindow();
  };

  Scene_NFTPhrase.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._editWindow.refresh();
  };

  Scene_NFTPhrase.prototype.createEditWindow = function() {
    const rect = this.editWindowRect();
    this._editWindow = new Window_PhraseEdit(rect);
    this._editWindow.setup(this._maxLength);
    this.addWindow(this._editWindow);
  };

  Scene_NFTPhrase.prototype.editWindowRect = function() {
    const inputWindowHeight = this.calcWindowHeight(9, true);
    const padding = $gameSystem.windowPadding();
    const ww = 600;
    const wh = ImageManager.faceHeight + padding * 2;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_NFTPhrase.prototype.createInputWindow = function() {
    const rect = this.inputWindowRect();
    this._inputWindow = new Window_NameInput(rect);
    this._inputWindow.isKSMInput = true;
    this._inputWindow.setEditWindow(this._editWindow);
    this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
    this.addWindow(this._inputWindow);
  };

  Scene_NFTPhrase.prototype.inputWindowRect = function() {
    const wx = this._editWindow.x;
    const wy = this._editWindow.y + this._editWindow.height + 8;
    const ww = this._editWindow.width;
    const wh = this.calcWindowHeight(9, true);
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_NFTPhrase.prototype.onInputOk = async function() {
    const response = await getNewAddressFromMnemonic(this._editWindow.phrase());

    if (response.address) {
      _ksmInfo.address = response.address;
      _ksmInfo.mnemonic = this._editWindow.phrase();
    } else {
      _ksmInfo.address = "";
      _ksmInfo.mnemonic = "";
    }

    StorageManager.saveObject("ksmInfo", _ksmInfo);
    console.log("New game, ksm address: " + _ksmInfo.address + ", ksm mnemonic: " + _ksmInfo.mnemonic);

    // new game
    DataManager.setupNewGame();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
  };

  // Windows

  //-----------------------------------------------------------------------------
  // Window_PhraseEdit
  //

  function Window_PhraseEdit() {
    this.initialize(...arguments);
  }

  Window_PhraseEdit.prototype = Object.create(Window_StatusBase.prototype);
  Window_PhraseEdit.prototype.constructor = Window_PhraseEdit;

  Window_PhraseEdit.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._maxLength = 0;
    this._phrase = "";
    this._index = 0;
    this.deactivate();
  };

  Window_PhraseEdit.prototype.setup = function(maxLength) {
    this._maxLength = maxLength;
    this._phrase = "";
    //this._phrase = "stone fault top bubble human exit cigar twist slot drift erosion endorse";
    this._index = 0;
  };

  Window_PhraseEdit.prototype.phrase = function() {
    return this._phrase;
  };

  Window_PhraseEdit.prototype.add = function(ch) {
    if (this._index < this._maxLength) {
      this._phrase += ch;
      this._index++;
      this.refresh();
      return true;
    } else {
      return false;
    }
  };

  Window_PhraseEdit.prototype.back = function() {
    if (this._index > 0) {
      this._index--;
      this._phrase = this._phrase.slice(0, this._index);
      this.refresh();
      return true;
    } else {
      return false;
    }
  };

  Window_PhraseEdit.prototype.charWidth = function() {
    return this.textWidth("A");
  };

  Window_PhraseEdit.prototype.countLines = function() {
    const fullWidth = (this._maxLength + 1) * this.charWidth();
    return Math.ceil(fullWidth/ this.innerWidth);
  };

  Window_PhraseEdit.prototype.leftOffset = function() {
    const fullWidth = (this._maxLength + 1) * this.charWidth();
    const countLines = this.countLines();
    const lineWidth = fullWidth / countLines;
    return this.innerWidth / 2 - lineWidth / 2;
  };

  Window_PhraseEdit.prototype.topOffset = function() {
    const countLines = this.countLines();
    const height = this.lineHeight();
    return this.innerHeight / 2 - (countLines * height) / 2;
  };

  Window_PhraseEdit.prototype.charPos = function(index) {
    const fullWidth = (this._maxLength + 1) * this.charWidth();
    const countLines = this.countLines();
    const lineWidth = fullWidth / countLines;

    const fullXPos = index * this.charWidth();
    const linePos = Math.floor(fullXPos / lineWidth);
    const xPos = fullXPos - linePos * lineWidth;

    return {
      x: this.leftOffset(index) + xPos,
      y: this.topOffset() + linePos * this.lineHeight()
    };
  };

  Window_PhraseEdit.prototype.itemRect = function(index) {
    const charPos = this.charPos(index);
    const x = charPos.x;
    const y = charPos.y;
    const width = this.charWidth();
    const height = this.lineHeight();
    return new Rectangle(x, y, width, height);
  };

  Window_PhraseEdit.prototype.underlineRect = function(index) {
    const rect = this.itemRect(index);
    rect.x++;
    rect.y += rect.height - 4;
    rect.width -= 2;
    rect.height = 2;
    return rect;
  };

  Window_PhraseEdit.prototype.underlineColor = function() {
    return ColorManager.normalColor();
  };

  Window_PhraseEdit.prototype.drawUnderline = function(index) {
    const rect = this.underlineRect(index);
    const color = this.underlineColor();
    this.contents.paintOpacity = 48;
    this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this.contents.paintOpacity = 255;
  };

  Window_PhraseEdit.prototype.drawChar = function(index) {
    const rect = this.itemRect(index);
    this.resetTextColor();
    this.drawText(this._phrase[index] || "", rect.x, rect.y);
  };

  Window_PhraseEdit.prototype.refresh = function() {
    this.contents.clear();
    for (let i = 0; i < this._maxLength; i++) {
      this.drawUnderline(i);
    }
    for (let j = 0; j < this._phrase.length; j++) {
      this.drawChar(j);
    }
    const rect = this.itemRect(this._index);
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
  };

  //-----------------------------------------------------------------------------
  // Window_SelectNFTAddress
  //

  function Window_SelectNFTAddress() {
    this.initialize(...arguments);
  }

  Window_SelectNFTAddress.prototype = Object.create(Window_Command.prototype);
  Window_SelectNFTAddress.prototype.constructor = Window_SelectNFTAddress;

  Window_SelectNFTAddress.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
  };

  Window_SelectNFTAddress.prototype.makeCommandList = function () {
    this.addCommand("New KSM Address", "new_ksm_address", true);
    this.addCommand("Import KSM Address", "import_ksm_address", true);
  };

  //-----------------------------------------------------------------------------
  // Window_KSMInfo
  //

  function Window_KSMInfo() {
    this.initialize(...arguments);
  }

  Window_KSMInfo.prototype = Object.create(Window_Base.prototype);
  Window_KSMInfo.prototype.constructor = Window_SelectNFTAddress;

  Window_KSMInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._updateKSMTD = 0;
  };

  Window_KSMInfo.prototype.update = function () {
    Window_Base.prototype.update.call(this);

    if (this.visible) {
      this._updateKSMTD -= SceneManager._smoothDeltaTime / 100;
      if (this._updateKSMTD <= 0) {
        this._updateKSMTD = 20;
        this.refresh();
      }
    }
  };

  Window_KSMInfo.prototype.refresh = async function() {
    this.contents.fontSize = 16;
    if (_ksmInfo.address) {
      const balance = await getMyBalance(_ksmInfo.address);
      console.log(balance);
      this.drawText("Address: " + _ksmInfo.address, 0, -10, this.width, "left");
      this.drawText("Balance: " + balance.balance, 0, 10, this.width, "left");
    } else {
      this.drawText("Address: none", 0, -10, this.width, "left");
      this.drawText("Balance: 0", 0, 10, this.width, "left");
    }
  };

  // RMMZ Overrides

  // Window_NameInput

  Window_NameInput.prototype.onNameOk = function() {
    if (this.isKSMInput) {
      this.playOkSound();
      this.callOkHandler();
      return;
    }

    if (this._editWindow.name() === "") {
      if (this._editWindow.restoreDefault()) {
        this.playOkSound();
      } else {
        this.playBuzzerSound();
      }
    } else {
      this.playOkSound();
      this.callOkHandler();
    }
  };

  Window_NameInput.prototype.table = function() {
    if (this.isKSMInput) {
      return [Window_NameInput.LATIN1, Window_NameInput.LATIN2];
    }

    if ($gameSystem.isJapanese()) {
      return [
        Window_NameInput.JAPAN1,
        Window_NameInput.JAPAN2,
        Window_NameInput.JAPAN3
      ];
    } else if ($gameSystem.isRussian()) {
      return [Window_NameInput.RUSSIA];
    } else {
      return [Window_NameInput.LATIN1, Window_NameInput.LATIN2];
    }
  };

  // Scene_Title

  const scene_title_create_alias = Scene_Title.prototype.create;
  Scene_Title.prototype.create = async function() {
    scene_title_create_alias.call(this);

    this.createKSMInfo();
    await waitForInit();
    this._windowKSMInfo.show();
  };

  Scene_Title.prototype.createKSMInfo = function() {
    const rect = new Rectangle(0, 0, 500, 60);
    this._windowKSMInfo = new Window_KSMInfo(rect)
    this._windowKSMInfo.hide();
    this.addWindow(this._windowKSMInfo);
  };

  Scene_Title.prototype.createCommandWindow = function () {
    const background = $dataSystem.titleCommandWindow.background;
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_TitleCommand(rect);
    this._commandWindow.setBackgroundType(background);
    this._commandWindow.setHandler("newGame", this.commandNewGame.bind(this));
    this._commandWindow.setHandler("continue", this.commandContinue.bind(this));
    this._commandWindow.setHandler("options", this.commandOptions.bind(this));
    this.addWindow(this._commandWindow);
  };

  Scene_Title.prototype.commandNewGame = async function () {
    await waitForInit();
    this._commandWindow.close();
    SceneManager.push(Scene_SelectKSMAddress);
  };

  Scene_Title.prototype.commandContinue = async function () {
    await waitForInit();
    this._commandWindow.close();
    SceneManager.push(Scene_Load);

    console.log("Game loaded, ksm address: " + _ksmInfo.address + ", ksm mnemonic: " + _ksmInfo.mnemonic);
  };
})();
