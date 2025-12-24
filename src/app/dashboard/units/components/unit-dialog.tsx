'use client';

import { useState, useEffect } from 'react';
import { CreateUnitDto, UpdateUnitDto, Unit } from '@/types/unit';
import { Ruler } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ActionDialog } from '@/components/action-dialog';

interface UnitDialogProps {
    unit?: Unit | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateUnitDto | UpdateUnitDto) => Promise<void>;
}

export function UnitDialog({ unit, open, onOpenChange, onSubmit }: UnitDialogProps) {
    const [formData, setFormData] = useState<CreateUnitDto>({
        code: '',
        name: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (unit) {
            setFormData({
                code: unit.code,
                name: unit.name,
            });
        } else {
            setFormData({
                code: '',
                name: '',
            });
        }
    }, [unit, open]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSubmit(formData);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ActionDialog
            open={open}
            onOpenChange={onOpenChange}
            type={unit ? 'edit' : 'create'}
            title={unit ? 'Edit Unit' : 'Create New Unit'}
            description={unit ? 'Update the details of this measurement unit.' : 'Add a new measurement unit to your inventory system.'}
            icon={<Ruler className="h-5 w-5 text-primary" />}
            iconPosition="left"
            items-center
            onConfirm={handleSubmit}
            isLoading={loading}
            disabled={loading}
            className="sm:max-w-[480px]"
        >
            <div className="flex flex-col gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="code" className="text-sm font-medium">
                        Unit Code
                    </Label>
                    <Input
                        id="code"
                        placeholder="e.g. 'm2', 'kg'"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="h-10"
                        autoFocus={!unit}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                        Unit Name
                    </Label>
                    <Input
                        id="name"
                        placeholder="e.g. 'Square Meter', 'Kilogram'"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-10"
                        required
                    />
                </div>
            </div>
        </ActionDialog>
    );
}
