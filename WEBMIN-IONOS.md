# Access Webmin on Your IONOS VPS

Webmin is a web-based admin panel for your Linux server (users, packages, firewall, files, etc.). This guide covers **installing** it and **accessing** it when your VPS is at **IONOS**.

---

## 1. Get Your Server IP (IONOS)

1. Log in to **IONOS**: [ionos.com](https://www.ionos.com) → **Login**
2. Open **Contracts** → **Products** → your **VPS**
3. Note the **IPv4 address** (e.g. `123.45.67.89`) — you’ll use it to connect and to open Webmin.

---

## 2. Connect to the VPS via SSH

From your computer (PowerShell, Terminal, or PuTTY):

```bash
ssh root@YOUR_SERVER_IP
```

Use the root password from the IONOS email (or the one you set). If you use a different user (e.g. `deploy`):

```bash
ssh deploy@YOUR_SERVER_IP
```

---

## 3. Install Webmin on Ubuntu 22.04

Run these on the server (over SSH). **Run each block separately**; do not paste several commands on one line (that can create wrong filenames like `webmin.listsudo`).

```bash
# Update and install dependencies (gpg2 needed for key dearmor)
sudo apt update
sudo apt install -y software-properties-common apt-transport-https wget gnupg2

# Remove any broken Webmin repo files from a previous attempt
sudo rm -f /etc/apt/trusted.gpg.d/webmin.gpg
sudo rm -f /etc/apt/sources.list.d/webmin.list
sudo rm -f /etc/apt/sources.list.d/webmin.listsudo

# Add Webmin repo key using keyring (works on Ubuntu 22.04)
sudo mkdir -p /usr/share/keyrings
wget -qO- https://download.webmin.com/jcameron-key.asc | gpg --dearmor | sudo tee /usr/share/keyrings/webmin-archive-keyring.gpg > /dev/null

# Add Webmin repo list with signed-by (run this as ONE line, nothing after it)
echo "deb [signed-by=/usr/share/keyrings/webmin-archive-keyring.gpg] https://download.webmin.com/download/repository sarge contrib" | sudo tee /etc/apt/sources.list.d/webmin.list

# Install Webmin
sudo apt update
sudo apt install -y webmin

# Ensure it’s running and enabled on boot
sudo systemctl enable webmin
sudo systemctl start webmin
sudo systemctl status webmin
```

If `status` shows **active (running)**, Webmin is listening (by default on **port 10000**).

---

## 4. Open Port 10000

Webmin uses **port 10000**. It must be open in:

- **Your server firewall (UFW)**  
- **IONOS firewall** (if you use it)

### On the server (UFW)

```bash
sudo ufw allow 10000/tcp
sudo ufw reload
sudo ufw status
```

You should see `10000/tcp` in the list.

### In IONOS (Cloud Panel / Firewall)

If your VPS is in the **IONOS Cloud** panel:

1. IONOS → **Cloud** (or **Server** / **VPS**) → select your VPS  
2. Look for **Firewall** or **Network** / **Security**  
3. Add an **inbound** rule:
   - **Port:** `10000`  
   - **Protocol:** TCP  
   - **Source:** your IP or `0.0.0.0/0` (any; less secure but simpler for testing)

If you don’t see a firewall in the IONOS UI, then only UFW on the server matters — make sure port 10000 is allowed there.

---

## 5. Access Webmin in the Browser

1. Open a browser.
2. Go to:

   ```text
   https://YOUR_SERVER_IP:10000
   ```

   Example: `https://123.45.67.89:10000`

3. You’ll get a certificate warning (Webmin’s default certificate). Choose **Advanced** → **Proceed to … (unsafe)** (wording depends on the browser). For production, you can add a proper certificate later in Webmin.

4. **Log in:**
   - **Username:** `root` (or another Linux user, e.g. `deploy`)
   - **Password:** the same password you use for SSH for that user

After login you’ll see the Webmin dashboard (files, users, software, etc.).

---

## 6. Optional: Use a Domain Instead of IP

If you have a domain (e.g. `panel.yourdomain.com`) pointing to your server IP:

1. In Webmin: **Webmin** → **Webmin Configuration** → **SSL** (or **Ports and Addresses**).
2. You can change the listening address or later install a proper SSL certificate so the browser doesn’t warn.

You still access it as:

```text
https://panel.yourdomain.com:10000
```

(unless you put a reverse proxy in front and change the port).

---

## Quick reference

| Step            | What to do |
|-----------------|------------|
| **Server IP**   | IONOS → Contracts → Products → VPS → IPv4 |
| **SSH**         | `ssh root@YOUR_SERVER_IP` (or your user) |
| **Install**     | Add Webmin repo → `apt install webmin` |
| **Firewall**    | On server: `ufw allow 10000/tcp`; in IONOS: allow TCP 10000 if a firewall exists |
| **Open Webmin** | Browser: `https://YOUR_SERVER_IP:10000` |
| **Login**       | Linux username (e.g. `root`) + SSH password |

---

## Troubleshooting

- **Can’t connect to https://IP:10000**  
  - Check UFW: `sudo ufw status`  
  - Check IONOS firewall (allow TCP 10000)  
  - Check Webmin: `sudo systemctl status webmin`

- **“Connection refused”**  
  - Webmin not running: `sudo systemctl start webmin`  
  - Port 10000 blocked by firewall (server or IONOS)

- **Wrong password**  
  - Use the same user/password you use for SSH (root or your admin user).

- **Only want to allow your home IP**  
  - In IONOS firewall, set source to your IP instead of `0.0.0.0/0`  
  - Or in UFW: `sudo ufw allow from YOUR_HOME_IP to any port 10000 proto tcp`

Once this works, you can manage users, packages, and services from the Webmin interface instead of only the command line.
