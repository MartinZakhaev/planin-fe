"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, Info, Trash2, UserPlus, Save } from "lucide-react"

import { ActionDialog, ActionDialogType, IconPosition } from "@/components/action-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function DialogDemoPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [iconPosition, setIconPosition] = useState<IconPosition>("left")

    // Mock Async Action
    const handleAsyncAction = async () => {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)
        alert("Action Completed!")
    }

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Action Dialog Component</h1>
                <p className="text-muted-foreground mt-2">
                    A reusable component for Dialogs and Alert Dialogs with unified API.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Creation Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>1. Create Form</CardTitle>
                        <CardDescription>Standard creation dialog with inputs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ActionDialog
                            type="create"
                            title="Create New Unit"
                            description="Add a new unit to your inventory system."
                            trigger={<Button className="w-full"><UserPlus className="mr-2 h-4 w-4" /> Create Unit</Button>}
                            onConfirm={handleAsyncAction}
                            isLoading={isLoading}
                        >
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input id="name" defaultValue="Unit A" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">Code</Label>
                                    <Input id="username" defaultValue="UNI-001" className="col-span-3" />
                                </div>
                            </div>
                        </ActionDialog>
                    </CardContent>
                </Card>

                {/* 2. Edit Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>2. Edit Form</CardTitle>
                        <CardDescription>Edit existing data with 'Save' action.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ActionDialog
                            type="edit"
                            title="Edit Profile"
                            description="Make changes to your profile here."
                            trigger={<Button variant="outline" className="w-full"><Save className="mr-2 h-4 w-4" /> Edit Profile</Button>}
                            onConfirm={handleAsyncAction}
                            isLoading={isLoading}
                        >
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-name" className="text-right">Name</Label>
                                    <Input id="edit-name" defaultValue="John Doe" className="col-span-3" />
                                </div>
                            </div>
                        </ActionDialog>
                    </CardContent>
                </Card>

                {/* 3. Info Pop Up */}
                <Card>
                    <CardHeader>
                        <CardTitle>3. Info Pop Up</CardTitle>
                        <CardDescription>Simple informational modal.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ActionDialog
                            type="info"
                            title="Payment Successful"
                            description="Your transaction was processed successfully. A receipt has been sent to your email."
                            trigger={<Button variant="secondary" className="w-full"><CheckCircle className="mr-2 h-4 w-4" /> View Status</Button>}
                            icon={<CheckCircle className="h-12 w-12 text-green-500" />}
                            iconPosition="top"
                        />
                    </CardContent>
                </Card>

                {/* 4. Warning Pop Up */}
                <Card>
                    <CardHeader>
                        <CardTitle>4. Warning Pop Up</CardTitle>
                        <CardDescription>Destructive warning action.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ActionDialog
                            type="warning"
                            title="Delete Account"
                            description="Are you sure? This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                            trigger={<Button variant="destructive" className="w-full"><Trash2 className="mr-2 h-4 w-4" /> Delete Account</Button>}
                            onConfirm={handleAsyncAction}
                            isLoading={isLoading}
                            icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
                            iconPosition="left"
                        />
                    </CardContent>
                </Card>

                {/* 5. Confirmation Pop Up */}
                <Card>
                    <CardHeader>
                        <CardTitle>5. Confirmation Pop Up</CardTitle>
                        <CardDescription>Generic confirmation action.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ActionDialog
                            type="confirm"
                            title="Publish Post?"
                            description="This will make your post visible to all users."
                            trigger={<Button variant="default" className="w-full">Publish Now</Button>}
                            onConfirm={handleAsyncAction}
                            isLoading={isLoading}
                            icon={<Info className="h-6 w-6 text-blue-500" />}
                            iconPosition="center"
                        />
                    </CardContent>
                </Card>

                {/* Playground */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Playground: Icon Positioning</CardTitle>
                        <CardDescription>Test how different icon positions look.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <Label>Icon Position:</Label>
                            <RadioGroup
                                value={iconPosition}
                                onValueChange={(v) => setIconPosition(v as IconPosition)}
                                className="flex space-x-4"
                            >
                                <div className="flex items-center space-x-2"><RadioGroupItem value="left" id="p-left" /><Label htmlFor="p-left">Left</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="top" id="p-top" /><Label htmlFor="p-top">Top</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="center" id="p-center" /><Label htmlFor="p-center">Center</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="right" id="p-right" /><Label htmlFor="p-right">Right</Label></div>
                            </RadioGroup>
                        </div>

                        <div className="flex justify-center border p-8 rounded-lg bg-muted/20">
                            <ActionDialog
                                type="info"
                                title="Dynamic Preview"
                                description={`This dialog has the icon in the '${iconPosition}' position.`}
                                icon={<Info className="h-10 w-10 text-indigo-500" />}
                                iconPosition={iconPosition}
                                trigger={<Button size="lg">Open Dynamic Preview</Button>}
                            />
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
