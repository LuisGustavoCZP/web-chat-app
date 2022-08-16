function validator (username)
{
    if(!username) return;
    const match = username.match(/(\w{1,}[ ])*\w{1,}/gi);
    if(!match || match.length == 0) return;
    return match[0].trim();
}

module.exports = validator;