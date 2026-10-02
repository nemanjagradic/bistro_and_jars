# Bistro & Jars Coffee Bar

A presentation website for Bistro & Jars Coffee Bar in Novi Beograd. Visitors explore the café in Serbian or English, and can send an inquiry or a celebration request, with a WhatsApp notification to the café and the guest.

Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS.

Live Demo: [bistroandjars.com](https://bistroandjars.com)

## Features

- Home with scroll-driven hero and signature-drink sequence
- Gallery and full menu (`/menu` is the QR landing page)
- Contact form for inquiries and celebration requests
- Serbian and English, without language-prefixed URLs
- WhatsApp Cloud API messages to the owner and a confirmation to the guest
- Rate limiting with Upstash Redis
- Privacy and terms pages, and a branded 404

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **UI:** Tailwind CSS 4
- **Motion:** GSAP + ScrollTrigger
- **Forms:** Meta WhatsApp Cloud API
- **Rate limiting:** Upstash Redis
- **Hosting:** Vercel

## Installation & Usage

Requires Node.js 20 or newer.

### 1. Clone the repository

```bash
git clone https://github.com/bistroandjarsweb/bistro_and_jars.git
cd bistro_and_jars
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```bash
# WhatsApp
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_API_VERSION=v25.0
OWNER_WHATSAPP_E164=
GUEST_CONFIRMATION_ENABLED=true
WHATSAPP_FALLBACK_E164=

# Upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 4. Run in development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Build and run in production

```bash
npm run build
npm start
```

## Deployment

Deployed on Vercel at [bistroandjars.com](https://bistroandjars.com).
