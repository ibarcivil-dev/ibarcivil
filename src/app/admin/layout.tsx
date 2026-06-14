import type { Metadata } from 'next';
import AdminClientLayout from './AdminClientLayout';

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "IBAR digital webzine curation and publishing manager."
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
