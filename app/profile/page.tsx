/**
 * Profile Page
 * Displays user profile information and security settings.
 * Designed to match the project's consistent UI patterns.
 */

"use client";

import React, { useState, useCallback } from "react";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function ProfilePage() {
    const { user, isLoading, error } = useCurrentUser();
    const { toast } = useToast();

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

    const handleUpdatePassword = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
            return;
        }

        setIsUpdating(true);
        // Simulate API call for password update
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsUpdating(false);
        setIsChangingPassword(false);
        setPasswords({ current: "", new: "", confirm: "" });
        toast({ title: "Success", description: "Password updated successfully" });
    }, [passwords, toast]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex justify-center items-center p-20">
                <ErrorState message={error || "User session not found."} />
            </div>
        );
    }

    return (
        <div className="flex justify-center mt-12 px-6 sm:px-8">
            <div className="w-full max-w-4xl space-y-8 pb-14">
                <PageHeader
                    title="Profile Settings"
                    description="Manage your account information and security."
                />

                <div className="flex flex-col gap-6">
                    {/* User Details Section */}
                    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">User Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                                <Input value={user.full_name} readOnly className="bg-gray-50 border-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                                <Input value={user.email} readOnly className="bg-gray-50 border-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Account Role</Label>
                                <Input value={user.role === 'ba' ? 'Business Analyst' : 'Client'} readOnly className="bg-gray-50 border-gray-300 capitalize" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Member Since</Label>
                                <Input value={new Date(user.created_at).toLocaleDateString()} readOnly className="bg-gray-50 border-gray-300" />
                            </div>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Security</h2>
                            {!isChangingPassword && (
                                <Button onClick={() => setIsChangingPassword(true)} variant="outline" size="sm">
                                    Change Password
                                </Button>
                            )}
                        </div>

                        {isChangingPassword ? (
                            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Current Password</Label>
                                    <Input
                                        type="password"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">New Password</Label>
                                    <Input
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                                    <Input
                                        type="password"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button type="submit" disabled={isUpdating} className="bg-[#341BAB] text-white hover:bg-[#341BAB]/90">
                                        {isUpdating ? "Updating..." : "Update Password"}
                                    </Button>
                                    <Button type="button" variant="ghost" onClick={() => setIsChangingPassword(false)} disabled={isUpdating}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                Keeping your password updated helps ensure your account remains secure.
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
