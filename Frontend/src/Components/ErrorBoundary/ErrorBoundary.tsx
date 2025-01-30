// src/components/ErrorBoundary/ErrorBoundary.js

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            width: "100%",
            height: "400px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5px",
          }}
        >
          <p>Something went wrong while loading the 3D model.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
