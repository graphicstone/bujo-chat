import UiLibraryAssistant from './components/UiLibraryAssistant'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            UI Library Assistant
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            An embeddable chat widget for exploring component libraries
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Try it out!
            </h2>
            <p className="text-gray-600 mb-6">
              Click the chat icon in the bottom-right corner to start exploring UI components.
            </p>
            <div className="text-left bg-gray-50 rounded-lg p-6 space-y-2">
              <p className="text-sm font-semibold text-gray-700">Example queries:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>"Show me different types of button components"</li>
                <li>"Show me variations of chat bubbles"</li>
                <li>"Show me a primary, secondary, and ghost button"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Embeddable Widget */}
      <UiLibraryAssistant />
    </div>
  )
}

export default App
