var net = require("net");
const ServerInterface = require("./ServerInterface");
const spawn = require("child_process").spawn;

var server = net.createServer();

server.on("connection", function(socket) {
  console.log("New python sensor connected !");
  socket.on("data", function(data) {
    ServerInterface.sendUpdate(data);
  });

  socket.on("end", function() {
    console.log("Python sensor disconnected !");
  });
});

server.listen(1110, "127.0.0.1");
const pythonProcess = spawn("python", ["./PresenceDetectorServer/presenceDetector.py"]);
