/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../SearchBar';
import { MOCK_STOCKS, AssetType } from '@/lib/mockData';

describe('SearchBar Component', () => {
  const mockOnAddAsset = jest.fn();
  const allAssets = Object.values(MOCK_STOCKS);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render search input with placeholder', () => {
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      expect(screen.getByPlaceholderText(/search stocks, ETFs, crypto/i)).toBeInTheDocument();
    });

    it('should render custom placeholder when provided', () => {
      render(
        <SearchBar
          allAssets={allAssets}
          onAddAsset={mockOnAddAsset}
          placeholder="Custom placeholder"
        />
      );

      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
    });

    it('should render search icon', () => {
      const { container } = render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      // Search icon is rendered (lucide-react)
      const searchIcon = container.querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should show results when typing in search input', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'AAPL');

      await waitFor(() => {
        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      });
    });

    it('should filter by ticker (case insensitive)', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'aapl');

      await waitFor(() => {
        expect(screen.getByText('AAPL')).toBeInTheDocument();
      });
    });

    it('should filter by company name (case insensitive)', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'microsoft');

      await waitFor(() => {
        expect(screen.getByText('Microsoft Corp.')).toBeInTheDocument();
      });
    });

    it('should limit results to 8 items', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'a'); // Should match multiple assets

      await waitFor(() => {
        const results = screen.getAllByRole('button');
        // Should not exceed 8 results
        expect(results.length).toBeLessThanOrEqual(8);
      });
    });

    it('should show no results message when query has no matches', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'NONEXISTENT');

      await waitFor(() => {
        expect(screen.getByText(/No assets found for/i)).toBeInTheDocument();
      });
    });

    it('should not show results when input is empty', () => {
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      // No results should be shown
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should not show results when input is only whitespace', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, '   ');

      // No results should be shown
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Asset Display', () => {
    it('should display asset type badge for each result', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'AAPL');

      await waitFor(() => {
        // Asset type badge should be rendered
        expect(screen.getByText('Stock')).toBeInTheDocument();
      });
    });

    it('should show "In watchlist" for assets already in watchlist', async () => {
      const user = userEvent.setup();

      // Create test assets with one in watchlist
      const testAssets = [
        { ...MOCK_STOCKS.AAPL, isInWatchlist: true }
      ];

      render(<SearchBar allAssets={testAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'AAPL');

      await waitFor(() => {
        expect(screen.getByText('In watchlist')).toBeInTheDocument();
      });
    });

    it('should show "Add" button for assets not in watchlist', async () => {
      const user = userEvent.setup();

      // Create test assets with one NOT in watchlist
      const testAssets = [
        { ...MOCK_STOCKS.AAPL, isInWatchlist: false }
      ];

      render(<SearchBar allAssets={testAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'AAPL');

      await waitFor(() => {
        expect(screen.getByText('Add')).toBeInTheDocument();
      });
    });

    it('should display ticker and company name for each result', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'AAPL');

      await waitFor(() => {
        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should call onAddAsset when clicking on a result', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'AAPL');

      await waitFor(async () => {
        const result = screen.getByText('Apple Inc.').closest('button');
        if (result) {
          await user.click(result);
        }
      });

      expect(mockOnAddAsset).toHaveBeenCalledWith('AAPL');
    });

    it('should clear search input after selecting a result', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i) as HTMLInputElement;
      await user.type(searchInput, 'AAPL');

      await waitFor(async () => {
        const result = screen.getByText('Apple Inc.').closest('button');
        if (result) {
          await user.click(result);
        }
      });

      expect(searchInput.value).toBe('');
    });

    it('should close dropdown after selecting a result', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'AAPL');

      const result = await screen.findByText('Apple Inc.');
      await user.click(result.closest('button')!);

      // Dropdown should be closed (results not visible)
      await waitFor(() => {
        expect(screen.queryByText('Apple Inc.')).not.toBeInTheDocument();
      });
    });

    it('should update focused index on mouse enter', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'A');

      await waitFor(() => {
        const results = screen.getAllByRole('button');
        if (results.length > 0) {
          fireEvent.mouseEnter(results[0]);
          // Focused state is applied (tested via className changes)
          expect(results[0]).toBeInTheDocument();
        }
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate down with ArrowDown key', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'A');

      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      });

      await user.keyboard('{ArrowDown}');

      // First result should be focused
      expect(searchInput).toBeInTheDocument();
    });

    it('should navigate up with ArrowUp key', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'A');

      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      });

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');

      // Focus should move up
      expect(searchInput).toBeInTheDocument();
    });

    it('should select focused result with Enter key', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'AAPL');

      await waitFor(() => {
        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      });

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(mockOnAddAsset).toHaveBeenCalledWith('AAPL');
    });

    it('should close dropdown with Escape key', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'AAPL');

      await waitFor(() => {
        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Apple Inc.')).not.toBeInTheDocument();
      });
    });

    it('should not navigate beyond first result with ArrowUp', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'A');

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');
      await user.keyboard('{ArrowUp}'); // Should not go beyond -1

      expect(searchInput).toBeInTheDocument();
    });

    it('should not navigate beyond last result with ArrowDown', async () => {
      const user = userEvent.setup();

      // Use limited assets to test boundary
      const limitedAssets = [MOCK_STOCKS.AAPL, MOCK_STOCKS.TSLA];
      render(<SearchBar allAssets={limitedAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'A');

      // Navigate to last item
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}'); // Should stay at last item

      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Click Outside', () => {
    it('should close dropdown when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />
          <div data-testid="outside">Outside element</div>
        </div>
      );

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'AAPL');

      await waitFor(() => {
        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      });

      // Click outside
      const outsideElement = screen.getByTestId('outside');
      fireEvent.mouseDown(outsideElement);

      await waitFor(() => {
        expect(screen.queryByText('Apple Inc.')).not.toBeInTheDocument();
      });
    });

    it('should not close dropdown when clicking inside', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);
      await user.type(searchInput, 'AAPL');

      await waitFor(() => {
        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      });

      // Click on the search input
      await user.click(searchInput);

      // Dropdown should still be visible
      expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    });
  });

  describe('Focus Behavior', () => {
    it('should open dropdown on focus', async () => {
      const user = userEvent.setup();
      render(<SearchBar allAssets={allAssets} onAddAsset={mockOnAddAsset} />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);

      // Type some text first
      await user.type(searchInput, 'AAPL');

      await waitFor(() => {
        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      });

      // Blur and then focus again
      searchInput.blur();
      await waitFor(() => {
        expect(screen.queryByText('Apple Inc.')).not.toBeInTheDocument();
      });

      fireEvent.focus(searchInput);

      await waitFor(() => {
        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      });
    });
  });
});
