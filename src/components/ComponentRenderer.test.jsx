import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComponentRenderer from './ComponentRenderer';

// Mock child components to avoid complex dependencies
vi.mock('./ui-library/ButtonGroup', () => ({
  default: ({ buttons }) => (
    <div data-testid="button-group">
      {buttons?.map((btn, i) => (
        <button key={i} data-variant={btn.variant}>
          {btn.text}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('./ui-library/ChatExamples', () => ({
  default: ({ bubbles }) => (
    <div data-testid="chat-examples">
      {bubbles?.map((bubble, i) => (
        <div key={i} data-type={bubble.type}>
          {bubble.message}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('./ui-library/Form', () => ({
  default: ({ fields, submitText }) => (
    <form data-testid="form">
      {fields?.map((field, i) => (
        <input key={i} name={field.name} placeholder={field.placeholder} />
      ))}
      <button type="submit">{submitText}</button>
    </form>
  ),
}));

vi.mock('./ui-library/List', () => ({
  default: ({ items, ordered }) => {
    const Tag = ordered ? 'ol' : 'ul';
    return (
      <Tag data-testid="list" data-ordered={ordered}>
        {items?.map((item, i) => (
          <li key={i}>{typeof item === 'string' ? item : item.text || item}</li>
        ))}
      </Tag>
    );
  },
}));

describe('ComponentRenderer', () => {
  it('should return null for invalid jsonBlock', () => {
    const { container } = render(<ComponentRenderer jsonBlock={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should return null for jsonBlock without type', () => {
    const { container } = render(<ComponentRenderer jsonBlock={{ data: 'test' }} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render ButtonGroup for button-group type', () => {
    const jsonBlock = {
      type: 'button-group',
      variants: ['primary', 'secondary', 'ghost'],
    };
    
    render(<ComponentRenderer jsonBlock={jsonBlock} />);
    
    const buttonGroup = screen.getByTestId('button-group');
    expect(buttonGroup).toBeInTheDocument();
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveAttribute('data-variant', 'primary');
    expect(buttons[0]).toHaveTextContent('Primary');
  });

  it('should handle empty variants array for button-group', () => {
    const jsonBlock = {
      type: 'button-group',
      variants: [],
    };
    
    render(<ComponentRenderer jsonBlock={jsonBlock} />);
    
    const buttonGroup = screen.getByTestId('button-group');
    expect(buttonGroup).toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('should render ChatExamples for chat-examples type', () => {
    const jsonBlock = {
      type: 'chat-examples',
      bubbles: [
        { type: 'user', message: 'Hello' },
        { type: 'assistant', message: 'Hi there' },
      ],
    };
    
    render(<ComponentRenderer jsonBlock={jsonBlock} />);
    
    const chatExamples = screen.getByTestId('chat-examples');
    expect(chatExamples).toBeInTheDocument();
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there')).toBeInTheDocument();
  });

  it('should handle empty bubbles array for chat-examples', () => {
    const jsonBlock = {
      type: 'chat-examples',
      bubbles: [],
    };
    
    render(<ComponentRenderer jsonBlock={jsonBlock} />);
    
    const chatExamples = screen.getByTestId('chat-examples');
    expect(chatExamples).toBeInTheDocument();
  });

  it('should render Form for form type', () => {
    const jsonBlock = {
      type: 'form',
      fields: [
        { name: 'name', placeholder: 'Enter name' },
        { name: 'email', placeholder: 'Enter email' },
      ],
      submitText: 'Submit Form',
    };
    
    render(<ComponentRenderer jsonBlock={jsonBlock} />);
    
    const form = screen.getByTestId('form');
    expect(form).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Form' })).toBeInTheDocument();
  });

  it('should use default submitText for form', () => {
    const jsonBlock = {
      type: 'form',
      fields: [{ name: 'test', placeholder: 'Test' }],
    };
    
    render(<ComponentRenderer jsonBlock={jsonBlock} />);
    
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should render List for list type', () => {
    const jsonBlock = {
      type: 'list',
      items: ['Item 1', 'Item 2', 'Item 3'],
      ordered: false,
    };
    
    render(<ComponentRenderer jsonBlock={jsonBlock} />);
    
    const list = screen.getByTestId('list');
    expect(list).toBeInTheDocument();
    expect(list.tagName).toBe('UL');
    expect(list).toHaveAttribute('data-ordered', 'false');
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('should render ordered list when ordered is true', () => {
    const jsonBlock = {
      type: 'list',
      items: ['First', 'Second'],
      ordered: true,
    };
    
    render(<ComponentRenderer jsonBlock={jsonBlock} />);
    
    const list = screen.getByTestId('list');
    expect(list.tagName).toBe('OL');
    expect(list).toHaveAttribute('data-ordered', 'true');
  });

  it('should return null for unknown component type', () => {
    const jsonBlock = {
      type: 'unknown-type',
      data: 'test',
    };
    
    const { container } = render(<ComponentRenderer jsonBlock={jsonBlock} />);
    expect(container.firstChild).toBeNull();
  });
});

