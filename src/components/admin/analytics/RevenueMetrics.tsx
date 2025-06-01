// Add this test button near the top of the component
const testMrr = async () => {
  const { data, error } = await supabase.rpc('get_current_mrr');
  if (error) console.error('MRR Test Error:', error);
  else alert(`Test MRR Result: $${data}`);
};

// Add this button in the UI section
<button 
  onClick={testMrr}
  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
>
  Test MRR
</button>
