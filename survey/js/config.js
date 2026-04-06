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
  version: "0.3.0-split",

  // ── Data Endpoint ────────────────────────────────────────────────────
  dataEndpoint: "https://script.google.com/macros/s/AKfycbyGF-wrCRMydHe726y-Iur7239XdLbJBD-BtGdFTUBgrsHRhFWB43SF_lyvEqbu4ZJ9/exec",

  // ── Prolific Integration ─────────────────────────────────────────────
  // Part 1 (instructions + quiz): two codes -- pass and fail
  passCompletionCode: "PASS1FBO",
  passCompletionUrl: "https://app.prolific.com/submissions/complete?cc=PASS1FBO",
  failCompletionCode: "FAIL1FBO",
  failCompletionUrl: "https://app.prolific.com/submissions/complete?cc=FAIL1FBO",
  // Part 2 (trials): single code
  part2CompletionCode: "PART2FBO",
  part2CompletionUrl: "https://app.prolific.com/submissions/complete?cc=PART2FBO",
  // Direct link to Part 2 study on Prolific (fill in after running create-two-part)
  part2StudyUrl: "",  // e.g. "https://app.prolific.com/studies/STUDY_ID/start"
  // Legacy (full survey fallback)
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
    baseAmount: 1.00,
    penaltyPerUnit: 0.20,
    floor: 0.00,
    selectionMethod: "random_trial"
  },

  // ── Part 1 Pages (instructions + quiz, ~5 min, $1) ─────────────────
  // Accessed via ?part=1. Visual instructions, comprehension quiz, completion.
  // minTimeSeconds formula: round(6 + 0.18*words + 0.0018*words^2)
  part1Pages: [

    // ── WELCOME ── (~70 words -> 23s)
    {
      id: "p1_welcome",
      type: "welcome",
      title: "Welcome!",
      subtitle: "Part 1: Learning the Game",
      body: "<p>In this short task (<strong>~5 minutes</strong>), we will teach you " +
            "a simple guessing game and ask you a short quiz.</p>" +
            "<p>If you pass the quiz, you will be invited to <strong>Part 2</strong> " +
            "(a separate Prolific study, ~10 minutes) where you play the game " +
            "for <strong>$2.00 base pay</strong> plus an <strong>accuracy bonus " +
            "of up to $1.00</strong>.</p>" +
            "<p>You will be paid <strong>$1.00</strong> for completing this part, " +
            "regardless of your quiz result.</p>",
      buttonText: "Let's Go"
    },

    // ── CONSENT ──
    {
      id: "p1_consent",
      type: "consent",
      title: "Informed Consent",
      body: "<p>You are being invited to participate in a research study about " +
            "decision-making under uncertainty.</p>" +
            "<p><strong>What you will do:</strong> Learn the rules of a guessing game " +
            "and answer a short quiz.</p>" +
            "<p><strong>Time:</strong> Approximately 5 minutes.</p>" +
            "<p><strong>Compensation:</strong> $1.00 for this part. If you pass the quiz, " +
            "you will be invited to Part 2 (a separate Prolific study, ~10 minutes, " +
            "$2.00 base + up to $1.00 accuracy bonus).</p>" +
            "<p><strong>Risks:</strong> No known risks beyond those of everyday life.</p>" +
            "<p><strong>Confidentiality:</strong> Your responses are anonymous. " +
            "We collect your Prolific ID only to process payment.</p>" +
            "<p><strong>Voluntary:</strong> You may withdraw at any time by closing " +
            "this window.</p>",
      mustAgree: true,
      declineMessage: "You must agree to participate in order to continue.",
      minTimeSeconds: 27
    },

    // ── INSTRUCTION 1: Meet the Players ── (~40 words -> 16s)
    {
      id: "p1_inst1",
      type: "instructions",
      title: "Meet the Players",
      body:
        "<div class='players-visual'>" +
          "<div class='player-card'>" +
            "<div class='player-icon player-you'>" +
              "<svg viewBox='0 0 64 64' width='64' height='64'>" +
                "<circle cx='32' cy='22' r='14' fill='#4361ee'/>" +
                "<ellipse cx='32' cy='54' rx='22' ry='14' fill='#4361ee'/>" +
              "</svg>" +
            "</div>" +
            "<div class='player-label'>You</div>" +
            "<div class='player-desc'>The Guesser</div>" +
          "</div>" +
          "<div class='player-vs'>vs</div>" +
          "<div class='player-card'>" +
            "<div class='player-icon player-sender'>" +
              "<svg viewBox='0 0 64 64' width='64' height='64'>" +
                "<circle cx='32' cy='22' r='14' fill='#f77f00'/>" +
                "<ellipse cx='32' cy='54' rx='22' ry='14' fill='#f77f00'/>" +
              "</svg>" +
            "</div>" +
            "<div class='player-label'>The Sender</div>" +
            "<div class='player-desc'>A real person</div>" +
          "</div>" +
        "</div>" +
        "<p>In this game, you are paired with another player called " +
        "<strong>the Sender</strong>.</p>" +
        "<p>The Sender is a <strong>real person</strong> who already played " +
        "their part. You are seeing the results of their choices.</p>",
      minTimeSeconds: 11
    },

    // ── INSTRUCTION 2: The Sender Gets Numbers ──
    {
      id: "p1_inst2",
      type: "instructions",
      title: "The Sender Gets Numbers",
      body:
        "<p>A random number generator gives the Sender a set of <strong>secret numbers</strong>.</p>" +
        "<p>Each number is between <strong>1 and 10</strong>.</p>" +
        "<p>The amount of numbers changes each round -- sometimes just 2, sometimes 4, 8, or even 10.</p>" +
        "<div class='example-box'>" +
          "<div class='example-label'>Example</div>" +
          "<p>The Sender gets <strong>4 numbers</strong>:</p>" +
          "<div class='sender-number-cards'>" +
            "<div class='sender-number-card'>3</div>" +
            "<div class='sender-number-card'>5</div>" +
            "<div class='sender-number-card'>7</div>" +
            "<div class='sender-number-card'>9</div>" +
          "</div>" +
        "</div>",
      minTimeSeconds: 12
    },

    // ── INSTRUCTION 3: The Sender Picks ──
    {
      id: "p1_inst3",
      type: "instructions",
      title: "The Sender Picks What to Show",
      body:
        "<p>The Sender looks at all their numbers and <strong>decides which ones " +
        "to show you</strong>.</p>" +
        "<p>They can show <strong>all</strong>, <strong>some</strong>, " +
        "or <strong>none</strong> of their numbers. It is entirely their choice.</p>" +
        "<div class='example-box'>" +
          "<div class='example-label'>Example (continued)</div>" +
          "<p>The Sender has 3, 5, 7, 9 and decides to show you <strong>only the " +
          "7 and 9</strong>:</p>" +
          "<div class='sender-number-cards'>" +
            "<div class='sender-number-card card-hidden'>3</div>" +
            "<div class='sender-number-card card-hidden'>5</div>" +
            "<div class='sender-number-card card-shown'>7</div>" +
            "<div class='sender-number-card card-shown'>9</div>" +
          "</div>" +
          "<p class='example-note'>The 3 and 5 are hidden from you.</p>" +
        "</div>",
      minTimeSeconds: 17
    },

    // ── INSTRUCTION 4: You Guess the Average ──
    {
      id: "p1_inst4",
      type: "instructions",
      title: "You Guess the Average",
      body:
        "<p>Your job is to guess the <strong>average of ALL the Sender's numbers</strong> " +
        "-- including any they chose not to show you.</p>" +
        "<div class='example-box'>" +
          "<div class='example-label'>Example (continued)</div>" +
          "<p>You see <strong>7</strong> and <strong>9</strong>. But the Sender " +
          "actually has <strong>3, 5, 7, 9</strong>.</p>" +
          "<p>The true average is (3 + 5 + 7 + 9) / 4 = <strong>6.00</strong></p>" +
          "<p>If you only averaged what you saw (7 and 9), you would get 8.00 -- too high!</p>" +
        "</div>",
      minTimeSeconds: 19
    },

    // ── INSTRUCTION 5: How the Sender is Paid ──
    {
      id: "p1_inst5",
      type: "instructions",
      title: "How the Sender is Paid",
      body:
        "<p>The Sender's payment is simple:</p>" +
        "<p><strong>Sender's pay = $0.50 &times; your guess</strong></p>" +
        "<p>That's it. The Sender's pay depends <strong>only</strong> on what you guess. " +
        "It has nothing to do with the true average, or how close you are, or which " +
        "numbers were hidden. The higher your guess, the more the Sender earns.</p>" +
        "<div class='example-box'>" +
          "<div class='example-label'>Examples</div>" +
          "<p>Suppose the Sender has numbers 2, 4, 6 (true average = 4.00):</p>" +
          "<ul>" +
            "<li>You guess <strong>4.0</strong> &rarr; Sender earns $0.50 &times; 4.0 = <strong>$2.00</strong></li>" +
            "<li>You guess <strong>7.0</strong> &rarr; Sender earns $0.50 &times; 7.0 = <strong>$3.50</strong></li>" +
            "<li>You guess <strong>9.0</strong> &rarr; Sender earns $0.50 &times; 9.0 = <strong>$4.50</strong></li>" +
          "</ul>" +
          "<p>Notice: the Sender earns more when you guess higher, regardless of " +
          "what the actual numbers are.</p>" +
        "</div>" +
        "<p>The Sender sees all their numbers before deciding which ones to show you. " +
        "Keep this in mind.</p>",
      minTimeSeconds: 20
    },

    // ── INSTRUCTION 6: How You are Paid ──
    {
      id: "p1_inst6",
      type: "instructions",
      title: "How Your Bonus Works",
      body:
        "<p>You earn more when your guess is <strong>close to the true average</strong>.</p>" +
        "<p><strong>Bonus = $1.00 &minus; $0.20 &times; |your error|</strong></p>" +
        "<p>In Part 2, you play <strong>18 rounds</strong>. At the end, " +
        "one round is randomly selected for your bonus.</p>" +
        "<div class='example-box'>" +
          "<div class='example-label'>Example</div>" +
          "<p>Suppose the true average is <strong>5.00</strong>:</p>" +
          "<ul>" +
            "<li>You guess <strong>5.0</strong> &rarr; error = 0 &rarr; bonus = <strong>$1.00</strong></li>" +
            "<li>You guess <strong>6.0</strong> &rarr; error = 1 &rarr; bonus = <strong>$0.80</strong></li>" +
            "<li>You guess <strong>8.0</strong> &rarr; error = 3 &rarr; bonus = <strong>$0.40</strong></li>" +
            "<li>You guess <strong>10.0</strong> &rarr; error = 5 &rarr; bonus = <strong>$0.00</strong></li>" +
          "</ul>" +
        "</div>",
      minTimeSeconds: 25
    },

    // ── INSTRUCTION 7: A Complete Example ──
    {
      id: "p1_inst7",
      type: "instructions",
      title: "Putting It All Together",
      body:
        "<p>Let's walk through a complete round.</p>" +
        "<p><strong>Step 1:</strong> The Sender gets <strong>4 numbers</strong>:</p>" +
        "<div class='sender-number-cards'>" +
          "<div class='sender-number-card'>3</div>" +
          "<div class='sender-number-card'>5</div>" +
          "<div class='sender-number-card'>7</div>" +
          "<div class='sender-number-card'>9</div>" +
        "</div>" +
        "<p><strong>Step 2:</strong> The Sender decides to show you <strong>only the 7 and 9</strong>:</p>" +
        "<div class='sender-number-cards'>" +
          "<div class='sender-number-card card-hidden'>3</div>" +
          "<div class='sender-number-card card-hidden'>5</div>" +
          "<div class='sender-number-card card-shown'>7</div>" +
          "<div class='sender-number-card card-shown'>9</div>" +
        "</div>" +
        "<p><strong>Step 3:</strong> You guess the average of ALL 4 numbers.</p>" +
        "<p>The true average is (3 + 5 + 7 + 9) / 4 = <strong>6.00</strong></p>" +
        "<div class='example-box'>" +
          "<div class='example-label'>If you guess 6.0 (correct)</div>" +
          "<ul>" +
            "<li><strong>Your bonus:</strong> $1.00 &minus; $0.20 &times; 0 = <strong>$1.00</strong></li>" +
            "<li><strong>Sender earns:</strong> $0.50 &times; 6.0 = <strong>$3.00</strong></li>" +
          "</ul>" +
        "</div>" +
        "<div class='example-box'>" +
          "<div class='example-label'>If you guess 8.0 (too high)</div>" +
          "<ul>" +
            "<li><strong>Your bonus:</strong> $1.00 &minus; $0.20 &times; 2 = <strong>$0.60</strong></li>" +
            "<li><strong>Sender earns:</strong> $0.50 &times; 8.0 = <strong>$4.00</strong></li>" +
          "</ul>" +
          "<p class='example-note'>You lose money by guessing too high, but the Sender earns more.</p>" +
        "</div>",
      minTimeSeconds: 27
    },

    // ── INSTRUCTION 8: Summary ──
    {
      id: "p1_inst8",
      type: "instructions",
      title: "Summary",
      body:
        "<div class='game-flow'>" +
          "<div class='flow-step'>" +
            "<div class='flow-step-number'>1</div>" +
            "<div class='flow-step-content'>" +
              "<strong>Sender gets numbers</strong><br>Random numbers, each 1-10" +
            "</div>" +
          "</div>" +
          "<div class='flow-arrow'>&#9660;</div>" +
          "<div class='flow-step'>" +
            "<div class='flow-step-number'>2</div>" +
            "<div class='flow-step-content'>" +
              "<strong>Sender picks what to show</strong><br>They choose which numbers you see" +
            "</div>" +
          "</div>" +
          "<div class='flow-arrow'>&#9660;</div>" +
          "<div class='flow-step'>" +
            "<div class='flow-step-number'>3</div>" +
            "<div class='flow-step-content'>" +
              "<strong>You guess the average</strong><br>Of ALL numbers (shown + hidden)" +
            "</div>" +
          "</div>" +
        "</div>" +
        "<p style='margin-top:16px;'><strong>You</strong> earn more when your guess is accurate. " +
        "<strong>The Sender</strong> earns $0.50 &times; your guess (higher guess = more pay for them).</p>" +
        "<p style='text-align:center; margin-top:16px;'>Now let's check that you've got it!</p>",
      minTimeSeconds: 14
    },

    // ── COMPREHENSION QUIZ ──
    {
      id: "p1_comprehension",
      type: "comprehension",
      title: "Quick Quiz",
      description: "<p>Answer these questions to show you understand the game.</p>",
      questions: [
        {
          prompt: "Who decides which numbers you see?",
          type: "radio",
          correct: "sender_choice",
          options: [
            { value: "computer", label: "The computer randomly selects which numbers are shown" },
            { value: "sender_choice", label: "The Sender looks at all numbers and chooses which to reveal" },
            { value: "you_pick", label: "I choose which numbers to reveal" },
            { value: "all_shown", label: "All numbers are always shown" }
          ],
        },
        {
          prompt: "How is the <strong>Sender</strong> paid?",
          type: "radio",
          correct: "higher_guess",
          options: [
            { value: "accuracy", label: "The Sender earns more when my guess is close to the true average" },
            { value: "higher_guess", label: "The Sender earns $0.50 times my guess -- higher guess means more pay" },
            { value: "flat", label: "The Sender gets a flat payment regardless of my guess" },
            { value: "lower_guess", label: "The Sender earns more when my guess is lower" }
          ],
        },
        {
          prompt: "What are you guessing?",
          type: "radio",
          correct: "all_avg",
          options: [
            { value: "shown_avg", label: "The average of only the numbers the Sender showed me" },
            { value: "all_avg", label: "The average of ALL the Sender's numbers (shown and hidden)" },
            { value: "hidden_only", label: "The total of the hidden numbers" },
            { value: "highest", label: "The highest number the Sender has" }
          ],
        },
        {
          prompt: "The Sender has <strong>6 numbers</strong>: 7, 2, 9, 1, 3, 8. " +
                  "They show you <strong>9</strong> and <strong>8</strong>. " +
                  "What is the true average of ALL 6 numbers?",
          type: "radio",
          correct: "5.00",
          options: [
            { value: "8.50", label: "8.50" },
            { value: "5.00", label: "5.00" },
            { value: "6.00", label: "6.00" },
            { value: "7.00", label: "7.00" }
          ],
        },
        {
          prompt: "The true average of the Sender's numbers is 4.00. " +
                  "You guess 7.00. Who benefits from this guess?",
          type: "radio",
          correct: "sender_benefits",
          options: [
            { value: "you_benefit", label: "I benefit -- my guess earns me a larger bonus" },
            { value: "sender_benefits", label: "The Sender benefits -- they earn more from a higher guess" },
            { value: "both_benefit", label: "Both of us benefit equally" },
            { value: "neither", label: "Neither -- the guess has no effect on payment" }
          ],
        }
      ],
      minTimeSeconds: 25,
      maxAttempts: 1,
      failMessage: "Unfortunately, you were unable to answer the comprehension questions correctly. " +
                   "We are unable to include you in Part 2. Thank you for your time -- you will " +
                   "still be paid $1.00 for completing this part."
    },

    // ── COMPLETION (pass) ──
    {
      id: "p1_completion",
      type: "completion",
      title: "You Passed!",
      body: "<p>Great job -- you understand the game!</p>" +
            "<p><strong>Part 2</strong> is a separate Prolific study (~10 minutes, " +
            "$2.00 base + up to $1.00 accuracy bonus).</p>"
    }
  ],

  // ── Part 2 Pages (trials + debrief, ~12 min, $2.50 + bonus) ──────
  // Accessed via ?part=2. Reminder, slider tutorial, format explanation,
  // trial blocks, posttask, demographics, debrief.
  part2Pages: [

    // ── WELCOME BACK ──
    {
      id: "p2_welcome",
      type: "welcome",
      title: "Welcome to Part 2!",
      subtitle: "The Guessing Game",
      body: "<p>Thank you for returning! This part takes about <strong>12 minutes</strong>.</p>" +
            "<p>You will receive <strong>$2.00 base payment</strong> plus an " +
            "<strong>accuracy-based bonus of up to $1.00</strong>.</p>",
      buttonText: "Continue"
    },

    // ── QUICK REMINDER ──
    {
      id: "p2_reminder",
      type: "instructions",
      title: "Quick Reminder",
      body:
        "<div class='game-flow game-flow-compact'>" +
          "<div class='flow-step'>" +
            "<div class='flow-step-number'>1</div>" +
            "<div class='flow-step-content'>" +
              "The Sender gets <strong>secret numbers</strong> (each 1-10)" +
            "</div>" +
          "</div>" +
          "<div class='flow-arrow'>&#9660;</div>" +
          "<div class='flow-step'>" +
            "<div class='flow-step-number'>2</div>" +
            "<div class='flow-step-content'>" +
              "They <strong>choose which to show</strong> you (they want you to guess high)" +
            "</div>" +
          "</div>" +
          "<div class='flow-arrow'>&#9660;</div>" +
          "<div class='flow-step'>" +
            "<div class='flow-step-number'>3</div>" +
            "<div class='flow-step-content'>" +
              "You <strong>guess the average</strong> of ALL numbers (shown + hidden)" +
            "</div>" +
          "</div>" +
        "</div>" +
        "<p>Your bonus depends on accuracy. The Sender benefits from making you guess too high.</p>",
      minTimeSeconds: 8
    },

    // ── SLIDER TUTORIAL ──
    {
      id: "p2_slider_tutorial",
      type: "slider_tutorial",
      title: "How to Answer",
      body: "<p>In each round, you will use a <strong>slider</strong> to enter your guess.</p>" +
            "<p>The slider goes from <strong>1.0</strong> to <strong>10.0</strong>. " +
            "Drag it left or right to set your answer.</p>" +
            "<p>Try it now -- move the slider to the target value below:</p>",
      targetValue: "7.5",
      minTimeSeconds: 8
    },

    // ── FORMAT EXPLANATION (condition-specific) ──
    {
      id: "p2_format",
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
        "<p>You see only the number(s) the Sender chose to reveal.</p>" +
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
        "<p>You see all slots -- the revealed number and <em>[Not shown]</em> " +
        "markers for hidden ones.</p>" +
        "<!--endif:explicit_first-->" +

        "<p>Your task: guess the <strong>average of all numbers</strong>. " +
        "Think about what the Sender might be hiding!</p>",
      minTimeSeconds: 15
    },

    // ── INSTRUCTIONS -- Ready ──
    {
      id: "p2_ready",
      type: "instructions",
      title: "Ready to Start!",
      body:
        "<p>You will play <strong>18 rounds</strong> in two blocks of 9.</p>" +
        "<p>Remember:</p>" +
        "<ul>" +
          "<li>The Sender wants you to guess <strong>high</strong></li>" +
          "<li>You want to guess <strong>accurately</strong></li>" +
          "<li>Think about what the Sender chose to show -- and what they might be hiding</li>" +
        "</ul>" +
        "<p>Good luck!</p>",
      minTimeSeconds: 6
    },

    // ── TRIAL BLOCK 1 -- 9 trials in first display format ──
    {
      id: "trials_block1",
      type: "trial_block",
      block: 1,
      randomize: true,
      trials: [
        // HIGH sender: k=1 extremes (N=2 vs N=8)
        { id: "t1", N: 2, k: 1, disclosed: [8],       hidden: [3],                    trueAverage: 5.50 },
        { id: "t2", N: 8, k: 1, disclosed: [8],       hidden: [7, 5, 4, 3, 2, 1, 1], trueAverage: 3.88 },
        // HIGH sender: k=2 extremes (N=4 vs N=10)
        { id: "t3", N: 4,  k: 2, disclosed: [9, 4],   hidden: [3, 1],                         trueAverage: 4.25 },
        { id: "t4", N: 10, k: 2, disclosed: [9, 4],   hidden: [4, 3, 3, 2, 2, 1, 1, 1],       trueAverage: 3.00 },
        // HIGH sender: k=3 extremes (N=4 vs N=10)
        { id: "t5", N: 4,  k: 3, disclosed: [10, 7, 4], hidden: [2],                           trueAverage: 5.75 },
        { id: "t6", N: 10, k: 3, disclosed: [10, 7, 4], hidden: [4, 3, 3, 2, 2, 1, 1],         trueAverage: 3.70 },
        // LOW sender: symmetry tests (all N=8)
        { id: "t7", N: 8, k: 1, disclosed: [4],       hidden: [3, 3, 2, 2, 1, 1, 1], trueAverage: 2.12 },
        { id: "t8", N: 8, k: 2, disclosed: [5, 2],    hidden: [2, 2, 1, 1, 1, 1],    trueAverage: 1.88 },
        { id: "t9", N: 8, k: 3, disclosed: [5, 4, 1], hidden: [1, 1, 1, 1, 1],       trueAverage: 1.88 }
      ]
    },

    // ── TRANSITION between blocks ──
    {
      id: "block_transition",
      type: "transition",
      title: "Block 2 of 2",
      body:
        "<p>You have completed Block 1. Great job!</p>" +
        "<p>In Block 2, you will play <strong>9 more rounds</strong> of the same game, " +
        "but the information will be presented in a <strong>different format</strong>.</p>" +

        "<!--if:clean_first-->" +
        "<p>Using the same example -- the Sender has 2 numbers (4 and 6) " +
        "and shows you only the 6:</p>" +
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
        "<p>You now see <strong>all slots</strong> -- revealed numbers plus " +
        "<em>[Not shown]</em> markers for hidden ones.</p>" +
        "<!--endif:clean_first-->" +

        "<!--if:explicit_first-->" +
        "<p>Using the same example -- the Sender has 2 numbers (4 and 6) " +
        "and shows you only the 6:</p>" +
        "<div class='trial-card'>" +
          "<div class='trial-header'>The Sender chose to show you:</div>" +
          "<div class='trial-disclosed-values-row'>" +
            "<canvas class='digit-canvas' data-d='6' width='36' height='48'></canvas>" +
          "</div>" +
        "</div>" +
        "<p>You now see <strong>only the numbers</strong> the Sender chose to reveal.</p>" +
        "<!--endif:explicit_first-->" +

        "<p>The game is identical -- same incentives, same types of numbers. " +
        "Only the display format changes.</p>",
      minTimeSeconds: 12
    },

    // ── TRIAL BLOCK 2 -- 9 trials in second display format ──
    {
      id: "trials_block2",
      type: "trial_block",
      block: 2,
      randomize: true,
      trials: [
        // HIGH sender: k=1 extremes (N=2 vs N=8)
        { id: "t1", N: 2, k: 1, disclosed: [8],       hidden: [3],                    trueAverage: 5.50 },
        { id: "t2", N: 8, k: 1, disclosed: [8],       hidden: [7, 5, 4, 3, 2, 1, 1], trueAverage: 3.88 },
        // HIGH sender: k=2 extremes (N=4 vs N=10)
        { id: "t3", N: 4,  k: 2, disclosed: [9, 4],   hidden: [3, 1],                         trueAverage: 4.25 },
        { id: "t4", N: 10, k: 2, disclosed: [9, 4],   hidden: [4, 3, 3, 2, 2, 1, 1, 1],       trueAverage: 3.00 },
        // HIGH sender: k=3 extremes (N=4 vs N=10)
        { id: "t5", N: 4,  k: 3, disclosed: [10, 7, 4], hidden: [2],                           trueAverage: 5.75 },
        { id: "t6", N: 10, k: 3, disclosed: [10, 7, 4], hidden: [4, 3, 3, 2, 2, 1, 1],         trueAverage: 3.70 },
        // LOW sender: symmetry tests (all N=8)
        { id: "t7", N: 8, k: 1, disclosed: [4],       hidden: [3, 3, 2, 2, 1, 1, 1], trueAverage: 2.12 },
        { id: "t8", N: 8, k: 2, disclosed: [5, 2],    hidden: [2, 2, 1, 1, 1, 1],    trueAverage: 1.88 },
        { id: "t9", N: 8, k: 3, disclosed: [5, 4, 1], hidden: [1, 1, 1, 1, 1],       trueAverage: 1.88 }
      ]
    },

    // ── ATTENTION CHECK ──
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
      minTimeSeconds: 10
    },

    // ── POST-TASK QUESTIONNAIRE ──
    {
      id: "posttask",
      type: "questionnaire",
      title: "Your Experience",
      minTimeSeconds: 15,
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

    // ── DEMOGRAPHICS ──
    {
      id: "demographics",
      type: "questionnaire",
      title: "About You",
      minTimeSeconds: 15,
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

    // ── DEBRIEF ──
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
  ],

  // ── Full Survey Pages (legacy, used when ?part is not specified) ────
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
            "<p>You will receive <strong>$2.00 base payment</strong> plus an " +
            "<strong>accuracy-based bonus of up to $1.00</strong> depending on how " +
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
            "<p><strong>Compensation:</strong> You will receive a $2.00 base payment " +
            "plus an accuracy-based bonus of up to $1.00 depending on how close your " +
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
        "Sometimes the Sender gets just 2 numbers, sometimes 4, 8, or even 10.</p>" +

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
        }
      ],
      minTimeSeconds: 30,
      maxAttempts: 1,
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
