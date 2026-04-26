interface StatCardProps {
    label: string;
    value: string;
  }
  
  export default function StatCard({ label, value }: StatCardProps) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 text-center">
        <p className="text-white font-bold text-xl">{value}</p>
        <p className="text-[#666] text-xs mt-1">{label}</p>
      </div>
    );
  }