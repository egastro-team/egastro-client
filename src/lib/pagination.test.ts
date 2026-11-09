import { getPageItems } from '@/lib/pagination'

describe('getPageItems', () => {
  it('shows every page when there are few', () => {
    expect(getPageItems(2, 3)).toEqual([1, 2, 3])
  })

  it('collapses distant pages into gaps', () => {
    expect(getPageItems(5, 10)).toEqual([1, null, 4, 5, 6, null, 10])
  })

  it('handles the edges', () => {
    expect(getPageItems(1, 10)).toEqual([1, 2, null, 10])
    expect(getPageItems(10, 10)).toEqual([1, null, 9, 10])
  })
})
