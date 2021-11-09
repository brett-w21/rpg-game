//=============================================================================
// Ramza Plugins - Crafting System Core
// Ramza_CS_Core.js
// v1.00a
//=============================================================================

var Ramza = Ramza || {};
Ramza.CSCore = Ramza.CSCore || {};
Ramza.CS = Ramza.CS || {};
Ramza.CSCore.version = 1.00
var Imported = Imported || {};


//=============================================================================
 /*:
 * @plugindesc v1.00a Core plugin required for the Ramza_CraftingSystem plugins to function.
 * @author Ramza
 * @target MZ
 * @orderAfter YEP_ItemCore
 * @orderAfter Ramza_IndependentItems
 *
 * @help
 * See the helpfile for the MZ or MV version of the Crafting system plugin 
 * for usage information. 
 *
 * Load this plugin before the MV or MZ plugins for the Crafting System.
 *
 * This plugin does not provide any configuration.
 *
 * ============================================================================
 * Change Log:
 * ============================================================================
 * Version 1.00:
 * -(revision a) Removed the definition of RMMV plugin commands from the core
 *  to prevent them from causing a compatibility issue with the RMMV crafting
 *  plugin.
 * -Initial release.
 */


//Parse note tags

Ramza.CSCore.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
	if (!Ramza.CSCore.DataManager_isDatabaseLoaded.call(this)) return false;
	if (!Ramza._loaded_CS) {
		this.processCSNotetags($dataItems);
		this.addRecipe($dataItems);
		this.processCSNotetags($dataWeapons);
		this.addRecipe($dataWeapons);
		this.processCSNotetags($dataArmors);
		this.addRecipe($dataArmors);
		this.updateRecipes();
		this.updateRecipeUnlocks();
		this.updateResultItems();
		this.updateAdditiveItems();
		this.addFailureItems();
		this.processAdditiveItemNoteTags($dataItems);
		this.processAdditiveItemNoteTags($dataWeapons);
		this.processAdditiveItemNoteTags($dataArmors);
		Ramza._loaded_CS = true;
	}
	return true;
};

DataManager.processCSNotetags = function(group) {
	var note1 = /<(?:CRAFT):[ ](.*)>/i;
	var note2 = /<(?:CRAFTCAT):[ ](.*)>/i;
	var note3 = /<(?:VALIDCATS):[ ](.*)>/i;
	var note4 = /<(?:UNCONSUMABLE):[ ](.*)>/i;
	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		obj._baseItem = false
		obj._craftCategory = undefined
		obj._validCategories = []
		obj._unconsumable = []
		obj._consumedOnFail = true
		obj._consumedOnSuccess = true
		var notedata = obj.note.split(/[\r\n]+/);
		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(note1)) {
				var checkstring = String(RegExp.$1).toUpperCase()
				if (checkstring == "BASE"){
					obj._baseItem = true
				}
			}
			if (line.match(note2)) {
				var checkstring = String(RegExp.$1).toUpperCase()
				obj._craftCategory = checkstring.toLowerCase()
				//add individual categories to the itemCategories list if not already present
				if (!Ramza.CSParams.itemCategories.includes(obj._craftCategory)){
					Ramza.CSParams.itemCategories.push(obj._craftCategory)
				}
			}
			if (line.match(note3)){
				var checkstring = String(RegExp.$1).toLowerCase()
				obj._validCategories = checkstring.split(', ')
			}
			if (line.match(note4)){
				var checkstring = String(RegExp.$1).toLowerCase()
				obj._unconsumable = checkstring.split(', ')
				obj._consumedOnFail = !(obj._unconsumable.contains("fail"))
				obj._consumedOnSuccess = !(obj._unconsumable.contains("success"))				
			}
		}
	}
};

DataManager.setupAdditives = function(item){
	item.CS = Ramza.CS.returnBlankDonorTraits()

};

DataManager.processAdditiveItemNoteTags = function(group){
	
	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
	if (!(Ramza.CSParams.AdditiveIngredients._items.contains(obj) || Ramza.CSParams.AdditiveIngredients._armors.contains(obj) || Ramza.CSParams.AdditiveIngredients._weapons.contains(obj))) continue
		this.setupAdditives(obj);
		var notedata = obj.note.split(/[\r\n]+/);
		var traitmode = false
		for (i = 0; i < notedata.length; i++){
			var line = notedata[i];
			if (line.match(/<(?:ADDITIVE ITEM TRAITS)>/i)){
				traitmode = true
			} else if (line.match(/<\/(?:ADDITIVE ITEM TRAITS)>/i)){
				traitmode = false
			} else if (traitmode){
				this.updateAdditiveTraits(obj, line)
			}
		}
	}
};

DataManager.updateAdditiveTraits = function(item, string){
	//item._addParamPlus = {}
	var paramId = 0
	var note1 = /(?:PARAMCHANGE:[ ]*(\w+)*[ ]*([+-]?\d+)*)/i
	var note2 = /(?:PARAMRATE:[ ]*(\w+)*[ ]*([-+]?[0-9]*\.?[0-9]+)*)/i
	var note3 = /(?:NAME:[ ]*(prefix|suffix)+[ ]*(.*))/i
	var note4 = /(?:XPARAMMOD:[ ]*(\w+)*[ ]*([-+]?[0-9]*\.?[0-9]+)*[%]?)/i
	var note5 = /(?:SPARAMMOD:[ ]*(\w+)*[ ]*([-+]?[0-9]*\.?[0-9]+)*[%]?)/i
	var note6 = /(?:ADDATTACKELEMENT:[ ]*(\d+))/i
	var note7 = /(?:REMOVEATTACKELEMENT:[ ]*(\d+))/i
	var note8 = /(?:ADDATTACKSTATE:[ ]*(\d+)[ ]*([-+]?[0-9]*\.?[0-9]+)*[%]?)/i
	var note9 = /(?:REMOVEATTACKSTATE:[ ]*(\d+))/i
	var note10 = /(?:(ADD|SEAL|UNSEAL|REMOVE)+[ ]+SKILL:[ ]*(\d)+)/i
	var note11 = /(?:(ADD|SEAL|UNSEAL|REMOVE)+[ ]+STYPE:[ ]*(\d)+)/i
	var note12 = /(?:ADDSTATEIMMUNITY:[ ]*(\d+))/i
	var note13 = /(?:REMOVESTATEIMMUNITY:[ ]*(\d+))/i
	var note14 = /(?:CHANGESTATERESISTANCE:[ ]*(\d+)+[ ]*([-+]?[0-9]*\.?[0-9]+)+[%]?)/i
	var note15 = /(?:CHANGEELEMENTALRESISTANCE:[ ]*(\d+)+[ ]*([-+]?[0-9]*\.?[0-9]+)+[%]?)/i
	var note16 = /(?:SETANIMATION:[ ]*(\d)+)/i
	var note17 = /(?:RESETANIMATION)/i
	var note18 = /(?:CHANGE[ ]+(HP|MP)+[ ]+RECOVERY:[ ]*([-+]?[0-9]*\.?[0-9]+)*[%]?[ ]+([-+]?\d+)*)/i
	var note19 = /(?:CHANGE ITEM ELEMENT:[ ]*(\d+)*)/i
	var note20 = /(?:RESET ITEM ELEMENT)/i
	var note21 = /(?:(add|cure)+[ ]+STATE:[ ]+(\d+)[ ]+([-+]?[0-9]*\.?[0-9]+)*[%]?)/i
	var note22 = /(?:GAIN TP:[ ]*([-+]?\d+))/i
	var note23 = /(?:REMOVE[ ]+(add|cure)+[ ]+STATE:[ ]+(\d+))/i
	var note24 = /(?:LEARN SKILL:[ ]+(\d+))/i
	var note25 = /(?:CLEAR LEARN SKILL)/i
	var note26 = /(?:(ADD|CLEAR)[ ]+BUFF:[ ]+(\w{3})[ ]+(\d+))/i
	var note27 = /(?:(ADD|CLEAR)[ ]+DEBUFF:[ ]+(\w{3})[ ]+(\d+))/i
	var note28 = /(?:GROW (\w{3})+:[ ]+(\d+))/i
	var note29 = /(?:CLEAR GROW:[ ]+(\w{3})+)/i
	var note30 = /(?:REMOVE[ ]+(BUFF|DEBUFF)+:[ ]+(\w{3}))/i
	
	if (string.match(note1) || string.match(note2)){
		paramId = this.returnParamIdByName(RegExp.$1.toLowerCase())
		if (paramId != -1 && string.match(note1)) item.CS._addParamChange.data[paramId] = parseInt(RegExp.$2)
		if (paramId != -1 && string.match(note2)) item.CS._addParamRate.data[paramId] = Number(RegExp.$2)
	} else if (string.match(note3)){
		if (RegExp.$1.toLowerCase() == "prefix"){
			//prefix
			var nameEffect = "_namePrefix"
		} else {
			//suffix
			var nameEffect = "_nameSuffix"
		}
		if (RegExp.$2.toLowerCase() != "clear"){
			item.CS[nameEffect].data = RegExp.$2
		} else {
			item.CS[nameEffect].data = ""
		}
	} else if (string.match(note4)){
		var xParamId = 0
		switch (RegExp.$1.toLowerCase()){
			case 'hit':
			xParamId = 0
			break;
			case 'eva':
			xParamId = 1
			break;
			case 'cri':
			xParamId = 2
			break;
			case 'cev':
			xParamId = 3
			break;
			case 'mev':
			xParamId = 4
			break;
			case 'mrf':
			xParamId = 5
			break;
			case 'cnt':
			xParamId = 6
			break;
			case 'hrg':
			xParamId = 7
			break;
			case 'mrg':
			xParamId = 8
			break;
			case 'trg':
			xParamId = 9
			break;
			case 'blk':
			xParamId = 10
			break;
			default:
			xParamId = -1
		}
		if (xParamId != -1 && (Number(RegExp.$2)% 1 != 0)) {
			item.CS._changeXparam.data[xParamId] = Number(RegExp.$2)
		} else if (xParamId != -1 && (Number(RegExp.$2)% 1 === 0)){
			item.CS._changeXparam.data[xParamId] = Number(RegExp.$2) / 100
		} 
	} else if (string.match(note5)){
		var sParamId = 0
		switch (RegExp.$1.toLowerCase()){
			case 'tgr':
			sParamId = 0
			break;
			case 'grd':
			sParamId = 1
			break;
			case 'rec':
			sParamId = 2
			break;
			case 'pha':
			sParamId = 3
			break;
			case 'mcr':
			sParamId = 4
			break;
			case 'tcr':
			sParamId = 5
			break;
			case 'pdr':
			sParamId = 6
			break;
			case 'mdr':
			sParamId = 7
			break;
			case 'fdr':
			sParamId = 8
			break;
			case 'exr':
			sParamId = 9
			break;
			default:
			sParamId = -1
		}
		if (sParamId != -1 && (Number(RegExp.$2)% 1 != 0)) {
			item.CS._changeSparam.data[sParamId] = 1 + Number(RegExp.$2)
		} else if (sParamId != -1 && (Number(RegExp.$2)% 1 === 0)){
			item.CS._changeSparam.data[sParamId] = 1 + (Number(RegExp.$2) / 100)
		} 
	} else if (string.match(note6)){
		item.CS._addAttackElement.data.push(parseInt(RegExp.$1))
	} else if (string.match(note7)){
		item.CS._clearAttackElement.data.push(parseInt(RegExp.$1))
	} else if (string.match(note8)){
		item.CS._addAttackState.data.push([parseInt(RegExp.$1), Number(RegExp.$2)])
	} else if (string.match(note9)){
		item.CS._clearAttackState.data.push(parseInt(RegExp.$1))
	} else if (string.match(note10)){
		switch (RegExp.$1.toLowerCase()){
			case "add":
			item.CS._addSkill.data.push(parseInt(RegExp.$2))
			break;
			case "seal":
			item.CS._sealSkill.data.push(parseInt(RegExp.$2))
			break;
			case "unseal":
			item.CS._unsealSkill.data.push(parseInt(RegExp.$2))
			break;
			case "remove":
			item.CS._removeSkill.data.push(parseInt(RegExp.$2))
			break;
			default:
			break;
		}
	} else if (string.match(note11)){
		switch (RegExp.$1.toLowerCase()){
			case "add":
			item.CS._addSkillType.data.push(parseInt(RegExp.$2))
			break;
			case "seal":
			item.CS._sealSkillType.data.push(parseInt(RegExp.$2))
			break;
			case "unseal":
			item.CS._unsealSkillType.data.push(parseInt(RegExp.$2))
			break;
			case "remove":
			item.CS._removeSkillType.data.push(parseInt(RegExp.$2))
			break;
			default:
			break;
		}
	} else if (string.match(note12)){
		item.CS._addStateImmunity.data[parseInt(RegExp.$1)] = true
	} else if (string.match(note13)){
		item.CS._removeStateImmunity.data[parseInt(RegExp.$1)] = true
	} else if (string.match(note14)){
		var value = Number(RegExp.$2)
		if (value % 1 == 0) value = value/100
		item.CS._changeStateResistance.data[parseInt(RegExp.$1)] = value
	} else if (string.match(note15)){
		var value = Number(RegExp.$2)
		if (value % 1 == 0) value = value/100
		item.CS._changeEleResistance.data[parseInt(RegExp.$1)] = value
	} else if (string.match(note16)){
		item.CS._battleAnimation.data = parseInt(RegExp.$1)
	} else if (string.match(note17)){
		item.CS._resetBattleAnimation.data = true
	} else if (string.match(note18)){
		var value = Number(RegExp.$2)
		if (value % 1 == 0) value = value/100
		if (RegExp.$1.toLowerCase() == "hp"){
			item.CS._hpRecovery.data = [value, parseInt(RegExp.$3)]
		} else if (RegExp.$1.toLowerCase() == "mp"){
			item.CS._mpRecovery.data = [value, parseInt(RegExp.$3)]
		}
		
	} else if (string.match(note19)){
		item.CS._effectElement.data = parseInt(RegExp.$1)
	} else if (string.match(note20)){
		item.CS._resetEffectElement.data = true
	} else if (string.match(note21)){
		if (RegExp.$1.toLowerCase() == "add"){
			var value = Number(RegExp.$3)
			if (value % 1 == 0) value = value / 100
			item.CS._addStateEffect.data.push([parseInt(RegExp.$2), value])
		} else {
			var value = Number(RegExp.$3)
			if (value % 1 == 0) value = value / 100
			item.CS._cureStateEffect.data.push([parseInt(RegExp.$2), value])
		}
	} else if (string.match(note22)){
		item.CS._gainTp = parseInt(RegExp.$1)
	} else if (string.match(note23)){
		if (RegExp.$1.toLowerCase() == "add"){
			item.CS._clearAddStateEffect.data.push(parseInt(RegExp.$2))
		} else {
			item.CS._clearCureStateEffect.data.push(parseInt(RegExp.$2))
		}
	} else if (string.match(note24)){
		item.CS._learnSkill.data.push(parseInt(RegExp.$1))
	} else if (string.match(note25)){
		item.CS._clearLearnSkill.data = true
	} else if (string.match(note26)){
		paramId = this.returnParamIdByName(RegExp.$2.toLowerCase())
		if (paramId != -1){
			if (RegExp.$1.toLowerCase() == "add"){
				item.CS._addBuff.data.push([paramId, parseInt(RegExp.$3)])
			} else {
				item.CS._clearBuff.data.push(paramId)
			}
		}
	} else if (string.match(note27)){
		paramId = this.returnParamIdByName(RegExp.$2.toLowerCase())
		if (paramId != -1){
			if (RegExp.$1.toLowerCase() == "add"){
				item.CS._addDebuff.data.push([paramId, parseInt(RegExp.$3)])
			} else {
				item.CS._clearDebuff.data.push(paramId)
			}
		}
	} else if (string.match(note28)){
		paramId = this.returnParamIdByName(RegExp.$1.toLowerCase())
		if (paramId != -1) item.CS._growParam.data[paramId] = parseInt(RegExp.$2)
	} else if (string.match(note29)){
		paramId = this.returnParamIdByName(RegExp.$1.toLowerCase())
		if (paramId != -1) item.CS._resetGrowParam.data[paramId] = true
	} else if (string.match(note30)){
		paramId = this.returnParamIdByName(RegExp.$2.toLowerCase())
		if (paramId != -1 && RegExp.$1.toLowerCase() == "buff") item.CS._removeBuff.data.push(paramId)
		if (paramId != -1 && RegExp.$1.toLowerCase() == "debuff") item.CS._removeDebuff.data.push(paramId)
	}
};

DataManager.returnParamIdByName = function(string){
	switch (string){
			case 'mhp':
			return 0
			break;
			case 'mmp':
			return 1
			break;
			case 'atk':
			return 2
			break;
			case 'def':
			return 3
			break;
			case 'mat':
			return 4
			break;
			case 'mdf':
			return 5
			break;
			case 'agi':
			return 6
			break;
			case 'luk':
			return 7
			break;
			default:
			return -1
		}
};

DataManager.addFailureItems = function(){
	//loads after DB to attach failure items to individual recipes
	//failure items
	for (i = 0; i < Ramza.CSParams.resultItem.length; i++){
		for (n = 0; n < Ramza.CSParams.resultItem[i].recipes.length; n++){
			Ramza.CSParams.resultItem[i].recipes[n].FailureItemCreation = eval(Ramza.CSParams.resultItem[i].recipes[n].FailureItemCreation)
			Ramza.CSParams.resultItem[i].recipes[n].FailureItem = Ramza.CSParams.resultItem[i].recipes[n].FailureItemType
			if (Ramza.CSParams.resultItem[i].recipes[n].FailureItem === "Item"){
				Ramza.CSParams.resultItem[i].recipes[n].FailureItem = $dataItems[Ramza.CSParams.resultItem[i].recipes[n].FailureItemID]
			} else if (Ramza.CSParams.resultItem[i].recipes[n].FailureItem === "Weapon"){
				Ramza.CSParams.resultItem[i].recipes[n].FailureItem = $dataWeapons[Ramza.CSParams.resultItem[i].recipes[n].FailureItemID]
			} else if (Ramza.CSParams.resultItem[i].recipes[n].FailureItem === "Armor"){
				Ramza.CSParams.resultItem[i].recipes[n].FailureItem = $dataArmors[Ramza.CSParams.resultItem[i].recipes[n].FailureItemID]
			} else {
				//category wasn't set
				Ramza.CSParams.resultItem[i].recipes[n].FailureItem = undefined
				Ramza.CSParams.resultItem[i].recipes[n].FailureItemCreation = false
			}
		}
	}
		
	
}

DataManager.addRecipe = function(group) {
	//sets on a per item basis if that item is craftable, and if it is, which elementID that itemResult is
	for (var i = 1; i < group.length; i++) {
		var obj = group[i];
		obj._craftable = false
		obj._resultIndex = undefined
		for (var n = 0; n < Ramza.CSParams.numRecipes; n++) {
			var checktext = "$data" + Ramza.CSParams.resultItem[n].ResultType + "s"
			if (eval(checktext) === group && Ramza.CSParams.resultItem[n].ResultID == i){
				obj._craftable = true
				obj._resultIndex = n
			}
		}
	}
};

DataManager.updateResultItems = function(){
	//updates result Item list to contain the actual item objects
	for (i = 0; i < Ramza.CSParams.numRecipes; i++){
		obj = Ramza.CSParams.resultItem[i]
		var checktext = "$data" + obj.ResultType + "s" + "[" + obj.ResultID + "]"
		obj.ResultItem = eval(checktext)
	}
};

DataManager.updateAdditiveItems = function(){
	//updates Additive Items list to contain the actual item objects
	for (i = 0; i < Ramza.CSParams.AdditiveIngredients._items.length; i++){
		Ramza.CSParams.AdditiveIngredients._items[i] = $dataItems[Ramza.CSParams.AdditiveIngredients._items[i]]
	}
	for (i = 0; i < Ramza.CSParams.AdditiveIngredients._weapons.length; i++){
		Ramza.CSParams.AdditiveIngredients._weapons[i] = $dataWeapons[Ramza.CSParams.AdditiveIngredients._weapons[i]]
	}
	for (i = 0; i < Ramza.CSParams.AdditiveIngredients._armors.length; i++){
		Ramza.CSParams.AdditiveIngredients._armors[i] = $dataArmors[Ramza.CSParams.AdditiveIngredients._armors[i]]
	}
};

DataManager.updateRecipeUnlocks = function(){
	//unlocks recipes that should be unlocked by default

};

//====================================================
//Additive Item Functions
//====================================================

Ramza.CS.getDefaultAdditiveTraits = function(){
	//returns an object with a blank list of additive traits
	var additiveTraits = {}
	additiveTraits._addParamChange = {dataType: 1}
	additiveTraits._addParamChange.data = this.returnDefaultDatasetForType(additiveTraits._addParamChange.dataType)
	additiveTraits._addParamRate = {dataType: 1}
	additiveTraits._addParamRate.data = this.returnDefaultDatasetForType(additiveTraits._addParamRate.dataType)
	additiveTraits._changeXparam = {dataType: 2}
	additiveTraits._changeXparam.data = this.returnDefaultDatasetForType(additiveTraits._changeXparam.dataType)
	additiveTraits._changeSparam = {dataType: 2}
	additiveTraits._changeSparam.data = this.returnDefaultDatasetForType(additiveTraits._changeSparam.dataType)
	additiveTraits._namePrefix = {dataType: 3}
	additiveTraits._namePrefix.data = this.returnDefaultDatasetForType(additiveTraits._namePrefix.dataType)
	additiveTraits._nameSuffix = {dataType: 3}
	additiveTraits._nameSuffix.data = this.returnDefaultDatasetForType(additiveTraits._nameSuffix.dataType)
	additiveTraits._addAttackElement = {dataType: 4}
	additiveTraits._addAttackElement.data = this.returnDefaultDatasetForType(additiveTraits._addAttackElement.dataType)
	additiveTraits._clearAttackElement = {dataType: 4}
	additiveTraits._clearAttackElement.data = this.returnDefaultDatasetForType(additiveTraits._addAttackElement.dataType)
	additiveTraits._addAttackState = {dataType: 4}
	additiveTraits._addAttackState.data = this.returnDefaultDatasetForType(additiveTraits._addAttackState.dataType)
	additiveTraits._clearAttackState = {dataType: 4}
	additiveTraits._clearAttackState.data = this.returnDefaultDatasetForType(additiveTraits._clearAttackState.dataType)
	additiveTraits._addSkill = {dataType: 4}
	additiveTraits._addSkill.data = this.returnDefaultDatasetForType(additiveTraits._addSkill.dataType)
	additiveTraits._removeSkill = {dataType: 4}
	additiveTraits._removeSkill.data = this.returnDefaultDatasetForType(additiveTraits._removeSkill.dataType)
	additiveTraits._sealSkill = {dataType: 4}
	additiveTraits._sealSkill.data = this.returnDefaultDatasetForType(additiveTraits._sealSkill.dataType)
	additiveTraits._unsealSkill = {dataType: 4}
	additiveTraits._unsealSkill.data = this.returnDefaultDatasetForType(additiveTraits._unsealSkill.dataType)
	additiveTraits._addSkillType = {dataType: 4}
	additiveTraits._addSkillType.data = this.returnDefaultDatasetForType(additiveTraits._addSkillType.dataType)
	additiveTraits._removeSkillType = {dataType: 4}
	additiveTraits._removeSkillType.data = this.returnDefaultDatasetForType(additiveTraits._removeSkillType.dataType)
	additiveTraits._sealSkillType = {dataType: 4}
	additiveTraits._sealSkillType.data = this.returnDefaultDatasetForType(additiveTraits._sealSkillType.dataType)
	additiveTraits._unsealSkillType = {dataType: 4}
	additiveTraits._unsealSkillType.data = this.returnDefaultDatasetForType(additiveTraits._addAttackElement.dataType)
	additiveTraits._battleAnimation = {dataType: 5}
	additiveTraits._battleAnimation.data = this.returnDefaultDatasetForType(additiveTraits._battleAnimation.dataType)
	additiveTraits._resetBattleAnimation = {dataType: 6}
	additiveTraits._resetBattleAnimation.data = this.returnDefaultDatasetForType(additiveTraits._resetBattleAnimation.dataType)
	additiveTraits._changeEleResistance = {dataType: 7}
	additiveTraits._changeEleResistance.data = this.returnDefaultDatasetForType(additiveTraits._changeEleResistance.dataType)
	additiveTraits._changeStateResistance = {dataType: 8}
	additiveTraits._changeStateResistance.data = this.returnDefaultDatasetForType(additiveTraits._changeStateResistance.dataType)
	additiveTraits._addStateImmunity = {dataType: 9}
	additiveTraits._addStateImmunity.data = this.returnDefaultDatasetForType(additiveTraits._addStateImmunity.dataType)
	additiveTraits._removeStateImmunity = {dataType: 9}
	additiveTraits._removeStateImmunity.data = this.returnDefaultDatasetForType(additiveTraits._removeStateImmunity.dataType)
	additiveTraits._hpRecovery = {dataType: 5}
	additiveTraits._hpRecovery.data = this.returnDefaultDatasetForType(additiveTraits._hpRecovery.dataType)
	additiveTraits._mpRecovery = {dataType: 5}
	additiveTraits._mpRecovery.data = this.returnDefaultDatasetForType(additiveTraits._mpRecovery.dataType)
	additiveTraits._gainTp = {dataType: 5}
	additiveTraits._gainTp.data = this.returnDefaultDatasetForType(additiveTraits._gainTp.dataType)
	additiveTraits._growParam = {dataType: 1}
	additiveTraits._growParam.data = this.returnDefaultDatasetForType(additiveTraits._growParam.dataType)
	additiveTraits._resetGrowParam = {dataType: 10}
	additiveTraits._resetGrowParam.data = this.returnDefaultDatasetForType(additiveTraits._resetGrowParam.dataType)
	additiveTraits._learnSkill = {dataType: 4}
	additiveTraits._learnSkill.data = this.returnDefaultDatasetForType(additiveTraits._learnSkill.dataType)
	additiveTraits._clearLearnSkill = {dataType: 6}
	additiveTraits._clearLearnSkill.data = this.returnDefaultDatasetForType(additiveTraits._clearLearnSkill.dataType)
	additiveTraits._effectElement = {dataType: 5}
	additiveTraits._effectElement.data = this.returnDefaultDatasetForType(additiveTraits._effectElement.dataType)
	additiveTraits._resetEffectElement = {dataType: 6}
	additiveTraits._resetEffectElement.data = this.returnDefaultDatasetForType(additiveTraits._resetEffectElement.dataType)
	additiveTraits._addStateEffect = {dataType: 4}
	additiveTraits._addStateEffect.data = this.returnDefaultDatasetForType(additiveTraits._addStateEffect.dataType)
	additiveTraits._clearAddStateEffect = {dataType: 4}
	additiveTraits._clearAddStateEffect.data = this.returnDefaultDatasetForType(additiveTraits._clearAddStateEffect.dataType)
	additiveTraits._cureStateEffect = {dataType: 4}
	additiveTraits._cureStateEffect.data = this.returnDefaultDatasetForType(additiveTraits._cureStateEffect.dataType)
	additiveTraits._clearCureStateEffect = {dataType: 4}
	additiveTraits._clearCureStateEffect.data = this.returnDefaultDatasetForType(additiveTraits._clearCureStateEffect.dataType)
	additiveTraits._addBuff = {dataType: 4}
	additiveTraits._addBuff.data = this.returnDefaultDatasetForType(additiveTraits._addBuff.dataType)
	additiveTraits._clearBuff = {dataType: 4}
	additiveTraits._clearBuff.data = this.returnDefaultDatasetForType(additiveTraits._clearBuff.dataType)
	additiveTraits._removeBuff = {dataType: 4}
	additiveTraits._removeBuff.data = this.returnDefaultDatasetForType(additiveTraits._removeBuff.dataType)
	additiveTraits._clearRemoveBuff = {dataType: 4}
	additiveTraits._clearRemoveBuff.data = this.returnDefaultDatasetForType(additiveTraits._clearRemoveBuff.dataType)
	additiveTraits._addDebuff = {dataType: 4}
	additiveTraits._addDebuff.data = this.returnDefaultDatasetForType(additiveTraits._addDebuff.dataType)
	additiveTraits._clearDebuff = {dataType: 4}
	additiveTraits._clearDebuff.data = this.returnDefaultDatasetForType(additiveTraits._clearDebuff.dataType)
	additiveTraits._removeDebuff = {dataType: 4}
	additiveTraits._removeDebuff.data = this.returnDefaultDatasetForType(additiveTraits._removeDebuff.dataType)
	additiveTraits._clearRemoveDebuff = {dataType: 4}
	additiveTraits._clearRemoveDebuff.data = this.returnDefaultDatasetForType(additiveTraits._clearRemoveDebuff.dataType)
	return additiveTraits
};

