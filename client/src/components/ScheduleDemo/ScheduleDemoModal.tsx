import { Button } from '@/components/ui/button';

export function ScheduleDemoCTA() {
  const handleClick = () => {
    // Open the booking page in a new tab
    window.open('https://cal.com/seekernaren/30min', '_blank', 'noopener,noreferrer');
  };

  return (
    <Button onClick={handleClick}>
      Schedule a Demo
    </Button>
  );
}
