import { useState, useCallback } from 'react';
import { useCardsStore } from '../store';
import type { CardInfoItem } from '../services/api';

export function useCardNameEdit(card: CardInfoItem | null) {
  const renameCard = useCardsStore((s) => s.renameCard);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const startEdit = useCallback(() => {
    if (card) {
      setEditName(card.card_name);
      setIsEditing(true);
    }
  }, [card]);

  const saveName = useCallback(() => {
    if (card && editName.trim() && editName.trim() !== card.card_name) {
      renameCard(card.card_id, editName.trim());
    }
    setIsEditing(false);
  }, [card, editName, renameCard]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  return { isEditing, editName, setEditName, startEdit, saveName, cancelEdit };
}