Ramza.CS.returnDefaultDatasetForType = function(dataTypeId) {
	//returns the default data for a given dataType
	switch (dataTypeId) {
		case 1:
		//base params
		return [0,0,0,0,0,0,0,0]
		break;
		case 2:
		//xparams or sparams
		return [0,0,0,0,0,0,0,0,0,0]
		break
		case 3:
		//empty string
		return ""
		break
		case 4:
		//blank array
		return []
		break
		case 5:
		//single null
		return null
		break
		case 6:
		//single false
		return false
		break
		case 7:
		//element resist array (null with 1s for each element
		var arr = [null]
		for (i = 1; i < $dataSystem.elements.length; i++){
			arr[i] = 1
		}
		return arr
		break
		case 8:
		//state resist array (null with 1s for each state
		var arr = [null]
		for (i = 1; i < $dataStates.length; i++){
			arr[i] = 1
		}
		return arr
		break
		case 9:
		//state immunity
		var arr = [null]
		for (i = 1; i < $dataStates.length; i++){
			arr[i] = false
		}
		return arr
		break
		case 10:
		//array of 8 falses (reset grow param)
		return [false,false,false,false,false,false,false,false]
		break
		default:
		return Ramza.CS.checkAddedDefaultDatasets(dataTypeId)
		break
	}
	
	
}

Ramza.CS.returnBlankDonorTraits = function(){
	//returns an object containing a blank set of additive item traits for the donor item
	var donorItem = Ramza.CS.getDefaultAdditiveTraits()
	return donorItem
};

Ramza.CS.checkAddedDefaultDatasets = function(dataTypeId){
	switch (dataTypeId){
		default:
		return "Bad Data Type Id"
		break
	}
};

Ramza.CS.returnNonBlankAdditiveTraits = function(item){
	var item = item.CS
	var newTraits = {}
	for (const property in item){
		if (!Ramza.CS.isTraitBlank(item[property])){
			newTraits[property] = item[property]
		}
	}
	return newTraits
};

Ramza.CS.isTraitBlank = function(additiveTrait) {
	var data = JsonEx.makeDeepCopy(additiveTrait)
	data = data.data
	var dataTypeId = additiveTrait.dataType
	var blankData = Ramza.CS.returnDefaultDatasetForType(dataTypeId)
	if (typeof blankData == 'object' && Array.isArray(blankData)){
		for (let i = 0; i < data.length; i++){
			if (data[i] != blankData[i]) return false
		}
	} else if (typeof blankData == 'boolean'){
		if (data != blankData) return false
	} else if (blankData == null){
		if (data != null) return false
	} else if (typeof blankData == 'string') {
		if (data != blankData) return false
	}
	return true
};

Ramza.CS.processAdditiveTraits = function(target, donor){
	//if (!Ramza.CSParams.AdditiveItems.contains(donor)) return
	if (!target) return
	if (!Imported.YEP_ItemCore) return
	if (target.id < Yanfly.Param.ItemStartingId) return
	target.CS = target.CS || {}
	if (!DataManager.isItem(target)) {
		//traits are only on weapons or armor
		Ramza.CS.removeOldAdditiveTraits(target)
		Ramza.CS.addNewAdditiveTraits(target, donor)
	} else {
		//effects are on items only
		Ramza.CS.removeOldAdditiveEffects(target)
		Ramza.CS.addNewAdditiveEffects(target, donor)
	}
};

Ramza.CS.removeOldAdditiveEffects = function(item){
	if (!item._oldAdditives) return
	for (i = 0; i < item._oldAdditives.addedEffects.length; i++){
		item.effects.pop()
	}
	var hprecoveryindex = item.effects.findIndex(function(ele){return ele.code == 11})
	if (hprecoveryindex != -1 && item._oldAdditives.removedEffects.findIndex(function(ele){return ele.code == 11}) != -1){
		item.effects.splice(hprecoveryindex, 1)
	}
	var mprecoveryindex = item.effects.findIndex(function(ele){return ele.code == 12})
	if (mprecoveryindex != -1 && item._oldAdditives.removedEffects.findIndex(function(ele){return ele.code == 12}) != -1){
		item.effects.splice(mprecoveryindex, 1)
	}
	var tprecoveryindex = item.effects.findIndex(function(ele){return ele.code == 13})
	if (tprecoveryindex != -1 && item._oldAdditives.removedEffects.findIndex(function(ele){return ele.code == 13}) != -1){
		item.effects.splice(tprecoveryindex, 1)
	}
	for (i = 0; i < item._oldAdditives.removedEffects.length; i++){
		item.effects.push(item._oldAdditives.removedEffects[i])
	}
	item.name = item.baseItemName
	if (DataManager.isItem(item)) item.animationId = $dataItems[item.baseItemId].animationId
	if (DataManager.isItem(item)) item.damage.elementId = $dataItems[item.baseItemId].damage.elementId
	
};

Ramza.CS.addNewAdditiveEffects = function(target, donor){
	target._oldAdditives = {}
	target.CSU = donor.CS
	target.CSU.addedEffects = []
	target.CSU.removedEffects = []
	for (const property in target.CSU){
		if (!Ramza.CS.isTraitBlank(target.CSU[property])){
			Ramza.CS.addExtraEffects(target, property)
		}
	}
	
	Ramza.CS.pushOldAdditiveEffects(target);
};

Ramza.CS.createDonorItem = function(ingredientlist){
	var donorItem = {}
	donorItem.CS = Ramza.CS.returnBlankDonorTraits()
	var additiveitemsprovided = []
	for (i = 0; i < ingredientlist.length; i++){
		additiveitemsprovided[i] = (ingredientlist[i].CS) ? true : false
	}
	if (!Ramza.CSParams.AdditiveTraitsType) {
		for (let i = 0; i < ingredientlist.length; i++){
		
			if (ingredientlist[i].CS){
				var item1Traits = Ramza.CS.returnNonBlankAdditiveTraits(ingredientlist[i])
				//console.log(item1Traits)
				//ingredient i is additive
				
				for (const property in item1Traits){
					Ramza.CS.combineNewAdditiveTraits(donorItem.CS[property], item1Traits[property])

				}
			}
		}
		return donorItem
	} else if (Ramza.CSParams.AdditiveTraitsType == 1){
		//only traits shared on at least two ingredients are passed on to donor item
		var itemtraits = Ramza.CS.findTraitsOnTwoPlusIngredients(ingredientlist)
		Ramza.CS.filterNewTraits(itemtraits, ingredientlist)
		for (const property in itemtraits){
				Ramza.CS.combineNewAdditiveTraits(donorItem.CS[property], itemtraits[property])
		}
		return donorItem
		
		} else if (Ramza.CSParams.AdditiveTraitsType == 2){
			
		}

};

Ramza.CS.removeOldAdditiveTraits = function(item){
	if (!item._oldAdditives) return
	for (i = 0; i < 8; i++){
		item.params[i] -= item._oldAdditives._addParamChange.data[i]
	}
	for (i = 0; i < item._oldAdditives.addedTraits.length; i++){
		item.traits.pop()
	}
	for (i = 0; i < item._oldAdditives.removedTraits.length; i++){
		item.traits.push(item._oldAdditives.removedTraits[i])
	}
	item.name = item.baseItemName
	if (DataManager.isItem(item)) item.animationId = $dataItems[item.baseItemId].animationId
	if (DataManager.isWeapon(item)) item.animationId = $dataWeapons[item.baseItemId].animationId
	if (DataManager.isArmor(item)) item.animationId = $dataArmors[item.baseItemId].animationId
	
};

Ramza.CS.addTrait = function(result, traitType){
	switch (traitType){
		case "_addParamChange":
		for (let i = 0; i < 8; i++){
			result.params[i] += result.CSU._addParamChange.data[i]
		}
		break;
		case "_addParamRate":
		for (let i = 0; i < 8; i++){
			if (result.CSU._addParamRate.data[i] != 0) {
				var traitAdd = {code: 21, dataId: i, value: result.CSU._addParamRate.data[i]}
				result.CSU.addedTraits.push(result.traits.length)
				result.traits.push(traitAdd)
			}
		}
		break;
		case "_namePrefix":
		if (result.CSU._namePrefix.data != ""){
			result.name = result.CSU._namePrefix.data + " " + result.name
		}
		break;
		case "_nameSuffix":
		if (result.CSU._nameSuffix.data != ""){
			result.name = result.name + " " + result.CSU._nameSuffix.data
		}
		break;
		case "_battleAnimation":
		if (result.CSU._battleAnimation.data != null){
			result.animationId = result.CSU._battleAnimation.data
		}
		break;
		case "_resetBattleAnimation":
		if (result.CSU._resetBattleAnimation.data){
			if (DataManager.isWeapon(result)) result.animationId = $dataWeapons[result.baseItemId].animationId
			if (DataManager.isArmor(result)) result.animationId = $dataArmors[result.baseItemId].animationId
		}
		break;
		case "_changeXparam":
		for (let i = 0; i < 10; i++){
			if (result.CSU._changeXparam.data[i] != 0){
				var traitAdd = {code: 22, dataId: i, value: result.CSU._changeXparam.data[i]}
				result.CSU.addedTraits.push(result.traits.length)
				result.traits.push(traitAdd)
			}
		}
		break;
		case "_changeSparam":
		for (let i = 0; i < 10; i++){
			if (result.CSU._changeSparam.data[i] != 0){
				var traitAdd = {code: 23, dataId: i, value: result.CSU._changeSparam.data[i]}
				result.CSU.addedTraits.push(result.traits.length)
				result.traits.push(traitAdd)
			}
		}
		break;
		case "_addAttackElement":
		if (result.CSU._addAttackElement.data[0] != null){
			for (let i = 0; i < result.CSU._addAttackElement.data.length; i++){
				var traitAdd = {code: 31, dataId: result.CSU._addAttackElement.data[i], value: 1}
				result.CSU.addedTraits.push(result.traits.length)
				result.traits.push(traitAdd)
			}
		}
		break;
		case "_addAttackState":
		if (result.CSU._addAttackState.data[0] != null){
			for (let i = 0; i < result.CSU._addAttackState.data.length; i++){
				if (result.CSU._addAttackState.data[i][1] % 1 == 0) result.CSU._addAttackState.data[i][1] = result.CSU._addAttackState.data[i][1] /100
				var traitAdd = {code: 32, dataId: result.CSU._addAttackState.data[i][0], value: result.CSU._addAttackState.data[i][1]}
				result.CSU.addedTraits.push(result.traits.length)
				result.traits.push(traitAdd)
			}
		
		}
		break;
		case "_addSkill":
		if (result.CSU._addSkill.data[0] != null){
			for (let i = 0; i < result.CSU._addSkill.data.length; i++){
				var traitAdd = {code: 43, dataId: result.CSU._addSkill.data[i], value: 1}
				result.CSU.addedTraits.push(result.traits.length)
				result.traits.push(traitAdd)
			}
		}
		break;
		case "_sealSkill":
		if (result.CSU._sealSkill.data[0] != null){
			for (let i = 0; i < result.CSU._sealSkill.data.length; i++){
				var traitAdd = {code: 44, dataId: result.CSU._sealSkill.data[i], value: 1}
				result.CSU.addedTraits.push(result.traits.length)
				result.traits.push(traitAdd)
			}
		}
		break;
		case "_addSkillType":
		if (result.CSU._addSkillType.data[0] != null){
			for (let i = 0; i < result.CSU._addSkillType.data.length; i++){
				var traitAdd = {code: 41, dataId: result.CSU._addSkillType.data[i], value: 1}
				result.CSU.addedTraits.push(result.traits.length)
				result.traits.push(traitAdd)
			}
		}
		break;
		case "_sealSkillType":
		if (result.CSU._sealSkillType.data[0] != null){
			for (let i = 0; i < result.CSU._sealSkillType.data.length; i++){
				var traitAdd = {code: 42, dataId: result.CSU._sealSkillType.data[i], value: 1}
				result.CSU.addedTraits.push(result.traits.length)
				result.traits.push(traitAdd)
			}
		}
		break;
		case "_addStateImmunity":
		for (let i = 1; i < result.CSU._addStateImmunity.data.length; i++){
			if (result.CSU._addStateImmunity.data[i]){
				var traitAdd = {code: 14, dataId: i, value: 1}
				result.CSU.addedTraits.push(result.traits.length)
				result.traits.push(traitAdd)
			}
		}
		break;
		case "_changeStateResistance":
		for (let i = 1; i < result.CSU._changeStateResistance.data.length; i++){
			if (result.CSU._changeStateResistance.data[i] != 1){
				var traitAdd = {code: 13, dataId: i, value: result.CSU._changeStateResistance.data[i]}
				result.CSU.addedTraits.push(result.traits.length)
				result.traits.push(traitAdd)
			}
		}
		break;
		case "_changeEleResistance":
		for (let i = 1; i < result.CSU._changeEleResistance.data.length; i++){
			if (result.CSU._changeEleResistance.data[i] != 1){
				var traitAdd = {code: 11, dataId: i, value: result.CSU._changeEleResistance.data[i]}
				result.CSU.addedTraits.push(result.traits.length)
				result.traits.push(traitAdd)
			}
		}
		break;
		case "_clearAttackElement":
		if (result.CSU._clearAttackElement.data[0] != null){
			//get list of current element traits that match the clear request
			for (let n = 0; n < result.CSU._clearAttackElement.data.length; n++){
				for (let i = 0; i < result.traits.length; i++){
					var traitIndex = result.traits.findIndex(function(ele){ return (ele.code == 31 && ele.dataId == result.CSU._clearAttackElement.data[n])})
					if (traitIndex != -1) {
						if (result.CSU.addedTraits.includes(traitIndex)){
							var addedIndex = result.CSU.addedTraits.indexOf(traitIndex)
							if (addedIndex != -1 ) result.CSU.addedTraits.splice(addedIndex, 1)
						} else {
							result.CSU.removedTraits.push(result.traits[traitIndex])
						}
						result.traits.splice(traitIndex, 1)
						i--
					};
				};
			};
		}
		break;
		case "_clearAttackState":
		if (result.CSU._clearAttackState.data[0] != null){
			//get list of current state traits that match the clear request
			for (let n = 0; n < result.CSU._clearAttackState.data.length; n++){
				for (let i = 0; i < result.traits.length; i++){
					var traitIndex = result.traits.findIndex(function(ele){ return (ele.code == 32 && ele.dataId == result.CSU._clearAttackState.data[n])})
					if (traitIndex != -1) {
						if (result.CSU.addedTraits.includes(traitIndex)){
							var addedIndex = result.CSU.addedTraits.indexOf(traitIndex)
							if (addedIndex != -1 ) result.CSU.addedTraits.splice(addedIndex, 1)
						} else {
							result.CSU.removedTraits.push(result.traits[traitIndex])
						}
						result.traits.splice(traitIndex, 1)
						i--
					};
				};
			};		
		}
		break;
		case "_removeSkill":
		if (result.CSU._removeSkill.data[0] != null){
			//get list of current skill traits that match the clear request
			for (let n = 0; n < result.CSU._removeSkill.data.length; n++){
				for (let i = 0; i < result.traits.length; i++){
					var traitIndex = result.traits.findIndex(function(ele){ return (ele.code == 43 && ele.dataId == result.CSU._removeSkill.data[n])})
					if (traitIndex != -1) {
						if (result.CSU.addedTraits.includes(traitIndex)){
							var addedIndex = result.CSU.addedTraits.indexOf(traitIndex)
							if (addedIndex != -1 ) result.CSU.addedTraits.splice(addedIndex, 1)
						} else {
							result.CSU.removedTraits.push(result.traits[traitIndex])
						}
						result.traits.splice(traitIndex, 1)
						i--
					};
				};
			};
		}
		break;
		case "_removeSkillType":
		if (result.CSU._removeSkillType.data[0] != null){
			//get list of current stype traits that match the clear request
			for (let n = 0; n < result.CSU._removeSkillType.data.length; n++){
				for (let i = 0; i < result.traits.length; i++){
					var traitIndex = result.traits.findIndex(function(ele){ return (ele.code == 41 && ele.dataId == result.CSU._removeSkillType.data[n])})
					if (traitIndex != -1) {
						if (result.CSU.addedTraits.includes(traitIndex)){
							var addedIndex = result.CSU.addedTraits.indexOf(traitIndex)
							if (addedIndex != -1 ) result.CSU.addedTraits.splice(addedIndex, 1)
						} else {
							result.CSU.removedTraits.push(result.traits[traitIndex])
						}
						result.traits.splice(traitIndex, 1)
						i--
					};
				};
			};		
		}
		break;
		case "_unsealSkill":
		if (result.CSU._unsealSkill.data[0] != null){
			//get list of current seal skill traits that match the clear request
			for (let n = 0; n < result.CSU._unsealSkill.data.length; n++){
				for (let i = 0; i < result.traits.length; i++){
					var traitIndex = result.traits.findIndex(function(ele){ return (ele.code == 44 && ele.dataId == result.CSU._unsealSkill.data[n])})
					if (traitIndex != -1) {
						if (result.CSU.addedTraits.includes(traitIndex)){
							var addedIndex = result.CSU.addedTraits.indexOf(traitIndex)
							if (addedIndex != -1 ) result.CSU.addedTraits.splice(addedIndex, 1)
						} else {
							result.CSU.removedTraits.push(result.traits[traitIndex])
						}
						result.traits.splice(traitIndex, 1)
						i--
					};
				};
			};
		}
		break;
		case "_unsealSkillType":
		if (result.CSU._unsealSkillType.data[0] != null){
			//get list of current stype traits that match the clear request
			for (let n = 0; n < result.CSU._unsealSkillType.data.length; n++){
				for (let i = 0; i < result.traits.length; i++){
					var traitIndex = result.traits.findIndex(function(ele){ return (ele.code == 42 && ele.dataId == result.CSU._unsealSkillType.data[n])})
					if (traitIndex != -1) {
						if (result.CSU.addedTraits.includes(traitIndex)){
							var addedIndex = result.CSU.addedTraits.indexOf(traitIndex)
							if (addedIndex != -1 ) result.CSU.addedTraits.splice(addedIndex, 1)
						} else {
							result.CSU.removedTraits.push(result.traits[traitIndex])
						}
						result.traits.splice(traitIndex, 1)
						i--
					};
				};
			};		
		}
		break;
		case "_removeStateImmunity":
		for (let n = 1; n < result.CSU._removeStateImmunity.data.length; n++){
			if (result.CSU._removeStateImmunity.data[n]){
				for (let i = 0; i < result.traits.length; i++){
					var traitIndex = result.traits.findIndex(function(ele){ return (ele.code == 14 && ele.dataId == n)})
					if (traitIndex != -1) {
						if (result.CSU.addedTraits.includes(traitIndex)){
							var addedIndex = result.CSU.addedTraits.indexOf(traitIndex)
							if (addedIndex != -1 ) result.CSU.addedTraits.splice(addedIndex, 1)
						} else {
							result.CSU.removedTraits.push(result.traits[traitIndex])
						}
						result.traits.splice(traitIndex, 1)
						i--
					};
				};
			};
		};
		break;
		case "addedTraits":
		break;
		case "removedTraits":
		break;
		default:
		//console.log(traitType + " is not a Trait")
		break;
	}
	
};

Ramza.CS.addExtraTraits = function(result, traitType){
	//space to check for new additive traits added by extensions
	switch (traitType){
		default:
		Ramza.CS.addTrait(result, traitType)
		break;
	}
};

Ramza.CS.addNewAdditiveTraits = function(target, donor){
	target._oldAdditives = {}
	target.CSU = donor.CS
	target.CSU.addedTraits = []
	target.CSU.removedTraits = []
	for (const property in target.CSU){
		if (!Ramza.CS.isTraitBlank(target.CSU[property])){
			Ramza.CS.addExtraTraits(target, property)
		}
	}
	
	Ramza.CS.pushOldAdditiveTraits(target);
};

