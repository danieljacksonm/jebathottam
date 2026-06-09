#!/bin/bash
# VPS Setup Script for All 3 Sites
# Run this on your VPS as user 'dani'

echo "🚀 Setting up VPS for all 3 sites..."

# Create directories
mkdir -p /home/dani/{ebenezer-digital,ministry-platform,sri-krishna-mobiles,logs}

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Create ecosystem file
cat > /home/dani/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: "ebenezer-digital",
      cwd: "/home/dani/ebenezer-digital",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000
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
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3001
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
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3002
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      log_file: "/home/dani/logs/sri-krishna-mobiles.log",
      error_file: "/home/dani/logs/sri-krishna-mobiles-error.log",
      out_file: "/home/dani/logs/sri-krishna-mobiles-out.log"
    }
  ]
};
EOF

echo "✅ Directories and ecosystem config created!"
echo ""
echo "Next steps:"
echo "1. Copy ecosystem.config.js to /home/dani/"
echo "2. Clone your repos into each directory"
echo "3. Run: pm2 start ecosystem.config.js"
echo "4. Run: pm2 save && pm2 startup"
