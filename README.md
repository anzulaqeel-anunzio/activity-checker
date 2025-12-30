# Awesome List Activity Checker

Ensure your Awesome List features alive and active projects! This tool checks the last commit date of GitHub repositories linked in your Markdown file.

## Features

-   **Staleness Detection**: Identifies repositories that haven't been pushed to in `X` days (default: 365).
-   **GitHub API Integration**: accurately fetches `pushed_at` data.
-   **Markdown Report**: Highlights stale links directly in the console.

## Standard Usage

1.  Get a GitHub Personal Access Token (for higher API rate limits).
2.  Run the tool:

```bash
export GITHUB_TOKEN=your_token
awesome-activity-checker list.md
```

## Options

-   `--days <number>`: Warning threshold in days (default: 365).
-   `--hide-active`: Only show stale repositories.

## Contact

Developed for Anunzio International by Anzul Aqeel.
Contact +971545822608 or +971585515742.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---
### 🔗 Part of the "Ultimate Utility Toolkit"
This tool is part of the **[Anunzio International Utility Toolkit](https://github.com/anzulaqeel/ultimate-utility-toolkit)**.
Check out the full collection of **180+ developer tools, scripts, and templates** in the master repository.

Developed for Anunzio International by Anzul Aqeel.
