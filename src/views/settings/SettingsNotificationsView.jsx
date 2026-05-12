import { Button } from "@/components/ui/Button.jsx";
import { Card } from "@/components/ui/Card.jsx";
import { CardContent } from "@/components/ui/CardContent.jsx";
import { CardHeader } from "@/components/ui/CardHeader.jsx";
import { CardTitle } from "@/components/ui/CardTitle.jsx";

/** Nested route: /settings/notifications */
export function SettingsNotificationsView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-muted-foreground">
                Receive email updates for important events
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-input shrink-0"
              aria-label="Email notifications"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">Deal Updates</div>
              <div className="text-sm text-muted-foreground">
                Get notified when deals change status
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-input shrink-0"
              aria-label="Deal updates"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">Task Reminders</div>
              <div className="text-sm text-muted-foreground">
                Receive reminders for upcoming tasks
              </div>
            </div>
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-input shrink-0"
              aria-label="Task reminders"
            />
          </div>
          <Button size="sm" type="button">
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
