/** Data kontak bersama untuk daftar + halaman dinamis /contacts/:contactId */

export const CONTACTS = [
  {
    id: "john-doe",
    initials: "JD",
    name: "John Doe",
    role: "CEO at Acme Corp",
    email: "john@acme.com",
    phone: "+1 234 567 8900",
  },
  {
    id: "jane-smith",
    initials: "JS",
    name: "Jane Smith",
    role: "CTO at Tech Solutions",
    email: "jane@techsol.com",
    phone: "+1 234 567 8901",
  },
  {
    id: "mike-brown",
    initials: "MB",
    name: "Mike Brown",
    role: "Sales Director at InnovateCo",
    email: "mike@innovate.com",
    phone: "+1 234 567 8902",
  },
];

export function getContactById(id: string): ContactRecord | undefined {
  return CONTACTS.find((c) => c.id === id);
}
