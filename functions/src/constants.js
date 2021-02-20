module.exports.region = 'europe-west2';

// A list of all existing permissions - keep in sync with UI
// src/constants.js
const PERMISSIONS = {
    CREATE_PLAYER: 'CREATE_PLAYER',
    DELETE_PLAYER: 'DELETE_PLAYER',
    CREATE_TEAM: 'CREATE_TEAM',
    DELETE_TEAM: 'DELETE_TEAM',
    SUBMIT_RESULT: 'SUBMIT_RESULT',
    TRIGGER_WEEK: 'TRIGGER_WEEK',
    EDIT_PLAYER: 'EDIT_PLAYER',
    MANAGE_USERS: 'MANAGE_USERS',
    APPROVE_HIGHLIGHTS: 'APPROVE_HIGHLIGHTS',
    ROLL_OVER_YEAR: 'ROLL_OVER_YEAR',
    MANAGE_SUBS: 'MANAGE_SUBS',
    TOGGLE_PAGES: 'TOGGLE_PAGES'
};

module.exports.PERMISSIONS = PERMISSIONS;

// A list of all existing roles - keep in sync with UI
module.exports.ROLES = {
    ADMIN: 'ADMIN',
    MAINTAINER: 'MAINTAINER',
    HIGHLIGHT_APPROVER: 'HIGHLIGHT_APPROVER',
    TREASURER: 'TREASURER'
};

// This dictates what each role is able to do
module.exports.ROLE_PERMISSIONS = {
    ADMIN: [
        PERMISSIONS.MANAGE_USERS, // Admin only
        PERMISSIONS.ROLL_OVER_YEAR, // Admin only
        PERMISSIONS.TOGGLE_PAGES, // Admin only
        PERMISSIONS.CREATE_PLAYER,
        PERMISSIONS.DELETE_PLAYER,
        PERMISSIONS.CREATE_TEAM,
        PERMISSIONS.DELETE_TEAM,
        PERMISSIONS.SUBMIT_RESULT,
        PERMISSIONS.TRIGGER_WEEK,
        PERMISSIONS.EDIT_PLAYER,
        PERMISSIONS.APPROVE_HIGHLIGHTS,
        PERMISSIONS.MANAGE_SUBS],
    MAINTAINER: [
        PERMISSIONS.CREATE_PLAYER,
        PERMISSIONS.DELETE_PLAYER,
        PERMISSIONS.CREATE_TEAM,
        PERMISSIONS.DELETE_TEAM,
        PERMISSIONS.SUBMIT_RESULT,
        PERMISSIONS.TRIGGER_WEEK,
        PERMISSIONS.EDIT_PLAYER,
        PERMISSIONS.APPROVE_HIGHLIGHTS],
    HIGHLIGHT_APPROVER: [
        PERMISSIONS.APPROVE_HIGHLIGHTS
    ],
    TREASURER: [
        PERMISSIONS.MANAGE_SUBS
    ]
};

module.exports.ROLES_LOOKUP = {
    5: {
        bad: 2,
        good: 3
    },
    6: {
        bad: 2,
        good: 4
    },
    7: {
        bad: 3,
        good: 4
    },
    8: {
        bad: 3,
        good: 5
    },
    9: {
        bad: 4,
        good: 5
    },
    10: {
        bad: 4,
        good: 6
    }
};

module.exports.avalonRoles = {
    Merlin: {
        isGood: true,
        name: 'Merlin',
        isSpecial: true
    },
    Percival: {
        isGood: true,
        name: 'Percival',
        isSpecial: true
    },
    Morgana: {
        isGood: false,
        name: 'Morgana',
        isSpecial: true
    },
    Mordred: {
        isGood: false,
        name: 'Mordred',
        isSpecial: true
    },
    Oberon: {
        isGood: false,
        name: 'Oberon',
        isSpecial: true
    },
    RegularGood: {
        isGood: true,
        name: 'RegularGood',
        isSpecial: false
    },
    RegularBad: {
        isGood: false,
        name: 'RegularBad',
        isSpecial: false
    }
};

