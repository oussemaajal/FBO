#!/usr/bin/env python3
"""
Master script for FBO (Fooled by Omission) project.

Runs the entire pipeline from experiment design to analysis.

Usage:
    python run_all.py                  # Run full pipeline
    python run_all.py --stage 2        # Start from stage 2 (collection)
    python run_all.py --pilot          # Run pilot version (smaller N)
    python run_all.py --dry-run        # Show what would be run
    python run_all.py --list           # List all stages and scripts

Author: Oussema
"""

import subprocess
import sys
import argparse
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).parent.resolve()
CODE_DIR = PROJECT_ROOT / 'code'

# =============================================================================
# PIPELINE DEFINITION
# =============================================================================

PIPELINE = {
    1: {
        'name': 'Experiment Design',
        'scripts': [
            CODE_DIR / '01_design' / 'BUILD_SCENARIOS.py',
            CODE_DIR / '01_design' / 'BUILD_SURVEY.py',
            CODE_DIR / '01_design' / 'BUILD_LLM_PROMPTS.py',
        ]
    },
    2: {
        'name': 'Data Collection',
        'scripts': [
            CODE_DIR / '02_collect' / 'RUN_PROLIFIC_STUDY.py',
            CODE_DIR / '02_collect' / 'RUN_LLM_EXPERIMENT.py',
            CODE_DIR / '02_collect' / 'FETCH_SURVEY_RESPONSES.py',
        ]
    },
    3: {
        'name': 'Data Cleaning',
        'scripts': [
            CODE_DIR / '03_clean' / 'CLEAN_HUMAN_RESPONSES.py',
            CODE_DIR / '03_clean' / 'CLEAN_LLM_RESPONSES.py',
            CODE_DIR / '03_clean' / 'MERGE_RESPONSES.py',
        ]
    },
    4: {
        'name': 'Statistical Analysis',
        'scripts': [
            CODE_DIR / '04_analysis' / 'DESCRIPTIVES.py',
            CODE_DIR / '04_analysis' / 'COMPARE_HUMAN_LLM.py',
            CODE_DIR / '04_analysis' / 'WITHIN_LLM_ANALYSIS.py',
        ]
    },
}


# =============================================================================
# EXECUTION
# =============================================================================

def run_script(script_path: Path, pilot: bool = False, dry_run: bool = False) -> bool:
    """Run a single Python script. Returns True on success."""
    if not script_path.exists():
        print(f"  [SKIP] {script_path.name} (file not found)")
        return True

    cmd = [sys.executable, str(script_path)]
    if pilot:
        cmd.append('--pilot')
    if dry_run:
        cmd.append('--dry-run')

    print(f"\n  Running: {script_path.name}")
    print(f"  Command: {' '.join(cmd)}")
    print(f"  {'-' * 50}")

    try:
        result = subprocess.run(cmd, cwd=str(PROJECT_ROOT))
        if result.returncode != 0:
            print(f"\n  [FAILED] {script_path.name} (exit code {result.returncode})")
            return False
        print(f"  [OK] {script_path.name}")
        return True
    except Exception as e:
        print(f"\n  [ERROR] {script_path.name}: {e}")
        return False


def run_pipeline(start_stage: int = 1, pilot: bool = False, dry_run: bool = False):
    """Run the full pipeline starting from a given stage."""
    start_time = datetime.now()
    mode = []
    if pilot:
        mode.append("PILOT")
    if dry_run:
        mode.append("DRY-RUN")
    mode_str = f" ({', '.join(mode)})" if mode else ""

    print(f"\n{'=' * 60}")
    print(f"  FBO Pipeline{mode_str}")
    print(f"  Started: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"  Starting from stage: {start_stage}")
    print(f"{'=' * 60}")

    failed = []

    for stage_num, stage_info in sorted(PIPELINE.items()):
        if stage_num < start_stage:
            continue

        print(f"\n{'=' * 60}")
        print(f"  STAGE {stage_num}: {stage_info['name']}")
        print(f"{'=' * 60}")

        for script in stage_info['scripts']:
            success = run_script(script, pilot=pilot, dry_run=dry_run)
            if not success:
                failed.append(script.name)
                print(f"\n  Stage {stage_num} failed at {script.name}.")
                print(f"  To resume: python run_all.py --stage {stage_num}")
                return False

    elapsed = datetime.now() - start_time
    print(f"\n{'=' * 60}")
    print(f"  Pipeline complete! Elapsed: {elapsed}")
    if failed:
        print(f"  Failed scripts: {', '.join(failed)}")
    else:
        print(f"  All stages successful.")
    print(f"{'=' * 60}")
    return True


def list_pipeline():
    """Print all stages and scripts."""
    print("\nFBO Pipeline Stages:")
    print("=" * 60)
    for stage_num, stage_info in sorted(PIPELINE.items()):
        print(f"\n  Stage {stage_num}: {stage_info['name']}")
        for script in stage_info['scripts']:
            exists = "Y" if script.exists() else "N"
            print(f"    [{exists}] {script.name}")
    print()


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--stage', type=int, default=1,
                        help='Start from this stage (default: 1)')
    parser.add_argument('--pilot', action='store_true',
                        help='Run pilot version (smaller sample sizes)')
    parser.add_argument('--dry-run', action='store_true',
                        help='Show what would be run without executing')
    parser.add_argument('--list', action='store_true',
                        help='List all stages and scripts')

    args = parser.parse_args()

    if args.list:
        list_pipeline()
    else:
        success = run_pipeline(
            start_stage=args.stage,
            pilot=args.pilot,
            dry_run=args.dry_run,
        )
        sys.exit(0 if success else 1)
