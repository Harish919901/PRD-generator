const getConfig = () => ({
  provider: process.env.AI_PROVIDER || 'openai',
  openaiKey: process.env.OPENAI_API_KEY,
  claudeKey: process.env.CLAUDE_API_KEY
});

const callOpenAI = async (prompt, systemPrompt = '', maxTokens = 2000) => {
  const { openaiKey } = getConfig();
  if (!openaiKey || openaiKey === 'your_openai_api_key_here') throw new Error('OpenAI API key not configured');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt || 'You are a helpful product management assistant specializing in creating PRDs and product documentation.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: maxTokens
    })
  });
  if (!response.ok) { const error = await response.json(); throw new Error(error.error?.message || 'OpenAI API error'); }
  const data = await response.json();
  return data.choices[0].message.content;
};

const callClaude = async (prompt, systemPrompt = '', maxTokens = 2000) => {
  const { claudeKey } = getConfig();
  if (!claudeKey || claudeKey === 'your_claude_api_key_here') throw new Error('Claude API key not configured');
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': claudeKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: maxTokens,
      system: systemPrompt || 'You are a helpful product management assistant specializing in creating PRDs and product documentation.',
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!response.ok) { const error = await response.json(); throw new Error(error.error?.message || 'Claude API error'); }
  const data = await response.json();
  return data.content[0].text;
};

const callAI = async (prompt, systemPrompt = '', maxTokens = 2000) => {
  const { provider } = getConfig();
  return provider === 'claude' ? callClaude(prompt, systemPrompt, maxTokens) : callOpenAI(prompt, systemPrompt, maxTokens);
};

module.exports = { callOpenAI, callClaude, callAI, getConfig };
