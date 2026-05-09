import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMyGrades, getStudentsCount, getGlobalGrades } from './apiService';

const mockNotas = [
  { id: 1, estudianteId: 3, asignatura: 'Matemáticas', valorNota: 6.2 },
  { id: 2, estudianteId: 3, asignatura: 'Lenguaje',    valorNota: 5.8 },
  { id: 3, estudianteId: 4, asignatura: 'Ciencias',    valorNota: 4.8 },
];

const mockUsuarios = [
  { id: 3, nombre: 'Ana Gómez',   email: 'ana@colegio.cl' },
  { id: 4, nombre: 'Carlos Ruiz', email: 'carlos@colegio.cl' },
];

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

describe('Prueba Unitaria: Lógica de Servicio (Repository Pattern)', () => {
  it('getMyGrades debe filtrar notas por estudianteId', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNotas,
    });

    const result = await getMyGrades(3);

    expect(result).toHaveLength(2);
    expect(result.every(n => n.estudianteId === 3)).toBe(true);
  });

  it('getStudentsCount debe retornar la cantidad correcta de usuarios', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsuarios,
    });

    const result = await getStudentsCount();

    expect(result.count).toBe(2);
    expect(result.error).toBeNull();
  });

  it('getGlobalGrades debe mapear notas al formato { grade, asignatura }', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNotas,
    });

    const result = await getGlobalGrades();

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ grade: 6.2, asignatura: 'Matemáticas' });
  });
});
