export default function Badge({ children, variant = 'primary' }: any) {
  const variants = {
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant as keyof typeof variants]}`}>
      {children}
    </span>
  );
}
