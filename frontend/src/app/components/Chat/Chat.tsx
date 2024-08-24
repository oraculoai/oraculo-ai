import Bubble from '@/src/app/components/Bubble/Bubble';
import React, { useEffect, useState } from 'react';
import { scrollToBottom } from '@/src/app/helpers/scroll.helper';
import useApiSendMessage from '@/src/app/api/hooks/useApiSendMessage';
import { MessageDomain } from '@/src/app/_model/message.domain';
import useApiSendDocumentQa from '@/src/app/api/hooks/useApiSendDocumentQa';
import { DocumentQaDto } from '@/src/app/_model/document-qa.dto';
import { MessageDto } from '@/src/app/_model/message.dto';
import { ChatMessage } from '@/src/app/components/Chat/Chat.props';
import { initialMessages } from '@/src/app/components/Chat/Chat.data';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const [userMessage, setUserMessage] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');

  const formRef = React.useRef<HTMLFormElement>(null);
  const chatRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom(chatRef.current);
  }, [messages]);

  function pushMessage(newMessage: ChatMessage) {
    const messagesWithoutTemporary = messages.filter(
      (message) => message.id !== 'temporary-id',
    );

    setMessages([...messagesWithoutTemporary, newMessage]);
  }

  const apiSendMessage = useApiSendMessage({
    onSuccess: (data: MessageDomain) => {
      pushMessage({
        id: data.id,
        from: data.from,
        text: data.text,
        status: 'sent',
      });
    },
  });

  const apiSendDocumentQa = useApiSendDocumentQa({
    onSuccess: (data: MessageDomain) => {
      pushMessage({
        id: data.id,
        from: data.from,
        text: data.text,
        status: 'sent',
      });
    },
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = userMessage.trim();
    if (!message) {
      return;
    }

    const tempMessage: ChatMessage = {
      from: 'user',
      text: message,
      status: 'sending',
    };

    const agentMessage: ChatMessage = {
      id: 'temporary-id',
      from: 'agent',
      text: '*Waiting...*',
      status: 'sending',
    };

    setMessages([...messages, tempMessage, agentMessage]);

    if (filePath) {
      const documentQaDto: DocumentQaDto = { question: message, filePath };
      apiSendDocumentQa.mutate(documentQaDto);
    } else {
      const messageDto: MessageDto = { text: message };
      apiSendMessage.mutate(messageDto);
    }

    setUserMessage('');
  }

  return (
    <div className="flex flex-col justify-between w-full border">
      {/* Message History */}
      <div className="space-y-4 overflow-auto p-4" ref={chatRef}>
        {messages.map((message, index) => (
          <Bubble key={index} from={message.from}>
            {message.text}
          </Bubble>
        ))}
      </div>

      {/* User Input Form */}
      <form
        onSubmit={onSubmit}
        ref={formRef}
        className="flex items-center space-x-2 p-4 border-t-2 border-gray-300"
      >
        <div className="flex w-full flex-col gap-2">
          <input
            id="filePath"
            name="filePath"
            type="string"
            className="border rounded-lg p-2 w-full"
            value={filePath}
            onChange={(event) => setFilePath(event.currentTarget.value)}
            placeholder="Insert file path (e.g: /path/to/file.pdf)"
          />

          <textarea
            id="userMessage"
            name="userMessage"
            placeholder="Message*"
            className="border rounded-lg p-2 w-full h-32 max-h-96"
            value={userMessage}
            onChange={(event) => setUserMessage(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                formRef.current?.requestSubmit();
                return;
              }
            }}
          />
        </div>

        <button
          type="submit"
          className="bg-gray-200 rounded-lg px-8 py-2 h-full"
        >
          Send
        </button>
      </form>
    </div>
  );
}
