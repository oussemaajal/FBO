/* ==========================================================================
   FBO Survey -- Experiment Configuration

   THIS IS THE ONLY FILE YOU NEED TO EDIT to configure your experiment.
   Everything else (engine, styling, bot detection, storage) is generic.

   To customize:
   1. Edit the SURVEY_CONFIG object below
   2. Open index.html in your browser to preview
   3. When ready, deploy to GitHub Pages and configure the data endpoint

   The config defines:
   - Study metadata (title, version)
   - Data endpoint (Google Sheets Apps Script URL)
   - Prolific integration (completion code, redirect URL)
   - Within-subjects conditions (order counterbalancing)
   - Bonus calculation parameters
   - Full page sequence (welcome, consent, instructions, trials, etc.)

   Page types available:
   - welcome         : Title + body text + optional PID fallback
   - consent         : Consent form with required checkbox
   - instructions    : Instruction text (supports {condition} template)
   - comprehension   : Questions with correct answers + remedial flow
   - trial_block     : Block of experiment trials (auto-expanded, randomizable)
   - attention_check : Instructed response item (tracked but never blocks)
   - questionnaire   : Generic questions page (radio, number, text, likert, dropdown)
   - debrief         : Thank you + bonus display + completion code + data submission

   Question types available (inside questionnaire pages):
   - radio      : Single choice from options [{value, label}]
   - number     : Numeric input with min/max/step
   - text       : Free text (set paragraph:true for textarea)
   - likert     : Scale with min/max and endpoint labels
   - dropdown   : Select from options [{value, label}]
   ========================================================================== */

