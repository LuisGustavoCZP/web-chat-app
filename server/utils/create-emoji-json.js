const fs = require('fs');

const emojiMap = {
    "face-emotion":         0,
    "person-people":        1,
    "animals-nature":       2,
    "food-drink":           3,
    "activities-events":    4,
    "travel-places":        5,
    "objects":              6,
    "symbols":              7,
    "flags":                8,
};

async function loadEmojis ()
{
    const emojis = {
        "face-emotion" : [],
        "person-people": [],
        "animals-nature": [],
        "food-drink": [],
        "activities-events": [],
        "travel-places": [],
        "objects": [],
        "symbols": [],
        "flags": [],
    };

    const unicodeEmoji = await import('unicode-emoji');
    const omitWhere = { versionAbove: '12.0' };
    const allEmojis = unicodeEmoji.getEmojis(omitWhere);
    
    allEmojis.forEach(emoji =>
    {
        if(emoji.version < "13" && !emoji.keywords.some((e) => e === "outlined"))
        {
            //const i = emojiMap[];
            emojis[emoji.category].push(emoji);
        }
    });

    fs.writeFileSync("./data/emojis.json", JSON.stringify(emojis), {encoding:"utf8"});
}

loadEmojis ();

