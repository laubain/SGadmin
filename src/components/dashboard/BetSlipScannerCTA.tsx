import { Camera } from 'lucide-react'

export default function BetSlipScannerCTA() {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-2">Scan Your Bet Slip</h3>
          <p className="text-sm opacity-90">
            Get instant AI analysis on your bets and find +EV opportunities
          </p>
        </div>
        <button className="bg-white text-primary rounded-full p-3 hover:bg-gray-100">
          <Camera className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
