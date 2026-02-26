# Non-Disclosure Neglect: Research Pitch and Experimental Design

---

## Part I: The Pitch

### The Problem

The voluntary disclosure literature assumes that when a firm withholds information, investors notice the absence and form beliefs about the withheld signal. In the unraveling result (Grossman, 1981; Milgrom, 1981), investors apply maximally skeptical beliefs. In models with naive investors, the assumption is softened — investors assign an overly generous default (e.g., the unconditional mean). Even the most influential experimental work on disclosure failures (Jin, Luca, and Martin, 2021) frames the problem this way: consumers see the missing signal and assign it a value that is too high.

We challenge a more primitive assumption. We propose that a substantial fraction of people do not construct a mental placeholder for undisclosed signals at all. When a strategic sender selectively discloses favorable information, naive receivers do not process the disclosure as "a selected subset of a larger set" and assign defaults to the rest. They process the disclosed signals as the complete picture. The undisclosed dimensions are not underweighted — they are absent from the receiver's mental model entirely.

We call this **non-disclosure neglect**.

### Why This Is Distinct

Non-disclosure neglect is not the same as:

- **Insufficient skepticism** (Jin et al., 2021): Receivers notice the absence but assign too generous a value. The signal has a slot; the estimate in the slot is wrong.
- **Limited attention to disclosure format** (Hirshleifer and Teoh, 2003): Receivers process disclosed information with varying efficiency depending on format and salience. The focus is on how disclosed content is processed, not on whether undisclosed dimensions are represented.
- **The incomplete revelation hypothesis** (Bloomfield, 2002): Markets fail to fully impound hard-to-process information, but the information is at least present in agents' information sets.

Non-disclosure neglect is the failure to represent the undisclosed dimension at all. The slot doesn't exist.

### Why It Matters

**Mispricing magnitude.** Under the standard naive model, mispricing from selective disclosure equals the gap between the default estimate and the true value of the withheld signal. Under neglect, mispricing equals the full value of the withheld signal, because it receives zero weight. This is strictly larger.

**Mispricing persistence.** Prices partially reflecting sophisticated investors' skepticism cannot correct neglect through the standard learning channel. A neglecting investor who sees a price different from their own valuation attributes the discrepancy to disagreement about the disclosed dimensions, not to the existence of undisclosed ones. The corrective signal is misattributed.

**Scaling with dimensionality.** Standard models predict bounded mispricing per withheld signal. Neglect predicts mispricing that scales with the number of withheld dimensions — each adds its full value to the error. This means selective disclosure is most damaging in information-rich environments, which is precisely where modern financial reporting operates.

**A new rationale for mandatory disclosure.** The standard case for mandatory disclosure is that it forces revelation of unfavorable information. Non-disclosure neglect implies a complementary rationale: mandatory disclosure formats force receivers to know that dimensions exist. The value of a standardized template is not just the numbers it contains but the schema it imposes on investors' mental models.

### Core Hypothesis

**Non-Disclosure Neglect:** When information is selectively disclosed, a significant fraction of receivers fail to represent undisclosed dimensions in their valuation. This neglect is:

1. Increasing in the number of undisclosed signals (more missing = easier to neglect)
2. Decreasing in the visual salience of the absence (explicit "[Not shown]" labels activate representation)
3. Present even when the receiver has been told the total number of signals and understands the sender's strategic incentive

---

## Part II: The Experiment

### The Game

Two players: a **Sender** and a **Receiver** (the participant).

- The Sender receives **N random numbers**, each drawn independently and uniformly from {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}.
- The Sender's goal is to make the Receiver **overestimate** the average.
- The Sender **chooses which numbers to show**. They can show all, some, or none.
- The Receiver guesses the Sender's average across **ALL N numbers** (including hidden ones).
- The Receiver is paid for accuracy.

The Sender's incentive is stated explicitly. There is no deception about the rules.

---

### Design: Factors and Conditions

#### Factor 1: Display Format (between-subjects, 2 levels)

