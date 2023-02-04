import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';
import { HighlightStyle } from '@codemirror/language';
import { basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useCallback, useEffect, useRef, useState } from 'react';
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands';
import { drawSelection, keymap, lineNumbers } from '@codemirror/view';
import { Transaction, Annotation } from '@codemirror/state';
import { syntaxHighlighting } from '@codemirror/language';
import { Extension } from 'typescript';
import '@styles/argonaut.css';

let syncAnnotation = Annotation.define<boolean>();

function syncDispatch(tr: Transaction, view: EditorView, other: EditorView) {
  view.update([tr]);
  if (!tr.changes.empty && !tr.annotation(syncAnnotation)) {
    let annotations: Annotation<any>[] = [syncAnnotation.of(true)];
    let userEvent = tr.annotation(Transaction.userEvent);
    if (userEvent) annotations.push(Transaction.userEvent.of(userEvent));
    other.dispatch({ changes: tr.changes, annotations });
  }
}
export function useCodeMirror(extensions: any | {}) {
  const [element, setElement] = useState<HTMLElement>();

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const view = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, javascript(), ...extensions],
      }),

      parent: element,
    });

    return () => view?.destroy();
  }, [element]);

  return { ref };
}
type CodeMirrorProps = {
  extensions: Extension[];
  className: string | undefined;
};

export const CodeMirror = ({ extensions, className }: CodeMirrorProps) => {
  const { ref } = useCodeMirror(extensions);

  return <div className={className || ''} ref={ref} />;
};

export default function LiveShellPage(): React.ReactElement {
  const [element, setElement] = useState<HTMLElement>();

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const view = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, javascript()],
      }),
      parent: element,
    });
    return () => view.destroy();
  }, [element]);

  return (
    <div className='flex flex-col w-full items-center'>
        <CodeMirror className='text-light-200 min-w-[80rem]' extensions={[]} />
    </div>
  );
}
