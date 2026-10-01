import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Confetti from 'react-confetti';

// Insert your Supabase project credentials here
const SUPABASE_URL = 'https://poyhqdheluohxzzxrvqd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBveWhxZGhlbHVvaHh6enhydnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MTg3ODAsImV4cCI6MjEwNjM5NDc4MH0.uMJDRGvk9FN-pF7RGtKqsLvhX4zWZCzkR9CQJZ315qI';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SPOTS = {
  benin: [
    { name: 'Kada Cinema & Entertainment Hub', type: 'Cinema & Arcade' },
    { name: 'Bamboo House', type: 'Fine Dining' },
    { name: 'Indigo Lounge & Bistro', type: 'Lounge' },
    { name: 'Club Hexagon / Joker Lounge', type: 'Nightclub & Drinks' },
    { name: 'Mat Ice', type: 'Ice Cream & Pastries' },
    { name: 'Rhapsody\'s Benin', type: 'Restaurant & Lounge' },
    { name: 'The Limit Pub & Restaurant', type: 'Casual Dining' },
    { name: 'Meida Restaurant', type: 'Continental Dining' },
    { name: 'Ogba Zoo & Nature Park', type: 'Nature & Walk' },
    { name: 'Hexagon Networks', type: 'Gaming & Lounge' },
    { name: 'Woodhouse Cafe', type: 'Coffee & Brunch' },
    { name: 'Filmhouse Cinemas Benin', type: 'Movie Date' },
    { name: 'Sanik Hotel Poolside', type: 'Pool & Relaxation' },
    { name: 'Royal Grill', type: 'Grill & Chops' },
    { name: 'Domino\'s & Cold Stone GRA', type: 'Pizza & Ice Cream' },
    { name: 'Sizzlers Fast Food', type: 'Casual Bites' },
    { name: 'The Lighthouse', type: 'Fine Dining' },
    { name: 'Kiko Hotel Rooftop', type: 'Rooftop Drinks' },
    { name: 'Voda Lounge', type: 'Nightlife & Music' },
    { name: 'National Museum Benin City', type: 'Art & Culture Date' },
  ],
  lagosIsland: [
    { name: 'Landmark Beach / Moist Beach Club', type: 'Beach Day' },
    { name: 'Lekki Conservation Centre', type: 'Nature & Canopy Walk' },
    { name: 'Kaly Restaurant & Rooftop Lounge', type: 'Rooftop Dinner' },
    { name: 'The House Victoria Island', type: 'Cozy Dining & Drinks' },
    { name: 'Rufus & Bee, Twinwaters', type: 'Arcade & Bowling' },
    { name: 'Nike Art Gallery', type: 'Art & Culture' },
    { name: 'Danfo Bistro', type: 'Casual & Artsy Dining' },
    { name: 'The Tea Room', type: 'Aesthetic Brunch' },
    { name: 'Hard Rock Cafe', type: 'Live Music & Food' },
    { name: 'Upbeat Recreation Centre', type: 'Trampoline Park & Fun' },
    { name: 'RSVP Lagos', type: 'Upscale Dining' },
    { name: 'Tarkwa Bay Beach', type: 'Boat Ride & Surf Date' },
    { name: 'Eko Atlantic City Walk', type: 'Evening Stroll' },
    { name: 'Woks & Koi', type: 'Asian Cuisine' }
  ],
  lagosMainland: [
    { name: 'Maryland Mall / Funhouse', type: 'Games & Arcade' },
    { name: 'Ndubuisi Kanu Park', type: 'Outdoor Picnic' },
    { name: 'The Orchid Bistro, Ikeja', type: 'Dinner & Cocktails' },
    { name: 'Yellow Chilli, Ikeja', type: 'Local & Continental' },
    { name: 'Filmhouse Cinema, Surulere', type: 'Cinema Date' },
    { name: 'Kalakuta Museum', type: 'History & Culture' },
    { name: 'Jevinik Restaurant', type: 'Hearty Local Meal' },
    { name: 'Shodex Gardens', type: 'Nature & Park' },
    { name: 'The Place, Ikeja GRA', type: 'Casual Dining & Lounge' },
    { name: 'Pool Terrace Bar, Sheraton', type: 'Poolside Drinks' },
    { name: 'Rhapsody\'s Ikeja City Mall', type: 'Lounge & Dining' },
    { name: 'JJT Park, Alausa', type: 'Peaceful Outdoor Vibe' },
    { name: 'La Mango Restaurant', type: 'Dinner & Drinks' },
    { name: 'Truffles Restaurant GRA', type: 'Cozy Dining' },
    { name: 'Kuti\'s Bistro', type: 'Live Music & Food' }
  ],
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');
  const [step, setStep] = useState('proposal'); // proposal | details | success
  const [noStyle, setNoStyle] = useState({ position: 'relative' });

  // Form states
  const [selectedDate, setSelectedDate] = useState('');
  const [city, setCity] = useState(''); // 'benin' | 'lagos'
  const [lagosArea, setLagosArea] = useState(''); // 'Island' | 'Mainland'
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin responses state
  const [responses, setResponses] = useState([]);

  // Window dimensions for Confetti
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleHash = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('resize', () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    });
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('resize', () => {});
    };
  }, []);

  // Fetch responses for Admin view
  useEffect(() => {
    if (isAdmin && supabase) {
      supabase
        .from('date_responses')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data }) => setResponses(data || []));
    }
  }, [isAdmin]);

  const moveNoButton = (e) => {
    if (e.cancelable) e.preventDefault();
    const x = Math.random() * (window.innerWidth - 120);
    const y = Math.random() * (window.innerHeight - 60);
    setNoStyle({
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      transition: '0.2s ease-out',
    });
  };

  const togglePlace = (placeName) => {
    setSelectedPlaces((prev) =>
      prev.includes(placeName) ? prev.filter((p) => p !== placeName) : [...prev, placeName]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      date: selectedDate,
      city: city === 'lagos' ? `Lagos (${lagosArea})` : 'Benin City',
      area: city === 'lagos' ? lagosArea : 'Benin',
      places: selectedPlaces,
      note: '', // Satisfies DB schema without user input
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      await supabase.from('date_responses').insert([payload]);
    }

    setIsSubmitting(false);
    setStep('success');
  };

  // --- ADMIN VIEW ---
  if (isAdmin) {
    return (
      <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Admin Inbox (Emily's Responses)</h2>
          <a href="#" style={{ fontSize: '13px', color: '#ff4d6d' }}>Back to Invite</a>
        </div>
        {responses.length === 0 ? (
          <p style={{ color: '#888' }}>No responses logged yet.</p>
        ) : (
          responses.map((res, idx) => (
            <div key={idx} style={{ background: '#fff', border: '1px solid #ffd1dc', borderRadius: '12px', padding: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ fontWeight: 'bold', color: '#d6336c', fontSize: '18px' }}>Date: {res.date}</div>
              <p><strong>City / Area:</strong> {res.city}</p>
              <p><strong>Chosen Spots:</strong></p>
              <ul>
                {res.places && res.places.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
              <span style={{ fontSize: '11px', color: '#aaa' }}>Received: {new Date(res.created_at).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    );
  }

  // --- PROPOSAL SCREEN ---
  if (step === 'proposal') {
    return (
      <div style={{ textAlign: 'center', marginTop: '8vh', padding: '20px', fontFamily: 'sans-serif' }}>
        <img
          src="/us.jpg"
          alt="Us"
          style={{ width: '220px', height: '220px', objectFit: 'cover', borderRadius: '50%', marginBottom: '20px', boxShadow: '0 6px 16px rgba(0,0,0,0.15)' }}
        />
        <h1 style={{ color: '#333' }}>Will you go on a date with me, Emily? 🌸</h1>
        <div style={{ marginTop: '30px' }}>
          <button
            onClick={() => setStep('details')}
            style={{ padding: '12px 28px', marginRight: '15px', fontSize: '18px', backgroundColor: '#ff4d6d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            YES 💖
          </button>
          <button
            style={{ ...noStyle, padding: '12px 28px', fontSize: '18px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
            onTouchStart={moveNoButton}
            onMouseEnter={moveNoButton}
          >
            NO 👎
          </button>
        </div>
      </div>
    );
  }

  // --- SUCCESS SCREEN (WITH AESTHETIC EFFECTS) ---
  if (step === 'success') {
    return (
      <div style={{ 
        textAlign: 'center', 
        minHeight: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px', 
        fontFamily: 'sans-serif',
        background: 'linear-gradient(135deg, #fff0f3 0%, #ffc2d1 100%)',
        overflow: 'hidden',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0
      }}>
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} gravity={0.15} />
        
        <style>{`
          @keyframes heartbeat {
            0% { transform: scale(1); box-shadow: 0 0 20px rgba(214, 51, 108, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(214, 51, 108, 0.8); }
            100% { transform: scale(1); box-shadow: 0 0 20px rgba(214, 51, 108, 0.4); }
          }
          @keyframes floatUp {
            0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-20vh) scale(1.5); opacity: 0; }
          }
          .floating-heart {
            position: absolute;
            color: rgba(255, 77, 109, 0.6);
            font-size: 2rem;
            animation: floatUp 4s ease-in infinite;
            z-index: 0;
          }
        `}</style>

        {/* Background Floating Hearts */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="floating-heart" style={{
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 3}s`,
            fontSize: `${Math.random() * 2 + 1}rem`
          }}>
            ❤️
          </div>
        ))}

        <div style={{ position: 'relative', zIndex: 10 }}>
          <img
            src="/us.jpg"
            alt="Us"
            style={{ 
              width: '200px', 
              height: '200px', 
              objectFit: 'cover', 
              borderRadius: '50%', 
              marginBottom: '20px', 
              animation: 'heartbeat 1.5s infinite ease-in-out',
              border: '4px solid #fff'
            }}
          />
          <h2 style={{ color: '#d6336c', fontSize: '2.5rem', margin: '10px 0', textShadow: '2px 2px 8px rgba(0,0,0,0.1)' }}>
            It's Official! ❤️
          </h2>
          <p style={{ fontSize: '18px', color: '#444', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6', fontWeight: 'bold' }}>
            I've got your choices locked in. I'm counting down the days until we make this happen!
          </p>
        </div>
      </div>
    );
  }

  // --- DATE & PLACE CUSTOMIZER ---
  return (
    <div style={{ maxWidth: '450px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#d6336c' }}>Let's plan our special day ✨</h2>

      {/* 1. Date Selection (November 2026 onwards) */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>1. Pick a date:</label>
        <input
          type="date"
          min="2026-11-01"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' }}
        />
      </div>

      {/* 2. City Selection */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>2. Where should we do this?</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['benin', 'lagos'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setCity(c); setLagosArea(''); setSelectedPlaces([]); }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: city === c ? '2px solid #ff4d6d' : '1px solid #ccc',
                backgroundColor: city === c ? '#fff0f3' : '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            >
              {c === 'benin' ? 'Benin City 🏛️' : 'Lagos 🌊'}
            </button>
          ))}
        </div>
      </div>

      {/* Lagos Area Sub-Selection */}
      {city === 'lagos' && (
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Which part of Lagos?</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['Island', 'Mainland'].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => { setLagosArea(a); setSelectedPlaces([]); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: lagosArea === a ? '2px solid #ff4d6d' : '1px solid #ccc',
                  backgroundColor: lagosArea === a ? '#fff0f3' : '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Spots & Vibes Selection */}
      {((city === 'benin') || (city === 'lagos' && lagosArea)) && (
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>3. What vibe sounds fun?</label>
          <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
            {((city === 'benin' ? SPOTS.benin : lagosArea === 'Island' ? SPOTS.lagosIsland : SPOTS.lagosMainland)).map((spot) => {
              const isSelected = selectedPlaces.includes(spot.name);
              return (
                <div
                  key={spot.name}
                  onClick={() => togglePlace(spot.name)}
                  style={{
                    padding: '12px',
                    marginBottom: '8px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #ff4d6d' : '1px solid #eee',
                    backgroundColor: isSelected ? '#fff0f3' : '#fafafa',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <strong>{spot.name}</strong>
                    <div style={{ fontSize: '13px', color: '#666' }}>{spot.type}</div>
                  </div>
                  <span>{isSelected ? '💖' : '🤍'}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedDate || !city || (city === 'lagos' && !lagosArea) || isSubmitting}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '17px',
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: (!selectedDate || !city || (city === 'lagos' && !lagosArea)) ? '#ccc' : '#ff4d6d',
          border: 'none',
          borderRadius: '8px',
          cursor: (!selectedDate || !city || (city === 'lagos' && !lagosArea)) ? 'not-allowed' : 'pointer',
          boxShadow: (!selectedDate || !city || (city === 'lagos' && !lagosArea)) ? 'none' : '0 4px 12px rgba(255,77,109,0.3)'
        }}
      >
        {isSubmitting ? 'Saving...' : 'Lock In Our Date 💌'}
      </button>
    </div>
  );
}