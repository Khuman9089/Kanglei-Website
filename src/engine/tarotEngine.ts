export interface TarotCard {
  id: string;
  number: number;
  name: string;
  suit?: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
  arcana: 'Major' | 'Minor';
  element: 'Fire' | 'Water' | 'Air' | 'Earth' | 'Spirit';
  astrology: string; // Planet or Zodiac sign
  keywords: string[];
  upright: {
    summary: string;
    love: string;
    career: string;
    spirituality: string;
  };
  reversed: {
    summary: string;
    love: string;
    career: string;
    spirituality: string;
  };
  symbolism: string;
  vedicRemedy: string;
}

export interface SpreadPosition {
  index: number;
  title: string;
  shortRole: string;
  subtitle: string;
  purposeReason: string;
  deepMeaning: string;
  iconName: string;
}

export const SPREAD_POSITIONS: SpreadPosition[] = [
  {
    index: 0,
    title: 'Card 1: Current Aura & Core State',
    shortRole: 'Present Reality',
    subtitle: 'Where you stand right now at this exact moment in time',
    purposeReason: 'This card captures your immediate conscious energy, emotional state, and the dominant forces actively vibrating in your life today.',
    deepMeaning: 'It anchors the reading by highlighting what is happening on the surface and what demands your conscious attention.',
    iconName: 'Sun',
  },
  {
    index: 1,
    title: 'Card 2: The Hidden Cross & Challenge',
    shortRole: 'Obstacle / Friction',
    subtitle: 'Unseen friction, inner blocks, or immediate resistance',
    purposeReason: 'This card reveals the friction or testing point you are currently navigating. It explains the invisible wall you might be feeling.',
    deepMeaning: 'Rather than predicting misfortune, this card highlights karmic lessons, fears, or external blockages that must be transmuted.',
    iconName: 'ShieldAlert',
  },
  {
    index: 2,
    title: 'Card 3: The Subconscious Root & Karma',
    shortRole: 'Past / Root Cause',
    subtitle: 'Underlying karmic conditioning and past foundation',
    purposeReason: 'This card reflects the subconscious impulses, past life tendencies, or past events that laid the groundwork for your present situation.',
    deepMeaning: 'By understanding the origin point of your pattern, you gain clarity on why history repeats and how to break old cycles.',
    iconName: 'Anchor',
  },
  {
    index: 3,
    title: 'Card 4: Guiding Light & Near Future',
    shortRole: 'Next 1–3 Months',
    subtitle: 'Emerging frequencies and optimal next steps',
    purposeReason: 'This card acts as your intuitive compass, projecting the momentum of the next 1 to 3 months if your current trajectory continues.',
    deepMeaning: 'It shows the doorway opening right in front of you and the mindset needed to walk through it successfully.',
    iconName: 'Compass',
  },
  {
    index: 4,
    title: 'Card 5: External Forces & Social Aura',
    shortRole: 'Environment & Others',
    subtitle: 'How people, environment, and destiny forces view and affect you',
    purposeReason: 'This card illuminates how family, colleagues, partners, and your surrounding atmosphere influence your decisions and energy field.',
    deepMeaning: 'It helps you distinguish between your genuine inner voice and expectations or projections imposed by the outside world.',
    iconName: 'Users',
  },
  {
    index: 5,
    title: 'Card 6: Final Outcome & Divine Advice',
    shortRole: 'Ultimate Resolution',
    subtitle: 'Karmic synthesis, resolution, and spiritual remedy',
    purposeReason: 'This card provides the spiritual culmination of all 6 cards, delivering the ultimate outcome, wisdom takeaway, and actionable remedy.',
    deepMeaning: 'It gives you clear guidance on how to harmonize your actions with destiny to manifest the highest possible blessing.',
    iconName: 'Sparkles',
  },
];

