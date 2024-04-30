import { Chat } from '@/components/chat'

export const runtime = 'edge'

// Header component for displaying the name and description
const Header = () => {
  return (
    // <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
    //   <h1 style={{ fontSize: '70px', margin: '10px 0', fontFamily: 'var(--font-sans)' }}>doubt.ai✍🏻</h1>
    //   <p style={{ fontSize: '30px', textAlign: 'center', maxWidth: '600px', fontFamily: 'var(--font-sans)' }}>
    //     Clear your JEE/NEET doubts. Instantly😳. 
    //   </p>
    // </div>

    // <div className="responsiveHeader">
    //   <h1 className="responsiveH1">doubt.ai✍🏻</h1>
    //   <p className="responsiveP">
    //     Clear your JEE/NEET doubts. Instantly😳. 
    //   </p>
    // </div>
    <div className="responsiveHeader">
     <h1 style={{ fontSize: '70px', margin: '10px 0', fontFamily: 'var(--font-sans)' }}>✍🏻</h1>
     </div>

  );
};

export default function Page() {
  //return <Chat />
  return (
    <div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
      <Header />
      <Chat />
    </div>
    
    </div>
  );
}
