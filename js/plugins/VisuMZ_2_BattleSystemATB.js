//=============================================================================
// VisuStella MZ - Battle System ATB - Active Turn Battle
// VisuMZ_2_BattleSystemATB.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_2_BattleSystemATB = true;

var VisuMZ = VisuMZ || {};
VisuMZ.BattleSystemATB = VisuMZ.BattleSystemATB || {};
VisuMZ.BattleSystemATB.version = 1.16;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 2] [Version 1.16] [BattleSystemATB]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Battle_System_-_ATB_VisuStella_MZ
 * @base VisuMZ_1_BattleCore
 * @orderAfter VisuMZ_1_BattleCore
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The RPG Maker MZ Time Progress Battle (TPB) system is only a few steps away
 * from the acclaimed Active Turn Battle (ATB) system. This plugin will grant
 * it the various features needed to turn it from TPB into ATB.
 * 
 * This plugin will grant control over how the various mechanics work, ranging
 * from penalties to calculations, to actions that can manipulate the ATB gauge
 * of battlers. Battlers that are in the middle of casting a spell can also be
 * interrupted with specific notetag traits.
 * 
 * ATB Gauges can also be displayed on enemies and/or allies, giving the player
 * full access to the current battle state. The ATB Gauges are also improved,
 * showing different colors for different states and showing a new gauge for
 * the casting state.
 * 
 * *NOTE* You will need to set the game project to run in either TPB mode,
 * Time Progress (Active) or Time Progress (Wait), for these new ATB effects
 * to work. You can find this setting in Database > System 1.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Full control over the TPB/ATB mechanics such as speed, calculations, etc.
 * * Notetags that give skills and items access to ATB Gauge manipulation, by
 *   altering how filled they are.
 * * Interrupts can be used on battlers in the middle of casting a skill.
 * * Visual ATB Gauges can be displayed over battlers' heads.
 * * ATB Gauges have extra coloring options added to them to let the player
 *   quickly know the current speed state of the ATB Gauge.
 * * A field-wide ATB Gauge that positions actor and enemy markers on it to
 *   show how far along actors and enemies are relative to each other's turns.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Required Plugin List ------
 *
 * - VisuMZ_1_BattleCore
 *
 * This plugin requires the above listed plugins to be installed inside your
 * game's Plugin Manager list in order to work. You cannot start your game with
 * this plugin enabled without the listed plugins.
 *
 * ------ Tier 2 ------
 *
 * This plugin is a Tier 2 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
 * 
 * *NOTE* You will need to set the game project to run in either TPB mode,
 * Time Progress (Active) or Time Progress (Wait), for these new ATB effects
 * to work. You can find this setting in Database > System 1.
 *
 * ============================================================================
 * Major Changes
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 *
 * ATB Gauges
 * 
 * The gauges are now revamped to show different colors to depict the various
 * ATB states a battler can be in. These various states include the following:
 * 
 * - When a battler's speed is fully stopped.
 * - When a battler's speed is slower/faster past a specific rating.
 * - When a battler is ready for an action.
 * - When a battler is casting an action (those with negative speed values).
 * 
 * The colors used for these states can be found and altered in the Plugin
 * Parameters under Gauge Color Settings.
 *
 * ---
 * 
 * Skill & Item Speeds
 * 
 * With TPB, skills and items with negative speed values will cause the battler
 * to enter a "casting" state, meaning they have to wait extra time before the
 * action takes off. With this delayed action execution, one might assume that
 * if there is a positive speed value, the battler would require less time for
 * their next turn.
 * 
 * However, this isn't the case with RPG Maker MZ's TPB. By changing it to ATB,
 * skills and items with positive speed values will have an impact on how full
 * their ATB Gauges will be in the following turn. A value of 2000 will put the
 * gauge at 50% full, 1000 will put the gauge at 25% full, 500 will put it at
 * 12.5% full, and so on. Notetags can also be used to influence this.
 * 
 * ---
 * 
 * JS Calculation Mechanics
 * 
 * While the calculation mechanics aren't changed from their original RPG Maker
 * MZ formulas, the functions for them have been overwritten to allow you, the
 * game developer, to alter them as you see fit.
 * 
 * ---
 *
 * ============================================================================
 * Extra Features
 * ============================================================================
 *
 * There are some extra features found if other VisuStella MZ plugins are found
 * present in the Plugin Manager list.
 *
 * ---
 *
 * VisuMZ_0_CoreEngine
 *
 * - ATB Interrupts can have animations played when they trigger if the
 * VisuStella Core Engine is installed.
 *
 * ---
 * 
 * VisuMZ_1_OptionsCore
 * 
 * - Having the VisuStella Options Core available will allow you to adjust the
 * speed at which the ATB gauges fill up.
 * 
 * - The VisuStella Options Core also gives the player the option to toggle
 * between Active and Wait-based ATB.
 * 
 * ---
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * The following are notetags that have been added through this plugin. These
 * notetags will not work with your game if this plugin is OFF or not present.
 * 
 * === General ATB-Related Notetags ===
 * 
 * These notetags are general purpose notetags that have became available
 * through this plugin.
 *
 * ---
 * 
 * <ATB Help>
 *  description
 *  description
 * </ATB Help>
 *
 * - Used for: Skill, Item Notetags
 * - If your game happens to support the ability to change battle systems, this
 *   notetag lets you change how the skill/item's help description text will
 *   look under TPB/ATB.
 * - This is primarily used if the skill behaves differently in TPB/ATB versus
 *   any other battle system.
 * - Replace 'description' with help text that's only displayed if the game's
 *   battle system is set to TPB/ATB.
 * 
 * ---
 *
 * <Hide ATB Gauge>
 *
 * - Used for: Enemy Notetags
 * - If you don't want an enemy to show their ATB Gauge, use this notetag.
 * 
 * ---
 * 
 * === ATB Field Gauge-Related Notetags ===
 * 
 * These notetags only work if the ATB Field Gauge is enabled.
 * 
 * ---
 *
 * <ATB Field Gauge Icon: x>
 *
 * - Used for: Actor, Enemy Notetags
 * - Changes the marker graphic used for the battler to a specific icon.
 * - Replace 'x' with the icon index to be used.
 * 
 * ---
 *
 * <ATB Field Gauge Face: filename, index>
 *
 * - Used for: Actor, Enemy Notetags
 * - Changes the marker graphic used for the enemy to a specific face.
 * - Replace 'filename' with the filename of the image.
 *   - Do not include the file extension.
 * - Replace 'index' with the index of the face. Index values start at 0.
 * - Example: <ATB Field Gauge Face: Monster, 1>
 * 
 * ---
 * 
 * === ATB Gauge Manipulation-Related Notetags ===
 * 
 * These notetags are used for ATB Gauge manipulation purposes.
 * 
 * ---
 *
 * <ATB After Gauge: x%>
 *
 * - Used for: Skill, Item Notetags
 * - After using the skill/item, the user's ATB Gauge will be set to x%.
 * - Replace 'x' with a percentile value representing the amount you want the
 *   ATB Gauge to reset to after the skill/item's usage.
 * 
 * ---
 * 
 * <ATB Charge Gauge: x%>
 * <ATB Charge Gauge: +x%>
 * <ATB Charge Gauge: -x%>
 *
 * - Used for: Skill, Item Notetags
 * - If the target is in a charging state, change the target's gauge amount to
 *   x% or by x% (if using the +/- variants).
 * - Replace 'x' with a percentile value representing the amount of the ATB
 *   Gauge you wish to alter it to/by.
 * - This only affects targets who are in a charging state.
 * 
 * ---
 * 
 * <ATB Cast Gauge: x%>
 * <ATB Cast Gauge: +x%>
 * <ATB Cast Gauge: -x%>
 *
 * - Used for: Skill, Item Notetags
 * - If the target is in a casting state, change the target's gauge amount to
 *   x% or by x% (if using the +/- variants).
 * - Replace 'x' with a percentile value representing the amount of the ATB
 *   Gauge you wish to alter it to/by.
 * - This only affects targets who are in a casting state.
 * 
 * ---
 *
 * <ATB Interrupt>
 *
 * - Used for: Skill, Item Notetags
 * - If this skill/item hits a target who is in a casting state, interrupt that
 *   action to cancel it and reset the target's ATB Gauge to 0%.
 * 
 * ---
 *
 * <ATB Cannot Be Interrupted>
 *
 * - Used for: Skill, Item Notetags
 * - Makes the skill/item immune to ATB Interruptions.
 * 
 * ---
 * 
 * <ATB Battle Start Gauge: +x%>
 * <ATB Battle Start Gauge: -x%>
 *
 * - Used for: Actor, Class, Skill, Weapon, Armor, Enemy, State Notetags
 * - Determine how much extra or less ATB Gauge the battler will start with if
 *   associated with one of these database objects.
 * - Replace 'x' with a percentile value determining how much extra or less ATB
 *   Gauge value the battler will start battle with.
 * - These values are additive when stacked.
 *
 * ---
 * 
 * <ATB After Gauge: +x%>
 * <ATB After Gauge: -x%>
 *
 * - Used for: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State Notetags
 * - Determine how much influence there is on the ATB Gauge after finishing a
 *   skill/item. Increase or decrease the amount after each action.
 * - Replace 'x' with a percentile value determining how much influence there
 *   is on the ATB Gauge after the skill/item has finished performing.
 * - These values are additive when stacked.
 *
 * ---
 * 
 * === JavaScript Notetags: ATB Gauge Manipulation ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * give more control over conditional ATB Gauge Manipulation.
 * 
 * ---
 * 
 * <JS ATB Charge Gauge>
 *  code
 *  code
 *  rate = code;
 * </JS ATB Charge Gauge>
 *
 * - Used for: Skill, Item Notetags
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   ATB Gauge to if the target is in a charging state.
 * - The 'rate' variable represents rate value the ATB Gauge will change to
 *   between the values of 0 and 1.
 * - The 'rate' variable will default to the target's current ATB Gauge rate
 *   if the target is in a charging state.
 * 
 * ---
 * 
 * <JS ATB Cast Gauge>
 *  code
 *  code
 *  rate = code;
 * </JS ATB Cast Gauge>
 *
 * - Used for: Skill, Item Notetags
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   ATB Gauge to if the target is in a casting state.
 * - The 'rate' variable represents rate value the ATB Gauge will change to
 *   between the values of 0 and 1.
 * - The 'rate' variable will default to the target's current ATB Gauge rate
 *   if the target is in a casting state.
 * 
 * ---
 * 
 * <JS ATB After Gauge>
 *  code
 *  code
 *  rate = code;
 * </JS ATB After Gauge>
 *
 * - Used for: Skill, Item Notetags
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   ATB Gauge to after performing this skill/item action.
 * - The 'rate' variable represents rate value the ATB Gauge will change to
 *   between the values of 0 and 1.
 * - The 'rate' variable will default to 0.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * The following are Plugin Commands that come with this plugin. They can be
 * accessed through the Plugin Command event command.
 *
 * ---
 * 
 * === Actor Plugin Commands ===
 * 
 * ---
 *
 * Actor: Change Field Gauge Icon
 * - Changes the icons used for the specific actor(s) on the ATB Field Gauge.
 *
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 *
 *   Icon:
 *   - Changes the graphic to this icon.
 *
 * ---
 * 
 * Actor: Change Field Gauge Face
 * - Changes the faces used for the specific actor(s) on the ATB Field Gauge.
 * 
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 * 
 *   Face Name:
 *   - This is the filename for the target face graphic.
 * 
 *   Face Index:
 *   - This is the index for the target face graphic.
 * 
 * ---
 *
 * Actor: Clear Field Gauge Graphic
 * - Clears the ATB Field Gauge graphics for the actor(s).
 * - The settings will revert to the Plugin Parameter settings.
 *
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 *
 * ---
 * 
 * === Enemy Plugin Commands ===
 * 
 * ---
 *
 * Enemy: Change Field Gauge Icon
 * - Changes the icons used for the specific enemy(ies) on the ATB Field Gauge.
 *
 *   Enemy Index(es):
 *   - Select which enemy index(es) to affect.
 *
 *   Icon:
 *   - Changes the graphic to this icon.
 *
 * ---
 *
 * Enemy: Change Field Gauge Face
 * - Changes the faces used for the specific enemy(ies) on the ATB Field Gauge.
 *
 *   Enemy Index(es):
 *   - Select which enemy index(es) to affect.
 *
 *   Face Name:
 *   - This is the filename for the target face graphic.
 *
 *   Face Index:
 *   - This is the index for the target face graphic.
 *
 * ---
 *
 * Enemy: Clear Field Gauge Graphic
 * - Clears the ATB Field Gauge graphics for the enemy(ies).
 * - The settings will revert to the Plugin Parameter settings.
 *
 *   Enemy Index(es):
 *   - Select which enemy index(es) to affect.
 *
 * ---
 * 
 * === System Plugin Commands ===
 * 
 * ---
 * 
 * System: ATB Field Gauge Visibility
 * - Determine the visibility of the ATB Field Gauge.
 * 
 *   Visibility:
 *   - Changes the visibility of the ATB Field Gauge.
 * 
 * ---
 * 
 * ============================================================================
 * Plugin Parameters: Mechanics Settings
 * ============================================================================
 *
 * Mechanics settings used for Battle System ATB. The majority of these are
 * JavaScript-based and will require knowledge of JavaScript to fully utilize
 * the plugin parameters.
 *
 * ---
 *
 * Mechanics
 * 
 *   Escape Fail Penalty:
 *   - Gauge penalty if an escape attempt fails.
 * 
 *   Stuns Reset Gauge?:
 *   - Should stuns reset the ATB Gauge?
 * 
 *   JS: Initial Gauge:
 *   - JavaScript code to determine how much ATB gauge to give each battler at
 *     the start of battle.
 * 
 *   JS: Speed:
 *   - JavaScript code to determine how much speed a battler has.
 * 
 *   JS: Base Speed:
 *   - JavaScript code to determine how much base speed a battler has.
 * 
 *   JS: Relative Speed:
 *   - JavaScript code to determine what is the relative speed of a battler.
 * 
 *   JS: Acceleration:
 *   - JavaScript code to determine how much gauges accelerate by relative to
 *     reference time.
 * 
 *   JS: Cast Time:
 *   - JavaScript code to determine how much cast time is used for skills/items
 *     with negative speed modifiers.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Interrupt Settings
 * ============================================================================
 *
 * Interrupt settings used for Battle System ATB.
 *
 * ---
 *
 * Interrupt
 * 
 *   Animation ID:
 *   - Play this animation when a unit is interrupted.
 *   - Requires VisuMZ_0_CoreEngine.
 * 
 *     Mirror Animation:
 *     - Mirror the interrupt animation?
 *     - Requires VisuMZ_0_CoreEngine.
 * 
 *     Mute Animation:
 *     - Mute the interrupt animation?
 *     - Requires VisuMZ_0_CoreEngine.
 * 
 *   Text Popup:
 *   - Text used for popup when interrupts happen.
 *   - Leave empty for no popup.
 * 
 *   Text Color:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *     Flash Color:
 *     - Adjust the popup's flash color.
 *     - Format: [red, green, blue, alpha]
 * 
 *     Flash Duration:
 *     - What is the frame duration of the flash effect?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Gauge Settings
 * ============================================================================
 *
 * General gauge settings used for ATB Gauges.
 *
 * ---
 *
 * General
 * 
 *   Anchor X:
 *   Anchor Y:
 *   - Where do you want the ATB Gauge sprite's anchor X/Y to be?
 *   - Use values between 0 and 1 to be safe.
 * 
 *   Scale:
 *   - How large/small do you want the ATB Gauge to be scaled?
 * 
 *   Offset X:
 *   Offset Y:
 *   - How many pixels to offset the ATB Gauge's X/Y by?
 *
 * ---
 *
 * AGI Gauge Rates
 * 
 *   Slow Rate:
 *   - How much should the AGI rate be at to be considered slow?
 * 
 *   Fast Rate:
 *   - How much should the AGI rate be at to be considered fast?
 *
 * ---
 *
 * Actors
 * 
 *   Show Sprite Gauges:
 *   - Show ATB Gauges over the actor sprites' heads?
 *   - Requires SV Actors to be visible.
 * 
 *   Show Status Gauges:
 *   - Show ATB Gauges in the status window?
 *   - Applies only to sideview.
 *
 * ---
 *
 * Enemies
 * 
 *   Show Sprite Gauges:
 *   - Show ATB Gauges over the enemy sprites' heads?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Field Gauge Settings
 * ============================================================================
 * 
 * The ATB Field Gauge is a large gauge placed on the screen with all of the
 * current battle's active participants shown on it. The participants are
 * represented by a marker. Each marker's position on the gauge indicates its
 * battler's ATB progress towards a turn.
 * 
 * In order for this feature to work, enable "Use Field Gauge?" in the
 * Plugin Parameters.
 *
 * ---
 *
 * General
 * 
 *   Use Field Gauge?:
 *   - This value must be set to true in order for the ATB Field Gauge
 *     to appear.
 *   - This needs to be on in order for this feature to work.
 * 
 *   Display Position:
 *   - Select where the Field Gauge will appear on the screen.
 *   - Top
 *   - Bottom
 *   - Left
 *   - Right
 * 
 *   Offset X:
 *   Offset Y:
 *   - How much to offset the X/Y coordinates by.
 * 
 *   Reposition for Help?:
 *   - If the display position is at the top, reposition the gauge when the
 *     help window is open?
 * 
 *   Forward Direction:
 *   - Decide on the direction of the Field Gauge.
 *   - Settings may vary depending on position.
 *   - Left to Right
 *   - Right to Left
 *   - Up to Down
 *   - Down to Up
 *
 * ---
 *
 * Field Gauge Settings
 * 
 *   Gauge Skin:
 *   - Optional. Select an image to place behind the gauge.
 *   - This will be centered on the Field Gauge's position.
 * 
 *   Show Gauge?:
 *   - Decide if you want the gauge to be shown.
 * 
 *   Horizontal Length:
 *   - The length of the Field Gauge if placed horizontally.
 * 
 *   Vertical Length:
 *   - The length of the Field Gauge if placed vertically.
 * 
 *   Thickness:
 *   - The thickness of the Field Gauge for either direction.
 * 
 *   Split Location:
 *   - Determine where the gauge should split.
 *   - Use 0.00 for the start. Use 1.00 for the end.
 *
 * ---
 *
 * Marker Sprites
 * 
 *   Actor Marker Side:
 *   - Which side do you want the actor markers to appear?
 * 
 *   Enemy Marker Side:
 *   - Which side do you want the enemy markers to appear?
 * 
 *   Marker Offset:
 *   - How many pixels do you want to offset the markers by?
 * 
 *   Marker Size:
 *   - How pixels wide and tall do you want the markers to be?
 * 
 *   Marker Speed:
 *   - How many pixels maximum can a marker travel in one frame?
 * 
 *   Opacity Rate:
 *   - If a marker has to change opacity, how fast should it change by?
 *
 * ---
 *
 * Marker Border
 * 
 *   Show Border?:
 *   - Show borders for the marker sprites?
 * 
 *   Border Thickness:
 *   - How many pixels thick should the colored portion of the border be?
 * 
 *   Actors
 *   Enemies
 * 
 *     Border Color:
 *     - Use #rrggbb for custom colors or regular numbers for text colors
 *       from the Window Skin.
 * 
 *     Border Skin:
 *     - Optional. Place a skin on the actor/enemy borders instead of
 *       rendering them?
 *
 * ---
 *
 * Marker Sprites
 * 
 *   Actors
 * 
 *     Sprite Type:
 *     - Select the type of sprite used for the actor graphic.
 *     - Face Graphic - Show the actor's face.
 *     - Icon - Show a specified icon.
 *     - Sideview Actor - Show the actor's sideview battler.
 * 
 *     Default Icon:
 *     - Which icon do you want to use for actors by default?
 * 
 *   Enemies
 * 
 *     Sprite Type:
 *     - Select the type of sprite used for the enemy graphic.
 *     - Face Graphic - Show a specified face graphic.
 *     - Icon - Show a specified icon.
 *     - Enemy - Show the enemy's graphic or sideview battler.
 * 
 *     Default Face Name:
 *     - Use this default face graphic if there is no specified face.
 * 
 *     Default Face Index:
 *     - Use this default face index if there is no specified index.
 * 
 *     Default Icon:
 *     - Which icon do you want to use for enemies by default?
 * 
 *     Match Hue?:
 *     - Match the hue for enemy battlers?
 *     - Does not apply if there's a sideview battler.
 *
 * ---
 *
 * Marker Letter
 * 
 *   Show Enemy Letter?:
 *   - Show the enemy's letter on the marker sprite?
 * 
 *   Font Name:
 *   - The font name used for the text of the Letter.
 *   - Leave empty to use the default game's font.
 * 
 *   Font Size:
 *   - The font size used for the text of the Letter.
 *
 * ---
 *
 * Marker Background
 * 
 *   Show Background?:
 *   - Show the background on the marker sprite?
 * 
 *   Actors
 *   Enemies
 * 
 *     Background Color 1:
 *     Background Color 2:
 *     - Use #rrggbb for custom colors or regular numbers for text colors
 *       from the Window Skin.
 * 
 *     Background Skin:
 *     - Optional. Use a skin for the actor background instead of
 *       rendering them?
 *
 * ---
 *
 * Marker Arrow
 * 
 *   Show Arrow?:
 *   - Show the arrow sprite pointing towards the Field Gauge?
 * 
 *   Arrow Skin:
 *   - Pick a window skin to draw arrows from.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Gauge Color Settings
 * ============================================================================
 *
 * Gauge color settings used for ATB Gauges.
 *
 * ---
 *
 * Colors
 * 
 *   Default Color 1:
 *   Default Color 2:
 *   Full Color 1:
 *   Full Color 2:
 *   Cast Color 1:
 *   Cast Color 2:
 *   Fast Color 1:
 *   Fast Color 2:
 *   Slow Color 1:
 *   Slow Color 2:
 *   Stop Color 1:
 *   Stop Color 2:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Options Settings
 * ============================================================================
 *
 * Options settings used for Battle System ATB.
 *
 * ---
 *
 * Options
 * 
 *   Add Option?:
 *   - Add the 'Show ATB Gauges' option to the Options menu?
 * 
 *   Adjust Window Height:
 *   - Automatically adjust the options window height?
 * 
 *   Option Name:
 *   - Command name of the option.
 *
 * ---
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * 1. These plugins may be used in free or commercial games provided that they
 * have been acquired through legitimate means at VisuStella.com and/or any
 * other official approved VisuStella sources. Exceptions and special
 * circumstances that may prohibit usage will be listed on VisuStella.com.
 * 
 * 2. All of the listed coders found in the Credits section of this plugin must
 * be given credit in your games or credited as a collective under the name:
 * "VisuStella".
 * 
 * 3. You may edit the source code to suit your needs, so long as you do not
 * claim the source code belongs to you. VisuStella also does not take
 * responsibility for the plugin if any changes have been made to the plugin's
 * code, nor does VisuStella take responsibility for user-provided custom code
 * used for custom control effects including advanced JavaScript notetags
 * and/or plugin parameters that allow custom JavaScript code.
 * 
 * 4. You may NOT redistribute these plugins nor take code from this plugin to
 * use as your own. These plugins and their code are only to be downloaded from
 * VisuStella.com and other official/approved VisuStella sources. A list of
 * official/approved sources can also be found on VisuStella.com.
 *
 * 5. VisuStella is not responsible for problems found in your game due to
 * unintended usage, incompatibility problems with plugins outside of the
 * VisuStella MZ library, plugin versions that aren't up to date, nor
 * responsible for the proper working of compatibility patches made by any
 * third parties. VisuStella is not responsible for errors caused by any
 * user-provided custom code used for custom control effects including advanced
 * JavaScript notetags and/or plugin parameters that allow JavaScript code.
 *
 * 6. If a compatibility patch needs to be made through a third party that is
 * unaffiliated with VisuStella that involves using code from the VisuStella MZ
 * library, contact must be made with a member from VisuStella and have it
 * approved. The patch would be placed on VisuStella.com as a free download
 * to the public. Such patches cannot be sold for monetary gain, including
 * commissions, crowdfunding, and/or donations.
 * 
 * 7. If this VisuStella MZ plugin is a paid product, all project team members
 * must purchase their own individual copies of the paid product if they are to
 * use it. Usage includes working on related game mechanics, managing related
 * code, and/or using related Plugin Commands and features. Redistribution of
 * the plugin and/or its code to other members of the team is NOT allowed
 * unless they own the plugin itself as that conflicts with Article 4.
 * 
 * 8. Any extensions and/or addendums made to this plugin's Terms of Use can be
 * found on VisuStella.com and must be followed.
 *
 * ============================================================================
 * Credits
 * ============================================================================
 * 
 * If you are using this plugin, credit the following people in your game:
 * 
 * Team VisuStella
 * * Yanfly
 * * Arisu
 * * Olivia
 * * Irina
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.16: August 13, 2021
 * * Bug Fixes!
 * ** Crash prevented with certain Plugin Parameter combinations enabled when
 *    the ATB Gauge is filled up. Fix made by Irina.
 * 
 * Version 1.15: July 23, 2021
 * * Bug Fixes!
 * ** When enemies appear out from a troop event, Visual ATB Gauges above their
 *    heads should now appear properly for SV Enemies, too. Fix made by Irina.
 * 
 * Version 1.14: July 16, 2021
 * * Bug Fixes!
 * ** When enemies appear out from a troop event, Visual ATB Gauges above their
 *    heads should now appear properly. Fix made by Olivia.
 * 
 * Version 1.13: May 21, 2021
 * * Bug Fixes!
 * ** When slip damage is allowed to kill, dying actors will have their TPB
 *    state reset to charging in order to prevent lock-ups. Fix by Olivia.
 * 
 * Version 1.12: May 7, 2021
 * * Feature Update!
 * ** Actions with 0 or positive speed will now act immediately without
 *    allowing a single gauge tick pass through. Update made by Olivia.
 * 
 * Version 1.11: April 16, 2021
 * * Bug Fixes!
 * ** ATB Gauge visibility is now properly updated across various events such
 *    as party removal and other obstruction effects. Fix made by Olivia.
 * 
 * Version 1.10: March 12, 2021
 * * Hot Fix!
 * ** Fixed calculation errors due to field gauge. Fix made by Olivia.
 * * Feature Update!
 * ** Slight change to the way calculations are made for the bottom aligned
 *    field gauge position. Update made by Olivia.
 * 
 * Version 1.09: January 1, 2021
 * * Compatibility Update
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.08: November 22, 2020
 * * Feature Update!
 * ** ATB Interrupts will not clear all actions (including queued ones) for
 *    mechanical compatibility. Change made by Yanfly.
 * 
 * Version 1.07: November 15, 2020
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.06: November 1, 2020
 * * Documentation Update!
 * ** Help file updated with new features.
 * * New Features!
 * ** New Plugin Command by Irina!
 * *** Actor: Change Field Gauge Face
 * **** Changes the faces used for the specific actor(s) on the ATB
 *      Field Gauge.
 * 
 * Version 1.05: October 25, 2020
 * * Bug Fixes!
 * ** Plugin should now be compatible with older saves when changing to a save
 *    that didn't use a Field Gauge to one that does. Fix made by Irina.
 * * Documentation Update!
 * ** Help file updated with new features.
 * * Feature Update!
 * ** <ATB Field Gauge Face: filename, index> notetag now works with actors.
 *    Update made by Irina.
 *
 * Version 1.04: October 18, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * 
 * Version 1.03: October 11, 2020
 * * Documentation Update
 * ** Help file updated with new features.
 * * Feature Update!
 * ** Enemy letters are no longer drawn on the Field Gauge unless there are
 *    multiple enemies of the same type. Added by Arisu.
 * * New Features!
 * ** New Plugin Parameters added by Arisu and Yanfly.
 * *** Plugin Parameters > Field Gauge > Offset X and Y
 * **** How much to offset the X/Y coordinates of the Field Gauge by.
 * 
 * Version 1.02: October 4, 2020
 * * New Features!
 * ** New Plugin Command added "System: ATB Field Gauge Visibility" to let you
 *    show or hide the Field Gauge during battle. Added by Arisu.
 * 
 * Version 1.01: September 27, 2020
 * * Bug Fixes!
 * ** ATB Cast and Charge notetags no longer cause crashes. Fix made by Olivia.
 * * New Features!
 * ** New plugin parameter added by Olivia.
 * *** Plugin Parameters > Mechanics > Stuns Reset Gauge?
 * **** Should stuns reset the ATB Gauge?
 *
 * Version 1.00: September 21, 2020
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command FieldGaugeActorIcon
 * @text Actor: Change Field Gauge Icon
 * @desc Changes the icons used for the specific actor(s) on the ATB Field Gauge.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg IconIndex:num
 * @text Icon
 * @desc Changes the graphic to this icon.
 * @default 84
 *
 * @ --------------------------------------------------------------------------
 *
 * @command FieldGaugeActorFace
 * @text Actor: Change Field Gauge Face
 * @desc Changes the faces used for the specific actor(s) on the ATB Field Gauge.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg FaceName:str
 * @text Face Name
 * @parent EnemySprite
 * @type file
 * @dir img/faces/
 * @desc This is the filename for the target face graphic.
 * @default Actor1
 *
 * @arg FaceIndex:num
 * @text Face Index
 * @parent EnemySprite
 * @type number
 * @desc This is the index for the target face graphic.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command FieldGaugeClearActorGraphic
 * @text Actor: Clear Field Gauge Graphic
 * @desc Clears the ATB Field Gauge graphics for the actor(s).
 * The settings will revert to the Plugin Parameter settings.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command FieldGaugeEnemyIcon
 * @text Enemy: Change Field Gauge Icon
 * @desc Changes the icons used for the specific enemy(ies) on the ATB Field Gauge.
 *
 * @arg Enemies:arraynum
 * @text Enemy Index(es)
 * @type number[]
 * @desc Select which enemy index(es) to affect.
 * @default ["1"]
 *
 * @arg IconIndex:num
 * @text Icon
 * @desc Changes the graphic to this icon.
 * @default 298
 *
 * @ --------------------------------------------------------------------------
 *
 * @command FieldGaugeEnemyFace
 * @text Enemy: Change Field Gauge Face
 * @desc Changes the faces used for the specific enemy(ies) on the ATB Field Gauge.
 *
 * @arg Enemies:arraynum
 * @text Enemy Index(es)
 * @type number[]
 * @desc Select which enemy index(es) to affect.
 * @default ["1"]
 *
 * @arg FaceName:str
 * @text Face Name
 * @parent EnemySprite
 * @type file
 * @dir img/faces/
 * @desc This is the filename for the target face graphic.
 * @default Monster
 *
 * @arg FaceIndex:num
 * @text Face Index
 * @parent EnemySprite
 * @type number
 * @desc This is the index for the target face graphic.
 * @default 1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command FieldGaugeClearEnemyGraphic
 * @text Enemy: Clear Field Gauge Graphic
 * @desc Clears the ATB Field Gauge graphics for the enemy(ies).
 * The settings will revert to the Plugin Parameter settings.
 *
 * @arg Enemies:arraynum
 * @text Enemy Index(es)
 * @type number[]
 * @desc Select which enemy index(es) to affect.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemFieldGaugeVisibility
 * @text System: ATB Field Gauge Visibility
 * @desc Determine the visibility of the ATB Field Gauge.
 *
 * @arg Visible:eval
 * @text Visibility
 * @type boolean
 * @on Visible
 * @off Hidden
 * @desc Changes the visibility of the ATB Field Gauge.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param BattleSystemATB
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Mechanics:struct
 * @text Mechanics Settings
 * @type struct<Mechanics>
 * @desc Mechanics settings used for Battle System ATB.
 * @default {"General":"","EscapeFailPenalty:num":"-1.00","StunsResetGauge:eval":"false","JavaScript":"","InitialGaugeJS:str":"Math.random() * 0.5","TpbSpeedCalcJS:func":"\"// Declare Constants\\nconst user = this;\\n\\n// Process Calculation\\nlet speed = Math.sqrt(user.agi) + 1;\\n\\n// Return Value\\nreturn speed;\"","TpbBaseSpeedCalcJS:func":"\"// Declare Constants\\nconst user = this;\\nconst baseAgility = user.paramBasePlus(6);\\n\\n// Process Calculation\\nlet speed = Math.sqrt(baseAgility) + 1;\\n\\n// Return Value\\nreturn speed;\"","BattlerRelativeSpeedJS:func":"\"// Declare Constants\\nconst user = this;\\nconst speed = user.tpbSpeed()\\nconst partyBaseSpeed = $gameParty.tpbBaseSpeed();\\n\\n// Process Calculation\\nlet relativeSpeed = speed / partyBaseSpeed;\\n\\n// Return Value\\nreturn relativeSpeed;\"","TpbAccelerationJS:func":"\"// Declare Constants\\nconst user = this;\\nconst speed = user.tpbRelativeSpeed();\\nconst referenceTime = $gameParty.tpbReferenceTime();\\n\\n// Process Calculation\\nlet acceleration = speed / referenceTime;\\n\\n// Return Value\\nreturn acceleration;\"","TpbCastTimeJS:func":"\"// Declare Constants\\nconst user = this;\\nconst actions = user._actions.filter(action => action.isValid());\\nconst items = actions.map(action => action.item());\\nconst delay = items.reduce((r, item) => r + Math.max(0, -item.speed), 0);\\n\\n// Process Calculation\\nlet time = Math.sqrt(delay) / user.tpbSpeed();\\n\\n// Return Value\\nreturn time;\""}
 *
 * @param Interrupt:struct
 * @text Interrupt Settings
 * @type struct<Interrupt>
 * @desc Interrupt settings used for Battle System ATB.
 * @default {"Interrupt":"","InterruptAnimationID:num":"11","InterruptMirror:eval":"false","InterruptMute:eval":"false","InterruptText:str":"INTERRUPTED!","InterruptTextColor:str":"0","InterruptFlashColor:eval":"[255, 0, 0, 160]","InterruptFlashDuration:num":"60"}
 *
 * @param Gauge:struct
 * @text General Gauge Settings
 * @type struct<Gauge>
 * @desc General gauge settings used for ATB Gauges.
 * @default {"General":"","AnchorX:num":"0.5","AnchorY:num":"1.0","Scale:num":"0.5","OffsetX:num":"0","OffsetY:num":"2","AGIGaugeRates":"","SlowRate:num":"0.60","FastRate:num":"1.40","Actors":"","ShowActorGauge:eval":"true","ShowStatusGauge:eval":"false","Enemies":"","ShowEnemyGauge:eval":"true"}
 *
 * @param FieldGauge:struct
 * @text Field Gauge Settings
 * @type struct<FieldGauge>
 * @desc Make a field-wide ATB gauge for all the battlers.
 * @default {"General":"","UseFieldGauge:eval":"false","DisplayPosition:str":"top","DisplayOffsetX:num":"0","DisplayOffsetY:num":"0","RepositionTopForHelp:eval":"true","GaugeDirection:eval":"true","Gauge":"","GaugeSystemSkin:str":"","DrawGauge:eval":"true","GaugeLengthHorz:num":"600","GaugeLengthVert:num":"400","GaugeThick:num":"16","GaugeSplit:num":"0.70","Reposition":"","RepositionTopHelpX:num":"0","RepositionTopHelpY:num":"48","Markers":"","ActorSide:eval":"true","EnemySide:eval":"false","MarkerOffset:num":"28","MarkerSize:num":"32","MarkerSpeed:num":"36","OpacityRate:num":"4","BorderThickness:num":"2","Border":"","ShowMarkerBorder:eval":"true","BorderActor":"","ActorBorderColor:str":"4","ActorSystemBorder:str":"","BorderEnemy":"","EnemyBorderColor:str":"2","EnemySystemBorder:str":"","Sprite":"","ActorSprite":"","ActorBattlerType:str":"face","ActorBattlerIcon:num":"84","EnemySprite":"","EnemyBattlerType:str":"enemy","EnemyBattlerFaceName:str":"Monster","EnemyBattlerFaceIndex:num":"1","EnemyBattlerIcon:num":"298","EnemyBattlerMatchHue:eval":"true","Letter":"","EnemyBattlerDrawLetter:eval":"true","EnemyBattlerFontFace:str":"","EnemyBattlerFontSize:num":"16","Background":"","ShowMarkerBg:eval":"true","BackgroundActor":"","ActorBgColor1:str":"1","ActorBgColor2:str":"9","ActorSystemBg:str":"","BackgroundEnemy":"","EnemyBgColor1:str":"10","EnemyBgColor2:str":"18","EnemySystemBg:str":"","Arrow":"","ShowMarkerArrow:eval":"true","MarkerArrowWindowSkin:str":"Window"}
 *
 * @param Color:struct
 * @text Gauge Color Settings
 * @type struct<Color>
 * @desc Gauge color settings used for ATB Gauges.
 * @default {"default1:str":"26","default2:str":"27","full1:str":"14","full2:str":"6","cast1:str":"2","cast2:str":"10","fast1:str":"27","fast2:str":"18","slow1:str":"22","slow2:str":"23","stop1:str":"7","stop2:str":"8"}
 *
 * @param Options:struct
 * @text Options Settings
 * @type struct<Options>
 * @desc Options settings used for Battle System ATB.
 * @default {"Options":"","AddOption:eval":"true","AdjustRect:eval":"true","Name:str":"Show ATB Gauges"}
 *
 * @param BreakEnd1
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param End Of
 * @default Plugin Parameters
 *
 * @param BreakEnd2
 * @text --------------------------
 * @default ----------------------------------
 *
 */
