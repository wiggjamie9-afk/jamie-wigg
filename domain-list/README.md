# Domain list

Cleaned and normalized domain list (the `m…` slice).

## Files

| File | Count | Contents |
|---|---|---|
| `domains.txt` | 1989 | Full cleaned list, all TLDs, one domain per line |
| `domains.com.txt` | 1864 | `.com` domains only |
| `domains.net.txt` | 125 | `.net` domains only |

## Processing applied

The raw input was treated as data and cleaned — **no judgment was made about
whether any domain is benign or malicious.** Steps:

1. **Normalize** — strip leading/trailing whitespace, strip carriage returns
   (CRLF → LF), lowercase every host.
2. **Drop blanks** — remove empty lines.
3. **Dedupe** — remove exact and case-insensitive duplicate hosts (`sort -u`).
4. **Sort** — canonical byte order (`LC_ALL=C sort`).
5. **Split by TLD** — partition into per-TLD files for convenience.

## Notes on the input

The raw list was already well-formed: every entry is a bare hostname
(`label.label…`), there were **0 blank lines, 0 uppercase characters, 0
duplicates (exact or case-insensitive), and 0 CRLF line endings**. The only
change of substance was re-sorting into canonical `LC_ALL=C` order; the byte
content of the host set is otherwise unchanged.

To reproduce from a raw `input.txt`:

```sh
tr -d '\r' < input.txt \
  | sed 's/^[[:space:]]*//; s/[[:space:]]*$//' \
  | tr 'A-Z' 'a-z' \
  | grep -v '^$' \
  | LC_ALL=C sort -u > domains.txt

LC_ALL=C grep '\.com$' domains.txt > domains.com.txt
LC_ALL=C grep '\.net$' domains.txt > domains.net.txt
```
