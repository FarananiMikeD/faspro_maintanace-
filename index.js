require("dotenv").config();

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});


process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    db.close(() => { process.exit(1) });
});

const app = require('./app');
const { liveSockets } = require("./liveSockets")
liveSockets(app)

const port = process.env.PORT || 5000
app.listen(port, () => { console.log(`listening on port ${port}...`) })