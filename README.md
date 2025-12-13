# UI Library Assistant - Embeddable Chat Widget

An embeddable chat widget that acts as a "UI librarian" for component libraries. The chatbot supports streaming responses and can render live, interactive UI components based on user queries.

Demo App: https://bujo-chat.harishiv.cv/

## 🚀 Features

- **Embeddable Widget**: Self-contained component (`<UiLibraryAssistant />`) that can be dropped into any documentation or component library site
- **Streaming Responses**: Responses stream word-by-word in real-time, simulating an AI assistant experience
- **Live Component Rendering**: Dynamically renders interactive UI components (buttons, chat bubbles for now) based on user queries
- **Persistent Chat History**: Automatically saves and restores chat history using localStorage
- **Modern UI**: Built with React 19 and Tailwind CSS for a polished, responsive experience

## 📋 Requirements Met

✅ Embeddable chat widget with floating button  
✅ Chat interface with message list, input, and send button  
✅ Loading states and scrollable history  
✅ Streaming behavior (paragraph-by-paragraph for better parsing)  
✅ UI example rendering (interactive components)  
✅ Persistent storage (localStorage)  

## 🎯 Focus Directions Implemented

This project implements **two focus directions** from the assignment requirements:

### Direction B: Streamable Markdown + JSON → Components (Production-Grade)
**Status:** ✅ Implemented as production-grade

This direction enables the assistant to return mixed Markdown and JSON blocks that are parsed and rendered in real-time during streaming. The system supports:
- **Streaming parser** that handles incomplete JSON blocks gracefully
- **Balanced brace matching** for accurate JSON extraction from streamed text
- **Mixed content rendering** - Markdown text alongside interactive components
- **Component types supported**: Button groups, Chat bubbles, Forms, Lists

**Production-Grade Implementation Details:**
- **Robust Error Handling**: 
  - Graceful handling of malformed/incomplete JSON during streaming
  - Fallback to markdown rendering if JSON parsing fails
  - Buffer management for incomplete chunks
- **Architecture**: 
  - Separation of concerns: Parser (`responseParser.js`), Renderer (`ComponentRenderer.jsx`), and Streaming logic
  - Extensible component system - easy to add new component types
  - Well-commented code for maintainability
- **Performance**: 
  - Efficient streaming parser with O(n) complexity
  - Lazy loading of heavy dependencies (ReactMarkdown)
  - Minimal re-renders through proper React patterns
- **Developer Experience**: 
  - Clear code structure and comments
  - Consistent patterns across components
  - Easy to extend with new component types

### Direction C: Bundle Splitting & Embeddable Performance
**Status:** ✅ Implemented

This direction focuses on making the widget truly embeddable and production-ready for external consumption:
- **Code Splitting**: Lazy loading of ChatPanel and ReactMarkdown components
- **Library Build Configuration**: Vite configured to output UMD and ESM bundles
- **External Dependencies**: React and ReactDOM are externalized (not bundled)
- **Separate Build Output**: Widget builds to `dist-widget/` directory

**Implementation Details:**
- Lazy loading via `React.lazy()` and `Suspense` boundaries
- Vite library mode configuration for UMD/ESM output
- Proper externals configuration for React dependencies
- Documentation for embedding in both React and non-React environments

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **localStorage API** - Persistence

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/graphicstone/bujo-chat.git
cd bujo-chat
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

## 🎯 Usage

### As an Embeddable Widget

The widget can be embedded in any React application:

```jsx
import UiLibraryAssistant from './components/UiLibraryAssistant';

function MyDocsPage() {
  return (
    <div>
      {/* Your documentation content */}
      <UiLibraryAssistant />
    </div>
  );
}
```

### Example Queries

Try asking the assistant:

- "Show me different types of button components"
- "Show me a primary button" (single variant)
- "Show me all buttons" (all variants)
- "Show me primary and secondary buttons" (specific combinations)
- "Show me variations of chat bubbles"
- "Show me an ordered list"
- "Show me a form with input fields"
- "What components do you have?" (generic query handling)

The assistant uses smart fuzzy matching to understand typos and variations, and responds with streaming Markdown text and interactive components rendered in real-time.

## 🌐 Embeddable Bundle & External Usage

You can use the assistant as a drop-in widget in other apps/sites, not just via React imports!

### Build for Embeddable Usage

