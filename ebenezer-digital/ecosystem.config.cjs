/** PM2 ecosystem — copy to VPS or run: pm2 start ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: "ebenezer-digital",
      cwd: "/home/dani/ebenezer-digital",
      script: "npm",
      args: "start",
      node_args: "--max-old-space-size=768",
      max_memory_restart: "900M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "yegova-api",
      cwd: "/home/dani/yegova-saas",
      script: "npm",
      args: "run start:prod -w @yegova/api",
      max_memory_restart: "512M",
    },
    {
      name: "yegova-web",
      cwd: "/home/dani/yegova-saas",
      script: "npm",
      args: "run start -w @yegova/web -- -p 3001",
      max_memory_restart: "768M",
    },
  ],
};
