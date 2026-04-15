module.exports = {
  apps: [
    {
      name: "toksovo-front",
      script: ".output/server/index.mjs",
      cwd: "/var/www/site-toksovo/toksovo-front",   // <- поменяй на реальный путь
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: 3001
      }
    }
  ]
}