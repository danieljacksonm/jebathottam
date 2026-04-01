# Fix 413 Upload Error (Payload Too Large)

The 413 error means your **Nginx** (or reverse proxy) is rejecting uploads before they reach the app.

## Fix on VPS

Edit your Nginx config (usually `/etc/nginx/sites-available/default` or your site config):

```nginx
server {
    # ... existing config ...
    
    # Add this inside the server block:
    client_max_body_size 10M;
    
    location / {
        proxy_pass http://localhost:3000;
        # ... other proxy settings ...
    }
}
```

Then reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## If using Apache

Add to your VirtualHost or .htaccess:

```apache
LimitRequestBody 10485760
```
(10MB in bytes)
