import { InfoRow } from '../ui/InfoRow';
import { EditIcon } from '../icons/EditIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { CloseIcon } from '../icons/CloseIcon';
import { useCardNameEdit } from '../../hooks/useCardNameEdit';
import type { CardInfoItem } from '../../services/api';

interface CardNameEditorProps {
  card: CardInfoItem;
}

export function CardNameEditor({ card }: CardNameEditorProps) {
  const { isEditing, editName, setEditName, startEdit, saveName, cancelEdit } = useCardNameEdit(card);

  if (isEditing) {
    return (
      <div className="flex w-full bg-[#181424] items-center justify-between rounded-lg gap-2.5 py-2 px-4">
        <span className="text-[#A095BD] text-sm font-medium leading-[140%] tracking-[-0.02em] whitespace-nowrap">
          Имя карточки
        </span>
        <div className="flex gap-1.5 items-center">
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            maxLength={64}
            autoFocus
            className="bg-transparent text-white text-sm font-medium text-right outline-none w-32"
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveName();
              if (e.key === 'Escape') cancelEdit();
            }}
          />
          <button onClick={saveName} className="active:scale-90 transition-transform">
            <CheckIcon />
          </button>
          <button onClick={cancelEdit} className="active:scale-90 transition-transform">
            <CloseIcon />
          </button>
        </div>
      </div>
    );
  }

  return (
    <InfoRow
      label="Имя карточки"
      value={card.card_name}
      action={
        <button onClick={startEdit} className="active:scale-90 transition-transform">
          <EditIcon />
        </button>
      }
    />
  );
}
