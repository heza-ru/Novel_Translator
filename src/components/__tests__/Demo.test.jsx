import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Demo from '../Demo'; // Adjust path as necessary
import { articleApi } from '../../services/article'; // To setup the store
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// Mock the entire services/article module
vi.mock('../../services/article', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useLazyGetSummaryQuery: vi.fn(),
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });


describe('Demo Component Integration Tests', () => {
  let mockGetSummary;
  let store;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear(); // Clear localStorage before each test

    // Reset the mock implementation for useLazyGetSummaryQuery
    mockGetSummary = vi.fn();
    require('../../services/article').useLazyGetSummaryQuery.mockReturnValue([
      mockGetSummary,
      { error: null, isFetching: false }
    ]);
    
    // Configure a fresh store for each test
    store = configureStore({
      reducer: {
        [articleApi.reducerPath]: articleApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(articleApi.middleware),
    });
  });

  test('successful flow: type text, submit, see summary and history item', async () => {
    const user = userEvent.setup();
    mockGetSummary.mockResolvedValueOnce({ 
      data: { responseData: { translatedText: 'Test Summary' } } 
    });

    render(
      <Provider store={store}>
        <Demo />
      </Provider>
    );

    const textarea = screen.getByPlaceholderText('Enter Korean text to translate');
    await user.type(textarea, 'Test input text');
    expect(textarea.value).toBe('Test input text');

    const submitButton = screen.getByRole('button', { name: /↵/i });
    await user.click(submitButton);

    expect(mockGetSummary).toHaveBeenCalledWith({ sourceText: 'Test input text' });

    await waitFor(() => {
      expect(screen.getByText('Excerpt Translation')).toBeInTheDocument(); // Title of summary
      expect(screen.getByText('Test Summary')).toBeInTheDocument();
    });

    // Check history list
    await waitFor(() => {
      expect(screen.getByText('Test input text')).toBeInTheDocument(); // History item text
    });
    
    // Check localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'articles',
      JSON.stringify([{ sourceText: 'Test input text', summary: 'Test Summary' }])
    );
  });

  test('error flow: submit text, see error message and retry button', async () => {
    const user = userEvent.setup();
    const mockError = { status: 500, data: { error: 'Server Failed' } };
    // Update mock to return error state for the error test
     require('../../services/article').useLazyGetSummaryQuery.mockReturnValue([
      mockGetSummary,
      { error: mockError, isFetching: false }
    ]);
    mockGetSummary.mockResolvedValueOnce({ error: mockError }); // Simulate an error response from the query

    render(
      <Provider store={store}>
        <Demo />
      </Provider>
    );

    const textarea = screen.getByPlaceholderText('Enter Korean text to translate');
    await user.type(textarea, 'Another test input');
    
    const submitButton = screen.getByRole('button', { name: /↵/i });
    await user.click(submitButton);

    expect(mockGetSummary).toHaveBeenCalledWith({ sourceText: 'Another test input' });
    
    await waitFor(() => {
      expect(screen.getByText(/Well, that wasn't supposed to happen.../i)).toBeInTheDocument();
      expect(screen.getByText('Server Failed')).toBeInTheDocument(); // Specific error
      expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
    });
  });

  test('clicking a history item populates the form and summary display', async () => {
    const initialArticles = [
      { sourceText: 'Old text', summary: 'Old summary' },
      { sourceText: 'Older text', summary: 'Older summary' },
    ];
    localStorageMock.setItem('articles', JSON.stringify(initialArticles));
    
    // Re-render with initial articles loaded into the component's state via useEffect
    render(
      <Provider store={store}>
        <Demo />
      </Provider>
    );

    // Wait for history items to be visible
    await waitFor(() => {
      expect(screen.getByText('Old text')).toBeInTheDocument();
    });

    // Click on the first history item
    const historyItem = screen.getByText('Old text').closest('.link_card');
    if(!historyItem) throw new Error("History item not found");
    await userEvent.click(historyItem);

    // Verify form is populated
    const textarea = screen.getByPlaceholderText('Enter Korean text to translate');
    expect(textarea.value).toBe('Old text');

    // Verify summary is displayed
    await waitFor(() => {
      expect(screen.getByText('Excerpt Translation')).toBeInTheDocument();
      expect(screen.getByText('Old summary')).toBeInTheDocument();
    });
  });
  
  test('copying text from history works', async () => {
    const user = userEvent.setup();
    const initialArticles = [{ sourceText: 'Text to copy', summary: 'Summary of copy' }];
    localStorageMock.setItem('articles', JSON.stringify(initialArticles));

    // Mock navigator.clipboard.writeText
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
    });

    render(
      <Provider store={store}>
        <Demo />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Text to copy')).toBeInTheDocument();
    });

    const copyButton = screen.getByTitle('Copy Text'); // Assuming default title
    await user.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Text to copy');
    
    // Check for visual feedback (changed title and background)
    await waitFor(() => {
      expect(screen.getByTitle('Copied!')).toBeInTheDocument();
    });
    
    // Clean up clipboard mock
    // @ts-ignore
    delete navigator.clipboard;
  });

});
