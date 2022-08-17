const fs = require('fs');

const scriptFiles = {}

function loadScript (name)
{
    if(true || !scriptFiles[name]) 
    {
        const filePath = `./public/scripts/${name}`;
        if(!fs.existsSync(filePath)) scriptFiles[name] = '';
        else scriptFiles[name] = fs.readFileSync(filePath);
    }
    return scriptFiles[name];
}

function sendScript (req, res) 
{
    const fileName = req.params["script"];
    if(!fileName) {res.end(); return;}
    const match = fileName.match(/^((\w{1,}-){0,}\w{1,})(\.js)$/gim);
    if(!match) {res.end(); return;}
    const scriptFile = loadScript(fileName);
    if(!scriptFile) { res.writeHead(404); res.end(); return; }

    res.set('Content-Type', 'text/javascript');
    res.write(scriptFile);
    res.end();
}

module.exports = {
    sendScript
}