import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

import type { ClassroomAvailability } from '@/types/database';

interface RoomDetailContextValue {
  selectedRoom: ClassroomAvailability | null;
  setSelectedRoom: (room: ClassroomAvailability | null) => void;
}

const RoomDetailContext = createContext<RoomDetailContextValue | null>(null);

export function RoomDetailProvider({ children }: { children: ReactNode }) {
  const [selectedRoom, setSelectedRoom] = useState<ClassroomAvailability | null>(null);

  const handleSetSelectedRoom = useCallback((room: ClassroomAvailability | null) => {
    setSelectedRoom(room);
  }, []);

  return (
    <RoomDetailContext.Provider value={{ selectedRoom, setSelectedRoom: handleSetSelectedRoom }}>
      {children}
    </RoomDetailContext.Provider>
  );
}

export function useRoomDetail(): RoomDetailContextValue {
  const context = useContext(RoomDetailContext);
  if (!context) {
    throw new Error('useRoomDetail must be used within a RoomDetailProvider');
  }
  return context;
}
