import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const SIGN_ELEMENTS: Record<string, string> = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water',
};

const FOCUS_LABELS: Record<string, string> = {
  love: 'Love & Relationships',
  career: 'Career & Money',
  growth: 'Personal Growth',
};

function getFallbackReading(sign: string, focusArea: string) {
  const focus = FOCUS_LABELS[focusArea] || focusArea;
  const element = SIGN_ELEMENTS[sign] || 'Fire';

  const teasers: Record<string, Record<string, string>> = {
    love: {
      Fire: `As a ${sign}, your passionate ${element} energy is creating powerful magnetic shifts in your love life right now. The stars are aligning in a way that hasn't happened in over a decade — someone significant is about to enter your orbit, or a current connection is ready to transform. Your ruling planet's position suggests that vulnerability, not intensity, will be your greatest strength this season. Your full reading reveals much more...`,
      Earth: `As a ${sign}, your grounded ${element} nature is attracting deep, lasting connections right now. The current planetary alignment suggests a relationship that felt stagnant is about to break through to a new level of intimacy. The cosmos are asking you to trust your body's wisdom — it knows who is truly right for you before your mind catches up. Your full reading reveals much more...`,
      Air: `As a ${sign}, your brilliant ${element} energy is sparking unexpected romantic connections. Mercury's current dance through your chart suggests that a conversation — perhaps one you've been avoiding — will completely shift your love landscape. The person you're thinking of right now? The stars have something specific to say about them. Your full reading reveals much more...`,
      Water: `As a ${sign}, your intuitive ${element} nature is picking up on emotional currents that others can't see. Right now, the Moon is illuminating hidden truths about your deepest connections. A relationship that appeared one way on the surface is about to reveal its true depth. Trust what you feel, not just what you see. Your full reading reveals much more...`,
    },
    career: {
      Fire: `As a ${sign}, your ambitious ${element} energy is positioned for a major career breakthrough. Mars and Jupiter are forming a rare alignment that supercharges your professional life. An opportunity you've been preparing for — maybe without even realizing it — is about to present itself. The timing is extraordinary. Your full reading reveals much more...`,
      Earth: `As a ${sign}, your practical ${element} nature is about to be rewarded in ways you didn't expect. Saturn's current position in your chart suggests that the hard work and patience you've invested is reaching a tipping point. A financial shift or career elevation is forming — and it's closer than you think. Your full reading reveals much more...`,
      Air: `As a ${sign}, your innovative ${element} mind is perfectly positioned for a professional leap. Uranus is activating your house of career, bringing unexpected opportunities through your network. An idea you've been sitting on has more potential than you realize — and the right person to help you execute it is already in your life. Your full reading reveals much more...`,
      Water: `As a ${sign}, your intuitive ${element} nature gives you a hidden advantage in your career right now. Neptune is illuminating creative and unconventional paths to abundance. Trust the inner knowing that's been guiding you toward something different — the universe is confirming that your instincts are correct. Your full reading reveals much more...`,
    },
    growth: {
      Fire: `As a ${sign}, your courageous ${element} spirit is entering a profound period of personal transformation. Pluto's influence on your chart suggests you're shedding an old identity that no longer serves you. The version of yourself that emerges from this period will surprise everyone — including you. This is the beginning of your next chapter. Your full reading reveals much more...`,
      Earth: `As a ${sign}, your resilient ${element} nature is being called to build something entirely new — from the inside out. Saturn and the North Node are asking you to redefine what success means to you. A habit or belief system you've held since childhood is ready to be released, making room for the person you're becoming. Your full reading reveals much more...`,
      Air: `As a ${sign}, your curious ${element} mind is on the verge of a breakthrough insight that will change how you see yourself. Mercury's current journey through your chart is connecting dots that have been scattered for years. A pattern you've been repeating unconsciously is about to become visible — and that awareness is the key to freedom. Your full reading reveals much more...`,
      Water: `As a ${sign}, your sensitive ${element} soul is undergoing a quiet but powerful metamorphosis. The Moon's nodes are activating deep emotional healing in your chart. Something you thought you had processed long ago is surfacing one final time — not to hurt you, but to release you completely. This is liberation. Your full reading reveals much more...`,
    },
  };

  const fullReadings: Record<string, Record<string, string>> = {
    love: {
      Fire: `Your ${element} energy has been building toward this moment. The current Venus-Mars conjunction is electrifying your house of partnerships, creating the conditions for a love story that matches your intensity.\n\nIf you're single, the next few weeks are extraordinarily potent for meeting someone who can keep up with your fire without trying to extinguish it. Pay attention to connections that feel both exciting AND stable — that's the rare combination the stars are pointing you toward.\n\nIf you're in a relationship, this transit is reigniting passion that may have cooled. But it's deeper than physical chemistry — it's about rediscovering why you chose each other. An honest conversation this week could unlock a new phase of your partnership.\n\nThe key for ${sign} right now: lead with your heart, not your pride. Your greatest love story requires the courage to be seen — truly seen — without your armor.`,
      Earth: `The planetary alignment in your chart is creating something rare: the conditions for a love that is both deeply passionate and genuinely lasting. As a ${sign}, you don't do temporary — and the cosmos is finally matching your energy.\n\nVenus in your earth trine is grounding romantic possibilities into reality. Abstract feelings are becoming concrete commitments. If you've been waiting for a sign, this is it — but it won't look dramatic. It will look like someone showing up, consistently, in the quiet moments.\n\nFor partnered ${sign}s, this is a period of deepening trust. Something your partner reveals — or something you finally share — creates a new foundation. Physical intimacy reaches a new level when emotional walls come down.\n\nYour assignment: stop waiting for perfection. The love you're looking for is already here, waiting for you to notice it.`,
      Air: `Mercury's dance through your relationship houses is creating an extraordinary window for connection through communication. For ${sign}, love has always started with the mind — and right now, your mental magnetism is off the charts.\n\nA conversation you have in the coming days will reveal more about your romantic future than any date or gesture could. Pay attention to who makes you think, who challenges your assumptions, and who makes you laugh until you forget to perform.\n\nIf you're in a relationship, this transit asks you to communicate what you've been thinking but not saying. Your partner needs to hear your thoughts — not just the polished version, but the raw, unfiltered truth.\n\nThe cosmos reminds ${sign}: you don't need someone who completes your sentences. You need someone who makes you think entirely new ones.`,
      Water: `The Moon's current journey through your chart is activating every emotional frequency you possess — and as a ${sign}, that's a vast and powerful range. Your capacity to feel deeply is not a weakness right now. It's your greatest gift.\n\nIn matters of the heart, you're receiving psychic downloads about your relationships that your rational mind hasn't caught up to yet. Trust the feelings that don't make logical sense. Your intuition is operating at its peak.\n\nIf you're navigating a complicated connection, clarity is coming — but it arrives through feeling, not analysis. Let yourself sit with the emotions without rushing to conclusions.\n\nFor ${sign}, the path to love requires one brave act: allowing yourself to need someone. Not in a way that diminishes you, but in a way that expands what you thought was possible.`,
    },
    career: {
      Fire: `Mars is supercharging your professional ambitions, and as a ${sign}, you're built for moments exactly like this. The planetary alignment suggests a window of opportunity that opens fast and rewards bold action.\n\nA leadership role, project launch, or entrepreneurial leap that you've been contemplating is being cosmically supported. The universe isn't asking you to play it safe — it's asking you to trust your instincts and move with the confidence that is your birthright.\n\nFinancially, Jupiter's aspect to your money houses suggests an unexpected increase — but it comes through expansion, not conservation. Investing in yourself (courses, tools, branding) pays outsized returns right now.\n\nThe career advice the stars have for ${sign}: stop waiting for permission. The opportunity you're looking for won't come with a formal invitation. Create it yourself.`,
      Earth: `Saturn's position in your chart is delivering the professional harvest you've been cultivating. As a ${sign}, you understand that real success is built slowly — and right now, the foundation you've laid is strong enough to support the next level.\n\nA promotion, raise, or business milestone is forming. But it requires you to claim it actively, not just wait for recognition. Schedule that meeting. Make that ask. Present that proposal. The stars support your authority.\n\nFinancially, this is an excellent period for long-term planning. An investment or savings strategy you implement now could have significant returns. Your practical instincts are sharp — trust them.\n\nThe message for ${sign}: you've earned more than you're receiving. The gap between your value and your compensation is about to close — but you have to be the one to close it.`,
      Air: `Uranus and Mercury are conspiring to bring innovation to your career, and as a ${sign}, your ability to see connections others miss is your greatest professional asset right now.\n\nA creative idea, strategic pivot, or networking connection is about to accelerate your trajectory. Pay special attention to conversations with people outside your usual circle — your next big opportunity comes from an unexpected direction.\n\nThe tech or communication sector is especially favorable. If you've been thinking about building something, launching a project, or pivoting your approach — the stars are aligned for experimentation.\n\nThe cosmos advises ${sign}: your unique perspective isn't just different — it's valuable. Stop trying to make your ideas fit existing frameworks. Build a new one.`,
      Water: `Neptune is illuminating creative and unconventional paths to professional fulfillment, and as a ${sign}, your intuition is your most underrated career asset.\n\nYou're sensing a shift in your professional landscape before it becomes visible to others. Trust that. A role, project, or opportunity that seems unconventional is actually the most aligned path for your next chapter.\n\nFinancially, trust your gut about investments and opportunities — but verify with research. Your intuition provides the direction; due diligence provides the confirmation.\n\nThe stars remind ${sign}: your career isn't just about money or status. It's about meaning. When you align your work with your deeper purpose, abundance follows naturally. That alignment is closer than you think.`,
    },
    growth: {
      Fire: `Pluto's transformative energy is working on you at the deepest level, and as a ${sign}, you have the courage to meet this head-on. This isn't gentle growth — it's a metamorphosis.\n\nAn old pattern — perhaps around control, anger, or the need to always be strong — is ready to be released. You don't have to hold everything together all the time. The strongest version of ${sign} is the one who can be vulnerable.\n\nThe coming weeks bring a mirror moment: someone or something will show you exactly where you're still operating from fear rather than love. It might be uncomfortable. That discomfort is the price of freedom.\n\nYour growth assignment: practice stillness. Your ${element} nature wants to act, move, conquer. But the transformation happening now requires you to sit with yourself — no distractions, no battles to fight — and listen.`,
      Earth: `Saturn and the North Node are restructuring your inner world, and as a ${sign}, this process feels like renovating a house while living in it — uncomfortable but necessary.\n\nA belief about yourself that you've carried since childhood is ready to be examined. It might be about what you need to do to be worthy, or what success is supposed to look like, or how much you need to sacrifice to be loved. It served you once. It doesn't anymore.\n\nThe growth available to you right now is about redefining your relationship with security. True security doesn't come from controlling every variable — it comes from trusting yourself to handle whatever comes.\n\nYour growth assignment: identify one thing you do out of obligation rather than desire. Release it. The void it creates will fill with something that actually nourishes you.`,
      Air: `Mercury and Uranus are creating mental breakthroughs that could reshape your entire worldview, and as a ${sign}, you process transformation through understanding first.\n\nA thought pattern you've been running on autopilot is about to become visible. Once you see it, you can't unsee it — and that awareness is the beginning of profound change. This might relate to how you communicate, how you think about yourself, or stories you tell about your past.\n\nThe growth happening now is intellectual and spiritual simultaneously. A book, teacher, conversation, or sudden insight bridges the gap between what you know and who you are.\n\nYour growth assignment: notice your inner dialogue for one full day. The voice in your head isn't you — it's a program. Once you realize that, you can choose to run a different one.`,
      Water: `The Moon's nodes are activating the deepest layers of your emotional body, and as a ${sign}, this is sacred territory. The growth happening now isn't about becoming someone new — it's about remembering who you were before the world told you to be different.\n\nAn emotional pattern — perhaps around abandonment, enmeshment, or protecting yourself from pain — is surfacing for final resolution. This isn't a setback. It's a completion. The feelings that arise aren't old wounds reopening; they're old wounds finally closing.\n\nYour intuition is your compass through this process. Every time you override your feelings with logic, you slow down the healing. Every time you trust what you sense, you accelerate it.\n\nYour growth assignment: let yourself feel something fully — without numbing, intellectualizing, or caretaking someone else's feelings first. Your emotions aren't problems to solve. They're messages to receive.`,
    },
  };

  const teaser = teasers[focusArea]?.[element] || teasers.growth.Fire;
  const fullReading = fullReadings[focusArea]?.[element] || fullReadings.growth.Fire;

  return { teaser, fullReading, sign, element };
}

