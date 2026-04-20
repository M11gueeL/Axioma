import { useState, useEffect } from 'react';

export const useTheme = () => {
  // Inicializa leyendo el localStorage o usando 'light' por defecto
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;

    // Añade o quita la clase 'dark' en la etiqueta <html> según el estado
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Guarda la preferencia en el navegador
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Función que tu botón llamará para alternar el estado
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};