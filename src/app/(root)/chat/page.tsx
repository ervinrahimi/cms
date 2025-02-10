"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  FormEvent,
  ReactNode,
} from "react";
import { Surreal } from "surrealdb";
import { useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";

// --- انواع و اینترفیس‌ها ---
interface Message {
  id?: string;
  sender?: string;
  content?: string;
  created_at?: string;
}

interface SurrealProviderProps {
  children: ReactNode;
  endpoint: string;
  autoConnect?: boolean;
}

interface SurrealProviderState {
  client: Surreal;
  isConnecting: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: unknown;
  connect: () => Promise<true>;
  close: () => Promise<true>;
}

// --- متغیرهای محیطی ---
const DB_URL = "wss://dynamic-gull-06ad1bhg19u4vfrl4pqnil6o08.aws-use1.surreal.cloud";
const DB_USER = "root";
const DB_PASS = "root";
const DB_NAMESPACE = "test";
const DB_NAME = "chat";

// --- ایجاد Context برای اتصال به SurrealDB ---
const SurrealContext = createContext<SurrealProviderState | undefined>(undefined);

function SurrealProvider({ children, endpoint, autoConnect = true }: SurrealProviderProps) {
  const [surrealInstance] = useState<Surreal>(() => new Surreal());

  // از react-query برای مدیریت وضعیت اتصال استفاده می‌کنیم
  const {
    mutateAsync: connectMutation,
    isPending, // یا isLoading
    isSuccess,
    isError,
    error,
    reset,
  } = useMutation({
    mutationFn: () => surrealInstance.connect(endpoint),
  });

  const connect = useCallback(() => connectMutation(), [connectMutation]);
  const close = useCallback(() => surrealInstance.close(), [surrealInstance]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      reset();
      surrealInstance.close();
    };
  }, [autoConnect, connect, reset, surrealInstance]);

  const value = useMemo<SurrealProviderState>(
    () => ({
      client: surrealInstance,
      isConnecting: isPending,
      isSuccess,
      isError,
      error,
      connect,
      close,
    }),
    [surrealInstance, isPending, isSuccess, isError, error, connect, close]
  );

  return <SurrealContext.Provider value={value}>{children}</SurrealContext.Provider>;
}

function useSurreal() {
  const context = useContext(SurrealContext);
  if (!context) {
    throw new Error("useSurreal must be used within a SurrealProvider");
  }
  return context;
}

// --- کامپوننت Chat ---
function Chat() {
  const { client, isConnecting, isSuccess, isError, error } = useSurreal();

  const [isAuthDone, setIsAuthDone] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [senderName, setSenderName] = useState("UserA");

  // پس از اتصال موفق، وارد شدن (signin) و انتخاب namespace و database
  useEffect(() => {
    const doAuth = async () => {
      try {
        await client.signin({ username: DB_USER, password: DB_PASS });
        await client.use({ namespace: DB_NAMESPACE, database: DB_NAME });
        setIsAuthDone(true);
      } catch (err) {
        console.error("Signin error:", err);
      }
    };
    if (isSuccess && !isAuthDone) {
      doAuth();
    }
  }, [isSuccess, isAuthDone, client]);

  // بعد از auth شدن، داده‌های اولیه را می‌خوانیم و Live Query را فعال می‌کنیم
  useEffect(() => {
    if (!isAuthDone) return;

    let queryId: string | null = null;

    async function setupLiveQuery() {
      try {
        // پیام‌های اولیه
        const res = await client.query("SELECT * FROM messages ORDER BY created_at ASC");
        const initialMessages = res?.[0] || [];
        setMessages(initialMessages);

        // ایجاد Live Query
        queryId = await client.live("messages");

        // Subscribe به Live Query
        client.subscribeLive(queryId, (action: string, result: any) => {
          if (action === "CLOSE") return;
          console.log("Live Action:", action, "Result:", result);

          if (action === "CREATE") {
            setMessages((prev) => [...prev, result]);
          } else if (action === "UPDATE") {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === result.id ? result : msg))
            );
          } else if (action === "DELETE") {
            setMessages((prev) => prev.filter((msg) => msg.id !== result.id));
          }
        });
      } catch (err) {
        console.error("Error setting up live query:", err);
      }
    }

    setupLiveQuery();

    // Cleanup: بستن لایو کوئری در زمان unmount
    return () => {
      if (queryId) {
        client.kill(queryId).catch((err: unknown) => {
          console.error("Error killing live query:", err);
        });
      }
    };
  }, [isAuthDone, client]);

  // تابع ارسال پیام
  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    try {
      await client.create("messages", {
        sender: senderName,
        content: inputValue,
        created_at: new Date().toISOString(),
      });
      setInputValue("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (isConnecting) return <p>Connecting to SurrealDB...</p>;
  if (isError) return <p>Connection failed: {String(error)}</p>;

  return (
    <div className="chat-container">
      <h2>Simple SurrealDB Chat (Live)</h2>

      <div className="sender-section">
        <label>Sender Name: </label>
        <input
          type="text"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
        />
      </div>

      <div className="chat-box">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong className="sender">{msg.sender || "Unknown"}:</strong> {msg.content}
            <br />
            <small className="timestamp">{msg.created_at}</small>
            <hr />
          </div>
        ))}
        {messages.length === 0 && <p>No messages yet!</p>}
      </div>

      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          placeholder="Type message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      {/* استایل خام در همین فایل */}
      <style jsx>{`
        .chat-container {
          width: 60%;
          max-width: 800px;
          margin: 40px auto;
          font-family: sans-serif;
        }
        .chat-container h2 {
          text-align: center;
          margin-bottom: 24px;
          color: #333;
        }
        .sender-section {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          align-items: center;
        }
        .chat-box {
          border: 1px solid #ccc;
          height: 500px;
          background: #f9f9f9;
          overflow-y: auto;
          margin-bottom: 20px;
          padding: 16px;
        }
        .message {
          margin-bottom: 12px;
        }
        .sender {
          color: #2f77f4;
        }
        .timestamp {
          color: #999;
          font-size: 0.8rem;
        }
        .chat-form {
          display: flex;
          gap: 10px;
        }
        .chat-form input[type="text"] {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .chat-form button {
          padding: 10px 16px;
          cursor: pointer;
          border: none;
          background-color: #2f77f4;
          color: #fff;
          font-weight: bold;
          border-radius: 4px;
        }
        .chat-form button:hover {
          background-color: #1f5cbd;
        }
      `}</style>
    </div>
  );
}

// --- خروجی اصلی صفحه + QueryClientProvider ---
const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <SurrealProvider endpoint={DB_URL} autoConnect>
        <Chat />
      </SurrealProvider>
    </QueryClientProvider>
  );
}
