[tool.black]
line-length = 88
target-version = ['py38']
skip-string-normalization = false

[tool.isort]
profile = "black"
line_length = 88
known_first_party = ["my_project"]
multi_line_output = 3

[tool.flake8]
max-line-length = 88
ignore = [
    "E203",  # Whitespace before ':', compatible with black
    "W503"   # Line break before binary operator
]
exclude = ["dist", "__pycache__", ".venv"]

[tool.mypy]
python_version = 3.8
warn_unused_configs = true
disallow_untyped_defs = true
ignore_missing_imports = true

[tool.pylint.MASTER]
ignore = ["dist"]
max-line-length = 88
load-plugins = ["pylint.extensions.mccabe", "pylint.extensions.docparams"]
