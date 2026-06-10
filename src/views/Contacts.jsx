import { Link } from "react-router-dom";
import { Mail, Phone, Plus, Search, AlertCircle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button.jsx";
import { Card } from "@/components/ui/Card.jsx";
import { CardContent } from "@/components/ui/CardContent.jsx";
import { CardHeader } from "@/components/ui/CardHeader.jsx";
import { ROUTES } from "@/router/paths";
import { CONTACTS } from "@/services/contactMockData";

/**
 * Materi Pertemuan 11:
 * - useEffect dengan dependencies state untuk fetch data
 * - Search functionality dengan state management
 * - Loading dan error handling UI
 */
export function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect tanpa dependencies: simulasi initial data fetch
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulasi API call delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        setContacts(CONTACTS);
        setFilteredContacts(CONTACTS);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load contacts"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []); // Dependencies kosong = hanya jalan saat mount

  // useEffect dengan dependencies: filter contacts saat search query berubah
  useEffect(() => {
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
    );
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]); // Re-run saat searchQuery atau contacts berubah

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Loading contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
            <p className="text-destructive font-semibold">Error</p>
            <p className="text-muted-foreground text-sm">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none"
            />
          </div>
        </CardHeader>
      </Card>

      {filteredContacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery
              ? "No contacts found matching your search"
              : "No contacts available"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map((contact) => (
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
      )}

      <div className="text-xs text-muted-foreground text-center mt-8">
        Showing {filteredContacts.length} of {contacts.length} contacts
      </div>
    </div>
  );
}
