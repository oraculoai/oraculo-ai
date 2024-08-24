import React from 'react';
import { BubbleProps } from '@/src/app/components/Bubble/Bubble.props';

export default function Bubble({ children, from }: BubbleProps) {
  const styles: Record<BubbleProps['from'], string> = {
    agent: 'bg-gray-100',
    user: 'bg-white ml-auto',
  };

  return (
    <div className={`border rounded-lg p-4 w-3/5 ${styles[from]}`}>
      {children}
    </div>
  );
}
