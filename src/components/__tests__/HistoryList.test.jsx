import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryList from '../HistoryList'; // Adjust path as necessary
import { vi } from 'vitest';

describe('HistoryList Component', () => {
  const mockOnArticleClick = vi.fn();
  const mockOnCopyText = vi.fn();

  const articles = [
    { sourceText: 'Test text 1', summary: 'Summary 1' },
    { sourceText: 'Test text 2', summary: 'Summary 2' },
  ];

  const defaultProps = {
    articles: articles,
    onArticleClick: mockOnArticleClick,
    onCopyText: mockOnCopyText,
    copiedText: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders a list of history items correctly', () => {
    render(<HistoryList {...defaultProps} />);
    
    expect(screen.getByText('Test text 1')).toBeInTheDocument();
    expect(screen.getByText('Test text 2')).toBeInTheDocument();
    
    const copyButtons = screen.getAllByTitle('Copy Text'); // Default title for copy button
    expect(copyButtons.length).toBe(2);
  });

  test('calls onArticleClick when an article item is clicked', () => {
    render(<HistoryList {...defaultProps} />);
    const firstArticleItem = screen.getByText('Test text 1').closest('.link_card'); // Find the clickable parent
    
    if (firstArticleItem) {
      fireEvent.click(firstArticleItem);
      expect(mockOnArticleClick).toHaveBeenCalledTimes(1);
      expect(mockOnArticleClick).toHaveBeenCalledWith(articles[0]);
    } else {
      throw new Error("Could not find the article item to click.");
    }
  });

  test('calls onCopyText when a copy button is clicked and stops propagation', () => {
    render(<HistoryList {...defaultProps} />);
    const copyButtons = screen.getAllByTitle('Copy Text');
    
    fireEvent.click(copyButtons[0]); // Click the first copy button
    
    expect(mockOnCopyText).toHaveBeenCalledTimes(1);
    expect(mockOnCopyText).toHaveBeenCalledWith(articles[0].sourceText);
    // Also ensure onArticleClick was NOT called because of e.stopPropagation()
    expect(mockOnArticleClick).not.toHaveBeenCalled();
  });

  test('displays copy feedback correctly when copiedText matches an item sourceText', () => {
    render(<HistoryList {...defaultProps} copiedText={articles[0].sourceText} />);
    
    const firstItemCopyButton = screen.getByText(articles[0].sourceText).previousSibling; // The div containing the copy button
    expect(firstItemCopyButton).toHaveClass('bg-green-200');
    expect(firstItemCopyButton).toHaveAttribute('title', 'Copied!');

    const secondItemCopyButton = screen.getByText(articles[1].sourceText).previousSibling;
    expect(secondItemCopyButton).not.toHaveClass('bg-green-200');
    expect(secondItemCopyButton).toHaveAttribute('title', 'Copy Text');
  });

  test('renders an empty state or message when articles array is empty', () => {
    const { container } = render(<HistoryList {...defaultProps} articles={[]} />);
    // Assuming it renders an empty div or nothing, not a specific message
    // You might want to add a "No history yet." message in the component for better UX
    expect(screen.queryByText('Test text 1')).not.toBeInTheDocument();
    // Check if the main container div is empty or has no 'link_card' children
    const linkCards = container.querySelectorAll('.link_card');
    expect(linkCards.length).toBe(0);
  });
});
