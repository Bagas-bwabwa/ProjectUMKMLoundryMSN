import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, AlertCircle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { ROUTES } from "@/router/paths";
import { getContactById } from "@/services/contactMockData";
import { Button } from "@/components/ui/Button.jsx";
import { Card } from "@/components/ui/Card.jsx";
import { CardContent } from "@/components/ui/CardContent.jsx";

/**
 * Materi Pertemuan 11:
 * - Dynamic route /contacts/:contactId dengan useParams
 * - useEffect untuk fetch detail data berdasarkan contactId
 * - Error handling untuk invalid contact ID
 * - Loading state saat fetch
 */
export function ContactDetail() {
  const { contactId } = useParams();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * useEffect dengan dependency [contactId]
   * - Re-fetch jika contactId berubah (navigasi ke contact lain)
   * - Cleanup untuk cancel request jika component unmount
   */
  useEffect(() => {
    if (!contactId) {
      setError("Contact ID not provided");
      setLoading(false);
      return;
    }

    let isMounted = true; // Untuk prevent memory leak

    const fetchContactDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulasi API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const foundContact = getContactById(contactId);

        if (!isMounted) return; // Prevent update jika unmounted

        if (!foundContact) {
          setError(`Contact with ID "${contactId}" not found`);
          setContact(null);
        } else {
          setContact(foundContact);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load contact"
          );
          setContact(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchContactDetail();

    // Cleanup function untuk prevent memory leak
    return () => {
      isMounted = false;
    };
  }, [contactId]); // Re-fetch jika contactId berubah

  if (loading) {
    return (
      <div className="space-y-6">
        <Link to={ROUTES.CONTACTS}>
          <Button variant="outline" size="sm" type="button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Contacts
          </Button>
        </Link>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Loading contact...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="space-y-4">
        <Link to={ROUTES.CONTACTS}>
          <Button variant="outline" size="sm" type="button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Contacts
          </Button>
        </Link>
        <div className="rounded-lg border bg-card p-6 text-center space-y-4">
          <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
          <div>
            <h1 className="text-lg font-semibold">Kontak tidak ditemukan</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {error || "The requested contact does not exist"}
            </p>
            {contactId && (
              <p className="mt-2 text-xs font-mono text-muted-foreground">
                ID: {contactId}
              </p>
            )}
          </div>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="sm"
          >
            Go Back
          </Button>
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
                  <a
                    className="text-primary hover:underline"
                    href={`mailto:${contact.email}`}
                  >
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
