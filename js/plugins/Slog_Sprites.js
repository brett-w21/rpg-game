Sprite.prototype.resize = function (width, height) {
    if (this && this.transform) {
        let widthScale = sign$1(this.scale.x) || 1;
        this.scale.x = widthScale * width / this._texture.orig.width;
        this._width = width;

        let heightScale = sign$1(this.scale.y) || 1;
        this.scale.y = heightScale * height / this._texture.orig.height;
        this._height = height;
    }
};

function sign$1(n) {
    if (n === 0)
    { return 0; }
    return n < 0 ? -1 : 1;
}

function Sprite_Quantity() {
    this.initialize(...arguments);
}

Sprite_Quantity.prototype = Object.create(Sprite.prototype);
Sprite_Quantity.prototype.constructor = Sprite_Quantity;

Sprite_Quantity.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._name = "";
    this._textColor = "";
    this._fontSize = 24;
    this._width = 48;
    this._height = 16;
    this._savedName = "";
    this._savedTextColor = "";
    this._savedFontSize = 24;
    this._savedWidth = 48;
    this._savedHeight = 16;
    this.createBitmap();
};

Sprite_Quantity.prototype.destroy = function(options) {
    this.bitmap.destroy();
    Sprite.prototype.destroy.call(this, options);
};

Sprite_Quantity.prototype.createBitmap = function() {
    const width = this.bitmapWidth();
    const height = this.bitmapHeight();
    this.bitmap = new Bitmap(width, height);
};

Sprite_Quantity.prototype.bitmapWidth = function() {
    return this._width;
};

Sprite_Quantity.prototype.bitmapHeight = function() {
    return this._height;
};

Sprite_Quantity.prototype.fontFace = function() {
    return $gameSystem.mainFontFace();
};

Sprite_Quantity.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
};

Sprite_Quantity.prototype.updateBitmap = function() {
    const width = this._width;
    const height = this._height;
    if (width !== this._savedWidth ||
        height !== this._savedHeight) {
        this._savedWidth = width;
        this._savedHeight = height;
        this.createBitmap();
    }

    const name = this._name;
    const color = this._textColor;
    const fontSize = this._fontSize;
    if (name !== this._savedName ||
        color !== this._savedTextColor ||
        fontSize !== this._savedFontSize) {
        this._savedName = name;
        this._savedTextColor = color;
        this._savedFontSize = fontSize;
        this.redraw();
    }
};

Sprite_Quantity.prototype.outlineColor = function() {
    return 'rgba(0,0,0,0)';
};

Sprite_Quantity.prototype.outlineWidth = function() {
    return 3;
};

Sprite_Quantity.prototype.redraw = function() {
    const name = this._name;
    const width = this.bitmapWidth();
    const height = this.bitmapHeight();
    this.setupFont();
    this.bitmap.clear();
    this.bitmap.drawText(name, 0, 0, width, height, "left");
};

Sprite_Quantity.prototype.setupFont = function() {
    this.bitmap.fontFace = this.fontFace();
    this.bitmap.fontSize = this._fontSize;
    this.bitmap.textColor = this._textColor;
    this.bitmap.outlineColor = this.outlineColor();
    this.bitmap.outlineWidth = this.outlineWidth();
    this.bitmap.fontBold = true;
    this.bitmap.paintOpacity = 255;
};

function Sprite_FieldPower() {
    this.initialize(...arguments);
}

Sprite_FieldPower.prototype = Object.create(Sprite.prototype);
Sprite_FieldPower.prototype.constructor = Sprite_FieldPower;

Sprite_FieldPower.prototype.initialize = function(bitmap) {
    Sprite.prototype.initialize.call(this, bitmap);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
};

function Sprite_BaseCard () {
    this.initialize(...arguments);
}

Sprite_BaseCard.prototype = Object.create(Sprite.prototype);
Sprite_BaseCard.prototype.constructor = Sprite_BaseCard;

Sprite_BaseCard.prototype.initialize = function (bitmap, width, height) {
    Sprite.prototype.initialize.call(this, bitmap);

    this.cardWidth = width;
    this.cardHeight = height;
    if (this.bitmap) {
        this.bitmap.addLoadListener(this.onCardBitmapLoad.bind(this));
    }
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
}

Sprite_BaseCard.prototype.onCardBitmapLoad = function () {
    this.resize(this.cardWidth, this.cardHeight);
};

function Sprite_BaseCardRoot () {
    this.initialize(...arguments);
}

Sprite_BaseCardRoot.prototype = Object.create(Sprite_BaseCard.prototype);
Sprite_BaseCardRoot.prototype.constructor = Sprite_BaseCardRoot;

Sprite_BaseCardRoot.prototype.initialize = function (card, bitmap, width, height) {
    Sprite_BaseCard.prototype.initialize.call(this, bitmap, width, height);
    this.card = card;
    this.drawDynamicFront();
}

Sprite_BaseCardRoot.prototype.destroy = function () {
    const options = { children: true, texture: true };
    PIXI.Sprite.prototype.destroy.call(this, options);
};

