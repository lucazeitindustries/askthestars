# Ask the Stars — MVP Spec
*Domain: askthestars.ai*
*Stack: Next.js 15 + Tailwind + TypeScript + Vercel*

## MVP Features (Week 1)

### 1. Landing Page
- Hero: "Ask the Stars" with cosmic/starry background
- Subline: "AI-powered personal astrology readings"
- CTA: "Get Your Free Reading" → leads to birth data form
- Social proof section (when we have users)
- SEO-optimized with meta tags, OG images

### 2. Birth Chart Input
- Date of birth (date picker)
- Time of birth (time picker, optional but encouraged)
- Place of birth (autocomplete)
- Calculate natal chart from this data

### 3. Free Daily Horoscope
- 12 sign pages (e.g., /horoscope/aries, /horoscope/taurus...)
- AI-generated daily readings personalized by sign
- SEO pages that rank for "[sign] horoscope today"
- Refresh daily via cron

### 4. Personal Reading (core product)
- After entering birth data → show natal chart visualization
- AI generates personalized reading based on actual planetary positions
- Covers: personality, love, career, today's energy
- First reading is FREE (hook)
- Deeper readings behind paywall

### 5. AI Astrologer Chat
- Chat interface to "ask the stars" anything
- AI responds in character as a mystical but warm astrologer
- Uses birth chart context for personalized answers
- Free: 3 questions/day
- Paid: unlimited

### 6. Compatibility Checker
- Enter your birth data + partner's birth data
- AI analyzes compatibility based on both charts
- Shareable result page (viral loop!)
- SEO pages for every combo: /compatibility/aries-scorpio

### 7. Stripe Subscriptions
- Free tier: daily horoscope + 3 AI questions/day + 1 compatibility check
- Star ($9.99/mo): unlimited AI chat + personalized daily readings + full chart
- Cosmic ($19.99/mo): everything + relationship readings + career guidance + monthly forecast

## Tech Stack
- **Frontend:** Next.js 15, Tailwind CSS, Framer Motion
- **Astrology:** astronomia (npm) or Swiss Ephemeris (swisseph npm binding) for chart calculations
- **AI:** OpenAI GPT-4o for readings and chat
- **Payments:** Stripe Checkout + Customer Portal
- **Auth:** NextAuth or simple email magic links
- **Database:** Vercel Postgres or Supabase
- **Hosting:** Vercel
- **Domain:** askthestars.ai (Vercel)

## Design Direction
- Dark theme (deep navy/black with star/cosmic accents)
- Gold/white text for mystical feel
- Subtle star animations
- Clean, modern — NOT tacky astrology site
- Think: Co-Star's minimalism meets premium feel
- Mobile-first

## SEO Strategy (built into MVP)
- /horoscope/[sign] — 12 pages targeting "[sign] horoscope today"
- /horoscope/[sign]/weekly — 12 pages targeting "[sign] weekly horoscope"
- /horoscope/[sign]/monthly — 12 pages targeting "[sign] monthly horoscope"
- /compatibility/[sign1]-[sign2] — 144 pages targeting "[sign] and [sign] compatibility"
- /birth-chart — targeting "free birth chart calculator"
- Blog: /blog/mercury-retrograde, /blog/moon-phases etc.
- Total: 170+ SEO pages at launch
