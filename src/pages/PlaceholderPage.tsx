import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="p-4 rounded-full bg-muted mb-4">
        <Construction size={32} className="text-muted-foreground" />
      </div>
      <h1 className="text-xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground text-sm max-w-md">{description}</p>
      <p className="text-xs text-muted-foreground mt-4">功能开发中，敬请期待...</p>
    </div>
  );
}
