// Adding new command in menu
const make_command_list_alias = Window_MenuCommand.prototype.makeCommandList;
Window_MenuCommand.prototype.makeCommandList = function () {
  make_command_list_alias.call(this);

  const slogDeckSymbol = "slogDeck";
  this.addCommand("Slog deck", slogDeckSymbol, true);
  this.changeCommandIndex(slogDeckSymbol, 4);
  this.setHandler(slogDeckSymbol, commandSlogDeck);
};

function commandSlogDeck() {
  SceneManager.push(Scene_PlayerDeck);
}

Window_MenuCommand.prototype.changeCommandIndex = function (symbol, index) {
  if (index >= 0 && index < this._list.length) {
    const currentIndex = this.findSymbol(symbol);
    const currentSymbol = this._list[currentIndex];

    let waitingSymbol = this._list[index];
    for (let i = index; i < currentIndex; i++) {
      const temp = this._list[i + 1];
      this._list[i + 1] = waitingSymbol;
      waitingSymbol = temp;
    }

    this._list[index] = currentSymbol;
  } else {
    throw new RangeError("Command index must be between 0 and " + (this._list.length - 1) + " (inclusive).");
  }
}

ImageManager.loadSlogBackground = function (filename) {
  return this.loadBitmap("img/slog/backgrounds/", filename);
}

ImageManager.loadSlogImage = function (filename) {
  return this.loadBitmap("img/slog/", filename);
}

Sprite.prototype.moveWithResize = function(x, y, width, height) {
  this.x = x;
  this.y = y;
  this._frame.width = width;
  this._frame.height = height;
  this._refresh();
};

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

/**
 * Create a function that maps a value to a range
 * @param  {Number}   inMin    Input range minimun value
 * @param  {Number}   inMax    Input range maximun value
 * @param  {Number}   outMin   Output range minimun value
 * @param  {Number}   outMax   Output range maximun value
 * @return {function}          A function that converts a value
 */
Number.prototype.remap = function(inMin, inMax, outMin, outMax) {
  return (this - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
