---
description: Run lint + typecheck on the video/ project and report failures
allowed-tools: Bash, Read
---

Run the project's verification:

```
cd video && npm run lint
```

If it fails, read the failing files at the reported lines and report:

- First line: `PASS` or `FAIL`
- If FAIL: bulleted `file:line — error` entries
- Do not attempt fixes unless I ask
