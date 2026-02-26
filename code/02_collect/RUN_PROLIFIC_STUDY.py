"""
Create and manage Prolific studies for the FBO experiment.

Usage:
    python RUN_PROLIFIC_STUDY.py create --pilot        # Create pilot study (80 participants)
    python RUN_PROLIFIC_STUDY.py create                # Create full study (240 participants)
    python RUN_PROLIFIC_STUDY.py publish STUDY_ID      # Publish a created study
    python RUN_PROLIFIC_STUDY.py status STUDY_ID       # Check status & submissions
    python RUN_PROLIFIC_STUDY.py submissions STUDY_ID  # List all submissions
    python RUN_PROLIFIC_STUDY.py approve STUDY_ID      # Approve all awaiting submissions
    python RUN_PROLIFIC_STUDY.py bonus STUDY_ID --csv FILE  # Pay bonuses from CSV
    python RUN_PROLIFIC_STUDY.py pause STUDY_ID        # Pause an active study
    python RUN_PROLIFIC_STUDY.py list                   # List all studies

Options:
    --pilot       Use pilot sample sizes
    --dry-run     Preview without API calls
"""

import sys
import json
import argparse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import (PATHS, EXPERIMENT_PARAMS, PROLIFIC_CONFIG, SURVEY_CONFIG,
                    ensure_dirs_exist)
from utils import ProlificClient, set_dry_run


def cmd_create(args):
    """Create a new Prolific study."""
    ensure_dirs_exist()
    if args.dry_run:
        set_dry_run(True)

    params = EXPERIMENT_PARAMS['pilot'] if args.pilot else EXPERIMENT_PARAMS
    mode = "PILOT" if args.pilot else "FULL"
    n_per_condition = params['n_per_condition']
    n_conditions = len(EXPERIMENT_PARAMS['conditions'])
    total = n_per_condition * n_conditions

    survey_url = SURVEY_CONFIG.get('survey_url', '')
    if not survey_url:
        print("WARNING: survey_url not set in config.py SURVEY_CONFIG.")
        print("  Set it to your GitHub Pages URL before publishing the study.")
        survey_url = "https://example.com/survey"

    # Prolific will append ?PROLIFIC_PID=X&STUDY_ID=Y&SESSION_ID=Z
    external_url = survey_url + "?PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}"

    reward = EXPERIMENT_PARAMS['prolific_reward_pence']
    minutes = EXPERIMENT_PARAMS['estimated_minutes']

    print(f"Creating Prolific study ({mode} mode)")
    print(f"  Conditions: {n_conditions} ({', '.join(EXPERIMENT_PARAMS['conditions'])})")
    print(f"  Per condition: {n_per_condition}")
    print(f"  Total participants: {total}")
    print(f"  Reward: {reward}p (GBP {reward/100:.2f})")
    print(f"  Est. time: {minutes} min")
    print(f"  Survey URL: {external_url}")

    client = ProlificClient()
    study = client.create_study(
        name=f"FBO {mode}: Decision Estimation Game",
        description=(
            "A short estimation game where you guess averages based on "
            "strategically revealed information. Takes about 8-10 minutes. "
            "Accuracy bonus of up to GBP 0.50 on top of base payment."
        ),
        external_study_url=external_url,
        total_available_places=total,
        reward=reward,
        estimated_completion_time=minutes,
    )

    study_id = study.get('id', 'unknown')
    print(f"\nStudy created: {study_id}")
    print(f"Status: {study.get('status', 'unknown')}")

    # Save study info for reference
    info_path = PATHS['raw_prolific'] / f"study_{study_id}.json"
    info_path.parent.mkdir(parents=True, exist_ok=True)
    with open(info_path, 'w') as f:
        json.dump(study, f, indent=2, default=str)
    print(f"Study info saved to: {info_path}")
    print(f"\nTo publish: python RUN_PROLIFIC_STUDY.py publish {study_id}")


def cmd_list(args):
    """List all studies."""
    client = ProlificClient()
    studies = client.list_studies()
    print(f"Found {len(studies)} studies:\n")
    for s in studies:
        print(f"  [{s.get('status', '?'):12s}] {s.get('name', '?')}")
        print(f"    ID: {s.get('id', '?')}")
        print(f"    Places: {s.get('total_available_places', '?')}")
        print()


