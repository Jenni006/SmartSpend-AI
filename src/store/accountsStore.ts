import type { Account, Currency, Institution } from "../types/models";
import { seedAccounts, seedCurrencies, seedInstitutions } from "../data/seedData";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { indexedDbStorage } from "./indexedDbStorage";

type AccountsStore = {
  accounts: Account[];
  institutions: Institution[];
  currencies: Currency[];

  getInstitutionById: (id: string) => Institution | undefined;
};

export const useAccountsStore = create<AccountsStore>()(
  persist(
    (_set, get) => ({
      // initial state (populated from indexeddb or seed)
      accounts: [],
      institutions: [],
      currencies: [],

      // find institution by id (used by TransactionsTable)
      getInstitutionById: (id) => get().institutions.find((i) => i.id === id),
    }),
    {
      name: "accounts-store", // indexeddb key
      storage: createJSONStorage(() => indexedDbStorage),
      version: 2,
      // seed data on first load if empty
      onRehydrateStorage: () => (state) => {
        if (state) {
          const needsUpdate =
            state.accounts.length === 0 ||
            state.institutions.length === 0 ||
            state.currencies.length === 0;
          if (needsUpdate) {
            setTimeout(() => {
              useAccountsStore.setState({
                accounts: state.accounts.length === 0 ? seedAccounts : state.accounts,
                institutions:
                  state.institutions.length === 0 ? seedInstitutions : state.institutions,
                currencies: state.currencies.length === 0 ? seedCurrencies : state.currencies,
              });
            }, 0);
          }
        }
      },
      // migrate from older schema versions
      migrate: (persistedState: unknown, version: number) => {
        if (version < 2) {
          return {
            accounts: seedAccounts,
            institutions: seedInstitutions,
            currencies: seedCurrencies,
          };
        }
        return persistedState;
      },
    },
  ),
);
