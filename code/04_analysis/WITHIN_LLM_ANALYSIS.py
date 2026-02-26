"""
Cross-model LLM comparisons.

Analyzes whether different LLMs respond differently to omission:
    - Model-level means by condition
    - Pairwise comparisons across models
    - Variance decomposition (within-model vs between-model)
    - Model "sensitivity to omission" ranking

Usage:
    python WITHIN_LLM_ANALYSIS.py                # Full sample
    python WITHIN_LLM_ANALYSIS.py --pilot        # Pilot sample
    python WITHIN_LLM_ANALYSIS.py --dry-run      # Preview without writing

Output:
    output/tables/llm_by_model.tex
    output/tables/llm_pairwise.tex
    output/figures/model_sensitivity.pdf
"""

import sys
import argparse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import PATHS, DATA_FILES, ensure_dirs_exist


def main(pilot: bool = False, dry_run: bool = False):
    """Run cross-model LLM analysis."""
    ensure_dirs_exist()
    mode = "PILOT" if pilot else "FULL"
    print(f"Running within-LLM analysis ({mode} mode)")

    # TODO: Load all_responses.parquet, filter to LLM respondents
    # TODO: Model-level means by condition
    # TODO: Pairwise t-tests across models
    # TODO: Variance decomposition
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
