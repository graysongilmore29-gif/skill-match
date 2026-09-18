import assert from "node:assert/strict";
import test from "node:test";
import {
  nextOpenSlot,
  pathForStatus,
  potCents,
  rosterSize,
  splitPot,
  teamSize,
  winnerFromScores,
} from "./match-rules";

test("team and roster sizes", () => {
  assert.equal(teamSize("1v1"), 1);
  assert.equal(teamSize("2v2"), 2);
  assert.equal(teamSize("3v3"), 3);
  assert.equal(rosterSize("2v2"), 4);
});

test("fills the other side first, then balances", () => {
  assert.deepEqual(nextOpenSlot([], "1v1"), { team: "A", slot: 1 });
  assert.deepEqual(nextOpenSlot([{ team: "A", slot: 1 }], "1v1"), {
    team: "B",
    slot: 1,
  });
  assert.equal(nextOpenSlot([{ team: "A", slot: 1 }, { team: "B", slot: 1 }], "1v1"), null);

  const twoVTwo = nextOpenSlot(
    [
      { team: "A", slot: 1 },
      { team: "B", slot: 1 },
    ],
    "2v2",
  );
  assert.deepEqual(twoVTwo, { team: "A", slot: 2 });
});

test("pot split keeps every cent on the winning side", () => {
  assert.deepEqual(splitPot(2000, 1), [2000]);
  assert.deepEqual(splitPot(2000, 2), [1000, 1000]);
  assert.deepEqual(splitPot(1000, 3), [334, 333, 333]);
  assert.equal(splitPot(1000, 3).reduce((sum, n) => sum + n, 0), 1000);
  assert.equal(potCents(1000, 2), 2000);
});

test("scores and routes", () => {
  assert.equal(winnerFromScores(3, 1), "A");
  assert.equal(winnerFromScores(0, 2), "B");
  assert.equal(winnerFromScores(1, 1), "tie");
  assert.equal(pathForStatus("abc", "waiting"), "/");
  assert.equal(pathForStatus("abc", "ready"), "/match/abc/wager");
  assert.equal(pathForStatus("abc", "in_match"), "/match/abc/play");
  assert.equal(pathForStatus("abc", "settled"), "/match/abc/payout");
});
