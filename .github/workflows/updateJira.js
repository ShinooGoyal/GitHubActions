const fetch = require('node-fetch');

async function updateJira(prs) {
  const jiraHost = process.env.JIRA_HOST;
  const jiraEmail = process.env.JIRA_EMAIL;
  const jiraApiToken = process.env.JIRA_API_TOKEN;
  const jiraTicketId = "YOUR_JIRA_TICKET_ID"; // replace with your Jira ticket ID

  const prsList = JSON.parse(prs).map(pr => `- [${pr.title}](${pr.url})`).join('\n');
  const jiraComment = {
    body: `List of PRs merged:\n${prsList}`
  };

  const response = await fetch(`https://${jiraHost}/rest/api/2/issue/${jiraTicketId}/comment`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jiraComment)
  });

  if (!response.ok) {
    throw new Error(`Failed to update Jira ticket: ${response.statusText}`);
  }

  console.log('Jira ticket updated successfully');
}

const prs = process.argv[2];
updateJira(prs).catch(error => {
  console.error(error);
  process.exit(1);
});
