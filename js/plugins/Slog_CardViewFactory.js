function CardViewFactory() {
  throw new Error("This is a static class");
}

CardViewFactory.aspectRatio = 1.676470588235294;
CardViewFactory.originalWidth = 340;
CardViewFactory.originalHeight = 570;

CardViewFactory.powerWidth = 40;
CardViewFactory.powerHeight = 40;
CardViewFactory.powerX = 40;
CardViewFactory.powerY = 60;

CardViewFactory.titleWidth = CardViewFactory.originalWidth * 0.75;
CardViewFactory.titleHeight = 35;
CardViewFactory.titleX = CardViewFactory.originalWidth / 2 - CardViewFactory.titleWidth / 2;
CardViewFactory.titleY = CardViewFactory.originalHeight - 70;

CardViewFactory.createCard = function (card, width, height) {
  // main
  const spriteCard = new Sprite_BaseCardRoot(card, ImageManager.loadSlogImage(card.sprite), width, height);

  // card static texts
  const staticTextBitmap = new Bitmap(this.originalWidth, this.originalHeight);
  //staticTextBitmap.fontFace = 'Times New Roman';
  staticTextBitmap.fontItalic = false;
  staticTextBitmap.fontBold = false;
  staticTextBitmap.outlineWidth = 0;

  drawCardTitle(staticTextBitmap, card.title);

  const spriteCardTexts = new Sprite_BaseCard;
  spriteCardTexts.anchor.x = 0.5;
  spriteCardTexts.bitmap = staticTextBitmap;
  spriteCard.addChild(spriteCardTexts);

  // card back
  const spriteCardBack = new Sprite(ImageManager.loadSlogImage("card_back"));
  spriteCardBack.anchor.x = 0.5;
  spriteCardBack.anchor.y = 0.5;
  spriteCardBack.hide();
  spriteCard.addChild(spriteCardBack);
  spriteCard.spriteCardBack = spriteCardBack;

  return spriteCard;
}

CardViewFactory.createCardDynamicFront = function (card) {
  const bitmap = new Bitmap(this.originalWidth, this.originalHeight);
  //bitmap.fontFace = 'Times New Roman';
  bitmap.fontItalic = false;
  bitmap.fontBold = false;
  bitmap.outlineWidth = 0;

  const originalPower = card.power;
  const currentPower = card.getPower ? card.getPower() : originalPower;

  if (originalPower > 0) {
    drawCardPower(bitmap, originalPower, currentPower);
  }

  const sprite = new Sprite_BaseCard;
  sprite.bitmap = bitmap;
  return sprite;
};

function drawCardPower(bitmap, originalPower, power) {
  let powerColor = 'rgb(255,255,255)';
  if (power > originalPower) {
    powerColor = 'rgb(114,170,114)';
  } else if (power < originalPower) {
    powerColor = 'rgb(163,98,98)';
  }
  bitmap.fontBold = true;
  bitmap.textColor = powerColor;
  bitmap.fontSize = 75;
  bitmap.drawText(power,
      CardViewFactory.powerX,
      CardViewFactory.powerY,
      CardViewFactory.powerWidth,
      CardViewFactory.powerHeight,
      "center"
  );
}

function drawCardTitle(bitmap, title) {
  bitmap.fontBold = true;
  bitmap.textColor = 'rgb(255,255,255)';
  bitmap.fontSize = 35;
  bitmap.drawText(title,
      CardViewFactory.titleX,
      CardViewFactory.titleY,
      CardViewFactory.titleWidth,
      CardViewFactory.titleHeight,
      "right"
  );
}