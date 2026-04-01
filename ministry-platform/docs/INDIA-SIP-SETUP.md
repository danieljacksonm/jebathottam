# India Free VoIP Conference Setup Guide (Asterisk + FreeSWITCH)

## Overview

This guide helps you set up **completely free** dial-in conferencing for India with:
- ✅ Free browser-based video (Jitsi Meet)
- ✅ Free phone dial-in (Asterisk/FreeSWITCH)
- ✅ Support for +91 Indian phone numbers
- ✅ No per-minute charges

## Architecture

```
Phone Users (India +91)
         ↓
    Asterisk/FreeSWITCH Server (SIP)
         ↓
    Your VPS (India or Global)
         ↓
    Browser Users (Jitsi Meet)
    + Phone Bridge Integration
```

## Prerequisites

- VPS with Ubuntu 20.04+ or CentOS 8+ (recommended: ₹500-1000/month in India)
- Root or sudo access
- Basic Linux knowledge
- Domain name (optional but recommended)

## Option 1: Self-Hosted Asterisk (Recommended for India)

### Step 1: Setup VPS

Use any Indian VPS provider:
- **DigitalOcean** (₹100-200/month)
- **AWS** (EC2 free tier eligible)
- **Vultr** (India region available)
- **Linode** (India data center)
- **Local Indian providers**: Hostripples, Zapp Hosting

### Step 2: Install Asterisk

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y build-essential wget libssl-dev libjansson-dev libxml2-dev \
    uuid-dev sqlite3 libsqlite3-dev pkg-config

# Download Asterisk (LTS version)
cd /tmp
wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-18-current.tar.gz
tar -zxvf asterisk-18-current.tar.gz
cd asterisk-18.*

# Build and install
./configure --libdir=/usr/lib64
make -j$(nproc)
sudo make install
sudo make config

# Create asterisk user
sudo groupadd asterisk
sudo useradd -r -d /var/lib/asterisk -s /bin/false -g asterisk asterisk
sudo chown -R asterisk:asterisk /var/lib/asterisk /var/spool/asterisk /var/log/asterisk /etc/asterisk /usr/lib64/asterisk

# Start Asterisk
sudo systemctl start asterisk
sudo systemctl enable asterisk
```

### Step 3: Configure Asterisk for Conferences

Edit `/etc/asterisk/extensions.conf`:

```
[general]
static=yes
writeprotect=no

[conferences]
exten => _XXXXXX,1,Verbose(1,Connecting to conference ${EXTEN})
 same => n,ConfBridge(${EXTEN},${EXTEN}_config)
 same => n,Hangup()

[from-external]
exten => _.,1,GotoIf($["${EXTEN}"=""]?conferences,s,1)
 same => n,GotoIf($["${EXTEN:0:1}"="1"]?conferences,${EXTEN:1},1)
 same => n,Log(ERROR,Invalid extension ${EXTEN})
 same => n,Hangup()

; Reject all calls by default
exten => _.,1,Busy()
```

Edit `/etc/asterisk/confbridge.conf`:

```
[default_bridge]
type=bridge_profile
jitter_buffer=no
video_mode=none
record_conference=yes
record_conference_dir=/var/lib/asterisk/recordings

[default_user]
type=user
; Max duration in seconds (0 = unlimited)
max_duration=3600

[${EXTEN}_config]
type=bridge_profile
name=${EXTEN}
```

### Step 4: Configure SIP Trunking (Incoming Calls from India)

Use **FreeSWITCH SIP Bridge** or **GoIP Gateway** to receive calls:

Edit `/etc/asterisk/sip.conf`:

```
[general]
context=from-external
bindport=5060
bindaddr=0.0.0.0
srvlookup=yes
udpbindaddr=0.0.0.0
transport=udp,tcp

; Allow calls from anywhere
[from-siptrunk]
type=friend
context=conferences
host=dynamic
nat=yes
qualify=yes
directmedia=no
```

### Step 5: Get India SIP Number (Choose One)

#### Option A: Free SIP Services
- **Jami** (formerly GNU Ring): Completely free, P2P
- **Ekiga**: Free SIP service
- **Linphone**: Free SIP client

#### Option B: Low-Cost Indian SIP Providers
- **Exotel** (₹500-2000/month): Cheap Indian numbers
- **Bulkvada** (₹200-1000/month): Affordable trunking
- **VoiceWave** (₹500+/month): Indian SIP provider
- **Airtel**: Business VoIP packages

#### Option C: Create Free DID with SIP2SIP
```bash
# Install Jami (formerly GNU Ring)
sudo apt install -y jami

# Start service
sudo systemctl start jami
```

### Step 6: Test the Setup

```bash
# Launch Asterisk CLI
sudo asterisk -rvvv

# Check SIP peers
sip show peers

