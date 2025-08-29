import { renderHook, act } from '@testing-library/react'
import {
  useAuth,
  useAuthStatus,
  useCurrentUser,
} from '../../modules/shared/hooks/useAuth'
import { useSession } from 'next-auth/react'
import { useAuthStore } from '../../modules/shared/stores/authStore'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
}))

// Mock the auth store
jest.mock('../../modules/shared/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}))

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>

describe('useAuth Hook', () => {
  const mockAuthStore = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    updateUser: jest.fn(),
    clearError: jest.fn(),
    checkSession: jest.fn(),
    setUser: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuthStore.mockReturnValue(mockAuthStore)
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    })
  })

  it('returns initial unauthenticated state', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets loading state when session is loading', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isLoading).toBe(true)
  })

  it('sets user when session is authenticated', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      image: null,
    }

    mockUseSession.mockReturnValue({
      data: { user: mockUser, expires: '2024-12-31' },
      status: 'authenticated',
      update: jest.fn(),
    })

    mockUseAuthStore.mockReturnValue({
      ...mockAuthStore,
      user: mockUser,
      isAuthenticated: true,
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('calls login function correctly', async () => {
    const mockLogin = jest.fn().mockResolvedValue(true)
    mockUseAuthStore.mockReturnValue({
      ...mockAuthStore,
      login: mockLogin,
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      const success = await result.current.login('test@example.com', 'password')
      expect(success).toBe(true)
    })

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password')
  })

  it('calls logout function correctly', async () => {
    const mockLogout = jest.fn().mockResolvedValue(undefined)
    mockUseAuthStore.mockReturnValue({
      ...mockAuthStore,
      logout: mockLogout,
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.logout()
    })

    expect(mockLogout).toHaveBeenCalled()
  })

  it('provides utility functions', () => {
    const { result } = renderHook(() => useAuth())

    expect(typeof result.current.hasPermission).toBe('function')
    expect(typeof result.current.hasRole).toBe('function')
    expect(typeof result.current.getUserDisplayName).toBe('function')
    expect(typeof result.current.isSessionValid).toBe('function')
  })

  it('getUserDisplayName returns correct display name', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      image: null,
    }

    mockUseAuthStore.mockReturnValue({
      ...mockAuthStore,
      user: mockUser,
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.getUserDisplayName()).toBe('Test User')
  })

  it('getUserDisplayName falls back to email username', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: null,
      image: null,
    }

    mockUseAuthStore.mockReturnValue({
      ...mockAuthStore,
      user: mockUser,
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.getUserDisplayName()).toBe('test')
  })
})

describe('useAuthStatus Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuthStore.mockImplementation(selector =>
      selector({ isAuthenticated: false })
    )
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    })
  })

  it('returns false when not authenticated', () => {
    const { result } = renderHook(() => useAuthStatus())

    expect(result.current).toBe(false)
  })

  it('returns true when authenticated', () => {
    mockUseAuthStore.mockImplementation(selector =>
      selector({ isAuthenticated: true })
    )

    mockUseSession.mockReturnValue({
      data: { user: { id: '1' }, expires: '2024-12-31' },
      status: 'authenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useAuthStatus())

    expect(result.current).toBe(true)
  })
})

describe('useCurrentUser Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock useAuthStore as a function that takes a selector
    mockUseAuthStore.mockImplementation(selector => selector({ user: null }))
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    })
  })

  it('returns null when no user', () => {
    const { result } = renderHook(() => useCurrentUser())

    expect(result.current).toBeNull()
  })

  it('returns user from store when available', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    }

    // Mock the store selector to return the user
    mockUseAuthStore.mockImplementation(selector =>
      selector({ user: mockUser })
    )

    const { result } = renderHook(() => useCurrentUser())

    expect(result.current).toEqual(mockUser)
  })

  it('returns user from session when store user is null', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    }

    // Store user is null
    mockUseAuthStore.mockImplementation(selector => selector({ user: null }))

    mockUseSession.mockReturnValue({
      data: { user: mockUser, expires: '2024-12-31' },
      status: 'authenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useCurrentUser())

    expect(result.current).toEqual(mockUser)
  })
})
