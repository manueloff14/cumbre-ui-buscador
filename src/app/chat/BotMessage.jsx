// components/Chat/BotMessage.jsx

"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

const BotMessage = React.memo(({ message }) => {
    return (
        <div className="prose dark:prose-invert p-4 w-full max-w-none border-[1px] border-gray-900 text-black dark:text-gray-200 text-left rounded-3xl"> 
            <ReactMarkdown>{message}</ReactMarkdown>
        </div>
    );
});

export default BotMessage;
