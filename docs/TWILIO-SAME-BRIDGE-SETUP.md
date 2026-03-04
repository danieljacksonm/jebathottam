# Twilio + Same Bridge (Phone + Internet Users)

This guide starts with **Twilio** and keeps **dial-in (phone) and internet (browser/Jitsi) users on the same conference bridge** — everyone hears and is heard in one room.

---

## Architecture: One Room for Everyone

```
┌─────────────────┐     ┌──────────────────────────────────────────────────┐
│  Phone caller   │────▶│  Twilio (your number)                             │
└─────────────────┘     │  Elastic SIP Trunk → sends call to your VPS       │
                        └─────────────────────────┬────────────────────────┘
                                                   │ SIP
                        ┌─────────────────────────▼────────────────────────┐
                        │  VPS (Ubuntu 22.04, 4 vCPU, 8 GB RAM, 240 GB NVMe) │
                        │  ┌─────────────┐    ┌─────────────┐               │
                        │  │ Asterisk or │───▶│   Jigasi    │               │
                        │  │ FreeSWITCH  │    │ (SIP→Jitsi) │               │
                        │  │ (receive    │    └──────┬──────┘               │
                        │  │  Twilio)    │           │                      │
                        │  └─────────────┘           │ joins same room       │
                        │                            ▼                      │
                        │  ┌─────────────────────────────────────────────┐ │
                        │  │  Jitsi Meet (one room, one PIN)              │ │
                        │  │  ← browser users (meet.yourdomain.com/room)  │ │
                        │  │  ← phone users (via Jigasi)                  │ │
                        │  └─────────────────────────────────────────────┘ │
                        └──────────────────────────────────────────────────┘
┌─────────────────┐
│  Browser user   │────▶  Same Jitsi room (audio/video)
└─────────────────┘
```

- **Phone:** Call your Twilio number → Twilio sends SIP to your VPS → Asterisk/FreeSWITCH answers → calls Jigasi with the conference room name → Jigasi joins that Jitsi room and bridges the call.
- **Browser:** User opens your Jitsi URL (e.g. `meet.yourdomain.com/YourRoom123`) and joins the **same** room.
- **Result:** One bridge; everyone in the same room.

---

## VPS Details (use this server for everything)

| Item | Value |
|------|--------|
| **vCores** | 4 |
| **RAM** | 8 GB |
| **Storage** | 240 GB NVMe SSD |
| **Datacenter** | United States |
| **OS** | Ubuntu 22.04 |

See **`docs/SANDBOX-SIP-AND-VPS.md`** for firewall (5060 UDP/TCP, RTP range), checklist, and optional sandbox providers.

---

## Part 1: Twilio Setup (do this first)

### 1.1 Create Twilio account

