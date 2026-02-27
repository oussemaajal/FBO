"""
Configuration file for FBO (Fooled by Omission) project.

Human-only experiment: participants recruited via Prolific complete a custom
web survey hosted on GitHub Pages. No LLM experiment arm.

Usage:
    from config import PATHS, DATA_FILES, EXPERIMENT_PARAMS, PROLIFIC_CONFIG
    df = pd.read_csv(PATHS['raw'] / 'my_data.csv')

Following Gentzkow & Shapiro (2014) "Code and Data for the Social Sciences"
"""

from pathlib import Path
import os

# =============================================================================
# PROJECT ROOT
# =============================================================================
PROJECT_ROOT = Path(__file__).parent.parent.resolve()

# =============================================================================
# DIRECTORY STRUCTURE
# =============================================================================
PATHS = {
    # Root
    'root': PROJECT_ROOT,

    # Survey (web app)
    'survey': PROJECT_ROOT / 'survey',

    # Data directories
    'data': PROJECT_ROOT / 'data',
    'raw': PROJECT_ROOT / 'data' / 'raw',
    'raw_prolific': PROJECT_ROOT / 'data' / 'raw' / 'prolific',
    'raw_responses': PROJECT_ROOT / 'data' / 'raw' / 'responses',
    'raw_scenarios': PROJECT_ROOT / 'data' / 'raw' / 'scenarios',
    'intermediate': PROJECT_ROOT / 'data' / 'intermediate',
    'clean': PROJECT_ROOT / 'data' / 'clean',

    # Code directories
    'code': PROJECT_ROOT / 'code',
    'design': PROJECT_ROOT / 'code' / '01_design',
    'collect': PROJECT_ROOT / 'code' / '02_collect',
    'clean_code': PROJECT_ROOT / 'code' / '03_clean',
    'analysis': PROJECT_ROOT / 'code' / '04_analysis',
    'scratchpad': PROJECT_ROOT / 'code' / 'scratchpad',

    # Output directories
    'output': PROJECT_ROOT / 'output',
    'tables': PROJECT_ROOT / 'output' / 'tables',
    'figures': PROJECT_ROOT / 'output' / 'figures',
    'pilot_output': PROJECT_ROOT / 'output' / 'pilot',
    'pilot_tables': PROJECT_ROOT / 'output' / 'pilot' / 'tables',
    'pilot_figures': PROJECT_ROOT / 'output' / 'pilot' / 'figures',

    # Documentation
    'docs': PROJECT_ROOT / 'docs',
    'notes': PROJECT_ROOT / 'notes',
}

# =============================================================================
# SPECIFIC DATA FILES
# =============================================================================
DATA_FILES = {
    # Raw
    'scenario_definitions': PATHS['raw_scenarios'] / 'scenarios.json',

    # Intermediate
    'human_parsed': PATHS['intermediate'] / 'human_parsed.parquet',

    # Clean (analysis-ready)
    'all_responses': PATHS['clean'] / 'all_responses.parquet',
    'pilot_responses': PATHS['clean'] / 'pilot_responses.parquet',
    'bonuses': PATHS['clean'] / 'bonuses.csv',
}

# =============================================================================
# PROLIFIC CONFIGURATION
# =============================================================================
PROLIFIC_CONFIG = {
    'api_key_env': 'PROLIFIC_API_TOKEN',
    'workspace_id_env': 'PROLIFIC_WORKSPACE_ID',
    'project_id_env': 'PROLIFIC_PROJECT_ID',
    'base_url': 'https://api.prolific.com/api/v1',
    'completion_code': 'C1DT2DOB',
}

# =============================================================================
# SURVEY CONFIGURATION
# =============================================================================
SURVEY_CONFIG = {
    # URL where the survey is hosted (GitHub Pages or local)
    'survey_url': 'https://oussemaajal.github.io/FBO/',

    # Google Sheets Apps Script endpoint for data collection
    'data_endpoint': 'https://script.google.com/macros/s/AKfycbyGF-wrCRMydHe726y-Iur7239XdLbJBD-BtGdFTUBgrsHRhFWB43SF_lyvEqbu4ZJ9/exec',

    # Google Sheet ID for programmatic CSV export (read data without manual download)
    'google_sheet_id': '1RHYjq2JekRCd3ZHEI6xq706j2WgES4Xg-YCa3E3iaUw',
}

# =============================================================================
# EXPERIMENT PARAMETERS
# =============================================================================
EXPERIMENT_PARAMS = {
    # Randomization
    'seed': 42,

    # Conditions (between-subjects: Clean vs Explicit display format)
    'conditions': ['clean', 'explicit'],

    # Full experiment
    'n_per_condition': 120,  # 120 per condition = 240 total

    # Pilot (stripped-down 2x2)
    'pilot': {
        'n_per_condition': 40,  # 40 per condition = 80 total
    },

    # Payment (Prolific)
    'prolific_reward_pence': 150,     # GBP 1.50 base payment
    'estimated_minutes': 10,

    # Bonus
    'bonus': {
        'base_amount_usd': 1.00,
        'penalty_per_unit': 0.20,
        'floor': 0.00,
    },
}

