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

## LottieFiles

**Documentation**: https://developers.lottiefiles.com

LottieFiles provides lightweight, scalable animations for web and mobile. Lottie animations are JSON-based vector graphics that render at any resolution without quality loss, making them ideal for canvas images, icons, and interactive UI elements.

### Setup

1. Install the DotLottie React package:
   ```bash
   npm install @lottiefiles/dotlottie-react
   ```

2. Create a hook for caching animations (optional but recommended)

3. Create a loader component for consistent animation rendering

### Basic Implementation

```jsx
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const AnimatedIcon = () => (
  <DotLottieReact
    src="https://lottie.host/your-animation-id/animation.lottie"
    loop
    autoplay
  />
);
```

### Cached Animation Pattern

For better performance with multiple animations, use a caching hook:

```jsx
// hooks/useCachedLottie.js
const lottieCache = new Map();

const lottieAnimations = {
  about: "https://lottie.host/xxx/animation.lottie",
  services: "https://lottie.host/yyy/animation.lottie",
  contact: "https://lottie.host/zzz/animation.lottie",
};

const useCachedLottie = (animationName) => {
  const [animationUrl, setAnimationUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lottieCache.has(animationName)) {
      setAnimationUrl(lottieCache.get(animationName));
      setIsLoading(false);
      return;
    }

    const url = lottieAnimations[animationName];
    if (url) {
      lottieCache.set(animationName, url);
      setAnimationUrl(url);
    }
    setIsLoading(false);
  }, [animationName]);

  return { animationUrl, isLoading, error };
};
```

### LottieLoader Component

```jsx
// utils/LottieLoader.jsx
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import useCachedLottie from "../hooks/useCachedLottie";

const LottieLoader = ({
  animationName,
  loop = true,
  autoplay = true,
  className = "",
  fallbackText = "Animation",
}) => {
  const { animationUrl, isLoading, error } = useCachedLottie(animationName);

  if (isLoading) {
    return <div className={`${className} animate-pulse`} />;
  }

  if (error || !animationUrl) {
    return <p className="text-gray-500">{fallbackText}</p>;
  }

  return (
    <DotLottieReact
      src={animationUrl}
      loop={loop}
      autoplay={autoplay}
      className={className}
    />
  );
};

export default LottieLoader;
```

### Configuration Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | - | URL to .lottie or .json animation file |
| `loop` | boolean | false | Loop the animation continuously |
| `autoplay` | boolean | false | Start playing on mount |
| `speed` | number | 1 | Playback speed multiplier |
| `direction` | 1 \| -1 | 1 | Playback direction |
| `mode` | string | "forward" | Play mode: "forward", "reverse", "bounce", "bounce-reverse" |
| `segment` | [number, number] | - | Play specific frame range |

### Animation Sources

- **Lottie Host**: Upload and host at https://lottie.host (free tier available)
- **LottieFiles Library**: Browse free animations at https://lottiefiles.com/free-animations
- **Self-hosted**: Serve .lottie or .json files from your own `/public` folder

### Best Practices

- Use `.lottie` format over `.json` for smaller file sizes (60-90% reduction)
- Implement caching for animations used multiple times
- Add fallback content for error states
- Consider lazy loading animations below the fold
- Use error boundaries to gracefully handle rendering failures

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
