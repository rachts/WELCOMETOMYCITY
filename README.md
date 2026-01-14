# WELCOMETOMYCITY

A comprehensive civic-tech web platform for city mobility and tourism across major Indian metro cities. Built with Next.js 15, React 19, and Tailwind CSS.

## Features

### Transport Planner
- Compare routes across Metro, Bus, Taxi, and Walking
- Real-time cost and duration estimates
- Interchange information for metro routes
- Comprehensive WBTC bus route database (80+ routes for Kolkata)

### City Explorer
- Browse categorized tourist spots (Heritage, Religious, Nature, Culture, Food, Shopping)
- Search and filter functionality
- Detailed place information with nearby metro stations
- Direct Google Maps integration

### Trip Planner
- Generate optimized 1-3 day itineraries
- Route optimization for efficient travel
- Travel time estimates between destinations
- Nearby transport options for each stop

### Multi-City Support
12 major Indian metros with city-specific data:
- Delhi, Mumbai, Kolkata, Chennai
- Bangalore, Hyderabad, Ahmedabad, Pune
- Jaipur, Lucknow, Kochi, Nagpur

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS v4, shadcn/ui
- **Icons**: Lucide React
- **State**: React Context API
- **Theming**: Dark/Light mode support

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/rachts/welcometomycity.git
cd welcometomycity

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── about/          # About page
│   ├── explore/        # City Explorer page
│   ├── plan/           # Trip Planner page
│   ├── transport/      # Transport Planner
│   │   └── bus/        # Bus route finder
│   ├── globals.css     # Global styles & theme
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/
│   ├── explore/        # Explorer components
│   ├── plan/           # Planner components
│   ├── transport/      # Transport components
│   ├── ui/             # shadcn/ui components
│   ├── city-switcher.tsx
│   ├── footer.tsx
│   ├── navbar.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── data/           # City, station, place, bus data
│   ├── bus-utils.ts    # Bus route matching logic
│   ├── city-context.tsx # City state management
│   ├── itinerary-generator.ts
│   ├── route-calculator.ts
│   └── types.ts
└── public/             # Static assets
```

## Roadmap

- [ ] Real-time metro/bus tracking integration
- [ ] User accounts and saved itineraries
- [ ] Offline mode with PWA support
- [ ] Multi-language support (Hindi, Bengali, Tamil, etc.)
- [ ] Community reviews and ratings
- [ ] Complete data for all 12 cities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Disclaimer

This is a community project for educational purposes. Transport schedules, fares, and timings are approximate and may not reflect real-time data. Always verify with official sources before planning your travel.

---

Built with care for the cities of India
