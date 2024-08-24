'use client';

import React, { useEffect, useState } from 'react';

interface BubbleProps {
  children: React.ReactNode;
  from: 'agent' | 'user';
}

function Bubble({ children, from }: BubbleProps) {
  const styles: Record<BubbleProps['from'], string> = {
    agent: 'bg-gray-100',
    user: 'bg-white ml-auto',
  };

  return (
    <div className={`border rounded-lg p-4 w-3/5 ${styles[from]}`}>
      {children}
    </div>
  );
}

interface Message {
  from: 'agent' | 'user';
  text: string;
}

function scrollToBottom(target: HTMLDivElement | null) {
  target?.scrollTo({
    top: target?.scrollHeight,
    behavior: 'smooth',
  });
}

export default function IndexPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'agent',
      text: 'Olá! Boas vindas à Salvatore Academy! 😊 Eu sou o bot da escola e estou aqui para te ajudar com sua jornada. Vamos começar sua inscrição?',
    },
    {
      from: 'user',
      text: 'Sim, quero me inscrever.',
    },
    {
      from: 'agent',
      text: 'Ótimo! Para começar, qual é o seu nome completo?',
    },
    {
      from: 'user',
      text: 'Meu nome é João Silva.',
    },
    {
      from: 'agent',
      text: 'Prazer em te conhecer, João! Qual é o seu e-mail para podermos manter contato?',
    },
    {
      from: 'user',
      text: 'email@email.com',
    },
    {
      from: 'agent',
      text: 'Perfeito! Agora, me fala um pouco sobre o seu nível de conhecimento em desenvolvimento web. Você se considera iniciante, intermediário ou avançado?',
    },
    {
      from: 'user',
      text: 'Sou iniciante.',
    },
    {
      from: 'agent',
      text: 'Excelente, João! 😊 Vou te guiar pela trilha de aprendizado de iniciantes. Você prefere começar aprendendo Backend ou Frontend?',
    },
    {
      from: 'user',
      text: 'Quero começar com Frontend.',
    },
    {
      from: 'agent',
      text: 'Ótima escolha! 🚀 Sua primeira missão será "Fundamentos de JavaScript". Vamos começar devagar para garantir que você entenda tudo. Vou te enviar mais detalhes por e-mail, e você terá 7 dias para completar essa missão.',
    },
    {
      from: 'user',
      text: 'Beleza!',
    },
    {
      from: 'agent',
      text: 'Perfeito, João! Vou te lembrar sobre o prazo e você pode sempre voltar aqui se tiver dúvidas. Agora vou te mandar um e-mail com todas as instruções. Boa sorte e mãos à obra! 💻',
    },
    {
      from: 'user',
      text: 'Obrigado!',
    },
    {
      from: 'agent',
      text: 'Disponha! Estarei por aqui se precisar de mais alguma coisa. Até logo!',
    },
  ]);

  const [userMessage, setUserMessage] = useState('');

  const formRef = React.useRef<HTMLFormElement>(null);
  const chatRef = React.useRef<HTMLDivElement>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = userMessage.trim();

    setUserMessage('');

    if (!message) {
      return;
    }

    setMessages([...messages, { from: 'user', text: message }]);
  }

  useEffect(() => {
    scrollToBottom(chatRef.current);
  }, [messages]);

  return (
    <>
      <div className="flex justify-center h-screen fixed p-4">
        <div className="flex flex-col justify-between w-full border">
          {/* Bolhas de texto */}
          <div className="space-y-4 overflow-auto p-4" ref={chatRef}>
            {messages.map((message, index) => (
              <Bubble key={index} from={message.from}>
                {message.text}
              </Bubble>
            ))}
          </div>

          {/* Caixa de input de texto */}
          <form
            onSubmit={onSubmit}
            ref={formRef}
            className="flex items-center space-x-2 p-4 border-t-2 border-gray-300"
          >
            <textarea
              id="userMessage"
              name="userMessage"
              placeholder="Digite sua mensagem"
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

            <button
              type="submit"
              className="bg-gray-300 rounded-lg px-8 py-2 h-full"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
