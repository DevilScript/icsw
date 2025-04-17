import { useAuthMethods } from '../context/auth';

export const DiscordLoginButton = () => {
  const { signInWithDiscord } = useAuthMethods();

  const handleLogin = () => {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent('https://icsw.lovable.app')}&response_type=code&scope=identify`;
    const popup = window.open(authUrl, 'discordAuth', 'width=600,height=600');

    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopup);
        signInWithDiscord().catch(err => {
          console.error('Login error:', err);
          alert('Failed to login with Discord');
        });
      }
    }, 500);
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Connect with Discord
    </button>
  );
};
