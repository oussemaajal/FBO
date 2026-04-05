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
    baseAmount: 2.00,
    penaltyPerUnit: 0.40,
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
            "<strong>accuracy-based bonus of up to $2.00</strong> depending on how " +
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
            "plus an accuracy-based bonus of up to $2.00 depending on how close your " +
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
    // INSTRUCTIONS 1: The Guessing Game (intro)
    // ──────────────────────────────────────────────────────────────────
    {
      id: "instructions_1",
      type: "instructions",
      title: "The Guessing Game",
      body:
        "<p>In this study, you will play a guessing game with <strong>another " +
        "player</strong>.</p>" +

        "<p>This other player is a <strong>real person</strong> who already played " +
        "their part in an earlier session. Their choices have been recorded, and " +
        "you are now seeing the results of what they decided to do.</p>" +

        "<p>During the game, we will call this other player <strong>\"the Sender\"</strong> " +
        "(because they send information to you).</p>",
      minTimeSeconds: 12
    },

    // ──────────────────────────────────────────────────────────────────
    // INSTRUCTIONS 2: The Sender's Secret Numbers
    // ──────────────────────────────────────────────────────────────────
    {
      id: "instructions_2",
      type: "instructions",
      title: "The Sender's Secret Numbers",
      body:
        "<p>At the start of each round, a <strong>random number generator</strong> " +
        "gives the Sender a set of secret numbers. Each number is somewhere " +
        "between <strong>1 and 10</strong>.</p>" +

        "<p>The number of secret numbers <strong>changes each round</strong>. " +
        "Sometimes the Sender gets 4 numbers, sometimes 6, sometimes 8.</p>" +

        "<div class='sender-visual'>" +
          "<div class='sender-visual-label'>Example: The Sender gets 2 secret numbers</div>" +
          "<div class='sender-number-cards'>" +
            "<div class='sender-number-card'>4</div>" +
            "<div class='sender-number-card'>6</div>" +
          "</div>" +
        "</div>" +

        "<p>You will always be told <strong>how many</strong> secret numbers the " +
        "Sender received in each round.</p>",
      minTimeSeconds: 15
    },

    // ──────────────────────────────────────────────────────────────────
    // INSTRUCTIONS 3: The Sender Chooses What to Show
    // ──────────────────────────────────────────────────────────────────
    {
      id: "instructions_3",
      type: "instructions",
      title: "The Sender Chooses What to Show You",
      body:
        "<p>After seeing their numbers, the Sender <strong>decides which ones " +
        "to reveal to you</strong>. This is entirely their choice.</p>" +

        "<p>They can show you:</p>" +
        "<ul>" +
          "<li><strong>All</strong> of their numbers</li>" +
          "<li>Only <strong>some</strong> of them</li>" +
          "<li>Or even <strong>none</strong> at all</li>" +
        "</ul>" +

        "<p>Using the example above: if the Sender has <strong>4</strong> and " +
        "<strong>6</strong>, they might choose to show you both, just one of " +
        "them, or neither. It is completely up to them.</p>",
      minTimeSeconds: 12
    },

    // ──────────────────────────────────────────────────────────────────
    // INSTRUCTIONS 4: The Catch (incentives)
    // ──────────────────────────────────────────────────────────────────
    {
      id: "instructions_4",
      type: "instructions",
      title: "The Catch",
      body:
        "<p>Here is the important part:</p>" +

        "<p>The Sender gets paid based on <strong>your guess</strong>. " +
        "The <strong>higher</strong> you guess, the <strong>more money</strong> " +
        "the Sender earns.</p>" +

        "<p>This means the Sender has a reason to try to make you " +
        "<strong>overestimate</strong> the true average of their numbers.</p>" +

        "<p style='padding:16px; background:#fff8e6; border-radius:8px; " +
        "border-left:4px solid var(--color-warning);'>" +
        "Think about it: if the Sender has some high numbers and some low " +
        "numbers, and they want you to think the average is high, which " +
        "numbers would they choose to show you?</p>",
      minTimeSeconds: 15
    },

    // ──────────────────────────────────────────────────────────────────
    // INSTRUCTIONS 5: Your Task
    // ──────────────────────────────────────────────────────────────────
    {
      id: "instructions_5",
      type: "instructions",
      title: "Your Task",
      body:
        "<p>In each round, you will see what the Sender chose to reveal. " +
        "Your job is to <strong>guess the average of ALL the Sender's " +
        "numbers</strong> -- including any they chose not to show you.</p>" +

        "<p>Your bonus depends on <strong>how accurate</strong> your guess is. " +
        "At the end of the study, one round will be randomly selected, and " +
        "your bonus (up to <strong>$2.00</strong>) depends on how close your " +
        "guess was to the true average in that round.</p>" +

        "<p style='padding:16px; background:#f0f4ff; border-radius:8px; " +
        "border-left:4px solid var(--color-primary);'>" +
        "<strong>To summarize:</strong> The Sender wants you to guess high. " +
        "You want to guess accurately. Think carefully about why the Sender " +
        "chose to show you certain numbers and not others.</p>",
      minTimeSeconds: 15
    },

    // ──────────────────────────────────────────────────────────────────
    // COMPREHENSION QUIZ
    // ──────────────────────────────────────────────────────────────────
    {
      id: "comprehension",
      type: "comprehension",
      title: "Quick Quiz",
      description: "<p>Let's make sure you understand how the game works " +
                   "before we start.</p>",
      questions: [
        {
          prompt: "Can the Sender choose which of their numbers to show you?",
          type: "radio",
          correct: "yes",
          options: [
            { value: "yes", label: "Yes -- they decide which numbers to reveal and which to hide" },
            { value: "no", label: "No -- they must show all of them" },
            { value: "random", label: "No -- the numbers shown are chosen randomly" }
          ],
          remedialText: "The Sender gets to look at all their numbers and freely decide " +
                        "which ones to show you. They are not required to show any particular number."
        },
        {
          prompt: "The Sender earns more money when...",
          type: "radio",
          correct: "high",
          options: [
            { value: "accurate", label: "You guess the average accurately" },
            { value: "high", label: "You guess higher than the true average" },
            { value: "low", label: "You guess lower than the true average" }
          ],
          remedialText: "The Sender earns more when your guess is HIGH. This means the " +
                        "Sender has a reason to make you overestimate the true average."
        },
        {
          prompt: "What are you trying to guess?",
          type: "radio",
          correct: "all",
          options: [
            { value: "shown", label: "The average of only the numbers the Sender showed me" },
            { value: "all", label: "The average of ALL the Sender's numbers (including hidden ones)" },
            { value: "hidden", label: "The value of the hidden numbers" }
          ],
          remedialText: "You are guessing the average of ALL the Sender's numbers -- " +
                        "both the ones they showed you and the ones they kept hidden."
        },
        {
          prompt: "The Sender has 2 numbers: <strong>4</strong> and <strong>6</strong>. " +
                  "They show you only the <strong>6</strong>. What is the true average " +
                  "of ALL their numbers?",
          type: "radio",
          correct: "5.00",
          options: [
            { value: "6.00", label: "6.00" },
            { value: "5.00", label: "5.00" },
            { value: "4.00", label: "4.00" },
            { value: "5.50", label: "5.50" }
          ],
          remedialText: "The Sender has two numbers: 4 and 6. The average of ALL their " +
                        "numbers is (4 + 6) / 2 = 5.00. Notice: the Sender showed you only " +
                        "the 6 (the higher number) to make you think the average is higher " +
                        "than it really is."
        }
      ],
      minTimeSeconds: 30,
      maxAttempts: 2,
      failMessage: "Unfortunately, you were unable to answer the comprehension questions correctly. " +
                   "We are unable to include your responses in the study. Thank you for your time."
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
      title: "Almost Ready!",
      body:
        "<p>One last thing before we start.</p>" +

        "<p>Remember: the Sender benefits from making you guess too high. " +
        "Think carefully about <em>why</em> they chose to show you " +
        "certain numbers and not others.</p>" +

        "<p>Good luck!</p>",
      minTimeSeconds: 8
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
    // POST-TASK QUESTIONNAIRE
    // ──────────────────────────────────────────────────────────────────
    {
      id: "posttask",
      type: "questionnaire",
      title: "Your Experience",
      minTimeSeconds: 20,
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
