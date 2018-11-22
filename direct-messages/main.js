const { createClass } = require("asteroid");
const WebSocket = require('ws');
const Random = require('meteor-random');
global.WebSocket = WebSocket;

const Asteroid = createClass();
// Connect to a Meteor backend
const asteroid = new Asteroid({
    endpoint: "ws://localhost:3000/websocket"
});

// // Use real-time collections
// asteroid.subscribe("tasksPublication");

// asteroid.ddp.on("added", ({collection, id, fields}) => {
//     console.log(`Element added to collection ${collection}`);
//     console.log(id);
//     console.log(fields);
// });

// Login
// asteroid.loginWithPassword({ username: "omasim0", password: "omasim0" });

const callMethod = (method = "", params = []) =>
    asteroid.apply(method, params)
        .then(result => {
            console.log("--------------------------");
            console.log(method);
            console.log("Success");
            console.log("result:", result);
        }).catch(error => {
            console.log("--------------------------");
            console.log(method);
            console.log("Error");
            console.error("error:", error);
        });

const createDMChat = (username) =>
    callMethod("createDirectMessage", [username]);

const getTestUsers = (numOfTestUsers = 0) => {
    const users = [];

    for (let i = 1; i <= numOfTestUsers; i++) {
        users.push(`omasim${i}`);
    }

    return users;
}

const sendMessage = (username = "", rid = "", message = "", timeTypingInMs = 0) => {
    callMethod("stream-notify-room", [
        `${rid}/typing`,
        username,
        true
    ]);
    setTimeout(() => {
        callMethod("stream-notify-room", [
            `${rid}/typing`,
            username,
            false
        ]);
        callMethod("sendMessage", [{
            _id: Random.id(),
            rid,
            msg: message
        }]);
    },
        timeTypingInMs);
}

const main = () => {
    callMethod("login", [
        {
            user: { username: "omasim0" },
            password: {
                digest: "e3d8e8bf19e533778272e0abda6a20eb0cd9da0aded90a8febccf0cd49d561a6",
                algorithm: "sha-256"
            }
        }
    ]);

    createDMChat("omasim2");
    sendMessage("omasim0", "afeEb45G3WxRd9Hnwpxcthn6hYKTsqRXvk", "from load testing", 4000)
}

main();