# Make test call
> sip show users
```

### Step 7: Link with Jitsi Meet

1. Get Jitsi SIP module
2. Configure SIP bridge in Jitsi `/etc/jitsi/jicofo/sip-communicator.properties`:

```
org.jitsi.jicofo.XMPP_DOMAIN=jitsi.your-domain.com
org.jitsi.jicofo.BRIDGE_MUC=jvbbrewery@internal.auth.your-domain.com
```

3. Enable dial-in in `/etc/jitsi/meet/your-domain-config.js`:

```javascript
dialInNumberUrl: 'https://your-domain.com/dial-in-info',
dialInConfCodeUrl: 'https://your-domain.com/conf-code',
dialOutAuthUrl: 'https://your-domain.com/auth/dial-out',
```

---

## Option 2: Use Jitsi with Built-in SIP Dial-In

Simpler alternative using Jitsi's native SIP support:

### Quick Setup

1. **Install Jitsi Meet on Ubuntu**:
```bash
sudo apt update
sudo apt install -y jitsi-meet

# During install, choose your domain and let's encrypt cert
```

2. **Enable SIP Dial-In** in `/etc/jitsi/meet/your-domain-config.js`:

```javascript
dialInNumbers: {
    'India': '+91-9999-999-999',
    'US': '+1-234-567-8900'
},
```

3. **Configure jicofo** for SIP in `/etc/jitsi/jicofo/sip-communicator.properties`:

```
org.jitsi.jicofo.SIP_GATEWAY_ENABLED=true
org.jitsi.jicofo.SIP_GATEWAY_ADDRESS=sip:jicofo@localhost
```

---

## Option 3: Use Free Cloud SIP Service

### FreeSWITCH Cloud

```bash
# Docker setup (easiest)
docker run -d --name freeswitch \
    -p 5060:5060/udp \
    -p 5061:5061/tcp \
    -e PASSWORD=your_secure_password \
    singularitygs/freeswitch
```

---

## Integration with Your App

### 1. Update SIP Config in Database

```sql
UPDATE sip_config SET
  sip_server_url = 'sip://your-asterisk-ip:5060',
  dial_in_number = '+91-your-number',
  country_code = '+91',
  sip_provider = 'Asterisk',
  is_active = TRUE
WHERE id = 1;
```

### 2. Update Admin Panel

Admin goes to Settings > Conference > Dial-In Setup:
- Enter SIP server URL
- Enter India dial-in number
- Enter PIN requirements

### 3. Display Dial-In Info to Users

On your conference page, show:

```
📞 Dial-in for Non-Internet Users (India):

Call: +91-9999-999-999
PIN: 123456

Having trouble? Call our support team.
```

---

## India-Specific Configuration

### Telecom Regulations

For commercial use in India, register with:
- **TRAI** (Telecom Regulatory Authority of India)
- **NTP** (National Telecom Policy)
- Get proper VoIP license

For personal/ministry use: Generally allowed but check local laws.

### Cost Breakdown (Monthly)

| Item | Cost | Notes |
|------|------|-------|
| VPS | ₹500-1000 | Includes Asterisk |
| Domain | ₹100-500 | Optional |
| SIP Number | Free-3000 | Jami = free, Exotel = paid |
| **Total** | **₹600-4500** | **Completely free if using Jami** |

### Performance Tips

- Use VPS in Asia region for low latency
- Set Asterisk channel limit to 50+ for conferences
- Enable RTP compression for better call quality
- Use T.38 fax for voice optimization

---

## Troubleshooting

### Can't receive dial-in calls

```bash
# Check firewall
sudo ufw allow 5060/udp
sudo ufw allow 5061/tcp

# Restart Asterisk
sudo systemctl restart asterisk

# Check logs
tail -f /var/log/asterisk/full
```

### Poor call quality

1. Reduce packet loss (check network metrics)
2. Increase jitter buffer in Asterisk
3. Use G.729 codec instead of ulaw for lower bandwidth
4. Reduce conference participant limit

### SIP registration issues

```bash
# Restart Asterisk SIP module
asterisk -rvvv
sip reload
```

---

## Next Steps

1. ✅ Deploy Asterisk/FreeSWITCH on VPS
2. ✅ Get India SIP number (free or cheap)
3. ✅ Test dial-in with personal phone
4. ✅ Configure app SIP settings
5. ✅ Create admin UI for dial-in management
6. ✅ Send SMS/WhatsApp to non-internet users with call details

---

## Support & Resources

- **Asterisk Docs**: https://wiki.asterisk.org/
- **FreeSWITCH Docs**: https://freeswitch.org/
- **Jitsi Docs**: https://jitsi.github.io/
- **India VoIP**: https://www.trai.gov.in/

---

## FAQ

**Q: Can ministers use this for free?**
A: Yes, completely free with Jami SIP service. Just pay for VPS hosting.

**Q: How many people can dial-in simultaneously?**
A: Depends on VPS resources. Typically 20-50 concurrent calls per ₹1000/month VPS.

**Q: Is this legal in India?**
A: Yes, for internal ministry use. For commercial/public use, follow TRAI guidelines.

**Q: Can I modify conference PIN for security?**
A: Yes, generate 6-10 digit PIN in database for each conference.

**Q: What if participants don't have smartphones?**
A: Perfect! They just need a regular phone to dial your conference number.