Ramza.CS.addEffect = function (result, traitType){

	switch (traitType){
		case "_namePrefix":
		if (result.CSU[traitType].data != "") result.name = result.CSU[traitType].data + " " + result.name
		break;
		case "_nameSuffix":
		if (result.CSU[traitType].data != "") result.name = result.name + " " + result.CSU[traitType].data
		break;
		case "_battleAnimation":
		if (result.CSU[traitType].data != null) result.animationId = result.CSU[traitType].data
		break;
		case "_resetBattleAnimation":
		if (result.CSU[traitType].data) result.animationId = $dataItems[result.baseItemId].animationId
		break;
		case "_hpRecovery":
		if (result.CSU._hpRecovery.data != null){
			var effectAdd = {code: 11, dataId: 0, value1: result.CSU._hpRecovery.data[0], value2: result.CSU._hpRecovery.data[1]}
			var existingEffectIndex = result.effects.findIndex(function(ele){return ele.code == 11})
			if (existingEffectIndex == -1){
				result.CSU.addedEffects.push(result.effects.length)
				result.effects.push(effectAdd)
			} else {
				result.CSU.removedEffects.push(result.effects[existingEffectIndex])
				effectAdd.value1 += result.effects[existingEffectIndex].value1
				effectAdd.value1 = Math.min(1, effectAdd.value1)
				effectAdd.value2 += result.effects[existingEffectIndex].value2
				result.effects.splice(existingEffectIndex, 1)
				result.effects.push(effectAdd)
			}
		}
		break;
		case "_mpRecovery":
		if (result.CSU._mpRecovery.data != null){
			var effectAdd = {code: 12, dataId: 0, value1: result.CSU._mpRecovery[0], value2: result.CSU._mpRecovery[1]}
			var existingEffectIndex = result.effects.findIndex(function(ele){return ele.code == 12})
			if (existingEffectIndex == -1){
				result.CSU.addedEffects.push(result.effects.length)
				result.effects.push(effectAdd)
			} else {
				result.CSU.removedEffects.push(result.effects[existingEffectIndex])
				effectAdd.value1 += result.effects[existingEffectIndex].value1
				effectAdd.value1 = Math.min(1, effectAdd.value1)
				effectAdd.value2 += result.effects[existingEffectIndex].value2
				result.effects.splice(existingEffectIndex, 1)
				result.effects.push(effectAdd)
			}
		}
		break;
		case "_gainTp":
		if (result.CSU._gainTp.data != null){
			var effectAdd = {code: 13, dataId: 0, value1: result.CSU._gainTp.data, value2: 0}
			var existingEffectIndex = result.effects.findIndex(function(ele){return ele.code == 12})
			if (existingEffectIndex == -1){
				result.CSU.addedEffects.push(result.effects.length)
				result.effects.push(effectAdd)
			} else {
				result.CSU.removedEffects.push(result.effects[existingEffectIndex])
				effectAdd.value1 += result.effects[existingEffectIndex].value1
				result.effects.splice(existingEffectIndex, 1)
				result.effects.push(effectAdd)
			}
		}
		break;
		case "_growParam":
		for (i = 0; i < 8; i++){
			if (result.CSU._growParam.data[i] != 0){
				var effectAdd = {code: 42, dataId: i, value1: result.CSU._growParam.data[i], value2: 0}
				result.CSU.addedEffects.push(result.effects.length)
				result.effects.push(effectAdd)
			}
		}
		break;
		case "_learnSkill":
		for (i = 0; i < result.CSU._learnSkill.data.length; i++){
			var effectAdd = {code: 43, dataId: result.CSU._learnSkill.data[i], value1: 1, value2: 0}
			result.CSU.addedEffects.push(result.effects.length)
			result.effects.push(effectAdd)
		}
		break;
		case "_addStateEffect":
		if (result.CSU._addStateEffect.data[0] != null){
			for (i = 0; i < result.CSU._addStateEffect.data.length; i++){
			var effectAdd = {code: 21, dataId: result.CSU._addStateEffect.data[i][0], value1: result.CSU._addStateEffect.data[i][1], value2: 0}
				result.CSU.addedEffects.push(result.effects.length)
				result.effects.push(effectAdd)
			}
		}
		break;
		case "_effectElement":
		if (result.CSU._effectElement.data != null){
			result.damage.elementId = result.CSU._effectElement.data
		};
		break;
		case "_resetEffectElement":
		if (result.CSU._resetEffectElement.data != null){
			result.damage.elementId = $dataItems[result.baseItemId].damage.elementId
		};
		break;
		case "_cureStateEffect":
		if (result.CSU._cureStateEffect.data[0] != null){
			for (i = 0; i < result.CSU._cureStateEffect.data.length; i++){
				var effectAdd = {code: 22, dataId: result.CSU._cureStateEffect.data[i][0], value1: result.CSU._cureStateEffect.data[i][1], value2: 0}
				result.CSU.addedEffects.push(result.effects.length)
				result.effects.push(effectAdd)
			}
		}
		break;
		case "_addBuff":
		if (result.CSU._addBuff.data[0] != null){
			for (i = 0; i < result.CSU._addBuff.data.length; i++){
				var effectAdd = {code: 31, dataId: result.CSU._addBuff.data[i][0], value1: result.CSU._addBuff.data[i][1], value2: 0}
				result.CSU.addedEffects.push(result.effects.length)
				result.effects.push(effectAdd)
			}
		}
		break;
		case "_addDebuff":
		if (result.CSU._addDebuff.data[0] != null){
			for (i = 0; i < result.CSU._addDebuff.data.length; i++){
				var effectAdd = {code: 32, dataId: result.CSU._addDebuff.data[i][0], value1: result.CSU._addDebuff.data[i][1], value2: 0}
				result.CSU.addedEffects.push(result.effects.length)
				result.effects.push(effectAdd)
			}
		}
		break;
		case "_removeBuff":
		if (result.CSU._removeBuff.data[0] != null){
			for (i = 0; i < result.CSU._removeBuff.data.length; i++){
				var effectAdd = {code: 33, dataId: result.CSU._removeBuff.data[i], value1: 1, value2: 0}
				result.CSU.addedEffects.push(result.effects.length)
				result.effects.push(effectAdd)
			}
		}
		break;
		case "_removeDebuff":
		if (result.CSU._removeDebuff.data[0] != null){
			for (i = 0; i < result.CSU._removeDebuff.data.length; i++){
				var effectAdd = {code: 34, dataId: result.CSU._removeDebuff.data[i], value1: 1, value2: 0}
				result.CSU.addedEffects.push(result.effects.length)
				result.effects.push(effectAdd)
			}
		}
		break;
		case "_clearRemoveBuff":
		if (result.CSU._clearRemoveBuff.data[0]){
			for (n = 0; n < result.CSU._clearRemoveBuff.data.length; n++){
				for (i = 0; i < result.effects.length; i++){
					var foundIndex = result.effects.findIndex(function(ele){ return ele.code == 33 && ele.dataId == result.CSU._clearRemoveBuff.data[n] })
					if (foundIndex == -1) break
					if (result.CSU.addedEffects.includes(foundIndex)){
						var addedIndex = result.CSU.addedEffects.indexOf(foundIndex)
						if (addedIndex != -1) result.CSU.addedEffects.splice(addedIndex, 1)
					} else {
						result.CSU.removedEffects.push(result.effects[foundIndex])
					}
					result.effects.splice(foundIndex, 1)
					i--
				}
			}
		};
		break;
		case "_clearRemoveDebuff":
		if (result.CSU._clearRemoveDebuff.data[0]){
			for (n = 0; n < result.CSU._clearRemoveDebuff.data.length; n++){
				for (i = 0; i < result.effects.length; i++){
					var foundIndex = result.effects.findIndex(function(ele){ return ele.code == 34 && ele.dataId == result.CSU._clearRemoveDebuff.data[n] })
					if (foundIndex == -1) break
					if (result.CSU.addedEffects.includes(foundIndex)){
						var addedIndex = result.CSU.addedEffects.indexOf(foundIndex)
						if (addedIndex != -1) result.CSU.addedEffects.splice(addedIndex, 1)
					} else {
						result.CSU.removedEffects.push(result.effects[foundIndex])
					}
					result.effects.splice(foundIndex, 1)
					i--
				}
			}
		};
		break;
		case "_clearBuff":
		if (result.CSU._clearBuff.data[0]){
			for (n = 0; n < result.CSU._clearBuff.data.length; n++){
				for (i = 0; i < result.effects.length; i++){
					var foundIndex = result.effects.findIndex(function(ele){ return ele.code == 31 && ele.dataId == result.CSU._clearBuff.data[n] })
					if (foundIndex == -1) break
					if (result.CSU.addedEffects.includes(foundIndex)){
						var addedIndex = result.CSU.addedEffects.indexOf(foundIndex)
						if (addedIndex != -1) result.CSU.addedEffects.splice(addedIndex, 1)
					} else {
						result.CSU.removedEffects.push(result.effects[foundIndex])
					}
					result.effects.splice(foundIndex, 1)
					i--
				}
			}
		};
		break;
		case "_clearDebuff":
		if (result.CSU._clearDebuff.data[0]){
			for (n = 0; n < result.CSU._clearDebuff.data.length; n++){
				for (i = 0; i < result.effects.length; i++){
					var foundIndex = result.effects.findIndex(function(ele){ return ele.code == 32 && ele.dataId == result.CSU._clearDebuff.data[n] })
					if (foundIndex == -1) break
					if (result.CSU.addedEffects.includes(foundIndex)){
						var addedIndex = result.CSU.addedEffects.indexOf(foundIndex)
						if (addedIndex != -1) result.CSU.addedEffects.splice(addedIndex, 1)
					} else {
						result.CSU.removedEffects.push(result.effects[foundIndex])
					}
					result.effects.splice(foundIndex, 1)
					i--
				}
			}
		};
		break;
		case "_clearAddStateEffect":
		if (result.CSU._clearAddStateEffect.data[0]){
			for (n = 0; n < result.CSU._clearAddStateEffect.data.length; n++){
				for (i = 0; i < result.effects.length; i++){
					var foundIndex = result.effects.findIndex(function(ele){ return ele.code == 21 && ele.dataId == result.CSU._clearAddStateEffect.data[n] })
					if (foundIndex == -1) break
					if (result.CSU.addedEffects.includes(foundIndex)){
						var addedIndex = result.CSU.addedEffects.indexOf(foundIndex)
						if (addedIndex != -1) result.CSU.addedEffects.splice(addedIndex, 1)
					} else {
						result.CSU.removedEffects.push(result.effects[foundIndex])
					}
					result.effects.splice(foundIndex, 1)
					i--
				}
			}
		};
		break;
		case "_clearCureStateEffect":
		if (result.CSU._clearCureStateEffect.data[0]){
			for (n = 0; n < result.CSU._clearCureStateEffect.data.length; n++){
				for (i = 0; i < result.effects.length; i++){
					var foundIndex = result.effects.findIndex(function(ele){ return ele.code == 22 && ele.dataId == result.CSU._clearCureStateEffect.data[n] })
					if (foundIndex == -1) break
					if (result.CSU.addedEffects.includes(foundIndex)){
						var addedIndex = result.CSU.addedEffects.indexOf(foundIndex)
						if (addedIndex != -1) result.CSU.addedEffects.splice(addedIndex, 1)
					} else {
						result.CSU.removedEffects.push(result.effects[foundIndex])
					}
					result.effects.splice(foundIndex, 1)
					i--
				}
			}
		};
		break;
		case "_clearLearnSkill":
		if (result.CSU._clearLearnSkill.data){
			for (i = 0; i < result.effects.length; i++){
				var foundIndex = result.effects.findIndex(function(ele){ return ele.code == 43 })
				if (foundIndex == -1) break
				if (result.CSU.addedEffects.includes(foundIndex)){
					var addedIndex = result.CSU.addedEffects.indexOf(foundIndex)
					if (addedIndex != -1) result.CSU.addedEffects.splice(addedIndex, 1)
				} else {
					result.CSU.removedEffects.push(result.effects[foundIndex])
				}
				result.effects.splice(foundIndex, 1)
				i--
			}
		};
		break;
		case "_resetGrowParam":
		for (n = 0; n < 8; n++){
			if (result.CSU._resetGrowParam.data[n]){
				for (i = 0; i < result.effects.length; i++){
					var foundIndex = result.effects.findIndex(function(ele){ return (ele.code == 42 && ele.dataId == n)})
					if (foundIndex == -1) break
					if (result.CSU.addedEffects.includes(foundIndex)){
						var addedIndex = result.CSU.addedEffects.indexOf(foundIndex)
						if (addedIndex != -1) result.CSU.addedEffects.splice(addedIndex, 1)
					} else {
						result.CSU.removedEffects.push(result.effects[foundIndex])
					}
					result.effects.splice(foundIndex, 1)
					i--
				}
			};
		}
		break;
		case "addedEffects":
		break;
		case "removedEffects":
		break;
		default:
		//console.log(traitType + " is not an Effect")
		break;
	}
};

Ramza.CS.addExtraEffects = function(result, traitType){
	//space to check for new additive traits added by extensions
	switch (traitType){
		default:
		Ramza.CS.addEffect(result, traitType)
		break;
	}
};

Ramza.CS.pushOldAdditiveTraits = function(item){
	item._oldAdditives = item.CSU
	if (item.CSU && item.CS && item.CS._addParamChange != undefined){
		for (const property in item.CS){
			Ramza.CS.combineAdditiveTraits(item.CS[property], item.CSU[property])
		}
		item.CSU = {}
	}
};

Ramza.CS.pushOldAdditiveEffects = function(item){
	item._oldAdditives = item.CSU
	if (item.CSU && item.CS && item.CS._addParamChange != undefined){
		for (const property in item.CS){
			Ramza.CS.combineAdditiveTraits(item.CS[property], item.CSU[property])
		}
		item.CSU = {}
	}
	
};

Ramza.CS.combineAdditiveTraits = function(target, ingredient) {
	switch (ingredient.dataType){
		case 1:
		//base params
		for (n = 0; n < target.data.length; n++){
			target.data[n] += ingredient.data[n]
		}
		break;
		case 2:
		//xparams or sparams
		for (n = 0; n < target.data.length; n++){
			target.data[n] += ingredient.data[n]
		}
		break
		case 3:
		//string
		if (target.data == "") target.data = ingredient.data
		break
		case 4:
		//array
		for (n = 0; n < ingredient.data.length; n++){
			target.data.push(ingredient.data[n])
		}
		break
		case 5:
		//null
		if (target.data == null) {
			target.data = ingredient.data
		} else if (target.data != null && Array.isArray(target.data) && ingredient.data != null){
			//hp or mp recovery
			target.data[0] = Math.max(0, Math.min(target.data[0] + ingredient.data[0], 1))
			target.data[1] += ingredient.data[1]
		} else if (target.data != null && !Array.isArray(target.data) && ingredient.data != null){
			//tp recovery
			target.data += ingredient.data
		}
		break
		case 6:
		//false
		if (target.data == false) target.data = ingredient.data
		break
		case 7:
		//element resist array
		for (n = 1; n < ingredient.data.length; n++){
			target.data[n] = target.data[n] * ingredient.data[n]
		}
		break
		case 8:
		//state resist array
		for (n = 1; n < ingredient.data.length; n++){
			target.data[n] = target.data[n] * ingredient.data[n]
		}
		break
		case 9:
		//state immunity array
		for (n = 1; n < ingredient.data.length; n++){
			if (ingredient.data[n]) target.data[n] = true
		}
		break
		case 10:
		//(reset grow param)
		for (n = 0; n < ingredient.data.length; n++){
			if (ingredient.data[n]) target.data[n] = true
		}
		break
		default:
		console.log("Invalid dataType")
		break
	}
};

Ramza.CS.combineNewAdditiveTraits = function(target, ingredient){
	//space to check for new additive traits from extensions
	switch (ingredient.dataType){
		default:
		Ramza.CS.combineAdditiveTraits(target, ingredient)
		break;
	}
};

Ramza.CS.findTraitsOnTwoPlusIngredients = function(itemList){
	var traitlist = []
	for (let i = 0; i < itemList.length; i++){
		traitlist[i] = JsonEx.makeDeepCopy(Ramza.CS.returnNonBlankAdditiveTraits(itemList[i]))
	}

	var combinedTraits = {}
	for (let i = 0; i < traitlist.length; i++){
		for (const property in traitlist[i]){
			//check for same property on any other index
			var check = traitlist.some(function(ele,index,array){
				if (index != i && property) return true
			})
			if (check) combinedTraits[property] = traitlist[i][property]
			
			for (let s = (i+1); s < traitlist.length; s++){
				if (traitlist[s][property]) {

				}
			}
		}
	}
	
	return combinedTraits
};

Ramza.CS.filterNewTraits = function(traits, ingredients){
	//for filtering traits added by extensions
	for (const property in traits){
		switch (traits[property].dataType){
			default:
			
			break;
		}
	}
	Ramza.CS.filterTraits(traits, ingredients)
	
};

Ramza.CS.filterTraits = function(traits, ingredients){
	//merges additive traits that are for the same param and discards any that aren't
	for (const property in traits){
		switch (traits[property].dataType){
			case 1:
			var arr = Ramza.CS.returnDefaultDatasetForType(traits[property].dataType)
			for (let i = 0; i < ingredients.length; i++){
				var itm = ingredients[i]
				if (Ramza.CS.isTraitBlank(itm.CS[property])) continue
				itm.CS[property].data.forEach(function(ele, index){
					if (ele != 0){
						for (let s = i+1; s < ingredients.length; s++){
							if (ingredients[s].CS[property].data[index] != 0) arr[index] = (arr[index]) ? arr[index] + ingredients[s].CS[property].data[index] : ingredients[i].CS[property].data[index] + ingredients[s].CS[property].data[index]
						}
					}
				})
			}
			traits[property].data = arr
			break;
			case 2:
			var arr = Ramza.CS.returnDefaultDatasetForType(traits[property].dataType)
			for (let i = 0; i < ingredients.length; i++){
				var itm = ingredients[i]
				if (Ramza.CS.isTraitBlank(itm.CS[property])) continue
				itm.CS[property].data.forEach(function(ele, index){
					if (ele != 0){
						for (let s = i+1; s < ingredients.length; s++){
							if (ingredients[s].CS[property].data[index] != 0) arr[index] = (arr[index]) ? arr[index] + ingredients[s].CS[property].data[index] : ingredients[i].CS[property].data[index] + ingredients[s].CS[property].data[index]
						}
					}
				})
			}
			traits[property].data = arr
			break;
			case 3:
			var arr = Ramza.CS.returnDefaultDatasetForType(traits[property].dataType)
			for (let i = 0; i < ingredients.length; i++){
				var itm = ingredients[i]
				if (Ramza.CS.isTraitBlank(itm.CS[property])) continue
				for (let s = i+1; s < ingredients.length; s++){
					if (ingredients[s].CS[property].data != "" && ingredients[s].CS[property].data === ingredients[i].CS[property].data) arr = ingredients[i].CS[property].data
				}
			}
			traits[property].data = arr
			break;
			case 4:
			var arr = Ramza.CS.returnDefaultDatasetForType(traits[property].dataType)
			for (let i = 0; i < ingredients.length; i++){
				var itm = ingredients[i]
				if (Ramza.CS.isTraitBlank(itm.CS[property])) continue
				itm.CS[property].data.forEach(function(ele, index){
					if (ele != 0){
						for (let s = i+1; s < ingredients.length; s++){
							if (ingredients[s].CS[property].data.includes(ele) && !arr.includes(ele)) arr.push(ele)
						}
					}
				})
			}
			traits[property].data = arr
			break;
			case 5:
			var arr = Ramza.CS.returnDefaultDatasetForType(traits[property].dataType)
			if (property == "_hpRecovery" || property == "_mpRecovery"){
				for (let i = 0; i < ingredients.length; i++){
					var itm = ingredients[i]
					if (Ramza.CS.isTraitBlank(itm.CS[property])) continue
					arr = (!arr) ? [0,0] : arr
					arr[0] += ingredients[i].CS[property].data[0]
					arr[1] += ingredients[i].CS[property].data[1]
				}
			} else {
				//tpGain
				for (let i = 0; i < ingredients.length; i++){
					var itm = ingredients[i]
					if (Ramza.CS.isTraitBlank(itm.CS[property])) continue
					for (let s = i+1; s < ingredients.length; s++){
						if (ingredients[s].CS[property].data) {
							arr = (!arr) ? ingredients[i].CS[property].data : arr
							arr += ingredients[s].CS[property].data
						}
					}
				}
				
			}
			traits[property].data = arr
			break;
			case 6:
			var arr = arr = Ramza.CS.returnDefaultDatasetForType(traits[property].dataType)
			for (let i = 0; i < ingredients.length; i++){
				var itm = ingredients[i]
				if (Ramza.CS.isTraitBlank(itm.CS[property])) continue
				for (let s = i+1; s < ingredients.length; s++){
					if (ingredients[s].CS[property].data == true) arr = true
				}
			}
			traits[property].data = arr
			break;
			case 7:
			//elementresist
			var arr = arr = Ramza.CS.returnDefaultDatasetForType(traits[property].dataType)
			for (let i = 0; i < ingredients.length; i++){
				var itm = ingredients[i]
				itm.CS[property].data.forEach(function(ele, index){
					if (ele != null && ele != 1){
						for (let s = i+1; s < ingredients.length; s++){
							if (ingredients[s].CS[property].data[index] != 1) arr[index] = (arr[index] != 1) ? arr[index] * ingredients[s].CS[property].data[index] : ingredients[i].CS[property].data[index] * ingredients[s].CS[property].data[index]
						}
					}
				})
			}
			traits[property].data = arr
			break;
			case 8:
			//stateresist
			var arr = arr = Ramza.CS.returnDefaultDatasetForType(traits[property].dataType)
			for (let i = 0; i < ingredients.length; i++){
				var itm = ingredients[i]
				itm.CS[property].data.forEach(function(ele, index){
					if (ele != null && ele != 1){
						for (let s = i+1; s < ingredients.length; s++){
							if (ingredients[s].CS[property].data[index] != 1) arr[index] = (arr[index] != 1) ? arr[index] * ingredients[s].CS[property].data[index] : ingredients[i].CS[property].data[index] * ingredients[s].CS[property].data[index]
						}
					}
				})
			}
			traits[property].data = arr
			break;
			case 9:
			//stateimmunity
			var arr = arr = Ramza.CS.returnDefaultDatasetForType(traits[property].dataType)
			for (let i = 0; i < ingredients.length; i++){
				var itm = ingredients[i]
				itm.CS[property].data.forEach(function(ele, index){
					if (ele != null && ele != 1){
						for (let s = i+1; s < ingredients.length; s++){
							if (ingredients[s].CS[property].data[index] == true) arr[index] = true
						}
					}
				})
			}
			traits[property].data = arr
			break;
			case 10:
			var arr = arr = Ramza.CS.returnDefaultDatasetForType(traits[property].dataType)
			for (let i = 0; i < ingredients.length; i++){
				var itm = ingredients[i]
				itm.CS[property].data.forEach(function(ele, index){
					if (ele == true){
						for (let s = i+1; s < ingredients.length; s++){
							if (ingredients[s].CS[property].data[index] == true) arr[index] = true
						}
					}
				})
			}
			traits[property].data = arr
			break;
			default: 
			console.log(traits[property])
			break;
		}

	}
	//console.log(traits._hpRecovery.data)
};


//====================================================
//Game_Party
//====================================================

Ramza.CS.PartyInit = Game_Party.prototype.initialize
Game_Party.prototype.initialize = function() {
    Ramza.CS.PartyInit.call(this);
	this.initRecipeUnlocks();
	if (Ramza.CSParams.CraftingLevels) this.initCraftingLevels();
	this.initLockedSlots();
	if (Ramza.CSParams.CraftingLevels) this.initCraftingExperience();
	this.initHiddenCategories();
	this.initDisabledCategories();
	this.initDisabledRecipes();
};

Game_Party.prototype.initRecipeUnlocks = function() {
	this._craftingRecipes = []
	for (i = 0; i < Ramza.CSParams.numRecipes; i++){
		this._craftingRecipes[i] = Ramza.CSParams.resultItem[i].Unlocked
	};
};

Game_Party.prototype.initDisabledRecipes = function(){
	this._disabledRecipes = []
	this._disabledRecipes.length = this._craftingRecipes.length
	for (i = 0; i < this._disabledRecipes.length; i++){
		this._disabledRecipes[i] = false
	}
}

Game_Party.prototype.loseIngredientItem = function(item, amount, includeEquip) {
	$gameTemp.takeIngredients = $gameTemp.takeIngredients || {}
	$gameTemp.takeIngredients.list = $gameTemp.takeIngredients.list || []
	$gameTemp.takeIngredients.list.push(item)
	if (item._consumedOnSuccess) $gameParty.gainItem(item, amount, includeEquip)
};

if (Imported.YEP_ItemCore){
	Ramza.CS.Register_New_item = DataManager.registerNewItem
	DataManager.registerNewItem = function(item) {
		var newItem = Ramza.CS.Register_New_item.call(this, item)
		if ($gameTemp.takeIngredients) {
			$gameTemp.takeIngredients.result = $gameTemp.takeIngredients.result || []
			$gameTemp.takeIngredients.result.push(newItem)
		}
		return newItem;
	};
};

Ramza.CS.gain_item = Game_Party.prototype.gainItem
Game_Party.prototype.gainItem = function(item, amount, includeEquip){
	if (Imported.YEP_ItemCore && DataManager.isIndependent(item) && amount < 0 && item.id >= Yanfly.Param.ItemStartingId && SceneManager._scene.constructor.name == "Scene_Crafting"){
		Ramza.CS.gain_item.call(this, item, -1, includeEquip);
		amount += 1
		if (amount != 0) Ramza.CS.gain_item.call(this, $dataItems[item.baseItemId], amount, includeEquip);
	} else {
		Ramza.CS.gain_item.call(this, item, amount, includeEquip)
	}
};

