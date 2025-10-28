#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():

    sys.path.append(os.path.dirname(os.path.abspath(__file__)))

    sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'SOAR'))

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SOAR.settings')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
