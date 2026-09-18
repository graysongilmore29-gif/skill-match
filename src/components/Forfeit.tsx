"use client";

import { useState } from "react";
import { Button, Modal } from "./ui";

export function Forfeit({
  onForfeit,
  busy,
}: {
  onForfeit: () => void;
  busy?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" className="text-coral" onClick={() => setOpen(true)} disabled={busy}>
        Forfeit
      </Button>
      <Modal
        open={open}
        title="Forfeit this match?"
        onClose={() => setOpen(false)}
      >
        <p className="text-sm text-muted">
          The other side takes the pot. This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Keep playing
          </Button>
          <Button
            variant="danger"
            disabled={busy}
            onClick={() => {
              onForfeit();
              setOpen(false);
            }}
          >
            Confirm forfeit
          </Button>
        </div>
      </Modal>
    </>
  );
}
