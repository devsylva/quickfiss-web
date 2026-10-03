"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Wallet2, CardAdd, ArrowUp, ArrowDown, CloseCircle } from "iconsax-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { walletApi } from "@/lib/api/wallet";
import { useAuthStore } from "@/store/useAuthStore";
import type { Wallet, WalletTransaction } from "@/types/api";

function isCredit(tx: WalletTransaction) {
  if (tx.transaction_type === "deposit" || tx.transaction_type === "refund") return true;
  if (tx.transaction_type === "transfer") return tx.description.startsWith("Transfer from");
  return false;
}

export default function WalletPage() {
  const { user, initAuth } = useAuthStore();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("5000");
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    let isMounted = true;
    async function fetchWallet() {
      setIsLoading(true);
      try {
        const wallets = await walletApi.getWallets();
        if (isMounted && Array.isArray(wallets) && wallets.length > 0) {
          setWallet(wallets[0]);
        }
      } catch {
        // Fallback gracefully for preview
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchWallet();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount);
    if (!amountNum || amountNum < 100 || isDepositing) return;

    setIsDepositing(true);
    setDepositError(null);

    const email = user?.email || "customer@quickfiss.com";

    try {
      const response = await walletApi.initializeDeposit({
        amount: amountNum,
        email,
      });

      if (response && response.authorization_url) {
        // Redirect user to Paystack checkout URL
        window.location.href = response.authorization_url;
      } else {
        setShowDepositModal(false);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to initialize deposit. Please try again.";
      setDepositError(errorMsg);
    } finally {
      setIsDepositing(false);
    }
  };

  const balanceDisplay = wallet
    ? `₦${parseFloat(String(wallet.balance) || "0").toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
    : "₦0.00";

  return (
    <DashboardShell>
      <div className="px-6 py-6 lg:px-10 lg:py-8 lg:max-w-5xl">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Wallet</h1>
        <p className="mt-1 text-sm text-muted">Manage your payments, refunds, and balance seamlessly.</p>

        {/* Balance Card Grid on Desktop */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-primary p-6 text-white shadow-md md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Available Balance
              </span>
              <Wallet2 size={24} color="#ffffff" variant="Bold" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold lg:text-4xl">
                {isLoading ? "Loading..." : balanceDisplay}
              </span>
              <p className="mt-1 text-xs text-white/70">Quickfiss Escrow Protected</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowDepositModal(true)}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-primary transition-opacity hover:opacity-90"
              >
                <CardAdd size={16} color="#3d5afe" variant="Bold" />
                Add Funds
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xs transition-colors hover:bg-white/30"
              >
                <ArrowUp size={16} color="#ffffff" variant="Linear" />
                Withdraw
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-border bg-zinc-50/70 p-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Payment Security
              </span>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                Your money remains secure in escrow until service completion is confirmed.
              </p>
            </div>
            <div className="mt-4 border-t border-border pt-3">
              <span className="text-xs text-muted">Connected rails: Paystack, Kora Pay</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-base font-bold text-foreground sm:text-lg">Recent Transactions</h2>
            <span className="text-xs text-muted">All time</span>
          </div>

          {transactions.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-zinc-50/60 p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-muted">
                <ArrowDown size={22} color="#71717a" variant="Linear" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">No transactions yet</h3>
              <p className="mt-1 max-w-xs text-xs text-muted">
                When you deposit funds or pay service providers, your payment history will be logged here.
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-white">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tx.description || tx.transaction_type}</p>
                    <p className="text-xs text-muted">{tx.created_at}</p>
                  </div>
                  <span className={`text-sm font-bold ${isCredit(tx) ? "text-emerald-600" : "text-foreground"}`}>
                    {isCredit(tx) ? "+" : "-"}₦{parseFloat(tx.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Paystack Deposit Modal */}
      <Modal open={showDepositModal}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Add Funds to Wallet</h2>
          <button
            type="button"
            onClick={() => setShowDepositModal(false)}
            aria-label="Close"
            className="text-zinc-400 hover:text-foreground"
          >
            <CloseCircle size={20} color="currentColor" variant="Linear" />
          </button>
        </div>

        <p className="mt-1 text-xs text-muted">
          Deposit funds securely into your wallet via Paystack gateway.
        </p>

        {depositError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {depositError}
          </div>
        )}

        <form onSubmit={handleDeposit} className="mt-5 text-left">
          <Input
            label="Amount (₦)"
            type="number"
            min={100}
            step={100}
            placeholder="5000"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />

          <div className="mt-3 flex gap-2">
            {["2000", "5000", "10000", "20000"].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setDepositAmount(amt)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                  depositAmount === amt
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border text-muted hover:border-zinc-300"
                }`}
              >
                ₦{parseInt(amt, 10).toLocaleString()}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Button type="submit" isLoading={isDepositing}>
              Pay with Paystack
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowDepositModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
