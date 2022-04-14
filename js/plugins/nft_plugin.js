// plugin command

/*:
 * @target MZ
 *
 * @command openNFTShop
 *
 */

PluginManager.registerCommand("nft_plugin", "openNFTShop", (args) => {
  SceneManager.push(Scene_NFTShop);
});

// Common

let initialized = false;
initializeVeilOfTimeNft("ws://143.198.116.85:9944", "http://143.198.116.85:3000", 2).then(() => {
  initialized = true;
});

async function waitForInit() {
  while (!initialized) {
    await new Promise(r => setTimeout(r, 100));
  }
}

function updateDatabaseWithNFTS(nfts) {
  const newItems = [];
  for (let nft of nfts) {
    const metadata = JSON.parse(nft.metadata);
    const gameItemValue = metadata.properties.gameData.value;
    gameItemValue.id += 51;
    $dataWeapons[gameItemValue.id] = gameItemValue;
    newItems.push(gameItemValue);
  }
  return newItems;
}

function updateInventoryWithNFTS(nftItems) {
  const newItems = [];

  // updating player inventory
  for (let nftItem of nftItems) {
    let itemExistsInInventory = false;

    // check inventory
    for (let weaponId of Object.keys($gameParty._weapons)) {
      if (Number(weaponId) === nftItem.id) {
        itemExistsInInventory = true;
        break;
      }
    }

    if (itemExistsInInventory) {
      continue;
    }

    // check equipped items
    let itemEquippedInAnyActor = false;

    for (let actorId of $gameParty._actors) {
      const actor = $gameActors.actor(actorId);
      let itemEquippedInActor = false;

      for (let gameItem of actor._equips) {
        if (gameItem._dataClass === "weapon" && gameItem._itemId === nftItem.id) {
          itemEquippedInActor = true;
          break
        }
      }

      if (itemEquippedInActor) {
        itemEquippedInAnyActor = true;
        break;
      }
    }

    if (itemEquippedInAnyActor) {
      continue;
    }

    // adding new item
    $gameParty._weapons[nftItem.id] = 1;
    newItems.push(nftItem);
  }

  return newItems;
}

async function getMyNFTSTemp() {
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

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Data Manager

$ksmInfo = null;
$ksmCachedBalance = 0;
$ksmCachedBalanceHuman = 0;

function KSMInfo() {
  this.initialize(...arguments);
}

KSMInfo.prototype.initialize = function() {
  this.address = "";
  this.mnemonic = "";
};

const data_manager_create_gameobjects_alias = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
  data_manager_create_gameobjects_alias.call(this);
  $ksmInfo = new KSMInfo();
};

const data_manager_make_save_contents_alias = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
  const contents = data_manager_make_save_contents_alias.call(this);
  contents.ksmInfo = $ksmInfo;
  return contents;
};

const data_manager_extract_save_contents_alias = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
  data_manager_extract_save_contents_alias.call(this, contents);
  $ksmInfo = contents.ksmInfo;
};

const data_manager_setup_newgame = DataManager.setupNewGame;
DataManager.setupNewGame = async function(isCustom, ksmPhrase) {
  data_manager_setup_newgame.call(this);

  if (!isCustom) {
    return;
  }

  await waitForInit();

  if (ksmPhrase) {
    const response = await getNewAddressFromMnemonic(this._editWindow.phrase());

    if (response.address) {
      $ksmInfo.address = response.address;
      $ksmInfo.mnemonic = this._editWindow.phrase();
    }
  }

  if (!$ksmInfo || !$ksmInfo.address) {
    const response = await getNewAddress();
    $ksmInfo.address = response.address;
    $ksmInfo.mnemonic = response.mnemonic;
  }

  $ksmCachedBalance = (await getMyBalance($ksmInfo.address)).balance;
  $ksmCachedBalanceHuman = (await getMyBalance($ksmInfo.address)).balanceHuman;

  // loading nft
  const nfts = JSON.parse(await getMyNfts($ksmInfo.address));
  //const nfts = JSON.parse(await getMyNFTSTemp($ksmInfo.address));

  // updating database
  const nftItems = updateDatabaseWithNFTS(nfts);

  // updating inventory
  updateInventoryWithNFTS(nftItems);
};

