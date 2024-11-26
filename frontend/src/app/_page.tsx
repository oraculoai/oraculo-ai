'use client';

import React from 'react';
import Chat from '@/src/app/components/Chat/Chat';

export default function IndexPage() {
  return (
    <>
      <div className="flex justify-center h-screen fixed p-4 w-full">
        <Chat />
      </div>
    </>
  );
}
