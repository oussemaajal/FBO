"""
Clean and standardize human survey responses.

Reads raw Google Forms exports + Prolific demographics from data/raw/.
Parses response fields, merges with demographics, handles missing data.

Usage:
    python CLEAN_HUMAN_RESPONSES.py                # Clean full dataset
    python CLEAN_HUMAN_RESPONSES.py --pilot        # Clean pilot only
    python CLEAN_HUMAN_RESPONSES.py --dry-run      # Preview without writing

Output:
    data/intermediate/human_parsed.parquet
"""

import sys
import argparse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import PATHS, DATA_FILES, ensure_dirs_exist


def main(pilot: bool = False, dry_run: bool = False):
    """Clean human survey responses."""
    ensure_dirs_exist()
    mode = "PILOT" if pilot else "FULL"
    print(f"Cleaning human responses ({mode} mode)")

    # TODO: Load raw Forms responses from data/raw/forms/
    # TODO: Load Prolific demographics from data/raw/prolific/
    # TODO: Parse and standardize response fields
    # TODO: Merge responses with demographics
    # TODO: Save to DATA_FILES['human_parsed']

    print("  [NOT YET IMPLEMENTED]")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--pilot', action='store_true',
                        help='Clean pilot data only')
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview without writing files')
    args = parser.parse_args()
    main(pilot=args.pilot, dry_run=args.dry_run)
