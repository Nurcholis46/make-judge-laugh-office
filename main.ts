import { chmodSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";

// Entry writer for the "Make the AI Judge Laugh" bounty.
//
// What this does, in order:
//   1. Hold the joke as a single constant string.
//   2. Run a set of pre-flight checks that mirror the sealed gate.
//   3. Publish the joke to entry.txt with an atomic replace.
//   4. Re-read the published file and confirm it round-tripped exactly.
//
// Why this joke: the humor comes from a translation the reader performs
// instantly. A 9 a.m. urgent request answered at 5 p.m. with a polite
// acknowledgment needs no setup for anyone who has lived in an inbox,
// and the closing one-word decoding — that acknowledgment meaning
// "never" — is the turn that makes it memorable in a head-to-head read.
// The timestamps keep the neglect specific, the quoted office phrases
// keep it recognizably real, and the short setup-twist-punch shape
// keeps it tight enough to land in one breath.
//
// Gate notes (checked against the kit rules before writing this):
// the scorer accepts UTF-8 text of 1..200 characters that is not only
// whitespace. This program additionally enforces the single-line
// description from the task text: no line breaks, no paragraph
// separators, no leading/trailing whitespace, and no control or
// zero-width characters that would be invisible to a reader but would
// still count toward the byte total. Any violation throws before a
// file is written, so an invalid line can never be published.
// Character counting uses the spread iterator on purpose: it counts
// code points, so an astral character counts once, matching how the
// gate describes length in characters rather than UTF-16 units.

const joke =
  "I put 'ASAP' in an email at 9 a.m. and got a reply at 5 p.m. saying 'noted,' which is office code for 'never.'";

function assertGate(candidate: string): number {
  const length = [...candidate].length;
  if (length < 1 || length > 200) {
    throw new Error(`gate: expected 1-200 characters, got ${length}`);
  }
  if (candidate.trim().length === 0) {
    throw new Error("gate: entry must not be blank");
  }
  if (candidate.includes("\n") || candidate.includes("\r")) {
    throw new Error("gate: entry must stay on one line");
  }
  if (candidate.includes("\u2028") || candidate.includes("\u2029")) {
    throw new Error("gate: line/paragraph separators are not allowed");
  }
  if (candidate !== candidate.trim()) {
    throw new Error("gate: no leading or trailing whitespace");
  }
  if (/[\u0000-\u001f\u007f\ufeff\u200b-\u200d]/.test(candidate)) {
    throw new Error("gate: control or invisible characters are not allowed");
  }
  return length;
}

function publish(candidate: string): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(dir, { recursive: true });
  const staging = `${dir}/.entry.txt.tmp`;
  const target = `${dir}/entry.txt`;
  // Stage beside the target, then rename: readers either see the old
  // file or the complete new one, never a half-written joke. Mode is
  // pinned to 0644 because the collector runs as a different user.
  writeFileSync(staging, candidate, { encoding: "utf8", mode: 0o644 });
  chmodSync(staging, 0o644);
  renameSync(staging, target);
  return target;
}

function verifyOnDisk(path: string, expected: string): void {
  const actual = readFileSync(path, "utf8");
  if (actual !== expected) {
    throw new Error("verify: file content differs from the gated joke");
  }
  if (actual.endsWith("\n") || actual.endsWith("\r")) {
    throw new Error("verify: file must not end with a line break");
  }
  if (Buffer.byteLength(actual, "utf8") !== Buffer.byteLength(expected, "utf8")) {
    throw new Error("verify: byte length mismatch after write");
  }
}

const charCount = assertGate(joke);
const writtenPath = publish(joke);
verifyOnDisk(writtenPath, joke);
console.error(
  `entry written: ${charCount} chars, ${Buffer.byteLength(joke, "utf8")} bytes, status ok`,
);
