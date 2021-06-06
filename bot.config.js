module.exports = {
  apps : [{
    name: "DGGGaming Bot",
    script: "./bot.js",
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production",
    }
  }]
}