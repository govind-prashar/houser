'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { X, Lock, Eye, EyeOff } from 'lucide-react'

interface ChangePasswordModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match')
            return
        }

        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || 'Failed to change password')
            } else {
                toast.success('Password changed successfully!')
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
                onClose()
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Lock className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-bold text-foreground">Change Password</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="current-pw" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Current Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="current-pw"
                                type={showCurrent ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="pr-10 h-11"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new-pw" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="new-pw"
                                type={showNew ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                className="pr-10 h-11"
                                placeholder="Minimum 8 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-pw" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Confirm New Password
                        </Label>
                        <Input
                            id="confirm-pw"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            className="h-11"
                            placeholder="Re-enter new password"
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary text-primary-foreground hover:opacity-90 font-bold transition-all transform hover:scale-[1.02] active:scale-95"
                        >
                            {loading ? 'Changing...' : 'Update Password'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