Game_Party.prototype.initHiddenCategories = function(){
	this._hiddenCategories = {}
	for (i = 0; i < Ramza.CSParams.craftCategories.length; i++){
		this._hiddenCategories[Ramza.CSParams.craftCategories[i]] = Ramza.CSParams.hiddenCategories.contains(Ramza.CSParams.craftCategories[i])
	};
};

Game_Party.prototype.initDisabledCategories = function(){
	this._disabledCategories = {}
	for (i = 0; i < Ramza.CSParams.CategoryMenuCommand.length; i++){
		this._disabledCategories[String(Ramza.CSParams.CategoryMenuCommand[i].Category).toLowerCase()] = !Ramza.CSParams.CategoryMenuCommand[i].Enabled
	};
};

Game_Party.prototype.showCategory = function(category){
	if (this._hiddenCategories[category] != undefined){
		this._hiddenCategories[category] = false
	}
};

Game_Party.prototype.hideCategory = function(category){
	if (this._hiddenCategories[category] != undefined){
		this._hiddenCategories[category] = true
	}
};

Game_Party.prototype.toggleHiddenCategory = function(category){
	if (this._hiddenCategories[category] != undefined){
		this._hiddenCategories[category] = !this._hiddenCategories[category]
	}
};

Game_Party.prototype.enableCategory = function(category){
	this._disabledCategories[category] = false
};

Game_Party.prototype.disableCategory = function(category){
	this._disabledCategories[category] = true
};

Game_Party.prototype.toggleEnableCategory = function(category){
	this._disabledCategories[category] = !this._disabledCategories[category]
};

Game_Party.prototype.isCategoryEnabled = function(category){
	return !this._disabledCategories[category]
};

Game_Party.prototype.getCraftLevel = function(category){
	return $gameParty._craftLevels[category]
};

Game_Party.prototype.getCraftExperience = function(category){
	return $gameParty._craftExperience[category]
};

Game_Party.prototype.changeCraftExperience = function(category, add){
	$gameParty._craftExperience[category] = $gameParty._craftExperience[category] + add
	var level = $gameParty._craftLevels[this._category]
	var requiredexp = eval(Ramza.CSParams.ExperienceCurve)
	if ($gameParty._craftExperience[category] < 0) $gameParty._craftExperience[category] = 0
	if ($gameParty._craftExperience[category] > requiredexp ) {
		$gameParty._craftLevels[category] += 1
		if ($gameParty._craftLevels[category] > Ramza.CSParams.MaxLevel) $gameParty._craftLevels[category] = Ramza.CSParams.MaxLevel
		$gameParty._craftExperience[category] = 0
	}
};

Game_Party.prototype.setCraftLevel = function(category, level){
	$gameParty._craftLevels[category] = level
	if ($gameParty._craftLevels[category] > Ramza.CSParams.MaxLevel) $gameParty._craftLevels[category] = Ramza.CSParams.MaxLevel
	$gameParty._craftExperience[category] = 0
};

Game_Party.prototype.changeCraftLevel = function(category, add){
	$gameParty._craftLevels[category] = $gameParty._craftLevels[category] + add
	if ($gameParty._craftLevels[category] > Ramza.CSParams.MaxLevel) $gameParty._craftLevels[category] = Ramza.CSParams.MaxLevel
	$gameParty._craftExperience[category] = 0
};

Game_Party.prototype.initCraftingLevels = function() {
	this._craftLevels = {}
	for (i = 0; i < Ramza.CSParams.craftCategories.length; i++){
		var objName = Ramza.CSParams.craftCategories[i]
		var text = "this._craftLevels." + objName  + " = 1"
		eval(text)
	};
};

Game_Party.prototype.initCraftingExperience = function() {
	this._craftExperience = {}
	for (i = 0; i < Ramza.CSParams.craftCategories.length; i++){
		var objName = Ramza.CSParams.craftCategories[i]
		var text = "this._craftExperience." + objName  + " = 0"
		eval(text)
	};
};

Game_Party.prototype.initLockedSlots = function(){
	this._lockedSlots = [false, false]
	if (Ramza.CSParams.slotsLocked == "None"){
		this._lockedSlots.push(false)
		this._lockedSlots.push(false)
	} else if (Ramza.CSParams.slotsLocked == "3 and 4"){
		this._lockedSlots.push(true)
		this._lockedSlots.push(true)
	} else if (Ramza.CSParams.slotsLocked == "Only 4"){
		this._lockedSlots.push(false)
		this._lockedSlots.push(true)
	}
}

Ramza.CS.Game_System_initialize = Game_System.prototype.initialize
Game_System.prototype.initialize = function(){
	Ramza.CS.Game_System_initialize.call(this)
	this._craftingShow = Ramza.CSParams.ShowInMenu
	this._craftingEnabled = Ramza.CSParams.MenuCommandEnabled
};

Game_System.prototype.showCraftCommand = function(){
	this._craftingShow = true
};

Game_System.prototype.hideCraftCommand = function(){
	this._craftingShow = false
};

Game_System.prototype.enableCraftCommand = function(){
	this._craftingEnabled = true
};

Game_System.prototype.disableCraftCommand = function(){
	this._craftingEnabled = false
};

Game_System.prototype.isCraftCommandEnabled = function(){
	return this._craftingEnabled
};

Ramza.CS.Window_MenuCommand_addOriginalCommands =
    Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
    Ramza.CS.Window_MenuCommand_addOriginalCommands.call(this);
    this.addCraftCommand();
	this.addSpecificCraftCommands();
};

Window_MenuCommand.prototype.addCraftCommand = function() {
    if (!$gameSystem._craftingShow) return;
    if (this.findSymbol('craft') > -1) return;
    var text = Ramza.CSParams.MenuString
    var enabled = $gameSystem.isCraftCommandEnabled();
    this.addCommand(text, 'craft', enabled);
};

Window_MenuCommand.prototype.addSpecificCraftCommands = function(){
	if (Ramza.CSParams.CategoryMenuCommand.length > 0){
		/*if (Ramza.CSParams.CategoryMenuCommand.length == 1){
			
			for (i = 0; i < Ramza.CSParams.CategoryMenuCommand.length; i++){
				var name = String(JSON.parse(Ramza.CSParams.CategoryMenuCommand[i]).Category).toLowerCase()
				if ($gameParty._hiddenCategories[name] == true) continue;
				if (this.findSymbol(name) > -1) continue;
				var text = Ramza.CSParams.CategoryMenuCommand[i].Category
				var enabled = !$gameParty._disabledCategories[name]
				this.addCommand(text, name, enabled)
			}
		} else {*/
			for (i = 0; i < Ramza.CSParams.CategoryMenuCommand.length; i++){
				var name = String(Ramza.CSParams.CategoryMenuCommand[i].Category).toLowerCase()
				if ($gameParty._hiddenCategories[name] == true) continue;
				if (this.findSymbol(name) > -1) continue;
				var text = Ramza.CSParams.CategoryMenuCommand[i].Category
				var enabled = !$gameParty._disabledCategories[name]
				this.addCommand(text, name, enabled)
		}	
		}
	//}
};

Ramza.CS.Scene_Menu_createCommandWindow =
    Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    Ramza.CS.Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler('craft', this.commandCrafting.bind(this));
	for (i = 0; i < Ramza.CSParams.CategoryMenuCommand.length; i++){
		var name = String(Ramza.CSParams.CategoryMenuCommand[i].Category).toLowerCase()
		this._commandWindow.setHandler(name, this.commandSpecificCrafting.bind(this));
	}
};

Scene_Menu.prototype.commandCrafting = function(){
	SceneManager.push(Scene_Crafting)
}

Scene_Menu.prototype.commandSpecificCrafting = function(){
	$gameTemp._craftCategory = this._commandWindow.currentSymbol()
	SceneManager.push(Scene_Crafting)
}

DataManager.updateRecipes = function(){
	//updates recipe ingredient lists to contain the actual item objects
	for (i = 0; i < Ramza.CSParams.numRecipes; i++){
		for (n = 0; n < Ramza.CSParams.resultItem[i].recipes.length; n++){
			obj = Ramza.CSParams.resultItem[i].recipes[n]
			obj.itemList = []
			obj.quantityList = []
			var checktext = "$data" + obj.BaseItemType + "s" + "[" + obj.BaseItemID + "]"
			if (obj.BaseItemType != "Category") {
				obj.BaseItem = eval(checktext)
				obj.itemList.push(obj.BaseItem)
				obj.quantityList.push(obj.BaseItemQuantity)
			} else {
				obj.BaseItem = "Category"
				obj.itemList.push(obj.BaseItem)
				obj.quantityList.push(obj.BaseItemQuantity)
			}	
			checktext = "$data" + obj.SecondItemType + "s" + "[" + obj.SecondItemID + "]"
			if (obj.SecondItemType != "Category") {
				obj.SecondItem = eval(checktext)
				obj.itemList.push(obj.SecondItem)
				obj.quantityList.push(obj.SecondItemQuantity)
			} else {
				obj.SecondItem = "Category"
				obj.itemList.push(obj.SecondItem)
				obj.quantityList.push(obj.SecondItemQuantity)
			}
			checktext = "$data" + obj.ThirdItemType + "s" + "[" + obj.ThirdItemID + "]"
			if (obj.ThirdItemType != "Category" && obj.ThirdItemType != "None") {
				obj.ThirdItem = eval(checktext)
				obj.itemList.push(obj.ThirdItem)
				obj.quantityList.push(obj.ThirdItemQuantity)
			} else if (obj.ThirdItemType == "Category") {
				obj.ThirdItem = "Category"
				obj.itemList.push(obj.ThirdItem)
				obj.quantityList.push(obj.ThirdItemQuantity)
			} else {
				obj.ThirdItem = null
			}
			checktext = "$data" + obj.FourthItemType + "s" + "[" + obj.FourthItemID + "]"
			if (obj.FourthItemType != "Category" && obj.FourthItemType != "None") {
				obj.FourthItem = eval(checktext)
				obj.itemList.push(obj.FourthItem)
				obj.quantityList.push(obj.FourthItemQuantity)
			} else if (obj.FourthItemType == "Category") {
				obj.FourthItem = "Category"
				obj.itemList.push(obj.FourthItem)
				obj.quantityList.push(obj.FourthItemQuantity)
			} else {
				obj.FourthItem = null
			}
			obj.originalOrder = JsonEx.makeDeepCopy(obj.itemList)
			//obj.itemList.sort(function(a, b){return a.id - b.id})
			obj.itemList.sort(function(a, b){
				if (Imported.YEP_ItemCore && a.id > Yanfly.Param.ItemStartingId) {
					var compA = a.baseItemId
				} else {
					var compA = a.id
				}
				if (Imported.YEP_ItemCore && b.id > Yanfly.Param.ItemStartingId) {
					var compB = b.baseItemId
				} else {
					var compB = b.id
				}
				return compA - compB
				});
		//find sorted quantities
			obj.sortedQuantities = []
			if(obj.itemList[0].id === obj.originalOrder[0].id){
				//position 1 is the same
				obj.sortedQuantities.push(obj.quantityList[0])
			} else {
				//original slot 1 item has moved
				for (c = 0; c < obj.itemList.length; c++){
					//locate original position
					if (obj.itemList[0].id == obj.originalOrder[c].id){
						//moved from slot i
						obj.sortedQuantities.push(obj.quantityList[c])
					}
				}
			}
			if(obj.itemList[1].id === obj.originalOrder[1].id){
				//position 2 is the same
				obj.sortedQuantities.push(obj.quantityList[1])
			} else {
				//original slot 2 item has moved
				for (c = 0; c < obj.itemList.length; c++){
					//locate original position
					if (obj.itemList[1].id == obj.originalOrder[c].id){
						//moved from slot i
						obj.sortedQuantities.push(obj.quantityList[c])
					}
				}
			}
			if (obj.itemList[2] && obj.itemList[2].id === obj.originalOrder[2].id){
				//position 3 is the same
				obj.sortedQuantities.push(obj.quantityList[2])
			} else if (obj.itemList[2]){
				//original slot 3 item has moved
				for (c = 0; c < obj.itemList.length; c++){
					//locate original position
					if (obj.itemList[2].id == obj.originalOrder[c].id){
						//moved from slot i
						obj.sortedQuantities.push(obj.quantityList[c])
					}
				}
			}
			if (obj.itemList[3] && obj.itemList[3].id === obj.originalOrder[3].id){
				//position 4 is the same
				obj.sortedQuantities.push(obj.quantityList[2])
			} else if (obj.itemList[3]){
				//original slot 4 item has moved
				for (c = 0; c < obj.itemList.length; c++){
					//locate original position
					if (obj.itemList[3].id == obj.originalOrder[c].id){
						//moved from slot i
						obj.sortedQuantities.push(obj.quantityList[c])
					}
				}
			}
			obj.quantityList = obj.sortedQuantities
			obj.sortedQuantities = undefined

		}
	}
};

Ramza.CS.sortIngredientsArray = function(a, b){
	if (Imported.YEP_ItemCore && a.item.id > Yanfly.Param.ItemStartingId){
		var compA = a.item.baseItemId
	} else {
		var compA = a.item.id
	}
	if (Imported.YEP_ItemCore && b.item.id > Yanfly.Param.ItemStartingId){
		var compB = b.item.baseItemId
	} else {
		var compB = b.item.id
	}
	return compA - compB
};

Ramza.CS.findRecipe = function (ingredients, quantity){
	for (i = quantity.length; i < ingredients.length; i++) {
		quantity.push(1)
	}
	var providedIngredients = []
	for (i = 0; i < ingredients.length; i++){
		providedIngredients[i] = {}
		providedIngredients[i].item = ingredients[i]
		providedIngredients[i].qty = quantity[i]
	}
	providedIngredients.sort(Ramza.CS.sortIngredientsArray)
		
	//check for whole recipes in order of the resultItem list
	for (i = 0; i < Ramza.CSParams.numRecipes; i++){
		var diffrecipes = Ramza.CSParams.resultItem[i].recipes.length
		var resultItem = Ramza.CSParams.resultItem[i]
		//disqualify a result item that is disabled
		if ($gameParty._disabledRecipes[i]) continue
		for (n = 0; n < diffrecipes; n++){
			providedIngredients.sort(Ramza.CS.sortIngredientsArray)
			var recipe = Ramza.CSParams.resultItem[i].recipes[n]
			//disqualify recipes that do not match length of ingredients array
			if (recipe.itemList.length < providedIngredients.length) continue
			//disqualify recipes that are not from the selected category
			if (SceneManager._scene._category && resultItem.CraftType.toLowerCase() != SceneManager._scene._category) continue
			for (let x = 0; x < providedIngredients.length; x++){
				delete providedIngredients[x].used
			}
			var result = []
			var craftCategory = {cat1: (recipe.Category) ? recipe.Category.toLowerCase() : "", cat1found: false, 
			cat2: (recipe.SecondCategory) ? recipe.SecondCategory.toLowerCase() : "", cat2found: false,
			cat3: (recipe.ThirdCategory) ? recipe.ThirdCategory.toLowerCase() : "", cat3found: false, 
			cat4: (recipe.FourthCategory) ? recipe.FourthCategory.toLowerCase(): "", cat4found: false}
			for (k = 0;  k < recipe.itemList.length; k++ ){
				//check for ingredient category
				if (recipe.itemList[k] === "Category"){
					//Category found
					switch (k){
						case 0:
						//category on item 0
						for (u = 0; u < providedIngredients.length; u++){
							//loop through each item to find a category match
							if (providedIngredients[u].item._craftCategory === craftCategory.cat1 && (providedIngredients[u].qty >= recipe.quantityList[k])
								&& !craftCategory.cat1found && !providedIngredients[u].used){
								//category match on item u
								result.push(true)
								craftCategory.cat1found = true
								providedIngredients[u].used = true
								providedIngredients.move(u, k)
							}
						}
						break
						case 1:
						//category on item 1
						for (u = 0; u < providedIngredients.length; u++){
							//loop through each item to find a category match
							//console.log(providedIngredients[u].qty, recipe.quantityList[k])
							if (providedIngredients[u].item._craftCategory === craftCategory.cat2 && (providedIngredients[u].qty >= recipe.quantityList[k])
								&& !craftCategory.cat2found && !providedIngredients[u].used){
								//category match on item u
								result.push(true)
								craftCategory.cat2found = true
								providedIngredients[u].used = true
								providedIngredients.move(u, k)
							}
						}
						break
						case 2:
						//category on item 2
						for (u = 0; u < providedIngredients.length; u++){
							//loop through each item to find a category match
							if (providedIngredients[u].item._craftCategory === craftCategory.cat3 && (providedIngredients[u].qty >= recipe.quantityList[k])
								&& !craftCategory.cat3found && !providedIngredients[u].used){
								//category match on item u
								result.push(true)
								craftCategory.cat3found = true
								providedIngredients[u].used = true
								providedIngredients.move(u, k)
							}
						}
						break
						case 3:
						//category on item 3
						for (u = 0; u < providedIngredients.length; u++){
							//loop through each item to find a category match
							if (providedIngredients[u].item._craftCategory === craftCategory.cat4 && (providedIngredients[u].qty >= recipe.quantityList[k])
								&& !craftCategory.cat4found && !providedIngredients[u].used){
								//category match on item u
								result.push(true)
								craftCategory.cat4found = true
								providedIngredients[u].used = true
								providedIngredients.move(u, k)
							}
						}
						default: 
						break
					}
				}
					//check recipe for matches in ingredients array
					for (u = 0; u < providedIngredients.length; u++){
						if(!Imported.YEP_ItemCore){
							if (providedIngredients[u].item == recipe.itemList[k] && !providedIngredients[u].used){
								//item match
								if (providedIngredients[u].qty < recipe.quantityList[k]) continue //insufficient quantities
								result.push(true)
								providedIngredients[u].used = true
								break
							}
						} else {
							if (providedIngredients[u].item == recipe.itemList[k] && !providedIngredients[u].used){
								//item match
								if (providedIngredients[u].qty < recipe.quantityList[k]) continue //insufficient quantities
								result.push(true)
								providedIngredients[u].used = true
								break
							} else {
								//check for unique item
								if (providedIngredients[u].item.itypeId && !providedIngredients[u].item.nonIndependent){
									//found unique item
									if ($dataItems[providedIngredients[u].item.baseItemId] == recipe.itemList[k]  && !providedIngredients[u].used){
										//item match
										if (providedIngredients[u].qty < recipe.quantityList[k]) continue //insufficient quantities
										result.push(true)
										providedIngredients[u].used = true
										break
									}
								} else if (providedIngredients[u].item.etypeId && providedIngredients[u].item.etypeId == 1 && !providedIngredients[u].item.nonIndependent){
									//found unique weapon
									if ($dataWeapons[providedIngredients[u].item.baseItemId] == recipe.itemList[k] && !providedIngredients[u].used){
										//item match
										if (providedIngredients[u].qty < recipe.quantityList[k]) continue //insufficient quantities
										result.push(true)
										providedIngredients[u].used = true
										break
									}
								} else if (providedIngredients[u].item.etypeId && providedIngredients[u].item.etypeId != 1 && !providedIngredients[u].item.nonIndependent){
									//found unique armor
									if ($dataArmors[providedIngredients[u].item.baseItemId] == recipe.itemList[k] && !providedIngredients[u].used){
										//item match
										if (providedIngredients[u].qty < recipe.quantityList[k]) continue //insufficient quantities
										result.push(true)
										providedIngredients[u].used = true
										break
									}
								}
							}
						}
					}
			}
			if (result.length == recipe.itemList.length) return [true, resultItem, n]
		}
	}
	//no full match found, check partials
	//check for partial recipe
	if (Ramza.CSParams.AllowPartialRecipes){
		return Ramza.CS.findPartialRecipe(providedIngredients)
	} else {
		return false
	}
};

