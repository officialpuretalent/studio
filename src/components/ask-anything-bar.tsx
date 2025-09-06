import { Plus, Mic, AudioLines } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AskAnythingBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-transparent">
        <div className="relative max-w-lg mx-auto">
            <div className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-lg border border-border">
                <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                    <Plus />
                </Button>
                <Input
                    placeholder="Ask anything"
                    className="flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                />
                <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                    <Mic />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full bg-muted flex-shrink-0">
                    <AudioLines />
                </Button>
            </div>
        </div>
    </div>
  );
}
