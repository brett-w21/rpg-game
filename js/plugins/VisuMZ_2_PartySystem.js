//=============================================================================
// VisuStella MZ - Party System
// VisuMZ_2_PartySystem.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_2_PartySystem = true;

var VisuMZ = VisuMZ || {};
VisuMZ.PartySystem = VisuMZ.PartySystem || {};
VisuMZ.PartySystem.version = 1.24;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 2] [Version 1.24] [PartySystem]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Party_System_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * RPG Maker MZ only gives game projects the ability to switch party members
 * within the main menu and nothing more. There's no inherent functionality to
 * lock party members, make party members required, and/or give players the
 * ability to switch party members mid-battle.
 *
 * This plugin will add in all of those functions as well as a dedicated scene
 * for switching party members. Party switching will allow party members to be
 * removed, swapped, and sorted. Through the usage of Plugin Commands, party
 * members can also be locked and/or required for party presence.
 *
 * Those using the VisuStella MZ Battle Core will also have access to features
 * in this plugin that aren't available otherwise. These features give players
 * the functionality to switch out the whole party lineup mid-battle and/or
 * individual party member switching.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Custom scene dedicated to party management.
 * * Change the maximum number of party members that can participate in battle.
 * * Plugin Commands to lock party members.
 * * Plugin Commands to make certain party members required.
 * * Added functionality with Battle Core to switch party members mid-battle.
 * * This comes in the form of changing either the whole party at once.
 * * Or switching individual members out one at a time.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 2 ------
 *
 * This plugin is a Tier 2 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
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
 * Main Menu Formation Command
 *
 * - This command is now changed to send the player to Scene_Party for the
 * player to have a dedicated scene for changing the party.
 *
 * ---
 *
 * Battle Members Array
 *
 * - Previously, the battle members are decided by which actors are lined up
 * first in the party roster. This has been changed to give players the freedom
 * to have a party size less than the maximum. This change is made by changing
 * the way the battle members are determined by using a new array. However, any
 * and all functions utilize the $gameParty.battleMembers() function will still
 * behave as normal.
 *
 * ---
 *
 * Formation Change OK Function
 *
 * - RPG Maker MZ did not do anything with the Game_Actor.isFormationChangeOk
 * function so this plugin overwrote it completely to allow for the new
 * lock and require features to work.
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
 * VisuMZ_1_BattleCore
 *
 * - If the VisuStella MZ Battle Core plugin is present, players are able to 
 * access party switching functionality mid-battle at will. This can be in the
 * form of switching out the entire active party roster at once or individually
 * for each actor.
 *
 * - Switching Entire Rosters: This can be done by going into this plugin's
 * Plugin Parameters => General => Party Command Window => Add Party Command.
 * If the Party Command Window is accessible, the player will be able to see
 * the option between 'Auto Battle' and 'Options'.
 *
 * - Individual Member Switching: This requires going to VisuMZ_1_BattleCore's
 * Plugin Parameters => Actor Command Window => Battle Commands => Command List
 * and add in the "party" option. The "party" option can also be added to the
 * <Battle Commands> notetag.
 *
 * ---
 *
 * ============================================================================
 * VisuStella MZ Compatibility
 * ============================================================================
 *
 * While this plugin is compatible with the majority of the VisuStella MZ
 * plugin library, it is not compatible with specific plugins or specific
 * features. This section will highlight the main plugins/features that will
 * not be compatible with this plugin or put focus on how the make certain
 * features compatible.
 *
 * ---
 * 
 * VisuMZ_2_BattleSystemOTB
 * 
 * With Battle System - OTB, the player cannot change entire parties at once
 * from the Party Command Window. The feature will be unaccessible while
 * Order Turn Battle is in play. However, the player can still change party
 * members through the Actor Command Window by having actors replace other
 * actors. Party changing is also available through battle events, Common
 * Events, and script calls.
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
 * === Party Plugin Commands ===
 * 
 * ---
 *
 * Party: Call Party Scene
 * - Calls the party changing scene.
 *
 * ---
 *
 * Party: Change Max Battle Members
 * - Changes the number of max battle members possible.
 * - Cannot be use mid-battle.
 *
 *   Max Members:
 *   - Changes the number of max battle members possible.
 *   - Use 0 for the game's default number.
 *
 * ---
 *
 * Party: Lock/Unlock Member(s)
 * - Allows you to lock/unlock a party member.
 * - Locked actors cannot change their party position.
 *
 *   Actor ID(s):
 *   - Select which actor(s) to lock/unlock.
 *   - Locked actors cannot change their party position.
 *
 *   Lock?:
 *   - Lock the selected actor(s)?
 *
 * ---
 * 
 * Party: Move Actor(s) to Active
 * - Map Only.
 * - Moves an actor to the active party if there is room.
 * - The actor needs to have joined the party.
 * 
 *   Actor ID(s):
 *   - Select which actor(s) to move to the active party if there is room.
 * 
 * ---
 * 
 * Party: Move Actor(s) to Reserve
 * - Map Only.
 * - Moves an actor to the reserve party.
 * - Must be 1 actor left.
 * - The actor needs to have joined the party.
 * 
 *   Actor ID(s):
 *   - Select which actor(s) to move to the reserve party.
 * 
 * ---
 * 
 * Party: Move Party Index to Reserve
 * - Map only.
 * - Moves an actor in a specific party index to reserve.
 * - Must be 1 actor left.
 * 
 *   Index:
 *   - Type in which index to move.
 *   - Index values start at 0.
 *   - You may use JavaScript code.
 * 
 * ---
 * 
 * Party: Move Random Reserve to Active
 * - Map only.
 * - Moves a random actor from the reserve party to active.
 * - Must be enough space in active party.
 * 
 * ---
 *
 * Party: Require Member(s)
 * - Allows you to require/free a party member.
 * - Required actors must be in the party to exit the scene.
 *
 *   Actor ID(s):
 *   - Select which actor(s) to require/free.
 *   - Required actors must be in the party to exit the scene.
 *
 *   Require?:
 *   - Make the selected actor(s) required?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * These Plugin Parameters control the overall behaviors pertaining to the
 * Party System added with this plugin. These behaviors range from the maximum
 * number of members that can participate in battle to the availability of the
 * party switching mechanics.
 *
 * ---
 *
 * General
 * 
 *   Max Battle Members:
 *   - Maximum number of battle members.
 *
 * ---
 *
 * Party Scene
 * 
 *   Add Remove Command:
 *   - Add the 'Remove' command to the party scene?
 * 
 *   Locked Member Icon:
 *   - Icon used for a locked party member.
 * 
 *   Required Member Icon:
 *   - Icon used for a required party member.
 *
 * ---
 *
 * Party Command Window
 * - These require VisuMZ_1_BattleCore!
 * 
 *   Add Party Command:
 *   - Add the 'Party' command to the Party Command Window?
 * 
 *   Command Cooldown:
 *   - Cooldown (in turns) for this command to be available again.
 *
 * ---
 *
 * Actor Command Window
 * - These require VisuMZ_1_BattleCore!
 * 
 *   Add Switch Command:
 *   - Add the 'Switch' command to the Actor Command Window?
 * 
 *   Command Cooldown:
 *   - Cooldown (in turns) for this command to be available again.
 * 
 *   Switch Out Animation?:
 *   - Show the sprites switching out when using individual party
 *     member switching?
 * 
 *   TPB: Immediate Action:
 *   - Allow actors to immediate act upon switching in for TPB battle systems?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Vocabulary Settings
 * ============================================================================
 *
 * These Plugin Parameters control the text that you see in-game related to the
 * Party System plugin.
 *
 * ---
 *
 * General
 * 
 *   Active Party:
 *   - Vocabulary used to represent the Active Party.
 * 
 *   Reserve Party:
 *   - Vocabulary used to represent the Reserve Party.
 * 
 *   Status:
 *   - Vocabulary used to represent the Status Window.
 * 
 *   Show Back Rectangles?:
 *   - Show back rectangles of darker colors to display information better?
 * 
 *     Back Rectangle Color:
 *     - Use #rrggbb for custom colors or regular numbers for text colors
 *       from the Window Skin.
 *
 * ---
 *
 * Party Scene > Windows
 * 
 *   Empty:
 *   - For the party and status windows when no actor is selected.
 * 
 *   Remove:
 *   - For the remove option.
 *
 * ---
 *
 * Party Scene > Button Assist
 * 
 *   Swap Positions:
 *   - Button assist text for the page up/down commands.
 *   - Requires VisuMZ_0_CoreEngine!
 * 
 *   Remove:
 *   - Button assist text for the removal command.
 *   - Requires VisuMZ_0_CoreEngine!
 * 
 *   Sort:
 *   - Button assist text for the sort command.
 *   - Requires VisuMZ_0_CoreEngine!
 * 
 *   Swap In:
 *   - Button assist text for swapping in actors.
 *   - Requires VisuMZ_0_CoreEngine!
 * 
 *   Swap Out:
 *   - Button assist text for swapping out actors.
 *   - Requires VisuMZ_0_CoreEngine!
 *
 * ---
 *
 * Battle Scene
 * 
 *   Party Command:
 *   - Command text for entering Party Scene.
 *   - Requires VisuMZ_1_BattleCore!
 * 
 *   Help: Formation:
 *   - Help text for Formation command.
 *   - Requires VisuMZ_1_BattleCore!
 * 
 *   Queue Message:
 *   - Message to say the Party Scene is queued.
 *   - Requires VisuMZ_1_BattleCore!
 * 
 *   Switch Command:
 *   - Command text for switching out members.
 *   - Requires VisuMZ_1_BattleCore!
 * 
 *   Help: Switch:
 *   - Help text for Switch command.
 *   - Requires VisuMZ_1_BattleCore!
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Background Settings
 * ============================================================================
 *
 * Background settings for Scene_Party.
 *
 * ---
 *
 * Background Settings
 * 
 *   Snapshop Opacity:
 *   - Snapshot opacity for the scene.
 * 
 *   Background 1:
 *   - Filename used for the bottom background image.
 *   - Leave empty if you don't wish to use one.
 * 
 *   Background 2:
 *   - Filename used for the upper background image.
 *   - Leave empty if you don't wish to use one.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Window Settings
 * ============================================================================
 *
 * If you don't like the locations of the windows in Scene_Party, change them
 * up with these Plugin Parameters, provided that you have an understanding of
 * JavaScript code.
 *
 * ---
 *
 * Active Party Label
 * Active Party Window
 * Reserve Party Label
 * Reserve Party Window
 * Status Label
 * Status Window
 * Battle Switch Window
 * 
 *   Background Type:
 *   - Select background type for this window.
 * 
 *   Columns:
 *   - Available only for the Reserve Party Window.
 *   - How many columns do you want there to be for the window?
 * 
 *   Actor Graphic:
 *   - Available only for Active Party Window and Reserve Party Window.
 *   - Choose how the actor graphics appear in the specific windows.
 *     - Face
 *     - Map Sprite
 *     - Sideview Battler (Requires VisuMZ_1_MainMenuCore)
 * 
 *     Map Sprite:
 *     Sideview Battler:
 * 
 *       Offset X:
 *       Offset Y:
 *       - If showing map sprites, offset the x or y coordinates.
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this window.
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
 * Version 1.24: March 24, 2022
 * * Compatibility Update!
 * ** Compatibility update with Skills & States Core Passive Conditions
 *    involving the party leader. Update made by Arisu.
 * 
 * Version 1.23: January 13, 2022
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.22: July 16, 2021
 * * Feature Update!
 * ** Added a fail safe that prevents on-battle start events from triggering
 *    when adding party members outside of battle under evented circumstances
 *    that function as a bridge between event and battle. Fix by Irina.
 * 
 * Version 1.21: July 9, 2021
 * * Bug Fixes!
 * ** When using TPB-based battle systems, adding actors to the main party
 *    would not enable them to move. This should be fixed. Fix made by Irina.
 * 
 * Version 1.20: July 2, 2021
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.19: June 18, 2021
 * * Compatibility Update
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.18: April 16, 2021
 * * Documentation Update!
 * ** Fixed typo. Fix made by Arisu.
 * 
 * Version 1.17: March 26, 2021
 * * Documentation Update!
 * ** Added "VisuStella MZ Compatibility" section for detailed compatibility
 *    explanations with the VisuMZ_2_BattleSystemOTB plugin.
 * 
 * Version 1.16: March 19, 2021
 * * Compatibility Update
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.15: March 5, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features
 * ** New Plugin Parameter added by Irina:
 * *** Plugin Parameters > Gneral > Battle Scene > Battle Party Icon
 * **** For some reason, we never had a setting that lets you change the party
 *      icon. Well, now there is!
 * 
 * Version 1.14: February 5, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands added by Arisu!
 * *** Party: Move Party Index to Reserve
 * **** Moves an actor in a specific party index to reserve.
 *      Map only. Must be 1 actor left. You may use code.
 * *** Party: Move Random Reserve to Active
 * **** Moves a random actor from the reserve party to active.
 *      Map only. Must be enough space in active party.
 * 
 * Version 1.13: January 29, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands added by Arisu!
 * *** Party: Move Actor(s) to Active
 * **** Map only. Moves an actor to the active party if there is room.
 * *** Party: Move Actor(s) to Reserve
 * **** Map only. Moves an actor to the reserve party.
 * 
 * Version 1.12: January 15, 2021
 * * Bug Fixes!
 * ** For battle testing, if the number of battle test members exceeds the
 *    maximum battle member slots, trim them until they match. Fix by Olivia.
 * 
 * Version 1.11: January 1, 2021
 * * Compatibility Update
 * ** Plugins should be more compatible with one another.
 * 
 * Version 1.10: December 25, 2020
 * * Compatibility Update
 * ** Plugins should be more compatible with one another.
 * 
 * Version 1.09: December 18, 2020
 * * Bug Fixes!
 * ** Removing party members in the active party by event command will now be
 *    properly removed from the party. Fix made by Yanfly.
 * 
 * Version 1.08: December 4, 2020
 * * Bug Fixes!
 * ** With TPB battle systems, after switching out party members, the battle
 *    system will no longer carry over any previous active battle members in
 *    the command window. Fix made by Yanfly.
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * 
 * Version 1.07: November 22, 2020
 * * Bug Fixes!
 * ** With Active TPB, switching out a party member mid-action is no longer
 *    possible to prevent bugs. Intead, there party switching action will be
 *    queued and take effect after the action has been completed. Fix made by
 *    Yanfly.
 * * Compatibility Update!
 * ** Game_Party.swapOrder function now works with this plugin. However, keep
 *    in mind that due to how this party system plugin allows you have empty
 *    slots in the active battle party, this function will fill in the empty
 *    slots upon usage. Update made by Yanfly.
 *
 * Version 1.06: November 1, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * 
 * Version 1.05: October 25, 2020
 * * Bug Fixes!
 * ** Plugin Command "Party: Change Max Battle Members" now works again.
 *    Fix made by Arisu.
 *
 * Version 1.04: October 18, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * 
 * Version 1.03: October 11, 2020
 * * Bug Fixes!
 * ** Adding party members during battle through the party window command will
 *    no longer cause crashes after they input an action. Fix made by Yanfly.
 * 
 * Version 1.02: October 4, 2020
 * * Bug Fixes!
 * ** Adding party members during test play should now work again.
 *    Fix made by Irina.
 * ** Changing party members mid-battle through the actor command should now
 *    refresh the party followers afterwards. Fix made by Yanfly.
 * * New Features!
 * ** New Plugin Parameter added by Arisu!
 * *** General > Party Command Window > TPB: Immediate Action
 * **** Allow actors to immediate act upon switching in for TPB battle systems?
 * 
 * Version 1.01: September 27, 2020
 * * Bug Fixes!
 * ** When switching actors with states, buffs, and/or debuffs already applied,
 *    the state icons found in the status window will now switch over properly,
 *    too. Fix made by Arisu.
 *
 * Version 1.00: September 7, 2020
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command CallPartyScene
 * @text Party: Call Party Scene
 * @desc Calls the party changing scene.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ChangeMaxBattleMembers
 * @text Party: Change Max Battle Members
 * @desc Changes the number of max battle members possible.
 * Cannot be use mid-battle.
 *
 * @arg Value:eval
 * @text Max Members
 * @desc Changes the number of max battle members possible.
 * Use 0 for the game's default number.
 * @default 4
 *
 * @ --------------------------------------------------------------------------
 *
 * @command LockPartyMembers
 * @text Party: Lock/Unlock Member(s)
 * @desc Allows you to lock/unlock a party member.
 * Locked actors cannot change their party position.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which actor(s) to lock/unlock.
 * Locked actors cannot change their party position.
 * @default ["1"]
 * 
 * @arg Lock:eval
 * @text Lock?
 * @type boolean
 * @on Lock
 * @off Unlock
 * @desc Lock the selected actor(s)?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command MoveActorsToActive
 * @text Party: Move Actor(s) to Active
 * @desc Moves an actor to the active party if there is room.
 * Map only. The actor needs to have joined the party.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which actor(s) to move to the active party if there is room.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command MoveActorsToReserve
 * @text Party: Move Actor(s) to Reserve
 * @desc Moves an actor to the reserve party. Must be 1 actor left.
 * Map only. The actor needs to have joined the party.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which actor(s) to move to the reserve party.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command MovePartyIndexToReserve
 * @text Party: Move Party Index to Reserve
 * @desc Moves an actor in a specific party index to reserve.
 * Map only. Must be 1 actor left.
 *
 * @arg Index:eval
 * @text Party Index
 * @desc Type in which index to move. Index values start at 0.
 * You may use JavaScript code.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command MoveRandomToActive
 * @text Party: Move Random Reserve to Active
 * @desc Moves a random actor from the reserve party to active.
 * Map only. Must be enough space in active party.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command RequirePartyMembers
 * @text Party: Require Member(s)
 * @desc Allows you to require/free a party member.
 * Required actors must be in the party to exit the scene.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which actor(s) to require/free.
 * Required actors must be in the party to exit the scene.
 * @default ["1"]
 * 
 * @arg Require:eval
 * @text Require?
 * @type boolean
 * @on Require
 * @off Don't Require
 * @desc Make the selected actor(s) required?
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
 * @param PartySystem
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param General:struct
 * @text General Settings
 * @type struct<General>
 * @desc General settings pertaining to Party-related mechanics.
 * @default {"General":"","MaxBattleMembers:num":"4","PartyScene":"","AddRemoveCmd:eval":"true","LockIcon:num":"195","RequireIcon:num":"87","DrawBackRect:eval":"true","BackRectColor:str":"19","PartyCmdWin":"","PartyCmdWinAddParty:eval":"false","PartyCmdCooldown:num":"1","tpbImmediateAction:eval":"true","ActorCmdWin":"","ActorCmdWinAddParty:eval":"true","ActorCmdCooldown:num":"1","SwitchOutAnimation:eval":"true"}
 *
 * @param Vocab:struct
 * @text Vocabulary Settings
 * @type struct<Vocab>
 * @desc These settings let you adjust the text displayed for this plugin.
 * @default {"General":"","ActiveParty:str":"Active Party","ReserveParty:str":"Reserve Party","Status:str":"Status","PartyScene":"","Windows":"","Empty:str":"- Empty -","Remove:str":"Remove","ButtonAssist":"","AssistSwapPosition:str":"Quick Swap","AssistRemove:str":"Remove","AssistSort:str":"Sort","AssistSwapIn:str":"Swap In","AssistSwapOut:str":"Swap Out","BattleScene":"","BattlePartyCmd:str":"Party","BattleHelpFormation:json":"\"Change up your party formation.\"","QueuePartyScene:str":"%1 Menu queued after action is complete.","BattleSwitchOut:str":"Switch","BattleHelpSwitch:json":"\"Switch out this party member with another.\""}
 *
 * @param BgSettings:struct
 * @text Background Settings
 * @type struct<BgSettings>
 * @desc Background settings for Scene_Party.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Window:struct
 * @text Window Settings
 * @type struct<Window>
 * @desc These settings let you control how the windows appear in Scene_Party.
 * @default {"ActivePartyLabel":"","ActivePartyLabelBgType:num":"0","ActivePartyLabelRect:func":"\"const wx = 0;\\nconst wy = this.mainAreaTop();\\nconst ww = Graphics.boxWidth;\\nconst wh = Window_Base.prototype.lineHeight();\\nreturn new Rectangle(wx, wy, ww, wh);\"","ActivePartyWindow":"","ActivePartyWindowBgType:num":"0","ActivePartyGraphic:str":"face","ActivePartyMapSprite":"","ActiveSpriteOffsetX:num":"0","ActiveSpriteOffsetY:num":"4","ActivePartySvBattler":"","ActiveBattlerOffsetX:num":"0","ActiveBattlerOffsetY:num":"4","ActivePartyWindowRect:func":"\"const wx = 0;\\nconst wy = this._activePartyLabel.y + this._activePartyLabel.height;\\nconst ww = Graphics.boxWidth;\\nconst wh = ImageManager.faceHeight + $gameSystem.windowPadding() * 2 + 2;\\nreturn new Rectangle(wx, wy, ww, wh);\"","ReservePartyLabel":"","ReservePartyLabelBgType:num":"0","ReservePartyLabelRect:func":"\"const ww = Math.max(240, Math.min(Graphics.boxWidth - 576, Math.round(Graphics.boxWidth / 2)));\\nconst wx = this.isRightInputMode() ? (Graphics.boxWidth - ww) : 0;\\nconst wy = this._activePartyWindow.y + this._activePartyWindow.height;\\nconst wh = Window_Base.prototype.lineHeight();\\nreturn new Rectangle(wx, wy, ww, wh);\"","ReservePartyWindow":"","ReservePartyWindowBgType:num":"0","ReserveItemThickness:num":"2","ReservePartyGraphic:str":"face","ReservePartyMapSprite":"","ReserveSpriteOffsetX:num":"24","ReserveSpriteOffsetY:num":"4","ReservePartySvBattler":"","ReserveBattlerOffsetX:num":"48","ReserveBattlerOffsetY:num":"4","ReservePartyWindowRect:func":"\"const ww = this._reservePartyLabel.width;\\nconst wx = this._reservePartyLabel.x;\\nconst wy = this._reservePartyLabel.y + this._reservePartyLabel.height;\\nconst wh = this.mainAreaHeight() - this._reservePartyLabel.height - this._activePartyWindow.height - this._activePartyLabel.height;\\nreturn new Rectangle(wx, wy, ww, wh);\"","StatusLabel":"","StatusLabelBgType:num":"0","StatusLabelRect:func":"\"const ww = Graphics.boxWidth - this._reservePartyLabel.width;\\nconst wx = this.isRightInputMode() ? 0 : (Graphics.boxWidth - ww);\\nconst wy = this._activePartyWindow.y + this._activePartyWindow.height;\\nconst wh = Window_Base.prototype.lineHeight();\\nreturn new Rectangle(wx, wy, ww, wh);\"","StatusWindow":"","StatusWindowBgType:num":"0","StatusWindowDraw:func":"\"// Draw Empty\\nif (!this._actor) {\\n    this.drawItemDarkRect(0, 0, this.innerWidth, this.innerHeight);\\n    const y = Math.round((this.innerHeight - this.lineHeight()) / 2);\\n    this.changeTextColor(ColorManager.systemColor());\\n    this.drawText(TextManager.emptyPartyMember, 0, y, this.innerWidth, 'center');\\n    return;\\n}\\n\\n// Draw Face and Simple Status\\nthis.drawActorFace(this._actor, 1, 0, ImageManager.faceWidth, ImageManager.faceHeight);\\nthis.drawActorSimpleStatus(this._actor, ImageManager.faceWidth + 36, 0);\\n\\n// Declare Constants\\nconst lineHeight = this.lineHeight();\\nconst params = this.actorParams();\\nconst paramWidth = Math.round(this.innerWidth / 2);\\nconst paramHeight = Math.ceil(params.length / 2) * lineHeight;\\nconst baseX = 0;\\nlet x = 0;\\nlet y = ImageManager.faceHeight + lineHeight / 2;\\n\\n// Draw Parameters\\nfor (const param of params) {\\n    this.drawItemDarkRect(x, y, paramWidth, lineHeight);\\n    this.drawParamName(param, x, y, paramWidth);\\n    this.drawParamValue(param, x, y, paramWidth);\\n\\n    if (x === baseX) {\\n        x += paramWidth;\\n    } else {\\n        x = baseX;\\n        y += lineHeight;\\n    }\\n}\"","StatusWindowRect:func":"\"const ww = this._statusPartyLabel.width;\\nconst wx = this.isRightInputMode() ? 0 : (Graphics.boxWidth - ww);\\nconst wy = this._reservePartyWindow.y;\\nconst wh = this._reservePartyWindow.height;\\nreturn new Rectangle(wx, wy, ww, wh);\"","BattleSwitchWindow":"","BattleSwitchWindowBgType:num":"0","BattleSwitchWindowRect:func":"\"const padding = $gameSystem.windowPadding() * 2;\\nlet ww = 516 + padding;\\nlet wh = Window_PartyBattleSwitch.prototype.itemHeight() * 4 + padding;\\nlet wx = Math.round(Graphics.boxWidth - ww) / 2;\\nlet wy = Math.round(Graphics.boxHeight - wh - this._statusWindow.height) / 2;\\nwy = wy.clamp(0, Graphics.boxHeight - wh - this._statusWindow.height);\\nreturn new Rectangle(wx, wy, ww, wh);\""}
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
 * General Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~General:
 *
 * @param General
 *
 * @param MaxBattleMembers:num
 * @text Max Battle Members
 * @parent General
 * @type number
 * @min 1
 * @desc Maximum number of battle members.
 * @default 4
 *
 * @param BattleScene
 * @text Battle Scene
 *
 * @param BattlePartyIcon:num
 * @text Battle Party Icon
 * @parent BattleScene
 * @desc Icon used for changing party members.
 * @default 75
 *
 * @param PartyScene
 * @text Party Scene
 *
 * @param AddRemoveCmd:eval
 * @text Add Remove Command
 * @parent PartyScene
 * @type boolean
 * @on Add Command
 * @off Don't Add
 * @desc Add the 'Remove' command to the party scene?
 * @default true
 *
 * @param LockIcon:num
 * @text Locked Member Icon
 * @parent PartyScene
 * @desc Icon used for a locked party member.
 * @default 195
 *
 * @param RequireIcon:num
 * @text Required Member Icon
 * @parent PartyScene
 * @desc Icon used for a required party member.
 * @default 87
 *
 * @param DrawBackRect:eval
 * @text Show Back Rectangles?
 * @parent PartyScene
 * @type boolean
 * @on Draw
 * @off Don't Draw
 * @desc Show back rectangles of darker colors to display information better?
 * @default true
 *
 * @param BackRectColor:str
 * @text Back Rectangle Color
 * @parent DrawBackRect:eval
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 19
 *
 * @param PartyCmdWin
 * @text Party Command Window
 *
 * @param PartyCmdWinAddParty:eval
 * @text Add Party Command
 * @parent PartyCmdWin
 * @type boolean
 * @on Add Command
 * @off Don't Add
 * @desc Add the 'Party' command to the Party Command Window?
 * @default false
 *
 * @param PartyCmdCooldown:num
 * @text Command Cooldown
 * @parent PartyCmdWin
 * @desc Cooldown (in turns) for this command to be available again.
 * @default 1
 *
 * @param ActorCmdWin
 * @text Actor Command Window
 *
 * @param ActorCmdWinAddParty:eval
 * @text Add Switch Command
 * @parent ActorCmdWin
 * @type boolean
 * @on Add Command
 * @off Don't Add
 * @desc Add the 'Switch' command to the Actor Command Window?
 * @default true
 *
 * @param ActorCmdCooldown:num
 * @text Command Cooldown
 * @parent ActorCmdWin
 * @desc Cooldown (in turns) for this command to be available again.
 * @default 1
 *
 * @param SwitchOutAnimation:eval
 * @text Switch Out Animation?
 * @parent ActorCmdWin
 * @type boolean
 * @on Show
 * @off Don't
 * @desc Show the sprites switching out when using individual party member switching?
 * @default true
 *
 * @param tpbImmediateAction:eval
 * @text TPB: Immediate Action
 * @parent ActorCmdWin
 * @type boolean
 * @on Immediate Action
 * @off Empty Gauge
 * @desc Allow actors to immediate act upon switching in for TPB battle systems?
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Vocabulary Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Vocab:
 *
 * @param General
 *
 * @param ActiveParty:str
 * @text Active Party
 * @parent General
 * @desc Vocabulary used to represent the Active Party.
 * @default Active Party
 *
 * @param ReserveParty:str
 * @text Reserve Party
 * @parent General
 * @desc Vocabulary used to represent the Reserve Party.
 * @default Reserve Party
 *
 * @param Status:str
 * @text Status
 * @parent General
 * @desc Vocabulary used to represent the Status Window.
 * @default Status
 *
 * @param PartyScene
 * @text Party Scene
 *
 * @param Windows
 * @parent PartyScene
 *
 * @param Empty:str
 * @text Empty
 * @parent Windows
 * @desc For the party and status windows when no actor is selected.
 * @default - Empty -
 *
 * @param Remove:str
 * @text Remove
 * @parent Windows
 * @desc For the remove option.
 * @default Remove
 *
 * @param ButtonAssist
 * @text Button Assist
 * @parent PartyScene
 *
 * @param AssistSwapPosition:str
 * @text Swap Positions
 * @parent ButtonAssist
 * @desc Button assist text for the page up/down commands.
 * Requires VisuMZ_0_CoreEngine!
 * @default Quick Swap
 *
 * @param AssistRemove:str
 * @text Remove
 * @parent ButtonAssist
 * @desc Button assist text for the removal command.
 * Requires VisuMZ_0_CoreEngine!
 * @default Remove
 *
 * @param AssistSort:str
 * @text Sort
 * @parent ButtonAssist
 * @desc Button assist text for the sort command.
 * Requires VisuMZ_0_CoreEngine!
 * @default Sort
 *
 * @param AssistSwapIn:str
 * @text Swap In
 * @parent ButtonAssist
 * @desc Button assist text for swapping in actors.
 * Requires VisuMZ_0_CoreEngine!
 * @default Swap In
 *
 * @param AssistSwapOut:str
 * @text Swap Out
 * @parent ButtonAssist
 * @desc Button assist text for swapping out actors.
 * Requires VisuMZ_0_CoreEngine!
 * @default Swap Out
 *
 * @param BattleScene
 * @text Battle Scene
 *
 * @param BattlePartyCmd:str
 * @text Party Command
 * @parent BattleScene
 * @desc Command text for entering Party Scene.
 * Requires VisuMZ_1_BattleCore!
 * @default Party
 *
 * @param BattleHelpFormation:json
 * @text Help: Formation
 * @parent BattlePartyCmd:str
 * @type note
 * @desc Help text for Formation command.
 * Requires VisuMZ_1_BattleCore!
 * @default "Change up your party formation."
 *
 * @param QueuePartyScene:str
 * @text Queue Message
 * @parent BattlePartyCmd:str
 * @desc Message to say the Party Scene is queued.
 * Requires VisuMZ_1_BattleCore!
 * @default %1 Menu queued after action is complete.
 *
 * @param BattleSwitchOut:str
 * @text Switch Command
 * @parent BattleScene
 * @desc Command text for switching out members.
 * Requires VisuMZ_1_BattleCore!
 * @default Switch
 *
 * @param BattleHelpSwitch:json
 * @text Help: Switch
 * @parent BattleSwitchOut:str
 * @type note
 * @desc Help text for Switch command.
 * Requires VisuMZ_1_BattleCore!
 * @default "Switch out this party member with another."
 *
 */
