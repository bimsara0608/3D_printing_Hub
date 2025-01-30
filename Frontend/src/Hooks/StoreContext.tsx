import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import axios from "axios";

interface Message {
    _id: string;
    userId: string,
  message: string;
  isRead: boolean;
}

interface StoreContextType {
  messages: Message[];
    fetchMessages: (userId: string) => Promise<void>;
    markAsRead: (messageId: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);


  const fetchMessages = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/message/get/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
    };
    const markAsRead = async (messageId: string) => {
    try {
      await axios.put(`http://localhost:3000/message/update/${messageId}`);
      } catch (error) {
        console.error("Error marking message as read", error);
      }
    };

  return (
    <StoreContext.Provider value={{ messages, fetchMessages, markAsRead }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