const data_manager_load_game_alias = DataManager.loadGame;
DataManager.loadGame = async function(savefileId) {
  await waitForInit();

  // read and validate ksm address
  const saveName = this.makeSavename(savefileId);
  const contents = (await StorageManager.loadObject(saveName));
  let ksmInfo = contents.ksmInfo;
  let ksmInfoFixed = false;

  if (!ksmInfo || !ksmInfo.address) {
    const response = await getNewAddress();
    ksmInfo = {
      address: response.address,
      mnemonic: response.mnemonic
    };
    ksmInfoFixed = true;
  }

  $ksmCachedBalance = (await getMyBalance(ksmInfo.address)).balance;
  $ksmCachedBalanceHuman = (await getMyBalance(ksmInfo.address)).balanceHuman;

  // loading nft
  const nfts = JSON.parse(await getMyNfts(ksmInfo.address));
  //const nfts = JSON.parse(await getMyNFTSTemp(ksmInfo.address));

  // updating database
  const nftItems = updateDatabaseWithNFTS(nfts);

  // original loading
  const result = await data_manager_load_game_alias.call(this, savefileId);

  // try apply fixed ksm info
  if (ksmInfoFixed) {
    $ksmInfo = ksmInfo;
  }

  // updating inventory
  updateInventoryWithNFTS(nftItems);

  return result;
};

// Update Loop

UpdateNFTLoop();

function UpdateNFTLoop() {
  // if we are in scene title
  if (!SceneManager._scene || SceneManager._scene instanceof Scene_Title) {
    NextUpdateNFTLoop();
    return;
  }

  // if there no info about ksm
  if (!$ksmInfo || !$ksmInfo.address) {
    NextUpdateNFTLoop();
    return;
  }

  UpdateNFTLoopBody();
  NextUpdateNFTLoop();
}

function NextUpdateNFTLoop() {
  setTimeout(UpdateNFTLoop, 30000);
}

async function UpdateNFTLoopBody() {
  $ksmCachedBalance = (await getMyBalance($ksmInfo.address)).balance;
  $ksmCachedBalanceHuman = (await getMyBalance($ksmInfo.address)).balanceHuman;
  OnBalanceUpdate($ksmCachedBalance);

  // loading nft
  const nfts = JSON.parse(await getMyNfts($ksmInfo.address));
  //const nfts = JSON.parse(await getMyNFTSTemp($ksmInfo.address));

  // updating database
  const nftItems = updateDatabaseWithNFTS(nfts);

  // updating inventory
  const newItems = updateInventoryWithNFTS(nftItems);

  OnNewNFTItem(newItems);
}

// Events

const _balanceUpdateReceivers = [];
const _newNFTItemsReceivers = [];

function SubscribeToBalanceUpdate(receiver) {
  const index = _balanceUpdateReceivers.indexOf(receiver);
  if (index < 0) {
    _balanceUpdateReceivers.push(receiver);
  }
}

function SubscribeToNewNFTItems(receiver) {
  const index = _newNFTItemsReceivers.indexOf(receiver);
  if (index < 0) {
    _newNFTItemsReceivers.push(receiver);
  }
}

function UnsubscribeFromBalanceUpdate(receiver) {
  const index = _balanceUpdateReceivers.indexOf(receiver);
  if (index > -1) {
    _balanceUpdateReceivers.splice(index, 1);
  }
}

function UnsubscribeFromNewNFTItems(receiver) {
  const index = _newNFTItemsReceivers.indexOf(receiver);
  if (index > -1) {
    _newNFTItemsReceivers.splice(index, 1);
  }
}

function OnBalanceUpdate(balance) {
  for (let receiver of _balanceUpdateReceivers) {
    if (receiver.OnBalanceUpdate) {
      receiver.OnBalanceUpdate(balance);
    }
  }
}

function OnNewNFTItem(newItems) {
  if (newItems.length > 0) {
    const newItem = newItems[0];

    for (let receiver of _newNFTItemsReceivers) {
      if (receiver.OnNewNFTItem) {
        receiver.OnNewNFTItem(newItem);
      }
    }
  }
}

// global receivers

const globalNewNFTItemCallbackReceiver = new GlobalNewNFTItemCallbackReceiver();
SubscribeToNewNFTItems(globalNewNFTItemCallbackReceiver);

function GlobalNewNFTItemCallbackReceiver() {

}

GlobalNewNFTItemCallbackReceiver.prototype.getLastNewNFTItem = function() {
  return this._lastNewNFTItem;
}

GlobalNewNFTItemCallbackReceiver.prototype.OnNewNFTItem = function (newItem) {
  this._lastNewNFTItem = newItem;

  if (SceneManager._scene instanceof Scene_Battle) {
    return;
  }

  SceneManager.push(Scene_NFTNotification);
};

