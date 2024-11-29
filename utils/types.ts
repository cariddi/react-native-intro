import { intervalToDuration } from 'date-fns';

export type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
}

export type CountdownStatus = {
   isOverdue: boolean;
    distance: ReturnType<typeof intervalToDuration>;
}

export type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
}