/* ----------------------------------------------------------------------------
 * Background Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~BgSettings:
 *
 * @param SnapshotOpacity:num
 * @text Snapshop Opacity
 * @type number
 * @min 0
 * @max 255
 * @desc Snapshot opacity for the scene.
 * @default 192
 *
 * @param BgFilename1:str
 * @text Background 1
 * @type file
 * @dir img/titles1/
 * @desc Filename used for the bottom background image.
 * Leave empty if you don't wish to use one.
 * @default 
 *
 * @param BgFilename2:str
 * @text Background 2
 * @type file
 * @dir img/titles2/
 * @desc Filename used for the upper background image.
 * Leave empty if you don't wish to use one.
 * @default 
 *
 */
/* ----------------------------------------------------------------------------
 * Window Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Window:
 *
 * @param ActivePartyLabel
 * @text Active Party Label
 *
 * @param ActivePartyLabelBgType:num
 * @text Background Type
 * @parent ActivePartyLabel
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param ActivePartyLabelRect:func
 * @text JS: X, Y, W, H
 * @parent ActivePartyLabel
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const wx = 0;\nconst wy = this.mainAreaTop();\nconst ww = Graphics.boxWidth;\nconst wh = Window_Base.prototype.lineHeight();\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param ActivePartyWindow
 * @text Active Party Window
 *
 * @param ActivePartyWindowBgType:num
 * @text Background Type
 * @parent ActivePartyWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param ActivePartyGraphic:str
 * @text Actor Graphic
 * @parent ActivePartyWindow
 * @type select
 * @option None
 * @value none
 * @option Face
 * @value face
 * @option Map Sprite
 * @value sprite
 * @option Sideview Battler (Requires VisuMZ_1_MainMenuCore)
 * @value svbattler
 * @desc Choose how the actor graphics appear in the active party menu.
 * @default face
 *
 * @param ActivePartyMapSprite
 * @text Map Sprite
 * @parent ActivePartyGraphic:str
 *
 * @param ActiveSpriteOffsetX:num
 * @text Offset X
 * @parent ActivePartyMapSprite
 * @desc If showing map sprites, offset the x coordinate here from center.
 * @default 0
 *
 * @param ActiveSpriteOffsetY:num
 * @text Offset Y
 * @parent ActivePartyMapSprite
 * @desc If showing map sprites, offset the y coordinate here from bottom.
 * @default 4
 *
 * @param ActivePartySvBattler
 * @text Sideview Battler
 * @parent ActivePartyGraphic:str
 *
 * @param ActiveBattlerOffsetX:num
 * @text Offset X
 * @parent ActivePartySvBattler
 * @desc If showing sideview battlers, offset the x coordinate here from center.
 * @default 0
 *
 * @param ActiveBattlerOffsetY:num
 * @text Offset Y
 * @parent ActivePartySvBattler
 * @desc If showing sideview battlers, offset the y coordinate here from bottom.
 * @default 4
 *
 * @param ActivePartyWindowRect:func
 * @text JS: X, Y, W, H
 * @parent ActivePartyWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const wx = 0;\nconst wy = this._activePartyLabel.y + this._activePartyLabel.height;\nconst ww = Graphics.boxWidth;\nconst wh = ImageManager.faceHeight + $gameSystem.windowPadding() * 2 + 2;\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param ReservePartyLabel
 * @text Reserve Party Label
 *
 * @param ReservePartyLabelBgType:num
 * @text Background Type
 * @parent ReservePartyLabel
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param ReservePartyLabelRect:func
 * @text JS: X, Y, W, H
 * @parent ReservePartyLabel
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const ww = Math.max(240, Math.min(Graphics.boxWidth - 576, Math.round(Graphics.boxWidth / 2)));\nconst wx = this.isRightInputMode() ? (Graphics.boxWidth - ww) : 0;\nconst wy = this._activePartyWindow.y + this._activePartyWindow.height;\nconst wh = Window_Base.prototype.lineHeight();\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param ReservePartyWindow
 * @text Reserve Party Window
 *
 * @param ReservePartyWindowBgType:num
 * @text Background Type
 * @parent ReservePartyWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param ReserveCol:num
 * @text Columns
 * @parent ReservePartyWindow
 * @type number
 * @min 1
 * @desc How many columns do you want there to be for the window?
 * @default 1
 *
 * @param ReserveItemThickness:num
 * @text Row Thickness
 * @parent ReservePartyWindow
 * @type number
 * @min 1
 * @desc How many rows thick do you want selectable items to be?
 * @default 2
 *
 * @param ReservePartyGraphic:str
 * @text Actor Graphic
 * @parent ReservePartyWindow
 * @type select
 * @option None
 * @value none
 * @option Face
 * @value face
 * @option Map Sprite
 * @value sprite
 * @option Sideview Battler (Requires VisuMZ_1_MainMenuCore)
 * @value svbattler
 * @desc Choose how the actor graphics appear in the reserve party menu.
 * @default face
 *
 * @param ReservePartyMapSprite
 * @text Map Sprite
 * @parent ReservePartyGraphic:str
 *
 * @param ReserveSpriteOffsetX:num
 * @text Offset X
 * @parent ReservePartyMapSprite
 * @desc If showing map sprites, offset the x coordinate here from left.
 * @default 24
 *
 * @param ReserveSpriteOffsetY:num
 * @text Offset Y
 * @parent ReservePartyMapSprite
 * @desc If showing map sprites, offset the y coordinate here from bottom.
 * @default 4
 *
 * @param ReservePartySvBattler
 * @text Sideview Battler
 * @parent ReservePartyGraphic:str
 *
 * @param ReserveBattlerOffsetX:num
 * @text Offset X
 * @parent ReservePartySvBattler
 * @desc If showing sideview battlers, offset the x coordinate here from left.
 * @default 48
 *
 * @param ReserveBattlerOffsetY:num
 * @text Offset Y
 * @parent ReservePartySvBattler
 * @desc If showing sideview battlers, offset the y coordinate here from bottom.
 * @default 4
 *
 * @param ReservePartyWindowRect:func
 * @text JS: X, Y, W, H
 * @parent ReservePartyWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const ww = this._reservePartyLabel.width;\nconst wx = this._reservePartyLabel.x;\nconst wy = this._reservePartyLabel.y + this._reservePartyLabel.height;\nconst wh = this.mainAreaHeight() - this._reservePartyLabel.height - this._activePartyWindow.height - this._activePartyLabel.height;\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param StatusLabel
 * @text Status Label
 *
 * @param StatusLabelBgType:num
 * @text Background Type
 * @parent StatusLabel
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param StatusLabelRect:func
 * @text JS: X, Y, W, H
 * @parent StatusLabel
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const ww = Graphics.boxWidth - this._reservePartyLabel.width;\nconst wx = this.isRightInputMode() ? 0 : (Graphics.boxWidth - ww);\nconst wy = this._activePartyWindow.y + this._activePartyWindow.height;\nconst wh = Window_Base.prototype.lineHeight();\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusWindowBgType:num
 * @text Background Type
 * @parent StatusWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param StatusWindowDraw:func
 * @text JS: Draw Data
 * @parent StatusWindow
 * @type note
 * @desc Code used to draw the display data in the Status Window.
 * @default "// Draw Empty\nif (!this._actor) {\n    this.drawItemDarkRect(0, 0, this.innerWidth, this.innerHeight);\n    const y = Math.round((this.innerHeight - this.lineHeight()) / 2);\n    this.changeTextColor(ColorManager.systemColor());\n    this.drawText(TextManager.emptyPartyMember, 0, y, this.innerWidth, 'center');\n    return;\n}\n\n// Draw Face and Simple Status\nthis.drawActorFace(this._actor, 1, 0, ImageManager.faceWidth, ImageManager.faceHeight);\nthis.drawActorSimpleStatus(this._actor, ImageManager.faceWidth + 36, 0);\n\n// Declare Constants\nconst lineHeight = this.lineHeight();\nconst params = this.actorParams();\nconst paramWidth = Math.round(this.innerWidth / 2);\nconst paramHeight = Math.ceil(params.length / 2) * lineHeight;\nconst baseX = 0;\nlet x = 0;\nlet y = ImageManager.faceHeight + lineHeight / 2;\n\n// Draw Parameters\nfor (const param of params) {\n    this.drawItemDarkRect(x, y, paramWidth, lineHeight);\n    this.drawParamName(param, x, y, paramWidth);\n    this.drawParamValue(param, x, y, paramWidth);\n\n    if (x === baseX) {\n        x += paramWidth;\n    } else {\n        x = baseX;\n        y += lineHeight;\n    }\n}"
 *
 * @param StatusWindowRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const ww = this._statusPartyLabel.width;\nconst wx = this.isRightInputMode() ? 0 : (Graphics.boxWidth - ww);\nconst wy = this._reservePartyWindow.y;\nconst wh = this._reservePartyWindow.height;\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param BattleSwitchWindow
 * @text Battle Switch Window
 *
 * @param BattleSwitchWindowBgType:num
 * @text Background Type
 * @parent BattleSwitchWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param BattleSwitchWindowRect:func
 * @text JS: X, Y, W, H
 * @parent BattleSwitchWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * Does not apply to Border Battle Layout style.
 * @default "const padding = $gameSystem.windowPadding() * 2;\nlet ww = 516 + padding;\nlet wh = Window_PartyBattleSwitch.prototype.itemHeight() * 4 + padding;\nlet wx = Math.round(Graphics.boxWidth - ww) / 2;\nlet wy = Math.round(Graphics.boxHeight - wh - this._statusWindow.height) / 2;\nwy = wy.clamp(0, Graphics.boxHeight - wh - this._statusWindow.height);\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 */
//=============================================================================

