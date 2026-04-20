import { useTheme } from '../hooks/useTheme';

export const HelloWorld = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
        Hello World!
      </h2>
      
      <div className="flex flex-col items-center mt-8 p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50 outline outline-1 outline-gray-200 dark:outline-gray-600">
        <p className="mb-4 text-sm font-medium">
          Modo actual: <span className="uppercase tracking-wider font-bold text-blue-500">{theme}</span>
        </p>
        <button
          onClick={toggleTheme}
          className="px-6 py-2.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          Alternar Tema
        </button>
      </div>
    </div>
  );
};