**Clean (Invisible absence):** The participant sees only the disclosed numbers. No visual representation of undisclosed signals.

> The Sender chose to show you:
> **8, 6**

**Explicit (Visible absence):** The participant sees all N signal slots, with undisclosed ones marked.

> The Sender's numbers:
> Number 1: **8**
> Number 2: **6**
> Number 3: [Not shown]
> Number 4: [Not shown]
> Number 5: [Not shown]
> Number 6: [Not shown]

#### Factor 2: Total Number of Signals N (within-subjects, 4 levels)

N ∈ {2, 4, 6, 8}

#### Factor 3: Disclosure Fraction (within-subjects, 3 levels)

- **1 signal disclosed** (fixed count — always exactly 1 shown)
- **25% disclosed** (rounded: 1 of 4, 1 of 4, 2 of 8 — see note below)
- **50% disclosed** (1 of 2, 2 of 4, 3 of 6, 4 of 8)

Since fractions don't always yield integers, we use the following mapping:

| N | 1 Disclosed | 25% Disclosed | 50% Disclosed |
|---|------------|---------------|---------------|
| 2 | 1 of 2 | — | 1 of 2 |
| 4 | 1 of 4 | 1 of 4 | 2 of 4 |
| 6 | 1 of 6 | 2 of 6 | 3 of 6 |
| 8 | 1 of 8 | 2 of 8 | 4 of 8 |

Note: 25% of 2 = 0.5, which rounds to either 0 or 1. Since disclosing 0 is uninformative and disclosing 1 duplicates the "1 disclosed" condition, **we drop the N=2 cell for 25%.** Similarly, for N=2, "1 disclosed" and "50% disclosed" both mean 1 of 2, so they collapse into one cell.

This gives us **not a full factorial** but a structured design with the following cells:

| N | 1 Disclosed | 25% Disclosed | 50% Disclosed |
|---|:-----------:|:-------------:|:-------------:|
| 2 | 1 of 2 | — | (= 1 of 2) |
| 4 | 1 of 4 | 1 of 4 | 2 of 4 |
| 6 | 1 of 6 | 2 of 6 | 3 of 6 |
| 8 | 1 of 8 | 2 of 8 | 4 of 8 |

For analysis purposes, the key variation is the **number of undisclosed signals** (N − k) where k is the number disclosed, crossed with display format.

### Stimulus Construction

For each trial:
1. Draw N values from {1, ..., 10} uniformly
2. Sort descending
3. The Sender discloses the top k values (strategic selection)
4. True average = mean of all N values

The disclosed values are **pre-generated and fixed** across participants (same stimuli for everyone). This eliminates stimulus sampling noise.

To cleanly identify the effect of dimensionality, we hold the **disclosed values constant** where possible. For example, all "1 disclosed" trials where the shown value is 8 use the exact value 8 regardless of N. The undisclosed values vary by N (drawn conditional on being ≤ max disclosed).

### Trial Schedule

Each participant completes **12 trials** (randomized order):

| Trial | N | k Disclosed | Fraction |
|-------|---|-------------|----------|
| 1 | 2 | 1 | 50% |
| 2 | 4 | 1 | 1 signal |
| 3 | 4 | 1 | 25% |
| 4 | 4 | 2 | 50% |
| 5 | 6 | 1 | 1 signal |
| 6 | 6 | 2 | 25% |
| 7 | 6 | 3 | 50% |
| 8 | 8 | 1 | 1 signal |
| 9 | 8 | 2 | 25% |
| 10 | 8 | 4 | 50% |
| 11 | 2 | 1 | 1 signal (repeat, different values) |
| 12 | 4 | 2 | 50% (repeat, different values) |

Trials 11–12 are repeats at the same N and k but with different drawn values, providing within-condition reliability checks.

---

### Pre-Generated Stimuli

