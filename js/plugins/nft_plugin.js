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

  // Data Manager

  $ksmInfo = null;

  function KSMInfo() {
    this.initialize(...arguments);
  }

  KSMInfo.prototype.initialize = function() {
    this.address = "";
    this.mnemonic = "";
  };

  data_manager_create_gameobjects_alias = DataManager.createGameObjects;
  DataManager.createGameObjects = function() {
    data_manager_create_gameobjects_alias.call(this);
    $ksmInfo = new KSMInfo();
  };

  data_manager_make_save_contents_alias = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function() {
    const contents = data_manager_make_save_contents_alias.call(this);
    contents.ksmInfo = $ksmInfo;
    return contents;
  };

  data_manager_extract_save_contents_alias = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    data_manager_extract_save_contents_alias.call(this, contents);
    $ksmInfo = contents.ksmInfo;
  };

  data_manager_load_game_alias = DataManager.loadGame;
  DataManager.loadGame = async function(savefileId) {
    const result = await data_manager_load_game_alias.call(this, savefileId);

    // validate ksm address
    if (!$ksmInfo || !$ksmInfo.address) {
      const response = await getNewAddress();
      $ksmInfo = {
        address: response.address,
        mnemonic: response.mnemonic
      };
    }

    // loading nft
    const nfts = JSON.parse(await getMyNfts($ksmInfo.address));
//     const nfts = JSON.parse(await getMyNftsTemp($ksmInfo.address));

    // updating database
    for (let nft of nfts) {
      const metadata = JSON.parse(nft.metadata);
      const gameItemValue = metadata.properties.gameData.value;
      gameItemValue.id += 51;
      $dataWeapons[gameItemValue.id] = gameItemValue;
    }

    const pathLib = require("path");
    let path = pathLib.dirname(process.mainModule.filename);
    path = pathLib.join(path, "data/Weapons.json");
    const weaponsRaw = "[\n" + $dataWeapons.map(entry => JSON.stringify(entry)).join(",\n") + "\n]"
    StorageManager.fsWriteFile(path, weaponsRaw);

    // updating player inventory
    // TODO

    return result;
  };

  async function getMyNftsTemp() {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      const url = "nfts.json";
      xhr.open("GET", url);
      xhr.overrideMimeType("application/json");
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror  = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });
  }

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
    DataManager.setupNewGame();
    this.fadeOutAll();

    const response = await getNewAddress();
    $ksmInfo.address = response.address;
    $ksmInfo.mnemonic = response.mnemonic;

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
    DataManager.setupNewGame();
    this.fadeOutAll();

    const response = await getNewAddressFromMnemonic(this._editWindow.phrase());

    if (response.address) {
      $ksmInfo.address = response.address;
      $ksmInfo.mnemonic = this._editWindow.phrase();
    } else {
      const newAddress = await getNewAddress();
      $ksmInfo.address = newAddress.address;
      $ksmInfo.mnemonic = newAddress.mnemonic;
    }

    SceneManager.goto(Scene_Map);
  };

  // Windows

  //-----------------------------------------------------------------------------
  // Window_KSMAddress
  //

  function Window_KSMAddress() {
    this.initialize(...arguments);
  }

  Window_KSMAddress.prototype = Object.create(Window_Base.prototype);
  Window_KSMAddress.prototype.constructor = Window_KSMAddress;

  Window_KSMAddress.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.refresh();
  };

  Window_KSMAddress.prototype.refresh = async function() {
    this.contents.clear();
    this.contents.fontSize = 16;
    this.drawText("address: " + $ksmInfo.address, 0, -5, this.width, "center");
  };

  Window_KSMAddress.prototype._refreshBack = function() {

  };

  Window_KSMAddress.prototype._refreshFrame = function() {

  };

  //-----------------------------------------------------------------------------
  // Window_KSMBalance
  //

  function Window_KSMBalance() {
    this.initialize(...arguments);
  }

  Window_KSMBalance.prototype = Object.create(Window_Selectable.prototype);
  Window_KSMBalance.prototype.constructor = Window_KSMBalance;

  Window_KSMBalance.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
  };

  Window_KSMBalance.prototype.colSpacing = function() {
    return 0;
  };

  Window_KSMBalance.prototype.refresh = async function() {
    let balance = 0;
    balance = (await getMyBalance($ksmInfo.address)).balance / 1000000;

    const rect = this.itemLineRect(0);
    const x = rect.x;
    const y = rect.y;
    const width = rect.width;
    this.contents.clear();
    this.drawCurrencyValue(balance, this.currencyUnit(), x, y, width);
  };

  Window_KSMBalance.prototype.currencyUnit = function() {
    return "KSM";
  };

  Window_KSMBalance.prototype.open = function() {
    this.refresh();
    Window_Selectable.prototype.open.call(this);
  };

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

  // function Window_KSMInfo() {
  //   this.initialize(...arguments);
  // }
  //
  // Window_KSMInfo.prototype = Object.create(Window_Base.prototype);
  // Window_KSMInfo.prototype.constructor = Window_SelectNFTAddress;
  //
  // Window_KSMInfo.prototype.initialize = function (rect) {
  //   Window_Base.prototype.initialize.call(this, rect);
  //   this._updateKSMTD = 0;
  // };
  //
  // Window_KSMInfo.prototype.update = function () {
  //   Window_Base.prototype.update.call(this);
  //
  //   if (this.visible) {
  //     this._updateKSMTD -= SceneManager._smoothDeltaTime / 100;
  //     if (this._updateKSMTD <= 0) {
  //       this._updateKSMTD = 20;
  //       this.refresh();
  //     }
  //   }
  // };
  //
  // Window_KSMInfo.prototype.refresh = async function() {
  //   this.contents.clear();
  //   this.contents.fontSize = 16;
  //   const balance = await getMyBalance($ksmInfo.address);
  //   this.drawText("Address: " + $ksmInfo.address, 0, -10, this.width, "left");
  //   this.drawText("Balance: " + balance.balance, 0, 10, this.width, "left");
  // };

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

  // Scene_Menu

  const scene_menu_create_alias = Scene_Menu.prototype.create;
  Scene_Menu.prototype.create = function() {
    scene_menu_create_alias.call(this);
    this.createKSMBalanceWindow();
    this.createKSMAddressWindow();
  };

  Scene_Menu.prototype.createKSMBalanceWindow = function() {
    const rect = this.ksmBalanceWindowRect();
    this._ksmBalanceWindow = new Window_KSMBalance(rect);
    this.addWindow(this._ksmBalanceWindow);
  };

  Scene_Menu.prototype.ksmBalanceWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(1, true);
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = this.mainAreaBottom() - wh - wh;
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_Menu.prototype.createKSMAddressWindow = function() {
    const rect = this.ksmAddressWindowRect();
    this._ksmAddressWindow = new Window_KSMAddress(rect);
    this.addWindow(this._ksmAddressWindow);
  };

  Scene_Menu.prototype.ksmAddressWindowRect = function() {
    const ww = Graphics.boxWidth - this._cancelButton.width - 4;
    const wh = 50;
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
  };

  // Scene_Title

  const scene_title_create_alias = Scene_Title.prototype.create;
  Scene_Title.prototype.create = async function() {
    scene_title_create_alias.call(this);

    // this.createKSMInfo();
    // await waitForInit();
    // this._windowKSMInfo.show();
  };

  // Scene_Title.prototype.createKSMInfo = function() {
  //   const rect = new Rectangle(0, 0, 500, 60);
  //   this._windowKSMInfo = new Window_KSMInfo(rect)
  //   this._windowKSMInfo.hide();
  //   this.addWindow(this._windowKSMInfo);
  // };

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
  };
})();
