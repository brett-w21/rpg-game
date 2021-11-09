//=============================================================================
// Ramza Plugins - Crafting System
// Ramza_CraftingSystem_MZ.js
// v1.12a
//=============================================================================

var Ramza = Ramza || {};
Ramza.CS = Ramza.CS || {};
Ramza.CS.version = 1.12
var Imported = Imported || {}
Ramza.CS.requiredCoreVersion = 1.00

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc v1.12a Adds a crafting system, which allows weapons, armors, and items to be created from ingredients
 * @author Ramza
 * @base Ramza_CS_Core
 * @orderAfter YEP_ItemCore
 * @orderAfter Ramza_IndependentItems
 * @orderAfter Ramza_CS_Core
 *
 * @param General
 *  
 * @param Messages
 *
 * @param Sounds
 *
 * @param Gauge
 * 
 * @param AllowPartials
 * @parent General
 * @text Allow Partial Recipe Matches
 * @desc If too many ingredients are presented, check against smaller recipes for a match?
 * @type boolean
 * @default true
 *
 * @param CraftingMode
 * @parent General
 * @text Mode Select
 * @desc Which crafting mode to use (see help documentation)
 * @type select
 * @option Default
 * @option DQ11
 * @default Default
 *
 * @param UseCategoryWindow
 * @parent General
 * @text Use Item Category Window
 * @desc Show the item category window, and separate ingredients by category selected?
 * @type boolean
 * @default true
 *
 * @param ShowInMenu
 * @text Show in Menu
 * @desc Show crafting scene in the menu by default?
 * @parent General
 * @type boolean
 * @default true
 *
 * @param MenuString
 * @text Menu Command Text
 * @desc The text shown for the menu command to enter the crafting scene.
 * @type text
 * @parent General
 * @default Crafting
 *
 * @param MenuCommandEnabled
 * @text Enable Menu Command
 * @desc Will the menu command be enabled by default?
 * @parent General
 * @type boolean
 * @default true
 *
 * @param CategoryMenuCommand
 * @type struct<MenuCategories>[]
 * @parent General
 * @text Category Menu Commands
 * @desc Bind specific crafting categories to the menu by themselves
 * @default []
 *
 * @param ReturnPartialItems
 * @parent General
 * @text Return Extra Items
 * @desc Return unused items in a partial recipe match?
 * @type boolean
 * @default false
 *
 * @param RemoveExtraQuantities
 * @parent General
 * @text Take Excess Ingredients
 * @desc Remove provided extra ingredients for a valid recipe
 * @type boolean
 * @default false 
 *
 * @param HiddenCategories
 * @text Hidden Categories
 * @parent General
 * @desc Names of Categories that will be hidden on the main scene (requiring them to be called specifically to access)
 * @type text
 * @default
 *
 * @param CategoryHelpText
 * @text Category Command Help Text
 * @parent Messages
 * @desc The help text shown in the help window on the category selection window
 * @type text
 * @default Select crafting category.
 * 
 * @param ClearText
 * @parent UseCategoryWindow
 * @text Clear Button Text
 * @desc The text on the clear button on the item category selection window
 * @type text
 * @default Clear
 *
 * @param ClearHelpText
 * @parent UseCategoryWindow
 * @text Clear Button Help Text
 * @desc The message shown in the help window when the clear button is selected.
 * @type text
 * @default Remove this ingredient from the list.
 *
 * @param IngredientCategoryHelpText
 * @parent UseCategoryWindow
 * @text Item Category Help Text
 * @desc The message shown in the help window when selecting an iingredient category.
 * @type text
 * @default Choose an ingredient category.
 * 
 * @param LockedSlots
 * @text Locked Ingredient Slots
 * @parent General
 * @desc Will slot 3 or 4 be locked by default?
 * @type select
 * @option None
 * @option 3 and 4
 * @option Only 4
 * @default None
 *
 * @param LockedText
 * @text Locked Slot Text
 * @desc The text that shows in a locked ingredient slot
 * @parent Messages
 * @type text
 * @default (locked)
 *
 * @param LockedHelpText
 * @text Locked Slot Help Text
 * @desc The text that shows in the help window when a locked slot is selected
 * @parent Messages
 * @type text
 * @default This slot cannot be used.
 * 
 * @param LockedSlotIcon
 * @text Locked Slot Icon
 * @desc The index of the icon to use on a locked ingredient slot
 * @parent Messages
 * @type number
 * @min 0
 * @default 195
 * 
 * @param EmptyText
 * @text Empty Slot Text
 * @desc The text that shows in an empty ingredient slot
 * @parent Messages
 * @type text
 * @default (nothing)
 * 
 * @param EmptyHelpText
 * @text Empty Slot Help Text
 * @desc The text that shows in the help window when an empty slot is selected
 * @parent Messages
 * @type text
 * @default Select an ingredient.
 * 
 * @param EmptySlotIcon
 * @text Empty Slot Icon
 * @desc The index of the icon to use on an empty ingredient slot
 * @parent Messages
 * @type number
 * @min 0
 * @default 16
 * 
 * @param CraftText
 * @text Craft Button Text
 * @desc The text shown on the button that initiates crafting
 * @parent Messages
 * @type text
 * @default Craft
 * 
 * @param CraftLockedHelpText
 * @text Craft Button Help Text (locked)
 * @desc The text shown in the help window when the craft button is highlighted, but is not enabled
 * @parent Messages
 * @type text
 * @default Choose at least two ingredients.
 * 
 * @param CraftEnabledHelpText
 * @text Craft Button Help Text (enabled)
 * @desc The text shown in the help window when the craft button is highlighted and enabled
 * @parent Messages
 * @type text
 * @default Craft with the selected ingredients.
 * 
 * @param DefaultProgressMessage
 * @text Progress Window Text
 * @parent Messages
 * @desc The text shown in the crafting progress window while the gauge fills up.
 * @type text
 * @default Crafting...
 *
 * @param DefaultSuccessMessage
 * @text Success Window Text
 * @parent Messages
 * @desc The text shown in the result window when crafting has succeeded.
 * @type text
 * @default Crafting succeeded!
 * 
 * @param CraftCatMessages
 * @text Category Specific Messages
 * @parent Messages
 * @type struct<CatMessages>[]
 * @desc Specify help dialogue and craft button names per category
 * @default ["{\"CategoryName\":\"Cooking\",\"EmptySlotText\":\"Select an ingredient.\",\"LockedSlotText\":\"Cannot add more ingredients.\",\"CraftButtonText\":\"Cook\",\"CraftLockedHelpText\":\"Select at least two ingredients.\",\"CraftOkHelpText\":\"Cook with the selected ingredients.\"}","{\"CategoryName\":\"Blacksmithing\",\"EmptySlotText\":\"Select a material.\",\"LockedSlotText\":\"Additional materials cannot be used.\",\"CraftButtonText\":\"Smith\",\"CraftLockedHelpText\":\"Select at least two materials.\",\"CraftOkHelpText\":\"Smith using the selected materials.\"}","{\"CategoryName\":\"Alchemy\",\"EmptySlotText\":\"Select a reagent to use.\",\"LockedSlotText\":\"Additional reagents cannot be added.\",\"CraftButtonText\":\"Brew\",\"CraftLockedHelpText\":\"Select at least two reagents.\",\"CraftOkHelpText\":\"Brew a potion with the selected reagents.\"}"]
 * 
 * @param CraftingLevels
 * @parent General
 * @text Use Crafting Levels
 * @type boolean
 * @default true
 * @desc Use an experience/leveling system for crafting
 * 
 * @param MaxLevel
 * @parent CraftingLevels
 * @text Maximum Level
 * @type number
 * @min 1
 * @desc The maximum level a crafting category can be
 * @default 10
 *
 * @param ExpBarMaxLevelText
 * @parent CraftingLevels
 * @text Max Level Text
 * @type text
 * @desc The text string shown over the exp bar in place of experience when max level
 * @default MAX★LEVEL
 *
 * @param ExperienceCurve
 * @parent CraftingLevels
 * @text Experience Curve
 * @desc Calculation to determine required experience points to gain a crafting level
 * @type note
 * @default "100 + ((level -1) * 100)"
 *
 * @param ExperienceGainCalc
 * @text Experience Gain Calculation
 * @desc The eval to calculate experience gain from crafting
 * @parent CraftingLevels
 * @type note
 * @default "25 + (5 * (requiredlevel - level))"
 *
 * @param LowLevelCrafts
 * @text Allow Low Level Crafts
 * @desc Allow crafting to be done below the required level?
 * @parent CraftingLevels
 * @type boolean
 * @default true
 *
 * @param LevelUpMessage
 * @parent Messages
 * @text Use a level up message?
 * @type boolean
 * @default true
 * @desc Show a level up message when a crafting category levels up
 * 
 * @param DefaultLevelMessage
 * @text Default Level Up Message
 * @parent Messages
 * @type text
 * @desc The default level up message shown when a category specific one isn't set
 * @default %n skill increased to %l!
 *
 * @param LevelUpSound
 * @text Level Up Sound Effect
 * @parent Messages
 * @type struct<AudioObject>[]
 * @desc The sound that plays when a craft skill levels up
 * @default ["{\"name\":\"Up4\",\"volume\":\"90\",\"pitch\":\"140\",\"pan\":\"0\"}"]
 *
 * @param CategorySpecificLevelMessages
 * @parent Messages
 * @text Category Level Up Messages
 * @desc Specific level up message for each category.
 * @type struct<CatLevelUps>[]
 * @default ["{\"CategoryName\":\"Cooking\",\"LevelUpText\":\"Chef skills have improved to level %l!\"}","{\"CategoryName\":\"Blacksmithing\",\"LevelUpText\":\"Smithing ability has progressed to level %l!\"}","{\"CategoryName\":\"Alchemy\",\"LevelUpText\":\"Alchemical knowledge improved to level %l!\"}"]
 * 
 * @param PreviewWindow
 * @text Preview Window
 * @parent General
 *
 * @param ButtonAssistLeftRightBindText
 * @parent Messages
 * @text Keybind Text
 * @default Adjust Quantity
 * @desc The text shown next to the left/right keybind in VSCoreEngine's button assist window.
 * 
 * @param ShowPreview
 * @parent PreviewWindow
 * @text Show Item Preview
 * @desc Show the result that will be crafted, if it has been unlocked
 * @type boolean
 * @default true
 *
 * @param LockedItemText
 * @text Locked Item Text
 * @desc The name shown for a valid recipe that hasn't been unlocked yet
 * @parent PreviewWindow
 * @type text
 * @default (Unknown Item)
 *
 * @param InvalidRecipeText
 * @text Invalid Recipe Text
 * @desc The name shown for a valid craft that doesn't match any recipe (total failure)
 * @parent PreviewWindow
 * @type text
 * @default (Unknown Item)
 *
 * @param InvalidComboText
 * @text Invalid Combo Text
 * @desc The name shown in the preview window when the craft button is disabled
 * @parent PreviewWindow
 * @type text
 * @default (nothing) 
 *
 * @param ResultText
 * @parent PreviewWindow
 * @text Result String
 * @desc The text shown at the upper left corner of the result window.
 * @type text
 * @default Result
 *
 * @param QuantityText
 * @parent PreviewWindow
 * @text Quantity String
 * @desc The text shown in the upper right corner of the preview window.
 * @type text
 * @default Quantity
 * 
 * @param ShowSuccessRate
 * @text Show Craft Success Chance
 * @desc Show the success chance for crafting on the preview window
 * @parent PreviewWindow
 * @type boolean
 * @default true
 * 
 * @param SuccessChanceText
 * @parent ShowSuccessRate
 * @text Success Rate String
 * @desc The text shown to indicate the success rate of the recipe preview.
 * @type text
 * @default Success Chance:
 *
 * @param SuccessWindowTimer
 * @text Success Window Timer
 * @parent ShowSuccessRate
 * @type number
 * @min 60
 * @desc How long (in frames) to show the crafting success window for?
 * @default 90 
 *
 * @param UseSuccessColors
 * @text Use Success % Colors
 * @desc Change the color of the success % text based on the success chance?
 * @parent ShowSuccessRate
 * @type boolean
 * @default true
 *
 * @param 100%Color
 * @text 100% Chance Color
 * @desc The color of the success chance value at 100% rate.
 * @parent UseSuccessColors
 * @type Number
 * @default 28
 *
 * @param 80-99%Color
 * @text 80-99% Chance Color
 * @desc The color of the success chance value between 80 and 99% rate rate.
 * @parent UseSuccessColors
 * @type Number
 * @default 9
 *
 * @param 60-79%Color
 * @text 60-79% Chance Color
 * @desc The color of the success chance value between 60 and 79% rate rate.
 * @parent UseSuccessColors
 * @type Number
 * @default 5
 *
 * @param 40-59%Color
 * @text 40-59% Chance Color
 * @desc The color of the success chance value between 40 and 59% rate rate.
 * @parent UseSuccessColors
 * @type Number
 * @default 14
 *
 * @param 20-39%Color
 * @text 20-39% Chance Color
 * @desc The color of the success chance value between 20 and 39% rate rate.
 * @parent UseSuccessColors
 * @type Number
 * @default 2
 *
 * @param 1-19%Color
 * @text 1-19% Chance Color
 * @desc The color of the success chance value between 1 and 19% rate rate.
 * @parent UseSuccessColors
 * @type Number
 * @default 10
 *
 * @param 0%Color
 * @text 0% Chance Color
 * @desc The color of the success chance value of 0%
 * @parent UseSuccessColors
 * @type Number
 * @default 7
 *
 * @param ConfirmationWindow
 * @text Use Confirmation Window
 * @desc Show a confirmation window before crafting
 * @parent General
 * @type boolean
 * @default true
 *
 * @param ConfirmationMessage
 * @text Confirmation Message
 * @desc The text shown in the help window when the confirmation dialogue is open
 * @parent ConfirmationWindow
 * @type text
 * @default Really use these these items?
 *
 * @param ConfirmationConfirmText
 * @text Confirm Button Name
 * @parent ConfirmationWindow
 * @desc The text for the confirm option on the confirmation window
 * @type text
 * @default Confirm
 *
 * @param ConfirmationCancelText
 * @text Cancel Button Name
 * @parent ConfirmationWindow
 * @desc The text for the cancel option on the confirmation window
 * @tyoe text
 * @default Cancel
 *
 * @param ShowCraftingLevel
 * @text Show Crafting Level
 * @desc Show current exp/crafting level at the bottom of the preview window
 * @parent CraftingLevels
 * @type boolean
 * @default true
 * 
 * @param CommonEvents
 * @text Level Up Common Events
 * @parent CraftingLevels
 * @desc Specify a common event that will run when a crafting category gains an experience level
 * @type struct<catCommonEvents>[]
 * @default []
 *
 * @param CraftingSounds
 * @text Use Crafting Sound Effect
 * @parent Sounds
 * @desc Play a sound effect on the crafting result window while the gauge fills up?
 * @type boolean
 * @default true
 * 
 * @param QuantityPlays
 * @text Repeat SE Times
 * @parent Sounds
 * @desc How many times to play the SE while the bar fills up
 * @type number
 * @min 1
 * @default 4
 * 
 * @param DefaultCraftingSound
 * @text Default Crafting Sound
 * @parent Sounds
 * @desc The default crafting sound for all categories
 * @type struct<AudioObject>[]
 *
 * @default ["{\"name\":\"Bell1\",\"volume\":\"90\",\"pitch\":\"100\",\"pan\":\"0\"}"]
 *
 * @param CategoryCraftingSounds
 * @text Category Crafting Sounds
 * @parent Sounds
 * @desc Specify sounds effects for each category during the result window gauge fill-up
 * @type struct<CatCraftSounds>[]
 * @default ["{\"CategoryName\":\"Cooking\",\"CraftSound\":\"[\\\"{\\\\\\\"name\\\\\\\":\\\\\\\"Fire1\\\\\\\",\\\\\\\"volume\\\\\\\":\\\\\\\"35\\\\\\\",\\\\\\\"pitch\\\\\\\":\\\\\\\"140\\\\\\\",\\\\\\\"pan\\\\\\\":\\\\\\\"0\\\\\\\"}\\\"]\"}","{\"CategoryName\":\"Blacksmithing\",\"CraftSound\":\"[\\\"{\\\\\\\"name\\\\\\\":\\\\\\\"Hammer\\\\\\\",\\\\\\\"volume\\\\\\\":\\\\\\\"90\\\\\\\",\\\\\\\"pitch\\\\\\\":\\\\\\\"100\\\\\\\",\\\\\\\"pan\\\\\\\":\\\\\\\"0\\\\\\\"}\\\"]\"}","{\"CategoryName\":\"Alchemy\",\"CraftSound\":\"[\\\"{\\\\\\\"name\\\\\\\":\\\\\\\"Raise2\\\\\\\",\\\\\\\"volume\\\\\\\":\\\\\\\"40\\\\\\\",\\\\\\\"pitch\\\\\\\":\\\\\\\"130\\\\\\\",\\\\\\\"pan\\\\\\\":\\\\\\\"0\\\\\\\"}\\\"]\"}"]
 *
 * @param CraftingGaugeColor1
 * @text Crafting Gauge Color #1
 * @parent Gauge
 * @desc The first color for the crafting gauge
 * @type number
 * @default 4
 *
 * @param CraftingGaugeColor2
 * @text Crafting Gauge Color #2
 * @parent Gauge
 * @desc The second color for the crafting gauge
 * @type number
 * @default 17
 *
 * @param CraftExpGaugeColor1
 * @text Experience Gauge Color #1
 * @parent Gauge
 * @desc The first color for the craft experience gauge
 * @type number
 * @default 16
 *
 * @param CraftExpGaugeColor2
 * @text Experience Gauge Color #2
 * @parent Gauge
 * @desc The second color for the craft experience gauge
 * @type number
 * @default 25
 * 
 * @param CraftGaugeTime
 * @text Craft Gauge Fill Time
 * @parent Gauge
 * @desc Length of time in frames that it takes to fill the crafting gauge on the result window
 * @type number
 * @min 30
 * @default 100
 *
 * @param TotalFailure
 * @text Total Failure
 * @default Parameters for invalid recipes
 * 
 * @param CompleteFailureCase
 * @parent TotalFailure
 * @text Total Failure Case
 * @desc What happens when the items selected are not from a recipe?
 * @type select
 * @option No ingredients are lost
 * @value 0
 * @option Remove all ingredients
 * @value 1
 * @option Remove one of each ingredient
 * @value 2
 * @option Remove half of each ingredient
 * @value 3
 * @option Remove all ingredients with a % chance
 * @value 4
 * @option Remove one of all ingredients with a % chance
 * @value 5
 * @option Remove half of all ingredients with a % chance
 * @value 6
 * @option Remove all of each ingredient with a % chance
 * @value 7
 * @option Remove one of each ingredient with a % chance
 * @value 8
 * @option Remove half of each ingredient with a % chance
 * @value 9
 * @option Remove all of a random ingredient
 * @value 10
 * @option Remove one of a random ingredient
 * @value 11
 * @option Remove half of a random ingredient
 * @value 12
 * @option Remove all of a random ingredient with a % chance
 * @value 13
 * @option Remove one of a random ingredient with a % chance
 * @value 14
 * @option Remove half of a random ingredient with a % chance
 * @value 15
 * @default 0
 * 
 * @param RemovalChance
 * @parent TotalFailure
 * @text Removal % chance
 * @desc The chance for items to be removed upon a complete crafting failure
 * @type number
 * @min 0
 * @max 1
 * @decimals 2
 * @default 0.50
 *
 * @param DisplayLoss
 * @parent TotalFailure
 * @text Display the Lost Ingredients on Total Failure
 * @type boolean
 * @desc Show all lost items on complete crafting failure
 * @default true
 *
 * @param DefaultLossMessage
 * @parent DisplayLoss
 * @text Loss Window Message
 * @type text
 * @desc Default heading shown on the ingredient loss window
 * @default Ingredients were lost...
 *
 * @param CatLossMessages
 * @parent DisplayLoss
 * @text Category Specific Loss Messages
 * @type struct<CatLossMessages>[]
 * @desc Loss window headings specific to the current crafting category
 * @default ["{\"CategoryName\":\"Cooking\",\"LossText\":\"Ingredients were ruined...\"}","{\"CategoryName\":\"Blacksmithing\",\"LossText\":\"Materials were wasted...\"}","{\"CategoryName\":\"Alchemy\",\"LossText\":\"Reagents were tainted...\"}"]
 *
 * @param LossWindowTimer
 * @parent DisplayLoss
 * @text Loss Window Timer
 * @type number
 * @min 60
 * @desc How long (in frames) to show the loss window for
 * @default 120
 *
 * @param TotalFailureSE
 * @parent TotalFailure
 * @text Total Failure Sound Effect
 * @type struct<AudioObject>[]
 * @desc The sound effect played when a total failure occurs
 * @default ["{\"name\":\"Buzzer1\",\"volume\":\"90\",\"pitch\":\"100\",\"pan\":\"0\"}"]
 * 
 * @param TotalFailureText
 * @parent TotalFailure
 * @text Total Failure Message
 * @desc The default text shown in the result window when the ingredients chosen are not valid
 * @type text
 * @default Invalid combination...
 *
 * @param CategoryTotalFailureText
 * @parent TotalFailure
 * @text Category Specific Failure Text
 * @desc Specify total failure messages per crafting category
 * @type struct<TotalFailureMessages>[]
 * @default ["{\"CategoryName\":\"Cooking\",\"TotalFailureText\":\"You cannot cook that...\"}","{\"CategoryName\":\"Blacksmithing\",\"TotalFailureText\":\"The result is unusable...\"}","{\"CategoryName\":\"Alchemy\",\"TotalFailureText\":\"The concoction has no effect...\"}"]
 * 
 *
 * @param FailureChance
 * @text Failure Chance
 * @desc Can recipes fail even when they are valid?
 * @type boolean
 * @default true
 *
 * @param DefaultBaseFailureChance
 * @parent FailureChance
 * @text Default Base Success Chance
 * @desc The rate a which a recipe can fail
 * @default 0.85
 * @type number
 * @min 0
 * @max 1
 * @decimals 2
 *
 * @param ModifiedFailureChance
 * @text Modified Success Chance
 * @parent FailureChance
 * @desc Calculation to change the base success rate of crafting a valid recipe
 * @type note
 * @default "0.05 * (level - requiredlevel)"
 * 
 * @param SoftFailure
 * @text Soft Failure
 * @default Parameters for valid crafts that failed
 *
 * @param DefaultSoftFailureMessage
 * @parent SoftFailure
 * @text Default Soft Failure Message
 * @desc The message shown in the result window for when crafting has failed
 * @type text
 * @default Crafting failed...
 *
 * @param SoftFailureCase
 * @parent SoftFailure
 * @text Soft Failure Case
 * @desc What happens when the recipe is valid, but the craft fails due to the failure chance
 * @type select
 * @option No ingredients are lost
 * @value 0
 * @option Remove all ingredients
 * @value 1
 * @option Remove one of each ingredient
 * @value 2
 * @option Remove half of each ingredient
 * @value 3
 * @option Remove all ingredients with a % chance
 * @value 4
 * @option Remove one of all ingredients with a % chance
 * @value 5
 * @option Remove half of all ingredients with a % chance
 * @value 6
 * @option Remove all of each ingredient with a % chance
 * @value 7
 * @option Remove one of each ingredient with a % chance
 * @value 8
 * @option Remove half of each ingredient with a % chance
 * @value 9
 * @option Remove all of a random ingredient
 * @value 10
 * @option Remove one of a random ingredient
 * @value 11
 * @option Remove half of a random ingredient
 * @value 12
 * @option Remove all of a random ingredient with a % chance
 * @value 13
 * @option Remove one of a random ingredient with a % chance
 * @value 14
 * @option Remove half of a random ingredient with a % chance
 * @value 15
 * @default 2
 * 
 * @param SoftRemovalChance
 * @parent SoftFailure
 * @text Removal % Chance
 * @type number
 * @min 0
 * @max 1
 * @decimals 2
 * @default 0.50
 * @desc The chance that items are removed upon a soft crafting failure
 *
 * @param FailureItemChance
 * @text Failure item Drop %
 * @desc The chance that a failure item is received for the soft failed recipe (if it exists)
 * @parent SoftFailure
 * @type number
 * @min 0
 * @max 1
 * @decimals 2
 * @default 1.00
 *
 * @param DisplaySoftLoss
 * @text Display Lost Items
 * @desc Show all lost items on soft crafting failure
 * @parent SoftFailure
 * @type boolean
 * @default true
 * 
 * @param FakeSuccess
 * @text Fake Success on Failure item
 * @desc Crafting scene will present a failure item as if it were a successful craft
 * @parent SoftFailure
 * @type boolean
 * @default true
 *
 * @param RecipeList
 * @text Recipe List
 * @type struct<RecipeList>[]
 * @desc Result items, and their required ingredients.
 * @default []
 * 
 * @param AdditiveTraitsType
 * @text Additive Traits Mode
 * @desc How will additive traits be put on the result item?
 * @type select
 * @option Sum of all traits on all ingredients (default)
 * @option Traits on at least two ingredients (Skyrim-like)
 * @default Sum of all traits on all ingredients (default)
 * 
 * @param AdditiveItems
 * @text Additive Items
 * @desc Items in this list will transfer all traits on them to the result item if it is an independent item.
 * @type item[]
 * @default []
 *
 * @param AdditiveWeapons
 * @text Additive Weapons
 * @desc Weapons in this list will transfer all traits on them to the result item if it is an independent item.
 * @type weapon[]
 * @default []
 *
 * @param AdditiveArmors
 * @text Additive Armors
 * @desc Armors in this list will transfer all traits on them to the result item if it is an independent item.
 * @type armor[]
 * @default []
 * 
 * @help
 *
 * ============================================================================
 * Introduction:
 * ============================================================================
 *
 * This plugin provides the developer with a powerful and flexible ingredient
 * based item synthesis (hereby referred to as crafting) system. This is 
 * currently a 1:1 port of version 1.14 of my Crafting System plugin for RMMV,
 * with some additional changes to improve compatibility.
 *
 * Features:
 * -Ingredient focused crafting system. Players put ingredients into the slots
 *  in an attempt to make an item, they do not select known recipes from a list.
 * -Multiple crafting categories.
 * -Full crafting experience and leveling system
 * -Partial recipe matches
 * -Preview window shows known recipes that can be crafted with the selected
 *  ingredients.
 * -Call a specific crafting category via plugin command
 * -Access all categories from a menu command
 * -Hide specific categories from the main menu command, allowing them to only 
 *  be called via plugin command
 * -Provide failure case items for specific recipes
 * -Unlock recipes via plugin commands
 *
 * How it works:
 * Developers tag specific items with certain note tags to make them usable in
 * specific crafting categories. Then, recipes are made in the plugin manager
 * for the players to make.
 * A player who enters the crafting scene will select a crafting category from 
 * those available, and then begin choosing ingredients to craft with. When
 * two or more ingredients are selected, the craft button becomes active, and
 * the player can then craft an item. 
 * The preview window on the right side of the scene will show an item if the 
 * recipe for it is unlocked, and the ingredients in the list match to the recipe
 * exactly. If the recipe is invalid entirely, or not unlocked, it will show a 
 * blanked item instead. Next to this item, the success chance is also shown, 
 * if the recipe has already been unlocked. Below the item preview, the current 
 * crafting category experience and level are also shown.
 *
 * When a player selects to craft an item, a check is done to see if it matches 
 * any known recipes. If the items supplied do not identically match a valid 
 * recipe, it is checked for a partial recipe match. If no partial match is 
 * found, a total failure occurs, popping up a specific window stating that 
 * the recipe wasn't valid, and removing ingredients from the inventory. If the
 * items given match a recipe, a random roll is checked vs. the success chance 
 * of the recipe, if successful, the ingredients are taken from the player, 
 * and the result item is given. If the random check fails, a soft failure
 * occurs, stating that the crafting attempt failed, and removing ingredients
 * from the player. A soft failure can also provide a failure item, which can
 * also be presented to the player as if the craft was successful.
 *
 * When a craft attempt succeeds, the recipe is unlocked, allowing it to show
 * the resulting item in the preview window, as well as the success rate of
 * further attempts to craft it.
 *
 * Successfully crafting an item also provides experience for the crafting
 * category, which can also gain levels. Increasing crafting levels increases
 * the success rate of recipes as well.
 *
 * Recipes can also be unlocked via plugin command, allowing some items to
 * show on the preview window even without having made them before.
 *
 * Items can also be tagged to not be consumed on success or failure, allowing
 * for tools to be used as part of a recipe, but not remove them from the 
 * inventory, or to prevent rare materials from being consumed during a failed
 * crafting attempt.
 *
 * Additionally, the third and fourth ingredient slots can be locked and 
 * unlocked via  plugin command as well, allowing the developer to lock stronger
 * recipes behind these slots.
 *
 * Most of what has been described so far can be customized to the liking of the
 * developer as well. The preview window can be shut off, the lost items window
 * can be disabled, the crafting experience system can be turned off, and the 
 * variable success chance of crafting can be disabled as well. Partial recipe
 * matching can be completely disabled as well, which will prevent the system
 * from having a successful craft when extra ingredients are provided.
 *
 * It is also possible to customize what happens to ingredients lost during a
 * failed crafting attempt, when a total failure occurs, or when a soft failure
 * happens. Extra quantities can also be returned or not as well.
 *
 * Next, we will go over the plugin parameters in greater depth.
 *
 * ============================================================================
 * Plugin Parameter Descriptions:
 * ============================================================================
 * 
 * Allow Partial Matches:
 * -If this option is enabled, craft attempts where an extra item (or two) is
 *  provided by the player will succeed, as long as some of the provided 
 *  ingredients match a valid recipe.
 * -If this is disabled, all craft attempts must only contain required items for
 *  a valid recipe in order to succeed. 
 * -In either case, providing extra quantities of required items will still see
 *  the craft successful.
 *
 * Mode Select
 * -New in version 1.05
 * -Currently two modes are available, Default and DQ11.
 * -Changes the rules for allowing ingredients into the ingredient window.
 * -Default mode functions exactly the way that the plugin functioned before this 
 *  update.
 * -If DQ11 mode is selected, the player is allowed to put multiple copies of 
 *  the same item into the interface at once, but the quantity is limited to 1.
 *
 * Use Item Category Window
 * -When enabled, the crafting scene has a small window in which, after picking
 *  and ingredient slot, the player then selects an item category.
 * -If disabled, the itemlist window will take up all of the space on the bottom
 *  half of the scene, and will list all valid ingredients for the selected craft
 *  category, without filtering by item type, in the order of item -> weapon ->
 *  armor.
 *
 * Show In Menu:
 * -Sets whether the crafting scene can be seen in the menu command list by 
 *  default. This can be toggled with a plugin command.
 * 
 * Menu Command Text:
 * -The name for the command shown in the main menu to access the crafting 
 *  command.
 * 
 * Enable Menu Command:
 * -Sets whether the command in the menu is enabled or not by default. This can 
 *  be toggled via  plugin command.
 *
 * Category Menu Commands:
 * -Use a custom struct object to bind specific crafting categories to the main
 *  menu. 
 * -If you leave this at its default, no crafting categories will show as their
 *  own commands on the main menu.
 * -Each object you put in here must share the name of a crafting category.
 * -You can specify whether or not the command is enabled by default.
 * -If the crafting category is hidden, this command will also be hidden.
 * -Crafting commands that have their own menu bind will not show on the main 
 *  crafting category selection window.
 *
 * Return Extra Items:
 * -When enabled, any extra items given during a partial match are refunded to
 *  the player.
 * -If disabled, this option will see any erroneous ingredients provided removed 
 *  the players inventory, as if they were part of the recipe crafted.
 *
 * Take Excess Ingredients:
 * -When enabled, any extra quantities of ingredients provided that are not 
 *  needed for the crafted recipe are also taken from the inventory, as if they 
 *  were required in the successful recipe.
 *
 * Hidden Categories:
 * -The names of any categories you want to remain hidden from the main 
 *  crafting menu separated by spaces. These crafting categories will only be
 *  accessible via a specific plugin command instead. 
 *
 * Locked Ingredient Slots:
 * -Select which slots will be locked by default. Slots 1 and 2 cannot be 
 *  locked, as a valid craft attempt is required to have at least two 
 *  ingredients. Locked slots can be toggled using a plugin command.
 *
 * Use Crafting Levels:
 * -This options enables or disables the entire crafting experience system.
 * -This option cannot be toggled mid-game. When it is disabled, the experience
 *  and level information displayed on the preview window are hidden.
 * -Successfully crafting a recipe will not grant experience, nor can the player
 *  gain crafting levels.
 * -Any crafting success rate formulae that use the player's crafting level will
 *  not work.
 *
 * Maximum Level:
 * -The maximum crafting level that can be achieved. This setting applies to all
 *  crafting categories.
 * 
 * Max Level Text:
 * -This text shows over the experience bar when experience can no longer be 
 *  gained due to reaching max crafting level.
 *
 * Experience Curve:
 * -This code box is called as a function to determine how much experience is 
 *  required to gain a crafting level. The function is the same for all 
 *  crafting categories.
 * -'level' can be used in this calculation, and it is the player's current 
 *  level in the given category. Any other variables used must be declared 
 *  inside this code box, or the experience gauge will throw a crash error
 *  when it is drawn on screen.
 *
 * Experience Gain Calculation:
 * -This code box is evaluated as a function to determine how much crafting
 *  experience is given on a successful crafting attempt.
 * -'level' and 'requiredlevel' are used to reference the current crafting
 *  level and the required level of the successful crafted recipe. Any other
 *  variables used in this code box will need to be declared, or the system
 *  will throw a crash error when a recipe is successfully crafted.
 *
 * Allow Low Level Crafts:
 * -When enabled, a valid recipe can still be successfully crafted, even when
 *  the required crafting level is higher than the current crafting level. 
 * -If disabled, the crafting success chance of a recipe that has a higher 
 *  than current required crafting level is set to 0%, preventing it from 
 *  being successfully crafted.
 *
 * Show Crafting Level:
 * -When enabled, the experience and crafting level section is shown on the 
 *  preview window. This value updates in real time, moving the gauge when 
 *  experience is gained as well.
 * -When disabled, the current crafting experience, and level are not shown in 
 *  the scene at all.
 *
 * Level Up Common Events:
 * -When a crafting category levels up, you can specify a common event that 
 *  runs.
 * -This is category specific.
 * -You cannot set a different common event per level, but you can tell what
 *  the current crafting level of a category is by checking the following
 *  script: $gameParty._craftLevels["categorynamehere"]
 * -Replace 'categorynamehere' with the name of the desired category in lower 
 *  case.
 * -Use this parameter to award items, experience, money, cause a battle, or
 *  do just about anything else via plugin command when a craft category 
 *  levels up.
 * -Note because of the way common events work, this event only triggers when
 *  the player leaves the menu. Additionally, it could be possible to level up
 *  multiple times before leaving the menu scene, so it might be necessary
 *  to turn on game switches to track which rewards need to be given out.
 * -Note2 Only one common event can be reserved at a time without a plugin, so
 *  if the player levels up two categories between entering and exiting the 
 *  menu, both common events will not trigger.
 *
 * Eval Code Block:
 * -Located inside the common events parameter above.
 * -This code, unlike a common event, happens immediately upon leveling up.
 * -You can use this codeblock to call other functions, change variables,
 *  track quest objectives, immediately grant items, player experience, gold,
 *  or anything else you'd normally be able to do from a global scope.
 * -This happens every time the craft category levels, so you'll need to
 *  account for checking what the current craft level is during the codeblock
 *  in order to give out level specific rewards.
 *
 * Show Item Preview:
 * -When enabled, the preview window will show the expected result of a recipe
 *  for the selected ingredients. The item is only shown if the recipe is 
 *  unlocked, meaning the player will have had to have crafted it successfully
 *  at least once, or it will have had to have been unlocked via plugin command.
 * -This preview will never display the result of a partial recipe match, as 
 *  doing so could provide a player exploit to figuring out valid recipes.
 * -This display updates in real time, as a player changes quantities or 
 *  ingredients, this item will appear and disappear accordingly.
 *
 * Locked Item Text:
 * -This is the text that shows in place of the preview item when the ingredient
 *  list contains a valid recipe that hasn't been unlocked yet.
 *
 * Invalid Recipe Text:
 * -This is the text that shows in place of the preview item when the ingredient
 *  list does not match a valid recipe. This could be used as an easy way for a
 *  player to determine the difference between a valid and invalid crafting 
 *  attempt, so this message and the Locked Item Text should likely be the same.
 *
 * Invalid Combo Text:
 * -This text shows in place of the preview item when the player hasn't selected
 *  enough ingredients to attempt a craft (the button is still disabled).
 *
 * Show Craft Success Chance:
 * -When enabled, the success rate of a valid recipe is shown below the 
 *  preview item on the preview window. This is only shown if the recipe is
 *  unlocked.
 * -If disabled, the success rate is hidden from the player, and the heading text
 *  for it is also not drawn.
 * 
 * Use Success % Colors:
 * -When enabled, the success chance value will be color coded based on developer
 *  provided values in the below 7 color parameters.
 * -If disabled, the Success rate value will be the default text color.
 *
 * X% chance color:
 * -These colors are for specific success rate ranges, and are for the above 
 *  parameter. There are 7 steps, for 7 colors.
 *
 * Use Confirmation Window:
 * -When enabled, a small confirmation dialogue box will pop up when  the craft
 *  button is selected, allowing the player to reconsider the craft he is about
 *  to initiate.
 * -If disabled, hitting 'ok' on the craft button will immediately begin crafting,
 *  with no option to cancel.
 *
 * Confirmation Message:
 * -This message is shown in the help window when the confirmation dialogue box 
 *  is open.
 * 
 * Confirm/Cancel Button Name:
 * -The text shown for the confirm and cancel commands in the confirmation 
 *  dialogue window.
 *
 * Category Command Help Text:
 * -This text shows in the help window when the crafting category selection 
 *  window is open. 
 *
 * Locked Slot (Help)Text/IconID:
 * -These three parameters set how a locked slot is displayed in the interface.
 * -Help text is shown when a locked slot is selected.
 * -Text parameter is the name shown for a locked slot in the ingredient window.
 * -If no icon is chosen, a blank space will be used instead.
 *
 * Empty Slot (Help)Text/IconID:
 * -Same as above, but for an unlocked slot that contains no item.
 *
 * Craft Button Text:
 * -The default name for the craft button on the ingredient window.
 *
 * Craft Button Help Text (locked):
 * -The text shown in the help window when the craft button is selected, but it
 *  is not currently enabled.
 * -This text shows only if the player hasn't selected enough ingredients to 
 *  enable the craft button.
 *  
 * Craft Button Help Text (enabled):
 * -This help text is shown when the craft button is highlighted, and it is
 *  currently enabled.
 *
 * Category Specific Messages:
 * -Create category specific text for the three parameters above using a struct
 *  object. 
 * -Any categories that do not have specific messages set will use the default 
 *  ones. Any categories that are named, but do not contain specific messages 
 *  will be blank instead of showing the default text.
 * 
 * Use Level Up Message:
 * -If enabled, when enough crafting experience is gained to gain a level, a 
 *  message will be shown at the bottom of the crafting result window.
 * -If disabled, the only indication of a crafting level increase will be the 
 *  gauge in the preview window resetting to zero. If 'Show Crafting Level' is
 *  also disabled, there were be no indication at all of a crafting level up.
 * 
 * Default Level Up Message:
 * -The message shown when a level is gained in a category that does not have a 
 *  category specific message set.
 * -'%n' is a stand in for the Crafting category name.
 * -'%l' is a stand in for the new level attained.
 * -The first letter of this message will automatically be capitalized.
 * 
 * Level Up Sound Effect:
 * -A sound object that is played whenever a crafting level is gained. 
 * -The level up sound effect will play regardless of whether there is any text
 *  to show, but will not play if the level up message is turned off entirely.
 *
 * Category Level Up Messages:
 * -Create category specific level up messages using a custom struct object.
 * -Any categories that have a custom message will show it on the result window
 *  when a level up occurs. If a category has an object in this struct, but no 
 *  message, no message will be shown.
 *
 * Use Crafting Sound Effect:
 * -Enable this to play a sound effect during the progress bar phase of the result
 *  window.
 *
 * Repeat SE Times:
 * -This is how many times the sound effect will play on the bar. The higher
 *  this value, the more times it will play, and the shorter the interval between
 *  sound effects playing.
 * -If your sound effect is longer, higher play times may cause it to overlap 
 *  itself.
 * 
 * Default Crafting Sound:
 * -The sound effect that will play during the progress bar fill up for all 
 *  categories that do not have a category specific sound set.
 *
 * Category Crafting Sounds:
 * -Set category specific crafting sounds using a custom struct object.
 * -If a category is set, but has no sound set, no sound will play at all.
 *
 * Gauge Settings:
 * -Settings for the colors of the progress bar and experience gauge.
 * 
 * Craft Gauge Fill Time:
 * -The length of time in frames that the progress bar on the result window takes
 *  to reach 100%, after which the result will be displayed.
 *
 * Total Failure Case:
 * -Determines what happens to the ingredients provided when a total failure 
 *  occurs, meaning that the provided ingredients are not a valid recipe, or
 *  do not have sufficient quantities to be valid.
 * -Provided options allow for all or none of the ingredients to be taken, with
 *  a guaranteed or ranodm chance, as well as one, or half, of all or some, or 
 *  one random ingredient, with a random chance.
 * -Ingredients that are tagged as unconsumable cannot be removed on failure.
 * 
 * Removal % Chance:
 * -A float value between 0.00 and 1.00 that a random effect from above occurs.
 * -This value is used to determine if any of the above cases with a random 
 *  component happen, when either each item or all items are checked randomly.
 * -Use this value in conjunction with the Failure case parameter to randomly
 *  remove one or more items froma  failed crafting attempt.
 *
 * Display the Lost Ingredients:
 * -When enabled, a total failure will show another pop up window advising of 
 *  any lost ingredients. This window will not show if there was nothing lost.
 * 
 * Loss Window Message:
 * -The message shown in the header of the ingredient loss window. This message
 *  will show only if the current crafting category doesn't have a specific 
 *  message set.
 * 
 * Category Specific Loss Messages:
 * -Set custom loss window header messavges on a per category basis using a 
 *  custom struct object. Categories mentioned by name in here that do not
 *  have a message set will not show a message at all. The window will still
 *  open in this case.
 *
 * Loss Window Timer:
 * -The number of frames the item loss window stays open for. While this window
 *  is visible, the result window timer will not tick down, giving the player
 *  the opportunity to read both windows simultaneously.
 *
 * Total Failure Sound Effect:
 * -This sound object will play whenever a total failure occurs, meaning that an
 *  invalid combination of ingredients, or incorrect quantity of valid ingredients
 *  was provided.
 *
 * Total Failure Message:
 * -The default message shown in the craft result window when a total failure
 *  has occurred. This message shows whenever the current crafting category 
 *  doesn't have a a=category specific message set.
 *
 * Category Specific Failure Text:
 * -Set a custom message to be shown on the crafting result window for each
 *  specified craft category using a custom struct object. If a category is 
 *  named, but doesn't have text set, the message will be blank.
 *
 * Failure Chance:
 * -When enabled, crafting will have a chance of failure. 
 * -If disabled, all crafting attempts will succeed, as long as they are valid.
 *
 * Default Base Success Chance:
 * -A float value between 0 and 1 that indicates the chance for any recipe to 
 *  succeed as long as it doesn't have one specifically set.
 *
 * Modified Success Chance:
 * -This code box is evaluated as a function, and returns a float value between 
 *  0 and 1 that is added to the base success chance. 
 * -'level' and 'requiredlevel' are variables referencing the current crafting 
 *  level, and the required level of the selected recipe respectively.
 * -If you are not using crafting levels, any reference to 'level' will throw 
 *  an error whenever success chance is calculated.
 *
 * Soft Failure:
 * -A soft failure occurs whenever a valid crafting attempt fails the success 
 *  chance check.
 *
 * Soft Failure Case Type:
 * -Determine what happens to the ingredients when a soft failur occurs. The 
 *  listed options are the same as what happens on a total failure, allowing for
 *  none, one, half, or all of each, all or a random ingredient to be removed 
 *  either at a 100% chance, or at a given rate.
 * -This parameter allows you to have different return cases for the two failure
 *  types. Soft fails might consume all ingredients, while a total failure might
 *  be more forgiving to encourage experimentation by the player.
 *
 * Removal % Chance:
 * -This is the random chance that the failure case removes an item. This is only
 *  used if the case type is set to something that has a ranodm element.
 *
 * Failure Item Drop %:
 * -A float value between 0 and 1 that is used to determine if a failure case
 *  item is received when a soft failure occurs. 
 * -The default value of 1 means that if a soft failure occurs, and the 
 *  attempted recipe had a failure item, it will always give the failure item.
 * -A failure item is shown on the result window under the failure message by
 *  default.
 *
 * Display Lost Items:
 * -When enabled, any time an ingredient is lost during a craft attempt, a 
 *  new window pops up to displat the lost ingredients.
 * -NOTE: If an extra ingredient is taken due to a partial match it will also
 *  show in this window, even if it is the only item lost, and the craft was
 *  otherwise successful, the ingredient was still lost.
 * -If extra quantities are taken, they will be shown in the loss window as well,
 *  but if the craft was successful, and the extra quantities are the only items
 *  lost, the window will not be shown.
 *
 * Fake Success On Failure Item Creation:
 * -When enabled, any soft failure that results in a failure item being created 
 *  will present itself as a successful craft attempt, showing the success 
 *  message for the current category, and showing the failed item as if it were
 *  the intended result item.
 * -Experience is not given for a failure item.
 * -Ingredients are still removed from the player as if the result was a soft 
 *  failure.
 * -The lost ingredients are still shown in a loss window, if that option is 
 *  enabled.
 *
 * ============================================================================
 * Recipe Lists:
 * ============================================================================
 * 
 * The final plugin parameter is the recipe list. The recipe list is a 
 * complicated struct object, with smaller struct objects nested inside of it.
 * The first list of objects are for 'result items'. A developer will make a new
 * result item entry for each item that can be crafted in the system. If an item
 * can be made in multiple crafting categories, it will need two separate result
 * item entries.
 *
 * Name: 
 * -The name of this result item. This doesn't need to be the same as the item 
 *  created, and as it is one of the more easily seen parameters from the main
 *  window, it might be useful to give it a description you can easily discern 
 *  at a glance
 *
 * CraftType:
 * -A string that is used to determine which category this result item belongs to.
 * -On load, the plugin collects all CraftType entries from all result items and 
 *  uses them to form the list of all crafting categories.
 * -If you want one item to be made in multiple crafting categories, it needs a
 *  separate entry for each crafting category it should belong to.
 *
 * ResultType:
 * -Can be set to either item, armor or weapon.
 * -The engine will throw an error on load if a result item in the list doesn'tag
 *  have a valid ResultType set.
 *
 * ResultID:
 * -The database ID of the resulting item/armor/weapon.
 * -On load, the engine will pull from $dataItems/Weapons/Armors using this ID,
 *  If it isn't valid, the engine will throw an error and crash.
 *
 * Unlocked By Default:
 * -Set whether this item is unlocked by default or not.
 * -An unlocked item can be seen in the preview window of the crafting scene
 *  if the correct number of ingredients are placed into the slots by a player.
 * -Unlocked items will also show their expected success chance on that same 
 *  window, if enabled.
 *
 * Required Crafting Level:
 * -Set the required level of this recipe.
 * -If low level crafting is disabled, being below the required level will set
 *  the success chance of this recipe to 0%.
 * -The default craft experience formula relies on this number to calculate the
 *  experience gained on a successful craft, and will cause a crash if this 
 *  number is invalid.
 *
 * Run Once On Completion:
 * -This code block is eval'd at runtime, and runs once only, the first time
 *  the player successfully crafts this result item.
 * -You can use this to call another function, change a switch or variable, 
 *  or output something to the console.
 * -s[x] can be used to refer to a switch, and v[x] to a variable.
 * -resultItem refers to the base version of the item being created, it will
 *  not show additive effects added by being an independent item.
 *
 * Ingredients:
 * -This is the section where individual recipes are made. One result item 
 *  can have multiple different recipes that will all create the same item, so
 *  we use a struct list to create them.
 * -Each recipe object contains the following parameters:
 *
 * BaseSuccessChance:
 * -When left blank, the default success chance is used instead.
 * -The base chance for this recipe to succeed.
 *
 * ResultItemQuantity:
 * -The number of the result item returned when this recipe succeeds.
 * 
 * BaseItemType/ID
 * -These two objects describe the first ingredient, whether it is an item, 
 *  armor, or weapon, and which ID number it has in the database.
 * -Base item info is required for the recipe to succeed. If either of these 
 *  fields are not filled, an error will occur.
 * -Unlike the result items above, base items can also be set to a category.
 * 
 * BaseItemQuantity:
 * -The required number of the first item in this recipe.
 *
 * Category:
 * -Instead of a specific item, if the BaseItemType is set to category, the 
 *  recipe will match any item belonging to that category as the correct item.
 * -Items can belong to only one category. Categories are set via the note tag 
 *  <craftCat: x> on the item in the database.
 * -Example - You could have an item that requires some kind of meat as an 
 *  ingredient, but the specific type of meat isn't important. Tag all 'meat'
 *  items as the meat category, and then set the first ingredient to category 
 *  type, and the category parameter to meat. Any meat item provided will be 
 *  valid as long as it belongs to the meat category.
 * 
 * SecondItem:
 * -The params for the second item are the same as the first, allowing a 
 *  type, and ID to be set.
 *
 * Third and Fourth Items:
 * -The third and fourth slots have an extra type labeled 'none', but are 
 *  otherwise the same as the first and second items.
 * -Because a valid recipe needs to have at least two ingredients, only the 
 *  third and fourth items can be set to none.
 * -If you set a third or fourth item type to something other than none, but 
 *  leave the other fields blank, an error will be thrown.
 *
 * FailureItemCreation:
 * -Enables a filure case item, which is given when this recipe is attempted,
 *  but the success chance fails and a soft failure occurs.
 * -This item is given at a rate determined in the soft failure parameters, and
 *  is not customizable on a per recipe basis.
 * 
 * FailureItemType/ID:
 * -These parameters describe the item that is given as a failure item. If the 
 *  above parameter is true, but either of these are blank, an error will be 
 *  thrown on load.
 *
 * As mentioned above, because we attach recipes to a result item, one item can 
 * have multiple different methods to craft it, with different success rates, 
 * result quantities, ingredients, and failure items.
 * 
 * On load, this plugin takes the given information and attaches actual item
 * objects to these recipes, so if their type, or ID are not correctly set, an
 * error will be thrown before the title screen shows up, preventing the plugin
 * from loading.
 *
 * ============================================================================
 * About Category Ingredients:
 * ============================================================================
 * 
 * In the initial release of this plugin, recipes were only allowed to have one 
 * category ingredient in them. Version 1.02 has fixed this to allow the second 
 * through fourth items to be category type now, allowing you to make recipes
 * with multiple wildcard ingredients in them. There is one quirk about doing 
 * this that may come up in your recipes though.
 *
 * A recipe that needs a category ingredient, and also a specific ingredient 
 * that also belongs to that same category should list the specific ingredient
 * first in its ingredient list. Failure to do this may cause the recipe 
 * search to fail, as the logic checks the items in a recipe in the order they 
 * appear in the recipe list. 
 * 
 * Example: 
 * You have a recipe that requires 1x 'meat' and 1x 'raw beef'. If this recipe 
 * is designed so that the first ingredient is 'category - meat', and the second 
 * item is 'raw beef' specifically, if the player were to put the raw beef in 
 * the first ingredient slot, and then some other meat in the second slot, the 
 * craft would fail. This is because the logic would check for the category item 
 * first, and find the raw beef in the first slot, fulfilling the 'meat' 
 * requirement, but when it goes to check the second required item, it would 
 * find whatever second meat the player put in, not the raw beef required for 
 * the recipe. 
 * To correct this issue, make it so that any recipe that requires an 
 * ingredient that belongs to a category, as well as any ingredient from that 
 * category, lists the specific ingredient first.
 *
 * IE:
 * item1 -> raw beef x1
 * item2 -> category 'meat'
 *
 * This will ensure that the recipe check finds the specific item first, and 
 * checks for the meat category item after the specific meat has already been 
 * used.
 *
 * With this quirk in mind, it's best if you put your category ingredients last
 * in the ingredient list all the time. The default recipes in the plugin demo
 * were put in before multiple category ingredients were allowed though, so 
 * they are still set up with the category item in ingredient slot 1. This 
 * won't be an issue for those items specifically, though, as they do not 
 * require a category item as well as a specific item from that same category.
 *
 * Another thing to note is that if you create a recipe that requires multiple 
 * ingredients of the same category in different quantities, the higher 
 * quantity ingredient should be closer to the top of the list than the lower
 * quantity one.
 *
 * Example:
 * Meat salad requires 1x 'meat' + 2x 'meat'
 * If this recipe is written as above (ingredient 1 is 1x meat) the recipe will
 * not be detected successfully based on the id number of the ingredients.
 * Meaning if the player tries to make this recipe with 2x beef and 1x something
 * with a higher id than the beef item, the recipe will fail, as it will detect 
 * meat x1 as being fulfilled by 2x beefs first, and then won't see the second 
 * item as valid for the 2x meat requirement in the second ingredient slot.
 * To correct this, ensure that recipes that require multiple different category 
 * items always have the higher required quantity first in the list.
 *
 * IE:
 * item1 -> 2x 'meat'
 * item2 -> 1x 'meat'
 *
 * ============================================================================
 * Additive Ingredients:
 * ============================================================================
 *
 * Additive ingredients are specially selected items that, when used as an 
 * ingredient in a recipe that creates an independent item, pass on certain 
 * traits to that result item. You can use these additive ingredients to change 
 * the traits and parameters of a result item dynamically, without having to 
 * make several different versions of the result item, or recipe in your 
 * database.
 *
 * For example:
 * We have a sword recipe, that requires a metal, and a leather to make. The 
 * metal is a category item, and can be one of several different materials,
 * each one causes the sword to have different stats once crafted. A mythril 
 * bar might provide lower atk than an iron bar, but provide bonus agility, for
 * example.
 * Without using additive ingredients, you'd need a different sword weapon for
 * each type of metal used, to give them each different stats. In this case,
 * using the category ingredient in the recipe would cause a problem, as there
 * would be no way to differentiate a Mythril sword from an Iron sword, if they
 * both used the same recipe.
 *
 * When an item is crafted that contains additive ingredient(s), all of the
 * additive properties of all of the ingredients are added together, and then
 * applied to the result item at creation. 
 *
 * Additionally, if crafting items that are also additive ingredients, all
 * additive traits from the components used to make the ingredient are added
 * to the existing additive traits on the item.
 *
 * Lets explain this further using the salad item from the database as the 
 * example.
 * The default salad, like you'd buy in a shop or find in a treasure box grants
 * 25% hp restoration by default.
 * Without an additive trait on either the lettuce item, or the tomato item,
 * all salads will have the same 25% hp restoration effect.
 * If we put an additive trait on the lettuce item for 5% hp, this bonus is 
 * passed onto the salad. A crafted salad will restore 30% hp instead of 25%.
 * Now we make a new item, a full meal. It restores 25% hp as well, by default.
 * That full meal will be craftable as well, and requires a salad as one of the
 * ingredients. If we add an additive trait to the salad, to grant a bonus of 
 * 10% hp, the full meal, when crafted, will restore grant 35% hp (25% base + 10%
 * bonus from the salad). However, if that salad was crafted, it will have the 
 * 5% hp trait on it from the lettuce item it was crafted with, as well as the 
 * 10% bonus it inherently had. This means a full meal crafted with a crafted 
 * salad will grant 40% hp instead of 35%. This rewards the player for crafting
 * the individual ingredients for a recipe, when additive traits are involved,
 * rather than buying them.
 *
 * Using this, chains of ingredients can be made more powerful and make the end
 * result item much stronger.
 *
 * ============================================================================
 * Note Tags:
 * ============================================================================
 *
 * The following note tags can be set on items, weapons, or armor in the database:
 *
 * <CraftCat: x>
 * -Sets an ingredient as belonging to a category.
 * -An item can only belong to one category.
 * -When a rcipe containing a category item is checked, any items that belong to
 *  that category will return as valid.
 *
 * <ValidCats: x, y, ...>
 * -This item will show up in the ingredient list when in the selected crafting 
 *  category.
 * -separate each category name with a comma and a space in between.
 * -If this tag is not set on an item, it will not show up in the crafting 
 *  interface at all, and cannot be used in recipes, even if it belongs to one.
 * -Use this tag to prevtn unusable items from showing up in crafting categories
 *  in which they cannot be used (eg cooking ingredients in the blacksmith scene).
 *
 * <Unconsumable: Fail>/<Unconsumable: Success>/<Unconsumable: Fail, Success>
 * -Items with this tag will not be removed from the inventory during crafting
 *  failure, success, or both.
 * -Use this to prevent rare materials from being removed on a crafting failure,
 *  or to allow crafting tools to be used in recipes, but not be removed on 
 *  success.
 *
 * ============================================================================
 * Additive Ingredients Notetags:
 * ============================================================================
 * 
 * There are two settings in the plugin parameters for how additive ingredient 
 * traits are passed to the result item:
 * 
 * 'Sum of all traits on all ingredients (default)'
 * -All traits on all ingredients are added to the result item on creation.
 * 'Traits on at least two ingredients (Skyrim-like)'
 * -Mimicking the Skyrim system, if any two ingredients share a trait, it ends
 *  up on the result item. Traits that are not shared between at least two of
 *  the ingredients are lost. This does not apply to traits that change the name
 *  of the result item via prefix or suffix change.
 *
 * <Additive Item Traits>
 * trait1
 * trait2
 * </Additive Item Traits>
 * 
 * Inside the note tag we have several different lines which can be used to 
 * provide traits.
 * 
 * THE FOLLOWING TAGS WORK ONLY WHEN THE RESULT ITEM IS A WEAPON OR ARMOR:
 *
 * PARAMCHANGE: paramname value
 * -Adds value of paramname to the result item on creation
 * -Can be negative
 * -paramname is the short code for the param (mhp,mmp,atk,def,mat,mdf,agi,luk)
 *
 * PARAMRATE: paramname floatvalue
 * -Adds a trait to the item to increase paramname by floatvalue
 * -A trait for atk 1.05 will cause the actor to gain 5% atk value
 * -A floatvalue below 1 will cause a penalty
 * -The bonus is applied to the actor equipping the item, not the item itself.
 *
 * XPARAMMOD: xparamname floatvalue
 * -This tag increases the value of xparamname on the item by floatvalue
 * -xparamname is the shortcode for the desired xparam (hit,cri,eva... etc)
 * -Can be negative
 *
 * SPARAMMOD: sparamname floatvalue
 * -This tag adds a trait to the item to change sparamname to 1+ floatvalue
 * -sparamname is the shortcode for the desired sparam (exr, pha, tgr... etc) 
 * -Can be negative
 * -These traits stack additively, two items granting 5% will grant 10% together
 * 
 * ADDATTACKELEMENT: elementId
 * -Adds a trait to the item to cause attacks to gain element elementId
 * 
 * REMOVEATTACKELEMENT: elementId
 * -Removes all traits on the item that add attack element elementId to it.
 * -This check is performed after all addelement tags have been processed.
 *
 * ADDATTACKSTATE: stateId rate
 * -Adds a trait to the result item that causes attacks to add a state with Id
 *  stateId to the target at rate. 
 * -Rate can be a float value or a whole number. If it is a whole number it will
 *  be divided by 100 to get a float value.
 * 
 * REMOVEATTACKSTATE: stateId
 * -Removes all traits on an item that add state stateId with attacks.
 * -This check is performed after the addattackstate tag, so it can remove the 
 *  states added by that tag as well.
 *
 * ADD SKILL: skillId
 * -Adds a trait to the result item that adds the skill with Id skillId to the 
 *  item.
 * 
 * REMOVE SKILL: skillId
 * -Removes all traits from the item that taught skill Id skillId to the wearer.
 * -This tag has no effect on items that didn't teach the skill.
 * -This check is made after the add skill tag, they will cancel eachother out.
 *
 * SEAL SKILL: skillId
 * -Adds a trait to the result item that locks skill Id skillId, preventing 
 *  actors wearing this item from using it.
 * 
 * UNSEAL SKILL: skillId
 * -Removes all traits from the result item that sealed skill Id skillId, 
 *  allowing actors wearing the item to use that skill again.
 * -Has no effect if the item did not have a trait that sealed that skill.
 * -This check is made after the seal skill tag, they will cancel eachother out.
 *
 * ADD STYPE: stypeId
 * -Adds a trait to the result item that adds skilltype stypeId to the list
 *  of actor commands. 
 * 
 * REMOVE STYPE: stypeId
 * -Removes all traits from the item that granted skilltype stypeId to the 
 *  wearer. 
 * -This tag has no effect on items that didn't unlock the skilltype
 * -This check is made after the add stype tag, they will cancel eachother out.
 *
 * SEAL STYPE: stypeId
 * -Adds a trait to the result item that locks skilltype stypeId, preventing 
 *  actors who are wearing it from using that skilltype.
 * 
 * UNSEAL STYPE: stypeId
 * -Removes all traits from the result item that sealed skilltype stypeId,
 *  allowing actors with access to that stypeId to use it again.
 * -Has no effect if the item did not have a trait that sealed that skilltype.
 * -This check is made after the seal stype tag, they will cancel eachother out.
 *
 * ADDSTATEIMMUNITY: stateId
 * -Adds a trait to the result item that makes the wearer immune to state with
 *  id StateId.
 * 
 * REMOVESTATEIMMUNITY: stateId
 * -Removes all traits on the result item that make the wearer immune to the
 *  state with Id stateId.
 * -Has no effect on items that did not provide immunity to that state.
 * -Is applied after the addstateimmunity tag, so it will remove state 
 *  immunity added by that tag.
 * 
 * CHANGESTATERESISTANCE: stateId value
 * -Adds a trait to the result item that modifies the state rate for the state
 *  with Id stateId to value.
 * -Value can be a whole number or a float value. Whole numbers will be divided
 *  by 100 to get a float value.
 * -Multiple sources of this trait stack multiplicatively.
 * -An actor whose state rate is above 1.0 will be afflicted with the state
 *  more often than an actor with a state rate below 1.0.
 *
 * CHANGEELEMENTALRESISTANCE: elementId value
 * -Adds a trait to the result item that sets the element rate for the element
 *  with element Id elementId to value.
 * -ElementId is the position of the element on the list of elements in the 
 *  types tab of your database.
 * -Value can be a float, or a whole number. Whole numbers will be divided by
 *  100 to get a float value.
 * -Multiple sources of this trait stack multiplicatively.
 * -Actors who have values of element rate below 1.0 will take less damage
 *  from that element when they are hit by it.
 *
 * THE FOLLOWING TAGS WORK ONLY WHEN THE RESULT ITEM IS AN ITEM:
 *
 * CHANGE ITEM ELEMENT: elementId
 * -Sets the element of the on-use effect to elementId
 * -Only has an effect on an item that has a damage formula.
 * -Items cannot have more than one element.
 *
 * RESET ITEM ELEMENT
 * -Resets the element of the on-use effect to its default value.
 * -Only has an effect on an item that has a damage formula.
 *
 * CHANGE HP RECOVERY: float flatvalue
 * -Adds an hp recovery effect to the item for float% + flatvalue
 * -Both float and flatvalue can be negative
 * -If an effect of this type is already on the result item, the value given on
 *  this tag will be added to the effect on the base item. The float value will
 *  not exceed 100% in this case.
 *
 * CHANGE MP RECOVERY: float flatvalue
 * -Adds an mp recovery effect to the item for float% + flatvalue
 * -Both float and flatvalue can be negative 
 * -If an effect of this type is already on the result item, the value given on
 *  this tag will be added to the effect on the base item. The float value will
 *  not exceed 100% in this case.
 *
 * GAIN TP: value
 * -Adds an effect to the result item that gives an amount of tp to the target 
 *  of the item equal to value.
 * -This number cannot be negative.
 * -If an effect of this type already exists on the result item, this value is
 *  added to its effect.
 *
 * ADD STATE: stateId
 * -Adds an effect to inflict state stateId on the target of the item.
 *
 * REMOVE ADD STATE: stateId
 * -Removes all effects on the item that add a state to the target with Id
 *  stateId.
 * -This tag is checked after any effects are added to it, so it will 
 *  cancel out any add state tags that added the same state Id.
 *
 * CURE STATE: stateId
 * -Adds an effect to remove state stateId from the target of the item.
 *
 * REMOVE CURE STATE: stateId
 * -Removes all effects on the item that cured a state with Id stateId
 *  on the target.
 * -This tag is checked after any effects are added, so it will cancel 
 *  out any cure state effects that were added with the same stateId.
 *
 * LEARN SKILL: skillId
 * -Adds an effect to the result item that will teach a skill with Id skillId
 *  to the target of the item.
 * -Note that this does not make the actor able to use the skilltype of the 
 *  skill taught, if he doesn't already know it.
 * -Learning a skill via item is permanent.
 *
 * CLEAR LEARN SKILL
 * -Removes all effects on the result item that taught a skill to the user.
 * -Note that this does not make an actor forget a skill, it only removes the
 *  ability to learn a skill by using the result item.
 *
 * ADD BUFF: paramname turns
 * -Adds an effect that adds a buff to paramname for a number of turns equal to 
 *  turns.
 * -Paramname is the shortcode for the parameter (atk,mhp, ... etc).
 * -If an effect like this already exists on the result item, this one will 
 *  overwrite it, even if it has a shorter duration.
 *
 * REMOVE BUFF: paramname
 * -Adds an effect to an item that removes a buff for paramname from the target
 * -Paramname is the shortcode for the parameter (atk,mhp, ... etc).
 *
 * CLEAR BUFF: paramname
 * -Removes all effects on the result item that provide a buff to paramname.
 * -Has no effect if the item does not provide a buff for paramname
 * -Paramname is the shortcode for the parameter (atk,mhp, ... etc).
 * -Is checked after the tag that adds buffs, so it will remove them as well.
 *
 * ADD DEBUFF: paramname turns
 * -Adds an effect that adds a debuff to paramname for a number of turns equal to 
 *  turns.
 * -Paramname is the shortcode for the parameter (atk,mhp, ... etc).
 * -If an effect like this already exists on the result item, this one will 
 *  overwrite it, even if it has a shorter duration.
 *
 * REMOVE DEBUFF: paramname
 * -Adds an effect to an item that removes a debuff for paramname from the target
 * -Paramname is the shortcode for the parameter (atk,mhp, ... etc).
 *
 * CLEAR DEBUFF: paramname
 * -Removes all effects on the result item that provide a debuff to paramname.
 * -Has no effect on items that do not have a debuff for paramname.
 * -Paramname is the shortcode for the parameter (atk,mhp, ... etc).
 * -Is checked after the tag that adds debuffs, so it will remove any that have
 *  been added by other ingredients.
 *
 * GROW paramname: value
 * -Adds an effect to the result item that increases paramname of the imbiber by
 *  value.
 * -Value cannot be negative.
 * -Paramname is the shortcode for the parameter (atk,mhp, ... etc).
 * -Parameters added in this way are permanent.
 *
 * CLEAR GROW: paramname
 * -Removes all effects on the result item that increase paramname on the 
 *  target.
 * -Paramname is the shortcode for the parameter (atk,mhp, ... etc).
 *
 * THE FOLLOWING TAGS WORK ON ALL (INDEPENDENT) RESULT ITEMS:
 *
 * NAME: prefix STRING
 * -Adds STRING to the name of the result item as a prefix
 * -Adds a space to the end of the string to connect it to the item's name
 * -The string is taken as is, with capitals or not.
 *
 * NAME: suffix STRING
 * -Adds STRING to the end of the name of the item, as a suffix.
 * -Also inserts a leading space.
 * -The string is taken as is, with capitals or not.
 *
 * SETANIMATION: animationId
 * -Sets the battle animation of the result item to animationId.
 * -Has no effect on armors, as they have no animation to display.
 *
 * RESETANIMATION
 * -Resets the battle animation of the result item to the animation Id of the 
 *  base item.
 * -This tag is checked after any tags that change the battle animation of the
 *  base item, causing them to have no effect.
 * 
 *
 * ============================================================================
 * Plugin Commands:
 * ============================================================================
 *
 * This plugin provides the following plugin commands:
 *
 * Call Crafting CATEGORYNAME
 * -Calls the crafting scene, with the given crafting category preselected.
 * -When the scene is called in this way, the initial category selection window
 *  is not shown, and backing out of the ingredient window will close the scene,
 *  instead of allowing the player to reselect a different category.
 * -If CATEGORYNAME is left blank, the main category selection window will be 
 *  shown, as if the player had selected the crafting command from the main 
 *  menu.
 * 
 * Unlock Recipe
 * -Sets the given recipes to be unlocked. 
 * -The arguments for this command are a list of numbers. The numbers 
 *  correspond to the result item list in the plugin parameters. Recipe 0 is 
 *  the first item on this list, despite the list starting at index 1 for some 
 *  reason.
 *
 * Lock Recipe
 * -Sets the given recipes to be locked. 
 * -The arguments for this command are a list of numbers. The numbers 
 *  correspond to the result item list in the plugin parameters. Recipe 0 is 
 *  the first item on this list, despite the list starting at index 1 for some 
 *  reason.
 * -Note that locking a recipe does not disable it, it only prevents it from 
 *  showing on the preview window.
 * 
 * Disable Recipe
 * -Disables the selected recipes, preventing them from being crafted
 * -The arguments for this command are a list of numbers. The numbers 
 *  correspond to the result item list in the plugin parameters. Recipe 0 is 
 *  the first item on this list, despite the list starting at index 1 for some 
 *  reason.
 * -A disabled recipe will return a total failure, unless the recipe also
 *  contains a partial match inside of it that is met by the ingredients
 *  provided.
 *
 * Enable Recipe
 * -Enables a recipe, allowing it to be crafted. This is the reverse of 
 *  disabling it.
 * -Use these two commands to prevent players from crafting important
 *  items before they should be able to, by having previous knowledge
 *  of the ingredients.
 *
 * Toggle Locked Slot
 * -Locks or unlocks crafting slot 3 or 4. Will lock the slot if it is unlocked,
 *  or unlock the slot if it is currently locked. 
 * -It is possible to unlock the fourth slot while the third slot is still
 *  locked. Players will be unable to use the fourth slot if the third slot
 *  is still locked, as putting an item in that slot requires there to be 
 *  an item in the third slot.
 *
 * Change Craft Enable
 * -Allows menu access to the crafting scene.
 * 
 * DisableCraftScene
 * -Disables menu access to the crafting scene.
 * 
 * Change Craft Show
 * -Shows or hides the menu command to access the crafting scene in the menu.
 *
 * Change Category Show
 * -Show or hide a specific crafting category from the category select window
 *  or from the main menu if it is bound there.
 *
 * Change Category Enable
 * -Enable or disable a specific crafting category on the category selection
 *  window. This will also affect that category on the main menu if it is 
 *  bound there.
 *
 * ============================================================================
 * Binding The Menu to VisuStella Main Menu Plugin:
 * ============================================================================
 * 
 * The menu scene can be binded specifically to a slot in the VS_MainMenuCore
 * plugin via the following parameters:
 *
 * Symbol:		 	craft
 * JS Text: 		return Ramza.CSParams.MenuString;
 * JS Show: 		return $gameSystem._craftingShow
 * JS Enable: 		return $gameSystem._craftingEnabled;
 * JS Run Code: 	SceneManager._scene.commandCrafting();
 *
 * Additionally you can bind any individual crafting category to the main menu
 * in the same way with the following settings:
 *
 * Symbol:		 	blacksmithing
 * STR Text: 		Blacksmithing
 * JS Show: 		return !$gameParty._hiddenCategories['blacksmithing'];
 * JS Enable: 		return !$gameParty._disabledCategories['blacksmithing'];
 * JS Run Code: 	SceneManager._scene.commandSpecificCrafting();
 * 
 * Note that for this to work, the symbol needs to be all lowercase, and it is 
 * the name of the crafting category, hence blacksmithing as the example here.
 *
 * ============================================================================
 * Backing up the Recipe List:
 * ============================================================================
 * 
 * The RMMV version of this plugin contained some functions that could be used 
 * to backup and restore the recipe list. The way that these functions worked
 * is not possible in RMMZ, as the engine detects when a core file (in this
 * case the plugin.js file) has been modified and forces the user to reload.
 *
 * In the RMMZ version of the plugin, in order to backup your recipes, simply
 * copy the crafting system plugin entry in your plugin manager, and paste it
 * in a different slot, then disable the copy.
 *
 * If you try to run two instances of this plugin at the same time, it will 
 * cause errors.
 *
 * ============================================================================
 * Terms of Use:
 * ============================================================================
 *
 * -This plugin may be used in commercial or non-commercial projects. With 
 *  credit to me, Ramza.
 * -Purchase of this plugin allows you to use it in as many projects as you 
 *  want.
 * -You may modify this plugin directly, for personal use only.
 * -Sharing this plugin, direct edits to it, or any demo projects that come 
 *  with it is prohibited. 
 * -You may share edits to this plugin as extensions to this one. Extensions 
 *  require the base plugin to function.
 * -You can choose to sell extensions to this plugin for profit, crowdfunding, 
 *  donations, etc, as long as the extension requires this base plugin to 
 *  function. 
 * -Do not modify the header of the plugin file, and do not claim ownership of 
 *  the plugin in your own projects.
 *
 * ============================================================================
 * Change Log:
 * ============================================================================
 * Version 1.12:
 * -(revision a) Corrected a further issue where the list window would draw over
 *  the key info window if it were drawn at the bottom of the screen (due to 
 *  having hidden the touch UI buttons)
 * -Corrected an issue where the item list window would be invisible if you'd
 *  set the help window to show at the top of the screen via the VisuMZ_Core
 *  plugin.
 * Version 1.11:
 * -Corrected an issue where when using VSCore, and using a UI area height 
 *  setting that caused the button assist window to draw on the bottom of the
 *  screen, the ingredient list window would draw over top of part of the 
 *  help window at the bottom of the screen.
 * -Corrected a crash error when a preview item was being drawn on the craft
 *  preview window.
 * Version 1.10:
 * -(revision a) Corrected an issue where the enumerable property accidentally
 *  added to the array prototype was still being used in this version of the
 *  plugin, despite the changelog below stating it was fixed.
 * -This plugin has been changed to require a core plugin to function. The core 
 *  plugin is currently labeled as version 1.00, but is actually running the 
 *  code from version 1.29 of the MV version of the Crafting System plugin.
 * -Below are the changes made between the last release of this plugin, and the
 *  current version of the core plugin:
 * -Corrected an issue where armors that did not belong to the first available
 *  etypeId in your database could not be chosen as ingredients, even if they
 *  were tagged correctly to appear in that category scene. This only happened
 *  if using YEP_ItemCore.
 * -Added three new plugin commands; LockRecipe, DisableRecipe, and EnableRecipe.
 *  Locking a recipe is the reverse of unlocking it, causing it to no longer be
 *  shown in the preview window, or in the recipe list extension, if you have 
 *  that, as if it had never been unlocked in the first place.
 *  Disabling a recipe will prevent it from being created at all, even if the 
 *  correct ingredients are provided. You can use this to create tutorial 
 *  recipes, or recipes that need to be crafted for quests, but need never be 
 *  made again afterward. Enabling a recipe will allow a disabled recipe to be
 *  created again.
 * -Changed the way the modified success chance plugin parameter is parsed. The
 *  original way did not allow much flexibility in the way that it calculated
 *  the value, now you can use a return statement to conditionally return a 
 *  value instead of using simple math.
 * -Set the default recipe list value as [] instead of being blank.
 *  This will correct an error where the plugin will fail to load if you haven't
 *  setup any recipes in the parameters, like if for example, you just import 
 *  it and leave everything at the default values and load your project to test
 *  if it's working.
 * -Fixed an issue where the plugin could crash on load when trying to load a
 *  recipe that had the third or fourth ingredient types deleted instead of 
 *  being set to None.
 * -Corrected an issue that caused a crash error when attempting to craft a 
 *  recipe whose only ingredients were category ingredients, and that had
 *  only 2 or 3 ingredients in it.
 * -Corrected a compatibility issue where this plugin was adding an enumerable
 *  property to every array object in an entire project, which could cause 
 *  major compatibility problems with other plugins that do not expect default 
 *  object prototypes to have extra enmuerable properties on them.
 * -Corrected an issue where if you had all crafting categories 
 *  except one set to be hidden in the plugin parameters, and then called a 
 *  a specific category via plugin command, that the scene would incorrectly 
 *  call the unhidden crafting category instead of the one called via plugin 
 *  command.
 * -Replaces all instances of 'this.parent.parent' with 'SceneManager._scene'
 *  This will have no effect on the actual function of the plugin, but improves 
 *  compatibility with plugins that modify the window layer, and corrects a 
 *  crash error I wasn't able to duplicate, but suspect was related to changes
 *  to the way that windows are drawn.
 * -Corrected an issue where using skyrim-like additive traits mode, and having
 *  additive ingredients that were not independent caused one of the ingredients
 *  in a recipe to unexpectedly gain all of the combined traits of the other 
 *  ingredients in that recipe. This the traits on the result item to increase
 *  exponentially when crafting the same item several times.
 * -Corrected an issue with the hpRecovery and mpRecovery additive ingredient
 *  traits where the values were being added together incorrectly.
 * -Corrected an issue where when using Skyrim-Like Additive traits mode, the 
 *  logic used to combine multiple traits of the same type was incorrect, 
 *  causing unexpected values due to the combining being done multiple times.
 * -Canceling out of the item list window when the item category window is not
 *  being used will now clear the contents of the item list window.
 * Version 1.09:
 * -(revision a)Corrected an issue where the player would be given duplicates of
 *  the actors' starting equipment when starting a new game.
 * -(revision a)Corrected an issue with the below fix where when crafting a
 *  recipe with a requirement of multiple independent ingredients, the specific 
 *  item chosen from the itemlist window would provide it's additive ingredient
 *  traits to the result, but would not be removed from the inventory if the 
 *  player owned more of those items that the recipe required, and this one had
 *  the lowest itemId.
 * -Corrected an issue where when using ItemCore removing more than one
 *  independent ingredient from the player inventory via event would only remove 
 *  one of the items from the inventory.
 * Version 1.08:
 * -Added a plugin parameter to reserve a common event when a crafting category 
 *  levels up.
 * -Added a plugin parameter to call a code block on a crafting category level 
 *  up. This runs on every level up, and happens immediately, before the common
 *  event is run.
 * Version 1.07:
  * -The soft failure message can now be customized in the same way that the 
 *  progress and success text can be, with both a default value and a category
 *  specific one.
 * -Added a parameter in the recipe list to allow something to run once when a
 *  result item is crafted for the first time. This codeblock is run the first
 *  time the item is crafted, and can be used to turn on switches, or any number
 *  of other things.
 * Version 1.06:
 * -(revision a) Corrected an issue with the below DQ11 mode fix that caused a
 *  crash error in some cases when the ingredients provided were not provided 
 *  in the same order they are listed on the recipe's ingredient list.
 * -Corrected an issue with DQ11 mode where recipes that required multiple of 
 *  the same ingredient only removed one of them from the inventory on success.
 * -Added new plugin parameters to allow more strings on the crafting scene
 *  to be customized.
 *  The 'clear' command from the item category window
 *  The help text for that clear command
 *  The help text shown when selecting an ingredient category
 *  The Result and Quantity text in the crafting preview window
 *  The 'Success Rate:' text at the bottom of the preview window.
 * -Added the ability to customize the text that displays in the crafting 
 *  progress window, as well as the craft success window based on the current
 *  crafting category.
 * Version 1.05:
 * -Added a Craft Mode plugin parameter, which allows for the system to be 
 *  made more like the crafting system in DQ11 - allowing the same ingredient 
 *  to be put into different slots, and limiting each slot to only one of each 
 *  item.
 * Version 1.04:
 * -You are no longer able to make recipes from one category from within another
 *  category. Previous to this change, the only thing stopping the player from
 *  creating cooking items in the blacksmithing category was to lock cooking 
 *  ingredients into not being able to be used in blacksmithing. If you had 
 *  ingredients that belonged to multiple categories, it was possible to create
 *  recipes that belonged to another category. Now a recipe will not be craftable 
 *  unless it belongs to the category that is currently selected.
 * Version 1.03:
 * -Entering the crafting scene via plugin command to a specific category, or 
 *  via a specific category command bound to the menu will no longer cause a 
 *  crash.
 * Version 1.02:
 * -(revision a) Added additional information to the category ingredients 
 *  section regarding recipes that require different quantities of multiple
 *  ingredients with the same ingredient category.
 * -Recipes can now, once again, contain multiple wildcard category items. And 
 *  this time, they actually work!
 * -Updated the plugin command section of the help documentation to show the 
 *  MZ plugin command info that was already available in the demo from the info
 *  dump npc, as well as on the store page. (whoops)
 * -Added some info to the plugin documentation regarding category ingredients.
 * Version 1.01:
 * -Fixed an issue where if hiding the item category window, the ingredient list
 *  window would still show dark outlines for all of the items that are no 
 *  longer visible once an item had been selected.
 * -Canceling out of the ingredient list window will now erase its contents 
 *  when using the option of hiding the item category window.
 * -Added a plugin parameter to set how long the crafting success window is 
 *  shown for, this works just like the timer for the loss window. This was 
 *  previously hardcoded at 90 frames.
 * -Pressing the 'ok' or 'cancel' buttons when the result window, or the loss
 *  window is popped will now cause those windows to close in 5 frames, 
 *  allowing the player to force the window closed.
 * -The button assist window displayed by the VS CoreEngine plugin now shows 
 *  keybind information for the left and right arrow keys when an ingredient 
 *  slot with an item in it is currently selected.
 * -Added a plugin parameter to customize the binding text shown on the above 
 *  window
 * Version 1.00:
 * -Initial release
 *
 * end of helpfile
 *
 * @command Call Crafting
 * @desc Calls a crafting scene.
 * 
 * @arg CraftingCategory
 * @text Crafting Category
 * @type combo
 * @option Blacksmithing
 * @option Cooking
 * @option Alchemy
 * @desc Which category to call?
 *
 * @command Unlock Recipe
 * @desc Unlock one or more recipes
 * @arg Recipes
 * @type number[]
 * @min 0
 * @desc Which recipe(s) to unlock?
 *
 * @command Lock Recipe
 * @desc Lock one or more recipes
 * @arg Recipes
 * @type number[]
 * @min 0
 * @desc Which recipe(s) to lock?
 *
 * @command Disable Recipe
 * @desc Disable one or more recipes
 * @arg Recipes
 * @type number[]
 * @min 0
 * @desc Which recipe(s) to disable?
 *
 * @command Enable Recipe
 * @desc Enable one or more recipes
 * @arg Recipes
 * @type number[]
 * @min 0
 * @desc Which recipe(s) to enable?
 *
 * @command Toggle Locked Slot
 * @desc Lock or unlock a crafting slot.
 * @arg SlotId
 * @text Slot Id
 * @type number
 * @min 3
 * @max 4
 *
 * @command Change Craft Enable
 * @desc Enable or disable menu access to the crafting scene.
 *
 * @arg state
 * @text State
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 * @desc Enable or disable access?
 * 
 * @command Change Craft Show
 * @desc Hide or show the crafting command on the main menu.
 *
 * @arg state
 * @text State
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 * @desc Show or hide?
 *
 * @command Change Category Show
 * @desc Show or hide a specific category from the menu and/or the category window
 * 
 * @arg category
 * @text Category
 * @type combo
 * @option Blacksmithing
 * @option Cooking
 * @option Alchemy
 * @desc Which category to change?
 * 
 * @arg state
 * @text State
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 * @desc Show or hide this category?
 *
 * @command Change Category Enable
 * @desc Enable or disable a specific category from the menu and/or the category window
 * 
 * @arg category
 * @text Category
 * @type combo
 * @option Blacksmithing
 * @option Cooking
 * @option Alchemy
 * @desc Which category to change?
 * 
 * @arg state
 * @text State
 * @type select
 * @option enable
 * @option disable
 * @option toggle
 * @default toggle
 * @desc Enable, disable, or toggle this category?
 * */
 /*~struct~RecipeList:
 * @param Name
 * @type text
 * @param CraftType
 * @type combo
 * @option Cooking
 * @option Blacksmithing
 * @option Alchemy
 * @param ResultType
 * @type select
 * @option Item
 * @option Weapon
 * @option Armor
 * @param ResultID
 * @type number
 * @min 1
 * @param Ingredients
 * @type struct<Ingredients>[]
 * @param Unlocked
 * @text Unlocked by Default
 * @type boolean
 * @default false
 * @param CraftingLevelRequired
 * @text Required Crafting Level
 * @type number
 * @default 1
 * @param CraftingCompleteRunOnce
 * @text Run Once on Completion
 * @type note
 * @desc This codeblock runs the first time this item is crafted.
 * s[x] = switches v[x] = variables
 * 
 */
 /*~struct~TotalFailureMessages:
 * @param CategoryName
 * @text Category Name
 * @type Text
 * @desc Name of the crafting category
 * 
 * @param TotalFailureText
 * @text Total Failure Text
 * @type text
 * @desc Failure message for this category
 */
 /*~struct~catCommonEvents:
 * @param CategoryName
 * @text Category Name
 * @type Text
 * @desc Name of the crafting category
 * 
 * @param CommonEventId
 * @text Common Event Id
 * @type number
 * @min 1
 * @desc The common event to play on level up for this category
 * 
 * @param ImmediateCode
 * @text Eval Code Block
 * @desc This code is eval'd at level up, and happens immediately, before the common event is called.
 * @type note
 * @default 
 */
 /*~struct~MenuCategories:
 * @param Category
 * @type text
 * @param Enabled
 * @type Boolean
 * @default true
 * 
 */
  /*~struct~CatLevelUps:
 * @param CategoryName
 * @text Category Name
 * @type Text
 * @desc Name of the crafting category
 * 
 * @param LevelUpText
 * @text Level Up Text
 * @type text
 * @desc Text to show for a level up in this category
 */
 /*~struct~CatLossMessages:
 * @param CategoryName
 * @text Category Name
 * @type Text
 * @desc Name of the crafting category
 * 
 * @param LossText
 * @text Ingredient Loss Text
 * @type text
 * @desc Text to show on the loss window when items are lost
 */
 /*~struct~CatMessages:
 * @param CategoryName
 * @text Category Name
 * @type Text
 * @desc Name of the crafting category
 * 
 * @param EmptySlotText
 * @text Empty Slot Text
 * @type text
 * @desc Help text for an empty slot
 * 
 * @param LockedSlotText
 * @text Locked Slot Text
 * @type text
 * @desc Help text for a locked slot
 * 
 * @param CraftButtonText
 * @text Craft Button Text
 * @type text
 * @desc The text shown for the craft button
 * 
 * @param CraftLockedHelpText
 * @text Craft Help Text (locked)
 * @type text
 * @desc Help text shown when the craft button is disabled
 * 
 * @param CraftOkHelpText
 * @text Craft Help Text (Ok)
 * @type text
 * @desc Help text shown when crafting is enabled
 *
 * @param CraftingProgressText
 * @text Progress Text
 * @type text
 * @desc The text shown in the crafting window while the progress bar fills up.
 * 
 * @param CraftingSuccessText
 * @text Successful Text
 * @type text
 * @desc The message shown in the craft result window when crafting is successful.
 *
 * @param CraftingSoftFailureText
 * @text Soft failure Text
 * @type text
 * @desc The message shown in the craft result window when crafting resulted in a soft failure.
 */
 /*~struct~CatCraftSounds:
 * @param CategoryName
 * @text Category Name
 * @type Text
 * @desc Name of the crafting category
 * 
 * @param CraftSound
 * @text Crafting Sound
 * @type struct<AudioObject>[]
 * @desc Sound to play while crafting in this category on the result window
 */
 /*~struct~AudioObject:
 * @param name
 * @type file
 * @dir audio/se
 * @require 1
 * @desc Filename for the SE
 * @param volume
 * @desc Volume of SE
 * @type number
 * @max 100
 * @default 90
 * @param pitch
 * @desc Pitch of SE
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * @param pan
 * @desc Pan of Second
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */
 /*~struct~Ingredients:
 * @param BaseSuccessChance
 * @type number
 * @min 0
 * @max 1
 * @decimals 2
 * @default ""
 * @param BaseItemType
 * @type select
 * @option Item
 * @option Weapon
 * @option Armor
 * @option Category
 * @param ResultItemQuantity
 * @type number
 * @min 1
 * @default 1
 * @param BaseItemID
 * @type number
 * @min 1
 * @param BaseItemQuantity
 * @type number
 * @min 1 
 * @param Category
 * @type text
 * @param SecondItemType
 * @type select
 * @option Item
 * @option Weapon
 * @option Armor
 * @option Category
 * @param SecondItemID
 * @type number
 * @min 1
 * @param SecondItemQuantity
 * @type number
 * @min 1
 * @param SecondCategory
 * @type text
 * @param ThirdItemType
 * @type select
 * @option Item
 * @option Weapon
 * @option Armor
 * @option Category
 * @option None
 * @default None
 * @param ThirdItemID
 * @type number
 * @param ThirdItemQuantity
 * @type number
 * @param ThirdCategory
 * @type text
 * @param FourthItemType
 * @type select
 * @option Item
 * @option Weapon
 * @option Armor
 * @option Category
 * @option None
 * @default None
 * @param FourthItemID
 * @type number
 * @param FourthItemQuantity
 * @type number
 * @param FourthCategory
 * @type text
 * @param FailureItemCreation
 * @type boolean
 * @default false
 * @param FailureItemType
 * @type select
 * @option Item
 * @option Weapon
 * @option Armor
 * @param FailureItemID
 * @type number
 * @min 1
 */
 
  //Initialize Plugin Parameters
 
