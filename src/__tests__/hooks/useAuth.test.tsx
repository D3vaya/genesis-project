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

// Define the complete AuthState mock interface
interface MockAuthState {
  user: any
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: jest.MockedFunction<any>
  logout: jest.MockedFunction<any>
  updateUser: jest.MockedFunction<any>
  clearError: jest.MockedFunction<any>
  checkSession: jest.MockedFunction<any>
  setUser: jest.MockedFunction<any>
  setLoading: jest.MockedFunction<any>
  setError: jest.MockedFunction<any>
}

describe('useAuth Hook', () => {
  const mockAuthStore: MockAuthState = {
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
    // Reset mock functions
    Object.values(mockAuthStore).forEach(fn => {
      if (jest.isMockFunction(fn)) {
        fn.mockReset()
      }
    })

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

    const updatedMockStore = {
      ...mockAuthStore,
      user: mockUser,
      isAuthenticated: true,
    }
    mockUseAuthStore.mockReturnValue(updatedMockStore)

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('calls login function correctly', async () => {
    const mockLogin = jest.fn().mockResolvedValue(true)
    const updatedMockStore = {
      ...mockAuthStore,
      login: mockLogin,
    }
    mockUseAuthStore.mockReturnValue(updatedMockStore)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      const success = await result.current.login('test@example.com', 'password')
      expect(success).toBe(true)
    })

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password')
  })

  it('calls logout function correctly', async () => {
    const mockLogout = jest.fn().mockResolvedValue(undefined)
    const updatedMockStore = {
      ...mockAuthStore,
      logout: mockLogout,
    }
    mockUseAuthStore.mockReturnValue(updatedMockStore)

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

    const updatedMockStore = {
      ...mockAuthStore,
      user: mockUser,
    }
    mockUseAuthStore.mockReturnValue(updatedMockStore)

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

    const updatedMockStore = {
      ...mockAuthStore,
      user: mockUser,
    }
    mockUseAuthStore.mockReturnValue(updatedMockStore)

    const { result } = renderHook(() => useAuth())

    expect(result.current.getUserDisplayName()).toBe('test')
  })
})

describe('useAuthStatus Hook', () => {
  const mockFullAuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    updateUser: jest.fn(),
    setUser: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    clearError: jest.fn(),
    checkSession: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuthStore.mockImplementation(selector => selector(mockFullAuthState))
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
    const authenticatedState = {
      ...mockFullAuthState,
      isAuthenticated: true,
    }

    mockUseAuthStore.mockImplementation(selector =>
      selector(authenticatedState)
    )

    mockUseSession.mockReturnValue({
      data: {
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useAuthStatus())

    expect(result.current).toBe(true)
  })
})

describe('useCurrentUser Hook', () => {
  const mockCurrentUserAuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    updateUser: jest.fn(),
    setUser: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    clearError: jest.fn(),
    checkSession: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock useAuthStore as a function that takes a selector
    mockUseAuthStore.mockImplementation(selector =>
      selector(mockCurrentUserAuthState)
    )
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
      image: null,
    }

    // Mock the store selector to return the user
    const stateWithUser = {
      ...mockCurrentUserAuthState,
      user: mockUser,
    }
    mockUseAuthStore.mockImplementation(selector => selector(stateWithUser))

    const { result } = renderHook(() => useCurrentUser())

    expect(result.current).toEqual(mockUser)
  })

  it('returns user from session when store user is null', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      image: null,
    }

    // Store user is null
    const stateWithNullUser = {
      ...mockCurrentUserAuthState,
      user: null,
    }
    mockUseAuthStore.mockImplementation(selector => selector(stateWithNullUser))

    mockUseSession.mockReturnValue({
      data: { user: mockUser, expires: '2024-12-31' },
      status: 'authenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useCurrentUser())

    expect(result.current).toEqual(mockUser)
  })
})
