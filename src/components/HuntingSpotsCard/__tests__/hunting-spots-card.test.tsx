import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HuntingSpotsCard } from '../hunting-spots-card';

describe('HuntingSpotsCard', () => {
  it('renders all vocation links', () => {
    render(
      <MemoryRouter>
        <HuntingSpotsCard />
      </MemoryRouter>,
    );
    expect(screen.getByText('Druid')).toBeInTheDocument();
    expect(screen.getByText('Knight')).toBeInTheDocument();
    expect(screen.getByText('Monk')).toBeInTheDocument();
    expect(screen.getByText('Paladin')).toBeInTheDocument();
    expect(screen.getByText('Sorcerer')).toBeInTheDocument();
  });

  it('renders vocation icons with alt text', () => {
    render(
      <MemoryRouter>
        <HuntingSpotsCard />
      </MemoryRouter>,
    );
    const druidImg = screen.getByAltText('Druid');
    expect(druidImg).toBeInTheDocument();
    expect(druidImg.tagName).toBe('IMG');
  });

  it('links to the correct hunting spots route', () => {
    render(
      <MemoryRouter>
        <HuntingSpotsCard />
      </MemoryRouter>,
    );
    const knightLink = screen.getByText('Knight').closest('a');
    expect(knightLink).toHaveAttribute('href', '/hunting-spots/knight');
  });
});