# =============================================================================
# PRE-GENERATED STIMULI (from experimental_design.md)
# =============================================================================
# Full study: 9 trials (3x3 grid: N in {4,6,8} x k in {1,2,3})
# Disclosed values vary across trials (always top-k values, strategic sender).
# Test A (anchoring to disclosure volume): hold k/N ratio ~ constant, vary both
# Test B (adjustment to omission): hold k fixed, increase N
STIMULI_FULL = [
    # N=4
    {'id': 't1', 'N': 4, 'k': 1, 'disclosed': [8],        'hidden': [4, 3, 1],             'trueAverage': 4.00},
    {'id': 't2', 'N': 4, 'k': 2, 'disclosed': [9, 6],     'hidden': [3, 2],                'trueAverage': 5.00},
    {'id': 't3', 'N': 4, 'k': 3, 'disclosed': [10, 7, 6], 'hidden': [1],                   'trueAverage': 6.00},
    # N=6
    {'id': 't4', 'N': 6, 'k': 1, 'disclosed': [7],        'hidden': [5, 4, 3, 2, 1],       'trueAverage': 3.67},
    {'id': 't5', 'N': 6, 'k': 2, 'disclosed': [8, 7],     'hidden': [5, 3, 2, 1],          'trueAverage': 4.33},
    {'id': 't6', 'N': 6, 'k': 3, 'disclosed': [9, 8, 5],  'hidden': [3, 2, 1],             'trueAverage': 4.67},
    # N=8
    {'id': 't7', 'N': 8, 'k': 1, 'disclosed': [9],        'hidden': [6, 5, 4, 3, 2, 1, 1], 'trueAverage': 3.88},
    {'id': 't8', 'N': 8, 'k': 2, 'disclosed': [10, 7],    'hidden': [5, 4, 3, 2, 1, 1],    'trueAverage': 4.13},
    {'id': 't9', 'N': 8, 'k': 3, 'disclosed': [8, 7, 6],  'hidden': [5, 3, 2, 2, 1],       'trueAverage': 4.25},
]

# Pilot: 4 trials (corners of NxK grid, preserving Test A and Test B comparisons)
STIMULI_PILOT = [
    {'id': 'p1', 'N': 4, 'k': 1, 'disclosed': [8],        'hidden': [4, 3, 1],             'trueAverage': 4.00},
    {'id': 'p2', 'N': 8, 'k': 1, 'disclosed': [9],        'hidden': [6, 5, 4, 3, 2, 1, 1], 'trueAverage': 3.88},
    {'id': 'p3', 'N': 4, 'k': 3, 'disclosed': [10, 7, 6], 'hidden': [1],                   'trueAverage': 6.00},
    {'id': 'p4', 'N': 8, 'k': 3, 'disclosed': [8, 7, 6],  'hidden': [5, 3, 2, 2, 1],       'trueAverage': 4.25},
]

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def load_api_key(key_name: str) -> str:
    """Load an API key from environment variable or project .env file."""
    value = os.environ.get(key_name)
    if value:
        return value

    env_path = PROJECT_ROOT / ".env"
    try:
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if line.startswith(key_name) and "=" in line:
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    except FileNotFoundError:
        pass

    return None


def ensure_dirs_exist():
    """Create all directories if they don't exist."""
    for name, path in PATHS.items():
        if name != 'root':
            path.mkdir(parents=True, exist_ok=True)


def get_path(key: str) -> Path:
    """Get a path by key name. Raises KeyError if not found."""
    if key in PATHS:
        return PATHS[key]
    elif key in DATA_FILES:
        return DATA_FILES[key]
    else:
        raise KeyError(
            f"Unknown path key: {key}. "
            f"Available: {list(PATHS.keys()) + list(DATA_FILES.keys())}"
        )


# =============================================================================
# VALIDATION
# =============================================================================
if __name__ == "__main__":
    print(f"Project root: {PROJECT_ROOT}")

    print("\nDirectory structure:")
    for name, path in PATHS.items():
        exists = "Y" if path.exists() else "N"
        print(f"  [{exists}] {name}: {path}")

    print("\nData files:")
    for name, path in DATA_FILES.items():
        exists = "Y" if path.exists() else "N"
        print(f"  [{exists}] {name}: {path.name}")

    print(f"\nExperiment conditions: {EXPERIMENT_PARAMS['conditions']}")
    print(f"Full N per condition: {EXPERIMENT_PARAMS['n_per_condition']}")
    pilot = EXPERIMENT_PARAMS['pilot']
    print(f"Pilot N per condition: {pilot['n_per_condition']}")
    print(f"Full stimuli: {len(STIMULI_FULL)} trials")
    print(f"Pilot stimuli: {len(STIMULI_PILOT)} trials")

    print("\nProlific config:")
    for key in ['api_key_env', 'workspace_id_env', 'project_id_env']:
        env_var = PROLIFIC_CONFIG[key]
        val = load_api_key(env_var)
        status = f"SET ({val[:8]}...)" if val else "NOT SET"
        print(f"  {env_var}: {status}")
