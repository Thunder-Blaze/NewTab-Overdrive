'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { FaDownload, FaUpload, FaTrash, FaCloudUploadAlt, FaCloudDownloadAlt } from 'react-icons/fa'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SignInButton } from '@/components/shared/signin-button'
import { SignUpButton } from '@/components/shared/signup-button'
import { SignOutButton } from '@/components/shared/signout-button'
import { useCurrentUser } from '@/hooks/use-session'
import { IoMdLogIn, IoMdLogOut } from 'react-icons/io'

const STORAGE_KEYS = [
    'todos',
    'wallpapers',
    'cachedQuote',
    'weatherCache_',
    'cfContests',
    'cfContestsTimestamp',
    'newsArticles',
    'newsArticlesTimestamp',
    'ghContributors',
    'ghContributorsTimestamp',
    'activeSearchEngine',
    'accent-color',
    'wallpaper'
]

interface Backup {
    _id: string
    data: Record<string, string>
    createdAt: string
}

export function BackupRestoreWidget() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [backups, setBackups] = useState<Backup[]>([])
    const [selectedBackup, setSelectedBackup] = useState<string>('')
    const user = useCurrentUser()

    useEffect(() => {
        fetchBackups()
    }, [])

    const fetchBackups = async () => {
        try {
            const response = await fetch('/api/backup')
            if (!response.ok) throw new Error('Failed to fetch backups')
            const data = await response.json()
            setBackups(data)
        } catch (error) {
            console.error('Error fetching backups:', error)
            toast({
                title: 'Error',
                description: 'Failed to fetch backups',
                variant: 'destructive',
            })
        }
    }

    const backupData = () => {
        try {
            const backup: Record<string, string> = {}
            
            // Collect all localStorage data
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key && STORAGE_KEYS.some(storageKey => 
                    key === storageKey || key.startsWith(storageKey)
                )) {
                    backup[key] = localStorage.getItem(key) || ''
                }
            }

            // Create and download backup file
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `material-tab-backup-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast({
                title: 'Backup successful',
                description: 'Your data has been backed up successfully.',
            })
        } catch (error) {
            toast({
                title: 'Backup failed',
                description: 'There was an error creating the backup.',
                variant: 'destructive',
            })
        }
    }

    const uploadBackup = async () => {
        try {
            const backup: Record<string, string> = {}
            
            // Collect all localStorage data
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key && STORAGE_KEYS.some(storageKey => 
                    key === storageKey || key.startsWith(storageKey)
                )) {
                    backup[key] = localStorage.getItem(key) || ''
                }
            }

            const response = await fetch('/api/backup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: backup }),
            })

            if (!response.ok) throw new Error('Failed to upload backup')

            await fetchBackups()
            toast({
                title: 'Upload successful',
                description: 'Your data has been uploaded to the cloud.',
            })
        } catch (error) {
            toast({
                title: 'Upload failed',
                description: 'There was an error uploading the backup.',
                variant: 'destructive',
            })
        }
    }

    const restoreFromCloud = async () => {
        if (!selectedBackup) {
            toast({
                title: 'No backup selected',
                description: 'Please select a backup to restore from.',
                variant: 'destructive',
            })
            return
        }

        try {
            const backup = backups.find(b => b._id === selectedBackup)
            if (!backup) throw new Error('Backup not found')

            // Clear existing data
            STORAGE_KEYS.forEach(key => {
                for (let i = 0; i < localStorage.length; i++) {
                    const storageKey = localStorage.key(i)
                    if (storageKey && (storageKey === key || storageKey.startsWith(key))) {
                        localStorage.removeItem(storageKey)
                    }
                }
            })

            // Restore backup data
            Object.entries(backup.data).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    localStorage.setItem(key, value)
                }
            })

            toast({
                title: 'Restore successful',
                description: 'Your data has been restored from the cloud. Please refresh the page to see changes.',
            })
        } catch (error) {
            toast({
                title: 'Restore failed',
                description: 'There was an error restoring from the cloud.',
                variant: 'destructive',
            })
        }
    }

    const restoreData = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsLoading(true)
        try {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target?.result as string)
                    
                    // Clear existing data
                    STORAGE_KEYS.forEach(key => {
                        for (let i = 0; i < localStorage.length; i++) {
                            const storageKey = localStorage.key(i)
                            if (storageKey && (storageKey === key || storageKey.startsWith(key))) {
                                localStorage.removeItem(storageKey)
                            }
                        }
                    })

                    // Restore backup data
                    Object.entries(backup).forEach(([key, value]) => {
                        if (typeof value === 'string') {
                            localStorage.setItem(key, value)
                        }
                    })

                    toast({
                        title: 'Restore successful',
                        description: 'Your data has been restored successfully. Please refresh the page to see changes.',
                    })
                } catch (error) {
                    toast({
                        title: 'Restore failed',
                        description: 'The backup file is invalid or corrupted.',
                        variant: 'destructive',
                    })
                }
                setIsLoading(false)
            }
            reader.readAsText(file)
        } catch (error) {
            toast({
                title: 'Restore failed',
                description: 'There was an error restoring the backup.',
                variant: 'destructive',
            })
            setIsLoading(false)
        }
    }

    const clearData = () => {
        if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            try {
                STORAGE_KEYS.forEach(key => {
                    for (let i = 0; i < localStorage.length; i++) {
                        const storageKey = localStorage.key(i)
                        if (storageKey && (storageKey === key || storageKey.startsWith(key))) {
                            localStorage.removeItem(storageKey)
                        }
                    }
                })

                toast({
                    title: 'Data cleared',
                    description: 'All data has been cleared successfully.',
                })
                
                // Reload the page after a short delay to show the toast
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            } catch (error) {
                toast({
                    title: 'Clear failed',
                    description: 'There was an error clearing the data.',
                    variant: 'destructive',
                })
            }
        }
    }

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">Backup & Restore</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                    {!user ? (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-muted-foreground">
                                Sign in to access cloud backup features
                            </p>
                            <div className="flex flex-col gap-2">
                                <SignInButton>
                                    <IoMdLogIn className="h-4 w-4 mr-2" />
                                    Sign In
                                </SignInButton>
                                <SignUpButton>
                                    <IoMdLogIn className="h-4 w-4 mr-2" />
                                    Sign Up
                                </SignUpButton>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Backup your new tab data to a file
                                </p>
                                <Button onClick={backupData} className="w-full">
                                    <FaDownload className="mr-2" />
                                    Backup Data
                                </Button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Upload your new tab data to the cloud
                                </p>
                                <Button onClick={uploadBackup} className="w-full">
                                    <FaCloudUploadAlt className="mr-2" />
                                    Upload to Cloud
                                </Button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Restore your new tab data from a backup file
                                </p>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={restoreData}
                                    className="hidden"
                                    id="restore-file"
                                />
                                <Button
                                    onClick={() => document.getElementById('restore-file')?.click()}
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    <FaUpload className="mr-2" />
                                    {isLoading ? 'Restoring...' : 'Restore Data'}
                                </Button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Restore from cloud backup
                                </p>
                                <div className="flex gap-2">
                                    <Select value={selectedBackup} onValueChange={setSelectedBackup}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select a backup" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {backups.map((backup) => (
                                                <SelectItem key={backup._id} value={backup._id}>
                                                    {new Date(backup.createdAt).toLocaleString()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={restoreFromCloud}
                                        className="w-32"
                                        disabled={!selectedBackup}
                                    >
                                        <FaCloudDownloadAlt className="mr-2" />
                                        Restore
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Sign out of your account
                                </p>
                                <SignOutButton>
                                    <IoMdLogOut className="h-4 w-4 mr-2" />
                                    Sign Out
                                </SignOutButton>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                            Clear all new tab data
                        </p>
                        <Button
                            onClick={clearData}
                            variant="destructive"
                            className="w-full"
                        >
                            <FaTrash className="mr-2" />
                            Clear All Data
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 