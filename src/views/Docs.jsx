import { Card } from "@/components/ui/Card.jsx";
import { CardContent } from "@/components/ui/CardContent.jsx";
import { CardHeader } from "@/components/ui/CardHeader.jsx";
import { CardTitle } from "@/components/ui/CardTitle.jsx";

export function Docs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Docs</h1>
        <p className="text-muted-foreground">Project documentation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Use the sidebar to navigate between pages.</p>
          <p>This page is a placeholder (the original Vue project had a Docs route).</p>
        </CardContent>
      </Card>
    </div>
  );
}

