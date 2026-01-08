# External Integrations

This document covers third-party services and integrations used in this project.

## Web3Forms

**Documentation**: https://docs.web3forms.com

Web3Forms is a contact form service for static websites. It receives form submissions and delivers them directly to an email inbox without requiring server or backend code.

### Setup

1. Create an Access Key at https://web3forms.com
2. Add the access key to your form as a hidden field
3. Point the form action to the Web3Forms endpoint

### Basic Implementation

```astro
<form action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY" />

  <label for="name">Name</label>
  <input type="text" name="name" id="name" required />

  <label for="email">Email</label>
  <input type="email" name="email" id="email" required />

  <label for="message">Message</label>
  <textarea name="message" id="message" required></textarea>

  <button type="submit">Send</button>
</form>
```

### Configuration Options

| Hidden Field | Purpose |
|--------------|---------|
| `access_key` | Required - Your Web3Forms access key |
| `subject` | Custom email subject line |
| `redirect` | URL to redirect after submission |
| `from_name` | Custom sender name in email |
| `replyto` | Set reply-to address (use email field value) |

```html
<input type="hidden" name="subject" value="New Contact Form Submission" />
<input type="hidden" name="redirect" value="https://yoursite.com/thank-you" />
<input type="hidden" name="from_name" value="Contact Form" />
<input type="checkbox" name="replyto" checked class="hidden" />
```

### Spam Protection

**Honeypot Field** (recommended):

```html
<input type="checkbox" name="botcheck" class="hidden" style="display: none;" />
```

**hCaptcha Integration**:

```html
<div class="h-captcha" data-captcha="true"></div>
<script src="https://web3forms.com/client/script.js" async defer></script>
```

### Features

- **File Attachments** - Supports file uploads (Pro feature)
- **Webhooks** - Send data to external services
- **Auto-responder** - Send confirmation emails to users (Pro feature)
- **Third-party Integrations** - Google Sheets, Slack, Discord, Telegram

---

## Adding New Integrations

When adding a new external integration to this project:

1. Add a new section to this document with:
   - Integration name and purpose
   - Link to official documentation
   - Setup instructions
   - Code examples specific to this Astro project
   - Configuration options table
   - Any gotchas or important notes

2. If the integration requires environment variables, document them in `.env.example`

3. If the integration requires npm packages, add installation instructions
