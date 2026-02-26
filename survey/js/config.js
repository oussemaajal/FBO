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
   - Between-subjects conditions
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
  version: "0.1.0-demo",

  // ── Data Endpoint ────────────────────────────────────────────────────
  // Google Sheets Apps Script URL. Set this after deploying the backend.
  // Leave empty string to skip submission (data logged to console instead).
  dataEndpoint: "https://script.google.com/macros/s/AKfycbyGF-wrCRMydHe726y-Iur7239XdLbJBD-BtGdFTUBgrsHRhFWB43SF_lyvEqbu4ZJ9/exec",

  // ── Prolific Integration ─────────────────────────────────────────────
  // Get the completion code from your Prolific study setup.
  completionCode: "C1DT2DOB",
  completionUrl: "https://app.prolific.com/submissions/complete?cc=C1DT2DOB",

  // ── Between-Subjects Conditions ──────────────────────────────────────
  // Participants are assigned to one condition based on a hash of their
  // Prolific PID. This ensures balanced, deterministic assignment.
  conditions: ["clean", "explicit"],

  // ── Bonus Parameters ─────────────────────────────────────────────────
  // After all trials, one trial is selected at random.
  // bonus = max(floor, baseAmount - penaltyPerUnit * |guess - trueAverage|)
  bonus: {
    enabled: true,
    currency: "USD",
    baseAmount: 1.00,
    penaltyPerUnit: 0.20,
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
            "It takes approximately <strong>8-10 minutes</strong> to complete.</p>" +
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
            "<p><strong>Time:</strong> Approximately 8-10 minutes.</p>" +
            "<p><strong>Compensation:</strong> You will receive your Prolific payment " +
            "plus an accuracy-based bonus of up to $1.00.</p>" +
            "<p><strong>Risks:</strong> There are no known risks beyond those of everyday life.</p>" +
            "<p><strong>Confidentiality:</strong> Your responses are anonymous. " +
            "We collect your Prolific ID only to process payment.</p>" +
            "<p><strong>Voluntary:</strong> You may withdraw at any time by closing " +
            "this window. Partial data will not be used.</p>",
      mustAgree: true,
      declineMessage: "You must agree to participate in order to continue with this study."
    },

    // ──────────────────────────────────────────────────────────────────
    // INSTRUCTIONS -- Page 1: The Setup
    // ──────────────────────────────────────────────────────────────────
    {
      id: "instructions_1",
      type: "instructions",
      title: "The Guessing Game",
      body:
        "<p>In this study, you are playing a guessing game against another player " +
        "called the <strong>Sender</strong>.</p>" +

        "<p>The Senders are <strong>real human participants</strong> who already played " +
        "their part in an earlier session. Their choices have been recorded, and you " +
        "are now seeing the results of their decisions.</p>" +

        "<h3 style='margin-top:28px;'>How the game works</h3>" +

        "<p><strong>Step 1:</strong> A random number generator gives the Sender a set of " +
        "numbers. Each number is between <strong>1 and 10</strong>. The set size varies " +
        "across rounds (sometimes 2 numbers, sometimes 4, 6, or 8).</p>" +

        "<p><strong>Step 2:</strong> The Sender looks at their numbers and decides which " +
        "ones to <strong>reveal to you</strong>. They can choose to show you all of them, " +
        "only some of them, or none at all -- it is entirely up to them.</p>" +

        "<p><strong>Step 3:</strong> You see what the Sender chose to reveal, and your job " +
        "is to <strong>guess the average of ALL the numbers</strong> the Sender received " +
        "-- including any they chose not to show you.</p>" +

        "<h3 style='margin-top:28px;'>Why does the Sender care?</h3>" +

        "<p>The Sender gets paid based on <strong>your guess</strong>. The higher you guess, " +
        "the more the Sender earns. So the Sender has an incentive to make you " +
        "<strong>overestimate</strong> the true average.</p>" +

        "<p>Think about what this means: if the Sender has some high numbers and some low " +
        "numbers, what would they choose to show you?</p>",
      minTimeSeconds: 30
    },

    // ──────────────────────────────────────────────────────────────────
    // INSTRUCTIONS -- Page 2: Example & Bonus
    // ──────────────────────────────────────────────────────────────────
    {
      id: "instructions_2",
      type: "instructions",
      title: "An Example",
      body:
        "<p>Suppose a Sender receives <strong>4 numbers</strong> from the random " +
        "generator: <strong>2, 5, 7, and 9</strong>. The true average is " +
        "<strong>5.75</strong>.</p>" +

        "<p>The Sender wants you to guess high, so they decide to show you " +
        "<strong>only the 9</strong> and hide the rest.</p>" +

        "<p>Here is what you would see on your screen:</p>" +

        // ── Condition-specific example visuals ──
        "<!--if:explicit-->" +
          "<div class='trial-card'>" +
            "<div class='trial-header'>The Sender's numbers:</div>" +
            "<div class='trial-slot'>" +
              "<span class='trial-number-label'>Number 1:</span>" +
              "<span class='trial-disclosed-value'>9</span>" +
            "</div>" +
            "<div class='trial-slot'>" +
              "<span class='trial-number-label'>Number 2:</span>" +
              "<span class='trial-hidden-value'>[Not shown]</span>" +
            "</div>" +
            "<div class='trial-slot'>" +
              "<span class='trial-number-label'>Number 3:</span>" +
              "<span class='trial-hidden-value'>[Not shown]</span>" +
            "</div>" +
            "<div class='trial-slot'>" +
              "<span class='trial-number-label'>Number 4:</span>" +
              "<span class='trial-hidden-value'>[Not shown]</span>" +
            "</div>" +
          "</div>" +
        "<!--endif:explicit-->" +
        "<!--if:clean-->" +
          "<div class='trial-card'>" +
            "<div class='trial-header'>The Sender chose to show you:</div>" +
            "<div class='trial-disclosed-value'>9</div>" +
          "</div>" +
        "<!--endif:clean-->" +

        "<p>In this example, the Sender has 4 numbers total but chose to reveal " +
        "only one of them. The number they showed you is a <strong>9</strong>. " +
        "Your task is to guess what the average of <em>all 4 numbers</em> is.</p>" +

        "<p>If you guessed <strong>5.75</strong>, you would be exactly right! " +
        "But of course, you would not know the hidden numbers, so you have to " +
        "use your judgement.</p>" +

        "<h3 style='margin-top:28px;'>Your bonus</h3>" +

        "<p>At the end of the study, one round will be randomly selected. " +
        "Your bonus depends on <strong>how close your guess was to the true " +
        "average</strong> in that round. The closer you are, the more you earn " +
        "(up to $1.00).</p>" +

        "<p style='padding:16px; background:#f0f4ff; border-radius:8px; " +
        "border-left:4px solid var(--color-primary);'>" +
        "<strong>Key takeaway:</strong> The Sender benefits from making you guess " +
        "too high. Think carefully about <em>why</em> they chose to show you " +
        "certain numbers and not others.</p>",
      minTimeSeconds: 30
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
          prompt: "A Sender has 4 numbers: 2, 5, 7, 9. They choose to show you only: <strong>9</strong>. " +
                  "What is the Sender's TRUE average of all 4 numbers?",
          type: "radio",
          correct: "5.75",
          options: [
            { value: "9.00", label: "9.00" },
            { value: "5.75", label: "5.75" },
            { value: "7.00", label: "7.00" },
            { value: "5.50", label: "5.50" }
          ],
          remedialText: "The correct answer is 5.75. The Sender has four numbers: 2, 5, 7, and 9. " +
                        "The average is (2 + 5 + 7 + 9) / 4 = 23 / 4 = 5.75. " +
                        "Notice that the Sender showed you only the 9 (the highest number) " +
                        "to make you think the average is higher than it really is."
        },
        {
          prompt: "Why might the Sender have shown only the 9?",
          type: "radio",
          correct: "overestimate",
          options: [
            { value: "overestimate", label: "To make me guess higher than the true average" },
            { value: "random", label: "It was random" },
            { value: "required", label: "They had to show that number" }
          ],
          remedialText: "The Sender's goal is to make you overestimate the average. " +
                        "They show you high numbers and hide the low ones."
        }
      ],
      maxAttempts: 2,
      failMessage: "Unfortunately, you were unable to answer the comprehension questions correctly. " +
                   "We are unable to include your responses in the study. Thank you for your time."
    },

    // ──────────────────────────────────────────────────────────────────
    // TRIAL BLOCK (demo -- 4 trials for pilot)
    // ──────────────────────────────────────────────────────────────────
    // Edit the trials array below to define your experiment stimuli.
    // Each trial needs: id, N, k, disclosed[], hidden[], trueAverage
    // The engine renders them based on the participant's condition.
    {
      id: "trials",
      type: "trial_block",
      randomize: true,   // Shuffle trial order (seeded by Prolific PID)
      trials: [
        {
          id: "t1",
          N: 2,
          k: 1,
          disclosed: [8],
          hidden: [3],
          trueAverage: 5.50
        },
        {
          id: "t2",
          N: 8,
          k: 1,
          disclosed: [8],
          hidden: [7, 5, 4, 3, 2, 2, 1],
          trueAverage: 4.00
        },
        {
          id: "t3",
          N: 2,
          k: 1,
          disclosed: [9],
          hidden: [4],
          trueAverage: 6.50
        },
        {
          id: "t4",
          N: 8,
          k: 1,
          disclosed: [9],
          hidden: [8, 6, 5, 4, 3, 2, 1],
          trueAverage: 4.75
        }
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
      correctAnswer: "strongly_disagree"
    },

    // ──────────────────────────────────────────────────────────────────
    // POST-TASK QUESTIONNAIRE
    // ──────────────────────────────────────────────────────────────────
    {
      id: "posttask",
      type: "questionnaire",
      title: "A Few More Questions",
      questions: [
        {
          id: "hidden_belief",
          prompt: "When the Sender didn't show you a number, what did you think that number was likely to be?",
          type: "radio",
          required: true,
          options: [
            { value: "low", label: "Low (1-4)" },
            { value: "average", label: "About average (5-6)" },
            { value: "high", label: "High (7-10)" },
            { value: "didnt_think", label: "I didn't really think about the hidden numbers" }
          ]
        },
        {
          id: "adjustment",
          prompt: "When making your guesses, how much did you adjust for numbers the Sender didn't show?",
          type: "radio",
          required: true,
          options: [
            { value: "a_lot", label: "A lot -- I guessed well below what was shown" },
            { value: "somewhat", label: "Somewhat -- I lowered my guess a bit" },
            { value: "a_little", label: "A little -- I mostly went with what I saw" },
            { value: "not_at_all", label: "Not at all -- I based my guess on the shown numbers" }
          ]
        }
      ]
    },

    // ──────────────────────────────────────────────────────────────────
    // DEMOGRAPHICS
    // ──────────────────────────────────────────────────────────────────
    {
      id: "demographics",
      type: "questionnaire",
      title: "About You",
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
