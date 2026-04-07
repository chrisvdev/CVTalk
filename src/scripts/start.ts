import { client } from "mtmi";
import type { ChatView } from "@/components/chat-view";
import { noChannelMessage } from "@/lib/mock_messages";

const chatView = document.querySelector("chat-view") as ChatView;
const channel = window.OBSChat.properties?.channel;
if (channel) {
  client.connect({ channels: [channel] });
  client.on("message", (message) => {
    chatView.newMessage(message);
  });
} else {
  chatView.newMessage(noChannelMessage);
}