Ramza.CS.findPartialRecipe = function(inputArray){
	//Recipes must have at least two ingredients
	if (inputArray.length == 2) return false
	
	// check for n-1
	inputArray.sort(Ramza.CS.sortIngredientsArray)
	if (inputArray.length > 2){
		for (i = 0; i < Ramza.CSParams.numRecipes; i++){
			var diffrecipes = Ramza.CSParams.resultItem[i].recipes.length
			var resultItem = Ramza.CSParams.resultItem[i]
			//disqualify a result item that is disabled
			if ($gameParty._disabledRecipes[i]) continue
			for (n = 0; n < diffrecipes; n++){
				var recipe = resultItem.recipes[n]
				//disqualify recipes that are too large
				for (let x = 0; x < inputArray.length; x++){
					delete inputArray[x].used
				}
				if (recipe.itemList.length != inputArray.length -1) continue
				//disqualify recipes that are not from the selected category
				if (SceneManager._scene._category && resultItem.CraftType.toLowerCase() != SceneManager._scene._category) continue
				var result = []
				var craftCategory = {cat1: (recipe.Category) ? recipe.Category.toLowerCase() : "", cat1found: false, 
				cat2: (recipe.SecondCategory) ? recipe.SecondCategory.toLowerCase() : "", cat2found: false,
				cat3: (recipe.ThirdCategory) ? recipe.ThirdCategory.toLowerCase() : "", cat3found: false, 
				cat4: (recipe.FourthCategory) ? recipe.FourthCategory.toLowerCase(): "", cat4found: false}
				for (k = 0; k < recipe.itemList.length; k++){
					//check for category match
					if (recipe.itemList[k] === "Category"){
						//Category found
						switch (k){
							case 0:
								//category on item 0
								for (u = 0; u < inputArray.length; u++){
									//loop through each item to find a category match
									if (inputArray[u].item._craftCategory === craftCategory.cat1 && (inputArray[u].qty >= recipe.quantityList[k])
										&& !craftCategory.cat1found && !inputArray[u].used){
										//category match on item u
										result.push(true)
										craftCategory.cat1found = true
										inputArray[u].used = true
										inputArray.move(u, k)
									}
								}
							break
							case 1:
								//category on item 1
								for (u = 0; u < inputArray.length; u++){
									//loop through each item to find a category match
									if (inputArray[u].item._craftCategory === craftCategory.cat2 && (inputArray[u].qty >= recipe.quantityList[k])
										&& !craftCategory.cat2found && !inputArray[u].used){
										//category match on item u
										result.push(true)
										craftCategory.cat2found = true
										inputArray[u].used = true
										inputArray.move(u, k)
									}
								}
							break
							case 2:
								//category on item 2
								for (u = 0; u < inputArray.length; u++){
									//loop through each item to find a category match
									if (inputArray[u].item._craftCategory === craftCategory.cat3 && (inputArray[u].qty >= recipe.quantityList[k])
									&& !craftCategory.cat3found && !inputArray[u].used){
										//category match on item u
										result.push(true)
										craftCategory.cat3found = true
										inputArray[u].used = true
										inputArray.move(u, k)
									}
								}
							break
							case 3:
								//category on item 3
								for (u = 0; u < inputArray.length; u++){
									//loop through each item to find a category match
									if (inputArray[u].item._craftCategory === craftCategory.cat4 && (inputArray[u].qty >= recipe.quantityList[k])
										&& !craftCategory.cat4found && !inputArray[u].used){
										//category match on item u
										result.push(true)
										craftCategory.cat4found = true
										inputArray[u].used = true
										inputArray.move(u, k)
									}
								}
							break
							default: 
							break
						}
					}
					//check inputArray vs requiredingredients for recipe
					for (u = 0; u < inputArray.length; u++){
						if(!Imported.YEP_ItemCore){
							if (inputArray[u].item == recipe.itemList[k] && !inputArray[u].used){
								//item match
								if (inputArray[u].qty < recipe.quantityList[k]) continue //insufficient quantities
								result.push(true)
								inputArray[u].used = true
								break
							}
						} else {
							if (inputArray[u].item == recipe.itemList[k] && !inputArray[u].used){
								//item match
								if (inputArray[u].qty < recipe.quantityList[k]) continue //insufficient quantities
								result.push(true)
								inputArray[u].used = true
								break
							} else {
								//check for unique item
								if (inputArray[u].item.itypeId && !inputArray[u].item.nonIndependent){
									//found unique item
									if ($dataItems[inputArray[u].item.baseItemId] == recipe.itemList[k] && !inputArray[u].used){
										//item match
										if (inputArray[u].qty < recipe.quantityList[k]) continue //insufficient quantities
										result.push(true)
										inputArray[u].used = true
										break
									}
								} else if (inputArray[u].item.etypeId && inputArray[u].item.etypeId == 1 && inputArray.item.nonIndependent){
									//unique weapon found
									if ($dataWeapons[inputArray[u].item.baseItemId] == recipe.itemList[k] && !inputArray[u].used){
										//item match
										if (inputArray[u].qty < recipe.quantityList[k]) continue //insufficient quantities
										result.push(true)
										inputArray[u].used = true
										break
									}
								} else if (inputArray[u].item.etypeId && inputArray[u].item.etypeId != 1 && inputArray.item.nonIndependent){
									//unique armor found
									if ($dataArmors[inputArray[u].item.baseItemId] == recipe.itemList[k] && !inputArray[u].used){
										//item match
										if (inputArray[u].qty < recipe.quantityList[k]) continue //insufficient quantities
										result.push(true)
										inputArray[u].used = true
										break
									}
								}
							}
						}
					}
					if (result.length == recipe.itemList.length) return [false, resultItem, n]
				}
				
			}
		}
	}
	
	// check for n-2
	inputArray.sort(Ramza.CS.sortIngredientsArray)
	if (inputArray.length == 4){
		for (i = 0; i < Ramza.CSParams.numRecipes; i++){
			var diffrecipes = Ramza.CSParams.resultItem[i].recipes.length
			var resultItem = Ramza.CSParams.resultItem[i]
			//disqualify a result item that is disabled
			if ($gameParty._disabledRecipes[i]) continue
			for (n = 0; n < diffrecipes; n++){
				var recipe = resultItem.recipes[n]
				//disqualify recipes that are too large
				for (let x = 0; x < inputArray.length; x++){
					delete inputArray[x].used
				}
				if (recipe.itemList.length != inputArray.length -2) continue
				//disqualify recipes that are not from the selected category
				if (SceneManager._scene._category && resultItem.CraftType.toLowerCase() != SceneManager._scene._category) continue
				var result = []
				var craftCategory = {cat1: (recipe.Category) ? recipe.Category.toLowerCase() : "", cat1found: false, 
				cat2: (recipe.SecondCategory) ? recipe.SecondCategory.toLowerCase() : "", cat2found: false,
				cat3: (recipe.ThirdCategory) ? recipe.ThirdCategory.toLowerCase() : "", cat3found: false, 
				cat4: (recipe.FourthCategory) ? recipe.FourthCategory.toLowerCase(): "", cat4found: false}
				for (k = 0; k < recipe.itemList.length; k++){
					//check for category match
					if (recipe.itemList[k] === "Category"){
						//Category found
						switch (k){
							case 0:
								//category on item 0
								for (u = 0; u < inputArray.length; u++){
									//loop through each item to find a category match
									if (inputArray[u].item._craftCategory === craftCategory.cat1 && (inputArray[u].qty >= recipe.quantityList[k])
										&& !craftCategory.cat1found && !inputArray[u].used){
										//category match on item u
										result.push(true)
										craftCategory.cat1found = true
										inputArray[u].used = true
										inputArray.move(u, k)
									}
								}
							break
							case 1:
								//category on item 1
								for (u = 0; u < inputArray.length; u++){
									//loop through each item to find a category match
									if (inputArray[u].item._craftCategory === craftCategory.cat2 && (inputArray[u].qty >= recipe.quantityList[k])
										&& !craftCategory.cat2found && !inputArray[u].used){
										//category match on item u
										result.push(true)
										craftCategory.cat2found = true
										inputArray[u].used = true
										inputArray.move(u, k)
									}
								}
							break
							case 2:
								//category on item 2
								for (u = 0; u < inputArray.length; u++){
									//loop through each item to find a category match
									if (inputArray[u].item._craftCategory === craftCategory.cat3 && (inputArray[u].qty >= recipe.quantityList[k])
									&& !craftCategory.cat3found && !inputArray[u].used){
										//category match on item u
										result.push(true)
										craftCategory.cat3found = true
										inputArray[u].used = true
										inputArray.move(u, k)
									}
								}
							break
							case 3:
								//category on item 3
								for (u = 0; u < inputArray.length; u++){
									//loop through each item to find a category match
									if (inputArray[u].item._craftCategory === craftCategory.cat4 && (inputArray[u].qty >= recipe.quantityList[k])
										&& !craftCategory.cat4found && !inputArray[u].used){
										//category match on item u
										result.push(true)
										craftCategory.cat4found = true
										inputArray[u].used = true
										inputArray.move(u, k)
									}
								}
							break
							default: 
							break
						}
					}
					//check inputArray vs requiredingredients for recipe
					for (u = 0; u < inputArray.length; u++){
						if(!Imported.YEP_ItemCore){
							if (inputArray[u].item == recipe.itemList[k] && !inputArray[u].used){
								//item match
								if (inputArray[u].qty < recipe.quantityList[k]) continue //insufficient quantities
								result.push(true)
								inputArray[u].used = true
								break
							}
						} else {
							if (inputArray[u].item == recipe.itemList[k] && !inputArray[u].used){
								//item match
								if (inputArray[u].qty < recipe.quantityList[k]) continue //insufficient quantities
								result.push(true)
								inputArray[u].used = true
								break
							} else {
								//check for unique item
								if (inputArray[u].item.itypeId && !inputArray[u].item.nonIndependent){
									//found unique item
									if ($dataItems[inputArray[u].item.baseItemId] == recipe.itemList[k] && !inputArray[u].used){
										//item match
										if (inputArray[u].qty < recipe.quantityList[k]) continue //insufficient quantities
										result.push(true)
										inputArray[u].used = true
										break
									}
								} else if (inputArray[u].item.etypeId && inputArray[u].item.etypeId == 1 && inputArray.item.nonIndependent){
									//unique weapon found
									if ($dataWeapons[inputArray[u].item.baseItemId] == recipe.itemList[k] && !inputArray[u].used){
										//item match
										if (inputArray[u].qty < recipe.quantityList[k]) continue //insufficient quantities
										result.push(true)
										inputArray[u].used = true
										break
									}
								} else if (inputArray[u].item.etypeId && inputArray[u].item.etypeId != 1 && inputArray.item.nonIndependent){
									//unique armor found
									if ($dataArmors[inputArray[u].item.baseItemId] == recipe.itemList[k] && !inputArray[u].used){
										//item match
										if (inputArray[u].qty < recipe.quantityList[k]) continue //insufficient quantities
										result.push(true)
										inputArray[u].used = true
										break
									}
								}
							}
						}
					}
					if (result.length == recipe.itemList.length) return [false, resultItem, n]
				}
				
			}
		}
	}
	return false
}


Ramza.CS.checkQuantities = function(array1, array2){
	if (array1.length != array2.length){
		return false
	}
	for (z = 0; z < array1.length; z++){
		if (array1[z] < array2[z]){
			//if the required quantity is higher than what was provided
			return false
		}
	}
	return true
};


//=============================================================================
// Window_CraftingCategories
//=============================================================================

function Window_CraftingCategories() {
    this.initialize.apply(this, arguments);
}

Window_CraftingCategories.prototype = Object.create(Window_Command.prototype);
Window_CraftingCategories.prototype.constructor = Window_CraftingCategories;

Window_CraftingCategories.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
};

Window_CraftingCategories.prototype.windowWidth = function() {
    return Graphics.boxWidth / 3;
};

Window_CraftingCategories.prototype.numVisibleRows = function() {
    return this._list.length
	//Ramza.CSParams.craftCategories.length + 1
	//return 4;
};

Window_CraftingCategories.prototype.makeCommandList = function() {
    this.addItemCommands();
    //this.addCustomCommand();
    this.addFinishCommand();
};

Window_CraftingCategories.prototype.addItemCommands = function() {
	Ramza.CSParams.craftCategories.sort()
	var blockedcomms = []
	for (i = 0; i < Ramza.CSParams.CategoryMenuCommand.length; i++){
		var check = String(Ramza.CSParams.CategoryMenuCommand[i].Category).toLowerCase()
		if (!blockedcomms.includes(check)) blockedcomms.push(check)
	};
	for (i = 0; i < Ramza.CSParams.craftCategories.length; i++){
		if ($gameParty._hiddenCategories[Ramza.CSParams.craftCategories[i]] == false && !blockedcomms.includes(Ramza.CSParams.craftCategories[i])){
			var name = Ramza.CSParams.craftCategories[i].charAt(0).toUpperCase() + Ramza.CSParams.craftCategories[i].slice(1)
			this.addCommand(name, Ramza.CSParams.craftCategories[i], $gameParty.isCategoryEnabled(Ramza.CSParams.craftCategories[i]));
		};
	}
};

Window_CraftingCategories.prototype.addCustomCommand = function() {
};

Window_CraftingCategories.prototype.addFinishCommand = function() {
    this.addCommand("Cancel", 'cancel', true);
};

Window_CraftingCategories.prototype.updateHelp = function() {
    if (this._categoryWindow.active) {
      //this._helpWindow.setText('butts');
    }
};

//=================================================
// Window_IngredientCategory
//=================================================



function Window_IngredientCategory() {
    this.initialize.apply(this, arguments);
}

Window_IngredientCategory.prototype = Object.create(Window_HorzCommand.prototype);
Window_IngredientCategory.prototype.constructor = Window_IngredientCategory;

Window_IngredientCategory.prototype.initialize = function() {
    Window_HorzCommand.prototype.initialize.call(this, 0, arguments[1]);
};

Window_IngredientCategory.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_IngredientCategory.prototype.maxCols = function() {
    return 4;
};

Window_IngredientCategory.prototype.update = function() {
    Window_HorzCommand.prototype.update.call(this);
	if (this._listWindow) {		
        this._listWindow.setCategory(this.currentSymbol());
    }
};

Window_IngredientCategory.prototype.makeCommandList = function() {
    this.addCommand(TextManager.item,    'item');
    this.addCommand(TextManager.weapon,  'weapon');
    this.addCommand(TextManager.armor,   'armor');
    this.addCommand(Ramza.CSParams.ClearText,   'clear');
};

Window_IngredientCategory.prototype.processCursorMove = function() {
	var lastIndex = this.index();
	Window_Selectable.prototype.processCursorMove.call(this);
	if (this.index() !== lastIndex) {
		if (this.index() < 3){
			this._helpWindow.setText(Ramza.CSParams.IngredientCategoryHelpText)
		} else {
			this._helpWindow.setText(Ramza.CSParams.ClearHelpText)
		}
    }
}


Window_IngredientCategory.prototype.setListWindow = function(listWindow) {
    this._listWindow = listWindow;
};

//=============================================================================
// Window_IngredientList
//=============================================================================

function Window_IngredientList() {
    this.initialize.apply(this, arguments);
}

Window_IngredientList.prototype = Object.create(Window_Selectable.prototype);
Window_IngredientList.prototype.constructor = Window_IngredientList;

Window_IngredientList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._category = 'none';
    this._data = [];
};

Window_IngredientList.prototype.setCategory = function(category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
        this.resetScroll();
    }
};

Window_IngredientList.prototype.maxCols = function() {
    return 2;
};

Window_IngredientList.prototype.spacing = function() {
    return 48;
};

Window_IngredientList.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_IngredientList.prototype.item = function() {
    var index = this.index();
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_IngredientList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.item());
};

Window_IngredientList.prototype.includes = function(item) {
	if (Ramza.CSParams.UseCategoryWindow){
		switch (this._category) {
		case 'item':
			return DataManager.isItem(item) && item.itypeId === 1 && this.correctCategory(item);
		case 'weapon':
			return DataManager.isWeapon(item) && this.correctCategory(item);
		case 'armor':
			return DataManager.isArmor(item) && this.correctCategory(item);
		case 'keyItem':
			return DataManager.isItem(item) && item.itypeId === 2 && this.correctCategory(item);
		default:
			return false;
		}
	} else {
		return this.correctCategory(item);
	}
};

Window_IngredientList.prototype.correctCategory = function(item) {
	if (item && item._validCategories){
		return (item._validCategories.contains(SceneManager._scene._category))
	};
};

Window_IngredientList.prototype.needsNumber = function() {
    return true;
};

Window_IngredientList.prototype.isEnabled = function(item) {
	switch (Ramza.CSParams.CraftingMode){
		case "DQ11":
			if (!Imported.YEP_ItemCore){
				var qty = $gameParty.numItems(item)
				SceneManager._scene._ingList.forEach(function(ele){if (ele == item) qty -=1})
				return qty > 0
			} else {
				if (item && item.id < Yanfly.Param.ItemStartingId){
					var qty = $gameParty.numItems(item)
					SceneManager._scene._ingList.forEach(function(ele){if (ele == item) qty -=1})
					return qty > 0
				} else if (item && !item.nonIndependent){
					//independent item found
					if (item.itypeId){
						//independent item
						return !(SceneManager._scene._ingList.includes(item))
					} else if (item.etypeId && item.etypeId == 1){
						//independent weapon
						return !(SceneManager._scene._ingList.includes(item))
					} else if (item.etypeId && item.etypeId >= 2){
						//independent armor
						return !(SceneManager._scene._ingList.includes(item))
					}
				}
			}
		break;
		default:
		if (!Imported.YEP_ItemCore){
			return !(SceneManager._scene._ingList.includes(item))
		} else {
			if (item && item.id < Yanfly.Param.ItemStartingId){
				return !(SceneManager._scene._ingList.includes(item))
			} else if (item && !item.nonIndependent){
				//independent item found
				if (item.itypeId){
					//independent item
					return !(SceneManager._scene._ingList.filter(function(checkBaseId) {return checkBaseId.baseItemId == item.baseItemId}).length > 0)
				} else if (item.etypeId && item.etypeId == 1){
					//independent weapon
					return !(SceneManager._scene._ingList.filter(function(checkBaseId) {return checkBaseId.baseItemId == item.baseItemId}).length > 0)
				} else if (item.etypeId && item.etypeId >= 2){
					//independent armor
					return !(SceneManager._scene._ingList.filter(function(checkBaseId) {return checkBaseId.baseItemId == item.baseItemId}).length > 0)
				}
			}
		}
		break;
	}
};

Window_IngredientList.prototype.makeItemList = function() {
    this._data = $gameParty.allItems().filter(function(item) {
        return this.includes(item);
    }, this);
    if (this.includes(null)) {
        this._data.push(null);
    }
};

Window_IngredientList.prototype.selectLast = function() {
    var index = this._data.indexOf($gameParty.lastItem());
    this.select(index >= 0 ? index : 0);
};

Window_IngredientList.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var numberWidth = this.numberWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};

Window_IngredientList.prototype.numberWidth = function() {
    return this.textWidth('000');
};

Window_IngredientList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText(':', x, y, width - this.textWidth('00'), 'right');
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
    }
};

Window_IngredientList.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};

Window_IngredientList.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};

//-----------------------------------------------------------------------------
// Window_CraftPreview
//
// The window that shows previewed craft results and current crafting level/exp

function Window_CraftPreview() {
	this.initialize.apply(this, arguments)
}

Window_CraftPreview.prototype = Object.create(Window_Base.prototype);
Window_CraftPreview.prototype.constructor = Window_CraftPreview;

Window_CraftPreview.prototype.setCategory = function(category){
	this._category = category
};

Window_CraftPreview.prototype.updateCategory = function(category){
	if (this._category != category) this._category = category
};

Window_CraftPreview.prototype.calculateRequiredExperience = function(){
	var level = $gameParty._craftLevels[this._category]
	return eval(Ramza.CSParams.ExperienceCurve)
};

Window_CraftPreview.prototype.getExpRate = function(){
	var text = $gameParty._craftExperience[this._category]
	if ($gameParty._craftLevels[this._category] < Ramza.CSParams.MaxLevel){
		return (text/this.calculateRequiredExperience())
	} else {
		return 1
	}
};

Window_CraftPreview.prototype.update = function(){
	Window_Base.prototype.update.call(this)
	this.contents.clear();
	if (this._category && Ramza.CSParams.ShowCraftingLevel && Ramza.CSParams.CraftingLevels) this.drawExpGauge();
	if (this._category && Ramza.CSParams.ShowCraftingLevel && Ramza.CSParams.CraftingLevels) this.drawCraftLevel();
	if ($gameTemp.gainCraftExp && this._category && Ramza.CSParams.CraftingLevels){
		$gameParty._craftExperience[this._category] = $gameParty._craftExperience[this._category] + 1
		if (this.getExpRate() == 1){
			$gameParty._craftLevels[this._category] = $gameParty._craftLevels[this._category] + 1
			$gameParty._craftExperience[this._category] = 0
				$gameTemp.levelUp = this._category
		}
		$gameTemp.gainCraftExp = $gameTemp.gainCraftExp -1
		if ($gameTemp.gainCraftExp == 0) $gameTemp.gainCraftExp = undefined
	}
	this.drawPreviewItem();
	this.drawInfoText();
};

Window_CraftPreview.prototype.show = function(){
	this.contents.clear();
	if (this._category && Ramza.CSParams.ShowCraftingLevel && Ramza.CSParams.CraftingLevels) this.drawExpGauge();
	if (this._category && Ramza.CSParams.ShowCraftingLevel && Ramza.CSParams.CraftingLevels) this.drawCraftLevel();
	this.drawInfoText();
	Window_Base.prototype.show.call(this);
}

Window_CraftPreview.prototype.initialize = function(x, y, width, height){
	Window_Base.prototype.initialize.call(this, x, y, width, height)
	if (this._category && Ramza.CSParams.ShowCraftingLevel && Ramza.CSParams.CraftingLevels) this.drawExpGauge();
	if (this._category && Ramza.CSParams.ShowCraftingLevel && Ramza.CSParams.CraftingLevels) this.drawCraftLevel();
};

Window_CraftPreview.prototype.drawCraftLevel = function(){
	var text = this._category
	text = text.charAt(0).toUpperCase() + text.slice(1)
	this.contents.fontSize = 24
	this.drawText(text, 0, 148, (this.width / 2) - (this.textWidth("lv " + $gameParty._craftLevels[this._category])), 'left')
	text = "lv " + $gameParty._craftLevels[this._category]
	this.drawText(text, 16, 148, this.width / 2, 'right')
	this.contents.fontSize = this.standardFontSize()
};

Window_CraftPreview.prototype.drawExpGauge = function(){
	var color1 = this.textColor(Ramza.CSParams.CraftExpGaugeColor1);
    var color2 = this.textColor(Ramza.CSParams.CraftExpGaugeColor2);
    this.drawGauge((this.width / 3) * 2, 152, (this.width - ((this.width / 3) * 2) - 32), this.getExpRate(), color1, color2);
	this.drawCraftExp();
	//this.refresh()
};

Window_CraftPreview.prototype.drawCraftExp = function(){
	var text = this.getCraftExpValues();
	this.contents.fontSize = 16
	if ($gameParty._craftLevels[this._category] < Ramza.CSParams.MaxLevel){
		this.drawText(text[0] + "/" + text[1], (this.width / 3) * 2, 144, (this.width - ((this.width / 3) * 2) - 32), 'center')
	} else {
		this.drawText(Ramza.CSParams.ExpBarMaxLevelText, (this.width / 3) * 2, 144, (this.width - ((this.width / 3) * 2) - 32), 'center')
	}
		this.contents.fontSize = this.standardFontSize()
};

Window_CraftPreview.prototype.getCraftExpValues = function(){
	return [$gameParty._craftExperience[this._category],this.calculateRequiredExperience()]
};

Window_CraftPreview.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.lineHeight() - 20;
    this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
};

Window_CraftPreview.prototype.drawPreviewItem = function(){
	if (Ramza.CSParams.ShowPreview){
		if (SceneManager._scene._ingList && SceneManager._scene._ingList.length > 1) {
			this.updateItemList(SceneManager._scene._ingList, SceneManager._scene._ingCount)
			var result = Ramza.CS.findRecipe(this._previewItems, this._previewQty)
			if (result != false && result[0] == true && $gameParty._craftingRecipes[Ramza.CSParams.resultItem.indexOf(result[1])] == true) {
				this.drawItemName(result, 0, 60, this.width - 136)
			} else if (result != false && result[0] == true && $gameParty._craftingRecipes[Ramza.CSParams.resultItem.indexOf(result[1])] == false){
				this.changePaintOpacity(false);
				this.drawText(Ramza.CSParams.LockedItemText, 0, 60, 180)
				this.changePaintOpacity(true);
			} else {
				this.changePaintOpacity(false);
				this.drawText(Ramza.CSParams.InvalidRecipeText, 0, 60, 180)
				this.changePaintOpacity(true);
			}
		} else {
			this.changePaintOpacity(false);
			this.drawText(Ramza.CSParams.InvalidComboText, 0, 60, 180)
			this.changePaintOpacity(true);
		}
	}
};

Window_CraftPreview.prototype.showFailureChance = function(){
	//returns true if failure is possible and show failure chance params are true
	return (Ramza.CSParams.FailureChance && Ramza.CSParams.ShowSuccessChance)
}

Window_CraftPreview.prototype.drawInfoText = function (){
	this.changeTextColor(this.systemColor())	
	this.contents.fillRect(0, 32, this.width - 36, 2, this.gaugeBackColor())
	this.contents.fillRect(0, 148, this.width - 36, 2, this.gaugeBackColor())
	this.contents.fontSize = 24
	var text = Ramza.CSParams.ResultText
	this.drawText(text, 0, 0, 180)
	var textwidth = this.textWidth(text)
	var text = Ramza.CSParams.QuantityText
	this.drawText(text, 0, 0, this.width - 38, "right")
	if (this.showFailureChance()) {
		var text = Ramza.CSParams.SuccessChanceText
		this.drawText(text, 0, 116, this.width - 38)
		this.changeTextColor(this.normalColor())
	};
	//var text = (this.getSuccessRate(item) * 100) + "%"
	//this.drawText(text, 0, 116, this.width - 38, "right") 
	this.resetTextColor();
	this.contents.fontSize = this.standardFontSize();
};

Window_CraftPreview.prototype.getSuccessRate = function(item) {
	if (Ramza.CSParams.FailureChance){
	var chance = Number(Ramza.CSParams.resultItem[Ramza.CSParams.resultItem.indexOf(item[1])].recipes[item[2]].BaseSuccessChance)
	if (!chance) chance = Ramza.CSParams.DefaultBaseFailureChance
	var extraChance = this.getBonusRate(item);
	chance = Math.min(1, chance + extraChance)
	if (!Ramza.CSParams.LowLevelCrafts){
		var level = $gameParty._craftLevels[SceneManager._scene._category]
		var requiredlevel = Number(Ramza.CSParams.resultItem[Ramza.CSParams.resultItem.indexOf(item[1])].CraftingLevelRequired)	
		if (level < requiredlevel) chance = 0
	}
	return chance
	} else {
		return 1
	}
};

Window_CraftPreview.prototype.getBonusRate = function(item){
	var level = ($gameParty._craftLevels) ? $gameParty._craftLevels[this._category] : 1
	var requiredlevel = Number(Ramza.CSParams.resultItem[Ramza.CSParams.resultItem.indexOf(item[1])].CraftingLevelRequired)
	var test = new Function('level', 'requiredlevel', Ramza.CSParams.ModifiedFailureChance)
	try {
		var code = Ramza.CSParams.ModifiedFailureChance
		var check = eval(test(level, requiredlevel))
		if (check != undefined){
			return check;
		} else {
			return eval(code)
		}
    } catch (e) {
		console.log('Bonus Success Rate error')
		console.log(e)
    }
};

Window_CraftPreview.prototype.drawItemName = function(item, x, y, width){
	width = width || 312;
    if (item) {
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.resetTextColor();
        this.drawIcon(item[1].ResultItem.iconIndex, x + 2, y + 2);
        this.drawText(item[1].ResultItem.name, x + iconBoxWidth, y, width - iconBoxWidth);
		var qtyText = "x" + Ramza.CSParams.resultItem[Ramza.CSParams.resultItem.indexOf(item[1])].recipes[item[2]].ResultQuantity
		var itemwidth = this.textWidth(item[1].ResultItem.name) + 6
		this.drawText(qtyText, x - 36, y, this.width, "right");
		if (this.showFailureChance()){
			this.changeTextColor(this.normalColor())
			this.contents.fontSize = 24
			//var text = (this.getSuccessRate(item) * 100) + "%"
			this.drawSuccessRate(this.getSuccessRate(item), 0, 116, this.width - 38)
		}
		this.resetTextColor();
		this.contents.fontSize = this.standardFontSize();
    }
};

Window_CraftPreview.prototype.drawSuccessRate = function(value, dx, dy, dw) {
    var text = (value * 100).toFixed(2) + '%';
    this.setSuccessColor(value);
    this.drawSuccessValue(text, dx, dy, dw);
};

Window_CraftPreview.prototype.drawSuccessValue = function(value, dx, dy, dw) {
    dx += this.textPadding();
    dw -= this.textPadding() * 2;
    this.drawText(value, dx, dy, dw, 'right');
};

Window_CraftPreview.prototype.setSuccessColor = function(value) {
	var colorId = 0;
    if (value >= 1.0) {
      colorId = Ramza.CSParams.SColor;
    } else if (value >= 0.8) {
      colorId = Ramza.CSParams.AColor;
    } else if (value >= 0.6) {
      colorId = Ramza.CSParams.BColor;
    } else if (value >= 0.4) {
      colorId = Ramza.CSParams.CColor;
    } else if (value >= 0.2) {
      colorId = Ramza.CSParams.DColor;
    } else if (value > 0) {
      colorId = Ramza.CSParams.EColor;
    } else if (value === 0) {
      colorId = Ramza.CSParams.FColor;
    } 
    if (Ramza.CSParams.UseSuccessColors) this.changeTextColor(this.textColor(colorId));
};

