
"use client";

import { useDevicePreview, deviceModes } from '@/contexts/device-preview-context';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function DevicePreviewControls() {
  const { device, setDevice } = useDevicePreview();

  return (
    <TooltipProvider>
      <div className="space-y-2">
        <p className="text-sm font-medium">Device Preview</p>
        <div className="grid grid-cols-3 gap-2 p-1 rounded-lg border bg-muted">
          {(Object.keys(deviceModes) as Array<keyof typeof deviceModes>).map((key) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <Button
                  variant={device === key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDevice(key)}
                  className={cn("w-full transition-colors", device === key && "shadow")}
                >
                  {deviceModes[key].icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{deviceModes[key].name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
