import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Streamdown } from 'streamdown';

/**
 * All content in this page are only for example, replace with your own feature implementation
 * When building pages, remember your instructions in Frontend Best Practices, Design Guide and Common Pitfalls
 */
export default function Home() {
  // If theme is switchable in App.tsx, we can implement theme toggling like this:
  // const { theme, toggleTheme } = useTheme();

  return (
    <div className="ea-bg flex flex-col">
      <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        {/* Example: lucide-react for icons */}
        <Loader2 className="animate-spin" />
        <p className="text-white/70">Espaço Amigo</p>
        {/* Example: Streamdown for markdown rendering */}
        <Streamdown>Any **markdown** content</Streamdown>
        <Button className="ea-button px-6 py-4">Continuar</Button>
      </main>
    </div>
  );
}