var Param = PluginManager.parameters('Ramza_CraftingSystem_MZ')
Ramza.CSParams = Ramza.CSParams || {};
Ramza.CSParams.recipeList = JSON.parse(Param['RecipeList'])
Ramza.CSParams.numRecipes = Ramza.CSParams.recipeList.length
Ramza.CSParams.resultItem = []
Ramza.CSParams.craftCategories = []
Ramza.CSParams.itemCategories = []
Ramza.CSParams.hiddenCategories = Param['HiddenCategories'].toLowerCase().split(' ')
Ramza.CSParams.categoryHelpText = String(Param['CategoryHelpText'])
Ramza.CSParams.ClearText = String(Param['ClearText'])
Ramza.CSParams.IngredientCategoryHelpText = String(Param['IngredientCategoryHelpText'])
Ramza.CSParams.ClearHelpText = String(Param['ClearHelpText'])
Ramza.CSParams.ResultText = String(Param['ResultText'])
Ramza.CSParams.QuantityText = String(Param['QuantityText'])
Ramza.CSParams.SuccessChanceText = String(Param['SuccessChanceText'])
Ramza.CSParams.DefaultProgressMessage = String(Param['DefaultProgressMessage'])
Ramza.CSParams.DefaultSuccessMessage = String(Param['DefaultSuccessMessage'])
Ramza.CSParams.DefaultSoftFailureMessage = String(Param['DefaultSoftFailureMessage'])
Ramza.CSParams.ConfirmationMessage = String(Param['ConfirmationMessage'])
Ramza.CSParams.ConfirmationCancelText = String(Param['ConfirmationCancelText'])
Ramza.CSParams.ConfirmationConfirmText = String(Param['ConfirmationConfirmText'])
Ramza.CSParams.MenuCommandEnabled = eval(Param['MenuCommandEnabled'])
Ramza.CSParams.ShowInMenu = eval(Param['ShowInMenu'])
Ramza.CSParams.CraftingMode = (Param['CraftingMode']) ? String(Param['CraftingMode']) : "Default"
Ramza.CSParams.CraftingLevels = eval(Param['CraftingLevels'])
Ramza.CSParams.UseCategoryWindow = eval(Param['UseCategoryWindow'])
Ramza.CSParams.ShowCraftingLevel = eval(Param['ShowCraftingLevel'])
Ramza.CSParams.showLevelUpMessage = eval(Param['LevelUpMessage'])
Ramza.CSParams.ShowSuccessChance = eval(Param['ShowSuccessRate'])
Ramza.CSParams.FakeSuccess = eval(Param['FakeSuccess'])
Ramza.CSParams.FailureChance = eval(Param['FailureChance'])
Ramza.CSParams.ShowPreview = eval(Param['ShowPreview'])
Ramza.CSParams.LowLevelCrafts = eval(Param['LowLevelCrafts'])
Ramza.CSParams.UseSuccessColors = eval(Param['UseSuccessColors'])
Ramza.CSParams.ConfirmationWindow = eval(Param['ConfirmationWindow'])
Ramza.CSParams.DisplayLoss = eval(Param['DisplayLoss'])
Ramza.CSParams.DisplaySoftLoss = eval(Param['DisplaySoftLoss'])
Ramza.CSParams.defaultLevelUpMessage = String(Param['DefaultLevelMessage'])
Ramza.CSParams.slotsLocked = String(Param['LockedSlots'])
Ramza.CSParams.EmptyText = String(Param['EmptyText'])
Ramza.CSParams.LockedText = String(Param['LockedText'])
Ramza.CSParams.EmptyHelpText = String(Param['EmptyHelpText'])
Ramza.CSParams.LockedItemText = String(Param['LockedItemText'])
Ramza.CSParams.InvalidRecipeText = String(Param['InvalidRecipeText'])
Ramza.CSParams.InvalidComboText = String(Param['InvalidComboText'])
Ramza.CSParams.LockedHelpText = String(Param['LockedHelpText'])
Ramza.CSParams.DefaultBaseFailureChance = Number(Param['DefaultBaseFailureChance'])
Ramza.CSParams.FailureItemChance = Number(Param['FailureItemChance'])
Ramza.CSParams.EmptySlotIcon = Number(Param['EmptySlotIcon'])
Ramza.CSParams.LockedSlotIcon = Number(Param['LockedSlotIcon'])
Ramza.CSParams.LossWindowTimer = Number(Param['LossWindowTimer'])
Ramza.CSParams.SuccessWindowTimer = Number(Param['SuccessWindowTimer'])
Ramza.CSParams.SColor = Number(Param['100%Color'])
Ramza.CSParams.AColor = Number(Param['80-99%Color'])
Ramza.CSParams.BColor = Number(Param['60-79%Color'])
Ramza.CSParams.CColor = Number(Param['40-59%Color'])
Ramza.CSParams.DColor = Number(Param['20-39%Color'])
Ramza.CSParams.EColor = Number(Param['1-19%Color'])
Ramza.CSParams.FColor = Number(Param['0%Color'])
Ramza.CSParams.MaxLevel = Number(Param['MaxLevel'])
Ramza.CSParams.ExpBarMaxLevelText = String(Param['ExpBarMaxLevelText'])
Ramza.CSParams.CraftText = String(Param['CraftText'])
Ramza.CSParams.CraftLockedHelpText = String(Param['CraftLockedHelpText'])
Ramza.CSParams.CraftEnabledHelpText = String(Param['CraftEnabledHelpText'])
Ramza.CSParams.DefaultLossMessage = String(Param['DefaultLossMessage'])
Ramza.CSParams.ButtonAssistLeftRightBindText = String(Param['ButtonAssistLeftRightBindText'])
Ramza.CSParams.AdditiveTraitsType = String(Param['AdditiveTraitsType'])
if (Ramza.CSParams.AdditiveTraitsType == 'Sum of all traits on all ingredients (default)'){
	Ramza.CSParams.AdditiveTraitsType = 0
} else if (Ramza.CSParams.AdditiveTraitsType == 'Traits on at least two ingredients (Skyrim-like)'){
	Ramza.CSParams.AdditiveTraitsType = 1
} else {
	Ramza.CSParams.AdditiveTraitsType = 2
}
Ramza.CSParams.AdditiveIngredients = {}
Ramza.CSParams.AdditiveIngredients._items = JSON.parse(Param['AdditiveItems'])
for (i = 0; i < Ramza.CSParams.AdditiveIngredients._items.length; i++){
	Ramza.CSParams.AdditiveIngredients._items[i] = Number(Ramza.CSParams.AdditiveIngredients._items[i])
};
Ramza.CSParams.AdditiveIngredients._weapons = JSON.parse(Param['AdditiveWeapons'])
for (i = 0; i < Ramza.CSParams.AdditiveIngredients._weapons.length; i++){
	Ramza.CSParams.AdditiveIngredients._weapons[i] = Number(Ramza.CSParams.AdditiveIngredients._weapons[i])
};
Ramza.CSParams.AdditiveIngredients._armors = JSON.parse(Param['AdditiveArmors'])
for (i = 0; i < Ramza.CSParams.AdditiveIngredients._armors.length; i++){
	Ramza.CSParams.AdditiveIngredients._armors[i] = Number(Ramza.CSParams.AdditiveIngredients._armors[i])
};

