
const http = require("http");
const { Server } = require("socket.io");
// const cors = require("cors");
// app.use(cors());



exports.liveSockets = (app) => {
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] } })

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);
        socket.on("send_message", (data) => {
            socket.broadcast.emit("receive_message", data)
        });
    });

}
