import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

function Slider({
    className,
    value,
    defaultValue,
    min = 0,
    max = 100,
    ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
    const values = value ?? defaultValue ?? [min]

    return (
        <SliderPrimitive.Root
            data-slot="slider"
            className={cn('relative flex w-full touch-none items-center select-none', className)}
            value={value}
            defaultValue={defaultValue}
            min={min}
            max={max}
            {...props}
        >
            <SliderPrimitive.Track
                data-slot="slider-track"
                className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted"
            >
                <SliderPrimitive.Range
                    data-slot="slider-range"
                    className="absolute h-full bg-primary"
                />
            </SliderPrimitive.Track>
            {values.map((_, index) => (
                <SliderPrimitive.Thumb
                    key={index}
                    data-slot="slider-thumb"
                    aria-label={props['aria-label']}
                    aria-valuetext={props['aria-valuetext']}
                    className="block size-4 rounded-full border border-primary bg-white shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                />
            ))}
        </SliderPrimitive.Root>
    )
}

export { Slider }
