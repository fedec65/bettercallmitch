"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAssistantChat } from "@/app/hooks/useAssistantChat";
import { InitialView } from "@/app/components/assistant/InitialView";
import { ChatView } from "@/app/components/assistant/ChatView";
import type { MikeMessage } from "@/app/components/shared/types";

export default function AssistantPage() {
    const router = useRouter();
    const { messages, isResponseLoading, handleChat, handleNewChat, cancel } =
        useAssistantChat();
    const [selectedCanton, setSelectedCanton] = useState<string | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

    async function handleInitialSubmit(message: MikeMessage) {
        const chatId = await handleNewChat(message, undefined, selectedCanton, selectedAgent);
        if (chatId) router.push(`/assistant/chat/${chatId}`);
    }

    if (messages.length === 0) {
        return (
            <InitialView
                onSubmit={(message) => void handleInitialSubmit(message)}
                canton={selectedCanton}
                onCantonChange={setSelectedCanton}
                agentId={selectedAgent}
                onAgentChange={setSelectedAgent}
            />
        );
    }

    return (
        <ChatView
            messages={messages}
            isResponseLoading={isResponseLoading}
            handleChat={handleChat}
            cancel={cancel}
        />
    );
}
