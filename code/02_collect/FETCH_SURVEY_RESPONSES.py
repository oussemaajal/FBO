"""
Fetch Google Forms responses and Prolific demographics.

Pulls raw data from Google Forms API and Prolific API,
saves to data/raw/forms/ and data/raw/prolific/.

Usage:
    python FETCH_SURVEY_RESPONSES.py FORM_ID              # Fetch responses
    python FETCH_SURVEY_RESPONSES.py FORM_ID --study-id X  # Also fetch Prolific data
    python FETCH_SURVEY_RESPONSES.py FORM_ID --dry-run     # Preview only

Output:
    data/raw/forms/responses_YYYYMMDD.json
    data/raw/prolific/demographics_YYYYMMDD.json
"""

import json
import sys
import argparse
from pathlib import Path
from datetime import datetime

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import PATHS, ensure_dirs_exist
from utils import GoogleFormsClient, ProlificClient, set_dry_run


def main(form_id: str, study_id: str = None, dry_run: bool = False):
    """Fetch survey responses and demographics."""
    ensure_dirs_exist()
    if dry_run:
        set_dry_run(True)

    today = datetime.now().strftime('%Y%m%d')

    # Fetch Google Forms responses
    print(f"Fetching responses from Google Form: {form_id}")
    forms = GoogleFormsClient()
    responses = forms.get_responses(form_id)
    print(f"  Retrieved {len(responses)} responses")

    out_path = PATHS['raw_forms'] / f'responses_{today}.json'
    if not dry_run:
        out_path.write_text(json.dumps(responses, indent=2, default=str),
                            encoding='utf-8')
        print(f"  Saved to {out_path}")

    # Fetch Prolific demographics if study_id provided
    if study_id:
        print(f"\nFetching Prolific demographics for study: {study_id}")
        prolific = ProlificClient()
        demographics = prolific.get_demographics(study_id)
        print(f"  Retrieved data for {len(demographics)} participants")

        demo_path = PATHS['raw_prolific'] / f'demographics_{today}.json'
        if not dry_run:
            demo_path.write_text(json.dumps(demographics, indent=2, default=str),
                                 encoding='utf-8')
            print(f"  Saved to {demo_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('form_id', help='Google Form ID')
    parser.add_argument('--study-id', help='Prolific study ID (optional)')
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview without writing files')
    args = parser.parse_args()
    main(form_id=args.form_id, study_id=args.study_id, dry_run=args.dry_run)
