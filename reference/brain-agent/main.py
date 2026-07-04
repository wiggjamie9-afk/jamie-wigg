"""Run the Brain orchestrator end-to-end (boot -> stop).

    python3 main.py
"""
from Brain import Brain


def main():
    brain = Brain()
    brain.start()
    # In a real deployment the services would run their own threads here.
    brain.stop()


if __name__ == "__main__":
    main()
