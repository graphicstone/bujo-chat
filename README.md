# UI Library Assistant - Embeddable Chat Widget

An embeddable chat widget that acts as a "UI librarian" for component libraries. The chatbot supports streaming responses and can render live, interactive UI components based on user queries.

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
✅ Streaming behavior (word-by-word)  
✅ UI example rendering (interactive components)  
✅ Persistent storage (localStorage)  

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **localStorage API** - Persistence

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
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
- "Show me variations of chat bubbles"
- "Show me a primary, secondary, and ghost button"
- "Display button examples"

The assistant will respond with streaming text and render interactive components directly in the chat.

## 🏗️ Architecture & Approach

### Component Structure

```
src/
├── components/
│   ├── UiLibraryAssistant.jsx    # Main widget orchestrator
│   ├── ChatIcon.jsx              # Floating toggle button
│   ├── ChatPanel.jsx             # Chat container
│   ├── MessageList.jsx           # Scrollable message container
│   ├── MessageBubble.jsx         # Individual message display
│   ├── ChatInput.jsx             # Input field and send button
│   ├── ComponentRenderer.jsx     # Dynamic component renderer
│   ├── Toast.jsx                 # Toast notification component
│   └── ui-library/               # Example UI components
│       ├── Button.jsx
│       ├── ButtonGroup.jsx
│       ├── ChatBubble.jsx
│       └── ChatExamples.jsx
├── contexts/
│   ├── toastContext.js           # Toast context definition
│   └── ToastContext.jsx          # Toast provider component
├── hooks/
│   └── useToast.js               # Custom hook for toast notifications
├── services/
│   ├── mockStreamingAPI.js       # Mock streaming service
│   └── storageService.js         # localStorage wrapper
└── utils/
    └── responseParser.js         # Parse responses for components
```

### Key Design Decisions

1. **Streaming Implementation**: 
   - Uses a mock API service that simulates streaming by breaking responses into word chunks
   - Each chunk is delivered with a 50ms delay for smooth streaming effect

2. **Component Rendering**:
   - Responses include special markup (`<component>` tags) that get parsed
   - ComponentRenderer dynamically renders React components based on parsed data
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

1. **User sends a message** → Added to message list immediately
2. **Streaming starts** → Mock API breaks response into chunks
3. **Chunks stream in** → Displayed progressively in the UI
4. **Response completes** → Full response is parsed for component tags
5. **Components render** → ComponentRenderer displays interactive UI elements
6. **History saved** → Messages persisted to localStorage

## 🎨 UI Components Library

The widget includes a small example component library:

- **Button Variants**: Primary, Secondary, Ghost, Danger, Outline
- **Chat Bubbles**: User, Assistant, System message types

These serve as examples - the system can be extended to support any component library.

## 📝 Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```