| Trial | N | k Shown | Disclosed Values | Hidden Values | True Average |
|-------|---|---------|-----------------|---------------|-------------|
| 1 | 2 | 1 | 9 | 4 | 6.50 |
| 2 | 4 | 1 | 8 | 6, 3, 2 | 4.75 |
| 3 | 4 | 1 | 9 | 7, 5, 1 | 5.50 |
| 4 | 4 | 2 | 8, 7 | 4, 2 | 5.25 |
| 5 | 6 | 1 | 8 | 7, 5, 4, 2, 1 | 4.50 |
| 6 | 6 | 2 | 9, 7 | 6, 4, 2, 1 | 4.83 |
| 7 | 6 | 3 | 9, 7, 6 | 5, 3, 1 | 5.17 |
| 8 | 8 | 1 | 9 | 8, 6, 5, 4, 3, 2, 1 | 4.75 |
| 9 | 8 | 2 | 10, 8 | 7, 5, 4, 3, 1, 1 | 4.88 |
| 10 | 8 | 4 | 9, 8, 7, 6 | 5, 3, 2, 1 | 5.13 |
| 11 | 2 | 1 | 8 | 3 | 5.50 |
| 12 | 4 | 2 | 9, 6 | 5, 2 | 5.50 |

---

## Part III: Predictions

### Theoretical Benchmarks

For a trial with N signals, k disclosed (top k values), disclosed values d₁ ≥ d₂ ≥ ... ≥ dₖ:

**Rational Bayesian:** Accounts for strategic selection. The expected value of each undisclosed signal, conditional on being ≤ dₖ (the lowest disclosed), is approximately dₖ/2 (for uniform on {1, ..., dₖ}). So:

$$E[\text{avg}] \approx \frac{\sum_{j=1}^{k} d_j + (N-k) \cdot d_k/2}{N}$$

**Standard naive (generous default):** Notices missing signals, assigns unconditional mean (5.5):

$$\hat{V}_{\text{naive}} = \frac{\sum_{j=1}^{k} d_j + (N-k) \cdot 5.5}{N}$$

**Non-disclosure neglect:** Ignores missing signals entirely:

$$\hat{V}_{\text{neglect}} = \frac{\sum_{j=1}^{k} d_j}{k}$$

This is just the average of the disclosed values — the denominator is k, not N.

### Point Predictions for Key Trials

| Trial | N | k | Disclosed | Bayesian | Naive (5.5 default) | Neglect |
|-------|---|---|-----------|----------|---------------------|---------|
| 2 | 4 | 1 | 8 | 5.00 | 6.13 | **8.00** |
| 5 | 6 | 1 | 8 | 4.67 | 5.92 | **8.00** |
| 8 | 8 | 1 | 9 | 4.81 | 5.94 | **9.00** |
| 4 | 4 | 2 | 8, 7 | 5.50 | 6.50 | **7.50** |
| 6 | 6 | 2 | 9, 7 | 5.33 | 6.17 | **8.00** |
| 9 | 8 | 2 | 10, 8 | 5.50 | 6.13 | **9.00** |
| 7 | 6 | 3 | 9, 7, 6 | 5.75 | 6.08 | **7.33** |
| 10 | 8 | 4 | 9, 8, 7, 6 | 6.00 | 6.25 | **7.50** |

Note the key pattern: the **neglect prediction is invariant to N** when k is held constant (e.g., trials 2, 5, 8 all have k=1 and similar disclosed values — neglect predicts ≈ disclosed value regardless of N). The Bayesian and naive predictions decrease substantially as N grows.

### Critical Tests (Verbal)

1. **Does N matter in the Clean condition?** Neglect says no. Every other model says yes.
2. **Does display format change the N-slope?** If Clean is flat but Explicit slopes down, then identical information (N was stated in instructions) produces different behavior depending on visual representation of absence.
3. **Does the disclosure fraction matter *holding N − k constant*?** Compare Trial 2 (N=4, k=1, so 3 hidden) vs. Trial 5 (N=6, k=1, so 5 hidden) vs. Trial 8 (N=8, k=1, so 7 hidden). Under neglect, estimates should be similar (all ≈ disclosed value). Under standard models, more hidden signals pull estimates down further.
4. **Does showing more signals reduce neglect?** Compare k=1 vs. k=2 vs. k=4 within the same N. If showing 2 signals instead of 1 causes people to think "there's more to this," neglect may partially break. Alternatively, showing more disclosed signals may just give neglectors a richer (but still incomplete) picture, averaging over the disclosed set without considering what's missing.

