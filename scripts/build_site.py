"""Stage public pages, keeping each exhibition inside its project directory."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_site'
if OUT.exists():
    raise SystemExit('_site already exists; use a fresh build directory.')
OUT.mkdir()
for name in ('index.html', 'hub.css', 'hub.js', '.nojekyll'):
    shutil.copy2(ROOT / name, OUT / name)
projects = []
for path in sorted(ROOT.iterdir()):
    if path.is_dir() and not path.name.startswith(('.', '_')) and (path / 'index.html').is_file():
        shutil.copytree(path, OUT / path.name,
                        ignore=shutil.ignore_patterns('.*', 'README*', 'doc', 'node_modules', '__pycache__', 'provenance.json'))
        projects.append(path.name)
if 'mofa-vita' not in projects:
    raise SystemExit('Required exhibition mofa-vita is missing.')
print('Staged exhibitions:', ', '.join(projects))
