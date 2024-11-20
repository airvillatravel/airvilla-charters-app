module.exports = {
  apps: [
    {
      name: "next-app",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/airvilla-charter-app/client",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
