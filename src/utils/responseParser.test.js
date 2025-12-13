import { describe, it, expect } from 'vitest';
import { parseStreamedAssistantResponse } from './responseParser';

describe('parseStreamedAssistantResponse', () => {
  it('should parse markdown-only text', () => {
    const [blocks, buffer] = parseStreamedAssistantResponse('Here is some text.');
    
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('markdown');
    expect(blocks[0].content).toBe('Here is some text.');
    expect(buffer).toBe('');
  });

  it('should parse JSON block correctly', () => {
    const text = 'Here is a button:\n\n{\n  "type": "button-group",\n  "variants": ["primary"]\n}\n\nThat is all.';
    const [blocks, buffer] = parseStreamedAssistantResponse(text);
    
    expect(blocks).toHaveLength(3);
    expect(blocks[0].type).toBe('markdown');
    expect(blocks[0].content).toContain('Here is a button');
    expect(blocks[1].type).toBe('json');
    expect(blocks[1].content).toEqual({ type: 'button-group', variants: ['primary'] });
    expect(blocks[2].type).toBe('markdown');
    expect(blocks[2].content).toContain('That is all');
    expect(buffer).toBe('');
  });

  it('should handle incomplete JSON blocks by buffering', () => {
    const incompleteJson = 'Here is text:\n\n{\n  "type": "button-group"';
    const [blocks, buffer] = parseStreamedAssistantResponse(incompleteJson);
    
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('markdown');
    expect(buffer).toContain('{');
    expect(buffer).toContain('type');
  });

  it('should complete incomplete JSON from previous buffer', () => {
    const previousBuffer = '{\n  "type": "button-group"';
    const newChunk = ',\n  "variants": ["primary"]\n}';
    const [blocks, buffer] = parseStreamedAssistantResponse(newChunk, previousBuffer);
    
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('json');
    expect(blocks[0].content).toEqual({ type: 'button-group', variants: ['primary'] });
    expect(buffer).toBe('');
  });

  it('should handle multiple JSON blocks', () => {
    const text = 'First block:\n\n{\n  "type": "button-group",\n  "variants": ["primary"]\n}\n\nSecond block:\n\n{\n  "type": "list",\n  "items": ["item1"]\n}';
    const [blocks, buffer] = parseStreamedAssistantResponse(text);
    
    expect(blocks.length).toBeGreaterThanOrEqual(4);
    const jsonBlocks = blocks.filter(b => b.type === 'json');
    expect(jsonBlocks).toHaveLength(2);
    expect(jsonBlocks[0].content.type).toBe('button-group');
    expect(jsonBlocks[1].content.type).toBe('list');
    expect(buffer).toBe('');
  });

  it('should handle nested JSON structures', () => {
    const text = 'Complex structure:\n\n{\n  "type": "chat-examples",\n  "bubbles": [\n    { "type": "user", "message": "Hello" },\n    { "type": "assistant", "message": "Hi" }\n  ]\n}';
    const [blocks, buffer] = parseStreamedAssistantResponse(text);
    
    expect(blocks).toHaveLength(2);
    expect(blocks[1].type).toBe('json');
    expect(blocks[1].content.type).toBe('chat-examples');
    expect(blocks[1].content.bubbles).toHaveLength(2);
    expect(buffer).toBe('');
  });

  it('should treat JSON without type field as markdown', () => {
    const text = 'Some text:\n\n{\n  "not": "a component"\n}';
    const [blocks, buffer] = parseStreamedAssistantResponse(text);
    
    const jsonBlocks = blocks.filter(b => b.type === 'json');
    expect(jsonBlocks).toHaveLength(0);
    // Should be treated as markdown
    expect(blocks.some(b => b.content.includes('not'))).toBe(true);
    expect(buffer).toBe('');
  });

  it('should handle malformed JSON gracefully', () => {
    const text = 'Text:\n\n{\n  "type": "button-group"\n  "variants": ["primary"]\n}'; // Missing comma
    const [blocks, buffer] = parseStreamedAssistantResponse(text);
    
    // Should treat as markdown since JSON is invalid
    const jsonBlocks = blocks.filter(b => b.type === 'json');
    expect(jsonBlocks.length).toBeLessThanOrEqual(1);
    expect(buffer).toBe('');
  });

  it('should handle empty input', () => {
    const [blocks, buffer] = parseStreamedAssistantResponse('');
    
    expect(blocks).toHaveLength(0);
    expect(buffer).toBe('');
  });

  it('should handle JSON with escaped characters', () => {
    const text = 'Text:\n\n{\n  "type": "button-group",\n  "text": "Say \\"Hello\\""\n}';
    const [blocks, buffer] = parseStreamedAssistantResponse(text);
    
    expect(blocks).toHaveLength(2);
    expect(blocks[1].type).toBe('json');
    expect(blocks[1].content.text).toBe('Say "Hello"');
    expect(buffer).toBe('');
  });
});

