const net = require("net");
const JsonSocket = require("json-socket");
const fs = require("fs");
const config = require("./config.json");
const isHome = require("./PythonInterface.js");

const registration_data = require("./registration.json");
var sensorId = null;
const uuid = "1ec3b2ba-a558-11e8-98d0-529269fb1459"
var isHomeBool = false

var socket = new JsonSocket(new net.Socket());
socket.connect(
  config.Server_Port,
  config.Server_Ip
);
const action = {
  registration: onRegistration,
  connection: onConnection
};

function onRegistration(data) {
  if (data.result === "success") {
    console.log("Registration success");
    config.id = data.id;
    fs.writeFile("./config.json", JSON.stringify(config), err => {
      if (err) return console.log(err);
      sensorId = data.id;
      console.log("The file was saved!");
    });
  }
}

function onConnection(data) {
  if (data.result === "success") {
    sensorId = config.id;
    console.log("Connection success");
  }
}

function unknowAction(data) {
  console.log("Unknown action => " + data);
}

function onSocketConnection() {
  if (config.id == null) {
    socket.sendMessage({
      action: "registration",
      data: registration_data
    });
  } else {
    socket.sendMessage({
      action: "connection",
      data: [config.id, registration_data]
    });
  }
}

sendUpdate = function(variable, value) {
  console.log("Send update to main server => " + variable + " = " + value);
  let jsonData = {
    action: "updateVariable",
    data: {
      sensor: sensorId,
      variable: variable,
      value: value
    }
  };
  socket.sendMessage(jsonData);
};

socket.on("connect", function() {
  onSocketConnection();

  socket.on("message", function(data) {
    if (data) {
      const func = action[data.action];
      func ? func(data) : unknowAction(data);
    }
  });

  socket.on("close", function() {
    console.log("Connection closed");
  });
});

socket.on("close", function(err) {
  console.log("Connection closed");
  isBulbConnected = false;
  if (!err) {
    socket.connect(
      config.Server_Port,
      config.Server_Ip
    );
  }
});

socket.on("error", err => {
  console.log("Error");
  socket.connect(
    config.Server_Port,
    config.Server_Ip
  );
});

setInterval(()=>{
  isHome().then(()=>{
    if(!isHomeBool){
      isHomeBool = true
      sendUpdate(uuid, "true")
    }
  }).catch(()=>{
    if(isHomeBool){
      isHomeBool = false
      sendUpdate(uuid, "false")
    }
  })
},7000)
