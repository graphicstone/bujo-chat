import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInput from './ChatInput';

describe('ChatInput', () => {
  it('should render input field and send button', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);
    
    expect(screen.getByPlaceholderText('Ask about UI components...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('should display character count', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);
    
    expect(screen.getByText(/0 \/ 200 characters/i)).toBeInTheDocument();
  });

  it('should update character count as user types', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);
    
    const input = screen.getByPlaceholderText('Ask about UI components...');
    await user.type(input, 'Hello');
    
    expect(screen.getByText(/5 \/ 200 characters/i)).toBeInTheDocument();
  });

  it('should enforce 200 character limit', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);
    
    const input = screen.getByPlaceholderText('Ask about UI components...');
    const longText = 'a'.repeat(250);
    
    await user.type(input, longText);
    
    // Input should be limited to 200 characters
    expect(input.value).toHaveLength(200);
    expect(screen.getByText(/200 \/ 200 characters/i)).toBeInTheDocument();
  });

  it('should show warning when near limit (160+ characters)', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);
    
    const input = screen.getByPlaceholderText('Ask about UI components...');
    const nearLimitText = 'a'.repeat(165);
    
    await user.type(input, nearLimitText);
    
    const countDisplay = screen.getByText(/165 \/ 200 characters/i);
    expect(countDisplay).toHaveClass('text-orange-500');
    expect(countDisplay).toHaveTextContent(/remaining/i);
  });

  it('should show limit reached when at 200 characters', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);
    
    const input = screen.getByPlaceholderText('Ask about UI components...');
    const maxText = 'a'.repeat(200);
    
    await user.type(input, maxText);
    
    const countDisplay = screen.getByText(/200 \/ 200 characters/i);
    expect(countDisplay).toHaveClass('text-red-500');
    expect(countDisplay).toHaveTextContent(/limit reached/i);
  });

  it('should disable send button when at character limit', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);
    
    const input = screen.getByPlaceholderText('Ask about UI components...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    const maxText = 'a'.repeat(200);
    
    await user.type(input, maxText);
    
    expect(sendButton).toBeDisabled();
  });

  it('should call onSend when form is submitted with valid input', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);
    
    const input = screen.getByPlaceholderText('Ask about UI components...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    await user.type(input, 'Show me buttons');
    await user.click(sendButton);
    
    expect(onSend).toHaveBeenCalledWith('Show me buttons');
    expect(input.value).toBe(''); // Input should be cleared
  });

  it('should not call onSend with empty input', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    await user.click(sendButton);
    
    expect(onSend).not.toHaveBeenCalled();
  });

  it('should not call onSend when disabled', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={true} />);
    
    const input = screen.getByPlaceholderText('Ask about UI components...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    await user.type(input, 'Test message');
    await user.click(sendButton);
    
    expect(onSend).not.toHaveBeenCalled();
    expect(sendButton).toBeDisabled();
  });

  it('should trim whitespace before sending', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);
    
    const input = screen.getByPlaceholderText('Ask about UI components...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    await user.type(input, '  Show me buttons  ');
    await user.click(sendButton);
    
    expect(onSend).toHaveBeenCalledWith('Show me buttons');
  });
});