Sprite_BaseCardRoot.prototype.drawDynamicFront = function () {
    if (this._dynamicFront) {
        this.removeChild(this._dynamicFront);
        this._dynamicFront.destroy();
    }

    this._dynamicFront = CardViewFactory.createCardDynamicFront(this.card);
    this.addChild(this._dynamicFront);
};

function Sprite_Card () {
    this.initialize(...arguments);
}

Sprite_Card.prototype = Object.create(Sprite.prototype);
Sprite_Card.prototype.constructor = Sprite_Card;

Sprite_Card.prototype.initialize = function (card, width, height, background) {
    Sprite.prototype.initialize.call(this);

    this.card = card;
    this.width = width;
    this.height = height;
    this.bitmap = background;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.scale.x = 1;
    this.scale.y = 1;

    this.drawDynamicFront();
}

Sprite_Card.prototype.drawDynamicFront = function () {
    if (this.dynamicFront) {
        this.removeChild(this.dynamicFront);
        this.dynamicFront.destroy();
    }

    this.dynamicFront = CardViewFactory.createDynamicFront(this.card, this.width, this.height);
    this.addChild(this.dynamicFront);
};

Sprite_Card.prototype._onBitmapLoad = function(bitmapLoaded) {
    if (bitmapLoaded === this._bitmap) {
        if (this._refreshFrame && this._bitmap) {
            this._refreshFrame = false;
            this._frame.width = this.width;
            this._frame.height = this.height;
        }
    }
    this._refresh();
};

function Sprite_CardDynamicFront () {
    this.initialize(...arguments);
}

Sprite_CardDynamicFront.prototype = Object.create(Sprite.prototype);
Sprite_CardDynamicFront.prototype.constructor = Sprite_CardDynamicFront;

Sprite_CardDynamicFront.prototype.initialize = function (bitmap) {
    Sprite.prototype.initialize.call(this);
    this.bitmap = bitmap;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.scale.x = 1;
    this.scale.y = 1;
}

function Sprite_Text() {
    this.initialize(...arguments);
}

Sprite_Text.prototype = Object.create(Sprite.prototype);
Sprite_Text.prototype.constructor = Sprite_Text;

Sprite_Text.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._text = "";
    this._textColor = "";
    this._outlineColor = "rgba(0,0,0,0)";
    this._fontSize = 24;
    this._align = "center";
    this._width = 76;
    this._savedText = "";
    this._savedTextColor = "";
    this._savedOutlineColor = "rgba(0,0,0,0)";
    this._savedFontSize = 24;
    this._savedAlign = "center";
    this._savedWidth = 76;
    this.createBitmap();
};

Sprite_Text.prototype.destroy = function(options) {
    this.bitmap.destroy();
    Sprite.prototype.destroy.call(this, options);
};

Sprite_Text.prototype.createBitmap = function() {
    const width = this.bitmapWidth();
    const height = this.bitmapHeight();
    this.bitmap = new Bitmap(width, height);
};

Sprite_Text.prototype.bitmapWidth = function() {
    return this._width;
};

Sprite_Text.prototype.bitmapHeight = function() {
    return 79;
};

Sprite_Text.prototype.fontFace = function() {
    return $gameSystem.mainFontFace();
};

Sprite_Text.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
};

Sprite_Text.prototype.updateBitmap = function() {
    const text = this._text;
    const color = this._textColor;
    const outlineColor = this._outlineColor;
    const fontSize = this._fontSize;
    const align = this._align;
    const width = this._width;

    if (width !== this._savedWidth) {
        this._savedWidth = width;
        this.createBitmap();
    }

    if (text !== this._savedText ||
        color !== this._savedTextColor ||
        fontSize !== this._savedFontSize ||
        align !== this._savedAlign ||
        outlineColor !== this._savedOutlineColor)
    {
        this._savedText = text;
        this._savedTextColor = color;
        this._savedFontSize = fontSize;
        this._savedAlign = align;
        this._savedOutlineColor = outlineColor;
        this.redraw();
    }
};

Sprite_Text.prototype.outlineColor = function() {
    return this._outlineColor;
};

Sprite_Text.prototype.outlineWidth = function() {
    return 3;
};

Sprite_Text.prototype.redraw = function() {
    const text = this._text;
    const align = this._align;
    const width = this.bitmapWidth();
    const height = this.bitmapHeight();
    this.setupFont();
    this.bitmap.clear();
    this.bitmap.drawText(text, 0, 0, width, height, align);
};

Sprite_Text.prototype.setupFont = function() {
    this.bitmap.fontFace = this.fontFace();
    this.bitmap.fontSize = this._fontSize;
    this.bitmap.textColor = this._textColor;
    this.bitmap.outlineColor = this.outlineColor();
    this.bitmap.outlineWidth = this.outlineWidth();
    this.bitmap.fontBold = true;
    this.bitmap.paintOpacity = 255;
};