#!/bin/sh
# usage: ad-skip.sh <etincelle_receiver index.html> [--check]
# Writes src/ad-skip.js: the receiver's ad break search (its <ad-rule> and <ad-skip> blocks), as it
# is, made a module. The receiver is where it is changed; this copy follows it. With --check, only
# says whether src/ad-skip.js is that copy, and fails when it is not.
set -e
cd "$(dirname "$0")"
[ -f "$1" ] || { echo "usage: $0 <etincelle_receiver index.html> [--check]" >&2; exit 2; }
copy() {
	echo "// The etincelle receiver's ad break search (its <ad-rule> and <ad-skip> blocks), as it is."
	echo "// Written by ad-skip.sh from the receiver's index.html: change it there, then copy it again."
	awk '/\/\/ <ad-rule>/ { on = 1 } on { print } /\/\/ <\/ad-skip>/ { exit }' "$1"
	echo "export { AdRule, makeAdSkip };"
}
if [ "$2" = "--check" ]; then
	if copy "$1" | cmp -s - src/ad-skip.js; then
		echo "src/ad-skip.js is the receiver's"
	else
		echo "src/ad-skip.js differs from the receiver's: run $0 $1" >&2
		exit 1
	fi
else
	copy "$1" > src/ad-skip.js
	grep -q "// </ad-skip>" src/ad-skip.js || { echo "no <ad-skip> block in $1" >&2; exit 1; }
fi