/* ----------------------------------------------------------------------------
 * Mechanics Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Mechanics:
 *
 * @param General
 * 
 * @param EscapeFailPenalty:num
 * @text Escape Fail Penalty
 * @parent General
 * @desc Gauge penalty if an escape attempt fails.
 * @default -1.00
 *
 * @param StunsResetGauge:eval
 * @text Stuns Reset Gauge?
 * @parent General
 * @type boolean
 * @on Reset Gauge
 * @off Don't Reset
 * @desc Should stuns reset the ATB Gauge?
 * @default false
 *
 * @param JavaScript
 *
 * @param InitialGaugeJS:str
 * @text JS: Initial Gauge
 * @parent JavaScript
 * @desc JavaScript code to determine how much ATB gauge to give
 * each battler at the start of battle.
 * @default Math.random() * 0.5
 *
 * @param TpbSpeedCalcJS:func
 * @text JS: Speed
 * @parent JavaScript
 * @type note
 * @desc JavaScript code to determine how much speed a battler has.
 * @default "// Declare Constants\nconst user = this;\n\n// Process Calculation\nlet speed = Math.sqrt(user.agi) + 1;\n\n// Return Value\nreturn speed;"
 * 
 * @param TpbBaseSpeedCalcJS:func
 * @text JS: Base Speed
 * @parent JavaScript
 * @type note
 * @desc JavaScript code to determine how much base speed a battler has.
 * @default "// Declare Constants\nconst user = this;\nconst baseAgility = user.paramBasePlus(6);\n\n// Process Calculation\nlet speed = Math.sqrt(baseAgility) + 1;\n\n// Return Value\nreturn speed;"
 * 
 * @param BattlerRelativeSpeedJS:func
 * @text JS: Relative Speed
 * @parent JavaScript
 * @type note
 * @desc JavaScript code to determine what is the relative speed of a battler.
 * @default "// Declare Constants\nconst user = this;\nconst speed = user.tpbSpeed()\nconst partyBaseSpeed = $gameParty.tpbBaseSpeed();\n\n// Process Calculation\nlet relativeSpeed = speed / partyBaseSpeed;\n\n// Return Value\nreturn relativeSpeed;"
 * 
 * @param TpbAccelerationJS:func
 * @text JS: Acceleration
 * @parent JavaScript
 * @type note
 * @desc JavaScript code to determine how much gauges accelerate by relative to reference time.
 * @default "// Declare Constants\nconst user = this;\nconst speed = user.tpbRelativeSpeed();\nconst referenceTime = $gameParty.tpbReferenceTime();\n\n// Process Calculation\nlet acceleration = speed / referenceTime;\n\n// Return Value\nreturn acceleration;"
 * 
 * @param TpbCastTimeJS:func
 * @text JS: Cast Time
 * @parent JavaScript
 * @type note
 * @desc JavaScript code to determine how much cast time is used for skills/items with negative speed modifiers.
 * @default "// Declare Constants\nconst user = this;\nconst actions = user._actions.filter(action => action.isValid());\nconst items = actions.map(action => action.item());\nconst delay = items.reduce((r, item) => r + Math.max(0, -item.speed), 0);\n\n// Process Calculation\nlet time = Math.sqrt(delay) / user.tpbSpeed();\n\n// Return Value\nreturn time;"
 * 
 */
/* ----------------------------------------------------------------------------
 * Interrupt Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Interrupt:
 *
 * @param Interrupt
 *
 * @param InterruptAnimationID:num
 * @text Animation ID
 * @parent Interrupt
 * @type animation
 * @desc Play this animation when a unit is interrupted.
 * Requires VisuMZ_0_CoreEngine.
 * @default 11
 *
 * @param InterruptMirror:eval
 * @text Mirror Animation
 * @parent InterruptAnimationID:num
 * @type boolean
 * @on Mirror
 * @off Normal
 * @desc Mirror the interrupt animation?
 * Requires VisuMZ_0_CoreEngine.
 * @default false
 *
 * @param InterruptMute:eval
 * @text Mute Animation
 * @parent InterruptAnimationID:num
 * @type boolean
 * @on Mute
 * @off Normal
 * @desc Mute the interrupt animation?
 * Requires VisuMZ_0_CoreEngine.
 * @default false
 *
 * @param InterruptText:str
 * @text Text Popup
 * @parent Interrupt
 * @desc Text used for popup when interrupts happen.
 * Leave empty for no popup.
 * @default INTERRUPTED!
 *
 * @param InterruptTextColor:str
 * @text Text Color
 * @parent InterruptText:str
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 0
 *
 * @param InterruptFlashColor:eval
 * @text Flash Color
 * @parent InterruptText:str
 * @desc Adjust the popup's flash color.
 * Format: [red, green, blue, alpha]
 * @default [255, 0, 0, 160]
 * 
 * @param InterruptFlashDuration:num
 * @text Flash Duration
 * @parent InterruptText:str
 * @type Number
 * @desc What is the frame duration of the flash effect?
 * @default 60
 *
 */
/* ----------------------------------------------------------------------------
 * Gauge Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Gauge:
 *
 * @param General
 *
 * @param AnchorX:num
 * @text Anchor X
 * @parent General
 * @desc Where do you want the ATB Gauge sprite's anchor X to be?
 * Use values between 0 and 1 to be safe.
 * @default 0.5
 *
 * @param AnchorY:num
 * @text Anchor Y
 * @parent General
 * @desc Where do you want the ATB Gauge sprite's anchor Y to be?
 * Use values between 0 and 1 to be safe.
 * @default 1.0
 *
 * @param Scale:num
 * @text Scale
 * @parent General
 * @desc How large/small do you want the ATB Gauge to be scaled?
 * @default 0.5
 *
 * @param OffsetX:num
 * @text Offset X
 * @parent General
 * @desc How many pixels to offset the ATB Gauge's X by?
 * @default 0
 *
 * @param OffsetY:num
 * @text Offset Y
 * @parent General
 * @desc How many pixels to offset the ATB Gauge's Y by?
 * @default 2
 *
 * @param AGIGaugeRates
 * @text AGI Gauge Rates
 *
 * @param SlowRate:num
 * @text Slow Rate
 * @parent AGIGaugeRates
 * @desc How much should the AGI rate be at to be considered slow?
 * @default 0.60
 *
 * @param FastRate:num
 * @text Fast Rate
 * @parent AGIGaugeRates
 * @desc How much should the AGI rate be at to be considered fast?
 * @default 1.40
 *
 * @param Actors
 *
 * @param ShowActorGauge:eval
 * @text Show Sprite Gauges
 * @parent Actors
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show ATB Gauges over the actor sprites' heads?
 * Requires SV Actors to be visible.
 * @default true
 *
 * @param ShowStatusGauge:eval
 * @text Show Status Gauges
 * @parent Actors
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show ATB Gauges in the status window?
 * Applies only to sideview.
 * @default false
 *
 * @param Enemies
 *
 * @param ShowEnemyGauge:eval
 * @text Show Sprite Gauges
 * @parent Enemies
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show ATB Gauges over the enemy sprites' heads?
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Color Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Color:
 *
 * @param default1:str
 * @text Default Color 1
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 26
 *
 * @param default2:str
 * @text Default Color 2
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 27
 *
 * @param full1:str
 * @text Full Color 1
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 14
 *
 * @param full2:str
 * @text Full Color 2
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 6
 *
 * @param cast1:str
 * @text Cast Color 1
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 2
 *
 * @param cast2:str
 * @text Cast Color 2
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 10
 *
 * @param fast1:str
 * @text Fast Color 1
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 27
 *
 * @param fast2:str
 * @text Fast Color 2
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 18
 *
 * @param slow1:str
 * @text Slow Color 1
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 22
 *
 * @param slow2:str
 * @text Slow Color 2
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 23
 *
 * @param stop1:str
 * @text Stop Color 1
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 7
 *
 * @param stop2:str
 * @text Stop Color 2
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 8
 *
 */
/* ----------------------------------------------------------------------------
 * Options Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Options:
 *
 * @param Options
 * @text Options
 *
 * @param AddOption:eval
 * @text Add Option?
 * @parent Options
 * @type boolean
 * @on Add
 * @off Don't Add
 * @desc Add the 'Show ATB Gauges' option to the Options menu?
 * @default true
 *
 * @param AdjustRect:eval
 * @text Adjust Window Height
 * @parent Options
 * @type boolean
 * @on Adjust
 * @off Don't
 * @desc Automatically adjust the options window height?
 * @default true
 *
 * @param Name:str
 * @text Option Name
 * @parent Options
 * @desc Command name of the option.
 * @default Show ATB Gauges
 *
 */
