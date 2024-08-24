import React from 'react';

export interface BubbleProps {
  children: React.ReactNode;
  from: 'agent' | 'user';
}
