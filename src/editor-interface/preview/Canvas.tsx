import * as React from "react";
import { Button } from "@/components/atoms/Button";

export function Canvas() {
  return (
    <div className="bg-white rounded-xl shadow-lg w-[600px] min-h-[800px] overflow-hidden flex flex-col">
      {/* Header strip */}
      <div className="bg-[#4f46e5] h-16 flex items-center px-8">
        <span className="text-white font-bold text-lg tracking-wide">Appcharge</span>
      </div>

      {/* Hero section */}
      <div className="px-8 py-10 text-center">
        <h2 className="text-2xl font-bold text-[#171717]">Welcome back, Player!</h2>
        <p className="text-[#737373] mt-2">Your exclusive offer is waiting</p>
        <div className="flex justify-center mt-4">
          <Button>Claim Offer</Button>
        </div>
      </div>

      {/* Content row */}
      <div className="px-8 py-6">
        <div className="flex gap-4">
          {/* Card 1 */}
          <div className="rounded-lg border border-[#e5e5e5] p-4 flex-1">
            <p className="text-sm font-semibold text-[#171717]">Coins Balance</p>
            <p className="text-2xl font-bold text-[#4f46e5] mt-1">12,450</p>
            <p className="text-xs text-[#737373] mt-1">Available to spend</p>
          </div>

          {/* Card 2 */}
          <div className="rounded-lg border border-[#e5e5e5] p-4 flex-1">
            <p className="text-sm font-semibold text-[#171717]">Current Streak</p>
            <p className="text-2xl font-bold text-[#4f46e5] mt-1">7 days</p>
            <p className="text-xs text-[#737373] mt-1">Keep it up!</p>
          </div>
        </div>
      </div>

      {/* Spacer to push footer down */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="bg-[#f5f5f5] px-8 py-4 text-center text-xs text-[#a3a3a3]">
        Appcharge · Unsubscribe
      </div>
    </div>
  );
}
