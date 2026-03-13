# Sandbox SIP & VPS Setup for Conference Bridge

Use **sandbox SIP first** to test your bridge (FreeSWITCH/Asterisk) without paying for a real number. Then move to a production SIP provider (e.g. India number ~₹250) and use the VPS below.

---

## 1. Sandbox SIP – Test Before Production

### Which providers give you a sandbox number?

These providers give you a **free or trial phone number** (or SIP trunk) so you can test your VPS bridge without paying for a production number:

| Provider | Sandbox / trial number? | What you get |
|----------|--------------------------|--------------|
| **Twilio** | Yes | Trial account: **1 free number** (US), 1 SIP trunk, 4 concurrent calls. Inbound: anyone can call your number. Outbound: only to **verified** numbers. [twilio.com/try-twilio](https://www.twilio.com/try-twilio) |
| **SIP.US** | Yes | Free trial with **60 minutes** outbound (US). No credit card. You get SIP credentials; use with a softphone or point termination to your VPS. [sip.us](https://www.sip.us/) |
| **Vapi-Ready SIP** | Yes | **Free test DID** (US number for testing). Pay-as-you-go after. [vapisiptrunking.com](https://vapisiptrunking.com/) |
| **GoTrunk** | Yes | **30-day free trial** (number/SIP via VoIPstudio). [gotrunk.com](https://gotrunk.com/register/) |
| **handSIP (Imecom)** | Yes | Free **demo account**, unlimited call paths (US). Request trial. [Alhambra IT / handSIP](https://info.us.alhambrait.com/lp/sip-trunk-trial) |
| **Siply** | Yes | **Free testing** accounts; wholesale SIP. [siply.com](https://www.siply.com/) |

**India (+91) sandbox:** Most India SIP providers (Trikon, Exotel) do **not** offer a free India number. Trikon sometimes offers **demo minutes** for US/Canada; for an India DID you usually pay from day one (~₹250). Use a **US trial number** (e.g. Twilio) to test your bridge, then switch to an India number from Trikon/Exotel.

### Full sandbox table (SIP trunk / credentials)

| Provider | What they offer | Signup / Notes |
|----------|-----------------|----------------|
| **SIP.US** | Free SIP trunk trial, **60 minutes** outbound (lower 48 US). No credit card. | [sip.us](https://www.sip.us/) – quick signup, ~60 sec setup. Good for testing bandwidth and quality. |
| **Twilio** | Trial account: **1 SIP trunk**, 1 origination number, 4 concurrent calls. Calls only to/from **verified** numbers. Free test numbers to call. | [twilio.com](https://www.twilio.com/) – Developer trial. Use test numbers e.g. +1 (650) 489-4546 to verify your trunk. |
| **handSIP (Imecom)** | Free demo account, unlimited call paths, US support. | [Alhambra IT / handSIP](https://info.us.alhambrait.com/lp/sip-trunk-trial) – request trial. |
| **GoTrunk** | **30-day free trial** (via VoIPstudio). | [gotrunk.com](https://gotrunk.com/register/) – register for trial. |
| **Vapi-Ready SIP** | **Free test DID**; pay-as-you-go after (~$0.003–0.008/min US). TLS/SRTP, STIR/SHAKEN. | [vapisiptrunking.com](https://vapisiptrunking.com/) – get test DID for sandbox. |
| **Siply** | Free accounts for testing; wholesale SIP termination, multiple codecs, PBX integration. | [siply.com](https://www.siply.com/) – free testing. |

### Suggested sandbox flow

1. **Pick one** (e.g. SIP.US or Twilio trial).
2. **Get SIP credentials** from their dashboard (server host, port, username/password or IP auth).
3. **Point trunk to your VPS:** In provider’s dashboard set “SIP URI” or “Termination” to your VPS public IP (e.g. `your-vps-ip:5060`) or hostname.
4. **Configure FreeSWITCH/Asterisk** on the VPS to accept that trunk and send calls into your conference app.
5. **Test:** Call the trial number (or Twilio test number); confirm audio reaches your bridge and conference.

After sandbox works, **switch to production**: use an **India (+91) number** from a local SIP provider. Twilio does not offer Indian numbers.

- **India providers and step-by-step setup:** **`docs/INDIA-NUMBER-PROVIDERS.md`** (Trikon from ~₹250/month, Exotel, DIDWW, BuyDIDNumber, etc., with steps to point the number to your VPS).

**Using your personal number:** You cannot use your personal mobile/landline as the SIP endpoint. Use a dedicated number from a SIP provider (or call-forward your personal number to that dedicated number). See **`docs/TWILIO-SAME-BRIDGE-SETUP.md`** §1.5.

### Testing without international calls (no international pack on mobile)

US sandbox numbers (Twilio, SIP.US, etc.) require calling a US number from India = **international call** if you use your mobile. If you **don’t have an international pack**, use one of these instead:

1. **SIP softphone over WiFi/data (no phone call)**  
   Install a **SIP softphone** on your **phone or PC** (e.g. **Zoiper**, **Linphone**, **MicroSIP** on PC). Configure it to register to **your VPS Asterisk/FreeSWITCH** (create a SIP extension for testing). Place a “call” to the conference extension from the softphone. The call uses **internet (WiFi/data)** only – no GSM/international minutes. You can join the same Jitsi room as a “dial-in” leg and test the bridge. No need to call any US number.

2. **Use an India number from day one**  
   Get an **India (+91) number** from **Trikon** (~₹250/month) or **Exotel**. Put it in Admin → Settings and point it to your VPS. Then **call that India number from your mobile** – it’s a **local/national** call (or low-cost STD), so no international pack needed. See **`docs/INDIA-NUMBER-PROVIDERS.md`**.

3. **Browser + softphone on same device**  
   Open **Jitsi in the browser** (one “participant”). On the **same PC**, open **MicroSIP** (or another softphone) registered to your VPS and dial the conference. You’ll hear both legs in the same room. No mobile call at all.

**Summary:** You don’t need to call a US number to test. Use a **SIP softphone** over internet to your VPS, or get an **India number** (Trikon) and call it locally.

---

## 2. VPS Details (Conference Bridge Server)

Use this spec for both **sandbox** and **production** bridge.

| Item | Value |
|------|--------|
| **vCores** | 4 |
| **RAM** | 8 GB |
| **Storage** | 240 GB NVMe SSD |
| **Datacenter** | United States |
| **OS** | Ubuntu 22.04 |

### Why this is enough

- 4 vCPU + 8 GB RAM is sufficient for **dozens of concurrent conference callers** (FreeSWITCH/Asterisk).
- 240 GB NVMe gives space for OS, FreeSWITCH/Asterisk, logs, and optional recordings.
- US datacenter is fine for sandbox (SIP.US, Twilio, etc.); for India dial-in, consider an India/Mumbai VPS later to reduce latency, or keep US if most participants are global.

### Firewall (open on VPS)

| Port | Protocol | Purpose |
|------|----------|---------|
| **5060** | UDP, TCP | SIP signaling |
| **5080** | TCP | SIP over TLS (optional) |
| **16384–32768** | UDP | RTP media (or 10000–20000 if you narrow range) |

Example (Ubuntu `ufw`):

```bash
sudo ufw allow 5060/udp
sudo ufw allow 5060/tcp
sudo ufw allow 16384:32768/udp
sudo ufw enable
```

### Checklist before installing bridge

- [ ] VPS provisioned: 4 vCores, 8 GB RAM, 240 GB NVMe, Ubuntu 22.04, US.
- [ ] Root or sudo access.
- [ ] Public static IP known.
- [ ] Ports 5060 (UDP/TCP) and RTP range open in firewall and any cloud security group.
- [ ] Sandbox SIP provider chosen; SIP credentials and termination URI (your VPS IP/host:5060) obtained.

---

## 3. Order of operations

1. **Prepare VPS** – specs above, Ubuntu 22.04, firewall open.
2. **Sign up for sandbox SIP** – e.g. SIP.US or Twilio trial; get SIP trunk credentials and set termination to your VPS.
3. **Install and configure bridge** – FreeSWITCH or Asterisk; one conference room + PIN.
4. **Test end-to-end** – call sandbox number → enter PIN → hear conference.
5. **Production** – Subscribe to India (or other) number; point same trunk to same VPS; update app dial-in number in Admin → Settings.

---

## 4. Twilio + same bridge (phone + internet users)

If you want **dial-in and browser (Jitsi) users on the same conference**, start with Twilio and follow:

- **`docs/TWILIO-SAME-BRIDGE-SETUP.md`** — Twilio setup first, then VPS with Jitsi + Jigasi + Asterisk so everyone is in one room.

---

## 5. References

- **Twilio + same bridge (phone + Jitsi):** `docs/TWILIO-SAME-BRIDGE-SETUP.md`
- **Asterisk/FreeSWITCH + India number:** `docs/INDIA-SIP-SETUP.md`
- **App conference flow and API:** `CONFERENCE-IMPLEMENTATION.md`
- **Twilio SIP trunk testing:** [Twilio – Test your Elastic SIP Trunk](https://www.twilio.com/docs/sip-trunking/trunk-verification)
