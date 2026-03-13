# SIP Bridge – App Integration

This folder helps you wire the **ministry app** to your **VPS SIP bridge** (Twilio → Asterisk/FreeSWITCH → Jigasi → Jitsi) so dial-in and browser users are in the same room.

## App API (no auth)

The app exposes a **public** endpoint used by the bridge to get the current room name and PIN:

```http
GET /api/sip/dial-in-info
```

**Response:**

```json
{
  "success": true,
  "data": {
    "numbers": { "india": "+91...", "us": "+1...", "uk": "+44..." },
    "pin": "123456",
    "jitsi_room_name": "MinistryLine",
    "conference_web_url": "https://meet.yourdomain.com/MinistryLine"
  }
}
```

Configure **Admin → Settings → Dial-in Numbers**: set your Twilio (or other) numbers, PIN, conference web link, and **Jitsi room name**. The bridge uses `jitsi_room_name` so Jigasi joins the correct Jitsi room.

## Scripts on the VPS

### Fetch dial-in info

From the VPS (or cron), you can pull the current config:

```bash
export APP_URL=https://your-ministry-site.com
./scripts/sip/fetch-dial-in-info.sh
```

Output is JSON. You can parse it (e.g. with `jq`) to update Asterisk/Jigasi config or env vars.

### Asterisk sample

- **asterisk-extensions-sample.conf** – example dialplan for inbound Twilio calls: answer → dial Jigasi with the Jitsi room name.
- Copy and adjust for your Asterisk; set the Twilio trunk context to `from-twilio` and ensure Jigasi is registered as `SIP/jigasi@jitsi` (or your setup).

## End-to-end flow

1. **App:** Admin sets dial-in numbers, PIN, and Jitsi room name (e.g. `MinistryLine`).
2. **Twilio:** Inbound calls to your number are sent to the VPS (SIP termination).
3. **VPS:** Asterisk receives the call, optionally checks PIN, then dials Jigasi with the room name from the app (or from `GET /api/sip/dial-in-info`).
4. **Jigasi:** Joins the Jitsi room and bridges the phone caller.
5. **Browser users:** Join the same Jitsi room via the conference web link shown on the app.

See **docs/TWILIO-SAME-BRIDGE-SETUP.md** for full Twilio + Jitsi + Jigasi + Asterisk setup.