Window_CraftPreview.prototype.updateItemList = function(items, qty){
	this._previewItems = []
	this._previewQty = []
	for (i = 0; i < items.length; i++){
		this._previewItems.push(items[i])
		this._previewQty.push(qty[i])
	};
};

//-----------------------------------------------------------------------------
// Window_CraftConfirm
//
// The confirmation window for crafting

function Window_CraftConfirm() {
	this.initialize.apply(this, arguments)
}

Window_CraftConfirm.prototype = Object.create(Window_HorzCommand.prototype);
Window_CraftConfirm.prototype.constructor = Window_CraftConfirm;



Window_CraftConfirm.prototype.windowWidth = function() {
    return Graphics.boxWidth / 2;
};

Window_CraftConfirm.prototype.maxCols = function() {
    return 2;
};

Window_CraftConfirm.prototype.update = function() {
    Window_HorzCommand.prototype.update.call(this);
	if (this._listWindow) {		
        this._listWindow.setCategory(this.currentSymbol());
    }
};

Window_CraftConfirm.prototype.makeCommandList = function() {
    this.addCommand(Ramza.CSParams.ConfirmationConfirmText,    'confirm');
    this.addCommand(Ramza.CSParams.ConfirmationCancelText,  'cancel');
};


//-----------------------------------------------------------------------------
// Window_IngredientSlot
//
// The window for selecting an equipment slot on the equipment screen.

function Window_IngredientSlot() {
    this.initialize.apply(this, arguments);
}

Window_IngredientSlot.prototype = Object.create(Window_Selectable.prototype);
Window_IngredientSlot.prototype.constructor = Window_IngredientSlot;

Window_IngredientSlot.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this.refresh();
};

Window_IngredientSlot.prototype.setIngredients = function(ingList, ingCount) {
        this._ingList = ingList;
		this._ingCount = ingCount;
        this.refresh();
};

Window_IngredientSlot.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setSlotId(this.index());
    }
};

Window_IngredientSlot.prototype.maxItems = function() {
    return 5
};

Window_IngredientSlot.prototype.maxCols = function() {
    return 1;
};

Window_IngredientSlot.prototype.makeCommandList = function() {
    this.addCommand('Cancel',   'cancel', true);
};

Window_IngredientSlot.prototype.item = function() {
    return this._ingList ? this._ingList[this.index()] : null;
};

Window_IngredientSlot.prototype.drawAllItems = function() {
    var topIndex = this.topIndex();
    for (var i = 0; i < this.maxPageItems(); i++) {
        var index = topIndex + i;
        if (index < this.maxItems()) {
            this.drawItem(index);
        }
    }
	this.drawItem(index + 1);
};

Window_IngredientSlot.prototype.drawItem = function(index) {
	if (index < 4) {
        var rect = this.itemRectForText(index);
        this.changeTextColor(this.systemColor());
        this.changePaintOpacity(this.isEnabled(index));
        //this.drawText(this.slotName(index), rect.x, rect.y, 138, this.lineHeight());
		this._ingList = this._ingList || []
		this._ingCount =  this._ingCount || []
		var itemwidth = this.width - 96
        if (!$gameParty._lockedSlots[index]){
			this.drawItemName(this._ingList[index], rect.x, rect.y, itemwidth, this._ingCount[index]);
		} else {
			this.drawLockedSlot(this._ingList[index], rect.x, rect.y, itemwidth, this._ingCount[index]);
		}
        this.changePaintOpacity(true);
	} else {
		var rect = this.itemRectForText(index);
		rect.x = rect.x
		var offset = this.textWidth(this.getCraftButtonText())
		this.changePaintOpacity(this.isEnabled(index))
		this.drawText(this.getCraftButtonText(), rect.width - offset, rect.y, 138, this.lineHeight());
	}
};

Window_IngredientSlot.prototype.getCraftButtonText = function(){
	for (i = 0; i < Ramza.CSParams.CraftCatMessages.length; i++){
		if (this._category == Ramza.CSParams.CraftCatMessages[i].CategoryName){
			return Ramza.CSParams.CraftCatMessages[i].CraftButtonText
		}
	}
	return Ramza.CSParams.CraftText
};

Window_IngredientSlot.prototype.setCategory = function(category){
	this._category = category
	this.refresh();
}

Window_IngredientSlot.prototype.drawItemName = function(item, x, y, width, count) {
    width = width || 312;
	if (item) {
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x + 2, y + 2);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
        if (Ramza.CSParams.CraftingMode != "DQ11") this.drawText('x' + count, (width - this.textWidth(count) + iconBoxWidth), y, width - iconBoxWidth);
    } else {
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.resetTextColor();
		this.changePaintOpacity(false);
        this.drawIcon(Ramza.CSParams.EmptySlotIcon, x + 2, y + 2);
        this.drawText(Ramza.CSParams.EmptyText, x + iconBoxWidth, y, width - iconBoxWidth);		
		if (Ramza.CSParams.CraftingMode != "DQ11") this.drawText('x0', x + iconBoxWidth + width - 20, y, width - iconBoxWidth);
	}
};

Window_IngredientSlot.prototype.drawLockedSlot = function(item, x, y, width, count) {
    width = width || 312;
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.resetTextColor();
		this.changePaintOpacity(false);
        this.drawIcon(Ramza.CSParams.LockedSlotIcon, x + 2, y + 2);
        this.drawText(Ramza.CSParams.LockedText, x + iconBoxWidth, y, width - iconBoxWidth);		
		if (Ramza.CSParams.CraftingMode != "DQ11") this.drawText('x0', x + iconBoxWidth + width - 20, y, width - iconBoxWidth);
//	}
};

Window_IngredientSlot.prototype.slotName = function(index) {
};

Window_IngredientSlot.prototype.isEnabled = function(index) {
	if (index < 4){
		if (index == 0){
			return true;
		}
		return (index >= 0 && this._ingList[index -1] && !$gameParty._lockedSlots[index])
	} else {
		return (this._ingList && this._ingList[0] != undefined && this._ingList.length >= 2)
	}
};

Window_IngredientSlot.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.index());
};

Window_IngredientSlot.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};

Window_IngredientSlot.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
};

Window_IngredientSlot.prototype.getCraftLockedHelpText = function(){
	for (i = 0; i < Ramza.CSParams.CraftCatMessages.length; i++){
		if (this._category == Ramza.CSParams.CraftCatMessages[i].CategoryName){
			return Ramza.CSParams.CraftCatMessages[i].CraftLockedHelpText
		}
	}
	return Ramza.CSParams.CraftLockedHelpText
}

Window_IngredientSlot.prototype.getCraftEnabledHelpText = function(){
	for (i = 0; i < Ramza.CSParams.CraftCatMessages.length; i++){
		if (this._category == Ramza.CSParams.CraftCatMessages[i].CategoryName){
			return Ramza.CSParams.CraftCatMessages[i].CraftOkHelpText
		}
	}
	return Ramza.CSParams.CraftEnabledHelpText
};

Window_IngredientSlot.prototype.getLockedSlotHelpText = function(){
	for (i = 0; i < Ramza.CSParams.CraftCatMessages.length; i++){
		if (this._category == Ramza.CSParams.CraftCatMessages[i].CategoryName){
			return Ramza.CSParams.CraftCatMessages[i].LockedSlotText
		}
	}
	return Ramza.CSParams.LockedHelpText
};

Window_IngredientSlot.prototype.getEmptySlotHelpText = function(){
	for (i = 0; i < Ramza.CSParams.CraftCatMessages.length; i++){
		if (this._category == Ramza.CSParams.CraftCatMessages[i].CategoryName){
			return Ramza.CSParams.CraftCatMessages[i].EmptySlotText
		}
	}
	return Ramza.CSParams.EmptyHelpText
};

Window_IngredientSlot.prototype.updateHelp = function() {
    Window_Selectable.prototype.updateHelp.call(this);
	if (this.item()){
		this.setHelpWindowItem(this.item());
	} else if (this._index == 4){
		if (this.isCurrentItemEnabled()) {
			this._helpWindow.setText(this.getCraftEnabledHelpText())
		} else {
			this._helpWindow.setText(this.getCraftLockedHelpText())
		}
	} else {
		var text = (!$gameParty._lockedSlots[this._index]) ? this.getEmptySlotHelpText() : this.getLockedSlotHelpText()
		this._helpWindow.setText(text)
	}
    if (this._statusWindow) {
        this._statusWindow.setTempActor(null);
    }
};

Window_IngredientSlot.prototype.cursorRight = function() {
	switch (Ramza.CSParams.CraftingMode) {
		case "DQ11":
			
		break;
		default:
			if (this._ingList[this.index()] != undefined && this.item().itypeId){
				if (!Imported.YEP_ItemCore){
				//itemcore is not installed
					if ($gameParty._items[this.item().id] > this._ingCount[this.index()]){
						this._ingCount[this.index()] = this._ingCount[this.index()] + 1
						SoundManager.playCursor();
						this._previewWindow.drawPreviewItem();
						this.refresh();					
					} else {
						SoundManager.playBuzzer()
					}
				} else {
					//itemcore is installed
					if (this.item().id < Yanfly.Param.ItemStartingId){
					//normal item
						if ($gameParty._items[this.item().id] > this._ingCount[this.index()]){
							this._ingCount[this.index()] = this._ingCount[this.index()] + 1
							SoundManager.playCursor();
							this._previewWindow.drawPreviewItem();
							this.refresh();					
						} else {
							SoundManager.playBuzzer()
						}
					} else if (this.item().itypeId){
						//independent item
						var baseId = this.item().baseItemId
						if ($gameParty.items().filter(function(thing){return thing.baseItemId == baseId}).length > this._ingCount[this.index()]) {
							this._ingCount[this.index()] = this._ingCount[this.index()] + 1
							SoundManager.playCursor();
							this._previewWindow.drawPreviewItem();
							this.refresh();					
						} else {
							SoundManager.playBuzzer()
						}
					}
				}
			} else {
				if (this.index() < 4) {
					SoundManager.playBuzzer()
				}
			}
		break;
	}
};

Window_IngredientSlot.prototype.cursorLeft = function() {
	if (this._ingList[this.index()] != undefined){
		if (this._ingCount[this.index()] > 0){
			this._ingCount[this.index()] = this._ingCount[this.index()] - 1
			SoundManager.playCursor()
			this._previewWindow.drawPreviewItem();
			if (this._ingCount[this.index()] == 0){
				this._ingList.splice(this.index(), 1)
				this._ingCount.splice(this.index(), 1)
				this.updateHelp()
			}
			this.refresh();
		} else {
			SoundManager.playBuzzer()
		}
	} else {
		if (this.index() < 4) SoundManager.playBuzzer()
	}	
};

Window_IngredientSlot.prototype.setPreviewWindow = function(previewWindow){
	if (previewWindow){
		this._previewWindow = previewWindow
	}
}

//------------------------------------------------------
// Window_CraftingResult
// The window that shows the crafting result.

function Window_CraftingResult() {
    this.initialize.apply(this, arguments);
}

Window_CraftingResult.prototype = Object.create(Window_Base.prototype);
Window_CraftingResult.prototype.constructor = Window_CraftingResult;

Window_CraftingResult.prototype.drawProgressBar = function(x, y, width) {
    width = width || 96;
    var color1 = this.textColor(Ramza.CSParams.gaugeColor1)
    var color2 = this.textColor(Ramza.CSParams.gaugeColor2)
    this.drawGauge(x, y, width, (this._progressBar / Ramza.CSParams.gaugeFrames), color1, color2);
    this.changeTextColor(this.systemColor());
};

Window_CraftingResult.prototype.setLossWindow = function(lossWindow){
	this._lossWindow = lossWindow
}

Window_CraftingResult.prototype.setIngLists = function(ingredients, quantities){
	this._ingList = ingredients
	this._ingCount = quantities
};

Window_CraftingResult.prototype.setIngredientWindow = function(ingWindow){
	this._ingredientWindow = ingWindow
};

Window_CraftingResult.prototype.activate = function(){
	Window_Base.prototype.activate.call(this);
	this._drawingProgress = true
};

Window_CraftingResult.prototype.deactivate = function(){
	Window_Base.prototype.deactivate.call(this);
	this._drawingProgress = false
};

Window_CraftingResult.prototype.getCraftingSE = function (craftCategory){
	for (i = 0; i < Ramza.CSParams.CategoryCraftSE.length; i++){
		if (craftCategory === Ramza.CSParams.CategoryCraftSE[i].CategoryName) {
			return Ramza.CSParams.CategoryCraftSE[i].CraftSound
		}
	}	
	return Ramza.CSParams.defaultCraftingSE
}

Window_CraftingResult.prototype.update = function(){
	Window_Base.prototype.update.call(this);
	var wx = Graphics.boxWidth / 6
	if (this._drawingProgress){
		this._progressBar = this._progressBar + 1
		this.drawProgressBar(0, 70, Graphics.boxWidth - (wx * 2))
		var soundcount = Math.round(Ramza.CSParams.gaugeFrames / Ramza.CSParams.resultSEPlayNumber)
		if ((this._progressBar - 1) % soundcount == 0){
			if (Ramza.CSParams.CraftingSoundEnabled){
				var CraftSE = this.getCraftingSE(SceneManager._scene._category)
				AudioManager.playSe(CraftSE)
			}
		}
		if (this._progressBar >= Ramza.CSParams.gaugeFrames){
			this._progressBar = 0
			this._drawingProgress = false
			this.craftingCompletion();
			this._waiting = true
		}
	}
	if ($gameTemp.levelUp){
		if (SceneManager._scene.getLevelUpEvalCode()){
			var code = SceneManager._scene.getLevelUpEvalCode()
			try {
				if (code) eval(code);
			} catch (e) {
				console.log(e, 'Codeblock error')
			}
		}
		if (SceneManager._scene.getLevelUpCommonEvent()) $gameTemp.reserveCommonEvent(SceneManager._scene.getLevelUpCommonEvent())
		this.drawText(SceneManager._scene.getLevelUpString(), 0, 120, this.width - 32)
		AudioManager.playSe(Ramza.CSParams.LevelUpSound)
		$gameTemp.levelUp = undefined
		this._wait = 5
	}
	if (this._waiting){
		this._wait = this._wait || 0
		if (!this._lossWindow.visible)this._wait = this._wait + 1
		var count = (Ramza.CSParams.SuccessWindowTimer) ? Ramza.CSParams.SuccessWindowTimer : 90
		var okaypressed = (this._canRepeat) ? Input.isRepeated("ok") : Input.isTriggered("ok");
		var cancelpressed = (this._canRepeat) ? Input.isRepeated("cancel") : Input.isTriggered("cancel");
		if (okaypressed || cancelpressed) this._wait = count -5
		if (this._wait >= count){
			this._wait = undefined
			this._waiting = false
			this.deactivate();
			this.hide();
			this._ingredientWindow.activate();
			this.setWindowText('')
			this.contents.clear();
		}
	}
};

Window_CraftingResult.prototype.setWindowText = function(string){
	var wx = Graphics.boxWidth / 6
	if (!this._text){
		this._text = string
		this.drawText(this._text, 0, 24, Graphics.boxWidth - (wx * 2))
	} else if (this._text != string) {
		this._text = string
		this.drawText(this._text, 0, 24, Graphics.boxWidth - (wx * 2))
	};
};

Window_CraftingResult.prototype.craftingCompletion = function(){
	var result = Ramza.CS.findRecipe(this._ingList, this._ingCount)
	if (result == false){
		//total failure
		this.callFailureResult(result);
		if (Ramza.CSParams.DisplayLoss && this._lostItems[0]) this._lossWindow.show()
		this._ingredientWindow.select(0);
	} else if (result[0] && result[0] == true){
		//valid ingredients for a recipe
		this.callSuccessResult(result);
		this._ingredientWindow.select(0);
	} else if (result[0] != undefined && result[0] == false){
		//valid ingredients for a partial match
		this.callPartialRecipeSuccessResult(result);
		this._ingredientWindow.select(0);
	} else {
		console.log('Crafting Completion error')
	}
	
};

Window_CraftingResult.prototype.drawItem = function(result) {
	if (result[0] != undefined){
		if ($gameTemp.takeIngredients && $gameTemp.takeIngredients.result){
			var item = $gameTemp.takeIngredients.result[0]
		} else {
			var item = result[1].ResultItem
		}
		var wx = Graphics.boxWidth / 6
		if (item) {
			var numberWidth = this.numberWidth();
			var number = result[1].recipes[result[2]].ResultQuantity
			var extraspacing = this.textWidth(": " + "000")
			this.drawItemName(item, 0, 74, this.width - extraspacing - 16);
			this.drawItemNumber(number, 0, 74, this.width - this.numberWidth());
			//this.drawItemNumber(number, 0, 74, Graphics.boxWidth - (wx * 3));
		}
	} else {
		var item = result
		var wx = Graphics.boxWidth / 6
		if (item) {
			var numberWidth = this.numberWidth();
			this.drawItemName(item, 0, 74, this.width - this.numberWidth());
			var number = 1
			this.drawItemNumber(number, 0, 74, this.width - this.numberWidth());
		}
	}
};

Window_CraftingResult.prototype.drawItemNumber = function(number, x, y, width) {
//    if (this.needsNumber()) {
        this.drawText(':', x, y, width - this.textWidth('00'), 'right');
        this.drawText(number, x, y, width, 'right');
//    }
};

Window_CraftingResult.prototype.numberWidth = function() {
    return this.textWidth('000');
};

Window_CraftingResult.prototype.getFailureText = function(){
	for (i = 0; i < Ramza.CSParams.totalFailCatText.length; i++){
		if (this._currentCategory === Ramza.CSParams.totalFailCatText[i].CategoryName) {
			return Ramza.CSParams.totalFailCatText[i].TotalFailureText
		}
	}	
	return Ramza.CSParams.totalFailText
}

Window_CraftingResult.prototype.callFailureResult = function(result){
	this.contents.clear();
	this.resetTextColor();
	this.changePaintOpacity(false);
	this._currentCategory = SceneManager._scene._category
	var failuretext = this.getFailureText()
	this.performFailureResult();
	this.setWindowText(failuretext)
	this.changePaintOpacity(true);
	SceneManager._scene.clearIngredientsArrays();
	AudioManager.playSe(Ramza.CSParams.totalFailSound);
};

Window_CraftingResult.prototype.loseAllIngredients = function(ingredients, quantities){
	for (i = 0; i < ingredients.length; i++){
		if (ingredients[i]._consumedOnFail){
			$gameParty.gainItem(ingredients[i], -quantities[i]);
			this._lostItems.push(ingredients[i]);
			this._lostValues.push(quantities[i]);
		};
	}
};

Window_CraftingResult.prototype.loseOneOfAllIngredients = function(ingredients, quantities){
	for (i = 0; i < ingredients.length; i++){
		if (ingredients[i]._consumedOnFail){
			$gameParty.gainItem(ingredients[i], -1);
			this._lostItems.push(ingredients[i]);
			this._lostValues.push(1);
		};
	}
};

Window_CraftingResult.prototype.loseHalfOfAllIngredients = function(ingredients, quantities){
	for (i = 0; i < ingredients.length; i++){
		if (ingredients[i]._consumedOnFail){
			$gameParty.gainItem(ingredients[i], -(Math.ceil(quantities[i]/2)));
			this._lostItems.push(ingredients[i]);
			this._lostValues.push(Math.ceil(quantities[i]/2));
		};
	}
};

Window_CraftingResult.prototype.loseRandomlyAllIngredients = function(ingredients, quantities, softfail){
	var chance = (softfail) ? Ramza.CSParams.CompleteFailureRandomChance : Ramza.CSParams.SoftRemovalChance
	if (Math.random() >= chance){
		for (i = 0; i < ingredients.length; i++){		
			if (ingredients[i]._consumedOnFail){
				$gameParty.gainItem(ingredients[i], -(quantities[i]));
				this._lostItems.push(ingredients[i]);
				this._lostValues.push(quantities[i]);
			};
		};
	};
};

Window_CraftingResult.prototype.loseRandomlyOneOfAllIngredients = function(ingredients, quantities, softfail){
	var chance = (softfail) ? Ramza.CSParams.CompleteFailureRandomChance : Ramza.CSParams.SoftRemovalChance
	if (Math.random() >= chance){
		for (i = 0; i < ingredients.length; i++){		
			if (ingredients[i]._consumedOnFail){
				$gameParty.gainItem(ingredients[i], -(1));
				this._lostItems.push(ingredients[i]);
				this._lostValues.push(1);
			};
		};
	};
};

Window_CraftingResult.prototype.loseRandomlyHalfOfAllIngredients = function(ingredients, quantities, softfail){
	var chance = (softfail) ? Ramza.CSParams.CompleteFailureRandomChance : Ramza.CSParams.SoftRemovalChance
	if (Math.random() >= chance){
		for (i = 0; i < ingredients.length; i++){		
			if (ingredients[i]._consumedOnFail){
				$gameParty.gainItem(ingredients[i], -((Math.ceil(quantities[i]/2))));
				this._lostItems.push(ingredients[i]);
				this._lostValues.push(Math.ceil(quantities[i]/2));
			};
		};
	};
};

Window_CraftingResult.prototype.loseRandomlyEachIngredient = function(ingredients, quantities, softfail){
	var chance = (softfail) ? Ramza.CSParams.CompleteFailureRandomChance : Ramza.CSParams.SoftRemovalChance
	for (i = 0; i < ingredients.length; i++){		
		if (ingredients[i]._consumedOnFail && Math.random() >= chance){
			$gameParty.gainItem(ingredients[i], -(quantities[i]));
			this._lostItems.push(ingredients[i]);
			this._lostValues.push(quantities[i]);
		};
	};
};

Window_CraftingResult.prototype.loseRandomlyOneOfEachIngredient = function(ingredients, quantities, softfail){
	var chance = (softfail) ? Ramza.CSParams.CompleteFailureRandomChance : Ramza.CSParams.SoftRemovalChance
	for (i = 0; i < ingredients.length; i++){		
		if (ingredients[i]._consumedOnFail && Math.random() >= chance){
			$gameParty.gainItem(ingredients[i], -1);
			this._lostItems.push(ingredients[i]);
			this._lostValues.push(1);
		};
	};
};

Window_CraftingResult.prototype.loseRandomlyHalfOfEachIngredient = function(ingredients, quantities, softfail){
	var chance = (softfail) ? Ramza.CSParams.CompleteFailureRandomChance : Ramza.CSParams.SoftRemovalChance
	for (i = 0; i < ingredients.length; i++){		
		if (ingredients[i]._consumedOnFail && Math.random() >= chance){
			$gameParty.gainItem(ingredients[i], -(Math.ceil(quantities[i]/2)));
			this._lostItems.push(ingredients[i]);
			this._lostValues.push(Math.ceil(quantities[i]/2));
		};
	};
};

Window_CraftingResult.prototype.loseRandomlyAllOfOneIngredient = function(ingredients, quantities){
	var validChoices = []
	var choicesQuantity = []
	for (i = 0; i < ingredients.length; i++){		
		if (ingredients[i]._consumedOnFail){
			validChoices.push(ingredients[i])
			choicesQuanity.push(quantities[i])
			
		};
	};
	var result = Math.randomInt(validChoices.length)
	$gameParty.gainItem(ingredients[result], -(choicesQuanity[result]));
	this._lostItems.push(ingredients[result])
	this._lostValues.push(choicesQuanity[result])
};

Window_CraftingResult.prototype.loseRandomlyOneOfOneIngredient = function(ingredients, quantities){
	var validChoices = []
	var choicesQuantity = []
	for (i = 0; i < ingredients.length; i++){		
		if (ingredients[i]._consumedOnFail){
			validChoices.push(ingredients[i])
			choicesQuanity.push(quantities[i])
			
		};
	};
	var result = Math.randomInt(validChoices.length)
	$gameParty.gainItem(ingredients[result], -(1));
	this._lostItems.push(ingredients[result])
	this._lostValues.push(1)
};

Window_CraftingResult.prototype.loseRandomlyHalfOfOneIngredient = function(ingredients, quantities){
	var validChoices = []
	var choicesQuantity = []
	for (i = 0; i < ingredients.length; i++){		
		if (ingredients[i]._consumedOnFail){
			validChoices.push(ingredients[i])
			choicesQuanity.push(quantities[i])
			
		};
	};
	var result = Math.randomInt(validChoices.length)
	$gameParty.gainItem(ingredients[result], -(Math.ceil(choicesQuantity[result]/2)));
	this._lostItems.push(ingredients[result])
	this._lostValues.push(Math.ceil(choicesQuantity[result]/2))
};

Window_CraftingResult.prototype.loseRandomlyAllOfOneRandomIngredient = function(ingredients, quantities, softfail){
	var chance = (softfail) ? Ramza.CSParams.CompleteFailureRandomChance : Ramza.CSParams.SoftRemovalChance
	var validChoices = []
	var choicesQuantity = []
	if (chance >= Math.random()){
		for (i = 0; i < ingredients.length; i++){		
			if (ingredients[i]._consumedOnFail){
				validChoices.push(ingredients[i])
				choicesQuanity.push(quantities[i])
			};
		};
		var result = Math.randomInt(validChoices.length)
		$gameParty.gainItem(ingredients[result], -(choicesQuanity[result]));
		this._lostItems.push(ingredients[result])
		this._lostValues.push(choicesQuanity[result])
	}
};