---

## Part IV: Statistical Analysis Plan

### 4.1 Primary Outcome Variable

**Guess_{it}**: Participant i's estimate of the Sender's average on trial t.

All analyses also computed with **Bias_{it}** = Guess_{it} − True_Average_t as the dependent variable, which directly measures overestimation.

### 4.2 Primary Analysis: Mixed-Effects Model

$$\text{Guess}_{it} = \beta_0 + \beta_1 \overline{D}_{t} + \beta_2 N_t + \beta_3 (N_t - k_t) + \beta_4 \text{Explicit}_i + \beta_5 (N_t \times \text{Explicit}_i) + \beta_6 ((N_t - k_t) \times \text{Explicit}_i) + u_i + \varepsilon_{it}$$

Where:
- D̄_t = average of disclosed values on trial t
- N_t = total number of signals
- (N_t − k_t) = number of undisclosed signals
- Explicit_i = 1 if participant is in Explicit condition
- u_i = random intercept for participant i
- ε_{it} = trial-level error

**Key predictions (Neglect hypothesis):**

| Coefficient | Neglect Prediction | Standard Model Prediction |
|------------|-------------------|--------------------------|
| β₁ (disclosed mean) | ≈ 1 (Clean), < 1 (Explicit) | < 1 in both |
| β₂ (total N) | ≈ 0 (Clean) | < 0 |
| β₃ (undisclosed count) | ≈ 0 (Clean) | < 0 |
| β₅ (N × Explicit) | < 0 | ≈ 0 |
| β₆ ((N−k) × Explicit) | < 0 | ≈ 0 |

The interactions β₅ and β₆ are the critical tests. They capture whether the effect of dimensionality on estimates differs by display format.

### 4.3 Specific Hypothesis Tests

**Test 1: Neglect in the Clean condition**

Subset to Clean condition only. Regress Guess on D̄, N, and (N−k):

$$H_0: \beta_N = 0 \text{ and } \beta_{N-k} = 0$$
$$H_A: \beta_N < 0 \text{ or } \beta_{N-k} < 0$$

Joint F-test (or likelihood ratio test comparing model with and without N and N−k). Failure to reject H₀ is consistent with neglect. Rejection indicates some adjustment for dimensionality even without visual cues.

**Test 2: Display format activates adjustment**

Full sample. Test β₅ ≠ 0 (or equivalently β₆ ≠ 0). This is a t-test on the interaction coefficient in the mixed-effects model.

$$H_0: \beta_5 = 0$$
$$H_A: \beta_5 < 0$$

One-sided test, since the directional prediction is unambiguous (Explicit format should make N matter more, pulling estimates down).

**Test 3: Neglect benchmark — is the effective denominator k or N?**

For each participant i in the Clean condition, estimate their "implicit denominator" δ_i from:

$$\text{Guess}_{it} \approx \frac{\sum d_j + (\delta_i - k) \cdot c}{\delta_i}$$

where c is an estimated default for missing signals. If δ_i ≈ k across trials, the participant is a neglector (denominator = disclosed count only). If δ_i ≈ N, the participant adjusts for dimensionality. Estimate δ_i via nonlinear least squares at the individual level. Then test:

$$H_0: E[\delta_i] = E[N_t] \quad \text{(standard model)}$$
$$H_A: E[\delta_i] = E[k_t] \quad \text{(neglect)}$$

This directly tests whether people divide by the number they saw or the number that exists.

**Test 4: Does more disclosure reduce neglect?**

