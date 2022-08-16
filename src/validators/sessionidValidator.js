function validator (sessionid)
{
    if(!sessionid) return;
    const match = sessionid.match(/^[0-9A-Fa-f-]{36}$/gim);
    if(!match || match.length == 0) return;
    return match[0].trim();
}

module.exports = validator;