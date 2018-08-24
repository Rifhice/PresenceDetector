const net = require("net");
const JsonSocket = require("json-socket");
const fs = require("fs");
const config = require("./config.json");

const registration_data = require("./registration.json");
var sensorId = null;

var socket = new JsonSocket(new net.Socket());
socket.connect(
  1336,
  "192.168.0.24"
);

const action = {
  registration: onRegistration,
  connection: onConnection
};

function onRegistration(data) {
  if (data.result === "success") {
    console.log("Registration success");
    fs.writeFile("./config.json", JSON.stringify({ id: data.id }), err => {
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
  console.log("Unknown action");
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

sendUpdate = function(data) {
  console.log("Send update to main server => " + data);
  const variable = ("" + data).split("/#/")[0];
  const value = ("" + data).split("/#/")[1];
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
      1336,
      "192.168.0.24"
    );
  }
});

socket.on("error", err => {
  console.log("Error");
  socket.connect(
    1336,
    "192.168.0.24"
  );
});

module.exports = { sendUpdate };
