import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';
import type { FavoriteWithClassroom } from '@/types/database';

interface UseFavoritesResult {
  favorites: FavoriteWithClassroom[];
  isLoading: boolean;
  error: string | null;
  addFavorite: (classroomId: string) => Promise<void>;
  removeFavorite: (classroomId: string) => Promise<void>;
  isFavorite: (classroomId: string) => boolean;
  refetch: () => Promise<void>;
}

export function useFavorites(): UseFavoritesResult {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteWithClassroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('favorites')
        .select(`
          *,
          classroom:classrooms(
            *,
            building:buildings(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Filter out any favorites where classroom data couldn't be fetched
      const validFavorites = (data || []).filter(
        (fav): fav is FavoriteWithClassroom => fav.classroom !== null
      );

      setFavorites(validFavorites);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch favorites';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(
    async (classroomId: string) => {
      if (!user) {
        throw new Error('Must be logged in to add favorites');
      }

      const { error: insertError } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, classroom_id: classroomId });

      if (insertError) {
        throw new Error(insertError.message);
      }

      await fetchFavorites();
    },
    [user, fetchFavorites]
  );

  const removeFavorite = useCallback(
    async (classroomId: string) => {
      if (!user) {
        throw new Error('Must be logged in to remove favorites');
      }

      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('classroom_id', classroomId);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      await fetchFavorites();
    },
    [user, fetchFavorites]
  );

  const isFavorite = useCallback(
    (classroomId: string) => {
      return favorites.some((fav) => fav.classroom_id === classroomId);
    },
    [favorites]
  );

  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
}
