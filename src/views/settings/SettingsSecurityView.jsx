import { useState } from "react";
import { Button } from "@/components/ui/Button.jsx";
import { Card } from "@/components/ui/Card.jsx";
import { CardContent } from "@/components/ui/CardContent.jsx";
import { CardHeader } from "@/components/ui/CardHeader.jsx";
import { CardTitle } from "@/components/ui/CardTitle.jsx";

/** Nested route: /settings/security — formulir dasar tanpa backend. */
export function SettingsSecurityView() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!nextPassword || nextPassword !== confirmPassword) {
      setMessage("Password baru tidak cocok atau kosong.");
      return;
    }
    setMessage("Preferensi disimpan secara lokal (demo tanpa API).");
    setCurrentPassword("");
    setNextPassword("");
    setConfirmPassword("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="current-password">
              Current password
            </label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="new-password">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={nextPassword}
              onChange={(e) => setNextPassword(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="confirm-password">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-background"
            />
          </div>
          <Button size="sm" type="submit">
            Update password
          </Button>
          {message ? (
            <p className="text-sm text-muted-foreground">{message}</p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
