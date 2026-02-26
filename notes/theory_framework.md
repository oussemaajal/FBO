# Dynamic Disclosure Equilibrium with Non-Disclosure Neglect: Theoretical Framework

## Document Purpose

This document provides the complete theoretical setup, modeling choices, literature foundations, and desired results for a formal microeconomic model of dynamic voluntary disclosure in a market with two investor types: sophisticated investors who observe and condition on non-disclosure, and neglect-type investors who represent only disclosed dimensions. The document is intended as a specification for building the formal mathematical model.

---

## 1. The Economic Question

Consider a multi-period market where firms have multi-dimensional private information and choose which dimensions to disclose each period. There is uncertainty about the manager's reporting objective (à la Einhorn, 2007), so even sophisticated investors cannot apply fully skeptical beliefs — they must learn statistically whether silence on a given dimension is strategic or innocent.

Two types of investors populate the market:

- **Sophisticated investors** observe the full disclosure set — both what is disclosed AND what is not disclosed. They form beliefs over all dimensions, including undisclosed ones. They update beliefs about the manager's reporting objective using Bayes' rule applied to the joint history of disclosures, non-disclosures, and realized outcomes.

- **Neglect-type investors** observe only disclosed dimensions. Undisclosed dimensions do not enter their belief system at all. They do not assign a default to the missing dimension — they literally have a lower-dimensional model of the firm. They update beliefs about disclosed dimensions using Bayes' rule, but their state space does not include the undisclosed dimensions.

The question: **What is the dynamic disclosure equilibrium, and how does market efficiency depend on the fraction of neglect-type investors?**

The conjecture: with a sufficient mass of neglect-type investors, the market cannot converge to efficiency on undisclosed dimensions even in the long run, because the price signal that would teach investors about non-disclosure is contaminated — neglect-type investors misattribute price movements to the disclosed dimensions, and their demand prevents prices from fully reflecting the information that sophisticated investors have about the undisclosed dimensions.

---

## 2. Workhorse Models and Frameworks to Build On

### 2.1 The Einhorn (2007) Foundation: Uncertainty About Reporting Objectives

**What it provides:** A reason for non-disclosure to persist in equilibrium even with rational investors. In Einhorn's model, the receiver is uncertain whether the sender wants to maximize or minimize the receiver's belief. This ambiguity means silence is not fully informative — it could reflect a sender hiding bad news (maximizer) or hiding good news (minimizer). The receiver's posterior about the undisclosed value depends on their prior over the sender's type.

**How we use it:** This is the information environment. Uncertainty about the manager's objective is why sophisticated investors cannot simply apply the unraveling logic. They must learn statistically about the manager's type from the history of disclosures and outcomes. This creates a non-trivial learning problem even for sophisticated investors, which means the disclosure equilibrium is dynamic and history-dependent.

**Key reference:** Einhorn, E. (2007). Voluntary disclosure under uncertainty about the reporting objective. *Journal of Accounting and Economics*, 43(2–3), 245–274.

**What to borrow:** The structure of the sender's type space (maximizer vs. minimizer, or a continuous distribution over reporting objectives) and the way receiver beliefs over the sender's type interact with beliefs over the firm's value.

### 2.2 Dye (1985) / Jung and Kwon (1988): Threshold Disclosure Equilibria

**What it provides:** The canonical structure of disclosure equilibria with information endowment uncertainty. In Dye's model, the market is uncertain whether the manager is informed. Informed managers disclose above a threshold, withhold below it. The market prices non-disclosure as a mixture of uninformed and bad-news-informed types.

**How we use it:** The threshold structure carries over. In our setting, the threshold is per-dimension (which signals to disclose), and the manager's multi-dimensional disclosure choice is a vector of thresholds. The Einhorn twist replaces "uncertainty about endowment" with "uncertainty about objectives," but the equilibrium structure is analogous: disclosure above a threshold, non-disclosure below, with the threshold depending on the market's beliefs about the manager's type.

**Key references:**
- Dye, R. A. (1985). Disclosure of nonproprietary information. *Journal of Accounting Research*, 23(1), 123–145.
- Jung, W. O., & Kwon, Y. K. (1988). Disclosure when the market is unsure of information endowment of managers. *Journal of Accounting Research*, 26(1), 146–153.

**What to borrow:** The threshold equilibrium structure and the characterization of market beliefs about non-disclosing firms.

### 2.3 Shin (2003): Multi-Dimensional Selective Disclosure

**What it provides:** A model where the manager observes a multi-dimensional signal and strategically chooses which dimensions to disclose. Even with verifiable (truthful) disclosure, selectivity allows the manager to create a favorably biased picture by choosing which dimensions to reveal. The key result is that voluntary disclosure is systematically biased upward because the disclosed set is a selected sample of the full information set.

**How we use it:** This is the multi-dimensional disclosure structure we need. The firm has N value-relevant signals and chooses a subset to disclose. The sophisticated investor sees the subset and infers something about the undisclosed signals (via selection logic). The neglect-type investor sees only the subset and treats it as the whole.

**Key reference:** Shin, H. S. (2003). Disclosures and asset returns. *Econometrica*, 71(1), 105–133.

**What to borrow:** The multi-dimensional information structure, the strategic selection of which dimensions to disclose, and the characterization of the bias in disclosed information.

### 2.4 De Long, Shleifer, Summers, and Vishny (1990): Noise Traders and Limits to Arbitrage

**What it provides:** The canonical model of how irrational traders affect asset prices. In DSSV, noise traders hold incorrect beliefs and trade on them. Sophisticated arbitrageurs cannot fully eliminate mispricing because noise trader risk creates fundamental risk — the mispricing can get worse before it gets better, and risk-averse arbitrageurs with finite horizons limit their positions.

**How we use it:** The neglect-type investors play the role of noise traders, but with a crucial difference — their "noise" is not random. It is systematically biased by selective disclosure. They overvalue firms that selectively disclose good dimensions because they don't represent the bad undisclosed dimensions. The DSSV logic explains why sophisticated investors cannot fully correct this mispricing through arbitrage. But our setting adds a deeper problem: the mispricing is not just hard to arbitrage — it is hard for the market to *teach* neglect-type investors about, because the price signal is misattributed.

**Key reference:** De Long, J. B., Shleifer, A., Summers, L. H., & Vishny, R. W. (1990). Noise trader risk in financial markets. *Journal of Political Economy*, 98(4), 703–738.

**What to borrow:** The market structure with heterogeneous investors, the demand-weighted price formation, and the limits-to-arbitrage logic.

### 2.5 Grossman and Stiglitz (1980): Information Aggregation and Prices

**What it provides:** The foundational model of how prices aggregate information from informed and uninformed traders. The key tension: if prices fully reveal information, there is no incentive to acquire information (the Grossman-Stiglitz paradox). In equilibrium, prices are partially informative — they reveal some but not all of the informed traders' information.

**How we use it:** Our setting has a Grossman-Stiglitz structure on the non-disclosure dimension. Sophisticated investors have information (beliefs about the undisclosed signals) that neglect-type investors do not. Prices partially aggregate this information. The question is: how much of the sophisticated investors' information about undisclosed dimensions is reflected in prices, and can neglect-type investors learn from prices about dimensions they don't represent?

**Key reference:** Grossman, S. J., & Stiglitz, J. E. (1980). On the impossibility of informationally efficient markets. *American Economic Review*, 70(3), 393–408.

**What to borrow:** The price formation mechanism where the asset price is a noisy signal of informed traders' information.

### 2.6 Eyster and Rabin (2005): Cursed Equilibrium

**What it provides:** A model of bounded rationality where agents fail to fully account for the informational content of others' actions. In a cursed equilibrium, each agent best-responds to a belief that other agents' actions are less correlated with their private information than they actually are. Applied to markets, this means agents under-infer from prices.

**How we use it:** The neglect-type investor is a specific, extreme form of cursedness — they don't just under-infer from the non-disclosure action; they don't process the non-disclosure action at all on the undisclosed dimension. Cursed equilibrium provides a framework for smoothly parameterizing the degree of neglect (from fully cursed = complete neglect to fully rational = standard Bayesian).

**Key reference:** Eyster, E., & Rabin, M. (2005). Cursed equilibrium. *Econometrica*, 73(5), 1623–1672.

**What to borrow:** The parameterization of bounded rationality (the cursedness parameter χ ∈ [0,1]) as a template for parameterizing the degree of neglect.

### 2.7 Eyster, Rabin, and Vayanos (2019): Financial Markets with Cursed Agents

**What it provides:** The direct application of cursed equilibrium to financial markets. They show that when traders are cursed (fail to fully account for the information content of prices), asset prices exhibit excess volatility, excess volume, and predictable returns. The key mechanism: cursed traders do not extract enough information from prices, so their beliefs and trades are more dispersed than rational expectations would imply.

**How we use it:** This is the closest existing model to what we want, but applied to price inference rather than disclosure inference. Our model applies the same logic to disclosure: neglect-type investors fail to extract information from the disclosure *decision* (not just the price), and this failure feeds back through prices.

**Key reference:** Eyster, E., Rabin, M., & Vayanos, D. (2019). Financial markets where traders neglect the informational content of prices. *Journal of Finance*, 74(1), 371–399.

**What to borrow:** The market equilibrium structure with heterogeneous rationality, the price formation with cursed agents, and the welfare analysis.

### 2.8 Banerjee, Kaniel, and Kremer (2009): Disagreement and Prices

**What it provides:** A model of how heterogeneous beliefs (disagreement) affect asset prices in dynamic markets. When investors disagree about asset values, prices reflect a weighted average of beliefs, and the weights depend on wealth dynamics and risk tolerance. Over time, investors who are systematically wrong lose wealth and their influence on prices declines (the "market selection" mechanism).

**How we use it:** The wealth dynamics matter for our question. If neglect-type investors systematically overpay for selectively disclosing firms (because they don't account for hidden bad signals), they should lose money on average. Over time, this should reduce their wealth share and hence their price impact. The question is: how fast does this happen? If selection is slow (because the overvaluation is small per trade but persistent), neglect-type investors can affect prices for a long time.

**Key reference:** Banerjee, S., Kaniel, R., & Kremer, I. (2009). Price drift as an outcome of differences in higher-order beliefs. *Review of Financial Studies*, 22(9), 3707–3734.

**What to borrow:** The dynamic wealth-weighted price formation and the market selection argument.

### 2.9 Goldstein and Yang (2017): Disclosure and Market Feedback

**What it provides:** A framework for analyzing the two-way interaction between disclosure and market prices. Disclosure affects prices (by revealing information), but prices also affect real decisions and disclosure incentives (by providing feedback about the firm's investment opportunities).

**How we use it:** The feedback loop is important. If neglect-type investors push prices up for selectively disclosing firms, this may encourage more selective disclosure (because managers see that selective disclosure "works"). This creates a positive feedback loop: more neglect → more selective disclosure → more mispricing → more neglect (because the undisclosed dimensions are never revealed through prices). The question is whether this feedback loop converges or explodes.

**Key reference:** Goldstein, I., & Yang, L. (2017). Information disclosure in financial markets. *Annual Review of Financial Economics*, 9, 101–125.

**What to borrow:** The feedback structure between disclosure decisions and market prices.

### 2.10 Hirshleifer, Lim, and Teoh (2004): Limited Attention and Disclosure Effects

**What it provides:** Empirical evidence that investor attention is limited and affects how disclosure is processed. Earnings announcements on high-news days (when attention is divided) produce smaller immediate price reactions and larger delayed reactions (drift). This suggests that attention is a binding constraint on information processing.

**How we use it:** As empirical motivation. If investors have limited attention even for *disclosed* information, the claim that they entirely neglect *undisclosed* dimensions is not radical — it's a natural extension.

**Key reference:** Hirshleifer, D., Lim, S. S., & Teoh, S. H. (2009). Driven to distraction: Extraneous events and underreaction to earnings news. *Journal of Finance*, 64(5), 2289–2325.

---

## 3. Proposed Model Structure

### 3.1 Environment

**Time:** Discrete, t = 0, 1, 2, ..., T (or infinite horizon with discounting).

**Firm:** A single firm (or a continuum of firms, depending on tractability) with value determined by N ≥ 2 signals:

$$V = \frac{1}{N} \sum_{j=1}^{N} \theta_j$$

where each θ_j is the realization of signal j, drawn i.i.d. from a known distribution F on [0, 1] (or {1, ..., 10} for consistency with the experiment). Signals are drawn fresh each period (the firm's fundamentals change over time) or are persistent (drawn once, gradually revealed). The persistent case is more interesting for dynamics.

**Manager:** Each period, the manager observes all N signals and chooses a disclosure set S_t ⊆ {1, ..., N}. For each j ∈ S_t, the manager truthfully reveals θ_j (verifiable disclosure). For j ∉ S_t, nothing is revealed — importantly, which j's are missing is observable only to sophisticated investors.

**Manager's objective:** Uncertain, following Einhorn (2007). With probability π, the manager is a "maximizer" who wants to maximize the market price. With probability 1 − π, the manager is a "minimizer" (or "neutral" — this can be calibrated). The market does not know the manager's type and must infer it from disclosure behavior. The manager's type may be persistent (same type every period) or stochastic (drawn each period).

### 3.2 Investors

**Sophisticated investors (fraction λ of total market):**

- Observe the full disclosure set: both the disclosed values {θ_j : j ∈ S_t} and the identities of undisclosed signals {j : j ∉ S_t}.
- Maintain beliefs over all N dimensions: for undisclosed θ_j, they hold a posterior distribution conditional on the disclosure decision and the history of past disclosures and outcomes.
- Maintain beliefs over the manager's type (maximizer vs. minimizer), updated each period via Bayes' rule.
- Their demand for the asset depends on their posterior expectation of V.

**Neglect-type investors (fraction 1 − λ):**

- Observe only the disclosed values {θ_j : j ∈ S_t}.
- **Do not represent undisclosed dimensions.** Their model of the firm's value is:

$$\hat{V}_t^{neglect} = \frac{1}{|S_t|} \sum_{j \in S_t} \theta_j$$

That is, they average over disclosed signals only, with |S_t| in the denominator rather than N. They effectively believe the firm has |S_t| dimensions, not N.

- They update their beliefs about disclosed dimensions using standard Bayesian updating (e.g., they learn about the distribution of θ_j for disclosed signals). But they have no beliefs to update about undisclosed dimensions because those dimensions do not exist in their model.
- **Crucially:** neglect-type investors observe prices and may try to learn from them. But they attribute price variation to the disclosed dimensions (because those are the only dimensions in their model). They cannot learn about the undisclosed dimensions from prices because they do not have a state variable for those dimensions.

### 3.3 Price Formation

Each period, the market price is determined by a demand-weighted average of investor valuations (as in Grossman-Stiglitz or DSSV):

$$P_t = \lambda \cdot E^S[V | \mathcal{F}_t^S] + (1 - \lambda) \cdot E^N[V | \mathcal{F}_t^N] + \eta_t$$

where:
- E^S[V | F_t^S] is the sophisticated investors' conditional expectation of V given their full information set (disclosed values, non-disclosure events, past history, past realized values)
- E^N[V | F_t^N] is the neglect-type investors' conditional expectation given their reduced information set (disclosed values only, past disclosed history)
- η_t is noise (from liquidity traders or supply shocks, needed to prevent full revelation in a Grossman-Stiglitz sense)

Alternatively, use a market-maker setup (Kyle, 1985 style) where the market maker sets prices to break even, and informed/neglect-type investors submit orders.

### 3.4 Learning and Dynamics

**Sophisticated investors learn:**
- About the manager's type (maximizer vs. minimizer) from the history of disclosure decisions and realized outcomes.
- About the undisclosed signal values from the selection logic (conditional on the manager's inferred type and the disclosed values).
- Their beliefs become more precise over time, and if the manager's type is persistent, they eventually learn it perfectly (in the limit of many periods).

**Neglect-type investors learn:**
- About the distribution of disclosed signal values (from the history of disclosed values and realized outcomes).
- **They do NOT learn about undisclosed dimensions**, because those dimensions are not in their model. Even when the true value V is eventually realized (e.g., at the end of the period or at liquidation), the neglect-type investor attributes the discrepancy between their estimate and the realized V to error in the disclosed dimensions, not to the existence of undisclosed dimensions.
- **This is the key friction:** the learning channel that would correct neglect in a standard model (observing that your estimates are systematically too high) does not work because the neglect-type investor misattributes the error.

**Manager's dynamic problem:**
- The manager chooses S_t each period to maximize (or minimize, depending on type) a function of the current price and/or the entire price path.
- The manager knows the investor composition (λ) and understands how each type processes disclosure.
- A maximizer manager has an incentive to exploit neglect-type investors by disclosing only favorable dimensions. But doing so may reveal their type to sophisticated investors, who will then discount the firm more aggressively. This creates a dynamic tension: short-run gains from selective disclosure vs. long-run reputation costs.

### 3.5 Equilibrium Concept

**Perfect Bayesian Equilibrium (PBE)** in which:
1. The manager's disclosure strategy S_t maximizes their objective given beliefs about investor responses.
2. Sophisticated investors' beliefs about (θ_{j ∉ S_t}, manager type) are consistent with Bayes' rule and the manager's equilibrium strategy.
3. Neglect-type investors' beliefs about disclosed dimensions are consistent with their (reduced) model and Bayes' rule applied to disclosed information only.
4. The price P_t clears the market given both investor types' demands.

The non-standard element is condition (3): neglect-type investors are Bayesian *within their model*, but their model is misspecified (it has the wrong dimensionality). This is a form of "model misspecification" in the sense of Esponda and Pouzo (2016) — agents who do Bayesian updating within a model that does not contain the true data-generating process.

**Key reference for misspecified learning:**
- Esponda, I., & Pouzo, D. (2016). Berk-Nash equilibrium: A framework for modeling agents with misspecified models. *Econometrica*, 84(3), 1093–1130.

The Berk-Nash equilibrium concept is directly applicable: neglect-type investors hold the belief within their (misspecified) model that minimizes KL-divergence to the true data distribution. Because their model omits the undisclosed dimensions, their "best-fit" beliefs about the disclosed dimensions will be systematically biased.

---

## 4. Desired Results and Conjectures

### Result 1: Selective Disclosure is Increasing in (1 − λ)

As the fraction of neglect-type investors increases, the manager discloses fewer dimensions in equilibrium. Intuition: with more neglect-type investors, the price penalty for non-disclosure is smaller (because a larger fraction of the market doesn't penalize non-disclosure at all), so the manager's threshold for disclosure drops.

### Result 2: Mispricing is Persistent and Non-Vanishing

Unlike a market with only "standard naive" investors (who assign generous defaults but are on the right state space), the market with neglect-type investors does not converge to efficiency even in the long run. Sophisticated investors' information about undisclosed dimensions is only partially reflected in prices (because neglect-type investors' demand dilutes the signal), and neglect-type investors cannot learn from prices about dimensions they don't represent.

Formally: as T → ∞, the expected pricing error E[P_t − V] does not converge to zero when 1 − λ > 0, even though sophisticated investors' beliefs converge to the truth.

### Result 3: Market Selection is Slow or Fails

In a model with wealth dynamics (as in DSSV or Banerjee et al.), neglect-type investors lose money on average (they overpay for selectively disclosing firms). But the rate of wealth transfer is slow relative to the entry rate of new neglect-type investors (e.g., retail investors entering the market). If the entry rate exceeds the selection rate, the neglect-type share 1 − λ is stable in the long run, and mispricing persists indefinitely.

Alternatively, if firms adjust their disclosure in response to the investor mix (Result 1), the per-trade loss of neglect-type investors may be small (because the overvaluation per disclosed dimension is bounded), making selection very slow.

### Result 4: Mandatory Disclosure of k Dimensions Changes the Equilibrium Discontinuously

If a regulator mandates disclosure of k out of N dimensions, the effect on neglect-type investors is twofold:
1. **Direct information effect:** k dimensions are always revealed, reducing uncertainty.
2. **Schema expansion effect:** Neglect-type investors now see k disclosed signals and (in the Explicit format) N − k "[Not disclosed]" flags, which may activate representation of the missing dimensions. If the mandatory template makes the full dimensionality salient, neglect-type investors shift from a |S_t|-dimensional model to an N-dimensional model, and the standard learning mechanisms can operate.

This implies that the value of mandatory disclosure is **discontinuous in format**: a mandate that simply requires disclosure of k signals but does not present a template showing all N slots (Clean format) does less than a mandate with a standardized template (Explicit format).

### Result 5: Feedback Loop Between Neglect and Disclosure

There is a strategic complementarity: more neglect by investors → more selective disclosure by managers → less information about undisclosed dimensions in prices → harder for any learning to occur → more neglect. This can generate multiple equilibria:
- A "high disclosure" equilibrium where most investors track all dimensions and managers disclose extensively.
- A "low disclosure" equilibrium where neglect-type investors dominate, managers disclose minimally, and the market is persistently mispriced.

The regulator's role is to break this feedback loop by mandating enough disclosure to shift investors to the high-disclosure equilibrium basin.

### Result 6: Comparison with Standard Naive Investors

Define a "standard naive" investor who observes non-disclosure and assigns the unconditional mean to the undisclosed signal (but at least represents the dimension). Compare the equilibrium with fraction (1 − λ) neglect-type investors vs. (1 − λ) standard-naive investors:
- Mispricing is strictly higher with neglect-type investors for any λ < 1.
- The rate of convergence to efficiency (if any) is strictly slower.
- The manager discloses weakly less with neglect-type investors.

This provides the formal justification for why non-disclosure neglect is a distinct and more severe friction than standard naivete.

---

## 5. Modeling Choices and Simplifications

### 5.1 Start Simple: Two Dimensions

For tractability, start with N = 2 (the firm has two signals, θ₁ and θ₂). The manager discloses one, both, or neither. This is enough to capture selective disclosure and the core neglect mechanism while keeping the state space manageable.

### 5.2 Binary Manager Type

Manager is either a maximizer (probability π) or a truth-teller who always discloses everything (probability 1 − π). This is simpler than Einhorn's full specification and is sufficient to generate the tension: silence could mean "hiding bad news" (maximizer) or "nothing to hide" (truth-teller, but this type always discloses, so silence must come from the maximizer). Wait — this collapses to Dye-style reasoning. To preserve the Einhorn flavor, use: maximizer (wants high price) with probability π, minimizer (wants low price) with probability 1 − π. Then silence is ambiguous for both types, and the market must learn which type the manager is.

### 5.3 Normal Distributions for Tractability

If analytical solutions are desired, use θ_j ~ N(μ, σ²) i.i.d. This allows conjugate updating for both investor types and closed-form demand functions (CARA-normal framework).

### 5.4 Two-Period Model First, Then Extend

Start with T = 2 to characterize the core mechanism:
- Period 1: Manager discloses, investors price, period ends.
- Period 2: True value realized. Investors see V. Sophisticated investors update beliefs about manager type. Neglect-type investors observe the error but misattribute it.
- Then analyze how Period 1 disclosure affects Period 2 beliefs and prices.

Once the two-period model is solved, extend to T periods or infinite horizon.

---

## 6. Key Mathematical Objects to Define

1. **Manager's strategy:** σ_M: Θ × {max, min} → 2^{1,...,N} mapping the signal vector and manager type to a disclosure set.

2. **Sophisticated investor beliefs:** μ_t^S = posterior distribution over (θ_{j ∉ S_t}, type_M) given the history of disclosures, non-disclosures, and realized values.

3. **Neglect-type investor beliefs:** μ_t^N = posterior distribution over the disclosed dimension values, conditional on disclosed history only. This is a marginal distribution that does not include the undisclosed dimensions. The neglect-type investor's valuation is the expectation of V under a *projected* model: V^N = (1/|S_t|) Σ_{j ∈ S_t} θ_j rather than V = (1/N) Σ_j θ_j.

4. **Price function:** P_t = f(E^S[V], E^N[V^N], λ, noise) where the functional form depends on the market microstructure assumption.

5. **Manager's payoff:** U_M = g(P_t, type_M) where g is increasing in P for maximizers and decreasing for minimizers.

6. **Information sets:**
   - F_t^S = {S_1, ..., S_t, {θ_j : j ∈ S_τ} for τ ≤ t, V_{τ} for τ < t, P_1, ..., P_t}
   - F_t^N = {{θ_j : j ∈ S_τ} for τ ≤ t, P_1, ..., P_t} — notably missing the identity of undisclosed signals

7. **Misattribution function:** When the neglect-type investor observes a price P_t that differs from their valuation E^N[V^N], they attribute the difference to noise or to disagreement about the disclosed dimensions. Formally, they infer a signal about the disclosed θ_j values from P_t, not about the undisclosed θ_j values.

---

## 7. Connection to Experimental Design

The model's predictions map directly to the experimental treatments:

| Model Object | Experimental Manipulation |
|-------------|--------------------------|
| N (total signals) | N = 2, 4, 6, 8 |
| S_t (disclosure set) | k = 1, 25%, 50% of signals disclosed |
| λ (sophisticated fraction) | Not manipulated in experiment; inferred from behavior distribution |
| Explicit vs. Clean display | Whether neglect-type investors "see" undisclosed dimensions → whether 1−λ is large or small |
| Manager type uncertainty | Stated in instructions: Sender wants you to overestimate (but could also want to underestimate, if we add that treatment) |

The model should generate quantitative predictions for the experimental data:
- The neglect-type investor's estimate equals the average of disclosed values (denominator = k).
- The sophisticated investor's estimate accounts for strategic selection and discounts non-disclosure.
- The "market price" (if we ran a market experiment) would be a weighted average.

For now, the experiment identifies the behavioral prevalence of neglect-type behavior (what fraction of participants behave as neglect-type vs. sophisticated), which calibrates the key parameter 1 − λ for the model.

---

## 8. Literature Summary Table

| Paper | What We Take From It |
|-------|---------------------|
| Einhorn (2007) | Uncertainty about manager objectives → non-disclosure is ambiguous → statistical learning required |
| Dye (1985), Jung & Kwon (1988) | Threshold disclosure equilibria; structure of market beliefs about non-disclosers |
| Shin (2003) | Multi-dimensional selective disclosure; bias from strategic selection of which dimensions to reveal |
| DSSV (1990) | Heterogeneous investors; noise trader risk; limits to arbitrage; persistent mispricing |
| Grossman & Stiglitz (1980) | Price formation with informed and uninformed traders; partial information aggregation |
| Eyster & Rabin (2005) | Cursed equilibrium; parameterization of the failure to extract information from strategic actions |
| Eyster, Rabin & Vayanos (2019) | Cursed agents in financial markets; price dynamics with agents who neglect informational content |
| Esponda & Pouzo (2016) | Berk-Nash equilibrium; Bayesian agents with misspecified models; convergence to "best fit" within wrong model |
| Banerjee, Kaniel & Kremer (2009) | Heterogeneous beliefs; dynamic wealth effects; market selection |
| Goldstein & Yang (2017) | Feedback between disclosure and market prices; real effects of disclosure |
| Kyle (1985) | Market microstructure; informed trading; price impact |

---

## 9. Suggested Solution Approach

1. **Start with N = 2, T = 2, binary manager type.** Solve for the disclosure threshold as a function of λ and π. Characterize the pricing error and show it is increasing in (1 − λ).

2. **Compare with a "standard naive" benchmark** where the (1 − λ) fraction uses the unconditional mean as a default for the undisclosed signal (but with N in the denominator, not |S|). Show that mispricing is strictly higher under neglect.

3. **Extend to T periods.** Show that sophisticated investor beliefs converge (they learn the manager's type) but the pricing error does not converge to zero because neglect-type investors' beliefs cannot converge on a dimension they don't model.

4. **Introduce wealth dynamics.** Show that market selection against neglect-type investors is slow (because the per-period mispricing per investor is bounded and the entry of new neglect types can offset selection).

5. **Solve for the optimal mandatory disclosure policy** as a function of λ. Show that the optimal number of mandated dimensions increases with (1 − λ) and that the template format (Explicit) strictly dominates a disclosure mandate without a template (Clean).

6. **Extend to N > 2** to show that the problem scales with dimensionality: more dimensions → more room for selective disclosure → more severe neglect → more mispricing.
