/* ==========================================================================
   FBO Survey Engine -- Config-driven, generic survey framework
   ========================================================================== */

(function () {
  'use strict';

  // ── Utility: seeded PRNG (mulberry32) ──────────────────────────────────
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6d2b79f5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function hashString(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function seededShuffle(arr, seed) {
    var rng = mulberry32(seed);
    var shuffled = arr.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = tmp;
    }
    return shuffled;
  }

  // ── Utility: simple HTML escaping ──────────────────────────────────────
  function esc(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Utility: render digit on canvas (anti-AI) ──────────────────────────
  // Draws a number on an HTML5 canvas with visual noise so that the digit
  // is not present as text in the DOM. Humans read it easily; text-based
  // AI tools reading the page source see only a <canvas> element.
  function renderDigitOnCanvas(canvas, digit) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background noise dots
    var noiseCount = 25 + Math.floor(Math.random() * 15);
    for (var i = 0; i < noiseCount; i++) {
      ctx.fillStyle = 'rgba(' +
        Math.floor(180 + Math.random() * 60) + ',' +
        Math.floor(180 + Math.random() * 60) + ',' +
        Math.floor(200 + Math.random() * 55) + ',' +
        (0.25 + Math.random() * 0.25) + ')';
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Random slight rotation and jitter
    var angle = (Math.random() - 0.5) * 10 * Math.PI / 180;
    var jitterX = (Math.random() - 0.5) * 4;
    var jitterY = (Math.random() - 0.5) * 4;

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(angle);

    var text = String(digit);
    var fontFamily = getComputedStyle(document.body).fontFamily || 'sans-serif';
    var fontSize = text.length > 1 ? 30 : 36;
    ctx.font = 'bold ' + fontSize + 'px ' + fontFamily;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Shadow
    ctx.fillStyle = 'rgba(58, 12, 163, 0.12)';
    ctx.fillText(text, jitterX + 1.5, jitterY + 1.5);

    // Main digit
    ctx.fillStyle = '#3a0ca3';
    ctx.fillText(text, jitterX, jitterY);

    ctx.restore();

    // Subtle noise lines
    ctx.strokeStyle = 'rgba(200, 200, 210, 0.15)';
    ctx.lineWidth = 0.5;
    for (var j = 0; j < 3; j++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, Math.random() * h);
      ctx.lineTo(Math.random() * w, Math.random() * h);
      ctx.stroke();
    }
  }

  // Draws all pending digit canvases after innerHTML is set.
  // - pendingMap: object { canvasId: digitValue } for trial pages (no DOM leakage)
  // - Also draws any <canvas class="digit-canvas" data-d="X"> for instruction examples
  function drawDigitCanvases(pendingMap) {
    if (pendingMap) {
      var ids = Object.keys(pendingMap);
      for (var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);
        if (el) renderDigitOnCanvas(el, pendingMap[ids[i]]);
      }
    }
    // Instruction/example canvases (data-d attribute is acceptable here)
    var attrCanvases = document.querySelectorAll('canvas.digit-canvas[data-d]');
    for (var j = 0; j < attrCanvases.length; j++) {
      renderDigitOnCanvas(attrCanvases[j], attrCanvases[j].getAttribute('data-d'));
    }
  }

  // ── SurveyEngine ───────────────────────────────────────────────────────
  function SurveyEngine(config) {
    this.config = config;
    this.pages = [];
    this.currentPageIndex = 0;
    this.responses = {};
    this.timing = {};
    this.trialGuesses = {};     // trialId -> guess value
    this.prolificPID = '';
    this.studyID = '';
    this.sessionID = '';
    this.condition = '';
    this.comprehensionAttempts = 0;
    this.comprehensionFailed = false;
    this.attentionResults = [];
    this.trialAttentionResults = [];  // recall checks after selected trials
    this.bonusInfo = null;
    this.minTimeTimer = null;
    this.minTimeReady = true;
    this.submitted = false;
    this.blockBoundaryIndices = [];  // Page indices where blocks start (no going back)

    // DOM refs
    this.elContent = document.getElementById('pageContent');
    this.elNavButtons = document.getElementById('navButtons');
    this.elBtnNext = document.getElementById('btnNext');
    this.elBtnBack = document.getElementById('btnBack');
    this.elProgressContainer = document.getElementById('progressContainer');
    this.elProgressFill = document.getElementById('progressFill');
    this.elProgressLabel = document.getElementById('progressLabel');
    this.elMinTimeOverlay = document.getElementById('minTimeOverlay');
    this.elMinTimeCountdown = document.getElementById('minTimeCountdown');
  }

  // ── Init ───────────────────────────────────────────────────────────────
  SurveyEngine.prototype.init = function () {
    // Parse URL params (Prolific)
    var params = new URLSearchParams(window.location.search);
    this.prolificPID = params.get('PROLIFIC_PID') || params.get('prolific_pid') || '';
    this.studyID = params.get('STUDY_ID') || params.get('study_id') || '';
    this.sessionID = params.get('SESSION_ID') || params.get('session_id') || '';

    // Assign condition
    this.condition = this.assignCondition(
      this.prolificPID,
      this.config.conditions || ['default']
    );

    // Build page sequence
    this.buildPageSequence();

    // Check for saved progress
    if (window.DataStorage) {
      var saved = window.DataStorage.loadProgress();
      if (saved && saved.prolificPID === this.prolificPID && saved.currentPageIndex > 0) {
        if (confirm('It looks like you have saved progress. Would you like to resume where you left off?')) {
          this.responses = saved.responses || {};
          this.timing = saved.timing || {};
          this.trialGuesses = saved.trialGuesses || {};
          this.condition = saved.condition || this.condition;
          this.comprehensionAttempts = saved.comprehensionAttempts || 0;
          this.attentionResults = saved.attentionResults || [];
          this.trialAttentionResults = saved.trialAttentionResults || [];
          this.currentPageIndex = saved.currentPageIndex;
        }
      }
    }

    // Start bot detector
    if (window.BotDetector) {
      window.BotDetector.startTracking();
    }

    // Wire up navigation
    var self = this;
    this.elBtnNext.addEventListener('click', function () { self.nextPage(); });
    this.elBtnBack.addEventListener('click', function () { self.prevPage(); });

    // Render first page
    this.renderPage(this.currentPageIndex);
  };

  // ── Condition Assignment ───────────────────────────────────────────────
  SurveyEngine.prototype.assignCondition = function (pid, conditions) {
    if (!pid || conditions.length <= 1) return conditions[0] || 'default';
    var hash = hashString(pid);
    return conditions[hash % conditions.length];
  };

  // ── Display Format for Block ────────────────────────────────────────────
  // Maps (condition, block number) to display format ('clean' or 'explicit').
  SurveyEngine.prototype.getDisplayFormat = function (block) {
    if (this.condition === 'clean_first') {
      return block === 1 ? 'clean' : 'explicit';
    }
    return block === 1 ? 'explicit' : 'clean';
  };

  // ── Condition Key for Template Matching ─────────────────────────────────
  // Returns 'clean_first' or 'explicit_first' for <!--if:--> templates.
  SurveyEngine.prototype.getFormatOrder = function () {
    return this.condition;
  };

  // ── Build Page Sequence ────────────────────────────────────────────────
  SurveyEngine.prototype.buildPageSequence = function () {
    var self = this;
    this.pages = [];
    this.blockBoundaryIndices = [];

    (this.config.pages || []).forEach(function (page) {
      if (page.type === 'trial_block') {
        var block = page.block || 1;
        var displayFormat = self.getDisplayFormat(block);

        // Expand trial block into individual trial pages
        var trials = (page.trials || []).slice();

        // Seeded random shuffle with no-same-k-adjacency constraint.
        // Prevents consecutive trials from having the same k value,
        // which would show similar disclosed sets back to back.
        if (self.prolificPID) {
          var baseSeed = hashString(self.prolificPID + '_trials_block' + block);
          var src = (page.trials || []).slice();
          for (var attempt = 0; attempt < 10; attempt++) {
            var trySeed = hashString(baseSeed.toString() + '_' + attempt);
            trials = seededShuffle(src, trySeed);
            // Greedy fix: swap clashing trial with next non-clashing one
            for (var fi = 1; fi < trials.length; fi++) {
              if (trials[fi].k === trials[fi - 1].k) {
                for (var fj = fi + 1; fj < trials.length; fj++) {
                  if (trials[fj].k !== trials[fi - 1].k) {
                    var tmp = trials[fi]; trials[fi] = trials[fj]; trials[fj] = tmp;
                    break;
                  }
                }
              }
            }
            // Check if all violations resolved
            var ok = true;
            for (var ci = 1; ci < trials.length; ci++) {
              if (trials[ci].k === trials[ci - 1].k) { ok = false; break; }
            }
            if (ok) break;
          }
        }

        // Record block boundary (first page of this block)
        self.blockBoundaryIndices.push(self.pages.length);

        trials.forEach(function (trial, idx) {
          // N-intro page before each trial
          self.pages.push({
            id: trial.id + '_intro_b' + block,
            type: 'trial_intro',
            trial: trial,
            trialIndex: idx,
            totalTrials: trials.length,
            block: block,
            displayFormat: displayFormat
          });
          // Trial page
          self.pages.push({
            id: trial.id + '_b' + block,
            type: 'trial',
            trial: trial,
            trialIndex: idx,
            totalTrials: trials.length,
            block: block,
            displayFormat: displayFormat,
            blockId: page.id
          });
        });
      } else if (page.type === 'transition') {
        // Record transition as a block boundary (no going back past this)
        self.blockBoundaryIndices.push(self.pages.length);
        self.pages.push(page);
      } else {
        self.pages.push(page);
      }
    });

    // Insert trial attention checks after 3 selected trials
    this.insertTrialAttentionChecks();
  };

  // ── Trial Attention Check Insertion ──────────────────────────────────
  // Inserts recall-based attention checks after 3 seeded trial pages,
  // spread across thirds of the experiment.
  SurveyEngine.prototype.insertTrialAttentionChecks = function () {
    var numChecks = this.config.trialAttentionCount || 0;
    if (numChecks <= 0 || !this.prolificPID) return;

    // Find all trial page indices
    var trialIndices = [];
    for (var i = 0; i < this.pages.length; i++) {
      if (this.pages[i].type === 'trial') trialIndices.push(i);
    }
    if (trialIndices.length === 0) return;

    // Select one trial from each third (seeded by PID)
    var thirdSize = Math.floor(trialIndices.length / numChecks);
    var seed = hashString(this.prolificPID + '_attn_select');
    var rng = mulberry32(seed);
    var selected = [];
    for (var c = 0; c < numChecks; c++) {
      var start = c * thirdSize;
      var end = (c === numChecks - 1) ? trialIndices.length : (c + 1) * thirdSize;
      var pick = start + Math.floor(rng() * (end - start));
      selected.push(trialIndices[pick]);
    }

    // Insert in reverse order so splicing doesn't shift earlier indices
    selected.sort(function (a, b) { return b - a; });
    for (var s = 0; s < selected.length; s++) {
      var idx = selected[s];
      var trialPage = this.pages[idx];
      this.pages.splice(idx + 1, 0, {
        type: 'trial_attention',
        id: 'trial_attn_' + trialPage.trial.id + '_b' + trialPage.block,
        trial: trialPage.trial,
        block: trialPage.block,
        displayFormat: trialPage.displayFormat
      });
    }

    // Recompute block boundary indices (insertions shifted positions)
    this.blockBoundaryIndices = [];
    var seenBlocks = {};
    for (var bi = 0; bi < this.pages.length; bi++) {
      var p = this.pages[bi];
      if (p.type === 'transition') {
        this.blockBoundaryIndices.push(bi);
      } else if (p.type === 'trial_intro' && !seenBlocks[p.block]) {
        seenBlocks[p.block] = true;
        this.blockBoundaryIndices.push(bi);
      }
    }
  };

  // ── Progress ───────────────────────────────────────────────────────────
  SurveyEngine.prototype.updateProgress = function () {
    var total = this.pages.length;
    var current = this.currentPageIndex;
    var pct = Math.round(((current) / total) * 100);
    this.elProgressFill.style.width = pct + '%';
    this.elProgressLabel.textContent = 'Page ' + (current + 1) + ' of ' + total;
    this.elProgressContainer.style.display = '';
  };

  // ── Page Rendering ─────────────────────────────────────────────────────
  SurveyEngine.prototype.renderPage = function (index) {
    var page = this.pages[index];
    if (!page) return;

    this.currentPageIndex = index;

    // Clear min-time state
    this.clearMinTime();
    this.minTimeReady = true;

    // Animate transition
    var self = this;
    this.elContent.classList.add('page-exit');
    setTimeout(function () {
      self.elContent.classList.remove('page-exit');

      var html = '';
      switch (page.type) {
        case 'welcome':        html = self.renderWelcome(page); break;
        case 'consent':        html = self.renderConsent(page); break;
        case 'instructions':   html = self.renderInstructions(page); break;
        case 'comprehension':  html = self.renderComprehension(page); break;
        case 'trial_intro':    html = self.renderTrialIntro(page); break;
        case 'trial':          html = self.renderTrial(page); break;
        case 'transition':     html = self.renderTransition(page); break;
        case 'attention_check': html = self.renderAttentionCheck(page); break;
        case 'trial_attention': html = self.renderTrialAttention(page); break;
        case 'questionnaire':  html = self.renderQuestionnaire(page); break;
        case 'debrief':        html = self.renderDebrief(page); break;
        default:               html = '<p>Unknown page type: ' + esc(page.type) + '</p>';
      }

      self.elContent.innerHTML = html;
      self.elContent.style.animation = 'none';
      // Force reflow
      void self.elContent.offsetHeight;
      self.elContent.style.animation = '';

      // Show/hide nav buttons
      var showNav = page.type !== 'debrief';
      self.elNavButtons.style.display = showNav ? '' : 'none';

      // Back button: hidden on first page, certain types, and block boundaries
      var atBoundary = self.blockBoundaryIndices.indexOf(index) !== -1;
      var noBack = index === 0 || page.type === 'welcome' || page.type === 'debrief'
                   || page.type === 'comprehension' || page.type === 'transition'
                   || page.type === 'trial_attention' || atBoundary;
      self.elBtnBack.style.display = noBack ? 'none' : '';

      // Next button text
      if (page.type === 'welcome') {
        self.elBtnNext.textContent = page.buttonText || 'Begin';
      } else if (page.type === 'transition') {
        self.elBtnNext.textContent = 'Begin Part 2';
      } else if (index === self.pages.length - 2) {
        self.elBtnNext.textContent = 'Submit';
      } else {
        self.elBtnNext.textContent = 'Next';
      }

      // Enable/disable next based on min time
      self.elBtnNext.disabled = false;
      if (page.minTimeSeconds && page.minTimeSeconds > 0) {
        self.enforceMinTime(page.minTimeSeconds);
      }

      // Update progress
      self.updateProgress();

      // Record page start time
      self.recordPageStart(index);

      // Attach click handlers
      self.attachOptionCardHandlers();
      self.attachConsentHandler();

      // Attach slider event listener (trial pages)
      var slider = document.getElementById('trial_guess');
      var sliderDisplay = document.getElementById('slider_value');
      if (slider && sliderDisplay && slider.type === 'range') {
        slider.addEventListener('input', function () {
          sliderDisplay.textContent = parseFloat(slider.value).toFixed(1);
          slider.setAttribute('data-touched', 'true');
        });
      }

      // Draw digit canvases (anti-AI: digits rendered on canvas, not as text)
      drawDigitCanvases(self._pendingCanvases);
      self._pendingCanvases = {};

      // Scroll to top
      window.scrollTo(0, 0);
    }, 200);
  };

  // ── Consent Checkbox Handling ──────────────────────────────────────────
  SurveyEngine.prototype.attachConsentHandler = function () {
    var wrapper = document.getElementById('consent_wrapper');
    if (!wrapper) return;
    wrapper.addEventListener('click', function (e) {
      // Don't double-toggle if they clicked the checkbox directly
      var cb = document.getElementById('consent_agree');
      if (e.target !== cb) {
        cb.checked = !cb.checked;
      }
    });
  };

  // ── Option Card Click Handling ─────────────────────────────────────────
  SurveyEngine.prototype.attachOptionCardHandlers = function () {
    var cards = document.querySelectorAll('.option-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var input = card.querySelector('input');
        if (!input) return;
        if (input.type === 'radio') {
          // Deselect siblings
          var name = input.name;
          document.querySelectorAll('input[name="' + name + '"]').forEach(function (r) {
            r.closest('.option-card').classList.remove('selected');
          });
          input.checked = true;
          card.classList.add('selected');
        } else if (input.type === 'checkbox') {
          input.checked = !input.checked;
          card.classList.toggle('selected', input.checked);
        }
      });
    });
  };

  // ── Timing ─────────────────────────────────────────────────────────────
  SurveyEngine.prototype.recordPageStart = function (index) {
    var page = this.pages[index];
    if (!this.timing[page.id]) {
      this.timing[page.id] = {};
    }
    this.timing[page.id].startTime = Date.now();
  };

  SurveyEngine.prototype.recordPageEnd = function (index) {
    var page = this.pages[index];
    var t = this.timing[page.id];
    if (t && t.startTime) {
      t.endTime = Date.now();
      t.durationMs = t.endTime - t.startTime;
    }
  };

  // ── Min Time Enforcement ───────────────────────────────────────────────
  SurveyEngine.prototype.enforceMinTime = function (seconds) {
    var self = this;
    this.minTimeReady = false;
    this.elBtnNext.disabled = true;

    var remaining = seconds;
    this.elMinTimeOverlay.style.display = '';
    this.elMinTimeCountdown.textContent = '(' + remaining + 's)';

    this.minTimeTimer = setInterval(function () {
      remaining--;
      if (remaining <= 0) {
        self.clearMinTime();
        self.minTimeReady = true;
        self.elBtnNext.disabled = false;
      } else {
        self.elMinTimeCountdown.textContent = '(' + remaining + 's)';
      }
    }, 1000);
  };

  SurveyEngine.prototype.clearMinTime = function () {
    if (this.minTimeTimer) {
      clearInterval(this.minTimeTimer);
      this.minTimeTimer = null;
    }
    this.elMinTimeOverlay.style.display = 'none';
  };

  // ── Navigation ─────────────────────────────────────────────────────────
  SurveyEngine.prototype.nextPage = function () {
    if (!this.minTimeReady) return;

    var page = this.pages[this.currentPageIndex];

    // Special handling for comprehension
    if (page.type === 'comprehension') {
      var passed = this.handleComprehensionCheck(page);
      if (!passed) return;
    }

    // Special handling for attention checks
    if (page.type === 'attention_check') {
      this.handleAttentionCheck(page);
    }

    // Validate current page
    if (!this.validatePage()) return;

    // Collect data from current page
    this.collectPageData(this.currentPageIndex);

    // Record timing
    this.recordPageEnd(this.currentPageIndex);

    // Save progress
    this.saveProgress();

    // If this is the last navigable page (before debrief), calculate bonus first
    var nextPage = this.pages[this.currentPageIndex + 1];
    if (nextPage && nextPage.type === 'debrief') {
      this.calculateBonus();
    }

    // Advance
    if (this.currentPageIndex < this.pages.length - 1) {
      this.renderPage(this.currentPageIndex + 1);
    }
  };

  SurveyEngine.prototype.prevPage = function () {
    if (this.currentPageIndex > 0) {
      // Don't go back past a block boundary
      if (this.blockBoundaryIndices.indexOf(this.currentPageIndex) !== -1) {
        return;
      }
      this.recordPageEnd(this.currentPageIndex);
      this.renderPage(this.currentPageIndex - 1);
    }
  };

  // ── Validation ─────────────────────────────────────────────────────────
  SurveyEngine.prototype.validatePage = function () {
    this.clearErrors();
    var page = this.pages[this.currentPageIndex];
    var valid = true;

    // Consent page: must agree
    if (page.type === 'consent' && page.mustAgree) {
      var cb = document.getElementById('consent_agree');
      if (cb && !cb.checked) {
        this.showError('consent_agree', page.declineMessage || 'You must agree to participate.');
        valid = false;
      }
    }

    // Check all required fields on the page
    var required = document.querySelectorAll('#pageContent [data-required="true"]');
    for (var i = 0; i < required.length; i++) {
      var field = required[i];
      var name = field.getAttribute('data-field-name');
      if (!name) continue;

      if (field.getAttribute('data-field-type') === 'radio' || field.getAttribute('data-field-type') === 'likert') {
        var checked = document.querySelector('input[name="' + name + '"]:checked');
        if (!checked) {
          this.showError(name, 'Please select an option.');
          valid = false;
        }
      } else if (field.getAttribute('data-field-type') === 'number') {
        var input = document.getElementById(name);
        if (!input || input.value === '') {
          this.showError(name, 'Please enter a number.');
          valid = false;
        } else {
          var val = parseFloat(input.value);
          var min = parseFloat(input.getAttribute('min'));
          var max = parseFloat(input.getAttribute('max'));
          if (isNaN(val)) {
            this.showError(name, 'Please enter a valid number.');
            valid = false;
          } else if (!isNaN(min) && val < min) {
            this.showError(name, 'Value must be at least ' + min + '.');
            valid = false;
          } else if (!isNaN(max) && val > max) {
            this.showError(name, 'Value must be at most ' + max + '.');
            valid = false;
          }
        }
      } else if (field.getAttribute('data-field-type') === 'text') {
        var inp = document.getElementById(name);
        if (!inp || inp.value.trim() === '') {
          this.showError(name, 'Please provide a response.');
          valid = false;
        }
      } else if (field.getAttribute('data-field-type') === 'dropdown') {
        var sel = document.getElementById(name);
        if (!sel || sel.value === '') {
          this.showError(name, 'Please make a selection.');
          valid = false;
        }
      }
    }

    // Trial page: require the guess
    if (page.type === 'trial') {
      var guessInput = document.getElementById('trial_guess');
      if (guessInput && guessInput.getAttribute('data-touched') === 'false') {
        this.showError('trial_guess', 'Please drag the slider to make your guess.');
        valid = false;
      } else if (guessInput) {
        var gv = parseFloat(guessInput.value);
        if (isNaN(gv) || gv < 1 || gv > 10) {
          this.showError('trial_guess', 'Please enter a number between 1.0 and 10.0.');
          valid = false;
        }
      }
    }

    // Prolific PID fallback
    if (page.type === 'welcome' && !this.prolificPID) {
      var pidInput = document.getElementById('pid_fallback_input');
      if (pidInput && pidInput.value.trim()) {
        this.prolificPID = pidInput.value.trim();
        // Reassign condition with the new PID
        this.condition = this.assignCondition(this.prolificPID, this.config.conditions || ['default']);
        // Rebuild pages (randomization may depend on PID)
        var savedIndex = this.currentPageIndex;
        this.buildPageSequence();
        this.currentPageIndex = savedIndex;
      } else if (pidInput) {
        this.showError('pid_fallback_input', 'Please enter your Prolific ID to continue.');
        valid = false;
      }
    }

    return valid;
  };

  SurveyEngine.prototype.showError = function (fieldName, message) {
    var errEl = document.getElementById('error_' + fieldName);
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.add('visible');
    }
  };

  SurveyEngine.prototype.clearErrors = function () {
    var errors = document.querySelectorAll('.field-error');
    for (var i = 0; i < errors.length; i++) {
      errors[i].classList.remove('visible');
      errors[i].textContent = '';
    }
  };

  // ── Data Collection ────────────────────────────────────────────────────
  SurveyEngine.prototype.collectPageData = function (index) {
    var page = this.pages[index];
    var data = {};

    // Collect all inputs/selects on the page
    var inputs = document.querySelectorAll('#pageContent input, #pageContent select, #pageContent textarea');
    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      var name = el.name || el.id;
      if (!name || name.startsWith('hp_') || name.startsWith('ai_')) continue;

      if (el.type === 'radio') {
        if (el.checked) data[name] = el.value;
      } else if (el.type === 'checkbox') {
        data[name] = el.checked;
      } else {
        data[name] = el.value;
      }
    }

    // Store trial guess separately for bonus calculation
    if (page.type === 'trial' && page.trial) {
      var guess = document.getElementById('trial_guess');
      if (guess) {
        // Key by page.id (e.g., 't1_b1') to distinguish Block 1 vs Block 2
        this.trialGuesses[page.id] = {
          guess: parseFloat(guess.value),
          trueAverage: page.trial.trueAverage,
          N: page.trial.N,
          k: page.trial.k,
          disclosed: page.trial.disclosed,
          trialId: page.trial.id,
          block: page.block || 1,
          displayFormat: page.displayFormat || this.condition
        };
      }
    }

    // Store trial attention check results
    if (page.type === 'trial_attention' && page.trial) {
      var t = page.trial;
      var nAns = data['attn_n'] ? parseInt(data['attn_n']) : null;
      var kAns = data['attn_k'] ? parseInt(data['attn_k']) : null;
      var maxAns = data['attn_max'] ? parseInt(data['attn_max']) : null;
      var correctMax = Math.max.apply(null, t.disclosed);
      this.trialAttentionResults.push({
        trialId: t.id,
        block: page.block,
        nAnswer: nAns, nCorrect: nAns === t.N,
        kAnswer: kAns, kCorrect: kAns === t.k,
        maxAnswer: maxAns, maxCorrect: maxAns === correctMax,
        allCorrect: nAns === t.N && kAns === t.k && maxAns === correctMax
      });
    }

    this.responses[page.id] = data;
  };

  SurveyEngine.prototype.getAllData = function () {
    var botMetrics = window.BotDetector ? window.BotDetector.getMetrics() : {};

    return {
      // Metadata
      surveyVersion: this.config.version || '1.0',
      surveyTitle: this.config.title || '',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,

      // Prolific
      prolificPID: this.prolificPID,
      studyID: this.studyID,
      sessionID: this.sessionID,

      // Experiment
      condition: this.condition,
      formatOrder: this.getFormatOrder(),
      block1Format: this.getDisplayFormat(1),
      block2Format: this.getDisplayFormat(2),

      // Responses (all pages)
      responses: this.responses,

      // Trial guesses (flat for easy analysis)
      trialGuesses: this.trialGuesses,

      // Timing
      timing: this.timing,

      // Comprehension
      comprehensionAttempts: this.comprehensionAttempts,
      comprehensionFailed: this.comprehensionFailed,

      // Attention checks (end-of-survey)
      attentionResults: this.attentionResults,
      attentionPassed: this.attentionResults.filter(function (r) { return r.passed; }).length,
      attentionFailed: this.attentionResults.filter(function (r) { return !r.passed; }).length,

      // Trial attention checks (recall after selected rounds)
      trialAttentionResults: this.trialAttentionResults,
      trialAttentionAllCorrect: this.trialAttentionResults.filter(function (r) { return r.allCorrect; }).length,

      // Bonus
      bonus: this.bonusInfo,

      // Bot detection
      botMetrics: botMetrics
    };
  };

  // ── Save Progress ──────────────────────────────────────────────────────
  SurveyEngine.prototype.saveProgress = function () {
    if (!window.DataStorage) return;
    window.DataStorage.saveProgress({
      prolificPID: this.prolificPID,
      condition: this.condition,
      currentPageIndex: this.currentPageIndex + 1,
      responses: this.responses,
      timing: this.timing,
      trialGuesses: this.trialGuesses,
      comprehensionAttempts: this.comprehensionAttempts,
      attentionResults: this.attentionResults,
      trialAttentionResults: this.trialAttentionResults
    });
  };

  // ── Comprehension Check ────────────────────────────────────────────────
  SurveyEngine.prototype.handleComprehensionCheck = function (page) {
    var questions = page.questions || [];
    var allCorrect = true;

    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      var fieldId = 'comp_' + i;
      var input = document.getElementById(fieldId);
      if (!input) continue;

      var answer;
      if (q.type === 'number') {
        answer = parseFloat(input.value);
        var correct = parseFloat(q.correct);
        var tol = q.tolerance || 0.01;
        if (isNaN(answer) || Math.abs(answer - correct) > tol) {
          allCorrect = false;
        }
      } else if (q.type === 'radio') {
        var checked = document.querySelector('input[name="' + fieldId + '"]:checked');
        answer = checked ? checked.value : '';
        if (answer !== q.correct) {
          allCorrect = false;
        }
      }
    }

    if (allCorrect) {
      return true;
    }

    this.comprehensionAttempts++;

    if (this.comprehensionAttempts >= (page.maxAttempts || 2)) {
      // Failed too many times
      this.comprehensionFailed = true;
      this.elContent.innerHTML =
        '<div class="alert alert-error">' +
        '<p><strong>Unable to continue</strong></p>' +
        '<p>' + (page.failMessage || 'You did not pass the comprehension check. Thank you for your time.') + '</p>' +
        '</div>';
      this.elNavButtons.style.display = 'none';
      return false;
    }

    // Show remedial
    var remedialHtml = '<div class="remedial-box">';
    for (var j = 0; j < questions.length; j++) {
      if (questions[j].remedialText) {
        remedialHtml += '<p>' + questions[j].remedialText + '</p>';
      }
    }
    remedialHtml += '<p><strong>Please try again carefully.</strong></p></div>';

    var existing = document.getElementById('remedial_msg');
    if (existing) existing.remove();

    var div = document.createElement('div');
    div.id = 'remedial_msg';
    div.innerHTML = remedialHtml;
    this.elContent.appendChild(div);

    // Clear previous answers
    for (var k = 0; k < questions.length; k++) {
      var fId = 'comp_' + k;
      var inp = document.getElementById(fId);
      if (inp) inp.value = '';
      var radios = document.querySelectorAll('input[name="' + fId + '"]');
      radios.forEach(function (r) { r.checked = false; });
      document.querySelectorAll('.option-card.selected').forEach(function (c) {
        c.classList.remove('selected');
      });
    }

    return false;
  };

  // ── Attention Check ────────────────────────────────────────────────────
  SurveyEngine.prototype.handleAttentionCheck = function (page) {
    var checked = document.querySelector('input[name="attn_' + page.id + '"]:checked');
    var answer = checked ? checked.value : '';
    var passed = answer === page.correctAnswer;
    this.attentionResults.push({
      checkId: page.id,
      passed: passed,
      answer: answer,
      expected: page.correctAnswer
    });
  };

  // ── Bonus Calculation ──────────────────────────────────────────────────
  SurveyEngine.prototype.calculateBonus = function () {
    var bonusCfg = this.config.bonus;
    if (!bonusCfg || !bonusCfg.enabled) {
      this.bonusInfo = { enabled: false };
      return;
    }

    var trialIds = Object.keys(this.trialGuesses);
    if (trialIds.length === 0) {
      this.bonusInfo = { enabled: true, amount: 0, reason: 'no_trials' };
      return;
    }

    // Pick one trial at random (seeded by PID for reproducibility)
    var seed = hashString(this.prolificPID + '_bonus');
    var rng = mulberry32(seed);
    var selectedIdx = Math.floor(rng() * trialIds.length);
    var selectedId = trialIds[selectedIdx];
    var trial = this.trialGuesses[selectedId];

    var error = Math.abs(trial.guess - trial.trueAverage);
    var amount = Math.max(
      bonusCfg.floor || 0,
      (bonusCfg.baseAmount || 0.50) - (bonusCfg.penaltyPerUnit || 0.10) * error
    );
    // Round to 2 decimal places
    amount = Math.round(amount * 100) / 100;

    this.bonusInfo = {
      enabled: true,
      selectedTrialId: selectedId,
      guess: trial.guess,
      trueAverage: trial.trueAverage,
      error: Math.round(error * 100) / 100,
      amount: amount,
      currency: bonusCfg.currency || 'GBP'
    };
  };

  // ── Page Renderers ─────────────────────────────────────────────────────

  // Welcome
  SurveyEngine.prototype.renderWelcome = function (page) {
    var html = '';
    html += '<h1 class="page-title">' + (page.title || 'Welcome') + '</h1>';
    if (page.subtitle) html += '<p class="page-subtitle">' + page.subtitle + '</p>';
    html += '<div class="page-body">' + (page.body || '') + '</div>';

    // Prolific PID fallback
    if (!this.prolificPID) {
      html += '<div class="pid-fallback">';
      html += '<label for="pid_fallback_input">Please enter your Prolific ID to continue:</label>';
      html += '<input type="text" class="text-input" id="pid_fallback_input" placeholder="e.g., 5f3c...">';
      html += '<div class="field-error" id="error_pid_fallback_input"></div>';
      html += '</div>';
    }

    return html;
  };

  // Consent
  SurveyEngine.prototype.renderConsent = function (page) {
    var html = '';
    html += '<h1 class="page-title">' + (page.title || 'Consent') + '</h1>';
    html += '<div class="page-body">' + (page.body || '') + '</div>';
    if (page.mustAgree) {
      html += '<div class="consent-check" id="consent_wrapper">';
      html += '<input type="checkbox" id="consent_agree">';
      html += '<span>I have read and understood the information above, and I agree to participate in this study.</span>';
      html += '</div>';
      html += '<div class="field-error" id="error_consent_agree"></div>';
    }
    return html;
  };

  // Instructions
  SurveyEngine.prototype.renderInstructions = function (page) {
    var html = '';
    html += '<h1 class="page-title">' + (page.title || 'Instructions') + '</h1>';
    var body = page.body || '';
    // Template substitution for condition
    body = body.replace(/\{condition\}/g, this.condition);
    // Remove blocks meant for other conditions:
    //   <!--if:conditionName-->...<!--endif:conditionName--> is kept only if name matches.
    //   Templates use format-order keys (clean_first / explicit_first).
    var formatOrder = this.getFormatOrder();
    body = body.replace(/<!--if:(\w+)-->([\s\S]*?)<!--endif:\1-->/g,
      function (match, cond, inner) {
        return cond === formatOrder ? inner : '';
      }
    );
    html += '<div class="page-body">' + body + '</div>';
    return html;
  };

  // Comprehension Check
  SurveyEngine.prototype.renderComprehension = function (page) {
    var html = '';
    html += '<h1 class="page-title">' + (page.title || 'Comprehension Check') + '</h1>';
    if (page.description) html += '<div class="page-body">' + page.description + '</div>';

    (page.questions || []).forEach(function (q, idx) {
      var fieldId = 'comp_' + idx;
      html += '<div class="question-block">';
      html += '<div class="question-prompt">' + q.prompt + '</div>';

      if (q.type === 'number') {
        html += '<div class="number-input-wrapper">';
        html += '<input type="number" class="number-input" id="' + fieldId + '" ';
        if (q.min !== undefined) html += 'min="' + q.min + '" ';
        if (q.max !== undefined) html += 'max="' + q.max + '" ';
        if (q.step !== undefined) html += 'step="' + q.step + '" ';
        html += 'placeholder="?">';
        html += '</div>';
        if (q.hint) html += '<div class="number-input-hint">' + q.hint + '</div>';
      } else if (q.type === 'radio') {
        html += '<div class="option-list">';
        (q.options || []).forEach(function (opt) {
          var val = typeof opt === 'object' ? opt.value : opt;
          var label = typeof opt === 'object' ? opt.label : opt;
          html += '<div class="option-card">';
          html += '<input type="radio" name="' + fieldId + '" value="' + esc(val) + '">';
          html += '<span class="option-label">' + esc(label) + '</span>';
          html += '</div>';
        });
        html += '</div>';
      }

      html += '<div class="field-error" id="error_' + fieldId + '"></div>';
      html += '</div>';
    });

    if (this.comprehensionAttempts > 0) {
      html += '<div class="alert alert-warning">Attempt ' + (this.comprehensionAttempts + 1) +
              ' of ' + (page.maxAttempts || 2) + '</div>';
    }

    return html;
  };

  // Trial Intro (N-intro splash page before each trial)
  SurveyEngine.prototype.renderTrialIntro = function (page) {
    var trial = page.trial;
    var html = '';

    html += '<div class="page-subtitle">Round ' + (page.trialIndex + 1) +
            ' of ' + page.totalTrials + ' &mdash; Part ' + page.block + '</div>';

    html += '<div class="n-intro-display">';
    html += '<div class="n-intro-label">In this round, the Sender received ' +
            '<span class="n-intro-number">' + trial.N + '</span>' +
            ' secret numbers</div>';
    html += '</div>';

    return html;
  };

  // Transition page (between Block 1 and Block 2)
  SurveyEngine.prototype.renderTransition = function (page) {
    var html = '';
    html += '<h1 class="page-title">' + (page.title || 'Next Part') + '</h1>';
    var body = page.body || '';
    // Process condition templates using format-order key
    var formatOrder = this.getFormatOrder();
    body = body.replace(/<!--if:(\w+)-->([\s\S]*?)<!--endif:\1-->/g,
      function (match, cond, inner) {
        return cond === formatOrder ? inner : '';
      }
    );
    html += '<div class="page-body">' + body + '</div>';
    return html;
  };

  // Trial
  SurveyEngine.prototype.renderTrial = function (page) {
    var trial = page.trial;
    var displayFormat = page.displayFormat || this.condition;
    var block = page.block || 1;
    var html = '';

    // Initialize pending canvases registry for this render
    this._pendingCanvases = this._pendingCanvases || {};

    html += '<div class="page-subtitle">Round ' + (page.trialIndex + 1) +
            ' of ' + page.totalTrials + ' &mdash; Part ' + block + '</div>';

    html += '<div class="trial-card">';

    if (displayFormat === 'explicit') {
      // Show all N slots
      html += '<div class="trial-header">The Sender\'s numbers:</div>';
      var disclosedIdx = 0;
      for (var i = 0; i < trial.N; i++) {
        html += '<div class="trial-slot">';
        html += '<span class="trial-number-label">Number ' + (i + 1) + ':</span>';
        if (disclosedIdx < trial.disclosed.length) {
          var canvasId = 'dc_' + disclosedIdx + '_' + trial.id + '_b' + block;
          this._pendingCanvases[canvasId] = trial.disclosed[disclosedIdx];
          html += '<canvas id="' + canvasId + '" class="digit-canvas" width="60" height="72"></canvas>';
          disclosedIdx++;
        } else {
          html += '<span class="trial-hidden-value">[Not shown]</span>';
        }
        html += '</div>';
      }
    } else {
      // Clean condition: show disclosed values as canvas-rendered digits
      html += '<div class="trial-header">The Sender chose to show you:</div>';
      html += '<div class="trial-disclosed-values-row">';
      for (var di = 0; di < trial.disclosed.length; di++) {
        var canvasId = 'dc_' + di + '_' + trial.id + '_b' + block;
        this._pendingCanvases[canvasId] = trial.disclosed[di];
        html += '<canvas id="' + canvasId + '" class="digit-canvas" width="60" height="72"></canvas>';
        if (di < trial.disclosed.length - 1) {
          html += '<span class="digit-separator">,</span>';
        }
      }
      html += '</div>';
    }

    html += '</div>'; // end trial-card

    // Question -- slider input
    html += '<div class="question-block">';
    html += '<div class="question-prompt">What is your best guess of the Sender\'s average across all ' +
            trial.N + ' of their numbers?</div>';
    html += '<div class="slider-value-display" id="slider_value">5.5</div>';
    html += '<div class="slider-wrapper">';
    html += '<span class="slider-label">1</span>';
    html += '<input type="range" class="slider-input" id="trial_guess" ' +
            'min="1" max="10" step="0.1" value="5.5" data-touched="false">';
    html += '<span class="slider-label">10</span>';
    html += '</div>';
    html += '<div class="slider-hint">Drag the slider to make your guess</div>';
    html += '<div class="field-error" id="error_trial_guess"></div>';
    html += '</div>';

    return html;
  };

  // Attention Check
  SurveyEngine.prototype.renderAttentionCheck = function (page) {
    var html = '';
    html += '<div class="question-block">';
    html += '<div class="question-prompt">' + (page.question || '') + '</div>';
    if (page.description) html += '<div class="question-description">' + page.description + '</div>';

    html += '<div class="option-list">';
    var name = 'attn_' + page.id;
    (page.options || []).forEach(function (opt) {
      var val = typeof opt === 'object' ? opt.value : opt;
      var label = typeof opt === 'object' ? opt.label : opt;
      html += '<div class="option-card">';
      html += '<input type="radio" name="' + name + '" value="' + esc(val) + '">';
      html += '<span class="option-label">' + esc(label) + '</span>';
      html += '</div>';
    });
    html += '</div>';

    html += '<div class="field-error" id="error_' + name + '"></div>';
    html += '</div>';
    return html;
  };

  // Trial Attention Check (recall questions after selected trials)
  SurveyEngine.prototype.renderTrialAttention = function (page) {
    var trial = page.trial;
    var html = '';

    html += '<h1 class="page-title">Attention Check</h1>';
    html += '<p>Please answer these questions about the round you just completed.</p>';

    // Q1: How many secret numbers did the Sender have?
    html += '<div class="question-block" data-required="true" data-field-name="attn_n" data-field-type="radio">';
    html += '<div class="question-prompt">How many secret numbers did the Sender have?</div>';
    html += '<div class="option-list">';
    [2, 4, 6, 8].forEach(function (n) {
      html += '<div class="option-card">';
      html += '<input type="radio" name="attn_n" value="' + n + '">';
      html += '<span class="option-label">' + n + '</span>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="field-error" id="error_attn_n"></div>';
    html += '</div>';

    // Q2: How many numbers did the Sender show you?
    html += '<div class="question-block" data-required="true" data-field-name="attn_k" data-field-type="radio">';
    html += '<div class="question-prompt">How many numbers did the Sender show you?</div>';
    html += '<div class="option-list">';
    [1, 2, 3, 4].forEach(function (k) {
      html += '<div class="option-card">';
      html += '<input type="radio" name="attn_k" value="' + k + '">';
      html += '<span class="option-label">' + k + '</span>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="field-error" id="error_attn_k"></div>';
    html += '</div>';

    // Q3: What was the highest number the Sender showed you?
    var maxVal = Math.max.apply(null, trial.disclosed);
    var maxOptions = [];
    for (var v = maxVal - 2; v <= maxVal + 1; v++) {
      if (v >= 1 && v <= 10) maxOptions.push(v);
    }
    // Pad to 4 options if needed
    while (maxOptions.length < 4) {
      var lo = maxOptions[0] - 1;
      var hi = maxOptions[maxOptions.length - 1] + 1;
      if (lo >= 1) maxOptions.unshift(lo);
      else if (hi <= 10) maxOptions.push(hi);
      else break;
    }
    maxOptions = maxOptions.slice(0, 4);

    html += '<div class="question-block" data-required="true" data-field-name="attn_max" data-field-type="radio">';
    html += '<div class="question-prompt">What was the highest number the Sender showed you?</div>';
    html += '<div class="option-list">';
    maxOptions.forEach(function (mv) {
      html += '<div class="option-card">';
      html += '<input type="radio" name="attn_max" value="' + mv + '">';
      html += '<span class="option-label">' + mv + '</span>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="field-error" id="error_attn_max"></div>';
    html += '</div>';

    return html;
  };

  // Questionnaire (generic questions page)
  SurveyEngine.prototype.renderQuestionnaire = function (page) {
    var html = '';
    if (page.title) html += '<h1 class="page-title">' + page.title + '</h1>';
    if (page.description) html += '<div class="page-body">' + page.description + '</div>';

    var self = this;
    (page.questions || []).forEach(function (q) {
      html += self.renderQuestion(q);
    });

    return html;
  };

  // Generic question renderer
  SurveyEngine.prototype.renderQuestion = function (q) {
    var html = '<div class="question-block" data-required="' + (q.required !== false) + '" ';
    html += 'data-field-name="' + q.id + '" data-field-type="' + q.type + '">';
    html += '<div class="question-prompt">' + q.prompt;
    if (q.required !== false) html += '<span class="question-required">*</span>';
    html += '</div>';
    if (q.description) html += '<div class="question-description">' + q.description + '</div>';

    switch (q.type) {
      case 'radio':
        html += '<div class="option-list">';
        (q.options || []).forEach(function (opt) {
          var val = typeof opt === 'object' ? opt.value : opt;
          var label = typeof opt === 'object' ? opt.label : opt;
          html += '<div class="option-card">';
          html += '<input type="radio" name="' + q.id + '" value="' + esc(val) + '">';
          html += '<span class="option-label">' + esc(label) + '</span>';
          html += '</div>';
        });
        html += '</div>';
        break;

      case 'number':
        html += '<div class="number-input-wrapper">';
        html += '<input type="number" class="number-input" id="' + q.id + '" name="' + q.id + '"';
        if (q.min !== undefined) html += ' min="' + q.min + '"';
        if (q.max !== undefined) html += ' max="' + q.max + '"';
        if (q.step !== undefined) html += ' step="' + q.step + '"';
        html += ' placeholder="?">';
        html += '</div>';
        if (q.hint) html += '<div class="number-input-hint">' + q.hint + '</div>';
        break;

      case 'text':
        if (q.paragraph) {
          html += '<textarea class="textarea-input" id="' + q.id + '" name="' + q.id + '"';
          if (q.placeholder) html += ' placeholder="' + esc(q.placeholder) + '"';
          html += '></textarea>';
        } else {
          html += '<input type="text" class="text-input" id="' + q.id + '" name="' + q.id + '"';
          if (q.placeholder) html += ' placeholder="' + esc(q.placeholder) + '"';
          html += '>';
        }
        break;

      case 'likert':
        html += '<div class="likert-container">';
        html += '<div class="likert-labels">';
        html += '<span class="likert-label-low">' + (q.minLabel || q.min || '') + '</span>';
        html += '<span class="likert-label-high">' + (q.maxLabel || q.max || '') + '</span>';
        html += '</div>';
        html += '<div class="likert-options">';
        for (var v = (q.min || 1); v <= (q.max || 7); v++) {
          html += '<div class="likert-option">';
          html += '<input type="radio" name="' + q.id + '" value="' + v + '" id="' + q.id + '_' + v + '">';
          html += '<label for="' + q.id + '_' + v + '">' + v + '</label>';
          html += '</div>';
        }
        html += '</div>';
        html += '</div>';
        break;

      case 'dropdown':
        html += '<select class="dropdown-input" id="' + q.id + '" name="' + q.id + '">';
        html += '<option value="">-- Select --</option>';
        (q.options || []).forEach(function (opt) {
          var val = typeof opt === 'object' ? opt.value : opt;
          var label = typeof opt === 'object' ? opt.label : opt;
          html += '<option value="' + esc(val) + '">' + esc(label) + '</option>';
        });
        html += '</select>';
        break;
    }

    html += '<div class="field-error" id="error_' + q.id + '"></div>';
    html += '</div>';
    return html;
  };

  // Debrief
  SurveyEngine.prototype.renderDebrief = function (page) {
    var self = this;
    var html = '';
    html += '<h1 class="page-title">' + (page.title || 'Thank You!') + '</h1>';
    html += '<div class="page-body">' + (page.body || '') + '</div>';

    // Show bonus
    if (page.showBonus && this.bonusInfo && this.bonusInfo.enabled && this.bonusInfo.amount !== undefined) {
      html += '<div class="bonus-display">';
      html += '<div class="bonus-amount">' + this.bonusInfo.currency + ' ' +
              this.bonusInfo.amount.toFixed(2) + '</div>';
      html += '<div class="bonus-detail">Your bonus based on Round ' +
              this.bonusInfo.selectedTrialId + '</div>';
      html += '<div class="bonus-detail">Your guess: ' + this.bonusInfo.guess.toFixed(1) +
              ' | True average: ' + this.bonusInfo.trueAverage.toFixed(2) +
              ' | Error: ' + this.bonusInfo.error.toFixed(2) + '</div>';
      html += '</div>';
    }

    // Completion code
    html += '<p style="margin-top:24px;">Your completion code:</p>';
    html += '<div class="completion-code">' + esc(this.config.completionCode || 'XXXXXX') + '</div>';

    // Submit data
    html += '<div id="submit_status" class="alert alert-info" style="margin-top:24px;">';
    html += 'Submitting your responses... <span class="spinner"></span>';
    html += '</div>';

    // Trigger submission after render
    setTimeout(function () { self.submitData(); }, 500);

    return html;
  };

  // ── Submit Data ────────────────────────────────────────────────────────
  SurveyEngine.prototype.submitData = function () {
    if (this.submitted) return;
    this.submitted = true;

    var data = this.getAllData();
    var statusEl = document.getElementById('submit_status');
    var completionUrl = this.config.completionUrl;

    if (window.DataStorage && this.config.dataEndpoint) {
      window.DataStorage.submit(data, this.config.dataEndpoint, function (success) {
        if (success) {
          if (statusEl) {
            statusEl.className = 'alert alert-success';
            statusEl.innerHTML = 'Responses submitted successfully! Redirecting to Prolific...';
          }
          // Clear saved progress
          window.DataStorage.clearProgress();
          // Redirect after brief delay
          if (completionUrl) {
            setTimeout(function () { window.location.href = completionUrl; }, 2000);
          }
        } else {
          if (statusEl) {
            statusEl.className = 'alert alert-warning';
            statusEl.innerHTML = '<p><strong>Submission encountered an issue.</strong></p>' +
              '<p>Your completion code is shown above. Please copy it and return to Prolific.</p>' +
              '<p>If possible, please also copy the data below and email it to the researcher:</p>' +
              '<textarea class="textarea-input" style="font-size:11px;margin-top:8px;" readonly>' +
              JSON.stringify(data) + '</textarea>';
          }
        }
      });
    } else {
      // No endpoint configured -- show data for manual collection
      if (statusEl) {
        statusEl.className = 'alert alert-warning';
        statusEl.innerHTML = '<p>No data endpoint configured. Your completion code is above.</p>';
      }
      console.log('Survey data:', JSON.stringify(data, null, 2));
    }
  };

  // ── Expose globally ────────────────────────────────────────────────────
  window.SurveyEngine = SurveyEngine;

  // ── Auto-init when config is available ─────────────────────────────────
  function autoInit() {
    if (window.SURVEY_CONFIG) {
      var engine = new SurveyEngine(window.SURVEY_CONFIG);
      engine.init();
      window._surveyEngine = engine;
    } else {
      console.error('SURVEY_CONFIG not found. Define it in config.js before loading engine.js.');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})();