module.exports.hitlerRoles = {
    Fascist: 'Fascist',
    Hitler: 'Hitler',
    Liberal: 'Liberal'
};

const fivePlayerGame = {
    1: 2,
    2: 3,
    3: 2,
    4: 3,
    5: 3
};

const sixPlayerGame = {
    1: 2,
    2: 3,
    3: 4,
    4: 3,
    5: 4
};

const sevenPlayerGame = {
    1: 2,
    2: 3,
    3: 3,
    4: 4,
    5: 4
};

const eightPlayerGame = {
    1: 3,
    2: 4,
    3: 4,
    4: 5,
    5: 5
};

const ninePlayerGame = {
    1: 3,
    2: 4,
    3: 4,
    4: 5,
    5: 5
};

const tenPlayerGame = {
    1: 3,
    2: 4,
    3: 4,
    4: 5,
    5: 5
};

module.exports.avalonRounds = {
    5: fivePlayerGame,
    6: sixPlayerGame,
    7: sevenPlayerGame,
    8: eightPlayerGame,
    9: ninePlayerGame,
    10: tenPlayerGame
};

module.exports.avalonGameStatuses = {
    Finished: 'Finished',
    GuessingMerlin: 'GuessingMerlin',
    Nominating: 'Nominating',
    Questing: 'Questing',
    Voting: 'Voting'
};

module.exports.hitlerGameStatuses = {
    ChancellorDecidingCards: 'ChancellorDecidingCards',
    Finished: 'Finished',
    Nominating: 'Nominating',
    PresidentDecidingCards: 'PresidentDecidingCards',
    Investigate: 'Investigate',
    Kill: 'Kill',
    Peek: 'Peek',
    Transfer: 'Transfer',
    Voting: 'Voting',
    TemporaryPresident: 'TemporaryPresident'
};

module.exports.whoInHatGameStatuses = {
    MakingTeams: 'MakingTeams',
    PrepareToGuess: 'PrepareToGuess',
    Guessing: 'Guessing',
    RoundSummary: 'RoundSummary',
    ScoreCapReached: 'ScoreCapReached',
    NoCardsLeft: 'NoCardsLeft'
};

module.exports.articulateGameStatuses = {
    MakingTeams: 'MakingTeams',
    PrepareToGuess: 'PrepareToGuess',
    Guessing: 'Guessing',
    RoundSummary: 'RoundSummary',
    GameFinished: 'GameFinished'
};

module.exports.articulateCategories = {
    Action: 'Action',
    Nature: 'Nature',
    Person: 'Person',
    Random: 'Random',
    Spade: 'Spade',
    World: 'World',
    Object: 'Object'
};

module.exports.historyTypes = {
    Vote: 'Vote',
    Quest: 'Quest',
    TopCardFlipped: 'TopCardFlipped',
    PlayChancellorCard: 'PlayChancellorCard',
    Investigate: 'Investigate',
    TransferPresident: 'TransferPresident',
    Kill: 'Kill',
    Veto: 'Veto',
    Peek: 'Peek'
};

module.exports.gameModes = {
    Avalon: 'Avalon',
    Hitler: 'Hitler',
    Othello: 'Othello',
    WhosInTheHat: 'Who\'s in the Hat'
};

const defaultTeamNames = {
    Collywobble: 'Collywobble Clowns',
    Electric: 'Electric Boogaloo',
    TeamZero: 'Noxus',
    UndefinedName: 'Ionia',
    LastTeam: 'Shurima'
};

module.exports.defaultTeamNames = defaultTeamNames;

module.exports.initialTeams = [
    {
        name: defaultTeamNames.Collywobble,
        members: [],
        score: 0,
        previousExplainer: null
    },
    {
        name: defaultTeamNames.Electric,
        members: [],
        score: 0,
        previousExplainer: null
    }
];

