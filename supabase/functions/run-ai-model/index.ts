import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { modelId, inputs, apiKeyId } = await req.json()
  
  // Get API key from database
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: apiKey, error: keyError } = await supabase
    .from('api_keys')
    .select('api_key, provider')
    .eq('id', apiKeyId)
    .single()

  if (keyError || !apiKey) {
    return new Response(JSON.stringify({ error: 'Invalid API key' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Get model details
  const { data: model, error: modelError } = await supabase
    .from('ai_models')
    .select('*')
    .eq('id', modelId)
    .single()

  if (modelError || !model) {
    return new Response(JSON.stringify({ error: 'Model not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Call appropriate LLM API based on provider
  try {
    let result
    switch (apiKey.provider) {
      case 'openai':
        result = await callOpenAI(apiKey.api_key, model, inputs)
        break
      case 'anthropic':
        result = await callAnthropic(apiKey.api_key, model, inputs)
        break
      default:
        throw new Error('Unsupported provider')
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

async function callOpenAI(apiKey: string, model: any, inputs: any) {
  const prompt = buildPrompt(model.prompt_template, inputs)
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  })

  const data = await response.json()
  return parseAIResponse(data.choices[0].message.content)
}

async function callAnthropic(apiKey: string, model: any, inputs: any) {
  const prompt = buildPrompt(model.prompt_template, inputs)
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await response.json()
  return parseAIResponse(data.content[0].text)
}

function buildPrompt(template: string, inputs: any) {
  return Object.entries(inputs).reduce(
    (prompt, [key, value]) => prompt.replace(`{${key}}`, String(value)),
    template
  )
}

function parseAIResponse(response: string) {
  // Extract structured data from AI response
  const confidenceMatch = response.match(/Confidence: (\d+)%/)
  const tagsMatch = response.match(/Tags: ([\w\s,]+)/)
  const summaryMatch = response.match(/Summary: (.+)/)

  return {
    analysis: response,
    confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 50,
    tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [],
    summary: summaryMatch ? summaryMatch[1] : 'No summary provided'
  }
}
