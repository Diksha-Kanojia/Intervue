// Mock socket implementation for development
class MockSocket {
  constructor() {
    this.listeners = {};
    this.isConnected = true;
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    console.log(`[Socket] Emitting ${event}:`, data);
    
    // Store in localStorage for cross-tab communication
    if (event === 'poll-created') {
      localStorage.setItem('currentPoll', JSON.stringify(data));
      localStorage.setItem('pollEvent', JSON.stringify({ event, data, timestamp: Date.now() }));
      
      // Trigger custom event for same-tab communication
      window.dispatchEvent(new CustomEvent('poll-created', { detail: data }));
      
      // Use BroadcastChannel for cross-tab communication
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('poll-channel');
        channel.postMessage({ event, data });
      }
    }
  }

  // Listen for localStorage changes (for cross-tab communication)
  startListening() {
    // Listen to storage events (cross-tab)
    window.addEventListener('storage', (e) => {
      if (e.key === 'pollEvent') {
        try {
          const eventData = JSON.parse(e.newValue);
          if (eventData && this.listeners[eventData.event]) {
            this.listeners[eventData.event].forEach(callback => {
              callback(eventData.data);
            });
          }
        } catch (error) {
          console.error('Error parsing poll event:', error);
        }
      }
    });

    // Listen to custom events (same-tab)
    window.addEventListener('poll-created', (e) => {
      if (this.listeners['poll-created']) {
        this.listeners['poll-created'].forEach(callback => {
          callback(e.detail);
        });
      }
    });

    // Listen to BroadcastChannel (cross-tab)
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('poll-channel');
      channel.onmessage = (event) => {
        const { event: eventName, data } = event.data;
        if (this.listeners[eventName]) {
          this.listeners[eventName].forEach(callback => {
            callback(data);
          });
        }
      };
    }
  }
}

const socket = new MockSocket();
socket.startListening();

export default socket;