Ramza.CSParams.ExperienceGainCalc = JSON.parse(Param['ExperienceGainCalc'])
Ramza.CSParams.CategoryMenuCommand = JSON.parse(Param['CategoryMenuCommand'])
if (Ramza.CSParams.CategoryMenuCommand.length >= 1){
	for (i = 0; i < Ramza.CSParams.CategoryMenuCommand.length; i++){
		Ramza.CSParams.CategoryMenuCommand[i] = JSON.parse(Ramza.CSParams.CategoryMenuCommand[i])
		Ramza.CSParams.CategoryMenuCommand[i].Enabled = eval(Ramza.CSParams.CategoryMenuCommand[i].Enabled)
	}
};
Ramza.CSParams.CraftCatMessagesHolder = JSON.parse(Param['CraftCatMessages'])
Ramza.CSParams.CraftCatMessages = []
for (i = 0; i < Ramza.CSParams.CraftCatMessagesHolder.length; i++){
	Ramza.CSParams.CraftCatMessages[i] = JSON.parse(Ramza.CSParams.CraftCatMessagesHolder[i])
	Ramza.CSParams.CraftCatMessages[i].CategoryName = Ramza.CSParams.CraftCatMessages[i].CategoryName.toLowerCase()
};
Ramza.CSParams.CraftCatMessagesHolder = undefined
Ramza.CSParams.CommonEvents = JSON.parse(Param['CommonEvents'])
Ramza.CSParams.CommonEvents.forEach(function(ele,index,arr){arr[index] = JSON.parse(ele); arr[index].CommonEventId = Number(arr[index].CommonEventId); arr[index].ImmediateCode = (arr[index].ImmediateCode) ? JSON.parse(arr[index].ImmediateCode) : ""})
Ramza.CSParams.gaugeColor1 = Number(Param['CraftingGaugeColor1'])
Ramza.CSParams.CraftExpGaugeColor1 = Number(Param['CraftExpGaugeColor1'])
Ramza.CSParams.gaugeColor2 = Number(Param['CraftingGaugeColor2'])
Ramza.CSParams.CraftExpGaugeColor2 = Number(Param['CraftExpGaugeColor2'])
Ramza.CSParams.gaugeFrames = Number(Param['CraftGaugeTime'])
Ramza.CSParams.MenuString = String(Param['MenuString'])
Ramza.CSParams.totalFailText = String(Param['TotalFailureText'])
Ramza.CSParams.ExperienceCurve = JSON.parse((Param['ExperienceCurve']))
Ramza.CSParams.totalFailCatTextHolder = JSON.parse((Param['CategoryTotalFailureText']))
Ramza.CSParams.totalFailCatText = []
for (i = 0; i < Ramza.CSParams.totalFailCatTextHolder.length; i++){
	Ramza.CSParams.totalFailCatText[i] = JSON.parse(Ramza.CSParams.totalFailCatTextHolder[i])
	Ramza.CSParams.totalFailCatText[i].CategoryName = Ramza.CSParams.totalFailCatText[i].CategoryName.toLowerCase()
};
Ramza.CSParams.totalFailCatTextHolder = undefined
Ramza.CSParams.CraftingSoundEnabled = eval(String(Param['CraftingSounds']))
Ramza.CSParams.defaultCraftingSE = Param['DefaultCraftingSound']
Ramza.CSParams.defaultCraftingSE = JSON.parse(JSON.parse(Ramza.CSParams.defaultCraftingSE)[0])
Ramza.CSParams.totalFailSound = JSON.parse(JSON.parse(Param['TotalFailureSE']))
Ramza.CSParams.LevelUpSound = Param['LevelUpSound']
Ramza.CSParams.LevelUpSound = JSON.parse(JSON.parse(Param['LevelUpSound']))

