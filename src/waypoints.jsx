import handleLogout from './App.jsx';
import setExploreRoutes from './App.jsx';

const PATHLESS_BASE_URL = import.meta.env.VITE_PATHLESS_BASE_URL;
const RUNTIME_MODE = import.meta.env.VITE_RUNTIME_MODE;

const routes = [
  {
    route_name: "Hungary",
    waypoints: [
      {
        name: "Parliament Building",
        latitude: 47.4979,
        longitude: 19.0402,
        rating: 4.8,
        notes: "Famous for its architectural grandeur, this site is a must-see.",
        description: "One of Hungary's most iconic landmarks."
      },
      {
        name: "Gellért Hill",
        latitude: 47.5316,
        longitude: 19.0522,
        rating: 4.5,
        notes: "Great spot for panoramic views of the city.",
        description: "Offering scenic views of Budapest."
      },
      {
        name: "Margaret Island",
        latitude: 47.5147,
        longitude: 19.0666,
        rating: 4.7,
        notes: "A peaceful spot amidst the hustle of the city.",
        description: "Perfect for nature lovers and joggers."
      },
      {
        name: "Jewish Quarter",
        latitude: 47.4935,
        longitude: 19.0701,
        rating: 4.6,
        notes: "Best known for its nightlife and dining options.",
        description: "Budapest's vibrant Jewish Quarter."
      },
      {
        name: "City Park",
        latitude: 47.4829,
        longitude: 19.0567,
        rating: 4.3,
        notes: "A quiet, less touristy place to relax.",
        description: "Offering green spaces and the famous Széchenyi Baths."
      },
      {
        name: "Római Part",
        latitude: 47.4687,
        longitude: 19.0483,
        rating: 4.2,
        notes: "Local favorite for outdoor activities.",
        description: "A riverside area known for cycling and relaxing."
      }
    ]
  },
  {
    route_name: "Italy",
    waypoints: [
      {
        name: "Duomo di Milano",
        latitude: 45.4642,
        longitude: 9.1900,
        rating: 4.9,
        notes: "Located at the heart of Milan, an architectural wonder.",
        description: "The symbol of Milan's cultural heritage."
      },
      {
        name: "Navigli District",
        latitude: 45.4786,
        longitude: 9.2375,
        rating: 4.5,
        notes: "Popular among locals for its historic ambiance.",
        description: "Known for its canals and vibrant nightlife."
      },
      {
        name: "Sempione Park",
        latitude: 45.4580,
        longitude: 9.1807,
        rating: 4.7,
        notes: "Ideal spot for a quiet stroll or a coffee.",
        description: "A large park near the historic city center."
      },
      {
        name: "Pinacoteca di Brera",
        latitude: 45.4706,
        longitude: 9.2052,
        rating: 4.6,
        notes: "Perfect for art lovers.",
        description: "A famous gallery showcasing Italian art."
      },
      {
        name: "Piazza Gae Aulenti",
        latitude: 45.4809,
        longitude: 9.2101,
        rating: 4.4,
        notes: "Great spot for people-watching and enjoying the evening.",
        description: "Known for its modern architecture."
      },
      {
        name: "Galleria Vittorio Emanuele II",
        latitude: 45.4754,
        longitude: 9.1907,
        rating: 4.3,
        notes: "Famous for its upscale shopping and designer boutiques.",
        description: "Milan's historic shopping gallery."
      }
    ]
  },
  {
    route_name: "Switzerland",
    waypoints: [
      {
        name: "Federal Palace",
        latitude: 46.9481,
        longitude: 7.4474,
        rating: 4.8,
        notes: "A majestic structure steeped in history.",
        description: "Seat of the Swiss government."
      },
      {
        name: "Rosengarten",
        latitude: 46.9550,
        longitude: 7.4669,
        rating: 4.5,
        notes: "A peaceful place, great for reflection.",
        description: "Offering spectacular views over Bern."
      },
      {
        name: "Gurten",
        latitude: 46.9365,
        longitude: 7.4235,
        rating: 4.7,
        notes: "A favorite among hikers and nature lovers.",
        description: "A hill offering panoramic views and hiking trails."
      },
      {
        name: "Zentrum Paul Klee",
        latitude: 46.9516,
        longitude: 7.4404,
        rating: 4.6,
        notes: "Great spot for art enthusiasts.",
        description: "Showcasing the works of Swiss artist Paul Klee."
      },
      {
        name: "Aare River Walk",
        latitude: 46.9459,
        longitude: 7.4551,
        rating: 4.3,
        notes: "Ideal for a quiet walk along the river.",
        description: "A scenic route along Bern's river."
      },
      {
        name: "Tierpark Dählhölzli",
        latitude: 46.9396,
        longitude: 7.4323,
        rating: 4.4,
        notes: "Popular spot for families and children.",
        description: "Bern’s zoo with a variety of animals."
      }
    ]
  },
  {
    route_name: "France",
    waypoints: [
      {
        name: "Eiffel Tower",
        latitude: 48.8566,
        longitude: 2.3522,
        rating: 4.9,
        notes: "An iconic location with unmatched views of Paris.",
        description: "The most famous monument in Paris."
      },
      {
        name: "Arc de Triomphe",
        latitude: 48.8738,
        longitude: 2.2950,
        rating: 4.8,
        notes: "A place rich with history and beauty.",
        description: "A symbol of France’s military glory."
      },
      {
        name: "Champ de Mars",
        latitude: 48.8584,
        longitude: 2.2945,
        rating: 4.6,
        notes: "The best place for an afternoon picnic with great views.",
        description: "The park beneath the Eiffel Tower."
      },
      {
        name: "Louvre Museum",
        latitude: 48.8614,
        longitude: 2.3371,
        rating: 4.7,
        notes: "Perfect for art lovers and history buffs alike.",
        description: "Home to the world-famous Mona Lisa."
      },
      {
        name: "Seine River Walk",
        latitude: 48.8500,
        longitude: 2.3066,
        rating: 4.5,
        notes: "Known for its peaceful and picturesque surroundings.",
        description: "A popular route for tourists."
      },
      {
        name: "Notre-Dame Cathedral",
        latitude: 48.8432,
        longitude: 2.3464,
        rating: 4.6,
        notes: "Great place for lovers of French architecture.",
        description: "A masterpiece of French Gothic architecture."
      }
    ]
  },
  {
    route_name: "Thailand",
    waypoints: [
      {
        name: "Grand Palace",
        latitude: 13.7563,
        longitude: 100.5018,
        rating: 4.8,
        notes: "An iconic location full of cultural significance.",
        description: "The former residence of Thai royalty."
      },
      {
        name: "Wat Pho",
        latitude: 13.7560,
        longitude: 100.5101,
        rating: 4.6,
        notes: "Known for its enormous reclining Buddha statue.",
        description: "One of Bangkok’s oldest and largest temples."
      },
      {
        name: "Lumphini Park",
        latitude: 13.7529,
        longitude: 100.4942,
        rating: 4.5,
        notes: "A peaceful spot with a beautiful garden.",
        description: "A green oasis in the heart of Bangkok."
      },
      {
        name: "Siam Square",
        latitude: 13.7542,
        longitude: 100.5156,
        rating: 4.3,
        notes: "A popular destination for locals and tourists alike.",
        description: "The center of Bangkok’s shopping district."
      },
      {
        name: "Chao Phraya River",
        latitude: 13.7506,
        longitude: 100.5039,
        rating: 4.4,
        notes: "Ideal for an afternoon of relaxation.",
        description: "Offering riverboat tours and scenic views."
      },
      {
        name: "Khaosan Road",
        latitude: 13.7489,
        longitude: 100.4983,
        rating: 4.7,
        notes: "Famous for its night market and local street food.",
        description: "Bangkok’s backpacker hub with vibrant nightlife."
      }
    ]
  },
  {
    route_name: "Bolivia",
    waypoints: [
      {
        name: "Valley of the Moon",
        latitude: -16.5000,
        longitude: -68.1500,
        rating: 4.9,
        notes: "Stunning panoramic views of La Paz and the surrounding mountains.",
        description: "A unique and otherworldly landscape close to La Paz."
      },
      {
        name: "Salar de Uyuni",
        latitude: -20.1338,
        longitude: -67.4891,
        rating: 5.0,
        notes: "The world’s largest salt flat, offering breathtaking landscapes and reflections.",
        description: "One of the most iconic natural wonders in Bolivia."
      },
      {
        name: "Tiwanaku",
        latitude: -17.9626,
        longitude: -67.1108,
        rating: 4.7,
        notes: "An impressive archaeological site of the ancient Tiwanaku civilization.",
        description: "The ruins of an ancient city and UNESCO World Heritage Site."
      },
      {
        name: "Madidi National Park",
        latitude: -13.1628,
        longitude: -64.5175,
        rating: 4.8,
        notes: "A stunning tropical park with diverse wildlife and ecosystems.",
        description: "One of the most biologically diverse areas in the world."
      },
      {
        name: "Noel Kempff Mercado National Park",
        latitude: -16.2902,
        longitude: -62.6752,
        rating: 4.6,
        notes: "A vast protected area, home to unique flora and fauna in Bolivia.",
        description: "Another UNESCO World Heritage Site."
      },
      {
        name: "Sucre",
        latitude: -19.5833,
        longitude: -65.7500,
        rating: 4.9,
        notes: "A charming colonial city known for its rich history and beautiful architecture.",
        description: "The constitutional capital of Bolivia and a UNESCO World Heritage Site."
      }
    ]
  }
];

