"use client"

import { useTheme } from "next-themes"
import { ToggleSwitch } from "flowbite-react"
import { useEffect, useState } from "react"

export function ModeSelect() {
    const { theme, setTheme, systemTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const currentTheme = theme === 'system' ? systemTheme : theme

    const handleChange = (checked: boolean) => {
        setTheme(checked ? "dark" : "light")
    }

    return (
        <div className="text-xs">
            <ToggleSwitch
                checked={currentTheme === "dark"}
                label="MODE"
                color="green"
                onChange={handleChange}
            />
        </div>
    )
}
