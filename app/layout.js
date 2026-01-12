import './globals.css';
import ClientLayout from './client-layout';

export const metadata = {
  title: 'Natural Disaster Without Network',
  description: 'Offline-first natural disaster emergency app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ef4444" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
