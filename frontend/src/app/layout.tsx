import React, { ReactNode } from 'react';
import '../styles/global.css';
import { Provider } from '@/src/app/Provider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
