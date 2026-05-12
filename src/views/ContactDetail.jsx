import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { ROUTES } from "@/router/paths";
import { getContactById } from "@/services/contactMockData";
import { Button } from "@/components/ui/Button.jsx";
import { Card } from "@/components/ui/Card.jsx";
import { CardContent } from "@/components/ui/CardContent.jsx";

/** Dynamic route /contacts/:contactId — data dari satu sumber mock service. */
export function ContactDetail() {
  const { contactId } = useParams();
  const contact =
    typeof contactId === "string" ? getContactById(contactId) : undefined;

  if (!contact) {
    return (
      <div className="space-y-4">
        <Link to={ROUTES.CONTACTS}>
          <Button variant="outline" size="sm" type="button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Contacts
          </Button>
        </Link>
        <div className="rounded-lg border bg-card p-6">
          <h1 className="text-lg font-semibold">Kontak tidak ditemukan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ID{" "}
            <span className="font-mono">
              {contactId ?? "(tidak ada)"}
            </span>{" "}
            tidak cocok dengan data demo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link to={ROUTES.CONTACTS}>
          <Button variant="outline" size="sm" type="button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Semua kontak
          </Button>
        </Link>
        <div className="text-sm text-muted-foreground font-mono">
          {ROUTES.contactDetail(contact.id)}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {contact.initials}
            </div>
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {contact.name}
              </h1>
              <p className="text-muted-foreground">{contact.role}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a className="text-primary hover:underline" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{contact.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
