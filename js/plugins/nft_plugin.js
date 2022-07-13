// plugin command

var thisNFTNameInput = null;

/*:
 * @target MZ
 *
 * @command openNFTShop
 * @text Open NFT Shop
 * @desc
 *
 * @arg collectionId
 * @type string
 * @default d43593c715a56da27d-VOTS
 * @text Collection ID
 * @desc
 */

PluginManager.registerCommand("nft_plugin", "openNFTShop", (args) => {
  collectionId = args.collectionId;
  SceneManager.push(Scene_NFTShop);
});

// Common

$ksmEndpoints = null;

function KSMEndpoints() {
  this.initialize(...arguments);
}

KSMEndpoints.prototype.initialize = function () {
  this.ksmEndpoint = "ws://143.198.116.85:9944";
  this.rmrkEndpoint = "http://143.198.116.85:3000";
};

StorageManager.saveKSMEndpoints = function () {
  return this.objectToJson($ksmEndpoints)
    .then(json => this.jsonToZip(json))
    .then(zip => this.saveZip("ksmEndpoints", zip));
};

StorageManager.loadKSMEndpoints = function () {
  return this.loadZip("ksmEndpoints")
    .then(zip => this.zipToJson(zip))
    .then(json => this.jsonToObject(json));
};

let initialized = false;
let initializationFailed = false;

init();

async function init() {
  let ksmEndpoints;
  try {
    ksmEndpoints = (await StorageManager.loadKSMEndpoints());
  } catch { }
  const ksmEndpointsValid = ksmEndpoints && ksmEndpoints.ksmEndpoint && ksmEndpoints.rmrkEndpoint;

  if (ksmEndpointsValid) {
    $ksmEndpoints = ksmEndpoints;
  } else {
    $ksmEndpoints = new KSMEndpoints();
  }

  try {
    initializeVeilOfTimeNft($ksmEndpoints.ksmEndpoint, $ksmEndpoints.rmrkEndpoint, 2).then(() => {
      initialized = true;
    });
  } catch {
    initializationFailed = true;
  }
}

async function waitForInit() {
  while (!initialized && !initializationFailed) {
    await new Promise(r => setTimeout(r, 100));
  }
}

async function getAllNFTOnSale() {
  const result = [];
  const collections = JSON.parse(await getWhiteListedCollections());
  for (let collection of collections) {
    const list = JSON.parse(await getNftsForSale(collection));
    for (let nft of list) {
      result.push(nft);
    }
  }
  return result;
}

function updateDatabaseWithNFTS_AutoCollections(nftList) {
  const result = [];

  const collections = {};
  for (let nft of nftList) {
    if (collections[nft.collection]) {
      collections[nft.collection].push(nft);
    } else {
      collections[nft.collection] = [nft];
    }
  }

  for (let collectionId of Object.keys(collections)) {
    result.push(...updateDatabaseWithNFTS(collections[collectionId], collectionId));
  }

  return result;
}

function updateDatabaseWithNFTS(nftList, collectionId) {
  switch (collectionId) {
    case WEAPONS_COLLECTION: return updateDatabaseWithNFTS_Weapon(nftList);
    case ESSENTIA_COLLECTION: return updateDatabaseWithNFTS_Essentia(nftList);
    default: throw new Error("updateDatabaseWithNFTS, unknown nft collection, id: " + collectionId);
  }
}

function updateDatabaseWithNFTS_Weapon(nftList) {
  const newItems = [];
  for (let nft of nftList) {
    try {
      const metadata = JSON.parse(nft.metadata);
      if (metadata.properties) {
        const gameItemValue = metadata.properties.gameData.value;
        gameItemValue.id += 51;
        gameItemValue.nftId = nft.id;
        gameItemValue.nftCollectionId = nft.collection;
        gameItemValue.note = "<materia slots: 0:0>";
        $dataWeapons[gameItemValue.id] = gameItemValue;
        newItems.push(gameItemValue);

        VictorEngine.MateriaSystem.loadNotes1($dataWeapons[gameItemValue.id]);
      }
    }
    catch { }
  }
  return newItems;
}

function updateDatabaseWithNFTS_Essentia(nftList) {
  const newItems = [];
  for (let nft of nftList) {
    try {
      const metadata = JSON.parse(nft.metadata);

      if (metadata.properties) {
        const gameItemValue = metadata.properties.gameData.value.d;

        const essentiaData = {
          id: gameItemValue.id,
          atypeId: 0,
          description: metadata.description,
          etypeId: 2,
          traits: gameItemValue.traits,
          iconIndex: gameItemValue.iconIndex,
          name: metadata.name,
          note: "<materia>type: weapon</materia>",
          params: [0, 0, 0, 0, 0, 0, 0, 0],
          price: 0
        };
        essentiaData.nftId = nft.id;
        essentiaData.nftCollectionId = nft.collection;

        $dataArmors[essentiaData.id] = essentiaData;
        newItems.push(essentiaData);
      }
    }
    catch { }
  }
  VictorEngine.processNotetags($dataArmors, 5);
  return newItems;
}

function updateInventoryWithNFTS_AutoCollections(nftList) {
  const result = [];

  const collections = {};
  for (let nft of nftList) {
    if (collections[nft.nftCollectionId]) {
      collections[nft.nftCollectionId].push(nft);
    } else {
      collections[nft.nftCollectionId] = [nft];
    }
  }

  for (let collectionId of Object.keys(collections)) {
    result.push(...updateInventoryWithNFTS(collections[collectionId], collectionId));
  }

  return result;
}

function updateInventoryWithNFTS(nftList, collectionId) {
  switch (collectionId) {
    case WEAPONS_COLLECTION: return updateInventoryWithNFTS_Weapon(nftList);
    case ESSENTIA_COLLECTION: return updateInventoryWithNFTS_Essentia(nftList);
    default: throw new Error("updateInventoryWithNFTS, unknown nft collection, id: " + collectionId);
  }
}

function updateInventoryWithNFTS_Weapon(nftList) {
  const newItems = [];

  // updating player inventory
  for (let nft of nftList) {
    if (isNFTInInventory_Weapon(nft.nftId)) {
      continue;
    }

    if (isNFTEquipped_Weapon(nft.nftId)) {
      continue;
    }

    // adding new item
    $gameParty._weapons[nft.id] = 1;
    newItems.push(nft);
  }

  return newItems;
}

function isNFTInInventory_Weapon(nftId) {
  const inGameWeapons = $dataWeapons.filter(x => x && x.nftId === nftId);
  if (inGameWeapons.length > 0) {
    const inGameWeaponId = inGameWeapons[0].id;
    for (let weaponId of Object.keys($gameParty._weapons)) {
      if (Number(weaponId) === inGameWeaponId) {
        return true;
      }
    }
  }
  return false;
}

function isNFTEquipped_Weapon(nftId) {
  const inGameWeapons = $dataWeapons.filter(x => x && x.nftId === nftId);
  if (inGameWeapons.length > 0) {
    const inGameWeaponId = inGameWeapons[0].id;
    for (let actorId of $gameParty._actors) {
      const actor = $gameActors.actor(actorId);

      for (let gameItem of actor._equips) {
        if (gameItem && gameItem._dataClass === "weapon" && gameItem._itemId === inGameWeaponId) {
          return true;
        }
      }
    }
  }
  return false;
}

function updateInventoryWithNFTS_Essentia(nftList) {
  const newItems = [];

  // updating player inventory
  for (let nft of nftList) {
    if (isNFTInInventory_Essentia(nft.nftId)) {
      continue;
    }

    if (isNFTEquipped_Essentia(nft.nftId)) {
      continue;
    }

    // adding new item
    $gameParty.gainMateria(new Game_Materia(nft.id), 1, false);
    newItems.push(nft);
  }

  return newItems;
}

function isNFTInInventory_Essentia(nftId) {
  const inGameArmors = $dataArmors.filter(x => x && x.nftId === nftId);
  if (inGameArmors.length > 0) {
    const inGameArmorId = inGameArmors[0].id;
    for (let materia of $gameParty._materias) {
      if (materia && Number(materia._id) === inGameArmorId) {
        return true;
      }
    }
  }
  return false;
}

