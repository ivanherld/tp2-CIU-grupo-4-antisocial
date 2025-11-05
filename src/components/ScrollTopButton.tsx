import { ArrowUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface ScrollToTopButtonProps {
  estilos?: React.CSSProperties;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ estilos }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button onClick={scrollToTop} style={
      estilos ? estilos : {color: 'red'}}>
      <ArrowUp size={20} />
    </button>
  );
};