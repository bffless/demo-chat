import { useChat } from '@ai-sdk/react';
import { useRef, useEffect } from 'react';

function App() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    status,
    error,
    stop,
  } = useChat({
    api: '/api/chat',
  });

  const isStreaming = status === 'streaming';
  const isSubmitting = status === 'submitted';
  const isLoading = isStreaming || isSubmitting;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmit(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onFormSubmit(e);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>useChat Demo</h1>
        <p style={styles.subtitle}>
          AI chat powered by <code style={styles.code}>@ai-sdk/react</code>
        </p>
      </header>

      <div style={styles.chatContainer}>
        {/* Status Bar */}
        <div style={styles.statusBar}>
          {isStreaming && (
            <span style={styles.statusBadge}>Streaming...</span>
          )}
          {isSubmitting && (
            <span style={styles.statusBadgeUpdating}>Sending...</span>
          )}
          {error && (
            <span style={styles.statusBadgeError}>
              Error: {error.message}
            </span>
          )}
          {status === 'ready' && messages.length > 0 && (
            <span style={styles.statusBadgeReady}>Ready</span>
          )}
        </div>

        {/* Messages Area */}
        <div style={styles.messagesArea}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>
                Start a conversation by typing a message below.
              </p>
              <div style={styles.suggestions}>
                <p style={styles.suggestionsTitle}>Try asking:</p>
                <button
                  style={styles.suggestionButton}
                  onClick={() => setInput('What is React?')}
                >
                  What is React?
                </button>
                <button
                  style={styles.suggestionButton}
                  onClick={() => setInput('Explain TypeScript in simple terms')}
                >
                  Explain TypeScript in simple terms
                </button>
                <button
                  style={styles.suggestionButton}
                  onClick={() => setInput('Write a haiku about coding')}
                >
                  Write a haiku about coding
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.messagesList}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    ...styles.messageWrapper,
                    justifyContent:
                      message.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      ...styles.message,
                      ...(message.role === 'user'
                        ? styles.userMessage
                        : styles.assistantMessage),
                    }}
                  >
                    <div style={styles.messageRole}>
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <div style={styles.messageContent}>
                      {message.parts?.map((part, index) => {
                        if (part.type === 'text') {
                          return <span key={index}>{part.text}</span>;
                        }
                        return null;
                      }) ?? message.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={onFormSubmit} style={styles.inputArea}>
          <div style={styles.inputWrapper}>
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              style={styles.input}
              rows={1}
              disabled={isLoading}
            />
            <div style={styles.inputActions}>
              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  style={styles.stopButton}
                >
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  style={{
                    ...styles.sendButton,
                    opacity: input.trim() ? 1 : 0.5,
                  }}
                >
                  Send
                </button>
              )}
            </div>
          </div>
          <p style={styles.hint}>
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>

      <footer style={styles.footer}>
        <p>
          This demo uses <code>useChat</code> from the AI SDK to stream
          responses from the backend.
        </p>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '8px',
    color: '#1a1a1a',
  },
  subtitle: {
    color: '#666',
    fontSize: '1rem',
  },
  code: {
    background: '#e8e8e8',
    padding: '2px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace',
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  statusBar: {
    minHeight: '36px',
    padding: '8px 16px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
  },
  statusBadge: {
    background: '#e0e7ff',
    color: '#4338ca',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.8rem',
  },
  statusBadgeUpdating: {
    background: '#fef3c7',
    color: '#b45309',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.8rem',
  },
  statusBadgeError: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.8rem',
  },
  statusBadgeReady: {
    background: '#dcfce7',
    color: '#16a34a',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.8rem',
  },
  messagesArea: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
    minHeight: '400px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '40px',
  },
  emptyStateText: {
    color: '#666',
    fontSize: '1.1rem',
    marginBottom: '24px',
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  suggestionsTitle: {
    color: '#888',
    fontSize: '0.9rem',
    marginBottom: '8px',
  },
  suggestionButton: {
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '20px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#333',
    transition: 'background 0.2s',
  },
  messagesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  messageWrapper: {
    display: 'flex',
    width: '100%',
  },
  message: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '12px',
  },
  userMessage: {
    background: '#2563eb',
    color: '#fff',
    borderBottomRightRadius: '4px',
  },
  assistantMessage: {
    background: '#f5f5f5',
    color: '#333',
    borderBottomLeftRadius: '4px',
  },
  messageRole: {
    fontSize: '0.75rem',
    opacity: 0.7,
    marginBottom: '4px',
    fontWeight: '500',
  },
  messageContent: {
    fontSize: '0.95rem',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  inputArea: {
    padding: '16px',
    borderTop: '1px solid #eee',
  },
  inputWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'none',
    outline: 'none',
    minHeight: '48px',
    maxHeight: '120px',
  },
  inputActions: {
    display: 'flex',
    gap: '8px',
  },
  sendButton: {
    padding: '12px 24px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'background 0.2s',
  },
  stopButton: {
    padding: '12px 24px',
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  hint: {
    fontSize: '0.8rem',
    color: '#888',
    marginTop: '8px',
    textAlign: 'center',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    color: '#666',
    fontSize: '0.9rem',
    padding: '20px',
  },
};

export default App;
