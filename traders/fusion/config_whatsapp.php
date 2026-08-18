<?php
/**
 * WhatsApp Cloud API – one-click send bill PDF to customer.
 *
 * 1. Go to https://developers.facebook.com → Create App → Add WhatsApp product.
 * 2. Get Access Token and Phone number ID from WhatsApp > API Setup.
 * 3. Ensure your site is on HTTPS and the "invoices/" folder is web-accessible.
 * 4. Fill below and save. Then "WhatsApp" button on Bills will send the PDF in one click.
 */
$wa_access_token    = 'EAANjUzSuqkQBRUrMpL7Umho77CmXGJQ1yvSVU8E9ldUGvgeZCZCRKwLqzRdICYsXjHRpm3ZBInDkEm0pvr8oPDmiOms6bll1bo3lYwg9d43iiD460W1ZBFtWU291YhZC0R2kpLPQiXZCxglr4CzAZCTl12f7OMfvlTEFZAaAxcdZA8xvdLtO8vuZCc2QmZC2QIMsntDAxHtag80Pe8WOWycvjPoJqMSyZCBIEphxEHMjBtx3QlObB5EDk32eVwzXLgooG9tAMIoaKmq3SQt5h7f9bHYuoPlU';  // From Meta: WhatsApp > API Setup > Temporary or System User token
$wa_phone_number_id = '1053012631239021';  // From Meta: WhatsApp > API Setup > Phone number ID (numeric)
$wa_site_base_url   = 'http://cococola.yegova.store/';  // Your site base URL, e.g. https://yourdomain.com/cocacola/
