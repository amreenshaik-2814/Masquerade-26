// Simulated & API Chat Logic
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const newMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      riskScore: null,
      highlights: []
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Send request to your Render FastAPI backend
      const response = await fetch('https://masquerade-26.onrender.com/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: userText }),
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const data = await response.json();

      if (data.threatLevel) {
        setThreatLevel(data.threatLevel);
      }

      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.reply || "Analysis complete.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        riskScore: data.riskScore ?? null,
        highlights: data.highlights ?? []
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('API Error:', error);

      // Fallback message when backend is sleeping or unreachable
      const errorMsg: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "🚨 Unable to reach the security core. Please verify your connection or check backend server status.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        riskScore: null,
        highlights: []
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };
