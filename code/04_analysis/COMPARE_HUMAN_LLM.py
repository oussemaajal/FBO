"""
Compare human vs LLM responses to information omission scenarios.

Statistical tests:
    - Mean difference in responses by condition (t-tests, Mann-Whitney)
    - Regression: response ~ condition * respondent_type + controls
    - Effect size estimates (Cohen's d)
    - Interaction effects: does omission affect humans differently than LLMs?

Usage:
    python COMPARE_HUMAN_LLM.py                # Full sample
    python COMPARE_HUMAN_LLM.py --pilot        # Pilot sample
    python COMPARE_HUMAN_LLM.py --dry-run      # Preview without writing

Output:
    output/tables/human_vs_llm_main.tex
    output/tables/human_vs_llm_regression.tex
    output/figures/effect_sizes.pdf
"""

import sys
import argparse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import PATHS, DATA_FILES, ensure_dirs_exist


def main(pilot: bool = False, dry_run: bool = False):
    """Compare human vs LLM responses."""
    ensure_dirs_exist()
    mode = "PILOT" if pilot else "FULL"
    print(f"Running human vs LLM comparison ({mode} mode)")

    # TODO: Load all_responses.parquet (or pilot_responses.parquet)
    # TODO: Split by respondent_type
    # TODO: Compare by condition (full_disclosure vs selective_omission)
    # TODO: Regression with interaction terms
    # TODO: Effect sizes
    # TODO: Export tables and figures

    print("  [NOT YET IMPLEMENTED]")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--pilot', action='store_true',
                        help='Use pilot sample')
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview without writing files')
    args = parser.parse_args()
    main(pilot=args.pilot, dry_run=args.dry_run)