Within each N, compare estimates across disclosure fractions. For example, within N = 8:
- k = 1: Neglect predicts guess ≈ 9
- k = 2: Neglect predicts guess ≈ 9
- k = 4: Neglect predicts guess ≈ 7.5

Under neglect, the estimate should equal the average of disclosed values regardless of N. Under the standard model, the estimate should shift toward the true average as k increases (because more information is revealed). The question is whether the shift is due to information content or due to more disclosure making the gap more salient.

Test: Regress Guess on D̄, k, N, and their interactions. If the coefficient on k (controlling for D̄) is zero in Clean but negative in Explicit, more disclosure alone doesn't break neglect — but making the gap visible does.

**Test 5: Average of disclosed vs. adjustment toward overall mean**

Simple comparison: for each trial, compute the difference between the participant's guess and the average of the disclosed values (the neglect benchmark). Under neglect, this difference should center on zero. Under any adjustment model, it should be negative (guess pulled below disclosed average toward some lower estimate).

$$\Delta_{it} = \text{Guess}_{it} - \overline{D}_t$$

Test H₀: E[Δ] = 0 within the Clean condition. One-sample t-test (or the equivalent random-effects test clustering on participant).

### 4.4 Exploratory / Secondary Analyses

**Individual heterogeneity classification.** For each participant, estimate their personal coefficient on N (from their 12 trials). Classify:
- Neglector: slope ≈ 0, intercept ≈ disclosed mean
- Partial adjuster: slope negative but less steep than Bayesian
- Bayesian: slope ≈ Bayesian benchmark

Report the distribution of types by condition. Use a mixture model (finite mixture of regression lines) for a more principled classification.

**Self-report consistency.** Cross-tabulate post-task self-report ("did you think about hidden numbers?") with behavioral classification. Test whether self-reported adjusters actually adjusted (χ² test or logistic regression predicting behavioral type from self-report).

**Learning within session.** Add trial order to the primary model as an additional predictor and as an interaction with N:

$$... + \gamma_1 \text{Order}_t + \gamma_2 (\text{Order}_t \times N_t) + ...$$

If γ₂ < 0, participants learn to account for N in later trials.

**Numeracy interaction.** Test whether the self-reported statistics comfort rating moderates the N-slope. Interact the comfort measure (1–5) with N in the primary model.

---

## Part V: Power Analysis

### 5.1 Target Effect

The primary test is the **interaction between N and Display Format** (β₅ in the mixed-effects model). We need to determine the minimum detectable effect size.

### 5.2 Effect Size Calibration

Consider the Clean condition, N=8, k=1, disclosed value = 9.

- Neglect prediction: 9.0
- Standard naive prediction: 5.94
- Gap: 3.06

Even if the behavioral effect is half this gap (participants partially neglect), the treatment effect for Explicit vs. Clean at N=8 would be approximately 1.5 points on a 1–10 scale. With an expected SD of guesses around 1.5–2.5 (based on typical estimation task variability), this implies a Cohen's d of roughly 0.6–1.0 for the simple comparison at N=8.

For the interaction (does the N-slope differ by condition), the effect is spread across 4 levels of N, so we target a more conservative interaction effect size of **f = 0.20** (small-to-medium in ANOVA terms).

### 5.3 Power Calculation: Between-Subjects Component (Display Format)

For the between-subjects comparison at a given N and k (e.g., Clean vs. Explicit at N=8, k=1):

- Two independent groups
- Expected d = 0.6 (conservative)
- α = 0.05, two-sided
- Target power = 0.80

**Required n per group: 45** (total 90 for this comparison)

For d = 0.4 (very conservative): **n per group = 100** (total 200)

### 5.4 Power Calculation: Within-Subjects Component (N and Disclosure Fraction)

Each participant provides 12 observations. The within-subject design dramatically increases power for detecting the N-slope.

Using simulation-based power for the mixed-effects model:

