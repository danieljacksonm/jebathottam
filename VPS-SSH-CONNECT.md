# How to Connect to Your VPS via SSH

If your SSH session disconnected (or you closed the terminal), connect again **from your own computer**.

---

## From Windows (PowerShell or Command Prompt)

1. Open **PowerShell** or **Command Prompt** (search for it in the Start menu).

2. Run (replace with your actual IP and user):

```bash
ssh deploy@YOUR_SERVER_IP
```

If you use the **root** user instead:

```bash
ssh root@YOUR_SERVER_IP
```

3. When asked, enter the password for that user (the one you use for the VPS).

4. You are now connected. Your prompt will look like `deploy@ubuntu:~$` or `root@ubuntu:~$`.

---

## From Mac or Linux (Terminal)

1. Open **Terminal**.

2. Run:

```bash
ssh deploy@YOUR_SERVER_IP
```

or, for root:

```bash
ssh root@YOUR_SERVER_IP
```

3. Enter the password when prompted.

---

## Replace YOUR_SERVER_IP

- Get the IP from **IONOS**: login → **Contracts** → **Products** → your **VPS** → note the **IPv4 address** (e.g. `123.45.67.89`).
- Then use: `ssh deploy@123.45.67.89` (or `root@123.45.67.89`).

---

## If You Use an SSH Key

```bash
ssh -i /path/to/your/private-key.pem deploy@YOUR_SERVER_IP
```

(Use the path IONOS or your host gave you for the key file.)

---

## Quick reference

| You want to…        | Do this |
|---------------------|--------|
| Connect as `deploy` | `ssh deploy@YOUR_SERVER_IP` |
| Connect as `root`   | `ssh root@YOUR_SERVER_IP` |
| Disconnect          | Type `exit` or press `Ctrl+D` |
| Reconnect after disconnect | Run the same `ssh` command again from your computer |

SSH does not “start” on the server — you always start it **from your PC** by running the `ssh` command. The server is already listening for SSH; you just open a new connection.
