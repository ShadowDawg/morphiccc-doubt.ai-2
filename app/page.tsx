import { Chat } from '@/components/chat'

export const runtime = 'edge'

// Header component for displaying the name and description
const Header = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
      <h1 style={{ fontSize: '24px', margin: '10px 0' }}>Doubt.ai✍🏻</h1>
      <p style={{ fontSize: '16px', textAlign: 'center', maxWidth: '600px' }}>
        Welcome to Doubt.ai, where all your queries are answered instantly with the help of AI!
      </p>
    </div>
  );
};

export default function Page() {
  return <Chat />
  // return (
  //   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
  //     <Header />
  //     <Chat />
  //   </div>
  // );
}
