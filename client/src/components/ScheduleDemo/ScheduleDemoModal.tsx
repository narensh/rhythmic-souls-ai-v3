import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '@/components/ui/button'; // or any styled button you use

export function ScheduleDemoCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const calUrl = 'https://cal.com/seekernaren/30min?embed=true'; // replace this

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Schedule a Demo
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Book a Demo</h2>
              <button onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            <div className="p-4">
              <script async src="https://cal.com/embed/embed.js"></script>
              <div
                class="calcom-embed"
                data-cal-username="seekernaren"
                data-cal-event="30min"
                style="width:100%; height:700px;"
              ></div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
