'use client'

import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { SignInValidation } from '@/lib/validations/auth'
import { signInWithCredentials } from '@/lib/actions/auth/signin-with-credentials'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormError } from '@/components/shared/form-error'
import { FormSuccess } from '@/components/shared/form-success'
import { FormWrapper } from '@/components/shared/form-wrapper'

export const SignInForm = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl')
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')
    const [showTwoFactor, setShowTwoFactor] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof SignInValidation>>({
        resolver: zodResolver(SignInValidation),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const InputStyle =
        'flex h-[42px] ring-1 focus-visible:ring-1 ring-primary/20 rounded-md border-none focus:outline-none focus:border-accent focus:ring-accent bg-background text-foreground placeholder:text-foreground/60 px-4 outline-none active:outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-accent'

    async function onSubmit(values: z.infer<typeof SignInValidation>) {
        // console.log(values)
        setError('')
        setSuccess('')

        startTransition(() => {
            signInWithCredentials(values, callbackUrl)
                .then((data) => {
                    if (data?.error) {
                        setError(data.error)
                    } else if (data?.success) {
                        setSuccess(data.success)
                    } else if (data?.url) {
                        window.location.assign(data?.url)
                    }

                    if (data?.twoFactor) {
                        setShowTwoFactor(true)
                    }
                })
                .catch(() => setError('Something went wrong'))
        })
    }

    return (
        <FormWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/signup"
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two Factor Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isPending}
                                                placeholder="123456"
                                                className={InputStyle}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {!showTwoFactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isPending}
                                                    placeholder="mail@example.com"
                                                    className={InputStyle}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isPending}
                                                    type="password"
                                                    className={InputStyle}
                                                    placeholder="your password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <Button
                                                size="sm"
                                                variant="link"
                                                asChild
                                                className="px-0 font-normal"
                                            >
                                                <Link href="/reset">
                                                    Forgot password?
                                                </Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        size="lg"
                        className="w-full mt-6"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending
                            ? 'Submitting...'
                            : showTwoFactor
                              ? 'Confirm'
                              : 'Sign In'}
                    </Button>
                </form>
            </Form>
        </FormWrapper>
    )
}