// Helper function to calculate the center of a group of waypoints
export const calculateCenter = (waypoints) => {
  const sumCoords = waypoints.reduce(
    (sum, wp) => {
      return {
        latitude: sum.latitude + wp.latitude,
        longitude: sum.longitude + wp.longitude,
      };
    },
    { latitude: 0, longitude: 0 }
  );
  const numWaypoints = waypoints.length;
  return {
    latitude: sumCoords.latitude / numWaypoints,
    longitude: sumCoords.longitude / numWaypoints,
  };
};

const fetchRoutesFromApi = async () => {
  try {
    const tags = []; // Add relevant tags if needed
    const query = `?tags=${encodeURIComponent(JSON.stringify(tags))}`;
    const response = await fetch(`${PATHLESS_BASE_URL}maps/get_filtered_maps_with_waypoints${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.status === 401) {
      // Token is invalid or expired
      handleLogout();
      alert("Your session has expired. Please log in again.");
    } else if (!response.ok) {
      throw new Error("Failed to fetch routes from API");
    }
    const data = await response.json();
    return data; // List of maps, each with corresponding list of waypoints
  } catch (error) {
    console.error('Error fetching routes from API:', error);
    return [];
  }
};

// Exported function that decides whether to return mock data or call the API
export const getRoutes = async () => {
  console.log("Runtime mode:", RUNTIME_MODE); // Debug line
  if (RUNTIME_MODE === 'test') {
    return routes; // Return mock data
  } else if (RUNTIME_MODE === 'live') {
    return await fetchRoutesFromApi(); // Call the API and return live data
  }
};
