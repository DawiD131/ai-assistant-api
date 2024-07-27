export class ToolsApi {
  private readonly todoWebhook: string;

  constructor({ todoWebhook }: { todoWebhook: string }) {
    this.todoWebhook = todoWebhook;
  }

  async saveTodo({ name, tasks }: { name: string; tasks: string[] }) {
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

    await fetch(this.todoWebhook, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