// Scenes

//-----------------------------------------------------------------------------
// Scene_NFTShop
//

//-----------------------------------------------------------------------------
// Scene_Shop
//
// The scene class of the shop screen.

function Scene_NFTShop() {
  this.initialize(...arguments);
}

Scene_NFTShop.prototype = Object.create(Scene_MenuBase.prototype);
Scene_NFTShop.prototype.constructor = Scene_NFTShop;

Scene_NFTShop.prototype.initialize = function() {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_NFTShop.prototype.create = function() {
  Scene_MenuBase.prototype.create.call(this);
  this.createHelpWindow();
  this.createKSMAddressWindow();
  this.createKSMBalanceWindow();
  this.createCommandWindow();
  this.createDummyWindow();
  this.createStatusWindow();
  this.createBuyWindow();
  this.createCategoryWindow();
  this.createBuyConfirmWindow();
};

Scene_NFTShop.prototype.createKSMAddressWindow = function() {
  const rect = this.ksmAddressWindowRect();
  this._ksmAddressWindow = new Window_KSMAddress(rect);
  this.addWindow(this._ksmAddressWindow);
};

Scene_NFTShop.prototype.ksmAddressWindowRect = function() {
  const ww = Graphics.boxWidth - this._cancelButton.width - 4;
  const wh = 50;
  const wx = 0;
  const wy = 0;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createKSMBalanceWindow = function() {
  const rect = this.ksmBalanceWindowRect();
  this._ksmBalanceWindow = new Window_KSMBalance(rect);
  this._ksmBalanceWindow.open();
  this.addWindow(this._ksmBalanceWindow);
};

Scene_NFTShop.prototype.ksmBalanceWindowRect = function() {
  const ww = this.mainCommandWidth();
  const wh = this.calcWindowHeight(1, true);
  const wx = Graphics.boxWidth - ww;
  const wy = this.mainAreaTop();
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createCommandWindow = function() {
  const rect = this.commandWindowRect();
  this._commandWindow = new Window_ShopCommand(rect);
  this._commandWindow.setPurchaseOnly(this._purchaseOnly);
  this._commandWindow.y = this.mainAreaTop();
  this._commandWindow.setHandler("buy", this.commandBuy.bind(this));
  this._commandWindow.setHandler("sell", this.commandSell.bind(this));
  this._commandWindow.setHandler("cancel", this.popScene.bind(this));
  this.addWindow(this._commandWindow);
};

Scene_NFTShop.prototype.commandWindowRect = function() {
  const wx = 0;
  const wy = this.mainAreaTop();
  const ww = this._ksmBalanceWindow.x;
  const wh = this.calcWindowHeight(1, true);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createDummyWindow = function() {
  const rect = this.dummyWindowRect();
  this._dummyWindow = new Window_Base(rect);
  this.addWindow(this._dummyWindow);
};

Scene_NFTShop.prototype.dummyWindowRect = function() {
  const wx = 0;
  const wy = this._commandWindow.y + this._commandWindow.height;
  const ww = Graphics.boxWidth;
  const wh = this.mainAreaHeight() - this._commandWindow.height;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createStatusWindow = function() {
  const rect = this.statusWindowRect();
  this._statusWindow = new Window_ShopStatus(rect);
  this._statusWindow.hide();
  this.addWindow(this._statusWindow);
};

Scene_NFTShop.prototype.statusWindowRect = function() {
  const ww = this.statusWidth();
  const wh = this._dummyWindow.height;
  const wx = Graphics.boxWidth - ww;
  const wy = this._dummyWindow.y;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createBuyWindow = function() {
  const rect = this.buyWindowRect();
  this._buyWindow = new Window_NFTShopBuy(rect);
  this._buyWindow.setHelpWindow(this._helpWindow);
  this._buyWindow.setStatusWindow(this._statusWindow);
  this._buyWindow.hide();
  this._buyWindow.setHandler("ok", this.onBuyOk.bind(this));
  this._buyWindow.setHandler("cancel", this.onBuyCancel.bind(this));
  this.addWindow(this._buyWindow);
};

Scene_NFTShop.prototype.buyWindowRect = function() {
  const wx = 0;
  const wy = this._dummyWindow.y;
  const ww = Graphics.boxWidth - this.statusWidth();
  const wh = this._dummyWindow.height;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createCategoryWindow = function() {
  const rect = this.categoryWindowRect();
  this._categoryWindow = new Window_ItemCategory(rect);
  this._categoryWindow.setHelpWindow(this._helpWindow);
  this._categoryWindow.hide();
  this._categoryWindow.deactivate();
  this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
  this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));
  this.addWindow(this._categoryWindow);
};

Scene_NFTShop.prototype.categoryWindowRect = function() {
  const wx = 0;
  const wy = this._dummyWindow.y;
  const ww = Graphics.boxWidth;
  const wh = this.calcWindowHeight(1, true);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createBuyConfirmWindow = function() {
  const rect = this.buyConfirmWindowRect();
  this._buyConfirmWindow = new Window_NFTBuyConfirm(rect);
  this._buyConfirmWindow.hide();
  this._buyConfirmWindow.setHandler("ok", this.onBuyConfirmOk.bind(this));
  this._buyConfirmWindow.setHandler("cancel", this.onBuyConfirmCancel.bind(this));
  this.addWindow(this._buyConfirmWindow);
};

Scene_NFTShop.prototype.buyConfirmWindowRect = function() {
  const wx = 0;
  const wy = this._dummyWindow.y;
  const ww = Graphics.boxWidth - this.statusWidth();
  const wh = this._dummyWindow.height;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.statusWidth = function() {
  return 352;
};

Scene_NFTShop.prototype.activateBuyWindow = function() {
  this._buyWindow.show();
  this._buyWindow.activate();
  this._statusWindow.show();
};

Scene_NFTShop.prototype.activateSellWindow = function() {
  if (this._categoryWindow.needsSelection()) {
    this._categoryWindow.show();
  }
  this._sellWindow.refresh();
  this._sellWindow.show();
  this._sellWindow.activate();
  this._statusWindow.hide();
};

Scene_NFTShop.prototype.commandBuy = function() {
  this._dummyWindow.hide();
  this.activateBuyWindow();
};

Scene_NFTShop.prototype.commandSell = function() {
  this._commandWindow.activate();
};

Scene_NFTShop.prototype.onBuyOk = function() {
  this._item = this._buyWindow.item();
  this._buyWindow.hide();
  this._buyConfirmWindow.show();
  this._buyConfirmWindow.activate();
};

Scene_NFTShop.prototype.onBuyCancel = function() {
  this._commandWindow.activate();
  this._dummyWindow.show();
  this._buyWindow.hide();
  this._statusWindow.hide();
  this._statusWindow.setItem(null);
  this._helpWindow.clear();
};

Scene_NFTShop.prototype.onCategoryOk = function() {
  this.activateSellWindow();
  this._sellWindow.select(0);
};

Scene_NFTShop.prototype.onCategoryCancel = function() {
  this._commandWindow.activate();
  this._dummyWindow.show();
  this._categoryWindow.hide();
  this._sellWindow.hide();
};

Scene_NFTShop.prototype.onBuyConfirmOk = async function () {
  SceneManager.push(Scene_BuySpinner);
  const result = await buyNft($ksmInfo.address, this._item.id, this._item.owner, this._item.forsale);
  await timeout(1000);
  if (result) {
    SceneManager._scene.setText("Purchase success");
    await UpdateNFTLoopBody();
  } else {
    SceneManager._scene.setText("Purchase error");
  }
  await timeout(2000);
  SceneManager.pop();
  while (!SceneManager._scene._buyWindow) {
    await timeout(10);
  }
  SceneManager._scene._buyWindow.show();
  SceneManager._scene._buyWindow.activate();
};

Scene_NFTShop.prototype.onBuyConfirmCancel = function () {
  this._buyConfirmWindow.hide();
  this._buyConfirmWindow.deactivate();
  this._buyWindow.show();
  this._buyWindow.activate();
};

// function Scene_NFTShop() {
//   this.initialize(...arguments);
// }
//
// Scene_NFTShop.prototype = Object.create(Scene_MenuBase.prototype);
// Scene_NFTShop.prototype.constructor = Scene_NFTShop;
//
// Scene_NFTShop.prototype.initialize = function() {
//   Scene_MenuBase.prototype.initialize.call(this);
// };
//
// Scene_NFTShop.prototype.create = function() {
//   Scene_MenuBase.prototype.create.call(this);
//
//   this.createNFTShopListWindow();
//   this.createHeaderLine();
//
//   this._cancelButton.setClickHandler(() => {
//     SoundManager.playCancel();
//     SceneManager.pop();
//   });
// };
//
// Scene_NFTShop.prototype.createNFTShopListWindow = function() {
//   const width = Graphics.boxWidth;
//   const height = Graphics.boxHeight - 50;
//   const rect = new Rectangle(0, 50, width, height);
//   this._windowNFTShopList = new Window_NFTShopList(rect);
//   this._windowNFTShopList.activate();
//   this._windowNFTShopList.setHandler("ok", this.processOk.bind(this));
//   this.addWindow(this._windowNFTShopList);
// };
//
// Scene_NFTShop.prototype.createHeaderLine = function() {
//   const rect = new Rectangle(0, 0, 700, 50);
//   this._windowKSMAddressAndBalance = new Window_KSMAddressAndBalance(rect);
//   this._windowKSMAddressAndBalance.activate();
//   this.addWindow(this._windowKSMAddressAndBalance);
// };
//
// Scene_NFTShop.prototype.processOk = async function () {
//   itemToBuy = this._windowNFTShopList._nftItems[this._windowNFTShopList.index()];
//   SceneManager.push(Scene_NFTBuyConfirm);
// };

//-----------------------------------------------------------------------------
// Scene_NFTBuyConfirm
//

// function Scene_NFTBuyConfirm() {
//   this.initialize(...arguments);
// }
//
// Scene_NFTBuyConfirm.prototype = Object.create(Scene_MenuBase.prototype);
// Scene_NFTBuyConfirm.prototype.constructor = Scene_NFTBuyConfirm;
//
// Scene_NFTBuyConfirm.prototype.initialize = function() {
//   Scene_MenuBase.prototype.initialize.call(this);
// };
//
// Scene_NFTBuyConfirm.prototype.create = function() {
//   Scene_MenuBase.prototype.create.call(this);
//
//   this.createWindow();
//   this._cancelButton.setClickHandler(() => {
//     SoundManager.playCancel();
//     SceneManager.pop();
//   });
// };
//
// let itemToBuy = null;
// Scene_NFTBuyConfirm.prototype.createWindow = function() {
//   const width = 500;
//   const height = 160;
//   const rect = new Rectangle(Graphics.boxWidth / 2 - width / 2, Graphics.boxHeight / 2 - height / 2, width, height);
//   this._windowNFTBuyConfirm = new Window_NFTBuyConfirm(rect);
//   this._windowNFTBuyConfirm.refresh();
//   this._windowNFTBuyConfirm.setHandler("buy", this.processBuy.bind(this));
//   this._windowNFTBuyConfirm.setHandler("cancel", this.processCancel.bind(this));
//   this.addWindow(this._windowNFTBuyConfirm);
// };
//
// Scene_NFTBuyConfirm.prototype.processBuy = async function() {
//   await buyNft($ksmInfo.address, itemToBuy.id, itemToBuy.owner, itemToBuy.forsale);
//   SceneManager.pop();
// };
//
// Scene_NFTBuyConfirm.prototype.processCancel = function() {
//   SceneManager.pop();
// };

//-----------------------------------------------------------------------------
// Scene_BuySpinner
//

function Scene_BuySpinner() {
  this.initialize(...arguments);
}

Scene_BuySpinner.prototype = Object.create(Scene_MenuBase.prototype);
Scene_BuySpinner.prototype.constructor = Scene_BuySpinner;

Scene_BuySpinner.prototype.create = function() {
  Scene_Base.prototype.create.call(this);
  this.createBackground();
  this.updateActor();
  this.createWindowLayer();
  this.createWindow();
};

Scene_BuySpinner.prototype.createWindow = function() {
  const width = Graphics.boxWidth;
  const height = Graphics.boxHeight;
  const rect = new Rectangle(Graphics.boxWidth / 2 - width / 2, Graphics.boxHeight / 2 - height / 2, width, height);
  this._windowBuySpinner = new Window_BuySpinner(rect);
  this.addWindow(this._windowBuySpinner);
};

Scene_BuySpinner.prototype.setText = function(text) {
  this._windowBuySpinner._text = text;
};

//-----------------------------------------------------------------------------
// Scene_NFTNotification
//

function Scene_NFTNotification() {
  this.initialize(...arguments);
}

Scene_NFTNotification.prototype = Object.create(Scene_MenuBase.prototype);
Scene_NFTNotification.prototype.constructor = Scene_NFTNotification;

Scene_NFTNotification.prototype.initialize = function() {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_NFTNotification.prototype.create = function() {
  Scene_MenuBase.prototype.create.call(this);

  this.createWindow();
  this._cancelButton.setClickHandler(() => {
    SoundManager.playCancel();
    SceneManager.pop();
  });
};

Scene_NFTNotification.prototype.createWindow = function() {
  const width = 700;
  const height = 200;
  const rect = new Rectangle(Graphics.boxWidth / 2 - width / 2, Graphics.boxHeight / 2 - height / 2, width, height);
  this._windowNftNotification = new Window_NFTNotification(rect);
  this._windowNftNotification.setItem(globalNewNFTItemCallbackReceiver.getLastNewNFTItem());
  this.addWindow(this._windowNftNotification);
};


//-----------------------------------------------------------------------------
// Scene_SelectKSMAddress
//

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
  this._cancelButton.setClickHandler(() => {
    SoundManager.playCancel();
    SceneManager.pop();
  });
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
  this.fadeOutAll();
  await DataManager.setupNewGame(true);
  SceneManager.goto(Scene_Map);
};

Scene_SelectKSMAddress.prototype.commandImportKSMAddress = function () {
  SceneManager.push(Scene_NFTPhrase);
};

//-----------------------------------------------------------------------------
// Scene_NFTPhrase
//

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
  this._cancelButton.setClickHandler(() => {
    SoundManager.playCancel();
    SceneManager.pop();
  });
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
  this.fadeOutAll();
  await DataManager.setupNewGame(true, this._editWindow.phrase());
  SceneManager.goto(Scene_Map);
};

// Windows

//-----------------------------------------------------------------------------
// Window_BuySpinner
//

function Window_BuySpinner() {
  this.initialize(...arguments);
}

Window_BuySpinner.prototype = Object.create(Window_Base.prototype);
Window_BuySpinner.prototype.constructor = Window_BuySpinner;

Window_BuySpinner.prototype.initialize = function(rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this._dots = 0;
  this._dotsUpdateFrame = 0;
  this._text = "";
};

Window_BuySpinner.prototype.update = function() {
  Window_Base.prototype.update.call(this);
  this.contents.clear();
  this.contents.paintOpacity = 100;
  this.contents.fillAll("rgb(0, 0, 0)");
  this.contents.paintOpacity = 255;
  if (this._text) {
    this.contents.drawText(this._text, 0, this.innerHeight / 2 - 35 / 2, this.innerWidth, 35, "center");
  } else {
    this.contents.drawText("Buying" + ".".repeat(this._dots), 0, this.innerHeight / 2 - 35 / 2, this.innerWidth, 35, "center");
  }

  this._dotsUpdateFrame++;
  if (this._dotsUpdateFrame > 30) {
    this._dotsUpdateFrame = 0;

    this._dots++;
    if (this._dots > 3) {
      this._dots = 0;
    }
  }
};

Window_BuySpinner.prototype.updatePadding = function() {
  this.padding = -5;
};

Window_BuySpinner.prototype._refreshFrame = function() {

};

Window_BuySpinner.prototype._refreshBack = function() {

};

//-----------------------------------------------------------------------------
// Window_NFTShopBuy
//

function Window_NFTShopBuy() {
  this.initialize(...arguments);
}

Window_NFTShopBuy.prototype = Object.create(Window_Selectable.prototype);
Window_NFTShopBuy.prototype.constructor = Window_NFTShopBuy;

Window_NFTShopBuy.prototype.initialize = async function(rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this._nftItems = JSON.parse(await getNftsForSale('d43593c715a56da27d-VOTS'));
  this.refresh();
  this.select(0);
};

Window_NFTShopBuy.prototype.maxItems = function() {
  return this._nftItems ? this._nftItems.length : 0;
};

Window_NFTShopBuy.prototype.item = function() {
  return this.itemAt(this.index());
};

Window_NFTShopBuy.prototype.itemAt = function(index) {
  return (this._nftItems && index >= 0 && index < this._nftItems.length) ? this._nftItems[index] : null;
};

Window_NFTShopBuy.prototype.itemMetadata = function() {
  const item = this.itemAt(this.index());
  return item ? JSON.parse(item.metadata) : null;
};

Window_NFTShopBuy.prototype.itemMetadataAt = function(index) {
  const item = this.itemAt(index);
  return item ? JSON.parse(item.metadata) : null;
};

Window_NFTShopBuy.prototype.isCurrentItemEnabled = function() {
  return this.isEnabled(this._nftItems[this.index()]);
};

Window_NFTShopBuy.prototype.price = function(item) {
  return item ? item.forsale : 0;
};

Window_NFTShopBuy.prototype.isEnabled = function(item) {
  return true;
  return (
      item && this.price(item) <= $ksmCachedBalance
  );
};

Window_NFTShopBuy.prototype.drawItem = function(index) {
  const item = this.itemAt(index);
  const itemMetadata = this.itemMetadataAt(index);
  const price = this.price(item);
  const rect = this.itemLineRect(index);
  const priceWidth = this.priceWidth();
  const priceX = rect.x + rect.width - priceWidth;
  const nameWidth = rect.width - priceWidth;
  this.changePaintOpacity(this.isEnabled(item));
  this.drawItemName(itemMetadata, rect.x, rect.y, nameWidth);
  this.drawText(price, priceX, rect.y, priceWidth, "right");
  this.changePaintOpacity(true);
};

Window_NFTShopBuy.prototype.priceWidth = function() {
  return 96;
};

Window_NFTShopBuy.prototype.setStatusWindow = function(statusWindow) {
  this._statusWindow = statusWindow;
  this.callUpdateHelp();
};

Window_NFTShopBuy.prototype.updateHelp = function() {
  this.setHelpWindowItem(this.itemMetadata());
  if (this._statusWindow) {
    this._statusWindow.setItem(this.itemMetadata());
  }
};

//-----------------------------------------------------------------------------
// Window_NFTBuyConfirm
//

function Window_NFTBuyConfirm() {
  this.initialize(...arguments);
}

Window_NFTBuyConfirm.prototype = Object.create(Window_Command.prototype);
Window_NFTBuyConfirm.prototype.constructor = Window_NFTShopList;

Window_NFTBuyConfirm.prototype.initialize = function (rect) {
  Window_Command.prototype.initialize.call(this, rect);
};

Window_NFTBuyConfirm.prototype.makeCommandList = function () {
  this.addCommand("Buy", "buy");
  this.addCommand("Cancel", "cancel");
};

Window_NFTBuyConfirm.prototype.refresh = function () {
  Window_Base.prototype.createContents.call(this);
  Window_Command.prototype.refresh.call(this);
  this.drawText("Are you sure to buy this item?", 0, this.height / 2 - 80, this.width, "center");
};

window_nft_buy_confirm_itemrect_alias = Window_Command.prototype.itemRect;
Window_NFTBuyConfirm.prototype.itemRect = function(index) {
  let rectangle = window_nft_buy_confirm_itemrect_alias.call(this, index);
  rectangle.y += this.height / 2 - 30;
  return rectangle;
};


//-----------------------------------------------------------------------------
// Window_NFTShopList
//

function Window_NFTShopList() {
  this.initialize(...arguments);
}

Window_NFTShopList.prototype = Object.create(Window_Selectable.prototype);
Window_NFTShopList.prototype.constructor = Window_NFTShopList;

Window_NFTShopList.prototype.initialize = async function (rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this._nftItems = JSON.parse(await getNftsForSale('d43593c715a56da27d-VOTS'));
  this.refresh();
};

Window_NFTShopList.prototype.maxCols = function() {
  return 1;
};

Window_NFTShopList.prototype.maxItems = function() {
  return this._nftItems ? this._nftItems.length : 0;
};

Window_NFTShopList.prototype.drawItem = function(index) {
  const nftItem = this._nftItems[index];
  const metadata = JSON.parse(nftItem.metadata);
  const rect = this.itemLineRect(index);
  this.contents.fontSize = 18;
  this.drawText("Name: " + metadata.name, rect.x, rect.y, rect.width, 25, "left");
  this.drawText("Description: " + metadata.name, rect.x, rect.y + 25, rect.width, 25, "left");
  this.drawText("Owner: " + nftItem.owner, rect.x, rect.y + 50, rect.width, 25, "left");
  this.drawText("Price: " + nftItem.forsale, rect.x, rect.y + 75, rect.width, 25, "left");
};

Window_NFTShopList.prototype.isCursorMovable = function() {
  return this.active;
};

Window_NFTShopList.prototype.lineHeight = function () {
  return 100;
};

Window_NFTShopList.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
  this.contents.drawText(text, x, y, maxWidth, lineHeight, align);
};

//-----------------------------------------------------------------------------
// Window_NFTNotification
//

function Window_NFTNotification() {
  this.initialize(...arguments);
}

Window_NFTNotification.prototype = Object.create(Window_Base.prototype);
Window_NFTNotification.prototype.constructor = Window_NFTNotification;

Window_NFTNotification.prototype.initialize = function (rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this.refresh();
};

Window_NFTNotification.prototype.setItem = function(item) {
  this._item = item;
  this.refresh();
};

Window_NFTNotification.prototype.refresh = async function() {
  this.contents.clear();

  if (this._item) {
    this.contents.fontSize = 24;
    this.drawText("New NFT Item", 0, 0, this.innerWidth, "center");

    const iconSize = 48;
    this.drawIconWithSize(this._item.iconIndex, this.innerWidth / 2 - iconSize / 2, 45, iconSize, iconSize);

    this.contents.fontSize = 20;
    this.drawText(this._item.name, 0, 100, this.innerWidth, "center");

    this.contents.fontSize = 18;
    this.drawText(this._item.description, 0, 135, this.innerWidth, "center");
  }
};

//-----------------------------------------------------------------------------
// Window_KSMAddressAndBalance
//

function Window_KSMAddressAndBalance() {
  this.initialize(...arguments);
}

Window_KSMAddressAndBalance.prototype = Object.create(Window_Base.prototype);
Window_KSMAddressAndBalance.prototype.constructor = Window_KSMAddressAndBalance;

Window_KSMAddressAndBalance.prototype.initialize = function (rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this.refresh();
};

Window_KSMAddressAndBalance.prototype.refresh = async function() {
  this.contents.clear();
  this.contents.fontSize = 16;
  this.drawText("address: " + $ksmInfo.address, 0, -5, 500, "left");
  this.drawText("KSM: " + $ksmCachedBalance, 500, -5, 100, "right");
};

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
  SubscribeToBalanceUpdate(this);
};

Window_KSMBalance.prototype.destroy = function(options) {
  UnsubscribeFromBalanceUpdate(this);
  Window_Selectable.prototype.destroy.call(this, options);
};

Window_KSMBalance.prototype.colSpacing = function() {
  return 0;
};

Window_KSMBalance.prototype.refresh = async function() {
  const rect = this.itemLineRect(0);
  const x = rect.x;
  const y = rect.y;
  const width = rect.width;
  this.contents.clear();
  this.drawCurrencyValue($ksmCachedBalance, this.currencyUnit(), x, y, width);
};

Window_KSMBalance.prototype.currencyUnit = function() {
  return "KSM";
};

Window_KSMBalance.prototype.OnBalanceUpdate = function (balance) {
  this.refresh();
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

// Adding new command in menu
// make_command_list_alias = Window_MenuCommand.prototype.makeCommandList;
// Window_MenuCommand.prototype.makeCommandList = function () {
//   make_command_list_alias.call(this);
//
//   const nftShopSymbol = "nftShop";
//   this.addCommand("NFT Shop", nftShopSymbol, true);
//   this.changeCommandIndex(nftShopSymbol, 5);
//   this.setHandler(nftShopSymbol, commandNFTShop);
// };
//
// function commandNFTShop() {
//   SceneManager.push(Scene_NFTShop);
// }
//
// Window_MenuCommand.prototype.changeCommandIndex = function (symbol, index) {
//   if (index >= 0 && index < this._list.length) {
//     const currentIndex = this.findSymbol(symbol);
//     const currentSymbol = this._list[currentIndex];
//
//     let waitingSymbol = this._list[index];
//     for (let i = index; i < currentIndex; i++) {
//       const temp = this._list[i + 1];
//       this._list[i + 1] = waitingSymbol;
//       waitingSymbol = temp;
//     }
//
//     this._list[index] = currentSymbol;
//   } else {
//     throw new RangeError("Command index must be between 0 and " + (this._list.length - 1) + " (inclusive).");
//   }
// }

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

// Window_Base

Window_Base.prototype.drawIconWithSize = function(iconIndex, x, y, width, height) {
  const bitmap = ImageManager.loadSystem("IconSet");
  const pw = ImageManager.iconWidth;
  const ph = ImageManager.iconHeight;
  const sx = (iconIndex % 16) * pw;
  const sy = Math.floor(iconIndex / 16) * ph;
  this.contents.blt(bitmap, sx, sy, pw, ph, x, y, width, height);
};

// Window_Help

Window_Help.prototype.refresh = function() {
  const rect = this.baseTextRect();
  this.contents.clear();
  this.drawTextEx(this.wrapText(this._text), rect.x, rect.y, rect.width);
};

Window_Help.prototype.wrapText = function(text) {
  const textParts = text.split(".");
  if (textParts && textParts.length > 0) {
    return textParts[0] + ".";
  }
  return text;
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
  this._ksmBalanceWindow.open();
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