Window_CraftingResult.prototype.loseRandomlyOneOfOneRandomIngredient = function(ingredients, quantities, softfail){
	var chance = (softfail) ? Ramza.CSParams.CompleteFailureRandomChance : Ramza.CSParams.SoftRemovalChance
	var validChoices = []
	var choicesQuantity = []
	if (chance >= Math.random()){
		for (i = 0; i < ingredients.length; i++){		
			if (ingredients[i]._consumedOnFail){
				validChoices.push(ingredients[i])
				choicesQuanity.push(quantities[i])
			};
		};
		var result = Math.randomInt(validChoices.length)
		$gameParty.gainItem(ingredients[result], -(1));
		this._lostItems.push(ingredients[result])
		this._lostValues.push(1)
	}
};

Window_CraftingResult.prototype.loseRandomlyHalfOfOneRandomIngredient = function(ingredients, quantities, softfail){
	var chance = (softfail) ? Ramza.CSParams.CompleteFailureRandomChance : Ramza.CSParams.SoftRemovalChance
	var validChoices = []
	var choicesQuantity = []
	if (chance >= Math.random()){
		for (i = 0; i < ingredients.length; i++){		
			if (ingredients[i]._consumedOnFail){
				validChoices.push(ingredients[i])
				choicesQuanity.push(quantities[i])
			};
		};
		var result = Math.randomInt(validChoices.length)
		$gameParty.gainItem(ingredients[result], -(Math.ceil(choicesQuantity[result]/2)));
		this._lostItems.push(ingredients[result])
		this._lostValues.push(Math.ceil(choicesQuantity[result]/2))
	}
};


Window_CraftingResult.prototype.performFailureResult = function(){
	var mode = Ramza.CSParams.CompleteFailureCaseType
	this._lostItems = []
	this._lostValues = []
	switch (mode){
		case 0:
			//no loss
			break;
		case 1:
			//lose all ingredients
			this.loseAllIngredients(this._ingList, this._ingCount);
			break;
		case 2:
			//lose one of all ingredients
			this.loseOneOfAllIngredients(this._ingList, this._ingCount);
			break;
		case 3:
			//lose half of all ingredients
			this.loseHalfOfAllIngredients(this._ingList, this._ingCount);
			break;
		case 4:
			//lose all with % chance
			this.loseRandomlyAllIngredients(this._ingList, this._ingCount);
			break;
		case 5:
			//lose one of all ingredients with % chance
			this.loseRandomlyOneOfAllIngredients(this._ingList, this._ingCount);
			break;
		case 6:
			//lose half of all ingredients with % chance
			this.loseRandomlyHalfOfAllIngredients(this._ingList, this._ingCount);
			break;
		case 7:
			//lose all of each ingredient with % chance
			this.loseRandomlyEachIngredient(this._ingList, this._ingCount);
			break;
		case 8:
			//lose one of each ingredient with % chance
			this.loseRandomlyOneOfEachIngredient(this._ingList, this._ingCount);
			break;
		case 9:
			//lose half of each ingredient with % chance
			this.loseRandomlyHalfOfEachIngredient(this._ingList, this._ingCount);
			break;
		case 10:
			//lose all of a random ingredient
			this.loseRandomlyAllOfOneIngredient(this._ingList, this._ingCount);
			break;
		case 11:
			//lose one of a random ingredient
			this.loseRandomlyOneOfOneIngredient(this._ingList, this._ingCount);
			break;
		case 12:
			//lose half of a random ingredient
			this.loseRandomlyHalfOfOneIngredient(this._ingList, this._ingCount);
			break;
		case 13:
			//lose all of a random ingredient with % chance
			this.loseRandomlyAllOfOneRandomIngredient(this._ingList, this._ingCount);
			break;
		case 14:
			//lose one of a random ingredient with % chance
			this.loseRandomlyOneOfOneRandomIngredient(this._ingList, this._ingCount);
			break;
		case 15:
			//lose half of a random ingredient with % chance
			this.loseRandomlyHalfOfOneRandomIngredient(this._ingList, this._ingCount);
			break;
		case (mode > 15):
			//future expansion
			this.callExtraFailureResults(mode)
			break;
	};
};

Window_CraftingResult.prototype.callExtraFailureResults = function(mode){
	
};

Window_CraftingResult.prototype.callSuccessResult = function(result){
	this.contents.clear();
	this.resetTextColor();
	this.changePaintOpacity(true);
	if (!Ramza.CSParams.FailureChance) {
		//no failure chance possible
		this.setWindowText(this.getSuccessText())
		this.removeIngredients(result[1].recipes[result[2]]);
		$gameParty.gainItem(result[1].ResultItem, result[1].recipes[result[2]].ResultQuantity)
		var checks = ($gameTemp.takeIngredients.result) ? $gameTemp.takeIngredients.result.length : 0
		var donorItem = Ramza.CS.createDonorItem($gameTemp.takeIngredients.list)
		for (f = 0; f < checks; f++){
			Ramza.CS.processAdditiveTraits($gameTemp.takeIngredients.result[f], donorItem)
		}
		this.drawItem(result);
		$gameParty._craftingRecipes[Ramza.CSParams.resultItem.indexOf(result[1])] = true
		var code = result[1].CraftingCompleteRunOnce
		var v = $gameVariables._data
		var s = $gameSwitches._data
		var resultItem = result[1].ResultItem
		$gameParty._craftingRunOnce = $gameParty._craftingRunOnce || []
		if (!$gameParty._craftingRunOnce[Ramza.CSParams.resultItem.indexOf(result[1])]){
			try {
				if (code) eval(JSON.parse(code));
			} catch (e) {
				console.log(e, 'RunOnce Error')
			}
		}
		this.gainCraftExp(result)
		$gameParty._craftingRunOnce[Ramza.CSParams.resultItem.indexOf(result[1])] = true
		if (!Ramza.CSParams.LeaveIngredients){
			SceneManager._scene.clearIngredientsArrays();
		} else {
			SceneManager._scene.checkIngredientsArray();
		}
		SoundManager.playOk();
	} else if (Math.random() > this.getSuccessRate(result)){
		//soft failure
		if (result[1].recipes[result[2]].FailureItemCreation == true && result[1].recipes[result[2]].FailureItem){
			//check for failure item case
			var item = result[1].recipes[result[2]].FailureItem
			if (Ramza.CSParams.FakeSuccess && Math.random() < Ramza.CSParams.FailureItemChance){
				this.setWindowText(this.getSuccessText())
				this.drawItem(item);
				$gameParty.gainItem(item, 1)
				this.performSoftFailureResult();
				SceneManager._scene.clearIngredientsArrays();
				SoundManager.playOk();
				if (Ramza.CSParams.DisplaySoftLoss && this._lostItems[0]) this._lossWindow.show()
			} else if (Math.random() < Ramza.CSParams.FailureItemChance){
				//Craft fails but adds failureitem
				this.callSoftFailureResult(result, item)
				if (Ramza.CSParams.DisplaySoftLoss && this._lostItems[0]) this._lossWindow.show()
			}
		} else {
			//normal soft failure no failitem
			this.callSoftFailureResult(result)
			if (this._lostItems[0]) this._lossWindow.show()
		}
	} else {
		//soft fail possible, but success
		this.setWindowText(this.getSuccessText())
		this.removeIngredients(result[1].recipes[result[2]]);
		$gameParty.gainItem(result[1].ResultItem, result[1].recipes[result[2]].ResultQuantity)
		var checks = ($gameTemp.takeIngredients.result) ? $gameTemp.takeIngredients.result.length : 0
		var donorItem = Ramza.CS.createDonorItem($gameTemp.takeIngredients.list)
		for (f = 0; f < checks; f++){
			Ramza.CS.processAdditiveTraits($gameTemp.takeIngredients.result[f], donorItem)
		}
		//result[1].ResultItem = $gameTemp.takeIngredients.result
		this.drawItem(result);
		
		$gameParty._craftingRecipes[Ramza.CSParams.resultItem.indexOf(result[1])] = true
		var code = result[1].CraftingCompleteRunOnce
		var v = $gameVariables._data
		var s = $gameSwitches._data
		var resultItem = result[1].ResultItem
		$gameParty._craftingRunOnce = $gameParty._craftingRunOnce || []
		if (!$gameParty._craftingRunOnce[Ramza.CSParams.resultItem.indexOf(result[1])]){
			try {
				if (code) eval(JSON.parse(code));
			} catch (e) {
				console.log(e, 'RunOnce Error')
			}
		}
		this.gainCraftExp(result)
		$gameParty._craftingRunOnce[Ramza.CSParams.resultItem.indexOf(result[1])] = true
		if (!Ramza.CSParams.LeaveIngredients){
			SceneManager._scene.clearIngredientsArrays();
		} else {
			SceneManager._scene.checkIngredientsArray();
		}
		SoundManager.playOk();
	}
};

Window_CraftingResult.prototype.getSuccessRate = function(item) {
	if (Ramza.CSParams.FailureChance){
	var chance = Number(Ramza.CSParams.resultItem[Ramza.CSParams.resultItem.indexOf(item[1])].recipes[item[2]].BaseSuccessChance)
	if (!chance) chance = Ramza.CSParams.DefaultBaseFailureChance
	var extraChance = this.getBonusRate(item);
	chance = Math.min(1, chance + extraChance)
	if (!Ramza.CSParams.LowLevelCrafts){
		var level = $gameParty._craftLevels[SceneManager._scene._category]
		var requiredlevel = Number(Ramza.CSParams.resultItem[Ramza.CSParams.resultItem.indexOf(item[1])].CraftingLevelRequired)	
		if (level < requiredlevel) chance = 0
	}
	return chance
	} else {
		return 1
	}
};

Window_CraftingResult.prototype.getBonusRate = function(item){
	var level = ($gameParty._craftLevels) ? $gameParty._craftLevels[SceneManager._scene._category] : 1
	var requiredlevel = Number(Ramza.CSParams.resultItem[Ramza.CSParams.resultItem.indexOf(item[1])].CraftingLevelRequired)
	return eval(Ramza.CSParams.ModifiedFailureChance)
};

Window_CraftingResult.prototype.gainCraftExp = function(result){
	var expGain = this.getExpGain(result)
	$gameTemp.gainCraftExp = expGain
};

Window_CraftingResult.prototype.getExpGain = function(result){
	var requiredlevel = Number(Ramza.CSParams.resultItem[Ramza.CSParams.resultItem.indexOf(result[1])].CraftingLevelRequired)
	var level = ($gameParty._craftLevels) ? $gameParty._craftLevels[SceneManager._scene._category] : 1
	return Math.max(0, eval(Ramza.CSParams.ExperienceGainCalc))
};

Window_CraftingResult.prototype.callSoftFailureResult = function(result, item){
	this.contents.clear();
	this.resetTextColor();
	this.changePaintOpacity(true);
	this.setWindowText(this.getSoftFailText())
	if (item) {
		$gameParty.gainItem(item, 1)
		this.drawItem(item);
	};
	this.performSoftFailureResult();
	SceneManager._scene.clearIngredientsArrays();
	SoundManager.playBuzzer();
};

Window_CraftingResult.prototype.performSoftFailureResult = function(){
	var mode = Ramza.CSParams.SoftFailureCaseType
	this._lostItems = []
	this._lostValues = []
	switch (mode){
		case 0:
			//no loss
			break;
		case 1:
			//lose all ingredients
			this.loseAllIngredients(this._ingList, this._ingCount, true);
			break;
		case 2:
			//lose one of all ingredients
			this.loseOneOfAllIngredients(this._ingList, this._ingCount, true);
			break;
		case 3:
			//lose half of all ingredients
			this.loseHalfOfAllIngredients(this._ingList, this._ingCount, true);
			break;
		case 4:
			//lose all with % chance
			this.loseRandomlyAllIngredients(this._ingList, this._ingCount, true);
			break;
		case 5:
			//lose one of all ingredients with % chance
			this.loseRandomlyOneOfAllIngredients(this._ingList, this._ingCount, true);
			break;
		case 6:
			//lose half of all ingredients with % chance
			this.loseRandomlyHalfOfAllIngredients(this._ingList, this._ingCount, true);
			break;
		case 7:
			//lose all of each ingredient with % chance
			this.loseRandomlyEachIngredient(this._ingList, this._ingCount, true);
			break;
		case 8:
			//lose one of each ingredient with % chance
			this.loseRandomlyOneOfEachIngredient(this._ingList, this._ingCount, true);
			break;
		case 9:
			//lose half of each ingredient with % chance
			this.loseRandomlyHalfOfEachIngredient(this._ingList, this._ingCount, true);
			break;
		case 10:
			//lose all of a random ingredient
			this.loseRandomlyAllOfOneIngredient(this._ingList, this._ingCount, true);
			break;
		case 11:
			//lose one of a random ingredient
			this.loseRandomlyOneOfOneIngredient(this._ingList, this._ingCount, true);
			break;
		case 12:
			//lose half of a random ingredient
			this.loseRandomlyHalfOfOneIngredient(this._ingList, this._ingCount, true);
			break;
		case 13:
			//lose all of a random ingredient with % chance
			this.loseRandomlyAllOfOneRandomIngredient(this._ingList, this._ingCount, true);
			break;
		case 14:
			//lose one of a random ingredient with % chance
			this.loseRandomlyOneOfOneRandomIngredient(this._ingList, this._ingCount, true);
			break;
		case 15:
			//lose half of a random ingredient with % chance
			this.loseRandomlyHalfOfOneRandomIngredient(this._ingList, this._ingCount, true);
			break;
		case (mode > 15):
			//future expansion
			this.callExtraFailureResults(mode)
			break;
	};
};

Window_CraftingResult.prototype.removeAllIngredients = function(recipe){
	this._lostItems = []
	this._lostValues = []
		for (i = 0; i < this._ingList.length; i++){
			var inrecipe = this.isItemInRecipe(this._ingList[i], recipe)
			if (this._ingList[i]._consumedOnSuccess && !inrecipe){
				$gameParty.gainItem(this._ingList[i], -(this._ingCount[i]))
				this._lostItems.push(this._ingList[i])
				this._lostValues.push(this._ingCount[i])
			} else if (inrecipe != false && Ramza.CSParams.KeepExcessMaterials){
				$gameParty.loseIngredientItem(this._ingList[i], -(this._ingCount[i]))
			} else if (inrecipe != false && !Ramza.CSParams.KeepExcessMaterials){
				var removeQty = 0
				if (inrecipe == 1){
					removeQty = recipe.BaseItemQuantity
				} else if (inrecipe == 2){
					removeQty = recipe.SecondItemQuantity
				} else if (inrecipe == 3){
					removeQty = recipe.ThirdItemQuantity
				} else if (inrecipe == 4){
					removeQty = recipe.FourthItemQuantity
				}
				$gameParty.loseIngredientItem(this._ingList[i], -(removeQty))
			}	
		};
};

Window_CraftingResult.prototype.isItemInRecipe = function(item, recipe){
	if (Imported.YEP_ItemCore && item.id > Yanfly.Param.ItemStartingId){
		if (item.itypeId){
			//independent item
			if ($dataItems[item.baseItemId] == recipe.BaseItem || (recipe.itemList[0] == "Category" && recipe.Category.toLowerCase() === item._craftCategory)) return 1
			if ($dataItems[item.baseItemId] == recipe.SecondItem) return 2
			if ($dataItems[item.baseItemId] == recipe.ThirdItem) return 3
			if ($dataItems[item.baseItemId] == recipe.FourthItem) return 4
		} else if (item.etypeId && item.etypeId == 1){
			//independent weapon
			if ($dataWeapons[item.baseItemId] == recipe.BaseItem || (recipe.itemList[0] == "Category" && recipe.Category.toLowerCase() === item._craftCategory)) return 1
			if ($dataWeapons[item.baseItemId] == recipe.SecondItem) return 2
			if ($dataWeapons[item.baseItemId] == recipe.ThirdItem) return 3
			if ($dataWeapons[item.baseItemId] == recipe.FourthItem) return 4
		} else if (item.etypeId && item.etypeId != 1){
			//independent armor
			if ($dataArmors[item.baseItemId] == recipe.BaseItem || (recipe.itemList[0] == "Category" && recipe.Category.toLowerCase() === item._craftCategory)) return 1
			if ($dataArmors[item.baseItemId] == recipe.SecondItem) return 2
			if ($dataArmors[item.baseItemId] == recipe.ThirdItem) return 3
			if ($dataArmors[item.baseItemId] == recipe.FourthItem) return 4
		}
	} else {
		if (item == recipe.BaseItem || (recipe.itemList[0] == "Category" && recipe.Category.toLowerCase() === item._craftCategory)){
			return 1
		} else if (item == recipe.SecondItem){
			return 2
		} else if (item == recipe.ThirdItem){
			return 3
		} else if (item == recipe.FourthItem){
			return 4
		} else {
			return false
		}
	}
}

Window_CraftingResult.prototype.removeIngredients = function(recipe){
	if (!Ramza.CSParams.KeepExcessMaterials){
		if (recipe.BaseItem != "Category"){
			var adjList = this._ingList.filter(item => (item.baseItemId == recipe.BaseItem.id || item.id == recipe.BaseItem.id))
			var ingIndex = this._ingList.indexOf(adjList[0])
			if (recipe.BaseItem._consumedOnSuccess) $gameParty.loseIngredientItem(adjList[0], -(recipe.BaseItemQuantity))
			this._ingList.splice(ingIndex, 1)
		} else {
			var ingIndex = this.matchCategory(recipe.Category.toLowerCase())
			if (this._ingList[ingIndex]._consumedOnSuccess) $gameParty.loseIngredientItem(this._ingList[ingIndex], -(recipe.BaseItemQuantity))
			this._ingList.splice(ingIndex, 1)
		}
		if (recipe.SecondItem != "Category"){
			var adjList = this._ingList.filter(item => (item.baseItemId == recipe.SecondItem.id || item.id == recipe.SecondItem.id))
			var ingIndex = this._ingList.indexOf(adjList[0])
			if (recipe.SecondItem._consumedOnSuccess) $gameParty.loseIngredientItem(adjList[0], -(recipe.SecondItemQuantity))
			this._ingList.splice(ingIndex, 1)
		} else {
			var ingIndex = this.matchCategory(recipe.SecondCategory.toLowerCase())
			if (this._ingList[ingIndex]._consumedOnSuccess) $gameParty.loseIngredientItem(this._ingList[ingIndex], -(recipe.SecondItemQuantity))
			this._ingList.splice(ingIndex, 1)
		}
		if (recipe.ThirdItem != "Category"){
			var adjList = (recipe.ThirdItem != null) ? this._ingList.filter(item => (item.baseItemId == recipe.ThirdItem.id || item.id == recipe.ThirdItem.id)) : []
			var ingIndex = this._ingList.indexOf(adjList[0])
			if (recipe.ThirdItem != null && recipe.ThirdItem._consumedOnSuccess) $gameParty.loseIngredientItem(adjList[0], -(recipe.ThirdItemQuantity))
			this._ingList.splice(ingIndex, 1)
		} else {
			var ingIndex = this.matchCategory(recipe.ThirdCategory.toLowerCase())
			if (this._ingList[ingIndex]._consumedOnSuccess) $gameParty.loseIngredientItem(this._ingList[ingIndex], -(recipe.ThirdItemQuantity))
			this._ingList.splice(ingIndex, 1)
		}
		if (recipe.FourthItem != "Category"){
			var adjList = (recipe.FourthItem != null) ? this._ingList.filter(item => (item.baseItemId == recipe.FourthItem.id || item.id == recipe.FourthItem.id)) : []
			var ingIndex = this._ingList.indexOf(adjList[0])
			if (recipe.FourthItem != null && recipe.FourthItem._consumedOnSuccess) $gameParty.loseIngredientItem(adjList[0], -(recipe.FourthItemQuantity))
			this._ingList.splice(ingIndex, 1)
		} else {
			var ingIndex = this.matchCategory(recipe.FourthCategory.toLowerCase())
			if (this._ingList[ingIndex]._consumedOnSuccess) $gameParty.loseIngredientItem(this._ingList[ingIndex], -(recipe.FourthItemQuantity))
			this._ingList.splice(ingIndex, 1)
		}
	} else {
		for (i = 0; i < this._ingList.length; i++){
			if (this._ingList[i]._consumedOnSuccess){
				$gameParty.loseIngredientItem(this._ingList[i], -(this._ingCount[i]))
			};
		};
	};
};

Window_CraftingResult.prototype.matchCategory = function(cat){
	var elementMatch = this._ingList.findIndex(function(element) {
		return element._craftCategory == cat;
		});
	return elementMatch
};

Window_CraftingResult.prototype.getProgressText = function(){
	for (i = 0; i < Ramza.CSParams.CraftCatMessages.length; i++){
		if (SceneManager._scene._category == Ramza.CSParams.CraftCatMessages[i].CategoryName){
			return (Ramza.CSParams.CraftCatMessages[i].CraftingProgressText) ? Ramza.CSParams.CraftCatMessages[i].CraftingProgressText : Ramza.CSParams.DefaultProgressMessage
		}
	}
	return Ramza.CSParams.DefaultProgressMessage
};

Window_CraftingResult.prototype.getSuccessText = function(){
	for (i = 0; i < Ramza.CSParams.CraftCatMessages.length; i++){
		if (SceneManager._scene._category == Ramza.CSParams.CraftCatMessages[i].CategoryName){
			return (Ramza.CSParams.CraftCatMessages[i].CraftingSuccessText) ? Ramza.CSParams.CraftCatMessages[i].CraftingSuccessText : Ramza.CSParams.DefaultSuccessMessage
		}
	}
	return Ramza.CSParams.DefaultSuccessMessage
};

Window_CraftingResult.prototype.getSoftFailText = function(){
	for (i = 0; i < Ramza.CSParams.CraftCatMessages.length; i++){
		if (SceneManager._scene._category == Ramza.CSParams.CraftCatMessages[i].CategoryName){
			return (Ramza.CSParams.CraftCatMessages[i].CraftingSuccessText) ? Ramza.CSParams.CraftCatMessages[i].CraftingSoftFailureText : Ramza.CSParams.DefaultSoftFailureMessage
		}
	}
	return Ramza.CSParams.DefaultSoftFailureMessage
};

Window_CraftingResult.prototype.callPartialRecipeSuccessResult = function(result){
	this.contents.clear();
	this.resetTextColor();
	this.changePaintOpacity(true);
	if (!Ramza.CSParams.FailureChance) {
		//no failure chance possible
		this.setWindowText(this.getSuccessText())
		if (Ramza.CSParams.ReturnPartialRecipeItems){
			this.removeIngredients(result[1].recipes[result[2]]);
		} else {
			this.removeAllIngredients(result[1].recipes[result[2]]);
			if (Ramza.CSParams.DisplayLoss && this._lostItems[0]) this._lossWindow.show()
		}
		$gameParty.gainItem(result[1].ResultItem, result[1].recipes[result[2]].ResultQuantity)
		var checks = ($gameTemp.takeIngredients.result) ? $gameTemp.takeIngredients.result.length : 0
		var donorItem = Ramza.CS.createDonorItem($gameTemp.takeIngredients.list)
		for (f = 0; f < checks; f++){
			Ramza.CS.processAdditiveTraits($gameTemp.takeIngredients.result[f], donorItem)
		}
		this.drawItem(result);
		$gameParty._craftingRecipes[Ramza.CSParams.resultItem.indexOf(result[1])] = true
		this.gainCraftExp(result)
		SceneManager._scene.clearIngredientsArrays();
		SoundManager.playOk();
	} else if (Math.random() > this.getSuccessRate(result)){
		//soft failure
		if (result[1].recipes[result[2]].FailureItemCreation == true && result[1].recipes[result[2]].FailureItem){
			//check for failure item case
			var item = result[1].recipes[result[2]].FailureItem
			if (Ramza.CSParams.FakeSuccess && Math.random() < Ramza.CSParams.FailureItemChance){
				this.setWindowText(this.getSuccessText())
				this.drawItem(item);
				$gameParty.gainItem(item, 1)
				this.performSoftFailureResult();
				if (Ramza.CSParams.DisplaySoftLoss && this._lostItems[0]) this._lossWindow.show()
				SceneManager._scene.clearIngredientsArrays();
				SoundManager.playOk();
			} else if (Math.random() < Ramza.CSParams.FailureItemChance){
				//Craft fails but adds failureitem
				this.callSoftFailureResult(result, item)
				if (Ramza.CSParams.DisplaySoftLoss && this._lostItems[0]) this._lossWindow.show()
			}
		} else {
			//normal soft failure no failitem
			this.callSoftFailureResult(result)
			if (Ramza.CSParams.DisplaySoftLoss && this._lostItems[0]) this._lossWindow.show()
		}
	} else {
		//soft fail possible, but success
		this.setWindowText(this.getSuccessText())
		if (Ramza.CSParams.ReturnPartialRecipeItems){
			this.removeIngredients(result[1].recipes[result[2]]);
		} else {
			this.removeAllIngredients(result[1].recipes[result[2]]);
			if (Ramza.CSParams.DisplayLoss && this._lostItems[0]) this._lossWindow.show()
		}
		$gameParty.gainItem(result[1].ResultItem, result[1].recipes[result[2]].ResultQuantity)
		var checks = ($gameTemp.takeIngredients.result) ? $gameTemp.takeIngredients.result.length : 0
		var donorItem = Ramza.CS.createDonorItem($gameTemp.takeIngredients.list)
		for (f = 0; f < checks; f++){
			Ramza.CS.processAdditiveTraits($gameTemp.takeIngredients.result[f], donorItem)
		}
		this.drawItem(result);
		$gameParty._craftingRecipes[Ramza.CSParams.resultItem.indexOf(result[1])] = true
		this.gainCraftExp(result)
		SceneManager._scene.clearIngredientsArrays();
		SoundManager.playOk();
	};
};

