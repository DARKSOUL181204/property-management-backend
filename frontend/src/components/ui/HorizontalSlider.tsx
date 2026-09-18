import { useRef } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function HorizontalSlider({ children, title, actionText, onAction }: any) {
  const scrollRef = useRef(null);

  const scroll = (direction: any) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      (scrollRef.current as any).scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12 relative">
      <div className="flex justify-between items-end mb-4 px-1">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
          <div className="w-12 h-1.5 bg-blue-600 mt-2 rounded-full"></div>
        </div>
        {actionText && <button onClick={onAction} className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline flex items-center transition-colors">{actionText} <ArrowRight size={16} className="ml-1"/></button>}
      </div>
      
      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:block text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} />
        </button>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 pt-2 -mx-4 px-4 md:mx-0 md:px-0">
          {children}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
