import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '../Hero'; // Adjust path as necessary
import { vi } from 'vitest';

// Mock assets used in Hero
vi.mock('../../assets', () => ({
  logo: 'logo.svg',
  github: 'github.svg',
}));

describe('Hero Component', () => {
  beforeEach(() => {
    // Re-render before each test if needed, or render once if state doesn't change
    // For Hero, rendering once is likely fine if it's purely presentational and props don't change
  });

  test('renders the logo', () => {
    render(<Hero />);
    const logoImg = screen.getByAltText('sumz_logo');
    expect(logoImg).toBeInTheDocument();
    expect(logoImg.src).toContain('logo.svg');
  });

  test('renders the main headline', () => {
    render(<Hero />);
    expect(screen.getByText(/Translate Web-Novels with/i)).toBeInTheDocument();
    expect(screen.getByText(/OpenAI GPT-4/i)).toBeInTheDocument();
  });

  test('renders the description', () => {
    render(<Hero />);
    expect(screen.getByText(/Simplify your Korean web novel journey with Iyagiko/i)).toBeInTheDocument();
  });

  test('renders the "View on GitHub" button', () => {
    render(<Hero />);
    const githubButton = screen.getByRole('button', { name: /View on GitHub/i });
    expect(githubButton).toBeInTheDocument();
    const githubIcon = screen.getByAltText('GitHub Icon');
    expect(githubIcon).toBeInTheDocument();
    expect(githubIcon.src).toContain('github.svg');
  });

  test('"View on GitHub" button opens the correct URL in a new tab', () => {
    render(<Hero />);
    const fakeOpen = vi.fn();
    
    // Ensure window object exists for the test environment
    global.window = Object.create(window);
    Object.defineProperty(window, 'open', {
      value: fakeOpen,
      writable: true,
    });

    const githubButton = screen.getByRole('button', { name: /View on GitHub/i });
    githubButton.click();

    expect(fakeOpen).toHaveBeenCalledWith('https://github.com/heza-ru/Novel_Translator', '_blank');
    
    // Clean up the mock
    // @ts-ignore
    delete window.open; // Or restore original window.open if necessary
  });
});
