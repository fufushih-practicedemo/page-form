'use client';

import { useTheme } from 'next-themes';
import React, { useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';

const ThemeSwitcher = () => {
  const {theme, setTheme} = useTheme();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <Tabs defaultValue={theme}>
        <TabsList className='border'>
            <TabsTrigger value='light' onClick={() => setTheme('light')}>
                <SunIcon className='h-[1.2rem] w-[1.2rem]' />
            </TabsTrigger>
            <TabsTrigger value='light' onClick={() => setTheme('dark')}>
                <MoonIcon className='h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:rotate-0' />
            </TabsTrigger>
            <TabsTrigger value='light' onClick={() => setTheme('system')}>
                <DesktopIcon className='h-[1.2rem] w-[1.2rem]' />
            </TabsTrigger>
        </TabsList>
    </Tabs>
  )
}

export default ThemeSwitcher