import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
// Mock SessionProvider for testing
import { Session } from 'next-auth'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: Session | null
}

// Mock wrapper component for tests
const AllTheProviders = ({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  session = null,
}: {
  children: React.ReactNode
  session?: Session | null
}) => {
  // Simple wrapper without SessionProvider since it's mocked
  return <div data-testid="test-wrapper">{children}</div>
}

const customRender = (
  ui: ReactElement,
  { session, ...options }: CustomRenderOptions = {}
) =>
  render(ui, {
    wrapper: props => <AllTheProviders {...props} session={session} />,
    ...options,
  })

// Mock user session for testing
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
}

export const mockSession: Session = {
  user: mockUser,
  expires: '2024-12-31T23:59:59.999Z',
}

// Export everything
export * from '@testing-library/react'
export { customRender as render }
export { default as userEvent } from '@testing-library/user-event'
