import { useEffect, useRef, useState, CSSProperties } from "react";

import Emoji from "react-emoji-render";

import Union from "../assets/union.svg";
import Chatgpt from "../assets/chatgpt.svg";
import User from "../assets/user.png";

const TestMessages = [
  {
    value: "Hello! How can I assist you today?",
    name: false,
  },
];

interface MessageProps {
  value: string;
  name: boolean;
  style?: CSSProperties;
  isMobile?: boolean;
}

const Message = ({ value, name, style, isMobile }: MessageProps) => {
  const background = name ? "linear-gradient(0deg, #1D1C3F, #1D1C3F)" : "";
  const boxShadow = name
    ? "inset 0px 4.15399px 7.26947px rgba(0, 0, 0, 0.15)"
    : "";
  return (
    <div
      style={{
        background,
        boxShadow,
      }}
      className={`flex rounded-xl px-4 py-3 ${
        !isMobile ? "overflow-hidden" : ""
      }`}
    >
      <div
        className={`flex flex-grow justify-between ${
          name ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {name ? (
          <img className="h-[20px] w-[20px]" src={User} alt="" />
        ) : (
          <img className="h-[15px] w-[15px]" src={Chatgpt} alt="" />
        )}
        <Emoji
          className={`w-[90%] text-sm font-medium text-mute ${
            name ? "text-white" : "text-mute"
          }`}
        >
          {value}
        </Emoji>
      </div>
    </div>
  );
};

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface ChatProps {
  className?: string;
  isMobile?: boolean;
  cycleChatOpen?: boolean;
}

const apikey = "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";

export default function Chat({
  className,
  isMobile,
  cycleChatOpen,
}: ChatProps) {
  const [messages, setMessages] = useState<any[]>(TestMessages);
  const [myMessage, setMyMessage] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const prevMessagesLength = usePrevious(messages.length);

  function handleTextChange(text: string) {
    setMyMessage(text);
  }

  async function handleSend() {
    const userMessage = {
      value: myMessage,
      name: true,
    };
    setMessages((prevArray) => [...prevArray, userMessage]);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apikey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are the AI Chatbot that answers questions based on multiple documents provided and functions as a customer service AI representative.",
          },
          {
            role: "user",
            content: "What is the formula of acetic acid?",
          },
          {
            role: "assistant",
            content: "The formula of acetic acid is CH3COOH",
          },
          { role: "user", content: myMessage },
        ],
        temperature: 0.5,
        max_tokens: 2000,
      }),
    });

    const responseData = await response.json();
    const botMessage = {
      value: responseData.choices[0].message.content,
      name: false,
    };
    setMessages((prevArray) => [...prevArray, botMessage]);

    setMyMessage("");
  }

  useEffect(() => {
    if (
      bottomRef &&
      bottomRef.current &&
      scrollRef &&
      scrollRef.current &&
      (!prevMessagesLength || prevMessagesLength < messages.length)
    ) {
      // console.log("scrolling into view...", bottomRef.current.offsetTop);
      // Disable this as this is causing the whole window to scroll to the bottom on every message
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "start",
      });
    }
  }, [messages, bottomRef, scrollRef]);

  return (
    <div
      ref={scrollRef}
      className="relative flex max-h-full w-full flex-col overflow-y-scroll 
        scroll-smooth bg-[#cecece] transition scrollbar-hide lg:rounded-3xl
        xl:max-w-[288px] xl:shadow-lg"
    >
      <div
        style={{
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
        }}
        className="sticky left-0 top-0 z-10 flex min-h-[88px] w-full flex-row items-center justify-start
				border-b-2 border-[#414141] bg-[#838388] bg-opacity-70 px-6 backdrop-blur-md xl:min-h-[96px] xl:flex-col xl:items-start xl:justify-center "
      >
        <div className="flex items-center">
          <div className="grid h-6 w-6 place-content-center">
            <img className="mb-auto h-[21px] w-[21px]" src={Chatgpt} alt="" />
          </div>

          <span className="mb-0 ml-3 text-[16px] font-extrabold xl:mb-auto xl:text-sm">
            Chat GPT
          </span>
        </div>
        {isMobile && (
          <button
            onClick={handleSend}
            className="absolute right-4 ml-auto grid h-11
                		w-11 place-content-center rounded-xl border-2 border-[#49487C] xl:hidden"
          >
            <>hello</>
          </button>
        )}
      </div>
      <div className={`mt-auto px-2 py-2`}>
        <div className="flex flex-col gap-2">
          {messages.map((m: any, i: number) => {
            return (
              <Message
                {...m}
                key={m.value + m.publicKey + i}
                // style={(() => {
                //   if (i % 2 === 0) {
                //     return {
                //       background: "linear-gradient(0deg, #1D1C3F, #1D1C3F)",
                //       boxShadow:
                //         "inset 0px 4.15399px 7.26947px rgba(0, 0, 0, 0.15)",
                //     };
                //   }
                //   return {};
                // })()}
                isMobile={isMobile}
              />
            );
          })}
        </div>
      </div>
      <div
        className="sticky bottom-0 left-0 min-h-[60px] border-t-2
				border-[#414141] bg-[#cecece]"
      >
        <div className="flex h-[58px] w-full items-center bg-[#000000] bg-opacity-50 px-5">
          <input
            className="ring-none h-full appearance-none border-none	bg-transparent font-semibold text-light placeholder-[#bebebe] outline-none"
            type="text"
            placeholder="Ask a question..."
            value={myMessage}
            onChange={(e) => {
              handleTextChange(e.target.value);
            }}
            onKeyDown={async (event) => {
              if (event.key === "Enter") {
                try {
                  handleSend();
                } catch {}
              }
            }}
          />
          <button
            className="ml-auto"
            onClick={() => {
              try {
                handleSend();
              } catch {}
            }}
          >
            <img className="h-5 w-5" src={Union} alt="" />
          </button>
        </div>
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
}
