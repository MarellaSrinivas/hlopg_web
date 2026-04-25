import { Client } from "@stomp/stompjs";

let stompClient = null;
let isConnected = false;

export const connectSocket = (onMessageReceived, ownerId) => {
  // 🚫 Prevent multiple connections
  if (stompClient && isConnected) {
    console.log("⚠️ Socket already connected");
    return stompClient;
  }

  stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws",
    reconnectDelay: 5000,
    debug: (str) => {
      console.log(str);
    },
  });

  stompClient.onConnect = () => {
    console.log("✅ WebSocket Connected as Owner:", ownerId);
    isConnected = true;

    stompClient.subscribe(`/topic/owner/${ownerId}`, (message) => {
      console.log("📩 Message received:", message.body);
      const notification = JSON.parse(message.body);
      onMessageReceived(notification);
    });
  };

  stompClient.onStompError = (frame) => {
    console.error("❌ Broker error:", frame);
  };

  stompClient.onWebSocketClose = () => {
    console.log("🔌 WebSocket Disconnected");
    isConnected = false;
  };

  stompClient.activate();

  return stompClient; // 🔥 VERY IMPORTANT
};

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
    console.log("🔴 Socket manually disconnected");
  }
};

export const sendBookingSocket = (data) => {
  if (stompClient && isConnected) {
    stompClient.publish({
      destination: "/app/booking",
      body: JSON.stringify(data),
    });
  }
};
