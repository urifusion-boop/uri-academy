'use client';

import NextLink from 'next/link';
import { ComponentProps } from 'react';

// Wrapper to make react-router Link compatible with Next.js Link
export function Link({ to, ...props }: ComponentProps<typeof NextLink> & { to?: string }) {
  const href = to || (props.href as string);
  return <NextLink {...props} href={href} />;
}