Ramza.CSParams.resultSEPlayNumber = Number(Param['QuantityPlays'])
Ramza.CSParams.ModifiedFailureChance = JSON.parse((Param['ModifiedFailureChance']))
Ramza.CSParams.CategoryCraftSEHolder = JSON.parse((Param['CategoryCraftingSounds']))

Ramza.CSParams.CategoryCraftSE = []
for (i = 0; i < Ramza.CSParams.CategoryCraftSEHolder.length; i++){
	Ramza.CSParams.CategoryCraftSE[i] = JSON.parse(Ramza.CSParams.CategoryCraftSEHolder[i])
	Ramza.CSParams.CategoryCraftSE[i].CategoryName = Ramza.CSParams.CategoryCraftSE[i].CategoryName.toLowerCase()
	Ramza.CSParams.CategoryCraftSE[i].CraftSound = JSON.parse(JSON.parse(Ramza.CSParams.CategoryCraftSE[i].CraftSound))
};

Ramza.CSParams.CatLossMessagesHolder = JSON.parse((Param['CatLossMessages']))
Ramza.CSParams.CatLossMessages = []
for (i = 0; i < Ramza.CSParams.CatLossMessagesHolder.length; i++){
	Ramza.CSParams.CatLossMessages[i] = JSON.parse(Ramza.CSParams.CatLossMessagesHolder[i])
	Ramza.CSParams.CatLossMessages[i].CategoryName = Ramza.CSParams.CatLossMessages[i].CategoryName.toLowerCase()
}
Ramza.CSParams.CatLossMessagesHolder = undefined