module.exports.whoInHatSkipping = {
    Unlimited: 'Unlimited',
    OneSkip: 'One Skip',
    NoSkipping: 'No Skipping'
};

module.exports.articulateSkipping = {
    Unlimited: 'Unlimited',
    OneSkip: 'One Skip',
    NoSkipping: 'No Skipping'
};

module.exports.gameModes = {
    Articulate: 'Articulate',
    Avalon: 'Avalon',
    Hitler: 'Hitler',
    WhosInTheHat: 'Who\'s in the Hat?'
};

module.exports.articulateMaxScore = 15;

const othelloAIDifficulties = {
    Easy: 'Easy',
    Medium: 'Medium',
    Hard: 'Hard'
};

module.exports.othelloAIDifficulties = othelloAIDifficulties;

module.exports.othelloDifficulties = [
    othelloAIDifficulties.Easy,
    othelloAIDifficulties.Medium,
    othelloAIDifficulties.Hard
];

module.exports.othelloPlayerTypes = {
    Human: 'Human',
    Computer: 'Computer'
};

module.exports.statsId = 'game-stats-id';

module.exports.articulateAction = ['Typing', 'Breaking', 'Fleecing', 'Approaching', 'Exploding', 'Dousing', 'Congesting', 'Moaning', 'Resting', 'Colliding', 'Continuing', 'Buttoning', 'Frying', 'Bouncing', 'Congregating', 'Boating', 'Inoculating', 'Gambling', 'Beginning', 'Grinning', 'Hooting', 'Hushing', 'Glistening', 'Cheering', 'Lathering', 'Inserting', 'Grabbing', 'Smoking', 'Sizzling', 'Pushing', 'Bombing', 'Engraving', 'Struggling', 'Earning', 'Hopping', 'Boasting', 'Waiiting', 'Dribbling', 'Fanning', 'Labelling', 'Reeling', 'Balancing', 'Conquering', 'Absorbing', 'Adopting', 'Huddling', 'Excluding', 'Intensifying', 'Twisting', 'Spying', 'Stroking', 'Bleeding', 'Chopping', 'Assisting', 'Judging', 'Calculating', 'Enduring', 'Drumming', 'Dozing', 'Choking', 'Jarring', 'Yodelling', 'Jilting', 'Connecting', 'Confiding', 'Closing', 'Aching', 'Cooling', 'Breathing', 'Conducting', 'Leasing', 'Prancing', 'Drooling', 'Steaming', 'Begrudging', 'Coatting', 'Conceiving', 'Stealing', 'Roaming', 'Chatting', 'Advocating', 'Agreeing', 'Gleaming', 'Scanning', 'Winking', 'Crossing', 'Jesting', 'Repeating', 'Humming', 'Twitching', 'Galavanting', 'Begging', 'Swindling', 'Correcting', 'Softening', 'Vanishing', 'Constraining', 'Signing', 'Nibbling', 'Bugging', 'Carving', 'Wheezing'];
module.exports.articulateNature = ['Snail', 'Ox', 'Courgette', 'Jaguar', 'Osprey', 'Unicom', 'Herring', 'Jasmine', 'Elk', 'Canary', 'Badger', 'Sow', 'Puffin', 'Bird of Paradlise', 'House Martin', 'Parrot', 'Sweet Pea', 'Emu', 'Goldfish', 'Raspberry', 'Parsley', 'Orchid', 'Forgetmenot', 'Roadrunner', 'Roach', 'Warthog', 'Tick', 'Midge', 'Rodent', 'Finch', 'Beetroot', 'Tuna', 'Guinea Fowl', 'Praying Mantis', 'Bream', 'Deciduous Tree', 'Reindeer', 'Moth', 'Pecan', 'Angel Fish', 'Whelk', 'Bush Baby', 'Algae', 'Aubergine', 'Dromedary', 'Dusk', 'Virus', 'Mammall', 'Bamboo Shoot', 'Sloth', 'Penguin', 'Pear', 'Radish', 'Bonsai Tree', 'Goose', 'Piranha', 'Swordfish', 'Sphinx', 'Mule', 'Dry Rot', 'Royal Jelly', 'Caterpillar', 'Mussel', 'Cuttlefish', 'Cattle', 'Zebra', 'Snake', 'Tomato', 'Meadow', 'Avocado', 'Leaf', 'Dab', 'Pea', 'Hedge', 'Bedbug', 'Minnow', 'Mackerel', 'Beech Tree', 'Heather', 'Almond', 'Starfish', 'Pansy', 'Flounder', 'Robin', 'Insect', 'Falcon', 'Squid', 'Flea', 'Orangutan', 'Mouse', 'Walnut', 'Flatfish', 'Seaweed', 'Crow', 'Newt', 'Pheasant', 'Water Lily', 'Hyena', 'Ash', 'Orange', 'Mango', 'Cricket'];
module.exports.articulateObject = ['Ledge', 'Camera', 'Hair Dryer', 'Microwave', 'Skeleton', 'Bow Tie', 'Syringe', 'Snare', 'Coin', 'Granule', 'Ladle', 'Tractor', 'Sarl', 'Suspension Bridge', 'Paper Clip', 'Black Belt', 'Serviette', 'Signal', 'Signpost', 'Microphone', 'Antler', 'Taiil', 'Water Tower', 'Mask', 'Diamond', 'Rhombus', 'Dental Floss', 'Hamburger', 'Baittleship', 'Kennel', 'Dustbin', 'Mobile', 'Loaf', 'Shopping Bag', 'Bullet', 'Kilt', 'Pyramid', 'Net', 'Haggis', 'Invoice', 'Grate', 'Medicine Bottle', 'Basebaill Cap', 'Ragdoll', 'Pitch', 'Ruby', 'Fountain', 'DVD Player', 'Yoyo', 'Ski Lift', 'Warship', 'Coal', 'Flint', 'Rung', 'Nursery', 'Licence', 'Rainbow', 'Satellite Dish', 'Blackboard', 'Account', 'Pommel Horse', 'Aguarium', 'Hamstring', 'Test Tube', 'Snowflake', 'Doorbell', 'Candlestick', 'Sleigh', 'Golf Tee', 'Chain', 'Log', 'Bunsen Burmner', 'Boulder', 'Twig', 'Scoreboard', 'Sun Lamp', 'Label', 'Bonfire', 'Wishing Well', 'Emerald', 'Reserve Parachute', 'Portraiit', 'Sock', 'Shop', 'Calendar', 'Plank of Wood', 'Cable', 'Accessory', 'Ice Lolly', 'Bill', 'Pistol', 'Violin', 'Bongo Drum', 'Rubber Ring', 'Garden Shed', 'Hob', 'Headphones', 'Beard', 'Tooth Pick', 'Waistcoat', 'Igloo', 'Skateboard'];
module.exports.articulatePeople = ['Keith Lemon', 'Thor', 'Brothers Grimm', 'Casanova', 'Mussolini', 'Catherine Tate', 'Margaret Thatcher', 'Vidal Sassoon', 'Lee Evans', 'Vernon Kaye', 'Santa Claus', 'Napolean Bonaparte', 'Zac Efron', 'Christopher Robin', 'Dick Francis', 'Sergeant Pepper', 'Queen Elizabeth II', 'T S Elliot', 'Heston Blumenthal', 'David Tennant', 'JeanLue Picard', 'Brian Cox', 'Naomi Campbell', 'George Lucas', 'Marilyn Monroe', 'Michael Jordan', 'Harry Potter', 'Garibaldli', 'Achilles', 'Ed Miliband', 'Kanye West', 'Gerard Butler', 'Lionel Messi', 'Olly Murs', 'Gordon Ramsey', 'Louis Pasteur', 'The Mad Hatter', 'The Teletubbies', 'Michel Roux', 'Keira Knightley', 'John Torode', 'Sir Walter Raleigh', 'Emmeline Pankhurst', 'Denise Welch', 'Rasputin', 'Spiderman', 'Tarzan', 'Harry Kane', 'Judas Iscariot', 'Denise Van Outen', 'Nicolas Cage', 'Zeus', 'Miranda Hart', 'Sebastian Coe', 'Sir Edmund Hillary', 'Serena Williams', 'Helen Mirren', 'Tony Blair', 'Karl Marx', 'Steven Gerrard', 'Joan of Arc', 'Noddy', 'Diego Maradona', 'Hillary Clinfton', 'Ludwig Van Beethoven', 'Cameron Diaz', 'Robbie Coltrane', 'Martin Clunes', 'Genghis Khan', 'Alan Carr', 'Ermnest Hemingway', 'Joan Collins', 'Prince William', 'Louis Spence', 'J R R Tolkien', 'The Phantom', 'Stephen Hawking', 'The Man in the Iron Mask', 'Muhammad Ali', 'Russell Crowe', 'Joanna Lumley', 'Michael Bubl', 'Dennis the Menace', 'Bob Geldof', 'Shakira', 'David Copperfield', 'Count Dracula', 'Jude Law', 'Aguaman', 'Tweedle Dee', 'Adolf Hitler', 'Archangel Gabrie', 'Peter and the Wolf', 'Horrid Henry', 'Michelle Obama', 'Cinderella', 'Isaac Newton', 'Freddie Mercury', 'Hugh Bonneville', 'Elon Musk', 'The Pope', 'Johann Sebastian Bach'];
module.exports.articulateRandom = ['Fortnight', 'Accuracy', 'Abnormal', 'Committee', 'Heir', 'Sanctuary', 'Sign Language', 'Beyond', 'Claustrophobia', 'Bible', 'Epidemic', 'Punt', 'Zinc', 'Innocent', 'Blue Sky Thinking', 'Pygmy', 'Incomprehensible', 'Abroad', 'Patent', 'Errand', 'The Queens English', 'eBay', 'Escalatfor', 'Baillot', 'Expression', 'Baked Beans', 'Artery', 'The Gunpowder Plot', 'Credit', 'Suppressing', 'Suction', 'Psychic', 'Redality Televsion', 'Mankini', 'Anorexia', 'Insoluble', 'Lens', 'Chapter', 'Hocus Pocus', 'Limerick', 'Attraction', 'Thunder Clap', 'Eccentric', 'Gin', 'Acrobatic', 'Bunch', 'Game Show', 'Saturation', 'Despite', 'Philosophy', 'Fat', 'Waste', 'Catastrophe', 'Tom  Jerry', 'Netflix', 'Genius', 'Hermit', 'Economy', 'Archipelago', 'Action Replay', 'Absurd', 'Industry', 'Beeline', 'Triple', 'Household', 'Cosmetic', 'Inhospitable', 'Whisky', 'Frame', 'Capsize', 'Barren', 'Congregation', 'Winter', 'Catwailk', 'Horizontal', 'Blasphemy', 'Insomnia', 'Hypnosis', 'Costly', 'Gruesome', 'Beauty Queen', 'Flamenco', 'Assassination', 'Hogmanay', 'Tomato Ketchup', 'Injunction', 'Platform Shoes', 'Clairvoyant', 'Couple', 'Benchmark', 'Summer', 'Health', 'Zest', 'Chemistry', 'Absence', 'Full Monty', 'Vain', 'Cause', 'YouTube', 'Binge', 'The Statue of Liberty', 'Presentation'];
module.exports.articulateWorld = ['The Dead Sea', 'Helsinki', 'Mongolia', 'Nicaragua', 'Cambridge', 'Pluto', 'Norway', 'Liberia', 'Queens', 'San Francisco', 'The Thames', 'Buckingham Palace', 'The Indian Ocean', 'Augusta', 'Rome', 'The Dolomites', 'Canberra', 'Algeria', 'The O2', 'Dubai', 'Canada', 'Sweden', 'Oman', 'The Isle of Man', 'The Vatican', 'The Lebanon', 'London Zoo', 'Crimea', 'Switzerland', 'Cologne', 'Denmark', 'Brussels', 'The Taj Mahal', 'Grimsby', 'Pearl Harbour', 'The North Pole', 'Amhem', 'Burnley', 'The Berlin Waill', 'Victoria Falls', 'Lisbon', 'Oxford', 'Majorcea', 'Wales', 'The Leaning Tower of Pisa', 'Normandy', 'Gibraltar', 'The Sceofttish Highlands', 'Covent Garden', 'Vienna', 'The Nile', 'Chester', 'Florida', 'The Tate Gallery', 'Biarritz', 'The English Channel', 'Auckland', 'Savile Row', 'The Empire State Building', 'Outer Space', 'Uganda', 'Los Angeles', 'St Tropez', 'Liechtenstein', 'St Lucia', 'Afghanistan', 'Colorado', 'Poland', 'Hyde Park', 'Madam Tussauds', 'Budapest', 'Atlantis', 'The Grenadines', 'China', 'The Galapagos Islands', 'The Pennines', 'Toytown', 'Red Square', 'Zcire', 'Mecca', 'Chicago', 'The Greek Islands', 'The Saraha Desert', 'Baili', 'The Gaza Strip', 'Fort William', 'Lake Victoria', 'The Rovyal Mile', 'The Red Sea', 'The Caribbean', 'Beirut', 'Mount Everest', 'Jerusalem', 'Death Valley', 'Leicester', 'Great Britain', 'The Zambezi', 'Mumbai', 'Valhalla', 'Coventry', 'Chelsea', 'The Caspian Sea'];

