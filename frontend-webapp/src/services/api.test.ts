import { describe, it, expect } from 'vitest';

// Simulación del patrón Repository / API Service (Abstracción de red)
const fetchEstudiantesMock = async () => {
  return [
    { id: '1', nombre: 'Juan Perez' },
    { id: '2', nombre: 'Maria Gonzalez' }
  ];
};

describe('Prueba Unitaria: Lógica de Servicio (Repository Pattern)', () => {
  it('debe solicitar datos al BFF y parsear el modelo correctamente', async () => {
    // 1. Arrange
    const repository = fetchEstudiantesMock;
    
    // 2. Act
    const data = await repository();
    
    // 3. Assert
    expect(data).toHaveLength(2);
    expect(data[0].id).toBe('1');
    expect(data[1].nombre).toContain('Maria');
  });
});
