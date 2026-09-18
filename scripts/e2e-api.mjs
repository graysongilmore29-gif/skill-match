/**
 * API happy-path: guest → create 1v1 → fill → ready → stake → start → declare → rematch
 */
const base = process.env.BASE_URL || "http://127.0.0.1:3000";

function cookieHeader(setCookie) {
  if (!setCookie) return "";
  const parts = Array.isArray(setCookie) ? setCookie : [setCookie];
  return parts.map((item) => item.split(";")[0]).join("; ");
}

async function req(path, { method = "GET", body, cookie } = {}) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${method} ${path} ${res.status}: ${data.error || "failed"}`);
  }
  return { data, cookie: cookieHeader(res.headers.getSetCookie?.() ?? res.headers.get("set-cookie")) || cookie };
}

async function main() {
  let cookie = "";
  const guest = await req("/api/auth/guest", {
    method: "POST",
    body: { displayName: "E2E Player" },
  });
  cookie = guest.cookie;
  const created = await req("/api/matches", {
    method: "POST",
    cookie,
    body: { mode: "1v1" },
  });
  const id = created.data.match.id;
  if (created.data.match.status !== "waiting") throw new Error("expected waiting");

  await req(`/api/matches/${id}/action`, {
    method: "POST",
    cookie,
    body: { action: "fill_randoms" },
  });
  const ready = await req(`/api/matches/${id}/action`, {
    method: "POST",
    cookie,
    body: { action: "ready" },
  });
  if (ready.data.match.status !== "ready") throw new Error("expected ready");

  const staked = await req(`/api/matches/${id}/action`, {
    method: "POST",
    cookie,
    body: { action: "confirm_stake" },
  });
  if (!staked.data.match.allFunded) throw new Error("expected all funded");

  const started = await req(`/api/matches/${id}/action`, {
    method: "POST",
    cookie,
    body: { action: "start" },
  });
  if (started.data.match.status !== "in_match") throw new Error("expected in_match");

  const settled = await req(`/api/matches/${id}/action`, {
    method: "POST",
    cookie,
    body: { action: "declare", team: "A" },
  });
  if (settled.data.match.status !== "settled") throw new Error("expected settled");
  const you = settled.data.match.players.find((p) => p.userId === settled.data.match.you.userId);
  if (!you || !you.payoutCents) throw new Error("expected winner payout");

  const rematch = await req(`/api/matches/${id}/action`, {
    method: "POST",
    cookie,
    body: { action: "rematch" },
  });
  if (rematch.data.match.mode !== "1v1" || rematch.data.match.status !== "waiting") {
    throw new Error("expected rematch waiting 1v1");
  }

  console.log("e2e ok", {
    matchId: id,
    rematchId: rematch.data.match.id,
    payoutCents: you.payoutCents,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
