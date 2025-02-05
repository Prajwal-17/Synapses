"use client"

export default function Test() {

  const connectGmail = () => {
    window.location.href = '/api/auth/gmail';
  };

  return (<>
    <div className="text-4xl">
      Test Page
    </div>
    <div>
      <button onClick={connectGmail}>Connect</button>
    </div>
  </>)
}