"""
Create Google Forms survey from scenario definitions.

Reads scenarios.json and programmatically builds a Google Form with:
- Consent screen
- Demographics section
- Scenario presentation (condition-specific vignette)
- Response questions (Likert scales, free text)

Usage:
    python BUILD_SURVEY.py                # Create full survey
    python BUILD_SURVEY.py --pilot        # Create pilot survey
    python BUILD_SURVEY.py --dry-run      # Preview form structure

Output:
    Prints the Google Forms URL for the created form.
    Stores form ID in data/raw/scenarios/ for later retrieval.
"""

import sys
import argparse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import PATHS, DATA_FILES, EXPERIMENT_PARAMS, ensure_dirs_exist
from utils import GoogleFormsClient, is_dry_run, set_dry_run


def main(pilot: bool = False, dry_run: bool = False):
    """Create the survey form."""
    ensure_dirs_exist()
    if dry_run:
        set_dry_run(True)

    mode = "PILOT" if pilot else "FULL"
    print(f"Building survey ({mode} mode)")

    # TODO: Load scenario definitions from scenarios.json
    # TODO: Create Google Form
    # TODO: Add consent, demographics, scenario, response questions
    # TODO: Save form ID for later retrieval

    print("  [NOT YET IMPLEMENTED]")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--pilot', action='store_true',
                        help='Create pilot survey')
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview form structure without creating')
    args = parser.parse_args()
    main(pilot=args.pilot, dry_run=args.dry_run)
