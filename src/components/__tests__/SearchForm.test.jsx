import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from '../SearchForm'; // Adjust path as necessary
import { vi } from 'vitest';

describe('SearchForm Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnSourceTextChange = vi.fn();
  const mockOnKeyDown = vi.fn();

  const defaultProps = {
    sourceText: '',
    onSourceTextChange: mockOnSourceTextChange,
    onSubmit: mockOnSubmit,
    onKeyDown: mockOnKeyDown,
  };

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  test('renders correctly with initial props', () => {
    render(<SearchForm {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Enter Korean text to translate')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /↵/i })).toBeInTheDocument(); // The button has a paragraph with an arrow
    expect(screen.getByAltText('text-input-icon')).toBeInTheDocument(); // The link icon
  });

  test('calls onSourceTextChange when textarea value changes', () => {
    render(<SearchForm {...defaultProps} />);
    const textarea = screen.getByPlaceholderText('Enter Korean text to translate');
    
    fireEvent.change(textarea, { target: { value: 'Test input' } });
    
    expect(mockOnSourceTextChange).toHaveBeenCalledTimes(1);
    // Optionally, check the event object if its structure is important for your handler
    // expect(mockOnSourceTextChange).toHaveBeenCalledWith(expect.objectContaining({
    //   target: expect.objectContaining({ value: 'Test input' })
    // }));
  });

  test('calls onSubmit when the form is submitted', () => {
    render(<SearchForm {...defaultProps} sourceText="Some text to submit" />);
    const form = screen.getByRole('form'); // Assuming the form has an implicit role or you can add aria-label
    
    fireEvent.submit(form);
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
  
  test('calls onKeyDown when a key is pressed in the textarea', () => {
    render(<SearchForm {...defaultProps} />);
    const textarea = screen.getByPlaceholderText('Enter Korean text to translate');
    
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', keyCode: 13 });
    
    expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
  });

  test('displays the provided sourceText in the textarea', () => {
    render(<SearchForm {...defaultProps} sourceText="Initial text" />);
    const textarea = screen.getByPlaceholderText('Enter Korean text to translate');
    expect(textarea.value).toBe('Initial text');
  });
});
