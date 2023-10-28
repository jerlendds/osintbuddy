import { Facet, ViewPlugin, hoverTooltip } from "@uiw/react-codemirror";
import { LanguageServerBaseOptions, LanguageServerClient, LanguageServerClientOptions, LanguageServerPlugin, offsetToPos } from "./language";
import { autocompletion } from '@codemirror/autocomplete';
import {
  CompletionTriggerKind,
} from 'vscode-languageserver-protocol';
import {
  WebSocketTransport,
} from '@open-rpc/client-js';

interface LanguageServerOptions extends LanguageServerClientOptions {
  client?: LanguageServerClient;
  allowHTMLContent?: boolean;
}

const useLast = (values: readonly any[]) => values.reduce((_, v) => v, '');

const client = Facet.define<LanguageServerClient, LanguageServerClient>({ combine: useLast });
const documentUri = Facet.define<string, string>({ combine: useLast });
const languageId = Facet.define<string, string>({ combine: useLast });

export function languageServerWithTransport(options: LanguageServerOptions) {
  let plugin: LanguageServerPlugin | null = null;

  return [
    client.of(options.client || new LanguageServerClient({ ...options, autoClose: true })),
    documentUri.of(options.documentUri),
    languageId.of(options.languageId),
    ViewPlugin.define((view) => (plugin = new LanguageServerPlugin(view, options.allowHTMLContent as boolean))),
    hoverTooltip(
      (view, pos) =>
        plugin?.requestHoverTooltip(
          view,
          offsetToPos(view.state.doc, pos)
        ) ?? null
    ),
    autocompletion({
      override: [
        async (context) => {
          if (plugin == null) return null;

          const { state, pos, explicit } = context;
          const line = state.doc.lineAt(pos);
          let trigKind: CompletionTriggerKind =
            CompletionTriggerKind.Invoked;
          let trigChar: string | undefined;
          if (
            !explicit &&
            plugin.client.capabilities?.completionProvider?.triggerCharacters?.includes(
              line.text[pos - line.from - 1]
            )
          ) {
            trigKind = CompletionTriggerKind.TriggerCharacter;
            trigChar = line.text[pos - line.from - 1];
          }
          if (
            trigKind === CompletionTriggerKind.Invoked &&
            !context.matchBefore(/\w+$/)
          ) {
            return null;
          }
          return await plugin.requestCompletion(
            context,
            offsetToPos(state.doc, pos),
            {
              triggerKind: trigKind,
              triggerCharacter: trigChar,
            }
          );
        },
      ],
    }),
  ];
}


export interface LanguageServerWebsocketOptions extends LanguageServerBaseOptions {
  serverUri?: `ws://${string}` | `wss://${string}`;
}


export function languageServer(options: LanguageServerWebsocketOptions) {
  const serverUri = options.serverUri;
  delete options.serverUri;
  return languageServerWithTransport({
    ...options,
    transport: new WebSocketTransport(serverUri as string)
  })
}