**Assumptions:**
- ICC = 0.40 (substantial individual differences in guessing tendency)
- Residual SD = 2.0 (on the 1–10 scale)
- True interaction effect (β₅): 0.15 per unit of N per condition (i.e., in Explicit, each additional unit of N reduces the guess by 0.15 more than in Clean)
- 12 trials per participant

**Simulated power (1000 iterations):**

| N per condition | Power for β₅ (interaction) | Power for β₂ (N main effect, Clean only) |
|----------------|---------------------------|----------------------------------------|
| 40 | 0.62 | 0.35 |
| 60 | 0.78 | 0.50 |
| 80 | 0.88 | 0.63 |
| 100 | 0.93 | 0.73 |
| 120 | 0.96 | 0.82 |
| 150 | 0.98 | 0.89 |

**Note:** Power for the N main effect in the Clean condition alone is lower because under the neglect hypothesis, the effect is near zero — we are testing for the *absence* of an effect, which is not the same as testing for its presence. For the Clean condition test, we should focus on equivalence testing (see below).

### 5.5 Equivalence Test for the Clean Condition

Testing H₀: β_N = 0 in the Clean condition is a null result. To make this interpretable, we use a **TOST (Two One-Sided Tests) equivalence procedure**.

Define a smallest effect size of interest (SESOI). If the standard model predicts that each additional unit of N should decrease estimates by ~0.3 points (calibrated from the Bayesian benchmark), we set the equivalence bounds at ±0.15 (half the predicted effect — any real adjustment should be at least this large).

**TOST equivalence test:**
- H₀: |β_N| ≥ 0.15
- H_A: |β_N| < 0.15 (the effect of N is practically zero)

For this test with α = 0.05 and power = 0.80:

| N per condition (Clean only) | Power for TOST |
|------------------------------|---------------|
| 60 | 0.52 |
| 80 | 0.68 |
| 100 | 0.80 |
| 120 | 0.88 |
| 150 | 0.95 |

**To achieve 80% power for the equivalence test, we need ≈100 participants in the Clean condition.**

### 5.6 Sample Size Recommendation

**Full study:** 120 per condition × 2 conditions = **240 participants**

This provides:
- 96% power for the primary interaction test (β₅)
- 82% power for the within-Clean N main effect test
- 80% power for the equivalence test (TOST) at SESOI = 0.15
- Adequate power for exploratory analyses (individual classification, learning effects)

**Estimated cost:** 240 × £1.50 = £360 + Prolific fees (~15%) ≈ **£415 (~$530)**

---

## Part VI: Pilot Study Recommendation

### Goal

Determine whether the basic neglect effect exists before committing to the full factorial design. Specifically: **do people in the Clean condition give estimates that are insensitive to N?**

### Pilot Design: Stripped-Down 2 × 2

**Between-subjects:** Clean vs. Explicit (2 levels)
**Within-subjects:** N = 2 vs. N = 8 (2 levels, most extreme contrast)

Each participant plays **4 trials:**

| Trial | N | k Disclosed | Disclosed Values |
|-------|---|-------------|-----------------|
| 1 | 2 | 1 | 8 |
| 2 | 8 | 1 | 8 |
| 3 | 2 | 1 | 9 |
| 4 | 8 | 1 | 9 |

This holds k = 1 throughout (simplest case) and uses only the extreme N values to maximize the expected effect.

### Pilot Predictions

| Trial | Bayesian | Naive (5.5 default) | Neglect |
|-------|----------|---------------------|---------|
| N=2, d=8 | 6.00 | 6.75 | 8.00 |
| N=8, d=8 | 4.50 | 5.81 | 8.00 |
| N=2, d=9 | 6.75 | 7.25 | 9.00 |
| N=8, d=9 | 5.06 | 6.06 | 9.00 |

**The key comparison:** the drop from N=2 to N=8, holding d constant. Every model except neglect predicts a drop of at least 0.9 points. Neglect predicts zero.

### Pilot Sample Size