module.exports.whoInHatNames = ['Superman', 'Mickey Mouse', 'Bugs Bunny', 'Han Solo', 'Peter Pan', 'Indiana Jones', 'Homer Simpson', 'King Kong', 'The Joker', 'Mary Poppins', 'Willy Wonka', 'Scooby-Doo', 'Pikachu', 'Optimus Prime', 'Sonic the Hedgehog', 'Edna Mode', 'Maximus', 'Inspector Clouseau', 'Gromit', 'Primrose Everdeen', 'Trump', 'Cristiano Ronaldo', 'Taylor Swift', 'Bill Gates', 'Nelson Mandela', 'Elvis', 'Greta Thunburg', 'Cleopatra', 'Anne Frank', 'Shakira', 'Coco', 'Time Berners Lee', 'Brad Pitt', 'David Attenborough', 'The Monopoly Man', 'Tinkerbell', 'Boris Johnson', 'Micheal Phelps', 'Pablo Picasso', 'Pele', 'Zeus', 'Loki', 'Roger Federer', 'Will Smith', 'Winston Churchill', 'George Clooney', 'Angelina Jolie', 'Robert de Niro', 'Morgan Freeman', 'Bowser', 'Matt Damon', 'Gary Linekar', 'Alan Shearer', 'Ricky Gervais', 'Jim Carey', 'Dobby', 'George Weasley', 'Thomas Edison', 'Cinderella', 'Rickon Stark', 'Helen of Troy', 'Simon Cowell', 'Sacha Baron Cohen', 'Prince Harry', 'Dwayne Johnson', 'Moana', 'Rihanna', 'Alan Turing', 'Roald Dahl', 'Tom Brady', 'Anya Taylor-Joy', 'Pedro Pascal', 'Grogu', 'Gal Gadot', 'Wall-E', 'Jane Austen', 'Zelda', 'Andy Murray', 'Beethover', 'Hans Zimmer', 'Catherine of Aragon', 'Malfoy', 'Jessica Ennis-Hill', 'Steve Redgrave', 'Tiger Woods', 'Usain Bolt'];
