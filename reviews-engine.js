/**
 * Anti-Spam Combinatorial Review Generator Engine
 * Generates natural, human-sounding, category-tailored reviews.
 * Combinatorics: Openers × Connectors × Highlights × Closings => Hundreds of thousands of unique variants.
 */

const REVIEWS_ENGINE = (function() {
  // Category metadata, tailored phrase pools & quick chips
  const CATEGORIES = {
    clinic: {
      name: 'Medical & Dental Clinic',
      badge: 'Healthcare Clinic',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
      themeColor: '#0ea5e9',
      chips: [
        { label: '+ Polite staff', phrase: 'The front desk staff was courteous and welcoming.' },
        { label: '+ Short wait time', phrase: 'Appreciated having almost zero waiting time.' },
        { label: '+ Clean & hygienic', phrase: 'The clinic and treatment rooms are spotless and thoroughly sanitized.' },
        { label: '+ Thorough explanation', phrase: 'The doctor took the time to answer every question with patience.' },
        { label: '+ Gentle care', phrase: 'Felt completely at ease and well cared for throughout the visit.' }
      ],
      openers: [
        'Had a truly comfortable and reassuring appointment here recently.',
        'Visiting a clinic can often feel stressful, but my visit here was smooth and pleasant from start to finish.',
        'I recently came in for an appointment and was thoroughly impressed by the entire standard of care.',
        'Extremely grateful for the wonderful care I received during my visit today.',
        'Had a first-time consultation here and felt right at home immediately.',
        'My recent visit here completely exceeded my expectations.',
        'From the moment I scheduled my appointment to walking out the door, the service was top notch.',
        'I have been here a few times now and the quality of care is consistently outstanding.',
        'Came in for a checkup earlier today and had a very positive experience.',
        'Such a professional and compassionate medical practice.'
      ],
      highlights: [
        'the doctor listened attentively to all my concerns and explained every treatment option in plain language.',
        'the entire facility is spotlessly clean, modern, and very calming.',
        'the nursing staff and assistants were gentle, reassuring, and exceptionally professional.',
        'everything was handled on schedule without any unnecessary delays in the waiting room.',
        'the diagnostic equipment was state-of-the-art and the staff made sure I felt relaxed throughout.',
        'they genuinely take time to treat you as an individual rather than rushing through the appointment.',
        'the administrative check-in was seamless and all follow-up steps were communicated with great clarity.',
        'their gentle touch and patient demeanor made the procedure completely painless and stress-free.'
      ],
      connectors: [
        'On top of that,',
        'What stood out most was how',
        'In addition,',
        'Furthermore,',
        'I was particularly impressed that',
        'The environment was soothing, and'
      ],
      closings: [
        'I would recommend this clinic without hesitation to anyone seeking quality healthcare.',
        'Truly grateful for the compassionate service—definitely my go-to clinic moving forward.',
        'Finding trustworthy and gentle doctors is rare; they definitely deserve 5 stars.',
        'Thank you to the whole team for making this such a smooth and comforting experience!',
        'Will definitely be returning for all future checkups.',
        'Highly recommended to all friends and family in the area.'
      ]
    },

    cafe: {
      name: 'Cafe & Bakery',
      badge: 'Artisan Cafe & Coffee',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
      themeColor: '#d97706',
      chips: [
        { label: '+ Amazing coffee', phrase: 'The espresso blend was smooth, rich, and brewed to perfection.' },
        { label: '+ Cozy ambience', phrase: 'The atmosphere is warm, inviting, and wonderfully styled.' },
        { label: '+ Friendly baristas', phrase: 'The baristas greeted everyone with genuine smiles and great energy.' },
        { label: '+ Fresh pastries', phrase: 'The baked treats were fresh out of the oven and delicious.' },
        { label: '+ Great work vibe', phrase: 'Ideal place whether catching up with friends or getting some work done.' }
      ],
      openers: [
        'Found my new favorite coffee spot in town!',
        'Stopped by this charming cafe this morning and it absolutely brightened my day.',
        'Popped in for a quick caffeine boost and was blown away by the quality.',
        'Such a cozy and welcoming spot with an incredible atmosphere.',
        'Had a wonderful experience visiting here over the weekend.',
        'If you appreciate genuinely good coffee and warm hospitality, this place is a must.',
        'Dropped in for breakfast and coffee, and everything hit the spot.',
        'Came across this cafe recently and have already visited twice this week.',
        'One of the best cafe experiences I have had in a very long time.'
      ],
      highlights: [
        'the coffee was brewed to perfection—smooth, flavorful, and rich.',
        'the baristas were welcoming, passionate about their craft, and fast with orders.',
        'the interior decor creates such a relaxing, cozy vibe with great natural lighting and seating.',
        'the fresh pastries and food options paired wonderfully with our drinks.',
        'the background music was just right—neither too loud nor distracting, making it a perfect hangout.',
        'their attention to detail in presentation and latte art was a lovely touch.',
        'the menu had an impressive variety of specialty brews and dairy alternatives.'
      ],
      connectors: [
        'To make it even better,',
        'What made it extra special was that',
        'On top of the great drinks,',
        'The atmosphere was lovely, and',
        'Plus,',
        'Everything tasted fresh, and'
      ],
      closings: [
        'Already looking forward to my next morning visit!',
        'Cannot recommend this gem enough to fellow coffee lovers.',
        'An easy 5-star experience from start to finish.',
        'Will definitely be making this my regular weekly coffee stop.',
        'Kudos to the team for creating such a lovely neighborhood hangout!'
      ]
    },

    salon: {
      name: 'Hair, Beauty & Spa Salon',
      badge: 'Beauty & Wellness Salon',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
      themeColor: '#ec4899',
      chips: [
        { label: '+ Expert stylist', phrase: 'My stylist is truly a master of their craft and listened closely to my goals.' },
        { label: '+ Loved the result', phrase: 'Walked out feeling so confident and completely in love with the results.' },
        { label: '+ Relaxing vibe', phrase: 'The salon ambiance was calm, pampering, and rejuvenating.' },
        { label: '+ Punctual service', phrase: 'Started right on time with attentive care the whole way through.' },
        { label: '+ Premium products', phrase: 'Loved the high quality products they used; my hair/skin feels incredible.' }
      ],
      openers: [
        'Walked out of my appointment today feeling like a million bucks!',
        'Had an incredible pampering session here and could not be happier with the outcome.',
        'I am usually very particular about salon appointments, but they completely exceeded my hopes.',
        'Such a luxurious and rejuvenating experience from the moment I checked in.',
        'Booked an appointment based on recommendations and it lived up to every bit of the hype.',
        'First time visiting this salon and they have certainly earned a lifelong client.',
        'Always look forward to my appointments here—the level of skill is unmatched.'
      ],
      highlights: [
        'my stylist took the time during our consultation to understand exactly the look I wanted.',
        'the scalp massage and hair wash were so relaxing I almost fell asleep in the chair.',
        'their attention to detail, precision, and coloring technique were extraordinary.',
        'the salon space is chic, impeccably maintained, and feels like a boutique sanctuary.',
        'they used premium quality products that left my hair feeling silky, healthy, and revitalized.',
        'everyone on staff was so warm, attentive, and offered thoughtful styling tips for home maintenance.'
      ],
      connectors: [
        'Furthermore,',
        'Not only that, but',
        'What really set them apart was how',
        'The attention to detail was exceptional, and',
        'On top of the great styling,'
      ],
      closings: [
        'Have already received so many compliments today—thank you so much!',
        'Deserves every bit of a 5-star rating; already booked my next appointment.',
        'If you are looking for talented, caring professionals, look no further.',
        'Huge thanks to the team for the wonderful transformation and care!',
        'Could not recommend this salon more highly!'
      ]
    },

    retail: {
      name: 'Retail & Boutique',
      badge: 'Retail & Shopping',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
      themeColor: '#8b5cf6',
      chips: [
        { label: '+ Helpful staff', phrase: 'The staff was attentive and ready to help without hovering or pressure.' },
        { label: '+ Great selection', phrase: 'Impressive curation of products with lots of unique, high quality options.' },
        { label: '+ Fair prices', phrase: 'Excellent value for money and transparent pricing on everything.' },
        { label: '+ Neat & organized', phrase: 'The store layout is clean, well-lit, and very easy to browse.' },
        { label: '+ Easy checkout', phrase: 'Checkout was fast, friendly, and hassle-free.' }
      ],
      openers: [
        'Had a fantastic shopping experience here today.',
        'Stopped in to browse and ended up finding exactly what I was looking for.',
        'Such a wonderful store with a curated selection you do not find everywhere.',
        'Always a pleasure shopping at this location; the customer care is superb.',
        'Visited the store over the weekend and was so pleased with the whole experience.',
        'One of the best shopping experiences in the area with lovely customer service.'
      ],
      highlights: [
        'the staff members were so friendly, helpful, and pointed me right to what I needed.',
        'the merchandise is thoughtfully displayed, well-organized, and in pristine condition.',
        'they offer top-quality items at very competitive and fair prices.',
        'the associate offered genuine product guidance without being pushy in the slightest.',
        'the checkout process was speedy, polite, and thoughtfully packaged.'
      ],
      connectors: [
        'In addition,',
        'What I really appreciated was that',
        'On top of the great variety,',
        'The atmosphere inside made browsing a pleasure, and',
        'Also,'
      ],
      closings: [
        'Will definitely be returning next time I am shopping for gifts and essentials.',
        'Five stars for wonderful customer service and fantastic products.',
        'Highly recommend stopping by if you are in the neighborhood!',
        'A delightful local business that truly values its customers.'
      ]
    },

    general: {
      name: 'Business & Professional Services',
      badge: 'Verified Business',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      themeColor: '#2563eb',
      chips: [
        { label: '+ Polite staff', phrase: 'The team was polite, respectful, and very accommodating.' },
        { label: '+ Quick service', phrase: 'Everything was completed promptly and right on schedule.' },
        { label: '+ Fair pricing', phrase: 'Appreciated the clear communication and transparent, honest pricing.' },
        { label: '+ Professional work', phrase: 'Their workmanship and attention to detail were second to none.' },
        { label: '+ Highly recommend', phrase: 'Would wholeheartedly recommend their services to anyone in need.' }
      ],
      openers: [
        'Outstanding service and professionalism from beginning to end.',
        'Had a really seamless experience working with this business recently.',
        'I am thoroughly impressed by the responsiveness and high standard of service here.',
        'Came across them recently and they lived up to every positive review.',
        'It is refreshing to work with a team that truly takes pride in their work.',
        'I recently utilized their services and the entire process was smooth and stress-free.',
        'Consistently reliable, honest, and easy to deal with.'
      ],
      highlights: [
        'the team communicated clearly at every stage and answered all my questions promptly.',
        'they delivered exactly what was promised with remarkable attention to detail.',
        'their pricing was honest, transparent, and fair with zero hidden surprises.',
        'the staff arrived on time, was extremely courteous, and handled everything efficiently.',
        'their deep knowledge and expertise were evident right from the initial conversation.'
      ],
      connectors: [
        'On top of that,',
        'What stood out most was that',
        'Furthermore,',
        'In addition to their punctuality,',
        'They went above and beyond, and'
      ],
      closings: [
        'I would recommend them in a heartbeat to anyone looking for dependable service.',
        'A well-deserved 5 stars—will definitely be using their services again!',
        'Great job by the entire team; thank you for the wonderful experience.',
        'Hard to find this level of dedication and craftsmanship these days. Highly recommended!'
      ]
    }
  };

  // Keep a history of recently generated review hashes to guarantee uniqueness on consecutive clicks
  const recentHashes = new Set();
  const MAX_HISTORY = 30;

  function getRandomItem(array, excludeItem = null) {
    if (!array || array.length === 0) return '';
    let filtered = array;
    if (excludeItem && array.length > 1) {
      filtered = array.filter(item => item !== excludeItem);
    }
    const idx = Math.floor(Math.random() * filtered.length);
    return filtered[idx];
  }

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  /**
   * Generates a unique, natural review for the specified category.
   * Ensures that successive calls produce distinct wording.
   */
  function generateReview(categoryKey = 'general', businessName = 'this business') {
    const key = (categoryKey && CATEGORIES[categoryKey]) ? categoryKey.toLowerCase() : 'general';
    const cat = CATEGORIES[key];

    let review = '';
    let attempts = 0;

    while (attempts < 15) {
      attempts++;
      const opener = getRandomItem(cat.openers);
      const highlight1 = getRandomItem(cat.highlights);
      
      // 50% chance of combining two highlights for richer variety
      const useDoubleHighlight = Math.random() > 0.45;
      let bodySentence = '';

      if (useDoubleHighlight) {
        const highlight2 = getRandomItem(cat.highlights, highlight1);
        const connector1 = getRandomItem(cat.connectors);
        const secondaryConnectors = ['Furthermore,', 'In addition,', 'On top of that,', 'Also,'].filter(c => c !== connector1);
        const connector2 = getRandomItem(secondaryConnectors);
        bodySentence = ` ${connector1} ${highlight1.charAt(0).toLowerCase() + highlight1.slice(1)} ${connector2} ${highlight2.charAt(0).toLowerCase() + highlight2.slice(1)}`;
      } else {
        const connector = getRandomItem(cat.connectors);
        bodySentence = ` ${connector} ${highlight1.charAt(0).toLowerCase() + highlight1.slice(1)}`;
      }

      const closing = getRandomItem(cat.closings);

      // Assemble paragraph
      review = `${opener}${bodySentence} ${closing}`;

      // Clean up punctuation quirks if any
      review = review
        .replace(/\s+/g, ' ')
        .replace(/\s\./g, '.')
        .replace(/\.\./g, '.')
        .trim();

      const h = hashString(review);
      if (!recentHashes.has(h)) {
        recentHashes.add(h);
        if (recentHashes.size > MAX_HISTORY) {
          const firstItem = recentHashes.values().next().value;
          recentHashes.delete(firstItem);
        }
        break;
      }
    }

    return review;
  }

  function getCategoryConfig(categoryKey = 'general') {
    const key = (categoryKey && CATEGORIES[categoryKey]) ? categoryKey.toLowerCase() : 'general';
    return CATEGORIES[key];
  }

  function getAllCategories() {
    return Object.keys(CATEGORIES);
  }

  return {
    generateReview,
    getCategoryConfig,
    getAllCategories
  };
})();

// Export for module or browser window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = REVIEWS_ENGINE;
}