function isNFTEquipped_Essentia(nftId) {
  const inGameArmors = $dataArmors.filter(x => x && x.nftId === nftId);
  if (inGameArmors.length > 0) {
    const inGameArmorId = inGameArmors[0].id;
    for (let actorId of $gameParty._actors) {
      const actor = $gameActors.actor(actorId);

      for (let materiaSlot of actor._materiaSlots) {
        for (let materia of materiaSlot.materias) {
          if (materia && Number(materia._id) === inGameArmorId) {
            return true;
          }
        }
      }

      for (let materiaSlot of actor._currentSlots) {
        for (let materia of materiaSlot.materias) {
          if (materia && Number(materia._id) === inGameArmorId) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function getAllUnequippedNFT() {
  const result = [];
  for (let nft of $ksmCachedNFT) {
    switch (nft.collection) {
      case WEAPONS_COLLECTION:
        if (!isNFTEquipped_Weapon(nft.id)) {
          result.push(nft);
        }
        break;
      case ESSENTIA_COLLECTION:
        if (!isNFTEquipped_Essentia(nft.id)) {
          result.push(nft);
        }
        break;
      default: throw new Error("getAllUnequippedNFT, unknown nft collection, id: " + collectionId);
    }
  }
  return result;
}

function getAllUnequippedNFTForCollection(collectionId) {
  const result = [];
  for (let nft of $ksmCachedNFT) {
    if (nft.collection === collectionId) {
      switch (nft.collection) {
        case WEAPONS_COLLECTION:
          if (!isNFTEquipped_Weapon(nft.id)) {
            result.push(nft);
          }
          break;
        case ESSENTIA_COLLECTION:
          if (!isNFTEquipped_Essentia(nft.id)) {
            result.push(nft);
          }
          break;
        default: throw new Error("getAllUnequippedNFT, unknown nft collection, id: " + collectionId);
      }
    }
  }
  return result;
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Data Manager

const WEAPONS_COLLECTION = "d43593c715a56da27d-VOTS";
const ESSENTIA_COLLECTION = "d43593c715a56da27d-ESSENTIA";

$ksmInfo = null;
$ksmCachedBalance = 0;
$ksmCachedBalanceHuman = 0;
$ksmCachedNFT = [];
$ksmCachedNFTOnSale = [];

let isBuying = false;
let isSelling = false;
let collectionId = "";

function KSMInfo() {
  this.initialize(...arguments);
}

KSMInfo.prototype.initialize = function () {
  this.address = "";
  this.mnemonic = "";
  this.password = "";
};

const data_manager_create_gameobjects_alias = DataManager.createGameObjects;
DataManager.createGameObjects = function () {
  data_manager_create_gameobjects_alias.call(this);
  $ksmInfo = new KSMInfo();
};

const data_manager_make_save_contents_alias = DataManager.makeSaveContents;
DataManager.makeSaveContents = function () {
  const contents = data_manager_make_save_contents_alias.call(this);
  contents.ksmInfo = $ksmInfo;
  return contents;
};

const data_manager_extract_save_contents_alias = DataManager.extractSaveContents;
DataManager.extractSaveContents = function (contents) {
  data_manager_extract_save_contents_alias.call(this, contents);
  $ksmInfo = contents.ksmInfo;
};

const data_manager_setup_newgame = DataManager.setupNewGame;
DataManager.setupNewGame = async function (isCustom, ksmPhrase, password) {
  data_manager_setup_newgame.call(this);

  if (!isCustom) {
    return;
  }

  await waitForInit();

  if (initializationFailed) {
    return;
  }

  if (ksmPhrase) {
    const response = await getNewAddressFromMnemonic(thisNFTNameInput._editWindow.phrase());

    if (response.address) {
      $ksmInfo.address = response.address;
      $ksmInfo.mnemonic = thisNFTNameInput._editWindow.phrase();
      $ksmInfo.password = "";
    }
  }

  if (!$ksmInfo || !$ksmInfo.address) {
    const response = await getNewAddress(password);
    $ksmInfo.address = response.address;
    $ksmInfo.mnemonic = response.mnemonic;
    $ksmInfo.password = password || "";
  }

  if(ksmPhrase){

  $ksmCachedBalance = (await getMyBalance($ksmInfo.address)).balance;
  $ksmCachedBalanceHuman = (await getMyBalance($ksmInfo.address)).balanceHuman;

  // loading nft
  $ksmCachedNFT = JSON.parse(await getMyNfts($ksmInfo.address));
  $ksmCachedNFTOnSale = (await getAllNFTOnSale());

  // updating database
  const nftItems = updateDatabaseWithNFTS_AutoCollections($ksmCachedNFT);

  // updating inventory
  updateInventoryWithNFTS_AutoCollections(nftItems);
  }
};

const data_manager_load_game_alias = DataManager.loadGame;
DataManager.loadGame = async function (savefileId) {
  if (initializationFailed) {
    return (await data_manager_load_game_alias.call(this, savefileId));
  }

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
      mnemonic: response.mnemonic,
      password: ""
    };

    //ksmInfoFixed = true;
  }

  if(ksmInfoFixed){

  $ksmCachedBalance = (await getMyBalance(ksmInfo.address)).balance;
  $ksmCachedBalanceHuman = (await getMyBalance(ksmInfo.address)).balanceHuman;

  // loading nft
  $ksmCachedNFT = JSON.parse(await getMyNfts(ksmInfo.address));
  $ksmCachedNFTOnSale = (await getAllNFTOnSale());

  // updating database
  const nftItems = updateDatabaseWithNFTS_AutoCollections($ksmCachedNFT);

  // original loading
  //const result = await data_manager_load_game_alias.call(this, savefileId);

  // try apply fixed ksm info
  if (ksmInfoFixed) {
    $ksmInfo = ksmInfo;
  }

  // updating inventory
  updateInventoryWithNFTS_AutoCollections(nftItems);
  }

  // original loading
  const result = await data_manager_load_game_alias.call(this, savefileId);
  return result;
  
};

// Update Loop

UpdateNFTLoop();

function UpdateNFTLoop() {
  // if we are in scene title
  if (!SceneManager._scene || SceneManager._scene instanceof Scene_Title) {
    QuickUpdateNFTLoop();
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

function QuickUpdateNFTLoop() {
  setTimeout(UpdateNFTLoop, 5000);
}

async function UpdateNFTLoopBody() {
  if (initializationFailed) {
    return;
  }

  $ksmCachedBalance = (await getMyBalance($ksmInfo.address)).balance;
  $ksmCachedBalanceHuman = (await getMyBalance($ksmInfo.address)).balanceHuman;
  OnBalanceUpdate($ksmCachedBalance);

  // loading nft
  $ksmCachedNFT = JSON.parse(await getMyNfts($ksmInfo.address));
  $ksmCachedNFTOnSale = (await getAllNFTOnSale());

  // updating database
  const nftItems = updateDatabaseWithNFTS_AutoCollections($ksmCachedNFT);

  // updating inventory
  const newItems = updateInventoryWithNFTS_AutoCollections(nftItems);

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

GlobalNewNFTItemCallbackReceiver.prototype.getLastNewNFTItem = function () {
  return this._lastNewNFTItem;
}

GlobalNewNFTItemCallbackReceiver.prototype.OnNewNFTItem = async function (newItem) {
  this._lastNewNFTItem = newItem;

  while (isBuying || isSelling) {
    await timeout(100);
  }

  if (SceneManager._scene instanceof Scene_Battle) {
    return;
  }

  SceneManager.push(Scene_NFTNotification);
};

// Scenes

//-----------------------------------------------------------------------------
// Scene_ChangeKSMEndpoint
//

function Scene_ChangeKSMEndpoint() {
  this.initialize(...arguments);
}

Scene_ChangeKSMEndpoint.prototype = Object.create(Scene_MenuBase.prototype);
Scene_ChangeKSMEndpoint.prototype.constructor = Scene_ChangeKSMEndpoint;

Scene_ChangeKSMEndpoint.prototype.initialize = function () {
  Scene_MenuBase.prototype.initialize.call(this);
  this._maxLength = 32;
};

Scene_ChangeKSMEndpoint.prototype.prepare = function (maxLength) {
  this._maxLength = maxLength;
};

Scene_ChangeKSMEndpoint.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);

  this.createEditWindow();
  this.createInputWindow();
  this._cancelButton.setClickHandler(() => {
    SoundManager.playCancel();
    SceneManager.pop();
  });
};

Scene_ChangeKSMEndpoint.prototype.start = function () {
  Scene_MenuBase.prototype.start.call(this);
  this._editWindow.refresh();
};

Scene_ChangeKSMEndpoint.prototype.createEditWindow = function () {
  const rect = this.editWindowRect();
  this._editWindow = new Window_EndpointEdit(rect);
  this._editWindow.setup($ksmEndpoints.ksmEndpoint, "ws://143.198.116.85:9944", this._maxLength);
  this.addWindow(this._editWindow);
};

Scene_ChangeKSMEndpoint.prototype.editWindowRect = function () {
  const inputWindowHeight = this.calcWindowHeight(9, true);
  const padding = $gameSystem.windowPadding();
  const ww = 600;
  const wh = ImageManager.faceHeight + padding * 2;
  const wx = (Graphics.boxWidth - ww) / 2;
  const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_ChangeKSMEndpoint.prototype.createInputWindow = function () {
  const rect = this.inputWindowRect();
  this._inputWindow = new Window_NameInput(rect);
  this._inputWindow.isKSMInput = true;
  this._inputWindow.setEditWindow(this._editWindow);
  this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
  this.addWindow(this._inputWindow);
};

Scene_ChangeKSMEndpoint.prototype.inputWindowRect = function () {
  const wx = this._editWindow.x;
  const wy = this._editWindow.y + this._editWindow.height + 8;
  const ww = this._editWindow.width;
  const wh = this.calcWindowHeight(9, true);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_ChangeKSMEndpoint.prototype.onInputOk = async function () {
  $ksmEndpoints.ksmEndpoint = this._editWindow.endpoint();
  StorageManager.saveKSMEndpoints();
  SceneManager.pop();
};

//-----------------------------------------------------------------------------
// Scene_ChangeRMRKEndpoint
//

function Scene_ChangeRMRKEndpoint() {
  this.initialize(...arguments);
}

Scene_ChangeRMRKEndpoint.prototype = Object.create(Scene_MenuBase.prototype);
Scene_ChangeRMRKEndpoint.prototype.constructor = Scene_ChangeRMRKEndpoint;

Scene_ChangeRMRKEndpoint.prototype.initialize = function () {
  Scene_MenuBase.prototype.initialize.call(this);
  this._maxLength = 32;
};

Scene_ChangeRMRKEndpoint.prototype.prepare = function (maxLength) {
  this._maxLength = maxLength;
};

Scene_ChangeRMRKEndpoint.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);

  this.createEditWindow();
  this.createInputWindow();
  this._cancelButton.setClickHandler(() => {
    SoundManager.playCancel();
    SceneManager.pop();
  });
};

Scene_ChangeRMRKEndpoint.prototype.start = function () {
  Scene_MenuBase.prototype.start.call(this);
  this._editWindow.refresh();
};

Scene_ChangeRMRKEndpoint.prototype.createEditWindow = function () {
  const rect = this.editWindowRect();
  this._editWindow = new Window_EndpointEdit(rect);
  this._editWindow.setup($ksmEndpoints.rmrkEndpoint, "http://143.198.116.85:3000", this._maxLength);
  this.addWindow(this._editWindow);
};

Scene_ChangeRMRKEndpoint.prototype.editWindowRect = function () {
  const inputWindowHeight = this.calcWindowHeight(9, true);
  const padding = $gameSystem.windowPadding();
  const ww = 600;
  const wh = ImageManager.faceHeight + padding * 2;
  const wx = (Graphics.boxWidth - ww) / 2;
  const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_ChangeRMRKEndpoint.prototype.createInputWindow = function () {
  const rect = this.inputWindowRect();
  this._inputWindow = new Window_NameInput(rect);
  this._inputWindow.isKSMInput = true;
  this._inputWindow.setEditWindow(this._editWindow);
  this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
  this.addWindow(this._inputWindow);
};

Scene_ChangeRMRKEndpoint.prototype.inputWindowRect = function () {
  const wx = this._editWindow.x;
  const wy = this._editWindow.y + this._editWindow.height + 8;
  const ww = this._editWindow.width;
  const wh = this.calcWindowHeight(9, true);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_ChangeRMRKEndpoint.prototype.onInputOk = async function () {
  $ksmEndpoints.rmrkEndpoint = this._editWindow.endpoint();
  StorageManager.saveKSMEndpoints();
  SceneManager.pop();
};


//-----------------------------------------------------------------------------
// Scene_NFTShop
//

function Scene_NFTShop() {
  this.initialize(...arguments);
}

Scene_NFTShop.prototype = Object.create(Scene_MenuBase.prototype);
Scene_NFTShop.prototype.constructor = Scene_NFTShop;

Scene_NFTShop.prototype.initialize = function () {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_NFTShop.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);
  this.createHelpWindow();
  this.createKSMAddressWindow();
  this.createKSMBalanceWindow();
  this.createCommandWindow();
  this.createDummyWindow();
  this.createStatusWindow();
  this.createBuyWindow();
  this.createSellWindow();
  this.createCategoryWindow();
  this.createBuyConfirmWindow();
  this.createPriceEditWindow();
  this.createPriceInputWindow();
  this.createCancelNFTSellWindow();
};

Scene_NFTShop.prototype.createKSMAddressWindow = function () {
  const rect = this.ksmAddressWindowRect();
  this._ksmAddressWindow = new Window_KSMAddress(rect);
  this.addWindow(this._ksmAddressWindow);
};

Scene_NFTShop.prototype.ksmAddressWindowRect = function () {
  const ww = Graphics.boxWidth - 100;
  const wh = 50;
  const wx = 0;
  const wy = 0;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createKSMBalanceWindow = function () {
  const rect = this.ksmBalanceWindowRect();
  this._ksmBalanceWindow = new Window_KSMBalance(rect);
  this._ksmBalanceWindow.open();
  this.addWindow(this._ksmBalanceWindow);
};

Scene_NFTShop.prototype.ksmBalanceWindowRect = function () {
  const ww = this.mainCommandWidth();
  const wh = this.calcWindowHeight(1, true);
  const wx = Graphics.boxWidth - ww;
  const wy = this.mainAreaTop();
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createCommandWindow = function () {
  const rect = this.commandWindowRect();
  this._commandWindow = new Window_ShopCommand(rect);
  this._commandWindow.setPurchaseOnly(this._purchaseOnly);
  this._commandWindow.y = this.mainAreaTop();
  this._commandWindow.setHandler("buy", this.commandBuy.bind(this));
  this._commandWindow.setHandler("sell", this.commandSell.bind(this));
  this._commandWindow.setHandler("cancel", this.popScene.bind(this));
  this.addWindow(this._commandWindow);
};

Scene_NFTShop.prototype.commandWindowRect = function () {
  const wx = 0;
  const wy = this.mainAreaTop();
  const ww = this._ksmBalanceWindow.x;
  const wh = this.calcWindowHeight(1, true);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createDummyWindow = function () {
  const rect = this.dummyWindowRect();
  this._dummyWindow = new Window_Base(rect);
  this.addWindow(this._dummyWindow);
};

Scene_NFTShop.prototype.dummyWindowRect = function () {
  const wx = 0;
  const wy = this._commandWindow.y + this._commandWindow.height;
  const ww = Graphics.boxWidth;
  const wh = this.mainAreaHeight() - this._commandWindow.height;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createStatusWindow = function () {
  const rect = this.statusWindowRect();
  this._statusWindow = new Window_NFTShopStatus(rect);
  this._statusWindow.hide();
  this.addWindow(this._statusWindow);
};

Scene_NFTShop.prototype.statusWindowRect = function () {
  const ww = this.statusWidth();
  const wh = this._dummyWindow.height;
  const wx = Graphics.boxWidth - ww;
  const wy = this._dummyWindow.y;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createBuyWindow = function () {
  const rect = this.buyWindowRect();
  this._buyWindow = new Window_NFTShopBuy(rect);
  this._buyWindow.setHelpWindow(this._helpWindow);
  this._buyWindow.setStatusWindow(this._statusWindow);
  this._buyWindow.hide();
  this._buyWindow.setHandler("ok", this.onBuyOk.bind(this));
  this._buyWindow.setHandler("cancel", this.onBuyCancel.bind(this));
  this.addWindow(this._buyWindow);
};

Scene_NFTShop.prototype.buyWindowRect = function () {
  const wx = 0;
  const wy = this._dummyWindow.y;
  const ww = Graphics.boxWidth - this.statusWidth();
  const wh = this._dummyWindow.height;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createSellWindow = function () {
  const rect = this.sellWindowRect();
  this._sellWindow = new Window_NFTShopSell(rect);
  this._sellWindow.setHelpWindow(this._helpWindow);
  this._sellWindow.setStatusWindow(this._statusWindow);
  this._sellWindow.hide();
  this._sellWindow.setHandler("ok", this.onSellOk.bind(this));
  this._sellWindow.setHandler("cancel", this.onSellCancel.bind(this));
  this.addWindow(this._sellWindow);
};

Scene_NFTShop.prototype.sellWindowRect = function () {
  const wx = 0;
  const wy = this._dummyWindow.y;
  const ww = Graphics.boxWidth;
  const wh = this._dummyWindow.height;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createPriceInputWindow = function () {
  const rect = this.priceInputWindowRect();
  this._priceInputWindow = new Window_PriceInput(rect);
  this._priceInputWindow.hide();
  this._priceInputWindow.setEditWindow(this._priceEditWindow);
  this._priceInputWindow.setHandler("ok", this.onPriceInputOk.bind(this));
  this.addWindow(this._priceInputWindow);
};

Scene_NFTShop.prototype.priceInputWindowRect = function () {
  const wx = 0;
  const wy = this._dummyWindow.y + this._priceEditWindow.height;
  const ww = Graphics.boxWidth;
  const wh = this._dummyWindow.height - this._priceEditWindow.height;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createPriceEditWindow = function () {
  const rect = this.priceEditWindowRect();
  this._priceEditWindow = new Window_PriceEdit(rect);
  this._priceEditWindow.hide();
  this._priceEditWindow.setup(48);
  this.addWindow(this._priceEditWindow);
};

Scene_NFTShop.prototype.priceEditWindowRect = function () {
  const wx = 0;
  const wy = this._dummyWindow.y;
  const ww = Graphics.boxWidth;
  const wh = 70;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createCancelNFTSellWindow = function () {
  const rect = this.cancelNFTSellWindowRect();
  this._cancelNFTSellWindow = new Window_CancelNFTSell(rect);
  this._cancelNFTSellWindow.setHandler("ok", this.onCancelNFTSellOk.bind(this));
  this._cancelNFTSellWindow.setHandler("cancel", this.onCancelNFTSellCancel.bind(this));
  this._cancelNFTSellWindow.hide();
  this.addWindow(this._cancelNFTSellWindow);
};

Scene_NFTShop.prototype.cancelNFTSellWindowRect = function () {
  const wx = 0;
  const wy = this._dummyWindow.y;
  const ww = Graphics.boxWidth;
  const wh = this._dummyWindow.height;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createCategoryWindow = function () {
  const rect = this.categoryWindowRect();
  this._categoryWindow = new Window_ItemCategory(rect);
  this._categoryWindow.setHelpWindow(this._helpWindow);
  this._categoryWindow.hide();
  this._categoryWindow.deactivate();
  this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
  this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));
  this.addWindow(this._categoryWindow);
};

Scene_NFTShop.prototype.categoryWindowRect = function () {
  const wx = 0;
  const wy = this._dummyWindow.y;
  const ww = Graphics.boxWidth;
  const wh = this.calcWindowHeight(1, true);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.createBuyConfirmWindow = function () {
  const rect = this.buyConfirmWindowRect();
  this._buyConfirmWindow = new Window_NFTBuyConfirm(rect);
  this._buyConfirmWindow.hide();
  this._buyConfirmWindow.setHandler("ok", this.onBuyConfirmOk.bind(this));
  this._buyConfirmWindow.setHandler("cancel", this.onBuyConfirmCancel.bind(this));
  this.addWindow(this._buyConfirmWindow);
};

Scene_NFTShop.prototype.buyConfirmWindowRect = function () {
  const wx = 0;
  const wy = this._dummyWindow.y;
  const ww = Graphics.boxWidth - this.statusWidth();
  const wh = this._dummyWindow.height;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTShop.prototype.statusWidth = function () {
  return 352;
};

Scene_NFTShop.prototype.activateBuyWindow = function () {
  this._buyWindow.show();
  this._buyWindow.activate();
  this._statusWindow.show();
};

Scene_NFTShop.prototype.activateSellWindow = function () {
  if (this._categoryWindow.needsSelection()) {
    //this._categoryWindow.show();
  }
  this._sellWindow.refresh();
  this._sellWindow.show();
  this._sellWindow.activate();
  this._statusWindow.hide();
};

Scene_NFTShop.prototype.commandBuy = function () {
  this._dummyWindow.hide();
  this.activateBuyWindow();
};

Scene_NFTShop.prototype.commandSell = function () {
  this._dummyWindow.hide();
  this.activateSellWindow();
};

Scene_NFTShop.prototype.onBuyOk = function () {
  this._item = this._buyWindow.item();
  this._buyWindow.hide();
  this._buyConfirmWindow.show();
  this._buyConfirmWindow.activate();
};

Scene_NFTShop.prototype.onBuyCancel = function () {
  this._commandWindow.activate();
  this._dummyWindow.show();
  this._buyWindow.hide();
  this._statusWindow.hide();
  this._statusWindow.setItem(null);
  this._helpWindow.clear();
};

Scene_NFTShop.prototype.onSellOk = function () {
  this._item = this._sellWindow.item();
  this._sellWindow.hide();

  // if (_item.id == null) {
  //   print("Id value not found");
  // }
  // else 
  {
    if ($ksmCachedNFTOnSale.some(e => e.id === this._item.id)) {
      this._cancelNFTSellWindow.show();
      this._cancelNFTSellWindow.activate();
    } else {
      this._helpWindow.setText("Please enter the price of the item being sold");
      this._priceInputWindow.show();
      this._priceInputWindow.activate();
      this._priceEditWindow.show();
      this._priceEditWindow.clear();
    }
  }
};

Scene_NFTShop.prototype.onSellCancel = function () {
  this._commandWindow.activate();
  this._dummyWindow.show();
  this._sellWindow.hide();
  this._statusWindow.hide();
  this._statusWindow.setItem(null);
  this._helpWindow.clear();
};

Scene_NFTShop.prototype.onCategoryOk = function () {
  this.activateSellWindow();
  this._sellWindow.select(0);
};

Scene_NFTShop.prototype.onCategoryCancel = function () {
  this._commandWindow.activate();
  this._dummyWindow.show();
  this._categoryWindow.hide();
  this._sellWindow.hide();
};

Scene_NFTShop.prototype.onBuyConfirmOk = async function () {
  isBuying = true;

  SceneManager.push(Scene_Spinner);
  SceneManager._nextScene.setLoadingPrefix("Buying");
  let signer = await getNewAddressFromMnemonic($ksmInfo.mnemonic);
  let result = false;
  let error = "";
  try {
    result = await buyNft(signer, this._item.id, this._item.owner, this._item.forsale);
  } catch (e) {
    error = e.message;
    result = false;
  }
  await timeout(1000);
  if (result) {
    SceneManager._scene.setText("Purchase success");
  } else {
    SceneManager._scene.setText("Purchase error");
  }
  await timeout(2000);
  SceneManager.pop();
  await UpdateNFTLoopBody();
  while (!SceneManager._scene._buyWindow) {
    await timeout(100);
  }
  await timeout(100);

  SceneManager._scene._commandWindow.forceSelect(0);
  SceneManager._scene._commandWindow.updateInputData();
  SceneManager._scene._commandWindow.deactivate();
  SceneManager._scene._commandWindow.callOkHandler();

  await timeout(5000);
  isBuying = false;
};

Scene_NFTShop.prototype.onBuyConfirmCancel = function () {
  this._buyConfirmWindow.hide();
  this._buyConfirmWindow.deactivate();
  this._buyWindow.show();
  this._buyWindow.activate();
};

Scene_NFTShop.prototype.onPriceInputOk = async function () {
  isSelling = true;

  const item = this._item;
  const price = this._priceEditWindow.price();
  // const price = BigInt(this._priceEditWindow.price());

  SceneManager.push(Scene_Spinner);
  SceneManager._nextScene.setLoadingPrefix("Selling");
  let signer = await getNewAddressFromMnemonic($ksmInfo.mnemonic);
  let result = false;
  let error = "";
  try {
    result = await listNft(signer, item.id, price);
  } catch (e) {
    error = e.message;
    result = false;
  }
  await timeout(1000);
  if (result) {
    SceneManager._scene.setText("The item is for sale successfully");
  } else {
    SceneManager._scene.setText("The item is not for sale due to an error");
  }
  await timeout(2000);
  SceneManager.pop();

  await UpdateNFTLoopBody();

  while (!SceneManager._scene._sellWindow) {
    await timeout(100);
  }
  await timeout(100);

  SceneManager._scene._commandWindow.forceSelect(1);
  SceneManager._scene._commandWindow.updateInputData();
  SceneManager._scene._commandWindow.deactivate();
  SceneManager._scene._commandWindow.callOkHandler();

  await timeout(5000);
  isSelling = false;
};

Scene_NFTShop.prototype.onCancelNFTSellOk = async function () {
  const item = this._item;

  SceneManager.push(Scene_Spinner);
  SceneManager._nextScene.setLoadingPrefix("Cancelling");
  let signer = await getNewAddressFromMnemonic($ksmInfo.mnemonic);
  let result = false;
  let error = "";
  try {
    result = await listNft(signer, item.id, 0);
  } catch (e) {
    error = e.message;
    result = false;
  }
  await timeout(1000);
  if (result) {
    SceneManager._scene.setText("The item has been successfully withdrawn from sale");
  } else {
    SceneManager._scene.setText("The item has not been withdrawn from sale due to an error");
  }
  await timeout(2000);
  SceneManager.pop();

  await UpdateNFTLoopBody();

  while (!SceneManager._scene._sellWindow) {
    await timeout(100);
  }
  await timeout(100);

  SceneManager._scene._commandWindow.forceSelect(1);
  SceneManager._scene._commandWindow.updateInputData();
  SceneManager._scene._commandWindow.deactivate();
  SceneManager._scene._commandWindow.callOkHandler();
};

Scene_NFTShop.prototype.onCancelNFTSellCancel = function () {
  this._cancelNFTSellWindow.hide();
  this._cancelNFTSellWindow.deactivate();
  this._sellWindow.show();
  this._sellWindow.activate();
};

//-----------------------------------------------------------------------------
// Scene_Spinner
//

function Scene_Spinner() {
  this.initialize(...arguments);
}

Scene_Spinner.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Spinner.prototype.constructor = Scene_Spinner;

Scene_Spinner.prototype.create = function () {
  Scene_Base.prototype.create.call(this);
  this.createBackground();
  this.updateActor();
  this.createWindowLayer();
  this.createWindow();
};

Scene_Spinner.prototype.createWindow = function () {
  const width = Graphics.boxWidth;
  const height = Graphics.boxHeight;
  const rect = new Rectangle(Graphics.boxWidth / 2 - width / 2, Graphics.boxHeight / 2 - height / 2, width, height);
  this._windowSpinner = new Window_Spinner(rect);
  this._windowSpinner._loadingPrefix = this._loadingPrefix;
  this._windowSpinner._text = this._text;
  this.addWindow(this._windowSpinner);
};

Scene_Spinner.prototype.setLoadingPrefix = function (loadingPrefix) {
  this._loadingPrefix = loadingPrefix;
  if (this._windowSpinner) {
    this._windowSpinner._loadingPrefix = loadingPrefix;
  }
};

Scene_Spinner.prototype.setText = function (text) {
  this._text = text;
  if (this._windowSpinner) {
    this._windowSpinner._text = text;
  }
};

//-----------------------------------------------------------------------------
// Scene_NFTNotification
//

function Scene_NFTNotification() {
  this.initialize(...arguments);
}

Scene_NFTNotification.prototype = Object.create(Scene_MenuBase.prototype);
Scene_NFTNotification.prototype.constructor = Scene_NFTNotification;

Scene_NFTNotification.prototype.initialize = function () {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_NFTNotification.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);

  this.createWindow();
  this._cancelButton.setClickHandler(() => {
    SoundManager.playCancel();
    SceneManager.pop();
  });
};

Scene_NFTNotification.prototype.createWindow = function () {
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

Scene_SelectKSMAddress.prototype.initialize = function () {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_SelectKSMAddress.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);

  this.createWindow();
  this._cancelButton.setClickHandler(() => {
    SoundManager.playCancel();
    SceneManager.pop();
  });
};

Scene_SelectKSMAddress.prototype.createWindow = function () {
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
  SceneManager.push(Scene_EncryptConfirm);
};

Scene_SelectKSMAddress.prototype.commandImportKSMAddress = function () {
  SceneManager.push(Scene_NFTPhrase);
};

//-----------------------------------------------------------------------------
// Scene_EncryptConfirm
//

function Scene_EncryptConfirm() {
  this.initialize(...arguments);
}

Scene_EncryptConfirm.prototype = Object.create(Scene_MenuBase.prototype);
Scene_EncryptConfirm.prototype.constructor = Scene_EncryptConfirm;

Scene_EncryptConfirm.prototype.initialize = function () {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_EncryptConfirm.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);

  this.createWindow();
  this._cancelButton.setClickHandler(() => {
    SoundManager.playCancel();
    SceneManager.pop();
  });
};

Scene_EncryptConfirm.prototype.createWindow = function () {
  const width = 450;
  const height = 170;
  const rect = new Rectangle(Graphics.boxWidth / 2 - width / 2, Graphics.boxHeight - height - 125, width, height);
  this._encryptConfirm = new Window_EncryptConfirm(rect);
  this._encryptConfirm.setMessage("Do you want to add a password?");
  this._encryptConfirm.setHandler("yes", this.commandYes.bind(this));
  this._encryptConfirm.setHandler("cancel", this.commandNo.bind(this));
  this.addWindow(this._encryptConfirm);
};

Scene_EncryptConfirm.prototype.commandYes = async function () {
  SceneManager.push(Scene_EncryptEnter);
};

Scene_EncryptConfirm.prototype.commandNo = async function () {
  this.fadeOutAll();
  await DataManager.setupNewGame(true);
  SceneManager.goto(Scene_Map);
};

//-----------------------------------------------------------------------------
// Scene_EncryptEnter
//

function Scene_EncryptEnter() {
  this.initialize(...arguments);
}

Scene_EncryptEnter.prototype = Object.create(Scene_MenuBase.prototype);
Scene_EncryptEnter.prototype.constructor = Scene_EncryptEnter;

Scene_EncryptEnter.prototype.initialize = function () {
  Scene_MenuBase.prototype.initialize.call(this);
  this._maxLength = 32;
};

Scene_EncryptEnter.prototype.prepare = function (maxLength) {
  this._maxLength = maxLength;
};

Scene_EncryptEnter.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);

  this.createEditWindow();
  this.createInputWindow();
  this._cancelButton.setClickHandler(() => {
    SoundManager.playCancel();
    SceneManager.pop();
  });
};

Scene_EncryptEnter.prototype.start = function () {
  Scene_MenuBase.prototype.start.call(this);
  this._editWindow.refresh();
};

Scene_EncryptEnter.prototype.createEditWindow = function () {
  const rect = this.editWindowRect();
  this._editWindow = new Window_EncryptEdit(rect);
  this._editWindow.setup("", "", this._maxLength);
  this.addWindow(this._editWindow);
};

Scene_EncryptEnter.prototype.editWindowRect = function () {
  const inputWindowHeight = this.calcWindowHeight(9, true);
  const padding = $gameSystem.windowPadding();
  const ww = 600;
  const wh = ImageManager.faceHeight + padding * 2;
  const wx = (Graphics.boxWidth - ww) / 2;
  const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_EncryptEnter.prototype.createInputWindow = function () {
  const rect = this.inputWindowRect();
  this._inputWindow = new Window_NameInput(rect);
  this._inputWindow.isKSMInput = true;
  this._inputWindow.setEditWindow(this._editWindow);
  this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
  this.addWindow(this._inputWindow);
};

Scene_EncryptEnter.prototype.inputWindowRect = function () {
  const wx = this._editWindow.x;
  const wy = this._editWindow.y + this._editWindow.height + 8;
  const ww = this._editWindow.width;
  const wh = this.calcWindowHeight(9, true);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_EncryptEnter.prototype.onInputOk = async function () {
  this.fadeOutAll();
  await DataManager.setupNewGame(true, "", this._editWindow.encryptPassword());
  SceneManager.goto(Scene_Map);
};

//-----------------------------------------------------------------------------
// Scene_NFTPhrase
//

function Scene_NFTPhrase() {
  this.initialize(...arguments);
}

Scene_NFTPhrase.prototype = Object.create(Scene_MenuBase.prototype);
Scene_NFTPhrase.prototype.constructor = Scene_NFTPhrase;

Scene_NFTPhrase.prototype.initialize = function () {
  thisNFTNameInput = this;
  Scene_MenuBase.prototype.initialize.call(this);
  this._maxLength = 128;
};

Scene_NFTPhrase.prototype.prepare = function (maxLength) {
  this._maxLength = maxLength;
};

Scene_NFTPhrase.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);

  this.createEditWindow();
  this.createInputWindow();
  this._cancelButton.setClickHandler(() => {
    SoundManager.playCancel();
    SceneManager.pop();
  });
};

Scene_NFTPhrase.prototype.start = function () {
  Scene_MenuBase.prototype.start.call(this);
  this._editWindow.refresh();
};

Scene_NFTPhrase.prototype.createEditWindow = function () {
  const rect = this.editWindowRect();
  this._editWindow = new Window_PhraseEdit(rect);
  this._editWindow.setup(this._maxLength);
  this.addWindow(this._editWindow);
};

Scene_NFTPhrase.prototype.editWindowRect = function () {
  const inputWindowHeight = this.calcWindowHeight(9, true);
  const padding = $gameSystem.windowPadding();
  const ww = 600;
  const wh = ImageManager.faceHeight + padding * 2;
  const wx = (Graphics.boxWidth - ww) / 2;
  const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTPhrase.prototype.createInputWindow = function () {
  const rect = this.inputWindowRect();
  this._inputWindow = new Window_NameInput(rect);
  this._inputWindow.isKSMInput = true;
  this._inputWindow.setEditWindow(this._editWindow);
  this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
  this.addWindow(this._inputWindow);
};

Scene_NFTPhrase.prototype.inputWindowRect = function () {
  const wx = this._editWindow.x;
  const wy = this._editWindow.y + this._editWindow.height + 8;
  const ww = this._editWindow.width;
  const wh = this.calcWindowHeight(9, true);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_NFTPhrase.prototype.onInputOk = async function () {
  this.fadeOutAll();
  await DataManager.setupNewGame(true, this._editWindow.phrase());
  SceneManager.goto(Scene_Map);
};

// Windows

//-----------------------------------------------------------------------------
// Window_NFTShopStatus
//

function Window_NFTShopStatus() {
  this.initialize(...arguments);
}

Window_NFTShopStatus.prototype = Object.create(Window_ShopStatus.prototype);
Window_NFTShopStatus.prototype.constructor = Window_NFTShopStatus;

Window_NFTShopStatus.prototype.initialize = function (rect) {
  Window_ShopStatus.prototype.initialize.call(this, rect);
};

Window_ShopStatus.prototype.isEquipItem = function () {
  return true;
};

//-----------------------------------------------------------------------------
// Window_EndpointEdit
//

function Window_EndpointEdit() {
  this.initialize(...arguments);
}

Window_EndpointEdit.prototype = Object.create(Window_StatusBase.prototype);
Window_EndpointEdit.prototype.constructor = Window_EndpointEdit;

Window_EndpointEdit.prototype.initialize = function (rect) {
  Window_StatusBase.prototype.initialize.call(this, rect);
  this._maxLength = 0;
  this._endpoint = "";
  this._index = 0;
  this._defaultEndpoint = 0;
  this.deactivate();
};

Window_EndpointEdit.prototype.setup = function (currentEndpoints, defaultEndpoint, maxLength) {
  this._maxLength = maxLength;
  this._endpoint = currentEndpoints.slice(0, this._maxLength);
  this._index = this._endpoint.length;
  this._defaultEndpoint = defaultEndpoint;
};

Window_EndpointEdit.prototype.endpoint = function () {
  return this._endpoint;
};

Window_EndpointEdit.prototype.restoreDefault = function () {
  this._endpoint = this._defaultEndpoint;
  this._index = this._endpoint.length;
  this.refresh();
  return this._endpoint.length > 0;
};

Window_EndpointEdit.prototype.add = function (ch) {
  if (this._index < this._maxLength) {
    this._endpoint += ch;
    this._index++;
    this.refresh();
    return true;
  } else {
    return false;
  }
};

Window_EndpointEdit.prototype.back = function () {
  if (this._index > 0) {
    this._index--;
    this._endpoint = this._endpoint.slice(0, this._index);
    this.refresh();
    return true;
  } else {
    return false;
  }
};

Window_EndpointEdit.prototype.charWidth = function () {
  return this.textWidth("A");
};

Window_EndpointEdit.prototype.left = function () {
  const endpointCenter = this.innerWidth / 2;
  const endpointWidth = (this._maxLength + 1) * this.charWidth();
  return Math.min(endpointCenter - endpointWidth / 2, this.innerWidth - endpointWidth);
};

Window_EndpointEdit.prototype.itemRect = function (index) {
  const x = this.left() + index * this.charWidth();
  const y = 54;
  const width = this.charWidth();
  const height = this.lineHeight();
  return new Rectangle(x, y, width, height);
};

Window_EndpointEdit.prototype.underlineRect = function (index) {
  const rect = this.itemRect(index);
  rect.x++;
  rect.y += rect.height - 4;
  rect.width -= 2;
  rect.height = 2;
  return rect;
};

Window_EndpointEdit.prototype.underlineColor = function () {
  return ColorManager.normalColor();
};

Window_EndpointEdit.prototype.drawUnderline = function (index) {
  const rect = this.underlineRect(index);
  const color = this.underlineColor();
  this.contents.paintOpacity = 48;
  this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
  this.contents.paintOpacity = 255;
};

Window_EndpointEdit.prototype.drawChar = function (index) {
  const rect = this.itemRect(index);
  this.resetTextColor();
  this.drawText(this._endpoint[index] || "", rect.x, rect.y);
};

Window_EndpointEdit.prototype.refresh = function () {
  this.contents.clear();
  for (let i = 0; i < this._maxLength; i++) {
    this.drawUnderline(i);
  }
  for (let j = 0; j < this._endpoint.length; j++) {
    this.drawChar(j);
  }
  const rect = this.itemRect(this._index);
  this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};

//-----------------------------------------------------------------------------
// Window_CancelNFTSell
//

function Window_CancelNFTSell() {
  this.initialize(...arguments);
}

Window_CancelNFTSell.prototype = Object.create(Window_Command.prototype);
Window_CancelNFTSell.prototype.constructor = Window_CancelNFTSell;

Window_CancelNFTSell.prototype.initialize = function (rect) {
  Window_Command.prototype.initialize.call(this, rect);
};

Window_CancelNFTSell.prototype.makeCommandList = function () {
  this.addCommand("Yes", "ok");
  this.addCommand("Cancel", "cancel");
};

Window_CancelNFTSell.prototype.refresh = function () {
  Window_Command.prototype.refresh.call(this);
  this.drawText("Are you sure you want to withdraw the item from sale?", 0, this.height / 2 - 80, this.width, "center");
};

const window_cancel_nft_sell_itemrect_alias = Window_Command.prototype.itemRect;
Window_CancelNFTSell.prototype.itemRect = function (index) {
  let rectangle = window_cancel_nft_sell_itemrect_alias.call(this, index);
  rectangle.y += this.height / 2 - 30;
  return rectangle;
};

//-----------------------------------------------------------------------------
// Window_PriceEdit
//

function Window_PriceEdit() {
  this.initialize(...arguments);
}

Window_PriceEdit.prototype = Object.create(Window_StatusBase.prototype);
Window_PriceEdit.prototype.constructor = Window_PriceEdit;

Window_PriceEdit.prototype.initialize = function (rect) {
  Window_StatusBase.prototype.initialize.call(this, rect);
  this._maxLength = 64;
  this._price = "";
  this._index = 0;
  this._defaultPrice = "0";
  this.deactivate();
};

Window_PriceEdit.prototype.setup = function (maxLength) {
  this._maxLength = maxLength;
  this._price = "";
  this._index = this._price.length;
  this._defaultPrice = "0";
  this.refresh();
};

Window_PriceEdit.prototype.price = function () {
  return this._price;
};

Window_PriceEdit.prototype.restoreDefault = function () {
  this._price = this._defaultPrice;
  this._index = this._price.length;
  this.refresh();
  return this._price.length > 0;
};

Window_PriceEdit.prototype.add = function (ch) {
  if (this._index < this._maxLength) {
    this._price += ch;
    this._index++;
    this.refresh();
    return true;
  } else {
    return false;
  }
};

Window_PriceEdit.prototype.back = function () {
  if (this._index > 0) {
    this._index--;
    this._price = this._price.slice(0, this._index);
    this.refresh();
    return true;
  } else {
    return false;
  }
};

Window_PriceEdit.prototype.clear = function () {
  this._price = "";
  this._index = this._price.length;
  this._defaultPrice = "0";
  this.refresh();
};

Window_PriceEdit.prototype.charWidth = function () {
  const text = "0";
  return this.textWidth(text);
};

Window_PriceEdit.prototype.left = function () {
  const priceCenter = this.innerWidth / 2;
  const priceWidth = (this._maxLength + 1) * this.charWidth();
  return Math.min(priceCenter - priceWidth / 2, this.innerWidth - priceWidth);
};

Window_PriceEdit.prototype.itemRect = function (index) {
  const x = this.left() + index * this.charWidth();
  const y = 5;
  const width = this.charWidth();
  const height = this.lineHeight();
  return new Rectangle(x, y, width, height);
};

Window_PriceEdit.prototype.underlineRect = function (index) {
  const rect = this.itemRect(index);
  rect.x++;
  rect.y += rect.height - 4;
  rect.width -= 2;
  rect.height = 2;
  return rect;
};

Window_PriceEdit.prototype.underlineColor = function () {
  return ColorManager.normalColor();
};

Window_PriceEdit.prototype.drawUnderline = function (index) {
  const rect = this.underlineRect(index);
  const color = this.underlineColor();
  this.contents.paintOpacity = 48;
  this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
  this.contents.paintOpacity = 255;
};

Window_PriceEdit.prototype.drawChar = function (index) {
  const rect = this.itemRect(index);
  this.resetTextColor();
  this.drawText(this._price[index] || "", rect.x, rect.y);
};

Window_PriceEdit.prototype.refresh = function () {
  this.contents.clear();
  this.contents.fillAll("rgba(0,0,0,0)");
  for (let i = 0; i < this._maxLength; i++) {
    this.drawUnderline(i);
  }
  for (let j = 0; j < this._price.length; j++) {
    this.drawChar(j);
  }
  const rect = this.itemRect(this._index);
  this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};

//-----------------------------------------------------------------------------
// Window_PriceInput
//

function Window_PriceInput() {
  this.initialize(...arguments);
}

Window_PriceInput.prototype = Object.create(Window_Selectable.prototype);
Window_PriceInput.prototype.constructor = Window_PriceInput;
Window_PriceInput.prototype.decimalEntered = new Boolean(false);

// prettier-ignore
Window_PriceInput.DIGITS =
  ["0", "1", "2", "3", "4",
    "5", "6", "7", "8", "9", ".",
    "Clear", "OK"];

Window_PriceInput.prototype.initialize = function (rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this._editWindow = null;
  this._index = 0;
  this.decimalEntered = false;
};

Window_PriceInput.prototype.setEditWindow = function (editWindow) {
  this._editWindow = editWindow;
  this.refresh();
  this.updateCursor();
  this.activate();
};

Window_PriceInput.prototype.table = function () {
  return Window_PriceInput.DIGITS;
};

Window_PriceInput.prototype.maxCols = function () {
  return 5;
};

Window_PriceInput.prototype.maxItems = function () {
  return 13;
};

Window_PriceInput.prototype.itemWidth = function () {
  return Math.floor((this.innerWidth - this.groupSpacing()) / 10);
};

Window_PriceInput.prototype.groupSpacing = function () {
  return 12;
};

Window_PriceInput.prototype.character = function () {
  const tempValue = this._index < 11 ? this.table()[this._index] : "";
  return tempValue;
};

Window_PriceInput.prototype.isClear = function () {
  return this._index === 11;
};

Window_PriceInput.prototype.isOk = function () {
  return this._index === 12;
};

Window_PriceInput.prototype.itemRect = function (index) {
  const itemWidth = this.itemWidth();
  const itemHeight = this.itemHeight();
  const colSpacing = this.colSpacing();
  const rowSpacing = this.rowSpacing();
  const groupSpacing = this.groupSpacing();
  let col = index % this.maxCols();
  if (index === 11) col = 3;
  if (index === 12) col = 4;
  //const x = col * itemWidth + group * groupSpacing + colSpacing / 2;
  let x = col * itemWidth + 0 * groupSpacing + colSpacing / 2;
  const y = Math.floor(index / this.maxCols()) * itemHeight + rowSpacing / 2;
  const width = itemWidth - colSpacing;
  const height = itemHeight - rowSpacing;

  x += this.innerWidth / 2 - (this.maxCols() * this.itemWidth() + (this.maxCols() - 2) * this.colSpacing()) / 2;
  return new Rectangle(x, y, width, height);
};

Window_PriceInput.prototype.drawItem = function (index) {
  const table = this.table();
  const character = table[index];
  const rect = this.itemLineRect(index);
  this.drawText(character, rect.x, rect.y, rect.width, "center");
};

Window_PriceInput.prototype.updateCursor = function () {
  const rect = this.itemRect(this._index);
  this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};

Window_PriceInput.prototype.isCursorMovable = function () {
  return this.active;
};

Window_PriceInput.prototype.cursorDown = function (wrap) {
  if (this._index < this.maxCols()) {
    this._index = this._index + this.maxCols();
  }
  else if (this._index < 9) {
    this._index = 10;
  }
  else if (this._index < 10) {
    this._index = 11;
  }

  else if (this._index < 11) {
    this._index = 12;
  }

};

Window_PriceInput.prototype.cursorUp = function (wrap) {
  if (this._index >= 10) {
    this._index = this._index - 2;
  }
  else if (this._index >= this.maxCols()) {
    this._index = this._index - this.maxCols();
  }
};

Window_PriceInput.prototype.cursorRight = function (wrap) {
  if (this._index < 12) {
    this._index++;
  }
};

Window_PriceInput.prototype.cursorLeft = function (wrap) {
  if (this._index > 0) {
    this._index--;
  }
};

Window_PriceInput.prototype.processCursorMove = function () {
  Window_Selectable.prototype.processCursorMove.call(this);
  this.updateCursor();
};

Window_PriceInput.prototype.processHandling = function () {
  if (this.isOpen() && this.active) {
    if (Input.isTriggered("shift")) {
      this.processJump();
    }
    if (Input.isRepeated("cancel")) {
      this.processBack();
    }
    if (Input.isRepeated("ok")) {
      this.processOk();
    }
  }
};

Window_PriceInput.prototype.isCancelEnabled = function () {
  return true;
};

Window_PriceInput.prototype.processCancel = function () {
  this.processBack();
};

Window_PriceInput.prototype.processJump = function () {
  if (this._index !== 12) {
    this._index = 12;
    this.playCursorSound();
  }
};

Window_PriceInput.prototype.processBack = function () {
  SceneManager._scene._priceInputWindow.hide();
  SceneManager._scene._priceInputWindow.deactivate();
  SceneManager._scene._priceEditWindow.hide();
  SceneManager._scene._sellWindow.show();
  SceneManager._scene._sellWindow.activate();
  SceneManager._scene._helpWindow.setText("");
};

Window_PriceInput.prototype.processOk = function () {
  if (this.character()) {
    this.onPriceAdd();
  } else if (this.isOk()) {
    this.onPriceOk();
  } else if (this.isClear()) {
    this.onPriceClear();
  }
};

Window_PriceInput.prototype.onPriceAdd = function () {
  if(this.character() == "."){
    this.onDecimalEnter();
  }
  else{
    if (this._editWindow.add(this.character())) {
      this.playOkSound();
    } else {
      this.playBuzzerSound();
    }
  }
  
};

Window_PriceInput.prototype.onPriceOk = function () {
  if (this._editWindow.price() === "") {
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

Window_PriceInput.prototype.onPriceClear = function () {
  console.log(this.decimalEntered);
  if (this._editWindow.back()) {
    this.playOkSound();
  } else {
    this.playBuzzerSound();
  }
};

Window_PriceInput.prototype.onDecimalEnter = function () {
  console.log(this.decimalEntered);
  if(this.decimalEntered == false){
    this.decimalEntered = true;
    this._editWindow.add(this.character());
  }
  else{
    console.log("decimal already exists");
  }
};

//-----------------------------------------------------------------------------
// Window_Spinner
//

function Window_Spinner() {
  this.initialize(...arguments);
}

Window_Spinner.prototype = Object.create(Window_Base.prototype);
Window_Spinner.prototype.constructor = Window_Spinner;

Window_Spinner.prototype.initialize = function (rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this._dots = 0;
  this._dotsUpdateFrame = 0;
  this._loadingPrefix = "";
  this._text = "";
};

Window_Spinner.prototype.update = function () {
  Window_Base.prototype.update.call(this);
  this.contents.clear();
  this.contents.paintOpacity = 100;
  this.contents.fillAll("rgb(0, 0, 0)");
  this.contents.paintOpacity = 255;
  if (this._text) {
    this.contents.drawText(this._text, 0, this.innerHeight / 2 - 35 / 2, this.innerWidth, 35, "center");
  } else {
    this.contents.drawText(this._loadingPrefix + ".".repeat(this._dots), 0, this.innerHeight / 2 - 35 / 2, this.innerWidth, 35, "center");
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

Window_Spinner.prototype.updatePadding = function () {
  this.padding = -5;
};

Window_Spinner.prototype._refreshFrame = function () {

};

Window_Spinner.prototype._refreshBack = function () {

};

//-----------------------------------------------------------------------------
// Window_NFTShopBuy
//

function Window_NFTShopBuy() {
  this.initialize(...arguments);
}

Window_NFTShopBuy.prototype = Object.create(Window_Selectable.prototype);
Window_NFTShopBuy.prototype.constructor = Window_NFTShopBuy;

Window_NFTShopBuy.prototype.initialize = async function (rect) {
  Window_Selectable.prototype.initialize.call(this, rect);

  if (initialized) {
    this._nftItems = JSON.parse(await getNftsForSale(collectionId)).filter(e => e.owner !== $ksmInfo.address);
  } else {
    this._nftItems = [];
  }

  this.refresh();
  this.select(0);
  SubscribeToNewNFTItems(this);
};

Window_NFTShopBuy.prototype.destroy = function (options) {
  UnsubscribeFromNewNFTItems(this);
  Window_Selectable.prototype.destroy.call(this, options);
};

Window_NFTShopBuy.prototype.onNewNFTItem = async function (newNftItem) {
  this._nftItems = JSON.parse(await getNftsForSale(collectionId));
  this.refresh();
  this.select(0);
};

Window_NFTShopBuy.prototype.maxItems = function () {
  return this._nftItems ? this._nftItems.length : 0;
};

Window_NFTShopBuy.prototype.item = function () {
  return this.itemAt(this.index());
};

Window_NFTShopBuy.prototype.itemAt = function (index) {
  return (this._nftItems && index >= 0 && index < this._nftItems.length) ? this._nftItems[index] : null;
};

Window_NFTShopBuy.prototype.itemMetadata = function () {
  const item = this.itemAt(this.index());
  if (!item) return null;
  const metadata = JSON.parse(item.metadata);
  if (!metadata.properties) return null;
  const propGameDataValue = item ? metadata.properties.gameData.value : {};
  if (!propGameDataValue.name) propGameDataValue.name = propGameDataValue.n || "";
  if (!propGameDataValue.name) propGameDataValue.name = metadata.name || "";
  if (!propGameDataValue.description) propGameDataValue.description = metadata.description || "";
  return propGameDataValue;
};

Window_NFTShopBuy.prototype.itemMetadataAt = function (index) {
  const item = this.itemAt(index);
  if (!item) return null;
  const metadata = JSON.parse(item.metadata);
  if (!metadata.properties) return null;
  const propGameDataValue = item ? metadata.properties.gameData.value : {};
  if (!propGameDataValue.name) propGameDataValue.name = propGameDataValue.n || "";
  if (!propGameDataValue.name) propGameDataValue.name = metadata.name || "";
  if (!propGameDataValue.description) propGameDataValue.description = metadata.description || "";
  return propGameDataValue;
};

Window_NFTShopBuy.prototype.isCurrentItemEnabled = function () {
  return this.isEnabled(this._nftItems[this.index()]);
};

Window_NFTShopBuy.prototype.price = function (item) {
  return item ? item.forsale : 0;
};

Window_NFTShopBuy.prototype.isEnabled = function (item) {
  return true;
  return (
    item && this.price(item) <= $ksmCachedBalance
  );
};

Window_NFTShopBuy.prototype.drawItem = function (index) {
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

Window_NFTShopBuy.prototype.priceWidth = function () {
  return 96;
};

Window_NFTShopBuy.prototype.setStatusWindow = function (statusWindow) {
  this._statusWindow = statusWindow;
  this.callUpdateHelp();
};

Window_NFTShopBuy.prototype.updateHelp = function () {
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

const window_nft_buy_confirm_itemrect_alias = Window_Command.prototype.itemRect;
Window_NFTBuyConfirm.prototype.itemRect = function (index) {
  let rectangle = window_nft_buy_confirm_itemrect_alias.call(this, index);
  rectangle.y += this.height / 2 - 30;
  return rectangle;
};

//-----------------------------------------------------------------------------
// Window_NFTShopSell
//

function Window_NFTShopSell() {
  this.initialize(...arguments);
}

Window_NFTShopSell.prototype = Object.create(Window_Selectable.prototype);
Window_NFTShopSell.prototype.constructor = Window_NFTShopSell;

Window_NFTShopSell.prototype.initialize = async function (rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this.refresh();
  SubscribeToNewNFTItems(this);
};

Window_NFTShopSell.prototype.destroy = function (options) {
  UnsubscribeFromNewNFTItems(this);
  Window_Selectable.prototype.destroy.call(this, options);
};

Window_NFTShopSell.prototype.onNewNFTItem = async function (newNftItem) {
  this.refresh();
};

Window_NFTShopSell.prototype.refresh = async function () {
  this._nftItems = getAllUnequippedNFTForCollection(collectionId);
  Window_Selectable.prototype.refresh.call(this);
  this.select(0);
};

Window_NFTShopSell.prototype.maxItems = function () {
  return this._nftItems ? this._nftItems.length : 0;
};

Window_NFTShopSell.prototype.item = function () {
  return this.itemAt(this.index());
};

Window_NFTShopSell.prototype.itemAt = function (index) {
  return (this._nftItems && index >= 0 && index < this._nftItems.length) ? this._nftItems[index] : null;
};

Window_NFTShopSell.prototype.itemMetadata = function () {
  const item = this.itemAt(this.index());

  console.log(item);

  if (!item) return null;
  const metadata = JSON.parse(item.metadata);
  if (!metadata.properties) return null;
  const propGameDataValue = item ? metadata.properties.gameData.value : {};
  if (!propGameDataValue.name) propGameDataValue.name = propGameDataValue.n || "";
  if (!propGameDataValue.name) propGameDataValue.name = metadata.name || "";
  if (!propGameDataValue.description) propGameDataValue.description = metadata.description || "";
  return propGameDataValue;
};

Window_NFTShopSell.prototype.itemMetadataAt = function (index) {
  const item = this.itemAt(index);

  console.log(item);

  if (!item) return null;
  const metadata = JSON.parse(item.metadata);
  if (!metadata.properties) return null;
  const propGameDataValue = item ? metadata.properties.gameData.value : {};
  if (!propGameDataValue.name) propGameDataValue.name = propGameDataValue.n || "";
  if (!propGameDataValue.name) propGameDataValue.name = metadata.name || "";
  if (!propGameDataValue.description) propGameDataValue.description = metadata.description || "";
  return propGameDataValue;
};

Window_NFTShopSell.prototype.isCurrentItemEnabled = function () {
  return this.isEnabled(this._nftItems[this.index()]);
};

Window_NFTShopSell.prototype.isEnabled = function (item) {
  return true;
  return (
    item && this.price(item) <= $ksmCachedBalance
  );
};

Window_NFTShopSell.prototype.drawItem = function (index) {
  const item = this.itemAt(index);
  const itemMetadata = this.itemMetadataAt(index);
  //const price = this.price(item);
  const rect = this.itemLineRect(index);
  //const priceWidth = this.priceWidth();
  //const priceX = rect.x + rect.width - priceWidth;
  //const nameWidth = rect.width - priceWidth;
  const nameWidth = rect.width - 100;
  this.changePaintOpacity(this.isEnabled(item));
  this.drawItemName(itemMetadata, rect.x, rect.y, nameWidth);
  if ($ksmCachedNFTOnSale.some(e => e.id === item.id)) {
    this.drawText("Selling", rect.width - 100, rect.y, 100);
  }
  //this.drawText(price, priceX, rect.y, priceWidth, "right");
  this.changePaintOpacity(true);
};

// Window_NFTShopSell.prototype.priceWidth = function() {
//   return 96;
// };

Window_NFTShopSell.prototype.setStatusWindow = function (statusWindow) {
  this._statusWindow = statusWindow;
  this.callUpdateHelp();
};

Window_NFTShopSell.prototype.updateHelp = function () {
  this.setHelpWindowItem(this.itemMetadata());
  if (this._statusWindow) {
    this._statusWindow.setItem(this.itemMetadata());
  }
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

  if (initialized) {
    this._nftItems = (await getAllNFTOnSale());
  } else {
    this._nftItems = [];
  }

  this.refresh();
};

Window_NFTShopList.prototype.maxCols = function () {
  return 1;
};

Window_NFTShopList.prototype.maxItems = function () {
  return this._nftItems ? this._nftItems.length : 0;
};

Window_NFTShopList.prototype.drawItem = function (index) {
  const nftItem = this._nftItems[index];
  const metadata = JSON.parse(nftItem.metadata);
  const rect = this.itemLineRect(index);
  this.contents.fontSize = 18;
  this.drawText("Name: " + metadata.name, rect.x, rect.y, rect.width, 25, "left");
  this.drawText("Description: " + metadata.name, rect.x, rect.y + 25, rect.width, 25, "left");
  this.drawText("Owner: " + nftItem.owner, rect.x, rect.y + 50, rect.width, 25, "left");
  this.drawText("Price: " + nftItem.forsale, rect.x, rect.y + 75, rect.width, 25, "left");
};

Window_NFTShopList.prototype.isCursorMovable = function () {
  return this.active;
};

Window_NFTShopList.prototype.lineHeight = function () {
  return 100;
};

Window_NFTShopList.prototype.drawText = function (text, x, y, maxWidth, lineHeight, align) {
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

Window_NFTNotification.prototype.setItem = function (item) {
  this._item = item;
  this.refresh();
};

Window_NFTNotification.prototype.refresh = async function () {
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

Window_KSMAddressAndBalance.prototype.refresh = async function () {
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

Window_KSMAddress.prototype.refresh = async function () {
  this.contents.clear();
  this.contents.fontSize = 16;
  this.drawText("address: " + $ksmInfo.address, 0, -5, this.width, "center");
};

Window_KSMAddress.prototype._refreshBack = function () {

};

Window_KSMAddress.prototype._refreshFrame = function () {

};

//-----------------------------------------------------------------------------
// Window_KSMBalance
//

function Window_KSMBalance() {
  this.initialize(...arguments);
}

Window_KSMBalance.prototype = Object.create(Window_Selectable.prototype);
Window_KSMBalance.prototype.constructor = Window_KSMBalance;

Window_KSMBalance.prototype.initialize = function (rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this.refresh();
  SubscribeToBalanceUpdate(this);
};

Window_KSMBalance.prototype.destroy = function (options) {
  UnsubscribeFromBalanceUpdate(this);
  Window_Selectable.prototype.destroy.call(this, options);
};

Window_KSMBalance.prototype.colSpacing = function () {
  return 0;
};

Window_KSMBalance.prototype.refresh = async function () {
  const rect = this.itemLineRect(0);
  const x = rect.x;
  const y = rect.y;
  const width = rect.width;
  this.contents.clear();
  this.drawCurrencyValue($ksmCachedBalance, this.currencyUnit(), x, y, width);
};

Window_KSMBalance.prototype.currencyUnit = function () {
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

Window_PhraseEdit.prototype.initialize = function (rect) {
  Window_StatusBase.prototype.initialize.call(this, rect);
  this._maxLength = 0;
  this._phrase = "";
  this._index = 0;
  this.deactivate();
};

Window_PhraseEdit.prototype.setup = function (maxLength) {
  this._maxLength = maxLength;
  this._phrase = "";
  //this._phrase = "stone fault top bubble human exit cigar twist slot drift erosion endorse";
  this._index = 0;
};

Window_PhraseEdit.prototype.phrase = function () {
  return this._phrase;
};

Window_PhraseEdit.prototype.add = function (ch) {
  if (this._index < this._maxLength) {
    this._phrase += ch;
    this._index++;
    this.refresh();
    return true;
  } else {
    return false;
  }
};

Window_PhraseEdit.prototype.back = function () {
  if (this._index > 0) {
    this._index--;
    this._phrase = this._phrase.slice(0, this._index);
    this.refresh();
    return true;
  } else {
    return false;
  }
};

Window_PhraseEdit.prototype.charWidth = function () {
  return this.textWidth("A");
};

Window_PhraseEdit.prototype.countLines = function () {
  const fullWidth = (this._maxLength + 1) * this.charWidth();
  return Math.ceil(fullWidth / this.innerWidth);
};

Window_PhraseEdit.prototype.leftOffset = function () {
  const fullWidth = (this._maxLength + 1) * this.charWidth();
  const countLines = this.countLines();
  const lineWidth = fullWidth / countLines;
  return this.innerWidth / 2 - lineWidth / 2;
};

Window_PhraseEdit.prototype.topOffset = function () {
  const countLines = this.countLines();
  const height = this.lineHeight();
  return this.innerHeight / 2 - (countLines * height) / 2;
};

Window_PhraseEdit.prototype.charPos = function (index) {
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

Window_PhraseEdit.prototype.itemRect = function (index) {
  const charPos = this.charPos(index);
  const x = charPos.x;
  const y = charPos.y;
  const width = this.charWidth();
  const height = this.lineHeight();
  return new Rectangle(x, y, width, height);
};

Window_PhraseEdit.prototype.underlineRect = function (index) {
  const rect = this.itemRect(index);
  rect.x++;
  rect.y += rect.height - 4;
  rect.width -= 2;
  rect.height = 2;
  return rect;
};

Window_PhraseEdit.prototype.underlineColor = function () {
  return ColorManager.normalColor();
};

Window_PhraseEdit.prototype.drawUnderline = function (index) {
  const rect = this.underlineRect(index);
  const color = this.underlineColor();
  this.contents.paintOpacity = 48;
  this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
  this.contents.paintOpacity = 255;
};

Window_PhraseEdit.prototype.drawChar = function (index) {
  const rect = this.itemRect(index);
  this.resetTextColor();
  this.drawText(this._phrase[index] || "", rect.x, rect.y);
};

Window_PhraseEdit.prototype.refresh = function () {
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
// Window_EncryptConfirm
//

function Window_EncryptConfirm() {
  this.initialize(...arguments);
}

Window_EncryptConfirm.prototype = Object.create(Window_Command.prototype);
Window_EncryptConfirm.prototype.constructor = Window_EncryptConfirm;

Window_EncryptConfirm.prototype.initialize = function (rect) {
  Window_Command.prototype.initialize.call(this, rect);
};

Window_EncryptConfirm.prototype.setMessage = function (message) {
  this._message = message;
  this.contents.clear();
  this.refresh();

  const messageParts = this._message.split("<br>");
  for (let i = 0; i < messageParts.length; i++) {
    const y = 5 + i * 30;
    this.drawText(messageParts[i], 0, y, this.innerWidth, "center");
  }
};

Window_EncryptConfirm.prototype.makeCommandList = function () {
  this.addCommand("Yes", "yes");
  this.addCommand("No", "cancel");
};

const encryptconfirm_itemrect_alias = Window_Command.prototype.itemRect;
Window_EncryptConfirm.prototype.itemRect = function (index) {
  let rectangle = encryptconfirm_itemrect_alias.call(this, index);
  rectangle.y += 65;
  return rectangle;
};

//-----------------------------------------------------------------------------
// Window_EncryptEdit
//

function Window_EncryptEdit() {
  this.initialize(...arguments);
}

Window_EncryptEdit.prototype = Object.create(Window_StatusBase.prototype);
Window_EncryptEdit.prototype.constructor = Window_EncryptEdit;

Window_EncryptEdit.prototype.initialize = function (rect) {
  Window_StatusBase.prototype.initialize.call(this, rect);
  this._maxLength = 0;
  this._encryptPassword = "";
  this._index = 0;
  this._defaultEncryptPassword = "";
  this.deactivate();
};

Window_EncryptEdit.prototype.setup = function (currentPassword, defaultPassword, maxLength) {
  this._maxLength = maxLength;
  this._encryptPassword = currentPassword.slice(0, this._maxLength);
  this._index = this._encryptPassword.length;
  this._defaultEncryptPassword = defaultPassword;
};

Window_EncryptEdit.prototype.encryptPassword = function () {
  return this._encryptPassword;
};

Window_EncryptEdit.prototype.restoreDefault = function () {
  this._encryptPassword = this._defaultEncryptPassword;
  this._index = this._encryptPassword.length;
  this.refresh();
  return this._encryptPassword.length > 0;
};

Window_EncryptEdit.prototype.add = function (ch) {
  if (this._index < this._maxLength) {
    this._encryptPassword += ch;
    this._index++;
    this.refresh();
    return true;
  } else {
    return false;
  }
};

Window_EncryptEdit.prototype.back = function () {
  if (this._index > 0) {
    this._index--;
    this._encryptPassword = this._encryptPassword.slice(0, this._index);
    this.refresh();
    return true;
  } else {
    return false;
  }
};

Window_EncryptEdit.prototype.charWidth = function () {
  return this.textWidth("A");
};

Window_EncryptEdit.prototype.left = function () {
  const endpointCenter = this.innerWidth / 2;
  const endpointWidth = (this._maxLength + 1) * this.charWidth();
  return Math.min(endpointCenter - endpointWidth / 2, this.innerWidth - endpointWidth);
};

Window_EncryptEdit.prototype.itemRect = function (index) {
  const x = this.left() + index * this.charWidth();
  const y = 54;
  const width = this.charWidth();
  const height = this.lineHeight();
  return new Rectangle(x, y, width, height);
};

Window_EncryptEdit.prototype.underlineRect = function (index) {
  const rect = this.itemRect(index);
  rect.x++;
  rect.y += rect.height - 4;
  rect.width -= 2;
  rect.height = 2;
  return rect;
};

Window_EncryptEdit.prototype.underlineColor = function () {
  return ColorManager.normalColor();
};

Window_EncryptEdit.prototype.drawUnderline = function (index) {
  const rect = this.underlineRect(index);
  const color = this.underlineColor();
  this.contents.paintOpacity = 48;
  this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
  this.contents.paintOpacity = 255;
};

Window_EncryptEdit.prototype.drawChar = function (index) {
  const rect = this.itemRect(index);
  this.resetTextColor();
  this.drawText(this._encryptPassword[index] || "", rect.x, rect.y);
};

Window_EncryptEdit.prototype.refresh = function () {
  this.contents.clear();
  for (let i = 0; i < this._maxLength; i++) {
    this.drawUnderline(i);
  }
  for (let j = 0; j < this._encryptPassword.length; j++) {
    this.drawChar(j);
  }
  const rect = this.itemRect(this._index);
  this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};

// RMMZ Overrides

// Scene_Options

Scene_Options.prototype.createOptionsWindow = function () {
  const rect = this.optionsWindowRect();
  this._optionsWindow = new Window_Options(rect);
  this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
  this.addWindow(this._optionsWindow);
};

Scene_Options.prototype.maxCommands = function () {
  // Increase this value when adding option items.
  return 9;
};


// Window_Options

const window_options_make_command_list_alias = Window_Options.prototype.makeCommandList;
Window_Options.prototype.makeCommandList = function () {
  window_options_make_command_list_alias.call(this);
  this.addKSMOptions();
};

Window_Options.prototype.addKSMOptions = function () {
  this.addCommand("KSM Endpoint", "ksmEndpoint");
  this.addCommand("RMRK Endpoint", "rmrkEndpoint");
};

const window_options_draw_item_alias = Window_Options.prototype.drawItem;
Window_Options.prototype.drawItem = function (index) {
  switch (this.commandSymbol(index)) {
    case "ksmEndpoint":
    case "rmrkEndpoint":
      const title = this.commandName(index);
      const rect = this.itemLineRect(index);
      const titleWidth = rect.width;
      this.resetTextColor();
      this.changePaintOpacity(this.isCommandEnabled(index));
      this.drawText(title, rect.x, rect.y, titleWidth, "left");
      break;
    default:
      window_options_draw_item_alias.call(this, index);
      break;
  }
};

const window_options_process_ok_alias = Window_Options.prototype.processOk;
Window_Options.prototype.processOk = function () {
  switch (this.commandSymbol(this.index())) {
    case "ksmEndpoint":
      SceneManager.push(Scene_ChangeKSMEndpoint);
      break;
    case "rmrkEndpoint":
      SceneManager.push(Scene_ChangeRMRKEndpoint);
      break;
    default:
      window_options_process_ok_alias.call(this);
      break;
  }
};

// Window_EquipItem

const window_equip_item_includes_alias = Window_EquipItem.prototype.includes;
Window_EquipItem.prototype.includes = function (item) {
  if (item && item.nftId && $ksmCachedNFTOnSale.some(e => e.id === item.nftId)) {
    return false;
  }
  return window_equip_item_includes_alias.call(this, item);
};

// Window_NameInput

Window_NameInput.prototype.onNameOk = function () {
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

Window_NameInput.prototype.table = function () {
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

Window_Base.prototype.drawIconWithSize = function (iconIndex, x, y, width, height) {
  const bitmap = ImageManager.loadSystem("IconSet");
  const pw = ImageManager.iconWidth;
  const ph = ImageManager.iconHeight;
  const sx = (iconIndex % 16) * pw;
  const sy = Math.floor(iconIndex / 16) * ph;
  this.contents.blt(bitmap, sx, sy, pw, ph, x, y, width, height);
};

// Window_Help

Window_Help.prototype.refresh = function () {
  const rect = this.baseTextRect();
  this.contents.clear();
  this.drawTextEx(this.wrapText(this._text), rect.x, rect.y, rect.width);
};

Window_Help.prototype.wrapText = function (text) {
  const textParts = text.split(".");
  if (textParts && textParts.length > 0) {
    return textParts[0] + ".";
  }
  return text;
};

// Scene_Menu

const scene_menu_create_alias = Scene_Menu.prototype.create;
Scene_Menu.prototype.create = function () {
  scene_menu_create_alias.call(this);
  this.createKSMBalanceWindow();
  this.createKSMAddressWindow();
};

Scene_Menu.prototype.createKSMBalanceWindow = function () {
  const rect = this.ksmBalanceWindowRect();
  this._ksmBalanceWindow = new Window_KSMBalance(rect);
  this._ksmBalanceWindow.open();
  this.addWindow(this._ksmBalanceWindow);
};

Scene_Menu.prototype.ksmBalanceWindowRect = function () {
  const ww = this.mainCommandWidth();
  const wh = this.calcWindowHeight(1, true);
  const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
  const wy = this.mainAreaBottom() - wh - wh;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Menu.prototype.createKSMAddressWindow = function () {
  const rect = this.ksmAddressWindowRect();
  this._ksmAddressWindow = new Window_KSMAddress(rect);
  this.addWindow(this._ksmAddressWindow);
};

Scene_Menu.prototype.ksmAddressWindowRect = function () {
  const ww = Graphics.boxWidth - 100;
  const wh = 50;
  const wx = 0;
  const wy = 0;
  return new Rectangle(wx, wy, ww, wh);
};

// Scene_Title

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

  if (initialized) {
    SceneManager.push(Scene_SelectKSMAddress);
  } else {
    this.fadeOutAll();
    await DataManager.setupNewGame(true);
    SceneManager.goto(Scene_Map);
  }
};

Scene_Title.prototype.commandContinue = async function () {
  await waitForInit();
  this._commandWindow.close();
  SceneManager.push(Scene_Load);
};