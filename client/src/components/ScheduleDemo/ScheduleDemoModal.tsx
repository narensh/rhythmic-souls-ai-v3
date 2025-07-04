import { Button } from '@/components/ui/button';

export function ScheduleDemoCTA() {
  const handleClick = () => {
    // Open the booking page in a new tab
    window.open('https://cal.com/contact-rsai/inception', '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
    size="lg"
    variant="secondary"
    className="flex-1 sm:flex-none px-6 py-3 font-semibold transition-colors text-center bg-white text-purple-600 border-2 border-white hover:bg-purple-50 hover:border-purple-200"
    onClick={handleClick}>
      Schedule a Demo
    </Button>
  );
}
