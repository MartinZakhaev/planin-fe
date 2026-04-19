"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { fetcher } from "@/lib/api";
import { AddMemberDto } from "@/types/organization";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Search, UserCheck, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

interface FoundUser {
    id: string;
    fullName: string | null;
    email: string;
}

interface AddMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orgId: string;
    existingMemberIds: string[];
    onAdd: (dto: AddMemberDto) => Promise<void>;
}

export function AddMemberDialog({ open, onOpenChange, orgId, existingMemberIds, onAdd }: AddMemberDialogProps) {
    const [email, setEmail] = useState("");
    const [searching, setSearching] = useState(false);
    const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [role, setRole] = useState<"MEMBER" | "ADMIN">("MEMBER");
    const [adding, setAdding] = useState(false);

    const resetState = () => {
        setEmail("");
        setFoundUser(null);
        setSearchError(null);
        setRole("MEMBER");
    };

    const handleClose = (val: boolean) => {
        if (!val) resetState();
        onOpenChange(val);
    };

    const handleSearch = async () => {
        if (!email.trim()) return;
        setSearching(true);
        setFoundUser(null);
        setSearchError(null);
        try {
            const user = await fetcher<FoundUser>(`/users/lookup?email=${encodeURIComponent(email.trim())}`);
            if (existingMemberIds.includes(user.id)) {
                setSearchError("This user is already a member of this organization.");
            } else {
                setFoundUser(user);
            }
        } catch (err: any) {
            setSearchError(err.message || "No account found with that email address.");
        } finally {
            setSearching(false);
        }
    };

    const handleAdd = async () => {
        if (!foundUser) return;
        setAdding(true);
        try {
            await onAdd({ organizationId: orgId, userId: foundUser.id, role });
            toast.success(`${foundUser.fullName || foundUser.email} added as ${role.toLowerCase()}`);
            handleClose(false);
        } catch (err: any) {
            toast.error(err.message || "Failed to add member");
        } finally {
            setAdding(false);
        }
    };

    const initials = (name: string | null, email: string) => {
        if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        return email[0].toUpperCase();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[440px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-5 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            <UserPlus className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base leading-tight">Add Member</DialogTitle>
                            <DialogDescription className="text-xs mt-0.5">
                                Search for an existing account by email address.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-6 py-5 space-y-4">
                    {/* Email search */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-foreground/80">Email Address</Label>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="colleague@example.com"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setFoundUser(null); setSearchError(null); }}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="flex-1"
                                autoFocus
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSearch}
                                disabled={searching || !email.trim()}
                                className="shrink-0 gap-2"
                            >
                                {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                                Find
                            </Button>
                        </div>
                        {searchError && (
                            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
                                <X className="size-3.5 text-destructive shrink-0 mt-0.5" />
                                <p className="text-xs text-destructive">{searchError}</p>
                            </div>
                        )}
                    </div>

                    {/* Found user card */}
                    {foundUser && (
                        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-10">
                                    <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                                        {initials(foundUser.fullName, foundUser.email)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium leading-tight truncate">{foundUser.fullName || "—"}</p>
                                    <p className="text-xs text-muted-foreground truncate">{foundUser.email}</p>
                                </div>
                                <UserCheck className="size-4 text-green-500 shrink-0 ml-auto" />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-foreground/80">Role in organization</Label>
                                <Select value={role} onValueChange={(v) => setRole(v as "MEMBER" | "ADMIN")}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MEMBER">Member — Can view and contribute</SelectItem>
                                        <SelectItem value="ADMIN">Admin — Can manage members</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 border-t border-border/50 bg-muted/20 gap-2">
                    <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={adding} className="h-9 px-4">
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} disabled={!foundUser || adding} className="h-9 px-4 gap-2">
                        {adding ? <><Loader2 className="size-4 animate-spin" />Adding...</> : <><UserPlus className="size-4" />Add Member</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
