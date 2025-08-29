import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getProviders: jest.fn(),
}))

// Mock environment variables
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock Next.js Request and Response APIs
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Headers
global.Headers = class Headers {
  constructor(init = {}) {
    this.headers = new Map()
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers.set(key.toLowerCase(), value)
      })
    }
  }

  get(name) {
    return this.headers.get(name?.toLowerCase())
  }

  set(name, value) {
    this.headers.set(name?.toLowerCase(), value)
  }

  has(name) {
    return this.headers.has(name?.toLowerCase())
  }

  delete(name) {
    this.headers.delete(name?.toLowerCase())
  }

  forEach(callback) {
    this.headers.forEach(callback)
  }
}

// Mock Request
global.Request = class Request {
  constructor(input, init = {}) {
    this._url = input
    this._method = init.method || 'GET'
    this._headers = new Headers(init.headers)
    this._body = init.body || null
  }

  get url() {
    return this._url
  }
  get method() {
    return this._method
  }
  get headers() {
    return this._headers
  }

  async json() {
    if (typeof this._body === 'string') {
      return JSON.parse(this._body)
    }
    return this._body
  }

  async text() {
    return this._body?.toString() || ''
  }
}

// Mock Response
global.Response = class Response {
  constructor(body, init = {}) {
    this._body = body
    this._status = init.status || 200
    this._statusText = init.statusText || 'OK'
    this._headers = new Headers(init.headers)
  }

  get status() {
    return this._status
  }
  get statusText() {
    return this._statusText
  }
  get headers() {
    return this._headers
  }

  async json() {
    if (typeof this._body === 'string') {
      return JSON.parse(this._body)
    }
    return this._body
  }

  async text() {
    return this._body?.toString() || ''
  }
}

// Mock NextRequest specifically
jest.mock('next/server', () => ({
  NextRequest: class NextRequest extends global.Request {
    constructor(input, init) {
      super(input, init)
    }
  },
  NextResponse: {
    json: (data, init = {}) =>
      new global.Response(JSON.stringify(data), {
        ...init,
        headers: {
          'content-type': 'application/json',
          ...init.headers,
        },
      }),
  },
}))
