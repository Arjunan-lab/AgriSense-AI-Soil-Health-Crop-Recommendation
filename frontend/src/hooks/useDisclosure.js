/**
 * hooks/useDisclosure.js
 * ----------------------
 * Manages boolean open/close state for modals, drawers, dialogs, and dropdowns.
 */
import { useState, useCallback } from 'react';

const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = useState(initial);

  const open  = useCallback(() => setIsOpen(true),  []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle };
};

export default useDisclosure;