```bash
npm run build  # or npx vite build
```
Embeddable builds will output to `dist-widget/`:
- `ui-library-assistant.umd.js` – UMD (for script inclusion)
- `ui-library-assistant.es.js` – ESM (for import)

### Using as a UMD/CDN Script (Non-React Host)

```html
<!-- On host site, must include React and ReactDOM globally! -->
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="/dist-widget/ui-library-assistant.umd.js"></script>
<script>
  // Provide a mount node where you want the widget
  const mountNode = document.getElementById('ui-library-chat-root');
  // Render using exported UiLibraryAssistant from window
  ReactDOM.render(
    React.createElement(window.UiLibraryAssistant),
    mountNode
  );
</script>
<div id="ui-library-chat-root"></div>
```

### Using as ESM (in Modern React App)

```js
import UiLibraryAssistant from './dist-widget/ui-library-assistant.es.js';
...
<UiLibraryAssistant />
```

### CSS & Integration Notes
- Widget styles (Tailwind, etc.) included in the bundle, but may need to be included in host app's build pipeline depending on your setup.
- For complete style isolation, consider wrapping in a Shadow DOM. Contact maintainers for next steps!

---

## 🏗️ Architecture & Approach

### Component Structure

```
src/
├── components/
│   ├── UiLibraryAssistant.jsx    # Main widget orchestrator
│   ├── ChatIcon.jsx              # Floating toggle button
│   ├── ChatPanel.jsx             # Chat container (lazy loaded)
│   ├── MessageList.jsx           # Scrollable message container
│   ├── MessageBubble.jsx         # Individual message display
│   ├── ChatInput.jsx             # Input field with character limit (200 chars)
│   ├── ComponentRenderer.jsx     # Dynamic component renderer
│   ├── Toast.jsx                 # Toast notification component
│   └── ui-library/               # Example UI components
│       ├── Button.jsx
│       ├── ButtonGroup.jsx
│       ├── ChatBubble.jsx
│       ├── ChatExamples.jsx
│       ├── Form.jsx              # Form component with inputs
│       ├── Input.jsx             # Input field component
│       └── List.jsx               # Ordered/unordered list component
├── contexts/
│   ├── toastContext.js           # Toast context definition
│   └── ToastContextProvider.jsx  # Toast provider component
├── hooks/
│   └── useToast.js               # Custom hook for toast notifications
├── services/
│   ├── mockStreamingAPI.js       # Mock streaming service with smart intent matching
│   └── storageService.js        # localStorage wrapper
├── utils/
│   └── responseParser.js         # Streaming Markdown + JSON parser
└── UiLibraryWidgetEntry.jsx     # Entry point for embeddable widget builds
```

### Key Design Decisions

1. **Streaming Implementation**: 
   - Uses a mock API service that simulates streaming by breaking responses into paragraph chunks
   - Each chunk is delivered with a 350ms delay for smooth streaming effect
   - Paragraph-based streaming enables better JSON block parsing during streaming
   - Supports real-time parsing of Markdown and JSON blocks as they arrive

2. **Component Rendering**:
   - Responses include mixed Markdown and JSON blocks (Direction B implementation)
   - Streaming parser extracts complete JSON blocks from streamed text
   - ComponentRenderer dynamically renders React components from JSON block data
   - Markdown is rendered alongside components using ReactMarkdown
   - Extensible system - new component types can be easily added

3. **State Management**:
   - Uses React hooks (useState, useEffect, useCallback) for local state
   - No external state management library needed for this scope

4. **Persistence**:
   - localStorage API for simplicity
   - Automatically saves after each message exchange
   - Restores history on component mount

5. **Styling**:
   - Tailwind CSS for rapid development and consistency
   - Custom animations for smooth transitions
   - Responsive design with mobile considerations

### How It Works

1. **User sends a message** → Added to message list immediately (with 200 character limit validation)
2. **Streaming starts** → Mock API breaks response into paragraph chunks (for better JSON parsing)
3. **Chunks stream in** → Streaming parser (`parseStreamedAssistantResponse`) extracts Markdown and JSON blocks
4. **Real-time rendering** → Markdown blocks render as text, JSON blocks render as interactive components
5. **Buffer management** → Incomplete JSON blocks are buffered until complete
6. **Response completes** → Final blocks are committed to message history
7. **History saved** → Messages persisted to localStorage

## 🎨 UI Components Library

The widget includes a small example component library:

