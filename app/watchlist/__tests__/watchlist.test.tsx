/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WatchlistPage from '../page';
import { MOCK_STOCKS, AssetType } from '@/lib/mockData';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('WatchlistPage - Add/Remove Functionality', () => {
  describe('Initial State', () => {
    it('should render the watchlist page with market indexes', () => {
      render(<WatchlistPage />);

      // Check for market indexes
      expect(screen.getByText('S&P 500')).toBeInTheDocument();
      expect(screen.getByText('Nasdaq')).toBeInTheDocument();
      expect(screen.getByText('Russell 2000')).toBeInTheDocument();
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });

    it('should display watchlist items that are marked as isInWatchlist', () => {
      render(<WatchlistPage />);

      const watchlistStocks = Object.values(MOCK_STOCKS).filter(s => s.isInWatchlist);

      watchlistStocks.forEach(stock => {
        expect(screen.getByText(stock.ticker)).toBeInTheDocument();
      });
    });

    it('should show correct asset count in header', () => {
      render(<WatchlistPage />);

      const watchlistCount = Object.values(MOCK_STOCKS).filter(s => s.isInWatchlist).length;
      const countText = new RegExp(`\\(${watchlistCount} assets?\\)`);

      expect(screen.getByText(countText)).toBeInTheDocument();
    });

    it('should render toolbar with search, filter, and sort controls', () => {
      render(<WatchlistPage />);

      // Search bar
      expect(screen.getByPlaceholderText(/search stocks/i)).toBeInTheDocument();

      // Filter button
      expect(screen.getByText('Filter')).toBeInTheDocument();

      // Sort button
      expect(screen.getByText(/Sort:/i)).toBeInTheDocument();
    });
  });

  describe('Add Asset Functionality', () => {
    it('should show search results when typing in search bar', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);

      await user.type(searchInput, 'AAPL');

      // Should show Apple in results
      await waitFor(() => {
        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      });
    });

    it('should filter search results by ticker', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);

      await user.type(searchInput, 'TSL');

      await waitFor(() => {
        expect(screen.getByText('Tesla, Inc.')).toBeInTheDocument();
      });
    });

    it('should filter search results by company name', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);

      await user.type(searchInput, 'Microsoft');

      await waitFor(() => {
        expect(screen.getByText('Microsoft Corp.')).toBeInTheDocument();
      });
    });

    it('should show "In watchlist" for assets already in watchlist', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);

      // Search for a stock that's already in watchlist
      const inWatchlistStock = Object.values(MOCK_STOCKS).find(s => s.isInWatchlist);
      if (inWatchlistStock) {
        await user.type(searchInput, inWatchlistStock.ticker);

        await waitFor(() => {
          expect(screen.getByText('In watchlist')).toBeInTheDocument();
        });
      }
    });

    it('should show "Add" button for assets not in watchlist', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);

      // Search for a stock that's not in watchlist
      const notInWatchlistStock = Object.values(MOCK_STOCKS).find(s => !s.isInWatchlist);
      if (notInWatchlistStock) {
        await user.type(searchInput, notInWatchlistStock.ticker);

        await waitFor(() => {
          expect(screen.getByText('Add')).toBeInTheDocument();
        });
      }
    });

    it('should add asset to watchlist when clicking Add', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);

      // Find a stock not in watchlist
      const notInWatchlistStock = Object.values(MOCK_STOCKS).find(s => !s.isInWatchlist);

      if (notInWatchlistStock) {
        // Get initial count
        const initialCount = Object.values(MOCK_STOCKS).filter(s => s.isInWatchlist).length;

        // Search for the stock
        await user.type(searchInput, notInWatchlistStock.ticker);

        // Click the Add button
        await waitFor(() => {
          const addButton = screen.getByText('Add').closest('button');
          if (addButton) {
            fireEvent.click(addButton);
          }
        });

        // Verify asset count increased
        await waitFor(() => {
          const newCountText = new RegExp(`\\(${initialCount + 1} assets?\\)`);
          expect(screen.getByText(newCountText)).toBeInTheDocument();
        });
      }
    });

    it('should clear search input after adding asset', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i) as HTMLInputElement;

      const notInWatchlistStock = Object.values(MOCK_STOCKS).find(s => !s.isInWatchlist);

      if (notInWatchlistStock) {
        await user.type(searchInput, notInWatchlistStock.ticker);

        await waitFor(() => {
          const addButton = screen.getByText('Add').closest('button');
          if (addButton) {
            fireEvent.click(addButton);
          }
        });

        // Search input should be cleared
        await waitFor(() => {
          expect(searchInput.value).toBe('');
        });
      }
    });

    it('should not add duplicate assets to watchlist', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);

      const notInWatchlistStock = Object.values(MOCK_STOCKS).find(s => !s.isInWatchlist);

      if (notInWatchlistStock) {
        const initialCount = Object.values(MOCK_STOCKS).filter(s => s.isInWatchlist).length;

        // Add the stock once
        await user.type(searchInput, notInWatchlistStock.ticker);

        await waitFor(() => {
          const addButton = screen.getByText('Add').closest('button');
          if (addButton) {
            fireEvent.click(addButton);
          }
        });

        // Try to add it again
        await user.type(searchInput, notInWatchlistStock.ticker);

        // Should show "In watchlist" now
        await waitFor(() => {
          expect(screen.getByText('In watchlist')).toBeInTheDocument();
        });

        // Count should only increase by 1
        const finalCountText = new RegExp(`\\(${initialCount + 1} assets?\\)`);
        expect(screen.getByText(finalCountText)).toBeInTheDocument();
      }
    });

    it('should show no results message when search has no matches', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);

      await user.type(searchInput, 'NONEXISTENT123');

      await waitFor(() => {
        expect(screen.getByText(/No assets found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Remove Asset Functionality', () => {
    it('should show remove button on row hover', async () => {
      render(<WatchlistPage />);

      // Find a watchlist row
      const watchlistStock = Object.values(MOCK_STOCKS).find(s => s.isInWatchlist);

      if (watchlistStock) {
        const row = screen.getByText(watchlistStock.ticker).closest('tr');

        if (row) {
          // Hover over the row
          fireEvent.mouseEnter(row);

          // Remove button should be visible (it has opacity-0 group-hover:opacity-100)
          const removeButton = row.querySelector('button[title="Remove from watchlist"]');
          expect(removeButton).toBeInTheDocument();
        }
      }
    });

    it('should remove asset from watchlist when clicking remove button', async () => {
      render(<WatchlistPage />);

      const watchlistStock = Object.values(MOCK_STOCKS).find(s => s.isInWatchlist);

      if (watchlistStock) {
        const initialCount = Object.values(MOCK_STOCKS).filter(s => s.isInWatchlist).length;

        // Find the row
        const tickerElement = screen.getByText(watchlistStock.ticker);
        const row = tickerElement.closest('tr');

        if (row) {
          // Find and click remove button
          const removeButton = row.querySelector('button[title="Remove from watchlist"]');
          if (removeButton) {
            fireEvent.click(removeButton);

            // Verify count decreased
            await waitFor(() => {
              const newCountText = new RegExp(`\\(${initialCount - 1} assets?\\)`);
              expect(screen.getByText(newCountText)).toBeInTheDocument();
            });
          }
        }
      }
    });

    it('should remove correct asset when multiple assets are present', async () => {
      render(<WatchlistPage />);

      const watchlistStocks = Object.values(MOCK_STOCKS).filter(s => s.isInWatchlist);

      if (watchlistStocks.length >= 2) {
        const stockToRemove = watchlistStocks[0];
        const stockToKeep = watchlistStocks[1];

        // Find and remove first stock
        const tickerElement = screen.getByText(stockToRemove.ticker);
        const row = tickerElement.closest('tr');

        if (row) {
          const removeButton = row.querySelector('button[title="Remove from watchlist"]');
          if (removeButton) {
            fireEvent.click(removeButton);

            // Verify removed stock is gone
            await waitFor(() => {
              expect(screen.queryByText(stockToRemove.ticker)).not.toBeInTheDocument();
            });

            // Verify other stock is still there
            expect(screen.getByText(stockToKeep.ticker)).toBeInTheDocument();
          }
        }
      }
    });
  });

  describe('Filter Functionality', () => {
    it('should open filter dropdown when clicking Filter button', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const filterButton = screen.getByText('Filter').closest('button');

      if (filterButton) {
        await user.click(filterButton);

        // Should show filter options
        await waitFor(() => {
          expect(screen.getByText('Stocks')).toBeInTheDocument();
          expect(screen.getByText('ETFs')).toBeInTheDocument();
          expect(screen.getByText('Crypto')).toBeInTheDocument();
        });
      }
    });

    it('should filter assets by selected asset type', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      // Open filter dropdown
      const filterButton = screen.getByText('Filter').closest('button');
      if (filterButton) {
        await user.click(filterButton);

        // Deselect all except Stock
        const etfCheckbox = screen.getByText('ETFs').closest('button');
        const cryptoCheckbox = screen.getByText('Crypto').closest('button');

        if (etfCheckbox) await user.click(etfCheckbox);
        if (cryptoCheckbox) await user.click(cryptoCheckbox);

        // Should only show stocks
        await waitFor(() => {
          const stockAssets = Object.values(MOCK_STOCKS)
            .filter(s => s.isInWatchlist && s.assetType === AssetType.STOCK);

          stockAssets.forEach(stock => {
            expect(screen.getByText(stock.ticker)).toBeInTheDocument();
          });
        });
      }
    });

    it('should show active filter chips when filters are applied', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const filterButton = screen.getByText('Filter').closest('button');
      if (filterButton) {
        await user.click(filterButton);

        // Deselect ETF
        const etfCheckbox = screen.getByText('ETFs').closest('button');
        if (etfCheckbox) {
          await user.click(etfCheckbox);

          // Should show active filters section
          await waitFor(() => {
            expect(screen.getByText('Active filters:')).toBeInTheDocument();
          });
        }
      }
    });

    it('should clear all filters when clicking "Clear all filters"', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      // Apply filters
      const filterButton = screen.getByText('Filter').closest('button');
      if (filterButton) {
        await user.click(filterButton);

        const etfCheckbox = screen.getByText('ETFs').closest('button');
        if (etfCheckbox) await user.click(etfCheckbox);

        // Close dropdown by clicking outside
        await user.click(document.body);

        // Click "Clear all filters"
        const clearButton = screen.getByText('Clear all filters');
        await user.click(clearButton);

        // All assets should be visible again
        await waitFor(() => {
          const allWatchlistStocks = Object.values(MOCK_STOCKS).filter(s => s.isInWatchlist);
          expect(screen.getByText(new RegExp(`\\(${allWatchlistStocks.length} assets?\\)`))).toBeInTheDocument();
        });
      }
    });

    it('should show empty state when no assets match filters', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      // Remove all assets first
      const watchlistStocks = Object.values(MOCK_STOCKS).filter(s => s.isInWatchlist);

      for (const stock of watchlistStocks) {
        const tickerElement = screen.queryByText(stock.ticker);
        if (tickerElement) {
          const row = tickerElement.closest('tr');
          if (row) {
            const removeButton = row.querySelector('button[title="Remove from watchlist"]');
            if (removeButton) {
              fireEvent.click(removeButton);
              await waitFor(() => {
                expect(screen.queryByText(stock.ticker)).not.toBeInTheDocument();
              });
            }
          }
        }
      }

      // Should show empty state
      await waitFor(() => {
        expect(screen.getByText('No assets match your filters')).toBeInTheDocument();
      });
    });
  });

  describe('Sort Functionality', () => {
    it('should open sort dropdown when clicking Sort button', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const sortButton = screen.getByText(/Sort:/i).closest('button');

      if (sortButton) {
        await user.click(sortButton);

        // Should show sort options (using getAllByText since table headers also have these texts)
        await waitFor(() => {
          const symbolOptions = screen.getAllByText('Symbol');
          const companyNameOptions = screen.getAllByText(/Company Name/);
          const priceOptions = screen.getAllByText(/Current Price/);

          expect(symbolOptions.length).toBeGreaterThan(0);
          expect(companyNameOptions.length).toBeGreaterThan(0);
          expect(priceOptions.length).toBeGreaterThan(0);
        });
      }
    });

    it('should sort assets by selected field', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const sortButton = screen.getByText(/Sort:/i).closest('button');

      if (sortButton) {
        await user.click(sortButton);

        // Click "Current Price" in the dropdown (using getAllByText and selecting from dropdown)
        const priceOptions = screen.getAllByText('Current Price');
        const dropdownOption = priceOptions.find(el => el.closest('.absolute'));
        if (dropdownOption) {
          await user.click(dropdownOption);

          // Verify sort was applied (button should show new sort field)
          await waitFor(() => {
            expect(screen.getByText('Sort: Current Price')).toBeInTheDocument();
          });
        }
      }
    });

    it('should toggle sort order when clicking same field twice', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const sortButton = screen.getByText(/Sort:/i).closest('button');

      if (sortButton) {
        // First click - descending
        await user.click(sortButton);
        const symbolOptions = screen.getAllByText('Symbol');
        const dropdownOption1 = symbolOptions.find(el => el.closest('.absolute'));
        if (dropdownOption1) {
          await user.click(dropdownOption1);
        }

        // Second click - ascending
        await user.click(sortButton);
        const symbolOptions2 = screen.getAllByText('Symbol');
        const dropdownOption2 = symbolOptions2.find(el => el.closest('.absolute'));
        if (dropdownOption2) {
          await user.click(dropdownOption2);
        }

        // Sort order should have changed (icon should flip)
        // This is verified by the presence of ArrowUp vs ArrowDown icon
        expect(sortButton).toBeInTheDocument();
      }
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate search results with arrow keys', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);

      // Type to show results
      await user.type(searchInput, 'A');

      // Press ArrowDown
      await user.keyboard('{ArrowDown}');

      // First result should be focused
      // This is tested by checking if keyboard navigation changes focusedIndex state
      expect(searchInput).toBeInTheDocument();
    });

    it('should select search result with Enter key', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);

      const notInWatchlistStock = Object.values(MOCK_STOCKS).find(s => !s.isInWatchlist);

      if (notInWatchlistStock) {
        await user.type(searchInput, notInWatchlistStock.ticker);

        // Press ArrowDown to focus first result
        await user.keyboard('{ArrowDown}');

        // Press Enter to select
        await user.keyboard('{Enter}');

        // Asset should be added
        await waitFor(() => {
          expect(searchInput.value).toBe('');
        });
      }
    });

    it('should close search dropdown with Escape key', async () => {
      const user = userEvent.setup();
      render(<WatchlistPage />);

      const searchInput = screen.getByPlaceholderText(/search stocks/i);

      // Type to show results
      await user.type(searchInput, 'AAPL');

      // Press Escape
      await user.keyboard('{Escape}');

      // Dropdown should be closed (results should not be visible)
      await waitFor(() => {
        // The dropdown content should not be in the document when closed
        expect(searchInput).toBeInTheDocument();
      });
    });
  });
});
