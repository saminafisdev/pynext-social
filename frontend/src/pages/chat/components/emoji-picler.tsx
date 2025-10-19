/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { EmojiPicker } from "frimousse";
import type { RefObject, Dispatch, SetStateAction } from "react";

const frimousseStyles = css`
  [frimousse-root] {
    display: flex;
    flex-direction: column;
    width: fit-content;
    height: 352px;
    background: light-dark(#fff, #171717);
    isolation: isolate;
  }

  [frimousse-search] {
    position: relative;
    z-index: 10;
    appearance: none;
    margin-block-start: 8px;
    margin-inline: 8px;
    padding: 8px 10px;
    background: light-dark(#f5f5f5, #262626);
    border-radius: 6px;
    font-size: 14px;
  }

  [frimousse-viewport] {
    position: relative;
    flex: 1;
    outline: none;
  }

  [frimousse-loading] [frimousse-empty] {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: light-dark(#a1a1a1, #737373);
    font-size: 14px;
  }

  [frimousse-list] {
    padding-block-end: 12px;
    user-select: none;
  }

  [frimousse-category-header] {
    padding: 12px 12px 6px;
    background: light-dark(#fff, #171717);
    color: light-dark(#525252, #a1a1a1);
    font-size: 12px;
    font-weight: 500;
  }

  [frimousse-row] {
    padding-inline: 12px;
    scroll-margin-block: 12px;
  }

  [frimousse-emoji] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: transparent;
    font-size: 18px;

    &[data-active] {
      background: light-dark(#f5f5f5, #262626);
    }
  }
`;
interface EmojiPickerProps {
  inputMessage: string;
  setMessageInput: Dispatch<SetStateAction<string>>;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}

export function EmojiPickerComponent({
  inputMessage,
  setMessageInput,
  inputRef,
}: EmojiPickerProps) {
  const handleEmojiSelect = (emoji: string) => {
    if (!inputRef.current) {
      // fallback: just append
      setMessageInput((prev) => prev + emoji);
      return;
    }

    const input = inputRef.current;
    const cursorPos = input.selectionStart ?? inputMessage.length;

    // Insert emoji at the cursor position
    const before = inputMessage.slice(0, cursorPos);
    const after = inputMessage.slice(cursorPos);

    const newText = before + emoji + after;

    setMessageInput(newText);

    // after updating state, set caret right after the emoji
    // using setTimeout so that the DOM update has happened
    setTimeout(() => {
      const newCursor = cursorPos + emoji.length;
      input.setSelectionRange(newCursor, newCursor);
    }, 0);
  };
  return (
    <div css={frimousseStyles}>
      <EmojiPicker.Root
        onEmojiSelect={(emoji) => handleEmojiSelect(emoji.emoji)}
      >
        <EmojiPicker.Search />
        <EmojiPicker.Viewport>
          <EmojiPicker.Loading>Loading…</EmojiPicker.Loading>
          <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
          <EmojiPicker.List />
        </EmojiPicker.Viewport>
      </EmojiPicker.Root>
    </div>
  );
}