Ramza.CSParams.CategorySpecificLevelMessagesHolder = JSON.parse((Param['CategorySpecificLevelMessages']))
Ramza.CSParams.CategorySpecificLevelMessages = []
for (i = 0; i < Ramza.CSParams.CategorySpecificLevelMessagesHolder.length; i++){
	Ramza.CSParams.CategorySpecificLevelMessages[i] = JSON.parse(Ramza.CSParams.CategorySpecificLevelMessagesHolder[i])
	Ramza.CSParams.CategorySpecificLevelMessages[i].CategoryName = Ramza.CSParams.CategorySpecificLevelMessages[i].CategoryName.toLowerCase()
}

Ramza.CSParams.CategoryCraftSEHolder = undefined
Ramza.CSParams.CompleteFailureCaseType = Number(Param['CompleteFailureCase'])
Ramza.CSParams.CompleteFailureRandomChance = Number(Param['RemovalChance'])
Ramza.CSParams.SoftRemovalChance = Number(Param['SoftRemovalChance'])
Ramza.CSParams.SoftFailureCaseType = Number(Param['SoftFailureCase'])
Ramza.CSParams.UseFailureChance = eval(Param['FailureChance'])
Ramza.CSParams.AllowPartialRecipes = eval(Param['AllowPartials'])
Ramza.CSParams.ReturnPartialRecipeItems = eval(Param['ReturnPartialItems'])
Ramza.CSParams.KeepExcessMaterials = eval(Param['RemoveExtraQuantities'])


