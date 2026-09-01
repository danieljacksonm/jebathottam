module.exports = {
  apps: [
    {
      name: "ebenezer-digital",
      cwd: "/home/dani/ebenezer-digital",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NODE_OPTIONS: "--max-old-space-size=384"
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      log_file: "/home/dani/logs/ebenezer-digital.log",
      error_file: "/home/dani/logs/ebenezer-digital-error.log",
      out_file: "/home/dani/logs/ebenezer-digital-out.log"
    },
    {
      name: "ministry-platform",
      cwd: "/home/dani/ministry-platform",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        NODE_OPTIONS: "--max-old-space-size=384"
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      log_file: "/home/dani/logs/ministry-platform.log",
      error_file: "/home/dani/logs/ministry-platform-error.log",
      out_file: "/home/dani/logs/ministry-platform-out.log"
    },
    {
      name: "sri-krishna-mobiles",
      cwd: "/home/dani/sri-krishna-mobiles",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
        NODE_OPTIONS: "--max-old-space-size=384"
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      log_file: "/home/dani/logs/sri-krishna-mobiles.log",
      error_file: "/home/dani/logs/sri-krishna-mobiles-error.log",
      out_file: "/home/dani/logs/sri-krishna-mobiles-out.log"
    },
    {
      name: "canaan-travel",
      cwd: "/home/dani/agntix-template",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
        NEXT_PUBLIC_SITE_URL: "https://canaantravelhub.com",
        NODE_OPTIONS: "--max-old-space-size=384"
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      log_file: "/home/dani/logs/canaan-travel.log",
      error_file: "/home/dani/logs/canaan-travel-error.log",
      out_file: "/home/dani/logs/canaan-travel-out.log"
    }
  ]
};
