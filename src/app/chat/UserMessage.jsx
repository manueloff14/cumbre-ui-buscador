// components/Chat/UserMessage.jsx

"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

const UserMessage = React.memo(({ message }) => {
    return (
        <div className="text-xl text-black dark:text-white text-right py-4 my-2 w-max max-w-[80%] prose dark:prose-invert">
            <ReactMarkdown>{message}</ReactMarkdown>
        </div>
    );
});

export default UserMessage;