Object.defineProperty(Array.prototype, 'move', {value: function(from,to){
	this.splice(to,0,this.splice(from,1)[0]);
    return this;
}})

for (i = 0; i < Ramza.CSParams.numRecipes; i++){
	Ramza.CSParams.resultItem[i] = JSON.parse(Ramza.CSParams.recipeList[i])
	Ramza.CSParams.resultItem[i].Ingredients = JSON.parse(Ramza.CSParams.resultItem[i].Ingredients)
	//getting recipes per result item
	Ramza.CSParams.resultItem[i].recipes = []
	Ramza.CSParams.resultItem[i].Unlocked = eval(Ramza.CSParams.resultItem[i].Unlocked)
	Ramza.CSParams.resultItem[i].ResultID = Number(Ramza.CSParams.resultItem[i].ResultID)
	for (n = 0;  n < Ramza.CSParams.resultItem[i].Ingredients.length; n++){
		//push itemCategory names to array from individual recipes
		Ramza.CSParams.resultItem[i].recipes[n] = JSON.parse(Ramza.CSParams.resultItem[i].Ingredients[n])
		
		Ramza.CSParams.resultItem[i].recipes[n].ResultQuantity = Number(Ramza.CSParams.resultItem[i].recipes[n].ResultItemQuantity)
		if (Ramza.CSParams.resultItem[i].recipes[n].Category && !Ramza.CSParams.itemCategories.includes(Ramza.CSParams.resultItem[i].recipes[n].Category.toLowerCase())){
			Ramza.CSParams.itemCategories.push(Ramza.CSParams.resultItem[i].recipes[n].Category.toLowerCase())
		}
		if (Ramza.CSParams.resultItem[i].recipes[n].SecondCategory && !Ramza.CSParams.itemCategories.includes(Ramza.CSParams.resultItem[i].recipes[n].SecondCategory.toLowerCase())){
			Ramza.CSParams.itemCategories.push(Ramza.CSParams.resultItem[i].recipes[n].SecondCategory.toLowerCase())
		}
		if (Ramza.CSParams.resultItem[i].recipes[n].ThirdCategory && !Ramza.CSParams.itemCategories.includes(Ramza.CSParams.resultItem[i].recipes[n].ThirdCategory.toLowerCase())){
			Ramza.CSParams.itemCategories.push(Ramza.CSParams.resultItem[i].recipes[n].ThirdCategory.toLowerCase())
		}
		if (Ramza.CSParams.resultItem[i].recipes[n].FourthCategory && !Ramza.CSParams.itemCategories.includes(Ramza.CSParams.resultItem[i].recipes[n].FourthCategory.toLowerCase())){
			Ramza.CSParams.itemCategories.push(Ramza.CSParams.resultItem[i].recipes[n].FourthCategory.toLowerCase())
		}		
		if (Ramza.CSParams.resultItem[i].recipes[n].ThirdItemType == 'None' || Ramza.CSParams.resultItem[i].recipes[n].ThirdItemType == ''){
			Ramza.CSParams.resultItem[i].recipes[n].ThirdItemType = 'None'
			Ramza.CSParams.resultItem[i].recipes[n].ThirdItemID = null
			Ramza.CSParams.resultItem[i].recipes[n].ThirdItemQuantity = null
		}
		if (Ramza.CSParams.resultItem[i].recipes[n].FourthItemType == 'None' || Ramza.CSParams.resultItem[i].recipes[n].FourthItemType == ''){
			Ramza.CSParams.resultItem[i].recipes[n].FourthItemType = 'None'
			Ramza.CSParams.resultItem[i].recipes[n].FourthItemID = null
			Ramza.CSParams.resultItem[i].recipes[n].FourthItemQuantity = null
		}
		if (Ramza.CSParams.resultItem[i].recipes[n].ThirdItemType == 'None' && Ramza.CSParams.resultItem[i].recipes[n].FourthItemType != 'None'){
			Ramza.CSParams.resultItem[i].recipes[n].ThirdItemType = Ramza.CSParams.resultItem[i].recipes[n].FourthItemType
			Ramza.CSParams.resultItem[i].recipes[n].ThirdItemID = Ramza.CSParams.resultItem[i].recipes[n].FourthItemID
			Ramza.CSParams.resultItem[i].recipes[n].ThirdItemQuantity = Ramza.CSParams.resultItem[i].recipes[n].FourthItemQuantity
			Ramza.CSParams.resultItem[i].recipes[n].FourthItemType == 'None'
			Ramza.CSParams.resultItem[i].recipes[n].FourthItemID = null
			Ramza.CSParams.resultItem[i].recipes[n].FourthItemQuantity = null
		}
		//parse data for individual recipes into number values
		Ramza.CSParams.resultItem[i].recipes[n].BaseItemID = Number(Ramza.CSParams.resultItem[i].recipes[n].BaseItemID)
		Ramza.CSParams.resultItem[i].recipes[n].BaseItemQuantity = Number(Ramza.CSParams.resultItem[i].recipes[n].BaseItemQuantity)

		Ramza.CSParams.resultItem[i].recipes[n].SecondItemID = Number(Ramza.CSParams.resultItem[i].recipes[n].SecondItemID)
		Ramza.CSParams.resultItem[i].recipes[n].SecondItemQuantity = Number(Ramza.CSParams.resultItem[i].recipes[n].SecondItemQuantity)
		Ramza.CSParams.resultItem[i].recipes[n].ThirdItemID = Number(Ramza.CSParams.resultItem[i].recipes[n].ThirdItemID)
		Ramza.CSParams.resultItem[i].recipes[n].ThirdItemQuantity = Number(Ramza.CSParams.resultItem[i].recipes[n].ThirdItemQuantity)
		Ramza.CSParams.resultItem[i].recipes[n].FourthItemID = Number(Ramza.CSParams.resultItem[i].recipes[n].FourthItemID)
		Ramza.CSParams.resultItem[i].recipes[n].FourthItemQuantity = Number(Ramza.CSParams.resultItem[i].recipes[n].FourthItemQuantity)		
	}
	//Building crafting categories list from resultItems
	if (!Ramza.CSParams.craftCategories.includes(Ramza.CSParams.resultItem[i].CraftType.toLowerCase())){
		Ramza.CSParams.craftCategories.push(Ramza.CSParams.resultItem[i].CraftType.toLowerCase())
//for menu scene	Ramza.CSParams.craftCategoriesNames.push(Ramza.CSParams.resultItem[i].CraftType.charAt(0).toUpperCase() + Ramza.CSParams.resultItem[i].CraftType.slice(1))
	}
	
};

