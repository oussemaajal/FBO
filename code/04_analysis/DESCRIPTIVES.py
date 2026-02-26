"""
Descriptive statistics for FBO experiment.

Generates summary tables: response distributions by condition,
by respondent type (human vs LLM), by model. Exports LaTeX tables
and summary CSVs.

Usage:
    python DESCRIPTIVES.py                 # Full sample
    python DESCRIPTIVES.py --pilot         # Pilot sample
    python DESCRIPTIVES.py --dry-run       # Preview without writing

Output:
    output/tables/desc_by_condition.tex
    output/tables/desc_by_respondent.tex
    output/tables/desc_by_model.tex
"""

import sys
import argparse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import PATHS, DATA_FILES, ensure_dirs_exist


def main(pilot: bool = False, dry_run: bool = False):
    """Generate descriptive statistics."""
    ensure_dirs_exist()
    mode = "PILOT" if pilot else "FULL"
    print(f"Computing descriptive statistics ({mode} mode)")

    # TODO: Load all_responses.parquet (or pilot_responses.parquet)
    # TODO: Summary stats by condition
    # TODO: Summary stats by respondent_type
    # TODO: Summary stats by model (for LLM respondents)
    # TODO: Export to output/tables/ (or output/pilot/tables/)

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