//------------------------------------------------------
// Window_Loss
// The window that shows items lost on a failed craft attempt

function Window_Loss() {
    this.initialize.apply(this, arguments);
}

Window_Loss.prototype = Object.create(Window_Base.prototype);
Window_Loss.prototype.constructor = Window_CraftingResult;

Window_Loss.prototype.setIngredientWindow = function(ingredientWindow){
	if (ingredientWindow != this._ingredientWindow) this._ingredientWindow = ingredientWindow
};

Window_Loss.prototype.setResultWindow = function(resultWindow){
	if (resultWindow != this._ingredientWindow) this._resultWindow = resultWindow
};

Window_Loss.prototype.setIngredients = function(ingredients, quantities){
	if (ingredients != this._ingList) this._ingList = ingredients
	if (quantities != this._ingCount) this._ingCount = quantities
};

Window_Loss.prototype.setCategory = function(category){
	if (category != this._category) this._category = category
};

Window_Loss.prototype.drawLossText = function() {
	this.changeTextColor(this.systemColor());
	var text = this.getLossHeadingText()
	this.contents.clear()
	this.drawText(text, 0, 0, this.width - 32, "center")
	this.resetTextColor();
};

Window_Loss.prototype.getLossHeadingText = function(){
	for (i = 0; i < Ramza.CSParams.CatLossMessages.length; i++){
		if (this._category == Ramza.CSParams.CatLossMessages[i].CategoryName){
			return Ramza.CSParams.CatLossMessages[i].LossText
		}
	}
	return Ramza.CSParams.DefaultLossMessage
}

Window_Loss.prototype.show = function() {
	this.setCategory(SceneManager._scene._category);
	this.drawLossText();
	this.drawLostItems();
	Window_Base.prototype.show.call(this)
	
};

Window_Loss.prototype.update = function(){
	Window_Base.prototype.update.call(this)
	if (this.visible){
		this._counter = this._counter || 0
		this._counter += 1
		var okaypressed = (this._canRepeat) ? Input.isRepeated("ok") : Input.isTriggered("ok");
		var cancelpressed = (this._canRepeat) ? Input.isRepeated("cancel") : Input.isTriggered("cancel");
		if (okaypressed || cancelpressed) this._counter = this._counter -5
		if (this._counter == Ramza.CSParams.LossWindowTimer){
			this._counter = undefined
			this.hide();
			this._resultWindow._lostItems = []
			this._resultWindow._lostValues = []
		}
	}
};

Window_Loss.prototype.drawLostItems = function(){
	var list = this._resultWindow._lostItems
	var qty = this._resultWindow._lostValues
	if (list){
		for (i = 0; i < list.length; i++){
			this.drawItemName(list[i], i)
			this.drawLostQty(qty[i], i)
		}
	}
};

Window_Loss.prototype.drawItemName = function(item, index){
	var wx = 16
	var wy = 48 + (32*index)
	var ww = this.width - this.textWidth(' :00')
	this.drawIcon(item.iconIndex, wx, wy)
	this.drawText(item.name, wx + 36, wy, ww)
}

Window_Loss.prototype.drawLostQty = function(item, index){
	var wx = this.width - this.textWidth(' :00') - 78
	var wy = 48 + (32*index)
	var ww = this.textWidth(' :00')
	if (Ramza.CSParams.CraftingMode != "DQ11") this.drawText(" :" + item, wx + 36, wy, ww)
}



/*
========================================================
Scene_Crafting
========================================================
*/

function Scene_Crafting() {
    this.initialize.apply(this, arguments);
}

Scene_Crafting.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Crafting.prototype.constructor = Scene_Crafting;

Scene_Crafting.prototype.initialize = function() {
	if ($gameTemp._craftCategory) {
		this._category = $gameTemp._craftCategory
		this._lockedCategory = true
	};	
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Crafting.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
	this.createIngredientList();
    this.createHelpWindow();
	this.createIngredientWindow();
	this._ingredientWindow.deactivate()
	this._ingredientWindow.select(-1)
	if (Ramza.CSParams.UseCategoryWindow){
		this.createItemCategoryWindow();
		this._itemCategoryWindow.deactivate()
		this._itemCategoryWindow.select(-1)
	}
	this.createListWindow()
	this._listWindow.deactivate();
	this._listWindow.select(-1)
	this.createPreviewWindow();
	this._ingredientWindow.setPreviewWindow(this._previewWindow)
	this.createResultWindow()
	this._resultWindow.hide()
	this._resultWindow.deactivate()
	this.createLossWindow()
	this._lossWindow.deactivate();
	this._lossWindow.hide();
	this.createConfirmationWindow()
	this._confirmWindow.deactivate()
	this._confirmWindow.hide();
	this._confirmWindow.deselect();
	this.createCategoryWindow();
	if (this._category == undefined){
		this._ingredientWindow.hide()
		if (Ramza.CSParams.UseCategoryWindow) this._itemCategoryWindow.hide()
		this._listWindow.hide()
		this._previewWindow.hide()
		if (this._categoryWindow._list.length != 2) {
			this._helpWindow.setText(Ramza.CSParams.categoryHelpText);
			this._categoryWindow.activate();
			this._categoryWindow.select(0);
		} else {
			this._categoryWindow.deactivate()
			this._categoryWindow.deselect()
		}
	} else {
		this._ingredientWindow.setCategory(this._category);
		this._ingredientWindow.activate();
		this._categoryWindow.deactivate()
		this._categoryWindow.deselect()
		this._ingredientWindow.select(0);
		this._categoryWindow.hide()
		
	}

};

Scene_Crafting.prototype.createIngredientList = function(){
	this._ingList = []
	this._ingCount = []
}

Scene_Crafting.prototype.createCategoryWindow = function() {
    this._categoryWindow = new Window_CraftingCategories();
    this._categoryWindow.y = this._helpWindow.height;
	this._categoryWindow.x = Graphics.boxWidth / 3;
    this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.onCancelOk.bind(this));
    this.addWindow(this._categoryWindow);
	if (this._categoryWindow._list.length == 2 && !$gameTemp._craftCategory){
		this.skipCategoryWindow()
	}
	delete $gameTemp._craftCategory
};

Scene_Crafting.prototype.skipCategoryWindow = function(){
	this._lockedCategory = true
	this.onCategoryOk();
	
};

Scene_Crafting.prototype.onCancelOk = function() {
//    $gameTemp._synthRecipe = undefined;
    this.popScene();
};

Scene_Crafting.prototype.onCategoryOk = function() {
	this._category = this._categoryWindow._list[this._categoryWindow._index].symbol
	this._ingredientWindow.show()
	if (Ramza.CSParams.UseCategoryWindow) this._itemCategoryWindow.show()
	this._ingredientWindow.setCategory(this._category);
	this._previewWindow.setCategory(this._category);
	this._listWindow.show()	
	this._previewWindow.show()
	this._ingredientWindow.activate();
	this._ingredientWindow.select(0)
    this._categoryWindow.hide();
};

Scene_Crafting.prototype.onIngredientSlotOk = function() {
	if (this._ingredientWindow.index() <= 3){
		if (Ramza.CSParams.UseCategoryWindow){
			this._itemCategoryWindow.activate();
			this._itemCategoryWindow.select(0);
			this._helpWindow.setText('Choose an ingredient category.')		
		} else {
			this._listWindow.activate();
			this._listWindow.select(0)
			this._listWindow.refresh();
		}
	} else {
		if (!Ramza.CSParams.ConfirmationWindow){
			this._resultWindow.show();
			this._resultWindow.activate();
			this._resultWindow.resetTextColor()
			this._resultWindow.setWindowText(this._resultWindow.getProgressText())
		} else {
			this._confirmWindow.show()
			this._confirmWindow.activate()
			this._confirmWindow.select(0)
			this._helpWindow.setText(Ramza.CSParams.ConfirmationMessage)
			
		}
	}
};


Scene_Crafting.prototype.createIngredientWindow = function() {
    var wy = this._helpWindow.height;
    var ww = Graphics.boxWidth / 2;
    var wh = 216;
    this._ingredientWindow = new Window_IngredientSlot(0, wy, ww, wh);
	this._ingredientWindow.setIngredients(this._ingList, this._ingCount)
	this._ingredientWindow.setHelpWindow(this._helpWindow);
    this._ingredientWindow.setHandler('ok',       this.onIngredientSlotOk.bind(this));
    this._ingredientWindow.setHandler('cancel',   this.onItemSlotCancel.bind(this));
    this.addWindow(this._ingredientWindow);
};

Scene_Crafting.prototype.clearIngredientsArrays = function(){
	this._ingList = []
	this._ingCount = []
	this._resultWindow._ingList = this._ingList
	this._resultWindow._ingCount = this._ingCount
	this._ingredientWindow.setIngredients(this._ingList,this._ingCount)
	this._ingredientWindow.refresh();
	this._listWindow._ingList = this._ingCount
	this._listWindow._ingCount = this._ingCount
	$gameTemp.takeIngredients = undefined
	
};

Scene_Crafting.prototype.onItemSlotCancel = function(){
	if (!this._lockedCategory){
		this._category = undefined
		this._ingredientWindow.hide()
		if (Ramza.CSParams.UseCategoryWindow) this._itemCategoryWindow.hide()
		this._listWindow.hide()
		this._categoryWindow.show();	
		this._categoryWindow.activate();
		this._categoryWindow.select(0);
		this._ingredientWindow.deselect();
		this.clearIngredientsArrays();
		this._previewWindow.hide();
		this._helpWindow.setText(Ramza.CSParams.categoryHelpText);
	} else {
		this._lockedCategory = undefined
		this.popScene();
	}
};

Scene_Crafting.prototype.onItemCatCancel = function(){
	this._itemCategoryWindow.deselect();
    this._ingredientWindow.activate();
};

Scene_Crafting.prototype.onItemCatOk = function(){
	if (this._itemCategoryWindow.currentSymbol() != 'clear'){
		this._listWindow.activate();
		this._listWindow.setCategory(this._itemCategoryWindow.currentSymbol())
		this._listWindow.select(0);
	} else {
		this._ingList.splice(this._ingredientWindow.index(), 1)
		this._ingCount.splice(this._ingredientWindow.index(), 1)
		this._ingredientWindow.activate();
		this._itemCategoryWindow.deselect();
		this._itemCategoryWindow.deactivate();
		this._ingredientWindow.refresh();
	}
};

Scene_Crafting.prototype.onItemListCancel = function(){
	if (Ramza.CSParams.UseCategoryWindow) {
		this._itemCategoryWindow.activate();
		this._helpWindow.setText('Choose an ingredient category.')
	} else {
		this._ingredientWindow.activate();
		this._listWindow.contents.clear()
	}
	this._listWindow.deselect()
};

Scene_Crafting.prototype.onItemListOk = function(){
	this._ingList[this._ingredientWindow.index()] = this._listWindow.item()
	this._ingCount[this._ingredientWindow.index()] = 1
	this._ingredientWindow.activate();
	this._ingredientWindow.refresh();
	this._listWindow.contents.clear();
	this._previewWindow.drawPreviewItem();
	if (Ramza.CSParams.UseCategoryWindow) this._itemCategoryWindow.deselect();
	this._listWindow.deselect()
	this._listWindow.deactivate()
};

Scene_Crafting.prototype.createItemCategoryWindow = function() {
	var wy = this._helpWindow.height + this._ingredientWindow.height
	var ww = Graphics.boxWidth;
	var wh = 12
	this._itemCategoryWindow = new Window_IngredientCategory(0, wy, ww, wh);
	this._itemCategoryWindow.setHelpWindow(this._helpWindow)
	this._itemCategoryWindow.setHandler('ok',	this.onItemCatOk.bind(this))
	this._itemCategoryWindow.setHandler('cancel',	this.onItemCatCancel.bind(this))
	this.addWindow(this._itemCategoryWindow)
};

Scene_Crafting.prototype.createListWindow = function() {
	var wy = (Ramza.CSParams.UseCategoryWindow) ? this._helpWindow.height + this._ingredientWindow.height + this._itemCategoryWindow.height : this._helpWindow.height + this._ingredientWindow.height
	var ww = Graphics.boxWidth;
	var wh = Graphics.boxHeight - wy
    this._listWindow = new Window_IngredientList(0, wy, ww, wh);
	if (Ramza.CSParams.UseCategoryWindow) this._itemCategoryWindow.setListWindow(this._listWindow)
    this._listWindow.setHandler('ok', this.onItemListOk.bind(this));
    this._listWindow.setHandler('cancel', this.onItemListCancel.bind(this));
    this._listWindow.setHelpWindow(this._helpWindow);
    this.addWindow(this._listWindow);
};

Scene_Crafting.prototype.createPreviewWindow = function() {
	var wy = this._helpWindow.height
	var wx = Graphics.boxWidth / 2;
	var ww = Graphics.boxWidth / 2;
	var wh = this._ingredientWindow.height
    this._previewWindow = new Window_CraftPreview(wx, wy, ww, wh);
	this._previewWindow.setCategory(this._category)
//	this._previewWindow.drawExpGauge();
    this.addWindow(this._previewWindow);
};

Scene_Crafting.prototype.createConfirmationWindow = function() {
	var wy = this._helpWindow.height + this._ingredientWindow.height
	var wx = Graphics.boxWidth / 4;
	var ww = Graphics.boxWidth / 3;
	var wh = this._ingredientWindow.height
	this._confirmWindow = new Window_CraftConfirm(wx, wy, ww, wh);
	this._confirmWindow.setHandler('ok', this.onConfirmWindowOk.bind(this));
    this._confirmWindow.setHandler('cancel', this.onConfirmWindowCancel.bind(this));
    this.addWindow(this._confirmWindow);
};

Scene_Crafting.prototype.onConfirmWindowOk = function(){
	this._confirmWindow.hide();
	this._confirmWindow.deactivate();
	this._confirmWindow.deselect();
	this._resultWindow.show();
	this._resultWindow.activate();
	this._resultWindow.resetTextColor()
	this._resultWindow.setWindowText(this._resultWindow.getProgressText())
};

Scene_Crafting.prototype.onConfirmWindowCancel = function(){
	this._confirmWindow.hide();
	this._confirmWindow.deactivate();
	this._confirmWindow.deselect();
	this._ingredientWindow.activate();
};

Scene_Crafting.prototype.createLossWindow = function() {
	var wy = this._helpWindow.height + this._ingredientWindow.height + 16
	var wx = Graphics.boxWidth / 4
	var ww = Graphics.boxWidth - (wx * 2);
	var wh = Graphics.boxHeight - wy
    this._lossWindow = new Window_Loss(wx, wy, ww, wh);
	this._lossWindow.setIngredientWindow(this._ingredientWindow)
	this._lossWindow.setResultWindow(this._resultWindow)
	this._lossWindow.setIngredients(this._ingList, this._ingCount)
	this._lossWindow.setCategory(this._category)
	this._lossWindow.drawLossText();
	this._resultWindow.setLossWindow(this._lossWindow)
    this.addWindow(this._lossWindow);
};

Scene_Crafting.prototype.clearIngredients = function(){
	console.log('here?')
	this._ingList = []
	this._ingCount = []
};

Scene_Crafting.prototype.createResultWindow = function() {
	var wy = Graphics.boxHeight / 3
	var wx = Graphics.boxWidth / 6
	var ww = Graphics.boxWidth - (wx * 2);
	var wh = Graphics.boxHeight / 3
    this._resultWindow = new Window_CraftingResult(wx, wy, ww, wh);
	this._resultWindow._progressBar = 0
	this._resultWindow.setIngLists(this._ingList, this._ingCount)
	this._resultWindow.setIngredientWindow(this._ingredientWindow);
	this.addWindow(this._resultWindow);
};

Scene_Crafting.prototype.getLevelUpString = function(){
	if (Ramza.CSParams.showLevelUpMessage){
		for (i = 0; i < Ramza.CSParams.CategorySpecificLevelMessages.length; i++){
			if (Ramza.CSParams.CategorySpecificLevelMessages[i].CategoryName != this._category) continue
			var spec = i
		}
		var text = (spec != undefined) ? Ramza.CSParams.CategorySpecificLevelMessages[spec].LevelUpText : Ramza.CSParams.defaultLevelUpMessage
		spec = undefined
		var output = text.replace('%n', this._category)
		var catLevel = eval("$gameParty._craftLevels." + this._category)
		var output = output.replace('%l', catLevel)
		var output = output.charAt(0).toUpperCase() + output.slice(1)
		return output
	}
};

Scene_Crafting.prototype.getLevelUpCommonEvent = function(){
		for (i = 0; i < Ramza.CSParams.CommonEvents.length; i++){
			if (Ramza.CSParams.CommonEvents[i].CategoryName.toLowerCase() != this._category) continue
			return Ramza.CSParams.CommonEvents[i].CommonEventId
		}
};

Scene_Crafting.prototype.getLevelUpEvalCode = function(){
	for (i = 0; i < Ramza.CSParams.CommonEvents.length; i++){
		if (Ramza.CSParams.CommonEvents[i].CategoryName.toLowerCase() != this._category) continue
		return Ramza.CSParams.CommonEvents[i].ImmediateCode
	}
};

Scene_Crafting.prototype.checkIngredientsArray = function(){
	//check for independent item
	if (Imported.YEP_ItemCore){
		for (let i = 0; i < this._ingList.length; i++){
			var target = this._ingList[i]
			if (!target) continue
			if (target.id < Yanfly.Param.ItemStartingId){
				//independent item found
				this._ingList[i] = null
				this._ingCount[i] = null
			}
		}
	}
	//check if party still has enough qty
	for (let i = 0; i < this._ingList.length; i++){
		if (!this._ingList[i]) continue
		if ($gameParty.numItems(this._ingList[i]) < this._ingCount[i]){
			this._ingList[i] = null
			this._ingCount[i] = null
		}
	}
	//console.log(this._ingList)
	//clean up array
	this._ingList = this._ingList.filter(item => item)
	this._ingCount = this._ingCount.filter(count => count)
	console.log(this._ingList)
//	this._ingList.splice(this._ingredientWindow.index(), 1)
//	this._ingCount.splice(this._ingredientWindow.index(), 1)
};

//=============================================
//Database backup/restoration functions
//=============================================


Ramza.CS.filePath = function (location) {
		if (!Utils.isNwjs()) return '';
		var path = require('path');
		var base = path.dirname(process.mainModule.filename);
		return path.join(base, location);
	};

Ramza.CS.recipeDump = function(name){
	var path = Ramza.CS.filePath('data/')
	var filename = path + name
	var fs = require('fs');
	var data = {}
	console.log("creating dump of recipe list at " + filename + "...")
	if (this.checkDataExists(name)){
		data.version = this.getRecipeDumpVersion(name)
		console.log("File already exists, version " + data.version + "... Overwriting.")
		//console.log(data.version)
	}
	data.recipeList = JSON.stringify(Ramza.CSParams.recipeList)
	data.version = data.version + 1 || 1
	var vers = data.version
	data = JSON.stringify(data)
	fs.writeFileSync(filename, data);
	console.log("Wrote recipe dump file to " + filename + " version " + vers)
};

Ramza.CS.restoreRecipeDump = function(name){
	var loadedData = this.getRecipeDumpData(name)
	this.importRecipeData(loadedData)
	console.log("Write completed. You must reload the RPGMaker software entirely for the database to be updated")
	console.log("the backed up recipe list can be found at the bottom of the plugin manager")
};

Ramza.CS.importRecipeData = function(data){
	//console.log("Restoring dumped recipelist from " + name + " to database...")
	var path = Ramza.CS.filePath('js/')
	var filename = path + 'plugins.js'
	var fs = require('fs');
	var pluginData = JsonEx.makeDeepCopy($plugins)
	var string = "// Generated by RPG Maker.\n// Do not edit this file directly.\nvar $plugins =\n"
	var oldIndex = Ramza.CS.checkCSIndex()
	console.log("creating backup database entry")
	pluginData.push($plugins[oldIndex])
	pluginData[pluginData.length - 1].status = false
	console.log("backup completed")
	console.log("restoring dumped recipe list from file...")
	pluginData[oldIndex].parameters.RecipeList = data
	//console.log(data)
	pluginData = JSON.stringify(pluginData)
	string = string + pluginData
	//console.log(string)
	var expr = /\{/
	var charAt = string.search(expr)
	var txt2 = string.slice(0, charAt) + "\n" + string.slice(charAt)
	string = txt2
	expr = /\},/g
	string = string.replace(expr, "},\n")
	//console.log(string)
	//txt2 = string.slice(0, charAt) + "\n" + string.slice(charAt)
	//string = txt2
	txt2 = string.slice(0, string.length -1) + "\n" + string.slice(string.length -1) + ";"
	string = txt2
	
	fs.writeFileSync(filename, string);
};

Ramza.CS.getRecipeDumpVersion = function(filename, info){
	if (!Utils.isNwjs()) return;
		info = info || "[]";
		if (this.dataPath === undefined) this.dataPath = this.filePath('data/');
		var fs = require('fs');
		var filePath = this.dataPath + filename;
		if (fs.existsSync(filePath)){
			var data = fs.readFileSync(filePath, 'utf8')
			data = JSON.parse(data)
			return data.version
		}
	//DataManager.loadDataFile('$recipelist', 'recipelist.json')
};

Ramza.CS.getRecipeDumpData = function(filename, info){
	if (!Utils.isNwjs()) return;
		info = info || "[]";
		if (this.dataPath === undefined) this.dataPath = this.filePath('data/');
		var fs = require('fs');
		var filePath = this.dataPath + filename;
		if (fs.existsSync(filePath)){
			var data = fs.readFileSync(filePath, 'utf8')
			data = JSON.parse(data)
			return data.recipeList
		}
	//DataManager.loadDataFile('$recipelist', 'recipelist.json')
};

Ramza.CS.checkDataExists = function (filename, info) {
		if (!Utils.isNwjs()) return;
		info = info || "[]";
		if (this.dataPath === undefined) this.dataPath = this.filePath('data/');
		var fs = require('fs');
		var filePath = this.dataPath + filename;
		return fs.existsSync(filePath)
		/*if (fs.existsSync(filePath)){
			var data = fs.readFileSync(filePath, 'utf8')
			data = JSON.parse(data)
			return data
		}*/
		//if (!fs.existsSync(filePath)) {
		//	fs.writeFileSync(filePath, info);
		//}
	};


Ramza.CS.getName = function (element){
	return element.name === "Ramza_CraftingSystem"
}

Ramza.CS.checkCSIndex = function(){
	
	return $plugins.findIndex(this.getName)
//	return $plugins[$plugins.findIndex(this.getName)].parameters.RecipeList
};

Ramza.CS.createBackupPluginEntry = function(){
	var path = Ramza.CS.filePath('js/')
	var filename = path + 'plugins.js'
	var fs = require('fs');
	var pluginData = JsonEx.makeDeepCopy($plugins)
	var string = "// Generated by RPG Maker.\n// Do not edit this file directly.\nvar $plugins =\n"
	var oldIndex = Ramza.CS.checkCSIndex()
	pluginData.push($plugins[oldIndex])
	pluginData[pluginData.length - 1].status = false
	//pluginData.move(oldIndex, pluginData.length -1)
	pluginData = JSON.stringify(pluginData)
	string = string + pluginData
	//console.log(string)
	var expr = /\{/
	var charAt = string.search(expr)
	var txt2 = string.slice(0, charAt) + "\n" + string.slice(charAt)
	string = txt2
	expr = /\},/g
	string = string.replace(expr, "},\n")
	//console.log(string)
	//txt2 = string.slice(0, charAt) + "\n" + string.slice(charAt)
	//string = txt2
	txt2 = string.slice(0, string.length -1) + "\n" + string.slice(string.length -1) + ";"
	string = txt2
	
	fs.writeFileSync(filename, string);
};