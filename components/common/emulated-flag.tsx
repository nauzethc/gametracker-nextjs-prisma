export default function EmulatedFlag ({ show }: { show?: boolean | null }) {
  return show
    ? <span className="emulated-flag flex items-center text-2xs uppercase font-bold rounded-full px-1 h-4 bg-black/20 dark:bg-white/30">
      <span>Emulated</span>
    </span>
    : null
}
