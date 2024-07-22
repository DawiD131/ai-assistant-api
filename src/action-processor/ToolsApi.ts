export class ToolsApi {
  static async saveTodo({ name, tasks }: { name: string; tasks: string[] }) {
    const payload = {
      pageTitle: name,
      children: tasks.map((it) => ({
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: it,
                link: null,
              },
            },
          ],
          checked: false,
          color: 'default',
        },
      })),
    };

    await fetch('https://hook.eu2.make.com/whftzjfn37mh5qph7afbxdaj3xkhdup9', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
