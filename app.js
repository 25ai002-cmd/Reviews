/**
 * NFC Smart Review Card System - Frontend Application Logic
 * Supports dynamic URL params, anti-spam combinatorial generator,
 * interactive keyword chips, star ratings, and the seamless "Copy & Redirect" flow.
 */

(function() {
  'use strict';

  // Fallback defaults as specified in requirements
  const DEFAULTS = {
    placeid: 'ChIJ67svB4SDXjkR9yp6UifRj84',
    name: 'Our Business',
    category: 'general'
  };

  // State
  let currentParams = {
    placeid: DEFAULTS.placeid,
    name: DEFAULTS.name,
    category: DEFAULTS.category
  };

  let appliedChips = new Set();
  let currentRating = 5;

  // DOM Elements
  const el = {
    businessName: document.getElementById('business-name'),
    categoryBadge: document.getElementById('category-badge'),
    categoryAvatar: document.getElementById('category-avatar'),
    reviewTextarea: document.getElementById('review-textarea'),
    keywordChips: document.getElementById('keyword-chips'),
    shuffleBtn: document.getElementById('shuffle-btn'),
    clearTextBtn: document.getElementById('clear-text-btn'),
    charCount: document.getElementById('char-count'),
    wordCount: document.getElementById('word-count'),
    qualityBadge: document.getElementById('quality-badge'),
    copyRedirectBtn: document.getElementById('copy-redirect-btn'),
    directGoogleLink: document.getElementById('direct-google-link'),
    starRating: document.getElementById('star-rating'),
    ratingSentiment: document.getElementById('rating-sentiment'),
    toastOverlay: document.getElementById('toast-overlay'),
    toastProgress: document.getElementById('toast-progress'),
    confettiCanvas: document.getElementById('confetti-canvas'),
    // Modal elements
    toggleDemoBtn: document.getElementById('toggle-demo-btn'),
    demoModal: document.getElementById('demo-modal'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    cfgName: document.getElementById('cfg-name'),
    cfgCategory: document.getElementById('cfg-category'),
    cfgPlaceid: document.getElementById('cfg-placeid'),
    cfgFullUrl: document.getElementById('cfg-full-url'),
    copyUrlBtn: document.getElementById('copy-url-btn'),
    applyCfgBtn: document.getElementById('apply-cfg-btn'),
    presetChips: document.querySelectorAll('.preset-chip')
  };

  // Rating sentiments
  const RATING_MESSAGES = {
    5: '"Exceptional Experience! ⭐⭐⭐⭐⭐"',
    4: '"Really Great Experience! ⭐⭐⭐⭐"',
    3: '"Good Experience! ⭐⭐⭐"',
    2: '"Fair Experience ⭐⭐"',
    1: '"Needs Improvement ⭐"'
  };

  // Preset sample businesses for the admin/demo modal
  const PRESET_DATA = {
    clinic: { name: 'Apex Dental & Wellness', category: 'clinic', placeid: 'ChIJ67svB4SDXjkR9yp6UifRj84' },
    cafe: { name: 'Artisan Roast & Bakery', category: 'cafe', placeid: 'ChIJ67svB4SDXjkR9yp6UifRj84' },
    salon: { name: 'Luxe Hair & Spa Lounge', category: 'salon', placeid: 'ChIJ67svB4SDXjkR9yp6UifRj84' },
    retail: { name: 'Nordic Living Boutique', category: 'retail', placeid: 'ChIJ67svB4SDXjkR9yp6UifRj84' },
    general: { name: 'Summit Pro Solutions', category: 'general', placeid: 'ChIJ67svB4SDXjkR9yp6UifRj84' }
  };

  /**
   * Parse URL Query Parameters with safe fallbacks
   */
  function parseUrlParams() {
    const searchParams = new URLSearchParams(window.location.search);
    
    const placeid = searchParams.get('placeid')?.trim() || DEFAULTS.placeid;
    const name = searchParams.get('name')?.trim() || DEFAULTS.name;
    let category = searchParams.get('category')?.trim()?.toLowerCase() || DEFAULTS.category;

    // Validate category exists in engine, else fallback
    const validCategories = REVIEWS_ENGINE.getAllCategories();
    if (!validCategories.includes(category)) {
      category = DEFAULTS.category;
    }

    currentParams = { placeid, name, category };
  }

  /**
   * Build the Google Write Review redirect target URL
   */
  function getGoogleReviewUrl(placeid) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeid)}`;
  }

  /**
   * Initialize or update UI based on current client parameters
   */
  function applyClientConfig() {
    const catConfig = REVIEWS_ENGINE.getCategoryConfig(currentParams.category);

    // Document title
    document.title = `Review ${currentParams.name} on Google`;

    // Business identity
    el.businessName.textContent = currentParams.name;
    el.categoryBadge.textContent = catConfig.badge || catConfig.name;
    el.categoryAvatar.innerHTML = catConfig.icon;
    el.categoryAvatar.style.color = catConfig.themeColor || 'var(--color-primary)';
    el.categoryAvatar.style.backgroundColor = `${catConfig.themeColor}18` || 'var(--color-primary-subtle)';

    // Direct Google Review link
    const targetUrl = getGoogleReviewUrl(currentParams.placeid);
    el.directGoogleLink.href = targetUrl;

    // Render keyword chips for this category
    renderKeywordChips(catConfig.chips);

    // Generate initial unique review
    generateAndPopulateReview();

    // Sync modal fields
    el.cfgName.value = currentParams.name;
    el.cfgCategory.value = currentParams.category;
    el.cfgPlaceid.value = currentParams.placeid;
    updateModalUrlPreview();
  }

  /**
   * Render category-relevant quick-tap keyword chips
   */
  function renderKeywordChips(chips) {
    el.keywordChips.innerHTML = '';
    appliedChips.clear();

    if (!chips || chips.length === 0) return;

    chips.forEach((chip, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip-btn';
      btn.textContent = chip.label;
      btn.dataset.index = index;

      btn.addEventListener('click', () => {
        handleChipTap(btn, chip);
      });

      el.keywordChips.appendChild(btn);
    });
  }

  /**
   * Handle tapping a keyword chip
   */
  function handleChipTap(btn, chip) {
    const currentText = el.reviewTextarea.value.trim();
    const phrase = chip.phrase;

    // Check if phrase is already present in review
    if (currentText.includes(phrase)) {
      // Toggle off / remove
      let updated = currentText.replace(phrase, '').replace(/\s+/g, ' ').trim();
      el.reviewTextarea.value = updated;
      btn.classList.remove('applied');
      btn.textContent = chip.label;
      appliedChips.delete(chip.label);
    } else {
      // Append naturally with clean punctuation
      let updated = currentText;
      if (updated.length > 0 && !/[.!?]$/.test(updated)) {
        updated += '.';
      }
      updated += ` ${phrase}`;
      el.reviewTextarea.value = updated.trim();
      btn.classList.add('applied');
      btn.textContent = `✓ ${chip.label.replace('+ ', '')}`;
      appliedChips.add(chip.label);
    }

    // Trigger subtle vibration if supported
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }

    updateCounters();
  }

  /**
   * Generate and populate review into textarea
   */
  function generateAndPopulateReview() {
    const review = REVIEWS_ENGINE.generateReview(currentParams.category, currentParams.name);
    el.reviewTextarea.value = review;
    
    // Reset chip visual states
    appliedChips.clear();
    const chipBtns = el.keywordChips.querySelectorAll('.chip-btn');
    chipBtns.forEach(btn => {
      btn.classList.remove('applied');
      const originalLabel = btn.textContent.replace('✓ ', '+ ');
      btn.textContent = originalLabel;
    });

    updateCounters();
  }

  /**
   * Update character count, word count, and quality indicator
   */
  function updateCounters() {
    const text = el.reviewTextarea.value.trim();
    const chars = text.length;
    const words = text ? text.split(/\s+/).length : 0;

    el.charCount.textContent = `${chars} chars`;
    el.wordCount.textContent = `${words} words`;

    // Quality badge logic
    if (chars === 0) {
      el.qualityBadge.textContent = 'Empty';
      el.qualityBadge.style.background = '#f1f5f9';
      el.qualityBadge.style.color = '#64748b';
    } else if (chars < 50) {
      el.qualityBadge.textContent = 'A bit short';
      el.qualityBadge.style.background = '#fef3c7';
      el.qualityBadge.style.color = '#b45309';
    } else if (chars >= 50 && chars <= 280) {
      el.qualityBadge.textContent = 'Optimal for Google';
      el.qualityBadge.style.background = '#ecfdf5';
      el.qualityBadge.style.color = '#059669';
    } else {
      el.qualityBadge.textContent = 'Detailed review';
      el.qualityBadge.style.background = '#e8f0fe';
      el.qualityBadge.style.color = '#1a73e8';
    }
  }

  /**
   * Star rating selector
   */
  function initStarRating() {
    const stars = el.starRating.querySelectorAll('.star-btn');

    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating, 10);
        currentRating = rating;

        stars.forEach(s => {
          const r = parseInt(s.dataset.rating, 10);
          if (r <= rating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });

        el.ratingSentiment.textContent = RATING_MESSAGES[rating] || '';
        
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
      });
    });
  }

  /**
   * Ultra-reliable clipboard copy function with iOS Safari fallback
   */
  async function copyToClipboard(text) {
    if (!text) return false;

    // Method 1: Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('navigator.clipboard failed, attempting fallback...', err);
      }
    }

    // Method 2: Hidden textarea execCommand fallback (works on older Safari/WebViews)
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error('Fallback execCommand copy failed:', err);
      return false;
    }
  }

  /**
   * Confetti celebration burst on canvas
   */
  function fireConfetti() {
    const canvas = el.confettiCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#1a73e8', '#34a853', '#fbbc05', '#ea4335', '#ec4899', '#8b5cf6'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 50,
        r: Math.random() * 5 + 3,
        d: Math.random() * 70,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18 - 4,
        gravity: 0.5,
        opacity: 1
      });
    }

    let animationFrame;
    const startTime = Date.now();

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.tiltAngle += p.tiltAngleIncremental;
        p.tilt = Math.sin(p.tiltAngle) * 12;

        if (elapsed > 600) {
          p.opacity = Math.max(0, 1 - (elapsed - 600) / 600);
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      if (elapsed < 1400) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    render();
  }

  /**
   * Primary "Copy & Redirect" Action Flow
   */
  async function handleCopyAndRedirect() {
    const textToCopy = el.reviewTextarea.value.trim();
    const targetUrl = getGoogleReviewUrl(currentParams.placeid);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([40, 30, 40]);
    }

    // Execute copy
    await copyToClipboard(textToCopy);

    // Trigger visual confetti
    fireConfetti();

    // Show toast overlay
    el.toastOverlay.classList.add('visible');
    el.toastOverlay.setAttribute('aria-hidden', 'false');

    // Animate progress bar
    el.toastProgress.style.width = '0%';
    setTimeout(() => {
      el.toastProgress.style.width = '100%';
    }, 20);

    // Redirect after 850ms so user clearly perceives the success state
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 850);
  }

  /**
   * Dynamic Modal URL Preview
   */
  function updateModalUrlPreview() {
    const nameVal = el.cfgName.value.trim() || DEFAULTS.name;
    const catVal = el.cfgCategory.value.trim() || DEFAULTS.category;
    const placeidVal = el.cfgPlaceid.value.trim() || DEFAULTS.placeid;

    const base = window.location.origin + window.location.pathname;
    const generatedUrl = `${base}?placeid=${encodeURIComponent(placeidVal)}&name=${encodeURIComponent(nameVal)}&category=${encodeURIComponent(catVal)}`;
    el.cfgFullUrl.value = generatedUrl;
  }

  /**
   * Event Listeners & Binding
   */
  function bindEvents() {
    // New Idea (Shuffle)
    el.shuffleBtn.addEventListener('click', () => {
      el.shuffleBtn.classList.add('spinning');
      if (navigator.vibrate) {
        navigator.vibrate(25);
      }
      setTimeout(() => {
        generateAndPopulateReview();
        el.shuffleBtn.classList.remove('spinning');
      }, 200);
    });

    // Textarea input
    el.reviewTextarea.addEventListener('input', updateCounters);

    // Clear text
    el.clearTextBtn.addEventListener('click', () => {
      el.reviewTextarea.value = '';
      el.reviewTextarea.focus();
      updateCounters();
      if (navigator.vibrate) {
        navigator.vibrate(15);
      }
    });

    // Primary CTA Copy & Redirect
    el.copyRedirectBtn.addEventListener('click', handleCopyAndRedirect);

    // Modal triggers
    el.toggleDemoBtn.addEventListener('click', () => {
      updateModalUrlPreview();
      el.demoModal.classList.add('visible');
      el.demoModal.setAttribute('aria-hidden', 'false');
    });

    el.closeModalBtn.addEventListener('click', () => {
      el.demoModal.classList.remove('visible');
      el.demoModal.setAttribute('aria-hidden', 'true');
    });

    el.demoModal.addEventListener('click', (e) => {
      if (e.target === el.demoModal) {
        el.demoModal.classList.remove('visible');
        el.demoModal.setAttribute('aria-hidden', 'true');
      }
    });

    // Modal input changes
    ['input', 'change'].forEach(evt => {
      el.cfgName.addEventListener(evt, updateModalUrlPreview);
      el.cfgCategory.addEventListener(evt, updateModalUrlPreview);
      el.cfgPlaceid.addEventListener(evt, updateModalUrlPreview);
    });

    // Modal Preset chips
    el.presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const key = chip.dataset.preset;
        const preset = PRESET_DATA[key];
        if (preset) {
          el.cfgName.value = preset.name;
          el.cfgCategory.value = preset.category;
          el.cfgPlaceid.value = preset.placeid;
          updateModalUrlPreview();
        }
      });
    });

    // Modal Copy URL
    el.copyUrlBtn.addEventListener('click', async () => {
      await copyToClipboard(el.cfgFullUrl.value);
      const originalText = el.copyUrlBtn.textContent;
      el.copyUrlBtn.textContent = 'Copied!';
      setTimeout(() => {
        el.copyUrlBtn.textContent = originalText;
      }, 1500);
    });

    // Modal Apply button
    el.applyCfgBtn.addEventListener('click', () => {
      currentParams.name = el.cfgName.value.trim() || DEFAULTS.name;
      currentParams.category = el.cfgCategory.value.trim() || DEFAULTS.category;
      currentParams.placeid = el.cfgPlaceid.value.trim() || DEFAULTS.placeid;

      // Update URL without full reload
      const newUrl = `${window.location.pathname}?placeid=${encodeURIComponent(currentParams.placeid)}&name=${encodeURIComponent(currentParams.name)}&category=${encodeURIComponent(currentParams.category)}`;
      window.history.replaceState({}, '', newUrl);

      applyClientConfig();
      el.demoModal.classList.remove('visible');
    });

    // Star rating
    initStarRating();
  }

  /**
   * App Initialization
   */
  function init() {
    parseUrlParams();
    applyClientConfig();
    bindEvents();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
