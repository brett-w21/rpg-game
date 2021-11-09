//=============================================================================
// Ramza Plugins - Independent Items
// Ramza_IndependentItems.js
// v1.02
//=============================================================================

var Ramza = Ramza || {};
Ramza.II = Ramza.II || {};
Ramza.II.version = 1.02
var Imported = Imported || {}
Imported['Ramza_IndependentItems'] = true

//=============================================================================
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.02 Modifies YEP_ItemCore to add independent items to RMMZ
 * @author Ramza
 * @base YEP_ItemCore
 * @orderAfter YEP_ItemCore
 *
 * @help
 * ============================================================================
 * Description:
 * ============================================================================
 *
 * This plugin is to be imported below the YEP_ItemCore plugin. It deliberately 
 * overwrites several functions of the original ItemCore plugin to allow it to 
 * function in tandem with the new VS ItemCore. The main point of this plugin 
 * is to add the functionality of independent items into VS ItemCore.
 *
 * Important: Set 'Updated Scene Item' to false, to ensure that ItemCore
 * doesn't try to overwrite new MZ item windows with older MV equivalents
 *
 * ============================================================================
 * Changelog:
 * ============================================================================
 * Version 1.02
 * -Corrected an issue where this plugin was actually calling ItemCore modified
 *  functions instead of the original functions, as intended.
 * -Corrected an issue where the shop scene did not properly display the 
 *  correct quantity of the number of possessed independent items.
 * Version 1.01
 * -Corrected a crash error when entering the shop menu when not using 
 *  VS_ItemsEquipsCore
 *
 * Version 1.00
 * -Initial Release
 *
 * **endofhelpfile
 */
 
 //============================================================================ 
 // Process Plugin Parameters
 //============================================================================
 
 //Overwritten functions:
var Window_Base_drawItemName = Window_Base.prototype.drawItemName;
Window_Base.prototype.drawItemName = function(item, wx, wy, ww) {
    Yanfly.Item.Window_Base_drawItemName.call(this, item, wx, wy, ww);
};

Window_Base.prototype.setItemTextColor = function() {
//blanked
};

var Window_Base_normalColor = Window_Base.prototype.normalColor;
Window_Base.prototype.normalColor = function() {
    return Yanfly.Item.Window_Base_normalColor.call(this);
};


var Window_ItemList_makeItemList =
    Window_ItemList.prototype.makeItemList;
Window_ItemList.prototype.makeItemList = function() {
    Yanfly.Item.Window_ItemList_makeItemList.call(this);
};


Window_ItemList.prototype.listEquippedItems = function() {
	//blanked
};

var Window_ItemList_drawItemNumber =
    Window_ItemList.prototype.drawItemNumber;
Window_ItemList.prototype.drawItemNumber = function(item, dx, dy, dw) {
    Yanfly.Item.Window_ItemList_drawItemNumber.call(this, item, dx, dy, dw);
};

Window_ItemList.prototype.drawItemCarryNumber = function(item, dx, dy, dw) {
	//blanked
};

Window_ItemList.prototype.drawEquippedActor = function(item, dx, dy, dw) {
	//blanked
};

var Window_EquipItem_includes = Window_EquipItem.prototype.includes;
Window_EquipItem.prototype.includes = function(item) {
    return Yanfly.Item.Window_EquipItem_includes.call(this, item);
};

var Window_ShopBuy_isEnabled = Window_ShopBuy.prototype.isEnabled;
Window_ShopBuy.prototype.isEnabled = function(item) {
    return Yanfly.Item.Window_ShopBuy_isEnabled.call(this, item);
};

var Window_ShopStatus_drawPossession =
    Window_ShopStatus.prototype.drawPossession;
Window_ShopStatus.prototype.drawPossession = function(x, y) {
	if (DataManager.isIndependent(this._item)){
		const width = this.innerWidth - this.itemPadding() - x;
		const possessionWidth = this.textWidth("0000");
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(TextManager.possession, x, y, width - possessionWidth);
		this.resetTextColor();
		this.drawText($gameParty.numIndependentItems(this._item), x, y, width, "right");
	} else {
		Yanfly.Item.Window_ShopStatus_drawPossession.call(this, x, y);
	}
};

Window_ShopStatus.prototype.drawIndependentPossession = function(x, y) {
	//blanked
};

var Scene_Equip_refreshActor = Scene_Equip.prototype.refreshActor;
Scene_Equip.prototype.refreshActor = function() {
    Yanfly.Item.Scene_Equip_refreshActor.call(this);
};

var Scene_Shop_doBuy = Scene_Shop.prototype.doBuy;
Scene_Shop.prototype.doBuy = function(number) {
    Yanfly.Item.Scene_Shop_doBuy.call(this, number);
};

var Scene_Shop_doSell = Scene_Shop.prototype.doSell;
Scene_Shop.prototype.doSell = function(number) {
    Yanfly.Item.Scene_Shop_doSell.call(this, number);
};

if (Utils.RPGMAKER_VERSION && Utils.RPGMAKER_VERSION >= "1.6.0") {

//blanked

};

if (!Yanfly.Util.toGroup) {
   Yanfly.Util.toGroup = function(inVal) {
       //blanked
   }
};

Yanfly.Util.displayError = function(e, code, message) {
	//blanked
};
