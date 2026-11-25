import { chmodSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";

// Make the AI Judge Laugh (make.fun): write the office-life joke to
// entry.txt.
//
// The joke wins on a true office observation decoded: everyone who has
// worked an inbox knows the 9 a.m. "ASAP" that earns a 5 p.m. "noted,"
// and the surprising turn is the translation — "noted" is office code
// for "never." The two timestamps make the neglect concrete instead of
// abstract, the quoted words mirror how office speak actually looks in
// an email thread, and the final one-word punchline is the part that
// sticks after a single read in a pairwise comparison. The line is
// tight, setup-twist-punch, one breath long, and reads cleanly out
// loud, which is what
// the judge brief weighs: true to office life, surprising turn, tight
// line, fresh feel.
//
// Gate, verified against the kit RULES.txt: /output/entry.txt must be
// UTF-8 text of 1 to 200 characters, not only white space. The task text
// describes it as one line of under 200 characters about office life;
// the sealed scorer enforces 1 to 200, so that is what is checked here.
// This line is 110 code points (counted with the spread iterator below,
// so any surrogate pair would count as one). The checks below fail
// loudly on any violation — wrong length, blank text, a line break,
// edge whitespace, or a control or invisible character — so a bad line
// can never reach the judge.
const text =
  "I put 'ASAP' in an email at 9 a.m. and got a reply at 5 p.m. saying 'noted,' which is office code for 'never.'";

const codePoints = [...text].length;
if (codePoints < 1 || codePoints > 200 || text.trim().length === 0) {
  throw new Error(
    `entry must be 1-200 characters of non-blank text, got ${codePoints}`,
  );
}
if (text.includes("\n") || text.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (text.includes("\u2028") || text.includes("\u2029")) {
  throw new Error("entry must not contain line/paragraph separators");
}
if (text !== text.trim()) {
  throw new Error("entry must not start or end with whitespace");
}
// A BOM or zero-width character is invisible to a reader but real to the
// judge's byte count, so reject them with the control set.
if (/[\u0000-\u001f\u007f\ufeff\u200b-\u200d]/.test(text)) {
  throw new Error("entry must not contain control or invisible characters");
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
// Atomic write: temp file beside the target, then rename, so entry.txt is
// always the complete line or nothing at all. Mode 0644 because the grader
// collects outputs as another user.
const tmpPath = `${outputDir}/.entry.txt.tmp`;
const finalPath = `${outputDir}/entry.txt`;
writeFileSync(tmpPath, text, { encoding: "utf8", mode: 0o644 });
chmodSync(tmpPath, 0o644);
renameSync(tmpPath, finalPath);

// Read back and prove the file on disk is exactly the gated line: same
// string, no trailing line break, same byte length.
const written = readFileSync(finalPath, "utf8");
if (written !== text) {
  throw new Error("entry file does not match the gated line");
}
if (written.endsWith("\n") || written.endsWith("\r")) {
  throw new Error("entry file must not end with a line break");
}
if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(text, "utf8")) {
  throw new Error("entry file byte length does not match the gated line");
}
console.error(
  `entry written: ${codePoints} chars, ${Buffer.byteLength(text, "utf8")} bytes, status ok`,
);