def cmd_publish(args):
    """Publish an existing study."""
    if args.dry_run:
        set_dry_run(True)
    client = ProlificClient()
    result = client.publish_study(args.study_id)
    print(f"Study {args.study_id} published. Status: {result.get('status')}")


def cmd_pause(args):
    """Pause an active study."""
    if args.dry_run:
        set_dry_run(True)
    client = ProlificClient()
    result = client.pause_study(args.study_id)
    print(f"Study {args.study_id} paused. Status: {result.get('status')}")


def cmd_status(args):
    """Check study status."""
    client = ProlificClient()
    study = client.get_study_status(args.study_id)
    print(f"Study: {study.get('name')}")
    print(f"Status: {study.get('status')}")
    print(f"Places: {study.get('total_available_places')}")
    print(f"Started: {study.get('started_datetime', 'N/A')}")

    subs = client.list_submissions(args.study_id)
    statuses = {}
    for s in subs:
        st = s.get('status', 'unknown')
        statuses[st] = statuses.get(st, 0) + 1
    print(f"\nSubmissions ({len(subs)} total):")
    for st, count in sorted(statuses.items()):
        print(f"  {st}: {count}")


def cmd_submissions(args):
    """List all submissions."""
    client = ProlificClient()
    subs = client.list_submissions(args.study_id)
    print(f"Submissions for study {args.study_id} ({len(subs)} total):\n")
    for s in subs:
        pid = s.get('participant_id', s.get('participant', '?'))
        status = s.get('status', '?')
        time_taken = s.get('time_taken', '?')
        print(f"  [{status:16s}] PID: {pid}  Time: {time_taken}s")


def cmd_approve(args):
    """Approve all awaiting submissions."""
    if args.dry_run:
        set_dry_run(True)
    client = ProlificClient()
    count = client.approve_all_submissions(args.study_id)
    print(f"Approved {count} submissions for study {args.study_id}")


def cmd_bonus(args):
    """Pay bonuses from a CSV file."""
    if args.dry_run:
        set_dry_run(True)
    if not args.csv:
        print("ERROR: --csv argument required. Provide a CSV with columns: prolific_pid, bonus_pence")
        return
    client = ProlificClient()
    result = client.pay_bonuses_from_csv(args.study_id, args.csv)
    print(f"\nDone. Paid {result['total_paid']} bonuses, "
          f"total GBP {result['total_amount_pence'] / 100:.2f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview without API calls')

    subparsers = parser.add_subparsers(dest='command', help='Action to perform')

    # create
    sub_create = subparsers.add_parser('create', help='Create a new study')
    sub_create.add_argument('--pilot', action='store_true', help='Use pilot sample sizes')

    # list
    subparsers.add_parser('list', help='List all studies')

    # publish
    sub_publish = subparsers.add_parser('publish', help='Publish a study')
    sub_publish.add_argument('study_id', help='Study ID')

    # pause
    sub_pause = subparsers.add_parser('pause', help='Pause a study')
    sub_pause.add_argument('study_id', help='Study ID')

    # status
    sub_status = subparsers.add_parser('status', help='Check study status')
    sub_status.add_argument('study_id', help='Study ID')

    # submissions
    sub_subs = subparsers.add_parser('submissions', help='List submissions')
    sub_subs.add_argument('study_id', help='Study ID')

    # approve
    sub_approve = subparsers.add_parser('approve', help='Approve submissions')
    sub_approve.add_argument('study_id', help='Study ID')

    # bonus
    sub_bonus = subparsers.add_parser('bonus', help='Pay bonuses from CSV')
    sub_bonus.add_argument('study_id', help='Study ID')
    sub_bonus.add_argument('--csv', required=True, help='CSV with prolific_pid, bonus_pence')

    args = parser.parse_args()

    commands = {
        'create': cmd_create,
        'list': cmd_list,
        'publish': cmd_publish,
        'pause': cmd_pause,
        'status': cmd_status,
        'submissions': cmd_submissions,
        'approve': cmd_approve,
        'bonus': cmd_bonus,
    }

    if args.command in commands:
        commands[args.command](args)
    else:
        parser.print_help()