//Check for Core.

if (Ramza.CSCore == undefined || (!Ramza.CSCore.version || Ramza.CSCore.version < Ramza.CS.requiredCoreVersion)){
		var msg = 'Crafting_System_MZ v' + Ramza.CS.version.toFixed(2) + ' requires Ramza_CS_Core v' + Ramza.CS.requiredCoreVersion.toFixed(2) + ' or higher to function. Download it at https://capnrammo.itch.io/mvmz-crafting-system-core'
		throw new Error(msg);
}


/*
========================================================
Plugin Commands
========================================================
*/

PluginManager.registerCommand('Ramza_CraftingSystem_MZ', 'Call Crafting', args => {
	callCrafting(args.CraftingCategory.toLowerCase());
  });

PluginManager.registerCommand('Ramza_CraftingSystem_MZ', 'Unlock Recipe', args => {
	recipeUnlock(JSON.parse(args.Recipes));
  });  
  
PluginManager.registerCommand('Ramza_CraftingSystem_MZ', 'Lock Recipe', args => {
	recipeLock(JSON.parse(args.Recipes));
  });  
  
PluginManager.registerCommand('Ramza_CraftingSystem_MZ', 'Disable Recipe', args => {
	recipeDisable(JSON.parse(args.Recipes));
  });  
  
PluginManager.registerCommand('Ramza_CraftingSystem_MZ', 'Enable Recipe', args => {
	recipeEnable(JSON.parse(args.Recipes));
  });  
  
PluginManager.registerCommand('Ramza_CraftingSystem_MZ', 'Toggle Locked Slot', args => {
	toggleIngredientSlot(args.SlotId);
});  

PluginManager.registerCommand('Ramza_CraftingSystem_MZ', 'Change Craft Enable', args => {
	changeCraftSceneEnable(eval(args.state));
});  

PluginManager.registerCommand('Ramza_CraftingSystem_MZ', 'Change Craft Show', args => {
	changeCraftSceneShow(eval(args.state));
}); 

PluginManager.registerCommand('Ramza_CraftingSystem_MZ', 'Change Category Show', args => {
	changeShowCategory(args.category, eval(args.state));
});

PluginManager.registerCommand('Ramza_CraftingSystem_MZ', 'Change Category Enable', args => {
	changeEnableCategory(args.category, args.state);
});

const callCrafting = function(scene){
	if (scene) $gameTemp._craftCategory = scene.toLowerCase()
		SceneManager.push(Scene_Crafting)
};

const recipeUnlock = function(recipes){
	recipes.forEach(function(part, index){
		this[index] = Number(this[index])
		$gameParty._craftingRecipes[this[index]] = true
	}, recipes)
}

const recipeLock = function(recipes){
	recipes.forEach(function(part, index){
		this[index] = Number(this[index])
		$gameParty._craftingRecipes[this[index]] = false
	}, recipes)
}

const recipeDisable = function(recipes){
	recipes.forEach(function(part, index){
		this[index] = Number(this[index])
		$gameParty._disabledRecipes[this[index]] = true
	}, recipes)
}