export const TAROT_DECK: TarotCard[] = [
  // ── MAJOR ARCANA (22) ──────────────────────────────────────────────────────────
  {
    id: 'the-fool',
    number: 0,
    name: 'The Fool',
    suit: 'major',
    arcana: 'Major',
    element: 'Air',
    astrology: 'Uranus / Vayu Tattva',
    keywords: ['New Beginnings', 'Innocence', 'Leap of Faith', 'Spontaneity', 'Pure Potential'],
    upright: {
      summary: 'A fresh spiritual journey begins. Step forward into the unknown with an open heart, trusting the divine flow of the universe.',
      love: 'A thrilling new romantic chapter or spontaneous connection is emerging without baggage.',
      career: 'Ideal time for fresh startup ideas, new projects, or a daring leap into uncharted territory.',
      spirituality: 'Zero karmic resistance; your soul is ready for rebirth and unconditioned joy.',
    },
    reversed: {
      summary: 'Recklessness, fear of taking a necessary risk, or hesitating due to self-doubt. Ground yourself before stepping forward.',
      love: 'Impulsive relationship decisions or fear of emotional vulnerability.',
      career: 'Careless financial risks or lack of a structured plan before launching.',
      spirituality: 'Hesitation to trust your inner calling due to fear of the unknown.',
    },
    symbolism: 'A youth stepping off a cliff carrying a white rose of purity, watched by a loyal companion dog of instinct.',
    vedicRemedy: 'Chant Gayatri Mantra 11 times at sunrise to gain divine clarity for your new ventures.',
  },
  {
    id: 'the-magician',
    number: 1,
    name: 'The Magician',
    suit: 'major',
    arcana: 'Major',
    element: 'Air',
    astrology: 'Mercury / Budha',
    keywords: ['Manifestation', 'Resourcefulness', 'Willpower', 'Skill', 'Conscious Power'],
    upright: {
      summary: 'You possess all 4 elemental tools (fire, water, air, earth) needed to manifest your intentions into tangible reality.',
      love: 'Magnetic communication, effortless attraction, and alignment of desires with your partner.',
      career: 'High mastery of skills, successful negotiations, and the ability to turn abstract ideas into profits.',
      spirituality: 'As above, so below. You are a conscious co-creator with the universe.',
    },
    reversed: {
      summary: 'Untapped potential, miscommunication, illusion, or manipulation. Ensure your intentions are pure.',
      love: 'Mixed signals, secret agendas, or smooth talk masking lack of commitment.',
      career: 'Procrastination despite having great talent; beware of misleading business promises.',
      spirituality: 'Misusing mental power or feeling disconnected from your inner gifts.',
    },
    symbolism: 'Standing before an altar with the wand, cup, sword, and pentacle beneath the infinity symbol of endless potential.',
    vedicRemedy: 'Light a ghee lamp on Wednesday and chant "Om Budhaya Namaha" for intellect and speech mastery.',
  },
  {
    id: 'the-high-priestess',
    number: 2,
    name: 'The High Priestess',
    suit: 'major',
    arcana: 'Major',
    element: 'Water',
    astrology: 'Moon / Chandra',
    keywords: ['Intuition', 'Sacred Knowledge', 'Divine Feminine', 'Subconscious', 'Mystery'],
    upright: {
      summary: 'Silence the noisy external world and listen to your inner whispers. Secrets and spiritual epiphanies are revealing themselves.',
      love: 'Deep telepathic soul bond, quiet intimacy, and understanding beyond spoken words.',
      career: 'Rely on gut instinct rather than dry logic when evaluating contracts and partnerships.',
      spirituality: 'Your psychic gateway is wide open. Trust dreams, omens, and synchronicities.',
    },
    reversed: {
      summary: 'Ignoring your gut instincts, superficial gossip, or hidden truths creating unnecessary anxiety.',
      love: 'Repressed emotional needs or keeping secrets from someone you love.',
      career: 'Information is being withheld in office politics; investigate before signing.',
      spirituality: 'Doubt clouding your innate intuition; meditation in silence is required.',
    },
    symbolism: 'Seated between the twin pillars of light (Jachin) and dark (Boaz), holding the scroll of ancient wisdom.',
    vedicRemedy: 'Offer water to the Moon on Purnima (Full Moon) and wear white or silver on Mondays.',
  },
  {
    id: 'the-empress',
    number: 3,
    name: 'The Empress',
    suit: 'major',
    arcana: 'Major',
    element: 'Earth',
    astrology: 'Venus / Shukra',
    keywords: ['Abundance', 'Fertility', 'Creativity', 'Nurturing', 'Sensory Luxury'],
    upright: {
      summary: 'The garden of your life is entering full bloom. Creativity, financial comfort, and emotional sweetness surround you.',
      love: 'Warm, deeply affectionate romantic phase; domestic bliss, pregnancy, or deep commitment.',
      career: 'Creative projects flourish, investments yield fruitful harvest, and artistic ventures prosper.',
      spirituality: 'Deep connection with Mother Earth and recognizing the divine sacredness in all living things.',
    },
    reversed: {
      summary: 'Creative drought, over-dependence, neglecting self-care, or feeling unappreciated by those you nurture.',
      love: 'Suffocating affection, jealousy, or disharmony in the household.',
      career: 'Financial extravagance or lack of creative inspiration in your current workflow.',
      spirituality: 'Disconnect from nature and bodily health; spend time in gardens and forests.',
    },
    symbolism: 'Crowned with twelve stars, seated on plush cushions in a wheat field of golden bounty.',
    vedicRemedy: 'Chant "Om Shukraya Namaha" and feed cows or offer fragrant white flowers on Fridays.',
  },
  {
    id: 'the-emperor',
    number: 4,
    name: 'The Emperor',
    suit: 'major',
    arcana: 'Major',
    element: 'Fire',
    astrology: 'Aries / Mangal',
    keywords: ['Authority', 'Structure', 'Leadership', 'Discipline', 'Solid Foundation'],
    upright: {
      summary: 'Time to establish clear boundaries, take executive charge, and build a lasting empire with strategic discipline.',
      love: 'A reliable, protective partner providing emotional and financial security.',
      career: 'Promotion, leadership responsibilities, government clearance, and systematic organization.',
      spirituality: 'Mastery over the mind through yogic discipline and unwavering focus.',
    },
    reversed: {
      summary: 'Rigid stubbornness, abuse of power, micro-management, or feeling overwhelmed by overbearing authority.',
      love: 'Control issues, emotional coldness, or power struggles in the relationship.',
      career: 'Chaos due to lack of standard procedures, or friction with tyrannical bosses.',
      spirituality: 'Dogma and rigid rules choking your spontaneous spiritual growth.',
    },
    symbolism: 'Seated upon a stone throne carved with ram heads, holding the orb and scepter of earthly dominion.',
    vedicRemedy: 'Recite Hanuman Chalisa on Tuesdays to channel courage and authoritative wisdom without ego.',
  },
  {
    id: 'the-hierophant',
    number: 5,
    name: 'The Hierophant',
    suit: 'major',
    arcana: 'Major',
    element: 'Earth',
    astrology: 'Taurus / Guru & Brihaspati',
    keywords: ['Spiritual Wisdom', 'Tradition', 'Mentorship', 'Institution', 'Sacred Rituals'],
    upright: {
      summary: 'Honor timeless traditions, seek guidance from wise teachers, and align your choices with dharmic righteousness.',
      love: 'Traditional marriage, family blessing, shared cultural values, and sacred vows.',
      career: 'Success within established institutions, educational achievements, or mentoring junior colleagues.',
      spirituality: 'Connecting with ancestral lineages, guru blessings, and studying sacred texts.',
    },
    reversed: {
      summary: 'Challenging outdated customs, religious dogma, or feeling restricted by rigid societal expectations.',
      love: 'Unconventional relationships facing societal friction, or questioning traditional roles.',
      career: 'Bureaucracy stifling your creativity; finding alternative unconventional methods.',
      spirituality: 'Discovering your own inner guru instead of blindly following external authorities.',
    },
    symbolism: 'The spiritual pontiff seated between sacred pillars, raising his right hand in benediction.',
    vedicRemedy: 'Offer yellow flowers or turmeric to Lord Brihaspati (Jupiter) on Thursdays.',
  },
  {
    id: 'the-lovers',
    number: 6,
    name: 'The Lovers',
    suit: 'major',
    arcana: 'Major',
    element: 'Air',
    astrology: 'Gemini / Budha & Shukra',
    keywords: ['Soul Alignment', 'Love', 'Crucial Choice', 'Harmony', 'Dharmic Values'],
    upright: {
      summary: 'Deep romantic soul union and a crucial moral choice that defines your personal integrity and path.',
      love: 'Magnetic chemistry, twin-flame resonance, mutual vulnerability, and harmonious union.',
      career: 'Mutually beneficial business partnerships based on total transparency and shared values.',
      spirituality: 'Union of the inner masculine (Shiva) and inner feminine (Shakti) energies.',
    },
    reversed: {
      summary: 'Internal conflict, misalignment of values, indecision, or disharmony in a close bond.',
      love: 'Communication breakdown, one-sided devotion, or tempted by conflicting choices.',
      career: 'Business partner conflict or ethical compromises that conflict with your soul.',
      spirituality: 'Inner fragmentation; heal your internal duality through breathwork (Pranayama).',
    },
    symbolism: 'The angel Raphael blessing the primordial couple beneath the Tree of Life and Tree of Knowledge.',
    vedicRemedy: 'Light twin camphor lamps on Friday evenings for mutual affection and peace in partnerships.',
  },
  {
    id: 'the-chariot',
    number: 7,
    name: 'The Chariot',
    suit: 'major',
    arcana: 'Major',
    element: 'Water',
    astrology: 'Cancer / Chandra & Ketu',
    keywords: ['Triumph', 'Willpower', 'Direction', 'Determination', 'Overcoming Obstacles'],
    upright: {
      summary: 'Unstoppable forward momentum. Harness opposing forces through relentless determination and self-mastery.',
      love: 'Overcoming long-distance hurdles or emotional obstacles through focused dedication.',
      career: 'Winning contracts, defeating competitors, clearing exams, and swift career advancement.',
      spirituality: 'Steering the chariot of the mind and senses along the path of righteousness (Dharma).',
    },
    reversed: {
      summary: 'Loss of control, burnout, aggression, or spinning your wheels without clear direction.',
      love: 'Impatience and pushing too hard; allow the relationship to evolve organically.',
      career: 'Projects derailed by reckless haste; hit the brakes, review strategy, and refocus.',
      spirituality: 'Ego-driven ambition blinding you to subtle spiritual warnings.',
    },
    symbolism: 'A crowned warrior driving a chariot pulled by twin sphinxes of black and white, united by his will.',
    vedicRemedy: 'Chant "Om Namah Shivaya" 108 times to steer your inner senses with quiet poise.',
  },
  {
    id: 'strength',
    number: 8,
    name: 'Strength',
    suit: 'major',
    arcana: 'Major',
    element: 'Fire',
    astrology: 'Leo / Surya',
    keywords: ['Compassion', 'Courage', 'Patience', 'Gentle Power', 'Inner Mastery'],
    upright: {
      summary: 'True strength is not brute force, but infinite compassion, gentle patience, and mastery over your instincts.',
      love: 'Softening heated arguments through tenderness, forgiving past mistakes, and building deep trust.',
      career: 'Graceful problem-solving under extreme pressure; winning respect through emotional maturity.',
      spirituality: 'Taming the inner wild beast of raw ego with pure unconditional love and meditation.',
    },
    reversed: {
      summary: 'Self-doubt, explosive anger, feeling emotionally weak, or giving in to primal impulses.',
      love: 'Insecurity sparking jealous outbursts or withdrawing in wounded pride.',
      career: 'Imposter syndrome holding you back from claiming your rightful leadership position.',
      spirituality: 'Inner turbulence; practice Ahimsa (non-violence) towards yourself first.',
    },
    symbolism: 'A serene maiden gently opening the jaws of a lion beneath the lemniscate of infinite love.',
    vedicRemedy: 'Perform Surya Namaskar at sunrise and offer water (Arghya) with red sandalwood to the Sun.',
  },
  {
    id: 'the-hermit',
    number: 9,
    name: 'The Hermit',
    suit: 'major',
    arcana: 'Major',
    element: 'Earth',
    astrology: 'Virgo / Budha & Ketu',
    keywords: ['Soul Searching', 'Introspection', 'Solitude', 'Inner Light', 'Sage Guidance'],
    upright: {
      summary: 'Step away from the crowd. Sacred solitude, deep reflection, and meditation will illuminate the exact path forward.',
      love: 'A time for soul self-discovery before seeking external validation; deep mutual respect.',
      career: 'Independent research, scholarly work, writing, auditing, and deep strategic planning.',
      spirituality: 'Becoming your own inner lamp (Appo Deepo Bhava) as guided by ancient sages.',
    },
    reversed: {
      summary: 'Excessive isolation, loneliness, stubborn withdrawal, or ignoring valuable advice from loved ones.',
      love: 'Emotional walls pushing a loving partner away; fear of intimacy masquerading as independence.',
      career: 'Working in a silo causing misunderstandings; reconnect with team members.',
      spirituality: 'Spiritual ego or cynicism; reconnect with nature and human fellowship.',
    },
    symbolism: 'An ancient sage standing atop an icy mountain peak, holding the lantern of truth containing a 6-pointed star.',
    vedicRemedy: 'Spend 15 minutes in silent breath observation in a dimly lit room every evening.',
  },
  {
    id: 'wheel-of-fortune',
    number: 10,
    name: 'Wheel of Fortune',
    suit: 'major',
    arcana: 'Major',
    element: 'Fire',
    astrology: 'Jupiter / Brihaspati & Karmic Cycles',
    keywords: ['Karmic Turning Point', 'Destiny', 'Good Luck', 'Cycles of Life', 'Change'],
    upright: {
      summary: 'The cosmic wheel turns in your favor. Sudden breakthroughs, divine timing, and karmic rewards arrive.',
      love: 'Fateful encounters, serendipitous connections, and pleasant surprises in your romantic life.',
      career: 'A sudden stroke of good fortune, winning opportunities, promotions, and lucrative deals.',
      spirituality: 'Recognizing that life moves in eternal cycles (Samsara); stay centered at the hub of the wheel.',
    },
    reversed: {
      summary: 'Temporary setback, feeling out of control, or resisting the natural inevitable change of life.',
      love: 'Bad timing in romance; do not force matters, wait for the cycle to turn back.',
      career: 'Unpredictable market fluctuations; conserve resources and avoid gambling.',
      spirituality: 'Understanding that downs are merely the preparatory windup for future heights.',
    },
    symbolism: 'The wheel inscribed with letters T-A-R-O, surrounded by the four sacred celestial cherubs.',
    vedicRemedy: 'Donate food or yellow grains to the needy on Thursdays to invoke auspicious Jupiter blessings.',
  },
  {
    id: 'justice',
    number: 11,
    name: 'Justice',
    suit: 'major',
    arcana: 'Major',
    element: 'Air',
    astrology: 'Libra / Shukra & Shani',
    keywords: ['Truth', 'Fairness', 'Karmic Cause & Effect', 'Clarity', 'Law & Balance'],
    upright: {
      summary: 'Truth prevails. The scales of cosmic justice weigh all actions fairly, bringing righteous and balanced resolution.',
      love: 'Honest communication, mutual accountability, and equal partnership where both feel respected.',
      career: 'Legal victories, fair contractual settlements, transparent negotiations, and ethical rewards.',
      spirituality: 'Living in harmony with Universal Law (Rta); reaping the positive harvest of past good karma.',
    },
    reversed: {
      summary: 'Dishonesty, unfair treatment, bias, avoiding responsibility, or prolonged legal complications.',
      love: 'Blaming each other unfairly; refusing to see your own role in the relationship dispute.',
      career: 'Unethical shortcuts causing later problems; double-check contracts before committing.',
      spirituality: 'Refusing to acknowledge karmic debts; make amends and restore inner balance.',
    },
    symbolism: 'Seated crowned figure holding an upright double-edged sword in the right hand and scales of balance in the left.',
    vedicRemedy: 'Maintain complete truthfulness in speech and light a mustard oil lamp on Saturday evening.',
  },
  {
    id: 'the-hanged-man',
    number: 12,
    name: 'The Hanged Man',
    suit: 'major',
    arcana: 'Major',
    element: 'Water',
    astrology: 'Neptune / Varuna & Ketu',
    keywords: ['Surrender', 'New Perspective', 'Pause', 'Spiritual Insight', 'Letting Go'],
    upright: {
      summary: 'Pause, release the need to control the outcome, and look at the situation upside down for instant enlightenment.',
      love: 'Sacrificing small ego demands for deeper intimacy; viewing your partner with compassionate fresh eyes.',
      career: 'A temporary pause in momentum that allows you to refine your blueprint and avoid a major pitfall.',
      spirituality: 'Voluntary surrender of ego control; attaining profound mystical insights through tranquility.',
    },
    reversed: {
      summary: 'Unnecessary suffering, stubborn stalling, martyrdom, or resisting a required sacrifice.',
      love: 'Playing the victim in relationships; holding onto connections that have expired.',
      career: 'Wasting precious time in indecision; take the initiative rather than waiting endlessly.',
      spirituality: 'Spiritual stagnation caused by clinging desperately to old illusions.',
    },
    symbolism: 'Suspended upside down from a living T-cross tree with a luminous golden halo shining around the head.',
    vedicRemedy: 'Practice Shirshasana (headstand) or simple deep forward folds while releasing worries to the cosmos.',
  },
  {
    id: 'death',
    number: 13,
    name: 'Death (Transformation)',
    suit: 'major',
    arcana: 'Major',
    element: 'Water',
    astrology: 'Scorpio / Mangal & Pluto',
    keywords: ['Metamorphosis', 'End of a Cycle', 'Rebirth', 'Deep Transition', 'Clearing the Old'],
    upright: {
      summary: 'A profound ending makes way for an extraordinary rebirth. Shed the dead skin of the past with gratitude.',
      love: 'Closing painful relationship chapters to step into a refreshed, authentic union.',
      career: 'Leaving an obsolete role or outdated business model to embrace a vibrant new path.',
      spirituality: 'The phoenix rising from its ashes; spiritual liberation through ego dissolution.',
    },
    reversed: {
      summary: 'Fear of change, desperately clinging to toxic remnants of the past, and delaying inevitable transformation.',
      love: 'Obsessing over an ex or refusing to accept that an old dynamic must change.',
      career: 'Staying in a stagnant dead-end job purely out of fear of the unknown.',
      spirituality: 'Resisting the natural death of outdated beliefs; allow the old to fall away.',
    },
    symbolism: 'A mystical skeleton knight riding a white horse bearing a black banner with the white mystic rose of life.',
    vedicRemedy: 'Perform a decluttering ritual in your home and chant Maha Mrityunjaya Mantra 21 times.',
  },
  {
    id: 'temperance',
    number: 14,
    name: 'Temperance',
    suit: 'major',
    arcana: 'Major',
    element: 'Fire',
    astrology: 'Sagittarius / Brihaspati',
    keywords: ['Alchemy', 'Balance', 'Patience', 'Moderation', 'Healing'],
    upright: {
      summary: 'Divine alchemy. Blending opposing elements into flawless harmony through patience, moderation, and spiritual grace.',
      love: 'Deep mutual emotional healing, peaceful compromise, and balanced give-and-take.',
      career: 'Diplomatic leadership, smooth team integration, and sustainable steady progress.',
      spirituality: 'Synthesizing the higher and lower self into centered peaceful alignment.',
    },
    reversed: {
      summary: 'Excess, impatience, mood swings, disharmony, and extreme all-or-nothing behavior.',
      love: 'Emotional volatility, overreacting to trivial matters, or lack of patience.',
      career: 'Rushing deadlines recklessly; burning through savings or energy reserves.',
      spirituality: 'Loss of inner equilibrium; balance your chakras with gentle pranayama.',
    },
    symbolism: 'A winged angel pouring liquid between two golden chalices without spilling a single drop.',
    vedicRemedy: 'Drink water stored in a copper vessel in the morning and practice gentle Anulom-Vilom pranayama.',
  },
  {
    id: 'the-devil',
    number: 15,
    name: 'The Devil',
    suit: 'major',
    arcana: 'Major',
    element: 'Earth',
    astrology: 'Capricorn / Shani & Rahu',
    keywords: ['Illusion of Bondage', 'Materialism', 'Obsession', 'Shadow Self', 'Breaking Free'],
    upright: {
      summary: 'Recognize the illusions and unhealthy attachments chaining your spirit. The chains are loose—you can walk free anytime.',
      love: 'Toxic codependency, intense obsession, or physical lust masking lack of real emotional depth.',
      career: 'Feeling trapped in a golden cage; becoming overly obsessed with wealth at the expense of ethics.',
      spirituality: 'Confronting your shadow side and integrating it with conscious light.',
    },
    reversed: {
      summary: 'Breaking free from addiction, releasing toxic patterns, regaining sovereignty, and reclaiming your power.',
      love: 'Cutting ties with toxic dynamics, establishing healthy personal boundaries, and healing.',
      career: 'Escaping a restrictive work contract, taking control of your financial destiny.',
      spirituality: 'Major breakthrough in shadow work; spiritual liberation from material illusion (Maya).',
    },
    symbolism: 'A horned figure perched on an altar while a man and woman stand loosely chained around their necks.',
    vedicRemedy: 'Light a sesame oil lamp and chant "Om Sham Shanaischaraya Namaha" to sever karmic attachments.',
  },
  {
    id: 'the-tower',
    number: 16,
    name: 'The Tower',
    suit: 'major',
    arcana: 'Major',
    element: 'Fire',
    astrology: 'Mars / Mangal & Rahu',
    keywords: ['Sudden Awakening', 'Shattering Illusion', 'Breakthrough', 'Liberation', 'Revelation'],
    upright: {
      summary: 'Lightning of divine truth shatters false foundations. Though shocking at first, this collapse frees you from deception.',
      love: 'A sudden truth comes to light, dismantling illusions and forcing authentic clarity.',
      career: 'Unexpected corporate shakeup or project collapse that frees you to build a genuine enterprise.',
      spirituality: 'Kundalini awakening shattering the rigid fortress of false ego identity.',
    },
    reversed: {
      summary: 'Avoiding an inevitable collapse, clinging to sinking structures, or fearing necessary disruption.',
      love: 'Sweeping fundamental issues under the rug to avoid difficult discussions.',
      career: 'Propping up a failing business model instead of pivoting cleanly.',
      spirituality: 'Suppressed spiritual crisis; embrace the shakeup as sacred liberation.',
    },
    symbolism: 'Lightning striking a stone tower on a mountain precipice, knocking off the golden crown of pride.',
    vedicRemedy: 'Recite the Durga Kavacham or chant "Om Durgayei Namaha" for protection during sudden transitions.',
  },
  {
    id: 'the-star',
    number: 17,
    name: 'The Star',
    suit: 'major',
    arcana: 'Major',
    element: 'Air',
    astrology: 'Aquarius / Shani & Varuna',
    keywords: ['Hope', 'Inspiration', 'Healing', 'Divine Faith', 'Wishes Fulfilled'],
    upright: {
      summary: 'Breathe deeply. The storm has passed and a radiant starlight of peace, renewal, and miraculous blessings showers over you.',
      love: 'Unconditional love, renewal of hope after heartbreak, and tender spiritual intimacy.',
      career: 'Your authentic talents are recognized; long-term dreams find fertile ground to blossom.',
      spirituality: 'Direct connection with cosmic cosmic consciousness and profound soul rejuvenation.',
    },
    reversed: {
      summary: 'Temporary loss of faith, pessimism, feeling disconnected from inspiration, or feeling drained.',
      love: 'Losing hope in love after disappointment; practice gentle self-love first.',
      career: 'Creative block or undervaluing your true potential; reconnect with your core purpose.',
      spirituality: 'Spiritual dry spell; spend time under starlit night skies in calm gratitude.',
    },
    symbolism: 'A naked maiden pouring waters of life onto land and pool beneath an eight-pointed radiant star.',
    vedicRemedy: 'Place a bowl of clean water with floating jasmine flowers in the North-East corner of your room.',
  },
  {
    id: 'the-moon',
    number: 18,
    name: 'The Moon',
    suit: 'major',
    arcana: 'Major',
    element: 'Water',
    astrology: 'Pisces / Chandra & Rahu',
    keywords: ['Illusion', 'Subconscious Fears', 'Dreams', 'Intuition', 'Hidden Mysteries'],
    upright: {
      summary: 'Navigate the misty waters of the subconscious. Beware of phantom fears and illusions—trust your inner radar.',
      love: 'Uncertainty, intense moodiness, or projecting past traumas onto your present partner.',
      career: 'Things are not as they appear; avoid making major commitments until total clarity emerges.',
      spirituality: 'Vivid prophetic dreams, deep astral sensitivity, and psychic unfolding.',
    },
    reversed: {
      summary: 'Lifting of confusion, seeing through deception, conquering deep-seated fears, and restoring clarity.',
      love: 'Misunderstandings resolved; hidden feelings openly admitted and embraced.',
      career: 'Uncovering the hidden facts behind a confusing deal; finding practical solutions.',
      spirituality: 'Grounding psychic energy safely into daily practical life.',
    },
    symbolism: 'A full moon dripping dew over a winding path between twin towers, flanked by a dog and wolf howling.',
    vedicRemedy: 'Keep a clean silver coin or wear pearls on Mondays to stabilize Moon vibrations and emotions.',
  },
  {
    id: 'the-sun',
    number: 19,
    name: 'The Sun',
    suit: 'major',
    arcana: 'Major',
    element: 'Fire',
    astrology: 'Sun / Surya Dev',
    keywords: ['Joy', 'Success', 'Vitality', 'Celebration', 'Radiant Positivity'],
    upright: {
      summary: 'Pure radiance, vitality, and triumphant success! Everything in your path is illuminated with warmth, fortune, and joy.',
      love: 'Warm, exuberant love, shared laughter, blissful celebrations, and mutual pride.',
      career: 'Accolades, glowing leadership, financial abundance, and triumphant achievements.',
      spirituality: 'Illumination of the soul; living in pure alignment with the Supreme Light (Paramatman).',
    },
    reversed: {
      summary: 'Temporary overcast sky, delayed celebrations, or struggling to see the bright side despite good fortune.',
      love: 'Minor ego clashes or taking a partner\'s warmth for granted; reignite the spark.',
      career: 'Success is near but slightly delayed; maintain enthusiasm and positive attitude.',
      spirituality: 'Burnout from excessive extroverted energy; recharge in quiet sunshine.',
    },
    symbolism: 'A joyful child crowned with flowers riding a calm white horse beneath a blazing smiling sun.',
    vedicRemedy: 'Chant the Aditya Hridaya Stotra or offer daily morning prayers facing East.',
  },
  {
    id: 'judgement',
    number: 20,
    name: 'Judgement',
    suit: 'major',
    arcana: 'Major',
    element: 'Fire',
    astrology: 'Pluto / Yama & Karmic Harvest',
    keywords: ['Higher Calling', 'Reckoning', 'Awakening', 'Absolution', 'Karmic Elevation'],
    upright: {
      summary: 'The cosmic trumpet sounds your soul\'s higher calling. Forgive the past, awaken to your purpose, and step into your true power.',
      love: 'Major relationship evaluation resulting in either deep renewed commitment or liberating peaceful closure.',
      career: 'Heeding a true vocational calling; stepping onto the path you were born to walk.',
      spirituality: 'Total spiritual resurrection; casting aside old karmic guilt and standing in grace.',
    },
    reversed: {
      summary: 'Harsh self-criticism, ignoring your soul\'s calling, indecisiveness, or wallowing in past regret.',
      love: 'Dwelling on past mistakes in romance; refusing to forgive yourself or partner.',
      career: 'Ignoring a great opportunity due to imposter syndrome or self-limiting beliefs.',
      spirituality: 'Refusing to step into your spiritual maturity; heed the inner call.',
    },
    symbolism: 'Archangel Gabriel blowing the golden horn from the heavens as figures rise joyfully from open tombs.',
    vedicRemedy: 'Practice Kshama Prarthana (prayer of universal forgiveness) before sleeping every night.',
  },
  {
    id: 'the-world',
    number: 21,
    name: 'The World',
    suit: 'major',
    arcana: 'Major',
    element: 'Earth',
    astrology: 'Saturn / Shani & Moksha',
    keywords: ['Completion', 'Wholeness', 'Global Travel', 'Fulfillment', 'Ultimate Victory'],
    upright: {
      summary: 'You have completed a monumental life cycle with excellence. The world is at your feet—celebrate this sacred wholeness.',
      love: 'Ultimate fulfillment, finding your soul\'s true home in partnership, or harmonious long-distance unions.',
      career: 'Project completion, global recognition, achieving major milestones, and abundant rewards.',
      spirituality: 'Self-realization, cosmic consciousness, and harmonious completion of a karmic lesson.',
    },
    reversed: {
      summary: 'Missing the final step, procrastination near the finish line, or seeking closure from external sources.',
      love: 'Lack of emotional closure with past connections preventing full immersion in the present.',
      career: 'Near the finish line of a major project—do not cut corners in the final stages.',
      spirituality: 'Almost completing a spiritual cycle; remain patient and persistent.',
    },
    symbolism: 'A dancing maiden enveloped in a green laurel wreath, surrounded by the four sacred guardians of heaven.',
    vedicRemedy: 'Perform a peaceful thanksgiving prayer to your Ishta Devata and offer sweets to children.',
  },

  // ── MINOR ARCANA SELECTION (Key Power Cards) ──────────────────────────────────
  {
    id: 'ace-of-cups',
    number: 1,
    name: 'Ace of Cups',
    suit: 'cups',
    arcana: 'Minor',
    element: 'Water',
    astrology: 'Cancer / Scorpio / Pisces (Jala Tattva)',
    keywords: ['Overflowing Love', 'Emotional Awakening', 'Intuition', 'Compassion'],
    upright: {
      summary: 'The chalice of your heart overflows with pure love, spiritual grace, and emotional replenishment.',
      love: 'The dawn of a deeply emotional, soul-nourishing romance or profound emotional healing.',
      career: 'Creative inspiration at its peak; artistic projects and human-centric businesses flourish.',
      spirituality: 'Bhakti yoga; feeling overwhelming divine love and deep peace within.',
    },
    reversed: {
      summary: 'Emotional blockage, drained feelings, or withholding love out of fear of getting hurt.',
      love: 'Feeling unappreciated or emotional exhaustion in relationships.',
      career: 'Lack of passion in daily work; replenish your emotional reservoir.',
      spirituality: 'Spiritual dryness; connect with water bodies and meditation.',
    },
    symbolism: 'A divine hand offering a golden chalice overflowing with five streams of spiritual water.',
    vedicRemedy: 'Offer water to Lord Shiva with raw milk and white flowers on Mondays.',
  },
  {
    id: 'three-of-cups',
    number: 3,
    name: 'Three of Cups',
    suit: 'cups',
    arcana: 'Minor',
    element: 'Water',
    astrology: 'Mercury in Cancer',
    keywords: ['Celebration', 'Sisterhood & Brotherhood', 'Joyous Gathering', 'Community'],
    upright: {
      summary: 'Raise your glass! Joyful reunions, community gatherings, weddings, and celebratory milestones arrive.',
      love: 'Celebrations with family, engagement parties, or deepening social warmth.',
      career: 'Collaborative team success, successful product launches, and festive company milestones.',
      spirituality: 'Satsang; the transformative power of gathering with fellow spiritual seekers.',
    },
    reversed: {
      summary: 'Over-indulgence, gossip, feeling excluded from social circles, or partying at the expense of duty.',
      love: 'Third-party interference or superficial social interactions creating friction.',
      career: 'Unproductive office gossip or social distractions derailing deadlines.',
      spirituality: 'Seeking external validation instead of cultivating genuine inner peace.',
    },
    symbolism: 'Three maidens in colorful robes dancing in a circle, raising golden goblets of wine in toast.',
    vedicRemedy: 'Distribute sweets or fruits to friends and neighbors on a festive day.',
  },
  {
    id: 'ace-of-wands',
    number: 1,
    name: 'Ace of Wands',
    suit: 'wands',
    arcana: 'Minor',
    element: 'Fire',
    astrology: 'Aries / Leo / Sagittarius (Agni Tattva)',
    keywords: ['Creative Spark', 'New Passion', 'Inspiration', 'Bold Initiative'],
    upright: {
      summary: 'A blazing spark of divine inspiration strikes. Unleash your passionate drive and start that daring project now.',
      love: 'Fiery chemistry, passionate sparks, and exciting new romantic adventures.',
      career: 'Breakthrough startup idea, fresh entrepreneurial energy, and explosive growth momentum.',
      spirituality: 'Awakening of spiritual fire (Tapas); eager enthusiasm for sadhana.',
    },
    reversed: {
      summary: 'Lack of motivation, delays in launching, creative frustration, or misdirected energy.',
      love: 'Fading passion or impatience leading to short-lived friction.',
      career: 'A great idea struggling to find practical traction; refine your action plan.',
      spirituality: 'Feeling spiritually sluggish; rekindle your inner fire through active yoga.',
    },
    symbolism: 'A divine hand emerging from a cloud holding a budding wooden wand sprouting green leaves.',
    vedicRemedy: 'Light a diya facing East every morning and invoke Agni Devata for vitality.',
  },
  {
    id: 'six-of-wands',
    number: 6,
    name: 'Six of Wands',
    suit: 'wands',
    arcana: 'Minor',
    element: 'Fire',
    astrology: 'Jupiter in Leo',
    keywords: ['Victory', 'Public Recognition', 'Triumph', 'Pride', 'Applause'],
    upright: {
      summary: 'Public acclaim and triumphant victory! Your hard work is celebrated and rewarded on the public stage.',
      love: 'A proud, harmonious relationship that receives full admiration from family and community.',
      career: 'Winning awards, promotions, successful presentations, and public praise.',
      spirituality: 'Overcoming internal doubts and standing victorious in your spiritual integrity.',
    },
    reversed: {
      summary: 'Ego pride, delayed recognition, fear of public scrutiny, or hollow praise.',
      love: 'Arrogance damaging intimacy; prioritize empathy over being right.',
      career: 'Credit stolen by others or recognition taking longer than expected.',
      spirituality: 'Beware of spiritual vanity; remember humility is the mother of all virtues.',
    },
    symbolism: 'A crowned hero riding a decorated white horse through a cheering crowd with a laurel wreath on his wand.',
    vedicRemedy: 'Offer red hibiscus flowers to Lord Surya on Sunday morning.',
  },
  {
    id: 'ace-of-swords',
    number: 1,
    name: 'Ace of Swords',
    suit: 'swords',
    arcana: 'Minor',
    element: 'Air',
    astrology: 'Gemini / Libra / Aquarius (Vayu Tattva)',
    keywords: ['Mental Breakthrough', 'Absolute Truth', 'Clarity', 'Sharp Intellect'],
    upright: {
      summary: 'The sword of truth cuts through confusion. Razor-sharp mental clarity and liberating insights emerge.',
      love: 'Honest, breakthrough communication clearing up past confusion and setting healthy expectations.',
      career: 'Brilliant intellectual strategy, clearing complex exams, and winning debates or negotiations.',
      spirituality: 'Cutting the ropes of delusion with the sword of Jnana (true knowledge).',
    },
    reversed: {
      summary: 'Mental fog, harsh words, miscommunication, or overthinking leading to paralysis.',
      love: 'Blunt, cutting words causing hurt; choose compassion in speech.',
      career: 'Clouded judgment; postpone major contract decisions until emotional calm returns.',
      spirituality: 'Intellectualizing spirituality rather than experiencing it directly in silence.',
    },
    symbolism: 'A radiant hand holding an upright double-edged sword crowned with a golden laurel of victory.',
    vedicRemedy: 'Chant the Saraswati Vandana or "Om Aim Saraswatyai Namaha" for flawless clarity.',
  },
  {
    id: 'six-of-swords',
    number: 6,
    name: 'Six of Swords',
    suit: 'swords',
    arcana: 'Minor',
    element: 'Air',
    astrology: 'Mercury in Aquarius',
    keywords: ['Transition to Calm', 'Leaving Turmoil', 'Healing Journey', 'Safe Passage'],
    upright: {
      summary: 'Moving from turbulent storms into calm, peaceful waters. The worst is behind you; smooth sailing lies ahead.',
      love: 'Leaving toxic dynamics behind and transitioning together into emotional stability and peace.',
      career: 'Relocating for better career opportunities or moving on from a high-stress workplace.',
      spirituality: 'Emotional baggage being gently released as your soul enters a period of tranquility.',
    },
    reversed: {
      summary: 'Carrying old baggage into new spaces, unfinished business, or resisting necessary relocation.',
      love: 'Refusing to let go of old grievances; dragging past arguments into present moments.',
      career: 'Unwanted delays in travel or job transition; wrap up pending tasks first.',
      spirituality: 'Struggling to find mental peace; practice mindfulness meditation.',
    },
    symbolism: 'A ferryman steering a boat carrying a cloaked mother and child across waters toward a peaceful shore.',
    vedicRemedy: 'Feed fish in a pond or river with bread crumbs to facilitate smooth karmic transitions.',
  },
  {
    id: 'ace-of-pentacles',
    number: 1,
    name: 'Ace of Pentacles',
    suit: 'pentacles',
    arcana: 'Minor',
    element: 'Earth',
    astrology: 'Taurus / Virgo / Capricorn (Prithvi Tattva)',
    keywords: ['Financial Prosperity', 'New Opportunity', 'Material Wealth', 'Security'],
    upright: {
      summary: 'A golden gift from the universe. Tangible wealth, lucrative career offers, and solid financial seeds are planted.',
      love: 'A stable, grounded relationship with long-term marital security and shared material dreams.',
      career: 'New job offer, capital funding, salary raise, or high-yield property investment.',
      spirituality: 'Seeing divinity manifested in the physical world; practicing sacred abundance and gratitude.',
    },
    reversed: {
      summary: 'Missed financial opportunity, poor budgeting, greed, or instability in physical health.',
      love: 'Financial disagreements causing strain in a partnership; establish transparent budgets.',
      career: 'Delays in funding or bad investment decisions; be cautious with expenditures.',
      spirituality: 'Becoming overly entangled in materialism; balance wealth with charity.',
    },
    symbolism: 'A divine hand holding a shining golden coin over a lush archway of white lilies and roses.',
    vedicRemedy: 'Keep your wallet organized, place a Sri Yantra in your North quadrant, and chant "Om Shreem Mahalakshmiyei Namaha".',
  },
  {
    id: 'ten-of-pentacles',
    number: 10,
    name: 'Ten of Pentacles',
    suit: 'pentacles',
    arcana: 'Minor',
    element: 'Earth',
    astrology: 'Mercury in Virgo',
    keywords: ['Generational Wealth', 'Family Legacy', 'Long-term Security', 'Heritage'],
    upright: {
      summary: 'Ultimate generational prosperity, lasting family security, ancestral blessings, and enduring success.',
      love: 'Deep family approval, solid domestic security, multi-generational harmony, and marriage.',
      career: 'Building a lasting legacy, family business expansion, property acquisition, and retirement security.',
      spirituality: 'Honoring ancestors (Pitrus) and leaving a righteous, loving heritage for future generations.',
    },
    reversed: {
      summary: 'Family disputes over inheritance, financial losses in family business, or neglecting traditional roots.',
      love: 'Family interference in your relationship or financial stress straining domestic harmony.',
      career: 'Risky long-term investments; ensure proper legal documentation for estate matters.',
      spirituality: 'Pitru Dosha or disconnect from ancestral rituals; perform tarpanam or charitable acts in their honor.',
    },
    symbolism: 'Three generations of a family gathered in an ancient stone courtyard surrounded by 10 golden coins arranged as the Tree of Life.',
    vedicRemedy: 'Water a Peepal tree on Saturday mornings and donate black sesame seeds to honor ancestors.',
  },
];

