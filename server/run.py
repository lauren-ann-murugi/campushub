import os
import sys
from pathlib import Path


def ensure_project_venv():
    if sys.prefix != sys.base_prefix:
        return

    venv_python = Path(__file__).resolve().parent / "venv" / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
    if venv_python.exists():
        os.execv(str(venv_python), [str(venv_python), *sys.argv])


ensure_project_venv()

from main import app

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.getenv("PORT", "5000")), debug=False)