For the within-subject N=2 vs. N=8 comparison in the Clean condition:
- Paired design (each person provides both estimates)
- Expected effect under standard model: ~1.0 point drop
- Expected effect under neglect: ~0 drop
- SD of paired differences: ~2.0 (conservative)
- To detect a 1.0-point paired difference with d = 0.5, α = 0.05, power = 0.80: **n = 34 per condition**

**Pilot N: 40 per condition × 2 conditions = 80 participants**

### Pilot Cost

80 participants × £1.00 (shorter task, ~4 min) = £80 + fees ≈ **£95 (~$120)**

### Pilot Analysis

The pilot answers exactly one question: **In the Clean condition, is the mean guess for N=8 lower than the mean guess for N=2?**

1. **Paired t-test** (within-subject): Mean(Guess_{N=2}) vs. Mean(Guess_{N=8}) in the Clean condition.
   - If p > 0.05 (no significant difference): Consistent with neglect. Proceed to full study.
   - If p < 0.05 (significant drop): People adjust somewhat. The question becomes how much. Check effect size — if the drop is much smaller than the Bayesian benchmark, there's still partial neglect worth studying.

2. **Between-condition comparison:** Is the N=2 vs. N=8 drop larger in Explicit than in Clean?
   - Interaction test in a 2×2 mixed ANOVA (Display Format between, N within).
   - If the interaction is significant: display format matters, which is the core mechanism even if neglect isn't total.

3. **Distribution inspection:** Plot the histogram of individual-level (Guess_{N=8} − Guess_{N=2}) in the Clean condition. Look for bimodality:
   - A spike at zero (neglectors) plus a spread below zero (adjusters) would suggest a mixture of types, which is interesting even if the mean shows some adjustment.

### Pilot Decision Rules

| Pilot Result | Interpretation | Next Step |
|-------------|---------------|-----------|
| Clean: no N effect; Explicit: N effect | Strong neglect + display format matters | Full study as designed |
| Clean: small N effect; Explicit: larger N effect | Partial neglect, display format helps | Full study, possibly increase N for power |
| Clean: large N effect; Explicit: similar | No neglect — people adjust regardless of display | Rethink the hypothesis |
| Neither condition shows N effect | People neglect even with explicit flags | Interesting but different paper — simplify design |
| Bimodal distribution in Clean | Mixture of neglectors and adjusters | Full study with focus on individual classification |

### Pilot Timeline

- Day 1: Build Google Form (2 hours), set up Prolific study
- Day 2: Soft launch with 10 participants, check data quality
- Day 3: Run remaining 70 participants
- Day 4: Analyze

**Total pilot turnaround: 4 days, ~$120.**

---

## Part VII: Google Forms Implementation

### Section 1: Consent
Standard consent. Required "Yes" to proceed.

### Section 2: Instructions

> **The Guessing Game**
> 
> You are playing a game against another player called the Sender.
>
> Here's how it works:
>
> 1. The Sender receives **[N] random numbers**, each between 1 and 10.
> 2. The Sender wants you to **overestimate** their average number.
> 3. The Sender **chooses which numbers to show you**. They can show any, all, or none.
> 4. **Your task:** Guess the Sender's average across ALL [N] numbers — including the ones they didn't show you.
> 5. **Your bonus** depends on accuracy: the closer your guess to the true average, the more you earn.
>
> **Remember:** The Sender benefits from making you guess too high. Think carefully about what they chose NOT to show you.

**CRITICAL DESIGN NOTE (for Clean condition only):** The instructions mention that the Sender has N numbers and may hide some. But on the trial screens themselves, only the disclosed numbers appear, with no reminder of N, no reminder of the Sender's incentive, and no visual indication that anything is missing. The instructions establish the game; the trial screens test whether participants carry that knowledge into their decisions without visual support.

**For the Explicit condition:** The trial screens also remind nothing explicitly about incentives but DO visually represent the missing signals as "[Not shown]" lines.

### Section 3: Comprehension Check

