'use client';

import { useState, useEffect } from 'react';
import { CreateUnitDto, UpdateUnitDto, Unit } from '@/types/unit';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{unit ? 'Edit Unit' : 'Create Unit'}</DialogTitle>
                    <DialogDescription>
                        {unit ? 'Update the unit details below.' : 'Add a new unit to the system.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">
                                Code
                            </Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
