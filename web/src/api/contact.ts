export async function submitContact(payload: ContactPayload): Promise<void> {
  // Use the key directly here. It is safe to expose Web3Forms keys in frontend code.
  const WEB3FORMS_KEY = "3db5af4b-997d-4057-af2d-11c4a65a2696";

  const res = await fetch('https://api.web3forms.com/submit', {
    method:  'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      ...payload,
      subject: `New Portfolio Inquiry from ${payload.name}`,
    }),
  })

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Something went wrong');
  }
}
