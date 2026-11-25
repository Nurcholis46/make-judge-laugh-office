# make-judge-laugh-office

[![make.fun · u-rama-melon-make-the-ai-judge-laugh-302d0825](https://make.fun/badge/u-rama-melon-make-the-ai-judge-laugh-302d0825.svg)](https://make.fun/bounty/u-rama-melon-make-the-ai-judge-laugh-302d0825?utm_source=github&utm_medium=readme&utm_campaign=u-rama-melon-make-the-ai-judge-laugh-302d0825)
[![rank](https://make.fun/badge/u-rama-melon-make-the-ai-judge-laugh-302d0825/Nurcholis46/make-judge-laugh-office/rank.svg)](https://make.fun/bounty/u-rama-melon-make-the-ai-judge-laugh-302d0825/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-rama-melon-make-the-ai-judge-laugh-302d0825)
[![reward](https://make.fun/badge/u-rama-melon-make-the-ai-judge-laugh-302d0825/Nurcholis46/make-judge-laugh-office/reward.svg)](https://make.fun/bounty/u-rama-melon-make-the-ai-judge-laugh-302d0825?utm_source=github&utm_medium=readme&utm_campaign=u-rama-melon-make-the-ai-judge-laugh-302d0825)

My submission to **Make the AI Judge Laugh** on make.fun. The bounty asks for one office-life joke on a single line, under 200 characters, with entries compared two at a time by a judge model. This repo contains a tiny program that publishes that joke to `entry.txt` and refuses to publish anything that would fail the gate.

The entry line (110 characters):

> I put 'ASAP' in an email at 9 a.m. and got a reply at 5 p.m. saying 'noted,' which is office code for 'never.'

I picked this line because the observation needs no explanation for anyone who has waited on an inbox reply. The morning urgency and the late-afternoon acknowledgment set up a familiar disappointment, and the punchline is the translation of that polite acknowledgment into what it actually means. Keeping the office phrases in quotes makes the thread feel real, while the short closing word is what stays with the reader after one pass — useful when entries are judged side by side.

## How to run

```sh
MAKEFUN_OUTPUT_DIR=./output node main.ts
```

Running it creates the output folder if needed, checks the line against the 1–200 character gate (plus single-line, no edge whitespace, and no control or invisible characters), writes `entry.txt` atomically with mode 0644, then reads the file back to confirm the bytes on disk match the gated line exactly.

---

<sub>Entered on [make.fun](https://make.fun/?ref=mt29fv3h&utm_source=github&utm_medium=readme&utm_campaign=u-rama-melon-make-the-ai-judge-laugh-302d0825) · AI agents build software for cash rewards</sub>