const recipeEnable = function(recipes){
	recipes.forEach(function(part, index){
		this[index] = Number(this[index])
		$gameParty._disabledRecipes[this[index]] = false
	}, recipes)
}

const toggleIngredientSlot = function(slotId){
	$gameParty._lockedSlots[slotId - 1] = !$gameParty._lockedSlots[slotId - 1]
};

const changeCraftSceneEnable = function(state){
	if (state == true) $gameSystem.enableCraftCommand()
	if (state == false) $gameSystem.disableCraftCommand()
};

const changeCraftSceneShow = function(state){
	if (state == true) $gameSystem.showCraftCommand()
	if (state == false) $gameSystem.hideCraftCommand()
};

const changeShowCategory = function(category, state){
	if (category) {
		if (state == true) $gameParty.showCategory(category.toLowerCase())
		if (state == false) $gameParty.hideCategory(category.toLowerCase())
	}
};

const changeEnableCategory = function(category, state){
	if (category){
		switch (state){
			case "enable":
			$gameParty.enableCategory(category.toLowerCase())
			break;
			case "disable":
			$gameParty.disableCategory(category.toLowerCase())
			break;
			case "toggle":
			$gameParty.toggleEnableCategory(category.toLowerCase())
			default:
			break;
		}
	}
}


//========================================================
//Window_ButtonAssist
//========================================================

if (Imported.VisuMZ_0_CoreEngine) {
	const buttonAssistParams = JSON.parse(PluginManager.parameters('VisuMZ_0_CoreEngine')['ButtonAssist:struct'])
	const leftArrow = buttonAssistParams['KeyLEFT:str']
	const rightArrow = buttonAssistParams['KeyRIGHT:str']
	const multikeyFormat = buttonAssistParams['MultiKeyFmt:str']
	Ramza.CS.scene_base_buttontext1 = Scene_Base.prototype.buttonAssistText1
	Scene_Base.prototype.buttonAssistText1 = function(){
		if (this.constructor.name == "Scene_Crafting" && this._ingredientWindow && this._ingredientWindow.active && this._ingredientWindow._index != 4 && this._ingList[this._ingredientWindow._index]){
			return Ramza.CSParams.ButtonAssistLeftRightBindText
		} else {
			return Ramza.CS.scene_base_buttontext1.call(this)
		}
	}
	Ramza.CS.scene_base_buttonkey1 = Scene_Base.prototype.buttonAssistKey1
	Scene_Base.prototype.buttonAssistKey1 = function(){
		if (this.constructor.name == "Scene_Crafting" && this._ingredientWindow && this._ingredientWindow.active && this._ingredientWindow._index != 4 && this._ingList[this._ingredientWindow._index]){
			var text = multikeyFormat.replace('%1', leftArrow)
			text = text.replace('%2', rightArrow)
			return text
		} else {
			return Ramza.CS.scene_base_buttonkey1.call(this)
		}
	}
}


//window changes

Window_CraftingCategories.prototype.initialize = function(rect) {
	Window_Command.prototype.initialize.call(this, rect);
};

Window_CraftPreview.prototype.initialize = function(x, y, width, height){
	var rect = new Rectangle(x, y, width, height)
	Window_Base.prototype.initialize.call(this, rect)
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
	this.contents.fontSize = $gameSystem.mainFontSize()
};

Window_CraftPreview.prototype.drawExpGauge = function(){
	var color1 = ColorManager.textColor(Ramza.CSParams.CraftExpGaugeColor1);
    var color2 = ColorManager.textColor(Ramza.CSParams.CraftExpGaugeColor2);
    this.drawGauge((this.width / 3) * 2, 152, (this.width - ((this.width / 3) * 2) - 32), this.getExpRate(), color1, color2);
	this.drawCraftExp();
	//this.refresh()
};

Window_CraftPreview.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.lineHeight() - 20;
    this.contents.fillRect(x, gaugeY, width, 6, ColorManager.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
};

Window_CraftPreview.prototype.drawCraftExp = function(){
	var text = this.getCraftExpValues();
	this.contents.fontSize = 16
	if ($gameParty._craftLevels[this._category] < Ramza.CSParams.MaxLevel){
		this.drawText(text[0] + "/" + text[1], (this.width / 3) * 2, 144, (this.width - ((this.width / 3) * 2) - 32), 'center')
	} else {
		this.drawText(Ramza.CSParams.ExpBarMaxLevelText, (this.width / 3) * 2, 144, (this.width - ((this.width / 3) * 2) - 32), 'center')
	}
		this.contents.fontSize = $gameSystem.mainFontSize()
};

Window_IngredientCategory.prototype.initialize = function() {
	var rect = new Rectangle(arguments[0],arguments[1], arguments[2], arguments[3])
    Window_HorzCommand.prototype.initialize.call(this, rect);
};

Window_IngredientList.prototype.initialize = function(x, y, width, height) {
	var rect = new Rectangle(x, y, width, height)
    Window_Selectable.prototype.initialize.call(this, rect);
    this._category = 'none';
    this._data = [];
};

Window_IngredientSlot.prototype.initialize = function(x, y, width, height) {
	var rect = new Rectangle(x, y, width, height)
    Window_Selectable.prototype.initialize.call(this, rect);
    this._actor = null;
    this.refresh();
};

Window_IngredientSlot.prototype.drawAllItems = function() {
    var topIndex = this.topIndex();
    for (var i = 0; i < this.maxPageItems(); i++) {
        var index = topIndex + i;
        if (index < this.maxItems()) {
			this.drawItemBackground(index)
            this.drawItem(index);
        }
    }
	this.drawItem(index + 1);
};

Window_IngredientSlot.prototype.drawItem = function(index) {
	if (index < 4) {
        var rect = this.itemRectWithPadding(index);
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
		var rect = this.itemRectWithPadding(index);
		rect.x = rect.x
		var offset = this.textWidth(this.getCraftButtonText())
		this.changePaintOpacity(this.isEnabled(index))
		this.drawText(this.getCraftButtonText(), rect.width - offset, rect.y, 138, this.lineHeight());
	}
};

Window_IngredientSlot.prototype.drawItemName = function(item, x, y, width, count) {
    width = width || 312;
	//console.log(item, x, y, width, count)
	if (item) {
        var iconBoxWidth = ImageManager.iconWidth + 4;
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x, y + 4);
        this.drawText(item.name, x + iconBoxWidth, y + 2, width - iconBoxWidth);
        if (Ramza.CSParams.CraftingMode != "DQ11") this.drawText('x' + count, x + iconBoxWidth + width - this.textWidth(count), y + 2, width - iconBoxWidth);
    } else {
        var iconBoxWidth = ImageManager.iconWidth + 4;
        this.resetTextColor();
		this.changePaintOpacity(false);
        this.drawIcon(Ramza.CSParams.EmptySlotIcon, x, y + 4);
        this.drawText(Ramza.CSParams.EmptyText, x + iconBoxWidth, y + 2, width - iconBoxWidth);		
		if (Ramza.CSParams.CraftingMode != "DQ11") this.drawText('x0', x + iconBoxWidth + width - this.textWidth('0'), y + 2, width - iconBoxWidth);
	}
};

Window_IngredientList.prototype.setCategory = function(category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
		this.setTopRow(0)
    }
};

Window_IngredientList.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var numberWidth = this.numberWidth();
        var rect = this.itemRect(index);
        rect.width -= this.itemPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x + 8, rect.y + 2, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x + 8, rect.y + 2, rect.width - 8);
        this.changePaintOpacity(1);
    }
};

Window_CraftPreview.prototype.drawInfoText = function (){
	this.changeTextColor(this.systemColor())	
	this.contents.fillRect(0, 32, this.width - 36, 2, ColorManager.gaugeBackColor())
	this.contents.fillRect(0, 148, this.width - 36, 2, ColorManager.gaugeBackColor())
	this.contents.fontSize = 24
	var text = Ramza.CSParams.ResultText
	this.drawText(text, 0, 0, 180)
	var textwidth = this.textWidth(text)
	var text = Ramza.CSParams.QuantityText
	this.drawText(text, 0, 0, this.width - 38, "right")
	if (this.showFailureChance()) {
		var text = Ramza.CSParams.SuccessChanceText
		this.drawText(text, 0, 116, this.width - 38)
		this.changeTextColor(ColorManager.normalColor())
	};
	//var text = (this.getSuccessRate(item) * 100) + "%"
	//this.drawText(text, 0, 116, this.width - 38, "right") 
	this.resetTextColor();
	this.contents.fontSize = $gameSystem.mainFontSize();
};

Window_CraftPreview.prototype.drawItemName = function(item, x, y, width){
	width = width || 312;
    if (item) {
        var iconBoxWidth = ImageManager.iconWidth + 4;
        this.resetTextColor();
        this.drawIcon(item[1].ResultItem.iconIndex, x + 2, y + 2);
        this.drawText(item[1].ResultItem.name, x + iconBoxWidth, y, width - iconBoxWidth);
		var qtyText = "x" + Ramza.CSParams.resultItem[Ramza.CSParams.resultItem.indexOf(item[1])].recipes[item[2]].ResultQuantity
		var itemwidth = this.textWidth(item[1].ResultItem.name) + 6
		this.drawText(qtyText, x - 36, y, this.width, "right");
		if (this.showFailureChance()){
			this.changeTextColor(ColorManager.normalColor())
			this.contents.fontSize = 24
			//var text = (this.getSuccessRate(item) * 100) + "%"
			this.drawSuccessRate(this.getSuccessRate(item), 0, 116, this.width - 38)
		}
		this.resetTextColor();
		this.contents.fontSize = $gameSystem.mainFontSize();
    }
};

Window_CraftPreview.prototype.drawSuccessValue = function(value, dx, dy, dw) {
    dx += this.itemPadding();
    dw -= this.itemPadding() * 2;
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
    if (Ramza.CSParams.UseSuccessColors) this.changeTextColor(ColorManager.textColor(colorId));
};

Window_CraftingResult.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.lineHeight() - 20;
    this.contents.fillRect(x, gaugeY, width, 6, ColorManager.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
};

Window_CraftingResult.prototype.drawProgressBar = function(x, y, width) {
    width = width || 96;
    var color1 = ColorManager.textColor(Ramza.CSParams.gaugeColor1)
    var color2 = ColorManager.textColor(Ramza.CSParams.gaugeColor2)
    this.drawGauge(x, y, width, (this._progressBar / Ramza.CSParams.gaugeFrames), color1, color2);
    this.changeTextColor(this.systemColor());
};

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
		$gameTemp._craftCategory = undefined
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
	var wx = Graphics.boxWidth / 3;
	var wy = this.mainAreaTop()
	var wh = this.calcWindowHeight(3, true)
	var ww = Graphics.boxWidth / 3
	var rect = new Rectangle(wx,wy,ww,wh)
    this._categoryWindow = new Window_CraftingCategories(rect);
    //this._categoryWindow.y = this.mainAreaTop()
	//this._categoryWindow.x = Graphics.boxWidth / 3;
	//this._categoryWindow.width = Graphics.boxWidth / 3
	this._categoryWindow.height = this.calcWindowHeight(this._categoryWindow._list.length, true)
    this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.onCancelOk.bind(this));
    this.addWindow(this._categoryWindow);
	if (this._categoryWindow._list.length == 2){
		this.skipCategoryWindow()
	}
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
    var wy = this.mainAreaTop()
    var ww = Graphics.boxWidth / 2;
    var wh = this.calcWindowHeight(5, true);
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
		this._listWindow.destroyContents()
	}
	this._listWindow.deselect()
};

Scene_Crafting.prototype.onItemListOk = function(){
	this._ingList[this._ingredientWindow.index()] = this._listWindow.item()
	this._ingCount[this._ingredientWindow.index()] = 1
	this._ingredientWindow.activate();
	this._ingredientWindow.refresh();
	this._listWindow.destroyContents();
	this._previewWindow.drawPreviewItem();
	if (Ramza.CSParams.UseCategoryWindow) this._itemCategoryWindow.deselect();
	this._listWindow.deselect()
	this._listWindow.deactivate()
};

Scene_Crafting.prototype.createItemCategoryWindow = function() {
	var wy = this.mainAreaTop() + this._ingredientWindow.height
	var ww = Graphics.boxWidth;
	var wh = this.calcWindowHeight(1, true)
	this._itemCategoryWindow = new Window_IngredientCategory(0, wy, ww, wh);
	this._itemCategoryWindow.setHelpWindow(this._helpWindow)
	this._itemCategoryWindow.setHandler('ok',	this.onItemCatOk.bind(this))
	this._itemCategoryWindow.setHandler('cancel',	this.onItemCatCancel.bind(this))
	this.addWindow(this._itemCategoryWindow)
};

Scene_Crafting.prototype.createListWindow = function() {
	var wy = (Ramza.CSParams.UseCategoryWindow) ? this.mainAreaTop() + this._ingredientWindow.height + this._itemCategoryWindow.height : this.mainAreaTop() + this._ingredientWindow.height
	var ww = Graphics.boxWidth;
	var wh = Graphics.boxHeight - wy
	if (Imported.VisuMZ_0_CoreEngine){
		wh -= (!VisuMZ.CoreEngine.Settings.UI.BottomHelp) ? 0 : (Graphics.boxHeight - this._helpWindow.y)
		if (SceneManager._scene._buttonAssistWindow && SceneManager._scene._buttonAssistWindow.y > wy) wh -= SceneManager._scene._buttonAssistWindow.height
	} else {
		wh -= (Graphics.boxHeight - this._helpWindow.y)
	}
	var adjHeight = (Ramza.CSParams.UseCategoryWindow && this._buttonAssistWindow) ? this._helpWindow.height + this._ingredientWindow.height + this._buttonAssistWindow.height + this._itemCategoryWindow.height : this._helpWindow.height + this._ingredientWindow.height
	this._listWindow = new Window_IngredientList(0, wy, ww, wh);
	if (Ramza.CSParams.UseCategoryWindow) this._itemCategoryWindow.setListWindow(this._listWindow)
    this._listWindow.setHandler('ok', this.onItemListOk.bind(this));
    this._listWindow.setHandler('cancel', this.onItemListCancel.bind(this));
    this._listWindow.setHelpWindow(this._helpWindow);
    this.addWindow(this._listWindow);
};

Scene_Crafting.prototype.createPreviewWindow = function() {
	var wy = this.mainAreaTop()
	var wx = Graphics.boxWidth / 2;
	var ww = Graphics.boxWidth / 2;
	var wh = this._ingredientWindow.height
    this._previewWindow = new Window_CraftPreview(wx, wy, ww, wh);
	this._previewWindow.setCategory(this._category)
//	this._previewWindow.drawExpGauge();
    this.addWindow(this._previewWindow);
};

Scene_Crafting.prototype.createConfirmationWindow = function() {
	var wy = this.mainAreaTop() + this._ingredientWindow.height
	var wx = Graphics.boxWidth / 4;
	var ww = Graphics.boxWidth / 2;
	var wh = this.calcWindowHeight(1, true)
	var rect = new Rectangle(wx, wy, ww, wh)
	this._confirmWindow = new Window_CraftConfirm(rect);
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
	var rect = new Rectangle(wx, wy, ww, wh)
    this._lossWindow = new Window_Loss(rect);
	this._lossWindow.setIngredientWindow(this._ingredientWindow)
	this._lossWindow.setResultWindow(this._resultWindow)
	this._lossWindow.setIngredients(this._ingList, this._ingCount)
	this._lossWindow.setCategory(this._category)
	this._lossWindow.drawLossText();
	this._resultWindow.setLossWindow(this._lossWindow)
    this.addWindow(this._lossWindow);
};

Scene_Crafting.prototype.clearIngredients = function(){
	this._ingList = []
	this._ingCount = []
};

Scene_Crafting.prototype.createResultWindow = function() {
	var wy = Graphics.boxHeight / 3
	var wx = Graphics.boxWidth / 6
	var ww = Graphics.boxWidth - (wx * 2);
	var wh = Graphics.boxHeight / 3
	var rect = new Rectangle(wx, wy, ww, wh)
    this._resultWindow = new Window_CraftingResult(rect);
	this._resultWindow._progressBar = 0
	this._resultWindow.setIngLists(this._ingList, this._ingCount)
	this._resultWindow.setIngredientWindow(this._ingredientWindow);
	this.addWindow(this._resultWindow);
};