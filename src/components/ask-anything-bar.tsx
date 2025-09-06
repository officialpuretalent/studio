'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Mic, AudioLines, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function AskAnythingBar() {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasInput = inputValue.length > 0;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [inputValue]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-transparent">
      <div className="relative max-w-lg mx-auto">
        <div
          className={cn(
            'flex items-end gap-2 p-2 bg-background/80 backdrop-blur-sm shadow-lg border border-border transition-all duration-300',
            hasInput ? 'rounded-2xl' : 'rounded-full'
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full flex-shrink-0"
          >
            <Plus />
          </Button>
          <Textarea
            ref={textareaRef}
            placeholder="Ask anything"
            className="flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base resize-none overflow-y-hidden min-h-[2.5rem] max-h-48"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={1}
          />
          {hasInput ? (
            <Button
              size="icon"
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 flex-shrink-0"
            >
              <ArrowUp />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full flex-shrink-0"
              >
                <Mic />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-muted flex-shrink-0"
              >
                <AudioLines />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