/* ----------------------------------------------------------------------------
 * Field Gauge Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~FieldGauge:
 *
 * @param General
 *
 * @param UseFieldGauge:eval
 * @text Use Field Gauge?
 * @parent General
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc This value must be set to true in order for the ATB Field Gauge to appear.
 * @default false
 *
 * @param DisplayPosition:str
 * @text Display Position
 * @parent General
 * @type select
 * @option top
 * @option bottom
 * @option left
 * @option right
 * @desc Select where the Field Gauge will appear on the screen.
 * @default top
 * 
 * @param DisplayOffsetX:num
 * @text Offset X
 * @parent DisplayPosition:str
 * @desc How much to offset the X coordinate by.
 * Negative: left. Positive: right.
 * @default 0
 * 
 * @param DisplayOffsetY:num
 * @text Offset Y
 * @parent DisplayPosition:str
 * @desc How much to offset the Y coordinate by.
 * Negative: up. Positive: down.
 * @default 0
 *
 * @param RepositionTopForHelp:eval
 * @text Reposition for Help?
 * @parent DisplayPosition:str
 * @type boolean
 * @on Reposition
 * @off Stay
 * @desc If the display position is at the top, reposition the
 * gauge when the help window is open?
 * @default true
 *
 * @param GaugeDirection:eval
 * @text Forward Direction
 * @parent General
 * @type boolean
 * @on Left to Right / Up to Down
 * @off Right to Left / Down to Up
 * @desc Decide on the direction of the Field Gauge.
 * Settings may vary depending on position.
 * @default true
 *
 * @param Gauge
 * @text Field Gauge Settings
 *
 * @param GaugeSystemSkin:str
 * @text Gauge Skin
 * @parent Gauge
 * @type file
 * @dir img/system/
 * @desc Optional. Select an image to place behind the gauge.
 * This will be centered on the Field Gauge's position.
 * @default 
 *
 * @param DrawGauge:eval
 * @text Show Gauge?
 * @parent Gauge
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Decide if you want the gauge to be shown.
 * @default true
 *
 * @param GaugeLengthHorz:num
 * @text Horizontal Length
 * @parent Gauge
 * @type number
 * @min 10
 * @desc The length of the Field Gauge if placed horizontally.
 * @default 600
 *
 * @param GaugeLengthVert:num
 * @text Vertical Length
 * @parent Gauge
 * @type number
 * @min 10
 * @desc The length of the Field Gauge if placed vertically.
 * @default 400
 *
 * @param GaugeThick:num
 * @text Thickness
 * @parent Gauge
 * @type number
 * @min 3
 * @desc The thickness of the Field Gauge for either direction.
 * @default 16
 *
 * @param GaugeSplit:num
 * @text Split Location
 * @parent Gauge
 * @desc Determine where the gauge should split.
 * Use 0.00 for the start. Use 1.00 for the end.
 * @default 0.70
 * 
 * @param Reposition
 * @text Reposition For Help
 *
 * @param RepositionTopHelpX:num
 * @text Repostion X By
 * @parent Reposition
 * @desc Reposition the gauge's X coordinates by this much when
 * the Help Window is visible.
 * @default 0
 *
 * @param RepositionTopHelpY:num
 * @text Repostion Y By
 * @parent Reposition
 * @desc Reposition the gauge's Y coordinates by this much when
 * the Help Window is visible.
 * @default 48
 *
 * @param Markers
 * @text Marker Sprites
 *
 * @param ActorSide:eval
 * @text Actor Marker Side
 * @parent Markers
 * @type boolean
 * @on Top / Right
 * @off Bottom / Left
 * @desc Which side do you want the actor markers to appear?
 * @default true
 *
 * @param EnemySide:eval
 * @text Enemy Marker Side
 * @parent Markers
 * @type boolean
 * @on Top / Right
 * @off Bottom / Left
 * @desc Which side do you want the enemy markers to appear?
 * @default false
 *
 * @param MarkerOffset:num
 * @text Marker Offset
 * @parent Markers
 * @desc How many pixels do you want to offset the markers by?
 * @default 28
 *
 * @param MarkerSize:num
 * @text Marker Size
 * @parent Markers
 * @type number
 * @min 10
 * @desc How pixels wide and tall do you want the markers to be?
 * @default 32
 *
 * @param MarkerSpeed:num
 * @text Marker Speed
 * @parent Markers
 * @type number
 * @min 1
 * @desc How many pixels maximum can a marker travel in one frame?
 * @default 36
 *
 * @param OpacityRate:num
 * @text Opacity Rate
 * @parent Markers
 * @type number
 * @min 1
 * @desc If a marker has to change opacity, how fast should it change by?
 * @default 4
 *
 * @param Border
 * @text Marker Border
 *
 * @param ShowMarkerBorder:eval
 * @text Show Border?
 * @parent Border
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show borders for the marker sprites?
 * @default true
 *
 * @param BorderThickness:num
 * @text Border Thickness
 * @parent Markers
 * @type number
 * @min 1
 * @desc How many pixels thick should the colored portion of the border be?
 * @default 2
 *
 * @param BorderActor
 * @text Actors
 * @parent Border
 *
 * @param ActorBorderColor:str
 * @text Border Color
 * @parent BorderActor
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 4
 *
 * @param ActorSystemBorder:str
 * @text Border Skin
 * @parent BorderActor
 * @type file
 * @dir img/system/
 * @desc Optional. Place a skin on the actor borders instead of rendering them?
 * @default 
 *
 * @param BorderEnemy
 * @text Enemies
 * @parent Border
 *
 * @param EnemyBorderColor:str
 * @text Border Color
 * @parent BorderEnemy
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 2
 *
 * @param EnemySystemBorder:str
 * @text Border Skin
 * @parent BorderEnemy
 * @type file
 * @dir img/system/
 * @desc Optional. Place a skin on the enemy borders instead of rendering them?
 * @default 
 *
 * @param Sprite
 * @text Marker Sprites
 *
 * @param ActorSprite
 * @text Actors
 * @parent Sprite
 *
 * @param ActorBattlerType:str
 * @text Sprite Type
 * @parent ActorSprite
 * @type select
 * @option Face Graphic - Show the actor's face.
 * @value face
 * @option Icon - Show a specified icon.
 * @value icon
 * @option Sideview Actor - Show the actor's sideview battler.
 * @value svactor
 * @desc Select the type of sprite used for the actor graphic.
 * @default face
 *
 * @param ActorBattlerIcon:num
 * @text Default Icon
 * @parent ActorSprite
 * @desc Which icon do you want to use for actors by default?
 * @default 84
 *
 * @param EnemySprite
 * @text Enemies
 * @parent Sprite
 *
 * @param EnemyBattlerType:str
 * @text Sprite Type
 * @parent EnemySprite
 * @type select
 * @option Face Graphic - Show a specified face graphic.
 * @value face
 * @option Icon - Show a specified icon.
 * @value icon
 * @option Enemy - Show the enemy's graphic or sideview battler.
 * @value enemy
 * @desc Select the type of sprite used for the enemy graphic.
 * @default enemy
 *
 * @param EnemyBattlerFaceName:str
 * @text Default Face Name
 * @parent EnemySprite
 * @type file
 * @dir img/faces/
 * @desc Use this default face graphic if there is no specified face.
 * @default Monster
 *
 * @param EnemyBattlerFaceIndex:num
 * @text Default Face Index
 * @parent EnemySprite
 * @type number
 * @desc Use this default face index if there is no specified index.
 * @default 1
 *
 * @param EnemyBattlerIcon:num
 * @text Default Icon
 * @parent EnemySprite
 * @desc Which icon do you want to use for enemies by default?
 * @default 298
 *
 * @param EnemyBattlerMatchHue:eval
 * @text Match Hue?
 * @parent EnemySprite
 * @type boolean
 * @on Match
 * @off Don't Match
 * @desc Match the hue for enemy battlers?
 * Does not apply if there's a sideview battler.
 * @default true
 *
 * @param Letter
 * @text Marker Letter
 *
 * @param EnemyBattlerDrawLetter:eval
 * @text Show Enemy Letter?
 * @parent Letter
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show the enemy's letter on the marker sprite?
 * @default true
 *
 * @param EnemyBattlerFontFace:str
 * @text Font Name
 * @parent Letter
 * @desc The font name used for the text of the Letter.
 * Leave empty to use the default game's font.
 * @default 
 *
 * @param EnemyBattlerFontSize:num
 * @text Font Size
 * @parent Letter
 * @min 1
 * @desc The font size used for the text of the Letter.
 * @default 16
 *
 * @param Background
 * @text Marker Background
 *
 * @param ShowMarkerBg:eval
 * @text Show Background?
 * @parent Background
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show the background on the marker sprite?
 * @default true
 *
 * @param BackgroundActor
 * @text Actors
 * @parent Background
 *
 * @param ActorBgColor1:str
 * @text Background Color 1
 * @parent BackgroundActor
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 1
 *
 * @param ActorBgColor2:str
 * @text Background Color 2
 * @parent BackgroundActor
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 9
 *
 * @param ActorSystemBg:str
 * @text Background Skin
 * @parent BackgroundActor
 * @type file
 * @dir img/system/
 * @desc Optional. Use a skin for the actor background instead of rendering them?
 * @default 
 *
 * @param BackgroundEnemy
 * @text Enemies
 * @parent Background
 *
 * @param EnemyBgColor1:str
 * @text Background Color 1
 * @parent BackgroundEnemy
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 10
 *
 * @param EnemyBgColor2:str
 * @text Background Color 2
 * @parent BackgroundEnemy
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 18
 *
 * @param EnemySystemBg:str
 * @text Background Skin
 * @parent BackgroundEnemy
 * @type file
 * @dir img/system/
 * @desc Optional. Use a skin for the enemy background instead of rendering them?
 * @default 
 *
 * @param Arrow
 * @text Marker Arrow
 *
 * @param ShowMarkerArrow:eval
 * @text Show Arrow?
 * @parent Arrow
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show the arrow sprite pointing towards the Field Gauge?
 * @default true
 *
 * @param MarkerArrowWindowSkin:str
 * @text Arrow Skin
 * @parent Arrow
 * @type file
 * @dir img/system/
 * @desc Pick a window skin to draw arrows from.
 * @default Window
 *
 */
//=============================================================================

