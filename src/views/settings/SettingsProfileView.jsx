import { Button } from "@/components/ui/Button.jsx";
import { Card } from "@/components/ui/Card.jsx";
import { CardContent } from "@/components/ui/CardContent.jsx";
import { CardHeader } from "@/components/ui/CardHeader.jsx";
import { CardTitle } from "@/components/ui/CardTitle.jsx";

/** Nested route: /settings/profile */
export function SettingsProfileView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="full-name">
              Full Name
            </label>
            <input
              id="full-name"
              type="text"
              placeholder="John Doe"
              className="w-full p-2 border border-input rounded-md bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="w-full p-2 border border-input rounded-md bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="job-title">
              Job Title
            </label>
            <input
              id="job-title"
              type="text"
              placeholder="Sales Manager"
              className="w-full p-2 border border-input rounded-md bg-background"
            />
          </div>
          <Button size="sm" type="button">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="theme">
              Theme
            </label>
            <select
              id="theme"
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              defaultValue="Light"
            >
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="language">
              Language
            </label>
            <select
              id="language"
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              defaultValue="English"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <Button size="sm" type="button">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
