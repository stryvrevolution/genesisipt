'use client';

export default function OmniCheckoutButton() {
  const handleClick = async () => {
    const res = await fetch('/api/stripe/omni', { method: 'POST' });
    const data = await res.json();

    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center w-full py-4 rounded-xl bg-[#DAFA72] hover:bg-white text-[#1A1A1A] text-[13px] transition-all duration-200 shadow-[0_0_15px_-5px_rgba(218,250,114,0.4)]"
    >
      Demander l’admission au protocole OMNI
    </button>
  );
}