const _0x12eacb=_0xba38;(function(_0x13bd8a,_0x1fc8d8){const _0x3a0767=_0xba38,_0x2fb941=_0x13bd8a();while(!![]){try{const _0x3d08b4=-parseInt(_0x3a0767(0x1ed))/0x1*(-parseInt(_0x3a0767(0x1d2))/0x2)+-parseInt(_0x3a0767(0xee))/0x3*(parseInt(_0x3a0767(0x2c0))/0x4)+parseInt(_0x3a0767(0x27e))/0x5+parseInt(_0x3a0767(0x258))/0x6*(-parseInt(_0x3a0767(0x2b8))/0x7)+-parseInt(_0x3a0767(0x221))/0x8+-parseInt(_0x3a0767(0x213))/0x9+parseInt(_0x3a0767(0x10f))/0xa*(parseInt(_0x3a0767(0x12a))/0xb);if(_0x3d08b4===_0x1fc8d8)break;else _0x2fb941['push'](_0x2fb941['shift']());}catch(_0x13f73d){_0x2fb941['push'](_0x2fb941['shift']());}}}(_0x4f06,0x525c2));function _0xba38(_0x566214,_0x198f87){const _0x4f0648=_0x4f06();return _0xba38=function(_0xba3885,_0x1475a4){_0xba3885=_0xba3885-0xc5;let _0x47a357=_0x4f0648[_0xba3885];return _0x47a357;},_0xba38(_0x566214,_0x198f87);}var label=_0x12eacb(0x18e),tier=tier||0x0,dependencies=[_0x12eacb(0x2a5)],pluginData=$plugins[_0x12eacb(0x278)](function(_0x53c437){const _0x41415c=_0x12eacb;return _0x53c437[_0x41415c(0x2ae)]&&_0x53c437['description'][_0x41415c(0x21c)]('['+label+']');})[0x0];VisuMZ[label][_0x12eacb(0x1db)]=VisuMZ[label][_0x12eacb(0x1db)]||{},VisuMZ[_0x12eacb(0x204)]=function(_0x1b5147,_0x123e8c){const _0x1e3672=_0x12eacb;for(const _0x1f7774 in _0x123e8c){if(_0x1f7774[_0x1e3672(0xc7)](/(.*):(.*)/i)){const _0x53c7a6=String(RegExp['$1']),_0x46277c=String(RegExp['$2'])['toUpperCase']()[_0x1e3672(0x131)]();let _0x2fd60d,_0x184df9,_0x2ddb65;switch(_0x46277c){case _0x1e3672(0x23e):_0x2fd60d=_0x123e8c[_0x1f7774]!==''?Number(_0x123e8c[_0x1f7774]):0x0;break;case _0x1e3672(0x191):_0x184df9=_0x123e8c[_0x1f7774]!==''?JSON['parse'](_0x123e8c[_0x1f7774]):[],_0x2fd60d=_0x184df9[_0x1e3672(0x15a)](_0x2c1698=>Number(_0x2c1698));break;case'EVAL':_0x2fd60d=_0x123e8c[_0x1f7774]!==''?eval(_0x123e8c[_0x1f7774]):null;break;case _0x1e3672(0xef):_0x184df9=_0x123e8c[_0x1f7774]!==''?JSON[_0x1e3672(0x134)](_0x123e8c[_0x1f7774]):[],_0x2fd60d=_0x184df9['map'](_0x5c37fa=>eval(_0x5c37fa));break;case _0x1e3672(0x27d):_0x2fd60d=_0x123e8c[_0x1f7774]!==''?JSON[_0x1e3672(0x134)](_0x123e8c[_0x1f7774]):'';break;case _0x1e3672(0x1c3):_0x184df9=_0x123e8c[_0x1f7774]!==''?JSON[_0x1e3672(0x134)](_0x123e8c[_0x1f7774]):[],_0x2fd60d=_0x184df9['map'](_0x33ca47=>JSON['parse'](_0x33ca47));break;case _0x1e3672(0x2da):_0x2fd60d=_0x123e8c[_0x1f7774]!==''?new Function(JSON['parse'](_0x123e8c[_0x1f7774])):new Function(_0x1e3672(0x11e));break;case'ARRAYFUNC':_0x184df9=_0x123e8c[_0x1f7774]!==''?JSON[_0x1e3672(0x134)](_0x123e8c[_0x1f7774]):[],_0x2fd60d=_0x184df9['map'](_0x5bc9ad=>new Function(JSON[_0x1e3672(0x134)](_0x5bc9ad)));break;case _0x1e3672(0x1d8):_0x2fd60d=_0x123e8c[_0x1f7774]!==''?String(_0x123e8c[_0x1f7774]):'';break;case _0x1e3672(0x1aa):_0x184df9=_0x123e8c[_0x1f7774]!==''?JSON[_0x1e3672(0x134)](_0x123e8c[_0x1f7774]):[],_0x2fd60d=_0x184df9[_0x1e3672(0x15a)](_0x4ba659=>String(_0x4ba659));break;case _0x1e3672(0x2bd):_0x2ddb65=_0x123e8c[_0x1f7774]!==''?JSON[_0x1e3672(0x134)](_0x123e8c[_0x1f7774]):{},_0x2fd60d=VisuMZ[_0x1e3672(0x204)]({},_0x2ddb65);break;case _0x1e3672(0xd6):_0x184df9=_0x123e8c[_0x1f7774]!==''?JSON[_0x1e3672(0x134)](_0x123e8c[_0x1f7774]):[],_0x2fd60d=_0x184df9['map'](_0x8294dc=>VisuMZ[_0x1e3672(0x204)]({},JSON['parse'](_0x8294dc)));break;default:continue;}_0x1b5147[_0x53c7a6]=_0x2fd60d;}}return _0x1b5147;},(_0x1e6758=>{const _0xd58594=_0x12eacb,_0xb2f929=_0x1e6758[_0xd58594(0x288)];for(const _0x4ebab4 of dependencies){if(_0xd58594(0x1ab)!==_0xd58594(0x1ab)){if(!_0x2f8c4d['VisuMZ_2_AggroControlSystem'])return![];if(this[_0xd58594(0x297)]&&this[_0xd58594(0x297)][_0xd58594(0x284)]())return![];const _0x5e874b=_0x3eb161[_0xd58594(0x269)]['Settings']['Aggro'];if(!_0x5e874b[_0xd58594(0x1a2)])return![];if(!_0x91ba73[_0xd58594(0x2ac)])return![];const _0x5a14b4=_0x4baeb7['BattleSystemATB'][_0xd58594(0x1db)][_0xd58594(0x10c)];return _0x5e874b[_0xd58594(0x167)]===_0x5a14b4['Scale']&&_0x5e874b[_0xd58594(0x16d)]===_0x5a14b4[_0xd58594(0x16d)]&&_0x5e874b['AnchorY']===_0x5a14b4[_0xd58594(0x159)]&&_0x5e874b[_0xd58594(0x283)]===_0x5a14b4[_0xd58594(0x283)]&&_0x5e874b[_0xd58594(0x2ca)]===_0x5a14b4['OffsetY']&&!![];}else{if(!Imported[_0x4ebab4]){alert(_0xd58594(0xd4)[_0xd58594(0x2c6)](_0xb2f929,_0x4ebab4)),SceneManager['exit']();break;}}}const _0xb9e792=_0x1e6758['description'];if(_0xb9e792[_0xd58594(0xc7)](/\[Version[ ](.*?)\]/i)){if(_0xd58594(0x2be)!==_0xd58594(0xdb)){const _0x3907a8=Number(RegExp['$1']);_0x3907a8!==VisuMZ[label][_0xd58594(0x1a6)]&&(alert(_0xd58594(0x133)[_0xd58594(0x2c6)](_0xb2f929,_0x3907a8)),SceneManager[_0xd58594(0x103)]());}else this[_0xd58594(0x2a3)]=this['createFieldAtbGraphicType']();}if(_0xb9e792[_0xd58594(0xc7)](/\[Tier[ ](\d+)\]/i)){const _0x51066a=Number(RegExp['$1']);if(_0x51066a<tier){if(_0xd58594(0x1bf)===_0xd58594(0x1bf))alert(_0xd58594(0x1b1)[_0xd58594(0x2c6)](_0xb2f929,_0x51066a,tier)),SceneManager[_0xd58594(0x103)]();else return this[_0xd58594(0x127)]();}else tier=Math[_0xd58594(0x281)](_0x51066a,tier);}VisuMZ[_0xd58594(0x204)](VisuMZ[label][_0xd58594(0x1db)],_0x1e6758[_0xd58594(0x117)]);})(pluginData),PluginManager[_0x12eacb(0x2a0)](pluginData[_0x12eacb(0x288)],_0x12eacb(0x295),_0x39c113=>{const _0x15741c=_0x12eacb;VisuMZ[_0x15741c(0x204)](_0x39c113,_0x39c113);const _0x26dba3=_0x39c113[_0x15741c(0x111)],_0x2aa396=_0x39c113['IconIndex'];for(const _0x4ddf1e of _0x26dba3){const _0x587dad=$gameActors[_0x15741c(0xce)](_0x4ddf1e);if(!_0x587dad)continue;_0x587dad[_0x15741c(0x2a3)]='icon',_0x587dad[_0x15741c(0x1c5)]=_0x2aa396;}}),PluginManager[_0x12eacb(0x2a0)](pluginData['name'],'FieldGaugeActorFace',_0x10c913=>{const _0x501780=_0x12eacb;VisuMZ['ConvertParams'](_0x10c913,_0x10c913);const _0x277dd7=_0x10c913['Actors'],_0x4a0252=_0x10c913[_0x501780(0x107)],_0x849b50=_0x10c913['FaceIndex'];for(const _0x1b5681 of _0x277dd7){if(_0x501780(0x1df)!==_0x501780(0x29a)){const _0x140fb6=$gameActors[_0x501780(0xce)](_0x1b5681);if(!_0x140fb6)continue;_0x140fb6[_0x501780(0x2a3)]=_0x501780(0x274),_0x140fb6[_0x501780(0x29e)]=_0x4a0252,_0x140fb6[_0x501780(0x1eb)]=_0x849b50;}else{const _0x28a1e3=_0x2ba17d['Settings'],_0x2f68bc=_0x28a1e3[_0x501780(0x128)];this[_0x501780(0x218)][_0x501780(0x18d)]=new _0x3fd96e(_0x2f68bc,_0x2f68bc);const _0xc7f875=this[_0x501780(0x218)][_0x501780(0x18d)],_0x4b2bf1=_0x28bf6f[_0x501780(0x27f)](0x1,_0x2f68bc/_0x1e081c[_0x501780(0x1d3)],_0x2f68bc/_0x3cc6db['height']),_0x11e5d8=_0x1e806c[_0x501780(0x1d3)]*_0x4b2bf1,_0x2c6e14=_0x1d4b05[_0x501780(0x16e)]*_0x4b2bf1,_0x52c62e=_0x192a8a[_0x501780(0xd0)]((_0x2f68bc-_0x11e5d8)/0x2),_0x51ef19=_0x21373c[_0x501780(0xd0)]((_0x2f68bc-_0x2c6e14)/0x2);_0xc7f875[_0x501780(0x2d8)](_0x23343a,0x0,0x0,_0x20e0f7[_0x501780(0x1d3)],_0x50eeca[_0x501780(0x16e)],_0x52c62e,_0x51ef19,_0x11e5d8,_0x2c6e14);}}}),PluginManager[_0x12eacb(0x2a0)](pluginData[_0x12eacb(0x288)],_0x12eacb(0x186),_0x1820ee=>{const _0x13ea09=_0x12eacb;VisuMZ[_0x13ea09(0x204)](_0x1820ee,_0x1820ee);const _0x420bdc=_0x1820ee[_0x13ea09(0x111)];for(const _0x799800 of _0x420bdc){if(_0x13ea09(0x2cd)!==_0x13ea09(0x1c8)){const _0x3a8011=$gameActors[_0x13ea09(0xce)](_0x799800);if(!_0x3a8011)continue;_0x3a8011[_0x13ea09(0xf2)]();}else{if(this[_0x13ea09(0x20a)]!==_0x4160fa)return this[_0x13ea09(0x20a)];const _0xdc4690=_0x25679d[_0x13ea09(0x1db)]['DisplayPosition'];return this[_0x13ea09(0x20a)]=[_0x13ea09(0x275),_0x13ea09(0x29c)][_0x13ea09(0x21c)](_0xdc4690),this[_0x13ea09(0x20a)];}}}),PluginManager[_0x12eacb(0x2a0)](pluginData[_0x12eacb(0x288)],'FieldGaugeEnemyIcon',_0x4fc02c=>{const _0x2e62ca=_0x12eacb;VisuMZ[_0x2e62ca(0x204)](_0x4fc02c,_0x4fc02c);const _0x382d77=_0x4fc02c['Enemies'],_0x185593=_0x4fc02c['IconIndex'];for(const _0x4bb9cf of _0x382d77){if(_0x2e62ca(0x291)!==_0x2e62ca(0x298)){const _0x23697f=$gameTroop[_0x2e62ca(0x270)]()[_0x4bb9cf];if(!_0x23697f)continue;_0x23697f['_fieldAtbGaugeGraphicType']=_0x2e62ca(0xe8),_0x23697f['_fieldAtbGaugeIconIndex']=_0x185593;}else{const _0x11ca44=_0x42b753(_0x24c3d4['$1']);_0x11ca44<_0x5f59eb?(_0x1dd24c(_0x2e62ca(0x1b1)[_0x2e62ca(0x2c6)](_0x454c97,_0x11ca44,_0x3670ae)),_0x419b27[_0x2e62ca(0x103)]()):_0x28d719=_0x12d94c[_0x2e62ca(0x281)](_0x11ca44,_0x5dab3d);}}}),PluginManager[_0x12eacb(0x2a0)](pluginData[_0x12eacb(0x288)],'FieldGaugeEnemyFace',_0x47d284=>{const _0x45ef1d=_0x12eacb;VisuMZ[_0x45ef1d(0x204)](_0x47d284,_0x47d284);const _0x2938a0=_0x47d284[_0x45ef1d(0x116)],_0x3d3cda=_0x47d284[_0x45ef1d(0x107)],_0x5c8383=_0x47d284[_0x45ef1d(0x139)];for(const _0x26965c of _0x2938a0){if(_0x45ef1d(0x21f)===_0x45ef1d(0x2c9))this['_gaugeSprite'][_0x45ef1d(0x16f)](this[_0x45ef1d(0x2ba)]);else{const _0x241cb8=$gameTroop['members']()[_0x26965c];if(!_0x241cb8)continue;_0x241cb8[_0x45ef1d(0x2a3)]=_0x45ef1d(0x274),_0x241cb8[_0x45ef1d(0x29e)]=_0x3d3cda,_0x241cb8[_0x45ef1d(0x1eb)]=_0x5c8383;}}}),PluginManager[_0x12eacb(0x2a0)](pluginData[_0x12eacb(0x288)],'FieldGaugeClearEnemyGraphic',_0x1090d1=>{const _0x5d33d5=_0x12eacb;VisuMZ['ConvertParams'](_0x1090d1,_0x1090d1);const _0x34fdb2=_0x1090d1[_0x5d33d5(0x116)];for(const _0x7fb658 of _0x34fdb2){const _0x47a281=$gameTroop[_0x5d33d5(0x270)]()[_0x7fb658];if(!_0x47a281)continue;_0x47a281[_0x5d33d5(0xf2)]();}}),PluginManager[_0x12eacb(0x2a0)](pluginData['name'],_0x12eacb(0x15b),_0xd78b3d=>{const _0x4ee9b5=_0x12eacb;VisuMZ[_0x4ee9b5(0x204)](_0xd78b3d,_0xd78b3d);const _0x2cc462=_0xd78b3d[_0x4ee9b5(0x15e)];$gameSystem[_0x4ee9b5(0x2d0)](_0x2cc462);}),VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x192)]=Scene_Boot[_0x12eacb(0x1ec)]['onDatabaseLoaded'],Scene_Boot[_0x12eacb(0x1ec)][_0x12eacb(0x1b9)]=function(){const _0x419536=_0x12eacb;this[_0x419536(0x247)](),VisuMZ[_0x419536(0x18e)]['Scene_Boot_onDatabaseLoaded'][_0x419536(0x185)](this),this[_0x419536(0x2d9)]();},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x2c4)]={},Scene_Boot[_0x12eacb(0x1ec)][_0x12eacb(0x247)]=function(){const _0x37215a=_0x12eacb,_0x39e43e=VisuMZ[_0x37215a(0x119)]['RegExp'],_0x2c28bc=_0x37215a(0x2dd),_0x37f59e=[_0x37215a(0xcb),_0x37215a(0x25e),'After'];for(const _0x2c716a of _0x37f59e){if(_0x37215a(0x280)!==_0x37215a(0x18c)){const _0x5229e9=_0x2c28bc['format'](_0x2c716a[_0x37215a(0x2b9)]()[_0x37215a(0x131)](),'(?:ATB|TPB)',_0x37215a(0x2d4)),_0x180952=new RegExp(_0x5229e9,'i');VisuMZ['BattleSystemATB'][_0x37215a(0x2c4)][_0x2c716a]=_0x180952;}else return this[_0x37215a(0x1c5)]===_0x5bdebf&&(this[_0x37215a(0x1c5)]=this[_0x37215a(0x121)]()),this[_0x37215a(0x1c5)];}},Scene_Boot[_0x12eacb(0x1ec)][_0x12eacb(0x2d9)]=function(){const _0xc843e9=_0x12eacb;if(VisuMZ['ParseAllNotetags'])return;const _0x5c1745=$dataSkills[_0xc843e9(0x1a0)]($dataItems);for(const _0x5cf107 of _0x5c1745){if(!_0x5cf107)continue;VisuMZ['BattleSystemATB'][_0xc843e9(0x260)](_0x5cf107);}},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x1a8)]=VisuMZ['ParseSkillNotetags'],VisuMZ['ParseSkillNotetags']=function(_0x1911e4){const _0x41e135=_0x12eacb;VisuMZ[_0x41e135(0x18e)][_0x41e135(0x1a8)][_0x41e135(0x185)](this,_0x1911e4),VisuMZ['BattleSystemATB'][_0x41e135(0x260)](_0x1911e4);},VisuMZ[_0x12eacb(0x18e)]['ParseItemNotetags']=VisuMZ['ParseItemNotetags'],VisuMZ[_0x12eacb(0x105)]=function(_0x55d91b){const _0x599751=_0x12eacb;VisuMZ[_0x599751(0x18e)][_0x599751(0x105)][_0x599751(0x185)](this,_0x55d91b),VisuMZ['BattleSystemATB'][_0x599751(0x260)](_0x55d91b);},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x260)]=function(_0xa977b2){const _0x26b46c=_0x12eacb,_0x2ef1b2=[_0x26b46c(0xcb),_0x26b46c(0x25e),_0x26b46c(0x112)];for(const _0x206c68 of _0x2ef1b2){VisuMZ['BattleSystemATB']['createJS'](_0xa977b2,_0x206c68);}},VisuMZ[_0x12eacb(0x18e)]['JS']={},VisuMZ[_0x12eacb(0x18e)]['createJS']=function(_0x5b59df,_0x51200a){const _0x12c385=_0x12eacb,_0x4e8168=_0x5b59df[_0x12c385(0x1f3)];if(_0x4e8168[_0x12c385(0xc7)](VisuMZ[_0x12c385(0x18e)][_0x12c385(0x2c4)][_0x51200a])){const _0x450db1=String(RegExp['$1']),_0x317435='\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Declare\x20Variables\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20arguments[0];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20arguments[1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20keyType\x20=\x20\x27%2\x27;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20rate\x20=\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(keyType\x20===\x20\x27Charge\x27)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20rate\x20=\x20target._tpbChargeTime;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20else\x20if\x20(keyType\x20===\x20\x27Cast\x27)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20rate\x20=\x20target._tpbCastTime\x20/\x20Math.max(target.tpbRequiredCastTime(),\x201);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20originalValue\x20=\x20rate;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Process\x20Code\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20NaN\x20Check\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(isNaN(rate)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20console.log(\x27NaN\x20rate\x20created\x20by\x20%2\x27.format(\x27\x27,obj.name));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20console.log(\x27Restoring\x20rate\x20to\x20%2\x27.format(\x27\x27,originalValue));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20rate\x20=\x20originalValue;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Return\x20Value\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20rate;\x0a\x20\x20\x20\x20\x20\x20\x20\x20'[_0x12c385(0x2c6)](_0x450db1,_0x51200a),_0x2b641a=VisuMZ[_0x12c385(0x18e)][_0x12c385(0xfa)](_0x5b59df,_0x51200a);VisuMZ[_0x12c385(0x18e)]['JS'][_0x2b641a]=new Function(_0x317435);}},VisuMZ['BattleSystemATB']['createKeyJS']=function(_0x3508a7,_0x286c0e){const _0x494f28=_0x12eacb;let _0x238f89='';if($dataActors['includes'](_0x3508a7))_0x238f89=_0x494f28(0x1e5)[_0x494f28(0x2c6)](_0x3508a7['id'],_0x286c0e);if($dataClasses[_0x494f28(0x21c)](_0x3508a7))_0x238f89=_0x494f28(0x1e4)[_0x494f28(0x2c6)](_0x3508a7['id'],_0x286c0e);if($dataSkills[_0x494f28(0x21c)](_0x3508a7))_0x238f89='Skill-%1-%2'[_0x494f28(0x2c6)](_0x3508a7['id'],_0x286c0e);if($dataItems[_0x494f28(0x21c)](_0x3508a7))_0x238f89=_0x494f28(0x11f)[_0x494f28(0x2c6)](_0x3508a7['id'],_0x286c0e);if($dataWeapons[_0x494f28(0x21c)](_0x3508a7))_0x238f89=_0x494f28(0x26c)[_0x494f28(0x2c6)](_0x3508a7['id'],_0x286c0e);if($dataArmors[_0x494f28(0x21c)](_0x3508a7))_0x238f89=_0x494f28(0x1d0)['format'](_0x3508a7['id'],_0x286c0e);if($dataEnemies[_0x494f28(0x21c)](_0x3508a7))_0x238f89=_0x494f28(0xcf)[_0x494f28(0x2c6)](_0x3508a7['id'],_0x286c0e);if($dataStates[_0x494f28(0x21c)](_0x3508a7))_0x238f89=_0x494f28(0x187)[_0x494f28(0x2c6)](_0x3508a7['id'],_0x286c0e);return _0x238f89;},ConfigManager[_0x12eacb(0x23d)]=!![],VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x132)]=ConfigManager['makeData'],ConfigManager[_0x12eacb(0x1f0)]=function(){const _0x53d19d=_0x12eacb,_0x2fe6ed=VisuMZ[_0x53d19d(0x18e)][_0x53d19d(0x132)]['call'](this);return _0x2fe6ed[_0x53d19d(0x23d)]=this[_0x53d19d(0x23d)],_0x2fe6ed;},VisuMZ['BattleSystemATB'][_0x12eacb(0x287)]=ConfigManager[_0x12eacb(0x22c)],ConfigManager[_0x12eacb(0x22c)]=function(_0x4aab68){const _0x5d807a=_0x12eacb;VisuMZ[_0x5d807a(0x18e)][_0x5d807a(0x287)][_0x5d807a(0x185)](this,_0x4aab68);if(_0x5d807a(0x23d)in _0x4aab68){if('kVTbf'!==_0x5d807a(0x19a)){const _0x41c6f7=this[_0x5d807a(0x17d)]();if(!_0x41c6f7)return;const _0x46b82b=_0x41c6f7[_0x5d807a(0x17d)]();if(!_0x46b82b)return;const _0x3057cb=_0x46b82b[_0x5d807a(0x100)]();if(!_0x3057cb)return;this[_0x5d807a(0x19f)](_0x3057cb['_blendColor']);}else this[_0x5d807a(0x23d)]=_0x4aab68[_0x5d807a(0x23d)];}else{if(_0x5d807a(0x285)===_0x5d807a(0x285))this[_0x5d807a(0x23d)]=!![];else return _0x524b0f(_0x146bcb['$2']);}},TextManager[_0x12eacb(0x23d)]=VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x1db)][_0x12eacb(0x27a)][_0x12eacb(0x188)],VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x2af)]=ColorManager[_0x12eacb(0x2dc)],ColorManager[_0x12eacb(0x2dc)]=function(){const _0x595eff=_0x12eacb;VisuMZ[_0x595eff(0x18e)][_0x595eff(0x2af)][_0x595eff(0x185)](this),this[_0x595eff(0x1bd)][_0x595eff(0x19b)](this[_0x595eff(0x1c6)][_0x595eff(0x154)](this));},ColorManager[_0x12eacb(0x2a8)]=function(_0x160762){const _0x3c3068=_0x12eacb;return _0x160762=String(_0x160762),_0x160762['match'](/#(.*)/i)?_0x3c3068(0x29b)[_0x3c3068(0x2c6)](String(RegExp['$1'])):_0x3c3068(0x21e)==='cJKeI'?(this['_fieldAtbGaugeGraphicType']===_0x427fab&&(this['_fieldAtbGaugeGraphicType']=this[_0x3c3068(0x21d)]()),this['_fieldAtbGaugeGraphicType']):this[_0x3c3068(0x1c0)](Number(_0x160762));},ColorManager[_0x12eacb(0x1c6)]=function(){const _0x19e68b=_0x12eacb,_0xe10c29=['default','full',_0x19e68b(0x1a7),_0x19e68b(0x217),_0x19e68b(0x203),'stop'],_0x101690=VisuMZ['BattleSystemATB'][_0x19e68b(0x1db)][_0x19e68b(0x2c1)];this[_0x19e68b(0x115)]={};for(const _0x11ee3a of _0xe10c29){for(let _0x1edc97=0x1;_0x1edc97<=0x2;_0x1edc97++){const _0x3e8c4a=_0x11ee3a+_0x1edc97;this[_0x19e68b(0x115)][_0x3e8c4a]=this[_0x19e68b(0x2a8)](_0x101690[_0x3e8c4a]);}}},ColorManager['atbColor']=function(_0x1b9aba){const _0x2589b3=_0x12eacb;if(this[_0x2589b3(0x115)]===undefined)this[_0x2589b3(0x1c6)]();return this[_0x2589b3(0x115)][_0x1b9aba]||'#000000';},SceneManager[_0x12eacb(0x176)]=function(){const _0x1b924d=_0x12eacb;return this[_0x1b924d(0xea)]&&this[_0x1b924d(0xea)]['constructor']===Scene_Battle;},BattleManager[_0x12eacb(0x1e1)]=function(){const _0x1bb31a=_0x12eacb;if(Imported[_0x1bb31a(0xf0)]&&this['isCTB']())return![];return this[_0x1bb31a(0x2aa)]();},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x1bb)]=BattleManager[_0x12eacb(0x232)],BattleManager[_0x12eacb(0x232)]=function(){const _0x5c13b7=_0x12eacb;if(!this[_0x5c13b7(0x2aa)]())return![];else return ConfigManager&&ConfigManager[_0x5c13b7(0x178)]!==undefined?ConfigManager[_0x5c13b7(0x178)]:_0x5c13b7(0x219)===_0x5c13b7(0x145)?_0x13ff49[_0x5c13b7(0x18e)][_0x5c13b7(0x1ff)][_0x5c13b7(0x185)](this):VisuMZ['BattleSystemATB'][_0x5c13b7(0x1bb)][_0x5c13b7(0x185)](this);},VisuMZ[_0x12eacb(0x18e)]['Game_System_initialize']=Game_System[_0x12eacb(0x1ec)][_0x12eacb(0x290)],Game_System[_0x12eacb(0x1ec)]['initialize']=function(){const _0x24c8b4=_0x12eacb;VisuMZ[_0x24c8b4(0x18e)][_0x24c8b4(0x189)][_0x24c8b4(0x185)](this),this['initBattleSystemATB']();},Game_System[_0x12eacb(0x1ec)][_0x12eacb(0xca)]=function(){const _0x4c10fb=_0x12eacb;this[_0x4c10fb(0x1fb)]=!![];},Game_System['prototype'][_0x12eacb(0xde)]=function(){const _0x3b2227=_0x12eacb;return this[_0x3b2227(0x1fb)]===undefined&&(_0x3b2227(0x20c)!==_0x3b2227(0x20c)?(_0x5b0a58[_0x3b2227(0x18e)][_0x3b2227(0x2a1)][_0x3b2227(0x185)](this),_0x2d4e4c[_0x3b2227(0x2aa)]()&&this[_0x3b2227(0x2b1)]()):this[_0x3b2227(0xca)]()),this[_0x3b2227(0x1fb)];},Game_System['prototype'][_0x12eacb(0x2d0)]=function(_0x16135b){const _0x46096b=_0x12eacb;this[_0x46096b(0x1fb)]===undefined&&this[_0x46096b(0xca)](),this[_0x46096b(0x1fb)]=_0x16135b;},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x216)]=Game_Action[_0x12eacb(0x1ec)][_0x12eacb(0xff)],Game_Action[_0x12eacb(0x1ec)][_0x12eacb(0xff)]=function(_0x1d7998){const _0x3c771d=_0x12eacb;VisuMZ[_0x3c771d(0x18e)]['Game_Action_applyItemUserEffect']['call'](this,_0x1d7998),this[_0x3c771d(0x2cf)](_0x1d7998);},Game_Action[_0x12eacb(0x1ec)][_0x12eacb(0x2cf)]=function(_0x5cce0e){const _0x2307e6=_0x12eacb;if(!SceneManager['isSceneBattle']())return;if(!BattleManager['isATB']())return;if(this[_0x2307e6(0x2a2)]())this[_0x2307e6(0x2bc)](_0x5cce0e);},Game_Action['prototype']['applyItemBattleSystemATBUserEffect']=function(_0x390511){const _0x567eba=_0x12eacb,_0x14c3fb=this['item']()[_0x567eba(0x1f3)];if(_0x390511[_0x567eba(0x2ab)]()){if(_0x567eba(0x25c)===_0x567eba(0x249))_0x3458cc[_0x567eba(0x1e0)](_0x38d52b(_0x265b13['$1'])*0.01);else{const _0x3c8764=VisuMZ[_0x567eba(0x18e)][_0x567eba(0xfa)](this[_0x567eba(0x2a2)](),'Charge');if(VisuMZ[_0x567eba(0x18e)]['JS'][_0x3c8764]){const _0x1d049a=VisuMZ[_0x567eba(0x18e)]['JS'][_0x3c8764][_0x567eba(0x185)](this,this['subject'](),_0x390511);_0x390511['setAtbChargeTime'](_0x1d049a);}_0x14c3fb[_0x567eba(0xc7)](/<(?:ATB|TPB) CHARGE (?:GAUGE|TIME|SPEED):[ ](\d+)([%％])>/i)&&_0x390511['setAtbChargeTime'](Number(RegExp['$1'])*0.01),_0x14c3fb['match'](/<(?:ATB|TPB) CHARGE (?:GAUGE|TIME|SPEED):[ ]([\+\-]\d+)([%％])>/i)&&_0x390511[_0x567eba(0x26f)](Number(RegExp['$1'])*0.01);}}else{if(_0x390511[_0x567eba(0x1b3)]()){if(_0x567eba(0x1cb)==='stNEW'){const _0x1c43ce=VisuMZ[_0x567eba(0x18e)][_0x567eba(0xfa)](this[_0x567eba(0x2a2)](),'Cast');if(VisuMZ[_0x567eba(0x18e)]['JS'][_0x1c43ce]){const _0x1ecf1b=VisuMZ[_0x567eba(0x18e)]['JS'][_0x1c43ce][_0x567eba(0x185)](this,this[_0x567eba(0x1fe)](),_0x390511);_0x390511['setAtbCastTime'](_0x1ecf1b);}if(_0x14c3fb[_0x567eba(0xc7)](/<(?:ATB|TPB) CAST (?:GAUGE|TIME|SPEED):[ ](\d+)([%％])>/i)){if('eHuMB'!=='mLfGq')_0x390511[_0x567eba(0x173)](Number(RegExp['$1'])*0.01);else{if(this[_0x567eba(0x11c)]!==_0x68aaf6['svBattlerName']())return this[_0x567eba(0x127)]();}}_0x14c3fb['match'](/<(?:ATB|TPB) CAST (?:GAUGE|TIME|SPEED):[ ]([\+\-]\d+)([%％])>/i)&&_0x390511[_0x567eba(0x2b5)](Number(RegExp['$1'])*0.01);if(_0x14c3fb[_0x567eba(0xc7)](/<(?:ATB|TPB) INTERRUPT>/i)){if(_0x567eba(0x17e)!==_0x567eba(0x17e))return _0x12b64d[_0x567eba(0x18e)][_0x567eba(0x1bb)]['call'](this);else _0x390511['atbInterrupt']();}}else _0x2ebe36[_0x567eba(0x16a)]=![];}}},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x28c)]=Game_Action[_0x12eacb(0x1ec)][_0x12eacb(0x161)],Game_Action[_0x12eacb(0x1ec)]['applyGlobal']=function(){const _0x37b59a=_0x12eacb;VisuMZ[_0x37b59a(0x18e)][_0x37b59a(0x28c)][_0x37b59a(0x185)](this),this[_0x37b59a(0x10e)]();},Game_Action[_0x12eacb(0x1ec)][_0x12eacb(0x10e)]=function(){const _0x377938=_0x12eacb;if(!this[_0x377938(0x2a2)]())return;if(!BattleManager[_0x377938(0x1e1)]())return;const _0x3e1ebc=this[_0x377938(0x2a2)]()[_0x377938(0x1f3)];let _0x164731=0x0;this[_0x377938(0x292)]&&(_0x164731=this[_0x377938(0x1fe)]()[_0x377938(0x238)]);const _0x453230=VisuMZ[_0x377938(0x18e)][_0x377938(0xfa)](this[_0x377938(0x2a2)](),_0x377938(0x112));VisuMZ['BattleSystemATB']['JS'][_0x453230]&&(_0x164731+=VisuMZ['BattleSystemATB']['JS'][_0x453230][_0x377938(0x185)](this,this[_0x377938(0x1fe)](),this[_0x377938(0x1fe)]()));let _0x55b681=this['item']()[_0x377938(0x251)]>0x0?this[_0x377938(0x2a2)]()[_0x377938(0x251)]:0x0;if(this[_0x377938(0xd3)]())_0x55b681+=this['subject']()[_0x377938(0x271)]();_0x164731+=(_0x55b681/0xfa0)[_0x377938(0x106)](0x0,0x1);this[_0x377938(0x2a2)]()[_0x377938(0x1f3)][_0x377938(0xc7)](/<(?:ATB|TPB) AFTER (?:GAUGE|TIME|SPEED):[ ](\d+)([%％])>/i)&&(_0x164731+=Number(RegExp['$1'])*0.01);const _0x5ad548=this['subject']()[_0x377938(0x1cf)]()[_0x377938(0x1a0)](this[_0x377938(0x1fe)]()['skills']()),_0x5e1128=/<(?:ATB|TPB) AFTER (?:GAUGE|TIME|SPEED):[ ]([\+\-]\d+)([%％])>/i,_0x532710=_0x5ad548[_0x377938(0x15a)](_0x111073=>_0x111073&&_0x111073[_0x377938(0x1f3)][_0x377938(0xc7)](_0x5e1128)?Number(RegExp['$1'])*0.01:0x0);_0x164731=_0x532710['reduce']((_0x1546b3,_0x4f1ccd)=>_0x1546b3+_0x4f1ccd,_0x164731),this[_0x377938(0x2a2)]()[_0x377938(0x1f3)]['match'](/<(?:ATB|TPB) INSTANT>/i)&&(_0x377938(0x1da)===_0x377938(0x136)?(this['y']=_0x12b384[_0x377938(0x1e7)]/0x2,this['y']+=_0x4cf16b?-_0x3fa7ac:_0x3311dd):_0x164731=0xa),this['subject']()[_0x377938(0x196)](_0x164731);},Game_BattlerBase[_0x12eacb(0x1ec)][_0x12eacb(0x1e0)]=function(_0x5b21cb){const _0x5ea257=_0x12eacb;this[_0x5ea257(0x238)]=_0x5b21cb[_0x5ea257(0x106)](0x0,0x1);},Game_BattlerBase[_0x12eacb(0x1ec)][_0x12eacb(0x26f)]=function(_0xa410e3){const _0x8c05cd=_0x12eacb;this[_0x8c05cd(0x1e0)](this[_0x8c05cd(0x238)]+_0xa410e3);},Game_BattlerBase[_0x12eacb(0x1ec)][_0x12eacb(0x173)]=function(_0x475952){const _0x588ebe=_0x12eacb,_0x26298c=this[_0x588ebe(0x18a)]();this['_tpbCastTime']=(_0x26298c*_0x475952)[_0x588ebe(0x106)](0x0,_0x26298c);},Game_BattlerBase[_0x12eacb(0x1ec)][_0x12eacb(0x2b5)]=function(_0x5ded4b){const _0x2ea60b=_0x12eacb,_0x229db3=this[_0x2ea60b(0x18a)](),_0x46a298=_0x229db3*_0x5ded4b;this[_0x2ea60b(0xfb)]=(this[_0x2ea60b(0xfb)]+_0x46a298)[_0x2ea60b(0x106)](0x0,_0x229db3);},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0xd9)]=Game_BattlerBase[_0x12eacb(0x1ec)][_0x12eacb(0x25a)],Game_BattlerBase[_0x12eacb(0x1ec)]['die']=function(){const _0x5079e6=_0x12eacb;VisuMZ[_0x5079e6(0x18e)]['Game_BattlerBase_die']['call'](this),BattleManager[_0x5079e6(0x2aa)]()&&this[_0x5079e6(0x2b1)]();},VisuMZ['BattleSystemATB']['Game_BattlerBase_revive']=Game_BattlerBase[_0x12eacb(0x1ec)][_0x12eacb(0x214)],Game_BattlerBase[_0x12eacb(0x1ec)][_0x12eacb(0x214)]=function(){const _0x31fb96=_0x12eacb;VisuMZ['BattleSystemATB'][_0x31fb96(0x2a1)]['call'](this),BattleManager[_0x31fb96(0x2aa)]()&&this[_0x31fb96(0x2b1)]();},VisuMZ[_0x12eacb(0x18e)]['Game_Battler_initTpbChargeTime']=Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x223)],Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x223)]=function(_0x5134a4){const _0x19acad=_0x12eacb;BattleManager[_0x19acad(0x1e1)]()?_0x19acad(0x26b)===_0x19acad(0x15f)?(this['createFieldGaugeSkin'](),this[_0x19acad(0x12f)](),this[_0x19acad(0x14b)]()):this['initTpbChargeTimeATB'](_0x5134a4):VisuMZ['BattleSystemATB'][_0x19acad(0x110)][_0x19acad(0x185)](this,_0x5134a4);},Game_Battler['prototype'][_0x12eacb(0x265)]=function(_0x15b884){const _0x3c87fc=_0x12eacb,_0x4870d0=VisuMZ[_0x3c87fc(0x18e)][_0x3c87fc(0x1db)][_0x3c87fc(0x12d)];let _0x512428=this[_0x3c87fc(0x207)]()*eval(_0x4870d0['InitialGaugeJS']);const _0x590c36=this['traitObjects']()['concat'](this[_0x3c87fc(0x10b)]()),_0x287e27=/<(?:ATB|TPB) (?:BATTLE START|START) (?:GAUGE|TIME|SPEED): ([\+\-]\d+)([%％])>/i,_0x1e192e=_0x590c36[_0x3c87fc(0x15a)](_0x5bc8dd=>_0x5bc8dd&&_0x5bc8dd[_0x3c87fc(0x1f3)][_0x3c87fc(0xc7)](_0x287e27)?Number(RegExp['$1'])*0.01:0x0);_0x512428=_0x1e192e[_0x3c87fc(0x182)]((_0x596e48,_0x2b81a8)=>_0x596e48+_0x2b81a8,_0x512428),this[_0x3c87fc(0x28e)]=_0x3c87fc(0x143),this[_0x3c87fc(0x238)]=(_0x15b884?0x1:_0x512428)['clamp'](0x0,0x1),this[_0x3c87fc(0x1c7)]()&&(this[_0x3c87fc(0x238)]=0x0);},Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x2ab)]=function(){const _0x1abeea=_0x12eacb;return this[_0x1abeea(0x28e)]==='charging';},Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x1b3)]=function(){const _0x52aad2=_0x12eacb;return this['_tpbState']===_0x52aad2(0x17c)&&this[_0x52aad2(0x163)]()&&this['currentAction']()[_0x52aad2(0x2a2)]()&&this[_0x52aad2(0x163)]()[_0x52aad2(0x2a2)]()[_0x52aad2(0x251)]<0x0;},Game_BattlerBase[_0x12eacb(0x1ec)][_0x12eacb(0x235)]=function(){const _0x3fca35=_0x12eacb;if(this[_0x3fca35(0x1b3)]()){if('CiPhW'!==_0x3fca35(0x24c))_0x2bbc9b[_0x3fca35(0x18e)][_0x3fca35(0x175)](_0x8a99b,_0x297ca4);else return this['_tpbCastTime']/this[_0x3fca35(0x18a)]();}else return 0x0;},Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x109)]=function(){return!this['canMove']();},Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x196)]=function(_0x4ccbcb){const _0x57bd73=_0x12eacb;this[_0x57bd73(0x27b)]=_0x4ccbcb;},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x1e9)]=Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x2b1)],Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x2b1)]=function(){const _0x3ae777=_0x12eacb;if(this[_0x3ae777(0x14e)])return;VisuMZ[_0x3ae777(0x18e)][_0x3ae777(0x1e9)][_0x3ae777(0x185)](this),this[_0x3ae777(0x238)]+=this[_0x3ae777(0x27b)]||0x0;},Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0xcd)]=function(){const _0x4e3215=_0x12eacb;if(!this['isAtbCastingState']())return;if(!this[_0x4e3215(0x163)]())return;if(!this[_0x4e3215(0x163)]()[_0x4e3215(0x2a2)]())return;if(this[_0x4e3215(0x163)]()[_0x4e3215(0x2a2)]()[_0x4e3215(0x1f3)][_0x4e3215(0xc7)](/<(?:ATB|TPB) CANNOT (?:BE INTERRUPTED|INTERRUPT)>/i))return;this[_0x4e3215(0x22e)](),this['clearTpbChargeTime'](),this['_tpbCastTime']=0x0,this[_0x4e3215(0x17a)]();},Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x17a)]=function(){const _0x3e7047=_0x12eacb,_0x74c0b1=VisuMZ[_0x3e7047(0x18e)][_0x3e7047(0x1db)][_0x3e7047(0x20e)];if(Imported[_0x3e7047(0xeb)]){const _0x3212f0=_0x74c0b1[_0x3e7047(0x239)],_0x577fb7=_0x74c0b1['InterruptMirror'],_0x506f07=_0x74c0b1[_0x3e7047(0x158)];$gameTemp['requestFauxAnimation']([this],_0x3212f0,_0x577fb7,_0x506f07);}if(this['battler']()&&_0x74c0b1[_0x3e7047(0x166)]['length']>0x0){const _0x64996=_0x74c0b1[_0x3e7047(0x166)],_0x9dfae9={'textColor':ColorManager[_0x3e7047(0x2a8)](_0x74c0b1[_0x3e7047(0x2c7)]),'flashColor':_0x74c0b1[_0x3e7047(0xe9)],'flashDuration':_0x74c0b1[_0x3e7047(0x162)]};this[_0x3e7047(0x28f)](_0x64996,_0x9dfae9);}},VisuMZ['BattleSystemATB'][_0x12eacb(0x264)]=Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x262)],Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x262)]=function(){const _0x18080c=_0x12eacb;VisuMZ[_0x18080c(0x18e)][_0x18080c(0x264)][_0x18080c(0x185)](this),BattleManager['isATB']()&&(this[_0x18080c(0xfb)]>=this[_0x18080c(0x18a)]()&&(this[_0x18080c(0x28e)]=_0x18080c(0x2d7)));},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0xe4)]=Game_Unit['prototype']['updateTpb'],Game_Unit['prototype'][_0x12eacb(0x152)]=function(){const _0x202f41=_0x12eacb;if(BattleManager[_0x202f41(0x1e1)]()){if('zUpRc'!==_0x202f41(0x289)){if(BattleManager[_0x202f41(0x244)]()[_0x202f41(0xe6)](_0x489c10=>_0x489c10&&_0x489c10[_0x202f41(0x263)]()&&_0x489c10['isAppeared']()&&_0x489c10[_0x202f41(0x28e)]===_0x202f41(0x2d7)))return;}else{const _0x3fd28f=this['battler']();if(!_0x3fd28f)return 0x0;if(_0x3fd28f[_0x202f41(0x155)]())return 0x0;if(_0x3fd28f[_0x202f41(0xe3)]())return 0x0;return 0xff;}}VisuMZ['BattleSystemATB']['Game_Unit_updateTpb'][_0x202f41(0x185)](this);},VisuMZ[_0x12eacb(0x18e)]['Game_Battler_onRestrict']=Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x11a)],Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x11a)]=function(){const _0x5ab5f1=_0x12eacb;!VisuMZ[_0x5ab5f1(0x18e)]['Settings'][_0x5ab5f1(0x12d)][_0x5ab5f1(0x151)]&&(_0x5ab5f1(0x1e8)===_0x5ab5f1(0x2de)?(_0x23ff36=_0x32954e-0x1,_0x3a14f0=_0x118e4a-0x3-_0x3107f6,_0x503cc2['gradientFillRect'](0x1,0x2+_0x413796,_0x31e7ea-0x2,_0xde637c,_0x407ea5,_0xe2e11c,!![]),_0x7a8919[_0x5ab5f1(0x120)](0x1,0x1,_0x5879f7-0x2,_0x2ce53f,_0x1a66b5,_0x36edb0,!![])):this[_0x5ab5f1(0x14e)]=BattleManager[_0x5ab5f1(0x1e1)]()),VisuMZ[_0x5ab5f1(0x18e)]['Game_Battler_onRestrict'][_0x5ab5f1(0x185)](this),this['_onRestrictBypassAtbReset']=undefined;},VisuMZ[_0x12eacb(0x18e)]['Game_Battler_applyTpbPenalty']=Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x1d9)],Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x1d9)]=function(){const _0x4fc4bf=_0x12eacb;BattleManager[_0x4fc4bf(0x1e1)]()?this[_0x4fc4bf(0xfe)]():_0x4fc4bf(0x181)===_0x4fc4bf(0x13a)?this[_0x4fc4bf(0x1ea)](_0x4618d5,_0x1bd24f):VisuMZ['BattleSystemATB'][_0x4fc4bf(0x28d)][_0x4fc4bf(0x185)](this);},Game_Battler['prototype'][_0x12eacb(0xfe)]=function(){const _0x4102d4=_0x12eacb;this[_0x4102d4(0x28e)]=_0x4102d4(0x143),this[_0x4102d4(0x238)]+=VisuMZ['BattleSystemATB'][_0x4102d4(0x1db)]['Mechanics'][_0x4102d4(0x14f)]||0x0;},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x2d2)]=Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0xe1)],Game_Battler['prototype'][_0x12eacb(0xe1)]=function(){const _0x506ad5=_0x12eacb;if(BattleManager[_0x506ad5(0x1e1)]())return VisuMZ[_0x506ad5(0x18e)][_0x506ad5(0x1db)][_0x506ad5(0x12d)][_0x506ad5(0xf1)]['call'](this,this);else{if(_0x506ad5(0x197)!==_0x506ad5(0x197)){if(this['x']>_0x54300e)this['x']=_0x41ef3c['max'](_0x47ebef,this['x']-_0x24ebd0);if(this['x']<_0x1826bb)this['x']=_0x38aea2[_0x506ad5(0x27f)](_0x5e690b,this['x']+_0x28b47b);}else return VisuMZ['BattleSystemATB'][_0x506ad5(0x2d2)][_0x506ad5(0x185)](this);}},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x2ad)]=Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x226)],Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x226)]=function(){const _0x58ab5b=_0x12eacb;return BattleManager[_0x58ab5b(0x1e1)]()?VisuMZ['BattleSystemATB'][_0x58ab5b(0x1db)][_0x58ab5b(0x12d)][_0x58ab5b(0x1cd)][_0x58ab5b(0x185)](this,this):VisuMZ['BattleSystemATB'][_0x58ab5b(0x2ad)][_0x58ab5b(0x185)](this);},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x1ae)]=Game_Battler['prototype'][_0x12eacb(0x207)],Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x207)]=function(){const _0x4b48ac=_0x12eacb;if(BattleManager[_0x4b48ac(0x1e1)]())return VisuMZ[_0x4b48ac(0x18e)]['Settings'][_0x4b48ac(0x12d)][_0x4b48ac(0x1dd)][_0x4b48ac(0x185)](this,this);else{if('lRRhc'==='lRRhc')return VisuMZ[_0x4b48ac(0x18e)][_0x4b48ac(0x1ae)][_0x4b48ac(0x185)](this);else this[_0x4b48ac(0xca)]();}},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x1ff)]=Game_Battler['prototype'][_0x12eacb(0x1cc)],Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x1cc)]=function(){const _0x430b22=_0x12eacb;if(BattleManager['isATB']())return this[_0x430b22(0x1f7)]();else{if(_0x430b22(0x25f)===_0x430b22(0x25f))return VisuMZ['BattleSystemATB'][_0x430b22(0x1ff)][_0x430b22(0x185)](this);else _0x243d52=_0x5f14ba*_0x54127a;}},Game_Battler[_0x12eacb(0x1ec)]['atbAcceleration']=function(){const _0x12cd10=_0x12eacb;let _0x42c8b8=VisuMZ[_0x12cd10(0x18e)]['Settings'][_0x12cd10(0x12d)][_0x12cd10(0x22a)][_0x12cd10(0x185)](this,this);if(ConfigManager&&ConfigManager[_0x12cd10(0x17f)]!==undefined){if(_0x12cd10(0x17b)!==_0x12cd10(0x129)){const _0x25e16c=ConfigManager[_0x12cd10(0x17f)]-0x3;if(_0x25e16c>0x0)return _0x42c8b8*(_0x25e16c*0x2);else{if(_0x25e16c<0x0){if(_0x12cd10(0x1e3)!==_0x12cd10(0x1e3))_0x284ae7[_0x12cd10(0x18e)]['Game_System_initialize']['call'](this),this[_0x12cd10(0xca)]();else return _0x42c8b8*(0x1/(_0x25e16c*-0x2));}}}else this[_0x12cd10(0x290)](...arguments);}return _0x42c8b8;},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x10a)]=Game_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x18a)],Game_Battler['prototype']['tpbRequiredCastTime']=function(){const _0x263141=_0x12eacb;if(BattleManager['isATB']()){if('vxVrT'===_0x263141(0xd8))return VisuMZ['BattleSystemATB'][_0x263141(0x1db)][_0x263141(0x12d)]['TpbCastTimeJS'][_0x263141(0x185)](this,this);else{const _0x2787d2=_0x4f1645(_0x28368b['$1']);_0x2787d2!==_0x4db239[_0x4c3529][_0x263141(0x1a6)]&&(_0x308d8d(_0x263141(0x133)['format'](_0x6994d,_0x2787d2)),_0x22c1fc[_0x263141(0x103)]());}}else return VisuMZ[_0x263141(0x18e)][_0x263141(0x10a)]['call'](this);},VisuMZ[_0x12eacb(0x18e)]['Scene_Options_maxCommands']=Scene_Options['prototype'][_0x12eacb(0x1a9)],Scene_Options[_0x12eacb(0x1ec)]['maxCommands']=function(){const _0x29fc75=_0x12eacb;let _0x334082=VisuMZ[_0x29fc75(0x18e)][_0x29fc75(0x193)][_0x29fc75(0x185)](this);const _0x535ed7=VisuMZ['BattleSystemATB']['Settings'];if(_0x535ed7[_0x29fc75(0x27a)][_0x29fc75(0xfd)]&&_0x535ed7[_0x29fc75(0x27a)][_0x29fc75(0x22d)]&&BattleManager[_0x29fc75(0x1e1)]())_0x334082++;return _0x334082;},Sprite_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x177)]=function(){const _0x391027=_0x12eacb;if(!BattleManager[_0x391027(0x1e1)]())return;if(!ConfigManager[_0x391027(0x23d)])return;const _0x183d1b=VisuMZ[_0x391027(0x18e)][_0x391027(0x1db)][_0x391027(0x10c)],_0x5c36c3=new Sprite_Gauge();_0x5c36c3[_0x391027(0x208)]['x']=_0x183d1b[_0x391027(0x16d)],_0x5c36c3[_0x391027(0x208)]['y']=_0x183d1b[_0x391027(0x159)],_0x5c36c3[_0x391027(0x11d)]['x']=_0x5c36c3[_0x391027(0x11d)]['y']=_0x183d1b[_0x391027(0x167)],this['_atbGaugeSprite']=_0x5c36c3,this[_0x391027(0xf4)](this[_0x391027(0x1a4)]);},VisuMZ['BattleSystemATB'][_0x12eacb(0x1b0)]=Sprite_Battler[_0x12eacb(0x1ec)]['setBattler'],Sprite_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x172)]=function(_0x2412f0){const _0x3e083f=_0x12eacb;VisuMZ['BattleSystemATB'][_0x3e083f(0x1b0)][_0x3e083f(0x185)](this,_0x2412f0),this[_0x3e083f(0x211)](_0x2412f0),this[_0x3e083f(0x245)]();},Sprite_Battler[_0x12eacb(0x1ec)]['setupAtbGaugeSprite']=function(_0x47dd75){const _0x3ae7ba=_0x12eacb;if(!_0x47dd75)return;if(!this[_0x3ae7ba(0x1a4)])return;if(_0x47dd75[_0x3ae7ba(0x2b6)]()){}else{if(_0x47dd75['isEnemy']()){if(this[_0x3ae7ba(0x2a9)]===Sprite_Enemy&&_0x47dd75[_0x3ae7ba(0x190)]())return;if(this[_0x3ae7ba(0x2a9)]===Sprite_SvEnemy&&!_0x47dd75[_0x3ae7ba(0x190)]())return;}}this[_0x3ae7ba(0x1a4)][_0x3ae7ba(0xe5)](_0x47dd75,'time');},Sprite_Battler['prototype']['updateAtbGaugeSpriteVisibility']=function(){const _0x2819ac=_0x12eacb;if(!this['_atbGaugeSprite'])return;const _0x4b51bb=this[_0x2819ac(0x297)]&&this['_battler'][_0x2819ac(0x1a5)]()&&!this['_battler'][_0x2819ac(0x155)]();this[_0x2819ac(0x1a4)][_0x2819ac(0x16a)]=_0x4b51bb,this[_0x2819ac(0x215)]&&this[_0x2819ac(0x215)][_0x2819ac(0x1a4)]&&(this[_0x2819ac(0x215)][_0x2819ac(0x1a4)][_0x2819ac(0x16a)]=_0x4b51bb);},VisuMZ['BattleSystemATB'][_0x12eacb(0x2c3)]=Sprite_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x1f6)],Sprite_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x1f6)]=function(){const _0x3b6a79=_0x12eacb;VisuMZ[_0x3b6a79(0x18e)][_0x3b6a79(0x2c3)][_0x3b6a79(0x185)](this),this[_0x3b6a79(0x1e2)]();},Sprite_Battler[_0x12eacb(0x1ec)]['updateAtbGaugeSpritePosition']=function(){const _0x336a2a=_0x12eacb;if(!this[_0x336a2a(0x297)])return;if(!this[_0x336a2a(0x1a4)])return;const _0x534a8e=VisuMZ[_0x336a2a(0x18e)][_0x336a2a(0x1db)][_0x336a2a(0x10c)],_0x550d9d=this['_atbGaugeSprite'];let _0x1a6df2=_0x534a8e[_0x336a2a(0x283)];this[_0x336a2a(0x297)][_0x336a2a(0x206)]&&(_0x1a6df2+=this['_battler'][_0x336a2a(0x206)]());let _0x4ffa36=_0x534a8e[_0x336a2a(0x2ca)];this[_0x336a2a(0x297)]['battleUIOffsetY']&&(_0x4ffa36+=this['_battler'][_0x336a2a(0x253)]());_0x550d9d['x']=_0x1a6df2,_0x550d9d['y']=-this[_0x336a2a(0x16e)]+_0x4ffa36;if(this[_0x336a2a(0x297)]['isEnemy']()){if('JAupw'!==_0x336a2a(0x266)){const _0x34c9b1=this[_0x336a2a(0x17d)]();if(!_0x34c9b1)return;if(!_0x34c9b1[_0x336a2a(0x284)]())return;if(this['_graphicHue']===_0x34c9b1['battlerHue']())return;this[_0x336a2a(0x1c9)]=_0x34c9b1[_0x336a2a(0x1ce)]();if(_0x34c9b1['hasSvBattler']())this[_0x336a2a(0x1c9)]=0x0;this[_0x336a2a(0x218)]['setHue'](this[_0x336a2a(0x1c9)]);}else this[_0x336a2a(0x297)][_0x336a2a(0x14d)]()[_0x336a2a(0x1f3)][_0x336a2a(0xc7)](/<HIDE (?:ATB|TPB) GAUGE>/i)&&(_0x550d9d[_0x336a2a(0x16a)]=![]);}this[_0x336a2a(0x225)]()&&(_0x336a2a(0x272)!==_0x336a2a(0x272)?this[_0x336a2a(0x290)](...arguments):_0x550d9d['y']+=_0x550d9d['gaugeHeight']()*_0x534a8e[_0x336a2a(0x167)]-0x1),this['scale']['x']<0x0&&(_0x550d9d[_0x336a2a(0x11d)]['x']=-Math[_0x336a2a(0x2b3)](_0x550d9d[_0x336a2a(0x11d)]['x']));},Sprite_Battler[_0x12eacb(0x1ec)][_0x12eacb(0x225)]=function(){const _0x9f2344=_0x12eacb;if(!Imported['VisuMZ_2_AggroControlSystem'])return![];if(this['_battler']&&this[_0x9f2344(0x297)]['isEnemy']())return![];const _0x221d16=VisuMZ['AggroControlSystem'][_0x9f2344(0x1db)][_0x9f2344(0x144)];if(!_0x221d16[_0x9f2344(0x1a2)])return![];if(!ConfigManager[_0x9f2344(0x2ac)])return![];const _0x30e7bd=VisuMZ[_0x9f2344(0x18e)]['Settings'][_0x9f2344(0x10c)];return _0x221d16[_0x9f2344(0x167)]===_0x30e7bd[_0x9f2344(0x167)]&&_0x221d16[_0x9f2344(0x16d)]===_0x30e7bd[_0x9f2344(0x16d)]&&_0x221d16['AnchorY']===_0x30e7bd[_0x9f2344(0x159)]&&_0x221d16['OffsetX']===_0x30e7bd[_0x9f2344(0x283)]&&_0x221d16[_0x9f2344(0x2ca)]===_0x30e7bd[_0x9f2344(0x2ca)]&&!![];},VisuMZ['BattleSystemATB'][_0x12eacb(0x1f5)]=Sprite_Battler[_0x12eacb(0x1ec)]['update'],Sprite_Battler['prototype'][_0x12eacb(0x28a)]=function(){const _0x378cf0=_0x12eacb;VisuMZ[_0x378cf0(0x18e)][_0x378cf0(0x1f5)][_0x378cf0(0x185)](this),!this[_0x378cf0(0x297)]&&this[_0x378cf0(0x1a4)]&&(this[_0x378cf0(0x1a4)][_0x378cf0(0x16a)]=![],this[_0x378cf0(0x215)]&&(this['_svBattlerSprite'][_0x378cf0(0x1a4)][_0x378cf0(0x16a)]=![]));},VisuMZ['BattleSystemATB'][_0x12eacb(0x114)]=Sprite_Actor['prototype'][_0x12eacb(0x156)],Sprite_Actor['prototype'][_0x12eacb(0x156)]=function(){const _0x4c344c=_0x12eacb;VisuMZ[_0x4c344c(0x18e)][_0x4c344c(0x114)][_0x4c344c(0x185)](this),VisuMZ[_0x4c344c(0x18e)][_0x4c344c(0x1db)][_0x4c344c(0x10c)][_0x4c344c(0x130)]&&this['createAtbGaugeSprite']();},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0xed)]=Sprite_Enemy[_0x12eacb(0x1ec)]['createStateIconSprite'],Sprite_Enemy[_0x12eacb(0x1ec)][_0x12eacb(0x170)]=function(){const _0x9aff05=_0x12eacb;VisuMZ['BattleSystemATB']['Settings'][_0x9aff05(0x10c)]['ShowEnemyGauge']&&this[_0x9aff05(0x177)](),VisuMZ['BattleSystemATB']['Sprite_Enemy_createStateIconSprite'][_0x9aff05(0x185)](this);},VisuMZ['BattleSystemATB']['Sprite_Enemy_startEffect']=Sprite_Enemy['prototype'][_0x12eacb(0xe7)],Sprite_Enemy[_0x12eacb(0x1ec)][_0x12eacb(0xe7)]=function(_0x2a8fd0){const _0x2e21b9=_0x12eacb;VisuMZ[_0x2e21b9(0x18e)]['Sprite_Enemy_startEffect'][_0x2e21b9(0x185)](this,_0x2a8fd0);if(_0x2a8fd0===_0x2e21b9(0xc8)||_0x2e21b9(0x2bb)){if(_0x2e21b9(0x202)===_0x2e21b9(0x15d)){const _0x2aece2=this[_0x2e21b9(0x18a)]();this['_tpbCastTime']=(_0x2aece2*_0x538dc8)[_0x2e21b9(0x106)](0x0,_0x2aece2);}else this['updateAtbGaugeSpriteVisibility']();}},VisuMZ['BattleSystemATB'][_0x12eacb(0x1c2)]=Game_BattlerBase[_0x12eacb(0x1ec)][_0x12eacb(0xc8)],Game_BattlerBase['prototype']['appear']=function(){const _0x40707c=_0x12eacb;VisuMZ[_0x40707c(0x18e)][_0x40707c(0x1c2)][_0x40707c(0x185)](this);if(this['isEnemy']()&&BattleManager[_0x40707c(0x1e1)]()&&this['battler']()){if(_0x40707c(0x1ad)!==_0x40707c(0x141))this[_0x40707c(0x17d)]()[_0x40707c(0x233)]=!![],this[_0x40707c(0x17d)]()[_0x40707c(0x245)]();else{if(!_0x4aaf9a[_0x40707c(0x1e1)]())return;if(!_0x1d56cb['Settings'][_0x40707c(0x261)])return;if(!_0x3ee8a2[_0x40707c(0x23d)])return;this[_0x40707c(0xf9)]=new _0x5c54cc(new _0x314380(0x0,0x0,0x0,0x0));const _0x5beca7=this['getChildIndex'](this[_0x40707c(0x195)]);this['addChildAt'](this[_0x40707c(0xf9)],_0x5beca7);}}},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0xf8)]=Sprite_Gauge[_0x12eacb(0x1ec)]['gaugeColor1'],Sprite_Gauge[_0x12eacb(0x1ec)][_0x12eacb(0x210)]=function(){const _0x309291=_0x12eacb;if(this['_statusType']==='time')return this[_0x309291(0x126)](0x1);return VisuMZ['BattleSystemATB'][_0x309291(0xf8)][_0x309291(0x185)](this);},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x294)]=Sprite_Gauge[_0x12eacb(0x1ec)]['gaugeColor2'],Sprite_Gauge[_0x12eacb(0x1ec)][_0x12eacb(0x160)]=function(){const _0x29e545=_0x12eacb;if(this[_0x29e545(0x1b7)]===_0x29e545(0x1ac))return this['atbGaugeColor'](0x2);return VisuMZ[_0x29e545(0x18e)]['Sprite_Gauge_gaugeColor2'][_0x29e545(0x185)](this);},Sprite_Gauge[_0x12eacb(0x1ec)]['atbGaugeColor']=function(_0x41228d){const _0x53dccd=_0x12eacb;if(!this['_battler'])return ColorManager[_0x53dccd(0x259)](_0x53dccd(0x16b)['format'](_0x41228d));if(this[_0x53dccd(0x297)][_0x53dccd(0x109)]())return ColorManager[_0x53dccd(0x259)]('stop%1'[_0x53dccd(0x2c6)](_0x41228d));if(this[_0x53dccd(0x297)]['isAtbCastingState']())return ColorManager['atbColor'](_0x53dccd(0x26e)[_0x53dccd(0x2c6)](_0x41228d));if(this['gaugeRate']()>=0x1)return ColorManager['atbColor'](_0x53dccd(0x164)['format'](_0x41228d));const _0x2652de=VisuMZ['BattleSystemATB']['Settings'][_0x53dccd(0x10c)],_0x1bf9fd=this[_0x53dccd(0x297)][_0x53dccd(0x1b2)](0x6)*this[_0x53dccd(0x297)][_0x53dccd(0x2d1)](0x6);if(_0x1bf9fd<=_0x2652de['SlowRate'])return ColorManager[_0x53dccd(0x259)](_0x53dccd(0x24a)['format'](_0x41228d));if(_0x1bf9fd>=_0x2652de['FastRate'])return ColorManager[_0x53dccd(0x259)](_0x53dccd(0x2bf)[_0x53dccd(0x2c6)](_0x41228d));return ColorManager[_0x53dccd(0x259)](_0x53dccd(0x16b)[_0x53dccd(0x2c6)](_0x41228d));},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x183)]=Sprite_Gauge[_0x12eacb(0x1ec)][_0x12eacb(0xdc)],Sprite_Gauge[_0x12eacb(0x1ec)][_0x12eacb(0xdc)]=function(){const _0x4d03d3=_0x12eacb;if(this[_0x4d03d3(0x297)]&&this[_0x4d03d3(0x1b7)]===_0x4d03d3(0x1ac))return this[_0x4d03d3(0x135)]();return VisuMZ[_0x4d03d3(0x18e)][_0x4d03d3(0x183)][_0x4d03d3(0x185)](this);},Sprite_Gauge[_0x12eacb(0x1ec)]['atbCurrentValue']=function(){const _0x4d361c=_0x12eacb;return this[_0x4d361c(0x297)][_0x4d361c(0x1b3)]()?Math[_0x4d361c(0x281)](this[_0x4d361c(0x297)][_0x4d361c(0xfb)],0x0):_0x4d361c(0x250)!==_0x4d361c(0x250)?_0x6586c7[_0x4d361c(0x281)](this[_0x4d361c(0x297)]['tpbRequiredCastTime'](),0x1):VisuMZ['BattleSystemATB'][_0x4d361c(0x183)][_0x4d361c(0x185)](this);},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x209)]=Sprite_Gauge[_0x12eacb(0x1ec)][_0x12eacb(0x1ca)],Sprite_Gauge[_0x12eacb(0x1ec)][_0x12eacb(0x1ca)]=function(){const _0x45364e=_0x12eacb;if(this[_0x45364e(0x297)]&&this[_0x45364e(0x1b7)]===_0x45364e(0x1ac))return this[_0x45364e(0x1ef)]();return VisuMZ[_0x45364e(0x18e)][_0x45364e(0x209)]['call'](this);},Sprite_Gauge[_0x12eacb(0x1ec)][_0x12eacb(0x1ef)]=function(){const _0x398afc=_0x12eacb;if(this[_0x398afc(0x297)][_0x398afc(0x1b3)]())return Math[_0x398afc(0x281)](this[_0x398afc(0x297)][_0x398afc(0x18a)](),0x1);else{if(_0x398afc(0x122)==='tVSRb')this['setAtbChargeTime'](this[_0x398afc(0x238)]+_0xc900d5);else return VisuMZ['BattleSystemATB'][_0x398afc(0x209)]['call'](this);}},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x2b2)]=Window_Help[_0x12eacb(0x1ec)][_0x12eacb(0x137)],Window_Help[_0x12eacb(0x1ec)][_0x12eacb(0x137)]=function(_0x2f5304){const _0x2eae72=_0x12eacb;BattleManager[_0x2eae72(0x1e1)]()&&_0x2f5304&&_0x2f5304[_0x2eae72(0x1f3)]&&_0x2f5304[_0x2eae72(0x1f3)][_0x2eae72(0xc7)](/<(?:ATB|TPB) HELP>\s*([\s\S]*)\s*<\/(?:ATB|TPB) HELP>/i)?this[_0x2eae72(0x102)](String(RegExp['$1'])):VisuMZ['BattleSystemATB'][_0x2eae72(0x2b2)][_0x2eae72(0x185)](this,_0x2f5304);},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x24e)]=Window_StatusBase[_0x12eacb(0x1ec)][_0x12eacb(0x1d4)],Window_StatusBase[_0x12eacb(0x1ec)][_0x12eacb(0x1d4)]=function(_0x34e75f,_0x3b67f9,_0x53de90,_0x4001fe){const _0x51cad6=_0x12eacb;if(!this[_0x51cad6(0x1c4)](_0x3b67f9))return;VisuMZ[_0x51cad6(0x18e)][_0x51cad6(0x24e)][_0x51cad6(0x185)](this,_0x34e75f,_0x3b67f9,_0x53de90,_0x4001fe);},Window_StatusBase['prototype'][_0x12eacb(0x1c4)]=function(_0x221fb8){const _0xd0bb47=_0x12eacb;if(_0x221fb8!=='time')return!![];if(!['Window_BattleStatus',_0xd0bb47(0x1fa)][_0xd0bb47(0x21c)](this[_0xd0bb47(0x2a9)]['name']))return![];if(!BattleManager[_0xd0bb47(0x1e1)]())return![];if(!ConfigManager[_0xd0bb47(0x23d)])return![];return VisuMZ[_0xd0bb47(0x18e)][_0xd0bb47(0x1db)][_0xd0bb47(0x10c)][_0xd0bb47(0x29f)];},VisuMZ[_0x12eacb(0x18e)][_0x12eacb(0x1c1)]=Window_Options['prototype']['addGeneralOptions'],Window_Options[_0x12eacb(0x1ec)][_0x12eacb(0x222)]=function(){const _0x1643dc=_0x12eacb;VisuMZ[_0x1643dc(0x18e)]['Window_Options_addGeneralOptions'][_0x1643dc(0x185)](this),this[_0x1643dc(0x231)]();},Window_Options[_0x12eacb(0x1ec)][_0x12eacb(0x231)]=function(){const _0x2bba6c=_0x12eacb;if(!BattleManager[_0x2bba6c(0x1e1)]())return;VisuMZ[_0x2bba6c(0x18e)][_0x2bba6c(0x1db)][_0x2bba6c(0x27a)][_0x2bba6c(0xfd)]&&(_0x2bba6c(0x242)!==_0x2bba6c(0x1f1)?this[_0x2bba6c(0xcc)]():(_0x1bc88c[_0x2bba6c(0x1ec)]['update'][_0x2bba6c(0x185)](this),this['updatePosition'](),this[_0x2bba6c(0x168)](),this['updateVisibility']()));},Window_Options[_0x12eacb(0x1ec)][_0x12eacb(0xcc)]=function(){const _0x4a8425=_0x12eacb,_0x2069e7=TextManager['visualAtbGauge'],_0x55ca27=_0x4a8425(0x23d);this[_0x4a8425(0x257)](_0x2069e7,_0x55ca27);},Game_BattlerBase['prototype']['clearFieldAtbGraphics']=function(){const _0x3157e0=_0x12eacb;delete this[_0x3157e0(0x2a3)],delete this[_0x3157e0(0x29e)],delete this['_fieldAtbGaugeFaceIndex'],delete this[_0x3157e0(0x1c5)];},Game_BattlerBase[_0x12eacb(0x1ec)][_0x12eacb(0x201)]=function(){const _0x65b19a=_0x12eacb;return this[_0x65b19a(0x2a3)]===undefined&&(_0x65b19a(0x228)!==_0x65b19a(0x228)?(_0x578a01=_0x184eec-0x1,_0x208f05=_0x43790b-0x3-_0x50e770,_0x531c0d[_0x65b19a(0x120)](0x1,0x1,_0x4b3888,_0x5e5509-0x2,_0x3974a6,_0x55ad13,![]),_0x5a7b46[_0x65b19a(0x120)](0x2+_0x6c84e1,0x1,_0x29795e,_0x297d68-0x2,_0x52a62d,_0x387891,![])):this[_0x65b19a(0x2a3)]=this['createFieldAtbGraphicType']()),this[_0x65b19a(0x2a3)];},Game_BattlerBase[_0x12eacb(0x1ec)][_0x12eacb(0x21d)]=function(){const _0x1436da=_0x12eacb;return Sprite_FieldGaugeATB[_0x1436da(0x1db)]['EnemyBattlerType'];},Game_BattlerBase[_0x12eacb(0x1ec)]['fieldAtbGraphicFaceName']=function(){const _0x1bd81c=_0x12eacb;return this[_0x1bd81c(0x29e)]===undefined&&(this['_fieldAtbGaugeFaceName']=this['createFieldAtbGraphicFaceName']()),this[_0x1bd81c(0x29e)];},Game_BattlerBase['prototype'][_0x12eacb(0x13b)]=function(){const _0x23213d=_0x12eacb;return Sprite_FieldGaugeATB[_0x23213d(0x1db)]['EnemyBattlerFaceName'];},Game_BattlerBase[_0x12eacb(0x1ec)]['fieldAtbGraphicFaceIndex']=function(){const _0x4a6dbd=_0x12eacb;return this[_0x4a6dbd(0x1eb)]===undefined&&(this[_0x4a6dbd(0x1eb)]=this[_0x4a6dbd(0x153)]()),this[_0x4a6dbd(0x1eb)];},Game_BattlerBase[_0x12eacb(0x1ec)]['createFieldAtbGraphicFaceIndex']=function(){const _0x88fb28=_0x12eacb;return Sprite_FieldGaugeATB['Settings'][_0x88fb28(0x2b4)];},Game_BattlerBase['prototype']['fieldAtbGraphicIconIndex']=function(){const _0x5a3600=_0x12eacb;return this[_0x5a3600(0x1c5)]===undefined&&(this[_0x5a3600(0x1c5)]=this[_0x5a3600(0x121)]()),this['_fieldAtbGaugeIconIndex'];},Game_BattlerBase['prototype']['createFieldAtbGraphicIconIndex']=function(){const _0x3595ae=_0x12eacb;return Sprite_FieldGaugeATB[_0x3595ae(0x1db)][_0x3595ae(0xf5)];},Game_BattlerBase['prototype']['setAtbGraphicIconIndex']=function(_0x3466ec){const _0x3d4491=_0x12eacb;this[_0x3d4491(0x1c5)]=_0x3466ec;},Game_Actor[_0x12eacb(0x1ec)]['createFieldAtbGraphicType']=function(){const _0x1d7900=_0x12eacb,_0x4429bb=this[_0x1d7900(0xce)]()[_0x1d7900(0x1f3)];if(_0x4429bb[_0x1d7900(0xc7)](/<ATB FIELD GAUGE FACE:[ ](.*),[ ](\d+)>/i))return _0x1d7900(0x274);else{if(_0x4429bb[_0x1d7900(0xc7)](/<ATB FIELD GAUGE ICON:[ ](\d+)>/i)){if(_0x1d7900(0x13c)===_0x1d7900(0x25d))this[_0x1d7900(0x23d)]=_0x95d600[_0x1d7900(0x23d)];else return _0x1d7900(0xe8);}}return Sprite_FieldGaugeATB[_0x1d7900(0x1db)]['ActorBattlerType'];},Game_Actor['prototype'][_0x12eacb(0xec)]=function(){const _0x16be56=_0x12eacb,_0x325cee=this[_0x16be56(0xce)]()[_0x16be56(0x1f3)];if(_0x325cee[_0x16be56(0xc7)](/<ATB FIELD GAUGE FACE:[ ](.*),[ ](\d+)>/i))return String(RegExp['$1']);return this[_0x16be56(0x2b0)]();},Game_Actor[_0x12eacb(0x1ec)][_0x12eacb(0x13f)]=function(){const _0x183b9c=_0x12eacb,_0x70e446=this[_0x183b9c(0xce)]()[_0x183b9c(0x1f3)];if(_0x70e446['match'](/<ATB FIELD GAUGE FACE:[ ](.*),[ ](\d+)>/i))return Number(RegExp['$2']);return this[_0x183b9c(0x180)]();},Game_Actor['prototype'][_0x12eacb(0x121)]=function(){const _0x5233db=_0x12eacb,_0x3cbefe=this[_0x5233db(0xce)]()[_0x5233db(0x1f3)];if(_0x3cbefe[_0x5233db(0xc7)](/<ATB FIELD GAUGE ICON:[ ](\d+)>/i))return Number(RegExp['$1']);return Sprite_FieldGaugeATB[_0x5233db(0x1db)][_0x5233db(0x243)];},Game_Enemy[_0x12eacb(0x1ec)]['createFieldAtbGraphicType']=function(){const _0x26682f=_0x12eacb,_0x3d087d=this[_0x26682f(0x14d)]()[_0x26682f(0x1f3)];if(_0x3d087d[_0x26682f(0xc7)](/<ATB FIELD GAUGE FACE:[ ](.*),[ ](\d+)>/i))return _0x26682f(0x274);else{if(_0x3d087d[_0x26682f(0xc7)](/<ATB FIELD GAUGE ICON:[ ](\d+)>/i)){if(_0x26682f(0x1fc)===_0x26682f(0x1fc))return _0x26682f(0xe8);else _0x47ac8d=_0x4519ae[_0x26682f(0x281)](_0x5d52cd,_0x448ec5);}}return Sprite_FieldGaugeATB['Settings']['EnemyBattlerType'];},Game_Enemy[_0x12eacb(0x1ec)][_0x12eacb(0x13b)]=function(){const _0x4f82e5=_0x12eacb,_0x9c4f96=this[_0x4f82e5(0x14d)]()[_0x4f82e5(0x1f3)];if(_0x9c4f96['match'](/<ATB FIELD GAUGE FACE:[ ](.*),[ ](\d+)>/i))return String(RegExp['$1']);return Sprite_FieldGaugeATB['Settings'][_0x4f82e5(0x220)];},Game_Enemy[_0x12eacb(0x1ec)][_0x12eacb(0x153)]=function(){const _0x4175b5=_0x12eacb,_0x3bd62e=this['enemy']()[_0x4175b5(0x1f3)];if(_0x3bd62e[_0x4175b5(0xc7)](/<ATB FIELD GAUGE FACE:[ ](.*),[ ](\d+)>/i))return Number(RegExp['$2']);return Sprite_FieldGaugeATB[_0x4175b5(0x1db)][_0x4175b5(0x2b4)];},Game_Enemy[_0x12eacb(0x1ec)][_0x12eacb(0x121)]=function(){const _0x3dba73=_0x12eacb,_0x5f20cc=this['enemy']()['note'];if(_0x5f20cc[_0x3dba73(0xc7)](/<ATB FIELD GAUGE ICON:[ ](\d+)>/i))return Number(RegExp['$1']);return Sprite_FieldGaugeATB['Settings']['EnemyBattlerIcon'];},VisuMZ[_0x12eacb(0x18e)]['Scene_Battle_createAllWindows']=Scene_Battle['prototype'][_0x12eacb(0x150)],Scene_Battle[_0x12eacb(0x1ec)][_0x12eacb(0x150)]=function(){const _0xaeaa01=_0x12eacb;this[_0xaeaa01(0xd7)](),VisuMZ[_0xaeaa01(0x18e)][_0xaeaa01(0x125)]['call'](this),this[_0xaeaa01(0x157)]();},Scene_Battle[_0x12eacb(0x1ec)][_0x12eacb(0xd7)]=function(){const _0xa0c760=_0x12eacb;if(!BattleManager[_0xa0c760(0x1e1)]())return;if(!Sprite_FieldGaugeATB[_0xa0c760(0x1db)]['UseFieldGauge'])return;if(!ConfigManager['visualAtbGauge'])return;this['_fieldGaugeATB_Container']=new Window_Base(new Rectangle(0x0,0x0,0x0,0x0));const _0x34811e=this['getChildIndex'](this[_0xa0c760(0x195)]);this['addChildAt'](this[_0xa0c760(0xf9)],_0x34811e);},Scene_Battle[_0x12eacb(0x1ec)][_0x12eacb(0x157)]=function(){const _0x3dcd64=_0x12eacb;if(!BattleManager[_0x3dcd64(0x1e1)]())return;if(!Sprite_FieldGaugeATB['Settings'][_0x3dcd64(0x261)])return;if(!ConfigManager[_0x3dcd64(0x23d)])return;this[_0x3dcd64(0x199)]=new Sprite_FieldGaugeATB(),this['_fieldGaugeATB_Container'][_0x3dcd64(0xf4)](this[_0x3dcd64(0x199)]);};function Sprite_FieldGaugeATB(){const _0x591db1=_0x12eacb;this[_0x591db1(0x290)](...arguments);}function _0x4f06(){const _0x50d223=['EUvPV','_graphicHue','currentMaxValue','stNEW','tpbAcceleration','TpbBaseSpeedCalcJS','battlerHue','traitObjects','Armor-%1-%2','RepositionTopHelpX','6SIcZfn','width','placeGauge','siaNb','_skinSprite','AWwya','STR','applyTpbPenalty','XsOPl','Settings','_homeX','BattlerRelativeSpeedJS','battlerName','FIftB','setAtbChargeTime','isATB','updateAtbGaugeSpritePosition','lvUsw','Class-%1-%2','Actor-%1-%2','EnemyBattlerFontSize','GaugeThick','EmVQG','Game_Battler_clearTpbChargeTime','createBattlerSprite','_fieldAtbGaugeFaceIndex','prototype','136494pAXKXC','iconWidth','atbCurrentMaxValue','makeData','nzMxG','#000000','note','OQLMR','Sprite_Battler_update','updateMain','atbAcceleration','createBackgroundSprite','initMembers','Window_SideviewUiBattleStatus','_atbFieldGaugeVisible','FlUVE','boxWidth','subject','Game_Battler_tpbAcceleration','_backgroundSprite','fieldAtbGraphicType','fSqKf','slow','ConvertParams','%1BorderColor','battleUIOffsetX','tpbRelativeSpeed','anchor','Sprite_Gauge_currentMaxValue','_horz','faceWidth','kBgkS','DisplayPosition','Interrupt','_graphicFaceIndex','gaugeColor1','setupAtbGaugeSprite','changeFaceGraphicBitmap','475830xelZyH','revive','_svBattlerSprite','Game_Action_applyItemUserEffect','fast','_graphicSprite','UoIlQ','MarkerSpeed','QrIZk','includes','createFieldAtbGraphicType','gwcCq','JZQXI','EnemyBattlerFaceName','4021736OEdboq','addGeneralOptions','initTpbChargeTime','_helpWindow','checkAggroControlSystemOffsetYAdjustment','tpbBaseSpeed','qAwWt','FuepT','_letter','TpbAccelerationJS','ceil','applyData','AdjustRect','clearActions','pvhsk','clear','addBattleSystemATBCommands','isActiveTpb','_fnord','RepositionTopForHelp','getAtbCastTimeRate','nvQzp','_homeY','_tpbChargeTime','InterruptAnimationID','create','_unit','pjkPF','visualAtbGauge','NUM','EnemyBattlerDrawLetter','svBattlerName','_statusWindow','fNnVE','ActorBattlerIcon','allBattleMembers','updateAtbGaugeSpriteVisibility','RepositionTopHelpY','process_VisuMZ_BattleSystemATB_CreateRegExp','length','BxgYR','slow%1','tBVrg','CiPhW','NTqVa','Window_StatusBase_placeGauge','createGaugeBitmap','mJpnN','speed','VJSuZ','battleUIOffsetY','Actor','toLowerCase','sort','addCommand','73506tkmFlj','atbColor','die','changeSvActorGraphicBitmap','OoyWD','axxxZ','Cast','UBVAe','Parse_Notetags_CreateJS','UseFieldGauge','startTpbCasting','isAlive','Game_Battler_startTpbCasting','initTpbChargeTimeATB','JAupw','updateGraphicHue','ShowMarkerBg','AggroControlSystem','_gaugeSprite','XnnlX','Weapon-%1-%2','esquu','cast%1','changeAtbChargeTime','members','attackSpeed','lyeuX','gaugeBackColor','face','top','EnemyBattlerFontFace','IconSet','filter','updateLetter','Options','_atbAfterSpeed','boxHeight','JSON','2835020uRBKBt','min','vpJSL','max','ShowMarkerBorder','OffsetX','isEnemy','ZLVWL','nvRfU','ConfigManager_applyData','name','FOcGJ','update','(?:ATB|TPB)','Game_Action_applyGlobal','Game_Battler_applyTpbPenalty','_tpbState','setupTextPopup','initialize','drlXu','_forcing','DisplayOffsetY','Sprite_Gauge_gaugeColor2','FieldGaugeActorIcon','setHomeLocation','_battler','NDjIS','%1SystemBorder','jXlWn','#%1','bottom','createBorderSprite','_fieldAtbGaugeFaceName','ShowStatusGauge','registerCommand','Game_BattlerBase_revive','item','_fieldAtbGaugeGraphicType','hjFNr','VisuMZ_1_BattleCore','updatePositionOffset','VpTcN','getColor','constructor','isTpb','isAtbChargingState','aggroGauge','Game_Battler_tpbBaseSpeed','status','ColorManager_loadWindowskin','faceName','clearTpbChargeTime','Window_Help_setItem','abs','EnemyBattlerFaceIndex','changeAtbCastTime','isActor','ShowMarkerArrow','322vFkAbv','toUpperCase','_battlerContainer','disappear','applyItemBattleSystemATBUserEffect','STRUCT','iRbcW','fast%1','165136gHkhoC','Color','updateSelectionEffect','Sprite_Battler_updateMain','RegExp','_graphicIconIndex','format','InterruptTextColor','setFrame','ZOtwt','OffsetY','createBattlerSprites','updatePosition','hJJAZ','faceHeight','applyBattleSystemATBUserEffect','setBattleSystemATBFieldGaugeVisible','paramBuffRate','Game_Battler_tpbSpeed','drawGaugeBitmap','(?:GAUGE|TIME|SPEED)','_index','_blendColor','ready','blt','process_VisuMZ_BattleSystemATB_JS_Notetags','FUNC','AgKOD','loadWindowskin','<JS\x20%2\x20%1\x20%3>\x5cs*([\x5cs\x5cS]*)\x5cs*<\x5c/JS\x20%2\x20%1\x20%3>','LnZmW','children','DRfZw','match','appear','_letterSprite','initBattleSystemATB','Charge','addBattleSystemATBShowGaugeCommand','atbInterrupt','actor','Enemy-%1-%2','round','svactor','opacity','isAttack','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','isSideView','ARRAYSTRUCT','createFieldGaugeContainerATB','vxVrT','Game_BattlerBase_die','_graphicFaceName','gEslj','currentValue','yXiFC','isBattleSystemATBFieldGaugeVisible','createFieldGaugeSkin','nxywc','tpbSpeed','GaugeSplit','isDead','Game_Unit_updateTpb','setup','some','startEffect','icon','InterruptFlashColor','_scene','VisuMZ_0_CoreEngine','fieldAtbGraphicFaceName','Sprite_Enemy_createStateIconSprite','48RgSkwL','ARRAYEVAL','VisuMZ_2_BattleSystemCTB','TpbSpeedCalcJS','clearFieldAtbGraphics','left','addChild','EnemyBattlerIcon','updateVisibility','updatePositionOnGauge','Sprite_Gauge_gaugeColor1','_fieldGaugeATB_Container','createKeyJS','_tpbCastTime','ctGaugeColor2','AddOption','applyATBPenalty','applyItemUserEffect','mainSprite','CJNOb','setText','exit','createChildren','ParseItemNotetags','clamp','FaceName','createGraphicSprite','atbStopped','Game_Battler_tpbRequiredCastTime','skills','Gauge','fontSize','applyGlobalBattleSystemATBEffects','30BnUgTf','Game_Battler_initTpbChargeTime','Actors','After','BorderThickness','Sprite_Actor_createStateSprite','_atbColors','Enemies','parameters','cast2','BattleCore','onRestrict','loadSystem','_graphicSv','scale','return\x200','Item-%1-%2','gradientFillRect','createFieldAtbGraphicIconIndex','FkplT','mainFontFace','targetOpacity','Scene_Battle_createAllWindows','atbGaugeColor','processUpdateGraphic','MarkerSize','RxQUz','4181969OoWbhe','maxBattleMembers','VnltI','Mechanics','iconHeight','createGaugeSprite','ShowActorGauge','trim','ConfigManager_makeData','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','parse','atbCurrentValue','nnJON','setItem','getStateTooltipBattler','FaceIndex','smOtb','createFieldAtbGraphicFaceName','aZvQn','changeIconGraphicBitmap','FieldGauge','fieldAtbGraphicFaceIndex','Lfqur','vkVhl','_graphicEnemy','charging','Aggro','lBJaa','isGaugeHorizontal','DrawGauge','loadSvActor','tuXsd','_plural','createBattlerContainer','KYVeF','enemy','_onRestrictBypassAtbReset','EscapeFailPenalty','createAllWindows','StunsResetGauge','updateTpb','createFieldAtbGraphicFaceIndex','bind','isHidden','createStateSprite','createFieldGaugeSpriteATB','InterruptMute','AnchorY','map','SystemFieldGaugeVisibility','_graphicType','RPzWA','Visible','nCphf','gaugeColor2','applyGlobal','InterruptFlashDuration','currentAction','full%1','clearRect','InterruptText','Scale','updateBattleContainerOrder','changeEnemyGraphicBitmap','visible','default%1','GaugeLengthVert','AnchorX','height','removeChild','createStateIconSprite','%1Side','setBattler','setAtbCastTime','LyBTP','createJS','isSceneBattle','createAtbGaugeSprite','atbActive','setHue','onAtbInterrupt','vMYaq','casting','battler','EMnTk','atbSpeed','faceIndex','ZoOLf','reduce','Sprite_Gauge_currentValue','%1SystemBg','call','FieldGaugeClearActorGraphic','State-%1-%2','Name','Game_System_initialize','tpbRequiredCastTime','%1BgColor2','tjiPt','bitmap','BattleSystemATB','_arrowSprite','hasSvBattler','ARRAYNUM','Scene_Boot_onDatabaseLoaded','Scene_Options_maxCommands','bvSoO','_windowLayer','setAtbAfterSpeed','kqWuV','GaugeDirection','_fieldGaugeATB','kVTbf','addLoadListener','compareBattlerSprites','right','setupArrowSprite','setBlendColor','concat','createArrowSprite','VisibleGauge','createActorSprites','_atbGaugeSprite','isAppeared','version','cast','ParseSkillNotetags','maxCommands','ARRAYSTR','lGcgX','time','auvtD','Game_Battler_tpbRelativeSpeed','loadEnemy','Sprite_Battler_setBattler','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','paramRate','isAtbCastingState','Enemy','DisplayOffsetX','fillRect','_statusType','createEnemySprites','onDatabaseLoaded','uwgtm','BattleManager_isActiveTpb','targetPositionOnGauge','_windowskin','floor','XsqvA','textColor','Window_Options_addGeneralOptions','Game_BattlerBase_appear','ARRAYJSON','showVisualAtbGauge','_fieldAtbGaugeIconIndex','setupBattleSystemATBColors','isRestricted'];_0x4f06=function(){return _0x50d223;};return _0x4f06();}Sprite_FieldGaugeATB[_0x12eacb(0x1ec)]=Object['create'](Sprite[_0x12eacb(0x1ec)]),Sprite_FieldGaugeATB[_0x12eacb(0x1ec)][_0x12eacb(0x2a9)]=Sprite_FieldGaugeATB,Sprite_FieldGaugeATB[_0x12eacb(0x1db)]=JsonEx['makeDeepCopy'](VisuMZ[_0x12eacb(0x18e)]['Settings'][_0x12eacb(0x13e)]),Sprite_FieldGaugeATB['prototype'][_0x12eacb(0x290)]=function(){const _0x5d8369=_0x12eacb;Sprite['prototype'][_0x5d8369(0x290)][_0x5d8369(0x185)](this),this['initMembers'](),this[_0x5d8369(0x296)](),this['createChildren']();},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)]['initMembers']=function(){const _0x32f25c=_0x12eacb;this[_0x32f25c(0x208)]['x']=0.5,this[_0x32f25c(0x208)]['y']=0.5;},Sprite_FieldGaugeATB['prototype'][_0x12eacb(0x146)]=function(){const _0x503c98=_0x12eacb;if(this[_0x503c98(0x20a)]!==undefined)return this[_0x503c98(0x20a)];const _0x2b2974=Sprite_FieldGaugeATB['Settings'][_0x503c98(0x20d)];return this[_0x503c98(0x20a)]=['top',_0x503c98(0x29c)][_0x503c98(0x21c)](_0x2b2974),this[_0x503c98(0x20a)];},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)]['setHomeLocation']=function(){const _0x224f1f=_0x12eacb,_0x47ccf8=Sprite_FieldGaugeATB[_0x224f1f(0x1db)][_0x224f1f(0x20d)][_0x224f1f(0x255)]()[_0x224f1f(0x131)](),_0x456bda=Window_Base[_0x224f1f(0x1ec)]['lineHeight'](),_0x40b501=SceneManager[_0x224f1f(0xea)][_0x224f1f(0x241)][_0x224f1f(0x16e)]+Math[_0x224f1f(0xd0)](_0x456bda*0.5);this[_0x224f1f(0x1dc)]=0x0,this[_0x224f1f(0x237)]=0x0;switch(_0x47ccf8){case'top':this['_homeX']=Math[_0x224f1f(0xd0)](Graphics[_0x224f1f(0x1fd)]*0.5),this[_0x224f1f(0x237)]=0x60;break;case _0x224f1f(0x29c):this['_homeX']=Math[_0x224f1f(0xd0)](Graphics['boxWidth']*0.5),this['_homeY']=Graphics[_0x224f1f(0x27c)]-_0x40b501;break;case _0x224f1f(0xf3):this[_0x224f1f(0x1dc)]=0x50,this[_0x224f1f(0x237)]=Math[_0x224f1f(0xd0)]((Graphics[_0x224f1f(0x27c)]-_0x40b501)/0x2);break;case _0x224f1f(0x19d):this[_0x224f1f(0x1dc)]=Graphics[_0x224f1f(0x1fd)]-0x50,this[_0x224f1f(0x237)]=Math['round']((Graphics[_0x224f1f(0x27c)]-_0x40b501)/0x2);break;}this[_0x224f1f(0x1dc)]+=Sprite_FieldGaugeATB[_0x224f1f(0x1db)][_0x224f1f(0x1b5)]||0x0,this[_0x224f1f(0x237)]+=Sprite_FieldGaugeATB[_0x224f1f(0x1db)][_0x224f1f(0x293)]||0x0,this['x']=this['_homeX'],this['y']=this[_0x224f1f(0x237)];},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)][_0x12eacb(0x104)]=function(){const _0x5477e4=_0x12eacb;this[_0x5477e4(0xdf)](),this[_0x5477e4(0x12f)](),this[_0x5477e4(0x14b)]();},Sprite_FieldGaugeATB['prototype'][_0x12eacb(0xdf)]=function(){const _0x57d272=_0x12eacb;this[_0x57d272(0x1d6)]=new Sprite(),this[_0x57d272(0x1d6)][_0x57d272(0x208)]['x']=0.5,this[_0x57d272(0x1d6)][_0x57d272(0x208)]['y']=0.5,this[_0x57d272(0xf4)](this[_0x57d272(0x1d6)]);const _0x30debb=Sprite_FieldGaugeATB[_0x57d272(0x1db)]['GaugeSystemSkin'];if(_0x30debb)this['_skinSprite'][_0x57d272(0x18d)]=ImageManager[_0x57d272(0x11b)](_0x30debb);},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)][_0x12eacb(0x12f)]=function(){const _0x44307b=_0x12eacb;this[_0x44307b(0x26a)]=new Sprite(),this['addChild'](this[_0x44307b(0x26a)]),this[_0x44307b(0x24f)]();},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)][_0x12eacb(0x24f)]=function(){const _0x4dc659=_0x12eacb,_0x2f3fc3=Sprite_FieldGaugeATB[_0x4dc659(0x1db)],_0x5d54d6=this[_0x4dc659(0x146)](),_0xadf676=_0x5d54d6?_0x2f3fc3['GaugeLengthHorz']:_0x2f3fc3[_0x4dc659(0x1e7)],_0x407307=_0x5d54d6?_0x2f3fc3[_0x4dc659(0x1e7)]:_0x2f3fc3[_0x4dc659(0x16c)];this[_0x4dc659(0x26a)]['bitmap']=new Bitmap(_0xadf676,_0x407307),this[_0x4dc659(0x2d3)](),this[_0x4dc659(0x26a)]['x']=Math[_0x4dc659(0x22b)](_0xadf676/-0x2),this[_0x4dc659(0x26a)]['y']=Math[_0x4dc659(0x22b)](_0x407307/-0x2);},Sprite_FieldGaugeATB['prototype'][_0x12eacb(0x2d3)]=function(){const _0xa03bf3=_0x12eacb;if(!Sprite_FieldGaugeATB['Settings'][_0xa03bf3(0x147)])return;const _0x26e3ee=Sprite_FieldGaugeATB[_0xa03bf3(0x1db)],_0x1c6623=this[_0xa03bf3(0x26a)][_0xa03bf3(0x18d)],_0x17aa1f=_0x1c6623[_0xa03bf3(0x1d3)],_0x515a9f=_0x1c6623['height'],_0x496c87=ColorManager[_0xa03bf3(0x273)](),_0x3c5642=ColorManager['ctGaugeColor1'](),_0x26fbc6=ColorManager[_0xa03bf3(0xfc)](),_0x117dc9=ColorManager[_0xa03bf3(0x259)]('cast1'),_0x193641=ColorManager[_0xa03bf3(0x259)](_0xa03bf3(0x118)),_0x5668bd=this[_0xa03bf3(0x146)](),_0xcaab6a=_0x26e3ee[_0xa03bf3(0x198)],_0x407690=_0x26e3ee['GaugeSplit'][_0xa03bf3(0x106)](0x0,0x1),_0x17a7cf=Math[_0xa03bf3(0x22b)](((_0x5668bd?_0x17aa1f:_0x515a9f)-0x2)*_0x407690);_0x1c6623['fillRect'](0x0,0x0,_0x17aa1f,_0x515a9f,_0x496c87);let _0x410af6=0x0,_0x5b7ced=0x0,_0x215a88=0x0,_0x2b93f9=0x0;if(_0x5668bd&&_0xcaab6a)_0x410af6=_0x17a7cf-0x1,_0x215a88=_0x17aa1f-0x3-_0x410af6,_0x1c6623[_0xa03bf3(0x120)](0x1,0x1,_0x410af6,_0x515a9f-0x2,_0x3c5642,_0x26fbc6,![]),_0x1c6623[_0xa03bf3(0x120)](0x2+_0x410af6,0x1,_0x215a88,_0x515a9f-0x2,_0x117dc9,_0x193641,![]);else{if(_0x5668bd&&!_0xcaab6a){if(_0xa03bf3(0x22f)===_0xa03bf3(0x174)){const _0x3420ea=_0x39e133[_0xa03bf3(0x166)],_0x4d65c3={'textColor':_0x378648[_0xa03bf3(0x2a8)](_0x2231d5[_0xa03bf3(0x2c7)]),'flashColor':_0x5ee715[_0xa03bf3(0xe9)],'flashDuration':_0x4ea687['InterruptFlashDuration']};this['setupTextPopup'](_0x3420ea,_0x4d65c3);}else _0x410af6=_0x17a7cf-0x1,_0x215a88=_0x17aa1f-0x3-_0x410af6,_0x1c6623[_0xa03bf3(0x120)](0x2+_0x215a88,0x1,_0x410af6,_0x515a9f-0x2,_0x3c5642,_0x26fbc6,![]),_0x1c6623[_0xa03bf3(0x120)](0x1,0x1,_0x215a88,_0x515a9f-0x2,_0x117dc9,_0x193641,![]);}else{if(!_0x5668bd&&_0xcaab6a)_0x5b7ced=_0x17a7cf-0x1,_0x2b93f9=_0x515a9f-0x3-_0x5b7ced,_0x1c6623['gradientFillRect'](0x1,0x1,_0x17aa1f-0x2,_0x5b7ced,_0x3c5642,_0x26fbc6,!![]),_0x1c6623[_0xa03bf3(0x120)](0x1,0x2+_0x5b7ced,_0x17aa1f-0x2,_0x2b93f9,_0x117dc9,_0x193641,!![]);else!_0x5668bd&&!_0xcaab6a&&(_0x5b7ced=_0x17a7cf-0x1,_0x2b93f9=_0x515a9f-0x3-_0x5b7ced,_0x1c6623[_0xa03bf3(0x120)](0x1,0x2+_0x2b93f9,_0x17aa1f-0x2,_0x5b7ced,_0x3c5642,_0x26fbc6,!![]),_0x1c6623[_0xa03bf3(0x120)](0x1,0x1,_0x17aa1f-0x2,_0x2b93f9,_0x117dc9,_0x193641,!![]));}}},Sprite_FieldGaugeATB['prototype']['createBattlerContainer']=function(){const _0x30e192=_0x12eacb;this[_0x30e192(0x2ba)]&&this[_0x30e192(0x26a)][_0x30e192(0x16f)](this[_0x30e192(0x2ba)]),this[_0x30e192(0x2ba)]=new Sprite(),this['_gaugeSprite'][_0x30e192(0xf4)](this[_0x30e192(0x2ba)]),this['createBattlerSprites']();},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)][_0x12eacb(0x2cb)]=function(){const _0x193039=_0x12eacb;this[_0x193039(0x1b8)](),this[_0x193039(0x1a3)]();},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)][_0x12eacb(0x1b8)]=function(){const _0x3db1ff=_0x12eacb,_0x1ab40b=$gameTroop[_0x3db1ff(0x270)](),_0x19a09f=_0x1ab40b[_0x3db1ff(0x248)];for(let _0x2c8504=0x0;_0x2c8504<_0x19a09f;_0x2c8504++){'iiwEG'===_0x3db1ff(0x2a4)?this[_0x3db1ff(0x265)](_0x457167):this['createBattlerSprite'](_0x2c8504,$gameTroop);}},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)][_0x12eacb(0x1a3)]=function(){const _0x46988c=_0x12eacb,_0x4277f9=$gameParty[_0x46988c(0x12b)]();for(let _0x5e47ad=0x0;_0x5e47ad<_0x4277f9;_0x5e47ad++){this[_0x46988c(0x1ea)](_0x5e47ad,$gameParty);}},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)]['createBattlerSprite']=function(_0x6c28be,_0x38fe9f){const _0x5356ad=_0x12eacb,_0x26caa6=new Sprite_FieldMarkerATB(_0x6c28be,_0x38fe9f,this[_0x5356ad(0x26a)]);this[_0x5356ad(0x2ba)][_0x5356ad(0xf4)](_0x26caa6);},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)][_0x12eacb(0x28a)]=function(){const _0x350bdc=_0x12eacb;Sprite['prototype']['update'][_0x350bdc(0x185)](this),this[_0x350bdc(0x2cc)](),this[_0x350bdc(0x168)](),this['updateVisibility']();},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)]['updatePosition']=function(){const _0x17336c=_0x12eacb,_0x207175=Sprite_FieldGaugeATB[_0x17336c(0x1db)];if(_0x207175[_0x17336c(0x20d)]!==_0x17336c(0x275))return;if(!_0x207175[_0x17336c(0x234)])return;const _0x3f87e9=SceneManager[_0x17336c(0xea)]['_helpWindow'];if(!_0x3f87e9)return;_0x3f87e9['visible']?(this['x']=this[_0x17336c(0x1dc)]+(_0x207175[_0x17336c(0x1d1)]||0x0),this['y']=this['_homeY']+(_0x207175[_0x17336c(0x246)]||0x0)):(this['x']=this[_0x17336c(0x1dc)],this['y']=this[_0x17336c(0x237)]);const _0x891f88=SceneManager['_scene']['_windowLayer'];this['x']+=_0x891f88['x'],this['y']+=_0x891f88['y'];},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)][_0x12eacb(0x168)]=function(){const _0xdee9eb=_0x12eacb;if(!this[_0xdee9eb(0x2ba)])return;const _0x42d2f2=this[_0xdee9eb(0x2ba)][_0xdee9eb(0xc5)];if(!_0x42d2f2)return;_0x42d2f2[_0xdee9eb(0x256)](this[_0xdee9eb(0x19c)][_0xdee9eb(0x154)](this));},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)][_0x12eacb(0x19c)]=function(_0x4a2c19,_0x4943cd){const _0x82f273=_0x12eacb,_0x22138d=this[_0x82f273(0x146)](),_0x32431c=Sprite_FieldGaugeATB[_0x82f273(0x1db)]['GaugeDirection'];if(_0x22138d&&_0x32431c)return _0x4a2c19['x']-_0x4943cd['x'];else{if(_0x22138d&&!_0x32431c)return _0x4943cd['x']-_0x4a2c19['x'];else{if(!_0x22138d&&_0x32431c)return _0x82f273(0x21b)!==_0x82f273(0x1d5)?_0x4a2c19['y']-_0x4943cd['y']:this['processUpdateGraphic']();else{if(!_0x22138d&&!_0x32431c)return _0x82f273(0xdd)!==_0x82f273(0x14c)?_0x4943cd['y']-_0x4a2c19['y']:_0x475a6e['battleMembers']()[this[_0x82f273(0x2d5)]];}}}},Sprite_FieldGaugeATB[_0x12eacb(0x1ec)][_0x12eacb(0xf6)]=function(){const _0x5258eb=_0x12eacb;this['visible']=$gameSystem[_0x5258eb(0xde)]();};function Sprite_FieldMarkerATB(){const _0x43668f=_0x12eacb;this[_0x43668f(0x290)](...arguments);}Sprite_FieldMarkerATB[_0x12eacb(0x1ec)]=Object[_0x12eacb(0x23a)](Sprite_Clickable['prototype']),Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x2a9)]=Sprite_FieldMarkerATB,Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x290)]=function(_0x3f13e0,_0x51d376,_0x541c26){const _0x24eff3=_0x12eacb;this[_0x24eff3(0x2d5)]=_0x3f13e0,this[_0x24eff3(0x23b)]=_0x51d376,this[_0x24eff3(0x26a)]=_0x541c26,Sprite_Clickable['prototype'][_0x24eff3(0x290)][_0x24eff3(0x185)](this),this[_0x24eff3(0x1f9)](),this['createChildren'](),this[_0x24eff3(0xd2)]=this[_0x24eff3(0x124)]();},Sprite_FieldMarkerATB['prototype'][_0x12eacb(0x1f9)]=function(){const _0x47629e=_0x12eacb;this['anchor']['x']=0.5,this[_0x47629e(0x208)]['y']=0.5;},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x104)]=function(){const _0x2c3d3b=_0x12eacb;this[_0x2c3d3b(0x1f8)](),this[_0x2c3d3b(0x108)](),this[_0x2c3d3b(0x29d)](),this['createLetterSprite'](),this[_0x2c3d3b(0x1a1)](),this[_0x2c3d3b(0xf7)](!![]);},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x1f8)]=function(){const _0x5e028a=_0x12eacb;if(!Sprite_FieldGaugeATB[_0x5e028a(0x1db)][_0x5e028a(0x268)])return;const _0x1a1ba8=Sprite_FieldGaugeATB[_0x5e028a(0x1db)],_0x1620be=this[_0x5e028a(0x23b)]===$gameParty?_0x5e028a(0x254):_0x5e028a(0x1b4),_0x59421a=_0x5e028a(0x184)[_0x5e028a(0x2c6)](_0x1620be),_0x4e7c5b=new Sprite();_0x4e7c5b['anchor']['x']=this[_0x5e028a(0x208)]['x'],_0x4e7c5b[_0x5e028a(0x208)]['y']=this[_0x5e028a(0x208)]['y'];if(_0x1a1ba8[_0x59421a]){if(_0x5e028a(0x23c)!==_0x5e028a(0x2db))_0x4e7c5b[_0x5e028a(0x18d)]=ImageManager[_0x5e028a(0x11b)](_0x1a1ba8[_0x59421a]);else{const _0x5d81b3=this[_0x5e028a(0x17d)]();if(!_0x5d81b3)return;const _0x5a9136=_0x116b73[_0x5e028a(0x1db)],_0x4d6427=this[_0x5e028a(0x146)](),_0x22b872=this[_0x5e028a(0x1bc)](),_0x2c54d9=_0x4c3a6c?_0x15bbd7:_0x5a9136[_0x5e028a(0x21a)];if(_0x4d6427&&this['x']!==_0x22b872){if(this['x']>_0x22b872)this['x']=_0x6128fa[_0x5e028a(0x281)](_0x22b872,this['x']-_0x2c54d9);if(this['x']<_0x22b872)this['x']=_0x11564b[_0x5e028a(0x27f)](_0x22b872,this['x']+_0x2c54d9);}else{if(!_0x4d6427&&this['x']!==_0x22b872){if(this['y']>_0x22b872)this['y']=_0xdf63df[_0x5e028a(0x281)](_0x22b872,this['y']-_0x2c54d9);if(this['y']<_0x22b872)this['y']=_0x5a1475['min'](_0x22b872,this['y']+_0x2c54d9);}}}}else{const _0x3cd374=_0x1a1ba8[_0x5e028a(0x128)];_0x4e7c5b[_0x5e028a(0x18d)]=new Bitmap(_0x3cd374,_0x3cd374);const _0x5c485f=ColorManager['getColor'](_0x1a1ba8['%1BgColor1'['format'](_0x1620be)]),_0x77329a=ColorManager['getColor'](_0x1a1ba8[_0x5e028a(0x18b)[_0x5e028a(0x2c6)](_0x1620be)]);_0x4e7c5b[_0x5e028a(0x18d)]['gradientFillRect'](0x0,0x0,_0x3cd374,_0x3cd374,_0x5c485f,_0x77329a,!![]);}this['_backgroundSprite']=_0x4e7c5b,this[_0x5e028a(0xf4)](this[_0x5e028a(0x200)]),this['width']=this[_0x5e028a(0x200)][_0x5e028a(0x1d3)],this[_0x5e028a(0x16e)]=this[_0x5e028a(0x200)]['height'];},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x108)]=function(){const _0x10b34a=_0x12eacb,_0x38b06a=new Sprite();_0x38b06a['anchor']['x']=this[_0x10b34a(0x208)]['x'],_0x38b06a[_0x10b34a(0x208)]['y']=this['anchor']['y'],this[_0x10b34a(0x218)]=_0x38b06a,this[_0x10b34a(0xf4)](this['_graphicSprite']),this['processUpdateGraphic']();},Sprite_FieldMarkerATB['prototype'][_0x12eacb(0x29d)]=function(){const _0x2402fa=_0x12eacb;if(!Sprite_FieldGaugeATB[_0x2402fa(0x1db)][_0x2402fa(0x282)])return;const _0x3afb39=Sprite_FieldGaugeATB[_0x2402fa(0x1db)],_0x52a4a3=this[_0x2402fa(0x23b)]===$gameParty?_0x2402fa(0x254):_0x2402fa(0x1b4),_0x4d2c65=_0x2402fa(0x299)[_0x2402fa(0x2c6)](_0x52a4a3),_0xd246ba=new Sprite();_0xd246ba[_0x2402fa(0x208)]['x']=this['anchor']['x'],_0xd246ba[_0x2402fa(0x208)]['y']=this['anchor']['y'];if(_0x3afb39[_0x4d2c65]){if(_0x2402fa(0x1d7)===_0x2402fa(0x236))return this['processUpdateGraphic']();else _0xd246ba['bitmap']=ImageManager[_0x2402fa(0x11b)](_0x3afb39[_0x4d2c65]);}else{let _0x4b96ab=_0x3afb39['MarkerSize'],_0xd37f26=_0x3afb39[_0x2402fa(0x113)];_0xd246ba[_0x2402fa(0x18d)]=new Bitmap(_0x4b96ab,_0x4b96ab);const _0x137245=_0x2402fa(0x1f2),_0x434c52=ColorManager['getColor'](_0x3afb39[_0x2402fa(0x205)['format'](_0x52a4a3)]);_0xd246ba[_0x2402fa(0x18d)][_0x2402fa(0x1b6)](0x0,0x0,_0x4b96ab,_0x4b96ab,_0x137245),_0x4b96ab-=0x2,_0xd246ba[_0x2402fa(0x18d)][_0x2402fa(0x1b6)](0x1,0x1,_0x4b96ab,_0x4b96ab,_0x434c52),_0x4b96ab-=_0xd37f26*0x2,_0xd246ba[_0x2402fa(0x18d)][_0x2402fa(0x1b6)](0x1+_0xd37f26,0x1+_0xd37f26,_0x4b96ab,_0x4b96ab,_0x137245),_0x4b96ab-=0x2,_0xd37f26+=0x1,_0xd246ba[_0x2402fa(0x18d)][_0x2402fa(0x165)](0x1+_0xd37f26,0x1+_0xd37f26,_0x4b96ab,_0x4b96ab);}this['_backgroundSprite']=_0xd246ba,this['addChild'](this[_0x2402fa(0x200)]);},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)]['createLetterSprite']=function(){const _0x54b02b=_0x12eacb,_0x138860=Sprite_FieldGaugeATB[_0x54b02b(0x1db)];if(!_0x138860[_0x54b02b(0x23f)])return;if(this[_0x54b02b(0x23b)]===$gameParty)return;const _0x187a68=_0x138860['MarkerSize'],_0x5060cd=new Sprite();_0x5060cd[_0x54b02b(0x208)]['x']=this[_0x54b02b(0x208)]['x'],_0x5060cd[_0x54b02b(0x208)]['y']=this[_0x54b02b(0x208)]['y'],_0x5060cd[_0x54b02b(0x18d)]=new Bitmap(_0x187a68,_0x187a68),this['_letterSprite']=_0x5060cd,this[_0x54b02b(0xf4)](this[_0x54b02b(0xc9)]);},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x1a1)]=function(){const _0x4e6111=_0x12eacb,_0x4b5037=Sprite_FieldGaugeATB[_0x4e6111(0x1db)];if(!_0x4b5037[_0x4e6111(0x2b7)])return;const _0x304245=new Sprite();_0x304245['anchor']['x']=this[_0x4e6111(0x208)]['x'],_0x304245[_0x4e6111(0x208)]['y']=this['anchor']['y'],this[_0x4e6111(0x19e)](_0x304245),this[_0x4e6111(0x18f)]=_0x304245,this['addChild'](this[_0x4e6111(0x18f)]);},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)]['setupArrowSprite']=function(_0x2fd4cf){const _0xe01d88=_0x12eacb,_0x5eb33d=Sprite_FieldGaugeATB[_0xe01d88(0x1db)],_0x8cb166=_0x5eb33d['MarkerSize'],_0x21fc95=Math[_0xe01d88(0xd0)](_0x8cb166/0x2),_0x42e439=this['isGaugeHorizontal'](),_0xae1b8c=this[_0xe01d88(0x23b)]===$gameParty?_0xe01d88(0x254):_0xe01d88(0x1b4),_0x558beb=_0x5eb33d[_0xe01d88(0x171)[_0xe01d88(0x2c6)](_0xae1b8c)];_0x2fd4cf['bitmap']=ImageManager[_0xe01d88(0x11b)](_0x5eb33d['MarkerArrowWindowSkin']);const _0x233d0a=0x18,_0x388d54=_0x233d0a/0x2,_0x513b02=0x60+_0x233d0a,_0x5e6b19=0x0+_0x233d0a;if(_0x42e439&&_0x558beb)_0x2fd4cf[_0xe01d88(0x2c8)](_0x513b02+_0x388d54,_0x5e6b19+_0x388d54+_0x233d0a,_0x233d0a,_0x388d54),_0x2fd4cf['y']+=_0x21fc95,_0x2fd4cf['anchor']['y']=0x0;else{if(_0x42e439&&!_0x558beb){if(_0xe01d88(0x24b)!==_0xe01d88(0x194))_0x2fd4cf[_0xe01d88(0x2c8)](_0x513b02+_0x388d54,_0x5e6b19,_0x233d0a,_0x388d54),_0x2fd4cf['y']-=_0x21fc95,_0x2fd4cf[_0xe01d88(0x208)]['y']=0x1;else{if(!_0x1c2b82[_0xe01d88(0x1e1)]())return;if(!_0x1bcdb1['Settings'][_0xe01d88(0x261)])return;if(!_0x49dc75[_0xe01d88(0x23d)])return;this[_0xe01d88(0x199)]=new _0xc81fbd(),this[_0xe01d88(0xf9)]['addChild'](this['_fieldGaugeATB']);}}else{if(!_0x42e439&&_0x558beb)_0x2fd4cf[_0xe01d88(0x2c8)](_0x513b02,_0x5e6b19+_0x388d54,_0x388d54,_0x233d0a),_0x2fd4cf['x']-=Math[_0xe01d88(0x22b)](_0x21fc95*1.75),_0x2fd4cf['anchor']['x']=0x0;else{if(!_0x42e439&&!_0x558beb){if('CqCnz'==='PfVHX')return _0x189743[_0xe01d88(0x1e1)]()?_0x448cb1['BattleSystemATB'][_0xe01d88(0x1db)][_0xe01d88(0x12d)][_0xe01d88(0xf1)][_0xe01d88(0x185)](this,this):_0x39cebc[_0xe01d88(0x18e)][_0xe01d88(0x2d2)]['call'](this);else _0x2fd4cf[_0xe01d88(0x2c8)](_0x513b02+_0x233d0a+_0x388d54,_0x5e6b19+_0x388d54,_0x388d54,_0x233d0a),_0x2fd4cf['x']+=Math[_0xe01d88(0x22b)](_0x21fc95*1.75),_0x2fd4cf[_0xe01d88(0x208)]['x']=0x1;}}}}},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x17d)]=function(){const _0x337ad0=_0x12eacb;if(this[_0x337ad0(0x23b)]===$gameParty)return _0x337ad0(0x252)===_0x337ad0(0x12c)?_0x163e86[_0x337ad0(0x1db)][_0x337ad0(0x2b4)]:$gameParty['battleMembers']()[this[_0x337ad0(0x2d5)]];else{if(_0x337ad0(0xe0)===_0x337ad0(0xe0))return $gameTroop[_0x337ad0(0x270)]()[this[_0x337ad0(0x2d5)]];else{const _0x25b9c9=_0x3107cd[_0x337ad0(0x119)][_0x337ad0(0x2c4)],_0x3cba85=_0x337ad0(0x2dd),_0x367db2=[_0x337ad0(0xcb),_0x337ad0(0x25e),_0x337ad0(0x112)];for(const _0x29d7d8 of _0x367db2){const _0x2f4d10=_0x3cba85[_0x337ad0(0x2c6)](_0x29d7d8[_0x337ad0(0x2b9)]()[_0x337ad0(0x131)](),_0x337ad0(0x28b),_0x337ad0(0x2d4)),_0x5b5d8a=new _0x1110ef(_0x2f4d10,'i');_0x3b90b1['BattleSystemATB'][_0x337ad0(0x2c4)][_0x29d7d8]=_0x5b5d8a;}}}},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x28a)]=function(){const _0x20926d=_0x12eacb;Sprite_Clickable[_0x20926d(0x1ec)][_0x20926d(0x28a)]['call'](this),this['updateOpacity'](),this[_0x20926d(0x2a6)](),this[_0x20926d(0xf7)](),this['updateGraphic'](),this['updateGraphicHue'](),this[_0x20926d(0x279)](),this[_0x20926d(0x2c2)]();},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)]['updateOpacity']=function(){const _0x4b782c=_0x12eacb,_0x4d6dde=this['targetOpacity'](),_0x5e8252=Sprite_FieldGaugeATB[_0x4b782c(0x1db)]['OpacityRate'];if(this[_0x4b782c(0xd2)]>_0x4d6dde)this[_0x4b782c(0xd2)]=Math[_0x4b782c(0x281)](_0x4d6dde,this[_0x4b782c(0xd2)]-_0x5e8252);else{if(this['opacity']<_0x4d6dde){if(_0x4b782c(0x1f4)===_0x4b782c(0x2a7)){if(this[_0x4b782c(0x297)]&&this['_statusType']===_0x4b782c(0x1ac))return this['atbCurrentValue']();return _0x511078[_0x4b782c(0x18e)]['Sprite_Gauge_currentValue'][_0x4b782c(0x185)](this);}else this[_0x4b782c(0xd2)]=Math[_0x4b782c(0x27f)](_0x4d6dde,this[_0x4b782c(0xd2)]+_0x5e8252);}}},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)]['targetOpacity']=function(){const _0x46f163=_0x12eacb,_0xd1330e=this['battler']();if(!_0xd1330e)return 0x0;if(_0xd1330e['isHidden']())return 0x0;if(_0xd1330e[_0x46f163(0xe3)]())return 0x0;return 0xff;},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x146)]=function(){const _0x444c57=_0x12eacb;if(this[_0x444c57(0x20a)]!==undefined)return this['_horz'];const _0x4379a9=Sprite_FieldGaugeATB[_0x444c57(0x1db)][_0x444c57(0x20d)];return this[_0x444c57(0x20a)]=[_0x444c57(0x275),_0x444c57(0x29c)][_0x444c57(0x21c)](_0x4379a9),this['_horz'];},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)]['updatePositionOffset']=function(){const _0x2eddc5=_0x12eacb,_0x30cafd=Sprite_FieldGaugeATB['Settings'],_0x1dab57=this[_0x2eddc5(0x146)](),_0x1f53af=this[_0x2eddc5(0x23b)]===$gameParty?'Actor':'Enemy',_0x1a9b82=_0x30cafd['MarkerOffset'],_0x5f3c6b=_0x30cafd['%1Side'[_0x2eddc5(0x2c6)](_0x1f53af)];_0x1dab57?(this['y']=_0x30cafd[_0x2eddc5(0x1e7)]/0x2,this['y']+=_0x5f3c6b?-_0x1a9b82:_0x1a9b82):(this['x']=_0x30cafd['GaugeThick']/0x2,this['x']+=_0x5f3c6b?_0x1a9b82:-_0x1a9b82);},Sprite_FieldMarkerATB['prototype']['updatePositionOnGauge']=function(_0xf34f05){const _0x464e33=_0x12eacb,_0x1dc3ae=this['battler']();if(!_0x1dc3ae)return;const _0x4f5b74=Sprite_FieldGaugeATB[_0x464e33(0x1db)],_0x2b9ed1=this['isGaugeHorizontal'](),_0x2e7d19=this[_0x464e33(0x1bc)](),_0x454fee=_0xf34f05?Infinity:_0x4f5b74[_0x464e33(0x21a)];if(_0x2b9ed1&&this['x']!==_0x2e7d19){if(_0x464e33(0x1ba)!=='uwgtm')this[_0x464e33(0x208)]['x']=0.5,this[_0x464e33(0x208)]['y']=0.5;else{if(this['x']>_0x2e7d19)this['x']=Math[_0x464e33(0x281)](_0x2e7d19,this['x']-_0x454fee);if(this['x']<_0x2e7d19)this['x']=Math[_0x464e33(0x27f)](_0x2e7d19,this['x']+_0x454fee);}}else{if(!_0x2b9ed1&&this['x']!==_0x2e7d19){if(this['y']>_0x2e7d19)this['y']=Math[_0x464e33(0x281)](_0x2e7d19,this['y']-_0x454fee);if(this['y']<_0x2e7d19)this['y']=Math[_0x464e33(0x27f)](_0x2e7d19,this['y']+_0x454fee);}}},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)]['targetPositionOnGauge']=function(){const _0x2f88f9=_0x12eacb,_0x434414=Sprite_FieldGaugeATB[_0x2f88f9(0x1db)],_0x17c0d4=this[_0x2f88f9(0x17d)](),_0x4a964c=this[_0x2f88f9(0x146)](),_0x757a50=this['_gaugeSprite']['bitmap'][_0x2f88f9(0x1d3)],_0x27ebb1=this[_0x2f88f9(0x26a)]['bitmap'][_0x2f88f9(0x16e)],_0xfda2ad=_0x434414[_0x2f88f9(0xe2)][_0x2f88f9(0x106)](0x0,0x1),_0x589670=_0x434414[_0x2f88f9(0x198)];let _0xfac641=_0x17c0d4['tpbChargeTime']()*_0xfda2ad;_0xfac641+=(0x1-_0xfda2ad)*_0x17c0d4[_0x2f88f9(0x235)]();if(_0x17c0d4===BattleManager['_subject'])_0xfac641=0x1;if(!_0x589670)_0xfac641=0x1-_0xfac641;let _0x235a54=0x0;if(_0x4a964c){if(_0x2f88f9(0x26d)!==_0x2f88f9(0x140))_0x235a54=_0xfac641*_0x757a50;else return _0x2f88f9(0x29b)[_0x2f88f9(0x2c6)](_0xd554f0(_0x1b7c61['$1']));}else!_0x4a964c&&(_0x235a54=_0xfac641*_0x27ebb1);return Math[_0x2f88f9(0xd0)](_0x235a54);},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)]['updateGraphic']=function(){const _0x22d1d6=_0x12eacb,_0x48c08f=this['battler']();if(!_0x48c08f)return;const _0x1df617=Sprite_FieldGaugeATB[_0x22d1d6(0x1db)],_0x1f432a=this['_unit']===$gameParty?'Actor':_0x22d1d6(0x1b4);let _0x1de6b2=_0x48c08f[_0x22d1d6(0x201)]();if(_0x48c08f['isActor']()&&_0x1de6b2===_0x22d1d6(0x14d)){if(_0x22d1d6(0x101)!=='HPjRg')_0x1de6b2=_0x22d1d6(0x274);else{const _0x4725e5=_0x3e8c3e[_0x22d1d6(0x1db)];if(_0x4725e5[_0x22d1d6(0x20d)]!==_0x22d1d6(0x275))return;if(!_0x4725e5[_0x22d1d6(0x234)])return;const _0x40d2b0=_0x3b094e['_scene'][_0x22d1d6(0x224)];if(!_0x40d2b0)return;_0x40d2b0[_0x22d1d6(0x16a)]?(this['x']=this[_0x22d1d6(0x1dc)]+(_0x4725e5[_0x22d1d6(0x1d1)]||0x0),this['y']=this['_homeY']+(_0x4725e5['RepositionTopHelpY']||0x0)):(this['x']=this[_0x22d1d6(0x1dc)],this['y']=this[_0x22d1d6(0x237)]);const _0x59fc8c=_0x471733[_0x22d1d6(0xea)][_0x22d1d6(0x195)];this['x']+=_0x59fc8c['x'],this['y']+=_0x59fc8c['y'];}}else _0x48c08f[_0x22d1d6(0x284)]()&&_0x1de6b2===_0x22d1d6(0xd1)&&(_0x1de6b2=_0x22d1d6(0x14d));if(this[_0x22d1d6(0x15c)]!==_0x1de6b2){if('qAwWt'!==_0x22d1d6(0x227)){if(!_0x22643c[_0x22d1d6(0x1db)][_0x22d1d6(0x282)])return;const _0x3a7cd0=_0x4af3e0['Settings'],_0x5f414c=this[_0x22d1d6(0x23b)]===_0x4daed9?'Actor':'Enemy',_0x1090c5=_0x22d1d6(0x299)[_0x22d1d6(0x2c6)](_0x5f414c),_0x33054a=new _0x352b9c();_0x33054a[_0x22d1d6(0x208)]['x']=this[_0x22d1d6(0x208)]['x'],_0x33054a[_0x22d1d6(0x208)]['y']=this[_0x22d1d6(0x208)]['y'];if(_0x3a7cd0[_0x1090c5])_0x33054a[_0x22d1d6(0x18d)]=_0x4930f6[_0x22d1d6(0x11b)](_0x3a7cd0[_0x1090c5]);else{let _0x1374d6=_0x3a7cd0[_0x22d1d6(0x128)],_0x45cae5=_0x3a7cd0[_0x22d1d6(0x113)];_0x33054a['bitmap']=new _0x24f227(_0x1374d6,_0x1374d6);const _0x492961='#000000',_0x5f51ea=_0x17bd30[_0x22d1d6(0x2a8)](_0x3a7cd0['%1BorderColor'['format'](_0x5f414c)]);_0x33054a[_0x22d1d6(0x18d)][_0x22d1d6(0x1b6)](0x0,0x0,_0x1374d6,_0x1374d6,_0x492961),_0x1374d6-=0x2,_0x33054a['bitmap']['fillRect'](0x1,0x1,_0x1374d6,_0x1374d6,_0x5f51ea),_0x1374d6-=_0x45cae5*0x2,_0x33054a[_0x22d1d6(0x18d)][_0x22d1d6(0x1b6)](0x1+_0x45cae5,0x1+_0x45cae5,_0x1374d6,_0x1374d6,_0x492961),_0x1374d6-=0x2,_0x45cae5+=0x1,_0x33054a[_0x22d1d6(0x18d)][_0x22d1d6(0x165)](0x1+_0x45cae5,0x1+_0x45cae5,_0x1374d6,_0x1374d6);}this[_0x22d1d6(0x200)]=_0x33054a,this['addChild'](this[_0x22d1d6(0x200)]);}else return this[_0x22d1d6(0x127)]();}switch(this[_0x22d1d6(0x15c)]){case _0x22d1d6(0x274):if(this['_graphicFaceName']!==_0x48c08f[_0x22d1d6(0xec)]())return this[_0x22d1d6(0x127)]();if(this[_0x22d1d6(0x20f)]!==_0x48c08f[_0x22d1d6(0x13f)]()){if(_0x22d1d6(0xc6)===_0x22d1d6(0xc6))return this[_0x22d1d6(0x127)]();else this['_svBattlerSprite']['_atbGaugeSprite']['visible']=![];}break;case _0x22d1d6(0xe8):if(this['_graphicIconIndex']!==_0x48c08f['fieldAtbGraphicIconIndex']())return this['processUpdateGraphic']();break;case _0x22d1d6(0x14d):if(_0x48c08f[_0x22d1d6(0x190)]()){if(this[_0x22d1d6(0x11c)]!==_0x48c08f['svBattlerName']())return this['processUpdateGraphic']();}else{if(this['_graphicEnemy']!==_0x48c08f['battlerName']())return this[_0x22d1d6(0x127)]();}break;case'svactor':if(_0x48c08f[_0x22d1d6(0x2b6)]()){if(_0x22d1d6(0x286)!=='xvjMo'){if(this[_0x22d1d6(0x11c)]!==_0x48c08f[_0x22d1d6(0x1de)]()){if(_0x22d1d6(0x24d)===_0x22d1d6(0x149)){const _0x2aefdb=_0x122b03[_0x22d1d6(0x12b)]();for(let _0x3a2698=0x0;_0x3a2698<_0x2aefdb;_0x3a2698++){this[_0x22d1d6(0x1ea)](_0x3a2698,_0x54cef7);}}else return this[_0x22d1d6(0x127)]();}}else _0x19e03a+=this[_0x22d1d6(0x297)][_0x22d1d6(0x253)]();}else{if(this['_graphicEnemy']!==_0x48c08f[_0x22d1d6(0x1de)]())return this[_0x22d1d6(0x127)]();}break;}},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x127)]=function(){const _0x55ade4=_0x12eacb,_0x24d09e=this[_0x55ade4(0x17d)]();if(!_0x24d09e)return;this[_0x55ade4(0x15c)]=_0x24d09e[_0x55ade4(0x201)]();if(_0x24d09e[_0x55ade4(0x2b6)]()&&this[_0x55ade4(0x15c)]==='enemy')this[_0x55ade4(0x15c)]=_0x55ade4(0x274);else _0x24d09e[_0x55ade4(0x284)]()&&this['_graphicType']===_0x55ade4(0xd1)&&(this['_graphicType']=_0x55ade4(0x14d));let _0x254382;switch(this[_0x55ade4(0x15c)]){case'face':this[_0x55ade4(0xda)]=_0x24d09e['fieldAtbGraphicFaceName'](),this['_graphicFaceIndex']=_0x24d09e[_0x55ade4(0x13f)](),_0x254382=ImageManager['loadFace'](this[_0x55ade4(0xda)]),_0x254382[_0x55ade4(0x19b)](this[_0x55ade4(0x212)][_0x55ade4(0x154)](this,_0x254382));break;case'icon':this['_graphicIconIndex']=_0x24d09e['fieldAtbGraphicIconIndex'](),_0x254382=ImageManager[_0x55ade4(0x11b)](_0x55ade4(0x277)),_0x254382[_0x55ade4(0x19b)](this[_0x55ade4(0x13d)][_0x55ade4(0x154)](this,_0x254382));break;case _0x55ade4(0x14d):if(_0x24d09e[_0x55ade4(0x190)]())this[_0x55ade4(0x11c)]=_0x24d09e[_0x55ade4(0x240)](),_0x254382=ImageManager['loadSvActor'](this[_0x55ade4(0x11c)]),_0x254382[_0x55ade4(0x19b)](this[_0x55ade4(0x25b)][_0x55ade4(0x154)](this,_0x254382));else $gameSystem[_0x55ade4(0xd5)]()?(this[_0x55ade4(0x142)]=_0x24d09e['battlerName'](),_0x254382=ImageManager['loadSvEnemy'](this[_0x55ade4(0x142)]),_0x254382[_0x55ade4(0x19b)](this[_0x55ade4(0x169)][_0x55ade4(0x154)](this,_0x254382))):(this[_0x55ade4(0x142)]=_0x24d09e[_0x55ade4(0x1de)](),_0x254382=ImageManager[_0x55ade4(0x1af)](this[_0x55ade4(0x142)]),_0x254382['addLoadListener'](this[_0x55ade4(0x169)][_0x55ade4(0x154)](this,_0x254382)));break;case _0x55ade4(0xd1):this[_0x55ade4(0x11c)]=_0x24d09e[_0x55ade4(0x1de)](),_0x254382=ImageManager[_0x55ade4(0x148)](this[_0x55ade4(0x11c)]),_0x254382[_0x55ade4(0x19b)](this[_0x55ade4(0x25b)][_0x55ade4(0x154)](this,_0x254382));break;}},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x212)]=function(_0x209f00){const _0x342007=_0x12eacb,_0x274978=Sprite_FieldGaugeATB[_0x342007(0x1db)],_0x3c126c=_0x274978[_0x342007(0x128)],_0x1b730f=this[_0x342007(0x20f)];this['_graphicSprite'][_0x342007(0x18d)]=new Bitmap(_0x3c126c,_0x3c126c);const _0x1c36bc=this['_graphicSprite'][_0x342007(0x18d)],_0x4d310e=ImageManager[_0x342007(0x20b)],_0x3fbb2f=ImageManager[_0x342007(0x2ce)],_0x4866e8=ImageManager[_0x342007(0x20b)],_0x5c2503=ImageManager['faceHeight'],_0x30047d=_0x1b730f%0x4*_0x4d310e+(_0x4d310e-_0x4866e8)/0x2,_0x584f18=Math[_0x342007(0x1be)](_0x1b730f/0x4)*_0x3fbb2f+(_0x3fbb2f-_0x5c2503)/0x2;_0x1c36bc[_0x342007(0x2d8)](_0x209f00,_0x30047d,_0x584f18,_0x4866e8,_0x5c2503,0x0,0x0,_0x3c126c,_0x3c126c);},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x13d)]=function(_0x19101e){const _0x49f3cd=_0x12eacb,_0x404891=Sprite_FieldGaugeATB[_0x49f3cd(0x1db)],_0x3dfdb3=_0x404891[_0x49f3cd(0x128)],_0x4d6d2b=this[_0x49f3cd(0x2c5)];this[_0x49f3cd(0x218)][_0x49f3cd(0x18d)]=new Bitmap(_0x3dfdb3,_0x3dfdb3);const _0xb44495=this[_0x49f3cd(0x218)]['bitmap'],_0x11c9ed=ImageManager[_0x49f3cd(0x1ee)],_0x1de0c8=ImageManager[_0x49f3cd(0x12e)],_0x5257f0=_0x4d6d2b%0x10*_0x11c9ed,_0x94f130=Math[_0x49f3cd(0x1be)](_0x4d6d2b/0x10)*_0x1de0c8;_0xb44495['blt'](_0x19101e,_0x5257f0,_0x94f130,_0x11c9ed,_0x1de0c8,0x0,0x0,_0x3dfdb3,_0x3dfdb3);},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x25b)]=function(_0x2b9e4d){const _0x217f0b=_0x12eacb,_0x15e934=Sprite_FieldGaugeATB[_0x217f0b(0x1db)],_0x690a0a=_0x15e934[_0x217f0b(0x128)];this[_0x217f0b(0x218)][_0x217f0b(0x18d)]=new Bitmap(_0x690a0a,_0x690a0a);const _0x19afe9=this[_0x217f0b(0x218)][_0x217f0b(0x18d)],_0x46a6a3=0x9,_0x4e94de=0x6,_0x664bbb=_0x2b9e4d[_0x217f0b(0x1d3)]/_0x46a6a3,_0x4f33d5=_0x2b9e4d[_0x217f0b(0x16e)]/_0x4e94de,_0x32486c=Math['min'](0x1,_0x690a0a/_0x664bbb,_0x690a0a/_0x4f33d5),_0x5a1077=_0x664bbb*_0x32486c,_0x54e6cf=_0x4f33d5*_0x32486c,_0x357351=Math[_0x217f0b(0xd0)]((_0x690a0a-_0x5a1077)/0x2),_0x211c64=Math['round']((_0x690a0a-_0x54e6cf)/0x2);_0x19afe9[_0x217f0b(0x2d8)](_0x2b9e4d,0x0,0x0,_0x664bbb,_0x4f33d5,_0x357351,_0x211c64,_0x5a1077,_0x54e6cf);},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x169)]=function(_0x532fdf){const _0x2ea3ab=_0x12eacb,_0x3973e7=Sprite_FieldGaugeATB[_0x2ea3ab(0x1db)],_0x293d32=_0x3973e7['MarkerSize'];this['_graphicSprite']['bitmap']=new Bitmap(_0x293d32,_0x293d32);const _0x44080f=this[_0x2ea3ab(0x218)][_0x2ea3ab(0x18d)],_0x4813a8=Math[_0x2ea3ab(0x27f)](0x1,_0x293d32/_0x532fdf[_0x2ea3ab(0x1d3)],_0x293d32/_0x532fdf['height']),_0x2b55b1=_0x532fdf[_0x2ea3ab(0x1d3)]*_0x4813a8,_0x1cac5b=_0x532fdf[_0x2ea3ab(0x16e)]*_0x4813a8,_0x139db5=Math[_0x2ea3ab(0xd0)]((_0x293d32-_0x2b55b1)/0x2),_0x2f25f1=Math[_0x2ea3ab(0xd0)]((_0x293d32-_0x1cac5b)/0x2);_0x44080f['blt'](_0x532fdf,0x0,0x0,_0x532fdf[_0x2ea3ab(0x1d3)],_0x532fdf['height'],_0x139db5,_0x2f25f1,_0x2b55b1,_0x1cac5b);},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x267)]=function(){const _0x405cf2=_0x12eacb,_0x710533=this[_0x405cf2(0x17d)]();if(!_0x710533)return;if(!_0x710533['isEnemy']())return;if(this[_0x405cf2(0x1c9)]===_0x710533['battlerHue']())return;this[_0x405cf2(0x1c9)]=_0x710533[_0x405cf2(0x1ce)]();if(_0x710533[_0x405cf2(0x190)]())this[_0x405cf2(0x1c9)]=0x0;this['_graphicSprite'][_0x405cf2(0x179)](this[_0x405cf2(0x1c9)]);},Sprite_FieldMarkerATB['prototype'][_0x12eacb(0x279)]=function(){const _0xd76d21=_0x12eacb;if(!this['_letterSprite'])return;const _0x3052ed=this[_0xd76d21(0x17d)]();if(!_0x3052ed)return;if(this[_0xd76d21(0x229)]===_0x3052ed[_0xd76d21(0x229)]&&this[_0xd76d21(0x14a)]===_0x3052ed[_0xd76d21(0x14a)])return;this[_0xd76d21(0x229)]=_0x3052ed[_0xd76d21(0x229)],this[_0xd76d21(0x14a)]=_0x3052ed[_0xd76d21(0x14a)];const _0x1bf871=Sprite_FieldGaugeATB['Settings'],_0x3b5780=_0x1bf871[_0xd76d21(0x128)],_0x529776=Math['floor'](_0x3b5780/0x2),_0x310cbc=this[_0xd76d21(0xc9)][_0xd76d21(0x18d)];_0x310cbc[_0xd76d21(0x230)]();if(!this['_plural'])return;_0x310cbc['fontFace']=_0x1bf871[_0xd76d21(0x276)]||$gameSystem[_0xd76d21(0x123)](),_0x310cbc[_0xd76d21(0x10d)]=_0x1bf871[_0xd76d21(0x1e6)]||0x10,_0x310cbc['drawText'](this[_0xd76d21(0x229)],0x2,_0x529776,_0x3b5780-0x4,_0x529776-0x2,_0xd76d21(0x19d));},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)]['updateSelectionEffect']=function(){const _0x57e212=_0x12eacb,_0x2ec021=this[_0x57e212(0x17d)]();if(!_0x2ec021)return;const _0x4ffa28=_0x2ec021[_0x57e212(0x17d)]();if(!_0x4ffa28)return;const _0x3d5eee=_0x4ffa28[_0x57e212(0x100)]();if(!_0x3d5eee)return;this[_0x57e212(0x19f)](_0x3d5eee[_0x57e212(0x2d6)]);},Sprite_FieldMarkerATB[_0x12eacb(0x1ec)][_0x12eacb(0x138)]=function(){const _0x5d05be=_0x12eacb;return this[_0x5d05be(0x17d)]();};