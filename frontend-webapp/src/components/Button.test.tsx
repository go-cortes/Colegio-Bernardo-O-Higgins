import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Prueba Unitaria: Interfaz de Componentes (Component-Based Pattern)', () => {
  it('debe renderizar un componente de botón y permitir su identificación visual en el DOM', () => {
    // 1. Arrange (Preparación)
    render(<button data-testid="test-btn" className="bg-blue-500">Ingresar al Aula</button>);
    
    // 2. Act (Ejecución)
    const btn = screen.getByTestId('test-btn');
    
    // 3. Assert (Verificación)
    expect(btn).toBeDefined();
    expect(btn.textContent).toBe('Ingresar al Aula');
    expect(btn.className).toContain('bg-blue');
  });
});
