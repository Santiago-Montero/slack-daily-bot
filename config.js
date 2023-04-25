require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 3000,
    SIGNING_SECRET: process.env.SIGNING_SECRET,
    TOKEN: process.env.TOKEN,
    SOCKET_MODE: process.env.SOCKET_MODE,
    APP_TOKEN: process.env.APP_TOKEN,
}