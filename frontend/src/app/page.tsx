'use client';

import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import Bubble from '@/src/app/components/Bubble/Bubble';
import { scrollToBottom } from '@/src/app/helpers/scroll.helper';
import { MessageDomain } from '@/src/app/_model/message.domain';
import { MessageDto } from '@/src/app/_model/message.dto';
import { DocumentQaDto } from '@/src/app/_model/document-qa.dto';

/////// Message
interface Message {
  id?: string;
  from: 'agent' | 'user';
  text: string;
  status: 'sending' | 'sent';
}

///////

/////// Messages

const initialMessages: Message[] = [
  /*{
    id: '1',
    from: 'agent',
    text: 'Olá! Boas vindas à Salvatore Academy! 😊 Eu sou o bot da escola e estou aqui para te ajudar com sua jornada. Vamos começar sua inscrição?',
    status: 'sent',
  },
  {
    id: '2',
    from: 'user',
    text: 'Sim, quero me inscrever.',
    status: 'sent',
  },
  {
    id: '3',
    from: 'agent',
    text: 'Ótimo! Para começar, qual é o seu nome completo?',
    status: 'sent',
  },
  {
    id: '4',
    from: 'user',
    text: 'Meu nome é João Silva.',
    status: 'sent',
  },
  {
    id: '5',
    from: 'agent',
    text: 'Prazer em te conhecer, João! Qual é o seu e-mail para podermos manter contato?',
    status: 'sent',
  },
  {
    id: '6',
    from: 'user',
    text: 'email@email.com',
    status: 'sent',
  },
  {
    id: '7',
    from: 'agent',
    text: 'Perfeito! Agora, me fala um pouco sobre o seu nível de conhecimento em desenvolvimento web. Você se considera iniciante, intermediário ou avançado?',
    status: 'sent',
  },
  {
    id: '8',
    from: 'user',
    text: 'Sou iniciante.',
    status: 'sent',
  },
  {
    id: '9',
    from: 'agent',
    text: 'Excelente, João! 😊 Vou te guiar pela trilha de aprendizado de iniciantes. Você prefere começar aprendendo Backend ou Frontend?',
    status: 'sent',
  },
  {
    id: '10',
    from: 'user',
    text: 'Quero começar com Frontend.',
    status: 'sent',
  },
  {
    id: '11',
    from: 'agent',
    text: 'Ótima escolha! 🚀 Sua primeira missão será "Fundamentos de JavaScript". Vamos começar devagar para garantir que você entenda tudo. Vou te enviar mais detalhes por e-mail, e você terá 7 dias para completar essa missão.',
    status: 'sent',
  },
  {
    id: '12',
    from: 'user',
    text: 'Beleza!',
    status: 'sent',
  },
  {
    id: '13',
    from: 'agent',
    text: 'Perfeito, João! Vou te lembrar sobre o prazo e você pode sempre voltar aqui se tiver dúvidas. Agora vou te mandar um e-mail com todas as instruções. Boa sorte e mãos à obra! 💻',
    status: 'sent',
  },
  {
    id: '14',
    from: 'user',
    text: 'Obrigado!',
    status: 'sent',
  },
  {
    id: '15',
    from: 'agent',
    text: 'Disponha! Estarei por aqui se precisar de mais alguma coisa. Até logo!',
    status: 'sent',
  },*/
];

export default function IndexPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const [userMessage, setUserMessage] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');

  const formRef = React.useRef<HTMLFormElement>(null);
  const chatRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom(chatRef.current);
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: (messageDto: MessageDto) => {
      return axios.post<MessageDomain>(
        'http://localhost:3333/ai/message',
        messageDto,
      );
    },
    onSuccess: (response: AxiosResponse<MessageDomain>) => {
      const data = response.data;

      const newMessage: Message = {
        id: data.id,
        from: data.from,
        text: data.text,
        status: 'sent',
      };

      const messagesWithoutTemporary = messages.filter(
        (message) => message.id !== 'temporary-id',
      );

      setMessages([...messagesWithoutTemporary, newMessage]);
    },
  });

  const sendDocumentQaMutation = useMutation({
    mutationFn: (documentQaDto: DocumentQaDto) => {
      return axios.post<MessageDomain>(
        'http://localhost:3333/ai/document-qa',
        documentQaDto,
      );
    },
    onSuccess: (response: AxiosResponse<MessageDomain>) => {
      const data = response.data;

      const newMessage: Message = {
        id: data.id,
        from: data.from,
        text: data.text,
        status: 'sent',
      };

      const messagesWithoutTemporary = messages.filter(
        (message) => message.id !== 'temporary-id',
      );

      setMessages([...messagesWithoutTemporary, newMessage]);
    },
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = userMessage.trim();
    if (!message) {
      return;
    }

    const tempMessage: Message = {
      from: 'user',
      text: message,
      status: 'sending',
    };

    const agentMessage: Message = {
      id: 'temporary-id',
      from: 'agent',
      text: '*Waiting...*',
      status: 'sending',
    };

    setMessages([...messages, tempMessage, agentMessage]);

    if (filePath) {
      const documentQaDto: DocumentQaDto = { question: message, filePath };
      sendDocumentQaMutation.mutate(documentQaDto);
    } else {
      const messageDto: MessageDto = { text: message };
      sendMessageMutation.mutate(messageDto);
    }

    setUserMessage('');
  }

  return (
    <>
      <div className="flex justify-center h-screen fixed p-4 w-full">
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
      </div>
    </>
  );
}