const _0x56ec57=_0x33fa;(function(_0x401f12,_0x5072d1){const _0x5db271=_0x33fa,_0x36af3f=_0x401f12();while(!![]){try{const _0x5cc189=parseInt(_0x5db271(0x36b))/0x1*(-parseInt(_0x5db271(0x387))/0x2)+parseInt(_0x5db271(0x3dc))/0x3+parseInt(_0x5db271(0x34d))/0x4+-parseInt(_0x5db271(0x3da))/0x5+parseInt(_0x5db271(0x34a))/0x6+-parseInt(_0x5db271(0x331))/0x7+parseInt(_0x5db271(0x3c9))/0x8;if(_0x5cc189===_0x5072d1)break;else _0x36af3f['push'](_0x36af3f['shift']());}catch(_0x68099){_0x36af3f['push'](_0x36af3f['shift']());}}}(_0x2e01,0xcc6b0));var label=_0x56ec57(0x433),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x56ec57(0x34b)](function(_0x485c5e){const _0x400a69=_0x56ec57;return _0x485c5e[_0x400a69(0x3bc)]&&_0x485c5e[_0x400a69(0x3fd)][_0x400a69(0x361)]('['+label+']');})[0x0];function _0x33fa(_0x26593c,_0x287897){const _0x2e0118=_0x2e01();return _0x33fa=function(_0x33fab5,_0x3c0e46){_0x33fab5=_0x33fab5-0x1f2;let _0x22fec8=_0x2e0118[_0x33fab5];return _0x22fec8;},_0x33fa(_0x26593c,_0x287897);}VisuMZ[label]['Settings']=VisuMZ[label]['Settings']||{},VisuMZ[_0x56ec57(0x222)]=function(_0x361c72,_0x4c2768){const _0x36c602=_0x56ec57;for(const _0x6a29e8 in _0x4c2768){if(_0x6a29e8[_0x36c602(0x366)](/(.*):(.*)/i)){if(_0x36c602(0x25f)===_0x36c602(0x39a)){if(!_0xb65ea4[_0x36c602(0x24c)]())return;if(_0xd4678d['battleMembers']()[_0x36c602(0x1f3)]>=_0x27df31[_0x36c602(0x30d)]())return;if(_0x4c857c['reserveMembers']()[_0x36c602(0x1f3)]<=0x0)return;const _0x3d4ce=_0x34857f['reserveMembers'](),_0x400c3a=_0x3d4ce[_0x4bb0c5[_0x36c602(0x2ff)](_0x446660[_0x36c602(0x2f1)]()*_0x3d4ce['length'])],_0x38773f=_0x400c3a['actorId']();_0x2c3a40[_0x36c602(0x28d)](_0x38773f),_0xb023fc[_0x36c602(0x262)]();}else{const _0x3bda70=String(RegExp['$1']),_0x4479de=String(RegExp['$2'])[_0x36c602(0x3a3)]()[_0x36c602(0x220)]();let _0x25e77b,_0x350462,_0x15f53f;switch(_0x4479de){case _0x36c602(0x273):_0x25e77b=_0x4c2768[_0x6a29e8]!==''?Number(_0x4c2768[_0x6a29e8]):0x0;break;case _0x36c602(0x33e):_0x350462=_0x4c2768[_0x6a29e8]!==''?JSON['parse'](_0x4c2768[_0x6a29e8]):[],_0x25e77b=_0x350462['map'](_0x1a28b2=>Number(_0x1a28b2));break;case _0x36c602(0x35b):_0x25e77b=_0x4c2768[_0x6a29e8]!==''?eval(_0x4c2768[_0x6a29e8]):null;break;case'ARRAYEVAL':_0x350462=_0x4c2768[_0x6a29e8]!==''?JSON['parse'](_0x4c2768[_0x6a29e8]):[],_0x25e77b=_0x350462['map'](_0x3ce4b8=>eval(_0x3ce4b8));break;case'JSON':_0x25e77b=_0x4c2768[_0x6a29e8]!==''?JSON['parse'](_0x4c2768[_0x6a29e8]):'';break;case _0x36c602(0x2cb):_0x350462=_0x4c2768[_0x6a29e8]!==''?JSON['parse'](_0x4c2768[_0x6a29e8]):[],_0x25e77b=_0x350462[_0x36c602(0x29a)](_0x1c8215=>JSON[_0x36c602(0x41f)](_0x1c8215));break;case'FUNC':_0x25e77b=_0x4c2768[_0x6a29e8]!==''?new Function(JSON['parse'](_0x4c2768[_0x6a29e8])):new Function(_0x36c602(0x2d8));break;case _0x36c602(0x2e0):_0x350462=_0x4c2768[_0x6a29e8]!==''?JSON[_0x36c602(0x41f)](_0x4c2768[_0x6a29e8]):[],_0x25e77b=_0x350462[_0x36c602(0x29a)](_0x186657=>new Function(JSON['parse'](_0x186657)));break;case _0x36c602(0x2b7):_0x25e77b=_0x4c2768[_0x6a29e8]!==''?String(_0x4c2768[_0x6a29e8]):'';break;case'ARRAYSTR':_0x350462=_0x4c2768[_0x6a29e8]!==''?JSON[_0x36c602(0x41f)](_0x4c2768[_0x6a29e8]):[],_0x25e77b=_0x350462['map'](_0x5252df=>String(_0x5252df));break;case _0x36c602(0x303):_0x15f53f=_0x4c2768[_0x6a29e8]!==''?JSON[_0x36c602(0x41f)](_0x4c2768[_0x6a29e8]):{},_0x25e77b=VisuMZ['ConvertParams']({},_0x15f53f);break;case _0x36c602(0x295):_0x350462=_0x4c2768[_0x6a29e8]!==''?JSON[_0x36c602(0x41f)](_0x4c2768[_0x6a29e8]):[],_0x25e77b=_0x350462[_0x36c602(0x29a)](_0x4312ef=>VisuMZ[_0x36c602(0x222)]({},JSON[_0x36c602(0x41f)](_0x4312ef)));break;default:continue;}_0x361c72[_0x3bda70]=_0x25e77b;}}}return _0x361c72;},(_0x377f33=>{const _0x591e70=_0x56ec57,_0x19de03=_0x377f33['name'];for(const _0x4194ef of dependencies){if(!Imported[_0x4194ef]){alert(_0x591e70(0x31c)[_0x591e70(0x3cc)](_0x19de03,_0x4194ef)),SceneManager[_0x591e70(0x314)]();break;}}const _0x2331ef=_0x377f33[_0x591e70(0x3fd)];if(_0x2331ef['match'](/\[Version[ ](.*?)\]/i)){const _0xbb52aa=Number(RegExp['$1']);_0xbb52aa!==VisuMZ[label][_0x591e70(0x39f)]&&(alert('%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.'[_0x591e70(0x3cc)](_0x19de03,_0xbb52aa)),SceneManager[_0x591e70(0x314)]());}if(_0x2331ef['match'](/\[Tier[ ](\d+)\]/i)){const _0x1aa86e=Number(RegExp['$1']);_0x1aa86e<tier?(alert('%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.'[_0x591e70(0x3cc)](_0x19de03,_0x1aa86e,tier)),SceneManager[_0x591e70(0x314)]()):_0x591e70(0x2b9)!==_0x591e70(0x2b9)?this[_0x591e70(0x2ea)](...arguments):tier=Math[_0x591e70(0x21f)](_0x1aa86e,tier);}VisuMZ[_0x591e70(0x222)](VisuMZ[label][_0x591e70(0x353)],_0x377f33[_0x591e70(0x429)]);})(pluginData),PluginManager[_0x56ec57(0x35c)](pluginData[_0x56ec57(0x355)],_0x56ec57(0x31f),_0x153e9f=>{SceneManager['push'](Scene_Party);}),PluginManager[_0x56ec57(0x35c)](pluginData[_0x56ec57(0x355)],_0x56ec57(0x403),_0x1ccbd4=>{const _0x55d63a=_0x56ec57;if($gameParty[_0x55d63a(0x393)]())return;VisuMZ[_0x55d63a(0x222)](_0x1ccbd4,_0x1ccbd4);const _0x3e0d59=_0x1ccbd4[_0x55d63a(0x22d)];$gameParty['changeMaxBattleMembers'](_0x3e0d59);}),PluginManager[_0x56ec57(0x35c)](pluginData[_0x56ec57(0x355)],_0x56ec57(0x28e),_0x53ce22=>{const _0x1ef0c6=_0x56ec57;if(!SceneManager[_0x1ef0c6(0x24c)]())return;VisuMZ[_0x1ef0c6(0x222)](_0x53ce22,_0x53ce22);const _0x41359a=_0x53ce22[_0x1ef0c6(0x37c)];for(const _0x5d4533 of _0x41359a){$gameParty[_0x1ef0c6(0x28d)](_0x5d4533);}$gamePlayer[_0x1ef0c6(0x262)]();}),PluginManager[_0x56ec57(0x35c)](pluginData['name'],_0x56ec57(0x375),_0x195692=>{const _0x9208a4=_0x56ec57;if(!SceneManager[_0x9208a4(0x24c)]())return;VisuMZ[_0x9208a4(0x222)](_0x195692,_0x195692);const _0x229972=_0x195692[_0x9208a4(0x37c)];for(const _0x3890b9 of _0x229972){if($gameParty[_0x9208a4(0x265)]()[_0x9208a4(0x1f3)]<=0x1)break;$gameParty[_0x9208a4(0x3e3)](_0x3890b9);}$gamePlayer['refresh']();}),PluginManager['registerCommand'](pluginData[_0x56ec57(0x355)],'MovePartyIndexToReserve',_0x8ee699=>{const _0x87f088=_0x56ec57;if(!SceneManager[_0x87f088(0x24c)]())return;if($gameParty['battleMembers']()[_0x87f088(0x1f3)]<=0x1)return;if(!$gameParty[_0x87f088(0x3cb)])return;if($gameParty[_0x87f088(0x3cb)][_0x87f088(0x1f3)]<=0x0)return;VisuMZ[_0x87f088(0x222)](_0x8ee699,_0x8ee699);const _0xa103af=_0x8ee699[_0x87f088(0x205)],_0x5bc1d0=$gameParty[_0x87f088(0x3cb)][_0xa103af];$gameParty[_0x87f088(0x3e3)](_0x5bc1d0),$gamePlayer[_0x87f088(0x262)]();}),PluginManager[_0x56ec57(0x35c)](pluginData[_0x56ec57(0x355)],_0x56ec57(0x437),_0xadd09a=>{const _0x3467c9=_0x56ec57;if(!SceneManager[_0x3467c9(0x24c)]())return;if($gameParty[_0x3467c9(0x265)]()[_0x3467c9(0x1f3)]>=$gameParty[_0x3467c9(0x30d)]())return;if($gameParty[_0x3467c9(0x425)]()[_0x3467c9(0x1f3)]<=0x0)return;const _0x2b848b=$gameParty[_0x3467c9(0x425)](),_0x3e132e=_0x2b848b[Math['floor'](Math[_0x3467c9(0x2f1)]()*_0x2b848b[_0x3467c9(0x1f3)])],_0x592995=_0x3e132e['actorId']();$gameParty['addActorToBattleMembers'](_0x592995),$gamePlayer['refresh']();}),PluginManager['registerCommand'](pluginData['name'],_0x56ec57(0x277),_0x4dac30=>{const _0x30f562=_0x56ec57;VisuMZ[_0x30f562(0x222)](_0x4dac30,_0x4dac30);const _0x20c390=_0x4dac30[_0x30f562(0x37c)][_0x30f562(0x29a)](_0x293f3f=>$gameActors['actor'](_0x293f3f))[_0x30f562(0x32e)](null),_0xf00017=_0x4dac30[_0x30f562(0x37d)];for(const _0x55f5e9 of _0x20c390){if('mPjvH'==='pQgul'){const _0x47fbfc=this[_0x30f562(0x3fc)]();this[_0x30f562(0x33c)]=new _0x57d863(_0x47fbfc),this[_0x30f562(0x33c)]['setBackgroundType'](_0x15050f[_0x30f562(0x433)]['Settings']['Window']['ActivePartyWindowBgType']),this[_0x30f562(0x33c)][_0x30f562(0x3be)]('ok',this[_0x30f562(0x377)]['bind'](this)),this[_0x30f562(0x33c)][_0x30f562(0x3be)](_0x30f562(0x3ea),this[_0x30f562(0x282)][_0x30f562(0x3c7)](this)),this[_0x30f562(0x33d)](this['_activePartyWindow']);}else{if(!_0x55f5e9)continue;_0x55f5e9[_0x30f562(0x28a)](_0xf00017);}}}),PluginManager[_0x56ec57(0x35c)](pluginData[_0x56ec57(0x355)],'RequirePartyMembers',_0x5cc992=>{const _0x562500=_0x56ec57;VisuMZ[_0x562500(0x222)](_0x5cc992,_0x5cc992);const _0x4a2957=_0x5cc992[_0x562500(0x37c)]['map'](_0x3374f1=>$gameActors[_0x562500(0x2da)](_0x3374f1))[_0x562500(0x32e)](null),_0xcfd12=_0x5cc992['Require'];for(const _0x277edd of _0x4a2957){if(!_0x277edd)continue;_0x277edd[_0x562500(0x230)](_0xcfd12);}}),ImageManager['lockPartyMemberIcon']=VisuMZ['PartySystem']['Settings'][_0x56ec57(0x22c)][_0x56ec57(0x261)],ImageManager[_0x56ec57(0x40c)]=VisuMZ[_0x56ec57(0x433)]['Settings']['General'][_0x56ec57(0x372)],TextManager[_0x56ec57(0x40e)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x322)][_0x56ec57(0x422)],TextManager['reserveParty']=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x322)][_0x56ec57(0x1f9)],TextManager['statusParty']=VisuMZ['PartySystem']['Settings'][_0x56ec57(0x322)][_0x56ec57(0x32c)],TextManager[_0x56ec57(0x3ac)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x322)][_0x56ec57(0x349)],TextManager[_0x56ec57(0x3df)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x322)][_0x56ec57(0x379)],TextManager[_0x56ec57(0x297)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)]['Vocab'][_0x56ec57(0x2a0)],TextManager[_0x56ec57(0x26f)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x322)][_0x56ec57(0x41a)],TextManager[_0x56ec57(0x328)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x322)][_0x56ec57(0x27c)],TextManager[_0x56ec57(0x39d)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x322)][_0x56ec57(0x345)],TextManager[_0x56ec57(0x3ce)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x322)][_0x56ec57(0x296)],ColorManager['getColor']=function(_0x6c6191){const _0x165eb4=_0x56ec57;return _0x6c6191=String(_0x6c6191),_0x6c6191[_0x165eb4(0x366)](/#(.*)/i)?_0x165eb4(0x35a)['format'](String(RegExp['$1'])):this[_0x165eb4(0x30a)](Number(_0x6c6191));},SceneManager['isSceneParty']=function(){const _0x326caf=_0x56ec57;return this[_0x326caf(0x2c0)]&&this[_0x326caf(0x2c0)]['constructor']===Scene_Party;},SceneManager[_0x56ec57(0x24c)]=function(){const _0x252949=_0x56ec57;return this[_0x252949(0x2c0)]&&this[_0x252949(0x2c0)][_0x252949(0x2a8)]===Scene_Map;},VisuMZ['PartySystem'][_0x56ec57(0x3eb)]=BattleManager[_0x56ec57(0x3e8)],BattleManager[_0x56ec57(0x3e8)]=function(_0x11cd92,_0x3eba2c,_0x4a8937){const _0x197587=_0x56ec57;VisuMZ[_0x197587(0x433)][_0x197587(0x3eb)][_0x197587(0x376)](this,_0x11cd92,_0x3eba2c,_0x4a8937),$gameParty['clearPartyBattleCommandCooldown']();},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x29e)]=Game_Battler[_0x56ec57(0x2de)][_0x56ec57(0x3d7)],Game_Battler[_0x56ec57(0x2de)]['onBattleStart']=function(_0x2620d4){const _0x37e081=_0x56ec57;VisuMZ[_0x37e081(0x433)][_0x37e081(0x29e)][_0x37e081(0x376)](this,_0x2620d4);if(this[_0x37e081(0x223)]())this['clearPartySwitchCommandCooldown']();},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x300)]=Game_Battler['prototype'][_0x56ec57(0x309)],Game_Battler['prototype'][_0x56ec57(0x309)]=function(){const _0x57e1ed=_0x56ec57;VisuMZ[_0x57e1ed(0x433)][_0x57e1ed(0x300)]['call'](this);if(this[_0x57e1ed(0x223)]()&&$gameParty['inBattle']())this[_0x57e1ed(0x2d1)]();},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x434)]=Game_Actor[_0x56ec57(0x2de)]['setup'],Game_Actor[_0x56ec57(0x2de)][_0x56ec57(0x3e8)]=function(_0x158116){const _0x1f8e17=_0x56ec57;VisuMZ['PartySystem'][_0x1f8e17(0x434)][_0x1f8e17(0x376)](this,_0x158116),this[_0x1f8e17(0x426)](),this[_0x1f8e17(0x371)]();},Game_Actor['prototype'][_0x56ec57(0x426)]=function(){const _0x35523b=_0x56ec57;this[_0x35523b(0x2c2)]=![],this['_partyRequired']=![];},Game_Actor[_0x56ec57(0x2de)][_0x56ec57(0x24f)]=function(){if(this['_partyLocked']===undefined)this['initPartySystem']();return!this['_partyLocked'];},Game_Actor[_0x56ec57(0x2de)][_0x56ec57(0x28a)]=function(_0x49ae29){const _0x2bbb05=_0x56ec57;if(this[_0x2bbb05(0x2c2)]===undefined)this[_0x2bbb05(0x426)]();this[_0x2bbb05(0x2c2)]=_0x49ae29;},Game_Actor['prototype'][_0x56ec57(0x354)]=function(){const _0x3f43ec=_0x56ec57;if(this[_0x3f43ec(0x251)]===undefined)this[_0x3f43ec(0x426)]();return this[_0x3f43ec(0x251)];},Game_Actor[_0x56ec57(0x2de)][_0x56ec57(0x230)]=function(_0x47811f){const _0x14a307=_0x56ec57;if(this['_partyRequired']===undefined)this[_0x14a307(0x426)]();this[_0x14a307(0x251)]=_0x47811f;},Game_Actor[_0x56ec57(0x2de)]['clearPartySwitchCommandCooldown']=function(){const _0x4a3bef=_0x56ec57;this[_0x4a3bef(0x1f5)]=0x0;},Game_Actor[_0x56ec57(0x2de)]['canSwitchPartyInBattle']=function(){const _0xf4ec13=_0x56ec57;if(this[_0xf4ec13(0x1f5)]===undefined)this[_0xf4ec13(0x371)]();if(!this[_0xf4ec13(0x24f)]())return![];if(this[_0xf4ec13(0x354)]())return![];return this[_0xf4ec13(0x1f5)]<=0x0;},Game_Actor[_0x56ec57(0x2de)][_0x56ec57(0x3d4)]=function(){const _0x556a03=_0x56ec57;if(this[_0x556a03(0x1f5)]===undefined)this['clearPartySwitchCommandCooldown']();return this[_0x556a03(0x1f5)];},Game_Actor[_0x56ec57(0x2de)]['setBattlePartySwitchCooldown']=function(_0x212580){const _0x52a37f=_0x56ec57;if(this[_0x52a37f(0x1f5)]===undefined)this[_0x52a37f(0x371)]();this[_0x52a37f(0x1f5)]=_0x212580||0x0;},Game_Actor['prototype'][_0x56ec57(0x3a1)]=function(){const _0x492df8=_0x56ec57;if(this[_0x492df8(0x1f5)]===undefined)this[_0x492df8(0x371)]();const _0x45433b=VisuMZ[_0x492df8(0x433)][_0x492df8(0x353)][_0x492df8(0x22c)][_0x492df8(0x2b6)];this[_0x492df8(0x2fe)](_0x45433b);},Game_Actor[_0x56ec57(0x2de)][_0x56ec57(0x2d1)]=function(){const _0x2c1572=_0x56ec57;if(this['_partySwitchBattleCommandCooldown']===undefined)this[_0x2c1572(0x371)]();this[_0x2c1572(0x1f5)]--;},Game_Actor['prototype'][_0x56ec57(0x35d)]=function(_0x220cef){const _0x3be9e9=_0x56ec57;Imported['VisuMZ_2_BattleSystemCTB']&&BattleManager[_0x3be9e9(0x399)]()&&BattleManager[_0x3be9e9(0x26a)]();Imported[_0x3be9e9(0x337)]&&BattleManager[_0x3be9e9(0x424)]()&&(BattleManager['updateTurnOrderSTB'](),BattleManager[_0x3be9e9(0x255)]=this,BattleManager[_0x3be9e9(0x381)]=this);if(Imported[_0x3be9e9(0x3b8)]&&BattleManager[_0x3be9e9(0x340)]()){BattleManager[_0x3be9e9(0x255)]=undefined,BattleManager['_currentActor']=this;const _0x174f8b=BattleManager[_0x3be9e9(0x203)][_0x3be9e9(0x2cc)](_0x220cef);BattleManager[_0x3be9e9(0x203)][_0x174f8b]=this,BattleManager['sortActionOrdersBTB']();}Imported[_0x3be9e9(0x2d6)]&&BattleManager[_0x3be9e9(0x212)]()&&(BattleManager[_0x3be9e9(0x255)]=this,BattleManager[_0x3be9e9(0x381)]=this);if(Imported[_0x3be9e9(0x3b6)]&&BattleManager[_0x3be9e9(0x305)]()){if(_0x3be9e9(0x3ee)==='gEfxd'){if(_0x3f2fce['isSceneParty']())return![];return _0x49a049['PartySystem'][_0x3be9e9(0x313)][_0x3be9e9(0x376)](this);}else{BattleManager[_0x3be9e9(0x255)]=this,BattleManager['_currentActor']=this;for(let _0x21dd0a=0x0;_0x21dd0a<BattleManager[_0x3be9e9(0x203)][_0x3be9e9(0x1f3)];_0x21dd0a++){const _0x4d6afd=BattleManager[_0x3be9e9(0x203)][_0x21dd0a];_0x4d6afd===_0x220cef&&(BattleManager['_actionBattlers'][_0x21dd0a]=this);}for(let _0x4a5f25=0x0;_0x4a5f25<BattleManager['_otb_actionBattlersNext'][_0x3be9e9(0x1f3)];_0x4a5f25++){const _0x2a9031=BattleManager[_0x3be9e9(0x250)][_0x4a5f25];_0x2a9031===_0x220cef&&(BattleManager['_otb_actionBattlersNext'][_0x4a5f25]=this);}}}},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x313)]=Game_Unit[_0x56ec57(0x2de)][_0x56ec57(0x393)],Game_Unit['prototype']['inBattle']=function(){const _0xed1d17=_0x56ec57;if(SceneManager[_0xed1d17(0x26c)]())return![];return VisuMZ[_0xed1d17(0x433)][_0xed1d17(0x313)][_0xed1d17(0x376)](this);},Game_Party[_0x56ec57(0x40a)]=VisuMZ['PartySystem'][_0x56ec57(0x353)][_0x56ec57(0x22c)][_0x56ec57(0x367)],VisuMZ[_0x56ec57(0x433)]['Game_Party_initialize']=Game_Party['prototype'][_0x56ec57(0x2ea)],Game_Party[_0x56ec57(0x2de)]['initialize']=function(){const _0x3d5423=_0x56ec57;VisuMZ[_0x3d5423(0x433)][_0x3d5423(0x38c)][_0x3d5423(0x376)](this),this[_0x3d5423(0x235)](),this[_0x3d5423(0x2a5)](),this[_0x3d5423(0x427)]();},Game_Party[_0x56ec57(0x2de)]['clearPartyBattleCommandCooldown']=function(){const _0x32b2e7=_0x56ec57;this[_0x32b2e7(0x3de)]=0x0;},Game_Party[_0x56ec57(0x2de)]['canSwitchPartyInBattle']=function(){const _0x1ec12a=_0x56ec57;if(this[_0x1ec12a(0x3de)]===undefined)this[_0x1ec12a(0x235)]();return this[_0x1ec12a(0x3de)]<=0x0;},Game_Party['prototype']['battlePartySwitchCooldown']=function(){const _0x26e4ad=_0x56ec57;if(this[_0x26e4ad(0x3de)]===undefined)this[_0x26e4ad(0x235)]();return this[_0x26e4ad(0x3de)];},Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x2fe)]=function(_0x55bc83){const _0x2103d7=_0x56ec57;if(this[_0x2103d7(0x3de)]===undefined)this[_0x2103d7(0x235)]();this[_0x2103d7(0x3de)]=_0x55bc83;},Game_Party[_0x56ec57(0x2de)]['applyBattlePartySwitchCooldown']=function(){const _0xa96b0a=_0x56ec57;if(this[_0xa96b0a(0x3de)]===undefined)this[_0xa96b0a(0x235)]();this[_0xa96b0a(0x3de)]=VisuMZ[_0xa96b0a(0x433)]['Settings']['General'][_0xa96b0a(0x2b4)]||0x0;},Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x2d1)]=function(){const _0x4fa14f=_0x56ec57;if(this[_0x4fa14f(0x3de)]===undefined)this[_0x4fa14f(0x235)]();this['_partySystemBattleCommandCooldown']--;},Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x2a5)]=function(){this['_battleMaxSize']=0x0;},Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x27a)]=function(_0x413242){const _0x2c5c31=_0x56ec57;this['_battleMaxSize']=_0x413242,this[_0x2c5c31(0x427)](!![]);if($gamePlayer&&$gamePlayer[_0x2c5c31(0x231)]()){if(_0x2c5c31(0x321)!=='SQLXi')$gamePlayer['followers']()['changeMaxBattleMembers']();else{this['drawItemDarkRect'](0x0,0x0,this[_0x2c5c31(0x2ec)],this[_0x2c5c31(0x38b)]);const _0x3526dd=_0x1cf1f5[_0x2c5c31(0x390)]((this[_0x2c5c31(0x38b)]-this[_0x2c5c31(0x34f)]())/0x2);this[_0x2c5c31(0x36f)](_0x38438f[_0x2c5c31(0x302)]()),this['drawText'](_0x4a650f[_0x2c5c31(0x3ac)],0x0,_0x3526dd,this[_0x2c5c31(0x2ec)],'center');return;}}},Game_Followers[_0x56ec57(0x2de)][_0x56ec57(0x27a)]=function(){const _0x46b9ae=_0x56ec57;if(!SceneManager[_0x46b9ae(0x24c)]())return;this[_0x46b9ae(0x3e8)]();const _0x322062=$gameMap[_0x46b9ae(0x290)](),_0x8484b8=$gamePlayer['x'],_0x32889f=$gamePlayer['y'],_0x1a8228=$gamePlayer['direction']();$gameTemp['_bypassAutoSavePartySystem']=!![],$gamePlayer[_0x46b9ae(0x2aa)](_0x322062,_0x8484b8,_0x32889f,_0x1a8228,0x0),setTimeout(this[_0x46b9ae(0x3b2)][_0x46b9ae(0x3c7)](this),0x7d0);},Game_Followers[_0x56ec57(0x2de)]['clearBypassAutoSave']=function(){const _0x40d263=_0x56ec57;$gameTemp[_0x40d263(0x280)]=![];},VisuMZ['PartySystem'][_0x56ec57(0x36c)]=Scene_Base['prototype'][_0x56ec57(0x20a)],Scene_Base['prototype'][_0x56ec57(0x20a)]=function(){const _0x214fc0=_0x56ec57;if($gameTemp['_bypassAutoSavePartySystem'])return![];return VisuMZ[_0x214fc0(0x433)]['Scene_Base_isAutosaveEnabled'][_0x214fc0(0x376)](this);},Game_Party['prototype'][_0x56ec57(0x30d)]=function(){const _0x4268d6=_0x56ec57;if(this['_battleMaxSize']===undefined)this['initBattleMembers']();return this[_0x4268d6(0x32b)]||Game_Party['defaultMaxBattleMembers'];},Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x339)]=function(){const _0x5b4474=_0x56ec57;if(this[_0x5b4474(0x32b)]===undefined)this[_0x5b4474(0x427)]();if(!this[_0x5b4474(0x3cb)])this[_0x5b4474(0x427)]();while(this[_0x5b4474(0x3cb)][_0x5b4474(0x1f3)]<this['_battleMaxSize']){this[_0x5b4474(0x3cb)][_0x5b4474(0x298)](0x0);}},Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x427)]=function(_0x2285eb){const _0x5d8048=_0x56ec57;if(!_0x2285eb){if('weRuO'===_0x5d8048(0x2e5))return this['lineHeight']()*0x2+0x8;else this[_0x5d8048(0x32b)]=Game_Party[_0x5d8048(0x40a)];}this[_0x5d8048(0x3cb)]=this['_actors'][_0x5d8048(0x30e)](0x0,this[_0x5d8048(0x32b)]);while(this[_0x5d8048(0x3cb)][_0x5d8048(0x1f3)]<this[_0x5d8048(0x32b)]){this[_0x5d8048(0x3cb)][_0x5d8048(0x298)](0x0);}if($gamePlayer)$gamePlayer[_0x5d8048(0x262)]();},Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x265)]=function(){const _0x426ec2=_0x56ec57;return this[_0x426ec2(0x293)]()[_0x426ec2(0x34b)](_0x227a45=>!!_0x227a45);},Game_Party[_0x56ec57(0x2de)]['rawBattleMembers']=function(){const _0x395202=_0x56ec57;this['checkInitBattleMembers']();const _0x181a82=this[_0x395202(0x3cb)][_0x395202(0x29a)](_0x182d1b=>$gameActors[_0x395202(0x2da)](_0x182d1b));return SceneManager[_0x395202(0x26c)]()?_0x181a82:_0x181a82['filter'](_0x203f50=>_0x203f50&&_0x203f50[_0x395202(0x414)]());},Game_Party['prototype'][_0x56ec57(0x425)]=function(){const _0x598a32=_0x56ec57,_0x239e5c=this[_0x598a32(0x265)]();return this['allMembers']()[_0x598a32(0x34b)](_0x4e376a=>!_0x239e5c[_0x598a32(0x361)](_0x4e376a));},VisuMZ[_0x56ec57(0x433)]['Game_Party_setupStartingMembers']=Game_Party['prototype'][_0x56ec57(0x407)],Game_Party[_0x56ec57(0x2de)]['setupStartingMembers']=function(){const _0xaa9694=_0x56ec57;VisuMZ[_0xaa9694(0x433)]['Game_Party_setupStartingMembers'][_0xaa9694(0x376)](this),this[_0xaa9694(0x427)]();},VisuMZ['PartySystem'][_0x56ec57(0x2c6)]=Game_Party[_0x56ec57(0x2de)]['setupBattleTest'],Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x3ef)]=function(){const _0x32d51a=_0x56ec57;VisuMZ['PartySystem']['Game_Party_setupBattleTest'][_0x32d51a(0x376)](this),this[_0x32d51a(0x218)]();},Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x1f4)]=function(){const _0x1cf77a=_0x56ec57;this[_0x1cf77a(0x32b)]=Game_Party['defaultMaxBattleMembers'],this[_0x1cf77a(0x3cb)]=[],this[_0x1cf77a(0x2d5)]=[];for(const _0x5f38f6 of $dataSystem[_0x1cf77a(0x3af)]){if(_0x1cf77a(0x25d)!==_0x1cf77a(0x25d))this['_partySwitchBattleCommandCooldown']=0x0;else{const _0x2f23dc=$gameActors['actor'](_0x5f38f6[_0x1cf77a(0x3a0)]);if(!_0x2f23dc)continue;_0x2f23dc[_0x1cf77a(0x259)](_0x5f38f6['level'],![]),_0x2f23dc[_0x1cf77a(0x200)](_0x5f38f6[_0x1cf77a(0x245)]),_0x2f23dc['recoverAll'](),this['_battleMembers'][_0x1cf77a(0x298)](_0x5f38f6[_0x1cf77a(0x3a0)]),this[_0x1cf77a(0x2d5)]['push'](_0x5f38f6[_0x1cf77a(0x3a0)]);}}this['_battleMembers']['remove'](0x0);while(this[_0x1cf77a(0x3cb)][_0x1cf77a(0x1f3)]<this[_0x1cf77a(0x32b)]){this[_0x1cf77a(0x3cb)]['push'](0x0);}while(this['_battleMembers'][_0x1cf77a(0x1f3)]>this[_0x1cf77a(0x30d)]()){this['_battleMembers'][_0x1cf77a(0x363)]();}if($gamePlayer)$gamePlayer[_0x1cf77a(0x262)]();},Game_Party[_0x56ec57(0x2de)]['addNonBattleTestMembers']=function(){const _0x13e87a=_0x56ec57,_0x2aa99e=this[_0x13e87a(0x265)]();for(let _0x57abe8=0x1;_0x57abe8<$dataActors[_0x13e87a(0x1f3)];_0x57abe8++){if(_0x13e87a(0x25a)===_0x13e87a(0x25a)){const _0x39bf96=$gameActors[_0x13e87a(0x2da)](_0x57abe8);if(!_0x39bf96)continue;if(_0x39bf96[_0x13e87a(0x355)]()[_0x13e87a(0x1f3)]<=0x0)continue;if(_0x39bf96[_0x13e87a(0x355)]()[_0x13e87a(0x366)](/-----/i))continue;if(_0x2aa99e[_0x13e87a(0x361)](_0x39bf96))continue;this[_0x13e87a(0x2d5)]['push'](_0x39bf96['actorId']());}else{if(!_0x41646f)return;_0xb72745?this['drawActorPartyIconsVert'](_0x153234,_0x6b8efb,_0xb93d30):this[_0x13e87a(0x24a)](_0x1bc74d,_0x582825,_0xb5c8a6);}}},VisuMZ['PartySystem'][_0x56ec57(0x417)]=Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x431)],Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x431)]=function(_0xfcf8bd){const _0xf72c01=_0x56ec57;VisuMZ[_0xf72c01(0x433)][_0xf72c01(0x417)]['call'](this,_0xfcf8bd),this[_0xf72c01(0x28d)](_0xfcf8bd),SceneManager[_0xf72c01(0x22e)]()&&(Imported['VisuMZ_2_BattleSystemOTB']&&BattleManager[_0xf72c01(0x305)]()&&(BattleManager[_0xf72c01(0x23a)](),BattleManager[_0xf72c01(0x26e)]($gameActors[_0xf72c01(0x2da)](_0xfcf8bd))));},Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x28d)]=function(_0xe15336){const _0x2e01fd=_0x56ec57;this[_0x2e01fd(0x339)]();if(this[_0x2e01fd(0x3cb)][_0x2e01fd(0x361)](_0xe15336))return;if(!this[_0x2e01fd(0x2d5)][_0x2e01fd(0x361)](_0xe15336))return;if(!this[_0x2e01fd(0x3cb)][_0x2e01fd(0x361)](0x0))return;const _0x343a35=$gameActors[_0x2e01fd(0x2da)](_0xe15336);if(!_0x343a35)return;const _0x473b26=this[_0x2e01fd(0x3cb)][_0x2e01fd(0x2cc)](0x0);if(_0x473b26<0x0)return;this[_0x2e01fd(0x3cb)][_0x473b26]=_0xe15336,SceneManager[_0x2e01fd(0x22e)]()&&(_0x2e01fd(0x275)!==_0x2e01fd(0x275)?(_0x13233c[_0x2e01fd(0x2de)][_0x2e01fd(0x34e)][_0x2e01fd(0x376)](this),this[_0x2e01fd(0x420)]()):(_0x343a35[_0x2e01fd(0x3d7)](),_0x343a35['makeActions']())),this['partyChangeRefresh']();},Game_Party['prototype'][_0x56ec57(0x42a)]=function(_0x38baa6,_0x10f0fb){const _0x1221f2=_0x56ec57;this[_0x1221f2(0x339)]();if(this[_0x1221f2(0x3cb)][_0x1221f2(0x361)](_0x38baa6))return;if(!this[_0x1221f2(0x3cb)]['includes'](0x0))return;const _0x5dbe17=$gameActors[_0x1221f2(0x2da)](_0x38baa6);if(!_0x5dbe17)return;this[_0x1221f2(0x3cb)][_0x10f0fb]=_0x38baa6,_0x5dbe17[_0x1221f2(0x2d4)](),this[_0x1221f2(0x20f)]();},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x209)]=Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x397)],Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x397)]=function(_0x1d2a45){const _0x607168=_0x56ec57;this[_0x607168(0x3e3)](_0x1d2a45),VisuMZ['PartySystem'][_0x607168(0x209)][_0x607168(0x376)](this,_0x1d2a45);},Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x3e3)]=function(_0x44bf7a){const _0x4015c6=_0x56ec57;this[_0x4015c6(0x339)]();if(!this[_0x4015c6(0x3cb)][_0x4015c6(0x361)](_0x44bf7a))return;if(_0x44bf7a<=0x0)return;const _0x3767c8=this[_0x4015c6(0x3cb)][_0x4015c6(0x2cc)](_0x44bf7a);this[_0x4015c6(0x3cb)][_0x3767c8]=0x0,this[_0x4015c6(0x2d5)][_0x4015c6(0x32e)](_0x44bf7a),this[_0x4015c6(0x2d5)][_0x4015c6(0x298)](_0x44bf7a),this[_0x4015c6(0x20f)]();},Game_Party['prototype'][_0x56ec57(0x20f)]=function(){const _0x27c094=_0x56ec57;this['rearrangePartyActors'](),$gamePlayer[_0x27c094(0x262)](),$gameMap[_0x27c094(0x409)]();},Game_Party['prototype'][_0x56ec57(0x31e)]=function(){const _0x235751=_0x56ec57;this['checkInitBattleMembers']();const _0x21a503=this[_0x235751(0x265)]()[_0x235751(0x2ac)](this[_0x235751(0x425)]());this[_0x235751(0x2d5)]=_0x21a503[_0x235751(0x29a)](_0x349607=>_0x349607?_0x349607[_0x235751(0x3a0)]():0x0)[_0x235751(0x32e)](0x0);},Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x27e)]=function(){const _0x5b4be8=_0x56ec57;this[_0x5b4be8(0x2d5)][_0x5b4be8(0x404)]((_0x23e98e,_0x22dfc8)=>_0x23e98e-_0x22dfc8),this[_0x5b4be8(0x31e)](),this['partyChangeRefresh']();},Game_Party[_0x56ec57(0x2de)]['anyRequiredPartyMembersInReserve']=function(){const _0x3056fd=_0x56ec57;for(const _0x817993 of this[_0x3056fd(0x425)]()){if(_0x3056fd(0x3b4)===_0x3056fd(0x3bb)){if(this[_0x3056fd(0x32b)]===_0x48bc64)this[_0x3056fd(0x427)]();if(!this[_0x3056fd(0x3cb)])this['initBattleMembers']();while(this['_battleMembers']['length']<this['_battleMaxSize']){this[_0x3056fd(0x3cb)][_0x3056fd(0x298)](0x0);}}else{if(!_0x817993)continue;if(_0x817993['isRequiredInParty']())return!![];}}return![];},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x360)]=Game_Party[_0x56ec57(0x2de)]['swapOrder'],Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x3b3)]=function(_0x51ede8,_0x3f266d){const _0x38e66c=_0x56ec57;VisuMZ[_0x38e66c(0x433)][_0x38e66c(0x360)][_0x38e66c(0x376)](this,_0x51ede8,_0x3f266d),this[_0x38e66c(0x2fd)](_0x51ede8,_0x3f266d);},Game_Party[_0x56ec57(0x2de)][_0x56ec57(0x2fd)]=function(_0x513290,_0x11b5bc){const _0xffd85b=_0x56ec57;this['_battleMembers']=[];for(let _0x43ad8e=0x0;_0x43ad8e<this['_actors'][_0xffd85b(0x1f3)];_0x43ad8e++){if(this[_0xffd85b(0x3cb)][_0xffd85b(0x1f3)]>=this['maxBattleMembers']()){if('JzAIS'!==_0xffd85b(0x416))break;else return _0x11a5b5[_0xffd85b(0x433)][_0xffd85b(0x353)][_0xffd85b(0x3ba)][_0xffd85b(0x247)]['call'](this);}this[_0xffd85b(0x3cb)][_0x43ad8e]=this[_0xffd85b(0x2d5)][_0x43ad8e];}$gamePlayer['refresh']();},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x307)]=Game_Troop[_0x56ec57(0x2de)][_0x56ec57(0x30c)],Game_Troop[_0x56ec57(0x2de)][_0x56ec57(0x30c)]=function(){const _0x41de36=_0x56ec57;VisuMZ[_0x41de36(0x433)][_0x41de36(0x307)][_0x41de36(0x376)](this),$gameParty[_0x41de36(0x2d1)]();},Scene_Menu[_0x56ec57(0x2de)]['commandFormation']=function(){const _0x395d0c=_0x56ec57;SceneManager[_0x395d0c(0x298)](Scene_Party);};function Scene_Party(){const _0x3123a7=_0x56ec57;this[_0x3123a7(0x2ea)](...arguments);}Scene_Party['prototype']=Object[_0x56ec57(0x201)](Scene_MenuBase['prototype']),Scene_Party['prototype'][_0x56ec57(0x2a8)]=Scene_Party,Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x2ea)]=function(){const _0x1e60cb=_0x56ec57;this[_0x1e60cb(0x3bd)](),Scene_MenuBase['prototype'][_0x1e60cb(0x2ea)][_0x1e60cb(0x376)](this);},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x3fa)]=function(){const _0x516310=_0x56ec57;if(ConfigManager[_0x516310(0x20c)]&&ConfigManager[_0x516310(0x23e)]!==undefined)return _0x516310(0x210)!=='FnJqo'?_0xab73c0[_0x516310(0x2de)][_0x516310(0x3fa)][_0x516310(0x376)](this):ConfigManager[_0x516310(0x23e)];else return ConfigManager[_0x516310(0x20c)]===![]?![]:Scene_MenuBase[_0x516310(0x2de)][_0x516310(0x3fa)][_0x516310(0x376)](this);},Scene_Party['prototype'][_0x56ec57(0x398)]=function(){return 0x0;},Scene_Party['prototype'][_0x56ec57(0x287)]=function(){return!![];},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x2ab)]=function(){const _0x43a683=_0x56ec57;Scene_MenuBase[_0x43a683(0x2de)][_0x43a683(0x2ab)]['call'](this),this[_0x43a683(0x238)][_0x43a683(0x311)]=undefined,this[_0x43a683(0x335)]['_clickHandler']=undefined;},Scene_Party['prototype']['loadPartyImages']=function(){const _0x2f2227=_0x56ec57;for(const _0x1409e7 of $gameParty[_0x2f2227(0x3b9)]()){if(_0x2f2227(0x34c)==='zdCau'){const _0x3030dd=this[_0x2f2227(0x2ca)];return _0x5e1e01[_0x2f2227(0x26b)]?_0x3030dd[_0x2f2227(0x2cf)](_0x5769bc,!![]):_0x3030dd[_0x2f2227(0x1fc)](_0x1524cc);}else ImageManager['loadFace'](_0x1409e7[_0x2f2227(0x3a9)]()),ImageManager[_0x2f2227(0x341)](_0x1409e7[_0x2f2227(0x330)]()),ImageManager[_0x2f2227(0x234)](_0x1409e7['battlerName']());}},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x201)]=function(){const _0x66955a=_0x56ec57;Scene_MenuBase[_0x66955a(0x2de)]['create'][_0x66955a(0x376)](this),this[_0x66955a(0x359)](),this[_0x66955a(0x411)](),this[_0x66955a(0x1f6)](),this[_0x66955a(0x42d)](),this[_0x66955a(0x2f4)](),this[_0x66955a(0x3c4)]();},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x359)]=function(){const _0xe4b068=_0x56ec57,_0x47d46e=this['activePartyLabelRect']();this[_0xe4b068(0x28c)]=new Window_PartyLabel(_0x47d46e,TextManager[_0xe4b068(0x40e)]),this[_0xe4b068(0x28c)]['setBackgroundType'](VisuMZ[_0xe4b068(0x433)][_0xe4b068(0x353)]['Window'][_0xe4b068(0x279)]),this[_0xe4b068(0x33d)](this[_0xe4b068(0x28c)]);},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x2eb)]=function(){const _0x36e559=_0x56ec57;return VisuMZ['PartySystem'][_0x36e559(0x353)]['Window'][_0x36e559(0x271)][_0x36e559(0x376)](this);},Scene_Party['prototype']['createActivePartyWindow']=function(){const _0x244f94=_0x56ec57,_0x14d40e=this[_0x244f94(0x3fc)]();this[_0x244f94(0x33c)]=new Window_PartyActive(_0x14d40e),this[_0x244f94(0x33c)][_0x244f94(0x418)](VisuMZ[_0x244f94(0x433)][_0x244f94(0x353)]['Window'][_0x244f94(0x3f4)]),this['_activePartyWindow'][_0x244f94(0x3be)]('ok',this[_0x244f94(0x377)]['bind'](this)),this[_0x244f94(0x33c)][_0x244f94(0x3be)](_0x244f94(0x3ea),this[_0x244f94(0x282)][_0x244f94(0x3c7)](this)),this[_0x244f94(0x33d)](this['_activePartyWindow']);},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x3fc)]=function(){const _0x5dd621=_0x56ec57;return VisuMZ[_0x5dd621(0x433)]['Settings'][_0x5dd621(0x3ba)]['ActivePartyWindowRect']['call'](this);},Scene_Party['prototype']['onActiveOk']=function(){const _0x263d64=_0x56ec57;this[_0x263d64(0x3d0)][_0x263d64(0x2e2)](),this[_0x263d64(0x3d0)][_0x263d64(0x260)]();},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x1f6)]=function(){const _0x1409c2=_0x56ec57,_0x5bbd2e=this[_0x1409c2(0x29d)]();this[_0x1409c2(0x2c1)]=new Window_PartyLabel(_0x5bbd2e,TextManager[_0x1409c2(0x41c)]),this[_0x1409c2(0x2c1)][_0x1409c2(0x418)](VisuMZ[_0x1409c2(0x433)][_0x1409c2(0x353)][_0x1409c2(0x3ba)][_0x1409c2(0x2ba)]),this[_0x1409c2(0x33d)](this[_0x1409c2(0x2c1)]);},Scene_Party['prototype'][_0x56ec57(0x29d)]=function(){const _0x25645d=_0x56ec57;return VisuMZ[_0x25645d(0x433)][_0x25645d(0x353)][_0x25645d(0x3ba)][_0x25645d(0x310)][_0x25645d(0x376)](this);},Scene_Party['prototype']['createReservePartyWindow']=function(){const _0x258707=_0x56ec57,_0x56ba10=this[_0x258707(0x317)]();this[_0x258707(0x3d0)]=new Window_PartyReserve(_0x56ba10),this['_reservePartyWindow'][_0x258707(0x418)](VisuMZ[_0x258707(0x433)]['Settings'][_0x258707(0x3ba)][_0x258707(0x3bf)]),this[_0x258707(0x3d0)]['setHandler']('ok',this[_0x258707(0x3e5)]['bind'](this)),this[_0x258707(0x3d0)][_0x258707(0x3be)](_0x258707(0x3ea),this[_0x258707(0x3b0)][_0x258707(0x3c7)](this)),this[_0x258707(0x33d)](this[_0x258707(0x3d0)]);},Scene_Party['prototype'][_0x56ec57(0x317)]=function(){const _0x324bbf=_0x56ec57;return VisuMZ['PartySystem'][_0x324bbf(0x353)][_0x324bbf(0x3ba)][_0x324bbf(0x33f)][_0x324bbf(0x376)](this);},Scene_Party['prototype'][_0x56ec57(0x3e5)]=function(){const _0x5439e3=_0x56ec57,_0x311ae9=this[_0x5439e3(0x3d0)]['pendingIndex'](),_0x35bcf2=this['_activePartyWindow'][_0x5439e3(0x213)]();if(_0x311ae9<0x0){if(_0x35bcf2)$gameParty[_0x5439e3(0x3e3)](_0x35bcf2[_0x5439e3(0x3a0)]());}else{const _0x159939=this[_0x5439e3(0x3d0)][_0x5439e3(0x213)]()['actorId'](),_0x1a9dcf=this[_0x5439e3(0x33c)][_0x5439e3(0x249)]();if(_0x35bcf2)$gameParty['removeActorFromBattleMembers'](_0x35bcf2[_0x5439e3(0x3a0)]());$gameParty[_0x5439e3(0x42a)](_0x159939,_0x1a9dcf);}this[_0x5439e3(0x40f)](),this[_0x5439e3(0x3b0)]();},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x40f)]=function(){const _0x36b1e5=_0x56ec57;this[_0x36b1e5(0x33c)][_0x36b1e5(0x262)](),this[_0x36b1e5(0x3d0)][_0x36b1e5(0x262)]();},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x3b0)]=function(){const _0x57a9b9=_0x56ec57;this[_0x57a9b9(0x3d0)][_0x57a9b9(0x3c8)](),this[_0x57a9b9(0x3d0)][_0x57a9b9(0x401)](),this[_0x57a9b9(0x33c)][_0x57a9b9(0x2e2)]();},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x2f4)]=function(){const _0x5b199a=_0x56ec57,_0x46351f=this['statusLabelRect']();this[_0x5b199a(0x408)]=new Window_PartyLabel(_0x46351f,TextManager[_0x5b199a(0x3c3)]),this['_statusPartyLabel']['setBackgroundType'](VisuMZ[_0x5b199a(0x433)][_0x5b199a(0x353)][_0x5b199a(0x3ba)][_0x5b199a(0x3f9)]),this[_0x5b199a(0x33d)](this[_0x5b199a(0x408)]);},Scene_Party['prototype'][_0x56ec57(0x2af)]=function(){const _0x1cac4d=_0x56ec57;return VisuMZ[_0x1cac4d(0x433)][_0x1cac4d(0x353)]['Window'][_0x1cac4d(0x2bc)][_0x1cac4d(0x376)](this);},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x3c4)]=function(){const _0x31c62a=_0x56ec57,_0x4dc548=this[_0x31c62a(0x306)]();this[_0x31c62a(0x3a5)]=new Window_PartyStatus(_0x4dc548),this['_statusPartyWindow'][_0x31c62a(0x418)](VisuMZ[_0x31c62a(0x433)][_0x31c62a(0x353)]['Window'][_0x31c62a(0x2df)]),this[_0x31c62a(0x33d)](this[_0x31c62a(0x3a5)]),this['_reservePartyWindow'][_0x31c62a(0x2ad)](this[_0x31c62a(0x3a5)]),this[_0x31c62a(0x33c)]['setStatusWindow'](this[_0x31c62a(0x3a5)]);},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x306)]=function(){const _0x1bb42d=_0x56ec57;return VisuMZ[_0x1bb42d(0x433)][_0x1bb42d(0x353)][_0x1bb42d(0x3ba)]['StatusWindowRect'][_0x1bb42d(0x376)](this);},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x327)]=function(){const _0x1ea358=_0x56ec57;return TextManager[_0x1ea358(0x3f3)](_0x1ea358(0x438));},Scene_Party['prototype'][_0x56ec57(0x378)]=function(){return TextManager['assistSwapPositions'];},Scene_Party[_0x56ec57(0x2de)]['buttonAssistText3']=function(){const _0x1f95bf=_0x56ec57,_0x29696c=this[_0x1f95bf(0x33c)],_0x498cf2=this[_0x1f95bf(0x3d0)];if(_0x29696c&&_0x29696c[_0x1f95bf(0x2db)]&&_0x29696c[_0x1f95bf(0x213)]()&&_0x29696c[_0x1f95bf(0x2d3)]())return TextManager[_0x1f95bf(0x26f)];else{if(_0x498cf2&&_0x498cf2[_0x1f95bf(0x2db)]&&$gameParty[_0x1f95bf(0x425)]()[_0x1f95bf(0x1f3)]>0x0)return TextManager[_0x1f95bf(0x328)];else{if(_0x1f95bf(0x41b)!==_0x1f95bf(0x41b))this['initialize'](...arguments);else return'';}}},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x42b)]=function(){const _0x47463d=_0x56ec57;if(this['_activePartyWindow']&&this[_0x47463d(0x33c)][_0x47463d(0x2db)])return TextManager['assistSwapOutPartyMember'];else return this[_0x47463d(0x3d0)]&&this['_reservePartyWindow'][_0x47463d(0x2db)]?TextManager[_0x47463d(0x39d)]:Scene_MenuBase['prototype']['buttonAssistText4']['call'](this);},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x33b)]=function(){const _0x4fb1f7=_0x56ec57;Scene_MenuBase[_0x4fb1f7(0x2de)][_0x4fb1f7(0x33b)][_0x4fb1f7(0x376)](this),this[_0x4fb1f7(0x388)](this[_0x4fb1f7(0x243)]()),this['createCustomBackgroundImages']();},Scene_Party[_0x56ec57(0x2de)]['getBackgroundOpacity']=function(){const _0x131975=_0x56ec57;return VisuMZ['PartySystem'][_0x131975(0x353)][_0x131975(0x365)][_0x131975(0x350)];},Scene_Party[_0x56ec57(0x2de)]['createCustomBackgroundImages']=function(){const _0x498313=_0x56ec57,_0x2a551f={'BgFilename1':VisuMZ[_0x498313(0x433)]['Settings'][_0x498313(0x365)]['BgFilename1'],'BgFilename2':VisuMZ[_0x498313(0x433)]['Settings'][_0x498313(0x365)][_0x498313(0x2c4)]};_0x2a551f&&(_0x2a551f[_0x498313(0x351)]!==''||_0x2a551f['BgFilename2']!=='')&&(_0x498313(0x2fb)!==_0x498313(0x2fb)?this['index']()<=0x0?this[_0x498313(0x435)]():_0x2dbe36['prototype']['cursorUp'][_0x498313(0x376)](this,_0x2dfa99):(this[_0x498313(0x37f)]=new Sprite(ImageManager[_0x498313(0x294)](_0x2a551f['BgFilename1'])),this[_0x498313(0x373)]=new Sprite(ImageManager[_0x498313(0x2a4)](_0x2a551f[_0x498313(0x2c4)])),this[_0x498313(0x226)](this[_0x498313(0x37f)]),this[_0x498313(0x226)](this['_backSprite2']),this[_0x498313(0x37f)]['bitmap'][_0x498313(0x292)](this[_0x498313(0x214)][_0x498313(0x3c7)](this,this[_0x498313(0x37f)])),this[_0x498313(0x373)]['bitmap']['addLoadListener'](this[_0x498313(0x214)][_0x498313(0x3c7)](this,this[_0x498313(0x373)]))));},Scene_Party[_0x56ec57(0x2de)]['adjustSprite']=function(_0x4dff3c){const _0x8e9219=_0x56ec57;this[_0x8e9219(0x419)](_0x4dff3c),this[_0x8e9219(0x2b8)](_0x4dff3c);},Scene_Party[_0x56ec57(0x2de)][_0x56ec57(0x2f6)]=function(){const _0x165c3b=_0x56ec57;Scene_MenuBase['prototype'][_0x165c3b(0x2f6)]['call'](this),$gameParty['partyChangeRefresh']();},Window_StatusBase[_0x56ec57(0x2de)][_0x56ec57(0x3aa)]=function(_0x45e8f4,_0x1b35da,_0x341fcb,_0x47d588){const _0x540469=_0x56ec57;if(!_0x45e8f4)return;if(_0x47d588){if(_0x540469(0x3f6)!==_0x540469(0x3f6)){if(_0x5ba371[_0x540469(0x22e)]()){_0x55d837[_0x540469(0x2c0)][_0x540469(0x39c)](_0x4c6eec);const _0xeeff23=_0x3585c4[_0x540469(0x2f8)];this[_0x540469(0x240)](),this[_0x540469(0x2fc)](0xff,_0xeeff23);}this[_0x540469(0x269)]=null;}else this[_0x540469(0x228)](_0x45e8f4,_0x1b35da,_0x341fcb);}else{if('xQBCy'!==_0x540469(0x38f))this[_0x540469(0x24a)](_0x45e8f4,_0x1b35da,_0x341fcb);else{const _0x5a9f90=this['actor'](_0x12196f),_0x36363d=this['itemRect'](_0x18b504),_0x3491f8=_0x53623b[_0x540469(0x2dc)]===0x1;_0x36363d['x']+=_0x1628d3[_0x540469(0x386)]*(_0x3491f8?0x2:0x1);const _0x2933ef=_0x2d12ef['PartySystem'][_0x540469(0x353)][_0x540469(0x3ba)],_0x39640e=_0x36363d['x']+_0x2933ef[_0x540469(0x1fa)]+this[_0x540469(0x400)](),_0xa32577=_0x36363d['y']+_0x36363d['height']-_0x2933ef['ReserveSpriteOffsetY'];this[_0x540469(0x3a6)](_0x5a9f90,_0x39640e,_0xa32577);}}},Window_StatusBase[_0x56ec57(0x2de)][_0x56ec57(0x24a)]=function(_0x22609a,_0x10f7da,_0x13b5c5){const _0x3de951=_0x56ec57;_0x13b5c5+=Math[_0x3de951(0x390)]((this['lineHeight']()-ImageManager[_0x3de951(0x3d5)])/0x2),!_0x22609a[_0x3de951(0x24f)]()&&(this[_0x3de951(0x2be)](ImageManager[_0x3de951(0x32f)],_0x10f7da,_0x13b5c5),_0x10f7da+=ImageManager[_0x3de951(0x386)]+0x4),_0x22609a[_0x3de951(0x354)]()&&(this[_0x3de951(0x2be)](ImageManager['requiredPartyMemberIcon'],_0x10f7da,_0x13b5c5),_0x10f7da+=ImageManager[_0x3de951(0x386)]+0x4);},Window_StatusBase['prototype'][_0x56ec57(0x228)]=function(_0x4040bb,_0x49dc14,_0x414159){const _0x1787af=_0x56ec57;let _0x4890ac=0x0;if(!_0x4040bb[_0x1787af(0x24f)]())_0x4890ac+=0x1;if(_0x4040bb[_0x1787af(0x354)]())_0x4890ac+=0x1;if(_0x4890ac<=0x1){if('KxTnI'===_0x1787af(0x39e)){const _0x2def8f=this[_0x1787af(0x249)](),_0x47d9e7=_0x2def8f-0x1<0x0?this[_0x1787af(0x38d)]()-0x1:_0x2def8f-0x1;this['quickSwap'](_0x2def8f,_0x47d9e7);}else return this[_0x1787af(0x24a)](_0x4040bb,_0x49dc14,_0x414159);}_0x414159+=Math[_0x1787af(0x390)]((this[_0x1787af(0x34f)]()-ImageManager[_0x1787af(0x3d5)])/0x2),_0x414159-=Math[_0x1787af(0x390)](this['lineHeight']()/0x2),this['drawIcon'](ImageManager[_0x1787af(0x32f)],_0x49dc14,_0x414159),_0x414159+=this[_0x1787af(0x34f)](),this[_0x1787af(0x2be)](ImageManager[_0x1787af(0x40c)],_0x49dc14,_0x414159);};function Window_PartyLabel(){const _0x53036b=_0x56ec57;this[_0x53036b(0x2ea)](...arguments);}Window_PartyLabel['prototype']=Object[_0x56ec57(0x201)](Window_Base[_0x56ec57(0x2de)]),Window_PartyLabel[_0x56ec57(0x2de)]['constructor']=Window_PartyLabel,Window_PartyLabel['prototype'][_0x56ec57(0x2ea)]=function(_0x5357b2,_0x540553){const _0x14d688=_0x56ec57;Window_Base[_0x14d688(0x2de)][_0x14d688(0x2ea)][_0x14d688(0x376)](this,_0x5357b2),this[_0x14d688(0x22b)](_0x540553);},Window_PartyLabel['prototype'][_0x56ec57(0x20d)]=function(){const _0x595f92=_0x56ec57;this[_0x595f92(0x244)]=0x0;},Window_PartyLabel['prototype'][_0x56ec57(0x22b)]=function(_0x4b9ea7){const _0x13e7d0=_0x56ec57;this[_0x13e7d0(0x432)][_0x13e7d0(0x23d)](),this[_0x13e7d0(0x42f)](_0x4b9ea7,0x0,0x0,this[_0x13e7d0(0x2ec)],'center');};function _0x2e01(){const _0x3dc425=['_statusWindow','Settings','isRequiredInParty','name','createPartySwitchWindow','quickSwap','isAlive','createActivePartyLabel','#%1','EVAL','registerCommand','onBattlePartySwitch','drawActorSimpleStatus','setActor','Game_Party_swapOrder','includes','DOIZx','pop','esKeT','BgSettings','match','MaxBattleMembers','BattleHelpSwitch','BattleSwitchOut','visible','1365414vWrKHO','Scene_Base_isAutosaveEnabled','EYCXp','_list','changeTextColor','Scene_Battle_createAllWindows','clearPartySwitchCommandCooldown','RequireIcon','_backSprite2','_actorGraphic','MoveActorsToReserve','call','onActiveOk','buttonAssistText1','Remove','itemLineRect','playOkSound','Actors','Lock','zWnHK','_backSprite1','battlePartySwitchCmd','_currentActor','drawParamName','drawParamText','drawRemoveCommand','jOOAd','iconWidth','2BCUclx','setBackgroundOpacity','drawItemEmpty','Param','innerHeight','Game_Party_initialize','maxItems','_windowLayer','yOGdq','round','updateBattleProcess','partySwitchWindowRect','inBattle','paintOpacity','isPartyCommandAdded','hgSjs','removeActor','helpAreaHeight','isCTB','IfSmF','_tpbSceneChangeCacheActor','processPartySwitchMember','assistSwapInPartyMember','LbjiI','version','actorId','applyBattlePartySwitchCooldown','open','toUpperCase','xSDnk','_statusPartyWindow','drawActorCharacter','Scene_Battle_createActorCommandWindow','hasBattleSystemIncompatibilities','faceName','drawActorPartyIcons','GxDxB','emptyPartyMember','openness','_tpbState','testBattlers','onReserveCancel','isTpb','clearBypassAutoSave','swapOrder','HEhwU','log','VisuMZ_2_BattleSystemOTB','fillRect','VisuMZ_2_BattleSystemBTB','members','Window','nrBff','status','loadPartyImages','setHandler','ReservePartyWindowBgType','_logWindow','allMembers','commandFormation','statusParty','createStatusWindow','tpbImmediateAction','oiFGu','bind','deactivate','8361592pTQZVS','isTriggered','_battleMembers','format','itemHeight','assistSwapOutPartyMember','startSwitchInAnimation','_reservePartyWindow','text','nameStartPosition','teamBasedFirstAvailableMember','battlePartySwitchCooldown','iconHeight','qByWe','onBattleStart','PartyCmdWinAddParty','makeActionOrders','8041065CvtHrM','callFormation','3407235KHbYWb','uwFnH','_partySystemBattleCommandCooldown','removePartyMember','oZUiP','Vjnji','Scene_Battle_isAnyInputWindowActive','removeActorFromBattleMembers','itemRectWithPadding','onReserveOk','isPTB','ensureCursorVisible','setup','AddRemoveCmd','cancel','BattleManager_setup','isActiveTpb','ReserveSpriteOffsetY','XKJwb','setupBattleTest','RTZeu','ActiveBattlerOffsetY','drawItemImageSprite','getInputButtonString','ActivePartyWindowBgType','tWTXF','zABqO','isShiftShortcutEnabled','addCustomCommands','StatusLabelBgType','isRightInputMode','isPlaytest','activePartyWindowRect','description','\x5cI[%1]%2','postPartySwitchMenuTurnBased','itemPadding','deselect','update','ChangeMaxBattleMembers','sort','updatePartySwitch','Scene_Battle_createPartyCommandWindowBattleCore','setupStartingMembers','_statusPartyLabel','requestRefresh','defaultMaxBattleMembers','removePartyCommand','requiredPartyMemberIcon','SwitchOutAnimation','activeParty','refreshAllWindows','select','createActivePartyWindow','SceneManager_isNextSceneBattleTransitionable','preparePartySwitchMember','isAppeared','Window_ActorCommand_updateHelp','DUnQZ','Game_Party_addActor','setBackgroundType','scaleSprite','AssistRemove','zWSIU','reserveParty','battlePartySwitchCmdHelp','faceWidth','parse','checkShiftSortShortcut','close','ActiveParty','processShiftRemoveShortcut','isSTB','reserveMembers','initPartySystem','initBattleMembers','right','parameters','addActorToBattleMembersAtIndex','buttonAssistText4','ReserveBattlerOffsetY','createReservePartyWindow','getParamValue','drawText','drawActorName','addActor','contents','PartySystem','Game_Actor_setup','processCancel','ActiveSpriteOffsetX','MoveRandomToActive','shift','hpColor','_partyCommandWindow','length','setupBattleTestMembers','_partySwitchBattleCommandCooldown','createReservePartyLabel','updateHelp','findSymbol','ReserveParty','ReserveSpriteOffsetX','gaugeBackColor','param','grUWc','QueuePartyScene','isTimeActive','initEquips','create','currentSymbol','_actionBattlers','height','Index','Scene_Battle_updateBattleProcess','gradientFillRect','_actorCommandWindow','Game_Party_removeActor','isAutosaveEnabled','VisuMZ_1_MainMenuCore','uiMenuStyle','updatePadding','splice','partyChangeRefresh','FnJqo','processShiftSortShortcut','isFTB','currentActor','adjustSprite','ReserveBattlerOffsetX','svbattler','lpESQ','addNonBattleTestMembers','drawSvActor','WARNING:\x20Party\x20Change\x20command\x20is\x20unavailable\x20for\x20Window_PartyCommand\x20for\x20this\x20Battle\x20System','dimColor1','changePaintOpacity','EiWEM','SCpcC','max','trim','_partyMemberSwitchWindow','ConvertParams','isActor','isPartyCommandEnabled','snapForBackground','addChild','partySwitchWindowRectBorder','drawActorPartyIconsVert','JeURG','_inputting','setText','General','Value','isSceneBattle','YluuM','setPartyRequirement','followers','VisuMZ_1_BattleCore','addText','loadSvActor','clearPartyBattleCommandCooldown','DrawBackRect','ActivePartyWindowRect','_pageupButton','battler','removeActionBattlersOTB','battleLayoutStyle','drawItemImage','clear','uiInputPosition','drawParamValue','stepForward','arXoF','ReserveCol','getBackgroundOpacity','padding','equips','pendingIndex','StatusWindowRect','getPartySystemBackColor','index','drawActorPartyIconsHorz','playEquip','isSceneMap','playCursorSound','charged','isFormationChangeOk','_otb_actionBattlersNext','_partyRequired','BattlePartyIcon','Sprite_Actor_update','face','_subject','addFormationCommand','_debug','isCurrentItemEnabled','changeLevel','rDnml','_partySystemSwitchOut','UrJoo','WcaSq','actorParams','JLxfM','reselect','LockIcon','refresh','selectActor','FhOmm','battleMembers','_lastIndex','isCancelEnabled','onPartySwitchCancel','_partySwitchTargetActor','updateTurnOrderCTB','VisuMZ_0_CoreEngine','isSceneParty','refreshOG','otbReturnBattlerToTurnOrders','assistRemovePartyMember','processDrawItem','ActivePartyLabelRect','maxCols','NUM','center','JrRto','battlePartyChangeIcon','LockPartyMembers','cursorDown','ActivePartyLabelBgType','changeMaxBattleMembers','JQHWj','AssistSort','cursorPageup','sortActors','addCommand','_bypassAutoSavePartySystem','VisuMZ_2_BattleSystemETB','popScene','skillItemWindowRectBorderStyle','battlePartyChangeCmd','_spriteset','resetFontSettings','needsPageButtons','BattleHelpFormation','DisplayedParams','setPartyLock','addRemoveCommand','_activePartyLabel','addActorToBattleMembers','MoveActorsToActive','_callSceneParty','mapId','kjMLg','addLoadListener','rawBattleMembers','loadTitle1','ARRAYSTRUCT','AssistSwapOut','assistSwapPositions','push','ActiveTpbFormationMessage','map','ceil','isOkEnabled','reservePartyLabelRect','Game_Battler_onBattleStart','Nxegv','AssistSwapPosition','anyRequiredPartyMembersInReserve','isFormationCommandEnabled','drawActorClass','loadTitle2','initMaxBattleMembers','WSEJn','canSwitchPartyInBattle','constructor','Window_PartyCommand_updateHelp','reserveTransfer','createPageButtons','concat','setStatusWindow','dimColor2','statusLabelRect','commandStyle','jpvzv','drawItem','_battleSystemIncompatibilityError','PartyCmdCooldown','_tpbChargeTime','ActorCmdCooldown','STR','centerSprite','eudHx','ReservePartyLabelBgType','isNextSceneBattleTransitionable','StatusLabelRect','ActivePartyGraphic','drawIcon','isAnyInputWindowActive','_scene','_reservePartyLabel','_partyLocked','createAllWindows','BgFilename2','switchStateIconActor','Game_Party_setupBattleTest','faceHeight','width','startMove','_actor','ARRAYJSON','indexOf','formation','onPartySwitchOk','paramValueByName','CoreEngine','updateBattlePartySwitchCooldown','windowPadding','isShiftRemoveShortcutEnabled','makeActions','_actors','VisuMZ_2_BattleSystemFTB','isFormationCommandAdded','return\x200','placeBasicGauges','actor','active','_rowThickness','drawItemDarkRect','prototype','StatusWindowBgType','ARRAYFUNC','isQueueFormationMenu','activate','setBattler','isETB','CaQmt','vsxAV','processOk','drawItemImageFace','min','initialize','activePartyLabelRect','innerWidth','VisuMZ_2_BattleSystemPTB','createPartyCommandWindowBattleCore','isPreviousScene','addPartyCommand','random','drawItemStatus','isNextScene','createStatusLabel','KgBpd','terminate','smoothSelect','_partySwitchDuration','zaCzR','ActiveSpriteOffsetY','ynvPn','startOpacity','swapOrderPartySystemPlugin','setBattlePartySwitchCooldown','floor','Game_Battler_regenerateAll','createActorCommandWindow','systemColor','STRUCT','drawDarkRect','isOTB','statusWindowRect','Game_Troop_increaseTurn','yqMGp','regenerateAll','textColor','WEURI','increaseTurn','maxBattleMembers','slice','itemRect','ReservePartyLabelRect','_clickHandler','startSwitchOutAnimation','Game_Unit_inBattle','exit','mfiWx','partySwitchWindowRectStandard','reservePartyWindowRect','isEnabled','StatusWindowDraw','clearTpbChargeTime','drawActorFace','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','cursorUp','rearrangePartyActors','CallPartyScene','_helpWindow','pGjaU','Vocab','BackRectColor','isImmediateTpb','commandPartyMemberSwitch','Scene_Battle_isTimeActive','buttonAssistKey3','assistSortPartyMembers','drawItemImageSvActor','sprite','_battleMaxSize','Status','postPartySwitchMenuTpb','remove','lockPartyMemberIcon','characterName','4072733gRjaGw','ActorCmdWinAddParty','_callPartyMemberSwitch','border','_pagedownButton','BattleSwitchWindowBgType','VisuMZ_2_BattleSystemSTB','loadFace','checkInitBattleMembers','BattleSwitchWindowRect','createBackground','_activePartyWindow','addWindow','ARRAYNUM','ReservePartyWindowRect','isBTB','loadCharacter','callUpdateHelp','BattlePartyCmd','isPreviousSceneBattleTransitionable','AssistSwapIn','battlerName','callPartyMemberSwitch','toLowerCase','Empty','8036280oEyCax','filter','ZFyXu','3489672XhUDFw','processCursorMove','lineHeight','SnapshotOpacity','BgFilename1'];_0x2e01=function(){return _0x3dc425;};return _0x2e01();}function Window_PartyActive(){this['initialize'](...arguments);}Window_PartyActive[_0x56ec57(0x2de)]=Object[_0x56ec57(0x201)](Window_StatusBase[_0x56ec57(0x2de)]),Window_PartyActive['prototype'][_0x56ec57(0x2a8)]=Window_PartyActive,Window_PartyActive[_0x56ec57(0x374)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x3ba)][_0x56ec57(0x2bd)],Window_PartyActive['prototype'][_0x56ec57(0x2ea)]=function(_0xc33132){const _0x4884c1=_0x56ec57;Window_StatusBase['prototype'][_0x4884c1(0x2ea)][_0x4884c1(0x376)](this,_0xc33132),this['refresh'](),this['activate'](),this['smoothSelect'](0x0);},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x28b)]=function(){const _0x1fb8a0=_0x56ec57;return VisuMZ[_0x1fb8a0(0x433)][_0x1fb8a0(0x353)][_0x1fb8a0(0x22c)]['AddRemoveCmd'];},Window_PartyActive['prototype'][_0x56ec57(0x38d)]=function(){const _0x10bed6=_0x56ec57;return $gameParty[_0x10bed6(0x30d)]();},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x272)]=function(){const _0x2e7aca=_0x56ec57;return $gameParty[_0x2e7aca(0x30d)]();},Window_PartyActive['prototype']['itemHeight']=function(){const _0x2c4350=_0x56ec57;return this[_0x2c4350(0x38b)];},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x2da)]=function(_0x36d553){const _0x388b22=_0x56ec57;return $gameParty[_0x388b22(0x293)]()[_0x36d553];},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x213)]=function(){const _0x108726=_0x56ec57;return this[_0x108726(0x2da)](this['index']());},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x258)]=function(){const _0x49c08a=_0x56ec57,_0x36401b=this[_0x49c08a(0x2da)](this[_0x49c08a(0x249)]());return _0x36401b?_0x36401b[_0x49c08a(0x24f)]():!![];},Window_PartyActive['prototype'][_0x56ec57(0x267)]=function(){const _0x3be1bd=_0x56ec57;if($gameParty['members']()['length']<=0x0)return!![];if($gameParty[_0x3be1bd(0x2a1)]())return![];return $gameParty[_0x3be1bd(0x265)]()[_0x3be1bd(0x1f3)]>0x0;},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x34e)]=function(){const _0x2e5fe3=_0x56ec57;Window_StatusBase[_0x2e5fe3(0x2de)][_0x2e5fe3(0x34e)]['call'](this),this['checkShiftRemoveShortcut']();},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x278)]=function(_0x42118d){const _0x207016=_0x56ec57;if(this[_0x207016(0x29c)]()){if(_0x207016(0x3a4)!==_0x207016(0x2e6))this[_0x207016(0x2e7)]();else{const _0xa448d9=this[_0x207016(0x37a)](_0x3fdd00);this[_0x207016(0x21c)](!![]);const _0x541bd5=_0xb3b9db[_0x207016(0x3df)];this[_0x207016(0x42f)](_0x541bd5,_0xa448d9['x'],_0xa448d9['y'],_0xa448d9[_0x207016(0x2c8)],'center');}}},Window_PartyActive[_0x56ec57(0x2de)]['cursorPagedown']=function(){const _0x2211c9=_0x56ec57,_0x1028c1=this[_0x2211c9(0x249)](),_0x1da612=_0x1028c1+0x1>=this[_0x2211c9(0x38d)]()?0x0:_0x1028c1+0x1;this[_0x2211c9(0x357)](_0x1028c1,_0x1da612);},Window_PartyActive['prototype'][_0x56ec57(0x27d)]=function(){const _0x54f14f=_0x56ec57,_0x1a12e2=this['index'](),_0x47e38b=_0x1a12e2-0x1<0x0?this['maxItems']()-0x1:_0x1a12e2-0x1;this[_0x54f14f(0x357)](_0x1a12e2,_0x47e38b);},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x357)]=function(_0x220353,_0x23ebd8){const _0x5f2403=_0x56ec57,_0x5578dd=this[_0x5f2403(0x2da)](_0x220353),_0x4cd0f7=this[_0x5f2403(0x2da)](_0x23ebd8);if(_0x5578dd&&!_0x5578dd[_0x5f2403(0x24f)]())return;if(_0x4cd0f7&&!_0x4cd0f7['isFormationChangeOk']())return;const _0x4baf05=$gameParty[_0x5f2403(0x3cb)];_0x4baf05[_0x220353]=_0x4cd0f7?_0x4cd0f7[_0x5f2403(0x3a0)]():0x0,_0x4baf05[_0x23ebd8]=_0x5578dd?_0x5578dd['actorId']():0x0,this['refresh'](),this[_0x5f2403(0x24d)](),this[_0x5f2403(0x2f7)](_0x23ebd8);},Window_PartyActive[_0x56ec57(0x2de)]['checkShiftRemoveShortcut']=function(){const _0xaab271=_0x56ec57;if(!this[_0xaab271(0x2d3)]())return;if(Input['isTriggered']('shift')){const _0x5b372b=this[_0xaab271(0x213)]();this['processShiftRemoveShortcut']();}},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x423)]=function(){const _0x3e60c5=_0x56ec57;SoundManager[_0x3e60c5(0x24b)]();const _0x30f904=this[_0x3e60c5(0x213)]();$gameParty[_0x3e60c5(0x3e3)](_0x30f904[_0x3e60c5(0x3a0)]()),this[_0x3e60c5(0x342)](),SceneManager['_scene'][_0x3e60c5(0x40f)]();},Window_PartyActive['prototype'][_0x56ec57(0x2d3)]=function(){const _0xe25b6e=_0x56ec57;if(!this[_0xe25b6e(0x28b)]())return![];const _0x1f3233=this[_0xe25b6e(0x213)]();return this[_0xe25b6e(0x2db)]&&_0x1f3233&&_0x1f3233[_0xe25b6e(0x24f)]();},Window_PartyActive['prototype']['drawItem']=function(_0xa3e818){const _0x511849=_0x56ec57,_0x219723=this[_0x511849(0x2da)](_0xa3e818);if(!_0x219723)return this[_0x511849(0x389)](_0xa3e818);this[_0x511849(0x286)]();const _0x3796a5=this[_0x511849(0x30f)](_0xa3e818);this[_0x511849(0x23c)](_0xa3e818);const _0x5d3aa0=_0x3796a5['y']+_0x3796a5[_0x511849(0x204)]-this[_0x511849(0x34f)]();this['drawDarkRect'](_0x3796a5['x'],_0x5d3aa0,_0x3796a5['width'],0x2),this[_0x511849(0x3aa)](_0x219723,_0x3796a5['x']+0x2,_0x3796a5['y']),this['drawActorName'](_0x219723,_0x3796a5['x'],_0x5d3aa0,_0x3796a5['width']);},Window_PartyActive['prototype'][_0x56ec57(0x389)]=function(_0x2a39d0){const _0x37d547=_0x56ec57;this[_0x37d547(0x286)]();const _0x53c161=this[_0x37d547(0x30f)](_0x2a39d0);this[_0x37d547(0x2dd)](_0x53c161['x'],_0x53c161['y'],_0x53c161[_0x37d547(0x2c8)],_0x53c161['height']);const _0x379358=_0x53c161['y']+Math[_0x37d547(0x390)]((_0x53c161['height']-this[_0x37d547(0x34f)]())/0x2);this[_0x37d547(0x36f)](ColorManager['systemColor']()),this[_0x37d547(0x42f)](TextManager[_0x37d547(0x3ac)],_0x53c161['x'],_0x379358,_0x53c161[_0x37d547(0x2c8)],'center');},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x2dd)]=function(_0x4592a5,_0x50e019,_0x594c7a,_0x52b8e2,_0x2f1fde){const _0xcaa6b=_0x56ec57;_0x2f1fde=Math['max'](_0x2f1fde||0x1,0x1);while(_0x2f1fde--){_0x52b8e2=_0x52b8e2||this[_0xcaa6b(0x34f)](),this['contents']['paintOpacity']=0xa0;const _0x1bb261=ColorManager[_0xcaa6b(0x1fb)]();this[_0xcaa6b(0x432)][_0xcaa6b(0x3b7)](_0x4592a5+0x1,_0x50e019+0x1,_0x594c7a-0x2,_0x52b8e2-0x2,_0x1bb261),this[_0xcaa6b(0x432)][_0xcaa6b(0x394)]=0xff;}},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x23c)]=function(_0x11991c){const _0xa77283=_0x56ec57;switch(Window_PartyActive[_0xa77283(0x374)][_0xa77283(0x348)]()[_0xa77283(0x220)]()){case _0xa77283(0x254):this[_0xa77283(0x2e8)](_0x11991c);break;case'sprite':this[_0xa77283(0x3f2)](_0x11991c);break;case _0xa77283(0x216):Imported['VisuMZ_1_MainMenuCore']&&this[_0xa77283(0x329)](_0x11991c);break;};},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x2e8)]=function(_0x22dff9){const _0x2f8821=_0x56ec57,_0x40c81c=this[_0x2f8821(0x2da)](_0x22dff9),_0x58458d=this['itemRect'](_0x22dff9),_0x48305f=Math['min'](ImageManager[_0x2f8821(0x41e)],_0x58458d[_0x2f8821(0x2c8)]-0x2),_0x257739=_0x58458d[_0x2f8821(0x204)]-0x2;this[_0x2f8821(0x21c)](_0x40c81c[_0x2f8821(0x24f)]());const _0x5cf534=Math['round'](_0x58458d['x']+(_0x58458d[_0x2f8821(0x2c8)]-_0x48305f)/0x2);this[_0x2f8821(0x31b)](_0x40c81c,_0x5cf534,_0x58458d['y']+0x1,_0x48305f,_0x257739),this[_0x2f8821(0x21c)](!![]);},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x3f2)]=function(_0x40a283){const _0x45d68a=_0x56ec57,_0x384a65=this['actor'](_0x40a283),_0x42308b=this[_0x45d68a(0x30f)](_0x40a283),_0x104608=VisuMZ['PartySystem']['Settings']['Window'],_0x1493e6=_0x42308b['x']+Math[_0x45d68a(0x390)](_0x42308b['width']/0x2)+_0x104608[_0x45d68a(0x436)],_0x48e638=_0x42308b['y']+_0x42308b['height']-this['lineHeight']()-_0x104608[_0x45d68a(0x2fa)];this[_0x45d68a(0x3a6)](_0x384a65,_0x1493e6,_0x48e638);},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x329)]=function(_0x27533a){const _0x5accc2=_0x56ec57,_0x5bde96=this[_0x5accc2(0x2da)](_0x27533a),_0x567691=_0x5bde96[_0x5accc2(0x346)](),_0x386dc2=this[_0x5accc2(0x30f)](_0x27533a),_0x126ecb=VisuMZ[_0x5accc2(0x433)][_0x5accc2(0x353)][_0x5accc2(0x3ba)],_0x2d2ff7=_0x386dc2['x']+Math[_0x5accc2(0x390)](_0x386dc2[_0x5accc2(0x2c8)]/0x2)+_0x126ecb['ActiveBattlerOffsetX'],_0x1625da=_0x386dc2['y']+_0x386dc2[_0x5accc2(0x204)]-this[_0x5accc2(0x34f)]()-_0x126ecb[_0x5accc2(0x3f1)];this[_0x5accc2(0x219)](_0x567691,_0x2d2ff7,_0x1625da);},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x304)]=function(_0x233343,_0x3b9cf9,_0x4f77c2,_0x597498){const _0x11a9d7=_0x56ec57,_0x3a2919=ColorManager[_0x11a9d7(0x21b)](),_0x219a3e=ColorManager[_0x11a9d7(0x2ae)](),_0x4cb4c2=_0x4f77c2/0x2,_0x646ed3=this[_0x11a9d7(0x34f)]();while(_0x597498--){_0x11a9d7(0x27b)!=='JQHWj'?_0x3c3003[_0x11a9d7(0x3c5)]=!![]:(this[_0x11a9d7(0x432)][_0x11a9d7(0x207)](_0x233343,_0x3b9cf9,_0x4cb4c2,_0x646ed3,_0x219a3e,_0x3a2919),this[_0x11a9d7(0x432)][_0x11a9d7(0x207)](_0x233343+_0x4cb4c2,_0x3b9cf9,_0x4cb4c2,_0x646ed3,_0x3a2919,_0x219a3e));}},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x430)]=function(_0x3bd7b6,_0x494348,_0x2cc35b,_0x3621df){const _0x124bef=_0x56ec57;_0x3621df=_0x3621df||0xa8,this[_0x124bef(0x36f)](ColorManager[_0x124bef(0x439)](_0x3bd7b6)),this[_0x124bef(0x42f)](_0x3bd7b6[_0x124bef(0x355)](),_0x494348,_0x2cc35b,_0x3621df,_0x124bef(0x274));},Window_PartyActive[_0x56ec57(0x2de)][_0x56ec57(0x2ad)]=function(_0x3492c6){const _0x220112=_0x56ec57;this[_0x220112(0x352)]=_0x3492c6,this[_0x220112(0x342)]();},Window_PartyActive[_0x56ec57(0x2de)]['callUpdateHelp']=function(){const _0x186870=_0x56ec57;if(this['_statusWindow'])this[_0x186870(0x352)][_0x186870(0x35f)](this[_0x186870(0x2da)](this[_0x186870(0x249)]()));};function Window_PartyReserve(){const _0x122a19=_0x56ec57;this[_0x122a19(0x2ea)](...arguments);}Window_PartyReserve['prototype']=Object['create'](Window_StatusBase[_0x56ec57(0x2de)]),Window_PartyReserve[_0x56ec57(0x2de)]['constructor']=Window_PartyReserve,Window_PartyReserve[_0x56ec57(0x374)]=VisuMZ[_0x56ec57(0x433)]['Settings'][_0x56ec57(0x3ba)]['ReservePartyGraphic'],Window_PartyReserve[_0x56ec57(0x2dc)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x3ba)]['ReserveItemThickness'],Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x2ea)]=function(_0x412d84){const _0x5a62f5=_0x56ec57;Window_StatusBase['prototype']['initialize']['call'](this,_0x412d84),this[_0x5a62f5(0x266)]=0x0,this[_0x5a62f5(0x262)]();},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x272)]=function(){const _0x3dd9e5=_0x56ec57;return VisuMZ[_0x3dd9e5(0x433)][_0x3dd9e5(0x353)][_0x3dd9e5(0x3ba)][_0x3dd9e5(0x242)]||0x1;},Window_PartyReserve[_0x56ec57(0x2de)]['itemHeight']=function(){const _0x281b5f=_0x56ec57;return this[_0x281b5f(0x34f)]()*Window_PartyReserve[_0x281b5f(0x2dc)]+0x6;},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x28b)]=function(){const _0xfc59b7=_0x56ec57;return VisuMZ[_0xfc59b7(0x433)][_0xfc59b7(0x353)][_0xfc59b7(0x22c)][_0xfc59b7(0x3e9)];},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x38d)]=function(){const _0xfbd640=_0x56ec57;let _0x4de2ca=$gameParty[_0xfbd640(0x425)]()[_0xfbd640(0x1f3)];if(this[_0xfbd640(0x28b)]())_0x4de2ca++;return _0x4de2ca;},Window_PartyReserve[_0x56ec57(0x2de)]['actor']=function(_0x251378){const _0x11b939=_0x56ec57;return $gameParty[_0x11b939(0x425)]()[_0x251378];},Window_PartyReserve['prototype'][_0x56ec57(0x213)]=function(){const _0x86afde=_0x56ec57;return this[_0x86afde(0x2da)](this[_0x86afde(0x249)]());},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x37b)]=function(){const _0x5076bc=_0x56ec57;SoundManager[_0x5076bc(0x24b)]();},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x258)]=function(){const _0xb0f033=_0x56ec57,_0x3cc92c=this[_0xb0f033(0x2da)](this[_0xb0f033(0x249)]());return _0x3cc92c?_0x3cc92c[_0xb0f033(0x24f)]():!![];},Window_PartyReserve[_0x56ec57(0x2de)]['processCursorMove']=function(){const _0x424161=_0x56ec57;Window_StatusBase[_0x424161(0x2de)][_0x424161(0x34e)][_0x424161(0x376)](this),this[_0x424161(0x420)]();},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x31d)]=function(_0xec309c){const _0x952bd9=_0x56ec57;this['index']()<=0x0?this[_0x952bd9(0x435)]():Window_StatusBase[_0x952bd9(0x2de)][_0x952bd9(0x31d)]['call'](this,_0xec309c);},Window_PartyReserve['prototype']['cursorPagedown']=function(){const _0x7c326c=_0x56ec57,_0x56bb34=this[_0x7c326c(0x249)](),_0x1e3472=_0x56bb34+0x1>=this[_0x7c326c(0x38d)]()-0x1?0x0:_0x56bb34+0x1;this[_0x7c326c(0x357)](_0x56bb34,_0x1e3472);},Window_PartyReserve['prototype'][_0x56ec57(0x27d)]=function(){const _0xc95272=_0x56ec57,_0x514b8a=this[_0xc95272(0x249)](),_0xc6166d=_0x514b8a-0x1<0x0?this[_0xc95272(0x38d)]()-0x2:_0x514b8a-0x1;this['quickSwap'](_0x514b8a,_0xc6166d);},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x357)]=function(_0x3e3383,_0x1220f5){const _0x35c02b=_0x56ec57,_0x221ccc=this['actor'](_0x3e3383),_0x2f90b2=this[_0x35c02b(0x2da)](_0x1220f5);if(!_0x221ccc?.['isFormationChangeOk']()||!_0x2f90b2?.[_0x35c02b(0x24f)]()){if(_0x35c02b(0x3e1)==='BcDiz'){_0x2bdb3b=_0x1643df||this[_0x35c02b(0x34f)](),this[_0x35c02b(0x432)][_0x35c02b(0x394)]=0xa0;const _0x323fa5=_0x5b2ccf[_0x35c02b(0x1fb)]();this[_0x35c02b(0x432)]['fillRect'](_0x25324c+0x1,_0x17f68b+0x1,_0x1dfd98-0x2,_0x2b66d1-0x2,_0x323fa5),this[_0x35c02b(0x432)][_0x35c02b(0x394)]=0xff;}else return;}else{if(!_0x221ccc||!_0x2f90b2){if(_0x35c02b(0x2b1)!=='jpvzv')_0x55da7c[_0x35c02b(0x338)](_0x467163['faceName']()),_0xacf6fe[_0x35c02b(0x341)](_0x2470e5['characterName']()),_0x4dbc83[_0x35c02b(0x234)](_0x7cf3bd[_0x35c02b(0x346)]());else return;}}const _0x5c9faa=$gameParty[_0x35c02b(0x2d5)],_0x1491d0=_0x5c9faa['indexOf'](_0x221ccc['actorId']()),_0x34c27e=_0x5c9faa[_0x35c02b(0x2cc)](_0x2f90b2[_0x35c02b(0x3a0)]());_0x5c9faa[_0x1491d0]=_0x2f90b2?_0x2f90b2['actorId']():0x0,_0x5c9faa[_0x34c27e]=_0x221ccc?_0x221ccc[_0x35c02b(0x3a0)]():0x0,this[_0x35c02b(0x262)](),this[_0x35c02b(0x24d)](),this[_0x35c02b(0x2f7)](_0x1220f5);},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x420)]=function(){const _0x3bbf0d=_0x56ec57;if(!this[_0x3bbf0d(0x3f7)]())return;Input[_0x3bbf0d(0x3ca)](_0x3bbf0d(0x438))&&this[_0x3bbf0d(0x211)]();},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x211)]=function(){const _0x385007=_0x56ec57;SoundManager[_0x385007(0x24b)](),$gameParty[_0x385007(0x27e)](),this[_0x385007(0x2f7)](0x0),SceneManager[_0x385007(0x2c0)][_0x385007(0x40f)]();},Window_PartyReserve[_0x56ec57(0x2de)]['isShiftShortcutEnabled']=function(){const _0x53604f=_0x56ec57;return this[_0x53604f(0x2db)];},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x246)]=function(){const _0x512062=_0x56ec57,_0x51b324=this['currentActor']();return _0x51b324?_0x51b324[_0x512062(0x249)]():-0x1;},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x410)]=function(_0x4d3492){const _0x4c8fb2=_0x56ec57;Window_StatusBase[_0x4c8fb2(0x2de)]['select'][_0x4c8fb2(0x376)](this,_0x4d3492);if(_0x4d3492>=0x0)this['_lastIndex']=_0x4d3492;},Window_PartyReserve['prototype'][_0x56ec57(0x260)]=function(){const _0x164c2c=_0x56ec57;this[_0x164c2c(0x266)]=Math[_0x164c2c(0x2e9)](this[_0x164c2c(0x266)],this['maxItems']()-0x1),this['smoothSelect'](this[_0x164c2c(0x266)]),this[_0x164c2c(0x3e7)](!![]),this['cursorVisible']=!![];},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x2b2)]=function(_0x187101){const _0x69f838=_0x56ec57,_0x5cb544=this[_0x69f838(0x2da)](_0x187101);if(!_0x5cb544)return this['drawRemoveCommand'](_0x187101);const _0x27a5ad=this['itemLineRect'](_0x187101);this[_0x69f838(0x23c)](_0x187101);const _0x36b4b3=0xa8,_0x3276c6=Window_PartyReserve['_rowThickness']===0x1,_0x4c4bae=ImageManager[_0x69f838(0x386)]*(_0x3276c6?0x2:0x1),_0x263dd4=this[_0x69f838(0x3d2)]()+this[_0x69f838(0x400)](),_0x6e9c5d=_0x27a5ad[_0x69f838(0x2c8)]-_0x36b4b3,_0x2b72c6=_0x27a5ad['x']+_0x4c4bae+Math[_0x69f838(0x2e9)](_0x263dd4,_0x6e9c5d),_0x42751b=_0x3276c6?![]:!![];this[_0x69f838(0x21c)](_0x5cb544[_0x69f838(0x24f)]()),this['drawActorPartyIcons'](_0x5cb544,_0x27a5ad['x'],_0x27a5ad['y'],_0x42751b),this[_0x69f838(0x430)](_0x5cb544,_0x2b72c6,_0x27a5ad['y'],_0x36b4b3),this[_0x69f838(0x21c)](!![]);},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x3d2)]=function(){const _0x3dd737=_0x56ec57,_0x3542da=VisuMZ['PartySystem']['Settings'][_0x3dd737(0x3ba)];switch(Window_PartyReserve[_0x3dd737(0x374)][_0x3dd737(0x348)]()[_0x3dd737(0x220)]()){case _0x3dd737(0x254):return ImageManager['faceWidth'];case _0x3dd737(0x32a):return _0x3542da[_0x3dd737(0x1fa)]*0x2;case _0x3dd737(0x216):return _0x3542da[_0x3dd737(0x215)]*0x2;};},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x384)]=function(_0x2b3428){const _0x2dc33a=_0x56ec57,_0x4a1d8f=this[_0x2dc33a(0x37a)](_0x2b3428);this[_0x2dc33a(0x21c)](!![]);const _0x2d6ada=TextManager[_0x2dc33a(0x3df)];this[_0x2dc33a(0x42f)](_0x2d6ada,_0x4a1d8f['x'],_0x4a1d8f['y'],_0x4a1d8f[_0x2dc33a(0x2c8)],_0x2dc33a(0x274));},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x23c)]=function(_0x227387){const _0x1952fd=_0x56ec57;switch(Window_PartyReserve['_actorGraphic'][_0x1952fd(0x348)]()[_0x1952fd(0x220)]()){case _0x1952fd(0x254):this[_0x1952fd(0x2e8)](_0x227387);break;case _0x1952fd(0x32a):this[_0x1952fd(0x3f2)](_0x227387);break;case'svbattler':if(Imported[_0x1952fd(0x20b)]){if('jOOAd'===_0x1952fd(0x385))this[_0x1952fd(0x329)](_0x227387);else return _0x28e7f7['PartySystem'][_0x1952fd(0x353)][_0x1952fd(0x3ba)][_0x1952fd(0x237)][_0x1952fd(0x376)](this);}break;};},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x2e8)]=function(_0x4df2a4){const _0xb61ec=_0x56ec57,_0x585fec=this[_0xb61ec(0x2da)](_0x4df2a4),_0x30a8db=this[_0xb61ec(0x30f)](_0x4df2a4),_0xe6d500=Window_PartyReserve['_rowThickness']===0x1;_0x30a8db['x']+=ImageManager[_0xb61ec(0x386)]*(_0xe6d500?0x2:0x1);const _0x990762=ImageManager[_0xb61ec(0x41e)],_0x553b9b=_0x30a8db[_0xb61ec(0x204)]-0x2;this[_0xb61ec(0x21c)](_0x585fec['isFormationChangeOk']()),this[_0xb61ec(0x31b)](_0x585fec,_0x30a8db['x']+0x1,_0x30a8db['y']+0x1,_0x990762,_0x553b9b),this[_0xb61ec(0x21c)](!![]);},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x3f2)]=function(_0x3a3a4e){const _0x1621f9=_0x56ec57,_0x223826=this[_0x1621f9(0x2da)](_0x3a3a4e),_0x39d6a2=this[_0x1621f9(0x30f)](_0x3a3a4e),_0x3c9b00=Window_PartyReserve[_0x1621f9(0x2dc)]===0x1;_0x39d6a2['x']+=ImageManager[_0x1621f9(0x386)]*(_0x3c9b00?0x2:0x1);const _0x323a0c=VisuMZ[_0x1621f9(0x433)]['Settings'][_0x1621f9(0x3ba)],_0x399503=_0x39d6a2['x']+_0x323a0c['ReserveSpriteOffsetX']+this['itemPadding'](),_0xcb5b32=_0x39d6a2['y']+_0x39d6a2[_0x1621f9(0x204)]-_0x323a0c[_0x1621f9(0x3ed)];this[_0x1621f9(0x3a6)](_0x223826,_0x399503,_0xcb5b32);},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x329)]=function(_0x20c621){const _0x448417=_0x56ec57,_0x216591=this['actor'](_0x20c621),_0x1024cb=_0x216591['battlerName'](),_0x2cf965=this[_0x448417(0x30f)](_0x20c621),_0x57bce=Window_PartyReserve['_rowThickness']===0x1;_0x2cf965['x']+=ImageManager[_0x448417(0x386)]*(_0x57bce?0x2:0x1);const _0x496903=VisuMZ[_0x448417(0x433)][_0x448417(0x353)][_0x448417(0x3ba)],_0x36bbdc=_0x2cf965['x']+_0x496903[_0x448417(0x215)]+this[_0x448417(0x400)](),_0x38cc12=_0x2cf965['y']+_0x2cf965['height']-_0x496903[_0x448417(0x42c)];this[_0x448417(0x219)](_0x1024cb,_0x36bbdc,_0x38cc12);},Window_PartyReserve['prototype']['setStatusWindow']=function(_0x194f6b){this['_statusWindow']=_0x194f6b,this['callUpdateHelp']();},Window_PartyReserve[_0x56ec57(0x2de)][_0x56ec57(0x342)]=function(){const _0x430cf4=_0x56ec57;this[_0x430cf4(0x352)]&&this[_0x430cf4(0x352)][_0x430cf4(0x35f)](this[_0x430cf4(0x2da)](this[_0x430cf4(0x249)]()));};function Window_PartyStatus(){const _0x135649=_0x56ec57;this[_0x135649(0x2ea)](...arguments);}Window_PartyStatus[_0x56ec57(0x2de)]=Object[_0x56ec57(0x201)](Window_StatusBase[_0x56ec57(0x2de)]),Window_PartyStatus[_0x56ec57(0x2de)][_0x56ec57(0x2a8)]=Window_PartyStatus,Window_PartyStatus[_0x56ec57(0x2de)][_0x56ec57(0x2ea)]=function(_0x376c2e){const _0x4e6f51=_0x56ec57;this[_0x4e6f51(0x2ca)]=null,Window_StatusBase[_0x4e6f51(0x2de)][_0x4e6f51(0x2ea)]['call'](this,_0x376c2e);},Window_PartyStatus['prototype']['drawItemDarkRect']=function(_0x3a9ea1,_0x24782d,_0x786f4a,_0xeb3cd4,_0x27e9a1){const _0x3e355d=_0x56ec57;if(VisuMZ['PartySystem'][_0x3e355d(0x353)][_0x3e355d(0x22c)][_0x3e355d(0x236)]===![])return;_0x27e9a1=Math[_0x3e355d(0x21f)](_0x27e9a1||0x1,0x1);while(_0x27e9a1--){if(_0x3e355d(0x29f)!==_0x3e355d(0x21d)){_0xeb3cd4=_0xeb3cd4||this[_0x3e355d(0x34f)](),this[_0x3e355d(0x432)][_0x3e355d(0x394)]=0xa0;const _0x58df82=ColorManager[_0x3e355d(0x248)]();this[_0x3e355d(0x432)][_0x3e355d(0x3b7)](_0x3a9ea1+0x1,_0x24782d+0x1,_0x786f4a-0x2,_0xeb3cd4-0x2,_0x58df82),this[_0x3e355d(0x432)][_0x3e355d(0x394)]=0xff;}else this[_0x3e355d(0x221)][_0x3e355d(0x3c8)](),this[_0x3e355d(0x208)]['activate']();}},ColorManager[_0x56ec57(0x248)]=function(){const _0x4ee907=_0x56ec57,_0x12a12e=VisuMZ[_0x4ee907(0x433)][_0x4ee907(0x353)][_0x4ee907(0x22c)];let _0xf16d2a=_0x12a12e['BackRectColor']!==undefined?_0x12a12e[_0x4ee907(0x323)]:0x13;return ColorManager['getColor'](_0xf16d2a);},Window_PartyStatus[_0x56ec57(0x2de)][_0x56ec57(0x35f)]=function(_0x177ac8){const _0x21d817=_0x56ec57;if(this['_actor']===_0x177ac8)return;this[_0x21d817(0x2ca)]=_0x177ac8;if(_0x177ac8){const _0x5e8935=ImageManager[_0x21d817(0x338)](_0x177ac8[_0x21d817(0x3a9)]());_0x5e8935['addLoadListener'](this[_0x21d817(0x262)][_0x21d817(0x3c7)](this));}else _0x21d817(0x2a6)===_0x21d817(0x2a6)?this[_0x21d817(0x262)]():(this['drawIcon'](_0x375f04['lockPartyMemberIcon'],_0x33e9e3,_0x35b7d),_0x49f31c+=_0x3cce7d['iconWidth']+0x4);},Window_PartyStatus['prototype']['refresh']=function(){const _0x35980f=_0x56ec57;Window_StatusBase[_0x35980f(0x2de)][_0x35980f(0x262)]['call'](this),this['contents']['clear'](),this[_0x35980f(0x286)](),VisuMZ[_0x35980f(0x433)][_0x35980f(0x353)][_0x35980f(0x3ba)][_0x35980f(0x319)][_0x35980f(0x376)](this);},Window_PartyStatus[_0x56ec57(0x2de)][_0x56ec57(0x26d)]=function(){const _0x39a1c4=_0x56ec57;if(!this['_actor']){this[_0x39a1c4(0x2dd)](0x0,0x0,this[_0x39a1c4(0x2ec)],this[_0x39a1c4(0x38b)]);const _0x92d3fc=Math[_0x39a1c4(0x390)]((this[_0x39a1c4(0x38b)]-this[_0x39a1c4(0x34f)]())/0x2);this['changeTextColor'](ColorManager[_0x39a1c4(0x302)]()),this[_0x39a1c4(0x42f)](TextManager[_0x39a1c4(0x3ac)],0x0,_0x92d3fc,this['innerWidth'],_0x39a1c4(0x274));return;}this[_0x39a1c4(0x31b)](this['_actor'],0x1,0x0,ImageManager[_0x39a1c4(0x41e)],ImageManager[_0x39a1c4(0x2c7)]),this[_0x39a1c4(0x35e)](this['_actor'],ImageManager[_0x39a1c4(0x41e)]+0x24,0x0);const _0x4ec258=this[_0x39a1c4(0x34f)](),_0x70ca56=this['actorParams'](),_0x3d059f=Math[_0x39a1c4(0x390)](this[_0x39a1c4(0x2ec)]/0x2),_0x58477b=Math[_0x39a1c4(0x29b)](_0x70ca56[_0x39a1c4(0x1f3)]/0x2)*_0x4ec258,_0x25c25f=0x0;let _0x220b35=0x0,_0x3cc25c=ImageManager['faceHeight']+_0x4ec258/0x2;for(const _0x2f498b of _0x70ca56){this[_0x39a1c4(0x2dd)](_0x220b35,_0x3cc25c,_0x3d059f,_0x4ec258),this[_0x39a1c4(0x382)](_0x2f498b,_0x220b35,_0x3cc25c,_0x3d059f),this[_0x39a1c4(0x23f)](_0x2f498b,_0x220b35,_0x3cc25c,_0x3d059f),_0x220b35===_0x25c25f?_0x39a1c4(0x396)===_0x39a1c4(0x396)?_0x220b35+=_0x3d059f:_0x29041e[_0x39a1c4(0x26a)]():(_0x220b35=_0x25c25f,_0x3cc25c+=_0x4ec258);}},Window_PartyStatus[_0x56ec57(0x2de)][_0x56ec57(0x25e)]=function(){const _0x17a465=_0x56ec57;return Imported[_0x17a465(0x26b)]?VisuMZ[_0x17a465(0x2d0)][_0x17a465(0x353)][_0x17a465(0x38a)][_0x17a465(0x289)]:_0x17a465(0x291)===_0x17a465(0x25c)?![]:[0x2,0x3,0x4,0x5,0x6,0x7];},Window_PartyStatus[_0x56ec57(0x2de)][_0x56ec57(0x382)]=function(_0x33056e,_0x3c4ffe,_0x51fb7d,_0x1402be){const _0x31f1ba=_0x56ec57,_0x1da6f7=this[_0x31f1ba(0x400)]();_0x1402be-=_0x1da6f7*0x2;if(Imported[_0x31f1ba(0x26b)])this[_0x31f1ba(0x383)](_0x3c4ffe+_0x1da6f7,_0x51fb7d,_0x1402be,_0x33056e,![]);else{const _0xd72fd5=TextManager['param'](_0x33056e);this[_0x31f1ba(0x36f)](ColorManager[_0x31f1ba(0x302)]()),this['drawText'](_0xd72fd5,_0x3c4ffe+_0x1da6f7,_0x51fb7d,_0x1402be);}},Window_PartyStatus[_0x56ec57(0x2de)][_0x56ec57(0x23f)]=function(_0x88e4ce,_0x151901,_0x52afec,_0xc855c9){const _0x4b970b=_0x56ec57;this['resetFontSettings']();const _0x4a2dc2=this[_0x4b970b(0x400)](),_0x388e94=this[_0x4b970b(0x42e)](_0x88e4ce);this[_0x4b970b(0x42f)](_0x388e94,_0x151901+_0x4a2dc2,_0x52afec,_0xc855c9-_0x4a2dc2*0x2,_0x4b970b(0x428));},Window_PartyStatus[_0x56ec57(0x2de)]['getParamValue']=function(_0x4982df){const _0xc96402=_0x56ec57,_0x19e003=this[_0xc96402(0x2ca)];if(Imported[_0xc96402(0x26b)]){if('DOIZx'!==_0xc96402(0x362))_0x21f592['updateTurnOrderSTB'](),_0x7a4353[_0xc96402(0x255)]=this,_0x369ef9[_0xc96402(0x381)]=this;else return _0x19e003[_0xc96402(0x2cf)](_0x4982df,!![]);}else return _0x19e003['param'](_0x4982df);};function Window_PartyBattleSwitch(){const _0x1e3abf=_0x56ec57;this[_0x1e3abf(0x2ea)](...arguments);}Window_PartyBattleSwitch[_0x56ec57(0x2de)]=Object['create'](Window_StatusBase[_0x56ec57(0x2de)]),Window_PartyBattleSwitch[_0x56ec57(0x2de)][_0x56ec57(0x2a8)]=Window_PartyBattleSwitch,Window_PartyBattleSwitch['prototype'][_0x56ec57(0x2ea)]=function(_0x12ea0d){const _0x2ddc62=_0x56ec57;Window_StatusBase[_0x2ddc62(0x2de)][_0x2ddc62(0x2ea)][_0x2ddc62(0x376)](this,_0x12ea0d),this['setBackgroundType'](VisuMZ[_0x2ddc62(0x433)][_0x2ddc62(0x353)][_0x2ddc62(0x3ba)][_0x2ddc62(0x336)]),this[_0x2ddc62(0x3ad)]=0x0;},Window_PartyBattleSwitch[_0x56ec57(0x2de)]['loadFaceImages']=function(){const _0x4e96e7=_0x56ec57;for(const _0x247164 of $gameParty[_0x4e96e7(0x3c1)]()){if(_0x4e96e7(0x30b)!==_0x4e96e7(0x36d))ImageManager['loadFace'](_0x247164[_0x4e96e7(0x3a9)]());else{_0x4c1847[_0x4e96e7(0x433)][_0x4e96e7(0x300)]['call'](this);if(this['isActor']()&&_0x156ecb['inBattle']())this[_0x4e96e7(0x2d1)]();}}},Window_PartyBattleSwitch['prototype'][_0x56ec57(0x272)]=function(){return 0x1;},Window_PartyBattleSwitch[_0x56ec57(0x2de)][_0x56ec57(0x2da)]=function(_0x2720e5){const _0x362d95=_0x56ec57;return $gameParty[_0x362d95(0x425)]()[_0x2720e5];},Window_PartyBattleSwitch['prototype'][_0x56ec57(0x213)]=function(){const _0x52b85e=_0x56ec57;return this[_0x52b85e(0x2da)](this['index']());},Window_PartyBattleSwitch[_0x56ec57(0x2de)][_0x56ec57(0x3cd)]=function(){const _0xb3096b=_0x56ec57;return this[_0xb3096b(0x34f)]()*0x2+0x8;},Window_PartyBattleSwitch[_0x56ec57(0x2de)][_0x56ec57(0x38d)]=function(){const _0x559900=_0x56ec57;return $gameParty[_0x559900(0x425)]()[_0x559900(0x1f3)];},Window_PartyBattleSwitch['prototype'][_0x56ec57(0x2e2)]=function(){const _0x1779ff=_0x56ec57;Window_StatusBase[_0x1779ff(0x2de)]['activate'][_0x1779ff(0x376)](this),this[_0x1779ff(0x3a2)](),this[_0x1779ff(0x262)](),this[_0x1779ff(0x2f7)](0x0);},Window_PartyBattleSwitch[_0x56ec57(0x2de)][_0x56ec57(0x3c8)]=function(){const _0x20e1a0=_0x56ec57;Window_StatusBase[_0x20e1a0(0x2de)][_0x20e1a0(0x3c8)][_0x20e1a0(0x376)](this),this[_0x20e1a0(0x421)]();},Window_PartyBattleSwitch[_0x56ec57(0x2de)]['isCurrentItemEnabled']=function(){const _0x173366=_0x56ec57;return this[_0x173366(0x318)](this['currentActor']());},Window_PartyBattleSwitch['prototype'][_0x56ec57(0x318)]=function(_0x31e909){const _0x1846dd=_0x56ec57;if(!_0x31e909)return![];return _0x31e909[_0x1846dd(0x24f)]()&&_0x31e909[_0x1846dd(0x358)]();},Window_PartyBattleSwitch['prototype'][_0x56ec57(0x2b2)]=function(_0x57ef03){const _0x491498=_0x56ec57,_0x5cf027=this['actor'](_0x57ef03);if(!_0x5cf027)return;const _0x310696=ImageManager[_0x491498(0x338)](_0x5cf027[_0x491498(0x3a9)]());_0x310696[_0x491498(0x292)](this[_0x491498(0x270)][_0x491498(0x3c7)](this,_0x57ef03));},Window_PartyBattleSwitch['prototype'][_0x56ec57(0x270)]=function(_0x1ffd58){const _0x41bf9a=_0x56ec57;this[_0x41bf9a(0x23c)](_0x1ffd58),this[_0x41bf9a(0x2f2)](_0x1ffd58);},Window_PartyBattleSwitch[_0x56ec57(0x2de)][_0x56ec57(0x23c)]=function(_0x45b2d5){const _0x44a094=_0x56ec57,_0x6225d0=this['actor'](_0x45b2d5),_0x8d3159=this[_0x44a094(0x30f)](_0x45b2d5);this[_0x44a094(0x21c)](this['isEnabled'](_0x6225d0)),this[_0x44a094(0x31b)](_0x6225d0,_0x8d3159['x']+0x1,_0x8d3159['y']+0x1,ImageManager['faceWidth'],_0x8d3159[_0x44a094(0x204)]-0x2),this[_0x44a094(0x21c)](!![]);},Window_PartyBattleSwitch[_0x56ec57(0x2de)][_0x56ec57(0x2f2)]=function(_0xd9566){const _0x54ac30=_0x56ec57,_0x402cfe=this[_0x54ac30(0x2da)](_0xd9566),_0x40525a=this[_0x54ac30(0x3e4)](_0xd9566),_0x140aac=_0x40525a['x']+ImageManager[_0x54ac30(0x41e)]+0x24,_0x4e7387=_0x140aac+0xb4;this[_0x54ac30(0x21c)](this['isEnabled'](_0x402cfe)),this['drawActorName'](_0x402cfe,_0x140aac,_0x40525a['y']),this[_0x54ac30(0x2a3)](_0x402cfe,_0x140aac,_0x40525a['y']+this['lineHeight']()),this[_0x54ac30(0x2d9)](_0x402cfe,_0x4e7387,_0x40525a['y']),this[_0x54ac30(0x21c)](!![]);};Imported[_0x56ec57(0x232)]&&(ImageManager[_0x56ec57(0x276)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)]['General'][_0x56ec57(0x252)]??0x4b,TextManager[_0x56ec57(0x284)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x322)][_0x56ec57(0x343)],TextManager['battlePartyChangeCmdHelp']=VisuMZ['PartySystem'][_0x56ec57(0x353)][_0x56ec57(0x322)][_0x56ec57(0x288)],TextManager[_0x56ec57(0x380)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x322)][_0x56ec57(0x369)],TextManager[_0x56ec57(0x41d)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x322)][_0x56ec57(0x368)],TextManager[_0x56ec57(0x299)]=VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x322)][_0x56ec57(0x1fe)],VisuMZ[_0x56ec57(0x433)]['SceneManager_isPreviousSceneBattleTransitionable']=SceneManager[_0x56ec57(0x344)],SceneManager['isPreviousSceneBattleTransitionable']=function(){const _0x1f4525=_0x56ec57;if(SceneManager[_0x1f4525(0x2ef)](Scene_Party))return!![];return VisuMZ[_0x1f4525(0x433)]['SceneManager_isPreviousSceneBattleTransitionable'][_0x1f4525(0x376)](this);},VisuMZ[_0x56ec57(0x433)]['SceneManager_isNextSceneBattleTransitionable']=SceneManager[_0x56ec57(0x2bb)],SceneManager[_0x56ec57(0x2bb)]=function(){const _0xba7cf6=_0x56ec57;if(SceneManager['isNextScene'](Scene_Party))return!![];return VisuMZ[_0xba7cf6(0x433)][_0xba7cf6(0x412)][_0xba7cf6(0x376)](this);},SceneManager[_0x56ec57(0x24c)]=function(){const _0x359469=_0x56ec57;return this['_scene']&&this[_0x359469(0x2c0)][_0x359469(0x2a8)]===Scene_Map;},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x370)]=Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x2c3)],Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x2c3)]=function(){const _0x46313a=_0x56ec57;VisuMZ['PartySystem'][_0x46313a(0x370)][_0x46313a(0x376)](this),this[_0x46313a(0x356)](),this[_0x46313a(0x32d)](),this[_0x46313a(0x3ff)]();},Scene_Battle[_0x56ec57(0x2de)]['createPartySwitchWindow']=function(){const _0x545001=_0x56ec57,_0x2b25fb=this[_0x545001(0x392)]();this[_0x545001(0x221)]=new Window_PartyBattleSwitch(_0x2b25fb),this['addWindow'](this[_0x545001(0x221)]),this['_partyMemberSwitchWindow'][_0x545001(0x3be)]('ok',this['onPartySwitchOk']['bind'](this)),this[_0x545001(0x221)][_0x545001(0x3be)]('cancel',this['onPartySwitchCancel']['bind'](this));},Scene_Battle[_0x56ec57(0x2de)]['partySwitchWindowRect']=function(){const _0x17f804=_0x56ec57,_0x39ee17=this['battleLayoutStyle']();if(_0x39ee17===_0x17f804(0x334)){if(_0x17f804(0x3f5)!=='IfTJI')return this[_0x17f804(0x227)]();else{if(_0x2f81f6[_0x17f804(0x2f3)](_0x5769f3))return!![];return _0x19d506['PartySystem'][_0x17f804(0x412)][_0x17f804(0x376)](this);}}else{if(_0x17f804(0x217)!==_0x17f804(0x315))return this['partySwitchWindowRectStandard']();else _0x45d7a8[_0x17f804(0x433)][_0x17f804(0x3a7)][_0x17f804(0x376)](this),this['_actorCommandWindow'][_0x17f804(0x3be)]('formation',this[_0x17f804(0x325)][_0x17f804(0x3c7)](this));}},Scene_Battle['prototype'][_0x56ec57(0x316)]=function(){const _0x5ad100=_0x56ec57;return VisuMZ[_0x5ad100(0x433)]['Settings'][_0x5ad100(0x3ba)][_0x5ad100(0x33a)][_0x5ad100(0x376)](this);},Scene_Battle[_0x56ec57(0x2de)]['partySwitchWindowRectBorder']=function(){const _0xaf5cf6=_0x56ec57,_0x1b4df8=this[_0xaf5cf6(0x283)](),_0xadc058=$gameSystem[_0xaf5cf6(0x2d2)]()*0x2;return _0x1b4df8[_0xaf5cf6(0x2c8)]=0x204+_0xadc058,_0x1b4df8;},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x3e2)]=Scene_Battle[_0x56ec57(0x2de)]['isAnyInputWindowActive'],Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x2bf)]=function(){const _0x1874e7=_0x56ec57;if(this['_partyMemberSwitchWindow']&&this[_0x1874e7(0x221)][_0x1874e7(0x2db)])return!![];if(this[_0x1874e7(0x25b)])return!![];if(this['_callPartyMemberSwitch'])return!![];if(this[_0x1874e7(0x28f)])return!![];return VisuMZ['PartySystem']['Scene_Battle_isAnyInputWindowActive'][_0x1874e7(0x376)](this);},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x406)]=Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x2ee)],Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x2ee)]=function(){const _0x5033e0=_0x56ec57;VisuMZ[_0x5033e0(0x433)][_0x5033e0(0x406)]['call'](this),this[_0x5033e0(0x1f2)]['setHandler'](_0x5033e0(0x2cd),this[_0x5033e0(0x3c2)][_0x5033e0(0x3c7)](this));},Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x3c2)]=function(){const _0x3975a5=_0x56ec57;this[_0x3975a5(0x2e1)]()?_0x3975a5(0x21e)===_0x3975a5(0x21e)?(this[_0x3975a5(0x28f)]=!![],this[_0x3975a5(0x3c0)][_0x3975a5(0x233)](TextManager['ActiveTpbFormationMessage'][_0x3975a5(0x3cc)](TextManager[_0x3975a5(0x2cd)]))):(_0x23eec7[_0x3975a5(0x433)]['BattleManager_setup'][_0x3975a5(0x376)](this,_0x1cef08,_0x821e31,_0x2759e0),_0x46cbf7[_0x3975a5(0x235)]()):_0x3975a5(0x308)===_0x3975a5(0x308)?this[_0x3975a5(0x3db)]():this[_0x3975a5(0x329)](_0x2ac8ca);},Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x2e1)]=function(){const _0x1733f3=_0x56ec57;return BattleManager[_0x1733f3(0x3ec)]();},Scene_Battle['prototype'][_0x56ec57(0x3db)]=function(){const _0x560e7e=_0x56ec57;this[_0x560e7e(0x28f)]=![],this[_0x560e7e(0x285)]['update'](),this[_0x560e7e(0x38e)][_0x560e7e(0x36a)]=![],SceneManager[_0x560e7e(0x225)](),SceneManager[_0x560e7e(0x298)](Scene_Party),$gameParty[_0x560e7e(0x3a1)](),BattleManager[_0x560e7e(0x3b1)]()&&(BattleManager[_0x560e7e(0x39b)]=BattleManager[_0x560e7e(0x2da)]());},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x206)]=Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x391)],Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x391)]=function(){const _0x23e52e=_0x56ec57;VisuMZ[_0x23e52e(0x433)][_0x23e52e(0x206)]['call'](this),this[_0x23e52e(0x28f)]&&!BattleManager[_0x23e52e(0x255)]&&this[_0x23e52e(0x3db)](),this['_callPartyMemberSwitch']&&!BattleManager['_subject']&&this[_0x23e52e(0x347)]();},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x326)]=Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x1ff)],Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x1ff)]=function(){const _0x1e9e43=_0x56ec57;if(BattleManager['isActiveTpb']()){if(this['_partyMemberSwitchWindow']&&this[_0x1e9e43(0x221)][_0x1e9e43(0x2db)])return _0x1e9e43(0x3dd)!==_0x1e9e43(0x3e0)?![]:'';}return VisuMZ[_0x1e9e43(0x433)][_0x1e9e43(0x326)]['call'](this);},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x3a7)]=Scene_Battle[_0x56ec57(0x2de)]['createActorCommandWindow'],Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x301)]=function(){const _0x13405a=_0x56ec57;VisuMZ[_0x13405a(0x433)][_0x13405a(0x3a7)][_0x13405a(0x376)](this),this[_0x13405a(0x208)][_0x13405a(0x3be)]('formation',this[_0x13405a(0x325)][_0x13405a(0x3c7)](this));},Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x325)]=function(){const _0x63c68d=_0x56ec57;this[_0x63c68d(0x2e1)]()?_0x63c68d(0x264)===_0x63c68d(0x3f0)?(_0x3cd8dd[_0x63c68d(0x2de)]['initialize']['call'](this,_0x1cbade),this[_0x63c68d(0x262)](),this['activate'](),this[_0x63c68d(0x2f7)](0x0)):(this[_0x63c68d(0x333)]=!![],this['_logWindow'][_0x63c68d(0x233)](TextManager['ActiveTpbFormationMessage'][_0x63c68d(0x3cc)](TextManager[_0x63c68d(0x2cd)]))):'fNGsB'==='fNGsB'?this['callPartyMemberSwitch']():(this['_statusWindow']=_0x127b33,this[_0x63c68d(0x342)]());},Scene_Battle['prototype'][_0x56ec57(0x347)]=function(){const _0x188673=_0x56ec57;this[_0x188673(0x333)]=![],this['_logWindow'][_0x188673(0x23d)](),BattleManager[_0x188673(0x2da)]()&&this[_0x188673(0x221)]['activate']();},Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x2ce)]=function(){const _0x5029a3=_0x56ec57,_0x16e5be=this['_partyMemberSwitchWindow']['currentActor']();if(_0x16e5be){if(_0x5029a3(0x3ab)===_0x5029a3(0x2f9)){if(!this[_0x5029a3(0x2d7)]())return;if(this[_0x5029a3(0x3a8)]()){_0x339949['isPlaytest']()&&!_0x99227b[_0x5029a3(0x2b3)]&&(_0x1dc5bd['log']('WARNING:\x20Party\x20Change\x20command\x20is\x20unavailable\x20for\x20Window_PartyCommand\x20for\x20this\x20Battle\x20System'),_0x1c749f['_battleSystemIncompatibilityError']=!![]);return;}const _0xf65d34=this[_0x5029a3(0x2b0)](),_0x515f4b=_0x2c745e[_0x5029a3(0x276)],_0x3bea90=_0xf65d34===_0x5029a3(0x3d1)?_0x5e0956[_0x5029a3(0x284)]:'\x5cI[%1]%2'['format'](_0x515f4b,_0x17fc27[_0x5029a3(0x284)]),_0x10d003=this[_0x5029a3(0x2a2)]();this['addCommand'](_0x3bea90,_0x5029a3(0x2cd),_0x10d003);}else this[_0x5029a3(0x413)](_0x16e5be);}else this[_0x5029a3(0x221)]['deactivate'](),this[_0x5029a3(0x208)][_0x5029a3(0x2e2)]();},Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x413)]=function(_0x5af4fd){const _0x313a72=_0x56ec57,_0x1952d7=BattleManager[_0x313a72(0x2da)](),_0x48e721=_0x1952d7[_0x313a72(0x239)]();this[_0x313a72(0x221)][_0x313a72(0x3c8)](),this['isShowPartySwitchOutAnimation']()&&_0x48e721?_0x313a72(0x1fd)===_0x313a72(0x22f)?(_0x59912c=_0x3fa1e7,_0x4e0b89+=_0x17ce89):(this[_0x313a72(0x25b)]=!![],_0x48e721[_0x313a72(0x312)](_0x5af4fd)):this[_0x313a72(0x39c)](_0x5af4fd);},Scene_Battle['prototype']['isShowPartySwitchOutAnimation']=function(){const _0x5bd3cc=_0x56ec57;return VisuMZ[_0x5bd3cc(0x433)]['Settings'][_0x5bd3cc(0x22c)][_0x5bd3cc(0x40d)];},Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x39c)]=function(_0x529f77){const _0xc1a367=_0x56ec57;this[_0xc1a367(0x25b)]=![];const _0x3b6b68=BattleManager[_0xc1a367(0x2da)](),_0x24d6f6=_0x3b6b68['battler']();$gameParty[_0xc1a367(0x3cb)][_0x3b6b68[_0xc1a367(0x249)]()]=_0x529f77['actorId'](),$gameParty['partyChangeRefresh']();if(this[_0xc1a367(0x324)]())_0x529f77[_0xc1a367(0x2b5)]=_0x3b6b68[_0xc1a367(0x2b5)],_0x529f77[_0xc1a367(0x3ae)]=_0xc1a367(0x24e);else{if(BattleManager[_0xc1a367(0x3b1)]()){if(_0xc1a367(0x364)!=='puGVm')_0x529f77[_0xc1a367(0x31a)]();else return![];}}BattleManager['_currentActor']=_0x529f77,_0x529f77[_0xc1a367(0x3a1)](),_0x529f77['makeActions'](),_0x529f77['onBattlePartySwitch'](_0x3b6b68),_0x24d6f6&&_0x24d6f6[_0xc1a367(0x2e3)](_0x529f77),this[_0xc1a367(0x352)][_0xc1a367(0x2c5)](_0x3b6b68,_0x529f77),this['_statusWindow'][_0xc1a367(0x262)](),this[_0xc1a367(0x208)][_0xc1a367(0x3e8)](_0x529f77),this[_0xc1a367(0x208)][_0xc1a367(0x2f7)](0x0),this['_actorCommandWindow'][_0xc1a367(0x2e2)](),this[_0xc1a367(0x208)][_0xc1a367(0x257)]=!![];},Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x324)]=function(){const _0x45f1b9=_0x56ec57;if(!BattleManager[_0x45f1b9(0x3b1)]())return![];const _0x2974a1=VisuMZ[_0x45f1b9(0x433)]['Settings'][_0x45f1b9(0x22c)];return _0x2974a1[_0x45f1b9(0x3c5)]===undefined&&(_0x2974a1[_0x45f1b9(0x3c5)]=!![]),_0x2974a1[_0x45f1b9(0x3c5)];},Window_StatusBase['prototype']['switchStateIconActor']=function(_0x36bb7e,_0x215373){const _0x5457ec=_0x56ec57,_0x352c5b='actor%1-stateIcon'['format'](_0x36bb7e[_0x5457ec(0x3a0)]()),_0xdcbe20=this['createInnerSprite'](_0x352c5b,Sprite_StateIcon);_0xdcbe20[_0x5457ec(0x3e8)](_0x215373);},Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x268)]=function(){const _0xdecb7a=_0x56ec57;this[_0xdecb7a(0x221)][_0xdecb7a(0x3c8)](),this[_0xdecb7a(0x208)][_0xdecb7a(0x2e2)](),this[_0xdecb7a(0x208)]['refresh']();},Scene_Battle[_0x56ec57(0x2de)][_0x56ec57(0x32d)]=function(){const _0x114786=_0x56ec57;if(!BattleManager[_0x114786(0x3b1)]())return;if(!SceneManager[_0x114786(0x2ef)](Scene_Party))return;this[_0x114786(0x1f2)]['deactivate'](),this[_0x114786(0x1f2)][_0x114786(0x421)](),this['_actorCommandWindow'][_0x114786(0x3c8)](),this[_0x114786(0x208)][_0x114786(0x421)](),BattleManager[_0x114786(0x381)]=null,BattleManager[_0x114786(0x22a)]=![];},Scene_Battle['prototype'][_0x56ec57(0x3ff)]=function(){const _0x228a8c=_0x56ec57;if(BattleManager[_0x228a8c(0x3b1)]())return;if(!SceneManager[_0x228a8c(0x2ef)](Scene_Party))return;Imported[_0x228a8c(0x3b8)]&&BattleManager[_0x228a8c(0x340)]()&&(_0x228a8c(0x3c6)===_0x228a8c(0x3c6)?BattleManager[_0x228a8c(0x3d9)]():this[_0x228a8c(0x39c)](_0x3594e6));Imported[_0x228a8c(0x2d6)]&&BattleManager['isFTB']()&&(_0x228a8c(0x3d6)!==_0x228a8c(0x3d6)?(_0xbc5df5[_0x228a8c(0x3b5)](_0x228a8c(0x21a)),_0x1dc2ce[_0x228a8c(0x2b3)]=!![]):(BattleManager['_currentActor']=$gameParty[_0x228a8c(0x3d3)](),BattleManager[_0x228a8c(0x255)]=BattleManager[_0x228a8c(0x2da)](),BattleManager[_0x228a8c(0x22a)]=!![],this[_0x228a8c(0x208)]['setup'](BattleManager[_0x228a8c(0x2da)]()),this['_statusWindow'][_0x228a8c(0x263)](BattleManager[_0x228a8c(0x2da)]())));Imported[_0x228a8c(0x281)]&&BattleManager[_0x228a8c(0x2e4)]()&&(BattleManager[_0x228a8c(0x381)]=$gameParty[_0x228a8c(0x3d3)](),BattleManager[_0x228a8c(0x255)]=BattleManager['actor'](),BattleManager[_0x228a8c(0x22a)]=!![],this['_actorCommandWindow']['setup'](BattleManager[_0x228a8c(0x2da)]()),this['_statusWindow']['selectActor'](BattleManager[_0x228a8c(0x2da)]()));if(Imported[_0x228a8c(0x2ed)]&&BattleManager[_0x228a8c(0x3e6)]()){if(_0x228a8c(0x241)===_0x228a8c(0x229)){const _0x970dce=this[_0x228a8c(0x23b)]();return _0x970dce==='border'?this[_0x228a8c(0x227)]():this[_0x228a8c(0x316)]();}else BattleManager[_0x228a8c(0x381)]=$gameParty[_0x228a8c(0x3d3)](),BattleManager[_0x228a8c(0x255)]=BattleManager[_0x228a8c(0x2da)](),BattleManager[_0x228a8c(0x22a)]=!![],this['_actorCommandWindow'][_0x228a8c(0x3e8)](BattleManager[_0x228a8c(0x2da)]()),this[_0x228a8c(0x352)][_0x228a8c(0x263)](BattleManager[_0x228a8c(0x2da)]());}},Game_Party['prototype'][_0x56ec57(0x3d3)]=function(){const _0x58724e=_0x56ec57;let _0x7e6582=this[_0x58724e(0x265)]();return _0x7e6582[0x0];},Sprite_Actor[_0x56ec57(0x2f8)]=0xc,Sprite_Actor['prototype'][_0x56ec57(0x312)]=function(_0xda9edc){const _0x1daeb4=_0x56ec57;this[_0x1daeb4(0x269)]=_0xda9edc;const _0x577f60=Sprite_Actor['_partySwitchDuration'];this[_0x1daeb4(0x2c9)](0x12c,0x0,_0x577f60),this[_0x1daeb4(0x2fc)](0x0,_0x577f60),this[_0x1daeb4(0x2f8)]=_0x577f60;},Sprite_Actor[_0x56ec57(0x2de)][_0x56ec57(0x3cf)]=function(_0xb03e07){const _0x41bee9=_0x56ec57;if(SceneManager[_0x41bee9(0x22e)]()){SceneManager[_0x41bee9(0x2c0)][_0x41bee9(0x39c)](_0xb03e07);const _0x540ce6=Sprite_Actor[_0x41bee9(0x2f8)];this[_0x41bee9(0x240)](),this[_0x41bee9(0x2fc)](0xff,_0x540ce6);}this[_0x41bee9(0x269)]=null;},VisuMZ['PartySystem'][_0x56ec57(0x253)]=Sprite_Actor[_0x56ec57(0x2de)][_0x56ec57(0x402)],Sprite_Actor[_0x56ec57(0x2de)][_0x56ec57(0x402)]=function(){const _0x3cbe19=_0x56ec57;VisuMZ[_0x3cbe19(0x433)][_0x3cbe19(0x253)]['call'](this);if(this[_0x3cbe19(0x2f8)])this[_0x3cbe19(0x405)]();},Sprite_Actor['prototype'][_0x56ec57(0x405)]=function(){const _0x4d8e91=_0x56ec57;this[_0x4d8e91(0x2f8)]=this['_partySwitchDuration']||0x0,this[_0x4d8e91(0x2f8)]--,this[_0x4d8e91(0x2f8)]<=0x0&&this['startSwitchInAnimation'](this[_0x4d8e91(0x269)]);},Window_PartyCommand[_0x56ec57(0x2de)][_0x56ec57(0x3f8)]=function(){this['addFormationCommand']();},Window_PartyCommand['prototype'][_0x56ec57(0x256)]=function(){const _0x21bd08=_0x56ec57;if(!this['isFormationCommandAdded']())return;if(this['hasBattleSystemIncompatibilities']()){if(_0x21bd08(0x37e)===_0x21bd08(0x2f5)){if(this['_partyRequired']===_0x122c84)this['initPartySystem']();return this[_0x21bd08(0x251)];}else{$gameTemp[_0x21bd08(0x3fb)]()&&!BattleManager[_0x21bd08(0x2b3)]&&(console['log']('WARNING:\x20Party\x20Change\x20command\x20is\x20unavailable\x20for\x20Window_PartyCommand\x20for\x20this\x20Battle\x20System'),BattleManager['_battleSystemIncompatibilityError']=!![]);return;}}const _0x56c214=this[_0x21bd08(0x2b0)](),_0x397237=ImageManager['battlePartyChangeIcon'],_0x74f0ae=_0x56c214===_0x21bd08(0x3d1)?TextManager[_0x21bd08(0x284)]:_0x21bd08(0x3fe)[_0x21bd08(0x3cc)](_0x397237,TextManager[_0x21bd08(0x284)]),_0x21258c=this['isFormationCommandEnabled']();this[_0x21bd08(0x27f)](_0x74f0ae,_0x21bd08(0x2cd),_0x21258c);},Window_PartyCommand['prototype'][_0x56ec57(0x2d7)]=function(){const _0x15109b=_0x56ec57;if(Imported[_0x15109b(0x3b6)]&&BattleManager['isOTB']())return![];return VisuMZ[_0x15109b(0x433)][_0x15109b(0x353)]['General'][_0x15109b(0x3d8)];},Window_PartyCommand[_0x56ec57(0x2de)][_0x56ec57(0x3a8)]=function(){const _0x276234=_0x56ec57;if(Imported[_0x276234(0x337)]&&BattleManager['isSTB']())return!![];return![];},Window_PartyCommand['prototype'][_0x56ec57(0x2a2)]=function(){const _0xc5c261=_0x56ec57;if($gameParty[_0xc5c261(0x3c1)]()[_0xc5c261(0x1f3)]<=0x1)return![];if(!$gameParty[_0xc5c261(0x2a7)]())return![];return $gameSystem['isFormationEnabled']();},VisuMZ['PartySystem'][_0x56ec57(0x353)][_0x56ec57(0x2a9)]=Window_PartyCommand[_0x56ec57(0x2de)][_0x56ec57(0x1f7)],Window_PartyCommand['prototype'][_0x56ec57(0x1f7)]=function(){const _0x7d38bc=_0x56ec57,_0x1f5a81=this[_0x7d38bc(0x202)]();switch(_0x1f5a81){case _0x7d38bc(0x2cd):this[_0x7d38bc(0x320)][_0x7d38bc(0x22b)](TextManager['battlePartyChangeCmdHelp']);break;default:VisuMZ[_0x7d38bc(0x433)]['Settings']['Window_PartyCommand_updateHelp'][_0x7d38bc(0x376)](this);break;}},Window_ActorCommand[_0x56ec57(0x2de)][_0x56ec57(0x2f0)]=function(){const _0x3f349a=_0x56ec57;if(!this['isPartyCommandAdded']())return;this[_0x3f349a(0x1f8)]('formation')>=0x0&&this[_0x3f349a(0x40b)]();const _0x15f4e9=this[_0x3f349a(0x2b0)](),_0x12dda8=ImageManager[_0x3f349a(0x276)],_0x3d1726=_0x15f4e9==='text'?TextManager['battlePartySwitchCmd']:_0x3f349a(0x3fe)[_0x3f349a(0x3cc)](_0x12dda8,TextManager[_0x3f349a(0x284)]),_0x53ad9f=this[_0x3f349a(0x224)]();this[_0x3f349a(0x27f)](_0x3d1726,_0x3f349a(0x2cd),_0x53ad9f);},Window_ActorCommand[_0x56ec57(0x2de)][_0x56ec57(0x395)]=function(){const _0x4b300a=_0x56ec57;if(!this[_0x4b300a(0x2ca)])return![];return VisuMZ['PartySystem']['Settings']['General'][_0x4b300a(0x332)];},Window_ActorCommand[_0x56ec57(0x2de)][_0x56ec57(0x224)]=function(){const _0x6c018c=_0x56ec57;if($gameParty[_0x6c018c(0x3c1)]()[_0x6c018c(0x1f3)]<=0x1)return![];if(!this[_0x6c018c(0x2ca)])return![];if(!this[_0x6c018c(0x2ca)][_0x6c018c(0x2a7)]())return![];return this['_actor'][_0x6c018c(0x24f)]();},VisuMZ[_0x56ec57(0x433)][_0x56ec57(0x353)][_0x56ec57(0x415)]=Window_ActorCommand['prototype'][_0x56ec57(0x1f7)],Window_ActorCommand['prototype']['updateHelp']=function(){const _0x2ffc9f=_0x56ec57,_0x5f05eb=this[_0x2ffc9f(0x202)]();if(!_0x5f05eb)return;switch(_0x5f05eb[_0x2ffc9f(0x348)]()){case _0x2ffc9f(0x2cd):this[_0x2ffc9f(0x320)]['setText'](TextManager[_0x2ffc9f(0x41d)]);break;default:VisuMZ[_0x2ffc9f(0x433)]['Settings']['Window_ActorCommand_updateHelp'][_0x2ffc9f(0x376)](this);break;}},Window_ActorCommand[_0x56ec57(0x2de)]['removePartyCommand']=function(){const _0x443266=_0x56ec57;while(this[_0x443266(0x1f8)](_0x443266(0x2cd))>=0x0){const _0x47c6ec=this[_0x443266(0x1f8)](_0x443266(0x2cd));this[_0x443266(0x36e)][_0x443266(0x20e)](_0x47c6ec,0x1);}});;