export async function POST(req: Request) {
  try {
    const { sign, focusArea, birthDate } = await req.json();

    if (!sign || !focusArea) {
      return Response.json(
        { error: 'Sign and focus area are required' },
        { status: 400 }
      );
    }

    const element = SIGN_ELEMENTS[sign] || 'Fire';

    // Try AI-generated reading, fall back to pre-written
    if (openai) {
      try {
        const focus = FOCUS_LABELS[focusArea] || focusArea;
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: 0.9,
          max_tokens: 1200,
          messages: [
            {
              role: 'system',
              content: `You are Stella, a mystical AI astrologer. Write personalized readings that feel specific, insightful, and slightly mysterious. Use astrological language naturally (transits, houses, aspects) but keep it accessible. The goal is to hook the reader and make them feel seen.

IMPORTANT FORMAT:
Return a JSON object with exactly two fields:
- "teaser": 3-4 sentences. This is the FREE preview. It must be intriguing, specific, and end with a cliffhanger that makes them desperate to read more. Start with "As a [Sign], ..."
- "fullReading": 3-4 paragraphs separated by \\n\\n. This is the DETAILED reading shown after email signup. Go deep — be specific about timing, actionable advice, and cosmic significance. Reference current planetary transits.

Both should reference the person's ${element} element nature and their focus on ${focus}.`,
            },
            {
              role: 'user',
              content: `Generate a personalized astrology reading for a ${sign} (${element} sign) born on ${birthDate}, who is focused on ${focus}. Make it feel deeply personal and insightful.`,
            },
          ],
          response_format: { type: 'json_object' },
        });

        const content = completion.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed.teaser && parsed.fullReading) {
            return Response.json({
              teaser: parsed.teaser,
              fullReading: parsed.fullReading,
              sign,
              element,
            });
          }
        }
      } catch (aiError) {
        console.error('AI reading generation failed, using fallback:', aiError);
      }
    }

    // Fallback to pre-written readings
    const fallback = getFallbackReading(sign, focusArea);
    return Response.json(fallback);
  } catch (error) {
    console.error('Quiz reading API error:', error);
    return Response.json(
      { error: 'Failed to generate reading' },
      { status: 500 }
    );
  }
}
