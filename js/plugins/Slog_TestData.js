const test_data_data_manager_create_gameobjects_alias = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
  test_data_data_manager_create_gameobjects_alias.call(this);
  populateTestData();
};

const test_data_extract_save_contents_alias = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
  test_data_extract_save_contents_alias.call(this, contents);
  populateTestData();
};

function populateTestData() {
  $gamePlayerSlogCollection = [];
  $gamePlayerSlogCollection.push(
      {id: "bored_frog", quantity: 3},
      {id: "ducks", quantity: 3},
      {id: "kanaria_bird_1", quantity: 3},
      {id: "mantis", quantity: 3},
      {id: "sailor", quantity: 3},
      {id: "scorpion", quantity: 3},
      {id: "trader", quantity: 3},
      {id: "blind_cleric", quantity: 3},
      {id: "florist", quantity: 3},
      {id: "giant_bird", quantity: 3},
      {id: "homeless_kid", quantity: 3},
      {id: "hunter", quantity: 3},
      {id: "knight_skeleton", quantity: 3},
      {id: "nun", quantity: 3},
      {id: "merchant", quantity: 3},
      {id: "ranger", quantity: 3},
      {id: "sandworm", quantity: 3},
      {id: "stray_dog", quantity: 3},
      {id: "tentacle_shell", quantity: 3},
      {id: "cactus", quantity: 3},
      {id: "dark_cleric", quantity: 4},
      {id: "eel", quantity: 2},
      {id: "giant_snake", quantity: 3},
      {id: "haunted_trunk", quantity: 2},
      {id: "dark_elf", quantity: 2},
      {id: "dark_owlman", quantity: 2},
      {id: "hermit", quantity: 2},
      {id: "knight", quantity: 2},
      {id: "mimic", quantity: 2},
      {id: "mushrooms", quantity: 2},
      {id: "mutant_shark", quantity: 2},
      {id: "pigman", quantity: 2},
      {id: "reaper", quantity: 2},
      {id: "rogue", quantity: 2},
      {id: "skeleton", quantity: 2},
      {id: "skull_king", quantity: 2},
      {id: "slime", quantity: 2},
      {id: "spider", quantity: 2},
      {id: "wild_dog", quantity: 2},
      {id: "npc1", quantity: 3},
      {id: "castleGuard", quantity: 5},
      {id: "bitingFrost", quantity: 5},
      {id: "impenetrableFog", quantity: 5},
      {id: "clearWeather", quantity: 5},
  );

  $gamePlayerSlogDeck = [];
  $gamePlayerSlogDeck.push(
      {id: "bored_frog", quantity: 3},
      {id: "ducks", quantity: 3},
      {id: "kanaria_bird_1", quantity: 3},
      {id: "mantis", quantity: 3},
      {id: "sailor", quantity: 3},
      {id: "scorpion", quantity: 3},
      {id: "trader", quantity: 3},
      {id: "blind_cleric", quantity: 3},
      {id: "florist", quantity: 3},
      {id: "giant_bird", quantity: 3},
      {id: "homeless_kid", quantity: 3},
      {id: "hunter", quantity: 3},
      {id: "knight_skeleton", quantity: 3},
      {id: "nun", quantity: 3},
      {id: "merchant", quantity: 3},
      {id: "ranger", quantity: 3},
      {id: "sandworm", quantity: 3},
      {id: "stray_dog", quantity: 3},
      {id: "tentacle_shell", quantity: 3},
      {id: "cactus", quantity: 3},
      {id: "dark_cleric", quantity: 4},
      {id: "eel", quantity: 2},
      {id: "giant_snake", quantity: 3},
      {id: "haunted_trunk", quantity: 2},
      {id: "dark_elf", quantity: 2},
      {id: "dark_owlman", quantity: 2},
      {id: "hermit", quantity: 2},
      {id: "knight", quantity: 2},
      {id: "mimic", quantity: 2},
      {id: "mushrooms", quantity: 2},
      {id: "mutant_shark", quantity: 2},
      {id: "pigman", quantity: 2},
      {id: "reaper", quantity: 2},
      {id: "rogue", quantity: 2},
      {id: "skeleton", quantity: 2},
      {id: "skull_king", quantity: 2},
      {id: "slime", quantity: 2},
      {id: "spider", quantity: 2},
      {id: "wild_dog", quantity: 2},
      {id: "npc1", quantity: 6},
      {id: "castleGuard", quantity: 5},
      {id: "bitingFrost", quantity: 5},
      {id: "impenetrableFog", quantity: 5},
      {id: "clearWeather", quantity: 5},
  );
}