1. Sign up: [twilio.com/try-twilio](https://www.twilio.com/try-twilio).
2. Verify your phone number (trial can only call verified numbers).
3. Note: Trial = 1 SIP trunk, 1 number, 4 concurrent calls.

### 1.2 Get a phone number

1. In Console: **Phone Numbers → Manage → Buy a number** (or use the free trial number).
2. Note the number in E.164 (e.g. `+12025551234`). You’ll put this in Admin → Settings as the dial-in number.

### 1.3 Create Elastic SIP Trunk and send calls to your VPS

1. **Elastic SIP Trunking → Trunks → Create new Trunk.**
2. Name it (e.g. `Ministry Bridge`).
3. **Termination** (where Twilio sends inbound calls to your system):
   - **Termination SIP URI:** `sip:YOUR_VPS_PUBLIC_IP:5060` (or `sip:jitsi.yourdomain.com:5060` if you use a hostname).
   - Create a **Termination Credential List** if Twilio asks for auth; otherwise IP-based auth may be used (Twilio docs vary by region).
4. **Origination** (where your system sends outbound SIP to Twilio):
   - Add your VPS public IP so Twilio accepts SIP from you.
5. **Link the number** to this trunk: Phone Numbers → assign your number to the new trunk.

### 1.4 Twilio trial limits

- Only **verified** caller IDs can be called (for outbound). For **inbound** (someone dials your number), anyone can call.
- 4 concurrent calls on trial — enough to test “same bridge” with a few phone + browser users.

---

## Part 2: VPS – Same bridge (Jitsi + Jigasi + Asterisk)

All three run on the **same** VPS so phone and browser share one Jitsi room.

### 2.1 Install order

1. **Jitsi Meet** (self-hosted) – so your app can use `https://meet.yourdomain.com/RoomName` instead of meet.jit.si.
2. **Jigasi** – SIP gateway that joins a Jitsi room when Asterisk “calls” it; bridges the phone leg into that room.
3. **Asterisk** – receives SIP from Twilio, answers the call, then dials Jigasi (with the room name/PIN) so the caller is dropped into the correct Jitsi room.

### 2.2 Install Jitsi Meet (Ubuntu 22.04)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx-full
# Point your domain (e.g. meet.yourdomain.com) to this VPS IP, then:
sudo apt install -y jitsi-meet
# During install: enter your domain (e.g. meet.yourdomain.com), choose Let's Encrypt.
```

Configure one default room or use dynamic rooms (e.g. `meet.yourdomain.com/MinistryLine`).

### 2.3 Install and configure Jigasi

- Install Jigasi on the same server: [Jitsi handbook – Jigasi](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-jigasi).
- Jigasi registers as a **SIP client** to Asterisk (or to a SIP trunk). When Asterisk “calls” Jigasi with a parameter like the Jitsi room name, Jigasi joins that room and bridges the audio.

Example idea (Asterisk dialplan): when someone calls your Twilio number, play “Enter conference PIN” (or use one fixed room), then dial Jigasi so it joins `MinistryLine` (or the room that matches the PIN). Jigasi then appears as a participant in that Jitsi room with the phone caller’s audio.

### 2.4 Install Asterisk and receive Twilio

- Install Asterisk (see **`docs/INDIA-SIP-SETUP.md`** for Asterisk install and a basic `sip.conf` / `extensions.conf`).
- Configure a **SIP trunk from Twilio** to Asterisk:
  - Twilio sends to `sip:VPS_IP:5060`.
  - Asterisk `sip.conf`: accept from Twilio’s IP (or auth) and send the call to a dialplan that:
    1. Optionally ask for PIN (DTMF).
    2. Dial Jigasi (SIP) with the Jitsi room name (and optional PIN) so the caller is placed into the correct room.

### 2.5 One room, one PIN (simplest)

- **Jitsi:** One room, e.g. `MinistryLine` → URL: `https://meet.yourdomain.com/MinistryLine`.
- **App (Admin → Settings):** Set dial-in number = your Twilio number, dial-in PIN = e.g. `123456` (or leave empty if no PIN).
- **Asterisk:** Inbound from Twilio → optional “enter PIN” → dial Jigasi to join `MinistryLine`. Phone and browser users are then on the **same bridge**.

---

## Part 3: App configuration (ministry site)

- **Admin → Settings → Dial-in:**  
  - **India / US / UK:** Set the **Twilio number** (e.g. US: `+1 (202) 555-1234`) where you want users to call.  
  - **Dial-in PIN:** Same value you use in Asterisk (e.g. `123456`) or leave blank if you don’t prompt for PIN.  
  - **Conference web link:** Set to your **Jitsi room** so “internet users” join the same bridge:  
    `https://meet.yourdomain.com/MinistryLine` (or your chosen room name).

- **Audio conference join page:**  
  - “Ministry conference line” shows the Twilio number + PIN and “Join online” (conference web link) so users can either **dial in** or **join in browser** — both end up in the same Jitsi room.

---

## Order of operations (summary)

| Step | Action |
|------|--------|
| 1 | **Twilio:** Sign up, get number, create Elastic SIP Trunk, set Termination to `sip:VPS_IP:5060`, link number to trunk. |
| 2 | **VPS:** Provision 4 vCPU, 8 GB RAM, 240 GB NVMe, Ubuntu 22.04 (US). Open 5060 UDP/TCP and RTP. |
| 3 | **VPS:** Install Jitsi Meet (with domain + TLS). |
| 4 | **VPS:** Install Jigasi; configure it to register to Asterisk and join a Jitsi room when called. |
| 5 | **VPS:** Install Asterisk; configure SIP from Twilio → dialplan → dial Jigasi into your Jitsi room. |
| 6 | **App:** Admin → Settings: dial-in number = Twilio number, PIN = your PIN, conference web link = Jitsi room URL. |
| 7 | **Test:** Call Twilio number from phone → enter PIN (if any) → hear room. Open Jitsi URL in browser → same room. |

---

## References

- **VPS + firewall:** `docs/SANDBOX-SIP-AND-VPS.md`
- **Asterisk basics:** `docs/INDIA-SIP-SETUP.md`
- **Twilio Elastic SIP Trunking:** [Twilio SIP Trunking](https://www.twilio.com/docs/sip-trunking)
- **Jigasi (SIP ↔ Jitsi):** [Jitsi Jigasi with SIP provider](https://jitsi.guide/jitsi-jigasi-connect-sip-provider/)