- **Button Variants**: Primary, Secondary, Ghost, Danger, Outline (with smart variant parsing)
- **Chat Bubbles**: User, Assistant, System message types
- **Forms**: Input fields with labels, validation, and submit buttons
- **Lists**: Ordered and unordered lists with customizable items

These serve as examples - the system can be extended to support any component library. The assistant can understand queries like:
- "Show me a primary button" (single variant)
- "Show me all buttons" (all variants)
- "Show me primary and secondary buttons" (specific combinations)
- "Show me an ordered list"
- "Show me a form with name and email fields"

## 📝 Development

### How to Run the Project

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to the URL shown in terminal (typically `http://localhost:5173`)

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

6. **Run linter:**
   ```bash
   npm run lint
   ```

## ⚠️ Assumptions, Trade-offs, and Limitations

### Assumptions

1. **Mock API**: The project uses a mock streaming API (`mockStreamingAPI.js`) that simulates real AI responses. In production, this would be replaced with actual SSE/WebSocket connections to a backend service.

2. **React Dependencies**: For embeddable UMD builds, we assume the host site will provide React and ReactDOM globally. This keeps the bundle size small but requires coordination with the host.

3. **Browser Support**: Assumes modern browsers with ES6+ support, localStorage API, and CSS Grid/Flexbox support.

4. **Character Limit**: User input is limited to 200 characters to keep responses manageable and prevent abuse. This is a reasonable limit for UI component queries.

5. **Component Library**: The system is designed to be extensible, but currently includes a limited set of example components (buttons, chat bubbles, forms, lists). Production use would require a full component library.

### Trade-offs

1. **Streaming vs. Performance**: 
   - **Chosen**: Paragraph-by-paragraph streaming instead of word-by-word
   - **Reason**: Better JSON parsing accuracy and smoother component rendering
   - **Trade-off**: Slightly less granular streaming effect, but more reliable parsing

2. **Fuzzy Matching vs. Precision**:
   - **Chosen**: Smart fuzzy matching with typo tolerance (70-80% character match)
   - **Reason**: Better user experience for typos and variations
   - **Trade-off**: Slightly more complex logic, potential for false positives (mitigated with explicit keyword requirements)

3. **localStorage vs. Server Persistence**:
   - **Chosen**: Client-side localStorage for simplicity
   - **Reason**: No backend required, works offline, fast
   - **Trade-off**: Data is device-specific, limited storage (~5-10MB), no cross-device sync

4. **Code Splitting vs. Bundle Size**:
   - **Chosen**: Lazy loading for ChatPanel and ReactMarkdown
   - **Reason**: Smaller initial bundle, faster first load
   - **Trade-off**: Slight delay when opening chat for first time (acceptable for better overall performance)

5. **UMD/ESM Builds vs. Single Bundle**:
   - **Chosen**: Both UMD and ESM formats
   - **Reason**: Maximum compatibility (works in any environment)
   - **Trade-off**: Two separate build outputs to maintain

### Limitations

1. **No Real Backend**: Currently uses mock API - no actual AI/LLM integration. Real production would require:
   - Backend API with streaming support (SSE or WebSockets)
   - Authentication/rate limiting
   - Cost management for AI API calls

2. **Limited Component Types**: Currently supports 4 component types (buttons, chat bubbles, forms, lists). Extending requires:
   - Adding new component definitions in `ComponentRenderer.jsx`
   - Creating corresponding UI components in `ui-library/`
   - Updating mock API responses

3. **No Style Isolation**: Widget styles (Tailwind) may conflict with host site styles. Solutions:
   - Use CSS Modules or styled-components
   - Implement Shadow DOM (future enhancement)
   - Namespace all Tailwind classes

4. **No Error Recovery**: Limited error handling for network failures or parsing errors. Production would need:
   - Retry logic for failed requests
   - Better error boundaries
   - User-friendly error messages

5. **No Accessibility Audit**: While basic accessibility is considered, a full audit would be needed for production:
   - ARIA labels and roles
   - Keyboard navigation
   - Screen reader support
   - Focus management

6. **No Testing**: No unit or integration tests included. Production would require:
   - Component tests (React Testing Library)
   - Parser logic tests
   - E2E tests for critical flows

7. **Generic Query Understanding**: While fuzzy matching helps, the system uses keyword-based matching rather than true NLP. Complex queries may not be understood correctly.

8. **Single Conversation**: No support for multiple conversation threads or conversation management features.