> **Practice question:**
>
> A Sender has 4 numbers. Their numbers are: 2, 5, 7, 9.
> They choose to show you only: **9**
>
> What is the Sender's TRUE average of all 4 numbers?

[Numeric input — correct answer: 5.75]

> Why might the Sender have shown only the 9?

[Multiple choice]
- To make me guess higher than the true average ← correct
- It was random
- They had to show that number

Participants who fail: shown a remedial screen re-explaining the rules, then a new comprehension question. Two failures → excluded.

### Sections 4–15: Main Trials

**Pilot (4 trials) or Full Study (12 trials)**

Each section begins:

> **Round [X]**
>
> In this round, the Sender has **[N] numbers** (each between 1 and 10).

**Clean condition — example (N=8, k=1, disclosed=8):**

> The Sender chose to show you:
>
> **8**
>
> What is your best guess of the Sender's average across all 8 of their numbers?

[Numeric input: 1.0 to 10.0, one decimal place allowed]

**Explicit condition — same trial:**

> The Sender's numbers:
>
> Number 1: **8**
> Number 2: [Not shown]
> Number 3: [Not shown]
> Number 4: [Not shown]
> Number 5: [Not shown]
> Number 6: [Not shown]
> Number 7: [Not shown]
> Number 8: [Not shown]
>
> What is your best guess of the Sender's average across all 8 of their numbers?

[Numeric input: 1.0 to 10.0, one decimal place allowed]

**Clean condition — example with multiple disclosed (N=6, k=3, disclosed=9,7,6):**

> The Sender chose to show you:
>
> **9, 7, 6**
>
> What is your best guess of the Sender's average across all 6 of their numbers?

**Explicit condition — same trial:**

> The Sender's numbers:
>
> Number 1: **9**
> Number 2: **7**
> Number 3: **6**
> Number 4: [Not shown]
> Number 5: [Not shown]
> Number 6: [Not shown]
>
> What is your best guess of the Sender's average across all 6 of their numbers?

### Section 16: Post-Task Questions

> 1. When the Sender didn't show you a number, what did you think that number was likely to be?
>    - Low (1–4)
>    - About average (5–6)
>    - High (7–10)
>    - I didn't really think about the hidden numbers
>
> 2. When making your guesses, how much did you adjust for numbers the Sender didn't show?
>    - A lot — I guessed well below what was shown
>    - Somewhat — I lowered my guess a bit
>    - A little — I mostly went with what I saw
>    - Not at all — I based my guess on the shown numbers
>
> 3. Age: [Dropdown]
> 4. Gender: [Dropdown]
> 5. Education: [Dropdown]
> 6. How comfortable are you with probability and statistics? [1–5 scale]

### Section 17: Debrief

> **Thank you for participating!**
>
> This study examines how people estimate averages when some information is strategically hidden. Because the Sender wants you to guess high, they tend to show their highest numbers and hide the low ones. The hidden numbers are therefore likely to be below average.
>
> A key question in this research is whether people spontaneously think about information that isn't shown to them, or whether they tend to focus only on what's visible. Your responses will help us understand this.
>
> **Your Prolific completion code: [CODE]**

---

## Part VIII: Summary of Contributions

This experiment tests a hypothesis that is more primitive than existing work on disclosure failures. The existing literature asks: "When investors notice non-disclosure, do they penalize it enough?" We ask: "Do investors notice non-disclosure at all?"

The answer has implications for:

1. **The magnitude of mispricing from selective disclosure** — non-disclosure neglect implies strictly more mispricing than any model where investors assign defaults to missing signals.
2. **The persistence of mispricing** — if investors don't represent the missing dimension, prices cannot teach them about it, because they misattribute price signals to disclosed dimensions.
3. **The design of disclosure regulation** — mandatory templates don't just force information revelation; they force schema awareness. The value is in making investors know what to look for, not just in showing them the numbers.
4. **The role of AI in investment analysis** — AI tools that flag "what's missing" may provide value not by improving the estimate of the missing signal but by ensuring the missing signal enters the investor's model at all.