var SURVEY_CONFIG = {

  // ── Study Metadata ───────────────────────────────────────────────────
  title: "Decision Study",
  version: "0.2.0-within",

  // ── Data Endpoint ────────────────────────────────────────────────────
  // Google Sheets Apps Script URL. Set this after deploying the backend.
  // Leave empty string to skip submission (data logged to console instead).
  dataEndpoint: "https://script.google.com/macros/s/AKfycbyGF-wrCRMydHe726y-Iur7239XdLbJBD-BtGdFTUBgrsHRhFWB43SF_lyvEqbu4ZJ9/exec",

  // ── Prolific Integration ─────────────────────────────────────────────
  // Get the completion code from your Prolific study setup.
  completionCode: "C1DT2DOB",
  completionUrl: "https://app.prolific.com/submissions/complete?cc=C1DT2DOB",

  // ── Within-Subjects Conditions (order counterbalancing) ─────────────
  // Every participant sees BOTH clean and explicit formats (9 trials each,
  // 18 total). The "condition" determines which format comes first.
  // Assigned deterministically via hash of Prolific PID.
  // 2x2 design: format order (clean_first vs explicit_first) x
  // N order (asc = 4,6,8 vs desc = 8,6,4).
  // Within each N level, trials are seeded-shuffled.
  conditions: ["clean_first", "explicit_first"],

  // ── Trial Attention Checks ─────────────────────────────────────────
  // Recall-based checks inserted after N randomly-selected trials.
  // Questions: how many secret numbers, how many disclosed, highest disclosed.
  trialAttentionCount: 3,

  // ── Bonus Parameters ─────────────────────────────────────────────────
  // After all trials, one trial is selected at random.
  // bonus = max(floor, baseAmount - penaltyPerUnit * |guess - trueAverage|)
  bonus: {
    enabled: true,
    currency: "USD",
    baseAmount: 3.00,
    penaltyPerUnit: 0.60,
    floor: 0.00,
    selectionMethod: "random_trial"
  },

  // ── Page Sequence ────────────────────────────────────────────────────
  // Pages are shown in order. trial_block pages are expanded into
  // individual trial pages and optionally randomized.
  pages: [

    // ──────────────────────────────────────────────────────────────────
    // WELCOME
    // ──────────────────────────────────────────────────────────────────
    {
      id: "welcome",
      type: "welcome",
      title: "Welcome to this Research Study",
      subtitle: "Thank you for participating.",
      body: "<p>In this study, you will play a short estimation game. " +
            "It takes approximately <strong>15 minutes</strong> to complete.</p>" +
            "<p>You will receive <strong>$3.00 base payment</strong> plus an " +
            "<strong>accuracy-based bonus of up to $3.00</strong> depending on how " +
            "well you perform.</p>" +
            "<p>Your responses are anonymous and will be used for academic research only.</p>" +
            "<p>Please complete this study on a <strong>desktop or laptop computer</strong> " +
            "for the best experience.</p>",
      buttonText: "Begin"
    },

    // ──────────────────────────────────────────────────────────────────
    // CONSENT
    // ──────────────────────────────────────────────────────────────────
    {
      id: "consent",
      type: "consent",
      title: "Informed Consent",
      body: "<p>You are being invited to participate in a research study about " +
            "decision-making under uncertainty.</p>" +
            "<p><strong>What you will do:</strong> You will play an estimation game " +
            "involving numbers and answer a few questions afterward.</p>" +
            "<p><strong>Time:</strong> Approximately 15 minutes.</p>" +
            "<p><strong>Compensation:</strong> You will receive a $3.00 base payment " +
            "plus an accuracy-based bonus of up to $3.00 depending on how close your " +
            "guesses are to the true averages.</p>" +
            "<p><strong>Risks:</strong> There are no known risks beyond those of everyday life.</p>" +
            "<p><strong>Confidentiality:</strong> Your responses are anonymous. " +
            "We collect your Prolific ID only to process payment.</p>" +
            "<p><strong>Voluntary:</strong> You may withdraw at any time by closing " +
            "this window. Partial data will not be used.</p>",
      mustAgree: true,
      declineMessage: "You must agree to participate in order to continue with this study.",
      minTimeSeconds: 20
    },

    // ──────────────────────────────────────────────────────────────────
    // INSTRUCTIONS 1a: The Guessing Game (intro)
    // ──────────────────────────────────────────────────────────────────
    {
      id: "instructions_1a",
      type: "instructions",
      title: "The Guessing Game",
      body:
        "<p>In this study, you are playing a guessing game against another player " +
        "called the <strong>Sender</strong>.</p>" +

        "<p>The Senders are <strong>real human participants</strong> who already played " +
        "their part in an earlier session. Their choices have been recorded, and you " +
        "are now seeing the results of their decisions.</p>",
      minTimeSeconds: 15
    },

    // ──────────────────────────────────────────────────────────────────
    // INSTRUCTIONS 1b: How the Game Works (3 steps + visual)
    // ──────────────────────────────────────────────────────────────────
    {
      id: "instructions_1b",
      type: "instructions",
      title: "How the Game Works",
      body:
        "<p><strong>Step 1:</strong> A random number generator gives the Sender a set of " +
        "secret numbers. Each number is between <strong>1 and 10</strong>. The set size " +
        "varies across rounds (sometimes 2 numbers, sometimes 4, 6, or 8).</p>" +

        "<div class='sender-visual'>" +
          "<div class='sender-visual-label'>Example: The Sender receives 2 secret numbers</div>" +
          "<div class='sender-number-cards'>" +
            "<div class='sender-number-card'>4</div>" +
            "<div class='sender-number-card'>6</div>" +
          "</div>" +
        "</div>" +

        "<p><strong>Step 2:</strong> The Sender looks at their numbers and decides which " +
        "ones to <strong>reveal to you</strong>. They can choose to show you all of them, " +
        "only some of them, or none at all -- it is entirely up to them.</p>" +

        "<p><strong>Step 3:</strong> You see what the Sender chose to reveal, and your job " +
        "is to <strong>guess the average of ALL the numbers</strong> the Sender received " +
        "-- including any they chose not to show you.</p>",
      minTimeSeconds: 20
    },

    // ──────────────────────────────────────────────────────────────────
    // INSTRUCTIONS 1c: The Sender's Goal (incentives)
    // ──────────────────────────────────────────────────────────────────
    {
      id: "instructions_1c",
      type: "instructions",
      title: "The Sender's Goal",
      body:
        "<p>The Sender gets paid based on <strong>your guess</strong>. The higher you guess, " +
        "the more the Sender earns. So the Sender has an incentive to make you " +
        "<strong>overestimate</strong> the true average.</p>" +

        "<p>Think about what this means: if the Sender has some high numbers and some low " +
        "numbers, what would they choose to show you?</p>",
      minTimeSeconds: 15
    },

    // ──────────────────────────────────────────────────────────────────
    // INSTRUCTIONS -- Format Explanation (condition-specific)
    // ──────────────────────────────────────────────────────────────────
    {
      id: "instructions_format",
      type: "instructions",
      title: "What You Will See",
      body:
        "<p>Let's use a quick example. Suppose the Sender receives <strong>2 numbers</strong>: " +
        "<strong>4</strong> and <strong>6</strong>. The true average is " +
        "<strong>5.00</strong>.</p>" +

        "<p>The Sender wants you to guess high, so they decide to show you " +
        "<strong>only the 6</strong> and hide the 4.</p>" +

        "<!--if:clean_first-->" +
        "<p>Here is how the Sender's choice will be presented to you:</p>" +
        "<div class='trial-card'>" +
          "<div class='trial-header'>The Sender chose to show you:</div>" +
          "<div class='trial-disclosed-values-row'>" +
            "<canvas class='digit-canvas' data-d='6' width='36' height='48'></canvas>" +
          "</div>" +
        "</div>" +
        "<p>You see only the number(s) the Sender chose to reveal. In this case, " +
        "just the <strong>6</strong>. The Sender had 2 numbers total, but chose to show " +
        "you only one of them.</p>" +
        "<!--endif:clean_first-->" +

        "<!--if:explicit_first-->" +
        "<p>Here is how the Sender's choice will be presented to you:</p>" +
        "<div class='trial-card'>" +
          "<div class='trial-header'>The Sender's numbers:</div>" +
          "<div class='trial-slot'>" +
            "<span class='trial-number-label'>Number 1:</span>" +
            "<canvas class='digit-canvas' data-d='6' width='36' height='48'></canvas>" +
          "</div>" +
          "<div class='trial-slot'>" +
            "<span class='trial-number-label'>Number 2:</span>" +
            "<span class='trial-hidden-value'>[Not shown]</span>" +
          "</div>" +
        "</div>" +
        "<p>You can see all <strong>2 slots</strong> -- the number the Sender revealed " +
        "(<strong>6</strong>) and a <em>[Not shown]</em> marker for the one they hid.</p>" +
        "<!--endif:explicit_first-->" +

        "<p>Your task is to guess the <strong>average of all 2 numbers</strong>. " +
        "In this example, the true average is (4 + 6) / 2 = <strong>5.00</strong>. " +
        "But of course, you would not know the hidden number, so you have to use " +
        "your judgement.</p>",
      minTimeSeconds: 20
    },

    // ──────────────────────────────────────────────────────────────────
    // INSTRUCTIONS -- Bonus
    // ──────────────────────────────────────────────────────────────────
    {
      id: "instructions_bonus",
      type: "instructions",
      title: "Your Bonus",
      body:
        "<p>At the end of the study, one round will be randomly selected. " +
        "Your bonus depends on <strong>how close your guess was to the true " +
        "average</strong> in that round. The closer you are, the more you earn " +
        "(up to $3.00).</p>" +

        "<p style='padding:16px; background:#f0f4ff; border-radius:8px; " +
        "border-left:4px solid var(--color-primary);'>" +
        "<strong>Key takeaway:</strong> The Sender benefits from making you guess " +
        "too high. Think carefully about <em>why</em> they chose to show you " +
        "certain numbers and not others.</p>",
      minTimeSeconds: 10
    },

    // ──────────────────────────────────────────────────────────────────
    // COMPREHENSION CHECK
    // ──────────────────────────────────────────────────────────────────
    {
      id: "comprehension",
      type: "comprehension",
      title: "Comprehension Check",
      description: "<p>Before we begin, let's make sure you understand the game.</p>",
      questions: [
        {
          prompt: "A Sender has 2 numbers: 4 and 6. They choose to show you only: <strong>6</strong>. " +
                  "What is the Sender's TRUE average of all 2 numbers?",
          type: "radio",
          correct: "5.00",
          options: [
            { value: "6.00", label: "6.00" },
            { value: "5.00", label: "5.00" },
            { value: "4.00", label: "4.00" },
            { value: "5.50", label: "5.50" }
          ],
          remedialText: "The correct answer is 5.00. The Sender has two numbers: 4 and 6. " +
                        "The average is (4 + 6) / 2 = 10 / 2 = 5.00. " +
                        "Notice that the Sender showed you only the 6 (the higher number) " +
                        "to make you think the average is higher than it really is."
        },
        {
          prompt: "Why might the Sender have shown only the 6?",
          type: "radio",
          correct: "overestimate",
          options: [
            { value: "overestimate", label: "To make me guess higher than the true average" },
            { value: "random", label: "It was random" },
            { value: "required", label: "They had to show that number" }
          ],
          remedialText: "The Sender's goal is to make you overestimate the average. " +
                        "They show you higher numbers and hide the lower ones."
        }
      ],
      minTimeSeconds: 20,
      maxAttempts: 2,
      failMessage: "Unfortunately, you were unable to answer the comprehension questions correctly. " +
                   "We are unable to include your responses in the study. Thank you for your time."
    },

    // ──────────────────────────────────────────────────────────────────
    // TRIAL BLOCK 1 -- 9 trials in first display format
    // ──────────────────────────────────────────────────────────────────
    // Within-subjects: each participant sees all 9 trials twice (once per
    // format). Block 1 uses format A, Block 2 uses format B, where A/B
    // depend on the condition (clean_first or explicit_first).
    // Disclosed values vary across trials (always top-k, strategic sender).
    {
      id: "trials_block1",
      type: "trial_block",
      block: 1,
      randomize: true,
      trials: [
        // N=4
        { id: "t1", N: 4, k: 1, disclosed: [8],        hidden: [4, 3, 1],             trueAverage: 4.00 },
        { id: "t2", N: 4, k: 2, disclosed: [6, 5],     hidden: [2, 1],                trueAverage: 3.50 },
        { id: "t3", N: 4, k: 3, disclosed: [10, 7, 6], hidden: [1],                   trueAverage: 6.00 },
        // N=6
        { id: "t4", N: 6, k: 1, disclosed: [5],        hidden: [4, 3, 2, 2, 1],       trueAverage: 2.83 },
        { id: "t5", N: 6, k: 2, disclosed: [8, 7],     hidden: [5, 3, 2, 1],          trueAverage: 4.33 },
        { id: "t6", N: 6, k: 3, disclosed: [9, 8, 5],  hidden: [3, 2, 1],             trueAverage: 4.67 },
        // N=8
        { id: "t7", N: 8, k: 1, disclosed: [9],        hidden: [6, 5, 4, 3, 2, 1, 1], trueAverage: 3.88 },
        { id: "t8", N: 8, k: 2, disclosed: [5, 4],     hidden: [4, 3, 2, 2, 1, 1],    trueAverage: 2.75 },
        { id: "t9", N: 8, k: 3, disclosed: [8, 7, 6],  hidden: [5, 3, 2, 2, 1],       trueAverage: 4.25 }
      ]
    },

    // ──────────────────────────────────────────────────────────────────
    // TRANSITION -- between Block 1 and Block 2
    // ──────────────────────────────────────────────────────────────────
    {
      id: "block_transition",
      type: "transition",
      title: "Part 2 of 2",
      body:
        "<p>You have completed Part 1. Great job!</p>" +

        "<p>In Part 2, you will play <strong>9 more rounds</strong> of the same " +
        "estimation game, but the information will be presented in a <strong>different " +
        "format</strong>.</p>" +

        "<!--if:clean_first-->" +
        "<p>Using the same example as before -- the Sender has 2 numbers (4 and 6) " +
        "and shows you only the 6 -- here is how it will now look:</p>" +
        "<div class='trial-card'>" +
          "<div class='trial-header'>The Sender's numbers:</div>" +
          "<div class='trial-slot'>" +
            "<span class='trial-number-label'>Number 1:</span>" +
            "<canvas class='digit-canvas' data-d='6' width='36' height='48'></canvas>" +
          "</div>" +
          "<div class='trial-slot'>" +
            "<span class='trial-number-label'>Number 2:</span>" +
            "<span class='trial-hidden-value'>[Not shown]</span>" +
          "</div>" +
        "</div>" +
        "<p>You can now see <strong>all slots</strong> -- the number the Sender revealed " +
        "(<strong>6</strong>) and a <em>[Not shown]</em> marker for the one they hid.</p>" +
        "<!--endif:clean_first-->" +

        "<!--if:explicit_first-->" +
        "<p>Using the same example as before -- the Sender has 2 numbers (4 and 6) " +
        "and shows you only the 6 -- here is how it will now look:</p>" +
        "<div class='trial-card'>" +
          "<div class='trial-header'>The Sender chose to show you:</div>" +
          "<div class='trial-disclosed-values-row'>" +
            "<canvas class='digit-canvas' data-d='6' width='36' height='48'></canvas>" +
          "</div>" +
        "</div>" +
        "<p>You now see <strong>only the number(s)</strong> the Sender chose to reveal -- " +
        "without any markers for hidden numbers.</p>" +
        "<!--endif:explicit_first-->" +

        "<p>The game itself is identical -- the same Sender incentives, the same " +
        "types of numbers. Only the display format changes.</p>",
      minTimeSeconds: 15
    },

    // ──────────────────────────────────────────────────────────────────
    // TRIAL BLOCK 2 -- 9 trials in second display format
    // ──────────────────────────────────────────────────────────────────
    {
      id: "trials_block2",
      type: "trial_block",
      block: 2,
      randomize: true,
      trials: [
        // Same 9 trials, re-randomized independently for Block 2
        // N=4
        { id: "t1", N: 4, k: 1, disclosed: [8],        hidden: [4, 3, 1],             trueAverage: 4.00 },
        { id: "t2", N: 4, k: 2, disclosed: [6, 5],     hidden: [2, 1],                trueAverage: 3.50 },
        { id: "t3", N: 4, k: 3, disclosed: [10, 7, 6], hidden: [1],                   trueAverage: 6.00 },
        // N=6
        { id: "t4", N: 6, k: 1, disclosed: [5],        hidden: [4, 3, 2, 2, 1],       trueAverage: 2.83 },
        { id: "t5", N: 6, k: 2, disclosed: [8, 7],     hidden: [5, 3, 2, 1],          trueAverage: 4.33 },
        { id: "t6", N: 6, k: 3, disclosed: [9, 8, 5],  hidden: [3, 2, 1],             trueAverage: 4.67 },
        // N=8
        { id: "t7", N: 8, k: 1, disclosed: [9],        hidden: [6, 5, 4, 3, 2, 1, 1], trueAverage: 3.88 },
        { id: "t8", N: 8, k: 2, disclosed: [5, 4],     hidden: [4, 3, 2, 2, 1, 1],    trueAverage: 2.75 },
        { id: "t9", N: 8, k: 3, disclosed: [8, 7, 6],  hidden: [5, 3, 2, 2, 1],       trueAverage: 4.25 }
      ]
    },

    // ──────────────────────────────────────────────────────────────────
    // ATTENTION CHECK
    // ──────────────────────────────────────────────────────────────────
    {
      id: "attention1",
      type: "attention_check",
      question: "People sometimes answer surveys without reading the questions carefully. " +
                "To show that you are paying attention, please select " +
                "\"Strongly Disagree\" below.",
      options: [
        { value: "strongly_disagree", label: "Strongly Disagree" },
        { value: "disagree", label: "Disagree" },
        { value: "neutral", label: "Neutral" },
        { value: "agree", label: "Agree" },
        { value: "strongly_agree", label: "Strongly Agree" }
      ],
      correctAnswer: "strongly_disagree",
      minTimeSeconds: 20
    },

    // ──────────────────────────────────────────────────────────────────
    // DEMOGRAPHICS
    // ──────────────────────────────────────────────────────────────────
    {
      id: "demographics",
      type: "questionnaire",
      title: "About You",
      minTimeSeconds: 20,
      questions: [
        {
          id: "age",
          prompt: "What is your age?",
          type: "dropdown",
          required: true,
          options: [
            { value: "18-24", label: "18-24" },
            { value: "25-34", label: "25-34" },
            { value: "35-44", label: "35-44" },
            { value: "45-54", label: "45-54" },
            { value: "55-64", label: "55-64" },
            { value: "65+",   label: "65 or older" }
          ]
        },
        {
          id: "gender",
          prompt: "What is your gender?",
          type: "dropdown",
          required: true,
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "nonbinary", label: "Non-binary" },
            { value: "other", label: "Other" },
            { value: "prefer_not", label: "Prefer not to say" }
          ]
        },
        {
          id: "education",
          prompt: "What is your highest level of education?",
          type: "dropdown",
          required: true,
          options: [
            { value: "high_school", label: "High school or equivalent" },
            { value: "some_college", label: "Some college" },
            { value: "bachelors", label: "Bachelor's degree" },
            { value: "masters", label: "Master's degree" },
            { value: "doctorate", label: "Doctorate or professional degree" },
            { value: "other", label: "Other" }
          ]
        },
        {
          id: "stats_comfort",
          prompt: "How comfortable are you with probability and statistics?",
          type: "likert",
          required: true,
          min: 1,
          max: 5,
          minLabel: "Not at all comfortable",
          maxLabel: "Very comfortable"
        }
      ]
    },

    // ──────────────────────────────────────────────────────────────────
    // DEBRIEF
    // ──────────────────────────────────────────────────────────────────
    {
      id: "debrief",
      type: "debrief",
      title: "Thank You!",
      body: "<p>This study examines how people estimate averages when some information " +
            "is strategically hidden. Because the Sender wants you to guess high, they tend " +
            "to show their highest numbers and hide the low ones. The hidden numbers are " +
            "therefore likely to be below average.</p>" +
            "<p>A key question in this research is whether people spontaneously think about " +
            "information that isn't shown to them, or whether they tend to focus only on " +
            "what's visible. Your responses will help us understand this.</p>",
      showBonus: true
    }
  ]
};
