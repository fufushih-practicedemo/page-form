'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signUp } from '@/actions/auth';
import { signUpSchema } from "@/utils/definitions";

const SignUpForm = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      confirmPassword: '',
      name: '',
      email: '',
      password: ''
    },
  })

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    const res = await signUp(values);
    if (res.success) {
      toast.success('Account created successfully')
      router.push('/')
    } else {
      toast.error(res.error)
    }
  }

  return (
    <Form {...form}>
      <form className='flex flex-col justify-between h-full' onSubmit={form.handleSubmit(onSubmit)}>
        <section className='flex flex-col gap-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Enter your email...'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter your name...'
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
                    type='password'
                    placeholder="Enter your password..."
                    {...field}
                    onChange={(e) => {
                      e.target.value = e.target.value.trim();
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder="Please confirm your password"
                    {...field}
                    onChange={(e) => {
                      e.target.value = e.target.value.trim();
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        
        <div className='flex flex-col gap-2 w-full'>
          <Button type='submit'>
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SignUpForm