/**
 * Helper to get random drawn cards
 */
export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: SpreadPosition;
}

export function drawRandomCards(count: number = 6): DrawnCard[] {
  const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return selected.map((card, idx) => {
    // 25% chance of card being drawn in reversed orientation for realistic tarot distribution
    const isReversed = Math.random() < 0.25;
    return {
      card,
      isReversed,
      position: SPREAD_POSITIONS[idx] || SPREAD_POSITIONS[0],
    };
  });
}

/**
 * Synthesize overall reading
 */
export function synthesizeTarotReading(drawnCards: DrawnCard[]): {
  dominantElement: string;
  overallTheme: string;
  majorArcanaCount: number;
  karmicWeight: 'High Karmic Evolution' | 'Active Daily Cycle' | 'Balanced Spiritual Transition';
  actionableSummary: string;
  astrologicalBridge: string;
} {
  const elements = drawnCards.map((d) => d.card.element);
  const elementCounts = elements.reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let dominantElement = 'Spirit';
  let maxCount = 0;
  for (const [el, count] of Object.entries(elementCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantElement = el;
    }
  }

  const majorArcanaCount = drawnCards.filter((d) => d.card.arcana === 'Major').length;
  const karmicWeight =
    majorArcanaCount >= 4
      ? 'High Karmic Evolution'
      : majorArcanaCount >= 2
      ? 'Balanced Spiritual Transition'
      : 'Active Daily Cycle';

  const elementNarratives: Record<string, string> = {
    Fire: 'Your spread is ablaze with Fire energy, indicating dynamic action, rapid breakthroughs, intense passion, and courage to initiate new ventures.',
    Water: 'Your spread is deeply rooted in Water energy, emphasizing heightened intuition, emotional healing, soul connections, and profound subconscious clarity.',
    Air: 'Your spread is driven by Air energy, focusing on mental breakthroughs, truth-seeking, swift communication, strategic clarity, and decisive choices.',
    Earth: 'Your spread is anchored in Earth energy, signifying tangible financial prosperity, grounded stability, long-term security, and physical manifestation.',
    Spirit: 'Your spread is elevated by Spirit energy, aligning your daily consciousness directly with divine cosmic timing and karmic lessons.',
  };

  const actionableSummary = `With ${majorArcanaCount} Major Arcana archetypes present, your situation is undergoing ${karmicWeight.toLowerCase()}. The dominant ${dominantElement} element suggests you should lean into ${
    dominantElement === 'Fire'
      ? 'bold proactive courage and creative leadership.'
      : dominantElement === 'Water'
      ? 'deep intuitive introspection and emotional truth.'
      : dominantElement === 'Air'
      ? 'clear, honest communication and strategic planning.'
      : 'grounded practical patience and sustainable resource management.'
  }`;

  const astrologicalBridge = `In Vedic astrology, this spread activates the energies of ${drawnCards.map((d) => d.card.astrology.split('/')[0].trim()).slice(0, 3).join(', ')}. Harmonize your daily schedule with these planetary frequencies through the provided remedies.`;

  return {
    dominantElement,
    overallTheme: elementNarratives[dominantElement] || elementNarratives.Fire,
    majorArcanaCount,
    karmicWeight,
    actionableSummary,
    astrologicalBridge,
  };
}
