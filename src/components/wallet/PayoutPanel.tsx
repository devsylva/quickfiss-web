"use client";

import { useCallback, useEffect, useState } from "react";
import { Bank as BankIcon, Trash } from "iconsax-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { walletApi } from "@/lib/api/wallet";
import { bookingsApi } from "@/lib/api/bookings";
import { formatNaira } from "@/lib/money";
import type { Bank, BankAccount, ProviderStats } from "@/types/api";

const MIN_WITHDRAWAL = 1000;

/** Where a provider's earnings go: saved bank accounts and withdrawals. */
export function PayoutPanel({ onWithdrawn }: { onWithdrawn: (message: string) => void }) {
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [addOpen, setAddOpen] = useState(false);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState<number | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [s, a] = await Promise.all([bookingsApi.providerStats(), walletApi.getBankAccounts()]);
        if (cancelled) return;
        setStats(s);
        setAccounts(Array.isArray(a) ? a : []);
        setError(null);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "We couldn't load your payout details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const openAdd = async () => {
    setAddOpen(true);
    setAddError(null);
    setResolvedName(null);
    setBankCode("");
    setAccountNumber("");
    if (banks.length === 0) {
      try {
        setBanks(await walletApi.getBanks());
      } catch (err: unknown) {
        setAddError(err instanceof Error ? err.message : "We couldn't load the list of banks.");
      }
    }
  };

  // Look up the account name as soon as there is a bank and a full 10-digit number.
  const checkAccount = async (code: string, number: string) => {
    setResolvedName(null);
    setAddError(null);
    if (!code || number.length !== 10) return;
    setResolving(true);
    try {
      const { account_name } = await walletApi.resolveAccount(number, code);
      setResolvedName(account_name);
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : "We couldn't find that account.");
    } finally {
      setResolving(false);
    }
  };

  const saveAccount = async () => {
    if (saving || !resolvedName) return;
    setSaving(true);
    setAddError(null);
    try {
      await walletApi.addBankAccount({
        account_number: accountNumber,
        bank_code: bankCode,
        bank_name: banks.find((b) => b.code === bankCode)?.name ?? "",
      });
      setAddOpen(false);
      reload();
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : "We couldn't save that account.");
    } finally {
      setSaving(false);
    }
  };

  const removeAccount = async (id: number) => {
    try {
      await walletApi.removeBankAccount(id);
      reload();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "We couldn't remove that account.");
    }
  };

  const available = Number(stats?.available ?? 0);

  const openWithdraw = () => {
    setWithdrawError(null);
    setAmount(available >= MIN_WITHDRAWAL ? String(Math.floor(available)) : "");
    setAccountId(accounts[0]?.id ?? null);
    setWithdrawOpen(true);
  };

  const withdraw = async () => {
    const value = Number(amount);
    if (withdrawing || !accountId || !value) return;
    setWithdrawing(true);
    setWithdrawError(null);
    try {
      await walletApi.withdraw(value, accountId);
      setWithdrawOpen(false);
      reload();
      onWithdrawn(`Withdrawal of ${formatNaira(value)} is on its way to your bank.`);
    } catch (err: unknown) {
      setWithdrawError(err instanceof Error ? err.message : "We couldn't start that withdrawal.");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <section id="payouts" className="mt-10 rounded-2xl border border-border bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground sm:text-lg">Earnings &amp; payouts</h2>
          <p className="mt-0.5 text-xs text-muted">Money from completed jobs can be sent to your bank account.</p>
        </div>
        <Button className="!w-auto !px-5 !py-2.5 text-xs" disabled={loading || accounts.length === 0 || available < MIN_WITHDRAWAL} onClick={openWithdraw}>
          Withdraw
        </Button>
      </div>

      {error && <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          ["Ready to withdraw", stats?.available ?? 0],
          ["Held in escrow", stats?.in_escrow ?? 0],
          ["Total earned", stats?.earned ?? 0],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-xl bg-zinc-50 p-3">
            <p className="text-sm font-extrabold text-foreground sm:text-base">{formatNaira(value as number)}</p>
            <p className="mt-0.5 text-[11px] text-muted">{label}</p>
          </div>
        ))}
      </div>
      {available > 0 && available < MIN_WITHDRAWAL && (
        <p className="mt-2 text-xs text-muted">The minimum withdrawal is {formatNaira(MIN_WITHDRAWAL)}.</p>
      )}

      <div className="mt-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Bank accounts</h3>
        <button type="button" onClick={openAdd} className="text-xs font-semibold text-primary hover:underline">
          + Add account
        </button>
      </div>

      {accounts.length === 0 ? (
        <p className="mt-2 rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted">
          Add a bank account to receive your earnings.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-border rounded-xl border border-border">
          {accounts.map((account) => (
            <li key={account.id} className="flex items-center justify-between gap-3 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light">
                  <BankIcon size={18} color="#3d5afe" variant="Bold" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{account.account_name}</p>
                  <p className="text-xs text-muted">
                    {account.bank_name} · ••••{account.account_number.slice(-4)}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => removeAccount(account.id)} aria-label="Remove account" className="text-zinc-400 hover:text-red-600">
                <Trash size={18} color="currentColor" variant="Linear" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={addOpen} position="bottom">
        <h2 className="text-lg font-bold text-foreground">Add bank account</h2>
        <div className="mt-4 flex flex-col gap-4 text-left">
          <div>
            <label htmlFor="payout-bank" className="mb-2 block text-sm font-semibold text-foreground">
              Bank
            </label>
            <select
              id="payout-bank"
              value={bankCode}
              onChange={(e) => {
                setBankCode(e.target.value);
                checkAccount(e.target.value, accountNumber);
              }}
              className="w-full rounded-input border border-border bg-white px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="">Choose your bank</option>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Account number"
            inputMode="numeric"
            maxLength={10}
            placeholder="10 digits"
            value={accountNumber}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
              setAccountNumber(digits);
              checkAccount(bankCode, digits);
            }}
          />
          {resolving && <p className="text-xs text-muted">Checking account...</p>}
          {resolvedName && (
            <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{resolvedName}</p>
          )}
          {addError && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{addError}</p>}
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <Button isLoading={saving} disabled={!resolvedName} onClick={saveAccount}>
            Save account
          </Button>
          <Button variant="secondary" onClick={() => setAddOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>

      <Modal open={withdrawOpen} position="bottom">
        <h2 className="text-lg font-bold text-foreground">Withdraw earnings</h2>
        <p className="mt-1 text-xs text-muted">You can withdraw up to {formatNaira(available)}.</p>
        <div className="mt-4 flex flex-col gap-4 text-left">
          <Input
            label="Amount (₦)"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
          />
          <div>
            <label htmlFor="payout-account" className="mb-2 block text-sm font-semibold text-foreground">
              Send to
            </label>
            <select
              id="payout-account"
              value={accountId ?? ""}
              onChange={(e) => setAccountId(Number(e.target.value))}
              className="w-full rounded-input border border-border bg-white px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_name} · {account.bank_name} ••••{account.account_number.slice(-4)}
                </option>
              ))}
            </select>
          </div>
          {withdrawError && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{withdrawError}</p>}
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <Button isLoading={withdrawing} disabled={!amount || Number(amount) < MIN_WITHDRAWAL || Number(amount) > available} onClick={withdraw}>
            Withdraw {amount ? formatNaira(Number(amount)) : ""}
          </Button>
          <Button variant="secondary" onClick={() => setWithdrawOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </section>
  );
}
