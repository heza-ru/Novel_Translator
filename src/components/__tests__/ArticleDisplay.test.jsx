import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ArticleDisplay from '../ArticleDisplay'; // Adjust path as necessary
import { vi } from 'vitest';

describe('ArticleDisplay Component', () => {
  const mockOnRetry = vi.fn();

  const defaultProps = {
    isFetching: false,
    error: null,
    articleSummary: '',
    onRetry: mockOnRetry,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state correctly', () => {
    render(<ArticleDisplay {...defaultProps} isFetching={true} />);
    expect(screen.getByAltText('loader')).toBeInTheDocument();
  });

  test('renders error message and retry button when error is provided', () => {
    const mockError = { 
      status: 500, 
      data: { error: 'Server Error Occurred' } 
    };
    render(<ArticleDisplay {...defaultProps} error={mockError} />);
    
    expect(screen.getByText(/Well, that wasn't supposed to happen.../i)).toBeInTheDocument();
    expect(screen.getByText('Server Error Occurred')).toBeInTheDocument(); // Specific error message
    
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  test('renders specific error message for status 404', () => {
    const mockError = { status: 404 };
    render(<ArticleDisplay {...defaultProps} error={mockError} />);
    expect(screen.getByText(/Not Found \(404\)/i)).toBeInTheDocument();
  });
  
  test('renders generic error message when error object is minimal', () => {
    const mockError = { message: "Minimal error" }; // No status, no data.error
    render(<ArticleDisplay {...defaultProps} error={mockError} />);
    // The component logic has a default "An unexpected error occurred..." but also tries error.message
    // Based on current ArticleDisplay, it might show "Minimal error" or a generic one.
    // Let's check the current ArticleDisplay logic:
    // if (error.data?.error) {errorMessage = error.data.error;}
    // else if (error.status) {...}
    // else if (typeof error.error === 'string' && error.error.includes("NetworkError")) {...}
    // The default `errorMessage` is "An unexpected error occurred..."
    // A simple { message: "Minimal error" } object won't hit any of the specific conditions.
    // So it will fall back to the default errorMessage.
    expect(screen.getByText(/An unexpected error occurred. Please try again./i)).toBeInTheDocument();
  });


  test('renders summary correctly when articleSummary is provided', () => {
    const summaryText = 'This is a test summary.';
    render(<ArticleDisplay {...defaultProps} articleSummary={summaryText} />);
    
    expect(screen.getByText(/Excerpt Translation/i)).toBeInTheDocument(); // Title
    expect(screen.getByText(summaryText)).toBeInTheDocument();
  });

  test('renders nothing when no props indicate a specific state (e.g., initial load without action)', () => {
    const { container } = render(<ArticleDisplay {...defaultProps} />);
    // Expect the component to render null or an empty fragment
    expect(container.firstChild).toBeNull(); 
  });

  test('does not render retry button if onRetry is not provided', () => {
    const mockError = { data: { error: 'Some error' } };
    render(<ArticleDisplay {...defaultProps} error={mockError} onRetry={undefined} />);
    
    expect(screen.getByText('Some error')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Retry/i })).not.toBeInTheDocument();
  });
});
