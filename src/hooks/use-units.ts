'use client';

import { useState, useEffect, useCallback } from 'react';
import { Unit, CreateUnitDto, UpdateUnitDto } from '@/types/unit';
import { fetcher } from '@/lib/api';

export function useUnits() {
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUnits = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetcher<Unit[]>('/units');
            setUnits(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createUnit = async (data: CreateUnitDto) => {
        setIsLoading(true);
        setError(null);
        try {
            const newUnit = await fetcher<Unit>('/units', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            setUnits((prev) => [...prev, newUnit]);
            return newUnit;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateUnit = async (id: string, data: UpdateUnitDto) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedUnit = await fetcher<Unit>(`/units/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
            setUnits((prev) => prev.map((unit) => (unit.id === id ? updatedUnit : unit)));
            return updatedUnit;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteUnit = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await fetcher(`/units/${id}`, {
                method: 'DELETE',
            });
            setUnits((prev) => prev.filter((unit) => unit.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, [fetchUnits]);

    return {
        units,
        isLoading,
        error,
        createUnit,
        updateUnit,
        deleteUnit,
        refreshUnits: fetchUnits,
    };
}
