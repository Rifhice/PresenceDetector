var net = require("net");
const spawn = require("child_process").spawn;

isHome = function(){
    return new Promise((resolve, reject)=>{
        const pythonProcess = spawn("python", [
            "./PresenceDetectorServer/isHome.py"
        ]);
        
        pythonProcess.stdout.on("data", data => {
            console.log(`child stdout => ${data}`);
            data = data.toString()
            if (data == "True\n") {
                resolve()
            } else {
                reject()
            }
        });
    })
}

module.exports = isHome
