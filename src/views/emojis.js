const emojis = [
    ["face-emotion", []],
    ["person-people", []],
    ["animals-nature", []],
    ["food-drink", []],
    ["activities-events", []],
    ["travel-places", []],
    ["objects", []],
    ["symbols", []],
    ["flags", []],
];

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
    const unicodeEmoji = await import('unicode-emoji');
    const omitWhere = { versionAbove: '12.0' };
    const allEmojis = unicodeEmoji.getEmojis(omitWhere);
    
    allEmojis.forEach(emoji =>
    {
        if(emoji.version < "13" && !emoji.keywords.some((e) => e === "outlined"))
        {
            const i = emojiMap[emoji.category];
            emojis[i][1].push(emoji);
        }
    });
}

loadEmojis ();

async function getEmojis (req, res)
{
    res.json(emojis);
}

module.exports = getEmojis;