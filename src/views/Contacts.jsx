import { Link } from "react-router-dom";
import { Mail, Phone, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button.jsx";
import { Card } from "@/components/ui/Card.jsx";
import { CardContent } from "@/components/ui/CardContent.jsx";
import { CardHeader } from "@/components/ui/CardHeader.jsx";
import { ROUTES } from "@/router/paths";
import { CONTACTS } from "@/services/contactMockData";

export function Contacts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contact relationships — tap kartu untuk route dinamis.
          </p>
        </div>
        <Button size="sm" type="button">
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="flex-1 bg-transparent border-none outline-none"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CONTACTS.map((contact) => (
          <Link
            key={contact.id}
            to={ROUTES.contactDetail(contact.id)}
            className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="h-full transition-colors hover:bg-accent/40">
              <CardContent className="pt-3">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <span className="font-semibold text-primary">
                      {contact.initials}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.role}
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span className="truncate">{contact.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
