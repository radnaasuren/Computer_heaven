'use client';

import { ApolloProvider } from '@apollo/client';

import { AuthProvider } from '@/contexts/auth-context';
import { BasketProvider } from '@/contexts/basket-context';
import { client } from '@/lib/apollo';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <BasketProvider>{children}</BasketProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
