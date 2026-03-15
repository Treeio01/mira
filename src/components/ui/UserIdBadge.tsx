import { useAuthStore } from '../../store';

export function UserIdBadge() {
  const userId = useAuthStore((s) => s.userId);
  if (!userId) return null;

  return (
    <div className="flex py-3 px-4 rounded-lg bg-black/24 backdrop-blur-[7px] items-center z-10">
      <span className="text-white font-medium text-xs leading-[140%] tracking-[-0.02em] whitespace-nowrap">
        ID: {userId}
      </span>
    </div>
  );
}
