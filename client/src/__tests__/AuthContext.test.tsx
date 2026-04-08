import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import React from 'react'

const TestConsumer: React.FC = () => {
  const { user, isAuthenticated, isAdmin } = useAuth()
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="admin">{isAdmin ? 'yes' : 'no'}</span>
      <span data-testid="name">{user?.name || 'none'}</span>
    </div>
  )
}

const LoginButton: React.FC = () => {
  const { login, logout } = useAuth()
  return (
    <>
      <button
        onClick={() =>
          login({ id: '1', name: 'Test User', email: 'test@example.com', role: 'USER', createdAt: '2024-01-01' }, 'tok')
        }
      >
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts unauthenticated', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    expect(screen.getByTestId('auth').textContent).toBe('no')
    expect(screen.getByTestId('name').textContent).toBe('none')
  })

  it('updates state on login', () => {
    render(
      <AuthProvider>
        <TestConsumer />
        <LoginButton />
      </AuthProvider>
    )

    act(() => {
      screen.getByRole('button', { name: 'Login' }).click()
    })

    expect(screen.getByTestId('auth').textContent).toBe('yes')
    expect(screen.getByTestId('name').textContent).toBe('Test User')
  })

  it('clears state on logout', () => {
    render(
      <AuthProvider>
        <TestConsumer />
        <LoginButton />
      </AuthProvider>
    )

    act(() => {
      screen.getByRole('button', { name: 'Login' }).click()
    })

    act(() => {
      screen.getByRole('button', { name: 'Logout' }).click()
    })

    expect(screen.getByTestId('auth').textContent).toBe('no')
    expect(screen.getByTestId('name').textContent).toBe('none')
  })
})
