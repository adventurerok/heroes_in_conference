-- Insert default achievements and content groups into database

DELETE FROM achieved;
DELETE FROM achievements;
INSERT INTO achievements (name, description, reward) VALUES 
    ("Welcome to my mine", "Collect ALL the ore", 11),
    ("Ocean man", "Catch ALL the fish", 101),
    ("Mourning wood", "Kill ALL the tree", 131),
    ("Yeti slayer", "Sneak past the yeti", 151),
    ("Yak whisperer", "Tip the yak over", 181),
    ("TNT I'm Zygomite", "Calm down the Zygomite", 191),
    ("Crab rave", "Tap the crab just right", 313),
    ("King of the Slimes", "Defeat the king slime", 353),
    ("Mr. smartypants", "Solve ALL the puzzles", 373);

DELETE FROM content;
INSERT INTO content (name, enabled) VALUES
    ("resource", 1),
    ("challenge", 1);
